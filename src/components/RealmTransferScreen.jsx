import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { REGIONS } from '../store/constants';
import { getAssetUrl } from '../utils/assetResolver';

const DRAGON_TYPES = [
  'wyrm', 'lava', 'frost', 'shadow', 'wyvern',
  'celestial', 'skeletal', 'storm', 'abyssal', 'ancient'
];

const DRAGON_NAMES = [
  'Malgrath the Dread', 'Stoneback Krul', 'Glacius the Eternal', 'Vreth the Unseen',
  'Ignarax the Burning', 'Sol-Varen the Radiant', 'Duskbone Revenant', 'Thundercoil Zarak',
  'Nyxara the Void', 'Gorvek the Ancient'
];

const EMPRESS_NAMES = [
  'Empress Dryad of Ashwood', 'Empress Pyra of the Caldera', 'Empress Frost of Glacius Peak',
  'Empress Vreth of Shadowfen', 'Empress Jade of the Oasis', 'Empress Zephyr of Cloudspire',
  'Empress Spectral of the Deeps', 'Empress Lira of Mirewood', 'Empress Cosma of the Void',
  'Empress Sol of the Golden Citadel'
];

export default function RealmTransferScreen({ regionData, onClose }) {
  const [beat, setBeat] = useState(0);
  const currentIndex = Math.max(1, Number(regionData?.mapIndex) || 1);
  const nextIndex = Math.min(10, currentIndex + 1);
  const hasNext = currentIndex < 10;

  const currentRegion = REGIONS[currentIndex - 1]?.name || `Region ${currentIndex}`;
  const nextRegion = REGIONS[nextIndex - 1]?.name || `Region ${nextIndex}`;
  const currentDragon = DRAGON_NAMES[currentIndex - 1];
  const nextDragon = DRAGON_NAMES[nextIndex - 1];
  const currentEmpress = EMPRESS_NAMES[currentIndex - 1];
  const nextEmpress = EMPRESS_NAMES[nextIndex - 1];

  const advance = () => {
    if (!hasNext || beat >= 2) onClose();
    else setBeat(value => Math.min(2, value + 1));
  };

  const beatCopy = [
    {
      eyebrow: `REGION ${currentIndex} // SOVEREIGNTY RESTORED`,
      title: `${currentRegion} Liberated`,
      subtitle: `${currentEmpress} walks free`,
      body: `${currentDragon} has fallen. The realm no longer answers to fear.`,
      action: 'OPEN THE PASSAGE'
    },
    {
      eyebrow: 'REALM TRANSFER // CREST RESONANCE',
      title: 'The Frontier Shifts',
      subtitle: `${currentRegion} yields the road to ${nextRegion}`,
      body: 'The conquered crest is sealed into your campaign. Beyond the fracture, another sovereign threat awakens.',
      action: 'CROSS THE FRACTURE'
    },
    {
      eyebrow: `REGION ${nextIndex} // THREAT ACQUIRED`,
      title: `Entering ${nextRegion}`,
      subtitle: `${nextDragon} rules this territory`,
      body: `${nextEmpress} remains imprisoned. Recover five elemental keys and break the new sovereign.`,
      action: 'ENTER THE NEW REALM'
    }
  ][hasNext ? beat : 0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`realm-transfer beat-${beat}`}
    >
      <div
        className="realm-landscape old-landscape"
        style={{ backgroundImage: `url('${getAssetUrl(`/maps/campaign-map-${currentIndex}.png`)}')` }}
      />
      {hasNext && (
        <div
          className="realm-landscape new-landscape"
          style={{ backgroundImage: `url('${getAssetUrl(`/maps/campaign-map-${nextIndex}.png`)}')` }}
        />
      )}
      <div className="realm-vignette" />

      <AnimatePresence mode="wait">
        {beat === 0 && (
          <motion.div
            key="conquered"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100, filter: 'blur(8px)' }}
            className="character-stage conquered-stage"
          >
            <img
              src={getAssetUrl(`/dragons/dragon-${DRAGON_TYPES[currentIndex - 1]}.png`)}
              alt=""
              className="defeated-dragon"
            />
            <img
              src={getAssetUrl(`/fairies/empress-${currentIndex}-liberated.png`)}
              alt={currentEmpress}
              className="liberated-empress"
            />
            <div className="eliminated-stamp">ELIMINATED</div>
            <div className="character-seal liberated-seal">LIBERATED</div>
          </motion.div>
        )}

        {beat === 1 && hasNext && (
          <motion.div
            key="fracture"
            initial={{ opacity: 0, scale: .92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            className="fracture-stage"
          >
            <motion.img
              src="/transitions/realm-fracture.png"
              alt=""
              className="fracture-art"
              animate={{ filter: ['brightness(.8)', 'brightness(1.35)', 'brightness(.8)'] }}
              transition={{ repeat: Infinity, duration: 2.4 }}
            />
            <motion.img
              src={getAssetUrl(`/crests/region-crest-${currentIndex}.png`)}
              alt={`${currentRegion} crest`}
              className="transfer-crest old-crest"
              animate={{ opacity: [1, 0], scale: [1, .55], rotate: [0, -20] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: .5 }}
            />
            <motion.img
              src={getAssetUrl(`/crests/region-crest-${nextIndex}.png`)}
              alt={`${nextRegion} crest`}
              className="transfer-crest new-crest"
              animate={{ opacity: [0, 1], scale: [.55, 1], rotate: [20, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: .5 }}
            />
          </motion.div>
        )}

        {beat === 2 && hasNext && (
          <motion.div
            key="new-threat"
            initial={{ opacity: 0, x: 70 }}
            animate={{ opacity: 1, x: 0 }}
            className="character-stage threat-stage"
          >
            <img
              src={getAssetUrl(`/dragons/dragon-${DRAGON_TYPES[nextIndex - 1]}.png`)}
              alt={nextDragon}
              className="new-dragon"
            />
            <img
              src={getAssetUrl(`/fairies/empress-${nextIndex}-caged.png`)}
              alt={nextEmpress}
              className="imprisoned-empress"
            />
            <div className="character-seal imprisoned-seal">IMPRISONED</div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={`copy-${beat}`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="transfer-copy"
      >
        <span className="transfer-eyebrow">{beatCopy.eyebrow}</span>
        <h1>{beatCopy.title}</h1>
        <h3>{beatCopy.subtitle}</h3>
        <p>{beatCopy.body}</p>
        <div className="beat-progress">
          {[0, 1, 2].map(index => (
            <i key={index} className={index <= beat ? 'active' : ''} />
          ))}
        </div>
      </motion.div>

      <button type="button" onClick={advance} className="transfer-action">
        {beatCopy.action}
        <ChevronRight size={15} />
      </button>

      <style jsx>{`
        .realm-transfer {
          position: fixed;
          inset: 0;
          z-index: 2100;
          overflow: hidden;
          background: #020203;
          color: white;
          user-select: none;
        }
        .realm-landscape {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: opacity 1.2s ease, transform 2s ease, filter 1.2s ease;
        }
        .old-landscape { opacity: .7; filter: saturate(.85) brightness(.58); }
        .new-landscape { opacity: 0; transform: scale(1.08); filter: brightness(.45); }
        .beat-1 .old-landscape { opacity: .3; transform: translateX(-8%) scale(1.05); filter: grayscale(.5) brightness(.35); }
        .beat-1 .new-landscape { opacity: .22; transform: translateX(8%) scale(1.05); }
        .beat-2 .old-landscape { opacity: 0; transform: translateX(-22%); }
        .beat-2 .new-landscape { opacity: .72; transform: scale(1); filter: brightness(.55); }
        .realm-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 15%, rgba(0,0,0,.68) 92%),
            linear-gradient(to top, rgba(0,0,0,.92), transparent 55%);
          z-index: 2;
        }
        .character-stage { position: absolute; inset: 0; z-index: 4; pointer-events: none; }
        .defeated-dragon {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 58%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          filter: grayscale(1) brightness(.2);
          opacity: .72;
          mask-image: linear-gradient(to left, black 65%, transparent 100%);
        }
        .liberated-empress {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 58%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          filter: drop-shadow(0 0 34px rgba(197,160,89,.28));
          mask-image: linear-gradient(to right, black 72%, transparent 100%);
        }
        .character-seal {
          position: absolute;
          left: 24%;
          bottom: 9%;
          transform: translateX(-50%);
          padding: .4rem 1.2rem;
          border: 1px solid #8fbd58;
          background: rgba(0,0,0,.78);
          color: #a8d675;
          font: 900 .58rem var(--font-mono);
          letter-spacing: .32em;
        }
        .eliminated-stamp {
          position: absolute;
          right: 12%;
          top: 42%;
          transform: rotate(-10deg);
          padding: .45rem 1.25rem;
          border: 4px solid #ff2525;
          color: #ff2525;
          background: rgba(0,0,0,.38);
          box-shadow: 0 0 24px rgba(255,25,25,.45), inset 0 0 16px rgba(255,25,25,.14);
          font: 950 clamp(1.5rem, 3.4vw, 3.5rem)/1 var(--font-mono);
          letter-spacing: .08em;
          text-shadow: 0 0 12px rgba(255,30,30,.65);
        }
        .fracture-stage { position: absolute; inset: 0; z-index: 5; display: grid; place-items: center; }
        .fracture-art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; mix-blend-mode: screen; }
        .transfer-crest {
          position: absolute;
          width: clamp(90px, 12vw, 180px);
          height: clamp(90px, 12vw, 180px);
          object-fit: contain;
          filter: drop-shadow(0 0 24px rgba(236,200,128,.7));
        }
        .new-dragon {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 58%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          filter: drop-shadow(0 0 45px rgba(200,40,25,.28));
          mask-image: linear-gradient(to right, black 72%, transparent 100%);
        }
        .imprisoned-empress {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 58%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          filter: saturate(.78) brightness(.68) drop-shadow(0 0 34px rgba(255,55,40,.18));
          mask-image: linear-gradient(to left, black 72%, transparent 100%);
        }
        .imprisoned-seal {
          left: auto;
          right: 24%;
          bottom: 9%;
          transform: translateX(50%);
          border-color: #d84b42;
          color: #ff6a5d;
          box-shadow: 0 0 18px rgba(255,55,45,.16);
        }
        .transfer-copy {
          position: absolute;
          z-index: 10;
          left: 7%;
          bottom: 9%;
          width: min(570px, 48vw);
          padding: 1.4rem 1.6rem;
          border-left: 2px solid #ecc880;
          background: linear-gradient(90deg, rgba(0,0,0,.88), rgba(0,0,0,.22));
          text-align: left;
        }
        .transfer-eyebrow { color: #ecc880; font: 900 .55rem var(--font-mono); letter-spacing: .3em; }
        .transfer-copy h1 { margin: .55rem 0 .35rem; font: 800 clamp(2rem, 4.4vw, 4.3rem)/.95 var(--font-display); color: #f2d795; text-transform: uppercase; }
        .transfer-copy h3 { margin: 0; font: 900 .7rem var(--font-mono); letter-spacing: .2em; text-transform: uppercase; }
        .transfer-copy p { max-width: 500px; margin: .75rem 0 0; color: rgba(255,255,255,.68); font: italic .9rem/1.55 Georgia, serif; }
        .beat-2 .transfer-copy {
          left: calc(50% - min(27vw, 310px));
          bottom: 8%;
          width: min(620px, 54vw);
          padding: 1rem 1.35rem;
          border-left: 0;
          border-top: 1px solid rgba(236,200,128,.72);
          background: linear-gradient(90deg, transparent, rgba(0,0,0,.9) 14%, rgba(0,0,0,.9) 86%, transparent);
          text-align: center;
        }
        .beat-2 .transfer-copy h1 {
          margin: .42rem 0 .3rem;
          font-size: clamp(1.65rem, 3vw, 3rem);
          line-height: 1;
        }
        .beat-2 .transfer-copy p { margin: .55rem auto 0; }
        .beat-2 .beat-progress { justify-content: center; margin-top: .7rem; }
        .beat-progress { display: flex; gap: .4rem; margin-top: 1rem; }
        .beat-progress i { width: 28px; height: 2px; background: rgba(255,255,255,.18); }
        .beat-progress i.active { background: #ecc880; box-shadow: 0 0 8px rgba(236,200,128,.6); }
        .transfer-action {
          position: absolute;
          right: 3%;
          bottom: 4%;
          z-index: 12;
          display: flex;
          align-items: center;
          gap: .8rem;
          padding: .9rem 1.5rem;
          border: 1px solid rgba(236,200,128,.75);
          background: rgba(0,0,0,.82);
          color: #ecc880;
          font: 900 .65rem var(--font-mono);
          letter-spacing: .2em;
          text-transform: uppercase;
          cursor: pointer;
        }
        .transfer-action:hover { background: #ecc880; color: #080808; }
        @media (max-width: 700px), (max-aspect-ratio: 3/4) {
          .old-landscape, .new-landscape { background-position: center; }
          .defeated-dragon {
            right: 0;
            width: 100%;
            height: 52%;
            bottom: 0;
            object-position: center 35%;
            opacity: .9;
            mask-image: linear-gradient(to top, black 74%, transparent);
          }
          .liberated-empress {
            left: 0;
            width: 100%;
            height: 54%;
            bottom: 46%;
            object-position: center top;
            mask-image: linear-gradient(to bottom, black 74%, transparent);
          }
          .new-dragon { left: 0; width: 100%; height: 52%; bottom: 48%; mask-image: linear-gradient(to bottom, black 70%, transparent); }
          .imprisoned-empress { right: 0; width: 100%; height: 52%; bottom: 0; mask-image: linear-gradient(to top, black 70%, transparent); }
          .imprisoned-seal { right: 50%; bottom: 12%; }
          .eliminated-stamp { right: 7%; top: 58%; border-width: 3px; font-size: 1.35rem; }
          .fracture-art {
            left: 0;
            width: 100%;
            object-fit: cover;
            object-position: center;
          }
          .transfer-copy {
            left: 1rem;
            right: 1rem;
            bottom: 5.2rem;
            width: auto;
            padding: 1rem;
            background: linear-gradient(to top, rgba(0,0,0,.94), rgba(0,0,0,.54));
          }
          .beat-0 .transfer-copy {
            background: transparent;
            text-shadow: 0 2px 10px #000, 0 0 20px #000;
          }
          .transfer-copy h1 { font-size: clamp(1.6rem, 8vw, 2.65rem); }
          .transfer-copy p { font-size: .78rem; }
          .beat-2 .transfer-copy {
            left: 1rem;
            right: 1rem;
            bottom: 5.2rem;
            width: auto;
            transform: none;
            padding: .8rem 1rem;
          }
          .beat-2 .transfer-copy h1 { font-size: clamp(1.35rem, 6.5vw, 2rem); }
          .transfer-action { left: 1rem; right: 1rem; bottom: 1rem; justify-content: center; }
          .liberated-seal { left: 50%; bottom: 48%; }
        }
      `}</style>
    </motion.div>
  );
}
