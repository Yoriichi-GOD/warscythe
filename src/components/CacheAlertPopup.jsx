import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CloudDownload } from 'lucide-react';

export default function CacheAlertPopup({ regionId, onClose, onOpenDownloader }) {
  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/85 backdrop-blur-sm tactical-popup-backdrop" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="tactical-popup-panel bg-black border border-[#ff4444]/30 rounded-md p-6 max-w-sm w-full mx-4 shadow-[0_0_40px_rgba(255,68,68,0.15)] font-mono text-[9px] uppercase tracking-wider text-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-full border border-[#ff4444]/40 bg-[#ff4444]/5 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <AlertTriangle className="text-[#ff4444]" size={20} />
        </div>

        {/* Header */}
        <h3 className="text-white text-xs font-bold tracking-widest mb-1 font-times">TACTICAL CACHE EMPTY</h3>
        <p className="text-[#ff4444]/70 text-[8px] tracking-[0.2em] mb-4">ASSET STREAM ERROR</p>

        {/* Description */}
        <p className="text-gray-400 leading-normal font-medium normal-case mb-5 px-2">
          The requested region asset is not cached locally on this device. Connect to the internet, or download the resource bundle under the cache settings for offline gameplay.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-2 w-full">
          <button 
            onClick={() => {
              onOpenDownloader();
              onClose();
            }}
            className="w-full bg-[#ecc880] text-black font-bold py-2.5 rounded shadow-[0_0_15px_rgba(236,200,128,0.25)] hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CloudDownload size={12} />
            <span>OPEN CACHE CORE</span>
          </button>
          <button 
            onClick={onClose}
            className="w-full border border-white/10 text-gray-400 font-bold py-2.5 rounded hover:bg-white/5 transition-all cursor-pointer"
          >
            DISMISS
          </button>
        </div>
      </motion.div>
    </div>
  );
}
