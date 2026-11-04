import type { Request, RequestHandler, Response } from 'express';
import type { User } from '@supabase/supabase-js';
import { z } from 'zod';
import { ApiError } from './http.js';
import { roleCan, type Capability } from './permissions.js';
import { supabase } from './supabase.js';

export type AuthContext = { user: User; circleId: string; memberId: string; role: string };

const circleIdSchema = z.string().uuid();

function bearerToken(req: Request): string {
  const value = req.header('authorization');
  if (!value?.startsWith('Bearer ')) throw new ApiError(401, 'A valid bearer token is required.');
  return value.slice('Bearer '.length);
}

// Verifies the bearer token once per request and stores the user in res.locals.user.
export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const { data, error } = await supabase.auth.getUser(bearerToken(req));
    if (error || !data.user) throw new ApiError(401, 'Your session is invalid or has expired.');
    res.locals.user = data.user;
    next();
  } catch (error) { next(error); }
};

export function requireUser(res: Response): User {
  const user = res.locals.user as User | undefined;
  if (!user) throw new ApiError(401, 'A valid bearer token is required.');
  return user;
}

export async function requireCircleMembership(req: Request, res: Response): Promise<AuthContext> {
  const user = requireUser(res);
  const header = req.header('x-care-circle-id');
  if (!header) throw new ApiError(400, 'Select a care circle before making this request.');
  const parsed = circleIdSchema.safeParse(header);
  if (!parsed.success) throw new ApiError(400, 'The selected care circle identifier is malformed.');
  const circleId = parsed.data;

  const { data: member, error } = await supabase
    .from('circle_members')
    .select('id, role')
    .eq('circle_id', circleId)
    .eq('user_id', user.id)
    .maybeSingle();
  if (error) throw error;
  if (!member) throw new ApiError(403, 'You do not have access to this care circle.');
  return { user, circleId, memberId: member.id, role: member.role };
}

export async function requireCapability(req: Request, res: Response, capability: Capability): Promise<AuthContext> {
  const context = await requireCircleMembership(req, res);
  if (!roleCan(context.role, capability)) throw new ApiError(403, 'Your role does not allow this action.');
  return context;
}
