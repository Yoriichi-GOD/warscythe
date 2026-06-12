import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ArrowLeft,
  X,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Unlock,
  Trophy
} from 'lucide-react';
import { REGIONS, TASKS_PER_LEVEL } from '../store/constants';

// Dynamic Region Node Themes Dictionary (10 Archetypes)
const REGION_ARCHETYPES = {
  1: { // Grasslands (Gateway Theme)
    stone: { name: "Stonehollow Defiles", desc: "A rocky defile serving as the primary training grounds for physical grit." },
    ashendale: { name: "Village of Ashendale", desc: "A peaceful valley farming outpost where daily routines are cultivated." },
    castle: { name: "Castle Blackvale", desc: "The ancient gothic fortress housing the legendary Ledger of conquests." },
    jail: { name: "Iron Jail Vanguard", desc: "A heavy stone garrison where tactical operations are directed." },
    boss: { name: "Dragon's Nest", desc: "The smoking volcanic lair where the dread dragon Malgrath resides." }
  },
  2: { // Volcanic (Caldera Theme)
    stone: { name: "Obsidian Sinks", desc: "Rich lava-warmed pits used for extreme physical conditioning." },
    ashendale: { name: "Cinder Camp", desc: "A temporary encampment over hot volcanic vents for ritual meditation." },
    castle: { name: "Citadel of Ash", desc: "A ruined obsidian castle housing the burning archives of the ledger." },
    jail: { name: "Basalt Keep", desc: "A fortified stone prison guarding active lava strike blueprints." },
    boss: { name: "Lava Crater Lair", desc: "The molten heart of the volcano where Stoneback Krul slumbers." }
  },
  3: { // Frozen (Glacial Peaks Theme)
    stone: { name: "Glacial Crevasse", desc: "Deep ice gorges where climbers train their physical endurance." },
    ashendale: { name: "Frostgate Shrine", desc: "A frozen altar where habits are kept cold and sharp as ice." },
    castle: { name: "Icebound Cathedral", desc: "A majestic cathedral of frost keeping the frozen books of the vault." },
    jail: { name: "Snowbound Outpost", desc: "A military outpost managing active strikes in blizzard territory." },
    boss: { name: "Glacius' Summit", desc: "The wind-swept peak where Glacius the Eternal guards the frost hoard." }
  },
  4: { // Shadow Forest (Old Wood Theme)
    stone: { name: "Shadewood Defiles", desc: "A dim wooded arena used for agility training and fitness drills." },
    ashendale: { name: "Druid's Elder Grove", desc: "A runic glade where ancient habits and silent rituals are practiced." },
    castle: { name: "Castle Shadowfen", desc: "A sunken stone library holding the hidden scrolls of the relic vault." },
    jail: { name: "Miasma Outpost", desc: "A fortress keep managing active strike teams in the dark woods." },
    boss: { name: "Void-Serpent Crypt", desc: "The dark clearing where the phantom serpent Vreth lurks." }
  },
  5: { // Desert (Oasis Theme)
    stone: { name: "Dune Arena", desc: "A sun-baked arena used for high-heat strength and endurance logbooks." },
    ashendale: { name: "Crystal Oasis", desc: "A glowing spring where warlock habits are cleansed and renewed." },
    castle: { name: "Sunken Library", desc: "An ancient tomb of knowledge containing the golden ledger plates." },
    jail: { name: "Desert Fortress", desc: "A mud-brick fortress managing operations across the shifting sands." },
    boss: { name: "Ignarax's Caldera", desc: "The burning oasis crater ruled by Ignarax the Burning." }
  },
  6: { // Sky Temple (Celestial Skylands Theme)
    stone: { name: "Skyreach Terrace", desc: "An open terrace floating in the wind, perfect for high-altitude physical focus." },
    ashendale: { name: "Aether Gardens", desc: "A garden in the clouds for elevating daily habits and spiritual focus." },
    castle: { name: "Cloudspire Archives", desc: "A floating ivory tower keeping the celestial records and relic vaults." },
    jail: { name: "Zephyr Keep", desc: "A high-altitude command center deploying active aerial operations." },
    boss: { name: "Sol-Varen's Sun Lair", desc: "The glowing sun temple where Sol-Varen the Radiant nests." }
  },
  7: { // Sunken Cavern (Abyssal Deeps Theme)
    stone: { name: "Dripping Caverns", desc: "Deep dark caverns where strength is forged in cold stone and heavy humidity." },
    ashendale: { name: "Glowing Fungal Grove", desc: "A subterranean grove where damp habits and cave rituals are completed." },
    castle: { name: "Deepwood Vault", desc: "A secure vault buried beneath miles of stone holding ancient ledger artifacts." },
    jail: { name: "Echoing Deep", desc: "An underground outpost managing strike operations in the dark tunnels." },
    boss: { name: "Duskbone's Crypt", desc: "The skeletal tomb of the ancient Duskbone Revenant." }
  },
  8: { // Toxic Swamp (Fungal Groves Theme)
    stone: { name: "Rotwood Arena", desc: "A treacherous swampland training grounds for raw physical resilience." },
    ashendale: { name: "Mirewood Shrine", desc: "A decaying altar where warlock habits are fortified against the rot." },
    castle: { name: "Bogtown Sluice", desc: "A heavy lock-gate treasury protecting the ledger records from acid rain." },
    jail: { name: "Swamp Guard Keep", desc: "An iron keep directing active operations through the toxic wetlands." },
    boss: { name: "Thundercoil's Nest", desc: "The storm-lashed swamp nest of Thundercoil Zarak." }
  },
  9: { // Cosmic Void (Gravity Islands Theme)
    stone: { name: "Gravity Sinks", desc: "A zero-gravity zone used for intense physical conditioning and calisthenics." },
    ashendale: { name: "Nebula Altar", desc: "A magical space rift where cosmic habits and space rituals align." },
    castle: { name: "Shattered Sanctuary", desc: "A collection of floating debris holding the ledger logs in suspension." },
    jail: { name: "Void Anchor", desc: "A mechanical satellite station managing active void strikes." },
    boss: { name: "Nyxara's Rift", desc: "The deep black-hole rift where Nyxara the Void rules supreme." }
  },
  10: { // Titan Rest (Golden Citadel Theme)
    stone: { name: "Titan's Forge", desc: "A colosseum where heroes lift heavy weights and train like giants." },
    ashendale: { name: "Golden Basilica", desc: "A massive cathedral dedicated to perfect order and daily rituals." },
    castle: { name: "Citadel Vault", desc: "The royal vault holding the golden crown relics of the ledger." },
    jail: { name: "Imperial Keep", desc: "The grand seat of power deploying operations across the realm." },
    boss: { name: "Gorvek's Tomb", desc: "The ancient stone sepulcher of Gorvek the Ancient." }
  }
};

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

const getRegionNodeInfo = (mapIdx, nodeId) => {
  const arch = REGION_ARCHETYPES[mapIdx] || REGION_ARCHETYPES[1];
  return arch[nodeId] || { name: "Unknown Location", desc: "No description available." };
};

export default function MapSection({ onTabChange }) {
  const { 
    level: storeLevel, dailyLog, tasks, generateMicroSteps, 
    currentLevelProgress, unlockedLore, collectedArtifacts,
    scytheLevel, coins, streakCount, rescuedFairies, user, tutorialStep
  } = useWarscytheStore();

  const isTutorialActive = tutorialStep && tutorialStep !== 'completed';
  const level = isTutorialActive ? 0 : storeLevel;

  const activeTasksCount = tasks.filter(t => !t.completedAt).length;
  const artifactsCount = collectedArtifacts?.length || 0;
  
  const [showFog, setShowFog] = useState(false);
  const prevLevelRef = useRef(level);

  const mapIndex = ((level - 1) % 10) + 1;
  const [activeMapIndex, setActiveMapIndex] = useState(mapIndex);

  useEffect(() => {
    setActiveMapIndex(((level - 1) % 10) + 1);
  }, [level]);

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

  const handlePrevMap = () => {
    if (activeMapIndex > 1) {
      setShowFog(true);
      setTimeout(() => {
        setActiveMapIndex(prev => prev - 1);
      }, 700);
      setTimeout(() => setShowFog(false), 1800);
    }
  };

  const handleNextMap = () => {
    if (activeMapIndex < 10) {
      setShowFog(true);
      setTimeout(() => {
        setActiveMapIndex(prev => prev + 1);
      }, 700);
      setTimeout(() => setShowFog(false), 1800);
    }
  };

  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    setSelectedNode(null);
  }, [activeMapIndex]);

  const [jailImageFailed, setJailImageFailed] = useState(false);
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

  const isRepetition = level > 10;
  const cycleIndex = isRepetition ? Math.floor((level - 1) / 10) : 0;

  const regionThemes = [
    { hue: 20, sepia: 0.8, saturate: 1.5 },   // Cycle 1: Autumn Gold
    { hue: 200, sepia: 0.3, saturate: 0.8 },  // Cycle 2: Ice / Blue Shift
    { hue: 100, sepia: 0.5, saturate: 1.2 },  // Cycle 3: Forest Green / Decay
    { hue: 280, sepia: 0.6, saturate: 2 },    // Cycle 4: Purple Void Shift
  ];

  const currentTheme = isRepetition ? regionThemes[(cycleIndex - 1) % regionThemes.length] : null;

  const currentFilter = currentTheme 
    ? `hue-rotate(${currentTheme.hue}deg) sepia(${currentTheme.sepia}) saturate(${currentTheme.saturate})`
    : 'none';

  const bannerStyle = (nodeId) => ({
    width: '100%',
    aspectRatio: '16 / 9',
    backgroundImage: `url('${getNodeBanner(nodeId)}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    filter: currentFilter || 'none'
  });
  
  const displayRegionIdx = activeMapIndex - 1;
  const displayRegion = REGIONS[displayRegionIdx] || REGIONS[0];
  const displayProgress = activeMapIndex < level ? TASKS_PER_LEVEL : activeMapIndex === level ? currentLevelProgress : 0;
  const progressPct = Math.round((displayProgress / TASKS_PER_LEVEL) * 100);
  const displayLore = unlockedLore?.[displayRegionIdx] || [];

  const rescuedFairyInfo = rescuedFairies?.[displayRegionIdx] || (activeMapIndex < level ? {
    date: new Date().toISOString(),
    taskTitle: 'Regional Campaign',
    taskCategory: 'General'
  } : null);
  const isBossRescued = !!rescuedFairyInfo;

  const dayOfWeek = new Date().getDay();
  const isAshendaleLocked = dayOfWeek % 2 === 0;
  const isStonehollowLocked = !isAshendaleLocked;

  const nodeInfo = (nodeId) => getRegionNodeInfo(activeMapIndex, nodeId);

  const getRegionBanner = () => {
    if (isBossRescued) {
      return `/fairies/empress-${activeMapIndex}-liberated.png`;
    }
    if (selectedNode === 'jail' || selectedNode === 'boss') {
      return `/fairies/empress-${activeMapIndex}-caged.png`;
    }
    return getNodeBanner(selectedNode || 'jail');
  };

  const nodes = [
    { id: 'stone', label: nodeInfo('stone').name.toUpperCase(), top: '72%', left: '22%', status: isStonehollowLocked ? 'LOCKED' : 'SECURED', type: isStonehollowLocked ? 'locked' : 'secured' },
    { id: 'ashendale', label: nodeInfo('ashendale').name.toUpperCase(), top: '72%', left: '78%', status: isAshendaleLocked ? 'LOCKED' : 'SECURED', type: isAshendaleLocked ? 'locked' : 'secured' },
    { id: 'castle', label: nodeInfo('castle').name.toUpperCase(), top: '48%', left: '78%', status: 'SECURED', type: 'secured' },
    { id: 'jail', label: isBossRescued ? "IRON JAIL (OPENED)" : nodeInfo('jail').name.toUpperCase(), top: '45%', left: '22%', status: isBossRescued ? 'SECURED' : 'IN PROGRESS', type: isBossRescued ? 'secured' : 'active' },
    { id: 'boss', label: isBossRescued ? "EMPRESS' ABODE" : nodeInfo('boss').name.toUpperCase(), top: '15%', left: '50%', status: isBossRescued ? 'SECURED' : 'FINAL OBJECTIVE', type: 'boss' }
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
      {/* Floating Fire Embers / Ashes */}
      <div className="ember-field">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="ember-particle" 
            style={{
              left: `${(i * 23) % 100}%`,
              width: `${((i * 2) % 3) + 1.5}px`,
              height: `${((i * 2) % 3) + 1.5}px`,
              animationDelay: `${(i * 0.4) % 6}s`,
              animationDuration: `${((i * 3) % 5) + 6}s`,
            }}
          />
        ))}
      </div>

      {/* 1. Header Bar */}
      <header className="campaign-header font-times select-none">
        <div className="header-left">
          <MapIcon size={20} className="gold-text drop-shadow-[0_0_8px_rgba(236,200,128,0.5)]" />
          <div className="header-titles">
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrevMap} 
                disabled={activeMapIndex <= 1}
                className="p-1 hover:bg-white/5 border border-white/10 hover:border-gold-core/50 rounded transition-all disabled:opacity-30 disabled:hover:border-white/10 cursor-pointer disabled:cursor-not-allowed"
                title="Previous Region"
              >
                <ChevronLeft size={16} className="text-gold-core" />
              </button>
              
              <h2 className="text-gold-gradient tracking-widest uppercase font-bold">
                CAMPAIGN THEATER // {activeMapIndex === level ? `LEVEL ${level}` : `REGION ${activeMapIndex}`}
              </h2>
              
              <button 
                onClick={handleNextMap} 
                disabled={activeMapIndex >= 10}
                className="p-1 hover:bg-white/5 border border-white/10 hover:border-gold-core/50 rounded transition-all disabled:opacity-30 disabled:hover:border-white/10 cursor-pointer disabled:cursor-not-allowed"
                title="Next Region"
              >
                <ChevronRight size={16} className="text-gold-core" />
              </button>
            </div>
            <p className="text-gray-400 mt-1">
              {activeMapIndex === level ? "Active front. Secure operations to push deeper." : activeMapIndex < level ? "Secured sector. Peace restored to the realm." : "Locked sector. Complete previous regions to unlock."}
            </p>
          </div>
        </div>
        <button className="btn-gothic-gold scout-report-btn">
          <Info size={14} />
          <span>SCOUT REPORT</span>
        </button>
      </header>

      {/* 2. Main 3-Column Content */}
      <div className="campaign-content select-none">
        
        {/* LEFT COLUMN: Logs and Legend */}
        <aside className="campaign-aside left">
          <div className="expansion-log-panel elite-panel-ornate">
            <div className="corner-ornament corner-tl" />
            <div className="corner-ornament corner-tr" />
            <div className="corner-ornament corner-bl" />
            <div className="corner-ornament corner-br" />
            <div className="elite-panel-inner-border" />
            
            <div className="panel-header font-times">
              <span className="panel-tag">EXPANSION LOG</span>
            </div>
            <div className="log-list font-times">
              {expansionLogs.map(log => (
                <div key={log.id} className="log-item">
                  <div className={`log-icon ${log.type}`}>
                    {log.type === 'scout' && <Crosshair size={12} />}
                    {log.type === 'secure' && <Flag size={12} />}
                    {log.type === 'intel' && <Eye size={12} />}
                  </div>
                  <div className="log-details">
                    <p className="text-white font-medium">{log.text}</p>
                    <span className="log-time text-gray-400">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="legend-panel elite-panel-ornate">
            <div className="corner-ornament corner-tl" />
            <div className="corner-ornament corner-tr" />
            <div className="corner-ornament corner-bl" />
            <div className="corner-ornament corner-br" />
            <div className="elite-panel-inner-border" />

            <div className="panel-header font-times">
              <span className="panel-tag">LEGEND</span>
            </div>
            <div className="legend-grid font-times">
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
          <div className="isometric-map-wrapper border-[2px] border-[#ecc880]/30 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
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
                backgroundImage: `url('/maps/campaign-map-${activeMapIndex}.png')`,
                filter: activeMapIndex > level ? 'blur(8px) grayscale(30%)' : currentFilter
              }} 
            />
            
            {activeMapIndex > level ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10 font-times select-none">
                <motion.img 
                  src="/maps/map-lock-icon.png" 
                  alt="Locked Sector" 
                  className="w-20 h-20 mb-3 filter drop-shadow-[0_0_15px_rgba(239, 68, 68, 0.6)]"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="text-red-500 font-mono text-[10px] tracking-[0.3em] font-extrabold uppercase bg-black/60 px-4 py-2 border border-red-500/20 rounded shadow-lg">
                  [ SECTOR LOCKED // COMPLETE PREVIOUS REGIONS ]
                </span>
              </div>
            ) : (
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
                        className="leyline-path"
                        strokeWidth={c.thick ? "2.5" : "1.5"} 
                      />
                    );
                  })}
                </svg>
                  
                {nodes.map(node => (
                  <motion.div 
                    key={node.id} 
                    className={`map-node ${node.type} ${node.id === 'boss' && isBossRescued ? 'empress-abode-node' : ''}`} 
                    style={{ top: node.top, left: node.left }} 
                    onClick={() => setSelectedNode(node.id)}
                  >
                    {node.id === 'boss' && isBossRescued ? (
                      <div className="empress-node-avatar-container relative w-12 h-12 flex items-center justify-center -top-[15px]">
                        <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md animate-pulse" />
                        <img 
                          src={`/fairies/empress-${activeMapIndex}-liberated.png`} 
                          alt="Fairy Empress" 
                          className="w-10 h-10 object-cover rounded-full border-2 border-[#ecc880] relative z-10 animate-float shadow-[0_0_8px_rgba(236,200,128,0.6)]"
                          style={{ filter: currentFilter || 'none' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <div className={`node-glow ${node.type}`} />
                        {node.type === 'active' && <div className="current-ping" />}
                        {node.type === 'locked' && <img src="/maps/map-lock-icon.png" className="lock-icon animate-pulse" alt="Locked" />}
                        {node.type === 'boss' && <Skull size={20} className="boss-icon" />}
                      </>
                    )}
                    <span className="node-label font-times font-bold">{node.label}</span>
                    <div className="node-status font-times">{node.status}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="quick-actions-panel elite-panel-ornate">
            <div className="corner-ornament corner-tl" />
            <div className="corner-ornament corner-tr" />
            <div className="corner-ornament corner-bl" />
            <div className="corner-ornament corner-br" />
            <div className="elite-panel-inner-border" />

            <div className="panel-header font-times">
              <span className="panel-tag">QUICK ACTIONS</span>
            </div>
            <div className="action-grid font-times">
              <button 
                className="btn-gothic-gold action-btn" 
                onClick={handleRecalculate} 
                disabled={isRecalculating}
                style={{ opacity: isRecalculating ? 0.6 : 1 }}
              >
                <RotateCcw size={14} className={isRecalculating ? 'animate-spin' : ''} /> 
                {isRecalculating ? 'RECALCULATING...' : recalcSuccess ? 'DECOMPOSITION DONE' : 'RECALCULATE PROTOCOL'}
              </button>
              <button className="btn-gothic-gold action-btn" onClick={() => onTabChange && onTabChange('ops', { openAddTask: true })}>
                <Sword size={14} /> DEPLOY STRIKE TEAM
              </button>
              <button className="btn-gothic-gold action-btn" onClick={() => onTabChange && onTabChange('ops')}>
                <ArrowLeft size={14} /> RETURN TO OPERATIONS
              </button>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Region Intel */}
        <aside className="campaign-aside right">
          <div className="region-intel-panel elite-panel-ornate">
            <div className="corner-ornament corner-tl" />
            <div className="corner-ornament corner-tr" />
            <div className="corner-ornament corner-bl" />
            <div className="corner-ornament corner-br" />
            <div className="elite-panel-inner-border" />

            <div className="panel-header font-times">
              <span className="panel-tag">REGION INTEL</span>
            </div>
            
            <div className="region-branding font-times">
              <h4 className="text-gold-gradient text-lg font-bold flex items-center justify-center gap-2">
                {displayRegion.name}
                <img 
                  src={`/crests/region-crest-${(displayRegionIdx % 10) + 1}.png`} 
                  alt={`${displayRegion.name} Crest`} 
                  className="w-7 h-7 object-contain inline-block filter drop-shadow-[0_0_4px_rgba(236,200,128,0.3)]"
                />
              </h4>
              <div className="region-banner-placeholder border border-white/5 rounded mt-3" style={{ 
                backgroundImage: `url('/bg/bg-region-${activeMapIndex}.png')`,
                filter: currentFilter
              }} />
            </div>
 
            <div className="region-completion font-times">
               <span className="stat-label">REGION COMPLETION</span>
               <div className="completion-dial border-[2.5px] border-[#ecc880] shadow-[0_0_15px_rgba(236,200,128,0.2)]">
                  <span className="pct text-gold-gradient font-bold">{progressPct}%</span>
               </div>
               <p className="text-[10px] text-gray-400 font-mono tracking-widest text-center mt-3 uppercase">{displayProgress} / {TASKS_PER_LEVEL} SECURED</p>
            </div>
 
            <div className="active-modifiers font-times">
               <span className="stat-label">TERRITORY LORE</span>
               <div className="modifier-item border border-[#ecc880]/15 bg-black/40" style={{ flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                 <p className="text-[10px] font-mono text-[#ecc880]/85 leading-relaxed italic border-l-2 border-[#ecc880]/30 pl-2">
                   "{displayRegion.desc}"
                 </p>
               </div>
            </div>
          </div>

          {isBossRescued ? (
              <div className="upcoming-threat elite-panel-ornate" style={{ padding: '1.2rem', border: '1px solid rgba(236, 200, 128, 0.25)', background: 'rgba(236, 200, 128, 0.04)' }}>
                <div className="corner-ornament corner-tl" style={{ borderColor: '#ecc880' }} />
                <div className="corner-ornament corner-tr" style={{ borderColor: '#ecc880' }} />
                <div className="corner-ornament corner-bl" style={{ borderColor: '#ecc880' }} />
                <div className="corner-ornament corner-br" style={{ borderColor: '#ecc880' }} />
                
                <span className="stat-label font-times" style={{ marginTop: 0, color: '#ecc880' }}>SECURED SOVEREIGN</span>
                <div className="threat-card font-times">
                  <img 
                    src={`/fairies/empress-${activeMapIndex}-liberated.png`} 
                    alt="Fairy Empress" 
                    className="w-11 h-11 object-cover rounded-full border border-[#ecc880]/40 bg-gold-core/5"
                    style={{ filter: `${currentFilter} drop-shadow(0 0 6px rgba(236, 200, 128, 0.5))` }}
                  />
                  <div className="threat-info">
                    <h5 className="text-gold-core font-bold">EMPRESS OF {displayRegion.name.toUpperCase()}</h5>
                    <p className="text-gray-400">Liberated via Operation: <strong>{rescuedFairyInfo.taskTitle}</strong></p>
                  </div>
                </div>
                <button className="btn-gothic-gold view-target-btn mt-3" onClick={() => setSelectedNode('boss')}>
                  VIEW LIBERATION INTEL
                </button>
              </div>
            ) : (
              <div 
                className="upcoming-threat elite-panel-ornate" 
                style={{ 
                  padding: '1.2rem', 
                  border: activeMapIndex > level ? '1px solid rgba(100, 116, 139, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)', 
                  background: activeMapIndex > level ? 'rgba(100, 116, 139, 0.02)' : 'rgba(239, 68, 68, 0.04)' 
                }}
              >
                <div className="corner-ornament corner-tl" style={{ borderColor: activeMapIndex > level ? '#64748b' : '#ef4444' }} />
                <div className="corner-ornament corner-tr" style={{ borderColor: activeMapIndex > level ? '#64748b' : '#ef4444' }} />
                <div className="corner-ornament corner-bl" style={{ borderColor: activeMapIndex > level ? '#64748b' : '#ef4444' }} />
                <div className="corner-ornament corner-br" style={{ borderColor: activeMapIndex > level ? '#64748b' : '#ef4444' }} />
                
                <span className="stat-label font-times" style={{ marginTop: 0, color: activeMapIndex > level ? '#64748b' : '#ff5555' }}>
                  {activeMapIndex > level ? 'LOCKED THREAT' : 'UPCOMING THREAT'}
                </span>
                <div className="threat-card font-times">
                  <div className="relative shrink-0 overflow-hidden rounded" style={{ width: '44px', height: '44px', border: activeMapIndex > level ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div 
                      className="threat-image w-full h-full" 
                      style={{ 
                        backgroundImage: `url('${getDragonAsset(activeMapIndex)}')`,
                        filter: activeMapIndex > level ? 'blur(6px) grayscale(90%)' : 'none',
                        width: '100%',
                        height: '100%',
                        backgroundSize: 'cover'
                      }} 
                    />
                    {activeMapIndex > level && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                        <motion.img 
                          src="/maps/map-lock-icon.png" 
                          alt="Locked" 
                          className="filter drop-shadow-[0_0_8px_rgba(239, 68, 68, 0.9)]"
                          style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="threat-info">
                    <h5 className={activeMapIndex > level ? "text-gray-500 font-bold" : "text-red-500 font-bold"}>
                      {activeMapIndex > level ? "THREAT LOCKED" : getDragonName(activeMapIndex).toUpperCase()}
                    </h5>
                    <p className="text-gray-400">
                      {activeMapIndex > level 
                        ? "Information about this dragon is locked. Complete previous regions to unlock intel."
                        : "A menacing beast ruling over this territory. Secure all operations to challenge it."
                      }
                    </p>
                  </div>
                </div>
                <button 
                  className="btn-gothic-gold view-target-btn mt-3" 
                  style={{ 
                    borderColor: activeMapIndex > level ? 'rgba(255, 255, 255, 0.1)' : '#ef4444', 
                    color: activeMapIndex > level ? 'rgba(255, 255, 255, 0.3)' : '#ff4444',
                    cursor: activeMapIndex > level ? 'not-allowed' : 'pointer',
                    background: activeMapIndex > level ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                  }} 
                  disabled={activeMapIndex > level}
                  onClick={() => { 
                    if (activeMapIndex <= level) {
                      setSelectedNode('boss');
                    }
                  }}
                >
                  {activeMapIndex > level ? 'BOSS INTEL LOCKED' : 'VIEW BOSS INTEL'}
                </button>
              </div>
            )}
 
            <div className="recovered-fragments elite-panel-ornate" style={{ padding: '1.2rem' }}>
               <div className="corner-ornament corner-tl" />
               <div className="corner-ornament corner-tr" />
               <div className="corner-ornament corner-bl" />
               <div className="corner-ornament corner-br" />
               
               <span className="stat-label font-times" style={{ marginTop: 0 }}>RECOVERED FRAGMENTS</span>
               <div className="flex flex-col gap-3 mt-3 overflow-y-auto max-h-[150px] custom-scrollbar pr-2 font-times">
                 {displayLore.length === 0 ? (
                   <p className="text-[9px] font-mono text-gray-500 text-center py-4 uppercase tracking-widest">
                     No fragments recovered yet.<br/>Conquer operations to reveal the truth.
                   </p>
                 ) : (
                   [...displayLore].reverse().map((fragment, idx) => (
                     <div key={idx} className="flex gap-2 items-start p-2 rounded bg-black/40 border border-white/5">
                        <ScrollText size={12} className="text-gold-core shrink-0 mt-0.5" />
                        <p className="text-[9px] font-mono text-gray-300 leading-relaxed italic">"{fragment}"</p>
                     </div>
                   ))
                 )}
               </div>
               
               {/* Access Full Vault Button */}
               <button 
                 onClick={() => onTabChange && onTabChange('ledger', { subTab: 'vault' })}
                 className="w-full mt-4 py-2 border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-all group flex items-center justify-center rounded cursor-pointer font-times"
               >
                 <span className="text-[8.5px] font-mono text-gray-400 group-hover:text-gold-core tracking-[0.4em] uppercase">[ ACCESS FULL VAULT ]</span>
               </button>
            </div>
        </aside>

      </div>

      {/* 🗺️ TACTICAL NODE INTEL MODAL */}
      <AnimatePresence>
        {selectedNode && (
          <div className="node-intel-overlay" onClick={() => setSelectedNode(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="node-intel-modal elite-panel-ornate"
              onClick={e => e.stopPropagation()}
            >
              <div className="corner-ornament corner-tl" />
              <div className="corner-ornament corner-tr" />
              <div className="corner-ornament corner-bl" />
              <div className="corner-ornament corner-br" />
              <div className="elite-panel-inner-border" />

              {/* Absolute Positioned Close Button */}
              <button className="node-intel-close-btn" onClick={() => setSelectedNode(null)}>
                <X size={16} />
              </button>

              <div className="modal-header font-times">
                <span className="panel-tag font-mono text-[9px] text-gold-core">TACTICAL NODE INTEL //</span>
              </div>

              {selectedNode === 'castle' && (
                <div className="intel-content font-times">
                  <div className="intel-header">
                    <span className="node-badge secured">SECURED</span>
                    <h3>{nodeInfo('castle').name.toUpperCase()}</h3>
                  </div>
                  <div className="modal-banner" style={bannerStyle('castle')} />
                  <p className="intel-desc">{nodeInfo('castle').desc}</p>
                  <div className="intel-stats font-mono">
                    <div><span>COLLECTED RELICS</span><span className="text-emerald-400 font-bold">{artifactsCount} / 125</span></div>
                    <div><span>VAULT BALANCE</span><span className="text-gold-core font-bold">{coins} COINS</span></div>
                  </div>
                </div>
              )}

              {selectedNode === 'ashendale' && (
                <div className="intel-content font-times">
                  <div className="intel-header">
                    <span className="node-badge secured">SECURED</span>
                    <h3>{nodeInfo('ashendale').name.toUpperCase()}</h3>
                  </div>
                  <div className="modal-banner" style={bannerStyle('ashendale')} />
                  <p className="intel-desc">{nodeInfo('ashendale').desc}</p>
                  <div className="intel-stats font-mono">
                    <div><span>SCYTHE RESONANCE</span><span className="text-emerald-400 font-bold">{scytheLevel}</span></div>
                    <div><span>STREAK COUNT</span><span className="text-emerald-400 font-bold">{streakCount} DAYS</span></div>
                  </div>
                </div>
              )}

              {selectedNode === 'jail' && (
                isBossRescued ? (
                  <div className="intel-content font-times">
                    <div className="intel-header">
                      <span className="node-badge secured" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid #10b981', color: '#10b981' }}>JAIL DECRYPTED</span>
                      <h3>{nodeInfo('jail').name.toUpperCase()}</h3>
                    </div>
                    <div className="flex flex-col items-center gap-4 my-2">
                      <div className="w-48 h-48 rounded border border-emerald-500/30 overflow-hidden relative shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center justify-center bg-black/40">
                        {!jailImageFailed ? (
                          <img 
                            src="/nodes/node-jail-opened.png" 
                            alt="Jail Opened" 
                            className="w-full h-full object-contain p-2"
                            onError={() => setJailImageFailed(true)}
                          />
                        ) : (
                          <Unlock size={48} className="text-emerald-400 animate-pulse" />
                        )}
                      </div>
                      <p className="intel-desc text-center text-emerald-400/90 font-medium leading-relaxed">
                        The 5 key-seals have been shattered! The Fairy Empress has been liberated and returned to her palace.
                      </p>
                    </div>
                    <div className="intel-stats font-mono">
                      <div><span>JAIL STATUS</span><span className="text-emerald-400 font-bold">UNLOCKED & SECURED</span></div>
                      <div><span>LIBERATED ON</span><span className="text-gold-core font-bold">{new Date(rescuedFairyInfo.date).toLocaleDateString()}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="intel-content font-times">
                    <div className="intel-header">
                      <span className="node-badge locked" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid #ef4444', color: '#ef4444' }}>IMPRISONED SOVEREIGN</span>
                      <h3>{nodeInfo('jail').name.toUpperCase()}</h3>
                    </div>
                    <div className="threat-profile">
                      <div 
                        className="threat-avatar" 
                        style={{ 
                          backgroundImage: `url('/fairies/empress-${activeMapIndex}-caged.png')`,
                          width: '100%',
                          aspectRatio: '1 / 1',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center top',
                          borderRadius: '4px',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          boxShadow: '0 0 15px rgba(239,68,68,0.15)',
                          filter: currentFilter || 'none'
                        }} 
                      />
                      <p className="intel-desc mt-3">
                        The Empress of this region is sealed here. Defeat the regional dragon at the Dragon's Nest to unlock the cage.
                      </p>
                    </div>
                    <div className="intel-stats font-mono">
                      <div><span>JAIL STATUS</span><span className="text-red-500 font-bold">LOCKED BY BOSS</span></div>
                      <div><span>ACTIVE OPERATIONS</span><span className="text-blue-400 font-bold">{activeTasksCount} ACTIVE</span></div>
                    </div>
                    <button className="intel-action-btn btn-gothic-gold" onClick={() => { setSelectedNode(null); onTabChange && onTabChange('ops'); }}>
                      DEPLOY STRIKE PROTOCOL
                    </button>
                  </div>
                )
              )}

              {selectedNode === 'stone' && (
                <div className="intel-content font-times">
                  <div className="intel-header">
                    <span className="node-badge locked">LOCKED</span>
                    <h3>{nodeInfo('stone').name.toUpperCase()}</h3>
                  </div>
                  <div className="modal-banner" style={bannerStyle('stone')} />
                  <p className="intel-desc">{nodeInfo('stone').desc}</p>
                  <div className="intel-stats font-mono">
                    <div><span>SECTOR CODE</span><span className="text-gray-500 font-bold">SH-0{mapIndex}</span></div>
                    <div><span>LOGGED ACTIVITIES</span><span className="text-red-500 font-bold">{dailyLog ? Object.keys(dailyLog).length : 0} SESSIONS</span></div>
                  </div>
                </div>
              )}

              {selectedNode === 'boss' && (
                isBossRescued ? (
                  <div className="intel-content font-times">
                    <div className="intel-header">
                      <span className="node-badge secured" style={{ background: 'rgba(236, 200, 128, 0.08)', border: '1px solid #ecc880', color: '#ecc880' }}>DECRYPTED INTEL</span>
                      <h3>EMPRESS' ABODE</h3>
                    </div>
                    
                    <div className="threat-profile">
                      <div 
                        className="threat-avatar" 
                        style={{ 
                          backgroundImage: `url('/fairies/empress-${activeMapIndex}-liberated.png')`,
                          width: '100%',
                          aspectRatio: '1 / 1',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center top',
                          borderRadius: '4px',
                          border: '1px solid rgba(236, 200, 128, 0.25)',
                          boxShadow: '0 0 15px rgba(236,200,128,0.2)',
                          filter: currentFilter || 'none'
                        }} 
                      />
                    </div>
                    
                    <div className="fairy-profile-card border border-gold-core/20 p-3 bg-white/[0.01] rounded w-full flex flex-col items-center mt-3">
                      <span className="text-[9px] font-mono text-gold-core tracking-[0.25em] font-bold uppercase">
                        FAIRY CLASS // {activeMapIndex === 1 || activeMapIndex === 2 || activeMapIndex === 8 ? 'WARRIOR' : activeMapIndex === 4 || activeMapIndex === 7 ? 'RECOVERY' : activeMapIndex === 5 || activeMapIndex === 10 ? 'FITNESS' : 'SCHOLAR'}
                      </span>
                      <p className="intel-desc mt-2 text-center text-white/90 italic leading-relaxed">
                        "Liberated on {new Date(rescuedFairyInfo.date).toLocaleDateString()} by conquering Operation: {rescuedFairyInfo.taskTitle}"
                      </p>
                    </div>
                    <div className="intel-stats font-mono mt-3">
                      <div><span>FAIRY STATUS</span><span className="text-emerald-400 font-bold">RESCUED & ACTIVE</span></div>
                      <div><span>REGION SECURED</span><span className="text-gold-core font-bold">{displayRegion.name.toUpperCase()}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="intel-content font-times">
                    <div className="intel-header">
                      <span className="node-badge boss-badge">BOSS RAID</span>
                      <h3>{nodeInfo('boss').name.toUpperCase()}</h3>
                    </div>
                    <div className="threat-profile">
                      <div className="threat-avatar" style={{ backgroundImage: `url('${getDragonAsset(activeMapIndex)}')`, width: '100%', aspectRatio: '1.2 / 1', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.08)' }} />
                      
                      <div className="gothic-divider mt-4" />
                      
                      <p className="boss-intel-desc mt-3">
                        The legendary dragon <span className="text-gold-core font-bold">{getDragonName(activeMapIndex)}</span> has nested in this region.<br />
                        This colossal beast possesses unmatched raw power.<br />
                        Only a coordinated Boss Raid operation can bring it down.
                      </p>
                      
                      <div className="gothic-divider" />
                    </div>
                    <div className="intel-stats font-mono mt-3">
                      <div>
                        <span className="flex items-center text-white/50"><Skull size={12} className="text-red-500 mr-2" /> THREAT VALUE</span>
                        <span className="text-red-500 font-bold">LEVEL {activeMapIndex} BOSS</span>
                      </div>
                      <div>
                        <span className="flex items-center text-white/50"><Trophy size={12} className="text-gold-core mr-2" /> REWARD ELITE</span>
                        <span className="text-gold-bright font-bold">CREST OF {displayRegion.name.toUpperCase()}</span>
                      </div>
                    </div>
                    <button 
                      className="intel-action-btn btn-gothic-gold mt-3" 
                      style={{ borderColor: '#ef4444', color: '#ff4444' }}
                      onClick={() => { 
                        setSelectedNode(null); 
                        onTabChange && onTabChange('ops', { openAddTask: true, defaultEffort: 'Boss' });
                      }}
                    >
                      INITIATE BOSS RAID
                    </button>
                  </div>
                )
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .campaign-theater {
          width: 100%;
          height: auto;
          min-height: 100%;
          display: flex;
          flex-direction: column;
          padding: 1rem;
          color: #fff;
          position: relative;
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
          z-index: 10;
          position: relative;
        }

        @media (min-width: 640px) {
          .campaign-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .header-left { display: flex; gap: 1rem; align-items: center; }
        .header-titles h2 { font-size: 1rem; letter-spacing: 0.1em; }
        @media (min-width: 1024px) {
          .header-titles h2 { font-size: 1.25rem; }
        }
        .header-titles p { font-size: 0.65rem; }

        .scout-report-btn {
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
          z-index: 10;
          position: relative;
        }

        @media (max-width: 1023px) {
          .campaign-aside.left,
          .map-viewport-container,
          .campaign-aside.right {
            display: contents !important;
          }

          .campaign-content {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 0.4rem !important;
            margin-bottom: 90px !important;
          }

          /* 1. Map Viewport -> Row 1, Full Width */
          .isometric-map-wrapper {
            grid-row: 1 !important;
            grid-column: span 2 !important;
            height: 320px !important;
            width: 100% !important;
            overflow: auto !important;
            position: relative !important;
            border-radius: 8px !important;
            aspect-ratio: auto !important;
          }
          .isometric-map-wrapper > div {
            width: 520px !important;
            height: 520px !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
          }

          /* 2. Expansion Log -> Row 2, Left */
          .expansion-log-panel {
            grid-row: 2 !important;
            grid-column: 1 !important;
          }

          /* 3. Legend -> Row 2, Right */
          .legend-panel {
            grid-row: 2 !important;
            grid-column: 2 !important;
          }

          /* 4. Region Intel Panel -> Row 3, Left */
          .region-intel-panel {
            grid-row: 3 !important;
            grid-column: 1 !important;
          }

          /* 5. Upcoming Threat Panel -> Row 3, Right */
          .upcoming-threat {
            grid-row: 3 !important;
            grid-column: 2 !important;
          }

          /* 6. Recovered Fragments Panel -> Row 4, Left */
          .recovered-fragments {
            grid-row: 4 !important;
            grid-column: 1 !important;
          }

          /* 7. Quick Actions Panel -> Row 4, Right */
          .quick-actions-panel {
            grid-row: 4 !important;
            grid-column: 2 !important;
          }
        }

        .upcoming-threat,
        .recovered-fragments {
          margin-top: 1.5rem;
        }

        @media (max-width: 1023px) {
          .upcoming-threat,
          .recovered-fragments {
            margin-top: 0 !important;
          }
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
          font-size: 0.55rem;
          font-weight: 900;
          color: var(--gold-core);
          letter-spacing: 0.2em;
        }

        /* Log Panel */
        .log-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
        .log-item { display: flex; gap: 1rem; align-items: flex-start; }
        .log-icon { 
          width: 24px; height: 24px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.02);
        }
        .log-icon.scout { color: var(--gold-core); }
        .log-icon.secure { color: #10b981; }
        .log-icon.intel { color: #3b82f6; }
        .log-details p { font-size: 0.68rem; line-height: 1.3; }
        .log-time { font-size: 0.52rem; }

        /* Legend Panel */
        .legend-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-top: 1rem; }
        @media (min-width: 1024px) {
          .legend-grid { grid-template-columns: 1fr; }
        }
        .legend-item { display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.52rem; letter-spacing: 0.1em; color: var(--text-dim); }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.pos { background: #3b82f6; box-shadow: 0 0 10px #3b82f6; }
        .dot.avail { background: #10b981; box-shadow: 0 0 10px #10b981; }
        .dot.secured { background: var(--gold-core); box-shadow: 0 0 10px var(--gold-core); }
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
        .node-glow.active { background: #10b981; box-shadow: 0 0 20px #10b981; }
        .node-glow.locked { background: #444; box-shadow: none; opacity: 0.5; }
        .node-glow.boss { background: #ff3c3c; box-shadow: 0 0 25px #ff3c3c; }

        .current-ping {
          position: absolute;
          top: 0;
          width: 8px;
          height: 8px;
          border: 1px solid #10b981;
          border-radius: 50%;
          animation: ping-green 2s infinite;
        }

        @media (min-width: 1024px) {
          .current-ping { width: 12px; height: 12px; border-width: 2px; }
        }

        @keyframes ping-green {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }

        .node-label { 
          font-size: 0.52rem; 
          letter-spacing: 0.1em; 
          color: #fff; 
          text-shadow: 0 2px 4px rgba(0,0,0,0.85);
          white-space: nowrap;
        }
        @media (min-width: 1024px) {
          .node-label { font-size: 0.65rem; }
        }

        .node-status {
          font-family: var(--font-mono);
          font-size: 0.38rem;
          letter-spacing: 0.1em;
          color: var(--text-dim);
          text-shadow: 0 1px 2px rgba(0,0,0,0.85);
        }

        .map-node.active .node-label { color: #fff4dc; }
        .map-node.boss-node .node-label { color: #ff3c3c; }

        .boss-icon, .lock-icon {
          position: absolute;
          top: -20px;
          filter: drop-shadow(0 0 5px rgba(0,0,0,0.85));
        }
        @media (min-width: 1024px) {
          .boss-icon, .lock-icon { top: -25px; }
        }

        .lock-icon { color: rgba(255,255,255,0.4); width: 16px; height: 16px; }
        .boss-icon { color: #ff3c3c; animation: breathe-skull 3s infinite ease-in-out; }

        @keyframes breathe-skull {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.25); opacity: 1; filter: drop-shadow(0 0 8px #ff2222); }
        }

        .quick-actions-panel { height: fit-content; }
        .action-grid { display: grid; grid-template-columns: 1fr; gap: 0.5rem; margin-top: 1rem; }
        @media (min-width: 640px) {
          .action-grid { grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        }
        .action-btn {
          padding: 0.75rem;
          font-family: var(--font-mono);
          font-size: 0.55rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        /* Right Column Intel */
        .region-branding { margin-top: 1rem; text-align: center; }
        .region-branding h4 { font-size: 1.25rem; letter-spacing: 0.2em; margin-bottom: 0.5rem; }
        .region-banner-placeholder { width: 100%; aspect-ratio: 16 / 9; height: auto; background-size: cover; background-repeat: no-repeat; background-position: center; opacity: 1; border-radius: 4px; box-shadow: inset 0 0 20px rgba(0,0,0,0.8); }

        .stat-label { font-family: var(--font-mono); font-size: 0.55rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; display: block; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        
        .completion-dial {
          width: 60px; height: 60px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; margin: 0 auto;
        }
        .completion-dial .pct { font-size: 0.85rem; }

        .active-modifiers { margin-top: 1.5rem; }
        .modifier-item { display: flex; gap: 1rem; align-items: center; padding: 0.75rem; border-radius: 4px; }

        .upcoming-threat { margin-top: 1.5rem; }
        .threat-card { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; }
        .threat-image { width: 44px; height: 44px; background-size: cover; border-radius: 4px; }
        .threat-info h5 { font-size: 0.65rem; margin-bottom: 0.25rem; }
        .threat-info p { font-size: 0.48rem; line-height: 1.4; }
        .view-target-btn { width: 100%; mt-3; font-family: var(--font-mono); font-size: 0.55rem; padding: 0.5rem; border-radius: 4px; }

        /* Tactical Node Intel Modal Styles */
        .node-intel-overlay {
          position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
          display: flex; align-items: flex-start; justify-content: center; z-index: 2100; padding: 2rem 1rem;
          overflow-y: auto;
        }
        .node-intel-modal {
          max-width: 420px; width: 100%;
          border-radius: 6px; display: flex; flex-direction: column; gap: 1.5rem;
          position: relative;
          margin: auto 0;
        }
        .node-intel-close-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          z-index: 50;
          color: rgba(255, 255, 255, 0.5);
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.2s;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          outline: none;
        }
        .node-intel-close-btn:hover {
          color: #ecc880;
          border-color: #ecc880;
          background: rgba(197, 160, 89, 0.15);
        }
        .node-intel-modal .modal-header {
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 0.8rem; margin: 0;
          z-index: 10; position: relative;
        }
        .intel-content { display: flex; flex-direction: column; gap: 1.25rem; z-index: 10; position: relative; }
        .intel-header h3 {
          font-size: 1.3rem; color: #fff;
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
        
        .intel-desc { font-size: 0.78rem; color: var(--text-dim); line-height: 1.6; margin: 0; }
        .intel-stats {
          display: flex; flex-direction: column; gap: 0.6rem; background: rgba(255, 255, 255, 0.02);
          padding: 1.2rem; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.04);
        }
        .intel-stats div { display: flex; justify-content: space-between; font-size: 0.65rem; letter-spacing: 0.1em; color: var(--text-dark); }
        .intel-action-btn {
          width: 100%; height: 44px; display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em;
          border-radius: 4px;
        }

        .leyline-path {
          stroke: #ff3c3c;
          filter: drop-shadow(0 0 3px #ff3c3c) drop-shadow(0 0 6px rgba(255, 60, 60, 0.5));
          animation: leyline-pulse 3s ease-in-out infinite alternate;
        }
        @keyframes leyline-pulse {
          0% { stroke-width: 1.5px; opacity: 0.7; }
          100% { stroke-width: 2.5px; opacity: 1; }
        }

        /* ── Boss Raid Card Ornaments ── */
        .gothic-divider {
          position: relative;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(236, 200, 128, 0.3) 50%, transparent);
          margin: 1rem 0;
        }
        .gothic-divider::after {
          content: "❖";
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          color: #ecc880;
          background: #0a0a0c;
          padding: 0 8px;
          font-size: 9px;
        }
        .boss-intel-desc {
          font-size: 0.82rem;
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.85;
          text-align: center;
          font-family: var(--font-display, 'Times New Roman', serif);
          margin: 0;
        }
        .intel-stats div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: var(--text-dark);
        }
        .intel-stats span.flex {
          display: flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>
    </motion.div>
  );
}
