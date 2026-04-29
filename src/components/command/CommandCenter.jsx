import React from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../../store/useWarscytheStore';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export default function CommandCenter() {
  const { xp, totalCompletions } = useWarscytheStore();

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center gap-3 mb-2">
        <Activity size={16} className="text-gold-core" />
        <h2 className="text-gold-core font-mono text-xs tracking-[0.3em] font-black uppercase">Command Center</h2>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/40 border border-white/5 p-4 rounded-lg backdrop-blur-md">
          <span className="text-[10px] font-mono text-gray-500 tracking-widest block mb-2 uppercase">Daily Completions</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display text-white">1</span>
            <div className="w-2 h-2 rounded-full bg-gold-core animate-pulse" />
          </div>
        </div>

        <div className="bg-black/40 border border-white/5 p-4 rounded-lg backdrop-blur-md relative overflow-hidden">
          <span className="text-[10px] font-mono text-gray-500 tracking-widest block mb-2 uppercase">Execution Ratio</span>
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/10" />
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-core" strokeDasharray="125" strokeDashoffset="25" />
            </svg>
            <span className="absolute text-[10px] font-mono text-white">80%</span>
          </div>
        </div>
      </div>

      {/* Scythe Preview Card */}
      <div className="bg-black/40 border border-white/5 p-6 rounded-lg backdrop-blur-md flex-1 flex flex-col items-center justify-center text-center relative group">
        <span className="text-[10px] font-mono text-gray-500 tracking-widest absolute top-6 left-6 uppercase">Ultimate Artifact</span>
        
        <div className="w-32 h-32 opacity-20 group-hover:opacity-40 transition-opacity">
           <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M 85,95 C 75,70 65,40 60,10 L 55,10 C 60,40 70,70 80,95 Z" fill="#fff" />
              <path d="M 60,15 C 30,5 5,30 5,60 C 15,40 35,25 55,25 Z" fill="#fff" />
           </svg>
        </div>
        
        <h4 className="text-gold-bright font-display text-sm tracking-widest mt-4 uppercase">Reaper's Scythe</h4>
        <p className="text-[9px] font-mono text-gray-600 mt-1 uppercase">Dormant Stage // 0 PWR</p>
      </div>

      {/* Completion Log */}
      <div className="bg-black/40 border border-white/5 p-6 rounded-lg backdrop-blur-md h-[300px] flex flex-col">
         <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Completion Log</span>
            <ShieldCheck size={12} className="text-gold-core opacity-50" />
         </div>
         <div className="flex-1 flex items-center justify-center">
            <p className="text-[10px] font-mono text-gray-600 tracking-widest text-center uppercase leading-relaxed">
              No operations completed yet.<br/>The log awaits your victories.
            </p>
         </div>
      </div>
    </div>
  );
}
