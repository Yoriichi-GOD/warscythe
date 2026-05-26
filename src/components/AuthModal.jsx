import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { X, Fingerprint, Mail, Lock, ShieldCheck, Zap } from 'lucide-react';

export default function AuthModal({ onClose, isMandatory = false }) {
  const [isLogin, setIsLogin] = useState(false); // Default to signup first
  const [registered, setRegistered] = useState(false); // Verification state
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
        if (onClose) onClose();
      } else {
        await signUp(email, password);
        setRegistered(true); // Show spam validation check instructions
      }
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
        {registered ? (
          <div className="auth-confirm-container">
            <div className="auth-confirm-header">
              <ShieldCheck size={48} className="auth-confirm-icon" />
              <h2>VERIFICATION SENT</h2>
              <p>CONFIRM YOUR OPERATIVE IDENTITY</p>
            </div>
            
            <div className="auth-confirm-steps">
              <div className="step-item">
                <span className="step-num">1</span>
                <span className="step-text">Open your email inbox.</span>
              </div>
              <div className="step-item warn">
                <span className="step-num">2</span>
                <span className="step-text"><strong>Check both Inbox & Spam/Junk folders</strong> if the mail does not arrive in 2 minutes.</span>
              </div>
              <div className="step-item">
                <span className="step-num">3</span>
                <span className="step-text">Click the verification link inside that email.</span>
              </div>
              <div className="step-item">
                <span className="step-num">4</span>
                <span className="step-text">After verifying, return here and log in below.</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setRegistered(false);
                setIsLogin(true);
              }}
              className="auth-submit-btn confirm-btn"
            >
              Go to Login Page
            </button>
          </div>
        ) : (
          <>
            <div className="auth-header">
              <Fingerprint size={32} className="auth-icon" />
              <h2>WARSCYTHE LINK</h2>
              <p>{isLogin ? 'SIGN IN TO YOUR PROFILE' : 'CREATE NEW OPERATIVE PROFILE'}</p>
            </div>

            {/* High-visibility toggle alert banner */}
            <div className="auth-alert-toggle" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? (
                <span>New to Warscythe? <strong className="toggle-link">Click here to register</strong></span>
              ) : (
                <span>Already registered? <strong className="toggle-link">Click here to sign in</strong></span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && <div className="auth-error"><Zap size={14} /> {error}</div>}
              
              <div className="auth-input-group">
                <Mail size={16} />
                <input 
                  type="email" 
                  placeholder={isLogin ? "Enter Email" : "Enter Email (e.g. name@gmail.com)"} 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="auth-input-group">
                <Lock size={16} />
                <input 
                  type="password" 
                  placeholder={isLogin ? "Enter Password" : "Create Password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'PROCESSING...' : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
              </button>
            </form>
          </>
        )}

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
          padding: 2rem;
          text-align: center;
          position: relative;
          background: rgba(10, 10, 15, 0.95);
          border: 1px solid rgba(197, 160, 89, 0.35);
          box-shadow: 0 0 80px rgba(0,0,0,0.9), 0 0 40px rgba(197,160,89,0.05);
          border-radius: 4px;
        }

        @media (min-width: 640px) {
          .auth-modal { padding: 3.5rem; }
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

        .auth-alert-toggle {
          background: rgba(197, 160, 89, 0.04);
          border: 1px dashed rgba(197, 160, 89, 0.25);
          color: #9ca3af;
          font-size: 0.65rem;
          font-family: 'JetBrains Mono', monospace;
          padding: 0.6rem 1rem;
          margin-top: 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: 0.2s;
        }
        .auth-alert-toggle:hover {
          background: rgba(197, 160, 89, 0.08);
          border-color: #c5a059;
          color: #fff;
        }
        .toggle-link {
          color: #c5a059;
          text-decoration: underline;
          margin-left: 0.25rem;
        }

        .auth-confirm-container {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .auth-confirm-header {
          text-align: center;
        }
        .auth-confirm-icon {
          color: #c5a059;
          margin: 0 auto 1rem auto;
          display: block;
          filter: drop-shadow(0 0 10px rgba(197,160,89,0.4));
        }
        .auth-confirm-steps {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.2rem;
          border-radius: 4px;
        }
        .step-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          font-size: 0.75rem;
          color: #d1d5db;
          line-height: 1.4;
          font-family: 'JetBrains Mono', monospace;
        }
        .step-item.warn {
          color: #fca5a5;
        }
        .step-num {
          background: #c5a059;
          color: #000;
          font-family: 'Cinzel', serif;
          font-weight: 900;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
        }
        .confirm-btn {
          width: 100%;
          margin-top: 0.5rem;
        }

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
