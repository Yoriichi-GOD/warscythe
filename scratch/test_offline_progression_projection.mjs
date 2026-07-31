import assert from 'node:assert/strict';
import { deriveOfflineLevelUpCeremonies } from '../src/store/progressionProjection.js';

const event = (id, sequence, countsForProgression = true) => ({
  eventUuid: id,
  eventType: 'operation_completed',
  sourceUuid: `task-${id}`,
  occurredAt: `2026-07-31T10:00:0${sequence}.000Z`,
  deviceSequence: sequence,
  metadata: {
    countsForProgression,
    taskTitle: `Operation ${id}`,
    taskCategory: 'WARSCYTHE // PRODUCT',
  },
});

const singleCrossing = deriveOfflineLevelUpCeremonies({
  confirmedCompletions: 4,
  confirmedLevel: 1,
  events: [event('fifth', 1)],
});
assert.equal(singleCrossing.projectedLevel, 2);
assert.deepEqual(
  singleCrossing.ceremonies.map(item => [item.eventUuid, item.previousLevel, item.newLevel]),
  [['fifth', 1, 2]]
);

const duplicateAndTutorial = deriveOfflineLevelUpCeremonies({
  confirmedCompletions: 4,
  confirmedLevel: 1,
  events: [event('fifth', 1), event('fifth', 1), event('tutorial', 2, false)],
});
assert.equal(duplicateAndTutorial.projectedCompletions, 5);
assert.equal(duplicateAndTutorial.ceremonies.length, 1);

const twoOfflineRegions = deriveOfflineLevelUpCeremonies({
  confirmedCompletions: 4,
  confirmedLevel: 1,
  events: Array.from({ length: 6 }, (_, index) => event(`offline-${index + 1}`, index + 1)),
});
assert.deepEqual(
  twoOfflineRegions.ceremonies.map(item => item.newLevel),
  [2, 3]
);

console.log('Offline progression projection tests passed.');
