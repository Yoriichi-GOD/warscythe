import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { Fingerprint, ShieldAlert, AlertCircle, ShieldCheck } from 'lucide-react';

export default function UsernameSetup() {
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const setupUsername = useWarscytheStore(state => state.setupUsername);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanUsername = usernameInput.trim();
    if (!cleanUsername) return;

    if (cleanUsername.length < 3) {
      setError('UID must be at least 3 characters long.');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setError('UID can only contain letters, numbers, and underscores.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await setupUsername(cleanUsername);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to claim UID. It might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-backdrop">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="setup-modal glass-panel"
      >
        <div className="setup-header">
          <Fingerprint size={36} className="setup-icon" />
          <h2>IDENTITY DEPLOYMENT</h2>
          <p>ESTABLISH YOUR GLOBAL OPERATIVE SIGNATURE</p>
        </div>

        {error && (
          <div className="setup-error">
            <AlertCircle size={14} className="shrink-0" /> 
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="setup-form">
          <p className="setup-instruction-text">
            No one else can take the same UID. Once registered, your email will remain strictly private and hidden in global rankings and communications.
          </p>

          <div className="setup-input-group">
            <Fingerprint size={16} />
            <input 
              type="text" 
              placeholder="Enter Unique UID (e.g. shadow_reaper)" 
              value={usernameInput}
              onChange={e => {
                setUsernameInput(e.target.value);
                setError(null);
              }}
              required 
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="setup-warning-box">
            <ShieldAlert size={14} className="text-red-500 shrink-0" />
            <span>WARNING: Post-deployment, your unique UID cannot be modified or re-claimed by any other Operative core.</span>
          </div>

          <button type="submit" className="setup-submit-btn" disabled={loading || !usernameInput.trim()}>
            {loading ? 'DEPLOYING SOUL CORE...' : 'CLAIM OPERATIVE IDENTITY'}
          </button>
        </form>

        <div className="setup-security-tag">
          <ShieldCheck size={12} />
          <span>IDENTITY REGISTER ENCRYPTED</span>
        </div>
      </motion.div>

      <style jsx>{`
        .setup-backdrop { 
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85); 
          backdrop-filter: blur(12px); 
          z-index: 4000; 
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .setup-modal {
          width: 100%;
          max-width: 460px;
          padding: 3rem 2.5rem;
          text-align: center;
          position: relative;
          background: rgba(8, 8, 12, 0.96);
          border: 1px solid rgba(197, 160, 89, 0.35);
          box-shadow: 0 0 100px rgba(0,0,0,0.95), 0 0 50px rgba(197,160,89,0.08);
          border-radius: 4px;
        }
        .setup-icon { 
          color: #c5a059; 
          margin-bottom: 1.25rem; 
          filter: drop-shadow(0 0 10px rgba(197,160,89,0.45)); 
        }
        .setup-header h2 { 
          font-family: 'Cinzel', serif; 
          font-size: 1.4rem; 
          color: #fff; 
          letter-spacing: 0.25em; 
          margin-bottom: 0.5rem; 
          text-transform: uppercase; 
        }
        .setup-header p { 
          font-family: 'JetBrains Mono', monospace; 
          font-size: 0.6rem; 
          color: #6b7280; 
          letter-spacing: 0.15em; 
          line-height: 1.4; 
        }
        .setup-instruction-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: #9ca3af;
          line-height: 1.6;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          text-align: left;
        }
        .setup-form { 
          margin-top: 1rem; 
          display: flex; 
          flex-direction: column; 
          gap: 1.25rem; 
        }
        .setup-error { 
          background: rgba(239, 68, 68, 0.08); 
          border: 1px solid rgba(239, 68, 68, 0.4); 
          color: #fca5a5; 
          padding: 0.75rem; 
          font-size: 0.75rem; 
          border-radius: 4px; 
          display: flex; 
          align-items: center; 
          gap: 0.65rem; 
          font-family: 'JetBrains Mono', monospace; 
          text-align: left; 
          margin-top: 1.25rem;
        }
        .setup-input-group { 
          position: relative; 
          display: flex; 
          align-items: center; 
        }
        .setup-input-group :global(svg) { 
          position: absolute; 
          left: 1.25rem; 
          color: rgba(197, 160, 89, 0.4); 
          pointer-events: none; 
        }
        .setup-input-group input {
          width: 100%;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 0.95rem 1rem 0.95rem 3rem;
          color: #fff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          border-radius: 4px;
          transition: 0.25s;
          letter-spacing: 0.05em;
        }
        .setup-input-group input::placeholder { 
          color: rgba(255, 255, 255, 0.15); 
        }
        .setup-input-group input:focus { 
          border-color: #c5a059; 
          background: rgba(197, 160, 89, 0.05); 
          outline: none;
          box-shadow: 0 0 15px rgba(197,160,89,0.15);
        }
        .setup-warning-box {
          background: rgba(239, 68, 68, 0.05);
          border: 1px dashed rgba(239, 68, 68, 0.2);
          padding: 0.85rem;
          border-radius: 4px;
          display: flex;
          gap: 0.65rem;
          align-items: flex-start;
          text-align: left;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: #ef4444;
          line-height: 1.4;
        }
        .setup-submit-btn {
          background: #c5a059;
          color: #000;
          border: none;
          padding: 1.1rem;
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          font-weight: 900;
          letter-spacing: 0.2em;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: 0 0 25px rgba(197,160,89,0.25);
          transition: 0.25s;
          text-transform: uppercase;
        }
        .setup-submit-btn:hover { 
          transform: translateY(-1px); 
          background: #e8d0a0;
          box-shadow: 0 0 35px rgba(197,160,89,0.45); 
        }
        .setup-submit-btn:disabled { 
          opacity: 0.35; 
          cursor: not-allowed; 
          transform: none;
          box-shadow: none;
        }
        .setup-security-tag { 
          margin-top: 2.25rem; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 0.5rem; 
          color: rgba(255,255,255,0.15); 
          font-size: 0.55rem; 
          font-weight: 900; 
          letter-spacing: 0.2em;
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
