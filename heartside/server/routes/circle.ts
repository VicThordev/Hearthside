import crypto from 'node:crypto';
import { Router } from 'express';
import { requireCapability, requireCircleMembership, requireUser } from '../auth.js';
import { config } from '../config.js';
import { ApiError } from '../http.js';
import { canAssignRole } from '../permissions.js';
import { circleSchema, circleUpdateSchema, inviteAcceptSchema, inviteSchema, memberUpdateSchema, profileUpdateSchema } from '../schemas.js';
import { supabase } from '../supabase.js';
import { audit, idParam, route } from './util.js';

export const circleRoutes = Router();

const INVITE_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

// ---- Circles the signed-in user belongs to ----

circleRoutes.get('/circles', route(async (_req, res) => {
  const user = requireUser(res);
  const { data, error } = await supabase.from('circle_members')
    .select('id, role, care_circles (id, name, timezone)')
    .eq('user_id', user.id)
    .order('created_at');
  if (error) throw error;
  res.json({ data });
}));

circleRoutes.post('/circles', route(async (req, res) => {
  const user = requireUser(res);
  const input = circleSchema.parse(req.body);
  const displayName = typeof user.user_metadata.full_name === 'string' && user.user_metadata.full_name.trim() ? user.user_metadata.full_name.trim() : user.email ?? 'Circle owner';
  const { data: circle, error } = await supabase.rpc('create_care_circle', {
    p_name: input.name, p_timezone: input.timezone, p_recipient_name: input.recipientName,
    p_owner_id: user.id, p_owner_email: user.email ?? '', p_owner_display_name: displayName,
  });
  if (error || !circle) throw error ?? new ApiError(500, 'Care Circle creation did not return an identifier.');
  res.status(201).json({ data: circle });
}));

// ---- The selected circle ----

circleRoutes.get('/circle', route(async (req, res) => {
  const { circleId, memberId } = await requireCapability(req, res, 'circle:read');
  const [circle, recipient, me] = await Promise.all([
    supabase.from('care_circles').select('id, name, timezone, created_at').eq('id', circleId).single(),
    supabase.from('care_recipients').select('display_name, preferred_name, date_of_birth').eq('circle_id', circleId).maybeSingle(),
    supabase.from('circle_members').select('id, role, display_name, email').eq('id', memberId).single(),
  ]);
  for (const result of [circle, recipient, me]) if (result.error) throw result.error;
  res.json({ data: { circle: circle.data, recipient: recipient.data, me: me.data } });
}));

circleRoutes.patch('/circle', route(async (req, res) => {
  const { circleId, memberId } = await requireCapability(req, res, 'circle:manage');
  const input = circleUpdateSchema.parse(req.body);
  if (input.name || input.timezone) {
    const { error } = await supabase.from('care_circles').update({
      ...(input.name ? { name: input.name } : {}),
      ...(input.timezone ? { timezone: input.timezone } : {}),
    }).eq('id', circleId);
    if (error) throw error;
  }
  if (input.recipientName) {
    const { error } = await supabase.from('care_recipients').update({ display_name: input.recipientName }).eq('circle_id', circleId);
    if (error) throw error;
  }
  await audit({ circleId, actorMemberId: memberId, action: 'update', resourceType: 'care_circles', resourceId: circleId, metadata: { fields: Object.keys(input) } });
  res.status(204).end();
}));

// ---- Members ----

circleRoutes.get('/members', route(async (req, res) => {
  const { circleId } = await requireCapability(req, res, 'member:read');
  const { data, error } = await supabase.from('circle_members').select('id, display_name, email, role, created_at').eq('circle_id', circleId).order('created_at');
  if (error) throw error;
  res.json({ data });
}));

circleRoutes.patch('/members/me', route(async (req, res) => {
  const { circleId, memberId } = await requireCircleMembership(req, res);
  const input = profileUpdateSchema.parse(req.body);
  const { error } = await supabase.from('circle_members').update({ display_name: input.displayName }).eq('circle_id', circleId).eq('id', memberId);
  if (error) throw error;
  res.status(204).end();
}));

async function loadMember(circleId: string, memberId: string) {
  const { data, error } = await supabase.from('circle_members').select('id, role, user_id').eq('circle_id', circleId).eq('id', memberId).maybeSingle();
  if (error) throw error;
  if (!data) throw new ApiError(404, 'Member not found.');
  return data;
}

async function assertNotLastOwner(circleId: string, member: { role: string }) {
  if (member.role !== 'owner') return;
  const { count, error } = await supabase.from('circle_members').select('id', { count: 'exact', head: true }).eq('circle_id', circleId).eq('role', 'owner');
  if (error) throw error;
  if ((count ?? 0) <= 1) throw new ApiError(409, 'A Care Circle must keep at least one owner. Make someone else an owner first.');
}

circleRoutes.patch('/members/:id', route(async (req, res) => {
  const actor = await requireCapability(req, res, 'member:manage');
  const targetId = idParam(req, 'Member');
  const input = memberUpdateSchema.parse(req.body);
  if (targetId === actor.memberId) throw new ApiError(400, 'You cannot change your own role.');
  const target = await loadMember(actor.circleId, targetId);
  if (!canAssignRole(actor.role, target.role, input.role)) throw new ApiError(403, 'Only an owner can grant or change the owner role.');
  const { error } = await supabase.from('circle_members').update({ role: input.role }).eq('circle_id', actor.circleId).eq('id', targetId);
  if (error) throw error;
  await audit({ circleId: actor.circleId, actorMemberId: actor.memberId, action: 'role_changed', resourceType: 'circle_members', resourceId: targetId, metadata: { from: target.role, to: input.role } });
  res.status(204).end();
}));

// Members may always leave; removing someone else needs member:manage, and only owners remove owners.
circleRoutes.delete('/members/:id', route(async (req, res) => {
  const actor = await requireCircleMembership(req, res);
  const targetId = req.params.id === 'me' ? actor.memberId : idParam(req, 'Member');
  const target = await loadMember(actor.circleId, targetId);
  const leaving = targetId === actor.memberId;
  if (!leaving && !canAssignRole(actor.role, target.role, 'collaborator')) throw new ApiError(403, 'Your role does not allow removing this member.');
  await assertNotLastOwner(actor.circleId, target);
  const { error } = await supabase.from('circle_members').delete().eq('circle_id', actor.circleId).eq('id', targetId);
  if (error) throw error;
  await audit({ circleId: actor.circleId, actorMemberId: actor.memberId, action: leaving ? 'member_left' : 'member_removed', resourceType: 'circle_members', resourceId: targetId, metadata: { role: target.role } });
  res.status(204).end();
}));

// ---- Invitations ----

circleRoutes.get('/invites', route(async (req, res) => {
  const { circleId } = await requireCapability(req, res, 'member:manage');
  const { data, error } = await supabase.from('circle_invites').select('id, email, role, status, expires_at, created_at')
    .eq('circle_id', circleId).eq('status', 'pending').gt('expires_at', new Date().toISOString()).order('created_at', { ascending: false });
  if (error) throw error;
  res.json({ data });
}));

// Only a hash of the token is stored; the link is shown once, to the person who created it.
circleRoutes.post('/invites', route(async (req, res) => {
  const actor = await requireCapability(req, res, 'member:manage');
  const input = inviteSchema.parse(req.body);
  if (!canAssignRole(actor.role, null, input.role)) throw new ApiError(403, 'Only an owner can invite another owner.');

  const { data: existing, error: memberError } = await supabase.from('circle_members').select('id').eq('circle_id', actor.circleId).ilike('email', input.email).maybeSingle();
  if (memberError) throw memberError;
  if (existing) throw new ApiError(409, 'This person is already a member of the Care Circle.');

  // A new invite replaces any earlier pending one, so a lost link can simply be re-issued.
  const { error: revokeError } = await supabase.from('circle_invites').update({ status: 'revoked' }).eq('circle_id', actor.circleId).eq('email', input.email).eq('status', 'pending');
  if (revokeError) throw revokeError;

  const token = crypto.randomBytes(32).toString('base64url');
  const { data, error } = await supabase.from('circle_invites').insert({
    circle_id: actor.circleId,
    email: input.email,
    role: input.role,
    token_hash: hashToken(token),
    invited_by_member_id: actor.memberId,
    expires_at: new Date(Date.now() + INVITE_LIFETIME_MS).toISOString(),
  }).select('id, email, role, status, expires_at, created_at').single();
  if (error) throw error;
  await audit({ circleId: actor.circleId, actorMemberId: actor.memberId, action: 'invite_created', resourceType: 'circle_invites', resourceId: data.id, metadata: { role: input.role } });
  res.status(201).json({ data: { ...data, link: `${config.APP_URL}/?invite=${token}` } });
}));

circleRoutes.delete('/invites/:id', route(async (req, res) => {
  const actor = await requireCapability(req, res, 'member:manage');
  const inviteId = idParam(req, 'Invite');
  const { data, error } = await supabase.from('circle_invites').update({ status: 'revoked' }).eq('circle_id', actor.circleId).eq('id', inviteId).eq('status', 'pending').select('id');
  if (error) throw error;
  if (!data.length) throw new ApiError(404, 'Invite not found.');
  await audit({ circleId: actor.circleId, actorMemberId: actor.memberId, action: 'invite_revoked', resourceType: 'circle_invites', resourceId: inviteId });
  res.status(204).end();
}));

// Accepting needs no circle header: the token identifies the circle, and the signed-in email must match.
circleRoutes.post('/invites/accept', route(async (req, res) => {
  const user = requireUser(res);
  const { token } = inviteAcceptSchema.parse(req.body);
  const { data: invite, error } = await supabase.from('circle_invites').select('id, circle_id, email, role, status, expires_at').eq('token_hash', hashToken(token)).maybeSingle();
  if (error) throw error;
  if (!invite || invite.status !== 'pending') throw new ApiError(404, 'This invitation is no longer valid. Ask for a new link.');
  if (Date.parse(invite.expires_at) < Date.now()) throw new ApiError(410, 'This invitation has expired. Ask for a new link.');
  if ((user.email ?? '').toLowerCase() !== invite.email.toLowerCase()) {
    throw new ApiError(403, `This invitation was sent to ${invite.email}. Sign in with that email address to accept it.`);
  }

  const { data: existing, error: existingError } = await supabase.from('circle_members').select('id').eq('circle_id', invite.circle_id).eq('user_id', user.id).maybeSingle();
  if (existingError) throw existingError;
  let memberId = existing?.id as string | undefined;
  if (!memberId) {
    const displayName = typeof user.user_metadata.full_name === 'string' && user.user_metadata.full_name.trim() ? user.user_metadata.full_name.trim() : invite.email;
    const { data: member, error: insertError } = await supabase.from('circle_members').insert({
      circle_id: invite.circle_id, user_id: user.id, email: invite.email, display_name: displayName, role: invite.role,
    }).select('id').single();
    if (insertError) throw insertError;
    memberId = member.id as string;
  }
  const { error: acceptError } = await supabase.from('circle_invites').update({ status: 'accepted', accepted_at: new Date().toISOString() }).eq('id', invite.id).eq('status', 'pending');
  if (acceptError) throw acceptError;
  await audit({ circleId: invite.circle_id, actorMemberId: memberId, action: 'invite_accepted', resourceType: 'circle_invites', resourceId: invite.id, metadata: { role: invite.role } });
  res.json({ data: { circleId: invite.circle_id } });
}));

// ---- Activity log ----

circleRoutes.get('/audit', route(async (req, res) => {
  const { circleId } = await requireCapability(req, res, 'audit:read');
  const [events, members] = await Promise.all([
    supabase.from('audit_events').select('id, actor_member_id, action, resource_type, resource_id, metadata, created_at').eq('circle_id', circleId).order('created_at', { ascending: false }).limit(200),
    supabase.from('circle_members').select('id, display_name').eq('circle_id', circleId),
  ]);
  if (events.error) throw events.error;
  if (members.error) throw members.error;
  const names = new Map(members.data.map((member) => [member.id, member.display_name]));
  res.json({ data: events.data.map((event) => ({ ...event, actor_name: event.actor_member_id ? names.get(event.actor_member_id) ?? 'Former member' : null })) });
}));
