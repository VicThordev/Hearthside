export type Capability = 'circle:read' | 'event:read' | 'event:write' | 'note:read' | 'note:write' | 'document:read' | 'document:write';

const capabilities: Record<string, ReadonlySet<Capability>> = {
  owner: new Set(['circle:read', 'event:read', 'event:write', 'note:read', 'note:write', 'document:read', 'document:write']),
  organizer: new Set(['circle:read', 'event:read', 'event:write', 'note:read', 'note:write', 'document:read', 'document:write']),
  collaborator: new Set(['circle:read', 'event:read', 'event:write', 'note:read', 'note:write', 'document:read']),
  clinical: new Set(['circle:read', 'event:read', 'event:write', 'note:read', 'note:write', 'document:read', 'document:write']),
  restricted_helper: new Set(['circle:read', 'event:read']),
};

export function roleCan(role: string, capability: Capability): boolean {
  return capabilities[role]?.has(capability) ?? false;
}
