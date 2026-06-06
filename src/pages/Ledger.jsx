import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { Check, Trash2, Calendar, ShieldAlert, Scroll, Award, Star } from 'lucide-react';
const dragonTrophies = [
  'wyrm', 'wyvern', 'frost', 'shadow', 'lava', 
  'celestial', 'skeletal', 'storm', 'abyssal', 'ancient'
];

const getArtifactImage = (name) => {
  const mapping = {
    'Iron Quill': 'scroll',
    "Scout's Compass": 'compass',
    'Wax Seal of Intent': 'rune',
    'Cloak of Momentum': 'amulet',
    'Whetstone of Focus': 'chain',
    'Ink of Resolve': 'chalice',
    'Blade of Persistence': 'blade',
    'Shield of No Retreat': 'shield',
    'Ring of Execution': 'ring',
    'Helm of Clarity': 'helm',
    'Staff of Deadlines': 'staff',
    'Cloak of Iteration': 'amulet',
    'Dragon Scale Armor': 'horn',
    'Eye of the Strategist': 'eye',
    "Void Walker's Boots": 'gem',
    'Crown of Completion': 'crown',
    "Warscythe's Gauntlet": 'gauntlet',
    'The Finisher': 'blade',
    'Throne Fragment': 'idol',
    'Shard of Reality': 'mirror',
    'Cosmic Reaper': 'skull',
    'Sovereign Core': 'orb',
    'Omega Catalyst': 'hourglass',
    'Grip of the Void': 'gauntlet'
  };
  const baseName = mapping[name] || 'rune';
  return `/artifacts/artifact-${baseName}.png`;
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
    if (historyFilter === 'CONQUERED') return log.type === 'completed';
    if (historyFilter === 'ABANDONED') return log.type === 'abandoned';
    return true;
  });

  // Vault tab state & logic (from VaultModal)
  const collectedArtifacts = useWarscytheStore(state => state.collectedArtifacts) || [];
  const unlockedLore = useWarscytheStore(state => state.unlockedLore) || {};
  const currentTitle = useWarscytheStore(state => state.currentTitle) || 'Recruit';
  const bossKills = useWarscytheStore(state => state.bossKills) || 0;
  const [selectedArtifact, setSelectedArtifact] = useState(null);

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
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {subTab === 'history' ? (
          <div className="flex flex-col gap-6">
            {/* Filter controls */}
            <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded w-fit">
              {['ALL', 'CONQUERED', 'ABANDONED'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setHistoryFilter(tab)}
                  className={`px-4 py-1.5 text-[9px] font-mono tracking-widest uppercase rounded transition-all ${
                    historyFilter === tab 
                      ? 'bg-gold-core text-black font-bold shadow-[0_0_12px_rgba(197,160,89,0.3)]' 
                      : 'text-text-dim hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab} ({
                    tab === 'ALL' ? allLogs.length : 
                    tab === 'CONQUERED' ? completedTasks.length : 
                    abandonedTasks.length
                  })
                </button>
              ))}
            </div>

            {/* Execution List */}
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {filteredLogs.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-white/5 rounded-lg"
                  >
                    <ShieldAlert size={24} className="text-gray-600" />
                    <span className="text-[10px] font-mono text-text-dim tracking-[0.3em] uppercase">No logs recorded</span>
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
                            <h4 className="text-white font-display text-[12px] tracking-wider uppercase leading-snug truncate">
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
          </div>
        ) : (
          <div className="vault-layout-page">
            {/* Left side: Artifact gallery and dragon heads */}
            <div className="artifact-gallery-page">
              <div className="dragon-trophies-section glass-panel mb-6">
                <div className="panel-label flex items-center gap-1.5 text-[9px] font-mono text-red-500/80 tracking-widest uppercase font-bold">
                  <Star size={12} fill="#ef4444" className="text-red-500" />
                  <span>DRAGON HEAD TROPHIES</span>
                </div>
                <div className="dragon-grid flex flex-wrap gap-3 mt-3">
                  {Array.from({ length: bossKills }).map((_, i) => {
                    const type = dragonTrophies[i % dragonTrophies.length];
                    const trophyPath = `/trophies/trophy-dragon-${type}.png`;
                    return (
                      <motion.div 
                        key={i} 
                        className="dragon-head flex items-center justify-center p-1 bg-black/40 border border-white/5 rounded-md hover:border-red-500/30 transition-colors"
                        style={{ width: '48px', height: '48px' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: i * 0.08 }}
                        title={`${type.toUpperCase()} TROPHY`}
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
                ) : (
                  <div className="inspector-placeholder flex flex-col items-center justify-center text-center text-gray-600 py-12">
                    <Star size={32} className="opacity-20 mb-3" />
                    <p className="font-mono text-[9px] tracking-widest uppercase max-w-[200px]">SELECT AN ARTIFACT TO INSPECT ITS INTEL</p>
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
      `}</style>
    </div>
  );
}
