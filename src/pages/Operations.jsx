import React from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import ObjectiveRitual from '../components/operations/ObjectiveRitual';
import MissionCard from '../components/operations/MissionCard';
import ScytheDisplay from '../components/scythe/ScytheDisplay';
import CommandCenter from '../components/command/CommandCenter';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function Operations({ onAddTask, onOpenTask, onCompleteTask }) {
  const tasks = useWarscytheStore(state => state.tasks);
  const scytheLevel = useWarscytheStore(state => state.scytheLevel);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full pb-20">
      
      {/* 🛡️ LEFT COLUMN: ACTIVE OPERATIONS */}
      <section className="w-full lg:w-[450px] flex flex-col gap-4 h-full shrink-0">
        <div className="bg-black/60 border border-white/5 rounded-lg p-6 flex-1 flex flex-col backdrop-blur-md">
          <div className="flex items-center gap-3 mb-8">
            <Zap size={16} className="text-gold-core" />
            <h2 className="text-gold-core font-mono text-xs tracking-[0.3em] font-black uppercase">Active Operations</h2>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="mb-12">
              <ObjectiveRitual onClick={onAddTask} />
            </div>

            <div className="mt-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Missions in Progress</span>
                <span className="text-[10px] font-mono text-gold-core/60">{tasks.length} / 3</span>
              </div>
              
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {tasks.map(task => (
                  <MissionCard key={task.id} task={task} onComplete={onCompleteTask} />
                ))}

                {tasks.length < 3 && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={onAddTask}
                    className="w-full py-6 border border-dashed border-white/10 rounded-lg flex items-center justify-center gap-3 text-white/20 hover:border-white/20 hover:text-white/40 transition-all group bg-white/[0.02]"
                  >
                    <span className="text-[10px] font-mono tracking-widest uppercase">Draft New Objective</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>

        <button className="w-full py-4 bg-white/[0.03] border border-white/5 rounded-lg text-gold-core font-mono text-[10px] tracking-widest uppercase hover:bg-white/[0.05] transition-colors">
          Recalculate Protocol
        </button>
      </section>

      {/* 🗡️ CENTER COLUMN: THE REAPER'S SCYTHE */}
      <section className="flex-1 min-w-[500px] bg-black/60 border border-white/10 rounded-lg p-8 flex flex-col backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gold-core/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex flex-col items-center gap-2 mb-12">
             <h2 className="text-white font-display text-lg tracking-[0.2em] uppercase">The Reaper's Scythe</h2>
             <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-core/40 to-transparent" />
          </div>

          <div className="flex-1">
             <ScytheDisplay level={scytheLevel} />
          </div>
        </div>
      </section>

      {/* 📊 RIGHT COLUMN: COMMAND CENTER */}
      <aside className="w-full lg:w-[380px] h-full shrink-0">
        <CommandCenter />
      </aside>

    </div>
  );
}
