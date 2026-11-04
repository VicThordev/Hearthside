import assert from 'node:assert/strict';
import test from 'node:test';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { ApiError, errorHandler } from './http.js';

function respond(error: unknown) {
  const result: { status?: number; body?: { error: { message: string; fields?: unknown } } } = {};
  const res = {
    locals: {},
    status(code: number) { result.status = code; return this; },
    json(body: typeof result.body) { result.body = body; return this; },
  } as unknown as Response;
  const req = { method: 'GET', path: '/test' } as Request;
  const originalError = console.error;
  console.error = () => {};
  try { errorHandler(error, req, res, () => {}); } finally { console.error = originalError; }
  return result;
}

test('ApiError keeps its status and message', () => {
  assert.deepEqual(respond(new ApiError(403, 'Nope.')), { status: 403, body: { error: { message: 'Nope.' } } });
});

test('Zod errors become 400 with field details', () => {
  const result = respond(z.object({ name: z.string() }).safeParse({}).error);
  assert.equal(result.status, 400);
  assert.ok(result.body?.error.fields);
});

test('PostgreSQL client errors map to 4xx', () => {
  assert.equal(respond({ code: '22P02', message: 'invalid input syntax for type uuid' }).status, 400);
  assert.equal(respond({ code: '23505', message: 'duplicate key' }).status, 409);
  assert.equal(respond({ code: '23514', message: 'check violation' }).status, 400);
});

test('malformed and oversized request bodies map to 4xx', () => {
  assert.equal(respond({ type: 'entity.parse.failed', status: 400 }).status, 400);
  assert.equal(respond({ type: 'entity.too.large', status: 413 }).status, 413);
});

test('unknown errors are 500 and do not leak details', () => {
  const result = respond(new Error('connection string with secrets'));
  assert.equal(result.status, 500);
  assert.equal(result.body?.error.message, 'Internal server error.');
  assert.equal(respond({ code: 'XX000', message: 'internal' }).status, 500);
});
