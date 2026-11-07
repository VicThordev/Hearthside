import type { Request, RequestHandler, Response } from 'express';
import { ApiError } from '../http.js';
import { idSchema } from '../schemas.js';
import { supabase } from '../supabase.js';

// Express 4 does not forward rejected promises to the error handler; this does.
export function route(handler: (req: Request, res: Response) => Promise<unknown>): RequestHandler {
  return (req, res, next) => { handler(req, res).catch(next); };
}

// A malformed id cannot match a row, so it is reported as not found rather than as a server error.
export function idParam(req: Request, label = 'Record'): string {
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) throw new ApiError(404, `${label} not found.`);
  return parsed.data;
}

type AuditEntry = { circleId: string; actorMemberId: string; action: string; resourceType: string; resourceId?: string | null; metadata?: Record<string, unknown> };

// Tables without an audit trigger (members, invites, circles, tasks) record their changes here.
// Metadata must never include clinical content.
export async function audit(entry: AuditEntry) {
  const { error } = await supabase.from('audit_events').insert({
    circle_id: entry.circleId,
    actor_member_id: entry.actorMemberId,
    action: entry.action,
    resource_type: entry.resourceType,
    resource_id: entry.resourceId ?? null,
    metadata: entry.metadata ?? {},
  });
  if (error) throw error;
}
