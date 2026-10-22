import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, 'Route not found.'));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = error instanceof ApiError ? error.status : error instanceof ZodError ? 400 : 500;
  const message = error instanceof ApiError ? error.message : error instanceof ZodError ? 'Request validation failed.' : 'Internal server error.';
  if (status >= 500) console.error(error);
  res.status(status).json({ error: { message, ...(error instanceof ZodError ? { fields: error.flatten().fieldErrors } : {}) } });
}
