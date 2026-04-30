import React from 'react';
import { useWarscytheStore } from '../../store/useWarscytheStore';
import { Swords, History, Flame } from 'lucide-react';

export default function CommandCenter() {
  const { xp, totalCompletions, scytheLevel } = useWarscytheStore();

  return (
    <>
      {/* COMMAND CENTER HEADER */}
      <div className="elite-panel !pb-3 !pt-4">
        <div className="flex items-center gap-3 mb-5">
          <Swords size={14} className="text-gold-core" />
          <h2 className="text-white font-display text-xs tracking-[0.3em] uppercase">Command Center</h2>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 gap-3">
          {/* DAILY COMPLETIONS */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col items-center gap-2">
            <span className="text-[8px] font-mono text-gray-500 tracking-[0.25em] uppercase">Daily Completions</span>
            <div className="flex items-center gap-2">
              <Flame size={14} className="text-gold-core/50" />
              <span className="text-3xl font-display text-gold-bright leading-none">{totalCompletions || 0}</span>
            </div>
          </div>

          {/* EXECUTION RATIO */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col items-center gap-2">
            <div className="text-center">
              <span className="text-[8px] font-mono text-gray-500 tracking-[0.25em] uppercase block">Execution</span>
              <span className="text-[8px] font-mono text-gray-500 tracking-[0.25em] uppercase block">Ratio</span>
            </div>
            <div className="relative w-14 h-14 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
                 <circle cx="28" cy="28" r="23" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/5" />
                 <circle cx="28" cy="28" r="23" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-core" strokeDasharray="144.5" strokeDashoffset="144.5" />
               </svg>
               <span className="absolute text-[10px] font-mono text-white font-bold">0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ULTIMATE ARTIFACT */}
      <div className="elite-panel flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[8px] font-mono text-gold-core tracking-[0.25em] uppercase font-bold">Ultimate Artifact</span>
        </div>
        <h4 className="text-white font-display text-[11px] tracking-[0.2em] uppercase mb-4">Reaper's Scythe</h4>
        
        <div className="flex-1 flex items-center justify-center relative">
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-40 h-40 rounded-full bg-gold-core/5 blur-[60px]" />
           </div>
           <img 
             src={`/scythe/${scytheLevel}.png`} 
             alt="Scythe Preview" 
             className="max-h-[180px] object-contain opacity-50 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
             onError={(e) => { e.target.src = '/scythe/DORMANT.png'; }}
           />
        </div>
        
        <div className="border-t border-white/5 pt-3 mt-3 text-right">
           <p className="text-white font-display text-[10px] tracking-[0.2em] uppercase">{scytheLevel} Scythe</p>
           <p className="text-[7px] font-mono text-gray-600 mt-0.5 uppercase tracking-widest">0 PWR</p>
        </div>
      </div>

      {/* COMPLETION LOG */}
      <div className="elite-panel">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-[8px] font-mono text-gold-core tracking-[0.25em] uppercase font-bold block">Recent Intel</span>
            <h4 className="text-white font-display text-[11px] tracking-[0.2em] uppercase mt-0.5">Completion Log</h4>
          </div>
          <History size={14} className="text-gold-core/40" />
        </div>
        
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent mb-4" />
        
        <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-30 py-4">
          <p className="text-[9px] font-mono text-gray-500 tracking-[0.2em] text-center uppercase leading-relaxed">
            No operations completed yet.<br/>The log awaits your victories.
          </p>
        </div>
      </div>
    </>
  );
}
