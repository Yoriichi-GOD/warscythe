import React from 'react';
import { motion } from 'framer-motion';
import { REGIONS } from '../store/constants';
import { getAssetUrl } from '../utils/assetResolver';

// Region-specific accent color palette
const REGION_COLORS = {
  1:  { hex: '#5d8a3c', glow: 'rgba(93, 138, 60, 0.55)',   name: 'Forest Green' },
  2:  { hex: '#e05a20', glow: 'rgba(224, 90, 32, 0.55)',   name: 'Magma Orange' },
  3:  { hex: '#4da6e8', glow: 'rgba(77, 166, 232, 0.55)',  name: 'Frost Blue'   },
  4:  { hex: '#9b5de5', glow: 'rgba(155, 93, 229, 0.55)',  name: 'Shadow Purple' },
  5:  { hex: '#d4a010', glow: 'rgba(212, 160, 16, 0.55)',  name: 'Desert Gold'  },
  6:  { hex: '#e0c840', glow: 'rgba(224, 200, 64, 0.55)',  name: 'Sky Amber'    },
  7:  { hex: '#20b280', glow: 'rgba(32, 178, 128, 0.55)',  name: 'Cavern Teal'  },
  8:  { hex: '#60a830', glow: 'rgba(96, 168, 48, 0.55)',   name: 'Swamp Green'  },
  9:  { hex: '#8040e8', glow: 'rgba(128, 64, 232, 0.55)',  name: 'Cosmic Violet' },
  10: { hex: '#e0a820', glow: 'rgba(224, 168, 32, 0.55)',  name: 'Titan Gold'   },
};

const DRAGON_TYPES = [
  'wyrm', 'lava', 'frost', 'shadow', 'wyvern',
  'celestial', 'skeletal', 'storm', 'abyssal', 'ancient'
];

const EMPRESS_NAMES = {
  1:  'Empress Dryad of Ashwood',
  2:  'Empress Pyra of the Caldera',
  3:  'Empress Frost of Glacius Peak',
  4:  'Empress Vreth of Shadowfen',
  5:  'Empress Jade of the Oasis',
  6:  'Empress Zephyr of Cloudspire',
  7:  'Empress Spectral of the Deeps',
  8:  'Empress Lira of Mirewood',
  9:  'Empress Cosma of the Void',
  10: 'Empress Sol of the Golden Citadel',
};

const DRAGON_NAMES = [
  'Malgrath the Dread', 'Stoneback Krul', 'Glacius the Eternal', 'Vreth the Unseen',
  'Ignarax the Burning', 'Sol-Varen the Radiant', 'Duskbone Revenant', 'Thundercoil Zarak',
  'Nyxara the Void', 'Gorvek the Ancient'
];

export default function RegionFlashScreen({ type, regionData, onClose }) {
  const { mapIndex = 1, taskTitle = '' } = regionData || {};
  const safeMapIndex = Math.max(1, mapIndex);
  const regionName = REGIONS?.[safeMapIndex - 1]?.name || `Region ${safeMapIndex}`;
  const palette = REGION_COLORS[safeMapIndex] || REGION_COLORS[1];
  const dragonType = DRAGON_TYPES[(safeMapIndex - 1) % DRAGON_TYPES.length];
  const dragonName = DRAGON_NAMES[(safeMapIndex - 1) % DRAGON_NAMES.length];
  const empressName = EMPRESS_NAMES[safeMapIndex] || `Empress of ${regionName}`;

  const isVictory = type === 'victory';

  // ── VICTORY mode ──────────────────────────────────────────────────────────
  // Desktop: [LIBERATED FAIRY full-color] | [DRAGON grayscale + ELIMINATED]
  // Mobile:  [LIBERATED FAIRY]  top  /  [DRAGON B&W]  bottom
  //
  // ── ENTRY mode ────────────────────────────────────────────────────────────
  // Desktop: [DRAGON full-color] | [CAGED FAIRY]
  // Mobile:  [DRAGON]  top  /  [CAGED FAIRY]  bottom

  const leftPanel = isVictory
    ? { src: getAssetUrl(`/fairies/empress-${safeMapIndex}-liberated.png`), label: 'LIBERATED', filter: 'none', glow: palette.glow }
    : { src: getAssetUrl(`/dragons/dragon-${dragonType}.png`),          label: 'THREAT',    filter: 'none', glow: 'transparent' };

  const rightPanel = isVictory
    ? { src: getAssetUrl(`/dragons/dragon-${dragonType}.png`),       label: 'ELIMINATED', filter: 'grayscale(100%) brightness(0.35)', glow: 'rgba(0,0,0,0.3)', eliminated: true }
    : { src: getAssetUrl(`/fairies/empress-${safeMapIndex}-caged.png`),  label: 'IMPRISONED', filter: 'none', glow: 'transparent' };

  const accentColor = isVictory ? palette.hex : '#ff4444';
  const accentGlow  = isVictory ? palette.glow : 'rgba(220,30,30,0.5)';

  const title    = isVictory
    ? 'SOVEREIGNTY RESTORED'
    : `NEW REGION — ${(regionName || '').toUpperCase()}`;

  const subtitle = isVictory
    ? `THE EMPRESS OF ${(regionName || '').toUpperCase()} IS FREE`
    : `${(dragonName || '').toUpperCase()} RULES THIS TERRITORY`;

  const desc = isVictory
    ? `The dragon has fallen. Order is restored to ${regionName}. Claim your tribute, Commander — ${empressName} is liberated.`
    : `Collect 5 elemental keys to free ${empressName} from the dragon's cage and restore order to the Kingdom of ${regionName}.`;

  const btnLabel = isVictory ? 'CLAIM REWARD & CONTINUE' : 'ENTER THE REGION';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      className="rfs-root"
    >
      {/* Scanline texture */}
      <div className="rfs-scanline" />
      {/* Vignette */}
      <div className="rfs-vignette" />

      {/* ── TWO-PANEL LAYOUT ─────────────────────────────────────── */}
      <div className="rfs-panels">

        {/* LEFT / TOP PANEL */}
        <motion.div
          className="rfs-panel rfs-panel-left"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
        >
          <div
            className="rfs-panel-glow"
            style={{ background: `radial-gradient(circle at center, ${leftPanel.glow} 0%, transparent 70%)` }}
          />
          <div className="rfs-img-frame">
            <img
              src={leftPanel.src}
              alt={leftPanel.label}
              className="rfs-img"
              style={{ filter: leftPanel.filter }}
              onError={e => { e.target.style.opacity = '0.1'; }}
            />
            <div className="rfs-img-overlay" />
          </div>
          <span
            className="rfs-panel-badge"
            style={{ borderColor: isVictory ? palette.hex : '#ff4444', color: isVictory ? palette.hex : '#ff6666' }}
          >
            {leftPanel.label}
          </span>
        </motion.div>

        {/* VERTICAL DIVIDER (desktop only) */}
        <motion.div
          className="rfs-divider"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ background: `linear-gradient(to bottom, transparent, ${accentColor}, transparent)` }}
        />

        {/* RIGHT / BOTTOM PANEL */}
        <motion.div
          className="rfs-panel rfs-panel-right"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: 'easeOut' }}
        >
          <div
            className="rfs-panel-glow"
            style={{ background: `radial-gradient(circle at center, ${rightPanel.glow} 0%, transparent 70%)` }}
          />
          <div className="rfs-img-frame">
            <img
              src={rightPanel.src}
              alt={rightPanel.label}
              className="rfs-img"
              style={{ filter: rightPanel.filter }}
              onError={e => { e.target.style.opacity = '0.1'; }}
            />
            <div className="rfs-img-overlay" style={{ background: rightPanel.eliminated ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.15)' }} />
            {/* ELIMINATED STAMP (victory mode right panel only) */}
            {rightPanel.eliminated && (
              <motion.div
                className="rfs-eliminated-stamp"
                initial={{ opacity: 0, scale: 1.5, rotate: -12, x: '-50%', y: '-50%' }}
                animate={{ opacity: 1, scale: 1, rotate: -12, x: '-50%', y: '-50%' }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                ELIMINATED
              </motion.div>
            )}
          </div>
          <span
            className="rfs-panel-badge"
            style={{
              borderColor: rightPanel.eliminated ? '#ff2020' : (isVictory ? '#ff4444' : '#ff4444'),
              color:       rightPanel.eliminated ? '#ff4040' : '#ff6666'
            }}
          >
            {rightPanel.label}
          </span>
        </motion.div>
      </div>

      {/* ── TEXT OVERLAY ─────────────────────────────────────────── */}
      <motion.div
        className="rfs-text-block"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {/* Icon chip */}
        <div className="rfs-chip" style={{ borderColor: `${accentColor}40` }}>
          <span className="rfs-chip-text">
            {isVictory ? 'REGION CONQUERED' : 'REGION UNLOCKED'}
          </span>
        </div>

        <h1 className="rfs-title" style={{ color: accentColor, textShadow: `0 0 28px ${accentGlow}` }}>
          {title}
        </h1>

        <h3 className="rfs-subtitle" style={{ borderLeftColor: accentColor }}>
          {subtitle}
        </h3>

        <p className="rfs-desc">
          &ldquo;{desc}&rdquo;
        </p>

        {/* Animated scan line */}
        <div className="rfs-scan-bar">
          <motion.div
            className="rfs-scan-fill"
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
            style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
          />
        </div>
      </motion.div>

      {/* ── CONTINUE BUTTON ──────────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
        onClick={onClose}
        className="rfs-continue-btn"
        style={{
          borderColor: accentColor,
          color: accentColor,
          boxShadow: `0 0 18px ${accentGlow}`,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = accentColor;
          e.currentTarget.style.color = '#000';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.8)';
          e.currentTarget.style.color = accentColor;
        }}
      >
        {btnLabel}
      </motion.button>

      <style jsx>{`
        .rfs-root {
          position: fixed;
          inset: 0;
          z-index: 2100;
          background: #050507;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          overflow: hidden;
          user-select: none;
        }

        /* Scanlines */
        .rfs-scanline {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.22) 50%),
            linear-gradient(90deg, rgba(255,0,0,0.04), rgba(0,255,0,0.02), rgba(0,0,255,0.04));
          background-size: 100% 4px, 6px 100%;
          opacity: 0.18;
          pointer-events: none;
          z-index: 1;
        }

        /* Dark radial vignette */
        .rfs-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%);
          pointer-events: none;
          z-index: 2;
        }

        /* ── PANELS ── */
        .rfs-panels {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          z-index: 3;
        }

        @media (min-width: 768px) {
          .rfs-panels {
            flex-direction: row;
          }
        }

        .rfs-panel {
          position: relative;
          flex: 1;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 1.5rem;
        }

        /* Desktop: left takes slightly more width for the hero */
        @media (min-width: 768px) {
          .rfs-panel-left  { flex: 1.1; }
          .rfs-panel-right { flex: 0.9; }
        }

        .rfs-panel-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .rfs-img-frame {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rfs-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: filter 0.3s;
        }

        .rfs-img-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.15);
        }

        /* ELIMINATED stamp */
        .rfs-eliminated-stamp {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-12deg);
          font-family: 'Impact', 'Arial Black', sans-serif;
          font-size: clamp(2rem, 8vw, 5.5rem);
          font-weight: 900;
          letter-spacing: 0.08em;
          color: #ff1a1a;
          text-shadow: 0 0 20px rgba(255,0,0,0.8), 2px 2px 0 #000, -2px -2px 0 #000;
          border: 5px solid #ff1a1a;
          padding: 0.2em 0.5em;
          white-space: nowrap;
          z-index: 10;
          box-shadow: 0 0 30px rgba(255,0,0,0.4), inset 0 0 20px rgba(255,0,0,0.1);
          pointer-events: none;
        }

        .rfs-panel-badge {
          position: relative;
          z-index: 5;
          font-family: 'Courier New', monospace;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          border: 1px solid;
          padding: 0.25rem 0.75rem;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          border-radius: 2px;
        }

        /* Vertical divider — desktop only */
        .rfs-divider {
          display: none;
          width: 1px;
          transform-origin: top;
          z-index: 5;
        }

        @media (min-width: 768px) {
          .rfs-divider {
            display: block;
          }
        }

        /* ── TEXT BLOCK ── */
        .rfs-text-block {
          position: relative;
          z-index: 10;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.6rem;
          padding: 1.5rem 1.5rem 6rem 1.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 70%, transparent 100%);
        }

        @media (min-width: 768px) {
          .rfs-text-block {
            padding: 2rem 4rem 5rem 4rem;
          }
        }

        .rfs-chip {
          display: inline-flex;
          align-items: center;
          padding: 0.2rem 0.8rem;
          border: 1px solid;
          border-radius: 2px;
          background: rgba(0,0,0,0.5);
        }

        .rfs-chip-text {
          font-family: 'Courier New', monospace;
          font-size: 0.55rem;
          font-weight: 800;
          letter-spacing: 0.35em;
          color: rgba(255,255,255,0.55);
          text-transform: uppercase;
        }

        .rfs-title {
          font-family: 'Times New Roman', Georgia, serif;
          font-size: clamp(1.5rem, 4vw, 3.2rem);
          font-weight: 900;
          letter-spacing: 0.06em;
          line-height: 1.1;
          text-transform: uppercase;
          margin: 0;
        }

        .rfs-subtitle {
          font-family: 'Courier New', monospace;
          font-size: clamp(0.6rem, 1.5vw, 0.85rem);
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.9);
          border-left: 2px solid;
          padding-left: 0.75rem;
          text-align: left;
          margin: 0;
        }

        .rfs-desc {
          font-family: 'Times New Roman', Georgia, serif;
          font-size: clamp(0.75rem, 2vw, 0.95rem);
          color: rgba(200,200,210,0.8);
          line-height: 1.65;
          font-style: italic;
          max-width: 580px;
          margin: 0;
        }

        .rfs-scan-bar {
          width: 200px;
          height: 1px;
          background: rgba(255,255,255,0.08);
          position: relative;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .rfs-scan-fill {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px;
        }

        /* ── CONTINUE BUTTON ── */
        .rfs-continue-btn {
          position: absolute;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 20;
          font-family: 'Courier New', monospace;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 0.75rem 1.75rem;
          border: 1px solid;
          background: rgba(0,0,0,0.8);
          cursor: pointer;
          border-radius: 2px;
          transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
          pointer-events: auto;
        }

        @media (max-width: 480px) {
          .rfs-continue-btn {
            right: 1rem;
            bottom: 1rem;
            padding: 0.65rem 1.2rem;
            font-size: 0.58rem;
          }
          .rfs-text-block {
            padding: 1rem 1rem 5rem 1rem;
          }
        }
      `}</style>
    </motion.div>
  );
}
