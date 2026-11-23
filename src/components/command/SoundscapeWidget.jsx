import { useSyncExternalStore } from 'react';
import { Info } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';
import { useWarscytheStore } from '../../store/useWarscytheStore';
import { REGIONS } from '../../store/constants';
import WorldSelect from '../WorldSelect';
import './soundscape.css';

export default function SoundscapeWidget({ enabled, onEnabledChange, activeTheme, children }) {
  const playback = useSyncExternalStore(audioManager.subscribe, audioManager.getSnapshot, audioManager.getSnapshot);
  const region = playback.regionIndex;
  const retry = enabled && (playback.error || ['blocked', 'error', 'paused'].includes(playback.status));
  const message = playback.error ? (playback.playing ? 'Previous soundscape continues · retry switch' : 'Could not play · tap to retry')
    : { off:'Soundscape paused', loading:'Loading soundscape…', muted:'Volume is at zero', paused:'Tap to resume', playing:'Playing' }[playback.status];
  const toggle = () => {
    if (retry) { audioManager.retry(); return; }
    audioManager.setEnabled(!enabled);
    onEnabledChange(!enabled);
  };
  return <div id="onboarding-soundscape" className={`cc-soundscape soundscape-widget elite-panel p-4 flex flex-col items-center justify-between gap-1 motion-control relative ${enabled ? 'border-gold-core/40' : 'border-white/5'}`} data-playback={playback.status}>
    <span className="cc-compact-corner" aria-hidden="true"><img src="/frames/universal/compact.webp" alt=""/></span>
    {children}
    <div className="soundscape-heading"><span>Soundscape</span><button type="button" aria-label="Soundscape information" onClick={() => useWarscytheStore.getState().openInfoModal('atmosphere')}><Info size={14} aria-hidden="true"/></button></div>
    <button type="button" className="soundscape-toggle" onClick={toggle} aria-label={retry ? 'Retry soundscape' : enabled ? 'Pause soundscape' : 'Play soundscape'} aria-pressed={enabled} aria-busy={playback.status === 'loading'}>
      <img src="/soundscape-jukebox.webp" alt="Soundscape Jukebox" className={playback.playing ? 'soundscape-spinning' : ''} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/command-core.webp'; }}/>
    </button>
    <span className="soundscape-status" role="status">{message}</span>
    <div className="soundscape-region"><WorldSelect menuClassName="soundscape-menu" label="Soundscape region" value={String(region)} direction="bottom" options={REGIONS.map((item,index) => ({ value:String(index), label:item.name }))} onChange={value => { audioManager.playRegion(Number(value),activeTheme); }}/></div>
  </div>;
}
