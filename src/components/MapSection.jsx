import React from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { 
  Lock, 
  Map as MapIcon, 
  Crosshair, 
  Info, 
  Sword, 
  Skull, 
  Eye, 
  Flag,
  RotateCcw,
  Users,
  ArrowLeft
} from 'lucide-react';

export default function MapSection() {
  const { level, bossKills, dailyLog } = useWarscytheStore();
  
  // Fake data for the Elite UI feel
  const expansionLogs = [
    { id: 1, type: 'scout', text: 'SCOUTED NEW TERRITORY: Stonehollow', time: '2h ago' },
    { id: 2, type: 'secure', text: 'SECURED VILLAGE: Village of Ashendale', time: '1d ago' },
    { id: 3, type: 'intel', text: 'INTELLIGENCE UPDATE: New threat detected in the north', time: '2d ago' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="campaign-theater"
    >
      {/* 1. Header Bar */}
      <header className="campaign-header">
        <div className="header-left">
          <MapIcon size={20} className="gold-text" />
          <div className="header-titles">
            <h2>CAMPAIGN THEATER // LEVEL {level}</h2>
            <p>The world is vast. Conquer tasks. Expand your reach.</p>
          </div>
        </div>
        <button className="scout-report-btn">
          <Info size={14} />
          <span>SCOUT REPORT</span>
        </button>
      </header>

      {/* 2. Main 3-Column Content */}
      <div className="campaign-content">
        
        {/* LEFT COLUMN: Logs and Legend */}
        <aside className="campaign-aside left">
          <div className="expansion-log-panel glass-panel">
            <div className="panel-header">
              <span className="panel-tag">EXPANSION LOG</span>
            </div>
            <div className="log-list">
              {expansionLogs.map(log => (
                <div key={log.id} className="log-item">
                  <div className={`log-icon ${log.type}`}>
                    {log.type === 'scout' && <Crosshair size={12} />}
                    {log.type === 'secure' && <Flag size={12} />}
                    {log.type === 'intel' && <Eye size={12} />}
                  </div>
                  <div className="log-details">
                    <p>{log.text}</p>
                    <span className="log-time">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="legend-panel glass-panel">
             <div className="panel-header">
              <span className="panel-tag">LEGEND</span>
            </div>
            <div className="legend-grid">
              <div className="legend-item"><div className="dot pos" /> YOUR POSITION</div>
              <div className="legend-item"><div className="dot avail" /> AVAILABLE NODE</div>
              <div className="legend-item"><div className="dot secured" /> SECURED NODE</div>
              <div className="legend-item"><div className="dot locked" /> LOCKED NODE</div>
              <div className="legend-item"><div className="dot boss" /> BOSS ENCOUNTER</div>
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: The Map Viewport */}
        <main className="map-viewport-container">
          <div className="isometric-map-wrapper">
            {/* The actual background image user will provide */}
            <div className="map-image-layer" style={{ backgroundImage: "url('/campaign-map.png')" }}>
              {/* Overlay nodes will go here in the next step */}
              <div className="map-nodes-overlay">
                {/* Example Node: Dragon's Nest */}
                <motion.div 
                  className="map-node boss-node" 
                  style={{ top: '20%', left: '50%' }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  </div>

                  {isCurrent && (
                    <div className="current-indicator">
                      <motion.div 
                        className="ping-circle"
                        animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="map-footer-panels">
        <div className="artifact-vault glass-panel">
          <div className="panel-label"><Shield size={12} /> ARTIFACT VAULT</div>
          <div className="artifact-grid">
            {collectedArtifacts.map((art, i) => (
              <div key={i} className={`vault-chip rarity-${art.rarity}`} title={art.name}>
                {art.icon}
              </div>
            ))}
            {Array.from({ length: bossKills }).map((_, i) => (
              <div key={`boss-${i}`} className="vault-chip rarity-boss" title="Dragon Head">
                🐲
              </div>
            ))}
            {collectedArtifacts.length === 0 && bossKills === 0 && <span className="empty-msg">NO ARTIFACTS RECOVERED</span>}
          </div>
        </div>

        <div className="lore-terminal glass-panel">
          <div className="panel-label"><Scroll size={12} /> INTELLIGENCE LOG</div>
          <div className="lore-stream">
            {Object.keys(unlockedLore).length === 0 ? (
              <p className="empty-msg">NO DATA FRAGMENTS DECRYPTED</p>
            ) : (
              Object.values(unlockedLore).flat().reverse().map((lore, i) => (
                <div key={i} className="lore-entry">
                  <div className="lore-timestamp">ENTRY_0{i}</div>
                  <p className="lore-text">"{lore}"</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .tactical-map-view { 
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #050507;
          overflow: hidden;
        }

        .map-grain {
          position: absolute;
          inset: 0;
          background-image: url('https://www.transparenttextures.com/patterns/dark-matter.png');
          opacity: 0.05;
          pointer-events: none;
        }

        .map-grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(197, 160, 89, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(197, 160, 89, 0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .map-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 3rem;
          background: rgba(0,0,0,0.6);
          border-bottom: 1px solid var(--border);
          z-index: 10;
          backdrop-filter: blur(10px);
        }
        .map-title { display: flex; align-items: center; gap: 1.5rem; }
        .map-title h2 { font-family: var(--font-display); font-size: 1rem; letter-spacing: 0.25em; color: var(--text-primary); }
        .text-gold { color: var(--gold-core); }

        .campaign-stats { display: flex; gap: 2rem; }
        .camp-stat { display: flex; align-items: center; gap: 0.75rem; font-family: var(--font-mono); font-size: 0.6rem; font-weight: 800; color: var(--gold-core); letter-spacing: 0.1em; }

        .map-viewport {
          flex: 1;
          position: relative;
          overflow: auto;
          padding: 5rem;
        }

        .map-scroll-container {
          position: relative;
          width: 200%;
          height: 300%;
          min-width: 100%;
          min-height: 100%;
        }

        .map-connections {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .nodes-layer { position: relative; width: 100%; height: 100%; }

        .tactical-node {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          z-index: 5;
        }

        .node-icon-wrapper {
          position: relative;
          width: 56px;
          height: 56px;
          border: 1px solid;
          border-radius: 12px;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 5px 15px rgba(0,0,0,0.4);
        }

        .node-icon-inner { font-size: 1.8rem; transition: 0.3s; }

        .boss-glow {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(158, 27, 27, 0.3) 0%, transparent 70%);
          animation: boss-pulse 2s infinite;
        }

        @keyframes boss-pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.5); opacity: 0.6; }
        }

        .node-label { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; }
        .node-id { font-family: var(--font-mono); font-size: 0.5rem; font-weight: 900; letter-spacing: 0.1em; opacity: 0.8; }
        .node-name { font-family: var(--font-display); font-size: 0.7rem; font-weight: 700; color: var(--text-dim); letter-spacing: 0.1em; max-width: 120px; }

        /* Node States */
        .tactical-node.current .node-icon-wrapper { 
          border-color: var(--gold-core) !important;
          box-shadow: 0 0 30px var(--gold-glow);
        }
        .tactical-node.current .node-name { color: var(--text-primary); }

        .tactical-node.completed .node-icon-wrapper { opacity: 0.7; }
        
        .tactical-node.locked { opacity: 0.2; filter: grayscale(1); }

        .current-indicator {
          position: absolute;
          inset: -20px;
          pointer-events: none;
        }
        .ping-circle { position: absolute; inset: 0; border: 2px solid var(--gold-core); border-radius: 50%; }

        .map-footer-panels {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 1rem;
          padding: 1rem;
          height: 180px;
          background: rgba(0,0,0,0.5);
          border-top: 1px solid var(--border);
          position: sticky;
          bottom: 0;
          z-index: 20;
          backdrop-filter: blur(10px);
        }

        .panel-label { 
          font-size: 0.55rem; 
          font-weight: 900; 
          color: var(--text-dark); 
          letter-spacing: 0.2em; 
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .artifact-vault { padding: 1rem; display: flex; flex-direction: column; }
        .artifact-grid { display: flex; flex-wrap: wrap; gap: 8px; overflow-y: auto; }
        .vault-chip {
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: 0.2s;
        }
        .vault-chip:hover { transform: translateY(-2px); border-color: var(--border-bright); }

        .lore-terminal { padding: 1rem; display: flex; flex-direction: column; overflow: hidden; }
        .lore-stream { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; }
        .lore-entry { border-left: 1px solid var(--gold-core); padding-left: 1rem; }
        .lore-timestamp { font-family: var(--font-mono); font-size: 0.45rem; color: var(--gold-core); opacity: 0.6; }
        .lore-text { font-size: 0.75rem; color: var(--text-dim); font-style: italic; line-height: 1.4; }

        .empty-msg { font-size: 0.6rem; font-family: var(--font-mono); color: var(--text-dark); letter-spacing: 0.1em; }
      `}</style>
    </motion.div>
  );
}
