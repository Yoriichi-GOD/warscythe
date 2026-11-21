import React, { useMemo, useState } from 'react';
import { Landmark, LockKeyhole, Search, ShieldCheck } from 'lucide-react';
import { buildFitnessRewardPreview } from '../domain/rewardEngine.js';
import { getBlessingAssets } from '../domain/deityRoster.js';
import OlympusHallModal from './OlympusHallModal.jsx';
import './fitnessOlympusV2.css';

export default function FitnessOlympusPreview({ gymLog }) {
  const preview = useMemo(() => buildFitnessRewardPreview(gymLog), [gymLog]);
  const [showHall, setShowHall] = useState(false);
  const journey = preview.activeJourney;
  const deity = journey?.deity;
  const blessing = journey?.blessing;
  const blessingAssets = deity && blessing ? getBlessingAssets(deity.id, blessing.id) : null;
  const affinity = blessing?.affinity || 0;
  const fragments = blessing?.fragments || 0;
  const fragmentTarget = blessing?.fragmentsRequired || 0;
  const state = !journey
    ? preview.nextVolumeGate
      ? 'VOLUME GATE SEALED'
      : 'PANTHEON COMPLETE'
    : affinity >= 100 && fragments < fragmentTarget
      ? 'RECOGNIZED // RELIC INCOMPLETE'
      : fragments >= fragmentTarget && affinity < 100
        ? 'RELIC REASSEMBLED // RECOGNITION PENDING'
        : 'ACTIVE BLESSING JOURNEY';

  return (
    <>
      <section className="olympus-v2-panel" style={{ '--deity-color': deity?.palette || '#d8c078' }}>
        <div className="olympus-v2-panel-kicker">
          <span><Landmark size={13} /> OLYMPUS // PREVIEW LEDGER</span>
          <small>{preview.ruleset.id}</small>
        </div>

        <div className="olympus-v2-panel-heading">
          <small>{deity?.age || 'THE MORTAL THRESHOLD'}</small>
          <h3>{deity?.name || preview.nextVolumeGate?.name || 'Olympus'}</h3>
          <p>{state}</p>
        </div>

        {journey ? (
          <div className="olympus-v2-active-reward">
            <div
              className="olympus-v2-affinity-dial"
              style={{ '--affinity': `${affinity * 3.6}deg`, '--deity-color': deity.palette }}
            >
              <img src="/fitness-v2/olympus/overlays/olympus-affinity-ring.webp" alt="" />
              <div>
                <strong>{affinity}</strong>
                <small>/ 100 AFFINITY</small>
              </div>
            </div>
            <div className="olympus-v2-reward-copy">
              <small>CURRENT BLESSING</small>
              <strong>{blessing.name}</strong>
              <span>{fragments} / {fragmentTarget} FRAGMENTS RECOVERED</span>
              <div className="olympus-v2-progress-track"><i style={{ width: `${Math.min(100, fragmentTarget ? (fragments / fragmentTarget) * 100 : 0)}%` }} /></div>
            </div>
            {blessingAssets && <img className="olympus-v2-fragment" src={blessingAssets.fragment} alt={`${blessing.name} fragment`} />}
          </div>
        ) : (
          <div className="olympus-v2-sealed-gate">
            <LockKeyhole size={24} />
            <div>
              <strong>{preview.nextVolumeGate ? `${preview.nextVolumeGate.volumeGate.toLocaleString()} KG REQUIRED` : 'ALL FIVE DEITIES ASCENDED'}</strong>
              <span>{preview.nextVolumeGate ? `${Math.max(0, preview.nextVolumeGate.volumeGate - preview.totals.lifetimeVolume).toLocaleString()} kg remain before the first passage.` : 'The Hall remembers the completed body.'}</span>
            </div>
          </div>
        )}

        <div className="olympus-v2-recognition-summary">
          <div><small>AFFINITY RECOGNIZED</small><strong>{preview.retroactiveSummary.affinity}</strong></div>
          <div><small>FRAGMENTS</small><strong>{preview.retroactiveSummary.fragments}</strong></div>
          <div><small>BLESSINGS</small><strong>{preview.completedBlessings} / 15</strong></div>
        </div>

        <button type="button" className="olympus-v2-enter" onClick={() => setShowHall(true)}>
          <Search size={13} /> INSPECT THE HALL OF OLYMPUS
        </button>

        <div className="olympus-v2-integrity">
          <ShieldCheck size={12} />
          <span>{preview.diagnostics.accepted} canonical workouts examined</span>
          {(preview.diagnostics.duplicates > 0 || preview.diagnostics.invalid > 0) && (
            <small>{preview.diagnostics.duplicates} duplicates ignored · {preview.diagnostics.invalid} empty records ignored</small>
          )}
        </div>
      </section>

      {showHall && <OlympusHallModal preview={preview} onClose={() => setShowHall(false)} />}
    </>
  );
}
