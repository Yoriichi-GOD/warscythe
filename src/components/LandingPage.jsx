import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Activity, Music, Terminal, BookOpen, Layers, CheckCircle2, ChevronRight, Scale, ShieldAlert, X } from 'lucide-react';
import { infoData } from '../data/infoDescriptions';

export default function LandingPage({ onLaunch }) {
  const [activeTab, setActiveTab] = useState('operations');
  const [showLegal, setShowLegal] = useState(null); // 'terms' | 'privacy' | null

  const featuresList = [
    { id: 'operations', label: 'Operations & Raids', icon: Sword, desc: 'Declare war on obstacles with concrete, time-bound campaigns.' },
    { id: 'rituals', label: 'Daily Rituals', icon: Shield, desc: 'Forge non-negotiable streaks of consistency and discipline.' },
    { id: 'scythe', label: 'Scythe & Ledger', icon: Layers, desc: 'Watch your weapon evolve alongside your achievements ledger.' },
    { id: 'fitness', label: 'Fitness & Deities', icon: Activity, desc: 'Lifting volume converts into Greek deity progression.' },
    { id: 'atmosphere', label: 'Soundscape & Cache', icon: Music, desc: 'Immersive soundscapes cached fully offline.' },
    { id: 'terminal', label: 'Power Terminal', icon: Terminal, desc: 'Zero-latency keyboard commands for power users.' },
  ];

  const handleScrollToFeatures = () => {
    document.getElementById('features-anchor')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getFeatureIcon = (id) => {
    switch (id) {
      case 'operations': return '/command-core.png';
      case 'rituals': return '/bonfire.png';
      case 'scythe': return '/scroll-paper.png';
      case 'fitness': return '/olympus-bg.png';
      case 'atmosphere': return '/soundscape-jukebox.png';
      case 'terminal': return '/guardian-observer.png';
      default: return '/shop-bg.png';
    }
  };

  return (
    <div className="landing-page-root custom-scrollbar">
      {/* Header */}
      <header className="landing-header">
        <div className="logo-group">
          <h1 className="cinzel-title text-lg tracking-[0.25em] text-white">WARSCYTHE</h1>
          <span className="font-mono text-[7px] text-gold-core/80 tracking-[0.4em] uppercase mt-0.5">VERSION 1.0 // GENESIS</span>
        </div>
        <button className="btn-gothic-gold px-4 py-2 text-[9px] tracking-widest font-mono" onClick={onLaunch}>
          LAUNCH APPLICATION
        </button>
      </header>

      {/* Hero Section */}
      <section className="landing-hero" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(8,8,10,1)), url("/shop-bg.png")' }}>
        <div className="hero-content text-center max-w-3xl px-6 relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-badge font-mono text-[8px] text-gold-core border border-gold-core/25 px-3 py-1 rounded-full uppercase tracking-[0.25em] mb-4"
          >
            ✦ GENESIS TACTICAL MODULE ✦
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="cinzel-title text-4xl lg:text-5xl font-extrabold tracking-widest text-white leading-tight"
          >
            EMBODY THE SCYTHE.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-mono text-[10px] text-gray-400 max-w-xl uppercase tracking-wider leading-relaxed my-6"
          >
            A high-resistance command center for execution, habits, and body conditioning. We do not motivate. We witness.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-4"
          >
            <button className="btn-gothic-gold px-6 py-3 text-[10px] tracking-widest font-mono" onClick={onLaunch}>
              ENTER SANCTUARY
            </button>
            <button className="btn-gothic-outline px-6 py-3 text-[10px] tracking-widest font-mono" onClick={handleScrollToFeatures}>
              EXPLORE CODEX
            </button>
          </motion.div>
        </div>
        <div className="hero-gradient-overlay" />
      </section>

      {/* Info Block: What is Warscythe */}
      <section className="landing-about px-6 py-16 lg:py-24 border-t border-white/5 bg-[#08080a] relative">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col text-left">
            <span className="font-mono text-[8px] text-gold-core tracking-[0.3em] uppercase mb-2">✦ OPERATIVE DOCTRINE</span>
            <h3 className="cinzel-title text-xl font-bold tracking-widest text-white uppercase mb-4">WHAT IS WARSCYTHE?</h3>
            <p className="font-mono text-[9px] text-gray-400 tracking-wider leading-relaxed uppercase mb-4">
              Warscythe is a tactical command center for execution, focus, and daily habit consistency. It is a tool designed specifically for high-resistance brains that do not need hand-holding or superficial gamification.
            </p>
            <p className="font-mono text-[9px] text-gray-400 tracking-wider leading-relaxed uppercase">
              It treats your goals as campaigns, your habits as daily rituals, and your physical strength as deity progression. It is a permanent archive of your discipline.
            </p>
          </div>
          <div className="about-media rounded border border-white/10 overflow-hidden relative shadow-[0_0_30px_rgba(0,0,0,0.6)]">
            <img src="/ritual-platform.png" alt="Warscythe Core Platform" className="w-full object-cover aspect-video" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] to-transparent opacity-60" />
          </div>
        </div>
      </section>

      {/* Interactive Feature Codex */}
      <section id="features-anchor" className="landing-features px-6 py-16 lg:py-24 border-t border-white/5 bg-[#050507]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-mono text-[8px] text-gold-core tracking-[0.3em] uppercase mb-2">✦ CORE BLUEPRINTS</span>
            <h3 className="cinzel-title text-2xl font-bold tracking-widest text-white uppercase">COMMAND FEATURES</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              {featuresList.map(feat => {
                const Icon = feat.icon;
                const isActive = activeTab === feat.id;
                return (
                  <button
                    key={feat.id}
                    onClick={() => setActiveTab(feat.id)}
                    className={`p-4 rounded border text-left flex items-start gap-4 transition-all ${
                      isActive 
                        ? 'border-gold-core/40 bg-gold-core/[0.02] shadow-[0_0_15px_rgba(197,160,89,0.03)]' 
                        : 'border-white/5 bg-black/40 hover:border-white/10 hover:bg-black/60'
                    }`}
                  >
                    <Icon className={`mt-0.5 shrink-0 ${isActive ? 'text-gold-core' : 'text-gray-500'}`} size={16} />
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] font-bold text-white uppercase tracking-wider">{feat.label}</span>
                      <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest mt-1">{feat.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Display Panel */}
            <div className="lg:col-span-8 border border-white/10 rounded-lg overflow-hidden bg-black/50 shadow-2xl flex flex-col">
              {/* Feature Media */}
              <div className="feature-panel-media w-full aspect-[21/9] overflow-hidden relative border-b border-white/5">
                <img src={getFeatureIcon(activeTab)} alt={activeTab} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
              </div>

              {/* Feature Content */}
              <div className="p-6 flex flex-col text-left">
                <span className="font-mono text-[8px] text-gold-core tracking-[0.25em] uppercase mb-2">CODEX COMPONENT</span>
                <h4 className="cinzel-title text-base font-bold text-white tracking-widest uppercase mb-4">
                  {featuresList.find(f => f.id === activeTab)?.label}
                </h4>

                <div className="flex flex-col gap-4 font-mono text-[9px] text-gray-300 tracking-wide leading-relaxed uppercase">
                  {activeTab === 'operations' && (
                    <>
                      <p>Operations represent structured strikes against specific real-world obstacles. You set a difficulty, establish a deadline, and commit to the process.</p>
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded flex flex-col gap-1">
                        <span className="text-gold-core font-bold">✦ Boss Raids:</span>
                        <span>Legendary 14-day minimum campaigns to defeat the regional dragon and unlock fairy coordinates.</span>
                      </div>
                    </>
                  )}
                  {activeTab === 'rituals' && (
                    <>
                      <p>Rituals are your daily habits—non-negotiable disciplines that maintain your streak. Skip one habit, and the entire streak collapses to zero.</p>
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded flex flex-col gap-1">
                        <span className="text-gold-core font-bold">✦ Non-Negotiable Streaks:</span>
                        <span>Psychological checkpoint at 200 days will ask you to evaluate if you are executing for growth or for numbers.</span>
                      </div>
                    </>
                  )}
                  {activeTab === 'scythe' && (
                    <>
                      <p>The Scythe is your signature weapon, changing and evolving visual tiers as you complete operations.</p>
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded flex flex-col gap-1">
                        <span className="text-gold-core font-bold">✦ Artifact Crypt:</span>
                        <span>Over 125 unique artifacts locked with scratch-off overlays to celebrate completions emotionally.</span>
                      </div>
                    </>
                  )}
                  {activeTab === 'fitness' && (
                    <>
                      <p>Track strength, conditioning, and PR logs. Your accumulated training weight converts directly into unlocking Greek deities.</p>
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded flex flex-col gap-1">
                        <span className="text-gold-core font-bold">✦ Deities & Lore:</span>
                        <span>Hermes, Apollo, Ares, Hercules, and Zeus represent deep milestones requiring months of consistent lifting.</span>
                      </div>
                    </>
                  )}
                  {activeTab === 'atmosphere' && (
                    <>
                      <p>Immerse yourself in original ambient soundscapes crafted specifically for focus. Music is optional, silence is a first-class citizen.</p>
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded flex flex-col gap-1">
                        <span className="text-gold-core font-bold">✦ Offline-First Architecture:</span>
                        <span>Everything degardes gracefully when you are out of connectivity. Local cache manager handles assets seamlessly.</span>
                      </div>
                    </>
                  )}
                  {activeTab === 'terminal' && (
                    <>
                      <p>For power users who think faster than they click. Execute operations, workouts, and PRs via pure terminal commands.</p>
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded flex flex-col gap-1">
                        <span className="text-gold-core font-bold">✦ Zero Latency Command Palette:</span>
                        <span>Open with Cmd+K / Ctrl+K and type /strike, /ritual, or /exercise instantly.</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Login Actions */}
      <footer className="landing-footer border-t border-white/5 bg-[#030304] px-6 py-12 text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <h3 className="cinzel-title text-base font-bold tracking-widest text-white uppercase mb-2">CLAIM YOUR SECTOR</h3>
          <p className="font-mono text-[8px] text-gray-500 uppercase tracking-widest mb-6">
            Enter the command core and start your campaign.
          </p>

          <div className="flex gap-4 mb-8">
            <button className="btn-gothic-gold px-5 py-2.5 text-[9px] tracking-widest font-mono" onClick={onLaunch}>
              LOG IN
            </button>
            <button className="btn-gothic-outline px-5 py-2.5 text-[9px] tracking-widest font-mono" onClick={onLaunch}>
              SIGN UP
            </button>
          </div>

          <div className="flex gap-6 font-mono text-[7.5px] text-gray-500 uppercase tracking-[0.25em] mb-4">
            <button className="hover:text-gold-core transition-colors" onClick={() => setShowLegal('terms')}>TERMS OF SERVICE</button>
            <span>•</span>
            <button className="hover:text-gold-core transition-colors" onClick={() => setShowLegal('privacy')}>PRIVACY POLICY</button>
          </div>

          <p className="font-mono text-[7px] text-gray-600 uppercase tracking-wider">
            © 2026 WARSCYTHE COMMAND SYSTEM. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* Legal Overlay Modal */}
      <AnimatePresence>
        {showLegal && (
          <div className="modal-backdrop legal-backdrop flex items-center justify-center p-6" onClick={() => setShowLegal(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl border border-white/10 rounded-lg p-6 bg-[#08080a] flex flex-col max-h-[80vh] overflow-hidden"
              style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.92), rgba(0,0,0,0.98)), url("/shop-bg.png")', backgroundSize: 'cover' }}
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                <div className="flex items-center gap-2">
                  <Scale className="text-gold-core" size={16} />
                  <span className="cinzel-title text-sm font-bold text-white tracking-widest uppercase">
                    {showLegal === 'terms' ? 'TERMS OF SERVICE' : 'PRIVACY POLICY'}
                  </span>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors" onClick={() => setShowLegal(null)}>
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[8px] text-gray-400 tracking-wide uppercase leading-relaxed text-left flex flex-col gap-4 pr-2">
                {showLegal === 'terms' ? (
                  <>
                    <h5 className="text-white font-bold text-[9px] tracking-wider">1. TERMS OF USE</h5>
                    <p>Welcome to Warscythe. By entering the platform, you commit to our Operative Doctrine. The platform acts as a tactical command interface to witness your real-world campaigns and habits. You are solely responsible for executing your goals.</p>
                    
                    <h5 className="text-white font-bold text-[9px] tracking-wider">2. NO FITNESS OR MEDICAL ADVICE</h5>
                    <p>Fitness Deity features measure training volume (accumulated weight) for narrative milestone purposes. We do not provide physical therapy, medical diagnoses, or personal training instruction. Consult a professional before lifting heavy weights.</p>
                    
                    <h5 className="text-white font-bold text-[9px] tracking-wider">3. USER ACCOUNTS & ENTITLEMENTS</h5>
                    <p>Your data is stored securely using Supabase. Paid theme cosmetics, skins, or ad-free packages are linked to your authenticated account. Cheating regional progress via manual command exploits ruins your own cognitive journey; the system assumes you act with honor.</p>
                  </>
                ) : (
                  <>
                    <h5 className="text-white font-bold text-[9px] tracking-wider">1. DATA HARVESTING DECREE</h5>
                    <p>We respect your privacy. Warscythe operates on a secure Supabase cloud foundation. We store your account details, streak levels, logged workouts, active campaigns, and collected artifact tokens.</p>
                    
                    <h5 className="text-white font-bold text-[9px] tracking-wider">2. MONETIZATION & ADSENSE DATA</h5>
                    <p>For non-premium browser clients, Google AdSense Auto Ads are dynamically integrated. Google may use cookies to serve personalized ads based on your visits to this and other websites. Premium accounts dismiss all tracking and ad modules.</p>
                    
                    <h5 className="text-white font-bold text-[9px] tracking-wider">3. CLIENT-SIDE CACHING</h5>
                    <p>To enable lag-free offline operations, game assets (soundscapes, theme variants, map segments) are stored locally using the browser's Cache Storage API. You have the right to purge these files at any time via the Cache Manager.</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .landing-page-root {
          width: 100%;
          min-height: 100vh;
          background-color: #08080a;
          color: #fff;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .landing-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 65px;
          background: rgba(8, 8, 10, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
          z-index: 1000;
        }

        .landing-hero {
          height: 100vh;
          width: 100%;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding-top: 65px;
        }

        .hero-gradient-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, transparent 30%, rgba(8,8,10,1) 100%);
          z-index: 1;
        }

        .btn-gothic-gold {
          background: var(--gold-core);
          color: #000;
          border: 1px solid var(--gold-core);
          font-weight: bold;
          transition: all 0.3s ease;
          border-radius: 2px;
          cursor: pointer;
        }

        .btn-gothic-gold:hover {
          background: #fff;
          border-color: #fff;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        }

        .btn-gothic-outline {
          background: transparent;
          color: #c5a059;
          border: 1px solid rgba(197, 160, 89, 0.4);
          transition: all 0.3s ease;
          border-radius: 2px;
          cursor: pointer;
        }

        .btn-gothic-outline:hover {
          color: #fff;
          border-color: #fff;
          background: rgba(255, 255, 255, 0.02);
        }

        .about-media {
          box-shadow: 0 20px 40px rgba(0,0,0,0.8);
        }

        .cinzel-title {
          font-family: 'Cinzel Decorative', 'Cinzel', serif;
        }

        .legal-backdrop {
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 2200;
        }

        /* Webkit scrollbar for custom styling inside panels */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(197, 160, 89, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(197, 160, 89, 0.6);
        }
      `}</style>
    </div>
  );
}
