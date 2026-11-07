import assert from 'node:assert/strict';
import test from 'node:test';
import { canAssignRole, roleCan } from './permissions.js';

test('restricted helpers see the schedule and can tick off tasks, nothing clinical', () => {
  assert.equal(roleCan('restricted_helper', 'event:read'), true);
  assert.equal(roleCan('restricted_helper', 'task:update'), true);
  assert.equal(roleCan('restricted_helper', 'event:write'), false);
  assert.equal(roleCan('restricted_helper', 'task:write'), false);
  assert.equal(roleCan('restricted_helper', 'note:read'), false);
  assert.equal(roleCan('restricted_helper', 'document:read'), false);
});

test('collaborators can read documents but cannot upload them', () => {
  assert.equal(roleCan('collaborator', 'note:write'), true);
  assert.equal(roleCan('collaborator', 'document:read'), true);
  assert.equal(roleCan('collaborator', 'document:write'), false);
});

test('only owners and organizers manage members, circle details, and the activity log', () => {
  for (const role of ['owner', 'organizer']) {
    assert.equal(roleCan(role, 'member:manage'), true);
    assert.equal(roleCan(role, 'circle:manage'), true);
    assert.equal(roleCan(role, 'audit:read'), true);
  }
  for (const role of ['collaborator', 'clinical', 'restricted_helper']) {
    assert.equal(roleCan(role, 'member:manage'), false);
    assert.equal(roleCan(role, 'circle:manage'), false);
    assert.equal(roleCan(role, 'audit:read'), false);
  }
});

test('only owners can grant, change, or remove the owner role', () => {
  assert.equal(canAssignRole('owner', 'collaborator', 'owner'), true);
  assert.equal(canAssignRole('owner', 'owner', 'organizer'), true);
  assert.equal(canAssignRole('organizer', 'collaborator', 'clinical'), true);
  assert.equal(canAssignRole('organizer', 'collaborator', 'owner'), false);
  assert.equal(canAssignRole('organizer', 'owner', 'collaborator'), false);
  assert.equal(canAssignRole('organizer', null, 'owner'), false);
  assert.equal(canAssignRole('collaborator', 'restricted_helper', 'collaborator'), false);
  assert.equal(canAssignRole('owner', 'collaborator', 'superuser'), false);
});

test('unknown roles have no permissions', () => {
  assert.equal(roleCan('untrusted', 'event:read'), false);
  assert.equal(roleCan('__proto__', 'event:read'), false);
});
