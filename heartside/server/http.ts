import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from './logger.js';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// PostgreSQL error codes that indicate a bad request rather than a server fault.
const postgresErrors: Record<string, { status: number; message: string }> = {
  '22P02': { status: 400, message: 'A request identifier or value is malformed.' },
  '23502': { status: 400, message: 'A required value is missing.' },
  '23503': { status: 409, message: 'A referenced record does not exist.' },
  '23505': { status: 409, message: 'This record already exists.' },
  '23514': { status: 400, message: 'A value failed a data constraint.' },
};

// express.json() reports client mistakes as errors carrying a type such as entity.too.large.
const bodyParserErrors: Record<string, { status: number; message: string }> = {
  'entity.parse.failed': { status: 400, message: 'The request body is not valid JSON.' },
  'entity.too.large': { status: 413, message: 'The request body is too large.' },
};

function bodyParserError(error: unknown) {
  if (typeof error !== 'object' || error === null || !('type' in error) || typeof error.type !== 'string') return undefined;
  return bodyParserErrors[error.type];
}

function postgresError(error: unknown) {
  if (typeof error !== 'object' || error === null || !('code' in error) || typeof error.code !== 'string') return undefined;
  return postgresErrors[error.code];
}

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, 'Route not found.'));
}

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  const known = error instanceof ApiError ? error
    : error instanceof ZodError ? { status: 400, message: 'Request validation failed.' }
    : bodyParserError(error) ?? postgresError(error);
  const status = known?.status ?? 500;
  const message = known?.message ?? 'Internal server error.';
  if (status >= 500) logger.error('request_failed', { requestId: res.locals.requestId, method: req.method, path: req.path, status });
  res.status(status).json({ error: { message, ...(error instanceof ZodError ? { fields: error.flatten().fieldErrors } : {}) } });
}
