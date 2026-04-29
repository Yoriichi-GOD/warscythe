import React, { useState, useEffect } from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
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
          <div className="premium-stat-card glass-panel">
            <div className="stat-icon-row">
              <Target size={14} />
              <span className="stat-label">DAILY COMPLETIONS</span>
            </div>
            <AnimatedCounter value={todayStats.completed} />
          </div>
          
          <div className="premium-stat-card glass-panel execution-panel">
            <div className="stat-icon-row">
              <Shield size={14} />
              <span className="stat-label">EXECUTION RATIO</span>
            </div>
            <ExecutionRadial percentage={ratio} />
          </div>
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
              <TypewriterLog key={task.id} task={task} delay={i * 0.2} onClick={() => onOpenTask(task.id)} />
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
        
        .premium-stat-card { 
          padding: 1.25rem; 
          display: flex; 
          flex-direction: column; 
          gap: 1rem; 
          border-radius: var(--radius-sm); 
          position: relative;
          overflow: hidden;
        }
        .execution-panel {
          align-items: center;
        }
        .stat-icon-row { display: flex; align-items: center; gap: 0.5rem; color: var(--text-dim); align-self: flex-start; z-index: 2; }
        .stat-label { font-size: 0.5rem; font-weight: 900; letter-spacing: 0.1em; }

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

function AnimatedCounter({ value }) {
  const spring = useSpring(0, { bounce: 0, duration: 1500 });
  const displayValue = useTransform(spring, (current) => Math.floor(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <div className="counter-wrapper">
      <motion.span className="counter-value">{displayValue}</motion.span>
      <div className="counter-glow" />
      <style jsx>{`
        .counter-wrapper { position: relative; display: flex; justify-content: center; margin-top: 0.5rem; }
        .counter-value { font-family: var(--font-display); font-size: 3rem; font-weight: 900; color: var(--gold-bright); text-shadow: 0 0 20px var(--gold-glow); z-index: 2; }
        .counter-glow { position: absolute; bottom: 0; width: 40px; height: 10px; background: var(--gold-core); filter: blur(15px); opacity: 0.5; }
      `}</style>
    </div>
  );
}

function ExecutionRadial({ percentage }) {
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const displayValue = useTransform(spring, (current) => `${Math.floor(current)}%`);
  
  useEffect(() => {
    spring.set(percentage);
  }, [percentage, spring]);

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = useTransform(spring, (current) => circumference - (current / 100) * circumference);

  return (
    <div className="radial-container">
      <svg width="100" height="100" className="radial-svg">
        <circle cx="50" cy="50" r={radius} className="radial-bg" />
        <motion.circle 
          cx="50" cy="50" r={radius} 
          className="radial-fill"
          style={{ strokeDasharray: circumference, strokeDashoffset }}
        />
      </svg>
      <motion.div className="radial-text">{displayValue}</motion.div>
      <style jsx>{`
        .radial-container { position: relative; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; }
        .radial-svg { transform: rotate(-90deg); position: absolute; top: 0; left: 0; }
        .radial-bg { fill: none; stroke: rgba(255,255,255,0.05); stroke-width: 4; }
        .radial-fill { fill: none; stroke: var(--gold-core); stroke-width: 6; stroke-linecap: round; filter: drop-shadow(0 0 4px var(--gold-glow)); }
        .radial-text { font-family: var(--font-mono); font-size: 1rem; font-weight: 800; color: var(--text-primary); }
      `}</style>
    </div>
  );
}

function TypewriterLog({ task, delay, onClick }) {
  const [text, setText] = useState('');
  const fullText = `Operation '${task.title}' — SUCCESS`;
  
  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setText(fullText.substring(0, i));
        i++;
        if (i > fullText.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [fullText, delay]);

  return (
    <div className="intel-item" onClick={onClick}>
      <div className="intel-marker" />
      <div className="intel-content">
        <span className="intel-title">{text}<span className="cursor">_</span></span>
        <span className="intel-meta">DECRYPTED {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <style jsx>{`
        .cursor { animation: blink 1s step-end infinite; opacity: 0.5; }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

function ScytheDisplay({ weight }) {
  const { streakCount, unlockedScythes } = useWarscytheStore();
  const [isSlashing, setIsSlashing] = useState(false);

  let material = 'dormant';
  let materialName = 'Dormant';
  let auraColor = 'rgba(255, 255, 255, 0.05)';
  
  // Base materials
  if (weight >= 1 && weight < 3) { material = 'wood'; materialName = 'Wooden'; auraColor = 'rgba(139, 69, 19, 0.2)'; }
  else if (weight >= 3 && weight < 7) { material = 'steel'; materialName = 'Steel'; auraColor = 'rgba(200, 200, 200, 0.3)'; }
  else if (weight >= 7 && weight < 10) { material = 'silver'; materialName = 'Silver'; auraColor = 'rgba(220, 220, 255, 0.4)'; }
  else if (weight >= 10) { material = 'gold'; materialName = 'Golden'; auraColor = 'rgba(197, 160, 89, 0.5)'; }

  // Streak materials
  if (streakCount >= 25 && unlockedScythes.includes('platinum')) { material = 'platinum'; materialName = 'Platinum'; auraColor = 'rgba(229, 228, 226, 0.6)'; }
  if (streakCount >= 50 && unlockedScythes.includes('void')) { material = 'void'; materialName = 'Void'; auraColor = 'rgba(138, 43, 226, 0.6)'; }
  if (streakCount >= 100 && unlockedScythes.includes('eternal')) { material = 'eternal'; materialName = 'Eternal'; auraColor = 'rgba(255, 60, 60, 0.6)'; }

  const fullName = weight === 0 ? 'Dormant Scythe' : `${materialName} Reaper`;

  const triggerSlash = () => {
    if (isSlashing) return;
    setIsSlashing(true);
    setTimeout(() => setIsSlashing(false), 600);
  };

  return (
    <div className="scythe-box" onClick={triggerSlash}>
      <motion.div 
        className="scythe-visual-container"
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        style={{ filter: `drop-shadow(0 20px 30px ${auraColor})` }}
      >
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
      </motion.div>

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
