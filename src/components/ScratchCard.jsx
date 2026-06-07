import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Scroll } from 'lucide-react';

const getFoilPath = (rarity) => {
  const foils = {
    common: '/scratch/scratch-foil-common.png',
    uncommon: '/scratch/scratch-foil-uncommon.png',
    rare: '/scratch/scratch-foil-rare.png',
    epic: '/scratch/scratch-foil-epic.png',
    mythic: '/scratch/scratch-foil-mythic.png'
  };
  return foils[rarity.toLowerCase()] || foils.common;
};

const getArtifactImage = (name) => {
  const mapping = {
    'Iron Quill': 'scroll',
    "Scout's Compass": 'compass',
    'Wax Seal of Intent': 'rune',
    'Cloak of Momentum': 'amulet',
    'Whetstone of Focus': 'chain',
    'Ink of Resolve': 'chalice',
    'Blade of Persistence': 'blade',
    'Shield of No Retreat': 'shield',
    'Ring of Execution': 'ring',
    'Helm of Clarity': 'helm',
    'Staff of Deadlines': 'staff',
    'Cloak of Iteration': 'amulet',
    'Dragon Scale Armor': 'horn',
    'Eye of the Strategist': 'eye',
    "Void Walker's Boots": 'gem',
    'Crown of Completion': 'crown',
    "Warscythe's Gauntlet": 'gauntlet',
    'The Finisher': 'blade',
    'Throne Fragment': 'idol',
    'Shard of Reality': 'mirror',
    'Cosmic Reaper': 'skull',
    'Sovereign Core': 'orb',
    'Omega Catalyst': 'hourglass',
    'Grip of the Void': 'gauntlet'
  };
  const baseName = mapping[name] || 'rune';
  return `/artifacts/artifact-${baseName}.png`;
};

export default function ScratchCard({ data, onClose }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isRevealedRef = useRef(false);
  
  const { reward, basePts, totalPts, fragment, taskTitle, keyElement } = data;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    
    // Load dynamic foil texture
    const img = new Image();
    img.src = getFoilPath(reward.rarity);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);

      // Grid pattern overlay
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.05)';
      ctx.lineWidth = 1;
      for(let i=0;i<w;i+=20) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,h); ctx.stroke(); }
      for(let j=0;j<h;j+=20) { ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(w,j); ctx.stroke(); }

      // Surface text
      ctx.font = '900 11px var(--font-mono)';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillText('ENCRYPTED LOOT // SCRATCH TO DECRYPT', w/2 + 1, h/2 + 1);
      
      // Foreground text
      ctx.fillStyle = 'rgba(197, 160, 89, 0.9)'; 
      ctx.fillText('ENCRYPTED LOOT // SCRATCH TO DECRYPT', w/2, h/2);
    };

    let drawing = false;
    const pixels = w * h;
    let scratchedPixels = 0;

    const doScratch = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
      
      scratchedPixels += 1500; // Rough estimate
      if (scratchedPixels > pixels * 0.4 && !isRevealedRef.current) {
        isRevealedRef.current = true;
        setIsRevealed(true);
        ctx.clearRect(0, 0, w, h);
      }
    };

    const handleStart = () => drawing = true;
    const handleEnd = () => drawing = false;
    const handleMove = (e) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const x = ((clientX - rect.left) / rect.width) * canvas.width;
      const y = ((clientY - rect.top) / rect.height) * canvas.height;
      doScratch(x, y);
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('touchstart', handleStart);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); handleMove(e); });

    return () => {
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);

  const revealAll = () => {
    setIsRevealed(true);
    isRevealedRef.current = true;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="modal-backdrop loot-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="loot-card-modal glass-panel"
      >
        <div className="loot-header">
          <div className="validation-pill">
            <Sparkles size={12} />
            <span>ENCRYPTION BROKEN</span>
          </div>
          <h2>REWARD ACQUIRED</h2>
          <p className="loot-task-ref">{taskTitle}</p>
        </div>

        <div className="scratch-container" ref={containerRef}>
          <div className={`loot-content ${isRevealed ? 'revealed' : ''}`}>
             <div className="flex items-center justify-center gap-6 z-10">
               {/* Artifact Visual */}
               <motion.div 
                 className="loot-visual"
                 style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                 animate={isRevealed ? { 
                   scale: [1, 1.1, 1],
                   rotate: [0, 5, -5, 0]
                 } : {}}
               >
                  <img 
                    src={getArtifactImage(reward.artifact.name)} 
                    className={`loot-artifact-img art-img-filter ${reward.rarity}`} 
                    alt={reward.artifact.name} 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', zIndex: 2 }}
                  />
                  <div className={`rarity-glow ${reward.rarity}`} />
               </motion.div>

               {/* Key Visual (shown beside the artifact) */}
               {keyElement && (
                 <motion.div 
                   className="key-visual"
                   style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
                   animate={isRevealed ? { 
                     scale: [1, 1.15, 1],
                     rotate: [0, -5, 5, 0]
                   } : {}}
                   transition={{ delay: 0.15 }}
                 >
                    <img 
                      src={`/keys/key-${keyElement}.png`} 
                      className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]" 
                      alt={`${keyElement} Key`} 
                      style={{ zIndex: 2 }}
                    />
                    <div className="rarity-glow rare" style={{ opacity: 0.5 }} />
                 </motion.div>
               )}
             </div>
             
             <div className="loot-details">
                <span className={`loot-rarity-text ${reward.rarity}`}>{reward.rarity.toUpperCase()} ARTIFACT</span>
                <h3 className="loot-art-name">{reward.artifact.name}</h3>
                <div className="loot-xp-badge">+{totalPts} XP</div>
                {keyElement && (
                  <div className="text-[10px] font-mono text-gold-core/85 tracking-widest mt-2 uppercase font-bold animate-pulse">
                    + ACQUIRED {keyElement.toUpperCase()} KEY
                  </div>
                )}
             </div>
          </div>
          <canvas ref={canvasRef} width={360} height={360} className="scratch-canvas" />
        </div>

        {!isRevealed && (
          <button 
            className="text-[9px] font-mono tracking-widest text-gold-core/60 hover:text-gold-bright uppercase transition-all mb-4 px-3 py-1 border border-gold-core/20 hover:border-gold-core/60 rounded bg-black/40"
            onClick={revealAll}
          >
            [ DECRYPT IMMEDIATELY ]
          </button>
        )}

        <AnimatePresence>
          {isRevealed && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="loot-footer-area"
            >
              <div className="lore-panel-mini">
                <div className="lore-header-row">
                  <Scroll size={12} />
                  <span>DECRYPTED INTEL</span>
                </div>
                <p className="lore-body-text">{fragment}</p>
              </div>
              <button className="loot-claim-btn" onClick={onClose}>
                <span>CLAIM REWARD & CONTINUE</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(8px);
        }
        .loot-card-modal { max-width: 440px; width: 100%; padding: 2.5rem; text-align: center; border: 1px solid var(--border-bright); }
        
        .validation-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 4px 12px;
          background: rgba(197, 160, 89, 0.1);
          border: 1px solid var(--gold-core);
          border-radius: 100px;
          color: var(--gold-core);
          font-size: 0.55rem;
          font-weight: 900;
          letter-spacing: 0.2em;
          margin-bottom: 1rem;
        }

        h2 { font-family: var(--font-display); font-size: 1.5rem; color: #fff; letter-spacing: 0.1em; }
        .loot-task-ref { font-size: 0.75rem; color: var(--text-dark); font-family: var(--font-mono); margin-top: 0.5rem; }
        
        .scratch-container { 
          position: relative; width: 100%; aspect-ratio: 1 / 1; 
          margin: 1.5rem 0; border-radius: 12px; overflow: hidden;
          background: #050505; border: 1px solid var(--border);
        }
        .scratch-container::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 32px;
          height: 32px;
          background: #111;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          border-left: 1px solid rgba(255, 255, 255, 0.15);
          clip-path: polygon(100% 0, 0 100%, 100% 100%);
          z-index: 5;
          pointer-events: none;
        }
        .scratch-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; cursor: crosshair; }
        
        .loot-content { 
          position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 1rem; opacity: 0; transition: 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .loot-content.revealed { opacity: 1; }
        
        .loot-visual { position: relative; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; z-index: 1; }
        .loot-icon-emoji { font-size: 3.5rem; position: relative; z-index: 2; }
        .rarity-glow { position: absolute; inset: -20px; border-radius: 50%; filter: blur(30px); opacity: 0.4; z-index: 1; }
        
        .rarity-glow.common { background: #fff; }
        .rarity-glow.uncommon { background: var(--stage-ship); }
        .rarity-glow.rare { background: var(--stage-build); }
        .rarity-glow.epic { background: var(--stage-finish); }
        .rarity-glow.mythic { background: #ff3d00; }
        
        .art-img-filter.common { filter: grayscale(100%) brightness(0.8) drop-shadow(0 0 6px rgba(170, 170, 170, 0.3)); }
        .art-img-filter.uncommon { filter: hue-rotate(90deg) saturate(1.5) drop-shadow(0 0 6px rgba(46, 204, 113, 0.35)); }
        .art-img-filter.rare { filter: hue-rotate(15deg) saturate(2) brightness(1.1) drop-shadow(0 0 8px rgba(241, 196, 15, 0.45)); }
        .art-img-filter.epic { filter: hue-rotate(-30deg) saturate(2) brightness(1) drop-shadow(0 0 10px rgba(231, 76, 60, 0.55)); }
        .art-img-filter.mythic { filter: hue-rotate(240deg) saturate(2.5) brightness(1.1) drop-shadow(0 0 12px rgba(147, 51, 234, 0.65)); }

        .loot-details { display: flex; flex-direction: column; gap: 4px; }
        .loot-rarity-text { font-size: 0.5rem; font-weight: 900; letter-spacing: 0.2em; }
        .loot-rarity-text.common { color: var(--text-dark); }
        .loot-rarity-text.uncommon { color: var(--stage-ship); }
        .loot-rarity-text.rare { color: var(--stage-build); }
        .loot-rarity-text.epic { color: var(--stage-finish); }
        .loot-rarity-text.mythic { color: #ff3d00; }
        
        .loot-art-name { font-family: var(--font-display); font-size: 1.1rem; color: #fff; letter-spacing: 0.05em; }
        .loot-xp-badge { font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800; color: var(--gold-core); }

        .loot-footer-area { display: flex; flex-direction: column; gap: 1.5rem; }
        .lore-panel-mini { 
          background: rgba(255,255,255,0.02); 
          padding: 1.25rem; 
          border-radius: 8px; 
          border-left: 2px solid var(--gold-core);
          text-align: left;
        }
        .lore-header-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.5rem; font-weight: 900; color: var(--text-dark); letter-spacing: 0.1em; margin-bottom: 0.5rem; }
        .lore-body-text { font-size: 0.8rem; font-style: italic; color: var(--text-dim); line-height: 1.5; }
        
        .loot-claim-btn {
          width: 100%; height: 50px; display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.15) 0%, rgba(197, 160, 89, 0.05) 100%);
          border: 1px solid var(--gold-core); border-radius: 8px;
          color: var(--gold-bright); font-family: var(--font-mono); font-weight: 900; font-size: 0.85rem; letter-spacing: 0.15em;
          cursor: pointer; transition: 0.3s;
          box-shadow: 0 0 20px rgba(197, 160, 89, 0.1);
        }
        .loot-claim-btn:hover {
          background: rgba(197, 160, 89, 0.2); box-shadow: 0 0 30px rgba(197, 160, 89, 0.2); transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
