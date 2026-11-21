import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Check, Gem, X } from 'lucide-react';
import { getBlessingAssets, getDeityAssets } from '../domain/deityRoster.js';
import DeityTitleCard from '../DeityTitleCard.jsx';

export default function OlympusRewardModal({ scene, onClose }) {
  if (!scene) return null;
  const { type, deity, blessing } = scene;
  const blessingAssets = blessing ? getBlessingAssets(deity.id, blessing.id) : null;
  const deityAssets = getDeityAssets(deity.id);
  const image = type === 'ascension'
    ? deityAssets.ascension
    : type === 'blessing'
      ? blessingAssets.ceremony
      : blessingAssets.fragment;
  const title = type === 'ascension' ? 'Ascended' : blessing.name;
  const kicker = type === 'fragment'
    ? 'FRAGMENT RECOVERED'
    : type === 'blessing'
      ? `${deity.name.toUpperCase()} RECOGNIZES THE WORK`
      : 'THE DEITY REMEMBERS YOUR ASCENSION';
  const body = type === 'fragment'
    ? `A broken part of ${blessing.name} has answered the work. It is evidence, not completion.`
    : type === 'blessing'
      ? `Affinity and evidence have converged. ${deity.name} presents the completed ${blessing.name}.`
      : `All three Blessings were earned. This chamber now preserves the body that crossed ${deity.name}'s trial.`;

  return (
    <Motion.div className={`olympus-v2-reward-modal is-${type}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Motion.section initial={{ y: 20, scale: .97 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.24 }}>
        <button type="button" className="olympus-v2-reward-close" onClick={onClose} aria-label="Close Olympus reward"><X size={18} /></button>
        <div className="olympus-v2-reward-visual">
          <img className="olympus-v2-reward-rays" src="/fitness-v2/olympus/overlays/olympus-divine-rays.webp" alt="" />
          {type === 'fragment' && <img className="olympus-v2-reward-burst" src="/fitness-v2/olympus/overlays/olympus-fragment-burst.webp" alt="" />}
          {type === 'fragment' && <img className="olympus-v2-reward-pedestal" src="/fitness-v2/olympus/overlays/olympus-blessing-pedestal.webp" alt="" />}
          <img className="olympus-v2-reward-primary" src={image} alt={title} />
        </div>
        <div className="olympus-v2-reward-message">
          <small>{kicker}</small>
          {type !== 'fragment' && <DeityTitleCard deity={deity} />}
          <h3>{title}</h3>
          <p>{body}</p>
          {type === 'fragment' && blessing && (
            <div className="olympus-v2-reward-count"><Gem size={13} /> {blessing.fragments} / {blessing.fragmentsRequired} RECOVERED</div>
          )}
          <button type="button" onClick={onClose}><Check size={13} /> RETURN TO THE HALL</button>
        </div>
      </Motion.section>
    </Motion.div>
  );
}
