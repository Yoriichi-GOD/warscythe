import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, LockKeyhole, X } from 'lucide-react';
import { getBlessingAssets, getDeityAssets } from '../domain/deityRoster.js';
import OlympusRewardModal from './OlympusRewardModal.jsx';
import './fitnessOlympusV2.css';

function AssetImage({ src, alt, className = '' }) {
  const [missing, setMissing] = useState(false);
  if (missing) return <div className={`olympus-v2-asset-fallback ${className}`} aria-label={`${alt} artwork unavailable`} />;
  return <img src={src} alt={alt} className={className} onError={() => setMissing(true)} />;
}

function BlessingCard({ deity, blessing, isActive, onInspect }) {
  const assets = getBlessingAssets(deity.id, blessing.id);
  const state = blessing.completed
    ? 'RECOVERED'
    : isActive
      ? 'ACTIVE TRIAL'
      : 'SEALED';

  return (
    <article className={`olympus-v2-blessing ${blessing.completed ? 'is-complete' : ''} ${isActive ? 'is-active' : ''}`}>
      <div className="olympus-v2-blessing-art">
        <AssetImage
          src={blessing.completed ? assets.blessing : assets.fragment}
          alt={blessing.name}
        />
        {blessing.completed && <Check size={14} className="olympus-v2-blessing-check" />}
      </div>
      <div className="olympus-v2-blessing-copy">
        <small>{state}</small>
        <strong>{blessing.name}</strong>
        <span>{blessing.affinity} / 100 AFFINITY</span>
        <span>{blessing.fragments} / {blessing.fragmentsRequired} FRAGMENTS</span>
        {(blessing.completed || (isActive && blessing.fragments > 0)) && (
          <button type="button" onClick={onInspect}>
            {blessing.completed ? 'REPLAY PRESENTATION' : 'INSPECT FRAGMENT'}
          </button>
        )}
      </div>
    </article>
  );
}

export default function OlympusHallModal({ preview, onClose }) {
  const initialIndex = Math.max(0, preview.activeJourney?.deityIndex ?? preview.deities.findIndex(deity => !deity.ascended));
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [rewardScene, setRewardScene] = useState(null);
  const deity = preview.deities[selectedIndex];
  const assets = useMemo(() => getDeityAssets(deity.id), [deity.id]);
  const previousAscended = selectedIndex === 0 || preview.deities[selectedIndex - 1].ascended;
  const accessible = deity.ascended || (deity.unlockedByVolume && previousAscended);
  const activeBlessing = accessible && !deity.ascended ? deity.activeBlessingIndex : -1;

  const changeDeity = direction => {
    setSelectedIndex(index => Math.min(preview.deities.length - 1, Math.max(0, index + direction)));
  };

  return (
    <AnimatePresence>
      <Motion.div
        className="olympus-v2-modal-shell"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Motion.section
          className="olympus-v2-hall"
          initial={{ y: 28, scale: 0.985 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 24, scale: 0.985 }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
        >
          <header className="olympus-v2-hall-header">
            <div>
              <small>THE IRON LEDGER REMEMBERS</small>
              <h2>HALL OF OLYMPUS</h2>
              <p>A museum of the body you actually built.</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close Hall of Olympus"><X size={20} /></button>
          </header>

          <nav className="olympus-v2-deity-nav" aria-label="Olympian chambers">
            {preview.deities.map((entry, index) => (
              <button
                type="button"
                key={entry.id}
                onClick={() => setSelectedIndex(index)}
                className={index === selectedIndex ? 'is-selected' : ''}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{entry.name}</strong>
                <small>{entry.ascended ? 'ASCENDED' : entry.unlockedByVolume ? 'GATE REACHED' : `${entry.volumeGate.toLocaleString()} KG`}</small>
              </button>
            ))}
          </nav>

          <div
            className={`olympus-v2-chamber ${accessible ? 'is-accessible' : 'is-sealed'}`}
            style={{ '--deity-color': deity.palette }}
          >
            <picture className="olympus-v2-chamber-bg">
              <source media="(max-width: 720px)" srcSet={assets.chamberMobile} />
              <img src={assets.chamberDesktop} alt="" />
            </picture>
            <div className="olympus-v2-chamber-shade" />
            <AssetImage src="/fitness-v2/olympus/overlays/olympus-divine-rays.webp" alt="Divine rays" className="olympus-v2-rays" />
            <AssetImage src="/fitness-v2/olympus/overlays/olympus-cloud-floor.webp" alt="Olympian clouds" className="olympus-v2-clouds" />

            <button type="button" className="olympus-v2-chamber-arrow left" onClick={() => changeDeity(-1)} disabled={selectedIndex === 0}>
              <ChevronLeft size={20} />
            </button>
            <button type="button" className="olympus-v2-chamber-arrow right" onClick={() => changeDeity(1)} disabled={selectedIndex === preview.deities.length - 1}>
              <ChevronRight size={20} />
            </button>

            <div className="olympus-v2-statue-stage">
              <AssetImage src={assets.statue} alt={`${deity.name} statue`} className={!accessible ? 'is-locked' : ''} />
              {!accessible && (
                <AssetImage
                  src="/fitness-v2/olympus/overlays/olympus-locked-statue-veil.webp"
                  alt="Locked ceremonial veil"
                  className="olympus-v2-veil"
                />
              )}
            </div>

            <div className="olympus-v2-chamber-title">
              <small>{deity.age}</small>
              <h3>{deity.name}</h3>
              <span>{accessible ? (deity.ascended ? 'ASCENDED' : 'THE TRIAL CONTINUES') : 'CHAMBER SEALED'}</span>
            </div>

            <aside className="olympus-v2-chamber-record">
              <small>FROZEN RECORD</small>
              {deity.ascensionSnapshot ? (
                <>
                  <strong>{Math.round(deity.ascensionSnapshot.lifetimeVolume).toLocaleString()} KG</strong>
                  <span>{deity.ascensionSnapshot.validWorkouts} sessions</span>
                  <span>{deity.ascensionSnapshot.completedSets} completed sets</span>
                  <span>{new Date(deity.ascensionSnapshot.occurredAt).toLocaleDateString()}</span>
                </>
              ) : (
                <>
                  <strong>{Math.round(deity.volume).toLocaleString()} KG</strong>
                  <span>{deity.workouts} qualifying sessions</span>
                  <span>{deity.fragmentsRecovered} fragments recovered</span>
                  {!accessible && <span><LockKeyhole size={10} /> Previous passage required</span>}
                </>
              )}
              {deity.ascended && (
                <button type="button" onClick={() => setRewardScene({ type: 'ascension', deity })}>REPLAY ASCENSION</button>
              )}
            </aside>
          </div>

          <div className="olympus-v2-blessings-grid">
            {deity.blessings.map((blessing, index) => (
              <BlessingCard
                key={blessing.id}
                deity={deity}
                blessing={blessing}
                isActive={index === activeBlessing}
                onInspect={() => setRewardScene({ type: blessing.completed ? 'blessing' : 'fragment', deity, blessing })}
              />
            ))}
          </div>

          <footer className="olympus-v2-hall-footer">
            <span>RULESET {preview.ruleset.id}</span>
            <span>{preview.completedBlessings} / 15 BLESSINGS</span>
            <span>{preview.retroactiveSummary.fragments} / 317 FRAGMENTS</span>
          </footer>
          {rewardScene && <OlympusRewardModal scene={rewardScene} onClose={() => setRewardScene(null)} />}
        </Motion.section>
      </Motion.div>
    </AnimatePresence>
  );
}
