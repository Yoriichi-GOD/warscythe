import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Hexagon, Crosshair, Circle } from 'lucide-react';

export default function SigilRitual({ onActivate }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const handleClick = () => {
    if (isActivating) return;
    setIsActivating(true);
    
    // The "Weight" Delay - 800ms before opening the modal
    // This creates psychological tension rather than instant pop-up
    setTimeout(() => {
      onActivate();
      setIsActivating(false);
    }, 800);
  };

  return (
    <div className="sigil-container">
      <motion.div 
        className="sigil-interactive"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        animate={isActivating ? "activating" : isHovered ? "hover" : "idle"}
      >
        {/* Outer Ring */}
        <motion.div 
          className="sigil-ring outer"
          variants={{
            idle: { rotate: 0, opacity: 0.3, scale: 1 },
            hover: { rotate: 90, opacity: 0.8, scale: 1.1, transition: { duration: 2, ease: "easeOut" } },
            activating: { rotate: 360, opacity: 1, scale: 1.5, filter: "blur(4px)", transition: { duration: 0.8 } }
          }}
        >
          <Circle size={120} strokeWidth={0.5} />
        </motion.div>

        {/* Middle Hexagon Rune */}
        <motion.div 
          className="sigil-ring middle"
          variants={{
            idle: { rotate: 0, opacity: 0.4 },
            hover: { rotate: -45, opacity: 1, scale: 1.05, transition: { duration: 1.5, ease: "easeOut" } },
            activating: { rotate: -180, opacity: 0, scale: 0.5, transition: { duration: 0.8 } }
          }}
        >
          <Hexagon size={80} strokeWidth={1} />
        </motion.div>

        {/* Core Trigger */}
        <motion.div 
          className="sigil-core"
          variants={{
            idle: { scale: 1, opacity: 0.5 },
            hover: { scale: 1.1, opacity: 1, textShadow: "0 0 20px #c5a059" },
            activating: { scale: 0, opacity: 0 }
          }}
        >
          <Crosshair size={40} className="core-icon" />
        </motion.div>

        {/* Glow Effects */}
        <AnimatePresence>
          {isHovered && !isActivating && (
            <motion.div 
              className="sigil-glow"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0.8 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Psychological Idle Text */}
      <motion.div 
        className="idle-text"
        animate={{ opacity: isActivating ? 0 : isHovered ? 1 : 0.3 }}
      >
        {isActivating ? "ESTABLISHING LINK..." : isHovered ? "INITIATE STRIKE" : "The weapon awaits purpose..."}
      </motion.div>

      <style jsx>{`
        .sigil-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          position: relative;
        }

        .sigil-interactive {
          position: relative;
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-bottom: 2rem;
        }

        .sigil-ring {
          position: absolute;
          color: var(--gold-core);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .sigil-core {
          position: absolute;
          color: var(--gold-bright);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .core-icon {
          filter: drop-shadow(0 0 10px var(--gold-glow));
        }

        .sigil-glow {
          position: absolute;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, var(--gold-glow) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 0;
          pointer-events: none;
        }

        .idle-text {
          font-family: var(--font-display);
          font-size: 0.8rem;
          letter-spacing: 0.3em;
          color: var(--gold-core);
          text-transform: uppercase;
          text-shadow: 0 0 10px rgba(197, 160, 89, 0.2);
          transition: 0.3s;
        }
      `}</style>
    </div>
  );
}
