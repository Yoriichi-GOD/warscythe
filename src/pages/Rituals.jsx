import React, { useState } from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { motion, AnimatePresence } from 'framer-motion';
import RitualCard from '../components/operations/RitualCard';
import ScytheDisplay from '../components/scythe/ScytheDisplay';
import CommandCenter from '../components/command/CommandCenter';
import { Flame, Lock, Zap } from 'lucide-react';

export default function Rituals({ onAddTask }) {
  const rituals = useWarscytheStore(state => state.rituals) || [];
  const completeRitual = useWarscytheStore(state => state.completeRitual);
  const scytheLevel = useWarscytheStore(state => state.scytheLevel) || 'DORMANT';
  const streakCount = useWarscytheStore(state => state.streakCount) || 0;
  
  const [preview, setPreview] = useState({ level: null, type: 'standard', pwr: '10' });

  const stageOrder = ['DORMANT', 'AWAKENED', 'HARDENED', 'REFINED', 'ASCENDED', 'PLATINUM'];
  const currentStageIndex = stageOrder.indexOf(scytheLevel.toUpperCase());
  
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

  const currentTier = [...streakTiers].reverse().find(t => streakCount >= t.days);
  const standardPwrs = {
    'DORMANT': '10',
    'AWAKENED': '35',
    'HARDENED': '60',
    'REFINED': '75',
    'ASCENDED': '90',
    'PLATINUM': '100'
  };

  const activeDisplayLevel = preview.level || (currentTier ? currentTier.name : scytheLevel);
  const activeDisplayType = preview.type || (currentTier ? 'ultimate' : 'standard');
  const activeDisplayPwr = preview.pwr || (currentTier ? (100 + streakTiers.indexOf(currentTier) * 50).toString() : (standardPwrs[scytheLevel.toUpperCase()] || '10'));

  const evolutionStages = [
    { id: 'DORMANT', label: 'DORMANT', desc: 'The scythe sleeps, its edge dull. It awaits the first spark of will.', pwr: '10 PWR' },
    { id: 'AWAKENED', label: 'AWAKENED', desc: 'A wooden frame bound with determination. The journey begins.', pwr: '35 PWR' },
    { id: 'HARDENED', label: 'HARDENED', desc: 'Cold iron forged through repeated action. A reliable tool of war.', pwr: '60 PWR' },
    { id: 'REFINED', label: 'REFINED', desc: 'Silver-edged and balanced. Precision becomes your greatest weapon.', pwr: '75 PWR' },
    { id: 'ASCENDED', label: 'ASCENDED', desc: 'Golden resonance. Your actions now ripple through the fabric of reality.', pwr: '90 PWR' },
    { id: 'PLATINUM', label: 'PLATINUM', desc: 'A blade of pure focus. Distraction cannot touch this edge.', pwr: '100 PWR' },
  ];

  return (
    <div className="elite-grid-container">
      
      {/* ═══ LEFT COLUMN: ACTIVE RITUALS ═══ */}
      <section className="elite-panel lg:h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar pb-36">
        <div className="flex items-center gap-3 mb-8">
          <Flame size={14} className="text-gold-core" />
          <h2 className="text-white font-display text-xs tracking-[0.3em] uppercase">Active Rituals</h2>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-mono text-gray-300 tracking-widest uppercase">Enshrined Habits</span>
              <span className="text-[9px] font-mono text-gold-core/60">{rituals.length} Active</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {rituals.map(ritual => (
                <RitualCard key={ritual.id} ritual={ritual} onComplete={completeRitual} />
              ))}

              {rituals.length === 0 && (
                <div className="w-full py-6 border border-dashed border-white/5 rounded flex flex-col items-center justify-center text-white/10 bg-white/[0.005]">
                  <span className="text-[8px] font-mono tracking-[0.25em] uppercase text-gray-600 mb-1">No Rituals Enshrined</span>
                </div>
              )}
              
              <button 
                onClick={onAddTask}
                className="w-full mt-4 py-5 border border-dashed border-white/20 rounded flex items-center justify-center text-white/40 hover:border-gold-core/40 hover:text-gold-core transition-all bg-white/[0.02]"
              >
                <span className="text-[11px] font-mono tracking-[0.4em] uppercase font-black">+ Enshrine Ritual</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="elite-panel !p-0 flex flex-row h-[360px] lg:h-[calc(100vh-160px)] overflow-hidden relative">
        
        {/* WEAPON EVOLUTION SIDEBAR */}
        <div className="w-full lg:w-64 shrink-0 border-b-0 lg:border-r border-white/5 flex flex-col py-3 lg:py-10 px-3 lg:px-8 bg-transparent lg:bg-black/20 overflow-y-auto custom-scrollbar relative z-10">
          <div className="mb-6 lg:mb-10">
            <span className="text-[8px] font-mono text-gray-300 tracking-widest uppercase block mb-1">Weapon Evolution</span>
            <h4 className="text-white font-display text-[11px] tracking-[0.2em] uppercase">Reaper's Scythe</h4>
          </div>
          
          <div className="flex flex-col gap-4">
            {evolutionStages.map((stage, idx) => {
              const isUnlocked = idx <= currentStageIndex;
              const isActive = activeDisplayLevel.toUpperCase() === stage.id;
              const isActualLevel = scytheLevel.toUpperCase() === stage.id;

              return (
                <div 
                  key={stage.id} 
                  className={`flex flex-col gap-2 p-3 rounded border transition-all cursor-pointer ${
                    isActive ? 'border-gold-core/40 bg-gold-core/5' : 'border-white/5 hover:bg-white/5'
                  } ${!isUnlocked ? 'opacity-30' : ''}`}
                  onClick={() => isUnlocked && setPreview({ level: stage.id, type: 'standard', pwr: stage.pwr })}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 ${
                      isActive ? 'border-gold-core text-gold-core' : 'border-white/10 text-white/30'
                    }`}>
                       {isUnlocked ? <Zap size={10} /> : <Lock size={10} />}
                    </div>
                    <div className="flex flex-col">
                       <span className={`text-[9px] font-display tracking-[0.1em] uppercase ${isActive ? 'text-gold-core' : 'text-white/60'}`}>
                         {stage.label}
                       </span>
                    </div>
                  </div>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[7px] font-mono text-gray-500 uppercase leading-relaxed mt-1">
                          {stage.desc}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[7px] font-mono text-gold-core/60 font-bold uppercase">{stage.pwr}</span>
                          {isActualLevel && <span className="text-[6px] font-mono bg-gold-core text-black px-1.5 py-0.5 rounded-sm font-black">ACTIVE</span>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* SCYTHE DISPLAY AREA */}
        <div className="absolute lg:relative inset-0 w-full lg:w-auto lg:flex-1 h-full z-0 lg:z-10 pointer-events-none lg:pointer-events-auto bg-gradient-to-b from-transparent to-black/40 opacity-40 lg:opacity-100">
           <ScytheDisplay 
             level={activeDisplayLevel} 
             type={activeDisplayType}
             pwr={activeDisplayPwr}
           />
           {preview.level && (
             <button 
               onClick={() => setPreview({ level: null, type: 'standard', pwr: '10' })}
               className="absolute top-6 right-8 text-[8px] font-mono text-gold-core border border-gold-core/20 px-3 py-1.5 rounded hover:bg-gold-core/10 transition-all uppercase tracking-widest z-30 pointer-events-auto"
             >
               Return to Active
             </button>
           )}
        </div>
      </section>

      {/* ═══ RIGHT COLUMN: COMMAND CENTER ═══ */}
      <aside className="operations-sidebar custom-scrollbar">
        <CommandCenter 
          onPreviewUltimate={(level, type, pwr) => setPreview({ level, type, pwr })} 
        />
      </aside>

    </div>
  );
}
