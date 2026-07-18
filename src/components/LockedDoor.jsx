import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function LockedDoor({ requiredTasks, conceptName }) {
  const [isShaking, setIsShaking] = useState(false);

  const handleLockClick = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md border border-red-950/20 select-none animate-fadeIn">
      {/* Decorative Gothic Columns & Arch Frame (Using gate.webp) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-cover bg-center mix-blend-color-dodge transition-opacity duration-700"
        style={{ backgroundImage: `url('/gate.webp')` }}
      />

      {/* Main Locked Shield & Chain Area */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Glowing Ornate Lock WebP with Motion Shaking */}
        <motion.div
          animate={isShaking ? {
            x: [0, -10, 10, -10, 10, -5, 5, 0],
            rotate: [0, -3, 3, -3, 3, -1, 1, 0]
          } : {}}
          transition={{ duration: 0.5 }}
          className="relative cursor-pointer w-36 h-36 drop-shadow-[0_0_20px_rgba(224,130,36,0.3)] hover:drop-shadow-[0_0_30px_rgba(224,130,36,0.5)] active:scale-95 transition-all duration-300"
          onClick={handleLockClick}
        >
          <img 
            src="/lock.webp" 
            alt="Locked" 
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Lock Heading & Requirements */}
        <h3 className="mt-6 font-mono text-xs font-black tracking-widest text-gold-core/90 uppercase">
          {conceptName ? `${conceptName} locked` : 'Locked chamber'}
        </h3>
        
        <p className="mt-2 font-mono text-[10px] tracking-wider text-stone-400 max-w-[280px] leading-relaxed">
          The path forward is barred. Return to active Operations and strike down the threats to break this seal.
        </p>

        {/* Dynamic requirement message */}
        <div className="mt-5 border border-red-500/20 bg-red-950/10 px-4 py-2 rounded shadow-[0_0_10px_rgba(239,68,68,0.05)]">
          <span className="font-mono text-[9px] font-bold tracking-widest text-red-400 uppercase animate-pulse">
            Complete {requiredTasks} tasks to unlock
          </span>
        </div>
      </div>
    </div>
  );
}
