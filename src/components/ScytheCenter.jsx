import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { Lock, Unlock } from 'lucide-react';

export default function ScytheCenter() {
  const { dailyLog, streakCount, unlockedScythes, coins, buyScythe } = useWarscytheStore();
  const [isSlashing, setIsSlashing] = useState(false);
  const [viewedStageIndex, setViewedStageIndex] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const todayStats = dailyLog[today] || { completed: 0, weight: 0 };
  const weight = todayStats.weight;

  const triggerSlash = () => {
    if (isSlashing) return;
    setIsSlashing(true);
    setTimeout(() => setIsSlashing(false), 600);
  };

  const stages = [
    { id: 'dormant', name: 'DORMANT', req: 0, type: 'weight', material: 'dormant', materialName: 'Dormant' },
    { id: 'awakened', name: 'AWAKENED', req: 3, type: 'weight', material: 'wood', materialName: 'Wooden' },
    { id: 'hardened', name: 'HARDENED', req: 7, type: 'weight', material: 'steel', materialName: 'Steel' },
    { id: 'refined', name: 'REFINED', req: 10, type: 'weight', material: 'silver', materialName: 'Silver' },
    { id: 'neophyte', name: 'NEOPHYTE', req: 5, type: 'streak', material: 'neophyte', materialName: 'Neophyte' },
    { id: 'acolyte', name: 'ACOLYTE', req: 15, type: 'streak', material: 'acolyte', materialName: 'Acolyte' },
    { id: 'reaper', name: 'REAPER', req: 30, type: 'streak', material: 'reaper', materialName: 'Reaper' },
    { id: 'executioner', name: 'EXECUTIONER', req: 60, type: 'streak', material: 'executioner', materialName: 'Executioner' },
    { id: 'sovereign', name: 'SOVEREIGN', req: 120, type: 'streak', material: 'sovereign', materialName: 'Sovereign' },
    { id: 'void-walker', name: 'VOID-WALKER', req: 200, type: 'streak', material: 'void-walker', materialName: 'Void-Walker' },
    { id: 'eternal', name: 'ETERNAL', req: 300, type: 'streak', material: 'eternal', materialName: 'Eternal' },
    { id: 'death-lord', name: 'DEATH-LORD', req: 360, type: 'streak', material: 'death-lord', materialName: 'Death-Lord' }
  ];

  const scythePrices = { 'acolyte': 100, 'reaper': 250, 'executioner': 500, 'sovereign': 1000, 'void-walker': 2000, 'eternal': 4000, 'death-lord': 8000 };

  const isScytheUnlocked = (stage) => {
    if (stage.type === 'weight') {
      if (stage.id === 'dormant') return true;
      if (stage.id === 'awakened' && weight >= 3) return true;
      if (stage.id === 'hardened' && weight >= 7) return true;
      if (stage.id === 'refined' && weight >= 10) return true;
      return false;
    }
    return (unlockedScythes || []).includes(stage.id);
  };

  const currentStageIndex = (() => {
    for (let i = stages.length - 1; i >= 0; i--) if (isScytheUnlocked(stages[i])) return i;
    return 0;
  })();

  const activeStageIndex = viewedStageIndex !== null ? viewedStageIndex : currentStageIndex;
  const activeStage = stages[activeStageIndex];
  const { material, materialName } = activeStage;
  
  const auraColors = {
    dormant: 'rgba(255,255,255,0.05)', wood: 'rgba(139,69,19,0.2)', steel: 'rgba(200,200,200,0.3)', silver: 'rgba(220,220,255,0.4)',
    neophyte: 'rgba(255,255,255,0.3)', acolyte: 'rgba(100,149,237,0.4)', reaper: 'rgba(75,0,130,0.5)', executioner: 'rgba(220,20,60,0.5)',
    sovereign: 'rgba(197,160,89,0.6)', 'void-walker': 'rgba(138,43,226,0.6)', eternal: 'rgba(255,60,60,0.7)', 'death-lord': 'rgba(30,30,30,0.8)'
  };
  const auraColor = auraColors[material] || 'rgba(255,255,255,0.05)';
  const fullName = material === 'dormant' ? 'Dormant Scythe' : `${materialName} Reaper`;

  return (
    <section className="scythe-center-section">
      <div className="scythe-frame">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="panel-tag">WEAPON EVOLUTION</span>
            <h4 className="text-white font-display">THE REAPER'S SCYTHE</h4>
          </div>
          <div className="px-3 py-1 bg-black/40 border border-gold-core/20 text-gold-core text-[10px] rounded font-mono">
            🪙 {coins} COINS
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 h-[400px]">
          <div className="evolution-list custom-scrollbar overflow-y-auto pr-2">
            {stages.map((stage, index) => {
              const isUnlocked = isScytheUnlocked(stage);
              const isCurrent = currentStageIndex === index;
              return (
                <div key={stage.id} onClick={() => isUnlocked && setViewedStageIndex(index)} className={`evo-item ${isUnlocked ? 'active' : 'locked'} ${activeStageIndex === index ? 'selected' : ''}`}>
                  <div className="flex items-center gap-3">
                    {isUnlocked ? <Unlock size={12} className="text-gold-core" /> : <Lock size={12} className="text-white/20" />}
                    <div>
                      <div className="text-[10px] font-bold tracking-widest">{stage.name}</div>
                      <div className="text-[8px] opacity-50">{isCurrent ? 'CURRENT' : isUnlocked ? 'UNLOCKED' : `${stage.req} ${stage.type === 'weight' ? 'PWR' : 'STRK'}`}</div>
                    </div>
                  </div>
                  {!isUnlocked && scythePrices[stage.id] && (
                    <button onClick={(e) => { e.stopPropagation(); buyScythe(stage.id, scythePrices[stage.id]); }} className="text-[9px] px-2 py-1 bg-gold-core/10 hover:bg-gold-core/30 border border-gold-core/30 rounded">
                      {scythePrices[stage.id]} 🪙
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center justify-center relative border-l border-white/5 pl-8">
            <motion.div onClick={triggerSlash} className="relative cursor-pointer" style={{ filter: `drop-shadow(0 0 30px ${auraColor})` }}>
              <AnimatePresence>
                {isSlashing && <motion.div className="absolute inset-0 border-2 border-white/50 rounded-full" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.5, opacity: 0 }} exit={{ opacity: 0 }} />}
              </AnimatePresence>
              <div className="w-32 h-64 flex items-center justify-center">
                 {activeStage.type === 'streak' ? (
                   <img src={`/ultimate/${material}.png`} className="w-full h-full object-contain" onError={(e) => e.target.src = '/scythe/DORMANT.png'} />
                 ) : (
                   <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                     <path d="M 85,95 C 75,70 65,40 60,10 L 55,10 C 60,40 70,70 80,95 Z" fill="#333" />
                     <path d="M 60,15 C 30,5 5,30 5,60 C 15,40 35,25 55,25 Z" fill={material === 'dormant' ? '#555' : '#aaa'} />
                   </svg>
                 )}
              </div>
            </motion.div>
            <div className="mt-6 w-full text-center">
              <div className="text-white font-display mb-1">{fullName}</div>
              <div className="h-1 bg-white/10 w-full rounded-full overflow-hidden">
                <motion.div className="h-full bg-gold-core" animate={{ width: `${activeStage.type === 'streak' ? (streakCount/activeStage.req)*100 : (weight/10)*100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .scythe-center-section {
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem 1.5rem;
        }

        .scythe-frame {
          background: linear-gradient(180deg, rgba(20,20,20,0.5) 0%, rgba(5,5,5,0.88) 100%);
          border: 1px solid rgba(197,160,89,0.12);
          border-radius: 10px;
          padding: 2rem;
        }

        .panel-tag {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          font-weight: 900;
          color: var(--gold-core);
          letter-spacing: 0.25em;
          display: block;
          margin-bottom: 0.25rem;
        }

        /* Evolution list column */
        .evolution-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 380px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .evo-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.5rem 0.65rem;
          border-radius: 5px;
          border: 1px solid transparent;
          transition: all 0.2s;
          cursor: default;
          opacity: 0.3;
          font-family: var(--font-display);
          color: #fff;
        }

        .evo-item.active {
          opacity: 0.7;
          cursor: pointer;
        }

        .evo-item.active:hover {
          opacity: 1;
          background: rgba(255,255,255,0.025);
          border-color: rgba(255,255,255,0.06);
        }

        .evo-item.selected {
          opacity: 1;
          background: rgba(197,160,89,0.05);
          border-color: rgba(197,160,89,0.25);
          box-shadow: 0 0 10px rgba(197,160,89,0.08);
        }
      `}</style>
    </section>
  );
}
