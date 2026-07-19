const ARTIFACT_LORE = {
  skull: {
    hook: 'Your hands are calloused. The friction is your language.',
    lore: 'The skull of the first enemy you defeated is not a trophy of war, but a trophy of beginning. Most people never start. You started, fought through the friction, and left proof that you are the type who begins.',
  },
  crown: {
    hook: 'You stopped doing everything. You conquered what mattered.',
    lore: 'The crown belonged to a king who understood that sovereignty is selection. You cannot rule everything. You rule what you choose, refusing ninety-nine distractions so one worthy objective receives your full force.',
  },
  orb: {
    hook: 'You held pressure and turned it into clarity.',
    lore: 'This orb captured the instant a deadline stopped feeling like panic and became precision. Where others crumble, your processor accelerates. Pressure did not rescue you by luck. You learned to wield it.',
  },
  blade: {
    hook: 'Criticism used to break you. Now it sharpens you.',
    lore: 'Every rejection, failed attempt, and rewrite became another hammer strike against this edge. The blade was not born from perfection. It was tempered by surviving imperfection and returning sharper.',
  },
  tome: {
    hook: 'You read until you understood. That is the only rule.',
    lore: 'This forbidden tome has no prescribed path. Its knowledge waits in associations, rabbit holes, and unexpected connections. What others call disorder, you have turned into synthesis.',
  },
  rune: {
    hook: 'You cracked the code. Every pattern is now visible.',
    lore: 'The rune resembles chaos until its language is understood. Your mind processes noise as data and finds the signal others miss. Once the pattern reveals itself, it can never hide from you again.',
  },
  ring: {
    hook: 'Each yes killed a hundred distractions.',
    lore: 'This ring binds through intention rather than restriction. You refused infinite alternatives and committed to one target. That selectivity is not confinement. It is directed power.',
  },
  scroll: {
    hook: 'You captured the moment before it became memory.',
    lore: 'The scroll preserves thought while it is still alive, before polish makes it safer and less honest. You turned motion into permanence and refused to let a living idea disappear.',
  },
  idol: {
    hook: 'You became the version you prayed to be.',
    lore: 'Action became identity. You did not wait to feel transformed. You repeated the work until hope became unnecessary and the promised future began looking back at you like a mirror.',
  },
  gem: {
    hook: 'Under pressure, you become luminous.',
    lore: 'Buried pressure transformed ordinary matter into something that catches and amplifies light. The same force that might have shattered you clarified your edge. This gem records what pressure built.',
  },
  amulet: {
    hook: 'Your chaos is not a curse. It is your spell.',
    lore: 'The amulet was made from creatures that flourished in disorder. Rapid thoughts, pivots, and parallel patterns became an architecture capable of holding more variables than others can see.',
  },
  chalice: {
    hook: 'You drank the poison and did not die.',
    lore: 'Criticism, rejection, doubt, and failure once filled this vessel. You consumed them, survived them, and metabolized their bitterness into movement. The empty chalice is evidence of earned immunity.',
  },
  gauntlet: {
    hook: 'Your grip is practice hardened. Friction is your teacher.',
    lore: 'The iron has been worn smooth by use rather than time. Repetition carved reliable pathways through resistance until your hands became instruments and execution became memory.',
  },
  helm: {
    hook: 'You protected your focus. Everything else became noise.',
    lore: 'This helm does not silence the world. It lets you choose what enters. Selective attention became architecture, allowing what matters to consume you while everything else falls away.',
  },
  shield: {
    hook: 'You blocked the blow that would have stopped someone else.',
    lore: 'The shield is cracked because it has been tested. Resilience was never invulnerability. It was the decision to remain standing, still defending what mattered, after impact.',
  },
  horn: {
    hook: 'You extracted the weapon from the thing that tried to destroy you.',
    lore: 'Torn from the dragon in battle, the horn represents inversion. Racing thought became processing power. Impulse became decisive movement. Hyperfocus became an unfair advantage.',
  },
  eye: {
    hook: 'You saw what was invisible to everyone else.',
    lore: 'This eye perceives a spectrum hidden from ordinary sight. Different processing revealed patterns, contexts, and relationships that seemed impossible until your vision made them undeniable.',
  },
  chain: {
    hook: 'You broke the shackles and forged them into armor.',
    lore: 'The chains once restrained you. Instead of discarding them, you integrated their iron into your structure. What was designed to contain you now reinforces the shape you chose.',
  },
  staff: {
    hook: 'You cast spells with your discipline. Miracles followed.',
    lore: 'The staff grants no magic. It amplifies will accumulated through repeated action. Others may call the result talent, but its light remembers every ordinary day that compounded into wonder.',
  },
  map: {
    hook: 'You charted the territory while others stood still.',
    lore: 'This map was drawn by movement rather than certainty. You entered the unknown, collected truth while advancing, and corrected your path without surrendering momentum.',
  },
  compass: {
    hook: 'When everything is noise, you found North.',
    lore: "The obsidian needle points toward your values rather than the world's expectations. When advice conflicts and standards become noise, it returns you to the direction that is genuinely yours.",
  },
  coin: {
    hook: 'You earned currency in a system that does not recognize it.',
    lore: 'This civilization paid in velocity, recovery, and the ability to move under pressure. Your rhythm was never meant to resemble somebody else’s pace. The coin recognizes the value of yours.',
  },
  hourglass: {
    hook: 'Time does not control you. You negotiate with it.',
    lore: "The sand froze when you learned that activation, not the clock, was the true variable. You stopped imitating another mind's schedule and learned to summon your own decisive window.",
  },
  mirror: {
    hook: 'You saw yourself honestly. That changed everything.',
    lore: 'The shattered reflection once looked like failure. Examined without shame, every fragment revealed a parallel process in your actual architecture. Honesty turned contradiction into understanding.',
  },
  lantern: {
    hook: 'You carried light into darkness. For yourself first.',
    lore: 'The flame came from your own insistence, not permission or borrowed belief. It illuminates your path rather than the approved path. You generate enough light to take the next step.',
  },
};

const LEGACY_TYPE_BY_NAME = {
  'iron quill': 'tome',
  "scout's compass": 'compass',
  'wax seal of intent': 'scroll',
  'cloak of momentum': 'scroll',
  'whetstone of focus': 'rune',
  'ink of resolve': 'chalice',
  'cloak of iteration': 'rune',
  'dragon scale armor': 'idol',
  'void walker boots': 'chain',
  "void walker's boots": 'chain',
  'warscythe gauntlet': 'gauntlet',
  'the finisher': 'blade',
  'throne fragment': 'idol',
  'shard of reality': 'mirror',
  'cosmic reaper': 'skull',
  'sovereign core': 'orb',
  'omega catalyst': 'hourglass',
  'grip of the void': 'gauntlet',
};

export const getArtifactLore = artifactName => {
  const normalized = String(artifactName || '').toLowerCase();
  const type = LEGACY_TYPE_BY_NAME[normalized]
    || Object.keys(ARTIFACT_LORE).find(key => normalized.includes(key));
  return type ? ARTIFACT_LORE[type] : null;
};

export const applyArtifactLore = artifact => {
  const exclusive = getArtifactLore(artifact?.name);
  return exclusive ? { ...artifact, ...exclusive } : artifact;
};
