export const FITNESS_REWARD_RULESET = Object.freeze({
  id: 'olympus-preview-v0.1',
  mode: 'preview',
  affinityPerBlessing: 100,
  maximumAffinityPerWorkout: 10,
});

export const DEITY_ROSTER = Object.freeze([
  {
    id: 'hermes',
    name: 'Hermes',
    age: 'The First Motion',
    volumeGate: 5_000,
    palette: '#d8c078',
    ringColor: '#063f2d',
    domain: 'God of Motion. Cunning. Endurance.',
    doctrine: 'Hermes teaches the discipline of beginning again. Move with intent, adapt without hesitation, and let consistency become momentum.',
    blessings: [
      { id: 'winged-sandals', name: 'Winged Sandals', fragmentsRequired: 5 },
      { id: 'caduceus', name: 'Caduceus', fragmentsRequired: 7 },
      { id: 'messengers-cloak', name: "Messenger's Cloak", fragmentsRequired: 10 },
    ],
  },
  {
    id: 'apollo',
    name: 'Apollo',
    age: 'The Disciplined Form',
    volumeGate: 25_000,
    palette: '#f0c96a',
    ringColor: '#e5b83f',
    domain: 'God of Form. Rhythm. Clarity.',
    doctrine: 'Apollo teaches disciplined form. Build strength with proportion, repeat with precision, and make every movement worthy of remembrance.',
    blessings: [
      { id: 'laurel-crown', name: 'Laurel Crown', fragmentsRequired: 8 },
      { id: 'harmonic-lyre', name: 'Harmonic Lyre', fragmentsRequired: 12 },
      { id: 'sun-disc', name: 'Sun Disc', fragmentsRequired: 16 },
    ],
  },
  {
    id: 'ares',
    name: 'Ares',
    age: 'The Will to Confront',
    volumeGate: 75_000,
    palette: '#b9483f',
    ringColor: '#a92f35',
    domain: 'God of War. Blood. Honor.',
    doctrine: 'Ares teaches the path of relentless discipline. Where others hesitate, you endure. Where others break, you conquer. Become the weapon. Become the war.',
    blessings: [
      { id: 'spartan-helm', name: 'Spartan Helm', fragmentsRequired: 12 },
      { id: 'blood-spear', name: 'Blood Spear', fragmentsRequired: 18 },
      { id: 'war-banner', name: 'War Banner', fragmentsRequired: 24 },
    ],
  },
  {
    id: 'hercules',
    name: 'Hercules',
    age: 'The Burden Endured',
    volumeGate: 150_000,
    palette: '#b78a4f',
    ringColor: '#9a6738',
    domain: 'God of Burden. Labor. Endurance.',
    doctrine: 'Hercules teaches strength accumulated beneath impossible weight. Carry the burden, recover with purpose, and return stronger than the trial.',
    blessings: [
      { id: 'nemean-lion-pelt', name: 'Nemean Lion Pelt', fragmentsRequired: 18 },
      { id: 'golden-club', name: 'Golden Club', fragmentsRequired: 26 },
      { id: 'atlas-shard', name: 'Atlas Shard', fragmentsRequired: 36 },
    ],
  },
  {
    id: 'zeus',
    name: 'Zeus',
    age: 'The Sovereignty of the Body',
    volumeGate: 400_000,
    palette: '#b9c8ef',
    ringColor: '#304f8f',
    domain: 'God of Sovereignty. Thunder. Command.',
    doctrine: 'Zeus teaches command over the body already forged. Power without discipline is noise; sovereignty is strength governed with purpose.',
    blessings: [
      { id: 'eagle-crest', name: 'Eagle Crest', fragmentsRequired: 25 },
      { id: 'crown-of-olympus', name: 'Crown of Olympus', fragmentsRequired: 40 },
      { id: 'sovereign-thunderbolt', name: 'Sovereign Thunderbolt', fragmentsRequired: 60 },
    ],
  },
]);

export const TOTAL_FRAGMENT_REQUIREMENT = DEITY_ROSTER.reduce(
  (total, deity) => total + deity.blessings.reduce((sum, blessing) => sum + blessing.fragmentsRequired, 0),
  0,
);

export function getDeityAssets(deityId) {
  const root = '/fitness-v2/olympus';
  return {
    chamberDesktop: `${root}/chambers/olympus-${deityId}-chamber-desktop.webp`,
    chamberMobile: `${root}/chambers/olympus-${deityId}-chamber-mobile.webp`,
    statue: `${root}/statues/olympus-${deityId}-statue.webp`,
    ascension: `${root}/ascensions/ascension-${deityId}.webp`,
  };
}

export function getBlessingAssets(deityId, blessingId) {
  const root = '/fitness-v2/olympus';
  return {
    blessing: `${root}/blessings/blessing-${deityId}-${blessingId}.webp`,
    fragment: `${root}/fragments/fragment-${deityId}-${blessingId}.webp`,
    ceremony: `${root}/ceremonies/ceremony-${deityId}-${blessingId}.webp`,
  };
}
