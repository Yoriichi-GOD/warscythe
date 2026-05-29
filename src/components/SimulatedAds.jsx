import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ExternalLink, X } from 'lucide-react';

export default function SimulatedAds() {
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const mockAds = [
    {
      title: "IVY LEAGUE ADMISSIONS COUNSEL",
      tagline: "Ace your mechanical major application. Free resume review.",
      action: "APPLY NOW",
      sponsor: "Ad: Harvard & Stanford Prep Consultants"
    },
    {
      title: "SAT / IELTS RED-LINE PREP",
      tagline: "Get a 1550+ score guaranteed. Unlock elite math modules.",
      action: "UPGRADE SCORE",
      sponsor: "Ad: Redline Academy"
    },
    {
      title: "TITAN JAVELIN & TRACK SUPPLIES",
      tagline: "Professional carbon-fiber javelins. Built for national throwers.",
      action: "SHOP GEAR",
      sponsor: "Ad: Titan Athletics"
    },
    {
      title: "AI AGENT AUTOMATION BLUEPRINTS",
      tagline: "Stop building scripts by hand. Automate your workflows in 10 mins.",
      action: "PULL CODE",
      sponsor: "Ad: Antigravity Automation Lab"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAdIndex(idx => (idx + 1) % mockAds.length);
    }, 8000); // Rotate ads every 8 seconds
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const ad = mockAds[activeAdIndex];

  return (
    <div className="simulated-ad-wrapper">
      <div className="ad-header flex justify-between items-center w-full">
        <span className="ad-sponsor flex items-center gap-1 font-mono text-[8px] text-gray-500">
          <ShieldAlert size={8} /> {ad.sponsor}
        </span>
        <button className="ad-close-btn" onClick={() => setIsVisible(false)}>
          <X size={10} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeAdIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className="ad-body mt-2 flex flex-col gap-1.5"
        >
          <span className="ad-title font-bold font-display text-[9px] text-gold-bright tracking-wider">{ad.title}</span>
          <p className="ad-tagline text-[10px] font-mono text-gray-400 leading-normal">{ad.tagline}</p>
          <a href="#simulated-ad-click" onClick={(e) => { e.preventDefault(); alert("Monetization Module: Simulated Ad Click Successful!"); }} className="ad-action-link flex items-center gap-1 font-mono text-[9px] text-gold-core font-bold hover:underline">
            {ad.action} <ExternalLink size={10} />
          </a>
        </motion.div>
      </AnimatePresence>

      <style jsx>{`
        .simulated-ad-wrapper {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          padding: 0.8rem 1rem;
          position: relative;
          box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .ad-close-btn {
          color: rgba(255,255,255,0.2);
          cursor: pointer;
          transition: 0.2s;
        }
        .ad-close-btn:hover {
          color: #fff;
        }
      `}</style>
    </div>
  );
}
