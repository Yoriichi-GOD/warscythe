import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { X, Lock, Sparkles, Check, Flame, Star, ShieldAlert, Loader2, Eye, Info } from 'lucide-react';

export default function ShopModal({ onClose, onOpenAuth }) {
  const { 
    user, 
    unlockedScythes, 
    unlockedThemes, 
    activeScytheSkin, 
    activeTheme, 
    equipScythe, 
    applyTheme, 
    buyCosmetic,
    coins,
    buyScythe
  } = useWarscytheStore();

  const [loadingItem, setLoadingItem] = useState(null);
  const [error, setError] = useState(null);

  const scytheSkins = [
    {
      id: 'cosmic_harvester',
      name: 'Cosmic Harvester',
      desc: 'Forged from runic stellar metal. Adds glowing cosmic energy to all strikes.',
      price: '₹50',
      type: 'scythe',
      color: '#3498db'
    },
    {
      id: 'hellfire_reaper',
      name: 'Hellfire Reaper',
      desc: 'Forged in volcanic depths. Infuses attacks with burning orange ash particles.',
      price: '₹50',
      type: 'scythe',
      color: '#e74c3c'
    },
    {
      id: 'soul_eater_prime',
      name: 'Soul-Eater Prime',
      desc: 'Necrotic skeletal bone frame that harvests lifeforce and glows with purple wraps.',
      price: '₹50',
      type: 'scythe',
      color: '#8e44ad'
    },
    {
      id: 'abyssal_leviathan',
      name: 'Abyssal Leviathan',
      desc: 'Dredged from ancient sea trenches, made of bioluminescent scales and bones.',
      price: '₹50',
      type: 'scythe',
      color: '#2ecc71'
    },
    {
      id: 'ares_devastator',
      name: 'Ares\' Devastator',
      desc: 'Brutal spiked war-trophy blood scythe that glows with a heated war rage.',
      price: '₹50',
      type: 'scythe',
      color: '#c0392b'
    }
  ];

  const coinScythes = [
    {
      id: 'shadow_blade',
      name: 'Shadow Blade',
      desc: 'Sleek obsidian metal wrapped in shifting semi-transparent black smoke. For operatives who move without announcing themselves.',
      price: '5000 🪙',
      priceValue: 5000,
      type: 'coin_scythe',
      color: '#2c3e50'
    },
    {
      id: 'golden_harvester',
      name: 'Golden Harvester',
      desc: 'Ornate gilded metal with detailed sunburst engravings. For operatives who execute in full view.',
      price: '5000 🪙',
      priceValue: 5000,
      type: 'coin_scythe',
      color: '#ecc880'
    },
    {
      id: 'cinder_reaper',
      name: 'Cinder Reaper',
      desc: 'Charred dry gray wood shaft with iron blade tips smoldering with orange coals. For operatives who leave nothing standing.',
      price: '5000 🪙',
      priceValue: 5000,
      type: 'coin_scythe',
      color: '#d35400'
    },
    {
      id: 'frost_cleaver',
      name: 'Frost Cleaver',
      desc: 'Carved from glacial ice with glowing white runes emitting cold fog. For operatives who operate without heat.',
      price: '5000 🪙',
      priceValue: 5000,
      type: 'coin_scythe',
      color: '#5dade2'
    },
    {
      id: 'storm_caller',
      name: 'Storm Caller',
      desc: 'Double-edged metallic white scythe with coiling electric blue lightning arcs. For operatives who move at the speed of decision.',
      price: '5000 🪙',
      priceValue: 5000,
      type: 'coin_scythe',
      color: '#3498db'
    }
  ];

  const themes = [
    {
      id: 'shiva',
      name: 'Kailash Ascension',
      desc: 'Mount Himalayas backdrop. Electric blue design, custom Nandi card, and glowing Om insignia.',
      price: '₹200',
      type: 'theme',
      color: '#5dade2'
    },
    {
      id: 'lava',
      name: 'Lava Citadel',
      desc: 'Molten magma styling. Deep crimson border textures, volcanic layout details, and crackling particle embers.',
      price: '₹200',
      type: 'theme',
      color: '#ff3d00'
    }
  ];

  const handlePurchase = async (item) => {
    if (!user) {
      setError('Operative Profile Link required to execute trade.');
      onOpenAuth();
      return;
    }
    setLoadingItem(item.id);
    setError(null);
    try {
      await buyCosmetic(item.id, item.type);
    } catch (err) {
      setError(err.message || 'Payment execution failed.');
    } finally {
      setLoadingItem(null);
    }
  };

  const handleCoinPurchase = (item) => {
    setError(null);
    if (coins < item.priceValue) {
      setError(`Requisition failed: Requires ${item.priceValue} coins. You have ${coins} coins.`);
      return;
    }
    const success = buyScythe(item.id, item.priceValue);
    if (!success) {
      setError('Scythe acquisition failed. You may already own it.');
    }
  };

  const handlePreviewTheme = (themeId) => {
    // Dynamic temporary preview (removes on close unless purchased)
    document.body.className = '';
    document.body.classList.add(`theme-${themeId}`);
  };

  const resetThemePreview = () => {
    document.body.className = '';
    if (activeTheme && activeTheme !== 'default') {
      document.body.classList.add(`theme-${activeTheme}`);
    }
  };

  return (
    <div className="modal-backdrop shop-backdrop" onClick={() => { resetThemePreview(); onClose(); }}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="shop-modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.7)), url("/shop-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Header */}
        <div className="shop-header">
          <div className="flex items-center gap-3">
            <Flame className="text-gold animate-pulse" size={24} />
            <div className="title-group">
              <div className="flex items-center gap-2">
                <h2 className="cinzel-title text-xl font-bold tracking-widest text-white">THE DREAD ARMORY</h2>
                <button
                  type="button"
                  onClick={() => useWarscytheStore.getState().openInfoModal('monetization')}
                  className="text-gray-500 hover:text-gold-core transition-colors"
                  title="Shop Info"
                >
                  <Info size={14} />
                </button>
              </div>
              <p className="font-mono text-[8px] text-gold-core tracking-[0.25em] uppercase">MONETARY EXCHANGE & REQUISITIONS</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 bg-black/40 border border-gold-core/20 text-gold-core text-[10px] rounded font-mono">
              🪙 {coins} COINS
            </div>
            <button className="shop-close" onClick={() => { resetThemePreview(); onClose(); }}><X size={20} /></button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 p-3 bg-red-950/20 border border-red-500/20 rounded-md text-red-400 font-mono text-[9px] uppercase">
            <ShieldAlert size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="shop-body custom-scrollbar flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          
          {/* WEAPONS SECTION */}
          <div className="shop-section">
            <h3 className="section-title cinzel-title text-sm font-bold tracking-wider mb-4 text-gold-core">WEAPON EVOLUTION SKINS (₹)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scytheSkins.map(item => {
                const isUnlocked = unlockedScythes.includes(item.id);
                const isActive = activeScytheSkin === item.id;
                
                return (
                  <div key={item.id} className="item-card flex flex-col justify-between p-4 rounded-lg border border-white/5 bg-black/60 hover:border-white/10 transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">{item.name}</h4>
                        <span className="price-tag font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gold-core">{item.price}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono leading-relaxed mb-4">{item.desc}</p>
                    </div>

                    <div className="flex gap-2">
                      {isUnlocked ? (
                        <button 
                          className={`w-full font-mono text-[9px] py-2 rounded uppercase font-bold tracking-widest transition-all ${
                            isActive 
                              ? 'bg-gold-core text-black border border-gold-core' 
                              : 'bg-transparent text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
                          }`}
                          onClick={() => equipScythe(isActive ? 'default' : item.id)}
                        >
                          {isActive ? 'EQUIPPED' : 'EQUIP'}
                        </button>
                      ) : (
                        <button 
                          className="w-full bg-gold-core text-black hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] font-mono text-[9px] py-2 rounded uppercase font-black tracking-widest flex items-center justify-center gap-1.5 transition-all"
                          onClick={() => handlePurchase(item)}
                          disabled={loadingItem === item.id}
                        >
                          {loadingItem === item.id ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>LINKING...</span>
                            </>
                          ) : (
                            <>
                              <Lock size={12} />
                              <span>BUY SKIN</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PROGRESSION COIN WEAPONS */}
          <div className="shop-section">
            <h3 className="section-title cinzel-title text-sm font-bold tracking-wider mb-4 text-gold-core">PROGRESSION COIN WEAPONS (🪙)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coinScythes.map(item => {
                const isUnlocked = unlockedScythes.includes(item.id);
                const isActive = activeScytheSkin === item.id;
                
                return (
                  <div key={item.id} className="item-card flex flex-col justify-between p-4 rounded-lg border border-white/5 bg-black/60 hover:border-white/10 transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">{item.name}</h4>
                        <span className="price-tag font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gold-core">{item.price}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono leading-relaxed mb-4">{item.desc}</p>
                    </div>

                    <div className="flex gap-2">
                      {isUnlocked ? (
                        <button 
                          className={`w-full font-mono text-[9px] py-2 rounded uppercase font-bold tracking-widest transition-all ${
                            isActive 
                              ? 'bg-gold-core text-black border border-gold-core' 
                              : 'bg-transparent text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
                          }`}
                          onClick={() => equipScythe(isActive ? 'default' : item.id)}
                        >
                          {isActive ? 'EQUIPPED' : 'EQUIP'}
                        </button>
                      ) : (
                        <button 
                          className="w-full bg-gold-core text-black hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] font-mono text-[9px] py-2 rounded uppercase font-black tracking-widest flex items-center justify-center gap-1.5 transition-all"
                          onClick={() => handleCoinPurchase(item)}
                        >
                          <Lock size={12} />
                          <span>ACQUIRE FOR {item.priceValue} 🪙</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* THEMES SECTION */}
          <div className="shop-section">
            <div className="flex justify-between items-center mb-4">
              <h3 className="section-title cinzel-title text-sm font-bold tracking-wider text-gold-core">VISUAL ENVIRONMENT SCROLLS (₹)</h3>
              <button 
                type="button"
                onClick={() => useWarscytheStore.getState().openInfoModal('aesthetics')}
                className="text-gray-500 hover:text-gold-core transition-colors"
                title="Themes Info"
              >
                <Info size={12} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map(item => {
                const isUnlocked = unlockedThemes.includes(item.id);
                const isActive = activeTheme === item.id;
                
                return (
                  <div key={item.id} className="item-card flex flex-col justify-between p-4 rounded-lg border border-white/5 bg-black/60 hover:border-white/10 transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">{item.name}</h4>
                        <span className="price-tag font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gold-core">{item.price}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono leading-relaxed mb-4">{item.desc}</p>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        className="px-3 bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded flex items-center justify-center transition-all"
                        onClick={() => handlePreviewTheme(item.id)}
                        title="Preview theme colors in background"
                      >
                        <Eye size={14} />
                      </button>

                      {isUnlocked ? (
                        <button 
                          className={`flex-1 font-mono text-[9px] py-2 rounded uppercase font-bold tracking-widest transition-all ${
                            isActive 
                              ? 'bg-gold-core text-black border border-gold-core' 
                              : 'bg-transparent text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
                          }`}
                          onClick={() => {
                            applyTheme(isActive ? 'default' : item.id);
                          }}
                        >
                          {isActive ? 'APPLIED' : 'APPLY'}
                        </button>
                      ) : (
                        <button 
                          className="flex-1 bg-gold-core text-black hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] font-mono text-[9px] py-2 rounded uppercase font-black tracking-widest flex items-center justify-center gap-1.5 transition-all"
                          onClick={() => handlePurchase(item)}
                          disabled={loadingItem === item.id}
                        >
                          {loadingItem === item.id ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>INSCRIBING...</span>
                            </>
                          ) : (
                            <>
                              <Lock size={12} />
                              <span>ACQUIRE</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shop-footer border-t border-white/5 pt-4 px-6 pb-2 text-center">
          <p className="font-mono text-[8px] text-gray-500 tracking-wider">
            TRANSACTIONS ENCRYPTED SECURELY BY RAZORPAY GATEWAY RITUAL
          </p>
        </div>

        <style jsx>{`
          .shop-backdrop {
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: none !important;
            padding: 0 !important;
            z-index: 2200;
          }

          .shop-modal-content {
            width: 100vw;
            height: 100vh;
            max-width: 100vw;
            background-color: #08080a;
            border: none;
            border-radius: 0;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: none;
            padding: 2rem 1.5rem;
          }

          .shop-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
            padding-bottom: 1rem;
          }

          .shop-close {
            background: none;
            border: none;
            color: var(--text-dark);
            cursor: pointer;
            transition: 0.2s;
          }

          .shop-close:hover {
            color: #fff;
            transform: rotate(90deg);
          }

          .cinzel-title {
            font-family: 'Cinzel Decorative', 'Cinzel', serif;
          }

          .item-card {
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          }
        `}</style>
      </motion.div>
    </div>
  );
}
