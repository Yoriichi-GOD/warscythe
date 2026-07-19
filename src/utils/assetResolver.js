const SUPABASE_CDN_BASE = 'https://yrxchjontmgkjaazrybh.supabase.co/storage/v1/object/public/cosmetics/public';
const EVOLUTION_STAGES = ['dormant', 'awakened', 'hardened', 'refined', 'ascended', 'platinum'];
const scytheFiles = (kind, id) => EVOLUTION_STAGES.map((stage) => `scythe/${kind}/${id}/${id}_${stage}.png`);
const themeFiles = (id) => [
  `themes/${id}/bg.png`,
  `themes/${id}/ritual-platform.png`,
  ...EVOLUTION_STAGES.map((stage) => `themes/${id}/scythe-${stage}.png`),
  `soundscapes/theme-${id === 'kailash' ? 'shiva' : id}.mp3.mp3`,
];

export const BUNDLE_CONFIG = {
  regions: {
    name: 'Regions',
    items: {
      2: { name: 'Ashwood Frontier', size: '14.0 MB', files: ['crests/region-crest-2.png', 'maps/campaign-map-2.png', 'fairies/empress-2-caged.png', 'fairies/empress-2-liberated.png', 'dragons/dragon-lava.png', 'trophies/trophy-dragon-lava.png', 'soundscapes/region-2-ashenveil.mp3.mp3'] },
      3: { name: 'The Crucible', size: '14.2 MB', files: ['crests/region-crest-3.png', 'maps/campaign-map-3.png', 'fairies/empress-3-caged.png', 'fairies/empress-3-liberated.png', 'dragons/dragon-frost.png', 'trophies/trophy-dragon-frost.png', 'soundscapes/region-3-frostmere.mp3.mp3'] },
      4: { name: 'Ironveil Fortress', size: '14.0 MB', files: ['crests/region-crest-4.png', 'maps/campaign-map-4.png', 'fairies/empress-4-caged.png', 'fairies/empress-4-liberated.png', 'dragons/dragon-shadow.png', 'trophies/trophy-dragon-shadow.png', 'soundscapes/region-4-shadowfen.mp3.mp3'] },
      5: { name: 'The Obsidian March', size: '14.5 MB', files: ['crests/region-crest-5.png', 'maps/campaign-map-5.png', 'fairies/empress-5-caged.png', 'fairies/empress-5-liberated.png', 'dragons/dragon-wyvern.png', 'trophies/trophy-dragon-wyvern.png', 'soundscapes/region-5-oasis.mp3.mp3'] },
      6: { name: 'Dreadspire Academy', size: '14.1 MB', files: ['crests/region-crest-6.png', 'maps/campaign-map-6.png', 'fairies/empress-6-caged.png', 'fairies/empress-6-liberated.png', 'dragons/dragon-celestial.png', 'trophies/trophy-dragon-celestial.png', 'soundscapes/region-6-aureliuskeep.mp3.mp3'] },
      7: { name: 'The Forge Eternal', size: '14.8 MB', files: ['crests/region-crest-7.png', 'maps/campaign-map-7.png', 'fairies/empress-7-caged.png', 'fairies/empress-7-liberated.png', 'dragons/dragon-skeletal.png', 'trophies/trophy-dragon-skeletal.png', 'soundscapes/region-7-bonehollow.mp3.mp3'] },
      8: { name: 'Shadowmere Depths', size: '14.3 MB', files: ['crests/region-crest-8.png', 'maps/campaign-map-8.png', 'fairies/empress-8-caged.png', 'fairies/empress-8-liberated.png', 'dragons/dragon-storm.png', 'trophies/trophy-dragon-storm.png', 'soundscapes/region-8-stormspire.mp3.mp3'] },
      9: { name: 'Crimson Summit', size: '13.9 MB', files: ['crests/region-crest-9.png', 'maps/campaign-map-9.png', 'fairies/empress-9-caged.png', 'fairies/empress-9-liberated.png', 'dragons/dragon-abyssal.png', 'trophies/trophy-dragon-abyssal.png', 'soundscapes/region-9-abyss.mp3.mp3'] },
      10: { name: 'The War Council', size: '14.7 MB', files: ['crests/region-crest-10.png', 'maps/campaign-map-10.png', 'fairies/empress-10-caged.png', 'fairies/empress-10-liberated.png', 'dragons/dragon-ancient.png', 'trophies/trophy-dragon-ancient.png', 'soundscapes/region-10-titansrest.mp3.mp3'] }
    }
  },
  premium_scythes: {
    name: 'Premium Scythe Skins',
    items: {
      cosmic_harvester: { name: 'Cosmic Harvester', size: '15.6 MB', files: scytheFiles('premium', 'cosmic_harvester') },
      hellfire_reaper: { name: 'Hellfire Reaper', size: '15.1 MB', files: scytheFiles('premium', 'hellfire_reaper') },
      soul_eater_prime: { name: 'Soul-Eater Prime', size: '16.5 MB', files: scytheFiles('premium', 'soul_eater_prime') },
      abyssal_leviathan: { name: 'Abyssal Leviathan', size: '15.5 MB', files: scytheFiles('premium', 'abyssal_leviathan') },
      ares_devastator: { name: "Ares' Devastator", size: '15.6 MB', files: scytheFiles('premium', 'ares_devastator') }
    }
  },
  coin_scythes: {
    name: 'Coin Scythe Skins',
    items: {
      shadow_blade: { name: 'Shadow Blade', size: '3.0 MB', files: scytheFiles('coin', 'shadow_blade') },
      // The remaining coin weapons stay out of the downloadable catalog until
      // their source artwork is present in Storage.
    }
  },
  themes: {
    name: 'Visual Environment Themes',
    items: {
      shiva: { name: 'Kailash Ascension', size: '4.2 MB', files: themeFiles('kailash') },
      lava: { name: 'Lava Citadel', size: '4.2 MB', files: themeFiles('lava') }
    }
  },
  legion: {
    name: 'Legion Assets',
    // Restored when the Legion source pack is uploaded to Storage.
    items: {}
  },
  deities: {
    name: 'Fitness Deities',
    items: {
      deity_hermes: { name: 'Hermes', size: '3.2 MB', files: ['deity/hermes.png', 'deity/avatar/hermes.png'] },
      deity_apollo: { name: 'Apollo', size: '3.3 MB', files: ['deity/apollo.png', 'deity/avatar/apollo.png'] },
      deity_ares: { name: 'Ares', size: '3.8 MB', files: ['deity/ares.png', 'deity/avatar/ares.png'] },
      deity_hercules: { name: 'Hercules', size: '2.2 MB', files: ['deity/hercules.png', 'deity/avatar/hercules.png'] },
      deity_zeus: { name: 'Zeus', size: '2.3 MB', files: ['deity/zeus.png', 'deity/avatar/zeus.png'] }
    }
  },
  artifacts: {
    name: 'Lore Artifacts',
    items: {
      artifacts_all: { name: 'Wisdom Artifacts', size: '12.8 MB', files: ['artifacts/artifact-mirror.png', 'artifacts/artifact-shield.png', 'artifacts/artifact-crown.png', 'artifacts/artifact-grail.png'] }
    }
  },
  nodes: {
    name: 'Quest Map Nodes',
    items: {
      nodes_all: { name: 'Campaign Map Nodes', size: '1.2 MB', files: ['nodes/active.png', 'nodes/locked.png', 'nodes/completed.png', 'nodes/boss.png'] }
    }
  }
};

export const isBundled = (path) => {
  if (!path) return false;

  // 1. Critical UI assets
  if (path.includes('command-core.png') || 
      path.includes('guardian-observer.png') || 
      path.includes('icon.png') ||
      path.includes('favicon.svg') || 
      path.includes('icons.svg') || 
      path.includes('manifest.webmanifest') || 
      (path.includes('ritual-platform.png') && !path.includes('themes/')) || 
      path.includes('shop-bg.png') ||
      path.includes('bonfire.png') ||
      path.includes('olympus-bg.png') ||
      path.includes('soundscape-jukebox.png') ||
      path.includes('scroll-paper.png') ||
      path.includes('scroll-roller-')
  ) {
    return true;
  }

  // 2. Nodes (Quest map nodes) are bundled
  if (path.includes('nodes/')) return true;

  // 3. Artifacts are bundled
  if (path.includes('artifacts/')) return true;

  // 4. Boss kill assets are bundled
  if (path.includes('boss-kill/')) return true;

  // 5. The oath guide remains bundled. Ascension deities are delivered on demand.
  if (path.includes('deity/fitness-goddess.png')) return true;
  if (path.includes('deity/')) return false;

  // 6. Keys and the first-region crest are bundled
  if (path.includes('keys/')) return true;
  if (path.includes('crests/region-crest-1.png')) return true;

  // 7. Scythes: Regular scythes (Dormant, Neophyte, etc.) are bundled.
  // Premium and Coin scythes are on CDN.
  if (path.includes('scythe/premium/') || path.includes('scythe/coin/')) return false;
  if (path.includes('scythe/')) return true;

  // 8. Themes and Legion are always remote (CDN)
  if (path.includes('themes/') || path.includes('legion/')) return false;

  // 9. Region 1 is the starter realm. Every later region is downloaded on demand.
  if (path.includes('fairies/empress-1-')) return true;
  if (path.includes('dragons/dragon-wyrm.png')) return true;
  // Region 1 trophies are bundled (wyrm)
  if (path.includes('trophies/trophy-dragon-wyrm.png')) return true;
  // Region 1 campaign map is bundled
  if (path.includes('maps/campaign-map-1.png')) return true;
  if (path.includes('bg-region-1.png') || path.includes('bg/bg-region-1.png')) return true;
  
  if (path.includes('soundscapes/region-1-ashwood.mp3.mp3')) return true;

  // Anything else (e.g. higher maps, dragons, fairies, trophies) is remote (CDN)
  return false;
};

export const getAssetUrl = (localPath) => {
  if (!localPath) return '';

  if (isBundled(localPath)) {
    return localPath;
  }

  const cleanPath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
  return `${SUPABASE_CDN_BASE}/${cleanPath}`;
};
