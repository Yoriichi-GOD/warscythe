import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { X, Shield, Scroll, Award, Star } from 'lucide-react';
import ScytheCenter from './ScytheCenter';

const dragonTrophies = [
  'wyrm', 'wyvern', 'frost', 'shadow', 'lava', 
  'celestial', 'skeletal', 'storm', 'abyssal', 'ancient'
];

// Legacy map: old artifact names → asset type (for existing user save data backward compat)
const LEGACY_ARTIFACT_MAP = {
  'Iron Quill': 'tome',
  "Scout's Compass": 'compass',
  'Wax Seal of Intent': 'scroll',
  'Cloak of Momentum': 'scroll',
  'Whetstone of Focus': 'rune',
  'Ink of Resolve': 'chalice',
  'Cloak of Iteration': 'rune',
  'Dragon Scale Armor': 'idol',
  'Eye of the Strategist': 'eye',
  "Void Walker's Boots": 'chain',
  "Warscythe's Gauntlet": 'gauntlet',
  'The Finisher': 'blade',
  'Throne Fragment': 'idol',
  'Shard of Reality': 'mirror',
  'Cosmic Reaper': 'skull',
  'Sovereign Core': 'orb',
  'Omega Catalyst': 'hourglass',
  'Grip of the Void': 'gauntlet',
  'Lantern of the Lost': 'lantern',
};

const getArtifactImage = (name) => {
  if (LEGACY_ARTIFACT_MAP[name]) {
    return `/artifacts/artifact-${LEGACY_ARTIFACT_MAP[name]}.png`;
  }
  const type = (name || '').split(' ')[0].toLowerCase();
  return `/artifacts/artifact-${type}.png`;
};


export default function VaultModal({ onClose }) {
  const { collectedArtifacts, unlockedLore, currentTitle } = useWarscytheStore();
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [activeTab, setActiveTab] = useState('artifacts'); // 'artifacts' or 'scythes'

  const rarities = {
    common: { color: '#aaa', label: 'COMMON' },
    uncommon: { color: 'var(--stage-ship)', label: 'UNCOMMON' },
    rare: { color: 'var(--stage-build)', label: 'RARE' },
    epic: { color: 'var(--stage-finish)', label: 'EPIC' },
    mythic: { color: '#ff3d00', label: 'MYTHIC' }
  };

  return (
    <div className="modal-backdrop vault-backdrop" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="vault-modal-content"
        onClick={e => e.stopPropagation()}
      >
        <div className="vault-header">
          <div className="vault-title-group flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Award size={24} className="text-gold" />
              <div className="title-text">
                <h2>THE ARTIFACT VAULT</h2>
                <span>ARCHIVE OF THE {currentTitle.toUpperCase()}</span>
              </div>
            </div>

            {/* Tab Toggles */}
            <div className="flex gap-1 border border-white/5 bg-black/40 p-1 rounded ml-4">
              <button 
                className={`px-3 py-1 text-[9px] font-mono tracking-widest uppercase rounded transition-all ${
                  activeTab === 'artifacts' 
                    ? 'bg-gold-core text-black font-extrabold shadow-[0_0_10px_rgba(197,160,89,0.3)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('artifacts')}
              >
                Artifacts
              </button>
              <button 
                className={`px-3 py-1 text-[9px] font-mono tracking-widest uppercase rounded transition-all ${
                  activeTab === 'scythes' 
                    ? 'bg-gold-core text-black font-extrabold shadow-[0_0_10px_rgba(197,160,89,0.3)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('scythes')}
              >
                Scythe Armory
              </button>
            </div>
          </div>
          <button className="vault-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'artifacts' ? (
            <div className="vault-layout h-full">
          <div className="artifact-gallery">
            <div className="dragon-trophies-section glass-panel">
               <div className="panel-label">
                  <Star size={12} fill="var(--red-hot)" />
                  <span>DRAGON HEAD TROPHIES</span>
               </div>
               <div className="dragon-grid">
                  {Array.from({ length: useWarscytheStore.getState().bossKills }).map((_, i) => {
                    const type = dragonTrophies[i % dragonTrophies.length];
                    const trophyPath = `/trophies/trophy-dragon-${type}.png`;
                    return (
                      <motion.div 
                        key={i} 
                        className="dragon-head flex items-center justify-center p-1 bg-black/40 border border-white/5 rounded-md hover:border-red-500/30 transition-colors"
                        style={{ width: '48px', height: '48px', display: 'flex' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: i * 0.1 }}
                        title={`${type.toUpperCase()} TROPHY`}
                      >
                        <img src={trophyPath} alt={`${type} Trophy`} className="w-full h-full object-contain" />
                      </motion.div>
                    );
                  })}
                  {useWarscytheStore.getState().bossKills === 0 && <span className="empty-msg">NO DRAGONS SLAIN</span>}
               </div>
            </div>

            <div className="gallery-grid">
              {collectedArtifacts.length === 0 ? (
                <div className="empty-vault">
                  <p>NO ARTIFACTS RECOVERED YET.</p>
                  <span>CONQUER OPERATIONS TO FILL THE VAULT.</span>
                </div>
              ) : (
                collectedArtifacts.map((art, i) => (
                  <motion.div 
                    key={i}
                    className={`art-card rarity-${art.rarity} ${selectedArtifact === art ? 'active' : ''}`}
                    onClick={() => setSelectedArtifact(art)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src={getArtifactImage(art.name)} 
                      className={`art-card-icon-img art-img-filter ${art.rarity}`} 
                      alt={art.name} 
                      style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain', zIndex: 2 }}
                    />
                    <div className="rarity-dot" />
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="artifact-inspector custom-scrollbar">
            <AnimatePresence mode="wait">
              {selectedArtifact ? (
                <motion.div 
                  key={selectedArtifact.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="inspector-content"
                >
                  <div className="inspector-visual">
                    <img 
                      src={getArtifactImage(selectedArtifact.name)} 
                      className={`large-art-icon-img art-img-filter ${selectedArtifact.rarity}`} 
                      alt={selectedArtifact.name} 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', zIndex: 2 }}
                    />
                    <div className={`large-glow rarity-${selectedArtifact.rarity}`} />
                  </div>
                  
                    <div className="inspector-details">
                      <span className={`rarity-label rarity-${selectedArtifact.rarity}`}>
                        {rarities[selectedArtifact.rarity].label} ARTIFACT
                      </span>
                      <h3>{selectedArtifact.name}</h3>
                      <p className="art-date">RECOVERED: {new Date(selectedArtifact.date).toLocaleDateString()}</p>
                      
                      {(selectedArtifact.context || selectedArtifact.effortContext) && (
                        <div className="flex flex-col gap-1 mt-2 mb-4 p-3 bg-white/[0.02] border border-white/5 rounded">
                          {selectedArtifact.context && (
                            <p className="text-[9px] font-mono text-gray-400 uppercase font-bold tracking-[0.2em] border-l-2 border-gold-core/50 pl-2">
                              {selectedArtifact.context}
                            </p>
                          )}
                          {selectedArtifact.effortContext && (
                            <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest pl-2 mt-1">
                              {selectedArtifact.effortContext}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {selectedArtifact.lore && (
                        <div className="lore-box">
                          <div className="lore-header">
                            <Scroll size={12} />
                            <span>TACTICAL INTEL</span>
                          </div>
                          {selectedArtifact.hook && (
                            <p className="mb-3 text-[10px] font-mono text-gold-core/90 italic leading-relaxed">"{selectedArtifact.hook}"</p>
                          )}
                          <p>{selectedArtifact.lore}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
              ) : (
                <div className="inspector-placeholder">
                  <Star size={32} className="placeholder-icon" />
                  <p>SELECT AN ARTIFACT TO INSPECT ITS INTEL</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
        ) : (
          <div className="h-full overflow-y-auto custom-scrollbar">
            <ScytheCenter />
          </div>
        )}
        </div>
      </motion.div>

      <style jsx>{`
        .vault-backdrop { background: rgba(0,0,0,0.96); backdrop-filter: blur(10px); z-index: 2100; }
        
        .vault-modal-content {
          width: 95vw;
          height: 90vh;
          max-width: 1200px;
          background: #08080a;
          border: 1px solid var(--border-bright);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 0 100px rgba(0,0,0,0.8);
        }

        .vault-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid var(--border);
        }

        @media (min-width: 1024px) {
          .vault-header { padding: 2rem 3rem; }
        }
        
        .vault-title-group { display: flex; align-items: center; gap: 1rem; }
        @media (min-width: 1024px) { .vault-title-group { gap: 1.5rem; } }

        .title-text h2 { font-family: var(--font-display); font-size: 1rem; color: #fff; letter-spacing: 0.1em; }
        @media (min-width: 1024px) { .title-text h2 { font-size: 1.4rem; } }

        .title-text span { font-family: var(--font-mono); font-size: 0.5rem; color: var(--gold-core); letter-spacing: 0.1em; }
        @media (min-width: 1024px) { .title-text span { font-size: 0.6rem; letter-spacing: 0.2em; } }
        
        .vault-close { background: none; color: var(--text-dark); transition: 0.2s; }
        .vault-close:hover { color: #fff; transform: rotate(90deg); }

        .vault-layout { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
        @media (min-width: 1024px) {
          .vault-layout { display: grid; grid-template-columns: 1fr 450px; overflow: hidden; }
        }

        .artifact-gallery { 
          padding: 1.5rem; 
          background: radial-gradient(circle at center, rgba(197, 160, 89, 0.03) 0%, transparent 70%);
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .artifact-gallery { padding: 3rem; gap: 3rem; overflow-y: auto; }
        }

        .dragon-trophies-section {
          padding: 1rem;
          background: rgba(158, 27, 27, 0.05);
          border: 1px solid rgba(158, 27, 27, 0.1);
        }
        
        .dragon-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem; }
        .dragon-head { font-size: 1.5rem; filter: drop-shadow(0 0 10px rgba(158, 27, 27, 0.4)); }
        @media (min-width: 1024px) { .dragon-head { font-size: 2rem; } }
        
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
          gap: 1rem;
        }

        @media (min-width: 1024px) {
          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 1.5rem;
          }
        }

        .art-card {
          aspect-ratio: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: 0.3s;
        }
        .art-card:hover { border-color: var(--border-bright); background: rgba(255,255,255,0.06); }
        .art-card.active { border-color: var(--gold-core); background: rgba(197, 160, 89, 0.05); box-shadow: 0 0 20px rgba(197, 160, 89, 0.2); }
        
        .art-card-icon { font-size: 1.5rem; filter: drop-shadow(0 0 10px rgba(0,0,0,0.5)); }
        @media (min-width: 1024px) { .art-card-icon { font-size: 2.5rem; } }
        .rarity-dot { position: absolute; top: 10px; right: 10px; width: 6px; height: 6px; border-radius: 50%; }

         .rarity-common .rarity-dot { background: #aaa; }
        .rarity-uncommon .rarity-dot { background: var(--stage-ship); box-shadow: 0 0 5px var(--stage-ship); }
        .rarity-rare .rarity-dot { background: var(--stage-build); box-shadow: 0 0 5px var(--stage-build); }
        .rarity-epic .rarity-dot { background: var(--stage-finish); box-shadow: 0 0 5px var(--stage-finish); }
        .rarity-mythic .rarity-dot { background: #ff3d00; box-shadow: 0 0 5px #ff3d00; }

        .artifact-inspector { 
          background: rgba(0,0,0,0.4); 
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 2rem 1.5rem;
          overflow-y: auto;
        }

        @media (min-width: 1024px) {
          .artifact-inspector {
            border-top: none;
            border-left: 1px solid var(--border);
            padding: 4rem 3rem;
          }
        }

        .inspector-placeholder {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          color: var(--text-dark);
          text-align: center;
          min-height: 200px;
        }
        .placeholder-icon { opacity: 0.2; }
        .inspector-placeholder p { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.1em; max-width: 200px; }

        .inspector-content { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; }
        
        .inspector-visual {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }

        @media (min-width: 1024px) {
          .inspector-visual { width: 200px; height: 200px; margin-bottom: 3rem; }
        }

        .large-art-icon { font-size: 5rem; position: relative; z-index: 2; }
        @media (min-width: 1024px) { .large-art-icon { font-size: 8rem; } }
        .large-glow { position: absolute; inset: 0; border-radius: 50%; filter: blur(40px); opacity: 0.3; }
        @media (min-width: 1024px) { .large-glow { filter: blur(50px); } }
        
         .large-glow.rarity-common { background: #fff; }
        .large-glow.rarity-uncommon { background: var(--stage-ship); }
        .large-glow.rarity-rare { background: var(--stage-build); }
        .large-glow.rarity-epic { background: var(--stage-finish); }
        .large-glow.rarity-mythic { background: #ff3d00; }

        .inspector-details { display: flex; flex-direction: column; gap: 1rem; width: 100%; }
        .rarity-label { font-size: 0.55rem; font-weight: 900; letter-spacing: 0.2em; margin-bottom: 0.25rem; }
        @media (min-width: 1024px) { .rarity-label { font-size: 0.6rem; letter-spacing: 0.3em; margin-bottom: 0.5rem; } }

         .rarity-label.rarity-common { color: var(--text-dark); }
        .rarity-label.rarity-uncommon { color: var(--stage-ship); }
        .rarity-label.rarity-rare { color: var(--stage-build); }
        .rarity-label.rarity-epic { color: var(--stage-finish); }
        .rarity-label.rarity-mythic { color: #ff3d00; }

        .inspector-details h3 { font-family: var(--font-display); font-size: 1.5rem; color: #fff; letter-spacing: 0.05em; }
        @media (min-width: 1024px) { .inspector-details h3 { font-size: 2rem; } }
        .art-date { font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-dark); }
        
        .lore-box {
          margin-top: 1.5rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1rem;
          text-align: left;
        }

        @media (min-width: 1024px) {
          .lore-box { margin-top: 3rem; padding: 1.5rem; }
        }

        .lore-header { display: flex; align-items: center; gap: 0.5rem; color: var(--gold-core); font-size: 0.5rem; font-weight: 900; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
        @media (min-width: 1024px) { .lore-header { gap: 0.75rem; font-size: 0.55rem; letter-spacing: 0.2em; margin-bottom: 1rem; } }
        .lore-box p { font-size: 0.8rem; color: var(--text-dim); line-height: 1.5; font-style: italic; }
        @media (min-width: 1024px) { .lore-box p { font-size: 0.9rem; line-height: 1.6; } }

        .empty-vault { grid-column: 1 / -1; padding: 3rem 1rem; text-align: center; color: var(--text-dark); }
        @media (min-width: 1024px) { .empty-vault { padding: 5rem; } }
        .empty-vault p { font-family: var(--font-display); font-size: 0.9rem; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
        @media (min-width: 1024px) { .empty-vault p { font-size: 1rem; letter-spacing: 0.2em; margin-bottom: 1rem; } }
        .empty-vault span { font-family: var(--font-mono); font-size: 0.55rem; }

        .art-img-filter.common { filter: grayscale(100%) brightness(0.8) drop-shadow(0 0 6px rgba(170, 170, 170, 0.3)); }
        .art-img-filter.uncommon { filter: hue-rotate(90deg) saturate(1.5) drop-shadow(0 0 6px rgba(46, 204, 113, 0.35)); }
        .art-img-filter.rare { filter: hue-rotate(15deg) saturate(2) brightness(1.1) drop-shadow(0 0 8px rgba(241, 196, 15, 0.45)); }
        .art-img-filter.epic { filter: hue-rotate(-30deg) saturate(2) brightness(1) drop-shadow(0 0 10px rgba(231, 76, 60, 0.55)); }
        .art-img-filter.mythic { filter: hue-rotate(240deg) saturate(2.5) brightness(1.1) drop-shadow(0 0 12px rgba(147, 51, 234, 0.65)); }
      `}</style>
    </div>
  );
}
