import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from './logger.js';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, 'Route not found.'));
}

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  const status = error instanceof ApiError ? error.status : error instanceof ZodError ? 400 : 500;
  const message = error instanceof ApiError ? error.message : error instanceof ZodError ? 'Request validation failed.' : 'Internal server error.';
  if (status >= 500) logger.error('request_failed', { requestId: res.locals.requestId, method: req.method, path: req.path, status });
  res.status(status).json({ error: { message, ...(error instanceof ZodError ? { fields: error.flatten().fieldErrors } : {}) } });
}
