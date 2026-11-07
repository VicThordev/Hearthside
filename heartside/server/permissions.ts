// Shared by the API (enforcement) and the browser (hiding controls a role cannot use).
// The server is the authority; the browser copy is only a convenience.
export type Capability =
  | 'circle:read' | 'circle:manage'
  | 'event:read' | 'event:write'
  | 'note:read' | 'note:write'
  | 'task:read' | 'task:write' | 'task:update'
  | 'document:read' | 'document:write'
  | 'member:read' | 'member:manage'
  | 'audit:read';

// Mirrors the public.member_role enum in supabase/migrations.
export const memberRoles = ['owner', 'organizer', 'collaborator', 'restricted_helper', 'clinical'] as const;
export type MemberRole = typeof memberRoles[number];

export const roleLabels: Record<MemberRole, string> = {
  owner: 'Owner',
  organizer: 'Organizer',
  collaborator: 'Family collaborator',
  clinical: 'Clinical caregiver',
  restricted_helper: 'Restricted helper',
};

const everyone: Capability[] = ['circle:read', 'event:read', 'task:read', 'task:update', 'member:read'];
const careTeam: Capability[] = [...everyone, 'event:write', 'note:read', 'note:write', 'document:read'];

const capabilities: Record<MemberRole, ReadonlySet<Capability>> = {
  owner: new Set([...careTeam, 'task:write', 'document:write', 'circle:manage', 'member:manage', 'audit:read']),
  organizer: new Set([...careTeam, 'task:write', 'document:write', 'circle:manage', 'member:manage', 'audit:read']),
  collaborator: new Set([...careTeam, 'task:write']),
  clinical: new Set([...careTeam, 'document:write']),
  // Helpers see the schedule and can tick off errands assigned to them, nothing clinical.
  restricted_helper: new Set(everyone),
};

export function isMemberRole(role: string): role is MemberRole {
  return (memberRoles as readonly string[]).includes(role);
}

export function roleCan(role: string, capability: Capability): boolean {
  return isMemberRole(role) && capabilities[role].has(capability);
}

// Only owners may grant, change, or remove the owner role.
export function canAssignRole(actorRole: string, targetCurrentRole: string | null, newRole: string): boolean {
  if (!roleCan(actorRole, 'member:manage') || !isMemberRole(newRole)) return false;
  if (actorRole === 'owner') return true;
  return newRole !== 'owner' && targetCurrentRole !== 'owner';
}
