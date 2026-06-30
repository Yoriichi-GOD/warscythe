import React, { useState, useEffect } from 'react';
import { useWarscytheStore } from '../../store/useWarscytheStore';
import { Swords, History, Flame, Award, Dumbbell, Info, ChevronDown } from 'lucide-react';
import { getAssetUrl } from '../../utils/assetResolver';
import { REGIONS } from '../../store/constants';

const REGION_SHORT_DESCS = [
  "Warm, hopeful, and calm grasslands.",
  "Eerie, mysterious, and foggy woods.",
  "Cold, barren, and epic snowlands.",
  "Dark, damp, and dangerous wetlands.",
  "Sun-drenched, exotic, and warm sands.",
  "Glorious, holy, and noble heights.",
  "Spooky, chilling, and silent tombs.",
  "Electrifying, tempestuous, high-altitude cliffs.",
  "Heavy, chaotic, and dark dungeons.",
  "Colossal, silent, and legendary graveyard."
];

const LEGACY_ARTIFACT_MAP = {
  'Iron Quill': 'tome', "Scout's Compass": 'compass', 'Wax Seal of Intent': 'scroll',
  'Cloak of Momentum': 'scroll', 'Whetstone of Focus': 'rune', 'Ink of Resolve': 'chalice',
  'Cloak of Iteration': 'rune', 'Dragon Scale Armor': 'idol', 'Eye of the Strategist': 'eye',
  "Void Walker's Boots": 'chain', "Warscythe's Gauntlet": 'gauntlet', 'The Finisher': 'blade',
  'Throne Fragment': 'idol', 'Shard of Reality': 'mirror', 'Cosmic Reaper': 'skull',
  'Sovereign Core': 'orb', 'Omega Catalyst': 'hourglass', 'Grip of the Void': 'gauntlet',
  'Lantern of the Lost': 'lantern',
};
const getArtifactImage = (name) => {
  if (LEGACY_ARTIFACT_MAP[name]) return `/artifacts/artifact-${LEGACY_ARTIFACT_MAP[name]}.png`;
  const type = (name || '').split(' ')[0].toLowerCase();
  return `/artifacts/artifact-${type}.png`;
};


export default function CommandCenter({ onPreviewUltimate, onOpenGymLog }) {
  const { 
    xp, 
    totalCompletions, 
    scytheLevel, 
    completedTasks = [], 
    abandonedTasks = [], 
    streakCount = 0, 
    collectedArtifacts = [],
    soundscapeEnabled,
    setSoundscapeEnabled,
    level,
    activeTheme
  } = useWarscytheStore();

  const [playingRegionIdx, setPlayingRegionIdx] = useState((level || 1) - 1);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setPlayingRegionIdx((level || 1) - 1);
  }, [level]);

  const currentRegionName = (REGIONS[playingRegionIdx]?.name || "Ashwood").split(' ')[0];

  const cTasks = Array.isArray(completedTasks) ? completedTasks : [];
  const aTasks = Array.isArray(abandonedTasks) ? abandonedTasks : [];

  const totalAttempted = cTasks.length + aTasks.length;
  const executionRatio = totalAttempted === 0 ? 0 : Math.round((cTasks.length / totalAttempted) * 100);
  const dashOffset = 125 - (125 * executionRatio) / 100;

  const allLogs = [
    ...cTasks.map(t => ({...t, status: 'CONQUERED'})), 
    ...aTasks.map(t => ({...t, status: 'ABANDONED'}))
  ]
    .sort((a, b) => {
      const dateA = new Date(a.completedAt || a.abandonedAt || 0);
      const dateB = new Date(b.completedAt || b.abandonedAt || 0);
      return dateB - dateA;
    })
    .slice(0, 25);

  const streakTiers = [
    { days: 5, name: 'NEOPHYTE' },
    { days: 15, name: 'ACOLYTE' },
    { days: 30, name: 'REAPER' },
    { days: 60, name: 'EXECUTIONER' },
    { days: 120, name: 'SOVEREIGN' },
    { days: 200, name: 'VOID-WALKER' },
    { days: 300, name: 'ETERNAL' },
    { days: 360, name: 'DEATH-LORD' }
  ];

  // More compatible findLast equivalent
  const currentTier = [...streakTiers].reverse().find(t => streakCount >= t.days) || { name: 'NEOPHYTE', days: 5 };
  const nextTier = streakTiers.find(t => streakCount < t.days) || streakTiers[streakTiers.length - 1];
  const streakProgress = Math.min(100, (streakCount / nextTier.days) * 100);

  return (
    <div className="command-center-grid gap-4 min-h-full relative">
      {/* 📊 COMMAND CENTER HEADER */}
      <div className="cc-header flex items-center gap-3 mb-2 px-2 shrink-0">
        <Swords size={14} className="text-gold-core" />
        <h2 className="text-white font-display text-xs tracking-[0.3em] uppercase">Command Center</h2>
      </div>

      {/* 🎵 SOUNDSCAPE JUKEBOX */}
      <div 
        className={`cc-soundscape elite-panel p-4 flex flex-col items-center justify-between gap-1 transition-all relative ${
          soundscapeEnabled 
            ? 'border-gold-core/40 bg-gold-core/5 shadow-[0_0_15px_rgba(197,160,89,0.15)]' 
            : 'border-white/5 opacity-55 hover:opacity-100 hover:border-white/10'
        }`}
      >
        <div className="flex justify-between items-center w-full px-2">
          <span className="text-[8px] font-mono text-gray-300 tracking-[0.3em] uppercase">Soundscape</span>
          <Info 
            size={10} 
            className="text-gray-500 hover:text-[#c5a059] transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              useWarscytheStore.getState().openInfoModal('atmosphere');
            }}
          />
        </div>
        <div 
          onClick={() => setSoundscapeEnabled(!soundscapeEnabled)}
          className="flex-1 w-full flex items-center justify-center relative min-h-0 cursor-pointer group"
        >
          <img 
            src="/soundscape-jukebox.png" 
            className={`w-[60px] h-[60px] object-contain transition-transform group-hover:scale-105 ${soundscapeEnabled ? 'animate-spin' : ''}`}
            style={{ animationDuration: '8s' }}
            onError={(e) => { e.target.src = '/command-core.png'; }} 
            alt="Soundscape Jukebox" 
          />
          {soundscapeEnabled && (
            <div className="absolute w-[70px] h-[70px] bg-gold-core/10 rounded-full filter blur-md animate-pulse pointer-events-none" />
          )}
        </div>
        <div className="w-full mt-2 relative z-20">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="w-full flex items-center justify-between bg-black/40 border border-gold-core/20 hover:border-gold-core/50 px-2 py-1.5 rounded text-[10px] text-gold-core font-mono transition-colors"
          >
            <span className="truncate tracking-wider text-left pr-1 font-bold">
              {currentRegionName}
            </span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showDropdown && (
            <div className="absolute left-0 right-0 bottom-full mb-1 max-h-[180px] overflow-y-auto bg-black/95 border border-gold-core/40 rounded shadow-2xl z-30 divide-y divide-white/5 scrollbar-thin">
              {REGIONS.map((regionName, idx) => {
                const cleanName = (regionName.name || '').split(' ')[0];
                return (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayingRegionIdx(idx);
                      setShowDropdown(false);
                      import('../../utils/audioManager').then(({ audioManager }) => {
                        audioManager.playRegion(idx, activeTheme);
                      });
                    }}
                    className={`w-full text-left px-2 py-1.5 transition-colors hover:bg-gold-core/10 flex flex-col gap-0.5 ${
                      playingRegionIdx === idx ? 'bg-gold-core/5 text-gold-core' : 'text-gray-300'
                    }`}
                  >
                    <span className="text-[10px] font-bold tracking-wide">{cleanName}</span>
                    <span className="text-[8px] text-gray-400 leading-normal">{REGION_SHORT_DESCS[idx] || ''}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 🔮 GUARDIAN OBSERVER */}
      <button 
        onClick={() => window.dispatchEvent(new CustomEvent('triggerProphecy'))}
        className="cc-guardian elite-panel p-4 flex flex-col items-center justify-center gap-1 cursor-pointer border-white/5 opacity-70 hover:opacity-100 hover:border-gold-core/40 transition-all"
      >
        <div className="flex justify-between items-center w-full px-2">
          <span className="text-[8px] font-mono text-gray-300 tracking-[0.3em] uppercase">Guardian</span>
          <Info 
            size={10} 
            className="text-gray-500 hover:text-[#c5a059] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              useWarscytheStore.getState().openInfoModal('wisdom');
            }}
          />
        </div>
        <div className="flex-1 w-full flex items-center justify-center relative min-h-0">
          <img 
            src="/guardian-observer.png" 
            className="w-[75%] h-[75%] object-contain hover:scale-110 transition-transform"
            onError={(e) => { e.target.src = '/command-core.png'; }} 
            alt="Guardian Observer" 
          />
        </div>
      </button>

      {/* 🏋️ GYM LOGBOOK LAUNCHER */}
      <button 
        onClick={onOpenGymLog}
        className="cc-fitness-log w-full py-4 rounded border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group flex items-center justify-center gap-3 cursor-pointer shrink-0"
      >
        <Dumbbell size={14} className="text-gold-core group-hover:text-gold-bright transition-colors" />
        <span className="text-[10px] font-display text-gold-core tracking-[0.4em] uppercase group-hover:text-gold-bright">
          FITNESS LOGBOOK
        </span>
      </button>

      {/* 🗡️ ULTIMATE ARTIFACT (Streak-based Evolution) */}
      <div 
        className="cc-ultimate-artifact elite-panel !p-0 flex flex-col items-center justify-center text-center relative group min-h-[240px] overflow-hidden cursor-pointer hover:border-gold-core/40 transition-all bg-[#050505]"
        onClick={() => onPreviewUltimate && onPreviewUltimate(currentTier.name, 'ultimate', '500')}
      >
        {/* The Image (Centered and Blended) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center p-4 bg-black/40">
           <img 
             src={getAssetUrl(`/ultimate/${currentTier.name.toLowerCase()}.png`)} 
             alt={currentTier.name} 
             className="w-[85%] h-[85%] object-contain opacity-70 group-hover:opacity-100 transition-all duration-300"
             onError={(e) => { e.target.src = '/scythe/PLATINUM.png'; }}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />
        </div>

        {/* Labels (Overlay) */}
        <div className="absolute top-6 left-6 flex flex-col items-start gap-1 z-10 text-left">
          <span className="text-[7px] font-mono text-gold-core/60 tracking-[0.3em] uppercase font-bold">Ultimate Artifact</span>
          <h4 className="text-white font-display text-[12px] tracking-[0.2em] uppercase drop-shadow-md">Cosmic Reaper</h4>
        </div>
        
        <div className="absolute bottom-6 right-6 text-right z-10">
           <p className="text-white font-display text-[10px] tracking-widest uppercase drop-shadow-md">{currentTier.name}</p>
           <p className="text-[8px] font-mono text-gold-core/60 mt-1 uppercase font-black">TIER {streakTiers.indexOf(currentTier) + 1}</p>
        </div>

        {/* Inspect Prompt */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gold-core/5 flex items-center justify-center pointer-events-none z-20">
           <div className="px-4 py-2 border border-gold-core/20 bg-black/60 backdrop-blur-md">
              <span className="text-[8px] font-mono text-gold-core tracking-[0.5em] uppercase font-bold">Inspect Weapon</span>
           </div>
        </div>
      </div>

      {/* STREAK PROGRESS BAR */}
      <div className="cc-streak-ascent elite-panel p-5 flex flex-col gap-4 bg-black/20">
         <div className="flex justify-between items-center">
            <span className="text-[8px] font-mono text-gray-300 uppercase tracking-widest">Streak Ascent</span>
            <span className="text-[8px] font-mono text-gold-core uppercase font-bold">{streakCount} / {nextTier.days} DAYS</span>
         </div>
         
         <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-gold-core/50 to-gold-bright shadow-[0_0_15px_rgba(197,160,89,0.4)] transition-all duration-1000"
              style={{ width: `${streakProgress}%` }}
            />
         </div>

         <div className="flex justify-between items-center px-1">
            {streakTiers.map((tier, idx) => {
              const isUnlocked = streakCount >= tier.days;
              return (
                <button
                  key={tier.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewUltimate && onPreviewUltimate(tier.name, 'ultimate', (100 + (idx * 50)).toString());
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    isUnlocked ? 'bg-gold-core scale-125 shadow-[0_0_8px_#c5a059]' : 'bg-white/10 hover:bg-white/20'
                  } hover:scale-150`}
                  title={tier.name}
                />
              );
            })}
         </div>
      </div>

      {/* 🏆 ARSENAL (Trophy Wall) */}
      <div className="cc-arsenal elite-panel p-5 flex flex-col shrink-0 bg-black/20">
         <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono text-gold-core/60 tracking-widest uppercase font-bold">Arsenal</span>
              <h4 className="text-white font-display text-[10px] tracking-[0.3em] uppercase">Battle Trophies</h4>
            </div>
            <Award size={14} className="text-gold-core/30" />
         </div>
         
         <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
            {collectedArtifacts.length === 0 ? (
              <span className="text-[8px] font-mono text-gray-600 tracking-widest uppercase">No artifacts recovered yet.</span>
            ) : (
              [...collectedArtifacts].reverse().slice(0, 5).map((artifact, i) => {
                const rarityLower = (artifact.rarity || 'common').toLowerCase();
                return (
                  <div key={i} className="group relative shrink-0">
                     <div className="w-12 h-12 rounded border border-white/10 bg-black/40 flex items-center justify-center overflow-hidden hover:border-gold-core/40 transition-all cursor-pointer p-1">
                       <img 
                         src={getArtifactImage(artifact.name)} 
                         className={`w-full h-full object-contain art-img-filter ${rarityLower}`} 
                         alt={artifact.name} 
                       />
                     </div>
                     {/* Hover Tooltip */}
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-4 bg-[#0a0a0e] border border-white/10 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 rounded">
                       <span className={`text-[8px] font-mono tracking-widest uppercase font-bold mb-1 block ${
                          rarityLower === 'mythic' ? 'text-red-500' :
                          rarityLower === 'epic' ? 'text-red-400' :
                          rarityLower === 'rare' ? 'text-yellow-500' :
                          rarityLower === 'uncommon' ? 'text-green-500' :
                          'text-gray-400'
                       }`}>{artifact.rarity}</span>
                     <p className="text-[10px] font-display text-white tracking-widest uppercase mb-2 leading-tight">{artifact.name}</p>
                     <div className="h-[1px] w-full bg-white/10 mb-2" />
                     <p className="text-[9px] font-mono text-gold-core/90 italic leading-relaxed mb-3">"{artifact.hook || artifact.desc || artifact.lore}"</p>
                     
                     <div className="flex flex-col gap-1">
                        {artifact.context && (
                          <p className="text-[6.5px] font-mono text-gray-400 uppercase font-bold tracking-[0.2em] border-l border-gray-600 pl-1">
                            {artifact.context}
                          </p>
                        )}
                        {artifact.effortContext && (
                          <p className="text-[6px] font-mono text-gray-500 uppercase tracking-widest pl-1">
                            {artifact.effortContext}
                          </p>
                        )}
                        <p className="text-[6px] font-mono text-gold-core/40 uppercase mt-1 tracking-widest">
                          FORGED: {new Date(artifact.date || Date.now()).toLocaleDateString()}
                        </p>
                     </div>
                   </div>
                  </div>
                );
              })
            )}
         </div>

         {collectedArtifacts.length > 0 && (
           <button 
             onClick={() => window.dispatchEvent(new CustomEvent('navToLedgerVault'))}
             className="w-full mt-3 py-2 border border-white/5 rounded flex items-center justify-center hover:bg-white/5 hover:border-white/10 transition-all group"
           >
             <span className="text-[8px] font-mono text-gray-500 group-hover:text-gold-core tracking-[0.4em] uppercase">[ ACCESS FULL VAULT ]</span>
           </button>
         )}
      </div>

      {/* 🔢 DAILY COMPLETIONS */}
      <div className="cc-daily-completions elite-panel p-4 flex flex-col items-center justify-center gap-2 bg-black/20">
        <span className="text-[8px] font-mono text-gray-300 tracking-[0.3em] uppercase">Daily Completions</span>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-display text-gold-bright leading-none">{totalCompletions || 0}</span>
          <Flame size={12} className="text-gold-core/40" />
        </div>
      </div>

      {/* 🔢 EXECUTION RATIO */}
      <div className="cc-execution-ratio elite-panel p-4 flex flex-col items-center justify-center gap-1 text-center bg-black/20">
         <span className="text-[8px] font-mono text-gray-300 tracking-[0.3em] uppercase block">Execution</span>
         <span className="text-[8px] font-mono text-gray-300 tracking-[0.3em] uppercase block">Ratio</span>
         <div className="relative w-12 h-12 mt-1">
           <svg className="w-full h-full transform -rotate-90">
             <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/5" />
             <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gold-core" strokeDasharray="125" strokeDashoffset={dashOffset} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
           </svg>
           <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-white">{executionRatio}%</span>
         </div>
      </div>

      {/* 📜 RECENT INTEL */}
      <div className="cc-completion-log elite-panel p-5 flex flex-col h-[450px] shrink-0">
         <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono text-gold-core/60 tracking-widest uppercase font-bold">Recent Intel</span>
              <h4 className="text-white font-display text-[10px] tracking-[0.3em] uppercase">Completion Log</h4>
            </div>
            <History size={14} className="text-gold-core/30" />
         </div>
         <div className="h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent mb-4" />
         
         <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {allLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-6 opacity-30 mt-8">
                <p className="text-[10px] font-mono text-gray-500 tracking-[0.3em] text-center uppercase leading-relaxed">
                  No operations completed yet.<br/>The log awaits your victories.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pb-8">
                {allLogs.map((log, i) => (
                  <div key={i} className={`p-3 rounded border ${log.status === 'CONQUERED' ? 'bg-white/[0.02] border-gold-core/20' : 'bg-red-900/10 border-red-500/20'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[8px] font-mono tracking-widest font-bold ${log.status === 'CONQUERED' ? 'text-gold-core' : 'text-red-500'}`}>
                        {log.status}
                      </span>
                      <span className="text-[7px] font-mono text-gray-500">{new Date(log.completedAt || log.abandonedAt || 0).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[10px] font-display text-white tracking-widest uppercase truncate">{log.title || 'Unknown Strike'}</p>
                  </div>
                ))}
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
