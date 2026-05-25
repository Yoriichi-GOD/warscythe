import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { Check, Trash2, Calendar, ShieldAlert } from 'lucide-react';

export default function CompletionLog() {
  const completedTasks = useWarscytheStore(state => state.completedTasks) || [];
  const abandonedTasks = useWarscytheStore(state => state.abandonedTasks) || [];
  const [filter, setFilter] = useState('ALL'); // ALL, CONQUERED, ABANDONED
  const [visibleCount, setVisibleCount] = useState(20);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setVisibleCount(20);
  };

  const allLogs = [
    ...completedTasks.map(t => ({ ...t, status: 'CONQUERED', type: 'completed' })),
    ...abandonedTasks.map(t => ({ ...t, status: 'ABANDONED', type: 'abandoned' }))
  ].sort((a, b) => {
    const dateA = new Date(a.completedAt || a.abandonedAt || 0);
    const dateB = new Date(b.completedAt || b.abandonedAt || 0);
    return dateB - dateA;
  });

  const filteredLogs = allLogs.filter(log => {
    if (filter === 'CONQUERED') return log.type === 'completed';
    if (filter === 'ABANDONED') return log.type === 'abandoned';
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-6 pb-32 flex flex-col gap-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
        <span className="text-[9px] font-mono text-gold-core/60 tracking-[0.4em] uppercase font-bold">Ledger of Executions</span>
        <h2 className="text-3xl font-display text-white tracking-[0.1em] uppercase">SYSTEM HISTORY</h2>
        <p className="text-[10px] font-mono text-text-dim tracking-wider uppercase">
          A chronologically archived index of your operational outcomes.
        </p>
      </div>

      {/* FILTER CONTROL TABS */}
      <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded w-fit">
        {['ALL', 'CONQUERED', 'ABANDONED'].map(tab => (
          <button
            key={tab}
            onClick={() => handleFilterChange(tab)}
            className={`px-4 py-1.5 text-[9px] font-mono tracking-widest uppercase rounded transition-all ${
              filter === tab 
                ? 'bg-gold-core text-black font-bold shadow-[0_0_12px_rgba(197,160,89,0.3)]' 
                : 'text-text-dim hover:text-white hover:bg-white/5'
            }`}
          >
            {tab} ({
              tab === 'ALL' ? allLogs.length : 
              tab === 'CONQUERED' ? completedTasks.length : 
              abandonedTasks.length
            })
          </button>
        ))}
      </div>

      {/* EXECUTION LIST */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {filteredLogs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-white/5 rounded-lg"
            >
              <ShieldAlert size={24} className="text-gray-600" />
              <span className="text-[10px] font-mono text-text-dim tracking-[0.3em] uppercase">No logs recorded</span>
            </motion.div>
          ) : (
            filteredLogs.slice(0, visibleCount).map((log, i) => {
              const isCompleted = log.type === 'completed';
              return (
                <motion.div
                  key={`${log.id}-${log.status}-${i}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                  className={`elite-panel p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white/[0.01] ${
                    isCompleted 
                      ? 'border-gold-core/20 bg-gradient-to-r from-gold-core/[0.02] to-transparent' 
                      : 'border-red-500/20 bg-gradient-to-r from-red-500/[0.02] to-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border flex-shrink-0 ${
                      isCompleted ? 'border-gold-core/30 text-gold-core bg-gold-core/5' : 'border-red-500/30 text-red-500 bg-red-500/5'
                    }`}>
                      {isCompleted ? <Check size={10} /> : <Trash2 size={10} />}
                    </div>
                    
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <h4 className="text-white font-display text-[12px] tracking-wider uppercase leading-snug truncate">
                        {log.title || 'UNSPECIFIED STRIKE'}
                      </h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 items-center text-[8px] font-mono text-text-dim uppercase tracking-wider">
                        <span className="text-gold-core/80 font-bold">{log.category || 'WORK'}</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={8} />
                          {new Date(log.completedAt || log.abandonedAt || 0).toLocaleDateString()} 
                          {' '}
                          {new Date(log.completedAt || log.abandonedAt || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono tracking-widest font-extrabold uppercase border ${
                      isCompleted 
                        ? 'text-gold-bright bg-gold-core/10 border-gold-core/20 shadow-[0_0_8px_rgba(197,160,89,0.15)]' 
                        : 'text-red-400 bg-red-950/20 border-red-500/10'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {filteredLogs.length > visibleCount && (
          <button
            onClick={() => setVisibleCount(prev => prev + 20)}
            className="w-full py-4 border border-dashed border-white/10 rounded flex items-center justify-center text-white/40 hover:border-gold-core/40 hover:text-gold-core transition-all bg-white/[0.01] cursor-pointer text-[10px] font-mono tracking-[0.25em] uppercase font-bold mt-4"
          >
            + Load Older Archive Files
          </button>
        )}
      </div>
    </div>
  );
}
