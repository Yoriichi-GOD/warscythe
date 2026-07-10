export const MAX_TASKS = 999;
export const CLOSER_THRESH = 80;
export const CLOSER_DAYS = 5;
export const STALLED_HRS = 48;
export const POINTS_BASE = 100;
export const EFFORT_MULT = { Low: 1, Medium: 1.5, High: 2, Boss: 5 };
export const TASKS_PER_LEVEL = 5;

export const REGIONS = [
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
  { name: 'Throne of the Warscythe', icon: '👑', desc: 'The seat of absolute execution. You have arrived. Now hold it.' },
  { name: "Voidwalker's Expanse", icon: '🌌', desc: 'Beyond the known maps. Here, you write the territory.' },
  { name: 'The Eternal Siege', icon: '🛡️', desc: 'Wars never end, they evolve. Adapt or be forgotten.' },
  { name: 'Astral Dominion', icon: '✨', desc: 'Dominion over the stars themselves. Reality reshapes at your command.' },
  { name: "The Architect's Vault", icon: '🏛️', desc: 'Building reality from nothing. Every completed task is a brick in your empire.' },
  { name: 'Omega Citadel', icon: '🔮', desc: 'The final stronghold — or is it? Beyond this, only legends speak.' },
];

export const TITLES = [
  'Recruit','Tactician','Iron Executor','Shadow Marshal','The Relentless',
  'Siege Commander','Voidbreaker','Storm Sovereign','Dragon Lord','The Architect',
  'Warscythe Supreme','Eternal Conqueror','Reality Shaper','Omega Commander','Ascendant',
  'Mythic Executor','Titan of Will','The Unstoppable','Cosmic Warscythe','Legend Incarnate'
];

export const LORE_TEMPLATES = [
  [
    "The gates open slowly, resisting decades of rust. Truth: Resistance is proof you are moving in the right direction.", 
    "A figure carved into the stone watches with hollow eyes. Cost: To be the stone, you must let your soft parts harden. Know what you are giving up to stand this still.", 
    "Footsteps echo — yours are the first in a long time. Reality: Extreme focus is a lonely country. The silence is the price of entry.", 
    "An inscription reads: 'Only those who finish may pass.' Rule: Unfinished work is cognitive debt.", 
    "The wind carries whispers of abandoned ambitions. Insight: Motivation fades. Systems remain.", 
    "A broken sword lies at the entrance. Lesson: Burnout breaks the tool; pace your aggression.", 
    "You press forward. The gate seals behind you. Doctrine: Burn the boats. No retreat.", 
    "Torchlight reveals a map etched into the wall. Strategy: Plan in the light, execute in the dark.", 
    "The path splits — but all roads lead to the same truth. Truth: Indecision is a decision to fail.", 
    "The Threshold accepts you. The journey has begun. Rule: Action precedes clarity."
  ],
  [
    "Smoke rises from a distant camp. Cost: To stay on course, you must pass by warm hearths and human laughter. Choose the cold march over comfortable stagnation.", 
    "A merchant offers shortcuts for gold. Lesson: You cannot buy consistency. Every path bought with ease breaks under the first heavy load.", 
    "The frontier stretches endlessly. Rule: Focus only on the next 100 meters.", 
    "Wild creatures test your resolve. Reality: Distractions will escalate as your focus deepens.", 
    "A fellow traveler warns: 'Most turn back here.' Truth: The crowd is a monument to average.", 
    "You find an old journal — its last entry unfinished. Lesson: Closure is a discipline.", 
    "The campfire burns low. Tomorrow, you push deeper. Doctrine: Rest is a weapon, not a reward.", 
    "A scout's tower reveals the vastness ahead. Strategy: Zoom out to plan, zoom in to execute.", 
    "The frontier taught its lesson. Insight: Comfort is the slow death of ambition.", 
    "Ashwood falls behind. The real challenge begins. Rule: Every level demands a new version of you."
  ],
  [
    "Heat rises from cracks in the earth. Truth: Pressure creates diamonds or dust. Choose.", 
    "Molten rivers flow between narrow paths. Tactic: Restrict your options to force execution.", 
    "A voice booms: 'Show me your commitment.' Reality: The world tests what you claim to desire.", 
    "The air is thick with the ash of failed attempts. The crucible doesn't reset them; they pile up. Tactic: Acknowledge the cost of learning, or the cost will consume you.", 
    "Your tools glow red — forged stronger by the trial. Lesson: Friction sharpens the blade.", 
    "Others have tried this path. Their marks remain. Strategy: Learn from their deaths, not their words.", 
    "Each step forward costs more than the last. Doctrine: Compounding effort requires compounding sacrifice.", 
    "The crucible does not break iron — it reveals it. Truth: Hardship strips away the fake.", 
    "Heat becomes fuel. Pain becomes progress. Rule: Reframe discomfort as biological adaptation.", 
    "The Crucible is conquered. You are no longer raw material. Insight: You are forged."
  ],
  [
    "Iron gates rise thirty feet. They open for you. Truth: Consistency commands respect from reality itself.", 
    "Sentinels stand motionless — they recognize discipline. Cost: To automate your life is to surrender spontaneity. Accept the routine, or remain a chaotic amateur.", 
    "Every corridor is measured. Every stone placed with intent. Strategy: Precision requires slowing down. Do not mistake frantic activity for progress.", 
    "A war room displays campaigns spanning centuries. Insight: Play the decade game, not the daily game.", 
    "The garrison's motto: 'Hesitation is defeat.' Rule: Speed of implementation is the ultimate advantage.", 
    "You find armor that fits — it was waiting for you. Lesson: You grow into the responsibilities you take on.", 
    "Training grounds echo with the clash of purpose. Doctrine: Sweat in practice to bleed less in war.", 
    "The fortress library contains only completed works. Truth: Potential is a lie told to the lazy.", 
    "From the ramparts, you survey what lies ahead. Strategy: Maintain the high ground of perspective.", 
    "Ironveil acknowledges your command. The fortress is yours. Insight: Authority is taken, not given."
  ],
  [
    "Obsidian glass stretches in every direction. Truth: The path of mastery is lonely and reflective.", 
    "The march is silent. Only your heartbeat marks time. Tactic: Silence the noise. Focus on the rhythm of execution.", 
    "Shadows move — reflections of your own doubt. Reality: Your biggest enemy is the voice in your head.", 
    "A bridge of black stone spans a chasm of uncertainty. Strategy: Action bridges the gap between doubt and confidence.", 
    "The path is unmarked. You make your own. Rule: Trailblazing requires accepting the risk of getting lost.", 
    "Cold wind cuts — but you've felt worse inside. Lesson: Internal fortitude makes external conditions irrelevant.", 
    "A monument to the lost: those who stopped marching. Doctrine: Momentum is life. Stagnation is death.", 
    "The obsidian reflects not your face — but your intent. Truth: Your actions are the only true mirror.", 
    "Dawn breaks over volcanic glass. Beautiful and deadly. Insight: Success is sharp. Handle it carefully.", 
    "The March ends. You carry its darkness as armor. Rule: Integrate your shadow; do not fear it."
  ],
  [
    "Ancient tomes line walls that reach for the sky. Truth: Knowledge is potential energy. Execution is kinetic.",
    "A professor's ghost lectures on strategic patience. Tactic: Wait for the right strike, then strike with all your might.",
    "Knowledge crystallizes — every lesson is a loaded weapon. Insight: Don't read to consume. Read to deploy.",
    "The library's restricted section opens only to executors. Rule: The deepest secrets are hidden behind the hardest work.",
    "A formula on the blackboard: Ambition × Action = Empire. Reality: Multiplying by zero action yields zero empire.",
    "Students' abandoned projects line the halls — warnings. Lesson: Starting is easy. Finishing is elite.",
    "You master a chapter others never opened. Strategy: Find the work others avoid and make it your home.",
    "The Academy's final exam: complete what you started. Doctrine: The only valid diploma is a finished product.",
    "Dark knowledge isn't evil — it's efficient. Truth: Morality is often an excuse for cowardice. Be effective.",
    "Dreadspire recognizes a master strategist. Rule: The game is won before it is played."
  ],
  [
    "Hammers ring in perfect rhythm. Tactic: Find your cadence and do not break it for anything.",
    "The forge-master speaks: 'Legends aren't born. They're made.' Truth: Talent is a myth. Repetition is reality.",
    "Metal bends. So does reality, for the persistent. Insight: The universe yields to uncompromising will.",
    "A weapon with your name emerges from the flames. Strategy: Create things that cannot be ignored.",
    "The forge never cools because the work never stops. Rule: Amateurs wait for inspiration. Professionals go to work.",
    "Impurities burn away. What remains is purpose. Lesson: Simplify your life until only the mission remains.",
    "Ancient artifacts line the walls — each one finished. Doctrine: Honor the past by outworking it.",
    "The heat doesn't bother you anymore. Reality: You adapt to the level of stress you regularly expose yourself to.",
    "You forge something that didn't exist before today. Truth: Creation is the ultimate act of defiance.",
    "The Forge recognizes a creator. Not a dreamer — a maker. Insight: Ideas are cheap. Execution is priceless."
  ],
  [
    "The surface breaks. Deep water swallows light. Tactic: Eliminate visual distractions. Work in deep focus.",
    "Bioluminescent creatures illuminate hidden passages. Insight: Clarity comes in flashes during deep work.",
    "Pressure increases — but diamonds form under pressure. Truth: If it's easy, it's not changing you.",
    "A sunken library holds secrets the surface forgot. Strategy: Look where others are too afraid to dive.",
    "The depths are quiet. Your thoughts echo clearly. Rule: Solitude is the laboratory of greatness.",
    "Ancient mechanisms still function — built to last. Lesson: Build systems that survive your bad days.",
    "You surface briefly, gasping — then dive deeper. Doctrine: Recovery is necessary to dive deeper next time.",
    "The abyss doesn't stare back. It acknowledges. Reality: The universe respects absolute commitment.",
    "Treasures line the deep — left by those who surfaced too soon. Truth: Most quit at 40% capacity.",
    "Shadowmere yields its deepest secret: persistence outlasts depth. Insight: You can out-endure any problem."
  ],
  [
    "The air thins with every step upward. Tactic: As resources dwindle, efficiency must peak.",
    "Red stone marks the path — stained by determination. Truth: Success demands a blood price of sweat.",
    "A false summit tests your resolve. The real one is higher. Strategy: When you think you're done, do one more.",
    "Climbers' marks cover every handhold — you add yours. Insight: You stand on the shoulders of your own past efforts.",
    "The wind screams. You climb louder. Rule: Your execution must drown out external noise.",
    "From halfway up, the world looks small. Keep going. Lesson: Perspective shifts the higher you climb.",
    "Blood on rock. Not from falling — from gripping harder. Doctrine: Hold on to your standards at all costs.",
    "The summit is not the goal. Reaching it is. Reality: The person you become is the true reward.",
    "Clouds break beneath you. You stand above the storm. Truth: Elevation provides immunity to petty problems.",
    "The Crimson Summit bows to its conqueror. Insight: The mountain doesn't care. You conquered yourself."
  ],
  [
    "Generals stand as you enter. They were waiting. Truth: Competence attracts responsibility.",
    "Every wall displays a campaign won through execution. Tactic: Review your past wins to fuel future strikes.",
    "The round table has one empty chair. It's yours. Insight: Take your place at the table, or someone else will.",
    "Maps of future conquests spread across the table. Strategy: Plan 3 moves ahead, execute the first today.",
    "A war horn sounds — not for battle, but recognition. Rule: Acknowledge the win, then return to the map.",
    "Strategy without execution is decoration. You know this. Lesson: A flawless plan with no action is a hallucination.",
    "The council votes unanimously: you lead. Doctrine: Leadership is taken by those who deliver results.",
    "From this room, armies of intention march. Reality: Your thoughts are soldiers. Command them.",
    "Every plan on this table was finished. That's the rule. Truth: A half-executed plan is a full failure.",
    "The War Council has a new commander. Insight: Heavy is the head that executes the crown."
  ],
];

export const BASE_ARTIFACTS = [
  {
    name: 'Tome of Iron Will',
    icon: '📖',
    hook: 'You iterated. That made it better.',
    lore: 'Your brain doesn\'t lock in on version one. It rewrites, refines, sharpens. Most people call this inefficiency. You call it quality control. Write it down—each revision is proof you\'re getting closer to the weapon.'
  },
  {
    name: 'Compass of the Scout',
    icon: '🧭',
    hook: 'One target. One direction. Execute.',
    lore: 'Your mind generates options faster than most can think. The compass points to *one*. Not because you\'re limited—because you\'ve learned that focus multiplies force. Pick the target. The rest dissolves.'
  },
  {
    name: 'Scroll of Intent',
    icon: '📜',
    hook: 'You started. The rest follows.',
    lore: 'Starting is where ADHD stalls. The friction of initiating paralysis is real. You broke it. Five minutes became ten. Ten became an hour. The scroll commemorates the moment you crossed the wall.'
  },
  {
    name: 'Scroll of Momentum',
    icon: '📜',
    hook: 'Motion became velocity. You\'re accelerating.',
    lore: 'You don\'t start fast. You start slow and accelerate into hyperfocus. By task completion, you\'re moving at speeds others can\'t sustain. The scroll is inscribed with that acceleration curve—evidence that your intensity compounds over time.'
  },
  {
    name: 'Rune of Focus',
    icon: '🪨',
    hook: 'Singular. Relentless. Sharpened.',
    lore: 'Your brain is a multi-threaded processor trying to run in single-threaded mode. When you *do* focus, you cut deeper than most ever will. The rune is carved from that pressure.'
  },
  {
    name: 'Chalice of Resolve',
    icon: '🏆',
    hook: 'You finished. Most don\'t.',
    lore: 'Completion is where ADHD fails most people. You didn\'t. You saw the end and ran through it. The chalice marks the work—not potential, not plans, not wishes. *Work*.'
  },
  {
    name: 'Blade of Persistence',
    icon: '🗡️',
    hook: 'The urge to quit peaked. You accelerated instead.',
    lore: 'ADHD hyperfocus has a pattern: slow start, rapid acceleration, then a moment of resistance where the task *feels* done but isn\'t. Most players stop there. You pushed through. That moment of acceleration past the false finish is where the blade gets forged.'
  },
  {
    name: 'Shield of No Retreat',
    icon: '🛡️',
    hook: 'You eliminated the escape route. You executed.',
    lore: 'You set constraints: deadlines you couldn\'t move, environments where failure stung more than the work itself. Most people call this pressure. You call it tactical positioning. The shield doesn\'t defend—it enforces execution.'
  },
  {
    name: 'Ring of Execution',
    icon: '💍',
    hook: 'Each yes killed a hundred distractions.',
    lore: 'Your brain runs on novelty. Saying yes to one thing means saying no to infinite others. Most people can\'t. You did. The ring is the vow—not to the goal, but to the *singular path* you chose.'
  },
  {
    name: 'Helm of Clarity',
    icon: '⛑️',
    hook: 'Fatigue didn\'t cloud your judgment. Routine did.',
    lore: 'Decision-making dies in fatigue. You learned to standardize, to autopilot the non-critical. Ritual replaced choice. And in that stillness, the critical decisions became clear. The helm doesn\'t protect your mind—it simplifies what your mind must defend.'
  },
  {
    name: 'Staff of Deadlines',
    icon: '🏑',
    hook: 'You halved the time. Work filled the space you left.',
    lore: 'Parkinson\'s Law isn\'t philosophy to ADHD brains—it\'s a lifeline. You set shorter deadlines because you know the ADHD multiplier: artificial constraint = hyper-focus activation. The staff measures not time, but the pressure that forces execution.'
  },
  {
    name: 'Rune of Iteration',
    icon: '🪨',
    hook: 'You remixed it. Every version sharper.',
    lore: 'Most people lock in their approach and execute. Your ADHD brain can\'t—and doesn\'t need to. You iterate in real-time, learning as you move. Your "inefficiency" is actually a rapid-feedback loop most brains can\'t access. The rune is etched from that adaptive speed.'
  },
  {
    name: 'Idol of the Dragon',
    icon: '🗿',
    hook: 'Criticism used to break you. Now it sharpens you.',
    lore: 'Shame and hypersensitivity to criticism are ADHD classics. You fought that wiring and won. External feedback no longer derails your focus—it inputs data. The idol is carved from feedback that would have broken you six months ago.'
  },
  {
    name: 'Eye of the Strategist',
    icon: '👁️',
    hook: 'You stopped doing everything. You conquered what mattered.',
    lore: 'ADHD hyperfocus can be scattered or targeted. You learned to *target* it. You stopped context-switching and started *strategic depth*. The eye sees the full board, but commands only where your intensity will compound.'
  },
  {
    name: 'Chain of the Void Walker',
    icon: '⛓️',
    hook: 'You acted before the plan was perfect.',
    lore: 'Perfectionism isn\'t your weakness—impulsivity is. But impulsivity without direction is chaos. You flipped it: you *act fast without needing certainty*. That\'s not recklessness—that\'s the ADHD speed advantage, weaponized. Each chain link is a step taken between worlds most people never see.'
  },
  {
    name: 'Crown of Completion',
    icon: '👑',
    hook: 'The final 1% cost 50% of the effort. You paid it.',
    lore: 'ADHD kills projects in the last 10%. Finishing is where you differ. You didn\'t abandon it at 95%—you ran through the wall to completion. The crown isn\'t for starting well. It\'s for finishing *despite* the ADHD resistance that peaks at the end.'
  },
  {
    name: 'Gauntlet of the Warscythe',
    icon: '🧤',
    hook: 'Your hands are calloused. The friction is your language.',
    lore: 'You stopped trying to protect your hands from the work. Resistance, friction, pressure—these are no longer obstacles. They\'re the only language your ADHD brain trusts. The gauntlet marks the moment you stopped *managing* difficulty and started *weaponizing* it.'
  },
  {
    name: 'Blade of the Finisher',
    icon: '⚔️',
    hook: 'You finished what most people quit.',
    lore: 'The world doesn\'t measure potential. It measures finished work. ADHD is an expert at potential. You became the exception: the ADHD player who finishes. That\'s not normal. That\'s not evolution. That\'s transcendence.'
  },
  {
    name: 'Idol of the Throne',
    icon: '🗿',
    hook: 'You own the chaos. You rule it now.',
    lore: 'Most ADHD players spend their lives fighting their wiring. You stopped fighting and started *commanding*. Your inconsistency, your restarts, your hyperfocus spirals—you own them completely. That ownership is sovereignty.'
  },
  {
    name: 'Mirror of Reality',
    icon: '🪞',
    hook: 'You measured yourself ruthlessly. You showed up anyway.',
    lore: 'ADHD hides in avoidance of metrics. You confronted them—daily completion rates, streak counts, velocity trends. And knowing you were failing in real-time, you executed anyway. That\'s not discipline. That\'s the final evolution: acceptance + action.'
  },
  {
    name: 'Skull of the Reaper',
    icon: '💀',
    hook: 'Your ADHD isn\'t a disability. It\'s your weapon.',
    lore: 'You stopped apologizing. Stopped managing. Stopped explaining. You execute at velocities neurotypical brains cannot sustain, see patterns most will never notice, and hyperfocus with intensity that looks like magic. You\'ve hacked your own neurology. You are not disabled. You are different. And different has won.'
  },
  {
    name: 'Orb of Sovereignty',
    icon: '🌌',
    hook: 'Reality bent. You didn\'t.',
    lore: 'The ultimate engine of execution. It doesn\'t measure output—it transforms intent directly into reality. Only forged under extreme cognitive pressure.'
  },
  {
    name: 'Hourglass of the Omega',
    icon: '⏳',
    hook: 'The distraction died. The focus remains.',
    lore: 'For those who have conquered the ADHD storm. The hourglass channels hyperfocus into a single laser-thin line that cuts through any obstacle.'
  },
  {
    name: 'Gauntlet of the Void',
    icon: '🕳️',
    hook: 'Nothing else exists. Only this moment.',
    lore: 'A gauntlet woven from absolute stillness. When worn, all noise, doubts, and excuses dissolve. There is only you, and the work.'
  },
  {
    name: 'Lantern of the Lost',
    icon: '🏮',
    hook: 'Your guide in the darkness.',
    lore: 'For those who walk the dark forest path alone. The lantern shows the next step when the road ahead is obscured by uncertainty.'
  },
  {
    name: 'Amulet of the Relentless',
    icon: '📿',
    hook: 'You kept going when logic said stop.',
    lore: 'The ADHD brain burns out faster than most. Dopamine crashes hard. And yet you came back. Again. The amulet is charged by each return—not by streaks, but by the refusal to quit permanently.'
  },
  {
    name: 'Coin of the Conquered',
    icon: '🪙',
    hook: 'You traded excuses for output.',
    lore: 'Every task completed is currency. Not for others—for your future self who needs proof that you can deliver. The coin doesn\'t represent wealth. It represents evidence. You have a record now. Use it.'
  },
  {
    name: 'Gem of Rare Focus',
    icon: '💎',
    hook: 'You found the frequency. You locked in.',
    lore: 'Hyperfocus is a weapon most neurotypes can\'t access. When it fires, you outperform everyone in the room. The gem is crystallized from those moments—rare, intense, and entirely yours. Guard them. Learn to summon them.'
  },
  {
    name: 'Horn of the Siege',
    icon: '📯',
    hook: 'You called the charge. You led.',
    lore: 'Leadership isn\'t about control. It\'s about decisiveness under chaos. Your ADHD makes chaos feel native—so when others freeze, you move. The horn was sounded at the moment you stopped waiting for permission and started.'
  },
  {
    name: 'Map of the Uncharted',
    icon: '🗺️',
    hook: 'You went where there was no path.',
    lore: 'No one handed you a manual. The ADHD brain doesn\'t follow maps—it draws them. You navigated uncertainty by moving through it, not around it. This map is the record of the territory you personally conquered.'
  }
];

export const HABIT_TEMPLATES = [
  { title: 'Hydrate', category: 'Health', effort: 'Low' },
  { title: 'Meditate', category: 'Mental', effort: 'Low' },
  { title: 'Stretch', category: 'Health', effort: 'Low' },
  { title: 'Strength Train', category: 'Physical', effort: 'Medium' },
  { title: 'Write Code', category: 'Creative', effort: 'Medium' },
  { title: 'Read 10 Pages', category: 'Intellect', effort: 'Low' }
];

export const VIDEO_GUIDE_MAP = {
  global_intro: "dQw4w9WgXcQ",
  operations: "dQw4w9WgXcQ",
  fitness: "dQw4w9WgXcQ",
  rituals: "dQw4w9WgXcQ",
  forge: "dQw4w9WgXcQ",
  quest_map: "dQw4w9WgXcQ",
  ledger: "dQw4w9WgXcQ",
  legion: "dQw4w9WgXcQ",
};

