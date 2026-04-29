import React from 'react';
import { motion } from 'framer-motion';
import { useWarlordStore } from '../store/useWarlordStore';
import { REGIONS } from '../store/constants';
import { X, Lock, Map as MapIcon, Scroll, Shield } from 'lucide-react';

export default function MapModal({ onClose }) {
  const { level, currentLevelProgress, unlockedLore, collectedArtifacts } = useWarlordStore();
  
  const currentRegionIdx = level - 1;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: [0.7, 1.08, 1] }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="modal-content map-modal glass-panel"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="header-title">
            <MapIcon size={20} className="gold-text" />
            <h2>QUEST MAP: ASCENT</h2>
          </div>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="map-body">
          <div className="regions-grid">
            {REGIONS.map((region, idx) => {
              const isLocked = idx > currentRegionIdx;
              const isCurrent = idx === currentRegionIdx;
              const isCompleted = idx < currentRegionIdx;

              return (
                <div 
                  key={region.name} 
                  className={`region-tile ${isLocked ? 'locked' : ''} ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <div className="region-num">REGION {idx + 1}</div>
                  <div className="region-icon">{isLocked ? <Lock size={16} /> : region.icon}</div>
                  <div className="region-name">{isLocked ? '???' : region.name}</div>
                  {isCurrent && (
                    <div className="region-progress">
                      <div className="mini-bar">
                        <div className="mini-fill" style={{ width: `${(currentLevelProgress / 10) * 100}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="map-sidebar">
            <section className="lore-section">
              <div className="section-header">
                <Scroll size={16} /> <h3>UNLOCKED LORE</h3>
              </div>
              <div className="lore-list">
                {Object.keys(unlockedLore).length === 0 ? (
                  <p className="empty-msg">No scrolls recovered. Complete operations to unlock lore.</p>
                ) : (
                  Object.values(unlockedLore).flat().map((lore, i) => (
                    <div key={i} className="lore-item">
                      <p>"{lore}"</p>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="vault-section">
              <div className="section-header">
                <Shield size={16} /> <h3>ARTIFACT VAULT</h3>
              </div>
              <div className="artifact-grid">
                {collectedArtifacts.length === 0 ? (
                  <p className="empty-msg">Vault is empty.</p>
                ) : (
                  collectedArtifacts.map((art, i) => (
                    <div key={i} className={`artifact-chip rarity-${art.rarity}`} title={art.description}>
                      <span>{art.icon}</span>
                      <label>{art.name}</label>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .map-modal { max-width: 900px; width: 95%; height: 85vh; padding: 2rem; display: flex; flex-direction: column; }
        .header-title { display: flex; align-items: center; gap: 1rem; }
        .header-title h2 { font-family: var(--font-display); font-size: 1.2rem; letter-spacing: 0.2rem; }
        .gold-text { color: var(--gold-core); }

        .map-body { flex: 1; display: grid; grid-template-columns: 1fr 320px; gap: 2rem; overflow: hidden; margin-top: 1.5rem; }
        
        .regions-grid { 
          display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); 
          gap: 12px; overflow-y: auto; padding-right: 1rem;
        }
        
        .region-tile {
          background: rgba(255,255,255,0.03); border: 1px solid var(--border);
          border-radius: 8px; padding: 1rem; display: flex; flex-direction: column;
          align-items: center; text-align: center; gap: 0.5rem; position: relative;
          transition: 0.3s;
        }
        .region-tile.current { border-color: var(--gold-core); background: rgba(212,175,55,0.05); }
        .region-tile.completed { border-color: var(--stage-ship); opacity: 0.7; }
        .region-tile.locked { opacity: 0.2; }
        
        .region-num { font-size: 0.5rem; font-weight: 900; color: var(--text-dim); }
        .region-icon { font-size: 1.5rem; }
        .region-name { font-family: var(--font-display); font-size: 0.6rem; font-weight: 800; letter-spacing: 0.1em; }
        
        .region-progress { width: 100%; margin-top: 5px; }
        .mini-bar { height: 3px; background: rgba(0,0,0,0.3); border-radius: 2px; overflow: hidden; }
        .mini-fill { height: 100%; background: var(--gold-core); }

        .map-sidebar { display: flex; flex-direction: column; gap: 1.5rem; overflow-y: auto; padding-left: 1rem; border-left: 1px solid var(--border); }
        .section-header { display: flex; align-items: center; gap: 0.6rem; color: var(--gold-core); margin-bottom: 0.8rem; }
        .section-header h3 { font-size: 0.7rem; font-weight: 900; letter-spacing: 0.1em; }
        
        .lore-list { display: flex; flex-direction: column; gap: 8px; }
        .lore-item { background: rgba(0,0,0,0.2); padding: 0.8rem; border-radius: 6px; border-left: 2px solid var(--gold-core); }
        .lore-item p { font-size: 0.75rem; font-style: italic; color: var(--text-dim); line-height: 1.4; }
        
        .artifact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .artifact-chip { 
          background: rgba(255,255,255,0.03); padding: 6px; border-radius: 6px; 
          display: flex; align-items: center; gap: 6px; border: 1px solid var(--border);
        }
        .artifact-chip span { font-size: 1.2rem; }
        .artifact-chip label { font-size: 0.55rem; font-weight: 700; color: var(--text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .rarity-rare { border-color: var(--stage-build); }
        .rarity-epic { border-color: var(--stage-finish); }
        .rarity-legendary { border-color: var(--gold-core); }
        
        .empty-msg { font-size: 0.7rem; color: var(--text-dim); opacity: 0.5; }
      `}</style>
    </div>
  );
}
