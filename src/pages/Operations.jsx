import React, { useState } from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { motion, AnimatePresence } from 'framer-motion';
import ObjectiveRitual from '../components/operations/ObjectiveRitual';
import MissionCard from '../components/operations/MissionCard';
import RitualCard from '../components/operations/RitualCard';
import ScytheDisplay from '../components/scythe/ScytheDisplay';
import CommandCenter from '../components/command/CommandCenter';
import { Zap, Lock } from 'lucide-react';

export default function Operations({ onAddTask, onOpenTask, onCompleteTask, onOpenGymLog }) {
  const tasks = useWarscytheStore(state => state.tasks) || [];
  const rituals = useWarscytheStore(state => state.rituals) || [];
  const completeRitual = useWarscytheStore(state => state.completeRitual);
  const scytheLevel = useWarscytheStore(state => state.scytheLevel) || 'DORMANT';
  const streakCount = useWarscytheStore(state => state.streakCount) || 0;
  const generateMicroSteps = useWarscytheStore(state => state.generateMicroSteps);
  const tutorialStep = useWarscytheStore(state => state.tutorialStep) || 'completed';
  const [preview, setPreview] = useState({ level: null, type: 'standard', pwr: '10' });
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

  const isTutorialActive = tutorialStep !== 'completed';
  const activeDisplayLevel = preview.level || (isTutorialActive ? 'DORMANT' : (currentTier ? currentTier.name : scytheLevel));
  const activeDisplayType = preview.type || (isTutorialActive ? 'standard' : (currentTier ? 'ultimate' : 'standard'));
  const activeDisplayPwr = preview.pwr || (isTutorialActive ? '10' : (currentTier ? (100 + streakTiers.indexOf(currentTier) * 50).toString() : (standardPwrs[scytheLevel.toUpperCase()] || '10')));

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
      
      {/* ═══ LEFT COLUMN: ACTIVE OPERATIONS ═══ */}
      <section className="elite-panel lg:h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar pb-36">
        <div className="flex items-center gap-3 mb-8">
          <Zap size={14} className="text-gold-core" />
          <h2 className="text-white font-display text-xs tracking-[0.3em] uppercase">Active Operations</h2>
        </div>

        <div className="flex flex-col gap-8">
          <ObjectiveRitual onClick={onAddTask} />
          
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-mono text-gray-300 tracking-widest uppercase">Missions in Progress</span>
              <span className="text-[9px] font-mono text-gold-core/60">{tasks.length} / 3</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {tasks.map((task, idx) => {
                const isTarget = tutorialStep === 'click_task' && idx === 0;
                return (
                  <div key={task.id} className={isTarget ? 'gold-glow-ring' : ''}>
                    <MissionCard task={task} onOpen={onOpenTask} />
                    {isTarget && (
                      <div className="onboarding-pointer">
                        <span className="pointer-tag">GUIDE</span>
                        <h4>Target Acquired</h4>
                        <p>Your strike operation is ready on the command board. Click the mission card to inspect details and begin execution.</p>
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                onClick={onAddTask}
                className={`w-full py-10 border border-dashed rounded flex items-center justify-center transition-all ${
                  tutorialStep === 'task_creation'
                    ? 'border-gold-core text-gold-core gold-glow-ring'
                    : 'border-white/20 text-white/40 hover:border-gold-core/40 hover:text-gold-core bg-white/[0.02]'
                }`}
              >
                <span className="text-[11px] font-mono tracking-[0.4em] uppercase font-black">+ Initiate Strike</span>
              </button>
            </div>
          </div>

        </div>

        {/* RECALCULATE PROTOCOL */}
        <button 
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="mt-12 w-full py-5 rounded border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group disabled:opacity-60"
        >
          <div className="flex items-center justify-center gap-3">
            <div className={`w-2 h-2 rounded-full border border-gold-core/40 ${isRecalculating ? 'animate-ping' : ''}`} />
            <span className="text-[10px] font-display text-gold-core tracking-[0.4em] uppercase group-hover:text-gold-bright">
              {isRecalculating ? 'Recalculating...' : recalcSuccess ? 'Protocol Decomposed' : 'Recalculate Protocol'}
            </span>
            <div className={`w-2 h-2 rounded-full border border-gold-core/40 ${isRecalculating ? 'animate-ping' : ''}`} />
          </div>
          <p className="text-[8px] font-mono text-gray-600 mt-1 tracking-[0.2em] uppercase">
            {recalcSuccess ? 'All active strikes broken down into micro steps!' : 'Break it down. Focus. Execute.'}
          </p>
        </button>
      </section>

      <section className="elite-panel !p-0 flex flex-row h-auto min-h-[520px] lg:h-[calc(100vh-160px)] overflow-hidden relative">
        
        {/* WEAPON EVOLUTION SIDEBAR */}
        <div className="hidden lg:flex w-full lg:w-64 shrink-0 border-b-0 lg:border-r border-white/5 flex-col py-3 lg:py-10 px-3 lg:px-8 bg-transparent lg:bg-black/20 overflow-y-auto custom-scrollbar relative z-10">
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
        <div className="relative w-full lg:w-auto lg:flex-1 h-full z-10 pointer-events-auto bg-gradient-to-b from-transparent to-black/40 opacity-100">
           <ScytheDisplay 
             level={activeDisplayLevel} 
             type={activeDisplayType}
             pwr={activeDisplayPwr}
             evolutionStages={evolutionStages}
             currentStageIndex={currentStageIndex}
             scytheLevel={scytheLevel}
             onSelectStage={(stageId, stagePwr) => setPreview({ level: stageId, type: 'standard', pwr: stagePwr })}
             onReturnToActive={() => setPreview({ level: null, type: 'standard', pwr: '10' })}
             previewLevel={preview.level}
           />
           {preview.level && (
             <button 
               onClick={() => setPreview({ level: null, type: 'standard', pwr: '10' })}
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
          onOpenGymLog={onOpenGymLog}
        />
      </aside>

    </div>
  );
}
