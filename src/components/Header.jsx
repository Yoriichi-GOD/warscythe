import React from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { Trophy, Map, Brain, Shield, Crosshair, Award, ShieldCheck, Settings, Fingerprint, Map as MapIcon, Dumbbell, RefreshCw, AlertCircle, BookOpen, ShoppingBag, CloudDownload, Users, Bell, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { TASKS_PER_LEVEL } from '../store/constants';

export default function Header({ onOpenMap, onOpenVault, onOpenAuth, onOpenGymLog, onOpenPremium, onOpenShop, onOpenDownloader, onOpenLore, onOpenSocial }) {
  const { 
    executionScore: xp, 
    level, 
    currentTitle, 
    user, 
    signOut, 
    deleteAccount, 
    isFocusMode, 
    currentLevelProgress, 
    syncStatus, 
    forceSync, 
    tutorialStep, 
    isAdFree, 
    activeTheme, 
    soundscapeEnabled, 
    soundscapeVolume, 
    setSoundscapeEnabled, 
    setSoundscapeVolume,
    friendships,
    tasks,
    legionEvents,
    leaderboardEvents,
    activeLegion,
    rituals
  } = useWarscytheStore();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  
  const xpForNext = level * 1000;
  const displayProgress = Math.min(currentLevelProgress || 0, TASKS_PER_LEVEL);
  const progress = (displayProgress / TASKS_PER_LEVEL) * 100;

  const isTutorialActive = tutorialStep && tutorialStep !== 'completed';

  // Dynamic dispatches / notification list
  const notifications = [];

  // 1. Pending incoming friend requests
  const pendingRequests = (friendships || []).filter(f => f.status === 'pending' && f.receiver_id === user?.id);
  pendingRequests.forEach(req => {
    const sender = req.requester?.username || req.requester?.email?.split('@')[0] || 'Unknown';
    notifications.push({
      id: `friend-${req.id}`,
      type: 'friend_request',
      title: 'Friend Request',
      message: `${sender} sent you an operative request.`,
      action: onOpenSocial,
      timestamp: req.created_at || new Date().toISOString()
    });
  });

  // 2. Tasks close to deadline (within 24 hours) or overdue
  (tasks || []).forEach(task => {
    if (task.deadline) {
      const diffMs = new Date(task.deadline) - new Date();
      const diffHrs = diffMs / (1000 * 60 * 60);
      if (diffHrs <= 24) {
        let message = '';
        if (diffHrs < 0) {
          message = `"${task.title}" is overdue.`;
        } else {
          const hrs = Math.ceil(diffHrs);
          message = `"${task.title}" reaches deadline in ${hrs} hour${hrs > 1 ? 's' : ''}.`;
        }
        notifications.push({
          id: `task-${task.id}`,
          type: 'deadline',
          title: 'Deadline Alert',
          message: message,
          action: () => {},
          timestamp: task.createdAt || new Date().toISOString()
        });
      }
    }
  });

  // 3. Legion events (progress of teammates, operations success/failure)
  if (activeLegion) {
    (legionEvents || []).forEach(evt => {
      let msg = '';
      if (evt.event_type === 'operation_started') {
        msg = `An operation was initiated in ${activeLegion.name}.`;
      } else if (evt.event_type === 'subtask_completed') {
        msg = `A legion subtask was conquered.`;
      } else if (evt.event_type === 'subtask_covered') {
        msg = `A legion subtask was covered by an ally.`;
      } else if (evt.event_type === 'member_restrained') {
        msg = `A legion member was restrained.`;
      } else if (evt.event_type === 'operation_success') {
        msg = `Operation succeeded!`;
      } else if (evt.event_type === 'operation_failed') {
        msg = `Operation failed.`;
      } else {
        msg = evt.metadata?.message || `Legion activity update.`;
      }
      notifications.push({
        id: `legion-event-${evt.id}`,
        type: 'legion',
        title: 'Legion Update',
        message: msg,
        action: onOpenSocial,
        timestamp: evt.created_at || new Date().toISOString()
      });
    });
  }

  // 4. Friends' achievements (streak increased, etc.)
  (leaderboardEvents || []).forEach(evt => {
    if (evt.user_id !== user?.id) {
      const sender = evt.profile?.username || evt.profile?.email?.split('@')[0] || 'An operative';
      notifications.push({
        id: `leaderboard-event-${evt.id}`,
        type: 'friend_activity',
        title: 'Friend Progress',
        message: `${sender} ${evt.event_description}`,
        action: onOpenSocial,
        timestamp: evt.created_at || new Date().toISOString()
      });
    }
  });

  // 5. Ritual time-of-day reminders
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  (rituals || []).forEach(ritual => {
    const isCompletedToday = ritual.lastCompletedAt && ritual.lastCompletedAt.slice(0, 10) === todayStr;
    if (!isCompletedToday && ritual.targetTime) {
      const [targetHrs, targetMins] = ritual.targetTime.split(':').map(Number);
      const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHrs, targetMins, 0);
      const diffMs = targetDate - now;
      const diffMins = diffMs / (1000 * 60);

      let title = '';
      let message = '';
      let notificationKey = '';

      if (diffMins <= 0 && diffMins > -15) {
        title = 'Ritual Due Now';
        message = `"${ritual.title}" is due now (${ritual.targetTime}). Execute the discipline!`;
        notificationKey = 'exact';
      } else if (diffMins > 0 && diffMins <= 15) {
        title = 'Ritual Warning (15m)';
        message = `"${ritual.title}" begins in 15 minutes. Prepare yourself.`;
        notificationKey = '15m';
      } else if (diffMins > 15 && diffMins <= 30) {
        title = 'Ritual Warning (30m)';
        message = `"${ritual.title}" begins in 30 minutes. Clear active focus.`;
        notificationKey = '30m';
      } else if (diffMins > 30 && diffMins <= 60) {
        title = 'Ritual Warning (1h)';
        message = `"${ritual.title}" is scheduled in 1 hour (${ritual.targetTime}).`;
        notificationKey = '60m';
      }

      if (message) {
        notifications.push({
          id: `ritual-${ritual.id}-${notificationKey}`,
          type: 'ritual_reminder',
          title: title,
          message: message,
          action: () => {
            // Can redirect to rituals page if needed or onOpenSocial or main tab changes.
            // Since setActiveTab isn't passed to Header, we keep it simple or empty.
          },
          timestamp: new Date(targetDate.getTime() - (diffMins > 0 ? 0 : diffMs)).toISOString()
        });
      }
    }
  });

  // Sort by timestamp (newest first)
  notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <header className="main-header glass-panel">
      <div className={`header-left ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`}>
        <div className="logo-section">
          <div className="logo-icon-box" style={{ background: 'transparent', boxShadow: 'none', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {activeTheme === 'shiva' ? (
              <div className="text-2xl font-bold text-[#5dade2] drop-shadow-[0_0_8px_rgba(93,173,226,0.85)] font-sans select-none" style={{ lineHeight: 1 }}>ॐ</div>
            ) : (
              <img 
                src="/command-core.png" 
                alt="Warscythe" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  filter: activeTheme === 'lava' ? 'hue-rotate(340deg) drop-shadow(0 0 8px #ff3d00)' : 'none'
                }} 
              />
            )}
          </div>
          <div className="logo-text">
            <h1>WARSCYTHE</h1>
            <span>VERSION 1.0 // GENESIS</span>
          </div>
        </div>
        
        <div className="divider" />

        <div className="rank-badge">
          <div className="rank-icon"><ShieldCheck size={14} /></div>
          <div className="rank-info">
            <span className="rank-label">OPERATIVE STATUS</span>
            <span className="rank-title">{currentTitle}</span>
          </div>
        </div>
      </div>

      <div className={`header-center ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`}>
        <div className="progress-hub">
          <div className="progress-header">
            <span className="progress-label">REGION PROGRESS</span>
            <span className="progress-value">{displayProgress}/{TASKS_PER_LEVEL}</span>
          </div>
          <div className="progress-bar-container">
            <motion.div 
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <div className="progress-bar-glow" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className={`xp-counter ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`}>
          <span className="xp-label">TOTAL XP</span>
          <span className="xp-value">{xp.toLocaleString()}</span>
        </div>

        {user && (
          <div className={`elite-status-wrapper flex items-center ml-2 ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`}>
            {isAdFree ? (
              <div 
                className="elite-badge flex items-center justify-center font-mono font-bold tracking-widest text-[8px] border border-gold-core/40 text-gold-core bg-gold-core/5 rounded px-2.5 py-1.5 shadow-[0_0_12px_rgba(236,200,128,0.25)] animate-pulse" 
                title="Elite Operative Status Active"
              >
                ELITE STATUS
              </div>
            ) : (
              <button 
                className="upgrade-elite-badge font-mono font-black tracking-widest text-[8px] bg-gold-core text-black rounded px-2.5 py-1.5 shadow-[0_0_15px_rgba(236,200,128,0.4)] hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] cursor-pointer transition-all duration-300"
                onClick={onOpenPremium}
              >
                UPGRADE TO ELITE
              </button>
            )}
          </div>
        )}
        
        <div className="action-buttons">
          {user && (
            <button 
              className={`nav-btn sync-btn status-${syncStatus} ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`} 
              onClick={syncStatus === 'failed' ? () => onOpenAuth() : forceSync}
              title={
                syncStatus === 'synced' ? 'All progress synced with command core' :
                syncStatus === 'pending' ? 'Synchronizing with command core...' :
                'Sync failure! Click to re-authenticate and resolve.'
              }
            >
              {syncStatus === 'synced' && <RefreshCw size={14} className="text-gold-core/60" />}
              {syncStatus === 'pending' && <RefreshCw size={14} className="text-gold-core animate-spin" />}
              {syncStatus === 'failed' && <AlertCircle size={14} className="text-red-500 animate-pulse" />}
            </button>
          )}
          
          <div style={{ position: 'relative' }}>
            <button 
              className={`nav-btn ${user ? 'active' : ''}`} 
              onClick={user ? () => setShowDropdown(!showDropdown) : () => onOpenAuth()}
              title={user ? `Logged in as ${user.email}` : 'Warscythe Link'}
            >
              {user ? <Settings size={18} /> : <Fingerprint size={18} />}
            </button>
            
            {showDropdown && user && (
              <div className="header-dropdown-menu settings-dropdown">
                <button 
                  onClick={() => { 
                    setShowDropdown(false); 
                    useWarscytheStore.getState().openInfoModal('settings'); 
                  }}
                  className="flex items-center justify-between font-mono"
                  style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>SETTINGS INFO</span>
                  <Info size={10} className="text-gold-core/60" />
                </button>
                <button 
                  onClick={() => { 
                    setShowDropdown(false); 
                    useWarscytheStore.getState().openInfoModal('about'); 
                  }}
                  className="flex items-center justify-between font-mono border-b border-white/5 pb-2 mb-1"
                  style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>ABOUT WARSCYTHE</span>
                  <Info size={10} className="text-gold-core/60" />
                </button>
                <button onClick={() => { setShowDropdown(false); window.open('/privacy.html', '_blank'); }}>
                  PRIVACY POLICY
                </button>
                <button onClick={() => { setShowDropdown(false); alert("Terms & Conditions:\n\n1. Do your daily work.\n2. Do not cheat yourself.\n3. Keep your focus high.\n4. Warscythe is built for ultimate productivity."); }}>
                  TERMS & CONDITIONS
                </button>
                <button 
                  onClick={() => setSoundscapeEnabled(!soundscapeEnabled)}
                  style={{ color: soundscapeEnabled ? 'var(--gold-core)' : '#9ca3af' }}
                >
                  SOUNDSCAPE: {soundscapeEnabled ? 'ON' : 'OFF'}
                </button>
                {soundscapeEnabled && (
                  <div className="dropdown-slider-container">
                    <span className="slider-label">VOLUME: {soundscapeVolume}%</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={soundscapeVolume} 
                      onChange={(e) => setSoundscapeVolume(Number(e.target.value))} 
                      className="dropdown-volume-slider"
                    />
                  </div>
                )}
                <button onClick={() => {
                  setShowDropdown(false);
                  const hasUnsynced = syncStatus === 'failed' || useWarscytheStore.getState().hasPendingChanges;
                  if (hasUnsynced) {
                    if (!window.confirm("WARNING: You have unsynced offline progress. Logging out will discard these local changes. Are you sure you want to sign out?")) {
                      return;
                    }
                  }
                  signOut();
                }}>
                  LOG OUT
                </button>
                <button 
                  className="delete-btn"
                  onClick={async () => {
                    setShowDropdown(false);
                    if (window.confirm("WARNING: This will permanently delete your account, scythe progress, and active operations. This action CANNOT be undone.\n\nAre you sure you want to delete your account?")) {
                      if (window.confirm("FINAL CONFIRMATION: Type 'DELETE' to confirm account deletion.")) {
                        try {
                          await deleteAccount();
                          alert("Account deleted successfully.");
                        } catch (err) {
                          alert("Failed to delete account: " + err.message);
                        }
                      }
                    }
                  }}
                >
                  DELETE ACCOUNT
                </button>
              </div>
            )}
          </div>
          <button 
            className={`nav-btn ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`} 
            onClick={onOpenShop} 
            title="Dread Armory (Shop)"
            style={{ borderColor: 'var(--gold-core)', background: 'rgba(197, 160, 89, 0.03)' }}
          >
            <ShoppingBag size={18} className="text-gold-core animate-pulse" />
          </button>

          <button 
            className={`nav-btn ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`} 
            onClick={onOpenDownloader} 
            title="Tactical Cache Manager"
            style={{ borderColor: 'var(--gold-core)', background: 'rgba(197, 160, 89, 0.03)' }}
          >
            <CloudDownload size={18} className="text-gold-core" />
          </button>

          {/* Direct Lore Scrolls Access */}
          <button 
            className={`nav-btn ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`} 
            onClick={() => {
              setShowNotifications(false);
              setShowDropdown(false);
              onOpenLore();
            }} 
            title="Lore Scrolls"
          >
            <BookOpen size={18} />
          </button>

          {/* Direct Legion & Standings Access */}
          <button 
            className={`nav-btn ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`} 
            onClick={() => {
              setShowNotifications(false);
              setShowDropdown(false);
              onOpenSocial();
            }} 
            title="Legion & Standings"
          >
            <Users size={18} />
          </button>

          {/* Notification Bell Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              className={`nav-btn ${showNotifications ? 'active' : ''} ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`} 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowDropdown(false);
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="notification-badge" />
              )}
            </button>
            {showNotifications && (
              <div className="header-dropdown-menu notifications-dropdown custom-scrollbar">
                <div className="notifications-header">
                  <span>DISPATCHES</span>
                  {notifications.length > 0 && (
                    <span className="clear-btn font-mono">{notifications.length} ACTIVE</span>
                  )}
                </div>
                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">No active dispatches.</div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className="notification-item" 
                        onClick={() => {
                          if (n.action) n.action();
                          setShowNotifications(false);
                        }}
                      >
                        <div className="notification-title">{n.title}</div>
                        <div className="notification-desc">{n.message}</div>
                        <div className="notification-time">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button 
            className={`nav-btn ${isFocusMode ? 'active' : ''} ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`} 
            onClick={() => useWarscytheStore.getState().toggleFocus()} 
            title="Neural Focus"
          >
            <Brain size={18} className={isFocusMode ? 'text-gold pulse' : ''} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .main-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-radius: 0;
          border-left: none;
          border-right: none;
          border-top: none;
          height: 64px;
        }

        @media (max-width: 1023px) {
          .main-header {
            display: grid !important;
            grid-template-columns: 1fr auto;
            grid-template-rows: auto auto;
            height: auto !important;
            padding: 0.75rem 1rem;
            gap: 0.75rem 0.5rem;
          }
          .header-left {
            grid-column: 1;
            grid-row: 1;
            align-self: center;
          }
          .header-right {
            display: contents !important;
          }
          .xp-counter {
            display: none !important;
          }
          .elite-status-wrapper {
            grid-column: 2;
            grid-row: 1;
            align-self: center;
            justify-self: end;
            margin-left: 0 !important;
          }
          .action-buttons {
            grid-column: 1 / span 2;
            grid-row: 2;
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;
            width: 100%;
          }
        }

        @media (min-width: 1024px) {
          .main-header {
            padding: 0.75rem 2rem;
            height: 72px;
          }
        }

        .header-left { display: flex; align-items: center; gap: 1rem; }
        @media (min-width: 1024px) { .header-left { gap: 2rem; } }
        
        .logo-section { display: flex; align-items: center; gap: 0.75rem; }
        .logo-icon-box {
          width: 32px;
          height: 32px;
          background: var(--gold-core);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: #000;
          box-shadow: 0 0 15px var(--gold-glow);
        }

        @media (min-width: 1024px) {
          .logo-icon-box {
            width: 40px;
            height: 40px;
          }
        }

        .logo-text h1 {
          font-family: var(--font-display);
          font-size: 0.9rem;
          letter-spacing: 0.2em;
          color: var(--text-primary);
          line-height: 1;
        }

        @media (min-width: 1024px) {
          .logo-text h1 {
            font-size: 1.2rem;
          }
        }

        .logo-text span {
          font-family: var(--font-mono);
          font-size: 0.45rem;
          color: var(--gold-core);
          letter-spacing: 0.1em;
          margin-top: 4px;
          display: block;
        }

        @media (min-width: 1024px) {
          .logo-text span {
            font-size: 0.55rem;
          }
        }

        .divider { display: none; width: 1px; height: 30px; background: var(--border); }
        @media (min-width: 1024px) { .divider { display: block; } }

        .rank-badge { display: none; align-items: center; gap: 0.75rem; }
        @media (min-width: 640px) { .rank-badge { display: flex; } }

        .rank-icon { color: var(--gold-core); opacity: 0.8; }
        .rank-info { display: flex; flex-direction: column; }
        .rank-label { font-size: 0.5rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; }
        .rank-title { font-size: 0.8rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; }

        .header-center { display: none; }
        @media (min-width: 1024px) {
          .header-center { display: block; }
        }

        .progress-hub { width: 220px; }
        .progress-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .progress-label { font-size: 0.55rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; }
        .progress-value { font-family: var(--font-mono); font-size: 0.6rem; color: var(--gold-core); font-weight: 700; }
        
        .progress-bar-container { height: 4px; background: rgba(255,255,255,0.05); border-radius: 100px; position: relative; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: var(--gold-core); border-radius: 100px; position: relative; z-index: 2; }
        .progress-bar-glow { position: absolute; top: 0; left: 0; height: 100%; background: var(--gold-core); filter: blur(4px); opacity: 0.5; }

        .header-right { display: flex; align-items: center; gap: 1rem; }
        @media (min-width: 1024px) { .header-right { gap: 2rem; } }

        .xp-counter { display: none; text-align: right; }
        @media (min-width: 768px) { .xp-counter { display: block; } }

        .xp-label { display: block; font-size: 0.5rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; }
        .xp-value { font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; color: var(--gold-core); }

        .action-buttons { display: flex; gap: 0.5rem; }
        @media (min-width: 1024px) { .action-buttons { gap: 0.75rem; } }

        .nav-btn {
          width: 32px;
          height: 32px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }

        @media (min-width: 1024px) {
          .nav-btn {
            width: 36px;
            height: 36px;
          }
        }
        .nav-btn:hover { background: rgba(255,255,255,0.08); color: var(--text-primary); border-color: var(--border-bright); }
        .nav-btn:hover { background: rgba(255,255,255,0.08); color: var(--text-primary); border-color: var(--border-bright); }
        
        .sync-btn {
          cursor: pointer;
          position: relative;
        }
        .sync-btn.status-failed {
          border-color: rgba(239, 68, 68, 0.4);
          background: rgba(239, 68, 68, 0.05);
        }
        .sync-btn.status-pending {
          border-color: rgba(236, 200, 128, 0.3);
        }

        .header-dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: rgba(10, 10, 15, 0.95);
          border: 1px solid rgba(197, 160, 89, 0.35);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          min-width: 160px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(197,160,89,0.05);
          z-index: 100;
          overflow: hidden;
        }
        .settings-dropdown {
          right: auto;
          left: 0;
        }
        .header-dropdown-menu button {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          color: #9ca3af;
          padding: 0.75rem 1rem;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-align: left;
          cursor: pointer;
          transition: 0.2s;
        }
        .header-dropdown-menu button:last-child {
          border-bottom: none;
        }
        .header-dropdown-menu button:hover {
          background: rgba(197, 160, 89, 0.08);
          color: #fff;
        }
        .header-dropdown-menu button.delete-btn {
          color: #ef4444;
        }
        .header-dropdown-menu button.delete-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
        }
        .dropdown-slider-container {
          padding: 0.5rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .slider-label {
          font-family: var(--font-mono);
          font-size: 8px;
          color: #8c6a4a;
          letter-spacing: 0.05em;
        }
        .dropdown-volume-slider {
          width: 100%;
          height: 3px;
          background: rgba(255,255,255,0.1);
          outline: none;
          accent-color: var(--gold-core);
          cursor: pointer;
        }

        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 6px;
          height: 6px;
          background: var(--gold-core);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--gold-core);
        }
        .notifications-dropdown {
          width: 320px;
          max-height: 400px;
          overflow-y: auto;
        }
        .notifications-header {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(197, 160, 89, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-display);
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: #fff;
          background: rgba(15, 15, 20, 0.98);
        }
        .notifications-header .clear-btn {
          background: transparent;
          border: none;
          color: var(--gold-core);
          font-size: 0.55rem;
          cursor: default;
          letter-spacing: 0.1em;
        }
        .notifications-list {
          display: flex;
          flex-direction: column;
        }
        .no-notifications {
          padding: 2rem;
          text-align: center;
          color: rgba(255,255,255,0.3);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-style: italic;
        }
        .notification-item {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }
        .notification-item:hover {
          background: rgba(197, 160, 89, 0.06);
        }
        .notification-title {
          font-family: var(--font-display);
          font-size: 0.65rem;
          color: var(--gold-core);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .notification-desc {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: #dfdfdf;
          line-height: 1.4;
        }
        .notification-time {
          font-family: var(--font-mono);
          font-size: 0.5rem;
          color: rgba(255,255,255,0.25);
          margin-top: 2px;
        }
      `}</style>
    </header>
  );
}
