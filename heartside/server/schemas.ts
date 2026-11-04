import { z } from 'zod';

function isTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export const circleSchema = z.object({
  name: z.string().trim().min(1).max(160),
  recipientName: z.string().trim().min(1).max(160),
  timezone: z.string().trim().min(1).max(64).refine(isTimeZone, 'Must be an IANA time zone.').default('America/Los_Angeles'),
});

export const eventSchema = z.object({
  title: z.string().trim().min(1).max(200),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  category: z.enum(['medical', 'vitals', 'transport', 'errands', 'social']),
  assigneeName: z.string().trim().min(1).max(120).optional(),
  location: z.string().trim().max(500).optional(),
  description: z.string().trim().max(5000).optional(),
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

export const documentIdSchema = z.string().uuid();
