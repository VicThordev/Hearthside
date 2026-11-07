import { apiFetch } from '../lib/api';
import { requireSupabase } from '../lib/supabase';
import type { MemberRole } from '../../server/permissions';

export type EventCategory = 'medical' | 'vitals' | 'transport' | 'errands' | 'social';
export type NoteCategory = 'medical' | 'vitals' | 'errands' | 'social' | 'critical';
export type DocumentCategory = 'insurance' | 'legal' | 'clinical' | 'prescriptions' | 'home_safety';
export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
type Author = { display_name: string } | null;

export interface CircleInfo {
  circle: { id: string; name: string; timezone: string; created_at: string };
  recipient: { display_name: string; preferred_name: string | null; date_of_birth: string | null } | null;
  me: { id: string; role: MemberRole; display_name: string; email: string };
}
export interface Member { id: string; display_name: string; email: string; role: MemberRole; created_at: string }
export interface CareEvent { id: string; title: string; starts_at: string; ends_at: string | null; category: EventCategory; assignee_name: string | null; location: string | null; description: string | null; created_at: string; author: Author }
export interface CareNote { id: string; title: string; content: string; category: NoteCategory; is_critical: boolean; created_at: string; created_by_member_id: string | null; author: Author }
export interface Task { id: string; title: string; description: string | null; status: TaskStatus; priority: TaskPriority; due_at: string | null; created_at: string; assigned_member_id: string | null; assignee: Author }
export interface StoredDocument { id: string; title: string; filename: string; content_type: string; size_bytes: number; category: DocumentCategory; created_at: string; author?: Author }
export interface Invite { id: string; email: string; role: MemberRole; status: string; expires_at: string; created_at: string; link?: string }
export interface AuditEvent { id: number; actor_member_id: string | null; actor_name: string | null; action: string; resource_type: string; resource_id: string | null; metadata: Record<string, unknown>; created_at: string }

const get = async <T,>(path: string) => (await apiFetch<{ data: T }>(path)).data;
const send = async <T,>(method: string, path: string, body?: unknown) =>
  (await apiFetch<{ data: T } | undefined>(path, { method, ...(body === undefined ? {} : { body: JSON.stringify(body) }) }))?.data as T;

export const api = {
  circle: () => get<CircleInfo>('/api/v1/circle'),
  updateCircle: (input: { name?: string; recipientName?: string; timezone?: string }) => send<void>('PATCH', '/api/v1/circle', input),
  members: () => get<Member[]>('/api/v1/members'),
  updateMyProfile: (displayName: string) => send<void>('PATCH', '/api/v1/members/me', { displayName }),
  changeRole: (memberId: string, role: MemberRole) => send<void>('PATCH', `/api/v1/members/${memberId}`, { role }),
  removeMember: (memberId: string) => send<void>('DELETE', `/api/v1/members/${memberId}`),
  leaveCircle: () => send<void>('DELETE', '/api/v1/members/me'),

  invites: () => get<Invite[]>('/api/v1/invites'),
  createInvite: (email: string, role: MemberRole) => send<Invite>('POST', '/api/v1/invites', { email, role }),
  revokeInvite: (inviteId: string) => send<void>('DELETE', `/api/v1/invites/${inviteId}`),
  acceptInvite: (token: string) => send<{ circleId: string }>('POST', '/api/v1/invites/accept', { token }),

  events: () => get<CareEvent[]>('/api/v1/events'),
  createEvent: (input: { title: string; startsAt: string; endsAt?: string; category: EventCategory; assigneeName?: string; location?: string; description?: string }) => send<CareEvent>('POST', '/api/v1/events', input),
  deleteEvent: (eventId: string) => send<void>('DELETE', `/api/v1/events/${eventId}`),

  notes: () => get<CareNote[]>('/api/v1/notes'),
  createNote: (input: { title: string; content: string; category: NoteCategory; isCritical: boolean }) => send<CareNote>('POST', '/api/v1/notes', input),
  deleteNote: (noteId: string) => send<void>('DELETE', `/api/v1/notes/${noteId}`),

  tasks: () => get<Task[]>('/api/v1/tasks'),
  createTask: (input: { title: string; description?: string; priority: TaskPriority; dueAt?: string; assignedMemberId?: string }) => send<Task>('POST', '/api/v1/tasks', input),
  updateTask: (taskId: string, input: Partial<{ status: TaskStatus }>) => send<Task>('PATCH', `/api/v1/tasks/${taskId}`, input),
  deleteTask: (taskId: string) => send<void>('DELETE', `/api/v1/tasks/${taskId}`),

  documents: () => get<StoredDocument[]>('/api/v1/documents'),
  documentUrl: (documentId: string, download: boolean) => get<{ url: string }>(`/api/v1/documents/${documentId}/download-url${download ? '?download=1' : ''}`),
  deleteDocument: (documentId: string) => send<void>('DELETE', `/api/v1/documents/${documentId}`),

  audit: () => get<AuditEvent[]>('/api/v1/audit'),
};

// Three steps: the API reserves a storage path, the browser sends the file straight to
// Supabase Storage with a single-use token, and the API records it after checking the stored object.
export async function uploadDocument(file: File, title: string, category: DocumentCategory): Promise<StoredDocument> {
  const target = await send<{ bucket: string; path: string; token: string }>('POST', '/api/v1/documents/upload-url', { contentType: file.type, sizeBytes: file.size });
  const { error } = await requireSupabase().storage.from(target.bucket).uploadToSignedUrl(target.path, target.token, file, { contentType: file.type });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return send<StoredDocument>('POST', '/api/v1/documents', { path: target.path, title, filename: file.name, category });
}
