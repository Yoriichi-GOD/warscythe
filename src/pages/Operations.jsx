import React from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import ObjectiveRitual from '../components/operations/ObjectiveRitual';
import MissionCard from '../components/operations/MissionCard';
import ScytheDisplay from '../components/scythe/ScytheDisplay';
import CommandCenter from '../components/command/CommandCenter';
import { Zap, Shield, Lock } from 'lucide-react';

export default function Operations({ onAddTask, onOpenTask, onCompleteTask }) {
  const tasks = useWarscytheStore(state => state.tasks);
  const scytheLevel = useWarscytheStore(state => state.scytheLevel);
  const [viewedStageId, setViewedStageId] = React.useState(null);

  const stageOrder = ['DORMANT', 'AWAKENED', 'HARDENED', 'REFINED', 'ASCENDED', 'PLATINUM'];
  const currentStageIndex = stageOrder.indexOf(scytheLevel ? scytheLevel.toUpperCase() : 'DORMANT');
  const activeDisplayLevel = viewedStageId || scytheLevel;

  const evolutionStages = [
    { id: 'DORMANT', label: 'DORMANT', desc: 'The scythe sleeps, its edge dull. It awaits the first spark of will.', pwr: '0 PWR' },
    { id: 'AWAKENED', label: 'AWAKENED', desc: 'A wooden frame bound with determination. The journey begins.', pwr: '10 PWR' },
    { id: 'HARDENED', label: 'HARDENED', desc: 'Cold iron forged through repeated action. A reliable tool of war.', pwr: '25 PWR' },
    { id: 'REFINED', label: 'REFINED', desc: 'Silver-edged and balanced. Precision becomes your greatest weapon.', pwr: '50 PWR' },
    { id: 'ASCENDED', label: 'ASCENDED', desc: 'Golden resonance. Your actions now ripple through the fabric of reality.', pwr: '100 PWR' },
    { id: 'PLATINUM', label: 'PLATINUM', desc: 'A blade of pure focus. Distraction cannot touch this edge.', pwr: '250 PWR' },
  ];

  return (
    <div className="elite-grid-container">
      
      {/* ═══ LEFT COLUMN: ACTIVE OPERATIONS ═══ */}
      <section className="elite-panel">
        <div className="flex items-center gap-3 mb-8">
          <Zap size={14} className="text-gold-core" />
          <h2 className="text-white font-display text-xs tracking-[0.3em] uppercase">Active Operations</h2>
        </div>

        <div className="flex flex-col gap-8">
          <ObjectiveRitual onClick={onAddTask} />
          
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">Missions in Progress</span>
              <span className="text-[9px] font-mono text-gold-core/60">{tasks.length} / 3</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {tasks.map(task => (
                <MissionCard key={task.id} task={task} onComplete={onCompleteTask} />
              ))}

              {tasks.length < 3 && (
                <button
                  onClick={onAddTask}
                  className="w-full py-10 border border-dashed border-white/10 rounded flex items-center justify-center text-white/5 hover:border-gold-core/20 hover:text-white/10 transition-all bg-white/[0.01]"
                >
                  <span className="text-[9px] font-mono tracking-[0.4em] uppercase font-black">+ Initiate Strike</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RECALCULATE PROTOCOL */}
        <button className="mt-12 w-full py-5 rounded border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full border border-gold-core/40" />
            <span className="text-[10px] font-display text-gold-core tracking-[0.4em] uppercase group-hover:text-gold-bright">
              Recalculate Protocol
            </span>
            <div className="w-2 h-2 rounded-full border border-gold-core/40" />
          </div>
          <p className="text-[8px] font-mono text-gray-600 mt-1 tracking-[0.2em] uppercase">Break it down. Focus. Execute.</p>
        </button>
      </section>

      <section className="elite-panel !p-0 flex !flex-col lg:!flex-row lg:!h-[calc(100vh-160px)] h-auto overflow-visible lg:overflow-hidden">
        
        {/* WEAPON EVOLUTION SIDEBAR */}
        <div className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col py-6 lg:py-10 px-6 lg:px-8 bg-black/20">
          <div className="mb-6 lg:mb-10">
            <span className="text-[8px] font-mono text-gray-500 tracking-widest uppercase block mb-1">Weapon Evolution</span>
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
                  onClick={() => isUnlocked && setViewedStageId(stage.id)}
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
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
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
                </div>
              );
            })}
          </div>
        </div>

        {/* SCYTHE DISPLAY AREA */}
        <div className="flex-1 relative h-[400px] lg:!h-[calc(100vh-160px)] min-h-0 bg-gradient-to-b from-transparent to-black/40">
           <ScytheDisplay level={activeDisplayLevel} />
           {viewedStageId && viewedStageId !== scytheLevel.toUpperCase() && (
             <button 
               onClick={() => setViewedStageId(null)}
               className="absolute top-6 right-8 text-[8px] font-mono text-gold-core border border-gold-core/20 px-3 py-1.5 rounded hover:bg-gold-core/10 transition-all uppercase tracking-widest z-30"
             >
               Return to Active
             </button>
           )}
        </div>
      </section>

      {/* ═══ RIGHT COLUMN: COMMAND CENTER ═══ */}
      <aside className="flex flex-col gap-6">
        <CommandCenter />
      </aside>

    </div>
  );
}
