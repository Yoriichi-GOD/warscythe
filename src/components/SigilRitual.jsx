import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SigilRitual({ onActivate }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const canvasRef = useRef(null);

  // Galaxy Particle Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Setup Canvas Resolution
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    
    const center = size / 2;
    const particles = [];
    const particleCount = 150;

    // Initialize Particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * (size / 2 - 10) + 10,
        speed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      
      // The Core Void
      const coreGradient = ctx.createRadialGradient(center, center, 0, center, center, 40);
      coreGradient.addColorStop(0, isHovered ? 'rgba(197, 160, 89, 0.4)' : 'rgba(0, 0, 0, 0.8)');
      coreGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(center, center, 40, 0, Math.PI * 2);
      ctx.fill();

      // Draw Orbiting Particles
      particles.forEach(p => {
        // Shift speed heavily on hover or click
        const currentSpeed = isActivating ? p.speed * 10 : isHovered ? p.speed * 3 : p.speed;
        p.angle += currentSpeed;
        
        // Slight pull inward on hover
        const currentRadius = isHovered && !isActivating ? p.radius * 0.9 : p.radius;

        const x = center + Math.cos(p.angle) * currentRadius;
        const y = center + Math.sin(p.angle) * currentRadius;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        
        // Brighter particles closer to core
        const intensity = Math.max(0, 1 - (currentRadius / (size / 2)));
        const baseAlpha = p.opacity + (intensity * 0.5);
        const finalAlpha = isHovered ? Math.min(1, baseAlpha * 2) : baseAlpha;
        
        ctx.fillStyle = `rgba(197, 160, 89, ${finalAlpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isActivating]);

  const handleClick = () => {
    if (isActivating) return;
    setIsActivating(true);
    
    setTimeout(() => {
      onActivate();
      setIsActivating(false);
      setIsHovered(false);
    }, 1000);
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
        <canvas 
          ref={canvasRef} 
          className="galaxy-canvas"
          style={{ 
            filter: isActivating ? 'blur(2px) brightness(2)' : isHovered ? 'brightness(1.5)' : 'none',
            transform: isActivating ? 'scale(1.2)' : isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.5s ease-out'
          }}
        />
        
        {/* Central Black Hole Overlay */}
        <div className="galaxy-core-shadow" />
      </motion.div>

      <motion.div 
        className="idle-text"
        animate={{ opacity: isActivating ? 0 : isHovered ? 1 : 0.3 }}
      >
        {isActivating ? "ESTABLISHING LINK..." : isHovered ? "INITIATE STRIKE" : "The void awaits purpose..."}
      </motion.div>

      <style jsx>{`
        .sigil-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
        }

        .sigil-interactive {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-bottom: 1rem;
        }

        .galaxy-canvas {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .galaxy-core-shadow {
          position: absolute;
          width: 30px;
          height: 30px;
          background: radial-gradient(circle, #000 30%, transparent 100%);
          border-radius: 50%;
          box-shadow: inset 0 0 10px #000;
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
