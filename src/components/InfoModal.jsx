import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { infoData } from '../data/infoDescriptions';
import { X, ArrowLeft, ChevronRight, BookOpen } from 'lucide-react';

export default function InfoModal() {
  const {
    showInfoModal,
    infoSectionId,
    infoFeatureId,
    closeInfoModal,
    setInfoFeatureId
  } = useWarscytheStore();

  const activeSection = infoData[infoSectionId];
  const activeFeature = activeSection?.features.find(f => f.id === infoFeatureId);

  // History state management to intercept browser/device back button
  useEffect(() => {
    if (!showInfoModal) return;

    // Push a virtual state to history when modal opens
    window.history.pushState({ infoModal: true }, '');

    const handlePopState = (e) => {
      // Read current state values dynamically from the store to avoid dependency re-runs
      const currentFeatureId = useWarscytheStore.getState().infoFeatureId;
      if (currentFeatureId) {
        // Level 2 -> Level 1
        useWarscytheStore.getState().setInfoFeatureId(null);
        // Push state again to keep user in modal on next back
        window.history.pushState({ infoModal: true }, '');
      } else {
        // Level 1 -> Close Modal
        useWarscytheStore.getState().closeInfoModal();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Clean up the virtual history entry if modal closes via close button
      if (window.history.state?.infoModal) {
        window.history.back();
      }
    };
  }, [showInfoModal]);

  if (!showInfoModal || !activeSection) return null;

  const handleClose = () => {
    closeInfoModal();
  };

  const handleBack = () => {
    if (infoFeatureId) {
      setInfoFeatureId(null);
      // Synchronize address bar hash if active
      if (window.location.hash) {
        window.history.pushState(null, '', ' ');
      }
    } else {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        {/* Background Click to Dismiss */}
        <div className="absolute inset-0 cursor-pointer" onClick={handleClose} />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg min-h-[420px] max-h-[85vh] flex flex-col bg-[#08080a] border border-[#c5a059]/30 rounded shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto"
        >
          {/* Gothic Decorative Corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#c5a059]/40 pointer-events-none" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#c5a059]/40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#c5a059]/40 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#c5a059]/40 pointer-events-none" />

          {/* Modal Header */}
          <header className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-black/40 z-10 shrink-0">
            <div className="flex items-center gap-2">
              {infoFeatureId && (
                <button
                  onClick={handleBack}
                  className="p-1 hover:text-[#c5a059] transition-colors"
                  title="Back"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <h2 className="text-white font-display text-[11px] tracking-[0.25em] uppercase font-black">
                {infoFeatureId ? activeFeature?.title : activeSection.title}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 text-gray-500 hover:text-white transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>
          </header>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10">
            <AnimatePresence mode="wait">
              {!infoFeatureId ? (
                /* Level 1: List of Features */
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col gap-3 py-2"
                >
                  <span className="text-[9.5px] font-mono text-gray-500 uppercase tracking-widest block mb-2">
                    Select a feature to view lore and mechanics:
                  </span>
                  {activeSection.features.map(feat => (
                    <button
                      key={feat.id}
                      onClick={() => setInfoFeatureId(feat.id)}
                      className="w-full text-left p-3.5 border border-white/5 rounded bg-white/[0.01] hover:border-[#c5a059]/30 hover:bg-[#c5a059]/5 transition-all flex items-center justify-between group"
                    >
                      <span className="text-[11px] font-mono text-gray-300 group-hover:text-white font-bold uppercase tracking-wider">
                        {feat.title}
                      </span>
                      <ChevronRight size={12} className="text-gray-600 group-hover:text-[#c5a059] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </motion.div>
              ) : (
                /* Level 2: Feature Detailed View */
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col gap-6 font-mono text-xs text-gray-400"
                >
                  {/* Philosophy Box (Gothic styled blockquote) */}
                  {activeFeature?.philosophy && (
                    <div className="p-4 border-l-2 border-[#c5a059] bg-[#c5a059]/5 rounded-r">
                      <span className="text-[8px] text-[#c5a059] tracking-widest uppercase font-bold block mb-1">Philosophy</span>
                      <p className="text-[10.5px] text-gray-200 uppercase leading-relaxed font-bold">
                        "{activeFeature.philosophy}"
                      </p>
                    </div>
                  )}

                  {/* Use Case */}
                  {activeFeature?.useCase && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[8.5px] text-gray-500 tracking-wider uppercase font-bold">Use Case & Rules</span>
                      <p className="text-[10px] text-gray-400 leading-relaxed uppercase whitespace-pre-line">
                        {activeFeature.useCase}
                      </p>
                    </div>
                  )}

                  {/* Key Points / List Details */}
                  {activeFeature?.keyPoints && activeFeature.keyPoints.length > 0 && (
                    <div className="flex flex-col gap-2.5">
                      <span className="text-[8.5px] text-gray-500 tracking-wider uppercase font-bold">Key Operational Directives</span>
                      <ul className="flex flex-col gap-2">
                        {activeFeature.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex gap-2 items-start text-[9.5px] text-gray-300 uppercase leading-relaxed">
                            <span className="text-[#c5a059] shrink-0 mt-0.5">◇</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* When To Use */}
                  {activeFeature?.whenToUse && activeFeature.whenToUse.length > 0 && (
                    <div className="flex flex-col gap-2.5">
                      <span className="text-[8.5px] text-gray-500 tracking-wider uppercase font-bold">Recommended When</span>
                      <ul className="flex flex-col gap-2">
                        {activeFeature.whenToUse.map((point, idx) => (
                          <li key={idx} className="flex gap-2 items-start text-[9.5px] text-gray-300 uppercase leading-relaxed">
                            <span className="text-[#c5a059] shrink-0 mt-0.5">✦</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* General Lists (Why regions matter, what we believe, etc.) */}
                  {Object.keys(activeFeature).map(key => {
                    if (['id', 'title', 'philosophy', 'useCase', 'keyPoints', 'whenToUse'].includes(key)) return null;
                    const value = activeFeature[key];
                    const friendlyTitle = key.replace(/([A-Z])/g, ' $1').trim();
                    
                    if (Array.isArray(value)) {
                      return (
                        <div key={key} className="flex flex-col gap-2.5">
                          <span className="text-[8.5px] text-gray-500 tracking-wider uppercase font-bold">{friendlyTitle}</span>
                          <ul className="flex flex-col gap-2">
                            {value.map((point, idx) => (
                              <li key={idx} className="flex gap-2 items-start text-[9.5px] text-gray-300 uppercase leading-relaxed">
                                <span className="text-[#c5a059] shrink-0 mt-0.5">◇</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    if (typeof value === 'string') {
                      return (
                        <div key={key} className="flex flex-col gap-2">
                          <span className="text-[8.5px] text-gray-500 tracking-wider uppercase font-bold">{friendlyTitle}</span>
                          <p className="text-[10px] text-gray-400 leading-relaxed uppercase whitespace-pre-line">
                            {value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })}

                  {/* Back Link Button inside detail view */}
                  <button
                    onClick={handleBack}
                    className="mt-4 py-2 px-4 border border-white/10 rounded flex items-center justify-center gap-2 text-[8px] font-mono tracking-widest text-[#c5a059] hover:bg-[#c5a059]/5 hover:border-[#c5a059]/30 transition-all uppercase"
                  >
                    <ArrowLeft size={10} /> Back to features list
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
