import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Trophy } from 'lucide-react';

export default function BossFlashScreen({ type, onClose }) {
  const config = {
    initiate: {
      image: '/boss-kill/boss-initiate-screen.png',
      mobileImage: '/boss-kill/boss-initiate-screen-mobile.png',
      icon: <ShieldAlert className="text-red-500 animate-pulse" size={24} />,
      title: 'BOSS RAID INITIATED',
      subtitle: 'THE DREAD WYRM MALGRATH AWAITS',
      desc: 'A generating force of supreme cognitive resistance has manifested. The volcano caldera boils. Deploy your strategies, execute your micro-operations, and show no quarter.',
      glowColor: 'rgba(255, 60, 60, 0.6)',
      titleColor: '#ff3c3c'
    },
    victory: {
      image: '/boss-kill/boss-kill-screen.png',
      mobileImage: '/boss-kill/boss-kill-screen-mobile.png',
      icon: <Trophy className="text-gold-core" size={24} />,
      title: 'BOSS CONQUERED',
      subtitle: 'MALGRATH THE DREAD HAS FALLEN',
      desc: 'Your relentless focus has cut through the paralysis. The volcanics settle. The dragon is slain, and its essence is harvested. Claim your mythic reward.',
      glowColor: 'rgba(236, 200, 128, 0.6)',
      titleColor: '#ecc880'
    }
  };

  const screen = config[type] || config.initiate;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[2000] bg-black select-none pointer-events-auto overflow-hidden flex items-center justify-start"
    >
      {/* 1. Cinematic Background Image Layer */}
      <motion.div 
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.03, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-cover bg-center bg-cinematic"
        style={{ 
          '--bg-desktop': `url('${screen.image}')`,
          '--bg-mobile': `url('${screen.mobileImage}')`
        }}
      />

      {/* 2. Heavy Vignette for Dramatic Focus */}
      <div className="absolute inset-0 z-10 bg-radial-vignette pointer-events-none" />

      {/* 3. Scanning Scanline Effect */}
      <div className="absolute inset-0 z-15 pointer-events-none scanner-line" />

      {/* 4. Left-Aligned Text Overlay (Negative Space) */}
      <motion.div 
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="relative z-20 pl-[8%] pr-6 max-w-[90%] sm:max-w-[70%] md:max-w-[50%] lg:max-w-[45%] flex flex-col gap-4 text-left tactical-text-container"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center p-2 bg-black/60 border border-white/10 rounded-sm">
            {screen.icon}
          </div>
          <span className="font-mono text-[8px] tracking-[0.3em] text-gray-400 uppercase">
            COGNITIVE STRIKE FORCE
          </span>
        </div>

        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-display font-black leading-tight uppercase"
          style={{ 
            color: screen.titleColor,
            textShadow: `0 0 25px ${screen.glowColor}`
          }}
        >
          {screen.title}
        </h1>

        <h3 className="font-mono text-xs sm:text-sm text-white tracking-[0.2em] uppercase font-bold border-l-2 pl-3" style={{ borderColor: screen.titleColor }}>
          {screen.subtitle}
        </h3>

        <p className="font-main text-xs sm:text-sm text-gray-300/80 leading-relaxed italic pr-4">
          "{screen.desc}"
        </p>

        {/* Cinematic Loading Progress Line */}
        <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden mt-4">
          <motion.div 
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            style={{ 
              background: `linear-gradient(to right, transparent, ${screen.titleColor}, transparent)` 
            }}
          />
        </div>
      </motion.div>

      {/* 5. Bottom-Right Continue Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        onClick={onClose}
        className="absolute bottom-8 right-8 z-30 font-display text-xs sm:text-sm tracking-[0.2em] uppercase font-bold py-3 px-8 rounded-sm bg-black/80 cursor-pointer border transition-all duration-300 pointer-events-auto continue-btn-mobile"
        style={{
          borderColor: screen.titleColor,
          color: screen.titleColor,
          boxShadow: `0 0 15px ${screen.glowColor}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = screen.titleColor;
          e.currentTarget.style.color = '#000';
          e.currentTarget.style.boxShadow = `0 0 25px ${screen.titleColor}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
          e.currentTarget.style.color = screen.titleColor;
          e.currentTarget.style.boxShadow = `0 0 15px ${screen.glowColor}`;
        }}
      >
        CONTINUE
      </motion.button>

      <style jsx>{`
        .bg-radial-vignette {
          background: radial-gradient(circle at 30% 50%, transparent 20%, rgba(0,0,0,0.85) 100%);
        }
        .scanner-line {
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%, 
            rgba(0, 0, 0, 0.25) 50%
          ), linear-gradient(
            90deg, 
            rgba(255, 0, 0, 0.06), 
            rgba(0, 255, 0, 0.02), 
            rgba(0, 0, 255, 0.06)
          );
          background-size: 100% 4px, 6px 100%;
          opacity: 0.15;
        }
        .bg-cinematic {
          background-image: var(--bg-desktop);
        }
        @media (max-width: 768px), (max-aspect-ratio: 1/1) {
          .bg-cinematic {
            background-image: var(--bg-mobile);
          }
          .tactical-text-container {
            padding-left: 6% !important;
            max-width: 88% !important;
          }
          .continue-btn-mobile {
            right: 6% !important;
            bottom: 6% !important;
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
