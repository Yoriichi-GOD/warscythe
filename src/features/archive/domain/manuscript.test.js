import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const volume = JSON.parse(readFileSync(new URL('../data/volumeOne.json',import.meta.url),'utf8'));
test('the first volume has 48 unique, fully authored discoveries with no dangling links',()=>{
  const ids=new Set(volume.documents.map(document=>document.id));
  assert.equal(ids.size,48);
  assert.equal(new Set(volume.discoveryOrder).size,48);
  assert.deepEqual(new Set(volume.discoveryOrder),ids);
  for(const document of volume.documents){
    assert.ok(document.title&&document.author&&document.date&&document.paragraphs.length>=3,document.id);
    assert.ok(document.paragraphs.join(' ').split(/\s+/).length>=60,document.id);
    for(const link of document.connections)assert.ok(ids.has(link.id)&&link.id!==document.id,document.id+' -> '+link.id);
    for(const thread of document.threads)assert.ok(volume.threads[thread],thread);
  }
});
test('the manuscript is one connected network with a cross-world opening',()=>{
  const graph=new Map(volume.documents.map(document=>[document.id,new Set(document.connections.map(link=>link.id))]));
  for(const[id,edges]of graph)for(const edge of edges)graph.get(edge).add(id);
  const visited=new Set(),queue=[volume.discoveryOrder[0]];
  while(queue.length){const id=queue.shift();if(visited.has(id))continue;visited.add(id);queue.push(...graph.get(id));}
  assert.equal(visited.size,48);
  const opening=volume.discoveryOrder.slice(0,5).map(id=>volume.documents.find(document=>document.id===id));
  assert.ok(new Set(opening.map(document=>document.author)).size>=4);
  assert.ok(new Set(opening.flatMap(document=>document.threads)).size>=4);
});
