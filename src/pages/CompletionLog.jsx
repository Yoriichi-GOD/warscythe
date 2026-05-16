import React from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function CompletionLog() {
  const completedTasks = useWarscytheStore(state => state.completedTasks);
  const abandonedTasks = useWarscytheStore(state => state.abandonedTasks);

  const allLogs = [...completedTasks.map(t => ({...t, type: 'completed'})), ...abandonedTasks.map(t => ({...t, type: 'abandoned'}))]
    .sort((a, b) => {
      const dateA = new Date(a.completedAt || a.abandonedAt);
      const dateB = new Date(b.completedAt || b.abandonedAt);
      return dateB - dateA;
    });

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="flex flex-col gap-1 mb-4">
        <h2 className="text-2xl font-display text-gold-core tracking-widest uppercase">Finishing Page</h2>
        <p className="text-sm font-mono text-text-dim tracking-widest">THE LOG OF YOUR EXECUTIONS</p>
      </div>

      {allLogs.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-text-dim font-mono tracking-widest text-sm opacity-50">
          NO RECORDS FOUND
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {allLogs.map((log, i) => (
            <motion.div 
              key={`${log.id}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`elite-panel flex flex-row items-center gap-4 ${log.type === 'abandoned' ? 'opacity-60 grayscale' : ''}`}
            >
              <div className="flex-shrink-0">
                {log.type === 'completed' ? (
                  <CheckCircle2 size={24} className="text-gold-core" />
                ) : (
                  <XCircle size={24} className="text-red-500" />
                )}
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-display text-white text-lg tracking-wide">{log.title}</span>
                <div className="flex gap-3 text-xs font-mono text-text-dim mt-1">
                  <span className="text-gold-bright">{log.category}</span>
                  <span>{new Date(log.completedAt || log.abandonedAt).toLocaleDateString()}</span>
                  <span>{log.type === 'completed' ? 'CONQUERED' : 'ABANDONED'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
