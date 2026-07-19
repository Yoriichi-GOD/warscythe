import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { REGIONS } from '../store/constants';
import { REGIONAL_CHRONICLES as LORE_TEMPLATES } from '../store/regionalLore';
import { X } from 'lucide-react';
import { getAssetUrl, BUNDLE_CONFIG } from '../utils/assetResolver';

export default function LevelUpModal({ data, onClose }) {
  const { newLevel, newTitle, regionIdx } = data;
  const region = REGIONS[regionIdx] || REGIONS[0];
  const loreList = LORE_TEMPLATES[regionIdx] || LORE_TEMPLATES[0] || [];
  const loreTemplate = loreList[0] || "A new horizon awaits your command.";

  const crestIndex = ((newLevel - 1) % 10) + 1;
  const crestPath = getAssetUrl(`/crests/region-crest-${crestIndex}.png`);

  const downloadedRegions = useWarscytheStore(state => state.downloadedRegions) || [];
  const downloadRegionBundle = useWarscytheStore(state => state.downloadRegionBundle);

  const [downloadState, setDownloadState] = useState('idle');

  const isMobileApp = typeof window !== 'undefined' && window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform();
  const isDownloaded = downloadedRegions.map(String).includes(String(crestIndex));
  const showPrompt = isMobileApp && !isDownloaded && crestIndex >= 2;
  const bundleConfig = BUNDLE_CONFIG.regions.items[crestIndex];

  const handleDownload = async () => {
    setDownloadState('downloading');
    try {
      await downloadRegionBundle(crestIndex);
      setDownloadState('completed');
    } catch (err) {
      console.error(err);
      setDownloadState('error');
    }
  };

  return (
    <div className="modal-backdrop levelup-backdrop">
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="ascension-art"
      />
      <div className="ascension-veil" />
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
            <span className="overline">◆ THE OLD FORM HAS BEEN SURPASSED ◆</span>
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
          
          {showPrompt && (
            <div className="region-cache-prompt bg-black/80 border border-gold-core/20 p-4 rounded-md my-4 flex flex-col items-center gap-2 max-w-[280px] mx-auto font-mono text-[9px] uppercase tracking-wider text-center relative z-20">
              <span className="text-gold-core font-extrabold">Resource Cache Required (Size: {bundleConfig?.size || '10 MB'})</span>
              <span className="text-gray-400 text-[8px] leading-normal font-medium">Cache region assets to enable offline gameplay and view maps, trophies, and fairies.</span>
              
              {downloadState === 'idle' && (
                <div className="flex gap-2 w-full mt-1">
                  <button 
                    onClick={handleDownload}
                    className="flex-1 bg-gold-core text-black font-extrabold py-2 px-1 rounded shadow-[0_0_10px_rgba(197,160,89,0.3)] hover:bg-white transition-all cursor-pointer"
                  >
                    CACHE NOW
                  </button>
                  <button 
                    onClick={onClose}
                    className="flex-1 border border-white/20 text-gray-300 font-extrabold py-2 px-1 rounded hover:bg-white/5 transition-all cursor-pointer"
                  >
                    LATER
                  </button>
                </div>
              )}
              {downloadState === 'downloading' && (
                <span className="text-gold-core font-bold animate-pulse mt-2">[ CACHING RESOURCES... PLEASE WAIT ]</span>
              )}
              {downloadState === 'completed' && (
                <span className="text-emerald-400 font-bold mt-2">[ CACHE ENCODING COMPLETE! ]</span>
              )}
              {downloadState === 'error' && (
                <div className="flex flex-col gap-2 mt-1 w-full">
                  <span className="text-red-400 font-bold">[ CACHE FAILED ]</span>
                  <button 
                    onClick={handleDownload}
                    className="bg-red-500 text-white font-bold py-2 rounded transition-all cursor-pointer"
                  >
                    TRY AGAIN
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Modal Footer & Button */}
        <div className="levelup-footer font-times">
          <span className="embody-text">EMBODY YOUR NEW FORM</span>
          {(!showPrompt || downloadState === 'completed') && (
            <button className="btn-gothic-gold claim-btn" onClick={onClose}>
              CLAIM REWARD
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .levelup-backdrop { 
          background: #020203;
          z-index: 2000;
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 1.5rem 1rem;
        }
        .ascension-art {
          position: fixed;
          inset: 0;
          background: url('/reward-screens/ascension-altar.png') center center / cover no-repeat;
          pointer-events: none;
        }
        .ascension-veil {
          position: fixed;
          inset: 0;
          background:
            linear-gradient(to bottom, rgba(0,0,0,.52), rgba(0,0,0,.05) 44%, rgba(0,0,0,.76)),
            radial-gradient(circle at 50% 50%, transparent 22%, rgba(0,0,0,.45) 75%);
          pointer-events: none;
        }

        .levelup-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 760px;
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
          margin-bottom: .75rem;
          width: 100%;
        }

        .lvl-header h2 {
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 700;
          letter-spacing: 0.055em;
          margin: 0;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .lvl-header-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          width: min(82%, 580px);
          margin: 0.5rem auto 0;
          border-top: 1px solid rgba(197, 160, 89, 0.25);
          border-bottom: 1px solid rgba(197, 160, 89, 0.25);
          padding: 0.2rem 0;
          position: relative;
        }



        .overline {
          font-size: clamp(.52rem, 1.2vw, .72rem);
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
          margin-bottom: 1rem;
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
          font-size: clamp(1.6rem, 3vw, 2.5rem);
          font-weight: 700;
          line-height: 1;
        }

        .stat-arrow {
          color: rgba(197, 160, 89, 0.4);
          font-size: 1.5rem;
          margin-top: 1rem;
        }

        .gothic-altar-panel {
          width: min(100%, 580px);
          padding: 1.5rem 2rem 1.7rem;
          text-align: center;
          margin-bottom: 1rem;
          border: 1px solid rgba(236,200,128,.28);
          border-radius: 2px;
          background: linear-gradient(180deg, rgba(3,3,4,.2), rgba(3,3,4,.84));
          box-shadow: 0 30px 80px rgba(0,0,0,.7), inset 0 0 50px rgba(236,200,128,.03);
          backdrop-filter: blur(3px);
          position: relative;
        }
        .gothic-altar-panel::before,
        .gothic-altar-panel::after {
          content: "";
          position: absolute;
          width: 34px;
          height: 34px;
          border-color: #ecc880;
          opacity: .9;
        }
        .gothic-altar-panel::before {
          left: -1px;
          top: -1px;
          border-left: 3px solid;
          border-top: 3px solid;
        }
        .gothic-altar-panel::after {
          right: -1px;
          bottom: -1px;
          border-right: 3px solid;
          border-bottom: 3px solid;
        }

        .region-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.45);
          letter-spacing: 0.15em;
          display: block;
          margin-bottom: .5rem;
          text-transform: uppercase;
        }

        .crest-display-container {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto .45rem auto;
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
          width: 104px;
          height: 104px;
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
          font-size: clamp(1.5rem, 3vw, 2.15rem);
          font-weight: 700;
          color: #ecc880;
          margin-bottom: 0.4rem;
          letter-spacing: 0.05em;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
        }

        .region-desc {
          font-style: italic;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.6;
          margin: 0 auto;
          max-width: 500px;
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
          max-width: 380px;
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

        @media (max-width: 640px), (max-aspect-ratio: 3/4) {
          .levelup-backdrop { padding: 1rem .7rem; align-items: flex-start; }
          .ascension-veil {
            background: linear-gradient(to bottom, rgba(0,0,0,.72), rgba(0,0,0,.1) 48%, rgba(0,0,0,.86));
          }
          .levelup-wrapper { min-height: calc(100dvh - 2rem); justify-content: center; }
          .levelup-sparkle-icon { display: none; }
          .lvl-header h2 { font-size: clamp(1.8rem, 9vw, 3rem); }
          .lvl-stats { margin-bottom: .75rem; }
          .gothic-altar-panel { padding: 1.1rem .85rem 1.25rem; }
          .crest-display-container { width: 125px; height: 125px; }
          .crest-image { width: 82px; height: 82px; }
          .region-desc { font-size: .76rem; line-height: 1.45; }
          .levelup-footer { gap: .45rem; }
          .claim-btn { height: 46px; }
        }

        @media (max-height: 850px) {
          .levelup-backdrop { padding: .7rem; }
          .lvl-header { margin-bottom: .35rem; }
          .lvl-header h2 { font-size: clamp(1.7rem, 4vw, 2.5rem); }
          .lvl-stats { margin-bottom: .45rem; }
          .gothic-altar-panel { padding: .75rem 1rem; margin-bottom: .5rem; }
          .crest-display-container { width: 105px; height: 105px; margin-bottom: .2rem; }
          .crest-image { width: 72px; height: 72px; }
          .region-label { margin-bottom: .15rem; }
        }
      `}</style>
    </div>
  );
}
