import test from 'node:test';
import assert from 'node:assert/strict';
import {createRewardQueue,describeReward} from './presentation.js';

test('rapid rewards remain ordered and retries cannot re-enqueue a credited event',()=>{
  const first={eventId:'one',totalPts:100},second={eventId:'two',totalPts:250};
  const queue=createRewardQueue(first);assert.equal(queue.accept(second),true);
  assert.equal(queue.accept({...first}),false);assert.deepEqual(queue.getSnapshot(),[first,second]);
  assert.equal(queue.finish(second),false);assert.equal(queue.finish(first),true);
  assert.equal(queue.finish(first),false);assert.deepEqual(queue.getSnapshot(),[second]);
  assert.equal(queue.accept(first),false);assert.equal(queue.finish(second),true);
  assert.deepEqual(queue.getSnapshot(),[]);assert.equal(first.totalPts,100);assert.equal(second.totalPts,250);
});
test('legacy rewards without event identifiers retain object identity and emit only real changes',()=>{
  const reward={taskTitle:'Legacy find'},queue=createRewardQueue(reward);let updates=0;
  const unsubscribe=queue.subscribe(()=>updates++);
  assert.equal(queue.accept(reward),false);assert.equal(queue.accept(null),false);
  const next={taskTitle:'Another legacy find'};queue.accept(next);queue.finish(reward);
  assert.equal(updates,2);unsubscribe();queue.finish(next);assert.equal(updates,2);
});
test('presentation preserves recorded numbers, legacy artwork and a stable world context',()=>{
  const reward={eventId:'earned',reward:{rarity:'rare',artifact:{name:'Iron Quill'}},totalPts:175,coinsAwarded:26};
  assert.equal(describeReward(reward).image,'/artifacts/artifact-tome.webp');
  assert.equal(describeReward(reward).xp,175);assert.equal(describeReward(reward).coins,26);
  assert.equal(describeReward({...reward}).scene,describeReward(reward).scene);
  assert.equal(describeReward({...reward,scene:'not-a-scene'}).scene,describeReward(reward).scene);
  assert.equal(describeReward({}).xp,null);
});
test('first finds, bosses and new high-rarity discoveries earn the full reveal without slowing routine repeats',()=>{
  assert.equal(describeReward({isFirstReward:true}).major,true);
  assert.equal(describeReward({isBoss:true}).major,true);
  assert.equal(describeReward({reward:{rarity:'epic'},isNewVariant:true}).major,true);
  assert.equal(describeReward({reward:{rarity:'epic'},isNewVariant:false}).major,false);
  assert.equal(describeReward({reward:{rarity:'common'}}).major,false);
  assert.equal(describeReward({preview:true,previewFull:false,scene:'dispatch'}).scene,'dispatch');
});
