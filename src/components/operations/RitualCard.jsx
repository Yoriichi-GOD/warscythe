import React from "react";
import { motion } from "framer-motion";
import { Flame, CheckCircle2, Circle, Clock } from "lucide-react";

export default function RitualCard({ ritual, onComplete, onOpen }) {
  const today = new Date().toISOString().slice(0, 10);
  const isCompletedToday = ritual.lastCompletedAt && ritual.lastCompletedAt.slice(0, 10) === today;

  const effortLabels = {
    Low: 'RECON',
    Medium: 'SKIRMISH',
    High: 'ASSAULT',
    Boss: 'BOSS RAID'
  };

  return (
    <motion.div
      id={`ritual-${ritual.id}`}
      data-ritual-id={ritual.id}
      whileHover={!isCompletedToday ? { scale: 1.01 } : {}}
      className={`relative group cursor-pointer shrink-0 rounded-xl border transition-all overflow-hidden ${
        isCompletedToday 
          ? 'border-gold-core/20 bg-gold-core/[0.02] opacity-60' 
          : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
      }`}
      onClick={() => onOpen(ritual.id)}
    >
      <div className="ritual-card-inner flex items-center gap-4 p-4">
        
        {/* CHECKBOX / STATUS INDICATOR */}
        <button
          type="button"
          className="shrink-0 flex items-center justify-center"
          onClick={(event) => {
            event.stopPropagation();
            if (!isCompletedToday) onComplete(ritual.id);
          }}
          aria-label={isCompletedToday ? `${ritual.title} completed today` : `Complete ${ritual.title}`}
        >
          {isCompletedToday ? (
            <CheckCircle2 size={20} className="text-gold-core" />
          ) : (
            <Circle size={20} className="text-gray-600 group-hover:text-gold-core transition-colors" />
          )}
        </button>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <h3 className={`font-display text-[10px] tracking-[0.2em] uppercase truncate transition-colors ${
            isCompletedToday ? 'text-gold-core line-through' : 'text-white group-hover:text-gold-bright'
          }`}>
            {ritual.title}
          </h3>
          <div className="ritual-card-meta flex items-center gap-3">
            <span className="text-[7px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <span className="ritual-card-desktop-meta">{ritual.frequency} // {effortLabels[ritual.effort] || ritual.effort}</span>
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

        {/* COMPLETION ACTION */}
        <div className="ritual-card-actions flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
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
        </div>
      </div>
    </motion.div>
  );
}
