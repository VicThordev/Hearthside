import crypto from 'node:crypto';
import path from 'node:path';
import compression from 'compression';
import express, { type RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import type { User } from '@supabase/supabase-js';
import { config } from './config.js';
import { ApiError, errorHandler, notFound } from './http.js';
import { authenticate, requireCapability, requireUser } from './auth.js';
import { circleSchema, documentIdSchema, eventSchema, noteSchema } from './schemas.js';
import { supabase } from './supabase.js';
import { logger } from './logger.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', config.TRUST_PROXY_HOPS);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      // The browser talks to Supabase directly for sign-in; helmet's default would block it.
      connectSrc: ["'self'", new URL(config.SUPABASE_URL).origin],
      imgSrc: ["'self'", 'data:', 'blob:'],
    },
  },
}));
app.use(compression());

// Liveness reports only that the process is serving; it does not touch the database.
// It sits above the logger and rate limits because the platform polls it every few seconds.
app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', service: 'hearthside-api' });
});

app.use(((req, res, next) => {
  const requestId = crypto.randomUUID();
  res.setHeader('X-Request-Id', requestId);
  const startedAt = Date.now();
  res.locals.requestId = requestId;
  res.on('finish', () => logger.info('request_completed', { requestId, method: req.method, path: req.path, status: res.statusCode, durationMs: Date.now() - startedAt }));
  next();
}) satisfies RequestHandler);

// In production this process also serves the built front end, so the browser and API share an origin.
// Static files sit above the rate limits: one page load fetches dozens of them.
if (config.NODE_ENV === 'production') {
  const clientDir = path.resolve('dist');
  // Vite content-hashes everything in /assets, so those files can be cached forever.
  app.use('/assets', express.static(path.join(clientDir, 'assets'), { immutable: true, maxAge: '1y' }), notFound);
  app.use(express.static(clientDir, { index: false, maxAge: '1h' }));
  // Auth emails redirect back to the app, so any non-API page must return the shell. It must never be
  // cached, or browsers keep asking for hashed bundles that the next deploy removed.
  app.get(/^\/(?!api\/|readyz$)/, (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(clientDir, 'index.html'));
  });
}

app.use(cors({ origin: config.APP_URL, methods: ['GET', 'POST', 'PATCH', 'DELETE'], allowedHeaders: ['Authorization', 'Content-Type', 'X-Care-Circle-Id'] }));
app.use(express.json({ limit: '1mb' }));
// Per-IP ceiling for all API traffic, including unauthenticated requests. It is generous
// because households and clinics often share an address; the per-user limit below is tighter.
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 1000, standardHeaders: 'draft-8', legacyHeaders: false }));

app.get('/readyz', async (_req, res, next) => {
  try {
    // A real GET, not head: supabase-js reports a 404 HEAD as success, which hides missing tables.
    // This column comes from the newest migration, so an out-of-date schema also fails readiness.
    const { error } = await supabase.from('care_events').select('created_by_member_id').limit(1);
    if (error) throw new ApiError(503, 'Database is unavailable or migrations have not been applied.');
    res.json({ status: 'ready' });
  } catch (error) { next(error instanceof ApiError ? error : new ApiError(503, 'Database is unavailable.')); }
});

app.use('/api/v1', authenticate, rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (_req, res) => `user:${(res.locals.user as User).id}`,
}));

app.get('/api/v1/circles', async (_req, res, next) => {
  try {
    const user = requireUser(res);
    const { data, error } = await supabase.from('circle_members')
      .select('id, role, care_circles (id, name, timezone)')
      .eq('user_id', user.id)
      .order('created_at');
    if (error) throw error;
    res.json({ data });
  } catch (error) { next(error); }
});

app.post('/api/v1/circles', async (req, res, next) => {
  try {
    const user = requireUser(res);
    const input = circleSchema.parse(req.body);
    const displayName = typeof user.user_metadata.full_name === 'string' ? user.user_metadata.full_name : user.email ?? 'Circle owner';
    const { data: circle, error } = await supabase.rpc('create_care_circle', {
      p_name: input.name, p_timezone: input.timezone, p_recipient_name: input.recipientName,
      p_owner_id: user.id, p_owner_email: user.email ?? '', p_owner_display_name: displayName,
    });
    if (error || !circle) throw error ?? new ApiError(500, 'Care Circle creation did not return an identifier.');
    res.status(201).json({ data: circle });
  } catch (error) { next(error); }
});

app.get('/api/v1/events', async (req, res, next) => {
  try {
    const { circleId } = await requireCapability(req, res, 'event:read');
    const { data, error } = await supabase.from('care_events').select('*').eq('circle_id', circleId).order('starts_at');
    if (error) throw error;
    res.json({ data });
  } catch (error) { next(error); }
});

// Create audit entries are written by the audit_row_change trigger from created_by_member_id.
app.post('/api/v1/events', async (req, res, next) => {
  try {
    const { circleId, memberId } = await requireCapability(req, res, 'event:write');
    const input = eventSchema.parse(req.body);
    const { data, error } = await supabase.from('care_events').insert({
      circle_id: circleId,
      created_by_member_id: memberId,
      title: input.title,
      starts_at: input.startsAt,
      ends_at: input.endsAt ?? null,
      category: input.category,
      assignee_name: input.assigneeName ?? null,
      location: input.location ?? null,
      description: input.description ?? null,
    }).select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (error) { next(error); }
});

app.get('/api/v1/notes', async (req, res, next) => {
  try {
    const { circleId } = await requireCapability(req, res, 'note:read');
    const { data, error } = await supabase.from('care_notes').select('*').eq('circle_id', circleId).order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ data });
  } catch (error) { next(error); }
});

app.post('/api/v1/notes', async (req, res, next) => {
  try {
    const { circleId, memberId } = await requireCapability(req, res, 'note:write');
    const input = noteSchema.parse(req.body);
    const { data, error } = await supabase.from('care_notes').insert({
      circle_id: circleId,
      created_by_member_id: memberId,
      title: input.title,
      content: input.content,
      category: input.category,
      is_critical: input.isCritical,
    }).select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (error) { next(error); }
});

app.get('/api/v1/documents', async (req, res, next) => {
  try {
    const { circleId } = await requireCapability(req, res, 'document:read');
    const { data, error } = await supabase.from('documents').select('id, title, filename, content_type, size_bytes, category, created_at, updated_at').eq('circle_id', circleId).order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ data });
  } catch (error) { next(error); }
});

app.get('/api/v1/documents/:id/download-url', async (req, res, next) => {
  try {
    const { circleId, memberId } = await requireCapability(req, res, 'document:read');
    const documentId = documentIdSchema.safeParse(req.params.id);
    if (!documentId.success) throw new ApiError(404, 'Document not found.');
    const { data: document, error } = await supabase.from('documents').select('storage_path').eq('circle_id', circleId).eq('id', documentId.data).maybeSingle();
    if (error) throw error;
    if (!document) throw new ApiError(404, 'Document not found.');
    const { data, error: signingError } = await supabase.storage.from(config.SUPABASE_DOCUMENTS_BUCKET).createSignedUrl(document.storage_path, 60);
    if (signingError) throw signingError;
    // Fail closed: a download link is never returned without its audit entry.
    const { error: auditError } = await supabase.from('audit_events').insert({ circle_id: circleId, actor_member_id: memberId, action: 'download_url_issued', resource_type: 'document', resource_id: documentId.data });
    if (auditError) throw auditError;
    res.json({ data: { url: data.signedUrl, expiresInSeconds: 60 } });
  } catch (error) { next(error); }
});

app.use(notFound);
app.use(errorHandler);

const server = app.listen(config.PORT, () => logger.info('server_started', { port: config.PORT, environment: config.NODE_ENV }));
server.requestTimeout = 15_000;
server.headersTimeout = 20_000;

function shutdown(signal: string) {
  logger.info('server_stopping', { signal });
  server.close(() => process.exit(0));
  // Force exit if open connections do not drain in time.
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
