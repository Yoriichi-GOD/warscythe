import React, { useState } from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { motion, AnimatePresence } from 'framer-motion';
import RitualCard from '../components/operations/RitualCard';
import ScytheDisplay from '../components/scythe/ScytheDisplay';
import CommandCenter from '../components/command/CommandCenter';
import { Flame, Lock, Zap, Info, Play } from 'lucide-react';

export default function Rituals({ onAddTask }) {
  const openInfoModal = useWarscytheStore(state => state.openInfoModal);
  const openVideoModal = useWarscytheStore(state => state.openVideoModal);
  const rituals = useWarscytheStore(state => state.rituals) || [];
  const completeRitual = useWarscytheStore(state => state.completeRitual);
  const scytheLevel = useWarscytheStore(state => state.scytheLevel) || 'DORMANT';
  const streakCount = useWarscytheStore(state => state.streakCount) || 0;
  const hasSeenRitualsGuide = useWarscytheStore(state => state.hasSeenRitualsGuide);
  const setHasSeenRitualsGuide = useWarscytheStore(state => state.setHasSeenRitualsGuide);
  const tutorialStep = useWarscytheStore(state => state.tutorialStep);
  const isTutorialActive = tutorialStep && tutorialStep !== 'completed';
  
  const [preview, setPreview] = useState({ level: null, type: 'standard', pwr: null });

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

  const activeDisplayLevel = preview.level || scytheLevel;
  const activeDisplayType = preview.type || 'standard';
  const activeDisplayPwr = preview.pwr || (standardPwrs[scytheLevel.toUpperCase()] || '10');

  const evolutionStages = [
    { id: 'DORMANT', label: 'DORMANT', desc: 'The scythe sleeps, its edge dull. It awaits the first spark of will.', pwr: '10 PWR' },
    { id: 'AWAKENED', label: 'AWAKENED', desc: 'A wooden frame bound with determination. The journey begins.', pwr: '35 PWR' },
    { id: 'HARDENED', label: 'HARDENED', desc: 'Cold iron forged through repeated action. A reliable tool of war.', pwr: '60 PWR' },
    { id: 'REFINED', label: 'REFINED', desc: 'Silver-edged and balanced. Precision becomes your greatest weapon.', pwr: '75 PWR' },
    { id: 'ASCENDED', label: 'ASCENDED', desc: 'Golden resonance. Your actions now ripple through the fabric of reality.', pwr: '90 PWR' },
    { id: 'PLATINUM', label: 'PLATINUM', desc: 'A blade of pure focus. Distraction cannot touch this edge.', pwr: '100 PWR' },
  ];

  return (
    <div className="elite-grid-container relative">
      {!hasSeenRitualsGuide && !isTutorialActive && (
        <div className="fixed inset-0 z-[100000] flex items-start justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto pt-[12vh]">
          <div className="onboarding-pointer select-pointer max-w-sm" style={{ pointerEvents: 'auto' }}>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <span className="pointer-tag">GUARDIAN</span>
                <h4 className="text-[12px] font-serif text-gold-core uppercase tracking-widest mb-1">The Altar of Rituals</h4>
                <p className="text-[11px] font-serif text-white">
                  Establish daily and weekly habit routines. Completing them builds momentum; neglecting them breaks your streak.
                </p>
              </div>
              <img src="/guardian-observer.png" alt="Guardian" className="w-10 h-10 object-contain shrink-0 filter drop-shadow-[0_0_8px_rgba(197,160,89,0.3)]" />
            </div>
            <button 
              type="button" 
              onClick={() => setHasSeenRitualsGuide(true)}
              className="mt-3 text-[9px] font-mono text-gold-core hover:text-white uppercase tracking-wider border border-gold-core/30 px-3 py-1 rounded cursor-pointer self-start bg-black/40 hover:bg-gold-core/10 transition-colors"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
      
      {/* ═══ LEFT COLUMN: ACTIVE RITUALS ═══ */}
      <section className="elite-panel lg:h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar pb-36">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Flame size={14} className="text-gold-core" />
            <h2 className="text-white font-display text-xs tracking-[0.3em] uppercase">Active Rituals</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => openVideoModal('rituals')}
              className="text-gray-500 hover:text-gold-core transition-colors p-1 hover:bg-white/5 rounded cursor-pointer flex items-center justify-center"
              title="Play Walkthrough Guide"
            >
              <Play size={12} fill="currentColor" className="text-gold-core" />
            </button>
            <button 
              type="button"
              onClick={() => openInfoModal('rituals')}
              className="text-gray-500 hover:text-gold-core transition-colors p-1 hover:bg-white/5 rounded cursor-pointer flex items-center justify-center"
              title="Rituals Info"
            >
              <Info size={14} />
            </button>
          </div>
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

      <section className="elite-panel !p-0 flex flex-row h-auto min-h-[520px] lg:h-[calc(100vh-160px)] overflow-hidden relative">
        
        {/* WEAPON EVOLUTION SIDEBAR — Desktop only */}
        <div className="hidden lg:flex w-full lg:w-64 shrink-0 border-b-0 lg:border-r border-white/5 flex-col py-3 lg:py-10 px-3 lg:px-8 bg-transparent lg:bg-black/20 overflow-y-auto custom-scrollbar relative z-10">
          <div className="flex justify-between items-start mb-6 lg:mb-10">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-gray-300 tracking-widest uppercase block mb-1">Weapon Evolution</span>
              <h4 className="text-white font-display text-[11px] tracking-[0.2em] uppercase">Reaper's Scythe</h4>
            </div>
            <button 
              type="button"
              onClick={() => openInfoModal('scythe')}
              className="text-gray-500 hover:text-gold-core transition-colors mt-1"
              title="Scythe & Progression Info"
            >
              <Info size={12} />
            </button>
          </div>
          
          <div className="flex flex-col gap-4 shrink-0">
            {evolutionStages.map((stage, idx) => {
              const isUnlocked = idx <= currentStageIndex;
              const isActive = activeDisplayLevel.toUpperCase() === stage.id;
              const isActualLevel = scytheLevel.toUpperCase() === stage.id;

              return (
                <div 
                  key={stage.id} 
                  className={`flex flex-col gap-2 p-3 rounded border transition-all cursor-pointer shrink-0 ${
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
                        <p className="text-[10px] font-mono text-gray-500 uppercase leading-relaxed mt-1">
                          {stage.desc}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[9px] font-mono text-gold-core/60 font-bold uppercase">{stage.pwr}</span>
                          {isActualLevel && <span className="text-[8px] font-mono bg-gold-core text-black px-1.5 py-0.5 rounded-sm font-black">ACTIVE</span>}
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
        {/* NOTE: lg:left-64 is coupled to the Weapon Evolution Sidebar's width (lg:w-64 = 256px). */}
        {/* If the sidebar width changes, this offset MUST be adjusted to match. */}
        <div className="relative w-full lg:w-auto lg:absolute lg:inset-0 lg:left-64 h-full z-10 pointer-events-auto bg-gradient-to-b from-transparent to-black/40 opacity-100">
           <ScytheDisplay 
             level={activeDisplayLevel} 
             type={activeDisplayType}
             pwr={activeDisplayPwr}
             evolutionStages={evolutionStages}
             currentStageIndex={currentStageIndex}
             scytheLevel={scytheLevel}
             onSelectStage={(stageId, stagePwr) => setPreview({ level: stageId, type: 'standard', pwr: stagePwr })}
             onReturnToActive={() => setPreview({ level: null, type: 'standard', pwr: null })}
             previewLevel={preview.level}
           />
           {preview.level && (
             <button 
               onClick={() => setPreview({ level: null, type: 'standard', pwr: null })}
               className="hidden lg:block absolute top-6 right-8 text-[8px] font-mono text-gold-core border border-gold-core/20 px-3 py-1.5 rounded hover:bg-gold-core/10 transition-all uppercase tracking-widest z-30 pointer-events-auto"
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
