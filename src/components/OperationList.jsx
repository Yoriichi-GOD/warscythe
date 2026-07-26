import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { Target, Clock, AlertTriangle, ChevronRight, Zap } from 'lucide-react';
import SigilRitual from './SigilRitual';

export default function OperationList({ onAddTask, onOpenTask }) {
  const tasks = useWarscytheStore(state => state.tasks);
  
  const activeCount = tasks.length;
  const maxTasks = 3;

  return (
    <section className="operation-section">
      <div className="section-header">
        <div className="title-block">
          <div className="title-icon"><Zap size={18} fill="var(--gold-core)" /></div>
          <h2>ACTIVE OPERATIONS</h2>
        </div>
        <div className="op-stats">
          <span className="stats-label">DEPLOYMENT SLOT</span>
          <div className="slot-indicator">
            {activeCount}<span>/{maxTasks}</span>
          </div>
        </div>
      </div>

      <div className="operations-container">
        <div className="ritual-zone">
          <div className="ritual-prompt">
            <h3>WHAT WILL YOU EXECUTE TODAY?</h3>
            <p>Every task is a strike. Every strike shapes your legend.</p>
          </div>
          {activeCount < maxTasks ? (
            <SigilRitual onActivate={onAddTask} />
          ) : (
            <div className="ritual-locked">DEPLOYMENT SLOTS FULL</div>
          )}
        </div>

        <div className="tasks-scroll-area">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onClick={() => onOpenTask(task.id)} 
              />
            ))}
          </AnimatePresence>
          
          {tasks.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-state"
            >
              <Target size={48} className="empty-icon" />
              <p>No active operations. Deploy a new objective to begin.</p>
            </motion.div>
          )}
        </div>
      </div>

      <style>{`
        .operation-section { 
          display: flex; 
          flex-direction: column; 
          gap: 2rem; 
          height: 100%;
          padding: 2rem;
          border-right: 1px solid var(--border);
        }
        
        .section-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-end;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }
        
        .title-block { display: flex; align-items: center; gap: 0.75rem; }
        .title-icon { color: var(--gold-core); filter: drop-shadow(0 0 5px var(--gold-glow)); }
        .title-block h2 { 
          font-family: var(--font-display); 
          font-size: 1.1rem; 
          letter-spacing: 0.15em; 
          color: var(--text-primary);
          margin: 0;
        }

        .op-stats { text-align: right; }
        .stats-label { font-size: 0.5rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; display: block; margin-bottom: 2px; }
        .slot-indicator { font-family: var(--font-mono); font-weight: 800; font-size: 1.2rem; line-height: 1; }
        .slot-indicator span { color: var(--text-dark); }
        
        .ritual-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 3rem;
          padding-top: 2rem;
          border-bottom: 1px solid rgba(197, 160, 89, 0.1);
        }

        .ritual-prompt {
          text-align: center;
          margin-bottom: 1rem;
        }

        .ritual-prompt h3 {
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: #fff;
          letter-spacing: 0.2em;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 10px rgba(255,255,255,0.2);
        }

        .ritual-prompt p {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #ffffff;
          letter-spacing: 0.1em;
        }

        .ritual-locked {
          font-family: var(--font-display);
          color: var(--red-core);
          font-weight: 900;
          letter-spacing: 0.2em;
          padding: 2rem;
          border: 1px solid var(--red-glow);
          background: rgba(158, 27, 27, 0.1);
          margin-top: 1rem;
        }
        
        .operations-container { 
          display: flex; 
          flex-direction: column; 
          gap: 1.5rem; 
          flex: 1; 
          overflow: hidden;
        }
        
        .tasks-scroll-area {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow-y: auto;
          flex: 1;
          padding-right: 0.5rem;
        }
        
        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          color: var(--text-dark);
          text-align: center;
          padding: 2rem;
        }
        .empty-icon { opacity: 0.1; }
        .empty-state p { font-size: 0.8rem; max-width: 200px; line-height: 1.6; }
      `}</style>
    </section>
  );
}

function TaskCard({ task, onClick }) {
  const isStalled = task.stalledAt !== null;
  const stageMap = {
    'BUILD': { color: 'var(--stage-build)', icon: '🛠️' },
    'FINISH': { color: 'var(--stage-finish)', icon: '✨' },
    'SHIP': { color: 'var(--stage-ship)', icon: '🚀' }
  };
  
  const stageKey = task.progress < 70 ? 'BUILD' : task.progress < 95 ? 'FINISH' : 'SHIP';
  const stage = stageMap[stageKey];
  const activeColor = isStalled ? 'var(--stalled)' : stage.color;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ x: 4 }}
      className={`task-card ${isStalled ? 'stalled-state' : ''}`}
      onClick={onClick}
    >
      <div className="card-accent" style={{ background: activeColor }} />
      
      <div className="card-main-content">
        <div className="card-header-row">
          <div className="task-info-block">
            <span className="task-category">{task.category}</span>
            <h3 className="task-display-title">{task.title}</h3>
          </div>
          <div className="stage-indicator" style={{ borderColor: activeColor, color: activeColor }}>
            <span className="stage-text">{isStalled ? 'STALLED' : stageKey}</span>
            <ChevronRight size={12} />
          </div>
        </div>
        
        <div className="card-meta-row">
          <div className="meta-pill">
            <Zap size={10} />
            <span>{task.effort} EFFORT</span>
          </div>
          {task.deadline && (
            <div className="meta-pill deadline">
              <Clock size={10} />
              <span>{new Date(task.deadline).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'numeric', minute:'2-digit' })}</span>
            </div>
          )}
        </div>

        <div className="card-progress-section">
          <div className="progress-top-labels">
            <span className="progress-label">OBJECTIVE COMPLETION</span>
            <span className="progress-percent" style={{ color: activeColor }}>{task.progress}%</span>
          </div>
          <div className="premium-progress-track">
            <motion.div 
              className="premium-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${task.progress}%` }}
              style={{ background: activeColor }}
            />
            <div className="premium-progress-glow" style={{ width: `${task.progress}%`, background: activeColor }} />
          </div>
        </div>
      </div>

      <style>{`
        .task-card {
          display: flex;
          align-items: stretch;
          background: linear-gradient(135deg, rgba(20,20,20,0.95), rgba(10,10,10,0.98));
          border: 1px solid #1a1a1a;
          border-radius: 4px;
          padding: 1.5rem;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          margin-bottom: 1rem;
          /* Etched Metal Texture */
          box-shadow: 
            inset 0 1px 1px rgba(255,255,255,0.05),
            inset 0 -1px 1px rgba(0,0,0,0.8),
            0 5px 15px rgba(0,0,0,0.5);
        }

        .task-card:hover {
          transform: translateY(-2px);
          border-color: #2a2a2a;
          box-shadow: 
            inset 0 1px 1px rgba(255,255,255,0.08),
            inset 0 -1px 1px rgba(0,0,0,0.8),
            0 10px 30px rgba(0,0,0,0.7),
            0 0 20px rgba(197, 160, 89, 0.1); /* Ember Glow leak */
        }
        
        .card-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          opacity: 0.8;
        }
        
        .card-main-content { display: flex; flex-direction: column; gap: 1rem; }
        
        .card-header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
        .task-info-block { display: flex; flex-direction: column; gap: 4px; }
        .task-category { font-size: 0.55rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase; }
        .task-display-title { font-size: 1rem; font-weight: 700; color: var(--text-primary); line-height: 1.3; }
        
        .stage-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border: 1px solid;
          border-radius: 4px;
          background: rgba(0,0,0,0.2);
        }
        .stage-text { font-size: 0.55rem; font-weight: 900; letter-spacing: 0.1em; }
        
        .card-meta-row { display: flex; gap: 8px; }
        .meta-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.03);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 800;
          color: var(--text-dim);
          border: 1px solid var(--border);
        }
        .meta-pill.deadline { color: var(--red-hot); border-color: rgba(255, 60, 60, 0.2); }
        
        .card-progress-section { display: flex; flex-direction: column; gap: 8px; }
        .progress-top-labels { display: flex; justify-content: space-between; }
        .progress-label { font-size: 0.5rem; font-weight: 900; color: var(--text-dark); letter-spacing: 0.1em; }
        .progress-percent { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800; }
        
        .premium-progress-track { height: 6px; background: rgba(255,255,255,0.03); border-radius: 100px; position: relative; overflow: hidden; }
        .premium-progress-fill { height: 100%; border-radius: 100px; position: relative; z-index: 2; }
        .premium-progress-glow { position: absolute; top: 0; left: 0; height: 100%; filter: blur(4px); opacity: 0.3; }

        .stalled-state { animation: card-pulse 2s infinite; }
        @keyframes card-pulse {
          0% { border-color: var(--border); }
          50% { border-color: var(--red-glow); }
          100% { border-color: var(--border); }
        }
      `}</style>
    </motion.div>
  );
}
