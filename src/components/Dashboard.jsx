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
        
        .history-panel { flex: 1; display: flex; flex-direction: column; overflow: hidden; margin-top: 1rem; }
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


