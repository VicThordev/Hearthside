import { Router } from 'express';
import { requireCapability, requireCircleMembership } from '../auth.js';
import { ApiError } from '../http.js';
import { roleCan } from '../permissions.js';
import { eventSchema, noteSchema, taskSchema, taskUpdateSchema } from '../schemas.js';
import { supabase } from '../supabase.js';
import { audit, idParam, route } from './util.js';

export const careRoutes = Router();

// ---- Schedule ----

careRoutes.get('/events', route(async (req, res) => {
  const { circleId } = await requireCapability(req, res, 'event:read');
  const { data, error } = await supabase.from('care_events')
    .select('id, title, starts_at, ends_at, category, assignee_name, location, description, created_at, author:created_by_member_id(display_name)')
    .eq('circle_id', circleId).order('starts_at');
  if (error) throw error;
  res.json({ data });
}));

// Create audit entries are written by the audit_row_change trigger from created_by_member_id.
careRoutes.post('/events', route(async (req, res) => {
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
}));

careRoutes.delete('/events/:id', route(async (req, res) => {
  const { circleId } = await requireCapability(req, res, 'event:write');
  const { data, error } = await supabase.from('care_events').delete().eq('circle_id', circleId).eq('id', idParam(req, 'Event')).select('id');
  if (error) throw error;
  if (!data.length) throw new ApiError(404, 'Event not found.');
  res.status(204).end();
}));

// ---- Care notes ----

careRoutes.get('/notes', route(async (req, res) => {
  const { circleId } = await requireCapability(req, res, 'note:read');
  const { data, error } = await supabase.from('care_notes')
    .select('id, title, content, category, is_critical, created_at, created_by_member_id, author:created_by_member_id(display_name)')
    .eq('circle_id', circleId).order('created_at', { ascending: false });
  if (error) throw error;
  res.json({ data });
}));

careRoutes.post('/notes', route(async (req, res) => {
  const { circleId, memberId } = await requireCapability(req, res, 'note:write');
  const input = noteSchema.parse(req.body);
  const { data, error } = await supabase.from('care_notes').insert({
    circle_id: circleId,
    created_by_member_id: memberId,
    title: input.title,
    content: input.content,
    category: input.category,
    is_critical: input.isCritical || input.category === 'critical',
  }).select().single();
  if (error) throw error;
  res.status(201).json({ data });
}));

// Authors may remove their own notes; organizers and owners may remove any.
careRoutes.delete('/notes/:id', route(async (req, res) => {
  const { circleId, memberId, role } = await requireCapability(req, res, 'note:write');
  const noteId = idParam(req, 'Note');
  const { data: note, error } = await supabase.from('care_notes').select('created_by_member_id').eq('circle_id', circleId).eq('id', noteId).maybeSingle();
  if (error) throw error;
  if (!note) throw new ApiError(404, 'Note not found.');
  if (note.created_by_member_id !== memberId && !roleCan(role, 'circle:manage')) throw new ApiError(403, 'Only the author or an organizer can delete this note.');
  const { error: deleteError } = await supabase.from('care_notes').delete().eq('circle_id', circleId).eq('id', noteId);
  if (deleteError) throw deleteError;
  res.status(204).end();
}));

// ---- Tasks ----

const taskColumns = 'id, title, description, status, priority, due_at, created_at, updated_at, assigned_member_id, assignee:assigned_member_id(display_name)';

async function assertMemberOfCircle(circleId: string, memberId: string | null | undefined) {
  if (!memberId) return;
  const { data, error } = await supabase.from('circle_members').select('id').eq('circle_id', circleId).eq('id', memberId).maybeSingle();
  if (error) throw error;
  if (!data) throw new ApiError(400, 'Tasks can only be assigned to members of this Care Circle.');
}

careRoutes.get('/tasks', route(async (req, res) => {
  const { circleId } = await requireCapability(req, res, 'task:read');
  const { data, error } = await supabase.from('tasks').select(taskColumns).eq('circle_id', circleId)
    .order('due_at', { ascending: true, nullsFirst: false }).order('created_at', { ascending: false });
  if (error) throw error;
  res.json({ data });
}));

careRoutes.post('/tasks', route(async (req, res) => {
  const { circleId, memberId } = await requireCapability(req, res, 'task:write');
  const input = taskSchema.parse(req.body);
  await assertMemberOfCircle(circleId, input.assignedMemberId);
  const { data, error } = await supabase.from('tasks').insert({
    circle_id: circleId,
    title: input.title,
    description: input.description ?? null,
    priority: input.priority,
    due_at: input.dueAt ?? null,
    assigned_member_id: input.assignedMemberId ?? null,
  }).select(taskColumns).single();
  if (error) throw error;
  await audit({ circleId, actorMemberId: memberId, action: 'insert', resourceType: 'tasks', resourceId: data.id });
  res.status(201).json({ data });
}));

// Everyone with task:update may change status; editing anything else needs task:write.
careRoutes.patch('/tasks/:id', route(async (req, res) => {
  const context = await requireCircleMembership(req, res);
  const input = taskUpdateSchema.parse(req.body);
  const editsDetails = Object.entries(input).some(([key, value]) => key !== 'status' && value !== undefined);
  if (!roleCan(context.role, editsDetails ? 'task:write' : 'task:update')) throw new ApiError(403, 'Your role does not allow this action.');
  await assertMemberOfCircle(context.circleId, input.assignedMemberId);
  const changes = Object.fromEntries(Object.entries({
    status: input.status,
    title: input.title,
    description: input.description,
    priority: input.priority,
    due_at: input.dueAt,
    assigned_member_id: input.assignedMemberId,
  }).filter(([, value]) => value !== undefined));
  if (!Object.keys(changes).length) throw new ApiError(400, 'Provide at least one field to update.');
  const taskId = idParam(req, 'Task');
  const { data, error } = await supabase.from('tasks').update(changes).eq('circle_id', context.circleId).eq('id', taskId).select(taskColumns).maybeSingle();
  if (error) throw error;
  if (!data) throw new ApiError(404, 'Task not found.');
  await audit({ circleId: context.circleId, actorMemberId: context.memberId, action: 'update', resourceType: 'tasks', resourceId: taskId, metadata: { fields: Object.keys(changes) } });
  res.json({ data });
}));

careRoutes.delete('/tasks/:id', route(async (req, res) => {
  const { circleId, memberId } = await requireCapability(req, res, 'task:write');
  const taskId = idParam(req, 'Task');
  const { data, error } = await supabase.from('tasks').delete().eq('circle_id', circleId).eq('id', taskId).select('id');
  if (error) throw error;
  if (!data.length) throw new ApiError(404, 'Task not found.');
  await audit({ circleId, actorMemberId: memberId, action: 'delete', resourceType: 'tasks', resourceId: taskId });
  res.status(204).end();
}));
