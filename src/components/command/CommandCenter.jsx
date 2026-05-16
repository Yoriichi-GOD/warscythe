import React from 'react';
import { useWarscytheStore } from '../../store/useWarscytheStore';
import { Swords, History, Flame } from 'lucide-react';

export default function CommandCenter() {
  const { xp, totalCompletions, scytheLevel, completedTasks = [], abandonedTasks = [], streakCount = 0 } = useWarscytheStore();

  const cTasks = Array.isArray(completedTasks) ? completedTasks : [];
  const aTasks = Array.isArray(abandonedTasks) ? abandonedTasks : [];

  const totalAttempted = cTasks.length + aTasks.length;
  const executionRatio = totalAttempted === 0 ? 0 : Math.round((cTasks.length / totalAttempted) * 100);
  const dashOffset = 125 - (125 * executionRatio) / 100;

  const allLogs = [
    ...cTasks.map(t => ({...t, status: 'CONQUERED'})), 
    ...aTasks.map(t => ({...t, status: 'ABANDONED'}))
  ]
    .sort((a, b) => {
      const dateA = new Date(a.completedAt || a.abandonedAt || 0);
      const dateB = new Date(b.completedAt || b.abandonedAt || 0);
      return dateB - dateA;
    })
    .slice(0, 10);

  const streakTiers = [
    { days: 5, name: 'NEOPHYTE' },
    { days: 15, name: 'ACOLYTE' },
    { days: 30, name: 'REAPER' },
    { days: 60, name: 'EXECUTIONER' },
    { days: 120, name: 'SOVEREIGN' },
    { days: 200, name: 'VOID-WALKER' },
    { days: 300, name: 'ETERNAL' },
    { days: 360, name: 'DEATH-LORD' }
  ];

  const currentTier = streakTiers.findLast(t => streakCount >= t.days) || { name: 'DORMANT', days: 5 };
  const nextTier = streakTiers.find(t => streakCount < t.days) || streakTiers[streakTiers.length - 1];
  const streakProgress = Math.min(100, (streakCount / nextTier.days) * 100);

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
               <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gold-core" strokeDasharray="125" strokeDashoffset={dashOffset} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
             </svg>
             <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-white">{executionRatio}%</span>
           </div>
        </div>
      </div>

      {/* 🗡️ ULTIMATE ARTIFACT (Streak-based Evolution) */}
      <div className="elite-panel p-6 flex flex-col items-center justify-center text-center relative group min-h-[250px] overflow-hidden">
        <div className="absolute top-6 left-6 flex flex-col items-start gap-1 z-10">
          <span className="text-[8px] font-mono text-gold-core/60 tracking-widest uppercase font-bold">Ultimate Artifact</span>
          <h4 className="text-white font-display text-[10px] tracking-[0.2em] uppercase">Cosmic Reaper</h4>
        </div>
        
        <div className="relative w-40 h-40 mt-4 flex items-center justify-center">
           <img 
             src={`/ultimate/${currentTier.name.toLowerCase()}.png`} 
             alt={currentTier.name} 
             className="w-full h-full object-contain opacity-40 group-hover:opacity-80 transition-all scale-[1.3] drop-shadow-[0_0_20px_rgba(197,160,89,0.3)]"
             onError={(e) => { e.target.src = '/scythe/PLATINUM.png'; }}
           />
           {/* Cosmic Aura Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 to-transparent pointer-events-none" />
           <div className="absolute inset-0 animate-pulse bg-gold-core/5 blur-3xl rounded-full" />
        </div>
        
        <div className="w-full px-4 mt-2 mb-4">
           <div className="flex justify-between items-center mb-1.5">
              <span className="text-[7px] font-mono text-gray-500 uppercase tracking-tighter">Streak Progress</span>
              <span className="text-[7px] font-mono text-gold-core uppercase font-bold">{streakCount} / {nextTier.days} DAYS</span>
           </div>
           <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-gold-core/50 to-gold-bright shadow-[0_0_10px_rgba(197,160,89,0.5)] transition-all duration-1000"
                style={{ width: `${streakProgress}%` }}
              />
           </div>
        </div>
        
        <div className="absolute bottom-6 right-6 text-right z-10">
           <p className="text-white font-display text-[9px] tracking-widest uppercase">{currentTier.name}</p>
           <p className="text-[7px] font-mono text-gold-core/60 mt-1 uppercase">LEVEL {streakTiers.indexOf(currentTier) + 2}</p>
        </div>
      </div>

      {/* 📜 RECENT INTEL */}
      <div className="elite-panel p-5 flex-1 flex flex-col min-h-0">
         <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono text-gold-core/60 tracking-widest uppercase font-bold">Recent Intel</span>
              <h4 className="text-white font-display text-[10px] tracking-[0.3em] uppercase">Completion Log</h4>
            </div>
            <History size={14} className="text-gold-core/30" />
         </div>
         <div className="h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent mb-4" />
         
         <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {allLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-6 opacity-30 mt-8">
                <p className="text-[10px] font-mono text-gray-500 tracking-[0.3em] text-center uppercase leading-relaxed">
                  No operations completed yet.<br/>The log awaits your victories.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {allLogs.map((log, i) => (
                  <div key={i} className={`p-3 rounded border ${log.status === 'CONQUERED' ? 'bg-white/[0.02] border-gold-core/20' : 'bg-red-900/10 border-red-500/20'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[8px] font-mono tracking-widest font-bold ${log.status === 'CONQUERED' ? 'text-gold-core' : 'text-red-500'}`}>
                        {log.status}
                      </span>
                      <span className="text-[7px] font-mono text-gray-500">{new Date(log.completedAt || log.abandonedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[10px] font-display text-white tracking-widest uppercase truncate">{log.title}</p>
                  </div>
                ))}
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
