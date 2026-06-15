import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { X, Fingerprint, Mail, Lock, ShieldCheck, Zap, ArrowLeft, AlertCircle } from 'lucide-react';

export default function AuthModal({ onClose, isMandatory = false, initialScreen = 'options' }) {
  const user = useWarscytheStore(state => state.user);
  
  // States: 'options', 'email_login', 'email_signup', 'forgot_password', 'reset_password'
  const [activeScreen, setActiveScreen] = useState(initialScreen);
  const [registered, setRegistered] = useState(false); // Email verification state
  const [termsAccepted, setTermsAccepted] = useState(false); // Compliance agreement check
  
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const signIn = useWarscytheStore(state => state.signIn);
  const signUp = useWarscytheStore(state => state.signUp);
  const sendPasswordResetEmail = useWarscytheStore(state => state.sendPasswordResetEmail);
  const updatePassword = useWarscytheStore(state => state.updatePassword);
  const signInWithProvider = useWarscytheStore(state => state.signInWithProvider);

  const handleBack = () => {
    setError(null);
    if (activeScreen === 'forgot_password') {
      setActiveScreen('email_login');
    } else {
      setActiveScreen('options');
    }
  };

  const handleEmailLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signUp(email, password);
      setRegistered(true);
    } catch (err) {
      setError(err.message || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(email);
      alert("Password reset link sent! Please check your inbox and spam folders.");
      setActiveScreen('email_login');
    } catch (err) {
      setError(err.message || 'Failed to send recovery link');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithProvider(provider);
    } catch (err) {
      setError(err.message || `OAuth initialization failed`);
      setLoading(false);
    }
  };

  const getScreenTitle = () => {
    switch (activeScreen) {
      case 'email_login':
        return { title: 'EMAIL ENTRY', sub: 'SIGN IN TO YOUR OPERATIVE PROFILE' };
      case 'email_signup':
        return { title: 'CREATE PROFILE', sub: 'REGISTER NEW OPERATIVE ID' };
      case 'forgot_password':
        return { title: 'RECOVER IDENTITY', sub: 'REQUEST PASSWORD RESET LINK' };
      case 'reset_password':
        return { title: 'RESET PASSWORD', sub: 'SECURE YOUR OPERATIVE PROFILE' };
      default:
        return { title: 'WARSCYTHE LINK', sub: user ? 'RE-AUTHENTICATE OPERATIVE PROFILE' : 'CHOOSE YOUR PATH OF ENTRY' };
    }
  };

  const { title, sub } = getScreenTitle();

  return (
    <div className="modal-backdrop auth-backdrop" onClick={!isMandatory ? onClose : undefined}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="auth-modal glass-panel"
        onClick={e => e.stopPropagation()}
      >
        {/* Back Button */}
        {activeScreen !== 'options' && activeScreen !== 'reset_password' && !registered && (
          <button className="auth-back-btn" onClick={handleBack} title="Back to Options">
            <ArrowLeft size={16} />
            <span>BACK</span>
          </button>
        )}

        {/* Close Button */}
        {!isMandatory && (
          <button className="auth-close" onClick={onClose} title="Close Portal"><X size={20} /></button>
        )}

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
                <span className="step-text">After verifying, return here and log in.</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setRegistered(false);
                setActiveScreen('email_login');
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
              <h2>{title}</h2>
              <p>{sub}</p>
            </div>

            {error && <div className="auth-error"><AlertCircle size={14} /> {error}</div>}

            {activeScreen === 'options' && (
              <div className="auth-options-list">
                {/* Google Button */}
                <button 
                  className="auth-option-btn google"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={loading || !termsAccepted}
                >
                  <svg className="auth-btn-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.43-.28-.79-.63-1.07-1.07V7.06z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Apple Button */}
                <button 
                  className="auth-option-btn apple"
                  onClick={() => handleOAuthLogin('apple')}
                  disabled={loading || !termsAccepted}
                >
                  <svg className="auth-btn-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.79 16.32 3.1 9.94 6.78 6.44c1.78-1.7 3.75-1.58 4.88-.95 1.48.82 2.16.8 3.18 0 1.04-.82 2.85-.92 4.36.48 3.32 2.76 2.5 8.7-2.15 14.31zm-1.87-16.1c.42-.48.66-1.12.56-1.76-.56.02-1.24.34-1.68.84-.4.46-.66 1.1-.56 1.74.62.06 1.26-.26 1.68-.82z"/>
                  </svg>
                  <span>Continue with Apple</span>
                </button>

                {/* Email Button */}
                <button 
                  className="auth-option-btn email"
                  onClick={() => setActiveScreen('email_login')}
                  disabled={loading || !termsAccepted}
                >
                  <Mail size={16} className="auth-btn-icon" />
                  <span>Continue with Email</span>
                </button>

                <div className="auth-disclaimer-container">
                  <label className="auth-disclaimer-label">
                    <input 
                      type="checkbox" 
                      checked={termsAccepted} 
                      onChange={e => setTermsAccepted(e.target.checked)}
                      className="auth-terms-checkbox"
                    />
                    <span className="auth-disclaimer-text">
                      By continuing, you agree to our{' '}
                      <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                      {' '}and{' '}
                      <a 
                        href="#" 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          alert("Terms & Conditions:\n\n1. Do your daily work.\n2. Do not cheat yourself.\n3. Keep your focus high.\n4. Warscythe is built for ultimate productivity."); 
                        }}
                      >
                        Terms & Conditions
                      </a>.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {activeScreen === 'email_login' && (
              <form onSubmit={handleEmailLoginSubmit} className="auth-form">
                <div className="auth-input-group">
                  <Mail size={16} />
                  <input 
                    type="email" 
                    placeholder="Enter Email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required 
                    disabled={loading}
                  />
                </div>

                <div className="auth-input-group">
                  <Lock size={16} />
                  <input 
                    type="password" 
                    placeholder="Enter Password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required 
                    disabled={loading}
                  />
                </div>

                <div className="auth-forgot-link">
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveScreen('forgot_password'); }}>
                    Forgot Password?
                  </a>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? 'PROCESSING...' : 'SIGN IN'}
                </button>

                <div className="auth-footer-links">
                  <span>New Operative?</span>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveScreen('email_signup'); }}>
                    Register Here
                  </a>
                </div>
              </form>
            )}

            {activeScreen === 'email_signup' && (
              <form onSubmit={handleEmailSignupSubmit} className="auth-form">
                <div className="auth-input-group">
                  <Mail size={16} />
                  <input 
                    type="email" 
                    placeholder="Enter Email (e.g. name@gmail.com)" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required 
                    disabled={loading}
                  />
                </div>

                <div className="auth-input-group">
                  <Lock size={16} />
                  <input 
                    type="password" 
                    placeholder="Create Password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required 
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
                </button>

                <div className="auth-footer-links">
                  <span>Already Registered?</span>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveScreen('email_login'); }}>
                    Sign In
                  </a>
                </div>
              </form>
            )}

            {activeScreen === 'forgot_password' && (
              <form onSubmit={handleForgotPasswordSubmit} className="auth-form">
                <p className="auth-instruction-text">
                  Enter your email address below, and we will dispatch a magic link to recover your credentials.
                </p>
                
                <div className="auth-input-group">
                  <Mail size={16} />
                  <input 
                    type="email" 
                    placeholder="Enter Email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required 
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? 'SENDING...' : 'SEND RECOVERY LINK'}
                </button>
              </form>
            )}

            {activeScreen === 'reset_password' && (
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setError(null);
                  try {
                    await updatePassword(password);
                    useWarscytheStore.setState({ showResetPasswordModal: false });
                    alert("Password updated successfully!");
                    if (onClose) onClose();
                  } catch (err) {
                    setError(err.message || 'Failed to update password');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="auth-form"
              >
                <div className="auth-input-group">
                  <Lock size={16} />
                  <input 
                    type="password" 
                    placeholder="Enter New Password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required 
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? 'PROCESSING...' : 'UPDATE PASSWORD'}
                </button>
              </form>
            )}
          </>
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
          backdrop-filter: blur(10px); 
          z-index: 3000; 
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .auth-modal {
          width: 100%;
          max-width: 440px;
          padding: 2rem;
          text-align: center;
          position: relative;
          background: rgba(10, 10, 15, 0.95);
          border: 1px solid rgba(197, 160, 89, 0.35);
          box-shadow: 0 0 80px rgba(0,0,0,0.9), 0 0 40px rgba(197,160,89,0.05);
          border-radius: 4px;
        }

        @media (min-width: 640px) {
          .auth-modal { padding: 3rem 2.5rem; }
        }

        .auth-back-btn {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background: none;
          border: none;
          color: #9ca3af;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          transition: color 0.2s;
        }
        .auth-back-btn:hover {
          color: #c5a059;
        }

        .auth-icon { color: #c5a059; margin-bottom: 1rem; filter: drop-shadow(0 0 10px rgba(197,160,89,0.4)); }
        .auth-header h2 { font-family: 'Cinzel', serif; font-size: 1.4rem; color: #fff; letter-spacing: 0.2em; margin-bottom: 0.5rem; text-transform: uppercase; }
        .auth-header p { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: #6b7280; letter-spacing: 0.15em; line-height: 1.4; }

        .auth-instruction-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: #9ca3af;
          line-height: 1.5;
          margin-top: 1.5rem;
          text-align: left;
        }

        .auth-options-list {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .auth-option-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 0.85rem;
          color: #d1d5db;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .auth-option-btn :global(.auth-btn-icon) {
          flex-shrink: 0;
        }

        .auth-option-btn:hover {
          background: rgba(197, 160, 89, 0.05);
          border-color: #c5a059;
          color: #fff;
          box-shadow: 0 0 15px rgba(197,160,89,0.1);
          transform: translateY(-1px);
        }

        .auth-option-btn.google:hover {
          background: rgba(66, 133, 244, 0.05);
          border-color: rgba(66, 133, 244, 0.5);
          box-shadow: 0 0 15px rgba(66, 133, 244, 0.1);
        }

        .auth-option-btn.apple:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        }

        .auth-disclaimer {
          margin-top: 1.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem;
          color: #4b5563;
          line-height: 1.5;
          letter-spacing: 0.02em;
        }

        .auth-disclaimer a {
          color: #6b7280;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .auth-disclaimer a:hover {
          color: #c5a059;
        }

        .auth-form { margin-top: 1.75rem; display: flex; flex-direction: column; gap: 1rem; }
        .auth-error { background: rgba(255, 60, 60, 0.08); border: 1px solid #ff3c3c; color: #ff3c3c; padding: 0.65rem; font-size: 0.7rem; border-radius: 4px; display: flex; align-items: center; gap: 0.5rem; font-family: 'JetBrains Mono', monospace; text-align: left; }
        
        .auth-input-group { position: relative; display: flex; align-items: center; }
        .auth-input-group :global(svg) { position: absolute; left: 1rem; color: #4a4a4a; pointer-events: none; }
        .auth-input-group input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 0.85rem 1rem 0.85rem 2.75rem;
          color: #fff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          border-radius: 4px;
          transition: 0.2s;
          letter-spacing: 0.05em;
        }
        .auth-input-group input::placeholder { color: #4a4a4a; }
        .auth-input-group input:focus { 
          border-color: #c5a059; 
          background: rgba(197, 160, 89, 0.04); 
          outline: none;
          box-shadow: 0 0 12px rgba(197,160,89,0.1);
        }

        .auth-forgot-link {
          text-align: right;
          margin-top: -0.25rem;
        }

        .auth-forgot-link a {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: #6b7280;
          text-decoration: none;
          transition: color 0.2s;
        }

        .auth-forgot-link a:hover {
          color: #c5a059;
        }

        .auth-submit-btn {
          background: #c5a059;
          color: #000;
          border: none;
          padding: 1rem;
          font-family: 'Cinzel', serif;
          font-size: 0.8rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(197,160,89,0.2);
          transition: 0.2s;
          text-transform: uppercase;
        }
        .auth-submit-btn:hover { 
          transform: translateY(-1px); 
          background: #e8d0a0;
          box-shadow: 0 0 30px rgba(197,160,89,0.4); 
        }
        .auth-submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .auth-footer-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: #6b7280;
        }

        .auth-footer-links a {
          color: #c5a059;
          text-decoration: underline;
        }

        .auth-footer-links a:hover {
          color: #e8d0a0;
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
          margin-top: 2rem; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 0.5rem; 
          color: rgba(255,255,255,0.12); 
          font-size: 0.5rem; 
          font-weight: 900; 
          letter-spacing: 0.15em;
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
        }

        .auth-option-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
          border-color: rgba(255, 255, 255, 0.05);
        }

        .auth-disclaimer-container {
          margin-top: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          text-align: left;
        }

        .auth-disclaimer-label {
          display: flex;
          gap: 0.65rem;
          align-items: flex-start;
          cursor: pointer;
          user-select: none;
        }

        .auth-terms-checkbox {
          accent-color: #c5a059;
          margin-top: 0.15rem;
          cursor: pointer;
          width: 14px;
          height: 14px;
          border: 1px solid rgba(197, 160, 89, 0.35);
          background: rgba(0, 0, 0, 0.5);
          flex-shrink: 0;
        }

        .auth-disclaimer-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          color: #6b7280;
          line-height: 1.4;
          letter-spacing: 0.02em;
        }

        .auth-disclaimer-text a {
          color: #9ca3af;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .auth-disclaimer-text a:hover {
          color: #c5a059;
        }
      `}</style>
    </div>
  );
}
