import { motion } from "framer-motion";
import { Flame, MoreHorizontal } from "lucide-react";

export default function MissionCard({ task, onComplete }) {
  const progress = task.progress || 0;
  const timeLeft = task.timeLeft || "15:00";

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="relative group cursor-pointer rounded-xl border border-gold-core/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all overflow-hidden"
      onClick={() => onComplete(task.id)}
    >
      <div className="flex items-center gap-4 p-4">
        
        {/* GOLDEN EMBLEM */}
        <div className="w-12 h-12 shrink-0 rounded-full border border-gold-core/30 bg-gold-core/5 flex items-center justify-center">
          <Flame size={18} className="text-gold-core" />
        </div>

        {/* CIRCULAR TIMER */}
        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/5" />
            <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-core" 
              strokeDasharray={`${150.8 * (progress / 100)} 150.8`}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-white font-mono text-[11px] font-bold leading-none">{timeLeft.split(':')[0]}:{timeLeft.split(':')[1] || '00'}</span>
            <span className="text-[6px] font-mono text-gray-500 uppercase tracking-wider">Remaining</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          <h3 className="text-white font-display text-[10px] tracking-[0.2em] uppercase truncate group-hover:text-gold-bright transition-colors">
            {task.title}
          </h3>
          <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">15 Minute Strike</span>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-gold-core/40 to-gold-bright"
              />
            </div>
            <span className="text-[7px] font-mono text-gray-500 uppercase shrink-0">{progress}% Complete</span>
          </div>
        </div>

        {/* GOLDEN FLAME + MENU */}
        <div className="flex items-center gap-2 shrink-0">
          <Flame size={20} className="text-gold-core drop-shadow-[0_0_8px_rgba(197,160,89,0.4)]" fill="currentColor" />
          <button className="w-6 h-6 flex items-center justify-center rounded text-gray-600 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
