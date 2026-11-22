export const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'mythic'];
export const SCENES = {
  cave: { title: 'Beneath the old road', description: 'A traveller’s cache, sheltered beneath broken stone.', art: '/rewards/scene-cave.webp' },
  castle: { title: 'Within the quiet keep', description: 'A narrow alcove kept this find beyond the court’s eyes.', art: '/rewards/scene-castle.webp' },
  dispatch: { title: 'Among the undelivered post', description: 'A weathered box carried something worth keeping.', art: '/rewards/scene-dispatch.webp' },
};
const LEGACY_ART = {
  'Iron Quill':'tome', "Scout's Compass":'compass', 'Wax Seal of Intent':'scroll',
  'Cloak of Momentum':'scroll', 'Whetstone of Focus':'rune', 'Ink of Resolve':'chalice',
  'Cloak of Iteration':'rune', 'Dragon Scale Armor':'idol', 'Eye of the Strategist':'eye',
  "Void Walker's Boots":'chain', "Warscythe's Gauntlet":'gauntlet', 'The Finisher':'blade',
  'Throne Fragment':'idol', 'Shard of Reality':'mirror', 'Cosmic Reaper':'skull',
  'Sovereign Core':'orb', 'Omega Catalyst':'hourglass', 'Grip of the Void':'gauntlet',
  'Lantern of the Lost':'lantern',
};
export function describeReward(data = {}) {
  const name = data.reward?.artifact?.name || 'Recovered artifact';
  const rarity = RARITIES.includes(data.reward?.rarity?.toLowerCase()) ? data.reward.rarity.toLowerCase() : 'common';
  const type = LEGACY_ART[name] || name.split(' ')[0].toLowerCase().replace(/[^a-z]/g,'');
  const seed = String(data.eventId || data.taskTitle || name);
  const hash = [...seed].reduce((total,char)=>(total*31+char.charCodeAt(0))>>>0,0);
  const scene = data.preview && SCENES[data.scene] ? data.scene : ['cave','castle','dispatch'][hash%3];
  return {
    name, rarity, scene, image:`/artifacts/artifact-${type}.webp`,
    xp:Number.isFinite(data.totalPts) ? data.totalPts : null,
    coins:Number.isFinite(data.coinsAwarded) ? data.coinsAwarded : null,
    major:data.preview ? data.previewFull !== false : !!(data.isFirstReward || data.isBoss || (['epic','mythic'].includes(rarity) && data.isNewVariant !== false)),
  };
}

// Presentation-only FIFO. Completion owns awards; this queue never alters them.
export function createRewardQueue(first) {
  let items = [];
  const ids = new Set(), objects = new WeakSet(), listeners = new Set();
  const emit = () => listeners.forEach(listener=>listener());
  const accept = reward => {
    if (!reward || typeof reward !== 'object') return false;
    if (reward.eventId ? ids.has(reward.eventId) : objects.has(reward)) return false;
    if (reward.eventId) ids.add(reward.eventId);
    objects.add(reward); items = [...items,reward]; emit(); return true;
  };
  accept(first);
  return {
    accept,
    subscribe:listener=>{listeners.add(listener);return()=>listeners.delete(listener);},
    getSnapshot:()=>items,
    finish:reward=>{if(items[0]!==reward)return false;items=items.slice(1);emit();return true;},
  };
}
