import React from 'react';
import { useWarscytheStore } from '../../store/useWarscytheStore';
import { Swords, History, Flame } from 'lucide-react';

export default function CommandCenter() {
  const { xp, totalCompletions, scytheLevel } = useWarscytheStore();

  return (
    <div className="flex flex-col gap-4 h-full relative">
      {/* 📊 COMMAND CENTER HEADER */}
      <div className="flex items-center gap-3 mb-2 px-2">
        <Swords size={14} className="text-gold-core" />
        <h2 className="text-white font-display text-xs tracking-[0.3em] uppercase">Command Center</h2>
      </div>

      {/* 🔢 STATS GRID */}
      <div className="grid grid-cols-2 gap-3">
        <div className="elite-panel p-4 flex flex-col items-center justify-center gap-2">
          <span className="text-[8px] font-mono text-gray-500 tracking-[0.3em] uppercase">Daily Completions</span>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-display text-gold-bright leading-none">{totalCompletions || 0}</span>
            <Flame size={12} className="text-gold-core/40" />
          </div>
        </div>

        <div className="elite-panel p-4 flex flex-col items-center justify-center gap-1 text-center">
           <span className="text-[8px] font-mono text-gray-500 tracking-[0.3em] uppercase block">Execution</span>
           <span className="text-[8px] font-mono text-gray-500 tracking-[0.3em] uppercase block">Ratio</span>
           <div className="relative w-12 h-12 mt-1">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/5" />
               <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gold-core" strokeDasharray="125" strokeDashoffset="125" />
             </svg>
             <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-white">0%</span>
           </div>
        </div>
      </div>

      {/* 🗡️ ULTIMATE ARTIFACT (Locked/Foggy Version) */}
      <div className="elite-panel p-6 flex flex-col items-center justify-center text-center relative group min-h-[220px]">
        <div className="absolute top-6 left-6 flex flex-col items-start gap-1">
          <span className="text-[8px] font-mono text-gold-core/60 tracking-widest uppercase font-bold">Ultimate Artifact</span>
          <h4 className="text-white font-display text-[10px] tracking-[0.2em] uppercase">Reaper's Scythe</h4>
        </div>
        
        <div className="relative w-40 h-40 mt-4 flex items-center justify-center">
           <img 
             src={`/scythe/${scytheLevel}.png`} 
             alt="Locked Scythe" 
             className="w-full h-full object-contain opacity-20 blur-[1px] grayscale group-hover:opacity-40 transition-all scale-[1.2]"
             onError={(e) => { e.target.src = '/scythe/DORMANT.png'; }}
           />
           {/* Foggy Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/40 to-transparent pointer-events-none" />
        </div>
        
        <div className="absolute bottom-6 right-6 text-right">
           <p className="text-white font-display text-[9px] tracking-widest uppercase">{scytheLevel} SCYTHE</p>
           <p className="text-[7px] font-mono text-gray-600 mt-1 uppercase">0 PWR</p>
        </div>
      </div>

      {/* 📜 RECENT INTEL */}
      <div className="elite-panel p-5 flex-1 flex flex-col">
         <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono text-gold-core/60 tracking-widest uppercase font-bold">Recent Intel</span>
              <h4 className="text-white font-display text-[10px] tracking-[0.3em] uppercase">Completion Log</h4>
            </div>
            <History size={14} className="text-gold-core/30" />
         </div>
         <div className="h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent mb-4" />
         <div className="flex-1 flex flex-col items-center justify-center gap-6 opacity-30">
            <p className="text-[10px] font-mono text-gray-500 tracking-[0.3em] text-center uppercase leading-relaxed">
              No operations completed yet.<br/>The log awaits your victories.
            </p>
         </div>
      </div>
    </div>
  );
}
