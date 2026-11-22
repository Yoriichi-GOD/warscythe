import test from 'node:test';
import assert from 'node:assert/strict';
import { BASE_ARTIFACTS } from '../store/constants.js';
import { ARTIFACT_VARIANT_TOTAL, getArtifactCollection, getCurrentArtifactVariantCount } from './artifactCollection.js';
test('the displayed denominator follows the actual catalogue',()=>{
  assert.equal(BASE_ARTIFACTS.length,30);
  assert.equal(ARTIFACT_VARIANT_TOTAL,150);
  const all=BASE_ARTIFACTS.flatMap(artifact=>['common','uncommon','rare','epic','mythic'].map(rarity=>({...artifact,rarity})));
  assert.equal(getCurrentArtifactVariantCount(all),ARTIFACT_VARIANT_TOTAL);
});
test('repeat acquisitions do not increase unique progress; legacy items stay in history',()=>{
  const artifact={...BASE_ARTIFACTS[0],rarity:'epic',rewardEventId:'one'};
  const records=[artifact,{...artifact,rewardEventId:'two'},{name:'A retired name',rarity:'rare',rewardEventId:'old'}];
  assert.equal(getCurrentArtifactVariantCount(records),1);
  assert.equal(getArtifactCollection(records).length,2);
  assert.equal(getArtifactCollection(records).reduce((total,item)=>total+item.recoveries.length,0),3);
});
