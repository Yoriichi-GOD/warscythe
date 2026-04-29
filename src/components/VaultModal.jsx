import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarlordStore } from '../store/useWarlordStore';
import { X, Shield, Scroll, Award, Star } from 'lucide-react';

export default function VaultModal({ onClose }) {
  const { collectedArtifacts, unlockedLore, currentTitle } = useWarlordStore();
  const [selectedArtifact, setSelectedArtifact] = useState(null);

  const rarities = {
    common: { color: '#aaa', label: 'COMMON' },
    uncommon: { color: 'var(--stage-ship)', label: 'UNCOMMON' },
    rare: { color: 'var(--stage-build)', label: 'RARE' },
    epic: { color: 'var(--stage-finish)', label: 'EPIC' }
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
          <div className="vault-title-group">
            <Award size={24} className="text-gold" />
            <div className="title-text">
              <h2>THE ARTIFACT VAULT</h2>
              <span>ARCHIVE OF THE {currentTitle.toUpperCase()}</span>
            </div>
          </div>
          <button className="vault-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="vault-layout">
          <div className="artifact-gallery">
            <div className="dragon-trophies-section glass-panel">
               <div className="panel-label">
                  <Star size={12} fill="var(--red-hot)" />
                  <span>DRAGON HEAD TROPHIES</span>
               </div>
               <div className="dragon-grid">
                  {Array.from({ length: useWarlordStore.getState().bossKills }).map((_, i) => (
                    <motion.div 
                      key={i} 
                      className="dragon-head"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: i * 0.1 }}
                    >
                      🐲
                    </motion.div>
                  ))}
                  {useWarlordStore.getState().bossKills === 0 && <span className="empty-msg">NO DRAGONS SLAIN</span>}
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
                    <span className="art-card-icon">{art.icon}</span>
                    <div className="rarity-dot" />
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="artifact-inspector">
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
                    <span className="large-art-icon">{selectedArtifact.icon}</span>
                    <div className={`large-glow rarity-${selectedArtifact.rarity}`} />
                  </div>
                  
                  <div className="inspector-details">
                    <span className={`rarity-label rarity-${selectedArtifact.rarity}`}>
                      {rarities[selectedArtifact.rarity].label} ARTIFACT
                    </span>
                    <h3>{selectedArtifact.name}</h3>
                    <p className="art-date">RECOVERED: {new Date(selectedArtifact.date).toLocaleDateString()}</p>
                    
                    <div className="lore-box">
                      <div className="lore-header">
                        <Scroll size={12} />
                        <span>TACTICAL INTEL</span>
                      </div>
                      <p>
                        This ancient relic was salvaged during a critical mission. It resonates with the 
                        will of a true Warlord. Holding it increases tactical focus and reduces distraction 
                        by 15% (theoretical).
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="inspector-placeholder">
                  <Star size={32} className="placeholder-icon" />
                  <p>SELECT AN ARTIFACT TO INSPECT ITS LORE</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .vault-backdrop { background: rgba(0,0,0,0.96); backdrop-filter: blur(10px); z-index: 2100; }
        
        .vault-modal-content {
          width: 95vw;
          height: 85vh;
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
          padding: 2rem 3rem;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid var(--border);
        }
        
        .vault-title-group { display: flex; align-items: center; gap: 1.5rem; }
        .title-text h2 { font-family: var(--font-display); font-size: 1.4rem; color: #fff; letter-spacing: 0.1em; }
        .title-text span { font-family: var(--font-mono); font-size: 0.6rem; color: var(--gold-core); letter-spacing: 0.2em; }
        
        .vault-close { background: none; color: var(--text-dark); transition: 0.2s; }
        .vault-close:hover { color: #fff; transform: rotate(90deg); }

        .vault-layout { flex: 1; display: grid; grid-template-columns: 1fr 450px; overflow: hidden; }

        .artifact-gallery { 
          padding: 3rem; 
          overflow-y: auto; 
          background: radial-gradient(circle at center, rgba(197, 160, 89, 0.03) 0%, transparent 70%);
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .dragon-trophies-section {
          padding: 1.5rem;
          background: rgba(158, 27, 27, 0.05);
          border: 1px solid rgba(158, 27, 27, 0.1);
        }
        
        .dragon-grid { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem; }
        .dragon-head { font-size: 2rem; filter: drop-shadow(0 0 10px rgba(158, 27, 27, 0.4)); }
        
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 1.5rem;
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
        
        .art-card-icon { font-size: 2.5rem; filter: drop-shadow(0 0 10px rgba(0,0,0,0.5)); }
        .rarity-dot { position: absolute; top: 10px; right: 10px; width: 6px; height: 6px; border-radius: 50%; }

        .rarity-common .rarity-dot { background: #aaa; }
        .rarity-uncommon .rarity-dot { background: var(--stage-ship); box-shadow: 0 0 5px var(--stage-ship); }
        .rarity-rare .rarity-dot { background: var(--stage-build); box-shadow: 0 0 5px var(--stage-build); }
        .rarity-epic .rarity-dot { background: var(--stage-finish); box-shadow: 0 0 5px var(--stage-finish); }

        .artifact-inspector { 
          background: rgba(0,0,0,0.4); 
          border-left: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 4rem 3rem;
        }

        .inspector-placeholder {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          color: var(--text-dark);
          text-align: center;
        }
        .placeholder-icon { opacity: 0.2; }
        .inspector-placeholder p { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.1em; max-width: 200px; }

        .inspector-content { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; }
        
        .inspector-visual {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 3rem;
        }
        .large-art-icon { font-size: 8rem; position: relative; z-index: 2; }
        .large-glow { position: absolute; inset: 0; border-radius: 50%; filter: blur(50px); opacity: 0.3; }
        
        .large-glow.rarity-common { background: #fff; }
        .large-glow.rarity-uncommon { background: var(--stage-ship); }
        .large-glow.rarity-rare { background: var(--stage-build); }
        .large-glow.rarity-epic { background: var(--stage-finish); }

        .inspector-details { display: flex; flex-direction: column; gap: 1rem; width: 100%; }
        .rarity-label { font-size: 0.6rem; font-weight: 900; letter-spacing: 0.3em; margin-bottom: 0.5rem; }
        .rarity-label.rarity-common { color: var(--text-dark); }
        .rarity-label.rarity-uncommon { color: var(--stage-ship); }
        .rarity-label.rarity-rare { color: var(--stage-build); }
        .rarity-label.rarity-epic { color: var(--stage-finish); }

        .inspector-details h3 { font-family: var(--font-display); font-size: 2rem; color: #fff; letter-spacing: 0.05em; }
        .art-date { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dark); }

        .lore-box {
          margin-top: 3rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: left;
        }
        .lore-header { display: flex; align-items: center; gap: 0.75rem; color: var(--gold-core); font-size: 0.55rem; font-weight: 900; letter-spacing: 0.2em; margin-bottom: 1rem; }
        .lore-box p { font-size: 0.9rem; color: var(--text-dim); line-height: 1.6; font-style: italic; }

        .empty-vault { grid-column: 1 / -1; padding: 5rem; text-align: center; color: var(--text-dark); }
        .empty-vault p { font-family: var(--font-display); font-size: 1rem; letter-spacing: 0.2em; margin-bottom: 1rem; }
        .empty-vault span { font-family: var(--font-mono); font-size: 0.6rem; }
      `}</style>
    </div>
  );
}
