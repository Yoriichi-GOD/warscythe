import { getAssetUrl } from './assetResolver';
import { useWarscytheStore } from '../store/useWarscytheStore';

class AudioManager {
  constructor() {
    this.currentAudio = null;
    this.nextAudio = null;
    this.volume = 0.7; // default 70%
    this.enabled = false;
    this.currentTrackName = null;
    this.fadeInterval = null;
  }

  getTrackForRegion(regionIdx) {
    const state = useWarscytheStore.getState();
    const activeTheme = state.activeTheme;

    // Premium themes override standard regional soundscapes
    if (activeTheme === 'shiva') {
      return 'theme-shiva.mp3.mp3';
    }
    if (activeTheme === 'lava') {
      return 'theme-lava.mp3.mp3';
    }

    // Standard regional soundscapes (regionIdx is 0-indexed, level is 1-indexed)
    const levelNum = Number(regionIdx) + 1;
    switch (levelNum) {
      case 1: return 'region-1-ashwood.mp3.mp3';
      case 2: return 'region-2-ashenveil.mp3.mp3';
      case 3: return 'region-3-frostmere.mp3.mp3';
      case 4: return 'region-4-shadowfen.mp3.mp3';
      case 5: return 'region-5-oasis.mp3.mp3';
      case 6: return 'region-6-aureliuskeep.mp3.mp3';
      case 7: return 'region-7-bonehollow.mp3.mp3';
      case 8: return 'region-8-stormspire.mp3.mp3';
      case 9: return 'region-9-abyss.mp3.mp3';
      case 10: return 'region-10-titansrest.mp3.mp3';
      default: return 'region-1-ashwood.mp3.mp3';
    }
  }

  setEnabled(enabled) {
    this.enabled = !!enabled;
    if (!this.enabled) {
      this.stopAll();
    } else if (this.currentTrackName) {
      this.playTrack(this.currentTrackName);
    }
  }

  setVolume(volume) {
    this.volume = Math.min(Math.max(volume / 100, 0), 1);
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }

  stopAll() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
      } catch (e) {
        console.warn('Audio pause error:', e);
      }
      this.currentAudio = null;
    }
    if (this.nextAudio) {
      try {
        this.nextAudio.pause();
      } catch (e) {
        console.warn('Audio pause error:', e);
      }
      this.nextAudio = null;
    }
    this.currentTrackName = null;
  }

  playRegion(regionIdx) {
    const trackName = this.getTrackForRegion(regionIdx);
    if (!this.enabled) {
      this.currentTrackName = trackName;
      return;
    }
    this.playTrack(trackName);
  }

  playTrack(trackName) {
    if (this.currentTrackName === trackName && this.currentAudio && !this.currentAudio.paused) {
      return; // Already playing this track
    }

    const nextTrackUrl = getAssetUrl(`/soundscapes/${trackName}`);
    this.currentTrackName = trackName;

    // Initialize next audio element
    const audio = new Audio(nextTrackUrl);
    audio.loop = true;
    audio.volume = 0; // Start silent for crossfade

    this.nextAudio = audio;

    // Handle play trigger
    audio.play().then(() => {
      this.crossfade();
    }).catch(err => {
      console.warn(`Could not load/play soundscape: ${trackName}. Fallback to silence. Error:`, err);
      // Clean up if load fails (e.g. offline and not cached)
      if (this.currentAudio) {
        this.currentAudio.volume = this.volume; // Keep current playing if it exists
      }
      this.nextAudio = null;
    });
  }

  crossfade() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }

    const fadeStep = 0.05;
    const fadeIntervalMs = 100;
    const targetVolume = this.volume;

    this.fadeInterval = setInterval(() => {
      let currentDone = false;
      let nextDone = false;

      // Fade out current audio
      if (this.currentAudio) {
        const curVol = Math.max(this.currentAudio.volume - fadeStep, 0);
        this.currentAudio.volume = curVol;
        if (curVol <= 0) {
          try {
            this.currentAudio.pause();
          } catch (e) {}
          currentDone = true;
        }
      } else {
        currentDone = true;
      }

      // Fade in next audio
      if (this.nextAudio) {
        const nextVol = Math.min(this.nextAudio.volume + fadeStep, targetVolume);
        this.nextAudio.volume = nextVol;
        if (nextVol >= targetVolume) {
          nextDone = true;
        }
      } else {
        nextDone = true;
      }

      if (currentDone && nextDone) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        this.currentAudio = this.nextAudio;
        this.nextAudio = null;
      }
    }, fadeIntervalMs);
  }
}

export const audioManager = new AudioManager();
