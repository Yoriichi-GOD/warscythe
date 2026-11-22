import test from 'node:test';
import assert from 'node:assert/strict';
import { earnedDiscoveryCount, collectDocuments, visibleConnections, filterDocuments, archiveStorageKey, reconcileReadingState } from './discoveries.js';

const documents = [
  { id: 'price', title: 'An amended price', author: 'Iven', kind: 'notice', threads: ['road'], paragraphs: ['No iron from the closed road.'], connections: [{ id: 'order', label: 'The same shipment' }] },
  { id: 'sky', title: 'The still water', author: 'Selen', kind: 'letter', threads: ['sky'], paragraphs: ['The stars moved.'], connections: [] },
  { id: 'order', title: 'A changed destination', author: 'A clerk', kind: 'record', threads: ['road'], paragraphs: ['Three hundred lengths.'], connections: [] },
];
const order = ['price', 'sky', 'order'];

test('a new account has no invented discoveries', () => {
  assert.equal(earnedDiscoveryCount({}), 0);
  assert.deepEqual(collectDocuments(documents, order, { onboardingProgress: 10, level: 99 }), []);
});
test('old fragments preserve access when completion totals lag', () => {
  const state = { totalCompletions: 1, unlockedLore: { 0: ['first', 'second'], 1: ['third'] } };
  assert.equal(earnedDiscoveryCount(state), 3);
  assert.deepEqual(collectDocuments(documents, order, state).map(item => item.id), ['price', 'sky', 'order']);
});
test('regional keys cannot confine new discoveries to that region', () => {
  const a = collectDocuments(documents, order, { unlockedLore: { 0: ['a', 'b'] } });
  const b = collectDocuments(documents, order, { unlockedLore: { 8: ['a', 'b'] } });
  assert.deepEqual(a, b);
  assert.deepEqual(a.map(item => item.id), ['price', 'sky']);
});
test('duplicate/malformed old records do not manufacture extra findings', () => {
  assert.equal(earnedDiscoveryCount({ totalCompletions: -4, unlockedLore: { 0: ['same', 'same', '', null], 1: null, 2: 'bad' } }), 1);
  assert.equal(earnedDiscoveryCount({ totalCompletions: Infinity, unlockedLore: [] }), 0);
});
test('canonical completion totals recover missing legacy fragments and cap at the volume boundary', () => {
  assert.equal(collectDocuments(documents, order, { totalCompletions: 400 }).length, 3);
  assert.equal(collectDocuments(documents, order, { totalCompletions: '2' }).length, 2);
});
test('unfound titles and connections never enter search or related-find results', () => {
  const collected = collectDocuments(documents, order, { totalCompletions: 1 });
  assert.deepEqual(visibleConnections(documents[0], collected), []);
  assert.deepEqual(filterDocuments(collected, { query: 'destination' }), []);
  assert.equal(visibleConnections(documents[0], documents)[0].document.id, 'order');
});
test('reading state survives catalogue additions and drops inaccessible document references', () => {
  const saved = { read: ['price', 'price', 'future'], documentId: 'future', page: -8, mode: 'reading' };
  assert.deepEqual(reconcileReadingState(saved, documents), { read: ['price'], documentId: 'price', page: 0, paragraph: 0, mode: 'reading' });
  assert.equal(reconcileReadingState({ documentId: 'sky', page: 2 }, documents).documentId, 'sky');
  assert.equal(reconcileReadingState({ documentId: 'sky', paragraph: 4 }, documents).paragraph, 4);
});
test('reading positions are separated by account', () => {
  assert.notEqual(archiveStorageKey('first'), archiveStorageKey('second'));
  assert.ok(archiveStorageKey('a/b').includes('a%2Fb'));
});
