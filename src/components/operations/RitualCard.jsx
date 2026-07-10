import React from "react";
import { motion } from "framer-motion";
import { Flame, Trash2, CheckCircle2, Circle, Clock } from "lucide-react";
import { useWarscytheStore } from "../../store/useWarscytheStore";

export default function RitualCard({ ritual, onComplete }) {
  const deleteRitual = useWarscytheStore(state => state.deleteRitual);
  const today = new Date().toISOString().slice(0, 10);
  const isCompletedToday = ritual.lastCompletedAt && ritual.lastCompletedAt.slice(0, 10) === today;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to discard the ritual "${ritual.title}"?`)) {
      deleteRitual(ritual.id);
    }
  };

  const effortLabels = {
    Low: 'RECON',
    Medium: 'SKIRMISH',
    High: 'ASSAULT',
    Boss: 'BOSS RAID'
  };

  return (
    <motion.div
      whileHover={!isCompletedToday ? { scale: 1.01 } : {}}
      className={`relative group cursor-pointer rounded-xl border transition-all overflow-hidden ${
        isCompletedToday 
          ? 'border-gold-core/20 bg-gold-core/[0.02] opacity-60' 
          : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
      }`}
      onClick={() => !isCompletedToday && onComplete(ritual.id)}
    >
      <div className="flex items-center gap-4 p-4">
        
        {/* CHECKBOX / STATUS INDICATOR */}
        <div className="shrink-0 flex items-center justify-center">
          {isCompletedToday ? (
            <CheckCircle2 size={20} className="text-gold-core" />
          ) : (
            <Circle size={20} className="text-gray-600 group-hover:text-gold-core transition-colors" />
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <h3 className={`font-display text-[10px] tracking-[0.2em] uppercase truncate transition-colors ${
            isCompletedToday ? 'text-gold-core line-through' : 'text-white group-hover:text-gold-bright'
          }`}>
            {ritual.title}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-[7px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              {ritual.frequency} // {effortLabels[ritual.effort] || ritual.effort}
              {ritual.targetTime && (
                <>
                  <span className="text-white/10">//</span>
                  <span className="flex items-center gap-0.5 text-gold-core/70 font-bold">
                    <Clock size={8} /> {ritual.targetTime}
                  </span>
                </>
              )}
            </span>
            {ritual.streak > 0 && (
              <span className="flex items-center gap-0.5 text-[8px] font-mono text-gold-core font-bold uppercase tracking-wider">
                <Flame size={10} fill="currentColor" /> {ritual.streak} STREAK
              </span>
            )}
          </div>
        </div>

        {/* ACTION / DELETE */}
        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
          {isCompletedToday ? (
            <span className="text-[8px] font-mono text-gold-core/60 uppercase tracking-wider font-bold">
              CONQUERED
            </span>
          ) : (
            <button 
              onClick={() => onComplete(ritual.id)}
              className="px-3 py-1.5 rounded border border-gold-core/30 bg-gold-core/5 text-gold-core text-[8px] font-mono tracking-widest uppercase hover:bg-gold-core hover:text-black transition-all"
            >
              CONQUER
            </button>
          )}
          <button 
            onClick={handleDelete}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:text-red-core hover:bg-red-core/5 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
