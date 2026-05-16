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
  ArrowLeft,
  Shield
} from 'lucide-react';

export default function MapSection() {
  const { level, bossKills, dailyLog } = useWarscytheStore();
  
  // Fake data for the Elite UI feel
  const expansionLogs = [
    { id: 1, type: 'scout', text: 'SCOUTED NEW TERRITORY: Unknown Sector', time: '2h ago' },
    { id: 2, type: 'secure', text: 'SECURED VILLAGE: Outpost Alpha', time: '1d ago' },
    { id: 3, type: 'intel', text: 'INTELLIGENCE UPDATE: New threat detected in the north', time: '2d ago' },
  ];

  const regionThemes = [
    { name: 'VALORIA', hue: 0, sepia: 0.2, saturate: 1 },
    { name: 'THE ASHEN WASTES', hue: 20, sepia: 0.8, saturate: 1.5 },
    { name: 'FROSTFALL PEAKS', hue: 200, sepia: 0.3, saturate: 0.8 },
    { name: 'THE VERDANT REACH', hue: 100, sepia: 0.5, saturate: 1.2 },
    { name: 'VOID REALM', hue: 280, sepia: 0.6, saturate: 2 },
  ];
  const currentRegion = regionThemes[(level - 1) % regionThemes.length];

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
            <div 
              className="map-image-layer" 
              style={{ 
                backgroundImage: "url('/campaign-map.png')",
                filter: `hue-rotate(${currentRegion.hue}deg) sepia(${currentRegion.sepia}) saturate(${currentRegion.saturate})`
              }} 
            >
            <div className="map-nodes-overlay">
                
                {/* 1. CASTLE BLACKVALE (Bottom) */}
                <motion.div className="map-node" style={{ top: '75%', left: '48%' }}>
                  <div className="node-glow secured" />
                  <span className="node-label">CASTLE BLACKVALE</span>
                  <div className="node-status">SECURED</div>
                </motion.div>

                {/* 2. VILLAGE OF ASHENDALE (Left) */}
                <motion.div className="map-node" style={{ top: '45%', left: '22%' }}>
                  <div className="node-glow secured" />
                  <span className="node-label">ASHENDALE</span>
                  <div className="node-status">SECURED</div>
                </motion.div>

                {/* 3. IRON JAIL (Center) */}
                <motion.div className="map-node active" style={{ top: '44%', left: '50%' }}>
                  <div className="node-glow active" />
                  <div className="current-ping" />
                  <span className="node-label">IRON JAIL</span>
                  <div className="node-status">IN PROGRESS</div>
                </motion.div>

                {/* 4. STONEHOLLOW (Right) */}
                <motion.div className="map-node locked" style={{ top: '50%', left: '82%' }}>
                  <div className="node-glow locked" />
                  <Lock size={12} className="lock-icon" />
                  <span className="node-label">STONEHOLLOW</span>
                  <div className="node-status">LOCKED</div>
                </motion.div>

                {/* 5. DRAGON'S NEST (Top Volcano) */}
                <motion.div className="map-node boss-node" style={{ top: '12%', left: '50%' }}>
                  <div className="node-glow boss" />
                  <Skull size={20} className="boss-icon" />
                  <span className="node-label">DRAGON'S NEST</span>
                  <div className="node-status">FINAL OBJECTIVE</div>
                </motion.div>

              </div>
            </div>
          </div>

          <div className="quick-actions-panel glass-panel">
            <div className="panel-header">
              <span className="panel-tag">QUICK ACTIONS</span>
            </div>
            <div className="action-grid">
              <button className="action-btn"><RotateCcw size={16} /> RECALCULATE PROTOCOL</button>
              <button className="action-btn"><Sword size={16} /> DEPLOY STRIKE TEAM</button>
              <button className="action-btn"><ArrowLeft size={16} /> RETURN TO OPERATIONS</button>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Region Intel */}
        <aside className="campaign-aside right">
          <div className="region-intel-panel glass-panel">
            <div className="panel-header">
              <span className="panel-tag">REGION INTEL</span>
            </div>
            
            <div className="region-branding">
              <h4>{currentRegion.name}</h4>
              <div className="region-banner-placeholder" style={{ 
                backgroundImage: "url('/region-banner.png')",
                filter: `hue-rotate(${currentRegion.hue}deg)`
              }} />
            </div>

            <div className="region-completion">
               <span className="stat-label">REGION COMPLETION</span>
               <div className="completion-dial">
                  <span className="pct">20%</span>
               </div>
            </div>

            <div className="active-modifiers">
              <span className="stat-label">ACTIVE MODIFIERS</span>
              <div className="modifier-item">
                <div className="mod-icon"><Users size={14} /></div>
                <div className="mod-info">
                  <p>FOG OF WAR</p>
                  <span>Unscouted territories remain hidden.</span>
                </div>
              </div>
            </div>

            <div className="upcoming-threat glass-panel">
               <span className="stat-label">UPCOMING THREAT</span>
               <div className="threat-card">
                  <div className="threat-image" style={{ backgroundImage: "url('/monster-wyrm.png')" }} />
                  <div className="threat-info">
                    <h5>DREAD WYRM</h5>
                    <p>A deadly presence stirs in the north. Prepare accordingly.</p>
                  </div>
               </div>
               <button className="view-target-btn">VIEW TARGET</button>
            </div>
          </div>
        </aside>

      </div>

      <style jsx>{`
        .campaign-theater {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 1rem;
          color: #fff;
          overflow-y: auto;
        }

        @media (min-width: 1024px) {
          .campaign-theater {
            height: 100vh;
            padding: 2rem;
            overflow: hidden;
          }
        }

        .campaign-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 640px) {
          .campaign-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .header-left { display: flex; gap: 1rem; align-items: center; }
        .header-titles h2 { font-family: var(--font-display); font-size: 1rem; letter-spacing: 0.1em; }
        @media (min-width: 1024px) {
          .header-titles h2 { font-size: 1.2rem; }
        }
        .header-titles p { font-size: 0.6rem; color: var(--text-dim); }

        .scout-report-btn {
          background: rgba(197, 160, 89, 0.1);
          border: 1px solid var(--gold-core);
          color: var(--gold-bright);
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          border-radius: 4px;
          width: fit-content;
        }

        .campaign-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          flex: 1;
          margin-bottom: 100px;
        }

        @media (min-width: 1024px) {
          .campaign-content {
            display: grid;
            grid-template-columns: 320px 1fr 320px;
            margin-bottom: 0;
            min-height: 0;
          }
        }

        .campaign-aside {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .campaign-aside {
            overflow-y: auto;
          }
        }

        .panel-tag {
          font-family: var(--font-mono);
          font-size: 0.5rem;
          font-weight: 900;
          color: var(--gold-core);
          letter-spacing: 0.2em;
        }

        .glass-panel {
          background: rgba(10, 10, 12, 0.8);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 1rem;
        }
        @media (min-width: 1024px) {
          .glass-panel { padding: 1.5rem; }
        }

        /* Log Panel */
        .log-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
        .log-item { display: flex; gap: 1rem; align-items: flex-start; }
        .log-icon { 
          width: 24px; height: 24px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
        }
        .log-icon.scout { color: var(--gold-core); }
        .log-icon.secure { color: #10b981; }
        .log-icon.intel { color: #3b82f6; }
        .log-details p { font-size: 0.65rem; font-weight: 500; }
        .log-time { font-size: 0.5rem; color: var(--text-dim); }

        /* Legend Panel */
        .legend-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-top: 1rem; }
        @media (min-width: 1024px) {
          .legend-grid { grid-template-columns: 1fr; }
        }
        .legend-item { display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.5rem; letter-spacing: 0.1em; color: var(--text-dim); }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.pos { background: #3b82f6; box-shadow: 0 0 10px #3b82f6; }
        .dot.avail { background: #10b981; box-shadow: 0 0 10px #10b981; }
        .dot.secured { background: var(--gold-core); }
        .dot.locked { background: #444; }
        .dot.boss { background: #ff3c3c; box-shadow: 0 0 10px #ff3c3c; }

        /* Map Viewport */
        .map-viewport-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .isometric-map-wrapper {
          flex: 1;
          background: #000;
          border: 1px solid rgba(197, 160, 89, 0.1);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          min-height: 400px;
        }
        .map-image-layer {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0.8;
        }
        .map-nodes-overlay {
          position: absolute;
          inset: 0;
        }
        
        .map-node {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          transform: translate(-50%, -50%);
          cursor: pointer;
          z-index: 10;
        }

        .node-glow {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 10px #fff;
          transition: 0.3s;
        }

        @media (min-width: 1024px) {
          .node-glow {
            width: 12px;
            height: 12px;
            box-shadow: 0 0 15px #fff;
          }
        }

        .node-glow.secured { background: var(--gold-core); box-shadow: 0 0 15px var(--gold-core); }
        .node-glow.active { background: #3b82f6; box-shadow: 0 0 20px #3b82f6; }
        .node-glow.locked { background: #444; box-shadow: none; opacity: 0.5; }
        .node-glow.boss { background: #ff3c3c; box-shadow: 0 0 25px #ff3c3c; }

        .current-ping {
          position: absolute;
          top: 0;
          width: 8px;
          height: 8px;
          border: 1px solid #3b82f6;
          border-radius: 50%;
          animation: ping 2s infinite;
        }

        @media (min-width: 1024px) {
          .current-ping { width: 12px; height: 12px; border-width: 2px; }
        }

        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }

        .node-label { 
          font-family: var(--font-display); 
          font-size: 0.45rem; 
          letter-spacing: 0.1em; 
          color: #fff; 
          text-shadow: 0 2px 4px rgba(0,0,0,0.8);
          white-space: nowrap;
        }
        @media (min-width: 1024px) {
          .node-label { font-size: 0.6rem; }
        }

        .node-status {
          font-family: var(--font-mono);
          font-size: 0.35rem;
          letter-spacing: 0.1em;
          color: var(--text-dim);
          text-shadow: 0 1px 2px rgba(0,0,0,0.8);
        }

        .map-node.active .node-label { color: var(--gold-bright); }
        .map-node.boss-node .node-label { color: #ff3c3c; }

        .boss-icon, .lock-icon {
          position: absolute;
          top: -20px;
          filter: drop-shadow(0 0 5px rgba(0,0,0,0.8));
        }
        @media (min-width: 1024px) {
          .boss-icon, .lock-icon { top: -25px; }
        }

        .lock-icon { color: rgba(255,255,255,0.3); }
        .boss-icon { color: #ff3c3c; animation: breathe 3s infinite ease-in-out; }

        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        .quick-actions-panel { height: fit-content; }
        .action-grid { display: grid; grid-template-columns: 1fr; gap: 0.5rem; margin-top: 1rem; }
        @media (min-width: 640px) {
          .action-grid { grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        }
        .action-btn {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--text-dim);
          padding: 0.75rem;
          font-family: var(--font-mono);
          font-size: 0.5rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: 0.3s;
        }
        .action-btn:hover { background: rgba(255,255,255,0.05); color: #fff; border-color: #fff; }

        /* Right Column Intel */
        .region-branding { margin-top: 1rem; text-align: center; }
        .region-branding h4 { font-family: var(--font-display); font-size: 1.2rem; letter-spacing: 0.2em; margin-bottom: 0.5rem; }
        .region-banner-placeholder { width: 100%; height: 80px; background-size: contain; background-repeat: no-repeat; background-position: center; opacity: 0.6; }

        .stat-label { font-family: var(--font-mono); font-size: 0.5rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; display: block; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        
        .completion-dial {
          width: 60px; height: 60px; border-radius: 50%; border: 3px solid var(--gold-core);
          display: flex; align-items: center; justify-content: center; margin: 0 auto;
          box-shadow: 0 0 15px var(--gold-glow);
        }
        .completion-dial .pct { font-family: var(--font-display); font-size: 0.8rem; color: var(--gold-bright); }

        .active-modifiers { margin-top: 1.5rem; }
        .modifier-item { display: flex; gap: 1rem; align-items: center; background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: 4px; }
        .mod-icon { color: var(--gold-core); }
        .mod-info p { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.05em; }
        .mod-info span { font-size: 0.5rem; color: var(--text-dim); }

        .upcoming-threat { margin-top: 1.5rem; background: rgba(255, 60, 60, 0.05); border: 1px solid rgba(255, 60, 60, 0.2); }
        .threat-card { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; }
        .threat-image { width: 40px; height: 40px; background-size: cover; border-radius: 4px; border: 1px solid rgba(255, 60, 60, 0.3); }
        .threat-info h5 { font-family: var(--font-display); font-size: 0.6rem; color: #ff3c3c; margin-bottom: 0.25rem; }
        .threat-info p { font-size: 0.45rem; color: var(--text-dim); line-height: 1.4; }
        .view-target-btn { width: 100%; margin-top: 1rem; background: none; border: 1px solid rgba(255, 60, 60, 0.5); color: #ff3c3c; font-family: var(--font-mono); font-size: 0.5rem; padding: 0.5rem; border-radius: 4px; cursor: pointer; transition: 0.3s; }
        .view-target-btn:hover { background: rgba(255, 60, 60, 0.1); }
      `}</style>
    </motion.div>
  );
}
