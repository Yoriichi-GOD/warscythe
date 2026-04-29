import React from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import ObjectiveRitual from '../components/operations/ObjectiveRitual';
import MissionCard from '../components/operations/MissionCard';
import ScytheDisplay from '../components/scythe/ScytheDisplay';
import CommandCenter from '../components/command/CommandCenter';
import { motion } from 'framer-motion';
import { Shield, Lock, ChevronRight } from 'lucide-react';

export default function Operations({ onAddTask, onOpenTask, onCompleteTask }) {
  const tasks = useWarscytheStore(state => state.tasks);
  const scytheLevel = useWarscytheStore(state => state.scytheLevel);

  const evolutionStages = [
    { id: 'DORMANT', label: 'DORMANT' },
    { id: 'AWAKENED', label: 'AWAKENED' },
    { id: 'HARDENED', label: 'HARDENED' },
    { id: 'REFINED', label: 'REFINED' },
    { id: 'ASCENDED', label: 'ASCENDED' },
    { id: 'PLATINUM', label: 'PLATINUM' },
  ];

  return (
    <div className="elite-grid-container px-4">
      
      {/* 🛡️ LEFT COLUMN: ACTIVE OPERATIONS */}
      <section className="elite-left-col flex flex-col gap-4 relative">
        <div className="elite-panel flex-1">
          <div className="flex items-center gap-3 mb-8">
            <Shield size={14} className="text-gold-core" />
            <h2 className="text-white font-display text-xs tracking-[0.3em] uppercase">Active Operations</h2>
          </div>

          <div className="flex flex-col gap-6">
            <ObjectiveRitual onClick={onAddTask} />
            
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent my-4" />

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Missions in Progress</span>
                <span className="text-[10px] font-mono text-gold-core/60">{tasks.length} / 3</span>
              </div>
              
              <div className="flex flex-col gap-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                {tasks.map(task => (
                  <MissionCard key={task.id} task={task} onComplete={onCompleteTask} />
                ))}

                {tasks.length < 3 && (
                  <button
                    onClick={onAddTask}
                    className="w-full py-10 border border-dashed border-white/5 rounded-lg flex flex-col items-center justify-center gap-2 text-white/5 hover:border-white/10 hover:text-white/20 transition-all group bg-white/[0.005]"
                  >
                    <span className="text-[9px] font-mono tracking-[0.4em] uppercase font-bold">+ Initiate New Strike</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <button className="w-full py-5 elite-panel hover:bg-white/[0.05] transition-colors group">
          <div className="flex items-center justify-center gap-4">
            <div className="w-2 h-2 rounded-full border border-gold-core/40" />
            <span className="text-gold-core font-mono text-[9px] tracking-[0.5em] uppercase group-hover:text-gold-bright">
              Recalculate Protocol
            </span>
            <div className="w-2 h-2 rounded-full border border-gold-core/40" />
          </div>
          <p className="text-[8px] font-mono text-gray-700 mt-2 tracking-[0.2em] uppercase">Break it down. Focus. Execute.</p>
        </button>
        
        {/* Masterpiece Vignette */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10 rounded-b-lg" />
      </section>

      {/* 🗡️ CENTER COLUMN: THE REAPER'S SCYTHE */}
      <section className="elite-center-col elite-panel relative overflow-hidden flex flex-row !p-0">
        <div className="absolute inset-0 bg-gradient-to-t from-gold-core/[0.03] to-transparent pointer-events-none" />
        
        {/* WEAPON EVOLUTION SIDEBAR */}
        <div className="w-44 h-full shrink-0 border-r border-white/5 flex flex-col gap-2 py-8 px-6 z-20">
           <div className="mb-6">
              <span className="text-[8px] font-mono text-gray-600 tracking-widest uppercase block mb-1">Weapon Evolution</span>
              <h4 className="text-white font-display text-[10px] tracking-[0.2em] uppercase">Reaper's Scythe</h4>
           </div>
           
           <div className="flex flex-col gap-2">
              {evolutionStages.map((stage) => {
                const isActive = scytheLevel === stage.id;
                return (
                  <div key={stage.id} className={`flex items-center gap-3 p-3 rounded-sm transition-all border ${isActive ? 'bg-gold-core/10 border-gold-core/30 shadow-[0_0_15px_rgba(197,160,89,0.1)]' : 'bg-transparent border-transparent opacity-20'}`}>
                    <div className={`w-7 h-7 rounded-sm border flex items-center justify-center ${isActive ? 'border-gold-core/60 text-gold-core' : 'border-white/10 text-white/20'}`}>
                       {isActive ? <Shield size={12} /> : <Lock size={10} />}
                    </div>
                    <div className="flex flex-col">
                       <span className={`text-[9px] font-display tracking-[0.2em] ${isActive ? 'text-white' : 'text-gray-600'}`}>{stage.label}</span>
                       <span className="text-[7px] font-mono text-gray-500 uppercase">{isActive ? 'CURRENT' : '0 PWR'}</span>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* SCYTHE DISPLAY AREA */}
        <div className="flex-1 relative z-10 h-full">
           <ScytheDisplay level={scytheLevel} />
        </div>

        {/* Masterpiece Vignette */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-20" />
      </section>

      {/* 📊 RIGHT COLUMN: COMMAND CENTER */}
      <aside className="elite-right-col h-full relative">
         <CommandCenter />
         {/* Masterpiece Vignette */}
         <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10 rounded-b-lg" />
      </aside>

    </div>
  );
}
