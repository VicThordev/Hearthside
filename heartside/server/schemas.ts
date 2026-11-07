import { z } from 'zod';
import { memberRoles } from './permissions.js';

function isTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

const timezone = z.string().trim().min(1).max(64).refine(isTimeZone, 'Must be an IANA time zone.');
const optionalText = (max: number) => z.string().trim().max(max).optional().transform((value) => value || undefined);

export const circleSchema = z.object({
  name: z.string().trim().min(1).max(160),
  recipientName: z.string().trim().min(1).max(160),
  timezone: timezone.default('America/Los_Angeles'),
});

export const circleUpdateSchema = z.object({
  name: z.string().trim().min(1).max(160).optional(),
  recipientName: z.string().trim().min(1).max(160).optional(),
  timezone: timezone.optional(),
}).refine((value) => Object.values(value).some((field) => field !== undefined), 'Provide at least one field to update.');

export const eventSchema = z.object({
  title: z.string().trim().min(1).max(200),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  category: z.enum(['medical', 'vitals', 'transport', 'errands', 'social']),
  assigneeName: optionalText(120),
  location: optionalText(500),
  description: optionalText(5000),
}).refine((event) => !event.endsAt || Date.parse(event.endsAt) >= Date.parse(event.startsAt), {
  message: 'End time must not be before start time.',
  path: ['endsAt'],
});

export const noteSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(10000),
  category: z.enum(['medical', 'vitals', 'errands', 'social', 'critical']),
  isCritical: z.boolean().default(false),
});

export const taskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: optionalText(5000),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  dueAt: z.string().datetime().optional(),
  assignedMemberId: z.string().uuid().optional(),
});

export const taskUpdateSchema = z.object({
  status: z.enum(['open', 'in_progress', 'completed', 'cancelled']).optional(),
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(5000).nullable().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  dueAt: z.string().datetime().nullable().optional(),
  assignedMemberId: z.string().uuid().nullable().optional(),
});

// The bucket accepts only these types; the extension is derived from the type, never the filename.
export const documentTypes = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png' } as const;
export const maxDocumentBytes = 25 * 1024 * 1024;
const documentCategory = z.enum(['insurance', 'legal', 'clinical', 'prescriptions', 'home_safety']);

export const uploadRequestSchema = z.object({
  contentType: z.enum(Object.keys(documentTypes) as [keyof typeof documentTypes]),
  sizeBytes: z.number().int().positive().max(maxDocumentBytes),
});

export const documentSchema = z.object({
  path: z.string().min(1).max(200),
  title: z.string().trim().min(1).max(200),
  filename: z.string().trim().min(1).max(255),
  category: documentCategory,
});

export const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  role: z.enum(memberRoles),
});

export const inviteAcceptSchema = z.object({ token: z.string().min(20).max(200) });

export const memberUpdateSchema = z.object({ role: z.enum(memberRoles) });

export const profileUpdateSchema = z.object({ displayName: z.string().trim().min(1).max(120) });

export const idSchema = z.string().uuid();
export const documentIdSchema = idSchema;
