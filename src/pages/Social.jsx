import React, { useState, useEffect } from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trophy, Shield, Search, UserPlus, Check, X, ShieldAlert, Heart, Trophy as TrophyIcon, RefreshCw, Send, AlertTriangle, Sparkles } from 'lucide-react';
import { REGIONS } from '../store/constants';

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
  
  // Collaborative Operation Creation
  const [opTaskTitle, setOpTaskTitle] = useState('');
  const [opEffort, setOpEffort] = useState('Medium');
  const [opDeadlineDays, setOpDeadlineDays] = useState(3);
  const [subtaskInputs, setSubtaskInputs] = useState([]);
  
  // Failure note state
  const [failureNoteSubtaskId, setFailureNoteSubtaskId] = useState(null);
  const [failureNoteText, setFailureNoteText] = useState('');

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

  const handleAddSubtaskInput = () => {
    setSubtaskInputs([...subtaskInputs, { assignedTo: '', xpValue: 100 }]);
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
    
    // Auto-create subtasks list
    const subtasks = subtaskInputs.filter(s => s.assignedTo !== '');
    if (subtasks.length === 0) {
      alert('At least one sub-task assignment is required.');
      return;
    }

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + Number(opDeadlineDays));

    try {
      const parentId = Math.random().toString(36).slice(2, 9); // generated parent key
      await initiateLegionOperation(activeLegion.id, parentId, deadline.toISOString(), subtasks);
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
  const pendingRequests = friendships.filter(f => f.status === 'pending' && f.receiver_id === user.id);
  const sentRequests = friendships.filter(f => f.status === 'pending' && f.requester_id === user.id);
  const friends = friendships.filter(f => f.status === 'accepted').map(f => {
    const other = f.requester_id === user.id ? f.receiver : f.requester;
    return {
      friendshipId: f.id,
      profile: other,
      stats: parseUserState(other)
    };
  });

  return (
    <div className="social-page-container">
      {/* 🧭 SOCIAL SUB-NAVBAR */}
      <div className="social-sub-nav">
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

                <div className="campfire-visual-container">
                  <img src="/bonfire.png" alt="Campfire" className="campfire-image" />
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
                            <span className="text-gold-core font-mono mr-1">[{evt.profile?.username || evt.profile?.email.split('@')[0]}]</span>
                            {evt.event_description}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: FRIENDS RANKINGS */}
              <div className="social-panel-right">
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
                                {row.profile?.username || row.profile?.email.split('@')[0]}
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
                        <span className="truncate max-w-[120px]">{req.requester?.username || req.requester?.email.split('@')[0]}</span>
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
                        <span className="truncate max-w-[120px]">{req.receiver?.username || req.receiver?.email.split('@')[0]}</span>
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
                          <span className="friend-email font-mono font-bold text-xs">{friend.profile?.username || friend.profile?.email.split('@')[0]}</span>
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
                      <div className="legion-banner-display relative w-full h-36 flex items-center justify-center border border-white/5 bg-black/40 overflow-hidden mb-4">
                        <img 
                          src={`/legion/banners/legion-banner-${Math.min(activeLegion.level, 10)}.png`}
                          onError={(e) => { e.target.src = '/olympus-bg.png'; }}
                          className="legion-banner-img absolute inset-0 w-full h-full object-cover opacity-60"
                          alt=""
                        />
                        <span className="relative z-10 font-display text-white text-md tracking-widest uppercase">{activeLegion.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gold-core">LEGION LEVEL {activeLegion.level}</span>
                      <span className="text-[8px] font-mono text-gray-500 mt-1">TOTAL XP CONTRIBUTED: {activeLegion.total_xp}</span>
                    </div>

                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

                    {/* MEMBERS DIRECTORY */}
                    <div className="legion-members-list mt-2">
                      <span className="sec-label mb-2 block text-left">Garrison</span>
                      <div className="flex flex-col gap-2">
                        {legionMembers.map(member => {
                          const isCreator = member.role === 'creator';
                          return (
                            <div key={member.id} className="member-item flex justify-between items-center text-left">
                              <div className="flex flex-col font-mono text-[10px]">
                                <span className="font-bold">{member.profile?.username || member.profile?.email.split('@')[0]}</span>
                                <span className="text-[7px] text-gold-core/80 uppercase">{member.role}</span>
                              </div>
                              {isCreator && <span className="text-[7px] font-mono border border-gold-core/40 text-gold-core px-1 py-0.5 rounded">LEADER</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

                    {/* INVITE COALITION MEMBER */}
                    {activeLegion.owner_id === user.id && (
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
                              .filter(f => !legionMembers.some(m => m.user_id === f.profile.id))
                              .map(f => (
                                <option key={f.profile.id} value={f.profile.id}>{f.profile.username || f.profile.email.split('@')[0]}</option>
                              ))}
                          </select>
                          <button type="submit" className="invite-btn p-2 border border-gold-core/40 text-gold-core rounded flex items-center justify-center hover:bg-gold-core/10">
                            <UserPlus size={12} />
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* RIGHT COLUMN: COLLABORATIVE OPERATIONS BOARD */}
                  <div className="social-panel-right">
                    <div className="panel-title-row">
                      <Shield size={12} className="text-gold-core" />
                      <h3>COLLECTIVE OPERATIONS</h3>
                    </div>

                    {/* SECTION A: CREATE AND INITIATE COLLABORATIVE RUN */}
                    {activeLegion.owner_id === user.id && legionOperations.filter(o => o.status === 'active' || o.status === 'acceptance_open').length === 0 && (
                      <form onSubmit={handleStartOperation} className="start-op-form mt-4 elite-panel p-4 flex flex-col gap-4 text-left">
                        <h4 className="text-[10px] font-display text-gold-core tracking-widest uppercase">Initiate Tactical Run</h4>
                        <div className="flex flex-col gap-2">
                          <label className="text-[8px] font-mono text-gray-500 uppercase">Parent Operation Title</label>
                          <input 
                            type="text" 
                            placeholder="Decompose objectives..." 
                            value={opTaskTitle}
                            onChange={e => setOpTaskTitle(e.target.value)}
                            className="op-title-input font-mono bg-black/40 text-white border border-white/10 p-2 rounded text-[11px]"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-2">
                            <label className="text-[8px] font-mono text-gray-500 uppercase">Difficulty / Threat</label>
                            <select 
                              value={opEffort}
                              onChange={e => setOpEffort(e.target.value)}
                              className="op-select font-mono bg-black/40 text-white border border-white/10 p-2 rounded text-[10px]"
                            >
                              <option value="Low">Low Effort</option>
                              <option value="Medium">Medium Effort</option>
                              <option value="High">High Effort</option>
                              <option value="Boss">Boss Raid</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[8px] font-mono text-gray-500 uppercase">Operation Duration (Days)</label>
                            <input 
                              type="number" 
                              min="1" 
                              max="30"
                              value={opDeadlineDays}
                              onChange={e => setOpDeadlineDays(Number(e.target.value))}
                              className="op-number-input font-mono bg-black/40 text-white border border-white/10 p-2 rounded text-[10px]"
                            />
                          </div>
                        </div>

                        {/* SUBTASK DECOMPOSITION GRID */}
                        <div className="subtask-builder mt-2">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-mono text-gray-400 uppercase">Decomposed Assignments</span>
                            <button 
                              type="button" 
                              onClick={handleAddSubtaskInput} 
                              className="text-[8px] font-mono border border-gold-core/40 text-gold-core px-2 py-1 rounded"
                            >
                              + Sub-Task
                            </button>
                          </div>

                          <div className="flex flex-col gap-2">
                            {subtaskInputs.map((s, idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <select 
                                  value={s.assignedTo} 
                                  onChange={e => handleSubtaskChange(idx, 'assignedTo', e.target.value)}
                                  className="font-mono bg-black/40 text-white border border-white/10 p-1.5 rounded text-[9px] flex-1"
                                >
                                  <option value="">Assign To...</option>
                                  {legionMembers.map(m => (
                                    <option key={m.user_id} value={m.user_id}>{m.profile?.username || m.profile?.email.split('@')[0]}</option>
                                  ))}
                                </select>
                                <input 
                                  type="number" 
                                  placeholder="XP Value" 
                                  value={s.xpValue}
                                  onChange={e => handleSubtaskChange(idx, 'xpValue', Number(e.target.value))}
                                  className="font-mono bg-black/40 text-white border border-white/10 p-1.5 rounded text-[9px] w-20"
                                />
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveSubtaskInput(idx)} 
                                  className="text-red-500 text-[12px] p-1.5"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button type="submit" className="confirm-btn mt-2">
                          <span>INITIATE TACTICAL RUN</span>
                        </button>
                      </form>
                    )}

                    {/* SECTION B: RUN OPERATIONS PANEL */}
                    <div className="operations-run-list mt-4 flex flex-col gap-4 text-left">
                      {legionOperations.map(op => {
                        const subtasksForOp = legionSubtasks.filter(s => s.legion_operation_id === op.id);
                        const userSubtask = subtasksForOp.find(s => s.assigned_to === user.id);
                        const isLocked = op.status !== 'acceptance_open';

                        return (
                          <div key={op.id} className="op-run-card glass-panel p-4 border border-white/5 rounded">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex flex-col">
                                <span className="text-[7px] font-mono text-gray-500 uppercase">LEGION TASK RUN</span>
                                <h4 className="font-serif text-[13px] text-white">Objective Conquered: {op.status.toUpperCase()}</h4>
                              </div>
                              <span className="text-[8px] font-mono text-gold-core">Deadline: {new Date(op.deadline).toLocaleDateString()}</span>
                            </div>

                            {/* Subtask Status board */}
                            <div className="subtask-status-board flex flex-col gap-2 mt-3">
                              {subtasksForOp.map(s => {
                                const assigneeName = s.assignee?.username || s.assignee?.email.split('@')[0];
                                return (
                                  <div key={s.id} className="subtask-row flex justify-between items-center text-[10px] font-mono border-b border-white/[0.03] pb-1">
                                    <div className="flex flex-col">
                                      <span>Operative: {assigneeName}</span>
                                      <span className="text-[8px] text-gray-500">XP Value: {s.xp_value}</span>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                      {/* Acceptance display */}
                                      {!isLocked ? (
                                        <span className={`text-[8px] uppercase font-bold ${s.acceptance_status === 'accepted' ? 'text-green-500' : 'text-amber-500'}`}>
                                          {s.acceptance_status.toUpperCase()}
                                        </span>
                                      ) : (
                                        /* Completion status display */
                                        <span className={`text-[8px] uppercase font-bold ${
                                          s.completion_status === 'completed' || s.completion_status === 'covered' ? 'text-gold-core' : 
                                          s.completion_status === 'restrained' ? 'text-red-500' : 'text-gray-500'
                                        }`}>
                                          {s.completion_status.toUpperCase()}
                                        </span>
                                      )}

                                      {/* Action options */}
                                      {op.status === 'active' && s.assigned_to === user.id && s.completion_status === 'incomplete' && (
                                        <button 
                                          onClick={() => completeLegionSubtask(s.id, 'completed')}
                                          className="text-[8px] border border-gold-core/40 text-gold-core px-1.5 py-0.5 rounded"
                                        >
                                          CONQUER
                                        </button>
                                      )}

                                      {op.status === 'active' && s.assigned_to !== user.id && s.completion_status === 'incomplete' && (
                                        <button 
                                          onClick={() => completeLegionSubtask(s.id, 'covered')}
                                          className="text-[8px] border border-white/20 text-white/60 px-1.5 py-0.5 rounded hover:border-gold-core hover:text-gold-core"
                                        >
                                          COVER
                                        </button>
                                      )}

                                      {op.status === 'active' && activeLegion.owner_id === user.id && s.completion_status === 'incomplete' && (
                                        <button 
                                          onClick={() => restrainLegionMember(s.id)}
                                          className="text-[8px] border border-red-500/20 text-red-500 px-1.5 py-0.5 rounded hover:border-red-500 hover:bg-red-500/5"
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
                              <div className="acceptance-actions flex gap-3 mt-4">
                                <button 
                                  onClick={() => respondToSubtask(userSubtask.id, 'accepted')}
                                  className="accept-op-btn flex-1 py-2 font-mono text-[9px] border border-green-500 text-green-500 rounded"
                                >
                                  ACCEPT ASSIGNMENT
                                </button>
                                <button 
                                  onClick={() => respondToSubtask(userSubtask.id, 'declined')}
                                  className="decline-op-btn flex-1 py-2 font-mono text-[9px] border border-red-500 text-red-500 rounded"
                                >
                                  DECLINE ASSIGNMENT
                                </button>
                              </div>
                            )}

                            {/* Lock Operation trigger for creator */}
                            {op.status === 'acceptance_open' && activeLegion.owner_id === user.id && (
                              <button 
                                onClick={() => lockLegionOperation(op.id)}
                                className="lock-op-btn w-full mt-4 py-2 font-mono text-[9px] border border-gold-core/40 text-gold-core rounded text-center block"
                              >
                                LOCK & START RUN
                              </button>
                            )}

                            {/* Failure note prompt */}
                            {op.status === 'failed' && userSubtask && userSubtask.completion_status === 'incomplete' && !userSubtask.note && (
                              <div className="failure-note-prompt mt-4 p-3 border border-red-500/20 rounded bg-red-500/5">
                                <span className="text-[9px] font-mono text-red-400 block mb-1">LOG EXPLANATION (MANDATORY NOTE)</span>
                                <form onSubmit={handleFailureNoteSubmit} className="flex gap-2">
                                  <input 
                                    type="text" 
                                    placeholder="Self-reported details..." 
                                    value={failureNoteText}
                                    onChange={e => { setFailureNoteText(e.target.value); setFailureNoteSubtaskId(userSubtask.id); }}
                                    className="flex-1 font-mono bg-black text-white border border-white/10 px-2 py-1 rounded text-[9px]"
                                  />
                                  <button type="submit" className="p-1 border border-gold-core text-gold-core rounded">
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

      <style jsx global>{`
        .social-page-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 160px);
          overflow: hidden;
          padding: 1.5rem;
          gap: 1.5rem;
        }
        
        .social-sub-nav {
          display: flex;
          justify-content: center;
          gap: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 0.75rem;
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
          height: 100%;
          overflow-y: auto;
        }

        @media (min-width: 1024px) {
          .social-grid-layout {
            grid-template-columns: 320px 1fr;
            overflow: hidden;
          }
        }

        .social-panel-left, .social-panel-right {
          background: rgba(10, 10, 12, 0.65);
          border: 1px solid rgba(197, 160, 89, 0.15);
          border-radius: 4px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        @media (min-width: 1024px) {
          .social-panel-left, .social-panel-right {
            height: calc(100vh - 240px);
          }
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

        .leaderboard-table-container {
          overflow-y: auto;
          flex: 1;
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
      `}</style>
    </div>
  );
}
