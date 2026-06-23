import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { Check, Trash2, Calendar, ShieldAlert, Scroll, Award, Star, Sparkles, ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';
import { getAssetUrl } from '../utils/assetResolver';

const EMPRESS_NAMES = [
  'Empress Dryad of Ashwood',
  'Empress Pyra of the Caldera',
  'Empress Frost of Glacius Peak',
  'Empress Vreth of Shadowfen',
  'Empress Jade of the Oasis',
  'Empress Zephyr of Cloudspire',
  'Empress Spectral of the Deeps',
  'Empress Lira of Mirewood',
  'Empress Cosma of the Void',
  'Empress Sol of the Golden Citadel',
];

const EMPRESS_LORE = [
  'Once the guardian of the Ashwood, Empress Dryad ruled over emerald forests and ancient groves. Bound in thorns by the Dread Wyrm, her imprisonment withered the entire forest. Her liberation restored the ancient balance.',
  'Empress Pyra\'s volcanic domain burned bright before Stoneback Krul sealed her in obsidian cuffs above the magma. With her freedom, the Caldera Citadel rose from the ash, and fire serves creation once more.',
  'The Glacial Peaks fell into eternal blizzard when Glacius the Eternal froze Empress Frost inside a pillar of dark ice. Her liberation melted the curse, and the icebound sanctuary glows once more with runic warmth.',
  'Empress Vreth governed the shadowed forests in quiet wisdom until Vreth the Unseen bound her in void chains. Her rescue banished the darkness, and the stardust garden blooms again under her healing hand.',
  'The Crystal Oasis ran dry when Ignarax sealed Empress Jade in a shattered sarcophagus wrapped in sealing talismans. Her liberation broke the curse and brought water and life back to the desert kingdom.',
  'The skylands fell into storms when Sol-Varen imprisoned Empress Zephyr inside a floating glass cage. Her freedom scattered the clouds, and the sun-drenched cloud library resonates with celestial knowledge again.',
  'Empress Spectral\'s light once guided lost souls through the Deeps. Duskbone Revenant extinguished it. Her liberation reignited the cavern garden and summoned healing cave fairies back to the subterranean halls.',
  'The wetlands turned toxic when Thundercoil Zarak sealed Empress Lira within the swamp-choked keep. Her liberation cleansed the waters and returned the Mirewood Shrine to life and ritual.',
  'Empress Cosma held the fabric of cosmic order together. When Nyxara the Void pulled her into a black-hole rift, the gravity islands fell apart. Her freedom restored the celestial observatory and orbital harmony.',
  'Sol of the Golden Citadel kept the colosseum burning with solar glory until Gorvek the Ancient sealed her light. Her liberation ignited the golden dome and the eternal solar relay burns once more.',
];

const REGION_COLORS = {
  1:  '#5d8a3c', 2: '#e05a20', 3:  '#4da6e8', 4:  '#9b5de5', 5: '#d4a010',
  6:  '#e0c840', 7: '#20b280', 8:  '#60a830', 9:  '#8040e8', 10: '#e0a820',
};

const dragonTrophies = [
  'wyrm', 'wyvern', 'frost', 'shadow', 'lava', 
  'celestial', 'skeletal', 'storm', 'abyssal', 'ancient'
];

const getDragonDetails = (type) => {
  const details = {
    wyrm: {
      name: 'Verdant Wyrm',
      lore: 'A serpentine menace from the deep undergrowth of Ashwood. It constricts its prey in vines of shadow before delivering a venomous bite.'
    },
    wyvern: {
      name: 'Cinder Wyvern',
      lore: 'Swoops down from the smoky peaks of the Crucible. Its wings generate burning hot ash storms, suffocating travelers below.'
    },
    frost: {
      name: 'Glacial Rime-Gorged',
      lore: 'Lurks in ice-locked caverns. A single breath can freeze a weapon mid-swing, shattering resolve and iron alike.'
    },
    shadow: {
      name: 'Umbral Phantasm',
      lore: 'A dragon born of pure void energy. It feeds on self-doubt and whispers dark promises to those who waver on the path.'
    },
    lava: {
      name: 'Magma Patriarch',
      lore: 'The ancient dweller of the Obsidian core. Its scales are hardened basalt, and its blood runs with white-hot lava.'
    },
    celestial: {
      name: 'Stardust Sovereign',
      lore: 'Descending from the upper astral plains, its wings reflect nebulas. It judges the worthiness of mortals with searing starlight.'
    },
    skeletal: {
      name: 'Bone-Grafted Golem',
      lore: 'A reanimated terror of ancient wars. Re-bound by spectral green soul-fire, it does not tire, nor does it bleed.'
    },
    storm: {
      name: 'Tempest Bringer',
      lore: 'Wrapped in perpetual thunderclouds. It channels lightning through its horns, striking down anything that reaches too high.'
    },
    abyssal: {
      name: 'Void-Crested Leviathan',
      lore: 'Rises from the Shadowmere depths. It draws its power from the deepest psychological chasms, drowning focus in pitch black fog.'
    },
    ancient: {
      name: 'Omega Chronos',
      lore: 'The legendary keeper of time. It moves between seconds, testing whether the executor can sustain focus across decades.'
    }
  };
  return details[type] || { name: 'Unknown Dragon', lore: 'A mysterious beast slain in the far reaches of the territory.' };
};

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

export default function Ledger({ initialSubTab = 'history', onSubTabChange }) {
  const [subTab, setSubTab] = useState(initialSubTab);

  // Sync when parent changes the tab (e.g. 'Access Full Vault' deep-link)
  React.useEffect(() => {
    setSubTab(initialSubTab);
  }, [initialSubTab]);

  const handleSubTab = (tab) => {
    setSubTab(tab);
    onSubTabChange?.(tab);
  };
  
  // History tab state & logic (from CompletionLog)
  const completedTasks = useWarscytheStore(state => state.completedTasks) || [];
  const abandonedTasks = useWarscytheStore(state => state.abandonedTasks) || [];
  const receivedProphecies = useWarscytheStore(state => state.receivedProphecies) || [];
  const gymLog = useWarscytheStore(state => state.gymLog) || [];
  const level = useWarscytheStore(state => state.level) || 1;

  // Local date helper (returns YYYY-MM-DD in local time)
  const getLocalDateString = (dateInput) => {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Group all logs by date string
  const logsByDate = {};
  completedTasks.forEach(task => {
    const dateStr = getLocalDateString(task.completedAt);
    if (dateStr) {
      if (!logsByDate[dateStr]) logsByDate[dateStr] = { completed: [], abandoned: [], gym: [] };
      logsByDate[dateStr].completed.push(task);
    }
  });

  abandonedTasks.forEach(task => {
    const dateStr = getLocalDateString(task.abandonedAt);
    if (dateStr) {
      if (!logsByDate[dateStr]) logsByDate[dateStr] = { completed: [], abandoned: [], gym: [] };
      logsByDate[dateStr].abandoned.push(task);
    }
  });

  gymLog.forEach(workout => {
    const dateStr = getLocalDateString(workout.date);
    if (dateStr) {
      if (!logsByDate[dateStr]) logsByDate[dateStr] = { completed: [], abandoned: [], gym: [] };
      logsByDate[dateStr].gym.push(workout);
    }
  });

  // Calendar state
  const [selectedDateStr, setSelectedDateStr] = useState(() => getLocalDateString(new Date()));
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    // Clamp min to May 2026 (month index 4)
    if (today.getFullYear() < 2026 || (today.getFullYear() === 2026 && today.getMonth() < 4)) {
      return new Date(2026, 4, 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const handlePrevMonth = () => {
    setCalendarMonth(prev => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      if (year === 2026 && month <= 4) return prev; // May 2026 limit
      return new Date(year, month - 1, 1);
    });
  };

  const handleNextMonth = () => {
    setCalendarMonth(prev => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      const today = new Date();
      if (year === today.getFullYear() && month >= today.getMonth()) return prev;
      return new Date(year, month + 1, 1);
    });
  };

  const canGoPrev = !(calendarMonth.getFullYear() === 2026 && calendarMonth.getMonth() <= 4);
  const todayDate = new Date();
  const canGoNext = !(calendarMonth.getFullYear() === todayDate.getFullYear() && calendarMonth.getMonth() >= todayDate.getMonth());

  // Generate calendar days
  const calYear = calendarMonth.getFullYear();
  const calMonth = calendarMonth.getMonth();
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
  const totalDays = new Date(calYear, calMonth + 1, 0).getDate();

  const dayCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    dayCells.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    dayCells.push(new Date(calYear, calMonth, d));
  }

  // Calculate day circle style based on work volume and difficulty
  const getDayCircleStyle = (dateStr) => {
    const dayData = logsByDate[dateStr];
    if (!dayData) return null;

    const { completed, abandoned, gym } = dayData;
    const totalCount = completed.length + gym.length;
    const totalAbandoned = abandoned.length;

    if (totalCount === 0 && totalAbandoned === 0) return null;

    let color = '#6b7280'; // default slate for abandoned
    let levelName = 'ABANDONED';

    if (completed.some(t => t.effort === 'Boss')) {
      color = '#ecc880'; // gold
      levelName = 'BOSS';
    } else if (completed.some(t => t.effort === 'High')) {
      color = '#ef4444'; // crimson
      levelName = 'HIGH';
    } else if (completed.some(t => t.effort === 'Medium')) {
      color = '#8b5cf6'; // amethyst
      levelName = 'MEDIUM';
    } else if (completed.some(t => t.effort === 'Low')) {
      color = '#3b82f6'; // blue
      levelName = 'LOW';
    } else if (gym.length > 0) {
      color = '#10b981'; // emerald
      levelName = 'FITNESS';
    }

    let style = {};
    if (totalCount >= 3) {
      style = {
        background: `${color}25`,
        borderColor: color,
        boxShadow: `0 0 10px ${color}55`,
        borderWidth: '2px',
        color: '#fff',
        fontWeight: 'bold'
      };
    } else if (totalCount === 2) {
      style = {
        borderColor: color,
        borderWidth: '2px',
        color: '#fff',
        boxShadow: `0 0 5px ${color}33`
      };
    } else if (totalCount === 1) {
      style = {
        borderColor: color,
        borderWidth: '1px',
        color: '#fff'
      };
    } else {
      style = {
        borderColor: '#4b5563',
        borderWidth: '1px',
        color: '#6b7280',
        borderStyle: 'dashed'
      };
    }

    return { style, color, levelName, totalCount };
  };

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
    : '';

  const [historyFilter, setHistoryFilter] = useState('ALL'); // ALL, CONQUERED, ABANDONED

  const allLogs = [
    ...completedTasks.map(t => ({ ...t, status: 'CONQUERED', type: 'completed' })),
    ...abandonedTasks.map(t => ({ ...t, status: 'ABANDONED', type: 'abandoned' }))
  ].sort((a, b) => {
    const dateA = new Date(a.completedAt || a.abandonedAt || 0);
    const dateB = new Date(b.completedAt || b.abandonedAt || 0);
    return dateB - dateA;
  });

  const filteredLogs = allLogs.filter(log => {
    if (historyFilter === 'CONQUERED' && log.type !== 'completed') return false;
    if (historyFilter === 'ABANDONED' && log.type !== 'abandoned') return false;

    if (selectedDateStr) {
      const logDateStr = getLocalDateString(log.completedAt || log.abandonedAt);
      if (logDateStr !== selectedDateStr) return false;
    }
    return true;
  });

  const dailyGymLogs = selectedDateStr 
    ? gymLog.filter(workout => getLocalDateString(workout.date) === selectedDateStr)
    : [];

  const getSessionTonnage = (workout) => {
    if (workout.movements) {
      return workout.movements.reduce((total, m) => {
        return total + (m.sets || []).reduce((sum, s) => {
          if (s.completed && s.type !== 'warmup') {
            return sum + (Number(s.weight) || 0) * (Number(s.reps) || 0);
          }
          return sum;
        }, 0);
      }, 0);
    }
    if (workout.exercises) {
      return workout.exercises.reduce((total, e) => {
        return total + (Number(e.sets) || 0) * (Number(e.reps) || 0) * (Number(e.weight) || 0);
      }, 0);
    }
    return 0;
  };

  // Vault tab state & logic (from VaultModal)
  const collectedArtifacts = useWarscytheStore(state => state.collectedArtifacts) || [];
  const unlockedLore = useWarscytheStore(state => state.unlockedLore) || {};
  const currentTitle = useWarscytheStore(state => state.currentTitle) || 'Recruit';
  const bossKills = useWarscytheStore(state => state.bossKills) || 0;
  const rescuedFairies = useWarscytheStore(state => state.rescuedFairies) || {};
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [selectedTrophy, setSelectedTrophy] = useState(null);
  const [selectedFairy, setSelectedFairy] = useState(null);

  const bossTasks = completedTasks.filter(t => t.effort === 'Boss').sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

  const rarities = {
    common: { color: '#aaa', label: 'COMMON' },
    uncommon: { color: '#2ecc71', label: 'UNCOMMON' },
    rare: { color: '#f1c40f', label: 'RARE' },
    epic: { color: '#e74c3c', label: 'EPIC' },
    mythic: { color: '#ff3d00', label: 'MYTHIC' }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-6 pb-32 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono text-gold-core/60 tracking-[0.4em] uppercase font-bold">Unified Archives</span>
          <h2 className="text-3xl font-display text-white tracking-[0.1em] uppercase">THE LEDGER</h2>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex gap-1 border border-white/5 bg-black/40 p-1 rounded">
          <button 
            className={`px-4 py-1.5 text-[10px] font-mono tracking-widest uppercase rounded transition-all ${
              subTab === 'history' 
                ? 'bg-gold-core text-black font-extrabold shadow-[0_0_10px_rgba(197,160,89,0.3)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => handleSubTab('history')}
          >
            History Logs
          </button>
          <button 
            className={`px-4 py-1.5 text-[10px] font-mono tracking-widest uppercase rounded transition-all ${
              subTab === 'vault' 
                ? 'bg-gold-core text-black font-extrabold shadow-[0_0_10px_rgba(197,160,89,0.3)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => handleSubTab('vault')}
          >
            Relics & Lore
          </button>
          <button 
            className={`px-4 py-1.5 text-[10px] font-mono tracking-widest uppercase rounded transition-all ${
              subTab === 'prophecies' 
                ? 'bg-gold-core text-black font-extrabold shadow-[0_0_10px_rgba(197,160,89,0.3)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => handleSubTab('prophecies')}
          >
            Guardian Chronicles
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {subTab === 'history' ? (
          <div className="flex flex-col gap-6">
            {/* Calendar Widget */}
            <div className="elite-panel p-6 bg-black/40 border border-white/5 rounded-lg flex flex-col gap-4 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-3 gap-3">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gold-core" />
                  <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest font-bold">TEMPORAL CONQUEST GRID</span>
                </div>
                
                {/* Month navigation */}
                <div className="flex items-center gap-4 bg-black/60 border border-white/10 rounded px-2 py-1 select-none self-end sm:self-auto">
                  <button
                    disabled={!canGoPrev}
                    onClick={handlePrevMonth}
                    className={`p-1 hover:text-white transition-colors cursor-pointer ${!canGoPrev ? 'opacity-20 cursor-not-allowed' : 'text-gold-core'}`}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[9px] font-mono font-bold text-white tracking-widest uppercase w-32 text-center">
                    {calendarMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    disabled={!canGoNext}
                    onClick={handleNextMonth}
                    className={`p-1 hover:text-white transition-colors cursor-pointer ${!canGoNext ? 'opacity-20 cursor-not-allowed' : 'text-gold-core'}`}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Day Headers (SUN, MON...) */}
              <div className="grid grid-cols-7 gap-2 text-center text-[8px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div key={day} className="py-1">{day}</div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-2">
                {dayCells.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="aspect-square" />;
                  }

                  const dateStr = getLocalDateString(day);
                  const isSelected = selectedDateStr === dateStr;
                  const isToday = getLocalDateString(new Date()) === dateStr;
                  
                  const circleDetails = getDayCircleStyle(dateStr);
                  const hasLogs = !!circleDetails;
                  
                  let cellClassName = "relative aspect-square flex flex-col items-center justify-center rounded cursor-pointer transition-all border select-none ";
                  
                  if (!hasLogs) {
                    cellClassName += "border-white/[0.02] bg-white/[0.005] opacity-25 hover:opacity-60 hover:border-white/10";
                  } else {
                    cellClassName += "hover:scale-105 ";
                    if (isSelected) {
                      cellClassName += "border-gold-core shadow-[0_0_12px_rgba(197,160,89,0.3)] bg-gold-core/[0.04]";
                    } else {
                      cellClassName += "border-white/5 bg-white/[0.01] hover:bg-white/[0.02]";
                    }
                  }

                  return (
                    <div
                      key={dateStr}
                      onClick={() => setSelectedDateStr(isSelected ? null : dateStr)}
                      className={cellClassName}
                      title={hasLogs ? `${circleDetails.totalCount} event(s) - ${circleDetails.levelName} effort` : 'No activity logged'}
                    >
                      {/* Day Number */}
                      <span className={`text-[10px] font-mono font-bold ${
                        isSelected ? 'text-gold-bright' : isToday ? 'text-gold-core font-black' : 'text-gray-300'
                      }`}>
                        {day.getDate()}
                      </span>

                      {/* Circle Indicator around or inside cell */}
                      {hasLogs && (
                        <div
                          className="absolute inset-1 rounded border pointer-events-none transition-all"
                          style={circleDetails.style}
                        />
                      )}

                      {/* Today Dot Indicator */}
                      {isToday && (
                        <div className="absolute bottom-1 w-1 h-1 rounded-full bg-gold-core" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Color Coding Legend */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-2 pt-3 border-t border-white/5 text-[7.5px] font-mono text-gray-500 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded border border-[#ecc880]" />
                  <span>Boss</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded border border-[#ef4444]" />
                  <span>High</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded border border-[#8b5cf6]" />
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded border border-[#3b82f6]" />
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded border border-[#10b981]" />
                  <span>Fitness Only</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded border border-dashed border-[#6b7280]" />
                  <span>Abandoned</span>
                </div>
                <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-4">
                  <span className="opacity-70">Circle thickness represents volume (1 → 2 → 3+ events)</span>
                </div>
              </div>
            </div>

            {/* Selected Date Header and List Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-3">
              <div>
                {selectedDateStr ? (
                  <h3 className="text-sm font-mono text-gold-core tracking-wider uppercase font-bold text-left">
                    CONQUESTS FOR {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                ) : (
                  <h3 className="text-sm font-mono text-gold-core tracking-wider uppercase font-bold text-left">
                    ALL RECORDED CONQUESTS
                  </h3>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Filter controls */}
                <div className="flex gap-1.5 p-1 bg-black/40 border border-white/5 rounded">
                  {['ALL', 'CONQUERED', 'ABANDONED'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setHistoryFilter(tab)}
                      className={`px-3 py-1 text-[8.5px] font-mono tracking-widest uppercase rounded transition-all ${
                        historyFilter === tab 
                          ? 'bg-gold-core text-black font-bold shadow-[0_0_10px_rgba(197,160,89,0.3)]' 
                          : 'text-text-dim hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {selectedDateStr && (
                  <button 
                    onClick={() => setSelectedDateStr(null)}
                    className="text-[8.5px] font-mono text-gray-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded transition-all uppercase tracking-widest font-bold"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Execution List */}
            <div className="flex flex-col gap-3">
              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest text-left">
                OPERATION HISTORY
              </span>

              <AnimatePresence mode="popLayout">
                {filteredLogs.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-10 gap-3 border border-dashed border-white/5 rounded-lg"
                  >
                    <ShieldAlert size={20} className="text-gray-600" />
                    <span className="text-[10px] font-mono text-text-dim tracking-[0.3em] uppercase">No operations recorded for this day</span>
                  </motion.div>
                ) : (
                  filteredLogs.map((log, i) => {
                    const isCompleted = log.type === 'completed';
                    return (
                      <motion.div
                        key={`${log.id}-${log.status}-${i}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                        className={`elite-panel p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white/[0.01] ${
                          isCompleted 
                            ? 'border-gold-core/20 bg-gradient-to-r from-gold-core/[0.02] to-transparent' 
                            : 'border-red-500/20 bg-gradient-to-r from-red-500/[0.02] to-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border flex-shrink-0 ${
                            isCompleted ? 'border-gold-core/30 text-gold-core bg-gold-core/5' : 'border-red-500/30 text-red-500 bg-red-500/5'
                          }`}>
                            {isCompleted ? <Check size={10} /> : <Trash2 size={10} />}
                          </div>
                          
                          <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <h4 className="text-white font-display text-[12px] tracking-wider uppercase leading-snug truncate text-left">
                              {log.title || 'UNSPECIFIED STRIKE'}
                            </h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 items-center text-[8px] font-mono text-text-dim uppercase tracking-wider">
                              <span className="text-gold-core/80 font-bold">{log.category || 'WORK'}</span>
                              <span className="flex items-center gap-1">
                                <Calendar size={8} />
                                {new Date(log.completedAt || log.abandonedAt || 0).toLocaleDateString()} 
                                {' '}
                                {new Date(log.completedAt || log.abandonedAt || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono tracking-widest font-extrabold uppercase border ${
                            isCompleted 
                              ? 'text-gold-bright bg-gold-core/10 border-gold-core/20 shadow-[0_0_8px_rgba(197,160,89,0.15)]' 
                              : 'text-red-400 bg-red-950/20 border-red-500/10'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Fitness History logs below the operations history */}
            {selectedDateStr && dailyGymLogs.length > 0 && (
              <div className="flex flex-col gap-3 mt-4 text-left">
                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest text-left border-t border-white/5 pt-6">
                  FITNESS HISTORY
                </span>

                <div className="flex flex-col gap-4">
                  {dailyGymLogs.map((log) => (
                    <div key={log.id} className="elite-panel p-5 border border-gold-core/10 bg-gradient-to-r from-gold-core/[0.01] to-transparent rounded-lg flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <div className="flex flex-col text-left">
                          <span className="text-[7.5px] font-mono text-gold-core/70 tracking-widest uppercase font-bold">WORKOUT SPLIT</span>
                          <span className="font-display text-xs text-white tracking-widest uppercase font-black">{log.split}</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[7.5px] font-mono text-gray-500 uppercase tracking-wider">TONNAGE LOAD</span>
                          <span className="text-xs font-mono font-bold text-gold-bright">{Math.round(getSessionTonnage(log)).toLocaleString()} KG</span>
                        </div>
                      </div>

                      {/* Movements list */}
                      {log.movements && log.movements.length > 0 && (
                        <div className="flex flex-col gap-3">
                          {log.movements.map((movement, mIdx) => (
                            <div key={mIdx} className="text-left border-b border-white/[0.02] pb-2 last:border-0 last:pb-0">
                              <span className="text-[9.5px] font-mono font-bold text-gold-core uppercase tracking-wider">{movement.name}</span>
                              <div className="pl-3 mt-1.5 flex flex-col gap-1 text-[9px] font-mono text-gray-400">
                                {(movement.sets || []).map((setObj, sIdx) => (
                                  <div key={sIdx} className="flex items-center justify-between py-0.5 border-b border-white/[0.01] last:border-0 max-w-md">
                                    <span className={`${setObj.completed ? 'text-gray-300' : 'text-gray-600 line-through'}`}>
                                      Set {sIdx + 1} ({setObj.type.toUpperCase()}): {setObj.weight} kg × {setObj.reps} reps {setObj.rpe ? `@ ${setObj.rpe} RPE` : ''}
                                    </span>
                                    <span className={`text-[7px] font-bold px-1 rounded ${
                                      setObj.completed ? 'text-emerald-400 bg-emerald-950/20' : 'text-red-400 bg-red-950/20'
                                    }`}>
                                      {setObj.completed ? 'COMPLETE' : 'MISSED'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Session Notes */}
                      {log.notes && (
                        <div className="bg-white/[0.01] border border-white/5 p-3 rounded text-left">
                          <span className="text-[7.5px] font-mono text-gray-500 uppercase tracking-widest block mb-1">SESSION NOTES</span>
                          <p className="text-[9.5px] font-mono text-gray-300 leading-relaxed uppercase">{log.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : subTab === 'prophecies' ? (
          <div className="flex flex-col gap-6">
            <div className="elite-panel-ornate relative p-6 bg-black/40 border border-white/5 rounded-lg">
              <div className="corner-ornament corner-tl" />
              <div className="corner-ornament corner-tr" />
              <div className="corner-ornament corner-bl" />
              <div className="corner-ornament corner-br" />
              <div className="elite-panel-inner-border" />
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-display text-gold-core uppercase tracking-widest">GUARDIAN CHRONICLES</h3>
                  <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-widest">
                    Witnessing your neural peak velocity under pressure
                  </p>
                </div>
                <div className="px-4 py-2 bg-gold-core/10 border border-gold-core/20 rounded text-center">
                  <span className="text-[10px] font-mono text-gold-core block tracking-widest">MESSAGES RECORDED</span>
                  <span className="text-2xl font-bold font-times text-white mt-1 block">
                    {receivedProphecies?.length || 0}
                  </span>
                </div>
              </div>

              {receivedProphecies.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-lg flex flex-col items-center gap-3">
                  <span className="text-gold-core/30 animate-pulse">
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
                      <path d="M12 10c-3.33 0-6 2.67-6 6v6h12v-6c0-3.33-2.67-6-6-6z" />
                      <path d="M5 16s-2 1.5-2 4v2" />
                      <path d="M19 16s2 1.5 2 4v2" />
                    </svg>
                  </span>
                  <p className="text-xs text-gray-400 font-mono tracking-widest uppercase">
                    NO NEURAL CHRONICLES RECORDED YET
                  </p>
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">
                    Deploy an operation and activate Focus Mode to awaken the Guardian presence.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...receivedProphecies].reverse().map((p, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.05 }}
                      className="flex gap-4 p-4 rounded bg-white/[0.01] border border-white/5 relative hover:border-gold-core/25 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] group"
                    >
                      <div className="w-12 h-12 border border-gold-core/20 rounded bg-black/60 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                        <img 
                          src="/guardian-observer.png" 
                          alt="Guardian Observer" 
                          className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity" 
                        />
                        <div className="absolute inset-0 bg-yellow-950/15" />
                      </div>
                      <div className="flex flex-col gap-1.5 text-left min-w-0">
                        <span className="text-[8px] font-mono text-gold-core tracking-widest uppercase font-bold">
                          {p.type || 'prophecy'} // RECORDED ON {new Date(p.date).toLocaleDateString()}
                        </span>
                        <p className="text-[10.5px] font-mono text-gray-300 leading-relaxed italic">
                          "{p.text}"
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="vault-layout-page">
            {/* Left side: Artifact gallery and dragon heads */}
            <div className="artifact-gallery-page">
              {/* ── FAIRY FRAGMENTS SECTION ── */}
              <div className="dragon-trophies-section glass-panel mb-6">
                <div className="panel-label flex items-center gap-1.5 text-[9px] font-mono tracking-widest uppercase font-bold" style={{ color: '#ecc880' }}>
                  <Sparkles size={12} style={{ color: '#ecc880' }} />
                  <span>FAIRY FRAGMENTS</span>
                </div>
                <p className="text-[8px] font-mono text-gray-500 mt-1 mb-3 tracking-wider italic">
                  Collected by freeing imprisoned empresses from the dragon's cage and restoring order to each kingdom.
                </p>
                <div className="flex flex-wrap gap-3">
                  {Object.keys(rescuedFairies).length === 0 ? (
                    <span className="empty-msg text-[9px] font-mono text-gray-500 tracking-wider">NO FAIRIES LIBERATED YET</span>
                  ) : (
                    Object.entries(rescuedFairies).map(([regionIdxStr, info]) => {
                      const regionIdx = parseInt(regionIdxStr, 10);
                      const mapIndex = (regionIdx % 10) + 1;
                      const accentColor = REGION_COLORS[mapIndex] || '#ecc880';
                      const isSelected = selectedFairy && selectedFairy.mapIndex === mapIndex;
                      return (
                        <motion.div
                          key={regionIdxStr}
                          className="fairy-frag-card"
                          style={{
                            borderColor: isSelected ? accentColor : `${accentColor}30`,
                            boxShadow: isSelected ? `0 0 12px ${accentColor}55` : 'none',
                            background: isSelected ? `${accentColor}15` : 'rgba(255,255,255,0.02)'
                          }}
                          onClick={() => {
                            setSelectedFairy({ mapIndex, regionIdx, info });
                            setSelectedArtifact(null);
                            setSelectedTrophy(null);
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', delay: mapIndex * 0.06 }}
                          whileHover={{ scale: 1.06 }}
                          title={EMPRESS_NAMES[mapIndex - 1]}
                        >
                          <img
                            src={getAssetUrl(`/crests/region-crest-${mapIndex}.png`)}
                            alt={`Region ${mapIndex} Crest`}
                            className="w-full h-full object-contain p-0.5"
                            style={{ filter: `drop-shadow(0 0 4px ${accentColor}80)` }}
                          />
                          <div
                            className="absolute bottom-0 inset-x-0 h-[3px] rounded-b"
                            style={{ background: accentColor, opacity: 0.7 }}
                          />
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* ── DRAGON HEAD TROPHIES ── */}
              <div className="dragon-trophies-section glass-panel mb-6">
                <div className="panel-label flex items-center gap-1.5 text-[9px] font-mono text-red-500/80 tracking-widest uppercase font-bold">
                  <Star size={12} fill="#ef4444" className="text-red-500" />
                  <span>DRAGON HEAD TROPHIES</span>
                </div>
                <div className="dragon-grid flex flex-wrap gap-3 mt-3">
                  {Array.from({ length: bossKills }).map((_, i) => {
                    const type = dragonTrophies[i % dragonTrophies.length];
                    const trophyPath = getAssetUrl(`/trophies/trophy-dragon-${type}.png`);
                    const bossTask = bossTasks[i];
                    return (
                      <motion.div 
                        key={i} 
                        className={`dragon-head flex items-center justify-center p-1 bg-black/40 border rounded-md hover:border-red-500/30 transition-colors cursor-pointer ${selectedTrophy && selectedTrophy.index === i ? 'border-red-500 bg-red-950/20' : 'border-white/5'}`}
                        style={{ width: '48px', height: '48px' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: i * 0.08 }}
                        title={`${type.toUpperCase()} TROPHY`}
                        onClick={() => {
                          setSelectedTrophy({
                            type,
                            index: i,
                            taskTitle: bossTask ? bossTask.title : null,
                            taskDate: bossTask ? bossTask.completedAt : null
                          });
                          setSelectedArtifact(null);
                        }}
                      >
                        <img src={trophyPath} alt={`${type} Trophy`} className="w-full h-full object-contain" />
                      </motion.div>
                    );
                  })}
                  {bossKills === 0 && <span className="empty-msg text-[9px] font-mono text-gray-500 tracking-wider">NO DRAGONS SLAIN</span>}
                </div>
              </div>

              <div className="gallery-grid-page">
                {collectedArtifacts.length === 0 ? (
                  <div className="empty-vault py-12 text-center text-gray-500">
                    <p className="font-display text-[11px] tracking-wider uppercase mb-1">NO ARTIFACTS RECOVERED YET.</p>
                    <span className="font-mono text-[9px] tracking-widest">CONQUER OPERATIONS TO FILL THE VAULT.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
                    {collectedArtifacts.map((art, i) => (
                      <motion.div 
                        key={i}
                        className={`art-card rarity-${art.rarity} ${selectedArtifact === art ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedArtifact(art);
                          setSelectedTrophy(null);
                        }}
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
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Inspector */}
            <div className="artifact-inspector-page">
              <AnimatePresence mode="wait">
                {selectedArtifact ? (
                  <motion.div 
                    key={selectedArtifact.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="inspector-content-page"
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
                    
                    <div className="inspector-details w-full text-center">
                      <span className={`rarity-label rarity-${selectedArtifact.rarity} text-[9px] font-mono tracking-widest font-extrabold uppercase block mb-2`}>
                        {rarities[selectedArtifact.rarity].label} ARTIFACT
                      </span>
                      <h3 className="font-display text-xl text-white tracking-wide uppercase mb-1">{selectedArtifact.name}</h3>
                      <p className="art-date text-[9px] font-mono text-gray-500 mb-4">RECOVERED: {new Date(selectedArtifact.date).toLocaleDateString()}</p>
                      
                      {(selectedArtifact.context || selectedArtifact.effortContext) && (
                        <div className="flex flex-col gap-1 mt-2 mb-4 p-3 bg-white/[0.02] border border-white/5 rounded text-left">
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
                        <div className="lore-box mt-4 p-4 bg-white/[0.01] border border-white/5 rounded text-left">
                          <div className="lore-header flex items-center gap-1.5 text-[9px] font-mono text-gold-core tracking-widest uppercase font-bold mb-2">
                            <Scroll size={12} />
                            <span>TACTICAL INTEL</span>
                          </div>
                          {selectedArtifact.hook && (
                            <p className="mb-3 text-[10px] font-mono text-gold-core/90 italic leading-relaxed">"{selectedArtifact.hook}"</p>
                          )}
                          <p className="text-[11px] text-text-dim leading-relaxed font-serif italic">{selectedArtifact.lore}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : selectedTrophy ? (
                  <motion.div 
                    key={selectedTrophy.index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="inspector-content-page"
                  >
                    <div className="inspector-visual">
                      <img 
                        src={getAssetUrl(`/trophies/trophy-dragon-${selectedTrophy.type}.png`)} 
                        className="large-art-icon-img" 
                        alt={selectedTrophy.type} 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', zIndex: 2, filter: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.45))' }}
                      />
                      <div className="large-glow rarity-mythic" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }} />
                    </div>
                    
                    <div className="inspector-details w-full text-center">
                      <span className="text-red-500 text-[9px] font-mono tracking-widest font-extrabold uppercase block mb-2">
                        CONQUERED DRAGON TROPHY
                      </span>
                      <h3 className="font-display text-xl text-white tracking-wide uppercase mb-1">{getDragonDetails(selectedTrophy.type).name}</h3>
                      <p className="art-date text-[9px] font-mono text-gray-500 mb-4">
                        DEFEATED: {selectedTrophy.taskDate ? new Date(selectedTrophy.taskDate).toLocaleDateString() : 'UNKNOWN DATE'}
                      </p>
                      
                      {selectedTrophy.taskTitle && (
                        <div className="flex flex-col gap-1 mt-2 mb-4 p-3 bg-red-950/10 border border-red-500/20 rounded text-left">
                          <p className="text-[9px] font-mono text-red-400 uppercase font-bold tracking-[0.2em] border-l-2 border-red-500 pl-2">
                            SLAIN VIA RAID: {selectedTrophy.taskTitle}
                          </p>
                          <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest pl-2 mt-1">
                            REGION INDEX: {selectedTrophy.index + 1}
                          </p>
                        </div>
                      )}
                      
                      <div className="lore-box mt-4 p-4 bg-white/[0.01] border border-white/5 rounded text-left">
                        <div className="lore-header flex items-center gap-1.5 text-[9px] font-mono text-red-500 tracking-widest uppercase font-bold mb-2">
                          <Scroll size={12} className="text-red-500" />
                          <span>BESTIARY RECORDS</span>
                        </div>
                        <p className="text-[11px] text-text-dim leading-relaxed font-serif italic">{getDragonDetails(selectedTrophy.type).lore}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : selectedFairy ? (
                  <motion.div
                    key={`fairy-${selectedFairy.mapIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="inspector-content-page"
                  >
                    {/* Crest as visual */}
                    <div className="inspector-visual" style={{ width: 120, height: 120 }}>
                      <img
                        src={getAssetUrl(`/crests/region-crest-${selectedFairy.mapIndex}.png`)}
                        alt="Region Crest"
                        style={{
                          maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', zIndex: 2, position: 'relative',
                          filter: `drop-shadow(0 0 14px ${REGION_COLORS[selectedFairy.mapIndex] || '#ecc880'}80)`
                        }}
                      />
                      <div
                        className="large-glow"
                        style={{ backgroundColor: REGION_COLORS[selectedFairy.mapIndex] || '#ecc880', opacity: 0.15 }}
                      />
                    </div>

                    <div className="inspector-details w-full text-center">
                      <span
                        className="text-[9px] font-mono tracking-widest font-extrabold uppercase block mb-2"
                        style={{ color: REGION_COLORS[selectedFairy.mapIndex] || '#ecc880' }}
                      >
                        FAIRY FRAGMENT — REGION {selectedFairy.mapIndex}
                      </span>
                      <h3 className="font-display text-lg text-white tracking-wide uppercase mb-1">
                        {EMPRESS_NAMES[selectedFairy.mapIndex - 1]}
                      </h3>
                      <p className="art-date text-[9px] font-mono text-gray-500 mb-4">
                        LIBERATED: {selectedFairy.info?.date ? new Date(selectedFairy.info.date).toLocaleDateString() : 'UNKNOWN DATE'}
                      </p>

                      {selectedFairy.info?.taskTitle && (
                        <div
                          className="flex flex-col gap-1 mt-2 mb-4 p-3 rounded text-left border"
                          style={{ borderColor: `${REGION_COLORS[selectedFairy.mapIndex] || '#ecc880'}30`, background: `${REGION_COLORS[selectedFairy.mapIndex] || '#ecc880'}08` }}
                        >
                          <p
                            className="text-[9px] font-mono uppercase font-bold tracking-[0.2em] border-l-2 pl-2"
                            style={{ color: REGION_COLORS[selectedFairy.mapIndex] || '#ecc880', borderColor: REGION_COLORS[selectedFairy.mapIndex] || '#ecc880' }}
                          >
                            LIBERATED VIA: {selectedFairy.info.taskTitle}
                          </p>
                          {selectedFairy.info?.taskCategory && (
                            <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest pl-2 mt-1">
                              OPERATION TYPE: {selectedFairy.info.taskCategory}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="lore-box mt-4 p-4 bg-white/[0.01] border border-white/5 rounded text-left">
                        <div className="lore-header flex items-center gap-1.5 text-[9px] font-mono tracking-widest uppercase font-bold mb-2" style={{ color: REGION_COLORS[selectedFairy.mapIndex] || '#ecc880' }}>
                          <Scroll size={12} />
                          <span>SOVEREIGN CHRONICLES</span>
                        </div>
                        <p className="text-[11px] text-text-dim leading-relaxed font-serif italic">
                          {EMPRESS_LORE[selectedFairy.mapIndex - 1]}
                        </p>
                      </div>

                      {/* Liberation portrait thumbnail */}
                      <div className="mt-4 w-full rounded overflow-hidden border border-white/5" style={{ aspectRatio: '1/1' }}>
                        <img
                          src={getAssetUrl(`/fairies/empress-${selectedFairy.mapIndex}-liberated.png`)}
                          alt={EMPRESS_NAMES[selectedFairy.mapIndex - 1]}
                          className="w-full h-full object-cover object-top"
                          style={{ filter: `${currentFilter} drop-shadow(0 0 8px ${REGION_COLORS[selectedFairy.mapIndex] || '#ecc880'}50)` }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="inspector-placeholder flex flex-col items-center justify-center text-center text-gray-600 py-12">
                    <Star size={32} className="opacity-20 mb-3" />
                    <p className="font-mono text-[9px] tracking-widest uppercase max-w-[200px]">SELECT AN ARTIFACT OR TROPHY TO INSPECT ITS INTEL</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .vault-layout-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .vault-layout-page {
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 2rem;
            align-items: start;
          }
        }

        .artifact-gallery-page {
          background: rgba(10, 10, 14, 0.2);
          border: 1px solid rgba(197, 160, 89, 0.05);
          border-radius: 6px;
          padding: 1.5rem;
        }

        .artifact-inspector-page {
          background: rgba(10, 10, 14, 0.4);
          border: 1px solid rgba(197, 160, 89, 0.15);
          border-radius: 6px;
          padding: 2rem;
          min-height: 350px;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
        }

        .art-card {
          aspect-ratio: 1;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: 0.3s;
        }

        .art-card:hover { 
          border-color: rgba(197, 160, 89, 0.3); 
          background: rgba(255,255,255,0.04); 
        }

        .art-card.active { 
          border-color: var(--gold-core); 
          background: rgba(197, 160, 89, 0.05); 
          box-shadow: 0 0 15px rgba(197, 160, 89, 0.2); 
        }

        .rarity-dot { 
          position: absolute; 
          top: 8px; 
          right: 8px; 
          width: 5px; 
          height: 5px; 
          border-radius: 50%; 
        }

        .rarity-common .rarity-dot { background: #aaa; }
        .rarity-uncommon .rarity-dot { background: #2ecc71; box-shadow: 0 0 4px #2ecc71; }
        .rarity-rare .rarity-dot { background: #f1c40f; box-shadow: 0 0 4px #f1c40f; }
        .rarity-epic .rarity-dot { background: #e74c3c; box-shadow: 0 0 4px #e74c3c; }
        .rarity-mythic .rarity-dot { background: #ff3d00; box-shadow: 0 0 4px #ff3d00; }

        .rarity-common { border-color: rgba(170,170,170,0.1); }
        .rarity-uncommon { border-color: rgba(46,204,113,0.15); }
        .rarity-rare { border-color: rgba(241,196,15,0.15); }
        .rarity-epic { border-color: rgba(231,76,60,0.15); }
        .rarity-mythic { border-color: rgba(255,61,0,0.2); }

        .rarity-label.rarity-common { color: #aaa; }
        .rarity-label.rarity-uncommon { color: #2ecc71; }
        .rarity-label.rarity-rare { color: #f1c40f; }
        .rarity-label.rarity-epic { color: #e74c3c; }
        .rarity-label.rarity-mythic { color: #ff3d00; }

        .inspector-visual {
          position: relative;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem auto;
        }

        .large-glow { 
          position: absolute; 
          inset: 0; 
          border-radius: 50%; 
          filter: blur(35px); 
          opacity: 0.2; 
          z-index: 0;
        }

        .large-glow.rarity-common { background: #fff; }
        .large-glow.rarity-uncommon { background: #2ecc71; }
        .large-glow.rarity-rare { background: #f1c40f; }
        .large-glow.rarity-epic { background: #e74c3c; }
        .large-glow.rarity-mythic { background: #ff3d00; }

        .large-art-icon {
          position: relative;
          z-index: 1;
        }

        .art-img-filter.common { filter: grayscale(100%) brightness(0.8) drop-shadow(0 0 6px rgba(170, 170, 170, 0.3)); }
        .art-img-filter.uncommon { filter: hue-rotate(90deg) saturate(1.5) drop-shadow(0 0 6px rgba(46, 204, 113, 0.35)); }
        .art-img-filter.rare { filter: hue-rotate(15deg) saturate(2) brightness(1.1) drop-shadow(0 0 8px rgba(241, 196, 15, 0.45)); }
        .art-img-filter.epic { filter: hue-rotate(-30deg) saturate(2) brightness(1) drop-shadow(0 0 10px rgba(231, 76, 60, 0.55)); }
        .art-img-filter.mythic { filter: hue-rotate(240deg) saturate(2.5) brightness(1.1) drop-shadow(0 0 12px rgba(147, 51, 234, 0.65)); }

        .fairy-frag-card {
          width: 52px;
          height: 52px;
          border: 1px solid;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.25s;
          overflow: hidden;
        }

        .fairy-frag-card:hover {
          transform: scale(1.08);
        }

        .glass-panel {
          background: rgba(10, 10, 14, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          padding: 1rem 1.2rem;
        }

        .panel-label {
          margin-bottom: 0.25rem;
        }

        .inspector-details {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        .inspector-content-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .art-date {
          display: block;
        }

        .lore-box {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
