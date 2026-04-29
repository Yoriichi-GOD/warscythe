/* WARLORD — EXECUTION ENGINE — Core + Quest/Reward System */
(() => {
  'use strict';
  const MAX_TASKS = 3, CLOSER_THRESH = 80, CLOSER_DAYS = 5, STALLED_HRS = 48;
  const POINTS_BASE = 100, EFFORT_MULT = { Low: 1, Medium: 1.5, High: 2 };
  const TASKS_PER_LEVEL = 10, STORAGE_KEY = 'warlord_data';

  // ── REGIONS ──
  const REGIONS = [
    { name: 'The Threshold', icon: '🚪', desc: 'Where all journeys begin. The gate stands open — but only the resolute pass through.' },
    { name: 'Ashwood Frontier', icon: '🏕️', desc: 'A frontier settlement at the edge of civilization. Smoke rises. Something stirs beyond.' },
    { name: 'The Crucible', icon: '🔥', desc: 'Trials forge the worthy. Only iron will survives this heat.' },
    { name: 'Ironveil Fortress', icon: '🏰', desc: 'Discipline made manifest. These walls have never fallen.' },
    { name: 'The Obsidian March', icon: '⛰️', desc: 'Through darkness, forward. The path narrows but the summit awaits.' },
    { name: 'Dreadspire Academy', icon: '📚', desc: 'Knowledge as weapon. Every book here is a blade, every lesson a scar.' },
    { name: 'The Forge Eternal', icon: '⚒️', desc: 'Where legends are hammered into being. The anvil never cools.' },
    { name: 'Shadowmere Depths', icon: '🌊', desc: 'What lurks beneath the surface cannot be avoided — only conquered.' },
    { name: 'Crimson Summit', icon: '🗻', desc: 'Blood and ambition mark the ascent. The air thins. The view expands.' },
    { name: 'The War Council', icon: '⚔️', desc: 'Strategy above all. From this chamber, empires are directed.' },
    { name: 'Abyssal Caverns', icon: '🕳️', desc: 'Into the unknown, undeterred. Every echo carries a warning.' },
    { name: 'Stormbreak Ridge', icon: '⚡', desc: 'Where storms bend to will. Lightning obeys those who do not flinch.' },
    { name: 'The Silent Empire', icon: '👁️', desc: 'Conquered without a word. Power need not announce itself.' },
    { name: "Dragon's Calculus", icon: '🐉', desc: 'Every move, calculated. The dragon does not strike — it decides.' },
    { name: 'Throne of the Warlord', icon: '👑', desc: 'The seat of absolute execution. You have arrived. Now hold it.' },
    { name: "Voidwalker's Expanse", icon: '🌌', desc: 'Beyond the known maps. Here, you write the territory.' },
    { name: 'The Eternal Siege', icon: '🛡️', desc: 'Wars never end, they evolve. Adapt or be forgotten.' },
    { name: 'Astral Dominion', icon: '✨', desc: 'Dominion over the stars themselves. Reality reshapes at your command.' },
    { name: "The Architect's Vault", icon: '🏛️', desc: 'Building reality from nothing. Every completed task is a brick in your empire.' },
    { name: 'Omega Citadel', icon: '🔮', desc: 'The final stronghold — or is it? Beyond this, only legends speak.' },
  ];

  const TITLES = [
    'Recruit','Tactician','Iron Executor','Shadow Marshal','The Relentless',
    'Siege Commander','Voidbreaker','Storm Sovereign','Dragon Lord','The Architect',
    'Warlord Supreme','Eternal Conqueror','Reality Shaper','Omega Commander','Ascendant',
    'Mythic Executor','Titan of Will','The Unstoppable','Cosmic Warlord','Legend Incarnate'
  ];

  const LORE_TEMPLATES = [
    ["The gates open slowly, resisting decades of rust.", "A figure carved into the stone watches with hollow eyes.", "Footsteps echo — yours are the first in a long time.", "An inscription reads: 'Only those who finish may pass.'", "The wind carries whispers of abandoned ambitions.", "A broken sword lies at the entrance — its owner gave up.", "You press forward. The gate seals behind you.", "Torchlight reveals a map etched into the wall.", "The path splits — but all roads lead to the same truth.", "The Threshold accepts you. The journey has begun."],
    ["Smoke rises from a distant camp.", "A merchant offers supplies: 'You'll need them where you're going.'", "The frontier stretches endlessly — but you have direction.", "Wild creatures test your resolve at the forest edge.", "A fellow traveler warns: 'Most turn back here.'", "You find an old journal — its last entry unfinished.", "The campfire burns low. Tomorrow, you push deeper.", "A scout's tower reveals the vastness ahead.", "The frontier taught its lesson: comfort is the enemy.", "Ashwood falls behind. The real challenge begins."],
    ["Heat rises from cracks in the earth.", "Molten rivers flow between narrow paths.", "A voice booms: 'Show me your commitment.'", "The air is thick with the ash of failed attempts.", "Your tools glow red — forged stronger by the trial.", "Others have tried this path. Their marks remain.", "Each step forward costs more than the last.", "The crucible does not break iron — it reveals it.", "Heat becomes fuel. Pain becomes progress.", "The Crucible is conquered. You are no longer raw material."],
    ["Iron gates rise thirty feet. They open for you.", "Sentinels stand motionless — they recognize discipline.", "Every corridor is measured. Every stone placed with intent.", "A war room displays campaigns spanning centuries.", "The garrison's motto: 'Hesitation is defeat.'", "You find armor that fits — it was waiting for you.", "Training grounds echo with the clash of purpose.", "The fortress library contains only completed works.", "From the ramparts, you survey what lies ahead.", "Ironveil acknowledges your command. The fortress is yours."],
    ["Obsidian glass stretches in every direction.", "The march is silent. Only your heartbeat marks time.", "Shadows move — reflections of your own doubt.", "A bridge of black stone spans a chasm of uncertainty.", "The path is unmarked. You make your own.", "Cold wind cuts — but you've felt worse inside.", "A monument to the lost: those who stopped marching.", "The obsidian reflects not your face — but your intent.", "Dawn breaks over volcanic glass. Beautiful and deadly.", "The March ends. You carry its darkness as armor."],
    ["Ancient tomes line walls that reach for the sky.", "A professor's ghost lectures on strategic patience.", "Knowledge crystallizes — every lesson is a loaded weapon.", "The library's restricted section opens only to executors.", "A formula on the blackboard: Ambition × Action = Empire.", "Students' abandoned projects line the halls — warnings.", "You master a chapter others never opened.", "The Academy's final exam: complete what you started.", "Dark knowledge isn't evil — it's efficient.", "Dreadspire recognizes a master strategist."],
    ["Hammers ring in perfect rhythm.", "The forge-master speaks: 'Legends aren't born. They're made.'", "Metal bends. So does reality, for the persistent.", "A weapon with your name emerges from the flames.", "The forge never cools because the work never stops.", "Impurities burn away. What remains is purpose.", "Ancient artifacts line the walls — each one finished.", "The heat doesn't bother you anymore.", "You forge something that didn't exist before today.", "The Forge recognizes a creator. Not a dreamer — a maker."],
    ["The surface breaks. Deep water swallows light.", "Bioluminescent creatures illuminate hidden passages.", "Pressure increases — but diamonds form under pressure.", "A sunken library holds secrets the surface forgot.", "The depths are quiet. Your thoughts echo clearly.", "Ancient mechanisms still function — built to last.", "You surface briefly, gasping — then dive deeper.", "The abyss doesn't stare back. It acknowledges.", "Treasures line the deep — left by those who surfaced too soon.", "Shadowmere yields its deepest secret: persistence outlasts depth."],
    ["The air thins with every step upward.", "Red stone marks the path — stained by determination.", "A false summit tests your resolve. The real one is higher.", "Climbers' marks cover every handhold — you add yours.", "The wind screams. You climb louder.", "From halfway up, the world looks small. Keep going.", "Blood on rock. Not from falling — from gripping harder.", "The summit is not the goal. Reaching it is.", "Clouds break beneath you. You stand above the storm.", "The Crimson Summit bows to its conqueror."],
    ["Generals stand as you enter. They were waiting.", "Every wall displays a campaign won through execution.", "The round table has one empty chair. It's yours.", "Maps of future conquests spread across the table.", "A war horn sounds — not for battle, but recognition.", "Strategy without execution is decoration. You know this.", "The council votes unanimously: you lead.", "From this room, armies of intention march.", "Every plan on this table was finished. That's the rule.", "The War Council has a new commander."],
  ];

  // Generate lore for regions beyond the handcrafted ones
  function getLore(regionIdx) {
    if (regionIdx < LORE_TEMPLATES.length) return LORE_TEMPLATES[regionIdx];
    const r = REGIONS[regionIdx] || getProceduralRegion(regionIdx);
    return Array.from({length:10}, (_,i) => {
      const templates = [
        `The ${r.name} reveals its ${i+1}${i===0?'st':i===1?'nd':i===2?'rd':'th'} secret.`,
        `Step ${i+1}: Another fragment of ${r.name} falls into place.`,
        `The path through ${r.name} grows clearer with each conquest.`,
        `Fragment ${i+1} glows — ${r.name} acknowledges your persistence.`,
        `A voice whispers from ${r.name}: "You are ${(i+1)*10}% worthy."`,
      ];
      return templates[i % templates.length];
    });
  }

  function getProceduralRegion(idx) {
    if (idx < REGIONS.length) return REGIONS[idx];
    const prefixes = ['Shadow','Iron','Storm','Void','Crimson','Eternal','Dark','Ancient','Lost','Burning'];
    const suffixes = ['Reach','Wastes','Sanctum','Dominion','Frontier','Depths','Crown','Spire','Gate','Throne'];
    const icons = ['🌑','⚔️','🔱','💀','🌋','🏴','🗡️','🛡️','⚡','👁️'];
    const p = prefixes[idx % prefixes.length], s = suffixes[Math.floor(idx/prefixes.length) % suffixes.length];
    return { name: `${p} ${s}`, icon: icons[idx % icons.length], desc: `An uncharted territory beyond the known maps. Level ${idx+1} awaits.` };
  }

  function getRegion(idx) { return idx < REGIONS.length ? REGIONS[idx] : getProceduralRegion(idx); }
  function getTitle(level) { return level <= TITLES.length ? TITLES[level-1] : TITLES[TITLES.length-1] + ' ' + (level - TITLES.length + 1); }

  // ── ARTIFACTS ──
  const ARTIFACT_POOL = {
    common: [
      {name:'Iron Quill',icon:'🖋️'},{name:'Wax Seal of Intent',icon:'📜'},{name:'Ember Stone',icon:'🪨'},
      {name:'Scout\'s Compass',icon:'🧭'},{name:'Whetstone of Focus',icon:'🪨'},{name:'Ink of Resolve',icon:'🫗'},
    ],
    uncommon: [
      {name:'Blade of Persistence',icon:'🗡️'},{name:'Shield of No Retreat',icon:'🛡️'},{name:'Cloak of Momentum',icon:'🧥'},
      {name:'Ring of Execution',icon:'💍'},{name:'Helm of Clarity',icon:'⛑️'},{name:'Staff of Deadlines',icon:'🏑'},
    ],
    rare: [
      {name:'Warlord\'s Gauntlet',icon:'🧤'},{name:'Crown of Completion',icon:'👑'},{name:'Eye of the Strategist',icon:'👁️'},
      {name:'Dragon Scale Armor',icon:'🐉'},{name:'Void Walker\'s Boots',icon:'👢'},
    ],
    epic: [
      {name:'The Finisher',icon:'⚔️'},{name:'Throne Fragment',icon:'🏛️'},{name:'Shard of Reality',icon:'🔮'},
    ],
  };

  function rollReward(forceEpic=false) {
    const r = Math.random();
    let rarity, bonusPts;
    if (forceEpic || r < 0.05) { rarity = 'epic'; bonusPts = 300 + Math.floor(Math.random()*200); }
    else if (r < 0.15) { rarity = 'rare'; bonusPts = 150 + Math.floor(Math.random()*100); }
    else if (r < 0.40) { rarity = 'uncommon'; bonusPts = 75 + Math.floor(Math.random()*75); }
    else { rarity = 'common'; bonusPts = 25 + Math.floor(Math.random()*50); }
    const pool = ARTIFACT_POOL[rarity];
    const artifact = pool[Math.floor(Math.random() * pool.length)];
    return { rarity, artifact, bonusPts };
  }

  // ── STATE ──
  const $ = s => document.querySelector(s);
  let state = loadState();

  function loadState() {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) { const p = JSON.parse(s); migrate(p); return p; }
    } catch(e) {}
    return defaultState();
  }
  function defaultState() {
    return { tasks:[], completedTasks:[], abandonedTasks:[], executionScore:0, dailyLog:{}, notes:'', closerDismissed:false,
      level:1, totalCompletions:0, currentLevelProgress:0, collectedArtifacts:[], unlockedLore:{}, currentTitle:'Recruit', pendingReward:null, pendingLevelUp:null, consecutiveLow:0 };
  }
  function migrate(p) {
    const d = defaultState();
    for (const k in d) { if (!(k in p)) p[k] = d[k]; }
    p.tasks.forEach(t => { if(!t.microSteps) t.microSteps=[]; if(!t.notes) t.notes=''; if(!t.stalledAt) t.stalledAt=null; });
    if(p.consecutiveLow===undefined) p.consecutiveLow=0;
  }
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){} }

  // ── HELPERS ──
  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  const todayKey = () => new Date().toISOString().slice(0,10);
  const daysBetween = ds => { const t=new Date(ds+'T23:59:59'); return Math.ceil((t-new Date())/(864e5)); };
  const hoursSince = s => s ? (Date.now()-new Date(s).getTime())/36e5 : 0;
  const formatDate = s => s ? new Date(s).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : '—';
  const getStage = p => p<70?'build':p<95?'finish':'ship';
  const stageName = s => ({build:'BUILD',finish:'FINISH',ship:'SHIP'})[s]||s;
  const isCloser = t => t.progress>=CLOSER_THRESH || (t.deadline && daysBetween(t.deadline)<=CLOSER_DAYS);
  const anyCloser = () => state.tasks.some(isCloser);
  const isStalled = t => t.progress>=80 && t.progress<95 && t.stalledAt && hoursSince(t.stalledAt)>=STALLED_HRS;
  const esc = s => { const d=document.createElement('div'); d.textContent=s; return d.innerHTML; };

  // ── DOM ──
  const dom = {};
  ['closer-overlay','closer-dismiss','task-count','execution-score','status-dot','status-label',
   'btn-add-task','task-form','btn-cancel-task','input-title','input-category','input-effort','input-deadline',
   'task-list','empty-state','stat-today','stat-completed','stat-abandoned','stat-ratio',
   'weekly-graph','completion-log','notes-area','btn-low-energy','low-energy-modal','low-energy-close',
   'low-energy-tasks','micro-steps-output','task-detail-modal','detail-title','detail-close','detail-meta',
   'detail-progress-slider','detail-progress-val','detail-progress-fill','detail-stage','detail-notes',
   'detail-micro-steps','btn-complete-task','btn-abandon-task','player-level','player-title',
   'qp-fill','qp-text','btn-map','scratch-modal','scratch-canvas','scratch-reward-under',
   'reward-icon','reward-type','reward-name','reward-points','scratch-lore','lore-text',
   'sqp-fill','sqp-text','scratch-close','levelup-modal','levelup-region-name','levelup-desc',
   'levelup-number','levelup-title-name','levelup-close','levelup-new-title-block',
   'map-modal','map-close','map-level','map-title','map-completions','map-grid',
   'map-lore-panel','lore-panel-title','lore-panel-desc','lore-panel-close','lore-fragments-list','artifacts-grid',
   'scythe-name','scythe-stats','scythe-blade','slash-scythe-blade','scythe-svg','slash-scythe-svg','slash-overlay',
   'section-almost','task-list-almost','toast-container','reality-lock-modal','btn-reality-finish','btn-reality-return','suspense-overlay'
  ].forEach(id => dom[id.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())] = $(`#${id}`));

  // ── TOAST HELPER ──
  function showToast(msg, type='info') {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = msg;
    dom.toastContainer.appendChild(t);
    setTimeout(() => {
      t.style.animation = 'toastSlide 0.3s ease reverse forwards';
      setTimeout(() => t.remove(), 300);
    }, 4000);
  }

  // ── TASK OPS ──
  function activeTaskCount() {
    return state.tasks.filter(t => t.progress < 80).length;
  }

  function addTask(title,cat,effort,deadline) {
    if (activeTaskCount()>=MAX_TASKS) return false;
    state.tasks.push({id:genId(),title,category:cat,effort,deadline,progress:0,createdAt:new Date().toISOString(),completedAt:null,stalledAt:null,notes:'',microSteps:[],lastProgressUpdate:new Date().toISOString()});
    save(); return true;
  }

  function updateProgress(id,prog) {
    const t = state.tasks.find(x=>x.id===id); if(!t) return;
    const old = t.progress;
    t.progress = Math.min(100,Math.max(0,prog));
    t.lastProgressUpdate = new Date().toISOString();
    if (t.progress>=80 && t.progress<95) { if(old<80||!t.stalledAt) t.stalledAt=new Date().toISOString(); }
    else t.stalledAt=null;
    if (t.progress>=100) { triggerRealityLock(id); return; }
    save(); render(); checkCloser();
  }

  // ── REALITY LOCK ──
  let pendingRealityId = null;
  function triggerRealityLock(id) {
    pendingRealityId = id;
    dom.realityLockModal.classList.remove('hidden');
  }

  function completeTask(id) {
    const idx = state.tasks.findIndex(x=>x.id===id); if(idx===-1) return;
    const t = state.tasks.splice(idx,1)[0];
    t.progress=100; t.completedAt=new Date().toISOString();
    
    const wasStalled = isStalled(t);
    if(t.effort==='Low') state.consecutiveLow++; else state.consecutiveLow=0;
    const isFarming = state.consecutiveLow >= 3;

    const mult = EFFORT_MULT[t.effort]||1;
    let basePts = Math.round(POINTS_BASE*mult);
    const isBoss = t.effort === 'Boss';
    const reward = rollReward(isBoss);

    if (isFarming) {
      basePts = Math.floor(basePts / 4);
      reward.bonusPts = Math.floor(reward.bonusPts / 4);
      showToast('Farming Detected: Low resistance builds weak warriors. Rewards crippled.', 'error');
    }
    if (wasStalled && !isFarming) {
      basePts *= 2;
      reward.bonusPts *= 2;
      showToast('CLOSER BONUS: You returned and finished what others abandoned! 2x Reward.', 'gold');
    }
    
    if (isBoss) {
      document.body.classList.add('screen-shake');
      setTimeout(()=>document.body.classList.remove('screen-shake'), 400);
      showToast('BOSS DEFEATED: Major execution validated.', 'gold');
    }

    const totalPts = basePts + reward.bonusPts;
    state.executionScore += totalPts;
    state.completedTasks.unshift(t);
    state.collectedArtifacts.push({...reward.artifact, rarity:reward.rarity, date:new Date().toISOString()});
    const today = todayKey();
    if(!state.dailyLog[today]) state.dailyLog[today]={completed:0, weight:0};
    state.dailyLog[today].completed++;
    state.dailyLog[today].weight = (state.dailyLog[today].weight || 0) + mult;
    state.totalCompletions++;
    state.currentLevelProgress++;

    // Lore fragment
    const loreIdx = state.currentLevelProgress - 1;
    const regionIdx = state.level - 1;
    const loreArr = getLore(regionIdx);
    const fragment = loreArr[Math.min(loreIdx, loreArr.length-1)];
    if (!state.unlockedLore[regionIdx]) state.unlockedLore[regionIdx] = [];
    if (state.unlockedLore[regionIdx].length < 10) state.unlockedLore[regionIdx].push(fragment);

    // Check level up
    let levelUp = null;
    if (state.currentLevelProgress >= TASKS_PER_LEVEL) {
      state.currentLevelProgress = 0;
      state.level++;
      state.currentTitle = getTitle(state.level);
      const completedRegion = getRegion(regionIdx);
      levelUp = { region: completedRegion, newLevel: state.level, newTitle: state.currentTitle };
    }

    state.pendingReward = { reward, basePts, totalPts, fragment, taskTitle: t.title };
    state.pendingLevelUp = levelUp;
    state.closerDismissed = false;
    save();

    dom.executionScore.textContent = state.executionScore;
    dom.executionScore.classList.add('score-bump');
    setTimeout(()=>dom.executionScore.classList.remove('score-bump'),600);

    render(); closeDetail();
    
    // Scythe Slash Animation
    dom.slashOverlay.classList.remove('hidden');
    setTimeout(() => {
      dom.slashOverlay.classList.add('hidden');
      dom.suspenseOverlay.classList.remove('hidden');
      setTimeout(() => {
        dom.suspenseOverlay.classList.add('hidden');
        showScratchCard(state.pendingReward);
      }, 2000); // 2 second dopamine delay
    }, 600);
  }

  function abandonTask(id) {
    const idx = state.tasks.findIndex(x=>x.id===id); if(idx===-1) return;
    const t = state.tasks.splice(idx,1)[0];
    t.abandonedAt = new Date().toISOString();
    state.abandonedTasks.unshift(t);
    state.closerDismissed = false;
    save(); render(); checkCloser(); closeDetail();
  }

  // ── SCRATCH CARD ──
  function showScratchCard(data) {
    const { reward, basePts, totalPts, fragment } = data;
    dom.rewardIcon.textContent = reward.artifact.icon;
    dom.rewardType.textContent = reward.rarity.toUpperCase() + ' ARTIFACT';
    dom.rewardName.textContent = reward.artifact.name;
    dom.rewardPoints.textContent = `+${totalPts} XP`;
    dom.loreText.textContent = fragment;

    const prog = state.currentLevelProgress;
    dom.sqpFill.style.width = (prog/TASKS_PER_LEVEL*100)+'%';
    dom.sqpText.textContent = `${prog}/${TASKS_PER_LEVEL} toward next region`;

    const wrapper = dom.scratchCanvas.parentElement;
    wrapper.classList.remove('revealed');

    const canvas = dom.scratchCanvas;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.globalCompositeOperation = 'source-over';

    // Draw scratch surface
    const grad = ctx.createLinearGradient(0,0,w,h);
    grad.addColorStop(0,'#2a2530'); grad.addColorStop(0.5,'#1e1a28'); grad.addColorStop(1,'#2a2530');
    ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);

    // Pattern
    ctx.fillStyle = '#333040';
    for(let i=0;i<w;i+=8) for(let j=0;j<h;j+=8) { if((i+j)%16===0) ctx.fillRect(i,j,4,4); }

    // Text
    ctx.fillStyle = '#6a6080'; ctx.font = '600 11px Inter';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('✦ SCRATCH TO REVEAL ✦', w/2, h/2-10);
    ctx.font = '500 9px Inter'; ctx.fillStyle = '#4a4560';
    ctx.fillText('Use mouse or finger', w/2, h/2+10);

    let drawing = false, scratched = 0;
    const totalPixels = w * h;

    function doScratch(x,y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(x,y,22,0,Math.PI*2); ctx.fill();
      scratched += Math.PI*22*22;
      if (scratched/totalPixels > 0.35) revealCard();
    }

    function revealCard() {
      canvas.onmousedown = canvas.onmousemove = canvas.onmouseup = null;
      canvas.ontouchstart = canvas.ontouchmove = canvas.ontouchend = null;
      ctx.clearRect(0,0,w,h);
      wrapper.classList.add('revealed');
    }

    canvas.onmousedown = ()=> drawing=true;
    canvas.onmouseup = ()=> drawing=false;
    canvas.onmouseleave = ()=> drawing=false;
    canvas.onmousemove = e => { if(!drawing) return; const r=canvas.getBoundingClientRect(); doScratch(e.clientX-r.left, e.clientY-r.top); };
    canvas.ontouchstart = e => { e.preventDefault(); drawing=true; };
    canvas.ontouchend = ()=> drawing=false;
    canvas.ontouchmove = e => { e.preventDefault(); const r=canvas.getBoundingClientRect(); const t=e.touches[0]; doScratch(t.clientX-r.left, t.clientY-r.top); };

    dom.scratchModal.classList.remove('hidden');
  }

  function closeScratchCard() {
    dom.scratchModal.classList.add('hidden');
    state.pendingReward = null;
    if (state.pendingLevelUp) {
      showLevelUp(state.pendingLevelUp);
      state.pendingLevelUp = null;
    }
    save();
  }

  function showLevelUp(data) {
    dom.levelupRegionName.textContent = data.region.name;
    dom.levelupDesc.textContent = data.region.desc;
    dom.levelupNumber.textContent = data.newLevel;
    dom.levelupTitleName.textContent = data.newTitle;
    dom.levelupModal.classList.remove('hidden');
  }

  // ── MAP ──
  function openMap() {
    dom.mapLevel.textContent = `Level ${state.level}`;
    dom.mapTitle.textContent = state.currentTitle;
    dom.mapCompletions.textContent = `${state.totalCompletions} total conquests`;
    dom.mapLorePanel.classList.add('hidden');
    renderMapGrid();
    renderArtifacts();
    dom.mapModal.classList.remove('hidden');
  }

  function renderMapGrid() {
    dom.mapGrid.innerHTML = '';
    const totalRegions = Math.max(20, state.level + 5);
    for (let i=0; i<totalRegions; i++) {
      const region = getRegion(i);
      const isCompleted = i < state.level - 1;
      const isCurrent = i === state.level - 1;
      const isLocked = i > state.level - 1;
      const tile = document.createElement('div');
      tile.className = `region-tile ${isCompleted?'completed':''} ${isCurrent?'current':''} ${isLocked?'locked':''}`;
      const loreCount = (state.unlockedLore[i]||[]).length;
      tile.innerHTML = `<span class="region-number">REGION ${i+1}</span><span class="region-icon">${region.icon}</span><span class="region-name">${region.name}</span>${!isLocked?`<span class="region-progress-mini">${isCompleted?'✓ CONQUERED':`${loreCount}/10`}</span>`:'<span class="region-progress-mini">🔒</span>'}`;
      if (!isLocked) tile.addEventListener('click', () => showRegionLore(i));
      dom.mapGrid.appendChild(tile);
    }
  }

  function showRegionLore(idx) {
    const region = getRegion(idx);
    dom.lorePanelTitle.textContent = `${region.icon} ${region.name}`;
    dom.lorePanelDesc.textContent = region.desc;
    const lore = getLore(idx);
    const unlocked = state.unlockedLore[idx] || [];
    dom.loreFragmentsList.innerHTML = '';
    lore.forEach((fragment, i) => {
      const item = document.createElement('div');
      const isUnlocked = i < unlocked.length;
      item.className = `lore-fragment-item ${isUnlocked?'':'locked'}`;
      item.textContent = isUnlocked ? unlocked[i] : `Fragment ${i+1} — [LOCKED]`;
      dom.loreFragmentsList.appendChild(item);
    });
    dom.mapLorePanel.classList.remove('hidden');
  }

  function renderArtifacts() {
    dom.artifactsGrid.innerHTML = '';
    if (state.collectedArtifacts.length === 0) {
      dom.artifactsGrid.innerHTML = '<span class="artifacts-empty">No artifacts collected yet.</span>';
      return;
    }
    state.collectedArtifacts.forEach(a => {
      const chip = document.createElement('div');
      chip.className = 'artifact-chip';
      chip.innerHTML = `<span class="artifact-icon">${a.icon}</span><span class="artifact-rarity-${a.rarity}">${a.name}</span>`;
      dom.artifactsGrid.appendChild(chip);
    });
  }

  // ── MICRO STEPS ──
  function genMicroSteps(task) {
    const rem = 100-task.progress, count = rem<=20?3:rem<=50?5:7, sz=Math.round(rem/count);
    const verbs = {Work:['Draft','Review','Refine','Polish','Test','Document','Finalize','Validate'],Study:['Read','Summarize','Practice','Review','Quiz','Outline','Apply','Reflect'],Fitness:['Warm up','Execute','Push through','Rest','Cool down','Stretch','Log','Recover'],Creative:['Brainstorm','Sketch','Iterate','Refine','Polish','Review','Finalize','Present']};
    const v = verbs[task.category]||verbs.Work;
    return Array.from({length:count},(_,i)=>({id:genId(),label:`${v[i%v.length]}: ${task.progress+sz*i}% → ${Math.min(100,task.progress+sz*(i+1))}% (5-10 min)`,checked:false}));
  }

  // ── CLOSER MODE ──
  function checkCloser() {
    const c = anyCloser();
    dom.btnAddTask.classList.toggle('disabled', activeTaskCount()>=MAX_TASKS);
    if (c && !state.closerDismissed) dom.closerOverlay.classList.remove('hidden');
    else dom.closerOverlay.classList.add('hidden');
  }

  // ── RENDER ──
  function render() {
    renderTasks(); renderDashboard(); renderWeekly(); renderLog(); renderNotes(); checkDaily();
    dom.taskCount.textContent = activeTaskCount();
    dom.executionScore.textContent = state.executionScore;
    dom.playerLevel.textContent = `LVL ${state.level}`;
    dom.playerTitle.textContent = state.currentTitle;
    dom.qpFill.style.width = (state.currentLevelProgress/TASKS_PER_LEVEL*100)+'%';
    dom.qpText.textContent = `${state.currentLevelProgress}/${TASKS_PER_LEVEL}`;
    dom.emptyState.classList.toggle('hidden', state.tasks.length>0);
    dom.taskList.classList.toggle('hidden', state.tasks.length===0);
  }

  function renderScythe() {
    const today = todayKey();
    const tl = state.dailyLog[today];
    const comps = tl ? tl.completed : 0;
    const weight = tl ? (tl.weight || comps) : 0;
    
    const currentYear = new Date().getFullYear().toString();
    let daysThisYear = 0;
    for (const date in state.dailyLog) {
      if (date.startsWith(currentYear) && state.dailyLog[date].completed > 0) daysThisYear++;
    }

    let material = 'dormant';
    let materialName = 'Dormant';
    if (weight >= 1 && weight < 3) { material = 'wood'; materialName = 'Wooden'; }
    else if (weight >= 3 && weight < 7) { material = 'steel'; materialName = 'Steel'; }
    else if (weight >= 7 && weight < 10) { material = 'silver'; materialName = 'Silver'; }
    else if (weight >= 10) { material = 'gold'; materialName = 'Golden'; }

    let aura = 'none';
    let skinPrefix = '';
    if (daysThisYear >= 300) { aura = 'void'; skinPrefix = 'Void '; material = 'cosmic'; }
    else if (daysThisYear >= 200) { aura = 'mythic'; skinPrefix = 'Mythic '; material = 'cosmic'; }
    else if (daysThisYear >= 100) { aura = 'ultimate'; skinPrefix = 'Ultimate '; }
    else if (daysThisYear >= 75) { aura = 'epic'; skinPrefix = 'Epic '; }
    else if (daysThisYear >= 50) { aura = 'rare'; skinPrefix = 'Rare '; }

    const fullName = comps === 0 ? 'Dormant Scythe' : `${skinPrefix}${materialName} Reaper`;

    dom.scytheName.textContent = fullName;
    dom.scytheStats.textContent = `${daysThisYear}/365 Execution Days`;
    
    dom.scytheBlade.setAttribute('class', `scythe-blade ${material}`);
    dom.slashScytheBlade.setAttribute('class', `scythe-blade ${material}`);
    dom.scytheSvg.setAttribute('class', `scythe-svg aura-${aura}`);
    dom.slashScytheSvg.setAttribute('class', `slash-scythe-svg aura-${aura}`);

    if (comps > 0) {
      dom.statusDot.className = 'status-dot execution';
      dom.statusLabel.textContent = `EXECUTIONER`;
      dom.statusLabel.style.color = 'var(--gold-core)';
    } else {
      dom.statusDot.className = 'status-dot no-completion';
      dom.statusLabel.textContent = 'NO COMPLETION';
      dom.statusLabel.style.color = 'var(--red-hot)';
    }
  }

  function renderTasks() {
    dom.taskList.innerHTML = '';
    state.tasks.forEach(t => {
      const stg = getStage(t.progress), cl = isCloser(t), st = isStalled(t);
      const dl = t.deadline ? daysBetween(t.deadline) : null;
      const icons = {Work:'⚙️',Study:'📖',Fitness:'💪',Creative:'🎨'};
      const fill = st?'fill-stalled':cl?'fill-closer':`fill-${stg}`;
      const badge = st ? ['badge-stalled','⚠ STALLED'] : [`badge-${stg}`,stageName(stg)];
      const card = document.createElement('div');
      card.className = `task-card stage-${stg}${cl?' closer-active':''}${st?' stalled':''}`;
      card.innerHTML = `<div class="task-card-top"><span class="task-title">${esc(t.title)}</span><span class="task-stage-badge ${badge[0]}">${badge[1]}</span></div><div class="task-meta-row"><span class="task-meta">${icons[t.category]||'📋'} ${t.category}</span><span class="task-meta">⚡ ${t.effort}</span>${t.deadline?`<span class="task-meta ${dl!==null&&dl<=5?'deadline-urgent':''}">${dl<=0?'🔴 OVERDUE':dl<=5?`🔴 ${dl}d left`:`📅 ${formatDate(t.deadline)}`}</span>`:''}</div><div class="task-progress-bar"><div class="task-progress-fill ${fill}" style="width:${t.progress}%"></div></div><div class="task-progress-text">${t.progress}%</div>${st?'<div class="stalled-warning">⚠ Execution incomplete. Update progress or abandon.</div>':''}${cl&&!st?'<div class="closer-warning">⚔ Closer Mode — Finish what you started.</div>':''}`;
      card.addEventListener('click', ()=>openDetail(t.id));
      dom.taskList.appendChild(card);
    });
  }

  function renderDashboard() {
    const today=todayKey(), tl=state.dailyLog[today], tc=tl?tl.completed:0, ta=state.tasks.length;
    dom.statToday.textContent = (ta+tc>0)?Math.round(tc/(ta+tc)*100)+'%':'—';
    dom.statCompleted.textContent = state.completedTasks.length;
    dom.statAbandoned.textContent = (state.abandonedTasks||[]).length;
    const tot = state.completedTasks.length + (state.abandonedTasks||[]).length;
    dom.statRatio.textContent = tot>0 ? Math.round(state.completedTasks.length/tot*100)+'%' : '—';
    renderScythe();
  }

  function renderWeekly() {
    dom.weeklyGraph.innerHTML='';
    const today=new Date(), days=['SUN','MON','TUE','WED','THU','FRI','SAT'];
    let mx=1;
    for(let i=6;i>=0;i--){const d=new Date(today);d.setDate(d.getDate()-i);const l=state.dailyLog[d.toISOString().slice(0,10)];if(l&&l.completed>mx)mx=l.completed;}
    for(let i=6;i>=0;i--){const d=new Date(today);d.setDate(d.getDate()-i);const k=d.toISOString().slice(0,10),l=state.dailyLog[k],c=l?l.completed:0,p=c/mx*100;
    const w=document.createElement('div');w.className='week-bar-wrapper';
    w.innerHTML=`<div class="week-bar-track"><div class="week-bar ${c>0?'has-completion':'no-completion'}" style="height:${Math.max(p,3)}%"></div></div><span class="week-label ${i===0?'today':''}">${days[d.getDay()]}</span>`;
    dom.weeklyGraph.appendChild(w);}
  }

  function renderLog() {
    dom.completionLog.innerHTML = '';
    if(!state.completedTasks.length){dom.completionLog.innerHTML='<div class="log-empty">No completions yet.</div>';return;}
    state.completedTasks.slice(0,10).forEach(t=>{
      const e=document.createElement('div');e.className='log-entry';
      e.innerHTML=`<span class="log-icon">🏆</span><span class="log-title">${esc(t.title)}</span><span class="log-date">${formatDate(t.completedAt)}</span>`;
      dom.completionLog.appendChild(e);
    });
  }

  function renderNotes() { dom.notesArea.value = state.notes||''; }

  function checkDaily() {
    renderScythe(); // This now fully controls the daily header status
  }

  // ── DETAIL MODAL ──
  let currentId = null;
  function openDetail(id) {
    const t=state.tasks.find(x=>x.id===id); if(!t) return;
    currentId=id;
    const stg=getStage(t.progress), cl=isCloser(t), st=isStalled(t), dl=t.deadline?daysBetween(t.deadline):null;
    dom.detailTitle.textContent=t.title;
    dom.detailMeta.innerHTML=`<span class="detail-meta-item">Category: <span class="detail-meta-value">${t.category}</span></span><span class="detail-meta-item">Effort: <span class="detail-meta-value">${t.effort}</span></span>${t.deadline?`<span class="detail-meta-item">Deadline: <span class="detail-meta-value">${formatDate(t.deadline)}${dl!==null?' ('+dl+'d)':''}</span></span>`:''}<span class="detail-meta-item">Created: <span class="detail-meta-value">${formatDate(t.createdAt)}</span></span>`;
    dom.detailProgressSlider.value=t.progress; dom.detailProgressVal.textContent=t.progress;
    updateDetailBar(t.progress,stg,cl,st);
    let sc,st2;
    if(st){sc='stage-stalled';st2='⚠ STALLED — Execution incomplete. Push through or abandon.';}
    else if(cl){sc='stage-closer';st2='⚔ CLOSER MODE — You are near the finish line. Complete this task.';}
    else{sc=`stage-${stg}`;st2={build:'🔨 BUILD PHASE — 0–70%',finish:'🔧 FINISH PHASE — 70–95%',ship:'🚀 SHIP PHASE — 95–100%'}[stg];}
    dom.detailStage.className=`detail-stage ${sc}`; dom.detailStage.textContent=st2;
    dom.detailNotes.value=t.notes||'';
    renderMicro(t);
    dom.taskDetailModal.classList.remove('hidden');
  }

  function updateDetailBar(p,stg,cl,st) {
    const f=dom.detailProgressFill; f.style.width=p+'%';
    f.className='progress-fill-detail';
    if(st){f.style.background='var(--stalled)';f.style.boxShadow='none';}
    else if(cl){f.style.background='var(--red-hot)';f.style.boxShadow='0 0 6px var(--red-hot)';}
    else{f.style.background=`var(--stage-${stg})`;f.style.boxShadow='none';}
  }

  function renderMicro(t) {
    dom.detailMicroSteps.innerHTML=''; if(!t.microSteps||!t.microSteps.length) return;
    const c=document.createElement('div');
    c.innerHTML='<label style="display:block;font-size:0.55rem;font-weight:700;letter-spacing:0.15em;color:var(--text-dim);margin-bottom:0.3rem">MICRO STEPS</label>';
    const l=document.createElement('div');l.className='micro-step-list';
    t.microSteps.forEach(s=>{const i=document.createElement('div');i.className=`micro-step-item ${s.checked?'checked':''}`;
    i.innerHTML=`<div class="micro-step-check">${s.checked?'✓':''}</div><span>${esc(s.label)}</span>`;
    i.addEventListener('click',e=>{e.stopPropagation();s.checked=!s.checked;save();renderMicro(t);});l.appendChild(i);});
    c.appendChild(l);dom.detailMicroSteps.appendChild(c);
  }

  function closeDetail(){dom.taskDetailModal.classList.add('hidden');currentId=null;}

  // ── LOW ENERGY ──
  function openLowEnergy() {
    dom.lowEnergyTasks.innerHTML=''; dom.microStepsOutput.classList.add('hidden');
    if(!state.tasks.length){dom.lowEnergyTasks.innerHTML='<div class="log-empty">No active tasks.</div>';}
    else state.tasks.forEach(t=>{const b=document.createElement('button');b.className='low-energy-task-btn';b.textContent=`${t.title} (${t.progress}%)`;
    b.addEventListener('click',()=>{t.microSteps=genMicroSteps(t);save();dom.microStepsOutput.classList.remove('hidden');
    dom.microStepsOutput.innerHTML=`<h4>MICRO STEPS: ${esc(t.title)}</h4>`;const l=document.createElement('div');l.className='micro-step-list';
    t.microSteps.forEach(s=>{const i=document.createElement('div');i.className='micro-step-item';i.innerHTML=`<div class="micro-step-check"></div><span>${esc(s.label)}</span>`;l.appendChild(i);});
    dom.microStepsOutput.appendChild(l);dom.lowEnergyTasks.innerHTML='<div class="log-empty" style="color:var(--gold-core)">Steps generated. Open task detail to track.</div>';});
    dom.lowEnergyTasks.appendChild(b);});
    dom.lowEnergyModal.classList.remove('hidden');
  }

  // ── EVENTS ──
  function bindEvents() {
    dom.btnAddTask.addEventListener('click',()=>{if(dom.btnAddTask.classList.contains('disabled'))return;dom.taskForm.classList.toggle('hidden');dom.btnAddTask.classList.toggle('hidden');if(!dom.taskForm.classList.contains('hidden')){dom.inputTitle.focus();dom.inputDeadline.min=todayKey();}});
    dom.btnCancelTask.addEventListener('click',()=>{dom.taskForm.classList.add('hidden');dom.btnAddTask.classList.remove('hidden');resetForm();});
    dom.taskForm.addEventListener('submit',e=>{e.preventDefault();const t=dom.inputTitle.value.trim(),c=dom.inputCategory.value,ef=dom.inputEffort.value,d=dom.inputDeadline.value;if(!t||!c||!ef||!d)return;if(addTask(t,c,ef,d)){resetForm();dom.taskForm.classList.add('hidden');dom.btnAddTask.classList.remove('hidden');render();checkCloser();}});
    dom.closerDismiss.addEventListener('click',()=>{state.closerDismissed=true;save();dom.closerOverlay.classList.add('hidden');});
    dom.detailProgressSlider.addEventListener('input',e=>{const v=+e.target.value;dom.detailProgressVal.textContent=v;if(currentId){const t=state.tasks.find(x=>x.id===currentId);if(t){updateDetailBar(v,getStage(v),v>=CLOSER_THRESH||(t.deadline&&daysBetween(t.deadline)<=CLOSER_DAYS),false);}}});
    dom.detailProgressSlider.addEventListener('change',e=>{const v=+e.target.value;if(currentId){updateProgress(currentId,v);if(v<100)openDetail(currentId);}});
    dom.btnCompleteTask.addEventListener('click',()=>{if(currentId)triggerRealityLock(currentId);});
    dom.btnRealityReturn.addEventListener('click', ()=>{ dom.realityLockModal.classList.add('hidden'); if(pendingRealityId) updateProgress(pendingRealityId, 95); });
    dom.btnRealityFinish.addEventListener('click', ()=>{ dom.realityLockModal.classList.add('hidden'); if(pendingRealityId) completeTask(pendingRealityId); });
    dom.btnAbandonTask.addEventListener('click',()=>{if(currentId&&confirm('Abandon this task? This counts against your execution ratio.'))abandonTask(currentId);});
    dom.detailClose.addEventListener('click',closeDetail);
    dom.taskDetailModal.addEventListener('click',e=>{if(e.target===dom.taskDetailModal)closeDetail();});
    dom.detailNotes.addEventListener('input',()=>{if(currentId){const t=state.tasks.find(x=>x.id===currentId);if(t){t.notes=dom.detailNotes.value;save();}}});
    dom.btnLowEnergy.addEventListener('click',openLowEnergy);
    dom.lowEnergyClose.addEventListener('click',()=>dom.lowEnergyModal.classList.add('hidden'));
    dom.lowEnergyModal.addEventListener('click',e=>{if(e.target===dom.lowEnergyModal)dom.lowEnergyModal.classList.add('hidden');});
    dom.notesArea.addEventListener('input',()=>{state.notes=dom.notesArea.value;save();});
    dom.scratchClose.addEventListener('click',closeScratchCard);
    dom.scratchModal.addEventListener('click',e=>{if(e.target===dom.scratchModal)closeScratchCard();});
    dom.levelupClose.addEventListener('click',()=>dom.levelupModal.classList.add('hidden'));
    dom.levelupModal.addEventListener('click',e=>{if(e.target===dom.levelupModal)dom.levelupModal.classList.add('hidden');});
    dom.btnMap.addEventListener('click',openMap);
    dom.mapClose.addEventListener('click',()=>dom.mapModal.classList.add('hidden'));
    dom.mapModal.addEventListener('click',e=>{if(e.target===dom.mapModal)dom.mapModal.classList.add('hidden');});
    dom.lorePanelClose.addEventListener('click',()=>dom.mapLorePanel.classList.add('hidden'));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDetail();dom.lowEnergyModal.classList.add('hidden');dom.mapModal.classList.add('hidden');if(!dom.taskForm.classList.contains('hidden')){dom.taskForm.classList.add('hidden');dom.btnAddTask.classList.remove('hidden');resetForm();}}});
  }

  function resetForm(){dom.inputTitle.value='';dom.inputCategory.selectedIndex=0;dom.inputEffort.selectedIndex=0;dom.inputDeadline.value='';}

  // ── INIT ──
  state.tasks.forEach(t=>{if(t.progress>=80&&t.progress<95&&!t.stalledAt)t.stalledAt=t.lastProgressUpdate||new Date().toISOString();});
  save(); render(); bindEvents(); checkDaily(); checkCloser();
})();
