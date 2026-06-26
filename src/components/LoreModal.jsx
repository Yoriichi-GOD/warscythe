import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { REGIONS } from '../store/constants';
import { X, BookOpen, Lock, ChevronLeft, ChevronRight, Scroll } from 'lucide-react';
import { getLore } from '../store/useWarscytheStore';

export default function LoreModal({ onClose }) {
  const { level, unlockedLore } = useWarscytheStore();
  const maxRegionIndex = level - 1;

  const [selectedRegionIdx, setSelectedRegionIdx] = useState(maxRegionIndex);
  const [selectedPageIdx, setSelectedPageIdx] = useState(0);

  const region = REGIONS[selectedRegionIdx] || REGIONS[0];
  const regionLore = getLore(selectedRegionIdx) || [];
  
  // Unlocked pages for selected region (max 5)
  const unlockedPages = unlockedLore[selectedRegionIdx] || [];

  const handlePrevRegion = () => {
    if (selectedRegionIdx > 0) {
      setSelectedRegionIdx(selectedRegionIdx - 1);
      setSelectedPageIdx(0);
    }
  };

  const handleNextRegion = () => {
    if (selectedRegionIdx < maxRegionIndex) {
      setSelectedRegionIdx(selectedRegionIdx + 1);
      setSelectedPageIdx(0);
    }
  };

  // 5 pages per region
  const totalPages = 5;

  return (
    <div className="modal-backdrop scroll-modal-backdrop" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="scroll-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scroll Roller Top */}
        <div className="scroll-roller top-roller">
          <img src="/scroll-roller-top.png" alt="" onError={(e) => { e.target.style.display = 'none'; }} />
        </div>

        {/* Scroll Body */}
        <div className="scroll-body-parchment">
          {/* Close Button */}
          <button className="scroll-close" onClick={onClose}>
            <X size={18} />
          </button>

          {/* Region Navigator */}
          <div className="scroll-header-nav">
            <button 
              onClick={handlePrevRegion} 
              disabled={selectedRegionIdx === 0}
              className="scroll-nav-btn"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="scroll-region-title">
              <span className="scroll-region-subtitle">Region {selectedRegionIdx + 1}</span>
              <h2>{selectedRegionIdx > maxRegionIndex ? '???' : region.name.toUpperCase()}</h2>
            </div>
            <button 
              onClick={handleNextRegion} 
              disabled={selectedRegionIdx === maxRegionIndex}
              className="scroll-nav-btn"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Page Selector Tabs */}
          <div className="scroll-page-tabs">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const isPageUnlocked = idx < unlockedPages.length;
              const isSelected = idx === selectedPageIdx;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedPageIdx(idx)}
                  className={`scroll-tab ${isSelected ? 'active' : ''} ${!isPageUnlocked ? 'locked' : ''}`}
                >
                  {isPageUnlocked ? (
                    <span className="tab-roman">{['I', 'II', 'III', 'IV', 'V'][idx]}</span>
                  ) : (
                    <Lock size={10} className="tab-lock-icon" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Lore Scroll Content */}
          <div className="scroll-content-container">
            <AnimatePresence mode="wait">
              {selectedPageIdx < unlockedPages.length ? (
                <motion.div
                  key={`${selectedRegionIdx}-${selectedPageIdx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="scroll-page-text font-serif"
                >
                  <div className="text-decor-ornament">❖</div>
                  <p>
                    {unlockedPages[selectedPageIdx] || regionLore[selectedPageIdx] || "No records exist."}
                  </p>
                  <div className="text-decor-ornament-footer">◇</div>
                </motion.div>
              ) : (
                <motion.div
                  key="locked-page"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="scroll-page-locked"
                >
                  <Lock size={32} className="scroll-lock-large text-amber-900/40" />
                  <p className="font-serif">This page remains rolled and sealed.</p>
                  <span className="font-mono">Execute operations in this region to unlock this section.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress marker */}
          <div className="scroll-footer-progress font-mono">
            RECOVERED {unlockedPages.length} / {totalPages} PAGES
          </div>
        </div>

        {/* Scroll Roller Bottom */}
        <div className="scroll-roller bottom-roller">
          <img src="/scroll-roller-bottom.png" alt="" onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
      </motion.div>

      <style jsx global>{`
        .scroll-modal-backdrop {
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem 1rem;
          box-sizing: border-box;
        }

        .scroll-container {
          position: relative;
          width: 90vw;
          max-width: 330px;
          margin: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          filter: drop-shadow(0 20px 45px rgba(0,0,0,0.9));
        }

        @media (max-height: 720px) {
          .scroll-container {
            max-width: 270px;
          }
        }

        .scroll-roller {
          width: 114%;
          aspect-ratio: 5.8 / 1;
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: transparent;
          border: none;
          box-shadow: none;
        }

        .top-roller {
          margin-bottom: -18px;
        }

        .bottom-roller {
          margin-top: -18px;
        }

        .scroll-roller img {
          width: 100%;
          height: auto;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .scroll-body-parchment {
          position: relative;
          z-index: 5;
          width: 100%;
          aspect-ratio: 9 / 16;
          background: transparent;
          background-image: url('/scroll-paper.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center;
          padding: 3.5rem 2.2rem 3rem 2.2rem;
          color: #2b1a10;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
        }

        .scroll-close {
          position: absolute;
          top: 1rem;
          right: 1.25rem;
          background: none;
          border: none;
          color: #5a3c20;
          opacity: 0.6;
          cursor: pointer;
          transition: 0.2s;
        }

        .scroll-close:hover {
          opacity: 1;
          transform: scale(1.1);
        }

        .scroll-header-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px double rgba(90, 60, 32, 0.2);
          padding-bottom: 0.75rem;
          margin-bottom: 1rem;
        }

        .scroll-nav-btn {
          background: rgba(90, 60, 32, 0.05);
          border: 1px solid rgba(90, 60, 32, 0.15);
          color: #5a3c20;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }

        .scroll-nav-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }

        .scroll-nav-btn:hover:not(:disabled) {
          background: rgba(90, 60, 32, 0.1);
          border-color: #5a3c20;
        }

        .scroll-region-title {
          text-align: center;
        }

        .scroll-region-subtitle {
          font-family: var(--font-mono);
          font-size: 8px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8c6a4a;
          display: block;
        }

        .scroll-region-title h2 {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          color: #4a2f1b;
          margin-top: 2px;
        }

        .scroll-page-tabs {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-bottom: 1.5rem;
        }

        .scroll-tab {
          background: rgba(90, 60, 32, 0.05);
          border: 1px solid rgba(90, 60, 32, 0.2);
          color: #5a3c20;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
          border-radius: 4px;
        }

        .scroll-tab.active {
          background: #4a2f1b;
          color: #f2e2ce;
          border-color: #4a2f1b;
          box-shadow: 0 2px 6px rgba(74, 47, 27, 0.25);
        }

        .scroll-tab.locked {
          opacity: 0.4;
          background: rgba(90, 60, 32, 0.02);
          border-style: dashed;
        }

        .tab-roman {
          font-family: 'Times New Roman', serif;
          font-weight: bold;
          font-size: 12px;
        }

        .scroll-content-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 180px;
          padding: 0 0.5rem;
        }

        .scroll-page-text {
          text-align: center;
        }

        .text-decor-ornament {
          font-size: 14px;
          color: #8c6a4a;
          margin-bottom: 0.75rem;
        }

        .text-decor-ornament-footer {
          font-size: 10px;
          color: #8c6a4a;
          margin-top: 0.75rem;
        }

        .scroll-page-text p {
          font-size: 14px;
          line-height: 1.65;
          font-style: italic;
          font-weight: 700;
          color: #1a0b02;
          text-shadow: 0.5px 0.5px 0px rgba(255, 255, 255, 0.15);
        }

        .scroll-page-locked {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .scroll-page-locked p {
          font-size: 13px;
          font-weight: 700;
          color: #4e2e18;
          margin-top: 0.5rem;
        }

        .scroll-page-locked span {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #6b4d36;
          text-transform: uppercase;
        }

        .scroll-footer-progress {
          font-size: 8px;
          letter-spacing: 0.1em;
          color: #8c6a4a;
          text-align: center;
          margin-top: 1.5rem;
          border-top: 1px solid rgba(90, 60, 32, 0.1);
          padding-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
