import assert from 'node:assert/strict';
import test from 'node:test';
import { roleCan } from './permissions.js';

test('restricted helpers can read events but cannot access notes or documents', () => {
  assert.equal(roleCan('restricted_helper', 'event:read'), true);
  assert.equal(roleCan('restricted_helper', 'event:write'), false);
  assert.equal(roleCan('restricted_helper', 'note:read'), false);
  assert.equal(roleCan('restricted_helper', 'document:read'), false);
});

test('collaborators cannot upload or access document files', () => {
  assert.equal(roleCan('collaborator', 'note:write'), true);
  assert.equal(roleCan('collaborator', 'document:read'), true);
  assert.equal(roleCan('collaborator', 'document:write'), false);
});

test('unknown roles have no permissions', () => {
  assert.equal(roleCan('untrusted', 'event:read'), false);
});
