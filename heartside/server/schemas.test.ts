import assert from 'node:assert/strict';
import test from 'node:test';
import { circleSchema, documentIdSchema, eventSchema } from './schemas.js';

const event = { title: 'Cardiology follow-up', category: 'medical', startsAt: '2026-11-03T10:00:00Z' };

test('events may not end before they start', () => {
  assert.equal(eventSchema.safeParse({ ...event, endsAt: '2026-11-03T11:00:00Z' }).success, true);
  assert.equal(eventSchema.safeParse({ ...event, endsAt: '2026-11-03T09:00:00Z' }).success, false);
  assert.equal(eventSchema.safeParse(event).success, true);
});

test('circle time zones must be valid IANA zones', () => {
  const circle = { name: 'The Vance Family', recipientName: 'Eleanor Vance' };
  assert.equal(circleSchema.parse(circle).timezone, 'America/Los_Angeles');
  assert.equal(circleSchema.safeParse({ ...circle, timezone: 'Europe/London' }).success, true);
  assert.equal(circleSchema.safeParse({ ...circle, timezone: 'Not/AZone' }).success, false);
});

test('document identifiers must be UUIDs', () => {
  assert.equal(documentIdSchema.safeParse('8f14e45f-ceea-4e7a-9f3b-2c1d6a0b9e11').success, true);
  assert.equal(documentIdSchema.safeParse('../etc/passwd').success, false);
});
