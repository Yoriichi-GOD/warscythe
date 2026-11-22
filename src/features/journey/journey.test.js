import test from 'node:test';
import assert from 'node:assert/strict';
import { guideKey, initialGuide, guideStep, hasJourneyHistory } from './journey.js';
test('only accounts without real history receive the prologue', () => {
  assert.equal(initialGuide(null, {}).status, 'welcome');
  for (const state of [{hasCompletedTutorial:true},{totalCompletions:2},{rituals:[{id:'r'}]},{gymLog:[{}]},{activeWorkout:{id:'w'}},{tasks:[{id:'t'}]}]) assert.equal(initialGuide(null,state).status,'idle');
  assert.equal(hasJourneyHistory({tasks:[{id:'old',isTutorialTask:true}]}),false);
});
test('guide advances on real saved work rather than opening a form', () => {
  const guide={goal:'operation',before:['old']};
  assert.equal(guideStep(guide,{tasks:[{id:'old'}]}).done,undefined);
  assert.equal(guideStep(guide,{tasks:[{id:'new',isTutorialTask:true}]}).done,undefined);
  assert.equal(guideStep(guide,{tasks:[{id:'new',isTutorialTask:false}]}).done,true);
  assert.equal(guideStep(guide,{completedTasks:[{id:'new'}]}).done,true);
});
test('habit and workout guidance use the saved record',()=>{
  assert.equal(guideStep({goal:'habit',before:[]},{rituals:[]}).done,undefined);
  assert.equal(guideStep({goal:'habit',before:[]},{rituals:[{id:'r'}]}).done,true);
  assert.equal(guideStep({goal:'workout'},{activeWorkout:null}).target,'fitness-split-select');
  assert.equal(guideStep({goal:'workout'},{activeWorkout:{movements:[{sets:[{id:'s'}]}]}}).done,true);
  assert.equal(guideStep({goal:'workout',before:['old']},{gymLog:[{id:'old'}]}).done,undefined);
  assert.equal(guideStep({goal:'workout',before:['old']},{gymLog:[{id:'new'}]}).title,'Your session is archived.');
});
test('resuming guidance and changing accounts preserve separation',()=>{
  const saved={version:1,status:'active',goal:'operation',before:['t'],paused:true};
  assert.deepEqual(initialGuide(saved,{}),saved);
  assert.notEqual(guideKey('one'),guideKey('two'));
});
