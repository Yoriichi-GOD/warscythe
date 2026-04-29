export const MAX_TASKS = 3;
export const CLOSER_THRESH = 80;
export const CLOSER_DAYS = 5;
export const STALLED_HRS = 48;
export const POINTS_BASE = 100;
export const EFFORT_MULT = { Low: 1, Medium: 1.5, High: 2, Boss: 5 };
export const TASKS_PER_LEVEL = 10;

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

export const ARTIFACT_POOL = {
  common: [
    {name:'Iron Quill',icon:'🖋️'},{name:'Wax Seal of Intent',icon:'📜'},{name:'Ember Stone',icon:'🪨'},
    {name:'Scout\'s Compass',icon:'🧭'},{name:'Whetstone of Focus',icon:'🪨'},{name:'Ink of Resolve',icon:'🫗'},
  ],
  uncommon: [
    {name:'Blade of Persistence',icon:'🗡️'},{name:'Shield of No Retreat',icon:'🛡️'},{name:'Cloak of Momentum',icon:'🧥'},
    {name:'Ring of Execution',icon:'💍'},{name:'Helm of Clarity',icon:'⛑️'},{name:'Staff of Deadlines',icon:'🏑'},
  ],
  rare: [
    {name:'Warscythe\'s Gauntlet',icon:'🧤'},{name:'Crown of Completion',icon:'👑'},{name:'Eye of the Strategist',icon:'👁️'},
    {name:'Dragon Scale Armor',icon:'🐉'},{name:'Void Walker\'s Boots',icon:'👢'},
  ],
  epic: [
    {name:'The Finisher',icon:'⚔️'},{name:'Throne Fragment',icon:'🏛️'},{name:'Shard of Reality',icon:'🔮'},
  ],
};
