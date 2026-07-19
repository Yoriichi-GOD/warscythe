import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function LockedDoor({ requiredTasks, conceptName }) {
  const [isShaking, setIsShaking] = useState(false);

  const handleLockClick = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    // Semi-transparent overlay — page content behind shows through faintly
    <div className="absolute inset-0 z-50 min-h-[calc(100dvh-157px)] flex flex-col items-center justify-center bg-black/50 backdrop-blur-[1px] select-none animate-fadeIn">
      
      {/* 🖥️ DESKTOP/LAPTOP LAYOUT (Hidden on mobile) */}
      <div className="hidden lg:block absolute inset-0 w-full h-full">
        <motion.div 
          animate={isShaking ? {
            x: [0, -10, 10, -10, 10, -5, 5, 0],
            rotate: [0, -0.5, 0.5, -0.5, 0.5, 0]
          } : {}}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer"
          onClick={handleLockClick}
        >
          {/* Gate image covers the full window */}
          <img 
            src="/gate.webp" 
            alt="Locked Gate" 
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          
          {/* Requirement card centered on top of the gate */}
          <div className="relative z-10 flex flex-col items-center p-5 bg-black/95 border border-gold-core/25 rounded-md shadow-[0_15px_50px_rgba(0,0,0,0.98)] max-w-[280px]">
            <h3 className="font-mono text-[10px] font-black tracking-widest text-gold-core/90 uppercase">
              {conceptName ? `${conceptName} locked` : 'Locked chamber'}
            </h3>
            <p className="mt-1.5 font-mono text-[8px] tracking-wider text-stone-400 leading-relaxed">
              The path forward is barred. Return to active Operations and strike down the threats to break this seal.
            </p>
            <div className="mt-3 border border-red-500/25 bg-red-950/30 px-3 py-1.5 rounded">
              <span className="font-mono text-[8px] font-bold tracking-widest text-red-400 uppercase animate-pulse">
                Complete {requiredTasks} tasks to unlock
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 📱 PHONE LAYOUT (Hidden on desktop) */}
      <div className="flex lg:hidden flex-col items-center max-w-sm px-6 text-center">
        <motion.div
          animate={isShaking ? {
            x: [0, -10, 10, -10, 10, -5, 5, 0],
            rotate: [0, -3, 3, -3, 3, -1, 1, 0]
          } : {}}
          transition={{ duration: 0.5 }}
          className="relative cursor-pointer w-28 h-28 drop-shadow-[0_0_20px_rgba(224,130,36,0.3)] active:scale-95"
          onClick={handleLockClick}
        >
          <img 
            src="/lock.webp" 
            alt="Locked" 
            className="w-full h-full object-contain"
          />
        </motion.div>

        <h3 className="mt-4 font-mono text-xs font-black tracking-widest text-gold-core/90 uppercase">
          {conceptName ? `${conceptName} locked` : 'Locked chamber'}
        </h3>
        
        <p className="mt-2 font-mono text-[9px] tracking-wider text-stone-400 leading-relaxed">
          The path forward is barred. Return to active Operations and strike down the threats to break this seal.
        </p>

        <div className="mt-4 border border-red-500/20 bg-red-950/10 px-4 py-2 rounded">
          <span className="font-mono text-[9px] font-bold tracking-widest text-red-400 uppercase animate-pulse">
            Complete {requiredTasks} tasks to unlock
          </span>
        </div>
      </div>

    </div>
  );
}
