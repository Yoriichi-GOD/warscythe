import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { Lock, Unlock, Sparkles, Swords, Eye, Shield, CloudDownload, Loader2, Play } from 'lucide-react';
import { getAssetUrl } from '../utils/assetResolver';
import {
  STREAK_SCYTHE_TIERS,
  getOperativeYearAttendance,
  getStreakScytheMultipliers,
} from '../utils/ritualMedals';

export default function ScytheCenter({ onOpenShop }) {
  const openVideoModal = useWarscytheStore(state => state.openVideoModal);
  const {
    streakCount,
    unlockedScythes,
    unlockedThemes,
    coins,
    scytheLevel,
    activeScytheSkin,
    activeTheme,
    equipScythe,
    applyTheme,
    downloadedRegions,
    downloadRegionBundle,
    hasSeenForgeGuide,
    setHasSeenForgeGuide,
    tutorialStep
  } = useWarscytheStore();
  const completedTasks = useWarscytheStore(state => state.completedTasks) || [];
  const ritualCompletionEvents = useWarscytheStore(state => state.ritualCompletionEvents) || [];
  const user = useWarscytheStore(state => state.user);

  const [isSlashing, setIsSlashing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('streak'); // 'streak', 'shop', 'theme'
  const [selectedItemId, setSelectedItemId] = useState('neophyte');

  const isMobileApp = typeof window !== 'undefined' && window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform();

  const isAssetDownloaded = (item) => {
    if (!isMobileApp) return true;
    if (item.type === 'streak') return true;
    if (item.type === 'theme') {
      return (downloadedRegions || []).includes(item.id) || item.id === 'default';
    }
    return (downloadedRegions || []).includes(item.id);
  };

  const triggerSlash = () => {
    if (isSlashing) return;
    setIsSlashing(true);
    setTimeout(() => setIsSlashing(false), 600);
  };

  const streakDescriptions = {
    neophyte: 'Attuned to early daily consistency.',
    acolyte: 'Forged for dedicated initiates.',
    reaper: 'A seasoned instrument of focus.',
    executioner: 'Swift finality for resistance.',
    sovereign: 'Commanding weapon of the elite.',
    'void-walker': 'Imbued with the quiet of the void.',
    eternal: 'A timeless relic of infinite execution.',
  };
  const streakScythes = STREAK_SCYTHE_TIERS.map(tier => ({
    id: tier.id,
    name: tier.displayName,
    req: tier.days,
    desc: streakDescriptions[tier.id],
    type: 'streak',
  }));
  const streakHistory = getStreakScytheMultipliers(completedTasks, ritualCompletionEvents);
  const operativeAttendance = getOperativeYearAttendance(
    completedTasks,
    ritualCompletionEvents,
    user?.created_at
  );
  const claimedStreakScythes = (() => {
    try {
      return JSON.parse(localStorage.getItem('warscythe-claimed-streak-scythes') || '[]')
        .map(name => String(name).toLowerCase());
    } catch {
      return [];
    }
  })();
  const streakMultiplierFor = item => Math.max(
    streakHistory.multipliers[item.id] || 0,
    streakCount >= item.req ? 1 : 0,
    claimedStreakScythes.includes(item.id) ? 1 : 0
  );

  const paidScythes = [
    // Premium Scythes (₹50)
    { id: 'cosmic_harvester', name: 'Cosmic Harvester', desc: 'Forged from stellar dust. Evolves dynamically from Dormant to Platinum throughout the day based on your execution.', type: 'premium' },
    { id: 'hellfire_reaper', name: 'Hellfire Reaper', desc: 'Forged in volcanic depths. Infuses attacks with burning magma veins.', type: 'premium' },
    { id: 'soul_eater_prime', name: 'Soul-Eater Prime', desc: 'Necrotic skeletal frame that harvests lifeforce and glows with purple wraps.', type: 'premium' },
    { id: 'abyssal_leviathan', name: 'Abyssal Leviathan', desc: 'Dredged from ancient trenches, built of giant fossilized bone and scale.', type: 'premium' },
    { id: 'ares_devastator', name: 'Ares\' Devastator', desc: 'Spiked war trophy scythe that glows with a heated war rage.', type: 'premium' },

    // Coin Scythes (🪙)
    { id: 'shadow_blade', name: 'Shadow Blade', desc: 'Sleek obsidian metal wrapped in shifting semi-transparent black smoke. For operatives who move without announcing themselves.', type: 'coin', price: 5000 },
    { id: 'golden_harvester', name: 'Golden Harvester', desc: 'Ornate gilded metal with detailed sunburst engravings. For operatives who execute in full view.', type: 'coin', price: 5000 },
    { id: 'cinder_reaper', name: 'Cinder Reaper', desc: 'Charred dry gray wood shaft with iron blade tips smoldering with orange coals. For operatives who leave nothing standing.', type: 'coin', price: 5000 },
    { id: 'frost_cleaver', name: 'Frost Cleaver', desc: 'Carved from glacial ice with glowing white runes emitting cold fog. For operatives who operate without heat.', type: 'coin', price: 5000 },
    { id: 'storm_caller', name: 'Storm Caller', desc: 'Double-edged metallic white scythe with coiling electric blue lightning arcs. For operatives who move at the speed of decision.', type: 'coin', price: 5000 }
  ];

  const themes = [
    { id: 'default', name: 'Genesis Default', desc: 'The baseline dark fantasy grid environment.', type: 'theme' },
    { id: 'shiva', name: 'Kailash Ascension', desc: 'Electric blue accents with Himalayan background.', type: 'theme' },
    { id: 'lava', name: 'Lava Citadel', desc: 'Deep volcanic layout with magma embers.', type: 'theme' }
  ];

  const isUnlocked = (item) => {
    if (item.type === 'streak') {
      return streakMultiplierFor(item) > 0;
    }
    if (item.type === 'theme') {
      return (unlockedThemes || []).includes(item.id);
    }
    return (unlockedScythes || []).includes(item.id);
  };

  const getSelectedItem = () => {
    if (activeTab === 'streak') {
      return streakScythes.find(i => i.id === selectedItemId) || streakScythes[0];
    }
    if (activeTab === 'shop') {
      return paidScythes.find(i => i.id === selectedItemId) || paidScythes[0];
    }
    return themes.find(i => i.id === selectedItemId) || themes[0];
  };

  const selectedItem = getSelectedItem();
  const owned = isUnlocked(selectedItem);

  const auraColors = {
    dormant: 'rgba(255,255,255,0.05)',
    neophyte: 'rgba(255,255,255,0.3)',
    acolyte: 'rgba(100,149,237,0.4)',
    reaper: 'rgba(75,0,130,0.5)',
    executioner: 'rgba(220,20,60,0.5)',
    sovereign: 'rgba(197,160,89,0.6)',
    'void-walker': 'rgba(138,43,226,0.6)',
    eternal: 'rgba(255,60,60,0.7)',

    cosmic_harvester: 'rgba(52, 152, 219, 0.75)',
    hellfire_reaper: 'rgba(231, 76, 60, 0.75)',
    soul_eater_prime: 'rgba(142, 68, 173, 0.75)',
    abyssal_leviathan: 'rgba(46, 204, 113, 0.75)',
    ares_devastator: 'rgba(192, 41, 43, 0.75)',

    shadow_blade: 'rgba(44, 62, 80, 0.6)',
    golden_harvester: 'rgba(241, 196, 15, 0.6)',
    cinder_reaper: 'rgba(211, 84, 0, 0.6)',
    frost_cleaver: 'rgba(52, 152, 219, 0.6)',
    storm_caller: 'rgba(52, 73, 94, 0.7)'
  };

  const getWeaponImage = (item) => {
    if (item.type === 'streak') {
      if (item.id === 'dormant') return getAssetUrl('/scythe/DORMANT.png');
      return getAssetUrl(`/ultimate/${item.id}.png`);
    }
    if (item.type === 'premium') {
      const stage = (scytheLevel || 'DORMANT').toLowerCase();
      return getAssetUrl(`/scythe/premium/${item.id}/${item.id}_${stage}.png`);
    }
    if (item.type === 'coin') {
      const stage = (scytheLevel || 'DORMANT').toLowerCase();
      return getAssetUrl(`/scythe/coin/${item.id}/${item.id}_${stage}.png`);
    }
    return getAssetUrl(`/scythe/${item.id}.png`);
  };

  const auraColor = auraColors[selectedItem.id] || 'rgba(255,255,255,0.05)';

  const getListItems = () => {
    if (activeTab === 'streak') return streakScythes;
    if (activeTab === 'shop') return paidScythes;
    return themes;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'streak') setSelectedItemId('neophyte');
    else if (tab === 'shop') setSelectedItemId('cosmic_harvester');
    else setSelectedItemId('default');
    if (import.meta.env.DEV || useWarscytheStore.getState().postGuardianTutorial === 'forge_intro') {
      window.dispatchEvent(new CustomEvent('warscythe:forge-tab', { detail: tab }));
    }
  };

  const isTutorialActive = tutorialStep && tutorialStep !== 'completed';

  return (
    <section className="scythe-center-section relative">
      <div className="elite-panel">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div>
              <span className="panel-tag">WEAPON FORGE & COSMETICS</span>
              <h4 className="text-white font-display text-lg">THE OPERATIVE\'S ARMORY</h4>
            </div>
            <button 
              type="button"
              onClick={() => openVideoModal('forge')}
              className="text-gray-500 hover:text-gold-core transition-colors p-1 hover:bg-white/5 rounded cursor-pointer mt-3"
              title="Play Walkthrough Guide"
            >
              <Play size={12} fill="currentColor" className="text-gold-core" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1.5 bg-black/40 border border-gold-core/20 text-gold-core text-[10px] rounded font-mono">
              🪙 {coins} COINS
            </div>
            <div className="px-3 py-1.5 bg-black/40 border border-gold-core/20 text-gold-core text-[10px] rounded font-mono">
              LONGEST CHAIN {Math.max(streakCount, streakHistory.longestChain)}D
            </div>
            <div className="px-3 py-1.5 bg-black/40 border border-gold-core/20 text-gold-core text-[10px] rounded font-mono">
              ATTENDANCE {operativeAttendance.attendanceDays}D
            </div>
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex gap-4 border-b border-white/5 pb-3 mb-6">
          <button
            id="forge-streak-tab"
            onClick={() => handleTabChange('streak')}
            className={`font-mono text-[9px] tracking-widest px-3 py-1.5 rounded uppercase font-bold border transition-all ${activeTab === 'streak'
              ? 'bg-gold-core/10 border-gold-core text-gold-core'
              : 'bg-transparent border-transparent text-gray-400 hover:text-white'
              }`}
          >
            Streak Weapons
          </button>
          <button
            id="forge-shop-tab"
            onClick={() => handleTabChange('shop')}
            className={`font-mono text-[9px] tracking-widest px-3 py-1.5 rounded uppercase font-bold border transition-all ${activeTab === 'shop'
              ? 'bg-gold-core/10 border-gold-core text-gold-core'
              : 'bg-transparent border-transparent text-gray-400 hover:text-white'
              }`}
          >
            Acquired Skins
          </button>
          <button
            id="forge-theme-tab"
            onClick={() => handleTabChange('theme')}
            className={`font-mono text-[9px] tracking-widest px-3 py-1.5 rounded uppercase font-bold border transition-all ${activeTab === 'theme'
              ? 'bg-gold-core/10 border-gold-core text-gold-core'
              : 'bg-transparent border-transparent text-gray-400 hover:text-white'
              }`}
          >
            Acquired Themes
          </button>
        </div>

        {/* Forge Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[450px]">
          {/* List Column */}
          <div className="evolution-list custom-scrollbar overflow-y-auto pr-2 max-h-[300px] lg:max-h-full">
            {getListItems().map((item) => {
              const unlocked = isUnlocked(item);
              let subtitle = 'LOCKED';
              if (item.type === 'streak') {
                subtitle = unlocked ? 'UNLOCKED' : `Requires ${item.req} day streak`;
              } else if (item.type === 'theme') {
                subtitle = unlocked ? 'UNLOCKED' : 'Locked - Shop Inscription';
              } else {
                subtitle = unlocked ? 'OWNED' : 'Locked - Dread Armory';
              }

              const isCurrent = activeTab === 'theme' ? activeTheme === item.id : activeScytheSkin === item.id;
              const downloaded = isAssetDownloaded(item);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`evo-item ${unlocked ? 'active' : 'locked'} ${selectedItemId === item.id ? 'selected' : ''} relative`}
                >
                  <div className="flex items-center gap-3">
                    {unlocked ? <Unlock size={12} className="text-gold-core" /> : <Lock size={12} className="text-white/20" />}
                    <div className="text-left">
                      <div className="text-[10px] font-bold tracking-widest uppercase">{item.name}</div>
                      <div className="text-[8px] opacity-50 uppercase font-mono">{isCurrent ? 'ACTIVE' : subtitle}</div>
                    </div>
                  </div>
                  {unlocked && !downloaded && (
                    <div className="absolute top-3 right-3 text-gold-core/70" title="Not Downloaded">
                      <CloudDownload size={10} className="animate-pulse" />
                    </div>
                  )}
                  {item.type === 'streak' && streakMultiplierFor(item) > 0 && (
                    <span className="absolute top-1/2 -translate-y-1/2 right-3 px-2 py-1 rounded-full border border-gold-core/35 bg-black/70 text-[8px] font-mono font-black tracking-wider text-gold-bright">
                      ×{streakMultiplierFor(item)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Preview/Action Column */}
          <div className="flex flex-col items-center justify-center relative border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-8 lg:pr-8 pr-4">

            {/* Scythe Slash Render */}
            {selectedItem.type !== 'theme' ? (
              <motion.div
                onClick={triggerSlash}
                className="relative cursor-pointer"
                style={{ filter: `drop-shadow(0 0 30px ${auraColor})` }}
              >
                <AnimatePresence>
                  {isSlashing && (
                    <motion.div
                      className="absolute inset-0 border-2 border-white/50 rounded-full"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
                <div className="w-32 h-56 flex items-center justify-center">
                  <img
                    src={getWeaponImage(selectedItem)}
                    className="w-full h-full object-contain scythe-img"
                    onError={(e) => {
                      e.target.src = getAssetUrl('/scythe/DORMANT.png');
                    }}
                    alt={selectedItem.name}
                  />
                </div>
              </motion.div>
            ) : (
              /* Theme Render Preview */
              /* Theme Render Preview */
              <div 
                className="w-[380px] h-[209px] rounded border border-white/10 flex flex-col justify-end p-5 relative overflow-hidden"
                style={{
                  backgroundImage: selectedItem.id === 'shiva'
                    ? `url(${getAssetUrl('/themes/kailash/shiva_preview.png')})`
                    : selectedItem.id === 'lava'
                      ? `url(${getAssetUrl('/themes/lava/lava_preview.png')})`
                      : 'linear-gradient(135deg, #111, #222)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute top-3 right-3 text-gold-core font-mono text-[10px] uppercase tracking-wider bg-black/60 px-1.5 py-0.5 rounded border border-white/5">
                  {selectedItem.id === 'shiva' ? 'ॐ' : selectedItem.id === 'lava' ? '🌋' : 'Genesis'}
                </div>
                <div className="relative z-10 text-left font-mono bg-black/40 p-2.5 rounded border border-white/5 backdrop-blur-[2px] max-w-[85%]">
                  <span className="text-[7.5px] text-gray-400 uppercase tracking-widest block mb-0.5">Environment Scroll</span>
                  <span className="text-white text-[13px] font-bold font-sans uppercase tracking-wider">{selectedItem.name}</span>
                </div>
              </div>
            )}

            {/* Description & Action */}
            <div className="mt-6 w-full text-center">
              <div className="text-white font-display mb-2 uppercase text-sm">{selectedItem.name}</div>
              <p className="text-[10px] text-gray-400 font-mono max-w-xs mx-auto leading-relaxed mb-6">
                {selectedItem.desc}
              </p>

              {/* Dynamic Button Action */}
              <div className="flex justify-center w-full">
                {selectedItem.type !== 'theme' ? (
                  /* Weapon Action */
                  owned ? (
                    activeScytheSkin === selectedItem.id ? (
                      <button
                        onClick={() => equipScythe('default')}
                        className="px-6 py-2 border border-gold-core text-gold-core bg-gold-core/10 hover:bg-gold-core/20 text-[9px] font-mono rounded font-bold tracking-widest transition-all cursor-pointer"
                        title="Click to unequip"
                      >
                        EQUIPPED (UNEQUIP)
                      </button>
                    ) : (
                      !isAssetDownloaded(selectedItem) ? (
                        <button
                          disabled={isDownloading}
                          onClick={async () => {
                            setIsDownloading(true);
                            try {
                              await downloadRegionBundle(selectedItem.id);
                            } catch (err) {
                              alert('Download failed. Check connection.');
                            } finally {
                              setIsDownloading(false);
                            }
                          }}
                          className="px-6 py-2 bg-gold-core text-black hover:bg-white text-[9px] font-mono rounded font-black tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {isDownloading ? <Loader2 size={10} className="animate-spin" /> : <CloudDownload size={10} />}
                          <span>DOWNLOAD & EQUIP</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => equipScythe(selectedItem.id)}
                          className="px-6 py-2 bg-gold-core text-black hover:bg-white text-[9px] font-mono rounded font-black tracking-widest transition-all cursor-pointer"
                        >
                          EQUIP WEAPON
                        </button>
                      )
                    )
                  ) : (
                    /* Locked Weapon */
                    selectedItem.type === 'streak' ? (
                      <div className="flex items-center gap-1.5 text-red-500 font-mono text-[8px] uppercase tracking-wider">
                        <Lock size={10} />
                        <span>Requires {selectedItem.req} Day Streak (Current: {streakCount})</span>
                      </div>
                    ) : (
                      <button
                        onClick={onOpenShop}
                        className="px-6 py-2 bg-gold-core/10 hover:bg-gold-core/25 border border-gold-core/30 text-gold-core text-[9px] font-mono rounded font-bold tracking-widest transition-all cursor-pointer"
                      >
                        ACQUIRE IN SHOP
                      </button>
                    )
                  )
                ) : (
                  /* Theme Action */
                  owned ? (
                    activeTheme === selectedItem.id ? (
                      <button disabled className="px-6 py-2 border border-gold-core text-gold-core bg-gold-core/5 text-[9px] font-mono rounded font-bold tracking-widest cursor-default">
                        APPLIED
                      </button>
                    ) : (
                      !isAssetDownloaded(selectedItem) ? (
                        <button
                          disabled={isDownloading}
                          onClick={async () => {
                            setIsDownloading(true);
                            try {
                              await downloadRegionBundle(selectedItem.id);
                            } catch (err) {
                              alert('Download failed. Check connection.');
                            } finally {
                              setIsDownloading(false);
                            }
                          }}
                          className="px-6 py-2 bg-gold-core text-black hover:bg-white text-[9px] font-mono rounded font-black tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {isDownloading ? <Loader2 size={10} className="animate-spin" /> : <CloudDownload size={10} />}
                          <span>DOWNLOAD & APPLY</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => applyTheme(selectedItem.id)}
                          className="px-6 py-2 bg-gold-core text-black hover:bg-white text-[9px] font-mono rounded font-black tracking-widest transition-all cursor-pointer"
                        >
                          APPLY THEME
                        </button>
                      )
                    )) : (
                    /* Locked Theme */
                    <button
                      onClick={onOpenShop}
                      className="px-6 py-2 bg-gold-core/10 hover:bg-gold-core/25 border border-gold-core/30 text-gold-core text-[9px] font-mono rounded font-bold tracking-widest transition-all cursor-pointer"
                    >
                      ACQUIRE IN SHOP
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .scythe-center-section {
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem 1.5rem;
        }

        .panel-tag {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          font-weight: 900;
          color: var(--gold-core);
          letter-spacing: 0.25em;
          display: block;
          margin-bottom: 0.25rem;
        }

        /* Evolution list column */
        .evolution-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .evo-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 5px;
          border: 1px solid rgba(255,255,255,0.03);
          background: rgba(255,255,255,0.01);
          transition: all 0.2s;
          cursor: pointer;
          font-family: var(--font-display);
          color: #fff;
        }

        .evo-item.active {
          opacity: 0.75;
        }

        .evo-item.active:hover {
          opacity: 1;
          background: rgba(255,255,255,0.025);
          border-color: rgba(255,255,255,0.06);
        }

        .evo-item.selected {
          opacity: 1;
          background: rgba(197,160,89,0.05);
          border-color: rgba(197,160,89,0.25);
          box-shadow: 0 0 10px rgba(197,160,89,0.08);
        }

        .evo-item.locked {
          opacity: 0.35;
        }
        
        .evo-item.locked:hover {
          opacity: 0.6;
          background: rgba(255,255,255,0.015);
        }
      `}</style>
    </section>
  );
}
