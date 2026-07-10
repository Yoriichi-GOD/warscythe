import React, { useState, useEffect } from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trophy, Shield, Search, UserPlus, Check, X, ShieldAlert, Heart, Trophy as TrophyIcon, RefreshCw, Send, AlertTriangle, Sparkles, Edit2, Trash2, UserMinus, Info, Calendar, Plus, ChevronDown, Activity, Zap, Clock, Play } from 'lucide-react';
import { REGIONS, POINTS_BASE, EFFORT_MULT } from '../store/constants';
import LegionOperationDetail from '../components/LegionOperationDetail';

const parseUserState = (profile) => {
  const defaults = { level: 1, streakCount: 0, currentTitle: 'Recruit', xp: 0 };
  if (!profile || !profile.state) return defaults;
  let state = {};
  if (typeof profile.state === 'string') {
    try {
      state = JSON.parse(profile.state);
    } catch (e) {}
  } else {
    state = profile.state;
  }
  return {
    level: state.level || defaults.level,
    streakCount: state.streakCount || defaults.streakCount,
    currentTitle: state.currentTitle || defaults.currentTitle,
    xp: state.xp || defaults.xp
  };
};

function useCountdown(deadlineIso) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!deadlineIso) return;
    
    const calculateTime = () => {
      const difference = +new Date(deadlineIso) - +new Date();
      if (difference <= 0) {
        setTimeLeft('EXPIRED');
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      let str = '';
      if (days > 0) str += `${days}d `;
      if (hours > 0 || days > 0) str += `${hours}h `;
      str += `${minutes}m ${seconds}s`;
      setTimeLeft(str);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [deadlineIso]);

  return timeLeft;
}

function LegionOpCountdown({ deadline }) {
  const countdown = useCountdown(deadline);
  return (
    <span className="text-[9px] font-mono text-gold-bright bg-gold-core/10 px-2 py-0.5 border border-gold-core/20 rounded shadow-[0_0_8px_rgba(197,160,89,0.15)] flex items-center gap-1 flex-shrink-0">
      <Clock size={8} /> {countdown}
    </span>
  );
}

function CustomDatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dateObj = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewMonth, setViewMonth] = useState(dateObj.getMonth());
  const [viewYear, setViewYear] = useState(dateObj.getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    onChange(`${viewYear}-${formattedMonth}-${formattedDay}`);
    setIsOpen(false);
  };

  const daysArray = [];
  for (let i = 0; i < startOffset; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  const displayDate = value ? new Date(value + 'T00:00:00').toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  }) : 'Select Date...';

  return (
    <div className="custom-date-picker-container" style={{ position: 'relative', width: '100%' }}>
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-transparent" onClick={() => setIsOpen(false)} />
      )}
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'relative', zIndex: 101 }}
      >
        <span>{displayDate}</span>
        <Calendar size={12} className="text-gold-core" />
      </button>

      {isOpen && (
        <div className="custom-calendar-dropdown" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', zIndex: 102 }}>
          <div className="calendar-header">
            <button type="button" onClick={handlePrevMonth} className="cal-nav-btn">&lt;</button>
            <span className="calendar-month-year">{months[viewMonth]} {viewYear}</span>
            <button type="button" onClick={handleNextMonth} className="cal-nav-btn">&gt;</button>
          </div>
          <div className="calendar-weekdays">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(w => (
              <span key={w} className="calendar-weekday">{w}</span>
            ))}
          </div>
          <div className="calendar-days">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <span key={`empty-${idx}`} className="calendar-day empty" />;
              }
              const isSelected = value === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`calendar-day ${isSelected ? 'selected' : ''}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default function Social() {
  const {
    user,
    friendships,
    leaderboard,
    leaderboardEvents,
    activeLegion,
    legionMembers,
    legionOperations,
    legionSubtasks,
    legionEvents,
    fetchSocialData,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    createLegion,
    inviteLegionMember,
    initiateLegionOperation,
    respondToSubtask,
    lockLegionOperation,
    restrainLegionMember,
    completeLegionSubtask,
    submitFailureNote,
    renameLegion,
    leaveLegion,
    disbandLegion,
    kickLegionMember,
    cancelLegionOperation,
    removeOperationSubtask,
    reassignOperationSubtask,
    streakCount,
    level,
    executionScore
  } = useWarscytheStore();

  const [activeSubTab, setActiveSubTab] = useState('leaderboard');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchSuccess, setSearchSuccess] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [legionNameInput, setLegionNameInput] = useState('');
  const [inviteFriendId, setInviteFriendId] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameInput, setRenameInput] = useState('');
  
  // Collaborative Operation Creation
  const [opTaskTitle, setOpTaskTitle] = useState('');
  const [opEffort, setOpEffort] = useState('Medium');
  
  const defaultOpDate = new Date();
  defaultOpDate.setDate(defaultOpDate.getDate() + 7);
  const [opDeadline, setOpDeadline] = useState(() => defaultOpDate.toISOString().slice(0, 10));
  const [subtaskInputs, setSubtaskInputs] = useState([]);

  const [effortOpen, setEffortOpen] = useState(false);
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [draftSubTitle, setDraftSubTitle] = useState('');
  const [draftSubAssignee, setDraftSubAssignee] = useState('');
  const [draftSubPriority, setDraftSubPriority] = useState('medium');
  
  const defaultSubDate = new Date();
  defaultSubDate.setDate(defaultSubDate.getDate() + 3);
  const [draftSubDeadline, setDraftSubDeadline] = useState(() => defaultSubDate.toISOString().slice(0, 10));
  
  // Failure note state
  const [failureNoteSubtaskId, setFailureNoteSubtaskId] = useState(null);
  const [failureNoteText, setFailureNoteText] = useState('');
  
  // Selected Legion Operation details modal
  const [selectedLegionOpId, setSelectedLegionOpId] = useState(null);

  // Opt-in Competitive Mode (solo tranquility vs social comparison)
  const [leaderboardMode, setLeaderboardMode] = useState('friends');

  useEffect(() => {
    fetchSocialData();
    const interval = setInterval(fetchSocialData, 10000); // Poll every 10 seconds for real-time states
    return () => clearInterval(interval);
  }, []);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;
    setSearchError('');
    setSearchSuccess('');
    setIsSearching(true);

    try {
      await sendFriendRequest(searchEmail.trim());
      setSearchSuccess('Operative request transmitted successfully.');
      setSearchEmail('');
    } catch (err) {
      setSearchError(err.message || 'Transmission failed.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateLegion = async (e) => {
    e.preventDefault();
    if (!legionNameInput.trim()) return;
    try {
      await createLegion(legionNameInput.trim());
      setLegionNameInput('');
    } catch (err) {
      alert('Forge failed: ' + err.message);
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteFriendId) return;
    try {
      await inviteLegionMember(activeLegion.id, inviteFriendId);
      setInviteFriendId('');
    } catch (err) {
      alert('Invite failed: ' + err.message);
    }
  };

  const handleAddSubtask = () => {
    if (!draftSubTitle.trim()) {
      alert('Sub-task objective identifier is required.');
      return;
    }
    if (!draftSubAssignee) {
      alert('Sub-task assignee is required.');
      return;
    }
    if (!draftSubDeadline) {
      alert('Sub-task deadline is required.');
      return;
    }
    setSubtaskInputs([...subtaskInputs, {
      title: draftSubTitle.trim(),
      assignedTo: draftSubAssignee,
      priority: draftSubPriority,
      deadline: draftSubDeadline,
      xpValue: 100
    }]);
    
    setDraftSubTitle('');
    setDraftSubAssignee('');
    setDraftSubPriority('medium');
  };

  const handleRemoveSubtaskInput = (idx) => {
    setSubtaskInputs(subtaskInputs.filter((_, i) => i !== idx));
  };

  const handleSubtaskChange = (idx, field, value) => {
    const updated = [...subtaskInputs];
    updated[idx][field] = value;
    setSubtaskInputs(updated);
  };

  const handleStartOperation = async (e) => {
    e.preventDefault();
    if (!opTaskTitle.trim()) return;
    if (!opDeadline) {
      alert('Parent operation deadline is required.');
      return;
    }
    
    // Auto-create subtasks list
    const subtasks = subtaskInputs.filter(s => s.assignedTo !== '');
    if (subtasks.length === 0) {
      alert('At least one sub-task assignment is required.');
      return;
    }

    // Validate that each subtask has a title and a deadline
    for (const sub of subtasks) {
      if (!sub.title || !sub.title.trim()) {
        alert('All assignments must have an objective name.');
        return;
      }
      if (!sub.deadline) {
        alert('All assignments must have a deadline.');
        return;
      }
    }

    const coreXp = POINTS_BASE * (EFFORT_MULT[opEffort] || 1);
    const numSubtasks = subtasks.length;
    const automatedXp = numSubtasks > 0 ? Math.round(coreXp / numSubtasks) : coreXp;

    const deadline = new Date(opDeadline);

    try {
      const parentId = generateUUID(); // generated parent key
      const mappedSubtasks = subtasks.map(s => ({
        ...s,
        title: `${opTaskTitle.trim()} // ${s.title}`,
        xpValue: automatedXp,
        deadline: new Date(s.deadline).toISOString()
      }));
      await initiateLegionOperation(activeLegion.id, parentId, deadline.toISOString(), mappedSubtasks);
      setOpTaskTitle('');
      setSubtaskInputs([]);
    } catch (err) {
      alert('Initiation failed: ' + err.message);
    }
  };

  const handleFailureNoteSubmit = async (e) => {
    e.preventDefault();
    if (!failureNoteText.trim()) return;
    try {
      await submitFailureNote(failureNoteSubtaskId, failureNoteText.trim());
      setFailureNoteSubtaskId(null);
      setFailureNoteText('');
    } catch (err) {
      alert('Failed to log explanation: ' + err.message);
    }
  };

  // Process relationships to get active friends list
  const pendingRequests = (friendships || []).filter(f => f.status === 'pending' && f.receiver_id === user?.id);
  const sentRequests = (friendships || []).filter(f => f.status === 'pending' && f.requester_id === user?.id);
  const friends = (friendships || []).filter(f => f.status === 'accepted' && (f.requester || f.receiver)).map(f => {
    const other = f.requester_id === user?.id ? f.receiver : f.requester;
    return {
      friendshipId: f.id,
      profile: other,
      stats: parseUserState(other)
    };
  });

  // Dynamic automated XP calculations
  const coreXp = POINTS_BASE * (EFFORT_MULT[opEffort] || 1);
  const automatedXp = subtaskInputs.length > 0 ? Math.round(coreXp / subtaskInputs.length) : coreXp;

  const effortOptions = [
    { value: 'Low', label: 'RECON (LOW)' },
    { value: 'Medium', label: 'SKIRMISH (MED)' },
    { value: 'High', label: 'ASSAULT (HIGH)' },
    { value: 'Boss', label: 'BOSS RAID' }
  ];

  return (
    <div className="social-page-container">
      {/* 🧭 SOCIAL SUB-NAVBAR */}
      <div className="social-sub-nav relative flex items-center justify-center">
        <div className="flex gap-8 justify-center flex-1">
          <button 
            onClick={() => setActiveSubTab('leaderboard')}
            className={`social-nav-item ${activeSubTab === 'leaderboard' ? 'active' : ''}`}
          >
            <Trophy size={14} />
            <span>LEADERBOARD</span>
          </button>
          <button 
            onClick={() => setActiveSubTab('friends')}
            className={`social-nav-item ${activeSubTab === 'friends' ? 'active' : ''}`}
          >
            <Users size={14} />
            <span>OPERATIVE GRAPH ({friends.length})</span>
          </button>
          <button 
            onClick={() => setActiveSubTab('legion')}
            className={`social-nav-item ${activeSubTab === 'legion' ? 'active' : ''}`}
          >
            <Shield size={14} />
            <span>LEGION COMMAND</span>
          </button>
        </div>
        <div className="flex items-center gap-2 absolute right-4">
          <button 
            type="button"
            onClick={() => {
              useWarscytheStore.getState().openVideoModal('legion');
            }}
            className="text-gray-500 hover:text-gold-core transition-colors p-1 hover:bg-white/5 rounded cursor-pointer flex items-center justify-center"
            title="Play Walkthrough Guide"
          >
            <Play size={12} fill="currentColor" className="text-gold-core" />
          </button>
          <button 
            type="button"
            onClick={() => useWarscytheStore.getState().openInfoModal('social')}
            className="text-gray-500 hover:text-gold-core transition-colors p-1 hover:bg-white/5 rounded cursor-pointer flex items-center justify-center"
            title="Social Info"
          >
            <Info size={14} />
          </button>
        </div>
      </div>

      <div className="social-tab-content">
        <AnimatePresence mode="wait">
          
          {/* ==================== 1. LEADERBOARD TAB ==================== */}
          {activeSubTab === 'leaderboard' && (
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="social-grid-layout"
            >
              {/* LEFT COLUMN: SELF-COMPARISON CAMPFIRE */}
              <div className="social-panel-left select-none">
                <div className="panel-title-row">
                  <Sparkles size={12} className="text-gold-core" />
                  <h3>CAMPFIRE LOG</h3>
                </div>

                <div className="flex flex-col gap-5 mt-4">
                  {/* Current stats vs personal bests */}
                  <div className="self-camp-card">
                    <span className="camp-label">WEEKLY VELOCITY</span>
                    <div className="flex justify-between items-end mt-1">
                      <span className="camp-value">{executionScore} XP</span>
                      <span className="camp-sub">Active Record</span>
                    </div>
                  </div>

                  <div className="self-camp-card">
                    <span className="camp-label">STREAK ASCENT</span>
                    <div className="flex justify-between items-end mt-1">
                      <span className="camp-value">{streakCount} DAYS</span>
                      <span className="camp-sub">Best: {Math.max(streakCount, 30)}</span>
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

                  {/* Narrative Events Feed */}
                  <div className="narrative-feed">
                    <span className="feed-header uppercase">Campfire Whispers</span>
                    <div className="feed-list mt-3 flex flex-col gap-3">
                      {leaderboardEvents.length === 0 ? (
                        <div className="text-[10px] text-gray-500 font-mono italic">The air is silent...</div>
                      ) : (
                        leaderboardEvents.map((evt) => (
                          <div key={evt.id} className="feed-item font-serif text-[11px] leading-relaxed">
                            <span className="text-gold-core font-mono mr-1">[{evt.profile?.username || evt.profile?.email?.split('@')[0] || 'Operative'}]</span>
                            {evt.event_description}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: FRIENDS RANKINGS */}
              <div className="social-panel-right" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="standings-black-mask" style={{ position: 'absolute', inset: 0, backgroundColor: '#000000', zIndex: 0 }} />
                <div className="standings-bg-overlay" style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/bonfire.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom center', opacity: 0.25, pointerEvents: 'none', zIndex: 1 }} />
                <div className="standings-content-wrapper">
                  <div className="panel-title-row flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <TrophyIcon size={12} className="text-gold-core" />
                      <h3>TACTICAL STANDINGS</h3>
                    </div>
                    <button 
                      onClick={() => setLeaderboardMode(leaderboardMode === 'friends' ? 'solo' : 'friends')}
                      className="mode-toggle-btn uppercase"
                    >
                      MODE: {leaderboardMode}
                    </button>
                  </div>

                  {leaderboardMode === 'solo' ? (
                    <div className="solo-tranquility-card">
                      <Shield size={32} className="text-gold-core/40 animate-pulse" />
                      <h4 className="font-serif">Solo Tranquility Mode Active</h4>
                      <p className="font-mono">Other operatives are hidden. Focus entirely on your own execution curve.</p>
                    </div>
                  ) : (
                    <div className="leaderboard-table-container custom-scrollbar">
                      <table className="leaderboard-table font-mono">
                        <thead>
                          <tr>
                            <th className="w-12">RANK</th>
                            <th>OPERATIVE</th>
                            <th className="text-right">STREAK</th>
                            <th className="text-right">WEEKLY XP</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboard.map((row, idx) => {
                            const isSelf = row.user_id === user.id;
                            return (
                              <tr key={row.id} className={isSelf ? 'self-row font-bold text-gold-core' : ''}>
                                <td className="rank-num">#{idx + 1}</td>
                                <td className="user-email text-left truncate max-w-[120px]">
                                  {row.profile?.username || row.profile?.email?.split('@')[0] || 'Operative'}
                                </td>
                                <td className="text-right">{row.streak_days} DAYS</td>
                                <td className="text-right">{row.weekly_xp}</td>
                              </tr>
                            );
                          })}
                          {leaderboard.length === 0 && (
                            <tr>
                              <td colSpan="4" className="text-center text-gray-500 py-8 italic text-[10px]">
                                No snapshots generated. Complete operations to trigger.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== 2. FRIENDS LIST TAB ==================== */}
          {activeSubTab === 'friends' && (
            <motion.div 
              key="friends"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="social-grid-layout"
            >
              {/* LEFT COLUMN: PENDING REQUESTS & ADD FRIEND */}
              <div className="social-panel-left">
                <div className="panel-title-row">
                  <UserPlus size={12} className="text-gold-core" />
                  <h3>RECRUIT OPERATIVES</h3>
                </div>

                <form onSubmit={handleSendRequest} className="add-friend-form mt-4">
                  <div className="input-group">
                    <input 
                      type="text" 
                      placeholder="Operative Username or Email..." 
                      value={searchEmail}
                      onChange={e => setSearchEmail(e.target.value)}
                      className="friend-email-input font-mono"
                    />
                    <button type="submit" disabled={isSearching} className="friend-add-btn">
                      {isSearching ? <RefreshCw className="animate-spin" size={14} /> : <Search size={14} />}
                    </button>
                  </div>
                  {searchError && <span className="error-msg font-mono mt-1 block">{searchError}</span>}
                  {searchSuccess && <span className="success-msg font-mono mt-1 block">{searchSuccess}</span>}
                </form>

                {/* INCOMING REQUESTS */}
                <div className="incoming-requests-container mt-6">
                  <span className="sec-label">Incoming Dispatches</span>
                  <div className="requests-list mt-3 flex flex-col gap-2">
                    {pendingRequests.map(req => (
                      <div key={req.id} className="request-card font-mono text-[10px] flex justify-between items-center">
                        <span className="truncate max-w-[120px]">{req.requester?.username || req.requester?.email?.split('@')[0] || 'Operative'}</span>
                        <div className="flex gap-2">
                          <button onClick={() => acceptFriendRequest(req.id)} className="accept-req-btn">
                            <Check size={12} />
                          </button>
                          <button onClick={() => declineFriendRequest(req.id)} className="decline-req-btn">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {pendingRequests.length === 0 && (
                      <span className="text-gray-500 font-mono text-[9px] italic">No incoming dispatches.</span>
                    )}
                  </div>
                </div>

                {/* SENT REQUESTS */}
                <div className="sent-requests-container mt-6">
                  <span className="sec-label">Sent Signals</span>
                  <div className="requests-list mt-3 flex flex-col gap-2">
                    {sentRequests.map(req => (
                      <div key={req.id} className="request-card font-mono text-[10px] flex justify-between items-center opacity-65">
                        <span className="truncate max-w-[120px]">{req.receiver?.username || req.receiver?.email?.split('@')[0] || 'Operative'}</span>
                        <span className="text-[7px] uppercase tracking-widest text-gold-core">PENDING</span>
                      </div>
                    ))}
                    {sentRequests.length === 0 && (
                      <span className="text-gray-500 font-mono text-[9px] italic">No active signals sent.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: FRIENDS DIRECTORY */}
              <div className="social-panel-right">
                <div className="panel-title-row">
                  <Users size={12} className="text-gold-core" />
                  <h3>OPERATIVE REGISTRY</h3>
                </div>

                <div className="friends-directory-list custom-scrollbar mt-4 flex flex-col gap-3">
                  {friends.map(friend => (
                    <div key={friend.friendshipId} className="friend-row-card glass-panel flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="friend-avatar-container">
                          {/* Renders frame based on friend's level */}
                          <img 
                            src={`/legion/frames/legion-frame-${Math.min(friend.stats.level, 10)}.png`}
                            onError={(e) => { e.target.src = '/command-core.png'; }} 
                            className="avatar-frame-overlay"
                            alt=""
                          />
                          <span className="friend-level-num">Lvl {friend.stats.level}</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="friend-email font-mono font-bold text-xs">{friend.profile?.username || friend.profile?.email?.split('@')[0] || 'Operative'}</span>
                          <span className="friend-title text-[9px] uppercase tracking-widest text-gold-core">{friend.stats.currentTitle}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col text-right font-mono">
                          <span className="text-[10px] text-gray-300 font-bold">{friend.stats.streakCount} DAYS</span>
                          <span className="text-[7px] text-gray-500 uppercase tracking-widest">Active Streak</span>
                        </div>
                        <button onClick={() => removeFriend(friend.friendshipId)} className="unfriend-btn" title="Sever link silently">
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {friends.length === 0 && (
                    <div className="text-center text-gray-500 py-12 italic font-mono text-[10px]">
                      Operative graph remains disconnected. Invite friends via email.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== 3. LEGION COMMAND TAB ==================== */}
          {activeSubTab === 'legion' && (
            <motion.div 
              key="legion"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="social-grid-layout"
            >
              {!activeLegion ? (
                /* NO LEGION: CREATE OR JOIN */
                <div className="no-legion-container elite-panel">
                  <Shield size={48} className="text-gold-core/40 animate-pulse mb-4" />
                  <h2 className="font-serif text-lg text-white">FORGE COALITION</h2>
                  <p className="font-mono text-gray-400 text-xs mt-2 max-w-sm">
                    Legion Operations turn shared goals into shared records. Forge a persistent group with other operatives.
                  </p>

                  <form onSubmit={handleCreateLegion} className="create-legion-form mt-8 max-w-xs w-full">
                    <input 
                      type="text" 
                      placeholder="Legion Name..." 
                      value={legionNameInput}
                      onChange={e => setLegionNameInput(e.target.value)}
                      className="legion-name-input font-mono mb-4 text-center"
                    />
                    <button type="submit" className="legion-forge-btn">
                      <span>FORGE COALITION</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* ACTIVE LEGION VIEW */
                <>
                  {/* LEFT COLUMN: LEGION STATS, MEMBERS & INVITATIONS */}
                  <div className="social-panel-left select-none">
                    <div className="legion-profile-card flex flex-col items-center text-center">
                      <div className="legion-banner-display relative w-full h-36 flex flex-col items-center justify-center border border-white/5 bg-black/40 overflow-hidden mb-4">
                        <img 
                          src={`/legion/banners/legion-banner-${Math.min(activeLegion.level, 10)}.png`}
                          onError={(e) => { e.target.src = '/olympus-bg.png'; }}
                          className="legion-banner-img absolute inset-0 w-full h-full object-cover opacity-60"
                          alt=""
                        />
                        {isRenaming ? (
                          <form 
                            onSubmit={async (e) => {
                              e.preventDefault();
                              if (!renameInput.trim()) return;
                              try {
                                await renameLegion(activeLegion.id, renameInput.trim());
                                setIsRenaming(false);
                              } catch (err) {
                                alert('Rename failed: ' + err.message);
                              }
                            }}
                            className="relative z-10 flex gap-2 w-[80%]"
                          >
                            <input 
                              type="text"
                              value={renameInput}
                              onChange={(e) => setRenameInput(e.target.value)}
                              className="flex-1 font-mono text-[10px] bg-black/90 text-white border border-gold-core/40 px-2 py-1 rounded outline-none uppercase tracking-wider text-center"
                              autoFocus
                            />
                            <button type="submit" className="p-1.5 border border-green-500 text-green-500 rounded bg-black/90 hover:bg-green-500/10"><Check size={10} /></button>
                            <button type="button" onClick={() => setIsRenaming(false)} className="p-1.5 border border-red-500 text-red-500 rounded bg-black/90 hover:bg-red-500/10"><X size={10} /></button>
                          </form>
                        ) : (
                          <div className="relative z-10 flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded border border-white/5 backdrop-blur-sm">
                            <span className="font-display text-white text-md tracking-widest uppercase">{activeLegion.name}</span>
                            {activeLegion.owner_id === user?.id && (
                              <button 
                                onClick={() => { setRenameInput(activeLegion.name); setIsRenaming(true); }}
                                className="text-white/40 hover:text-gold-core p-1 transition-colors"
                              >
                                <Edit2 size={10} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-gold-core">LEGION LEVEL {activeLegion.level}</span>
                      <span className="text-[8px] font-mono text-gray-500 mt-1">TOTAL XP CONTRIBUTED: {activeLegion.total_xp}</span>
                    </div>

                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

                    {/* MEMBERS DIRECTORY */}
                    <div className="legion-members-list mt-2">
                      <span className="sec-label mb-2 block text-left">Garrison</span>
                      <div className="flex flex-col gap-2">
                        {(legionMembers || []).map(member => {
                          const isCreator = member.role === 'creator';
                          return (
                            <div key={member.id} className="member-item flex justify-between items-center text-left">
                              <div className="flex flex-col font-mono text-[10px]">
                                <span className="font-bold">{member.profile?.username || member.profile?.email?.split('@')[0] || 'Unknown'}</span>
                                <span className="text-[7px] text-gold-core/80 uppercase">{member.role}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {isCreator && <span className="text-[7px] font-mono border border-gold-core/40 text-gold-core px-1 py-0.5 rounded">LEADER</span>}
                                {!isCreator && activeLegion.owner_id === user?.id && (
                                  <button
                                    onClick={async () => {
                                      if (confirm(`Exile ${member.profile?.username || member.profile?.email?.split('@')[0] || 'Unknown'} from the Garrison?`)) {
                                        try {
                                          await kickLegionMember(activeLegion.id, member.user_id);
                                        } catch (err) {
                                          alert('Exile failed: ' + err.message);
                                        }
                                      }
                                    }}
                                    className="text-[8px] border border-red-500/20 text-red-500 p-1 rounded hover:border-red-500 hover:bg-red-500/5 transition-colors"
                                    title="Exile member"
                                  >
                                    <UserMinus size={10} />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* LEAVE / DISBAND ACTION */}
                      <div className="mt-4 border-t border-white/5 pt-3">
                        {activeLegion.owner_id === user?.id ? (
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm("Are you sure you want to DISBAND this Legion? This action is irreversible and all members will be removed.")) {
                                try {
                                  await disbandLegion(activeLegion.id);
                                } catch (err) {
                                  alert("Disband failed: " + err.message);
                                }
                              }
                            }}
                            className="w-full py-1.5 font-mono text-[8px] border border-red-500/40 text-red-500 rounded text-center hover:bg-red-500/10 transition-colors uppercase tracking-widest"
                          >
                            Disband Legion
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm("Are you sure you want to LEAVE this Legion?")) {
                                try {
                                  await leaveLegion(activeLegion.id);
                                } catch (err) {
                                  alert("Leave failed: " + err.message);
                                }
                              }
                            }}
                            className="w-full py-1.5 font-mono text-[8px] border border-red-500/40 text-red-500 rounded text-center hover:bg-red-500/10 transition-colors uppercase tracking-widest"
                          >
                            Leave Legion
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

                    {/* INVITE COALITION MEMBER */}
                    {activeLegion.owner_id === user?.id && (
                      <form onSubmit={handleInviteMember} className="invite-member-form">
                        <span className="sec-label mb-2 block text-left">Reinforce garrison</span>
                        <div className="flex gap-2">
                          <select 
                            value={inviteFriendId}
                            onChange={e => setInviteFriendId(e.target.value)}
                            className="invite-friend-select font-mono flex-1 bg-black/40 text-white border border-white/10 rounded px-2 text-[10px]"
                          >
                            <option value="">Select Friend...</option>
                            {friends
                              .filter(f => !(legionMembers || []).some(m => m.user_id === f.profile?.id))
                              .map(f => (
                                <option key={f.profile?.id} value={f.profile?.id}>{f.profile?.username || f.profile?.email?.split('@')[0] || 'Unknown'}</option>
                              ))}
                          </select>
                          <button type="submit" className="invite-btn p-2 border border-gold-core/40 text-gold-core rounded flex items-center justify-center hover:bg-gold-core/10">
                            <UserPlus size={12} />
                          </button>
                        </div>
                      </form>
                    )}

                    {/* 📜 LEGION HISTORY WINDOW */}
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />
                    
                    <div className="legion-history-section text-left">
                      <span className="sec-label mb-3 block text-left flex items-center gap-2">
                        <Calendar size={12} className="text-gold-core" /> Ledger of Legions (History)
                      </span>
                      
                      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                        {(legionOperations || []).filter(op => op.status === 'success').length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-6 gap-2 border border-dashed border-white/5 rounded">
                            <span className="text-[9px] font-mono text-gray-600 tracking-wider uppercase text-center block w-full">No operations logged</span>
                          </div>
                        ) : (
                          (legionOperations || [])
                            .filter(op => op.status === 'success')
                            .map((op, i) => {
                              const subtasksForOp = (legionSubtasks || []).filter(s => s.legion_operation_id === op.id && s.acceptance_status !== 'removed_pre_start');
                              const firstSub = subtasksForOp[0];
                              const parts = (firstSub?.title || '').split(' // ');
                              const parentTitle = parts.length > 1 && parts[0] ? parts[0] : (firstSub?.title || 'Unnamed Operation');
                              
                              return (
                                <div 
                                  key={op.id}
                                  className="p-3 border border-gold-core/20 bg-gradient-to-r from-gold-core/[0.02] to-transparent rounded flex flex-col gap-2 cursor-pointer hover:border-gold-core/40 transition-all"
                                  onClick={() => setSelectedLegionOpId(op.id)}
                                >
                                  <div className="flex items-start gap-2.5 justify-between">
                                    <div className="flex items-start gap-2 min-w-0 flex-1">
                                      <div className="mt-0.5 w-4 h-4 rounded flex items-center justify-center border border-gold-core/30 text-gold-core bg-gold-core/5 flex-shrink-0">
                                        <Check size={8} />
                                      </div>
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <h4 className="text-white font-display text-[10px] tracking-wider uppercase leading-snug truncate">
                                          {parentTitle}
                                        </h4>
                                        <span className="text-[7px] font-mono text-gray-500 uppercase">
                                          Completed: {op.completed_at ? new Date(op.completed_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="px-1.5 py-0.5 rounded text-[7px] font-mono tracking-widest font-extrabold uppercase border text-gold-bright bg-gold-core/10 border-gold-core/20 shadow-[0_0_8px_rgba(197,160,89,0.15)] flex-shrink-0">
                                      CONQUERED
                                    </span>
                                  </div>
                                  
                                  {/* Subtasks Detail View */}
                                  <div className="flex flex-col gap-1 mt-1 pl-6 border-l border-white/5">
                                    {subtasksForOp.map(sub => {
                                      const assigneeName = sub.assignee?.username || sub.assignee?.email?.split('@')[0] || 'Unknown';
                                      const sParts = (sub.title || '').split(' // ');
                                      const subTitle = sParts.length > 1 ? sParts[1] : sub.title;
                                      return (
                                        <div key={sub.id} className="text-[7px] font-mono text-gray-500 flex justify-between uppercase">
                                          <span className="truncate flex-1 pr-2 text-left">{subTitle} ({assigneeName})</span>
                                          <span className="text-gold-core font-bold shrink-0">{sub.completion_status}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: COLLABORATIVE OPERATIONS BOARD */}
                  <div className="social-panel-right">
                    <div className="panel-title-row">
                      <Shield size={12} className="text-gold-core" />
                      <h3>COLLECTIVE OPERATIONS</h3>
                    </div>

                    {/* SECTION A: CREATE AND INITIATE COLLABORATIVE RUN */}
                    {activeLegion.owner_id === user?.id && (
                      <form onSubmit={handleStartOperation} className="collective-ops-form mt-4 border border-gold-core/25 bg-black/40 p-6 flex flex-col gap-6 text-left relative z-50 rounded">
                        {(effortOpen || assigneeDropdownOpen || priorityDropdownOpen) && (
                          <div 
                            className="fixed inset-0 z-40 bg-transparent" 
                            onClick={() => { 
                              setEffortOpen(false); 
                              setAssigneeDropdownOpen(false); 
                              setPriorityDropdownOpen(false); 
                            }} 
                          />
                        )}

                        <div className="modal-title-box mb-2 border-b border-gold-core/10 pb-3 flex items-center gap-2">
                          <Shield size={16} className="text-gold-core" />
                          <h2 className="text-[14px] font-serif text-gold-core tracking-widest uppercase">Initiate Tactical Run</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* COLUMN 1: CAMPAIGN PARAMETERS */}
                          <div className="flex flex-col gap-4 border-r border-white/5 pr-0 md:pr-6">
                            <h3 className="text-[10px] font-serif text-gold-core/70 tracking-widest uppercase mb-2 border-b border-white/5 pb-1">Campaign Parameters</h3>
                            
                            <div className="form-group">
                              <label><Zap size={12} className="text-gold-core" /> Objective Identifier (Parent Operation)</label>
                              <input 
                                type="text" 
                                placeholder="ENTER OPERATION PROTOCOL..." 
                                value={opTaskTitle}
                                onChange={e => setOpTaskTitle(e.target.value)}
                                required
                              />
                            </div>

                            <div className="form-group" style={{ position: 'relative', zIndex: effortOpen ? 200 : 10 }}>
                              <label><Activity size={12} className="text-gold-core" /> Resistance Level</label>
                              <div className="custom-select-container">
                                <button 
                                  type="button" 
                                  className="custom-select-trigger" 
                                  onClick={() => { setEffortOpen(!effortOpen); }}
                                >
                                  <span>{effortOptions.find(o => o.value === opEffort)?.label || opEffort}</span>
                                  <ChevronDown size={12} className="text-gold-core" />
                                </button>
                                {effortOpen && (
                                  <div className="custom-select-options">
                                    {effortOptions.map(opt => (
                                      <div 
                                        key={opt.value} 
                                        className="custom-select-option" 
                                        onClick={() => { setOpEffort(opt.value); setEffortOpen(false); }}
                                      >
                                        {opt.label}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="form-group" style={{ position: 'relative', zIndex: 5 }}>
                              <label><Calendar size={12} className="text-gold-core" /> Target Deadline</label>
                              <CustomDatePicker 
                                value={opDeadline} 
                                onChange={setOpDeadline} 
                              />
                            </div>
                          </div>

                          {/* COLUMN 2: SUB-TASKS DECOMPOSITION */}
                          <div className="flex flex-col gap-4">
                            <h3 className="text-[10px] font-serif text-gold-core/70 tracking-widest uppercase mb-2 border-b border-white/5 pb-1">Operative Assignments</h3>

                            <div className="form-group">
                              <label>Sub-Task Objective Name</label>
                              <input 
                                type="text" 
                                placeholder="ADD STEP PROTOCOL..." 
                                value={draftSubTitle}
                                onChange={e => setDraftSubTitle(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="form-group" style={{ position: 'relative', zIndex: assigneeDropdownOpen ? 200 : 10 }}>
                                <label>Assignee</label>
                                <div className="custom-select-container">
                                  <button 
                                    type="button" 
                                    className="custom-select-trigger" 
                                    onClick={() => { setAssigneeDropdownOpen(!assigneeDropdownOpen); setPriorityDropdownOpen(false); }}
                                  >
                                    <span>
                                      {(() => {
                                        const selected = (legionMembers || []).find(m => m.user_id === draftSubAssignee);
                                        return selected ? (selected.profile?.username || selected.profile?.email?.split('@')[0] || 'Unknown') : 'Select Operative...';
                                      })()}
                                    </span>
                                    <ChevronDown size={12} className="text-gold-core" />
                                  </button>
                                  {assigneeDropdownOpen && (
                                    <div className="custom-select-options">
                                      <div 
                                        className="custom-select-option" 
                                        onClick={() => { setDraftSubAssignee(''); setAssigneeDropdownOpen(false); }}
                                      >
                                        Select Operative...
                                      </div>
                                      {(legionMembers || []).map(m => (
                                        <div 
                                          key={m.user_id} 
                                          className="custom-select-option" 
                                          onClick={() => { setDraftSubAssignee(m.user_id); setAssigneeDropdownOpen(false); }}
                                        >
                                          {m.profile?.username || m.profile?.email?.split('@')[0] || 'Unknown'}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="form-group" style={{ position: 'relative', zIndex: priorityDropdownOpen ? 200 : 9 }}>
                                <label>Priority</label>
                                <div className="custom-select-container">
                                  <button 
                                    type="button" 
                                    className="custom-select-trigger" 
                                    onClick={() => { setPriorityDropdownOpen(!priorityDropdownOpen); setAssigneeDropdownOpen(false); }}
                                  >
                                    <span className="capitalize">{draftSubPriority}</span>
                                    <ChevronDown size={12} className="text-gold-core" />
                                  </button>
                                  {priorityDropdownOpen && (
                                    <div className="custom-select-options">
                                      {['low', 'medium', 'high', 'boss'].map(p => (
                                        <div 
                                          key={p} 
                                          className="custom-select-option capitalize" 
                                          onClick={() => { setDraftSubPriority(p); setPriorityDropdownOpen(false); }}
                                        >
                                          {p}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="form-group" style={{ position: 'relative', zIndex: 5 }}>
                                <label>Deadline</label>
                                <CustomDatePicker 
                                  value={draftSubDeadline} 
                                  onChange={setDraftSubDeadline} 
                                />
                              </div>
                              <div className="flex items-end">
                                <button 
                                  type="button" 
                                  onClick={handleAddSubtask} 
                                  className="add-assignment-btn"
                                >
                                  <Plus size={12} /> ADD ASSIGNMENT
                                </button>
                              </div>
                            </div>

                            {/* List of current assignments */}
                            <div className="subtask-items-list mt-2 flex flex-col gap-2 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                              {subtaskInputs.map((st, idx) => {
                                const assigneeMember = (legionMembers || []).find(m => m.user_id === st.assignedTo);
                                const assigneeName = assigneeMember?.profile?.username || assigneeMember?.profile?.email?.split('@')[0] || 'Unknown';
                                return (
                                  <div key={idx} className="flex justify-between items-center bg-white/[0.02] border border-gold-core/10 px-3 py-1.5 rounded text-[10px] font-serif">
                                    <div className="flex flex-col text-left">
                                      <span className="font-bold text-white text-[10px] uppercase tracking-wide">{st.title}</span>
                                      <div className="flex items-center gap-2 text-[8px] text-gold-core/60 mt-0.5 uppercase">
                                        <span>Operative: {assigneeName}</span>
                                        <span>•</span>
                                        <span>Priority: {st.priority}</span>
                                        <span>•</span>
                                        <span>XP: {automatedXp}</span>
                                      </div>
                                    </div>
                                    <button 
                                      type="button" 
                                      onClick={() => handleRemoveSubtaskInput(idx)}
                                      className="text-gray-500 hover:text-red-500 p-1"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Submit deployment button */}
                        <button type="submit" className="confirm-deployment-btn mt-4">
                          <span>CONFIRM DEPLOYMENT</span>
                        </button>
                      </form>
                    )}

                    {/* SECTION B: RUN OPERATIONS PANEL */}
                    <div className="operations-run-list mt-4 flex flex-col gap-4 text-left">
                      {(legionOperations || []).filter(op => op.status === 'active' || op.status === 'acceptance_open').map(op => {
                        const subtasksForOp = (legionSubtasks || []).filter(s => s.legion_operation_id === op.id && s.acceptance_status !== 'removed_pre_start');
                        const userSubtask = subtasksForOp.find(s => s.assigned_to === user?.id);
                        const isLocked = op.status !== 'acceptance_open';

                        const firstSub = subtasksForOp[0];
                        const parts = (firstSub?.title || '').split(' // ');
                        const parentTitle = parts.length > 1 && parts[0] ? parts[0] : (firstSub?.title || 'Unnamed Operation');

                        return (
                          <div 
                            key={op.id} 
                            className="op-run-card glass-panel p-4 border border-white/5 rounded cursor-pointer hover:border-gold-core/30 hover:shadow-[0_0_15px_rgba(197,160,89,0.05)] transition-all"
                            onClick={() => setSelectedLegionOpId(op.id)}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex flex-col">
                                <span className="text-[7px] font-mono text-gold-core uppercase tracking-wider">Active Legion Run</span>
                                <h4 className="font-serif text-[13px] text-white uppercase">{parentTitle}</h4>
                                <span className="text-[8px] font-mono text-gray-500 uppercase mt-0.5">Status: {(op.status || '').toUpperCase()}</span>
                              </div>
                              <div className="flex flex-col items-end gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                <LegionOpCountdown deadline={op.deadline} />
                                <span className="text-[7px] font-mono text-gray-500">DEADLINE: {new Date(op.deadline).toLocaleDateString()}</span>
                              </div>
                            </div>

                            {/* Subtask Status board */}
                            <div className="subtask-status-board flex flex-col gap-2 mt-3">
                              {subtasksForOp.map(s => {
                                const assigneeName = s.assignee?.username || s.assignee?.email?.split('@')[0] || 'Unknown';
                                const sParts = (s.title || '').split(' // ');
                                const cleanSubtaskTitle = sParts.length > 1 ? sParts[1] : s.title;
                                return (
                                  <div key={s.id} className="subtask-row flex justify-between items-start text-[10px] font-mono border-b border-white/[0.03] pb-2 pt-1">
                                    <div className="flex flex-col text-left">
                                      <span className="font-bold text-white text-[11px] uppercase tracking-wider">{cleanSubtaskTitle || 'UNNAMED OBJECTIVE'}</span>
                                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[8px] text-gray-500 mt-1 uppercase">
                                        <span>OPERATIVE: {assigneeName}</span>
                                        <span>•</span>
                                        <span className={`font-bold ${
                                          s.priority === 'boss' || s.priority === 'high' ? 'text-red-500' :
                                          s.priority === 'medium' ? 'text-amber-500' : 'text-green-500'
                                        }`}>PRIORITY: {s.priority || 'medium'}</span>
                                        <span>•</span>
                                        <span>DEADLINE: {s.deadline ? new Date(s.deadline).toLocaleDateString() : 'N/A'}</span>
                                      </div>
                                      <span className="text-[8px] text-gold-core mt-1">REWARD: {s.xp_value} XP</span>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                      {/* Acceptance display */}
                                      {!isLocked ? (
                                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                          <span className={`text-[8px] uppercase font-bold ${
                                            s.acceptance_status === 'accepted' ? 'text-green-500' : 
                                            s.acceptance_status === 'declined' ? 'text-red-500' : 'text-amber-500'
                                          }`}>
                                            {(s.acceptance_status || '').toUpperCase()}
                                          </span>
                                          {activeLegion.owner_id === user?.id && (
                                            <div className="flex items-center gap-1.5 ml-2">
                                              <select
                                                value={s.assigned_to}
                                                onClick={e => e.stopPropagation()}
                                                onChange={async (e) => {
                                                  const val = e.target.value;
                                                  if (val && val !== s.assigned_to) {
                                                    try {
                                                      await reassignOperationSubtask(s.id, val);
                                                    } catch (err) {
                                                      alert('Reassignment failed: ' + err.message);
                                                    }
                                                  }
                                                }}
                                                className="bg-black/80 border border-white/10 text-white text-[8px] font-mono rounded px-1.5 py-0.5 outline-none hover:border-gold-core/40 transition-colors"
                                              >
                                                {legionMembers.map(m => (
                                                  <option key={m.user_id} value={m.user_id}>
                                                    {m.profile?.username || m.profile?.email?.split('@')[0] || 'Unknown'}
                                                  </option>
                                                ))}
                                              </select>
                                              <button
                                                type="button"
                                                onClick={async (e) => {
                                                  e.stopPropagation();
                                                  if (confirm(`Remove this subtask assigned to ${assigneeName}?`)) {
                                                    try {
                                                      await removeOperationSubtask(s.id);
                                                    } catch (err) {
                                                      alert('Removal failed: ' + err.message);
                                                    }
                                                  }
                                                }}
                                                className="text-red-500 hover:text-red-400 p-0.5 border border-red-500/20 rounded bg-red-500/5 hover:bg-red-500/10 transition-colors"
                                                title="Remove Subtask"
                                              >
                                                <X size={10} />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        /* Completion status display */
                                        <span className={`text-[8px] uppercase font-bold ${
                                          s.completion_status === 'completed' || s.completion_status === 'covered' ? 'text-gold-core' : 
                                          s.completion_status === 'restrained' ? 'text-red-500' : 'text-gray-500'
                                        }`}>
                                          {(s.completion_status || '').toUpperCase()}
                                        </span>
                                      )}

                                      {/* Action options */}
                                      {op.status === 'active' && s.assigned_to === user?.id && s.completion_status === 'incomplete' && (
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); completeLegionSubtask(s.id, 'completed'); }}
                                          className="text-[8px] border border-gold-core/40 text-gold-core px-1.5 py-0.5 rounded cursor-pointer"
                                        >
                                          CONQUER
                                        </button>
                                      )}

                                      {op.status === 'active' && s.assigned_to !== user?.id && s.completion_status === 'incomplete' && (
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); completeLegionSubtask(s.id, 'covered'); }}
                                          className="text-[8px] border border-white/20 text-white/60 px-1.5 py-0.5 rounded hover:border-gold-core hover:text-gold-core cursor-pointer"
                                        >
                                          COVER
                                        </button>
                                      )}

                                      {op.status === 'active' && activeLegion.owner_id === user?.id && s.completion_status === 'incomplete' && (
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); restrainLegionMember(s.id); }}
                                          className="text-[8px] border border-red-500/20 text-red-500 px-1.5 py-0.5 rounded hover:border-red-500 hover:bg-red-500/5 cursor-pointer"
                                        >
                                          RESTRAIN
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Acceptance response for current user */}
                            {op.status === 'acceptance_open' && userSubtask && userSubtask.acceptance_status === 'pending' && (
                              <div className="acceptance-actions flex gap-3 mt-4" onClick={e => e.stopPropagation()}>
                                <button 
                                  onClick={() => respondToSubtask(userSubtask.id, 'accepted')}
                                  className="accept-op-btn flex-1 py-2 font-mono text-[9px] border border-green-500 text-green-500 rounded cursor-pointer"
                                >
                                  ACCEPT ASSIGNMENT
                                </button>
                                <button 
                                  onClick={() => respondToSubtask(userSubtask.id, 'declined')}
                                  className="decline-op-btn flex-1 py-2 font-mono text-[9px] border border-red-500 text-red-500 rounded cursor-pointer"
                                >
                                  DECLINE ASSIGNMENT
                                </button>
                              </div>
                            )}

                            {/* Lock Operation trigger for creator */}
                            {op.status === 'acceptance_open' && activeLegion.owner_id === user?.id && (
                              <div className="flex gap-3 mt-4" onClick={e => e.stopPropagation()}>
                                <button 
                                  type="button"
                                  onClick={() => lockLegionOperation(op.id)}
                                  className="lock-op-btn flex-1 py-2 font-mono text-[9px] border border-gold-core/40 text-gold-core rounded text-center block hover:bg-gold-core/10 transition-colors cursor-pointer"
                                >
                                  LOCK & START RUN
                                </button>
                                <button 
                                  type="button"
                                  onClick={async () => {
                                    if (confirm("Are you sure you want to CANCEL this operation? This will discard the tactical run and subtasks.")) {
                                      try {
                                        await cancelLegionOperation(op.id);
                                      } catch (err) {
                                        alert('Cancel failed: ' + err.message);
                                      }
                                    }
                                  }}
                                  className="cancel-op-btn flex-1 py-2 font-mono text-[9px] border border-red-500/40 text-red-500 rounded text-center block hover:bg-red-500/10 transition-colors cursor-pointer"
                                >
                                  CANCEL RUN
                                </button>
                              </div>
                            )}

                            {/* Failure note prompt */}
                            {op.status === 'failed' && userSubtask && userSubtask.completion_status === 'incomplete' && !userSubtask.note && (
                              <div className="failure-note-prompt mt-4 p-3 border border-red-500/20 rounded bg-red-500/5" onClick={e => e.stopPropagation()}>
                                <span className="text-[9px] font-mono text-red-400 block mb-1">LOG EXPLANATION (MANDATORY NOTE)</span>
                                <form onSubmit={handleFailureNoteSubmit} className="flex gap-2">
                                  <input 
                                    type="text" 
                                    placeholder="Self-reported details..." 
                                    value={failureNoteText}
                                    onChange={e => { setFailureNoteText(e.target.value); setFailureNoteSubtaskId(userSubtask.id); }}
                                    className="flex-1 font-mono bg-black text-white border border-white/10 px-2 py-1 rounded text-[9px]"
                                  />
                                  <button type="submit" className="p-1 border border-gold-core text-gold-core rounded cursor-pointer">
                                    <Send size={10} />
                                  </button>
                                </form>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {selectedLegionOpId && (
        <LegionOperationDetail 
          operationId={selectedLegionOpId} 
          onClose={() => setSelectedLegionOpId(null)} 
        />
      )}

      <style jsx global>{`
        .social-page-container {
          display: flex;
          flex-direction: column;
          height: auto;
          overflow: visible;
          padding: 1.5rem;
          padding-bottom: 7.5rem;
          gap: 1.5rem;
        }
        
        @media (min-width: 1024px) {
          .social-page-container {
            height: calc(100vh - 160px);
            overflow: hidden;
            padding-bottom: 1.5rem;
          }
        }
        
        .social-sub-nav {
          display: flex;
          justify-content: center;
          gap: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 0.75rem;
          flex-shrink: 0;
        }

        .social-tab-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: visible;
        }

        @media (min-width: 1024px) {
          .social-tab-content {
            overflow: hidden;
          }
        }

        .social-nav-item {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.4);
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.25em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: 0.3s;
        }
        .social-nav-item.active {
          color: var(--gold-core);
          text-shadow: 0 0 10px var(--gold-glow);
        }

        .social-grid-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          height: auto;
          overflow: visible;
        }

        @media (min-width: 1024px) {
          .social-grid-layout {
            grid-template-columns: 320px 1fr;
            height: 100%;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
        }

        .social-panel-left, .social-panel-right {
          background: rgba(10, 10, 12, 0.65);
          border: 1px solid rgba(197, 160, 89, 0.15);
          border-radius: 4px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .panel-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid rgba(197, 160, 89, 0.15);
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
        }
        .panel-title-row h3 {
          font-family: var(--font-display);
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #fff;
          margin: 0;
          text-transform: uppercase;
        }

        .mode-toggle-btn {
          background: transparent;
          border: 1px solid rgba(197, 160, 89, 0.2);
          color: var(--gold-core);
          font-family: var(--font-mono);
          font-size: 8px;
          padding: 3px 8px;
          border-radius: 2px;
          cursor: pointer;
        }

        .self-camp-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          padding: 0.75rem 1rem;
          text-align: left;
        }
        .camp-label {
          font-family: var(--font-mono);
          font-size: 7px;
          color: #8c6a4a;
          letter-spacing: 0.15em;
        }
        .camp-value {
          font-family: var(--font-display);
          font-size: 14px;
          color: #fff;
        }
        .camp-sub {
          font-family: var(--font-mono);
          font-size: 8px;
          color: var(--gold-core);
        }

        .narrative-feed {
          text-align: left;
        }
        .feed-header {
          font-family: var(--font-mono);
          font-size: 8px;
          letter-spacing: 0.1em;
          color: #8c6a4a;
        }

        .solo-tranquility-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 80%;
          gap: 1rem;
          color: #9ca3af;
        }
        .solo-tranquility-card h4 {
          color: #fff;
          font-size: 13px;
        }
        .solo-tranquility-card p {
          font-size: 9px;
          max-width: 250px;
          line-height: 1.6;
        }

        .standings-content-wrapper {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          height: auto;
          width: 100%;
        }
        @media (min-width: 1024px) {
          .standings-content-wrapper {
            height: 100%;
          }
        }

        .leaderboard-table-container {
          max-height: 280px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          flex: 1;
        }
        @media (min-width: 1024px) {
          .leaderboard-table-container {
            max-height: none;
            overflow-y: auto;
          }
        }
        .leaderboard-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }
        .leaderboard-table th, .leaderboard-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .leaderboard-table th {
          color: #8c6a4a;
          font-size: 8px;
          letter-spacing: 0.1em;
        }
        .rank-num {
          color: var(--gold-core);
          font-weight: bold;
        }
        .self-row {
          background: rgba(197,160,89,0.04);
        }

        .add-friend-form .input-group {
          display: flex;
        }
        .friend-email-input {
          flex: 1;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(197,160,89,0.25);
          border-right: none;
          border-radius: 4px 0 0 4px;
          color: #fff;
          padding: 0.5rem 0.75rem;
          font-size: 10px;
          outline: none;
        }
        .friend-add-btn {
          background: var(--gold-core);
          color: #000;
          border: 1px solid var(--gold-core);
          border-radius: 0 4px 4px 0;
          padding: 0 1rem;
          cursor: pointer;
        }

        .error-msg { color: #ef4444; font-size: 8px; text-align: left; }
        .success-msg { color: #10b981; font-size: 8px; text-align: left; }

        .sec-label {
          font-family: var(--font-mono);
          font-size: 8px;
          color: #8c6a4a;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .request-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
        }
        .accept-req-btn { color: #10b981; background: none; border: none; cursor: pointer; }
        .decline-req-btn { color: #ef4444; background: none; border: none; cursor: pointer; }

        .friend-row-card {
          padding: 0.75rem 1rem;
          background: rgba(8,8,10,0.4) !important;
          border: 1px solid rgba(197, 160, 89, 0.1) !important;
          border-radius: 4px;
        }
        .friend-avatar-container {
          position: relative;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-frame-overlay {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
        }
        .friend-level-num {
          font-family: var(--font-mono);
          font-size: 7px;
          font-weight: bold;
          color: #fff;
          z-index: 2;
        }
        .unfriend-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: 0.2s;
        }
        .unfriend-btn:hover {
          color: #ef4444;
        }

        .no-legion-container {
          grid-column: span 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          min-height: 400px;
          background: rgba(10, 10, 12, 0.85);
          border: 1px solid rgba(197, 160, 89, 0.25);
          border-radius: 4px;
          box-shadow: inset 0 0 30px rgba(197, 160, 89, 0.08), 0 10px 40px rgba(0,0,0,0.6);
        }
        .legion-name-input {
          width: 100%;
          background: rgba(0,0,0,0.6);
          border: 1px solid rgba(197,160,89,0.3);
          color: #fff;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 11px;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .legion-name-input:focus {
          border-color: var(--gold-core);
          box-shadow: 0 0 10px rgba(197, 160, 89, 0.15);
        }

        .legion-forge-btn {
          width: 100%;
          height: 42px;
          background: rgba(197, 160, 89, 0.04);
          border: 1px solid var(--gold-core);
          color: var(--gold-core);
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(197, 160, 89, 0.05);
        }
        .legion-forge-btn:hover {
          background: var(--gold-core);
          color: #000;
          box-shadow: 0 0 20px rgba(197, 160, 89, 0.35);
          transform: translateY(-1px);
        }

        .campfire-visual-container {
          width: 100%;
          height: 120px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid rgba(197, 160, 89, 0.15);
          background: rgba(0,0,0,0.3);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .campfire-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.85;
          transition: opacity 0.3s;
          filter: sepia(0.15) brightness(0.9);
        }
        .campfire-visual-container:hover .campfire-image {
          opacity: 1;
        }

        .legion-banner-img {
          object-position: center;
          filter: sepia(0.4) brightness(0.6);
        }

        .member-item {
          padding: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        /* ═══════════════ COLLECTIVE OPERATIONS FORM STYLE ═══════════════ */
        .collective-ops-form {
          font-family: 'Times New Roman', Georgia, Times, serif !important;
          border: 1px solid rgba(197, 160, 89, 0.25) !important;
          background: rgba(10, 10, 12, 0.95) !important;
          box-shadow: inset 0 0 20px rgba(197, 160, 89, 0.05), 0 10px 30px rgba(0,0,0,0.6);
        }
        
        .collective-ops-form .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: left;
        }

        .collective-ops-form label {
          font-family: 'Times New Roman', Georgia, Times, serif !important;
          font-size: 10px !important;
          font-weight: 700 !important;
          letter-spacing: 0.15em !important;
          color: #c5a059 !important;
          text-transform: uppercase !important;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .collective-ops-form input, 
        .collective-ops-form select, 
        .collective-ops-form .custom-select-trigger {
          background: #000000 !important;
          border: 1px solid rgba(197, 160, 89, 0.25) !important;
          border-radius: 4px !important;
          padding: 0.75rem 1rem !important;
          color: #ffffff !important;
          font-family: 'Times New Roman', Georgia, Times, serif !important;
          font-size: 11px !important;
          outline: none;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
          height: auto;
          line-height: normal;
        }

        .collective-ops-form input:focus, 
        .collective-ops-form select:focus, 
        .collective-ops-form .custom-select-trigger:focus {
          border-color: #c5a059 !important;
          background: rgba(197, 160, 89, 0.05) !important;
          box-shadow: 0 0 10px rgba(197, 160, 89, 0.2) !important;
        }

        .collective-ops-form .custom-select-trigger {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .collective-ops-form .custom-select-options {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: #000;
          border: 1px solid rgba(197, 160, 89, 0.3);
          border-radius: 4px;
          margin-top: 4px;
          z-index: 500;
          max-height: 160px;
          overflow-y: auto;
          box-shadow: 0 10px 35px rgba(0,0,0,0.9);
        }

        .collective-ops-form .custom-select-option {
          padding: 0.6rem 1rem;
          color: #fff;
          font-family: 'Times New Roman', Georgia, Times, serif;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.1s ease;
          text-align: left;
        }

        .collective-ops-form .custom-select-option:hover {
          background: #c5a059;
          color: #000;
        }

        .collective-ops-form input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1) sepia(50%) saturate(500%) hue-rotate(15deg);
          cursor: pointer;
          opacity: 0.6;
        }

        .collective-ops-form .add-assignment-btn {
          width: 100%;
          height: 38px;
          background: rgba(197, 160, 89, 0.1);
          border: 1px solid rgba(197, 160, 89, 0.5);
          color: #c5a059;
          font-family: 'Times New Roman', Georgia, Times, serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .collective-ops-form .add-assignment-btn:hover {
          background: #c5a059;
          color: #000;
          box-shadow: 0 0 15px rgba(197, 160, 89, 0.3);
        }

        .collective-ops-form .confirm-deployment-btn {
          width: 100%;
          height: 48px;
          background: rgba(197, 160, 89, 0.04);
          border: 1px solid #c5a059;
          color: #c5a059;
          font-family: 'Times New Roman', Georgia, Times, serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(197, 160, 89, 0.1);
        }

        .collective-ops-form .confirm-deployment-btn:hover {
          background: #c5a059;
          color: #000;
          box-shadow: 0 0 25px rgba(197, 160, 89, 0.4);
        }

        /* ═══════════════ CUSTOM CALENDAR DROPDOWN STYLE ═══════════════ */
        .custom-calendar-dropdown {
          background: #000000 !important;
          border: 1px solid rgba(197, 160, 89, 0.3) !important;
          border-radius: 4px;
          padding: 10px;
          width: 230px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8);
          font-family: 'Times New Roman', Georgia, Times, serif;
        }
        
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 6px;
        }

        .calendar-month-year {
          color: #c5a059;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cal-nav-btn {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 2px;
        }

        .cal-nav-btn:hover {
          color: #c5a059;
          background: rgba(255,255,255,0.05);
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 4px;
        }

        .calendar-weekday {
          color: #8c6a4a;
          font-size: 8px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }

        .calendar-day {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 10px;
          padding: 4px 0;
          text-align: center;
          cursor: pointer;
          border-radius: 2px;
          font-family: var(--font-mono);
        }

        .calendar-day:hover:not(.empty) {
          background: rgba(197, 160, 89, 0.15);
          color: #c5a059;
        }

        .calendar-day.selected {
          background: #c5a059 !important;
          color: #000000 !important;
          font-weight: bold;
        }

        .calendar-day.empty {
          cursor: default;
        }
      `}</style>
    </div>
  );
}
