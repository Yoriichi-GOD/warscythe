import React from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../../store/useWarscytheStore';
import { ShieldCheck, Zap, History, Trophy } from 'lucide-react';

export default function CommandCenter() {
  const { xp, totalCompletions, scytheLevel } = useWarscytheStore();

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* 📊 COMMAND CENTER HEADER */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Zap size={14} className="text-gold-core" />
          <h2 className="text-white font-display text-xs tracking-[0.2em] uppercase">Command Center</h2>
        </div>
      </div>

      {/* 🔢 TOP STATS GRID */}
      <div className="grid grid-cols-2 gap-3">
        <div className="elite-panel p-4 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
            <Trophy size={32} />
          </div>
          <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-gold-core" />
            Daily Completions
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-display text-gold-bright">{totalCompletions || 0}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-gold-core animate-pulse" />
          </div>
        </div>

        <div className="elite-panel p-4 flex flex-col gap-2 relative overflow-hidden group">
          <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-gold-core" />
            Execution Ratio
          </span>
          <div className="flex items-center justify-center mt-2">
             <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-core" strokeDasharray="175" strokeDashoffset="40" />
                </svg>
                <span className="absolute text-[11px] font-mono text-white">80%</span>
             </div>
          </div>
        </div>
      </div>

      {/* 🗡️ ULTIMATE ARTIFACT CARD */}
      <div className="elite-panel p-6 flex flex-col items-center justify-center text-center relative group min-h-[220px]">
        <div className="absolute top-6 left-6 flex flex-col items-start gap-1">
          <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">Ultimate Artifact</span>
          <h4 className="text-white font-display text-[10px] tracking-[0.2em] uppercase">Reaper's Scythe</h4>
        </div>
        
        <div className="relative w-40 h-40 mt-4 flex items-center justify-center">
           <div className="absolute inset-0 bg-gold-core/5 blur-3xl rounded-full" />
           <img 
             src={`/scythe/${scytheLevel}.png`} 
             alt="Scythe Preview" 
             className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] opacity-60 group-hover:opacity-90 transition-all"
             onError={(e) => { e.target.src = '/scythe/DORMANT.png'; }}
           />
        </div>
        
        <div className="absolute bottom-6 right-6 text-right">
           <p className="text-white font-display text-[9px] tracking-widest uppercase">{scytheLevel} SCYTHE</p>
           <p className="text-[8px] font-mono text-gray-600 mt-1 uppercase">0 PWR</p>
        </div>
      </div>

      {/* 📜 RECENT INTEL / LOG */}
      <div className="elite-panel p-5 flex-1 flex flex-col">
         <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">Recent Intel</span>
              <h4 className="text-white font-display text-[10px] tracking-[0.2em] uppercase">Completion Log</h4>
            </div>
            <History size={14} className="text-gold-core opacity-50" />
         </div>
         
         <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-40">
            <div className="w-12 h-[1px] bg-white/10" />
            <p className="text-[9px] font-mono text-gray-500 tracking-[0.2em] text-center uppercase leading-loose">
              No operations completed yet.<br/>The log awaits your victories.
            </p>
            <div className="w-12 h-[1px] bg-white/10" />
         </div>
      </div>
    </div>
  );
}
