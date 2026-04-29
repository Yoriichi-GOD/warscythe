import React from 'react';
import { motion } from 'framer-motion';
import { useWarlordStore } from '../store/useWarlordStore';
import { REGIONS } from '../store/constants';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function LevelUpModal({ data, onClose }) {
  const { newLevel, newTitle, regionIdx } = data;
  const region = REGIONS[regionIdx] || REGIONS[0];

  return (
    <div className="modal-backdrop levelup-backdrop">
      <motion.div 
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: [0.6, 1.1, 1] }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="levelup-card glass-panel"
      >
        <div className="levelup-aura" />
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="levelup-content"
        >
          <div className="lvl-header">
            <Sparkles className="gold-text" size={32} />
            <h2>ASCENSION COMPLETE</h2>
            <span className="overline">YOU ARE EVOLVING</span>
          </div>

          <div className="lvl-stats">
            <div className="stat-box">
              <label>NEW LEVEL</label>
              <div className="big-num">{newLevel}</div>
            </div>
            <div className="stat-separator"><ArrowRight size={24} /></div>
            <div className="stat-box">
              <label>NEW TITLE</label>
              <div className="title-reveal">{newTitle}</div>
            </div>
          </div>

          <div className="region-reveal">
             <span className="region-label">NOW ENTERING</span>
             <h3 className="new-region-name">{region.icon} {region.name}</h3>
             <p className="region-desc">"{region.lore_templates[0].replace('{title}', newTitle)}"</p>
          </div>

          <button className="btn-primary full-width" onClick={onClose}>
            EMBODY YOUR NEW FORM
          </button>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .levelup-backdrop { 
          background: rgba(0,0,0,0.9); 
          backdrop-filter: blur(20px); 
          z-index: 2000;
        }
        .levelup-card {
          width: 90%; max-width: 500px; padding: 3rem;
          background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%);
          border: 1px solid var(--gold-core);
          text-align: center; position: relative; overflow: hidden;
          box-shadow: 0 0 100px rgba(212,175,55,0.2);
        }
        .levelup-aura {
          position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 60%);
          animation: rotateAura 10s linear infinite;
        }
        @keyframes rotateAura { from { rotate: 0deg; } to { rotate: 360deg; } }
        
        .lvl-header h2 { font-family: var(--font-display); font-size: 1.8rem; letter-spacing: 0.3em; color: var(--text-primary); margin: 1rem 0 0.2rem; }
        .overline { font-size: 0.7rem; font-weight: 900; color: var(--gold-core); letter-spacing: 0.4em; }
        
        .lvl-stats { display: flex; align-items: center; justify-content: center; gap: 2rem; margin: 2.5rem 0; }
        .stat-box label { font-size: 0.6rem; font-weight: 900; color: var(--text-dim); display: block; margin-bottom: 0.5rem; }
        .big-num { font-size: 3.5rem; font-weight: 900; color: var(--gold-core); line-height: 1; text-shadow: 0 0 20px var(--gold-glow); }
        .title-reveal { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; color: #fff; }
        .stat-separator { color: var(--text-dim); opacity: 0.3; }

        .region-reveal { background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border: 1px solid rgba(212,175,55,0.1); }
        .region-label { font-size: 0.55rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.2em; display: block; margin-bottom: 0.8rem; }
        .new-region-name { font-family: var(--font-display); font-size: 1.4rem; color: var(--gold-core); margin-bottom: 0.5rem; }
        .region-desc { font-style: italic; font-size: 0.85rem; color: var(--text-dim); line-height: 1.4; }
        
        .btn-primary.full-width { width: 100%; padding: 1rem; font-size: 0.75rem; font-weight: 900; letter-spacing: 0.2em; }
      `}</style>
    </div>
  );
}
