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
import { authenticate } from './auth.js';
import { supabase } from './supabase.js';
import { careRoutes } from './routes/care.js';
import { circleRoutes } from './routes/circle.js';
import { documentRoutes } from './routes/documents.js';
import { logger } from './logger.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', config.TRUST_PROXY_HOPS);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      // The browser talks to Supabase directly for sign-in; helmet's default would block it.
      connectSrc: ["'self'", new URL(config.SUPABASE_URL).origin],
      // Image previews in the document vault load from short-lived Supabase Storage URLs.
      imgSrc: ["'self'", 'data:', 'blob:', new URL(config.SUPABASE_URL).origin],
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

app.use('/api/v1', circleRoutes, careRoutes, documentRoutes);

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
