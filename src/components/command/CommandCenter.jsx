import React from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../../store/useWarscytheStore';
import { ShieldCheck, Zap, History, Trophy, Activity } from 'lucide-react';

export default function CommandCenter() {
  const { xp, totalCompletions, scytheLevel } = useWarscytheStore();

  return (
    <div className="flex flex-col gap-4 h-full relative">
      {/* 📊 COMMAND CENTER HEADER */}
      <div className="flex items-center gap-3 mb-4 px-2">
        <Activity size={14} className="text-gold-core" />
        <h2 className="text-white font-display text-xs tracking-[0.3em] uppercase">Command Center</h2>
      </div>

      {/* 🔢 TOP STATS GRID (Masterpiece Tall Cards) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="elite-panel p-6 flex flex-col items-center justify-center gap-3 relative overflow-hidden group min-h-[160px]">
          <div className="absolute top-3 left-3 opacity-20 text-gold-core">
            <div className="w-1.5 h-1.5 rounded-full bg-current" />
          </div>
          <span className="text-[9px] font-mono text-gray-500 tracking-[0.3em] uppercase">Daily Completions</span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-display text-gold-bright">{totalCompletions || 0}</span>
            <Trophy size={16} className="text-gold-core/40 mb-1" />
          </div>
        </div>

        <div className="elite-panel p-6 flex flex-col items-center justify-center gap-3 relative overflow-hidden group min-h-[160px]">
          <div className="absolute top-3 left-3 opacity-20 text-gold-core">
            <div className="w-1.5 h-1.5 rounded-full bg-current" />
          </div>
          <span className="text-[9px] font-mono text-gray-500 tracking-[0.3em] uppercase">Execution Ratio</span>
          <div className="relative w-20 h-20 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/5" />
               <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gold-core" strokeDasharray="213" strokeDashoffset="50" />
             </svg>
             <span className="absolute text-xs font-mono text-white">80%</span>
          </div>
        </div>
      </div>

      {/* 🗡️ ULTIMATE ARTIFACT CARD (Prominent) */}
      <div className="elite-panel p-8 flex flex-col items-center justify-center text-center relative group min-h-[280px]">
        <div className="absolute top-8 left-8 flex flex-col items-start gap-1">
          <span className="text-[9px] font-mono text-gray-600 tracking-widest uppercase">Ultimate Artifact</span>
          <h4 className="text-white font-display text-[11px] tracking-[0.3em] uppercase">Reaper's Scythe</h4>
        </div>
        
        <div className="relative w-48 h-48 mt-4 flex items-center justify-center">
           <div className="absolute inset-0 bg-gold-core/10 blur-[80px] rounded-full" />
           <img 
             src={`/scythe/${scytheLevel}.png`} 
             alt="Scythe Preview" 
             className="w-full h-full object-contain filter drop-shadow-[0_15px_40px_rgba(0,0,0,0.8)] opacity-40 group-hover:opacity-80 transition-all scale-[1.2]"
             onError={(e) => { e.target.src = '/scythe/DORMANT.png'; }}
           />
        </div>
        
        <div className="absolute bottom-8 right-8 text-right">
           <p className="text-gold-bright font-display text-[10px] tracking-widest uppercase">{scytheLevel} SCYTHE</p>
           <p className="text-[8px] font-mono text-gray-600 mt-1 uppercase">0 PWR</p>
        </div>
      </div>

      {/* 📜 RECENT INTEL / LOG */}
      <div className="elite-panel p-6 flex-1 flex flex-col">
         <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-gray-600 tracking-widest uppercase">Recent Intel</span>
              <h4 className="text-white font-display text-[11px] tracking-[0.3em] uppercase">Completion Log</h4>
            </div>
            <History size={14} className="text-gold-core opacity-50" />
         </div>
         
         <div className="flex-1 flex flex-col items-center justify-center gap-6 opacity-30">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <p className="text-[10px] font-mono text-gray-500 tracking-[0.3em] text-center uppercase leading-[2.5]">
              No operations completed yet.<br/>The log awaits your victories.
            </p>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
         </div>
      </div>
    </div>
  );
}
