import { motion } from "framer-motion";
import { Timer, Zap, Flame, Shield, Target, Swords, Skull } from "lucide-react";

export default function MissionCard({ task, onComplete }) {
  const progress = task.progress || 0;

  const getBadge = (effort) => {
    switch(effort) {
      case 'High': return <Swords size={18} />;
      case 'Boss': return <Skull size={18} />;
      case 'Low': return <Target size={18} />;
      default: return <Shield size={18} />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, x: 4 }}
      className="elite-panel p-5 relative group cursor-pointer overflow-hidden border-l-2 border-l-transparent hover:border-l-gold-core transition-all bg-black/40"
      onClick={() => onComplete(task.id)}
    >
      <div className="flex items-center gap-6">
        {/* TACTICAL BADGE */}
        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 border border-gold-core/20 rounded rotate-45 group-hover:border-gold-core/40 transition-colors" />
          <div className="z-10 text-gold-core opacity-60 group-hover:opacity-100 transition-opacity">
            {getBadge(task.effort)}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between items-baseline">
            <h3 className="text-white font-display text-[10px] tracking-[0.2em] uppercase group-hover:text-gold-bright transition-colors">
              {task.title}
            </h3>
            <div className="flex items-center gap-2 text-[8px] font-mono text-gray-500 uppercase tracking-widest">
              <Timer size={10} />
              <span>{task.time || 15}m Strike</span>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full h-[2px] bg-white/5 rounded-full mt-2 relative overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-core/20 to-gold-bright shadow-[0_0_10px_rgba(197,160,89,0.3)]"
             />
          </div>
          <div className="flex justify-between items-center text-[7px] font-mono uppercase tracking-[0.2em] mt-1">
             <span className="text-gray-600 font-bold">{progress}% DECRYPTED</span>
             <span className="text-gold-core/40">{task.effort || 'MEDIUM'} INTEL</span>
          </div>
        </div>

        {/* FLAME INDICATOR */}
        <div className="shrink-0 text-gold-core/20 group-hover:text-gold-core transition-all">
           <Flame size={16} fill="currentColor" className="opacity-10 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* AMBIENT GLOW */}
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gold-core/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
