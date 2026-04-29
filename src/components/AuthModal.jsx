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
          backdrop-filter: blur(5px); 
          z-index: 3000; 
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-modal {
          width: 100%;
          max-width: 400px;
          padding: 3rem;
          text-align: center;
          position: relative;
          background: linear-gradient(180deg, #0a0a0f 0%, #050507 100%);
          border: 1px solid var(--border-bright);
          box-shadow: 0 0 100px rgba(0,0,0,0.8);
        }

        .auth-icon { color: var(--gold-core); margin-bottom: 1.5rem; filter: drop-shadow(0 0 10px var(--gold-glow)); }
        .auth-header h2 { font-family: var(--font-display); font-size: 1.5rem; color: #fff; letter-spacing: 0.2em; margin-bottom: 0.5rem; }
        .auth-header p { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dark); letter-spacing: 0.1em; }

        .auth-form { margin-top: 2.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .auth-error { background: rgba(255, 60, 60, 0.1); border: 1px solid var(--red-hot); color: var(--red-hot); padding: 0.75rem; font-size: 0.7rem; border-radius: 4px; display: flex; align-items: center; gap: 0.5rem; }
        
        .auth-input-group { position: relative; display: flex; align-items: center; }
        .auth-input-group :global(svg) { position: absolute; left: 1rem; color: var(--text-dark); pointer-events: none; }
        .auth-input-group input {
          width: 100%;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          padding: 1rem 1rem 1rem 3rem;
          color: #fff;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          border-radius: 4px;
          transition: 0.3s;
        }
        .auth-input-group input:focus { border-color: var(--gold-core); background: rgba(197, 160, 89, 0.05); outline: none; }

        .auth-submit-btn {
          background: var(--gold-core);
          color: #000;
          border: none;
          padding: 1.25rem;
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: 0 0 20px var(--gold-glow);
          transition: 0.3s;
        }
        .auth-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 0 30px var(--gold-glow); }
        .auth-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-footer { margin-top: 2rem; }
        .auth-footer button { background: none; border: none; color: var(--text-dark); font-size: 0.6rem; font-family: var(--font-mono); cursor: pointer; transition: 0.2s; }
        .auth-footer button:hover { color: #fff; }

        .auth-close { position: absolute; top: 1.5rem; right: 1.5rem; background: none; color: var(--text-dark); transition: 0.2s; }
        .auth-close:hover { color: #fff; transform: rotate(90deg); }

        .auth-security-tag { margin-top: 3rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #1a1a1a; font-size: 0.5rem; font-weight: 900; letter-spacing: 0.1em; }
      `}</style>
    </div>
  );
}
