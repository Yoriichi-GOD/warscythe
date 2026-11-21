import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldStartApplication } from './startupPolicy.js';

const browser = (entries = {}, search = '', hash = '') => ({
  location: { search, hash },
  localStorage: { length: Object.keys(entries).length, key: index => Object.keys(entries)[index], getItem: key => entries[key] || null },
});

test('a new web visitor receives the lightweight landing bundle', () => assert.equal(shouldStartApplication(browser()), false));
test('native entry always reaches the application', () => assert.equal(shouldStartApplication(browser(), { native: true }), true));
test('saved sessions including expired ones reach Supabase for restoration', () => {
  for (const value of ['test-session', JSON.stringify({ access_token: 'fixture-only', expires_at: 1 }), 'malformed-session']) assert.equal(shouldStartApplication(browser({ 'sb-project-auth-token': value })), true);
});
test('OAuth and recovery callbacks reach the application from either URL component', () => {
  for (const key of ['code', 'access_token', 'token_hash', 'error', 'type']) {
    assert.equal(shouldStartApplication(browser({}, '?' + key + '=fixture')), true);
    assert.equal(shouldStartApplication(browser({}, '', '#' + key + '=fixture')), true);
  }
});
test('a cached operative still reaches the existing offline startup path', () => assert.equal(shouldStartApplication(browser({ 'Warscythe-storage': JSON.stringify({ state: { user: { id: 'fixture' } } }) })), true));
test('anonymous cached state does not load the progression bundle', () => assert.equal(shouldStartApplication(browser({ 'Warscythe-storage': JSON.stringify({ state: { user: null } }) })), false));
test('the development test realm cannot select application entry in production', () => {
  const sample = browser({ warscythe_test_realm_active: 'true' });
  assert.equal(shouldStartApplication(sample), false);
  assert.equal(shouldStartApplication(sample, { dev: true }), true);
});
test('unavailable or malformed storage does not crash public entry', () => {
  assert.equal(shouldStartApplication({ location: {}, get localStorage() { throw Error('Storage unavailable'); } }), false);
  assert.equal(shouldStartApplication(browser({ 'Warscythe-storage': '{broken' })), false);
});
