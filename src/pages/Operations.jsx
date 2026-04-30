import React from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import ObjectiveRitual from '../components/operations/ObjectiveRitual';
import MissionCard from '../components/operations/MissionCard';
import ScytheDisplay from '../components/scythe/ScytheDisplay';
import CommandCenter from '../components/command/CommandCenter';
import { Zap, Shield, Lock } from 'lucide-react';

export default function Operations({ onAddTask, onOpenTask, onCompleteTask }) {
  const tasks = useWarscytheStore(state => state.tasks);
  const scytheLevel = useWarscytheStore(state => state.scytheLevel);

  const evolutionStages = [
    { id: 'DORMANT', label: 'DORMANT' },
    { id: 'AWAKENED', label: 'AWAKENED' },
    { id: 'HARDENED', label: 'HARDENED' },
    { id: 'REFINED', label: 'REFINED' },
    { id: 'ASCENDED', label: 'ASCENDED' },
    { id: 'PLATINUM', label: 'PLATINUM' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1.3fr 0.9fr',
      gridTemplateRows: '1fr',
      gap: '1rem',
      height: 'calc(100vh - 148px)',
      padding: '0 1.5rem 1rem 1.5rem',
      marginTop: '0.25rem',
      overflow: 'hidden'
    }}>
      
      {/* ═══ LEFT COLUMN: ACTIVE OPERATIONS ═══ */}
      <section className="elite-panel">
        <div className="flex items-center gap-3 mb-8">
          <Zap size={14} className="text-gold-core" />
          <h2 className="text-white font-display text-xs tracking-[0.3em] uppercase">Active Operations</h2>
        </div>

        <div className="flex flex-col gap-8">
          <ObjectiveRitual onClick={onAddTask} />
          
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">Missions in Progress</span>
              <span className="text-[9px] font-mono text-gold-core/60">{tasks.length} / 3</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {tasks.map(task => (
                <MissionCard key={task.id} task={task} onComplete={onCompleteTask} />
              ))}

              {tasks.length < 3 && (
                <button
                  onClick={onAddTask}
                  className="w-full py-10 border border-dashed border-white/10 rounded flex items-center justify-center text-white/5 hover:border-gold-core/20 hover:text-white/10 transition-all bg-white/[0.01]"
                >
                  <span className="text-[9px] font-mono tracking-[0.4em] uppercase font-black">+ Initiate Strike</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RECALCULATE PROTOCOL */}
        <button className="mt-12 w-full py-5 rounded border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full border border-gold-core/40" />
            <span className="text-[10px] font-display text-gold-core tracking-[0.4em] uppercase group-hover:text-gold-bright">
              Recalculate Protocol
            </span>
            <div className="w-2 h-2 rounded-full border border-gold-core/40" />
          </div>
          <p className="text-[8px] font-mono text-gray-600 mt-1 tracking-[0.2em] uppercase">Break it down. Focus. Execute.</p>
        </button>
      </section>

      <section className="elite-panel !p-0" style={{ height: 'calc(100vh - 160px)', flexDirection: 'row' }}>
        
        {/* WEAPON EVOLUTION SIDEBAR */}
        <div className="w-44 shrink-0 border-r border-white/5 flex flex-col py-10 px-8">
          <div className="mb-10">
            <span className="text-[8px] font-mono text-gray-500 tracking-widest uppercase block mb-1">Weapon Evolution</span>
            <h4 className="text-white font-display text-[11px] tracking-[0.2em] uppercase">Reaper's Scythe</h4>
          </div>
          
          <div className="flex flex-col gap-4">
            {evolutionStages.map((stage) => {
              const isActive = scytheLevel === stage.id;
              const colorClass = isActive ? 'text-gold-core font-black' : 'text-white/30';
              const borderClass = isActive ? 'border-gold-core/40' : 'border-white/5';

              return (
                <div key={stage.id} className={`flex items-center gap-4 py-2 transition-all ${isActive ? 'translate-x-2' : ''}`}>
                  <div className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 ${borderClass} ${colorClass}`}>
                     {isActive ? <Shield size={14} /> : <Lock size={12} />}
                  </div>
                  <div className="flex flex-col">
                     <span className={`text-[10px] font-display tracking-[0.2em] uppercase ${colorClass}`}>{stage.label}</span>
                     {isActive && <span className="text-[7px] font-mono text-gold-core uppercase font-bold mt-0.5">CURRENT</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SCYTHE DISPLAY AREA */}
        <div className="flex-1 relative" style={{ height: 'calc(100vh - 160px)', minHeight: 0 }}>
           <ScytheDisplay level={scytheLevel} />
        </div>
      </section>

      {/* ═══ RIGHT COLUMN: COMMAND CENTER ═══ */}
      <aside className="flex flex-col gap-6">
        <CommandCenter />
      </aside>

    </div>
  );
}
