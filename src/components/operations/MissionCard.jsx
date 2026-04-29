import { motion } from "framer-motion";
import { Timer, Zap, Flame } from "lucide-react";

export default function MissionCard({ task, onComplete }) {
  const progress = task.progress || 0;

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className="elite-panel p-5 relative group cursor-pointer overflow-hidden"
      onClick={() => onComplete(task.id)}
    >
      <div className="flex items-center gap-6">
        {/* ICON CIRCLE */}
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 border border-gold-core/20 rounded-full group-hover:border-gold-core/40 transition-colors" />
          <div className="absolute inset-2 border border-gold-core/10 rounded-full border-dashed animate-spin-slow" />
          <div className="z-10 text-gold-core">
            <Zap size={20} />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <h3 className="text-white font-display text-xs tracking-[0.2em] uppercase group-hover:text-gold-bright transition-colors">
              {task.title}
            </h3>
            <div className="flex items-center gap-2 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
              <Timer size={10} />
              <span>{task.time || 15} MINUTE STRIKE</span>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full h-[3px] bg-white/5 rounded-full mt-2 relative overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-core/40 to-gold-bright shadow-[0_0_10px_rgba(197,160,89,0.5)]"
             />
          </div>
          <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-[0.2em]">
             <span className="text-gray-600">{progress}% COMPLETE</span>
             <span className="text-gold-core/60">EST. {task.effort || 'MEDIUM'}</span>
          </div>
        </div>

        {/* FLAME ICON */}
        <div className="shrink-0 text-gold-core/40 group-hover:text-gold-core transition-colors">
           <Flame size={20} fill="currentColor" className="opacity-20 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* AMBIENT GLITCH LINE */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-core/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
