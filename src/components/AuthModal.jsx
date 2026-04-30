import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { X, Fingerprint, Mail, Lock, ShieldCheck, Zap } from 'lucide-react';

export default function AuthModal({ onClose, isMandatory = false }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const signIn = useWarscytheStore(state => state.signIn);
  const signUp = useWarscytheStore(state => state.signUp);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop auth-backdrop" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="auth-modal glass-panel"
        onClick={e => e.stopPropagation()}
      >
        <div className="auth-header">
          <Fingerprint size={32} className="auth-icon" />
          <h2>WARSCYTHE LINK</h2>
          <p>{isLogin ? 'ESTABLISH SECURE CONNECTION' : 'REGISTER NEW OPERATIVE'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error"><Zap size={14} /> {error}</div>}
          
          <div className="auth-input-group">
            <Mail size={16} />
            <input 
              type="email" 
              placeholder="Warscythe@INTEL.COM" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="auth-input-group">
            <Lock size={16} />
            <input 
              type="password" 
              placeholder="PASSCODE" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'ESTABLISHING...' : (isLogin ? 'INITIATE LINK' : 'REGISTER GENETICS')}
          </button>
        </form>

        <div className="auth-footer">
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'NEED NEW CLEARANCE?' : 'ALREADY REGISTERED?'}
          </button>
        </div>

        {!isMandatory && (
          <button className="auth-close" onClick={onClose}><X size={20} /></button>
        )}
        
        <div className="auth-security-tag">
          <ShieldCheck size={12} />
          <span>ENCRYPTED BY WARSCYTHE-X64</span>
        </div>
      </motion.div>

      <style jsx>{`
        .auth-backdrop { 
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6); 
          backdrop-filter: blur(12px); 
          z-index: 3000; 
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .auth-modal {
          width: 100%;
          max-width: 420px;
          padding: 3.5rem;
          text-align: center;
          position: relative;
          background: rgba(10, 10, 15, 0.95);
          border: 1px solid rgba(197, 160, 89, 0.35);
          box-shadow: 0 0 80px rgba(0,0,0,0.9), 0 0 40px rgba(197,160,89,0.05);
          border-radius: 4px;
        }

        .auth-icon { color: #c5a059; margin-bottom: 1.5rem; filter: drop-shadow(0 0 10px rgba(197,160,89,0.4)); }
        .auth-header h2 { font-family: 'Cinzel', serif; font-size: 1.5rem; color: #fff; letter-spacing: 0.25em; margin-bottom: 0.5rem; }
        .auth-header p { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: #6b7280; letter-spacing: 0.15em; }

        .auth-form { margin-top: 2.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .auth-error { background: rgba(255, 60, 60, 0.1); border: 1px solid #ff3c3c; color: #ff3c3c; padding: 0.75rem; font-size: 0.7rem; border-radius: 4px; display: flex; align-items: center; gap: 0.5rem; font-family: 'JetBrains Mono', monospace; }
        
        .auth-input-group { position: relative; display: flex; align-items: center; }
        .auth-input-group :global(svg) { position: absolute; left: 1rem; color: #4a4a4a; pointer-events: none; }
        .auth-input-group input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 1rem 1rem 1rem 3rem;
          color: #fff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          border-radius: 4px;
          transition: 0.3s;
          letter-spacing: 0.05em;
        }
        .auth-input-group input::placeholder { color: #4a4a4a; }
        .auth-input-group input:focus { 
          border-color: #c5a059; 
          background: rgba(197, 160, 89, 0.05); 
          outline: none;
          box-shadow: 0 0 15px rgba(197,160,89,0.1);
        }

        .auth-submit-btn {
          background: #c5a059;
          color: #000;
          border: none;
          padding: 1.25rem;
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          font-weight: 900;
          letter-spacing: 0.2em;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: 0 0 25px rgba(197,160,89,0.3);
          transition: 0.3s;
          text-transform: uppercase;
        }
        .auth-submit-btn:hover { 
          transform: translateY(-2px); 
          background: #e8d0a0;
          box-shadow: 0 0 40px rgba(197,160,89,0.5); 
        }
        .auth-submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .auth-footer { margin-top: 2rem; }
        .auth-footer button { 
          background: none; 
          border: none; 
          color: #6b7280; 
          font-size: 0.65rem; 
          font-family: 'JetBrains Mono', monospace; 
          cursor: pointer; 
          transition: 0.2s;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .auth-footer button:hover { color: #c5a059; }

        .auth-close { position: absolute; top: 1.5rem; right: 1.5rem; background: none; color: #4a4a4a; transition: 0.2s; border: none; cursor: pointer; }
        .auth-close:hover { color: #fff; transform: rotate(90deg); }

        .auth-security-tag { 
          margin-top: 2.5rem; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 0.5rem; 
          color: rgba(255,255,255,0.15); 
          font-size: 0.5rem; 
          font-weight: 900; 
          letter-spacing: 0.15em;
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
