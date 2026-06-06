import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';

const getDragonAsset = (lvl) => {
  const dragonTypes = [
    'wyrm', 'lava', 'frost', 'shadow', 'wyvern', 
    'celestial', 'skeletal', 'storm', 'abyssal', 'ancient'
  ];
  const type = dragonTypes[(lvl - 1) % dragonTypes.length];
  return `/dragons/dragon-${type}.png`;
};

const getDragonName = (lvl) => {
  const dragonNames = [
    'Malgrath the Dread', 'Stoneback Krul', 'Glacius the Eternal', 'Vreth the Unseen', 
    'Ignarax the Burning', 'Sol-Varen the Radiant', 'Duskbone Revenant', 'Thundercoil Zarak', 
    'Nyxara the Void', 'Gorvek the Ancient'
  ];
  return dragonNames[(lvl - 1) % dragonNames.length];
};

const getNodeBanner = (nodeId) => {
  const banners = {
    castle: '/nodes/node-blackvale.png',
    ashendale: '/nodes/node-ashendale.png',
    jail: '/nodes/node-ironjail.png',
    stone: '/nodes/node-stonehollow.png',
    boss: '/nodes/node-blackvale.png'
  };
  return banners[nodeId] || '/nodes/node-blackvale.png';
};
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
  Shield,
  X,
  ScrollText
} from 'lucide-react';
import { REGIONS, TASKS_PER_LEVEL } from '../store/constants';

export default function MapSection({ onTabChange }) {
  const { 
    level, bossKills, dailyLog, tasks, generateMicroSteps, 
    currentLevelProgress, unlockedLore, triggerBossFlash 
  } = useWarscytheStore();
  
  const [showFog, setShowFog] = useState(false);
  const prevLevelRef = useRef(level);

  useEffect(() => {
    if (level > prevLevelRef.current) {
      setShowFog(true);
      const timer = setTimeout(() => setShowFog(false), 2000);
      prevLevelRef.current = level;
      return () => clearTimeout(timer);
    } else {
      prevLevelRef.current = level;
    }
  }, [level]);

  const mapIndex = ((level - 1) % 10) + 1;
  const [selectedNode, setSelectedNode] = useState(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [recalcSuccess, setRecalcSuccess] = useState(false);

  const handleRecalculate = () => {
    if (tasks.length === 0) {
      alert("No active operations to recalculate.");
      return;
    }
    setIsRecalculating(true);
    setRecalcSuccess(false);
    setTimeout(() => {
      tasks.forEach(task => generateMicroSteps(task.id));
      setIsRecalculating(false);
      setRecalcSuccess(true);
      setTimeout(() => setRecalcSuccess(false), 2000);
    }, 1200);
  };
  
  // Dynamic expansion logs based on current progress / level
  const getRegion = (idx) => {
    if (idx < 0) return null;
    return REGIONS[idx % REGIONS.length];
  };

  const lastRegion = getRegion(level - 2);
  const currentRegion = getRegion(level - 1);
  const nextRegion = getRegion(level);

  const expansionLogs = [
    { 
      id: 1, 
      type: 'scout', 
      text: `SCOUTED SECTOR: ${nextRegion ? nextRegion.name.toUpperCase() : 'UNKNOWN REACH'}`, 
      time: 'Locked' 
    },
    { 
      id: 2, 
      type: 'secure', 
      text: `CURRENT AREA: ${currentRegion ? currentRegion.name.toUpperCase() : 'THE THRESHOLD'} (STRIKE ACTIVE)`, 
      time: 'In Progress' 
    },
    ...(lastRegion ? [{ 
      id: 3, 
      type: 'intel', 
      text: `SECURED CAMPAIGN: ${lastRegion.name.toUpperCase()}`, 
      time: 'Secured' 
    }] : [{
      id: 3,
      type: 'intel',
      text: 'TACTICAL BASE: GATEWAY OF THE THRESHOLD SECURED',
      time: 'Secured'
    }])
  ];

  const regionThemes = [
    { hue: 0, sepia: 0.2, saturate: 1 },
    { hue: 20, sepia: 0.8, saturate: 1.5 },
    { hue: 200, sepia: 0.3, saturate: 0.8 },
    { hue: 100, sepia: 0.5, saturate: 1.2 },
    { hue: 280, sepia: 0.6, saturate: 2 },
  ];
  const currentRegionTheme = regionThemes[(level - 1) % regionThemes.length];
  
  const regionIdx = Math.min(level - 1, REGIONS.length - 1);
  const activeRegion = REGIONS[regionIdx];
  const displayProgress = Math.min(currentLevelProgress || 0, TASKS_PER_LEVEL);
  const progressPct = Math.round((displayProgress / TASKS_PER_LEVEL) * 100);
  const currentLore = unlockedLore?.[regionIdx] || [];

  // DAILY SHIFTING ROUTES LOGIC
  const dayOfWeek = new Date().getDay();
  const isAshendaleLocked = dayOfWeek % 2 === 0; // Locked on even days
  const isStonehollowLocked = !isAshendaleLocked; // Locked on odd days

  const nodes = [
    { id: 'castle', label: 'CASTLE BLACKVALE', top: '48%', left: '78%', status: 'SECURED', type: 'secured' },
    { id: 'ashendale', label: 'ASHENDALE', top: '72%', left: '78%', status: isAshendaleLocked ? 'LOCKED' : 'SECURED', type: isAshendaleLocked ? 'locked' : 'secured' },
    { id: 'jail', label: 'IRON JAIL', top: '45%', left: '22%', status: 'IN PROGRESS', type: 'active' },
    { id: 'stone', label: 'STONEHOLLOW', top: '72%', left: '22%', status: isStonehollowLocked ? 'LOCKED' : 'SECURED', type: isStonehollowLocked ? 'locked' : 'secured' },
    { id: 'boss', label: "DRAGON'S NEST", top: '15%', left: '50%', status: 'FINAL OBJECTIVE', type: 'boss' }
  ];

  const connections = [
    { from: 'castle', to: 'jail', color: 'rgba(197, 160, 89, 0.3)' },
    { from: 'jail', to: 'ashendale', color: isAshendaleLocked ? 'rgba(255, 60, 60, 0.1)' : 'rgba(197, 160, 89, 0.3)' },
    { from: 'jail', to: 'stone', color: isStonehollowLocked ? 'rgba(255, 60, 60, 0.1)' : 'rgba(197, 160, 89, 0.3)' },
    { from: 'jail', to: 'boss', color: 'rgba(255, 60, 60, 0.3)', thick: true }
  ];

  const getNodePos = (id) => {
    const node = nodes.find(n => n.id === id);
    return node ? { x: node.left, y: node.top } : { x: '50%', y: '50%' };
  };

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
          <div className="expansion-log-panel elite-panel">
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

          <div className="legend-panel elite-panel">
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
            <AnimatePresence>
              {showFog && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="map-fog-overlay-sheet"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: "url('/maps/map-fog-overlay.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 100,
                    pointerEvents: 'none',
                  }}
                />
              )}
            </AnimatePresence>
            <div 
              className="map-image-layer" 
              style={{ 
                backgroundImage: `url('/maps/campaign-map-${mapIndex}.png')`,
                filter: `hue-rotate(${currentRegionTheme.hue}deg) sepia(${currentRegionTheme.sepia}) saturate(${currentRegionTheme.saturate})`
              }} 
            >
            <div className="map-nodes-overlay">
              {/* Tactical Connection Paths */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {connections.map((c, i) => {
                  const fromPos = getNodePos(c.from);
                  const toPos = getNodePos(c.to);
                  return (
                    <line 
                      key={i}
                      x1={fromPos.x} 
                      y1={fromPos.y} 
                      x2={toPos.x} 
                      y2={toPos.y} 
                      stroke={c.color} 
                      strokeWidth={c.thick ? "2" : "1.5"} 
                      strokeDasharray="4 4" 
                    />
                  );
                })}
              </svg>
                
                {nodes.map(node => (
                  <motion.div 
                    key={node.id} 
                    className={`map-node ${node.type}`} 
                    style={{ top: node.top, left: node.left }} 
                    onClick={() => setSelectedNode(node.id)}
                  >
                    <div className={`node-glow ${node.type}`} />
                    {node.type === 'active' && <div className="current-ping" />}
                    {node.type === 'locked' && <img src="/maps/map-lock-icon.png" className="lock-icon" alt="Locked" />}
                    {node.type === 'boss' && <Skull size={20} className="boss-icon" />}
                    <span className="node-label">{node.label}</span>
                    <div className="node-status">{node.status}</div>
                  </motion.div>
                ))}

              </div>
            </div>
          </div>

          <div className="quick-actions-panel elite-panel">
            <div className="panel-header">
              <span className="panel-tag">QUICK ACTIONS</span>
            </div>
            <div className="action-grid">
              <button 
                className="action-btn" 
                onClick={handleRecalculate} 
                disabled={isRecalculating}
                style={{ opacity: isRecalculating ? 0.6 : 1 }}
              >
                <RotateCcw size={16} className={isRecalculating ? 'animate-spin' : ''} /> 
                {isRecalculating ? 'RECALCULATING...' : recalcSuccess ? 'DECOMPOSITION DONE' : 'RECALCULATE PROTOCOL'}
              </button>
              <button className="action-btn" onClick={() => onTabChange && onTabChange('ops', { openAddTask: true })}>
                <Sword size={16} /> DEPLOY STRIKE TEAM
              </button>
              <button className="action-btn" onClick={() => onTabChange && onTabChange('ops')}>
                <ArrowLeft size={16} /> RETURN TO OPERATIONS
              </button>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Region Intel */}
        <aside className="campaign-aside right">
          <div className="region-intel-panel elite-panel">
            <div className="panel-header">
              <span className="panel-tag">REGION INTEL</span>
            </div>
            
            <div className="region-branding">
              <h4>{activeRegion.name} {activeRegion.icon}</h4>
              <div className="region-banner-placeholder" style={{ 
                backgroundImage: `url('${getNodeBanner(selectedNode || 'jail')}')`,
                filter: `hue-rotate(${currentRegionTheme.hue}deg)`
              }} />
            </div>

            <div className="region-completion">
               <span className="stat-label">REGION COMPLETION</span>
               <div className="completion-dial">
                  <span className="pct">{progressPct}%</span>
               </div>
               <p className="text-[10px] text-gray-500 font-mono tracking-widest text-center mt-2 uppercase">{displayProgress} / {TASKS_PER_LEVEL} SECURED</p>
            </div>

            <div className="active-modifiers">
              <span className="stat-label">TERRITORY LORE</span>
              <div className="modifier-item" style={{ flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                <p className="text-[10px] font-mono text-gold-core/80 leading-relaxed italic border-l-2 border-gold-core/30 pl-2">
                  "{activeRegion.desc}"
                </p>
              </div>
            </div>

            <div className="upcoming-threat elite-panel" style={{ padding: '1rem' }}>
              <span className="stat-label" style={{ marginTop: 0 }}>UPCOMING THREAT</span>
              <div className="threat-card">
                <div 
                  className="threat-image" 
                  style={{ backgroundImage: `url('${getDragonAsset(level)}')` }} 
                />
                <div className="threat-info">
                  <h5>{getDragonName(level).toUpperCase()}</h5>
                  <p>A menacing beast ruling over this territory. Secure all operations to challenge it.</p>
                </div>
              </div>
              <button className="view-target-btn" onClick={() => setSelectedNode('boss')}>
                VIEW BOSS INTEL
              </button>
            </div>

            <div className="recovered-fragments elite-panel" style={{ padding: '1rem', marginTop: '1.5rem' }}>
               <span className="stat-label" style={{ marginTop: 0 }}>RECOVERED FRAGMENTS</span>
               <div className="flex flex-col gap-3 mt-3 overflow-y-auto max-h-[150px] custom-scrollbar pr-2">
                 {currentLore.length === 0 ? (
                   <p className="text-[9px] font-mono text-gray-600 text-center py-4 uppercase tracking-widest">
                     No fragments recovered yet.<br/>Conquer operations to reveal the truth.
                   </p>
                 ) : (
                   [...currentLore].reverse().map((fragment, idx) => (
                     <div key={idx} className="flex gap-2 items-start p-2 rounded bg-white/[0.02] border border-white/5">
                        <ScrollText size={12} className="text-gold-core shrink-0 mt-0.5" />
                        <p className="text-[9px] font-mono text-gray-400 leading-relaxed italic">"{fragment}"</p>
                     </div>
                   ))
                 )}
               </div>
               
               {/* Access Full Vault Button */}
               <button 
                 onClick={() => onTabChange && onTabChange('ledger', { subTab: 'vault' })}
                 className="w-full mt-4 py-2 border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-all group flex items-center justify-center rounded cursor-pointer"
               >
                 <span className="text-[8px] font-mono text-gray-500 group-hover:text-gold-core tracking-[0.4em] uppercase">[ ACCESS FULL VAULT ]</span>
               </button>
            </div>
          </div>
        </aside>

      </div>

      <style jsx>{`
        .campaign-theater {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 1rem;
          color: #fff;
          overflow-y: auto;
        }

        @media (min-width: 1024px) {
          .campaign-theater {
            height: 100%;
            padding: 1.5rem 1.5rem 0.5rem 1.5rem;
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
          border: 1px solid var(--color-gold-core);
          color: var(--color-gold-bright);
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
            grid-template-rows: minmax(0, 1fr);
            margin-bottom: 0;
            min-height: 0;
            height: calc(100% - 80px);
          }
        }

        .campaign-aside {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .campaign-aside {
            height: 100%;
            overflow-y: auto;
            padding-bottom: 4rem;
          }
          .campaign-aside::-webkit-scrollbar {
            width: 6px;
          }
          .campaign-aside::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
          }
          .campaign-aside::-webkit-scrollbar-thumb {
            background: rgba(197, 160, 89, 0.25);
            border-radius: 3px;
          }
          .campaign-aside::-webkit-scrollbar-thumb:hover {
            background: rgba(197, 160, 89, 0.55);
          }
        }

        .panel-tag {
          font-family: var(--font-mono);
          font-size: 0.5rem;
          font-weight: 900;
          color: var(--gold-core);
          letter-spacing: 0.2em;
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

          @media (min-width: 1024px) {
          .map-viewport-container {
            height: 100%;
            min-height: 0;
            overflow-y: auto;
            padding-bottom: 8rem;
            padding-right: 2px;
          }
          .map-viewport-container::-webkit-scrollbar {
            width: 6px;
          }
          .map-viewport-container::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
          }
          .map-viewport-container::-webkit-scrollbar-thumb {
            background: rgba(197, 160, 89, 0.25);
            border-radius: 3px;
          }
          .map-viewport-container::-webkit-scrollbar-thumb:hover {
            background: rgba(197, 160, 89, 0.55);
          }
        }

        /* Custom Scrollbar for Fragments List */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(197, 160, 89, 0.35);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(197, 160, 89, 0.65);
        }
        .isometric-map-wrapper {
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #000;
          border: 1px solid rgba(197, 160, 89, 0.1);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .map-image-layer {
          position: absolute;
          inset: 0;
          background-size: 100% 100%;
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
          width: 60px; height: 60px; border-radius: 50%; border: 3px solid var(--color-gold-core);
          display: flex; align-items: center; justify-content: center; margin: 0 auto;
          box-shadow: 0 0 15px var(--color-gold-glow);
        }
        .completion-dial .pct { font-family: var(--font-display); font-size: 0.8rem; color: var(--color-gold-bright); }

        .active-modifiers { margin-top: 1.5rem; }
        .modifier-item { display: flex; gap: 1rem; align-items: center; background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: 4px; }
        .mod-icon { color: var(--color-gold-core); }
        .mod-info p { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.05em; }
        .mod-info span { font-size: 0.5rem; color: var(--text-dim); }

        .upcoming-threat { margin-top: 1.5rem; background: rgba(255, 60, 60, 0.05); border: 1px solid rgba(255, 60, 60, 0.2); }
        .threat-card { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; }
        .threat-image { width: 40px; height: 40px; background-size: cover; border-radius: 4px; border: 1px solid rgba(255, 60, 60, 0.3); }
        .threat-info h5 { font-family: var(--font-display); font-size: 0.6rem; color: #ff3c3c; margin-bottom: 0.25rem; }
        .threat-info p { font-size: 0.45rem; color: var(--text-dim); line-height: 1.4; }
        .view-target-btn { width: 100%; margin-top: 1rem; background: none; border: 1px solid rgba(255, 60, 60, 0.5); color: #ff3c3c; font-family: var(--font-mono); font-size: 0.5rem; padding: 0.5rem; border-radius: 4px; cursor: pointer; transition: 0.3s; }
        .view-target-btn:hover { background: rgba(255, 60, 60, 0.1); }

        /* Tactical Node Intel Modal Styles */
        .node-intel-overlay {
          position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 2100; padding: 1rem;
        }
        .node-intel-modal {
          max-width: 420px; width: 100%; border: 1px solid rgba(197, 160, 89, 0.25);
          padding: 2.2rem; background: rgba(10, 10, 12, 0.95);
          box-shadow: 0 0 35px rgba(197, 160, 89, 0.1), inset 0 0 20px rgba(0,0,0,0.8);
          border-radius: 6px; display: flex; flex-direction: column; gap: 1.5rem;
        }
        .node-intel-modal .modal-header {
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 0.8rem; margin: 0;
        }
        .intel-content { display: flex; flex-direction: column; gap: 1.25rem; }
        .intel-header h3 {
          font-family: var(--font-display); font-size: 1.3rem; color: #fff;
          letter-spacing: 0.15em; margin: 0.4rem 0 0 0; text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        .node-badge {
          font-family: var(--font-mono); font-size: 0.6rem; font-weight: 900;
          padding: 3px 10px; border-radius: 100px; letter-spacing: 0.1em; width: fit-content; text-transform: uppercase;
        }
        .node-badge.secured { background: rgba(16, 185, 129, 0.08); border: 1px solid #10b981; color: #10b981; }
        .node-badge.progress { background: rgba(59, 130, 246, 0.08); border: 1px solid #3b82f6; color: #3b82f6; }
        .node-badge.locked { background: rgba(100, 116, 139, 0.08); border: 1px solid #64748b; color: #64748b; }
        .node-badge.boss-badge { background: rgba(239, 68, 68, 0.08); border: 1px solid #ef4444; color: #ef4444; }
        
        .intel-desc { font-size: 0.75rem; color: var(--text-dim); line-height: 1.6; margin: 0; }
        .intel-stats {
          display: flex; flex-direction: column; gap: 0.6rem; background: rgba(255, 255, 255, 0.02);
          padding: 1.2rem; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.04);
        }
        .intel-stats div { display: flex; justify-content: space-between; font-size: 0.65rem; letter-spacing: 0.1em; color: var(--text-dark); }
        .intel-action-btn {
          width: 100%; height: 44px; display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em;
          border-radius: 4px; cursor: pointer; transition: all 0.2s ease;
        }
        .intel-action-btn.btn-primary { background: var(--color-gold-core); border: 1px solid var(--color-gold-bright); color: #000; }
        .intel-action-btn.btn-primary:hover { background: var(--color-gold-bright); transform: translateY(-1px); box-shadow: 0 0 15px var(--color-gold-glow); }
        .intel-action-btn.btn-danger { background: #dc2626; border: 1px solid #ff4444; color: #fff; }
        .intel-action-btn.btn-danger:hover { background: #b91c1c; transform: translateY(-1px); box-shadow: 0 0 15px rgba(220,38,38,0.4); }
      `}</style>

      {/* 🗺️ TACTICAL NODE INTEL MODAL */}
      <AnimatePresence>
        {selectedNode && (
          <div className="node-intel-overlay" onClick={() => setSelectedNode(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="node-intel-modal"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <span className="panel-tag font-mono text-[9px] text-gold-core">TACTICAL NODE INTEL //</span>
                <button className="text-gray-500 hover:text-white" onClick={() => setSelectedNode(null)}>
                  <X size={16} />
                </button>
              </div>

              {selectedNode === 'castle' && (
                <div className="intel-content">
                  <div className="intel-header">
                    <span className="node-badge secured">SECURED</span>
                    <h3>CASTLE BLACKVALE</h3>
                  </div>
                  <div className="modal-banner" style={{ width: '100%', height: '120px', backgroundImage: `url('${getNodeBanner('castle')}')`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
                  <p className="intel-desc">The ancient fortress of Blackvale. Once a den of shadow reapers, now successfully secured under your operational command.</p>
                  <div className="intel-stats font-mono">
                    <div><span>CONTROL RATIO</span><span className="text-emerald-400">100%</span></div>
                    <div><span>XP HARVEST</span><span className="text-emerald-400">+300 XP</span></div>
                  </div>
                </div>
              )}

              {selectedNode === 'ashendale' && (
                <div className="intel-content">
                  <div className="intel-header">
                    <span className="node-badge secured">SECURED</span>
                    <h3>VILLAGE OF ASHENDALE</h3>
                  </div>
                  <div className="modal-banner" style={{ width: '100%', height: '120px', backgroundImage: `url('${getNodeBanner('ashendale')}')`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
                  <p className="intel-desc">The primary valley outpost. Its trade routes and weapon foundries have been cleared of hostiles and stabilized.</p>
                  <div className="intel-stats font-mono">
                    <div><span>CONTROL RATIO</span><span className="text-emerald-400">100%</span></div>
                    <div><span>RESOURCES SECURED</span><span className="text-emerald-400">WOOD, STEEL</span></div>
                  </div>
                </div>
              )}

              {selectedNode === 'jail' && (
                <div className="intel-content">
                  <div className="intel-header">
                    <span className="node-badge progress">IN PROGRESS</span>
                    <h3>IRON JAIL</h3>
                  </div>
                  <div className="modal-banner" style={{ width: '100%', height: '120px', backgroundImage: `url('${getNodeBanner('jail')}')`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
                  <p className="intel-desc">A heavily fortified prison sector holding tactical blueprints. Active strikes are currently being deployed to dismantle the resistance guards.</p>
                  <div className="intel-stats font-mono">
                    <div><span>THREAT LEVEL</span><span className="text-blue-400">MEDIUM</span></div>
                    <div><span>OBJECTIVE</span><span className="text-blue-400">ACQUIRE BLUEPRINTS</span></div>
                  </div>
                  <button className="intel-action-btn btn-primary" onClick={() => { setSelectedNode(null); onTabChange && onTabChange('ops'); }}>
                    DEPLOY STRIKE PROTOCOL
                  </button>
                </div>
              )}

              {selectedNode === 'stone' && (
                <div className="intel-content">
                  <div className="intel-header">
                    <span className="node-badge locked">LOCKED</span>
                    <h3>STONEHOLLOW DEFILES</h3>
                  </div>
                  <div className="modal-banner" style={{ width: '100%', height: '120px', backgroundImage: `url('${getNodeBanner('stone')}')`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
                  <p className="intel-desc">A deep mountain gorge shrouded in thick miasma. The sector remains inaccessible until the Iron Jail blueprints are decrypted.</p>
                  <div className="intel-stats font-mono">
                    <div><span>SECTOR CODE</span><span className="text-gray-500">SH-04</span></div>
                    <div><span>REQUIREMENT</span><span className="text-red-500">DECRYPT BLUEPRINTS</span></div>
                  </div>
                </div>
              )}

              {selectedNode === 'boss' && (
                <div className="intel-content">
                  <div className="intel-header">
                    <span className="node-badge boss-badge">BOSS RAID</span>
                    <h3>DRAGON'S NEST</h3>
                  </div>
                  <div className="threat-profile">
                    <div className="threat-avatar" style={{ backgroundImage: `url('${getDragonAsset(level)}')`, width: '100%', aspectRatio: '1 / 1', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px', border: '1px solid rgba(255, 60, 60, 0.2)' }} />
                    <p className="intel-desc mt-3">The legendary dragon <strong>{getDragonName(level)}</strong> has nested in this region. This colossal beast possesses unmatched raw power. Only a coordinated Boss Raid operation can bring it down.</p>
                  </div>
                  <div className="intel-stats font-mono mt-3">
                    <div><span>THREAT VALUE</span><span className="text-red-500 font-bold">LEGENDARY</span></div>
                    <div><span>REWARD</span><span className="text-gold-bright">COSMIC SOVEREIGN UPGRADE</span></div>
                  </div>
                  <button 
                    className="intel-action-btn btn-danger" 
                    onClick={() => { 
                      setSelectedNode(null); 
                      onTabChange && onTabChange('ops', { openAddTask: true, defaultEffort: 'Boss' });
                    }}
                  >
                    INITIATE BOSS RAID
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
