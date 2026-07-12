import React from 'react';
import { motion } from 'framer-motion';
import { getAssetUrl } from '../utils/assetResolver';

export default function TutorialEndFlash({ onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 select-none"
    >
      <div className="flex flex-col items-center max-w-md text-center gap-8">
        {/* Guardian Angel Image */}
        <motion.img 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          src={getAssetUrl('/guardian-observer.png')}
          alt="Guardian Observer"
          className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_0_30px_rgba(197,160,89,0.25)]"
        />

        {/* Dialogue Box */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col gap-3 font-serif"
        >
          <span className="text-[9px] font-mono tracking-[0.3em] text-gold-core uppercase">GUARDIAN</span>
          
          <div className="flex flex-col gap-1.5 text-white/90 text-sm md:text-base leading-relaxed italic font-medium">
            <p>Good.</p>
            <p>You know enough.</p>
            <p>The rest isn't taught.</p>
            <p className="text-gold-core font-bold not-italic tracking-wider uppercase text-base md:text-lg mt-1">It's executed.</p>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          onClick={onClose}
          className="mt-4 font-mono text-[10px] tracking-[0.2em] text-gold-core hover:text-white uppercase border border-gold-core/30 hover:border-white px-8 py-3 rounded bg-black/40 hover:bg-gold-core/10 cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(197,160,89,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          EXECUTE PROTOCOL
        </motion.button>
      </div>
    </motion.div>
  );
}
