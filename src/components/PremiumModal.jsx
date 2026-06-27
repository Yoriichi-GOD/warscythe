import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { X, ShieldAlert, Zap, Sparkles, ShieldCheck, Lock, Loader2, Info } from 'lucide-react';

export default function PremiumModal({ onClose, onOpenAuth }) {
  const { user, isAdFree, initiateSubscription } = useWarscytheStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    try {
      await initiateSubscription();
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Upgrade failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop premium-backdrop" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="premium-modal-content glass-panel"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="premium-header">
          <div className="flex items-center gap-2">
            <Sparkles className="text-gold animate-pulse" size={18} />
            <span className="premium-subtitle font-mono text-[9px] tracking-[0.3em] text-gold-core">ELITE PROTOCOL</span>
          </div>
          <button className="premium-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Content */}
        <div className="premium-body custom-scrollbar">
          {success || isAdFree ? (
            <div className="premium-success-state text-center py-8">
              <div className="flex justify-center mb-6">
                <div className="success-badge-glow">
                  <ShieldCheck size={64} className="text-gold animate-bounce" />
                </div>
              </div>
              <h2 className="cinzel-title text-2xl font-bold text-white tracking-widest mb-3">ELITE UNLOCKED</h2>
              <p className="font-mono text-[10px] text-gold-core/90 tracking-widest uppercase mb-4">PROTOCOL SYNCHRONIZATION SUCCESSFUL</p>
              <div className="success-divider mb-6" />
              <p className="text-gray-400 text-xs leading-relaxed max-w-sm mx-auto mb-8 font-mono">
                ALL DEPLOYMENT DELAYS AND AD INTRUSIONS HAVE BEEN PERMANENTLY DESTRUCTED. THE COGNITIVE REAPING ENGINE IS RUNNING AT UNLIMITED BANDWIDTH.
              </p>
              <button className="premium-confirm-btn" onClick={onClose}>
                CONFIRM OPERATIVE PRIVILEGE
              </button>
            </div>
          ) : (
            <div className="premium-upgrade-state">
              {/* Lore Intro */}
              <div className="text-center mb-8">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <h2 className="cinzel-title text-2xl font-bold text-white tracking-widest">WARSCYTHE ELITE</h2>
                  <button 
                    type="button"
                    onClick={() => useWarscytheStore.getState().openInfoModal('monetization')}
                    className="text-gray-500 hover:text-gold-core transition-colors"
                    title="Monetization Info"
                  >
                    <Info size={14} />
                  </button>
                </div>
                <p className="font-mono text-[8px] text-gray-500 tracking-[0.25em] uppercase">MONETIZATION COGNITIVE RE-SCHEDULER</p>
              </div>

              {/* Benefits */}
              <div className="flex flex-col gap-4 mb-8">
                <div className="benefit-card flex gap-4 p-4 rounded-md border border-white/5 bg-white/[0.01] hover:border-gold-core/20 transition-all duration-300">
                  <div className="benefit-icon-box flex items-center justify-center bg-gold-core/5 text-gold-core rounded-md w-10 h-10 border border-gold-core/10">
                    <Zap size={20} className="glow-icon" />
                  </div>
                  <div className="benefit-info">
                    <h4 className="text-xs font-bold font-mono tracking-wider text-white uppercase mb-1">NO AD DELAYS</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
                      Instantly validate executions, start strikes, and navigate between Ledger and Forge without forced interstitial ad halts.
                    </p>
                  </div>
                </div>

                <div className="benefit-card flex gap-4 p-4 rounded-md border border-white/5 bg-white/[0.01] hover:border-gold-core/20 transition-all duration-300">
                  <div className="benefit-icon-box flex items-center justify-center bg-gold-core/5 text-gold-core rounded-md w-10 h-10 border border-gold-core/10">
                    <ShieldCheck size={20} className="glow-icon" />
                  </div>
                  <div className="benefit-info">
                    <h4 className="text-xs font-bold font-mono tracking-wider text-white uppercase mb-1">SUPPORT DEVELOPMENT</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
                      Fund the continuous development of the Warscythe engine, ensuring ad-free productivity and premium feature updates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Context */}
              <div className="text-center font-mono text-[9px] text-gray-500 tracking-wider mb-6">
                MONTHLY RECURRING RITUAL // CANCEL ANYTIME
              </div>

              {/* Error Alert */}
              {error && (
                <div className="error-box flex items-center gap-2 p-3 bg-red-950/20 border border-red-500/20 rounded-md text-red-400 font-mono text-[10px] uppercase mb-6">
                  <ShieldAlert size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* CTA Section */}
              {!user ? (
                <div className="auth-fallback-box border border-dashed border-white/10 rounded-md p-6 text-center bg-black/40">
                  <Lock className="mx-auto text-gray-500 mb-3" size={24} />
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4">
                    Link Operative Profile to Purchase
                  </p>
                  <button 
                    className="premium-action-btn font-mono" 
                    onClick={() => {
                      onClose();
                      onOpenAuth();
                    }}
                  >
                    SIGN IN TO LINK ACCOUNT
                  </button>
                </div>
              ) : (
                <button 
                  className={`premium-action-btn font-mono flex items-center justify-center gap-2 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={handleUpgrade}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-black" />
                      <span>SYNCHRONIZING PROTOCOLS...</span>
                    </>
                  ) : (
                    <span>ACTIVATE ELITE STATUS</span>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* CSS Styling scoped to PremiumModal */}
        <style jsx>{`
          .premium-backdrop {
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(12px);
            z-index: 2200;
          }

          .premium-modal-content {
            width: 90vw;
            max-width: 500px;
            background: #08080a;
            border: 1px solid var(--border-bright);
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 0 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(197, 160, 89, 0.05);
            padding: 1.5rem;
          }

          .premium-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
            padding-bottom: 1rem;
            margin-bottom: 1.5rem;
          }

          .premium-close {
            background: none;
            color: var(--text-dark);
            transition: 0.2s;
            border: none;
            cursor: pointer;
          }

          .premium-close:hover {
            color: #fff;
            transform: rotate(90deg);
          }

          .cinzel-title {
            font-family: 'Cinzel Decorative', 'Cinzel', serif;
            text-shadow: 0 0 10px rgba(236, 200, 128, 0.2);
          }

          .benefit-icon-box {
            box-shadow: inset 0 0 10px rgba(236, 200, 128, 0.05);
          }

          .glow-icon {
            filter: drop-shadow(0 0 6px var(--gold-core));
          }

          .premium-action-btn {
            width: 100%;
            background: var(--gold-core);
            color: #000;
            border: none;
            border-radius: 6px;
            padding: 0.85rem;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 15px rgba(236, 200, 128, 0.2);
          }

          .premium-action-btn:hover {
            background: #fff;
            box-shadow: 0 0 25px rgba(255, 255, 255, 0.4);
            transform: translateY(-1px);
          }

          .success-badge-glow {
            position: relative;
            display: inline-flex;
          }

          .success-badge-glow::after {
            content: '';
            position: absolute;
            inset: -15px;
            background: radial-gradient(circle, rgba(236, 200, 128, 0.2) 0%, transparent 70%);
            z-index: -1;
            filter: blur(5px);
          }

          .success-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(236, 200, 128, 0.2), transparent);
            width: 100%;
          }

          .premium-confirm-btn {
            background: transparent;
            border: 1px solid var(--gold-core);
            color: var(--gold-core);
            padding: 0.75rem 1.5rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 9px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .premium-confirm-btn:hover {
            background: rgba(236, 200, 128, 0.05);
            box-shadow: 0 0 15px rgba(236, 200, 128, 0.15);
          }
        `}</style>
      </motion.div>
    </div>
  );
}
