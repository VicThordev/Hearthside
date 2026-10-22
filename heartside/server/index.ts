import crypto from 'node:crypto';
import express, { type RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { config } from './config.js';
import { ApiError, errorHandler, notFound } from './http.js';
import { requireCapability, requireUser } from './auth.js';
import { supabase } from './supabase.js';
import { logger } from './logger.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: config.APP_URL, methods: ['GET', 'POST', 'PATCH', 'DELETE'], allowedHeaders: ['Authorization', 'Content-Type', 'X-Care-Circle-Id'] }));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }));

app.use(((req, res, next) => {
  const requestId = crypto.randomUUID();
  res.setHeader('X-Request-Id', requestId);
  const startedAt = Date.now();
  res.locals.requestId = requestId;
  res.on('finish', () => logger.info('request_completed', { requestId, method: req.method, path: req.path, status: res.statusCode, durationMs: Date.now() - startedAt }));
  next();
}) satisfies RequestHandler);

app.get('/healthz', async (_req, res, next) => {
  const { error } = await supabase.from('care_circles').select('id', { head: true, count: 'exact' }).limit(1);
  if (error) return next(new ApiError(503, 'Database is unavailable.'));
  res.json({ status: 'ok', service: 'hearthside-api' });
});

app.get('/readyz', async (_req, res, next) => {
  const { error } = await supabase.from('care_circles').select('id', { head: true, count: 'exact' }).limit(1);
  if (error) return next(new ApiError(503, 'Database is unavailable.'));
  res.json({ status: 'ready' });
});

const circleSchema = z.object({
  name: z.string().trim().min(1).max(160),
  recipientName: z.string().trim().min(1).max(160),
  timezone: z.string().trim().min(1).max(64).default('America/Los_Angeles'),
});

app.get('/api/v1/circles', async (req, res, next) => {
  try {
    const user = await requireUser(req);
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
    const user = await requireUser(req);
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

const eventSchema = z.object({
  title: z.string().trim().min(1).max(200),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  category: z.enum(['medical', 'vitals', 'transport', 'errands', 'social']),
  assigneeName: z.string().trim().min(1).max(120).optional(),
  location: z.string().trim().max(500).optional(),
  description: z.string().trim().max(5000).optional(),
});

app.get('/api/v1/events', async (req, res, next) => {
  try {
    const { circleId } = await requireCapability(req, 'event:read');
    const { data, error } = await supabase.from('care_events').select('*').eq('circle_id', circleId).order('starts_at');
    if (error) throw error;
    res.json({ data });
  } catch (error) { next(error); }
});

app.post('/api/v1/events', async (req, res, next) => {
  try {
    const { circleId, memberId } = await requireCapability(req, 'event:write');
    const input = eventSchema.parse(req.body);
    const { data, error } = await supabase.from('care_events').insert({
      circle_id: circleId,
      title: input.title,
      starts_at: input.startsAt,
      ends_at: input.endsAt ?? null,
      category: input.category,
      assignee_name: input.assigneeName ?? null,
      location: input.location ?? null,
      description: input.description ?? null,
    }).select().single();
    if (error) throw error;
    await supabase.from('audit_events').insert({ circle_id: circleId, actor_member_id: memberId, action: 'create', resource_type: 'care_event', resource_id: data.id });
    res.status(201).json({ data });
  } catch (error) { next(error); }
});

const noteSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(10000),
  category: z.enum(['medical', 'vitals', 'errands', 'social', 'critical']),
  isCritical: z.boolean().default(false),
});

app.get('/api/v1/notes', async (req, res, next) => {
  try {
    const { circleId } = await requireCapability(req, 'note:read');
    const { data, error } = await supabase.from('care_notes').select('*').eq('circle_id', circleId).order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ data });
  } catch (error) { next(error); }
});

app.post('/api/v1/notes', async (req, res, next) => {
  try {
    const { circleId, memberId } = await requireCapability(req, 'note:write');
    const input = noteSchema.parse(req.body);
    const { data, error } = await supabase.from('care_notes').insert({
      circle_id: circleId,
      title: input.title,
      content: input.content,
      category: input.category,
      is_critical: input.isCritical,
    }).select().single();
    if (error) throw error;
    await supabase.from('audit_events').insert({ circle_id: circleId, actor_member_id: memberId, action: 'create', resource_type: 'care_note', resource_id: data.id });
    res.status(201).json({ data });
  } catch (error) { next(error); }
});

app.get('/api/v1/documents', async (req, res, next) => {
  try {
    const { circleId } = await requireCapability(req, 'document:read');
    const { data, error } = await supabase.from('documents').select('id, title, filename, content_type, size_bytes, category, created_at, updated_at').eq('circle_id', circleId).order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ data });
  } catch (error) { next(error); }
});

app.get('/api/v1/documents/:id/download-url', async (req, res, next) => {
  try {
    const { circleId, memberId } = await requireCapability(req, 'document:read');
    const { data: document, error } = await supabase.from('documents').select('storage_path').eq('circle_id', circleId).eq('id', req.params.id).single();
    if (error || !document) throw new ApiError(404, 'Document not found.');
    const { data, error: signingError } = await supabase.storage.from(config.SUPABASE_DOCUMENTS_BUCKET).createSignedUrl(document.storage_path, 60);
    if (signingError) throw signingError;
    await supabase.from('audit_events').insert({ circle_id: circleId, actor_member_id: memberId, action: 'download_url_issued', resource_type: 'document', resource_id: req.params.id });
    res.json({ data: { url: data.signedUrl, expiresInSeconds: 60 } });
  } catch (error) { next(error); }
});

app.use(notFound);
app.use(errorHandler);

const server = app.listen(config.PORT, () => logger.info('server_started', { port: config.PORT, environment: config.NODE_ENV }));
server.requestTimeout = 15_000;
server.headersTimeout = 20_000;
