export const MAX_TASKS = 3;
export const CLOSER_THRESH = 80;
export const CLOSER_DAYS = 5;
export const STALLED_HRS = 48;
export const POINTS_BASE = 100;
export const EFFORT_MULT = { Low: 1, Medium: 1.5, High: 2, Boss: 5 };
export const TASKS_PER_LEVEL = 3;

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

export const ARTIFACT_POOL = {
  common: [
    {
      name: 'Iron Quill',
      icon: '🖋️',
      lore: 'The Threshold: The gate guards ask for a name. Write it down or you cannot pass. First step of execution: define yourself. The mind is a leaky vessel; the ink is solid.'
    },
    {
      name: 'Scout\'s Compass',
      icon: '🧭',
      lore: 'Ashwood Frontier: The frontier stretches in all directions, paralyzing the weak. Pick a single tree on the horizon and walk to it. One target. One day.'
    },
    {
      name: 'Ember Stone',
      icon: '🪨',
      lore: 'The Crucible: A cold anvil produces no blades. The spark doesn\'t wait for you to feel ready. Strike the flint when it is cold, or remain in the dark.'
    },
    {
      name: 'Wax Seal of Intent',
      icon: '📜',
      lore: 'The Threshold: A broken seal is proof of a compromised word. Once you stamp your intent on a task, it is no longer negotiable. Do not negotiate with yourself.'
    },
    {
      name: 'Whetstone of Focus',
      icon: '🪨',
      lore: 'Ironveil Fortress: A blade ground against too many stones is ruined. Apply relentless, singular friction to one task. To work on everything is to finish nothing.'
    },
    {
      name: 'Ink of Resolve',
      icon: '🫗',
      lore: 'Ashwood Frontier: Plans drawn in the dirt are washed away by the first rain. Ink is permanent. Write the task down as a commitment to the earth.'
    },
    {
      name: 'Scout\'s Journal',
      icon: '📓',
      lore: 'The Threshold: The gate does not open for vague intentions. Write down the micro-steps of your ascent. Clarity is the first defense against paralysis.'
    },
    {
      name: 'Ironveil Ruler',
      icon: '📏',
      lore: 'Ironveil Fortress: Every block in these walls is measured to the millimeter. Measure your time, or others will steal it. Precision is discipline.'
    }
  ],
  uncommon: [
    {
      name: 'Shield of No Retreat',
      icon: '🛡️',
      lore: 'Crucible Exit: Burn the boats—but know exactly what you are burning. This choice is irreversible. To commit to this path means letting other versions of you die.'
    },
    {
      name: 'Cloak of Momentum',
      icon: '🧥',
      lore: 'Shadowmere Depths: Motion covers weakness. But motion in the wrong direction is collapse at speed. Momentum requires constant direction, not just activity.'
    },
    {
      name: 'Blade of Persistence',
      icon: '🗡️',
      lore: 'The Forge Eternal: The hammer strikes when the arm is tired, not when it is fresh. The final strikes determine the temper. Push through the exhaustion; the heat is temporary.'
    },
    {
      name: 'Helm of Auto-Reflex',
      icon: '⛑️',
      lore: 'Ironveil Fortress: Fatigue attacks the decision-making center first. Standardize your starting actions until they require no choice. Make discipline a habit, not a debate.'
    },
    {
      name: 'Hourglass of Scarcity',
      icon: '⏳',
      lore: 'Crimson Summit: As you climb, the air thins and energy becomes scarce. You cannot do everything. Choose what to ignore, or the mountain will choose for you.'
    }
  ],
  rare: [
    {
      name: 'Throne Fragment',
      icon: '🏛️',
      lore: 'The War Council: You sit at the table now. The chair will accept a coward just as easily as a commander. The seat does not make you sovereign; your decisions do.'
    },
    {
      name: 'Shard of Reality',
      icon: '🔮',
      lore: 'Dreadspire Academy: The Academy measures everything. But not every metric matters. Learn which numbers are weapons for execution and which are just mirrors for vanity.'
    },
    {
      name: 'Crown of Completion',
      icon: '👑',
      lore: 'Throne of the Warscythe: A 99% finished campaign is a defeat. The final steps are the heaviest because you are tired. Wear this crown not as a reward, but as a duty to finish.'
    },
    {
      name: 'Warscythe\'s Gauntlet',
      icon: '🧤',
      lore: 'War Council: Your hands are no longer soft. The friction of difficult work is no longer a test—it is a language you speak fluently. You have become the kind of person for whom hesitation feels foreign.'
    }
  ],
  epic: [
    {
      name: 'The Finisher',
      icon: '⚔️',
      lore: 'The Threshold of the Warscythe: The world rewards finished work, but the real victory is internal. You must finish knowing it is not perfect, knowing you could have done more, and choosing to close the loop anyway. Imperfection + closure beats perfection + paralysis.'
    },
    {
      name: 'The Sovereign\'s Legacy',
      icon: '👑',
      lore: 'Voidwalker\'s Expanse: You have completed the trials. You hold the crowns. The question is no longer whether you have the discipline to finish. The question is: what are you building with it? The tool is mastered; now build your empire.'
    }
  ]
};
