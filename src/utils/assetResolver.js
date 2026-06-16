const SUPABASE_CDN_BASE = 'https://yrxchjontmgkjaazrybh.supabase.co/storage/v1/object/public/cosmetics/public';

export const BUNDLE_CONFIG = {
  2: {
    name: 'Caldera Core',
    size: '8.4 MB',
    files: [
      'crests/region-crest-2.png',
      'maps/campaign-map-2.png',
      'trophies/trophy-dragon-lava.png'
    ]
  },
  3: {
    name: 'Frostborn Reach',
    size: '14.2 MB',
    files: [
      'crests/region-crest-3.png',
      'maps/campaign-map-3.png',
      'fairies/empress-3-caged.png',
      'fairies/empress-3-liberated.png',
      'dragons/dragon-frost.png',
      'trophies/trophy-dragon-frost.png'
    ]
  },
  4: {
    name: 'Shadowfen Spires',
    size: '14.0 MB',
    files: [
      'crests/region-crest-4.png',
      'maps/campaign-map-4.png',
      'fairies/empress-4-caged.png',
      'fairies/empress-4-liberated.png',
      'dragons/dragon-shadow.png',
      'trophies/trophy-dragon-shadow.png'
    ]
  },
  5: {
    name: 'Caldera Heights',
    size: '14.5 MB',
    files: [
      'crests/region-crest-5.png',
      'maps/campaign-map-5.png',
      'fairies/empress-5-caged.png',
      'fairies/empress-5-liberated.png',
      'dragons/dragon-wyvern.png',
      'trophies/trophy-dragon-wyvern.png'
    ]
  },
  6: {
    name: 'Cloudspire Dominions',
    size: '14.1 MB',
    files: [
      'crests/region-crest-6.png',
      'maps/campaign-map-6.png',
      'fairies/empress-6-caged.png',
      'fairies/empress-6-liberated.png',
      'dragons/dragon-celestial.png',
      'trophies/trophy-dragon-celestial.png'
    ]
  },
  7: {
    name: 'Spectral Caverns',
    size: '14.8 MB',
    files: [
      'crests/region-crest-7.png',
      'maps/campaign-map-7.png',
      'fairies/empress-7-caged.png',
      'fairies/empress-7-liberated.png',
      'dragons/dragon-skeletal.png',
      'trophies/trophy-dragon-skeletal.png'
    ]
  },
  8: {
    name: 'Mirewood Wilderness',
    size: '14.3 MB',
    files: [
      'crests/region-crest-8.png',
      'maps/campaign-map-8.png',
      'fairies/empress-8-caged.png',
      'fairies/empress-8-liberated.png',
      'dragons/dragon-storm.png',
      'trophies/trophy-dragon-storm.png'
    ]
  },
  9: {
    name: 'Void Reach',
    size: '13.9 MB',
    files: [
      'crests/region-crest-9.png',
      'maps/campaign-map-9.png',
      'fairies/empress-9-caged.png',
      'fairies/empress-9-liberated.png',
      'dragons/dragon-abyssal.png',
      'trophies/trophy-dragon-abyssal.png'
    ]
  },
  10: {
    name: 'Citadel of Olympus',
    size: '14.7 MB',
    files: [
      'crests/region-crest-10.png',
      'maps/campaign-map-10.png',
      'fairies/empress-10-caged.png',
      'fairies/empress-10-liberated.png',
      'dragons/dragon-ancient.png',
      'trophies/trophy-dragon-ancient.png'
    ]
  }
};

export const getAssetUrl = (localPath) => {
  if (!localPath) return '';

  const isBundled = (path) => {
    // 1. Region 1 & 2 assets are bundled (except Region 2 map & trophies)
    // Actually, user says: "we will give them the deities, the scythes, the first region setup, all artifacts, and flash screen for 1st and 2nd region. 1st region would have all that, 2nd region would have their dragon and fairy as its in the flash screen but the map would be downloaded afterwards and the trophies too."
    // So Region 2 map, crest, and trophies are NOT bundled.
    
    // Day-1 local files in public folder:
    if (path.includes('region-crest-1.png')) return true;
    if (path.includes('maps/campaign-map-1.png')) return true;
    
    // Region 1 & 2 Fairy assets (empress 1 and 2) are bundled
    if (path.includes('fairies/empress-1-') || path.includes('fairies/empress-2-')) return true;
    
    // Region 1 & 2 dragon assets (wyrm & lava) are bundled
    if (path.includes('dragons/dragon-wyrm.png') || path.includes('dragons/dragon-lava.png')) return true;
    
    // Region 1 trophies are bundled (wyrm)
    if (path.includes('trophies/trophy-dragon-wyrm.png')) return true;

    // Region 2 crest, map, and trophies are NOT bundled
    if (path.includes('region-crest-2.png') || path.includes('maps/campaign-map-2.png') || path.includes('trophies/trophy-dragon-lava.png')) return false;

    // Day-1 fitness (Hermes) and all deities avatars/statues are bundled (since user said: "we will give them the deities, the scythes... all artifacts")
    if (path.includes('deity/') || path.includes('ultimate/') || path.includes('scythe/')) {
      return true;
    }

    // Themes (Kailash Ascension / Lava) are on CDN
    if (path.includes('themes/shiva.png') || path.includes('themes/lava.png')) return false;

    // Critical UI icons
    if (path.includes('command-core.png') || path.includes('guardian-observer.png') || path.includes('favicon.svg') || path.includes('icons.svg') || path.includes('manifest.webmanifest')) return true;

    // Default folders, if it's region 1 crest or region 1 campaign map
    if (path.includes('campaign-map-1.png') || path.includes('region-crest-1.png')) return true;

    // Otherwise, anything post-Region 1/2 is not bundled
    return false;
  };

  if (isBundled(localPath)) {
    return localPath;
  }

  const cleanPath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
  return `${SUPABASE_CDN_BASE}/${cleanPath}`;
};
