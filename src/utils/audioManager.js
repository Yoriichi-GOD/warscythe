import { getAssetUrl } from './assetResolver.js';

const REGION_TRACKS = ['ashwood', 'ashenveil', 'frostmere', 'shadowfen', 'oasis', 'aureliuskeep', 'bonehollow', 'stormspire', 'abyss', 'titansrest'];

export class AudioManager {
  constructor({ createAudio = url => new Audio(url), resolveUrl = getAssetUrl, setTimer = (callback, delay) => globalThis.setInterval(callback, delay), clearTimer = id => globalThis.clearInterval(id) } = {}) {
    Object.assign(this, { createAudio, resolveUrl, setTimer, clearTimer });
    this.currentAudio = null;
    this.nextAudio = null;
    this.currentTrackName = null;
    this.regionIndex = 0;
    this.volume = .7;
    this.enabled = false;
    this.request = 0;
    this.pending = null;
    this.fadeInterval = null;
    this.fadeProgress = 0;
    this.error = null;
    this.media = new Map();
    this.listeners = new Set();
    this.snapshot = { status: 'off', playing: false, trackName: null, regionIndex: 0, error: null };
  }

  subscribe = listener => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  getSnapshot = () => this.snapshot;

  getTrackForRegion(regionIdx, activeTheme) {
    if (activeTheme === 'shiva' || activeTheme === 'lava') return `theme-${activeTheme}.mp3.mp3`;
    const index = Number(regionIdx);
    return REGION_TRACKS[index] ? `region-${index + 1}-${REGION_TRACKS[index]}.mp3.mp3` : 'region-1-ashwood.mp3.mp3';
  }

  audible(audio) {
    return !!audio && !audio.paused && !audio.muted && !audio.error && audio.volume > 0 && !this.media.get(audio)?.waiting;
  }

  publish() {
    const playing = this.enabled && (this.audible(this.currentAudio) || this.audible(this.nextAudio));
    const media = this.currentAudio || this.nextAudio;
    const status = !this.enabled ? 'off' : playing ? 'playing'
      : this.error && !this.pending ? (this.error.name === 'NotAllowedError' ? 'blocked' : 'error')
      : media && (this.volume === 0 || media.muted) ? 'muted'
      : this.pending || this.media.get(media)?.waiting ? 'loading' : 'paused';
    const next = { status, playing, trackName: this.media.get(this.currentAudio)?.name || this.currentTrackName, regionIndex:this.regionIndex, error: this.error?.message || null };
    if (Object.keys(next).every(key => next[key] === this.snapshot[key])) return;
    this.snapshot = next;
    this.listeners.forEach(listener => listener());
  }

  setEnabled(enabled) {
    const next = !!enabled;
    if (next === this.enabled) return;
    this.enabled = next;
    if (!next) this.stopAll();
    else if (this.currentTrackName) this.playTrack(this.currentTrackName);
    else this.publish();
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, Number(volume) / 100 || 0));
    if (this.currentAudio) this.currentAudio.volume = this.volume * (this.fadeInterval ? 1 - this.fadeProgress : 1);
    if (this.nextAudio) this.nextAudio.volume = this.volume * (this.fadeInterval ? this.fadeProgress : this.currentAudio ? 0 : 1);
    this.publish();
  }

  cancelFade() {
    if (this.fadeInterval !== null) this.clearTimer(this.fadeInterval);
    this.fadeInterval = null;
    this.fadeProgress = 0;
  }

  release(audio) {
    if (!audio) return;
    this.media.get(audio)?.cleanup();
    this.media.delete(audio);
    audio.pause();
    audio.removeAttribute?.('src');
    audio.load?.();
  }

  stopAll() {
    this.enabled = false;
    this.request++;
    this.cancelFade();
    const current = this.currentAudio, next = this.nextAudio;
    this.currentAudio = this.nextAudio = this.pending = null;
    this.error = null;
    this.release(current); this.release(next);
    this.publish();
  }

  playRegion(regionIdx, activeTheme) { this.regionIndex = Number.isInteger(Number(regionIdx)) ? Number(regionIdx) : 0; return this.playTrack(this.getTrackForRegion(regionIdx, activeTheme)); }
  retry() { if (this.enabled && this.currentTrackName) return this.playTrack(this.currentTrackName); }

  playTrack(trackName) {
    this.currentTrackName = trackName;
    if (!this.enabled) { this.publish(); return Promise.resolve(); }
    if (this.pending?.name === trackName) return this.pending.promise;
    if (this.media.get(this.currentAudio)?.name === trackName && !this.currentAudio.paused && !this.currentAudio.error) {
      this.error = null; this.setVolume(this.volume * 100); return Promise.resolve();
    }
    this.request++;
    const request = this.request;
    this.cancelFade();
    if (this.nextAudio) {
      const previous = this.nextAudio; this.nextAudio = null;
      if (this.audible(previous)) { this.release(this.currentAudio); this.currentAudio = previous; }
      else this.release(previous);
    }
    if (this.currentAudio) this.currentAudio.volume = this.volume;
    const audio = this.createAudio(this.resolveUrl(`/soundscapes/${trackName}`));
    audio.loop = true; audio.preload = 'auto'; audio.volume = this.currentAudio ? 0 : this.volume;
    this.nextAudio = audio;
    this.error = null;
    const state = { name: trackName, waiting: true };
    const relevant = () => this.currentAudio === audio || this.nextAudio === audio;
    const update = event => {
      if (!relevant()) return;
      if (event.type === 'playing') state.waiting = false;
      if (event.type === 'waiting' || (event.type === 'stalled' && audio.readyState < 3)) state.waiting = true;
      if (event.type === 'pause' || event.type === 'ended') state.waiting = false;
      this.publish();
    };
    const fail = error => {
      if (!relevant() || request !== this.request) return;
      this.cancelFade(); this.pending = null;
      if (this.nextAudio === audio) this.nextAudio = null;
      if (this.currentAudio === audio) this.currentAudio = null;
      this.release(audio);
      if (this.currentAudio) this.currentAudio.volume = this.volume;
      this.error = error;
      this.publish();
    };
    const mediaError = () => {
      // The previous track can fail while its replacement is still loading.
      if (this.currentAudio === audio && request !== this.request && this.nextAudio) {
        this.currentAudio = null; this.release(audio); this.publish(); return;
      }
      fail(new Error('This soundscape could not load. Try again.'));
    };
    const events = ['playing', 'waiting', 'stalled', 'pause', 'ended', 'volumechange'];
    events.forEach(name => audio.addEventListener(name, update));
    audio.addEventListener('error', mediaError);
    state.cleanup = () => { events.forEach(name => audio.removeEventListener(name, update)); audio.removeEventListener('error', mediaError); };
    this.media.set(audio, state);
    // Claim the request before play(): a browser can emit media events immediately.
    const pending = { name: trackName, promise: null };
    this.pending = pending;
    this.publish();
    try {
      pending.promise = Promise.resolve(audio.play()).then(() => {
        if (request !== this.request || this.nextAudio !== audio || !this.enabled) { if (audio !== this.currentAudio && audio !== this.nextAudio) this.release(audio); return; }
        state.waiting = false;
        if (!this.currentAudio) {
          this.currentAudio = audio; this.nextAudio = this.pending = null; audio.volume = this.volume; this.publish();
        } else this.crossfade(audio, request);
      }).catch(fail);
    } catch (error) { fail(error); pending.promise = Promise.resolve(); }
    return pending.promise;
  }

  crossfade(audio, request) {
    this.cancelFade();
    this.fadeInterval = this.setTimer(() => {
      if (!this.enabled || request !== this.request || this.nextAudio !== audio) { this.cancelFade(); return; }
      this.fadeProgress = Math.min(1, this.fadeProgress + .1);
      if (this.currentAudio) this.currentAudio.volume = this.volume * (1 - this.fadeProgress);
      audio.volume = this.volume * this.fadeProgress;
      if (this.fadeProgress >= 1) {
        const previous = this.currentAudio;
        this.currentAudio = audio; this.nextAudio = this.pending = null;
        this.cancelFade(); this.release(previous);
      }
      this.publish();
    }, 80);
  }
}

export const audioManager = new AudioManager();
