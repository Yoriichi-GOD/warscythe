const SUPABASE_CDN_BASE = 'https://yrxchjontmgkjaazrybh.supabase.co/storage/v1/object/public/cosmetics/public';

export const BUNDLE_CONFIG = {
  regions: {
    name: 'Regions',
    items: {
      2: { name: 'Ashwood Frontier', size: '4.5 MB', files: ['maps/campaign-map-2.png', 'trophies/trophy-dragon-lava.png'] },
      3: { name: 'The Crucible', size: '14.2 MB', files: ['crests/region-crest-3.png', 'maps/campaign-map-3.png', 'fairies/empress-3-caged.png', 'fairies/empress-3-liberated.png', 'dragons/dragon-frost.png', 'trophies/trophy-dragon-frost.png'] },
      4: { name: 'Ironveil Fortress', size: '14.0 MB', files: ['crests/region-crest-4.png', 'maps/campaign-map-4.png', 'fairies/empress-4-caged.png', 'fairies/empress-4-liberated.png', 'dragons/dragon-shadow.png', 'trophies/trophy-dragon-shadow.png'] },
      5: { name: 'The Obsidian March', size: '14.5 MB', files: ['crests/region-crest-5.png', 'maps/campaign-map-5.png', 'fairies/empress-5-caged.png', 'fairies/empress-5-liberated.png', 'dragons/dragon-wyvern.png', 'trophies/trophy-dragon-wyvern.png'] },
      6: { name: 'Dreadspire Academy', size: '14.1 MB', files: ['crests/region-crest-6.png', 'maps/campaign-map-6.png', 'fairies/empress-6-caged.png', 'fairies/empress-6-liberated.png', 'dragons/dragon-celestial.png', 'trophies/trophy-dragon-celestial.png'] },
      7: { name: 'The Forge Eternal', size: '14.8 MB', files: ['crests/region-crest-7.png', 'maps/campaign-map-7.png', 'fairies/empress-7-caged.png', 'fairies/empress-7-liberated.png', 'dragons/dragon-skeletal.png', 'trophies/trophy-dragon-skeletal.png'] },
      8: { name: 'Shadowmere Depths', size: '14.3 MB', files: ['crests/region-crest-8.png', 'maps/campaign-map-8.png', 'fairies/empress-8-caged.png', 'fairies/empress-8-liberated.png', 'dragons/dragon-storm.png', 'trophies/trophy-dragon-storm.png'] },
      9: { name: 'Crimson Summit', size: '13.9 MB', files: ['crests/region-crest-9.png', 'maps/campaign-map-9.png', 'fairies/empress-9-caged.png', 'fairies/empress-9-liberated.png', 'dragons/dragon-abyssal.png', 'trophies/trophy-dragon-abyssal.png'] },
      10: { name: 'The War Council', size: '14.7 MB', files: ['crests/region-crest-10.png', 'maps/campaign-map-10.png', 'fairies/empress-10-caged.png', 'fairies/empress-10-liberated.png', 'dragons/dragon-ancient.png', 'trophies/trophy-dragon-ancient.png'] }
    }
  },
  premium_scythes: {
    name: 'Premium Scythe Skins',
    items: {
      cosmic_harvester: { name: 'Cosmic Harvester', size: '15.6 MB', files: ['scythe/premium/cosmic_harvester/cosmic_harvester_dormant.png', 'scythe/premium/cosmic_harvester/cosmic_harvester_neophyte.png', 'scythe/premium/cosmic_harvester/cosmic_harvester_acolyte.png', 'scythe/premium/cosmic_harvester/cosmic_harvester_reaper.png', 'scythe/premium/cosmic_harvester/cosmic_harvester_executioner.png', 'scythe/premium/cosmic_harvester/cosmic_harvester_sovereign.png', 'scythe/premium/cosmic_harvester/cosmic_harvester_void-walker.png', 'scythe/premium/cosmic_harvester/cosmic_harvester_eternal.png', 'scythe/premium/cosmic_harvester/cosmic_harvester_ascended.png', 'scythe/premium/cosmic_harvester/cosmic_harvester_platinum.png'] },
      hellfire_reaper: { name: 'Hellfire Reaper', size: '15.1 MB', files: ['scythe/premium/hellfire_reaper/hellfire_reaper_dormant.png', 'scythe/premium/hellfire_reaper/hellfire_reaper_neophyte.png', 'scythe/premium/hellfire_reaper/hellfire_reaper_acolyte.png', 'scythe/premium/hellfire_reaper/hellfire_reaper_reaper.png', 'scythe/premium/hellfire_reaper/hellfire_reaper_executioner.png', 'scythe/premium/hellfire_reaper/hellfire_reaper_sovereign.png', 'scythe/premium/hellfire_reaper/hellfire_reaper_void-walker.png', 'scythe/premium/hellfire_reaper/hellfire_reaper_eternal.png', 'scythe/premium/hellfire_reaper/hellfire_reaper_ascended.png', 'scythe/premium/hellfire_reaper/hellfire_reaper_platinum.png'] },
      soul_eater_prime: { name: 'Soul-Eater Prime', size: '16.5 MB', files: ['scythe/premium/soul_eater_prime/soul_eater_prime_dormant.png', 'scythe/premium/soul_eater_prime/soul_eater_prime_neophyte.png', 'scythe/premium/soul_eater_prime/soul_eater_prime_acolyte.png', 'scythe/premium/soul_eater_prime/soul_eater_prime_reaper.png', 'scythe/premium/soul_eater_prime/soul_eater_prime_executioner.png', 'scythe/premium/soul_eater_prime/soul_eater_prime_sovereign.png', 'scythe/premium/soul_eater_prime/soul_eater_prime_void-walker.png', 'scythe/premium/soul_eater_prime/soul_eater_prime_eternal.png', 'scythe/premium/soul_eater_prime/soul_eater_prime_ascended.png', 'scythe/premium/soul_eater_prime/soul_eater_prime_platinum.png'] },
      abyssal_leviathan: { name: 'Abyssal Leviathan', size: '15.5 MB', files: ['scythe/premium/abyssal_leviathan/abyssal_leviathan_dormant.png', 'scythe/premium/abyssal_leviathan/abyssal_leviathan_neophyte.png', 'scythe/premium/abyssal_leviathan/abyssal_leviathan_acolyte.png', 'scythe/premium/abyssal_leviathan/abyssal_leviathan_reaper.png', 'scythe/premium/abyssal_leviathan/abyssal_leviathan_executioner.png', 'scythe/premium/abyssal_leviathan/abyssal_leviathan_sovereign.png', 'scythe/premium/abyssal_leviathan/abyssal_leviathan_void-walker.png', 'scythe/premium/abyssal_leviathan/abyssal_leviathan_eternal.png', 'scythe/premium/abyssal_leviathan/abyssal_leviathan_ascended.png', 'scythe/premium/abyssal_leviathan/abyssal_leviathan_platinum.png'] },
      ares_devastator: { name: "Ares' Devastator", size: '15.6 MB', files: ['scythe/premium/ares_devastator/ares_devastator_dormant.png', 'scythe/premium/ares_devastator/ares_devastator_neophyte.png', 'scythe/premium/ares_devastator/ares_devastator_acolyte.png', 'scythe/premium/ares_devastator/ares_devastator_reaper.png', 'scythe/premium/ares_devastator/ares_devastator_executioner.png', 'scythe/premium/ares_devastator/ares_devastator_sovereign.png', 'scythe/premium/ares_devastator/ares_devastator_void-walker.png', 'scythe/premium/ares_devastator/ares_devastator_eternal.png', 'scythe/premium/ares_devastator/ares_devastator_ascended.png', 'scythe/premium/ares_devastator/ares_devastator_platinum.png'] }
    }
  },
  coin_scythes: {
    name: 'Coin Scythe Skins',
    items: {
      shadow_blade: { name: 'Shadow Blade', size: '3.0 MB', files: ['scythe/coin/shadow_blade/shadow_blade_dormant.png', 'scythe/coin/shadow_blade/shadow_blade_neophyte.png', 'scythe/coin/shadow_blade/shadow_blade_acolyte.png', 'scythe/coin/shadow_blade/shadow_blade_reaper.png', 'scythe/coin/shadow_blade/shadow_blade_executioner.png', 'scythe/coin/shadow_blade/shadow_blade_sovereign.png', 'scythe/coin/shadow_blade/shadow_blade_void-walker.png', 'scythe/coin/shadow_blade/shadow_blade_eternal.png', 'scythe/coin/shadow_blade/shadow_blade_ascended.png', 'scythe/coin/shadow_blade/shadow_blade_platinum.png'] },
      golden_harvester: { name: 'Golden Harvester', size: '3.0 MB', files: ['scythe/coin/golden_harvester/golden_harvester_dormant.png', 'scythe/coin/golden_harvester/golden_harvester_neophyte.png', 'scythe/coin/golden_harvester/golden_harvester_acolyte.png', 'scythe/coin/golden_harvester/golden_harvester_reaper.png', 'scythe/coin/golden_harvester/golden_harvester_executioner.png', 'scythe/coin/golden_harvester/golden_harvester_sovereign.png', 'scythe/coin/golden_harvester/golden_harvester_void-walker.png', 'scythe/coin/golden_harvester/golden_harvester_eternal.png', 'scythe/coin/golden_harvester/golden_harvester_ascended.png', 'scythe/coin/golden_harvester/golden_harvester_platinum.png'] },
      cinder_reaper: { name: 'Cinder Reaper', size: '3.0 MB', files: ['scythe/coin/cinder_reaper/cinder_reaper_dormant.png', 'scythe/coin/cinder_reaper/cinder_reaper_neophyte.png', 'scythe/coin/cinder_reaper/cinder_reaper_acolyte.png', 'scythe/coin/cinder_reaper/cinder_reaper_reaper.png', 'scythe/coin/cinder_reaper/cinder_reaper_executioner.png', 'scythe/coin/cinder_reaper/cinder_reaper_sovereign.png', 'scythe/coin/cinder_reaper/cinder_reaper_void-walker.png', 'scythe/coin/cinder_reaper/cinder_reaper_eternal.png', 'scythe/coin/cinder_reaper/cinder_reaper_ascended.png', 'scythe/coin/cinder_reaper/cinder_reaper_platinum.png'] },
      frost_cleaver: { name: 'Frost Cleaver', size: '3.0 MB', files: ['scythe/coin/frost_cleaver/frost_cleaver_dormant.png', 'scythe/coin/frost_cleaver/frost_cleaver_neophyte.png', 'scythe/coin/frost_cleaver/frost_cleaver_acolyte.png', 'scythe/coin/frost_cleaver/frost_cleaver_reaper.png', 'scythe/coin/frost_cleaver/frost_cleaver_executioner.png', 'scythe/coin/frost_cleaver/frost_cleaver_sovereign.png', 'scythe/coin/frost_cleaver/frost_cleaver_void-walker.png', 'scythe/coin/frost_cleaver/frost_cleaver_eternal.png', 'scythe/coin/frost_cleaver/frost_cleaver_ascended.png', 'scythe/coin/frost_cleaver/frost_cleaver_platinum.png'] },
      storm_caller: { name: 'Storm Caller', size: '2.8 MB', files: ['scythe/coin/storm_caller/storm_caller_dormant.png', 'scythe/coin/storm_caller/storm_caller_neophyte.png', 'scythe/coin/storm_caller/storm_caller_acolyte.png', 'scythe/coin/storm_caller/storm_caller_reaper.png', 'scythe/coin/storm_caller/storm_caller_executioner.png', 'scythe/coin/storm_caller/storm_caller_sovereign.png', 'scythe/coin/storm_caller/storm_caller_void-walker.png', 'scythe/coin/storm_caller/storm_caller_eternal.png', 'scythe/coin/storm_caller/storm_caller_ascended.png', 'scythe/coin/storm_caller/storm_caller_platinum.png'] }
    }
  },
  themes: {
    name: 'Visual Environment Themes',
    items: {
      shiva: { name: 'Kailash Ascension', size: '4.2 MB', files: ['themes/kailash/scythe-dormant.png', 'themes/kailash/scythe-neophyte.png', 'themes/kailash/scythe-acolyte.png', 'themes/kailash/scythe-reaper.png', 'themes/kailash/scythe-executioner.png', 'themes/kailash/scythe-sovereign.png', 'themes/kailash/scythe-void-walker.png', 'themes/kailash/scythe-eternal.png', 'themes/kailash/scythe-death-lord.png'] },
      lava: { name: 'Lava Citadel', size: '4.2 MB', files: ['themes/lava/scythe-dormant.png', 'themes/lava/scythe-neophyte.png', 'themes/lava/scythe-acolyte.png', 'themes/lava/scythe-reaper.png', 'themes/lava/scythe-executioner.png', 'themes/lava/scythe-sovereign.png', 'themes/lava/scythe-void-walker.png', 'themes/lava/scythe-eternal.png', 'themes/lava/scythe-death-lord.png'] }
    }
  },
  legion: {
    name: 'Legion Assets',
    items: {
      legion_core: { name: 'Legion Base Assets', size: '15.6 MB', files: ['legion/avatar-frame-legion.png', 'legion/legion-battle-map.png', 'legion/legion-crest.png', 'legion/legion-boss.png'] }
    }
  },
  deities: {
    name: 'Fitness Deities',
    items: {
      deities_all: { name: 'Ascension Deities & Avatars', size: '6.4 MB', files: ['deity/avatar/shiva.png', 'deity/avatar/hermes.png', 'deity/avatar/thor.png', 'deity/avatar/ares.png', 'deity/avatar/anubis.png', 'deity/avatar/zeus.png', 'deity/hermes.png', 'deity/shiva.png', 'deity/thor.png', 'deity/ares.png', 'deity/anubis.png', 'deity/zeus.png'] }
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
      path.includes('favicon.svg') || 
      path.includes('icons.svg') || 
      path.includes('manifest.webmanifest') || 
      path.includes('ritual-platform.png') || 
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

  // 5. Fitness deities are bundled
  if (path.includes('deity/')) return true;

  // 6. Keys and crests are bundled
  if (path.includes('keys/')) return true;
  if (path.includes('crests/region-crest-1.png') || path.includes('crests/region-crest-2.png')) return true;

  // 7. Scythes: Regular scythes (Dormant, Neophyte, etc.) are bundled.
  // Premium and Coin scythes are on CDN.
  if (path.includes('scythe/premium/') || path.includes('scythe/coin/')) return false;
  if (path.includes('scythe/')) return true;

  // 8. Themes and Legion are always remote (CDN)
  if (path.includes('themes/') || path.includes('legion/')) return false;

  // 9. Regions 1 & 2 assets
  // Region 1 & 2 Fairy assets are bundled
  if (path.includes('fairies/empress-1-') || path.includes('fairies/empress-2-')) return true;
  // Region 1 & 2 dragon assets are bundled
  if (path.includes('dragons/dragon-wyrm.png') || path.includes('dragons/dragon-lava.png')) return true;
  // Region 1 trophies are bundled (wyrm)
  if (path.includes('trophies/trophy-dragon-wyrm.png')) return true;
  // Region 1 campaign map is bundled
  if (path.includes('maps/campaign-map-1.png')) return true;
  if (path.includes('bg-region-1.png') || path.includes('bg/bg-region-1.png')) return true;

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
