import { setImmediate } from 'node:timers';
import test from 'node:test';
import assert from 'node:assert/strict';
import { AudioManager } from './audioManager.js';

function setup() {
  const audios = [], timers = new Map();
  class FakeAudio extends EventTarget {
    constructor(url) { super(); this.src = url; this.paused = true; this.volume = 0; this.muted = false; this.error = null; }
    play() { return new Promise((resolve, reject) => { this.start = () => { this.paused = false; this.dispatchEvent(new Event('playing')); resolve(); }; this.reject = reject; }); }
    pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
    removeAttribute() {}
    load() {}
  }
  const manager = new AudioManager({ createAudio: url => { const audio = new FakeAudio(url); audios.push(audio); return audio; }, resolveUrl: path => path, setTimer: fn => { const id = Symbol(); timers.set(id, fn); return id; }, clearTimer: id => timers.delete(id) });
  const tick = () => { for (let i = 0; i < 12; i++) for (const fn of [...timers.values()]) fn(); };
  const flush = () => new Promise(resolve => setImmediate(resolve));
  return { manager, audios, timers, tick, flush, FakeAudio };
}

test('enabled preference cannot advertise playback before media starts or after failure', async () => {
  const { manager:m, audios, flush } = setup();m.playRegion(0);m.setEnabled(true);
  assert.equal(m.getSnapshot().status, 'loading');assert.equal(m.getSnapshot().playing, false);
  audios[0].reject(Object.assign(new Error('Tap to start playback.'), { name:'NotAllowedError' }));await flush();
  assert.equal(m.getSnapshot().status,'blocked');assert.equal(m.getSnapshot().playing,false);
  m.retry();audios[1].start();await flush();assert.equal(m.getSnapshot().playing,true);m.stopAll();
});
test('enable plus the application region effect shares one pending request', () => {
  const {manager:m,audios}=setup();m.playRegion(0);m.setEnabled(true);m.playRegion(0);m.setEnabled(true);assert.equal(audios.length,1);m.stopAll();
});
test('late rejection of an old selection cannot discard the newly selected audio', async () => {
  const {manager:m,audios,flush}=setup();m.setEnabled(true);m.playTrack('old.mp3');m.playTrack('selected.mp3');
  audios[0].reject(new Error('Old request failed late'));await flush();audios[1].start();await flush();
  assert.equal(m.currentAudio,audios[1]);assert.equal(m.getSnapshot().playing,true);assert.equal(m.getSnapshot().error,null);m.stopAll();
});
test('disabling invalidates a late successful play callback', async () => {
  const {manager:m,audios,timers,flush}=setup();m.setEnabled(true);m.playRegion(0);m.setEnabled(false);audios[0].start();await flush();
  assert.equal(m.currentAudio,null);assert.equal(m.nextAudio,null);assert.equal(timers.size,0);assert.equal(m.getSnapshot().status,'off');
  assert.equal(audios[0].paused,true);
});
test('buffering, pause and zero volume stop the playing indicator; recovery restores it', async () => {
  const {manager:m,audios,flush}=setup();m.setEnabled(true);m.playRegion(0);const a=audios[0];a.start();await flush();
  a.dispatchEvent(new Event('waiting'));assert.equal(m.getSnapshot().playing,false);
  a.dispatchEvent(new Event('playing'));assert.equal(m.getSnapshot().playing,true);
  m.setVolume(0);assert.equal(m.getSnapshot().status,'muted');m.setVolume(35);assert.equal(m.getSnapshot().playing,true);
  a.pause();assert.equal(m.getSnapshot().status,'paused');m.stopAll();
});
test('crossfade failure keeps the previous track audible and can retry', async () => {
  const {manager:m,audios,flush,tick}=setup();m.setEnabled(true);m.playRegion(0);audios[0].start();await flush();m.playRegion(1);
  audios[1].reject(new Error('Unavailable'));await flush();assert.equal(m.currentAudio,audios[0]);assert.equal(m.getSnapshot().playing,true);
  m.retry();audios[2].start();await flush();tick();assert.equal(m.currentAudio,audios[2]);assert.equal(audios[0].paused,true);assert.equal(m.getSnapshot().error,null);m.stopAll();
});
test('volume changes preserve the chosen soundscape and finish the fade at the new volume', async () => {
  const {manager:m,audios,flush,tick}=setup();m.setEnabled(true);m.playRegion(0);audios[0].start();await flush();m.playRegion(2);audios[1].start();await flush();
  m.setVolume(23);tick();assert.equal(audios.length,2);assert.equal(m.currentTrackName,'region-3-frostmere.mp3.mp3');assert.equal(m.getSnapshot().regionIndex,2);assert.equal(m.currentAudio.volume,.23);m.stopAll();
});
test('stopping releases both tracks and all media listeners and fade timers', async () => {
  const {manager:m,audios,timers,flush}=setup();m.setEnabled(true);m.playRegion(0);audios[0].start();await flush();m.playRegion(1);audios[1].start();await flush();m.stopAll();
  assert.equal(timers.size,0);assert.equal(m.media.size,0);assert(audios.every(a=>a.paused));assert.equal(m.getSnapshot().playing,false);
});
test('failure of the old playing track does not cancel its pending replacement', async () => {
  const {manager:m,audios,flush}=setup();m.setEnabled(true);m.playRegion(0);audios[0].start();await flush();m.playRegion(1);
  audios[0].error={code:2};audios[0].dispatchEvent(new Event('error'));assert.equal(m.getSnapshot().playing,false);
  audios[1].start();await flush();assert.equal(m.currentAudio,audios[1]);assert.equal(m.getSnapshot().playing,true);m.stopAll();
});

test('a promoted playing track survives its old play promise settling late', async()=>{
  const {manager:m,audios,flush,tick}=setup();m.setEnabled(true);m.playRegion(0);audios[0].start();m.playRegion(1);await flush();assert.equal(m.currentAudio,audios[0]);assert.equal(audios[0].paused,false);audios[1].start();await flush();tick();assert.equal(m.currentAudio,audios[1]);m.stopAll();
});



test('default browser timers retain the Window receiver during crossfade and cleanup', async()=>{
  const {FakeAudio}=setup(), audios=[], callbacks=new Map(), savedSet=globalThis.setInterval,savedClear=globalThis.clearInterval;
  globalThis.setInterval=function(callback){assert.equal(this,globalThis);const id=Symbol();callbacks.set(id,callback);return id};
  globalThis.clearInterval=function(id){assert.equal(this,globalThis);callbacks.delete(id)};
  let m;
  try{
    m=new AudioManager({createAudio:url=>{const a=new FakeAudio(url);audios.push(a);return a},resolveUrl:path=>path});
    m.setEnabled(true);const first=m.playRegion(0);audios[0].start();await first;
    const second=m.playRegion(1);audios[1].start();await second;assert.equal(m.getSnapshot().error,null);assert.equal(callbacks.size,1);
    for(let i=0;i<12;i++)for(const callback of [...callbacks.values()])callback();
    assert.equal(m.currentAudio,audios[1]);assert.equal(callbacks.size,0);
  }finally{m?.stopAll();globalThis.setInterval=savedSet;globalThis.clearInterval=savedClear}
});
