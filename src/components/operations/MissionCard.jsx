import { motion } from "framer-motion";
import { Flame, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

export default function MissionCard({ task, onOpen }) {
  const progress = task.progress || 0;
  const priorityColor = task.priority === 'high' ? '#ef4444'
    : task.priority === 'medium' ? '#f1c40f'
      : task.priority === 'low' ? '#2ecc71'
        : 'var(--color-gold-core)';
  
  const [timeLeft, setTimeLeft] = useState({ value: "---", unit: "NO LIMIT" });

  useEffect(() => {
    const calculateTime = () => {
      if (!task.deadline) {
        setTimeLeft({ value: "---", unit: "ANYTIME" });
        return;
      }
      const deadline = new Date(task.deadline);
      const now = new Date();
      const diffMs = deadline - now;
      
      if (diffMs <= 0) {
        setTimeLeft({ value: "00", unit: "OVERDUE" });
        return;
      }
      
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      if (diffDays > 0) {
        setTimeLeft({ value: diffDays.toString(), unit: diffDays === 1 ? 'DAY' : 'DAYS' });
      } else if (diffHours > 0) {
        setTimeLeft({ value: diffHours.toString(), unit: diffHours === 1 ? 'HR' : 'HRS' });
      } else {
        setTimeLeft({ value: diffMins.toString(), unit: 'MIN' });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, [task.deadline]);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="relative group cursor-pointer rounded-xl border border-gold-core/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all overflow-hidden"
      onClick={() => onOpen(task.id)}
    >
      <div className="flex items-center gap-4 p-4">
        
        {/* EMBLEM WITH DYNAMIC PRIORITY COLOR */}
        <div className={`hidden md:flex w-12 h-12 shrink-0 rounded-full border items-center justify-center ${
          task.priority === 'high' ? 'border-red-500/30 bg-red-500/5' :
          task.priority === 'medium' ? 'border-yellow-500/30 bg-yellow-500/5' :
          task.priority === 'low' ? 'border-green-500/30 bg-green-500/5' :
          'border-gold-core/30 bg-gold-core/5'
        }`}>
          <Flame size={18} className={
            task.priority === 'high' ? 'text-red-500' :
            task.priority === 'medium' ? 'text-yellow-500' :
            task.priority === 'low' ? 'text-green-500' :
            'text-gold-core'
          } />
        </div>

        {/* CIRCULAR TIMER */}
        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/5" />
            <circle cx="28" cy="28" r="24" fill="none" stroke={priorityColor} strokeWidth="2.5"
              strokeDasharray={`${150.8 * (progress / 100)} 150.8`}
              style={{ filter: `drop-shadow(0 0 4px ${priorityColor})` }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-white font-mono text-[11px] font-bold leading-none">{timeLeft.value}</span>
            <span className="text-[6px] font-mono text-gray-500 uppercase tracking-wider">{timeLeft.unit}</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          <h3 className="text-white font-display text-[11px] md:text-[10px] tracking-[0.15em] md:tracking-[0.2em] uppercase truncate group-hover:text-gold-bright transition-colors">
            {task.title}
          </h3>
          <span className="hidden md:block text-[8px] font-mono text-gray-500 uppercase tracking-widest">{task.category || 'Strategic'} Strike</span>
          <div className="hidden md:flex items-center gap-2 mt-0.5">
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

        {/* FLAME + MENU WITH DYNAMIC PRIORITY COLOR */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Flame 
            size={20} 
            className={`hidden md:block ${
              task.priority === 'high' ? 'text-red-500' :
              task.priority === 'medium' ? 'text-yellow-500' :
              task.priority === 'low' ? 'text-green-500' :
              'text-gold-core'
            }`}
            style={{
              filter: `drop-shadow(0 0 8px ${
                task.priority === 'high' ? 'rgba(231, 76, 60, 0.4)' :
                task.priority === 'medium' ? 'rgba(241, 196, 15, 0.4)' :
                task.priority === 'low' ? 'rgba(46, 204, 113, 0.4)' :
                'rgba(197, 160, 89, 0.4)'
              })`
            }} 
            fill="currentColor" 
          />
          <button className="w-6 h-6 flex items-center justify-center rounded text-gray-600 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); onOpen(task.id); }}>
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
