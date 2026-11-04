export type Capability = 'circle:read' | 'event:read' | 'event:write' | 'note:read' | 'note:write' | 'document:read' | 'document:write';

// Mirrors the public.member_role enum in supabase/migrations.
export const memberRoles = ['owner', 'organizer', 'collaborator', 'restricted_helper', 'clinical'] as const;
export type MemberRole = typeof memberRoles[number];

const capabilities: Record<MemberRole, ReadonlySet<Capability>> = {
  owner: new Set(['circle:read', 'event:read', 'event:write', 'note:read', 'note:write', 'document:read', 'document:write']),
  organizer: new Set(['circle:read', 'event:read', 'event:write', 'note:read', 'note:write', 'document:read', 'document:write']),
  collaborator: new Set(['circle:read', 'event:read', 'event:write', 'note:read', 'note:write', 'document:read']),
  clinical: new Set(['circle:read', 'event:read', 'event:write', 'note:read', 'note:write', 'document:read', 'document:write']),
  restricted_helper: new Set(['circle:read', 'event:read']),
};

function isMemberRole(role: string): role is MemberRole {
  return (memberRoles as readonly string[]).includes(role);
}

export function roleCan(role: string, capability: Capability): boolean {
  return isMemberRole(role) && capabilities[role].has(capability);
}
