import React, { useState } from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, Target, History } from 'lucide-react';

export default function Dashboard({ onOpenTask }) {
  const { dailyLog, completedTasks, abandonedTasks } = useWarscytheStore();
  
  const today = new Date().toISOString().slice(0, 10);
  const todayStats = dailyLog[today] || { completed: 0, weight: 0 };
  
  const totalCompleted = completedTasks.length;
  const totalAbandoned = abandonedTasks.length;
  const ratio = totalCompleted + totalAbandoned > 0 
    ? Math.round((totalCompleted / (totalCompleted + totalAbandoned)) * 100) 
    : 0;

  return (
    <aside className="dashboard-section">
      <div className="command-header">
        <Activity size={16} className="text-gold" />
        <h3>COMMAND CENTER</h3>
      </div>

      <div className="stats-container">
        <div className="stat-row">
          <StatCard 
            label="DAILY COMPLETIONS" 
            value={todayStats.completed} 
            icon={<Target size={14} />} 
          />
          <StatCard 
            label="EXECUTION RATIO" 
            value={`${ratio}%`} 
            icon={<Shield size={14} />} 
          />
        </div>
      </div>

      <div className="reaper-panel glass-panel">
        <div className="panel-header">
          <span className="panel-tag">ULTIMATE ARTIFACT</span>
          <h4>REAPER'S SCYTHE</h4>
        </div>
        <ScytheDisplay weight={todayStats.weight} />
      </div>

      <div className="history-panel glass-panel">
        <div className="panel-header">
          <span className="panel-tag">RECENT INTEL</span>
          <div className="header-with-icon">
            <History size={14} />
            <h4>COMPLETION LOG</h4>
          </div>
        </div>
        
        <div className="intel-list">
          {completedTasks.length === 0 ? (
            <div className="empty-intel">
              <p>NO DATA RECOVERED</p>
            </div>
          ) : (
            completedTasks.slice(0, 5).map((task, i) => (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                key={task.id} 
                className="intel-item"
                onClick={() => onOpenTask(task.id)}
              >
                <div className="intel-marker" />
                <div className="intel-content">
                  <span className="intel-title">{task.title}</span>
                  <span className="intel-meta">CONQUERED {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-section { 
          display: flex; 
          flex-direction: column; 
          gap: 1.5rem; 
          padding: 2rem;
          background: rgba(0,0,0,0.3);
          height: 100%;
          overflow-y: auto;
        }

        .command-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 0.5rem;
        }
        .command-header h3 {
          font-family: var(--font-display);
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
        }
        .text-gold { color: var(--gold-core); }

        .stat-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .reaper-panel { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .panel-header { display: flex; flex-direction: column; gap: 4px; }
        .panel-tag { font-size: 0.5rem; font-weight: 900; color: var(--gold-core); letter-spacing: 0.2em; }
        .panel-header h4 { font-family: var(--font-display); font-size: 1rem; letter-spacing: 0.1em; color: var(--text-primary); }
        
        .history-panel { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .header-with-icon { display: flex; align-items: center; gap: 0.5rem; color: var(--text-dim); }
        .history-panel .panel-header { padding: 1.5rem 1.5rem 0.75rem 1.5rem; border-bottom: 1px solid var(--border); }
        
        .intel-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
        .intel-item { 
          display: flex; 
          align-items: center; 
          gap: 1rem; 
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          transition: 0.2s;
          cursor: pointer;
        }
        .intel-item:hover { background: rgba(255,255,255,0.02); }
        .intel-marker { width: 4px; height: 4px; background: var(--gold-core); transform: rotate(45deg); box-shadow: 0 0 5px var(--gold-core); }
        .intel-content { display: flex; flex-direction: column; gap: 2px; }
        .intel-title { font-size: 0.8rem; font-weight: 600; color: var(--text-primary); }
        .intel-meta { font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-dark); letter-spacing: 0.05em; }
        
        .empty-intel { padding: 3rem 1rem; text-align: center; color: var(--text-dark); font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.2em; }
      `}</style>
    </aside>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="premium-stat-card glass-panel">
      <div className="stat-icon-row">
        {icon}
        <span className="stat-label">{label}</span>
      </div>
      <span className="stat-value">{value}</span>
      <style jsx>{`
        .premium-stat-card { padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; border-radius: var(--radius-sm); }
        .stat-icon-row { display: flex; align-items: center; gap: 0.5rem; color: var(--text-dim); }
        .stat-label { font-size: 0.5rem; font-weight: 900; letter-spacing: 0.1em; }
        .stat-value { font-family: var(--font-mono); font-size: 1.4rem; font-weight: 800; color: var(--gold-core); }
      `}</style>
    </div>
  );
}

function ScytheDisplay({ weight }) {
  const { streakCount, unlockedScythes } = useWarscytheStore();
  const [isSlashing, setIsSlashing] = useState(false);

  let material = 'dormant';
  let materialName = 'Dormant';
  
  // Base materials
  if (weight >= 1 && weight < 3) { material = 'wood'; materialName = 'Wooden'; }
  else if (weight >= 3 && weight < 7) { material = 'steel'; materialName = 'Steel'; }
  else if (weight >= 7 && weight < 10) { material = 'silver'; materialName = 'Silver'; }
  else if (weight >= 10) { material = 'gold'; materialName = 'Golden'; }

  // Streak materials
  if (streakCount >= 25 && unlockedScythes.includes('platinum')) { material = 'platinum'; materialName = 'Platinum'; }
  if (streakCount >= 50 && unlockedScythes.includes('void')) { material = 'void'; materialName = 'Void'; }
  if (streakCount >= 100 && unlockedScythes.includes('eternal')) { material = 'eternal'; materialName = 'Eternal'; }

  const fullName = weight === 0 ? 'Dormant Scythe' : `${materialName} Reaper`;

  const triggerSlash = () => {
    if (isSlashing) return;
    setIsSlashing(true);
    setTimeout(() => setIsSlashing(false), 600);
  };

  return (
    <div className="scythe-box" onClick={triggerSlash}>
      <div className="scythe-visual-container">
        <AnimatePresence>
          {isSlashing && (
            <motion.div 
              key="slash"
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: [0, 1, 0], scale: [1, 2, 1], rotate: 45 }}
              exit={{ opacity: 0 }}
              className={`slash-effect material-${material}`}
            />
          )}
        </AnimatePresence>

        <div className="scythe-visual">
           <motion.svg 
             viewBox="0 0 100 100" 
             className="scythe-svg"
             animate={isSlashing ? { rotate: [0, -20, 0], scale: [1, 1.1, 1] } : { rotate: [0, 2, 0] }}
             transition={{ duration: isSlashing ? 0.3 : 4, ease: "easeInOut" }}
           >
              <path d="M 85,95 C 75,70 65,40 60,10 L 55,10 C 60,40 70,70 80,95 Z" className="scythe-handle" />
              <path d="M 60,15 C 30,5 5,30 5,60 C 15,40 35,25 55,25 Z" className={`scythe-blade ${material}`} />
            </motion.svg>
        </div>
      </div>

      <div className="scythe-info">
        <div className="scythe-header">
          <span className="scythe-name">{fullName}</span>
          {streakCount > 0 && <span className="streak-tag">{streakCount}D STREAK</span>}
        </div>
        <div className="power-meter">
          <div className="power-track">
            <motion.div 
              className="power-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (weight / 10) * 100)}%` }}
            />
          </div>
          <span className="power-val">{Math.round(weight * 10) / 10} PWR</span>
        </div>
      </div>

      <style jsx>{`
        .scythe-box { display: flex; align-items: center; gap: 2rem; cursor: pointer; user-select: none; }
        
        .scythe-visual-container { position: relative; width: 64px; height: 64px; }
        .scythe-visual { width: 100%; height: 100%; filter: drop-shadow(0 0 15px rgba(0,0,0,0.8)); }
        
        .slash-effect {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          border-top: 4px solid #fff;
          z-index: 10;
          pointer-events: none;
        }

        .material-wood { border-color: #5d4037; }
        .material-steel { border-color: #78909c; box-shadow: 0 0 20px rgba(255,255,255,0.2); }
        .material-silver { border-color: #e0e0e0; box-shadow: 0 0 30px rgba(255,255,255,0.4); }
        .material-gold { border-color: var(--gold-core); box-shadow: 0 0 40px var(--gold-glow); }
        .material-platinum { border-color: #b2ebf2; box-shadow: 0 0 50px rgba(178, 235, 242, 0.6); }
        .material-void { border-color: #4a148c; box-shadow: 0 0 60px rgba(74, 20, 140, 0.8); }
        .material-eternal { border-color: #b71c1c; box-shadow: 0 0 80px rgba(183, 28, 28, 1); }

        .scythe-svg { width: 100%; height: 100%; }
        .scythe-handle { fill: #1a1a1a; }
        .scythe-blade { fill: #0d0d0d; transition: 0.5s; stroke: rgba(255,255,255,0.1); stroke-width: 0.5; }
        
        .scythe-blade.wood { fill: #3e2723; }
        .scythe-blade.steel { fill: #455a64; }
        .scythe-blade.silver { fill: #b0bec5; filter: drop-shadow(0 0 10px rgba(255,255,255,0.3)); }
        .scythe-blade.gold { fill: var(--gold-core); filter: drop-shadow(0 0 15px var(--gold-glow)); }
        .scythe-blade.platinum { fill: #e0f7fa; filter: drop-shadow(0 0 20px rgba(178, 235, 242, 0.8)); }
        .scythe-blade.void { fill: #311b92; filter: drop-shadow(0 0 25px rgba(49, 27, 146, 0.8)); }
        .scythe-blade.eternal { fill: #ff1744; filter: drop-shadow(0 0 30px rgba(255, 23, 68, 1)); }

        .scythe-info { display: flex; flex-direction: column; flex: 1; gap: 12px; }
        .scythe-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .scythe-name { font-family: var(--font-display); color: #fff; font-size: 1.1rem; letter-spacing: 0.05em; }
        .streak-tag { font-family: var(--font-mono); font-size: 0.5rem; color: var(--gold-core); font-weight: 900; background: rgba(197, 160, 89, 0.1); padding: 2px 6px; border-radius: 4px; }
        
        .power-meter { display: flex; flex-direction: column; gap: 6px; }
        .power-track { height: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
        .power-fill { height: 100%; background: var(--gold-core); }
        .power-val { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dark); text-align: right; }
      `}</style>
    </div>
  );
}
