import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { Lock, Unlock } from 'lucide-react';

export default function ScytheCenter() {
  const { dailyLog, streakCount, unlockedScythes } = useWarscytheStore();
  const [isSlashing, setIsSlashing] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const todayStats = dailyLog[today] || { completed: 0, weight: 0 };
  const weight = todayStats.weight;

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

  const stages = [
    { id: 'dormant', name: 'DORMANT', req: 0, type: 'weight' },
    { id: 'awakened', name: 'AWAKENED', req: 3, type: 'weight' },
    { id: 'hardened', name: 'HARDENED', req: 7, type: 'weight' },
    { id: 'refined', name: 'REFINED', req: 10, type: 'weight' },
    { id: 'ascended', name: 'ASCENDED', req: 25, type: 'streak' },
    { id: 'platinum', name: 'PLATINUM', req: 50, type: 'streak' },
  ];

  const currentStageIndex = (() => {
    if (streakCount >= 50 && unlockedScythes.includes('void')) return 5;
    if (streakCount >= 25 && unlockedScythes.includes('platinum')) return 4;
    if (weight >= 10) return 3;
    if (weight >= 7) return 2;
    if (weight >= 3) return 1;
    return 0;
  })();

  return (
    <section className="scythe-center-section">
      <div className="scythe-frame">
        <div className="panel-header">
          <span className="panel-tag">WEAPON EVOLUTION</span>
          <h4>THE REAPER'S SCYTHE</h4>
        </div>

        <div className="scythe-content">
          <div className="evolution-list">
            {stages.map((stage, index) => {
              const isUnlocked = currentStageIndex >= index;
              const isCurrent = currentStageIndex === index;
              
              let progressText = '';
              if (isCurrent) progressText = 'CURRENT';
              else if (isUnlocked) progressText = 'UNLOCKED';
              else {
                if (stage.type === 'weight') progressText = `${Math.floor(weight)}/${stage.req} PWR`;
                if (stage.type === 'streak') progressText = `${streakCount}/${stage.req} STRK`;
              }

              return (
                <div key={stage.id} className={`evo-item ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`}>
                  <div className="evo-icon">
                    {isUnlocked ? <Unlock size={14} /> : <Lock size={14} />}
                  </div>
                  <div className="evo-details">
                    <span className="evo-name">{stage.name}</span>
                    <span className="evo-req">{progressText}</span>
                  </div>
                </div>
              );
            })}
          </div>

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
        </div>

        {/* Empty Asset Slots for Future Art Integrations */}
        <div className="asset-slot-left"></div>
        <div className="asset-slot-right"></div>
      </div>

      <style jsx>{`
        .scythe-center-section {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          height: 100%;
        }

        .scythe-frame {
          position: relative;
          width: 100%;
          height: 100%;
          max-width: 500px;
          border: 1px solid rgba(197, 160, 89, 0.15);
          background: linear-gradient(180deg, rgba(20,20,20,0.4) 0%, rgba(5,5,5,0.8) 100%);
          border-radius: 8px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }

        .panel-header { display: flex; flex-direction: column; gap: 4px; margin-bottom: 2rem; text-align: center; }
        .panel-tag { font-family: var(--font-mono); font-size: 0.6rem; font-weight: 900; color: var(--gold-core); letter-spacing: 0.2em; }
        .panel-header h4 { font-family: var(--font-display); font-size: 1.2rem; letter-spacing: 0.1em; color: var(--text-primary); }

        .scythe-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
          gap: 2rem;
        }

        .evolution-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-right: 2rem;
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        .evo-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          opacity: 0.4;
          transition: 0.3s;
        }

        .evo-item.unlocked { opacity: 0.8; }
        .evo-item.current { opacity: 1; transform: scale(1.05); transform-origin: left; }

        .evo-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          color: rgba(255,255,255,0.5);
          background: rgba(0,0,0,0.5);
        }

        .evo-item.current .evo-icon {
          border-color: var(--gold-core);
          color: var(--gold-bright);
          box-shadow: 0 0 15px rgba(197, 160, 89, 0.3);
        }

        .evo-details { display: flex; flex-direction: column; }
        .evo-name { font-family: var(--font-display); font-size: 0.8rem; letter-spacing: 0.1em; color: #fff; }
        .evo-req { font-family: var(--font-mono); font-size: 0.5rem; letter-spacing: 0.1em; color: var(--text-dim); }
        .evo-item.current .evo-name { color: var(--gold-bright); }
        .evo-item.current .evo-req { color: var(--gold-core); font-weight: 800; }

        .scythe-box { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; gap: 4rem; cursor: pointer; user-select: none; padding-left: 1rem; }
        
        .scythe-visual-container { position: relative; width: 120px; height: 250px; }
        .scythe-visual { width: 100%; height: 100%; filter: drop-shadow(0 0 25px rgba(0,0,0,0.8)); }
        
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

        .scythe-info { display: flex; flex-direction: column; width: 100%; gap: 12px; }
        .scythe-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .scythe-name { font-family: var(--font-display); color: #fff; font-size: 1.1rem; letter-spacing: 0.05em; text-align: center; width: 100%; }
        .streak-tag { font-family: var(--font-mono); font-size: 0.5rem; color: var(--gold-core); font-weight: 900; background: rgba(197, 160, 89, 0.1); padding: 2px 6px; border-radius: 4px; position: absolute; right: 0; top: 0; }
        
        .power-meter { display: flex; flex-direction: column; gap: 6px; }
        .power-track { height: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
        .power-fill { height: 100%; background: var(--gold-core); }
        .power-val { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dark); text-align: center; }
      `}</style>
    </section>
  );
}
