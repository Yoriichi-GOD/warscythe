import React from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import ObjectiveRitual from '../components/operations/ObjectiveRitual';
import MissionCard from '../components/operations/MissionCard';
import ScytheDisplay from '../components/scythe/ScytheDisplay';
import CommandCenter from '../components/command/CommandCenter';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';

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
      <section className="elite-left-col flex flex-col gap-4">
        <div className="elite-panel">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={14} className="text-gold-core" />
            <h2 className="text-white font-display text-xs tracking-[0.2em] uppercase">Active Operations</h2>
          </div>

          <div className="flex flex-col gap-6">
            <ObjectiveRitual onClick={onAddTask} />
            
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Missions in Progress</span>
                <span className="text-[10px] font-mono text-gold-core/60">{tasks.length} / 3</span>
              </div>
              
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {tasks.map(task => (
                  <MissionCard key={task.id} task={task} onComplete={onCompleteTask} />
                ))}

                {tasks.length < 3 && (
                  <button
                    onClick={onAddTask}
                    className="w-full py-8 border border-dashed border-white/5 rounded-lg flex flex-col items-center justify-center gap-2 text-white/10 hover:border-white/20 hover:text-white/30 transition-all group bg-white/[0.01]"
                  >
                    <span className="text-[9px] font-mono tracking-[0.3em] uppercase">+ Draft New Objective</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <button className="w-full py-4 elite-panel hover:bg-white/[0.05] transition-colors group">
          <span className="text-gold-core font-mono text-[9px] tracking-[0.4em] uppercase group-hover:text-gold-bright">
            Recalculate Protocol
          </span>
          <p className="text-[8px] font-mono text-gray-600 mt-1 uppercase">Break it down. Focus. Execute.</p>
        </button>
      </section>

      {/* 🗡️ CENTER COLUMN: THE REAPER'S SCYTHE */}
      <section className="elite-center-col elite-panel relative overflow-hidden flex flex-row">
        <div className="absolute inset-0 bg-gradient-to-t from-gold-core/5 to-transparent pointer-events-none" />
        
        {/* WEAPON EVOLUTION SIDEBAR */}
        <div className="w-48 h-full shrink-0 border-r border-white/5 pr-6 flex flex-col gap-4 py-4 z-10">
           <div className="mb-4">
              <span className="text-[8px] font-mono text-gray-600 tracking-widest uppercase block mb-1">Weapon Evolution</span>
              <h4 className="text-white font-display text-[10px] tracking-[0.2em] uppercase">The Reaper's Scythe</h4>
           </div>
           
           <div className="flex flex-col gap-3">
              {evolutionStages.map((stage) => {
                const isActive = scytheLevel === stage.id;
                return (
                  <div key={stage.id} className={`flex items-center gap-3 p-3 rounded border transition-all ${isActive ? 'bg-gold-core/10 border-gold-core/40' : 'bg-transparent border-transparent opacity-30'}`}>
                    <div className={`w-8 h-8 rounded border flex items-center justify-center ${isActive ? 'border-gold-core text-gold-core' : 'border-white/10 text-white/20'}`}>
                       {isActive ? <Shield size={14} /> : <Lock size={12} />}
                    </div>
                    <div className="flex flex-col">
                       <span className={`text-[10px] font-display tracking-widest ${isActive ? 'text-white' : 'text-gray-600'}`}>{stage.label}</span>
                       <span className="text-[7px] font-mono text-gray-500 uppercase">{isActive ? 'CURRENT' : '0 / 0 PWR'}</span>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* SCYTHE DISPLAY */}
        <div className="flex-1 relative z-10 flex flex-col h-full pl-6">
          <div className="flex-1">
             <ScytheDisplay level={scytheLevel} />
          </div>
        </div>
      </section>

      {/* 📊 RIGHT COLUMN: COMMAND CENTER */}
      <aside className="elite-right-col h-full">
         <CommandCenter />
      </aside>

    </div>
  );
}
