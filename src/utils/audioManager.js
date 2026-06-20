import { getAssetUrl } from './assetResolver';

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
    // Map regions dynamically based on index and visual theme
    const idx = Number(regionIdx);
    if (idx === 0 || idx === 1) {
      return 'soundscape-ashwood.ogg';
    } else if (idx === 2 || idx === 6 || idx === 10 || idx === 23) {
      return 'soundscape-lava.ogg';
    } else if (idx === 3 || idx === 5 || idx === 21) {
      return 'soundscape-cathedral.ogg';
    } else if (idx === 4 || idx === 8 || idx === 20) {
      return 'soundscape-kailash.ogg';
    } else {
      return 'soundscape-sanctuary.ogg';
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
