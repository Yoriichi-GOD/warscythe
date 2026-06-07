import React from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { REGIONS, LORE_TEMPLATES } from '../store/constants';
import { X } from 'lucide-react';

export default function LevelUpModal({ data, onClose }) {
  const { newLevel, newTitle, regionIdx } = data;
  const region = REGIONS[regionIdx] || REGIONS[0];
  const loreList = LORE_TEMPLATES[regionIdx] || LORE_TEMPLATES[0] || [];
  const loreTemplate = loreList[0] || "A new horizon awaits your command.";

  const crestIndex = ((newLevel - 1) % 10) + 1;
  const crestPath = `/crests/region-crest-${crestIndex}.png`;

  return (
    <div className="modal-backdrop levelup-backdrop">
      {/* Floating Fire Embers / Ashes */}
      <div className="ember-field">
        {[...Array(25)].map((_, i) => (
          <div 
            key={i} 
            className="ember-particle" 
            style={{
              left: `${(i * 17) % 100}%`,
              width: `${((i * 3) % 4) + 2}px`,
              height: `${((i * 3) % 4) + 2}px`,
              animationDelay: `${(i * 0.3) % 8}s`,
              animationDuration: `${((i * 2) % 6) + 6}s`,
            }}
          />
        ))}
      </div>

      <button className="levelup-close-btn" onClick={onClose}>
        <X size={18} />
      </button>

      <div className="levelup-wrapper">
        {/* Glow Star Icon Top Left */}
        <div className="levelup-sparkle-icon">✦</div>

        {/* Modal Header */}
        <div className="lvl-header font-times">
          <h2 className="text-gold-gradient">ASCENSION COMPLETE</h2>
          <div className="lvl-header-divider">
            <span className="overline">♦ YOU ARE EVOLVING ♦</span>
          </div>
        </div>

        {/* Level Stats Block */}
        <div className="lvl-stats font-times">
          <div className="stat-item">
            <span className="stat-label">NEW LEVEL</span>
            <span className="stat-value text-gold-gradient">{newLevel}</span>
          </div>
          <div className="stat-arrow">→</div>
          <div className="stat-item">
            <span className="stat-label">NEW TITLE</span>
            <span className="stat-value text-white">{newTitle}</span>
          </div>
        </div>

        {/* Central Altar Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="gothic-altar-panel"
        >
          <span className="region-label">NOW ENTERING</span>
          
          <div className="crest-display-container">
            {/* Spinning runic halo background */}
            <div className="runic-halo-spin-container">
              <svg className="runic-halo-spin" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(16, 185, 129, 0.12)" strokeWidth="1" strokeDasharray="3, 3" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(197, 160, 89, 0.15)" strokeWidth="0.5" />
                <path d="M 50 10 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(197, 160, 89, 0.35)" strokeWidth="1" />
                <path d="M 50 90 A 40 40 0 0 1 10 50" fill="none" stroke="rgba(197, 160, 89, 0.35)" strokeWidth="1" />
              </svg>
            </div>
            
            <img src={crestPath} className="crest-image" alt="Region Crest" />
          </div>

          <h3 className="new-region-name font-times">{region.name}</h3>
          <p className="region-desc font-times">"{loreTemplate.replace('{title}', newTitle)}"</p>
        </motion.div>

        {/* Modal Footer & Button */}
        <div className="levelup-footer font-times">
          <span className="embody-text">EMBODY YOUR NEW FORM</span>
          <button className="btn-gothic-gold claim-btn" onClick={onClose}>
            CLAIM REWARD
          </button>
        </div>
      </div>

      <style jsx>{`
        .levelup-backdrop { 
          background: radial-gradient(circle at center, rgba(10, 10, 15, 0.8) 0%, rgba(0, 0, 0, 0.98) 100%);
          backdrop-filter: blur(16px); 
          z-index: 2000;
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 2rem 1rem;
        }

        .levelup-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 480px;
          position: relative;
          z-index: 10;
        }

        .levelup-sparkle-icon {
          color: #ecc880;
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
          filter: drop-shadow(0 0 10px rgba(236, 200, 128, 0.6));
          animation: pulse-sparkle 3s infinite ease-in-out;
          align-self: flex-start;
          margin-left: 1rem;
        }

        @keyframes pulse-sparkle {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .font-times {
          font-family: "Times New Roman", "Cinzel", "IM Fell English", Times, Georgia, serif;
        }

        .lvl-header {
          text-align: center;
          margin-bottom: 1.5rem;
          width: 100%;
        }

        .lvl-header h2 {
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin: 0;
          text-transform: uppercase;
        }

        .lvl-header-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80%;
          margin: 0.5rem auto 0;
          border-top: 1px solid rgba(197, 160, 89, 0.25);
          border-bottom: 1px solid rgba(197, 160, 89, 0.25);
          padding: 0.2rem 0;
          position: relative;
        }



        .overline {
          font-size: 0.75rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.65);
          letter-spacing: 0.35em;
          text-transform: uppercase;
        }

        .lvl-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 0.6rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.45);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          line-height: 1;
        }

        .stat-arrow {
          color: rgba(197, 160, 89, 0.4);
          font-size: 1.5rem;
          margin-top: 1rem;
        }

        .gothic-altar-panel {
          width: 100%;
          padding: 2.5rem 2rem;
          text-align: center;
          margin-bottom: 2.5rem;
          border-radius: 4px;
        }

        .region-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.45);
          letter-spacing: 0.15em;
          display: block;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
        }

        .crest-display-container {
          position: relative;
          width: 160px;
          height: 160px;
          margin: 0 auto 2rem auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Large circular glow background */
        .crest-display-container::before {
          content: "";
          position: absolute;
          inset: 15px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(236, 200, 128, 0.05) 50%, transparent 100%);
          filter: blur(12px);
          z-index: 1;
        }

        .runic-halo-spin-container {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }

        .runic-halo-spin {
          width: 100%;
          height: 100%;
        }

        .crest-image {
          width: 90px;
          height: 90px;
          object-fit: contain;
          position: relative;
          z-index: 5;
          filter: drop-shadow(0 0 15px rgba(236, 200, 128, 0.45));
          animation: float-crest 4s ease-in-out infinite;
        }

        @keyframes float-crest {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .new-region-name {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ecc880;
          margin-bottom: 0.8rem;
          letter-spacing: 0.05em;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
        }

        .region-desc {
          font-style: italic;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.6;
          margin: 0 auto;
          max-width: 90%;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
        }

        .levelup-footer {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
        }

        .embody-text {
          font-size: 0.65rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.45);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .claim-btn {
          width: 100%;
          max-width: 320px;
          height: 52px;
          font-size: 0.85rem;
          font-weight: 700;
          border-radius: 4px;
        }

        .levelup-close-btn {
          position: absolute; top: 1.5rem; right: 1.5rem; z-index: 100;
          background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(197, 160, 89, 0.25);
          color: rgba(255, 255, 255, 0.5); width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          transition: all 0.2s;
        }
        .levelup-close-btn:hover {
          background: rgba(197, 160, 89, 0.1); border-color: #ecc880; color: #ecc880;
        }
      `}</style>
    </div>
  );
}
