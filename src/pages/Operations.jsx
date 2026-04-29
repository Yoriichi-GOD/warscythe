import React from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import ObjectiveRitual from '../components/operations/ObjectiveRitual';
import MissionCard from '../components/operations/MissionCard';
import ScytheDisplay from '../components/scythe/ScytheDisplay';
import { motion } from 'framer-motion';

export default function Operations({ onAddTask, onOpenTask, onCompleteTask }) {
  const tasks = useWarscytheStore(state => state.tasks);
  const scytheLevel = useWarscytheStore(state => state.scytheLevel);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr_400px] gap-8 h-full">
      
      {/* LEFT: MISSION CONTROL */}
      <aside className="flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-gold-core font-mono text-xs tracking-[0.3em] font-black">ACTIVE OPERATIONS</h2>
          <span className="text-[10px] text-gray-600 font-mono">{tasks.length} / 5 SLOTS</span>
        </div>
        
        {tasks.map(task => (
          <MissionCard key={task.id} task={task} onComplete={onCompleteTask} />
        ))}

        {tasks.length < 5 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddTask}
            className="w-full py-8 border-2 border-dashed border-gold-core/10 rounded-xl flex flex-col items-center gap-3 text-gold-core/40 hover:border-gold-core/30 hover:text-gold-core/60 transition-all group"
          >
            <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center text-xl">+</div>
            <span className="text-[10px] font-mono tracking-widest uppercase">Draft New Mission</span>
          </motion.button>
        )}
      </aside>

      {/* CENTER: THE RITUAL ZONE */}
      <section className="flex flex-col items-center justify-center">
        <ObjectiveRitual onClick={onAddTask} />
      </section>

      {/* RIGHT: THE SCYTHE EVOLUTION */}
      <aside className="flex flex-col items-center justify-center">
        <ScytheDisplay level={scytheLevel} />
      </aside>

    </div>
  );
}
