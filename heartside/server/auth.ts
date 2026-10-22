import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';
import { ApiError } from './http.js';
import { roleCan, type Capability } from './permissions.js';
import { supabase } from './supabase.js';

export type AuthContext = { user: User; circleId: string; memberId: string; role: string };

function bearerToken(req: Request): string {
  const value = req.header('authorization');
  if (!value?.startsWith('Bearer ')) throw new ApiError(401, 'A valid bearer token is required.');
  return value.slice('Bearer '.length);
}

export async function requireUser(req: Request): Promise<User> {
  const { data, error } = await supabase.auth.getUser(bearerToken(req));
  if (error || !data.user) throw new ApiError(401, 'Your session is invalid or has expired.');
  return data.user;
}

export async function requireCircleMembership(req: Request): Promise<AuthContext> {
  const user = await requireUser(req);
  const circleId = req.header('x-care-circle-id');
  if (!circleId) throw new ApiError(400, 'Select a care circle before making this request.');

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

export async function requireCapability(req: Request, capability: Capability): Promise<AuthContext> {
  const context = await requireCircleMembership(req);
  if (!roleCan(context.role, capability)) throw new ApiError(403, 'Your role does not allow this action.');
  return context;
}
