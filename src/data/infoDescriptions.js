export const infoData = {
  operations: {
    title: "Operations",
    features: [
      {
        id: "operation",
        title: "What is an Operation?",
        philosophy: "An operation is your declaration of war against a specific obstacle. Not a vague goal—a concrete, time-bound commitment. The moment you create it, you've crossed the threshold from thinking to doing.",
        useCase: "You need to finish a project, learn a skill, build something, overcome resistance—anything that takes focus and time. Create an operation, assign it a difficulty level (how hard will this push you?), set a deadline, then execute.",
        keyPoints: [
          "One operation at a time per region? No. You can have up to 5 active simultaneously.",
          "Each operation unlocks artifacts when completed. Artifacts prove you did the work.",
          "Operations live in regions. Completing them advances regional progress toward fairy liberation.",
          "Boss Raids are the hardest operations (14-day minimum). They're the climax of a region's story."
        ],
        whenToUse: [
          "When you have a specific, defined goal",
          "When you're ready to commit (even if you're scared)",
          "When resistance is high (that's the whole point)"
        ]
      },
      {
        id: "threat-levels",
        title: "What are Threat Levels?",
        philosophy: "Threat levels are honest. Don't pretend your task is harder than it is. A low-threat operation should feel achievable. A legendary boss raid should feel like you're walking into actual danger.",
        useCase: "When creating an operation, you choose: Low (1-3 days), Medium (3-7 days), High (7-14 days), Legendary (14+ days, Boss Raid only).\n\nThe app uses your threat level to:\n- Enforce minimum time before completion (no cheating via shortcuts)\n- Determine artifact quality (harder tasks yield rarer artifacts)\n- Track your pattern of challenge-seeking",
        keyPoints: [
          "Low: Something you can finish in a focused day or two. Clearing email, single workout session, small write-up.",
          "Medium: A project that spans a week. A presentation, a feature, a mini-goal.",
          "High: Something that demands sustained focus. A major deliverable, competitive training block, serious creative work.",
          "Legendary: Only for the hardest wars. Launching a project, major exam, transformative commitment. Boss Raids live here."
        ],
        whyItMatters: "The app respects your time. If you say legendary, the app knows you're serious. If you're always legendary, the app will eventually call you out (through lore, through Guardian Angel whispers). You can't lie to the system—it will know."
      },
      {
        id: "region",
        title: "What is a Region?",
        philosophy: "Regions are worlds. Each dragon rules a world. Freeing a fairy means restoring that world to order. You're not just completing tasks—you're on a hero's journey across 40 distinct mythologies.",
        useCase: "Regions unlock sequentially. You unlock a new region only after completing 5 key operations in your current region. Each region has:\n- A unique aesthetic (void purple, lava gold, forest green, etc.)\n- A unique dragon (with its own personality and realm)\n- A unique imprisoned fairy (with her own story)\n- 5 key operations to complete before you can challenge the dragon",
        whyRegionsMatter: [
          "Visual coherence: Every region looks completely different. Your brain remembers them.",
          "Narrative momentum: You're not just checking boxes. You're liberating fairies, one region at a time.",
          "Progression signal: Moving from Region 5 to Region 6 feels like leveling up. It is.",
          "Fairy collection: Each liberated fairy becomes a trophy in your Ledger. Proof of conquest."
        ],
        currentState: "You have access to Region 1 (Ashwood) at launch. Complete 5 operations, unlock Region 2. Keep going."
      },
      {
        id: "boss-raid",
        title: "What is a Boss Raid?",
        philosophy: "Not every operation is a boss raid. Boss raids are the climax. You've prepared, gathered artifacts, built momentum. Now you face the dragon itself—the final obstacle before a fairy is free.",
        useCase: "After completing 4 normal operations in a region, you can initiate a Boss Raid:\n- 14-day minimum (non-negotiable)\n- Deposits 1/5 key per completion (like normal operations)\n- Completes the liberation sequence for that fairy once you gather all 5 keys\n\nA Boss Raid is narrative theater. The game treats it as a war moment. Flash screens celebrate it. Your Guardian Angel acknowledges the weight.",
        whenToUse: [
          "When you're ready for the hardest fight in that region. Not before. Raids are for warriors who've already proven themselves in the lesser battles."
        ]
      }
    ]
  },
  rituals: {
    title: "Rituals",
    features: [
      {
        id: "ritual",
        title: "What is a Ritual?",
        philosophy: "Operations are wars against specific obstacles. Rituals are your daily religion. They're the non-negotiable habits that build you. Miss one ritual, and you break the chain. The chain is the point.",
        useCase: "Rituals are daily or weekly commitments you make to yourself:\n- Morning run\n- Meditation\n- Gym session\n- Writing hour\n- Meal prep\n- Whatever builds you\n\nThe app tracks them with a global streak counter. Break your streak, and it resets to zero. Every day you complete all active rituals, the streak grows.",
        whyStreaksMatter: "Streaks are psychological. They make the invisible visible. That number climbing feels like proof that you're building something. That number resetting hurts—which is the point. You'll work harder to keep it alive.",
        keyDifference: [
          "Operations are discrete projects (they end)",
          "Rituals are continuous (they're forever, until you consciously end them)",
          "Missing one ritual breaks ALL streaks (the system doesn't negotiate)"
        ]
      },
      {
        id: "streak",
        title: "What is the Streak?",
        philosophy: "The streak is your scoreboard against yourself. It's not about perfection—it's about consistency. One day, one completed ritual set, one more link in the chain.",
        useCase: "Every day you complete ALL active rituals, the streak counter increases by 1. If you skip even one ritual:\n- Streak resets to 0\n- All progress resets\n- You start over tomorrow",
        whyThisDesign: "Consistency is the actual superpower. Not intensity, not brilliance—consistency. The streak trains you to show up, even when you don't feel like it, even when it's cold, even when it doesn't matter. That habit is worth more than any single day of high performance.",
        day200Letter: "At 200 days, the app will send you a letter. It's not congratulations. It's a warning. A psychological checkpoint asking: \"Are you doing this for you, or are you addicted to the number?\" The letter gives you permission to break the streak if you need to. The number doesn't matter if you break in the process."
      }
    ]
  },
  scythe: {
    title: "Scythe & Progression",
    features: [
      {
        id: "scythe",
        title: "What is the Scythe?",
        philosophy: "The Scythe is your signature. It evolves with you. As you complete more operations, as your focus sharpens, the Scythe transforms. It's not a game mechanic. It's a visual symbol of your power growing.",
        useCase: "The Scythe has 6 evolution tiers:\n- DORMANT (new player, untested)\n- AWAKENED (first few operations completed)\n- HARDENED (proven yourself)\n- REFINED (consistent warrior)\n- ASCENDED (legendary tier)\n- PLATINUM (ultimate form)\n\nEach tier looks visually different. PLATINUM is beautiful and terrifying. You earn tiers by completing enough operations.",
        cosmetics: "At higher tiers, you unlock cosmetic variants such as COSMIC REAPER, VOID-WALKER, and ETERNAL. These are visual expressions of your scythe, not mechanical upgrades.",
        whyItMatters: "Every time you open the app, you see your scythe. Watching it evolve is watching yourself evolve. It's proof you're not stuck. You're building."
      },
      {
        id: "artifacts",
        title: "What are Artifacts?",
        philosophy: "Artifacts are not loot. They're mementos. Each artifact tells a story about a specific execution truth. When you complete an operation, you receive an artifact that celebrates what you just proved about yourself.",
        useCase: "Every operation completion awards an artifact from a pool of 125 unique pieces. Each has:\n- A visual design (gorgeous, thematic, meaningful)\n- Rarity tier (Common, Uncommon, Rare, Epic, Legendary)\n- Lore (a short, execution-focused philosophy)\n\nExamples:\n- \"CROWN: You stopped doing everything. You conquered what mattered.\"\n- \"BLADE: Criticism used to break you. Now it sharpens you.\"\n- \"LANTERN: You carried light into darkness. For yourself first.\"",
        scratchMechanic: "Artifacts don't drop instantly. You physically scratch an encrypted overlay to reveal them. This micro-pause lets the win register emotionally. The scratch action is the celebration.",
        collecting: "Artifacts live in your Ledger. You're building a museum of proof. Every artifact is a moment you refused to break."
      },
      {
        id: "ledger",
        title: "What is the Ledger?",
        philosophy: "The Ledger is your trophy vault. It's proof. All the dragons you've slain, all the fairies you've freed, all the artifacts you've earned, all the streaks you've built—they live here, permanently.",
        useCase: "The Ledger has three tabs:\n\n**History Logs:**\n- Daily completion log with timestamps\n- Artifacts acquired with lore\n- Streaks maintained/broken\n- Chronological record of your journey\n\n**Relics & Lore:**\n- Fairy fragments (one per liberated fairy, per region)\n- Dragon head trophies (one per slain dragon)\n- Artifact collection (organized by type, rarity)\n- The emotional evidence of conquest\n\n**Guardian Chronicles:**\n- Memorable prophecies received (your Guardian Angel's actual messages to you)\n- Personal narrative record\n- Proof that you weren't alone",
        whyKeepLedger: "When you're in the depths of resistance, when the war feels unwinnable, you open the Ledger. You see dragons you've slain. Fairies you've freed. Artifacts you've earned. And you remember: you've done impossible things before. You can do them again."
      }
    ]
  },
  fitness: {
    title: "Fitness & Deities",
    features: [
      {
        id: "deity",
        title: "What is Deity Progression?",
        philosophy: "Fitness isn't separate from execution. Your body and your mind are the same machine. The app honors both by weaving gym work into mythological progression.",
        useCase: "As you accumulate gym volume (measured in kg), you unlock Greek deities:\n- **Hermes** (50k kg): Speed, overcoming paralysis\n- **Apollo** (150k kg): Clarity, cutting through fog\n- **Ares** (250k kg): War, willingness to bleed\n- **Hercules** (375k kg): Transcendence, becoming legend\n- **Zeus** (500k kg): Sovereignty, ruling the storm\n\nEach deity has a statistic (faster execution, better focus, more raw strength). But the real unlock is story. You're not just lifting. You're becoming.",
        timeHorizon: "This progression takes 12-24 months of consistent training. It's not a sprint. It's a journey toward godhood."
      },
      {
        id: "iron-ledger",
        title: "What is the Iron Ledger?",
        philosophy: "Gym sessions are operations too. They deserve the same tracking, the same celebration, the same integration into your mythology.",
        useCase: "The Iron Ledger tracks your gym work:\n- Session type (SBD, accessories, conditioning, etc.)\n- Exercises performed\n- Volume accumulated\n- Progression over time\n\nEvery 50k kg is a tier unlock. Every PR (personal record) is celebrated. The app knows you're building strength. It marks it.",
        connection: "Your gym volume feeds directly into deity progression. Lift more, unlock the next god. It's not metaphorical. It's mechanical."
      }
    ]
  },
  social: {
    title: "Social & Friends",
    features: [
      {
        id: "friend",
        title: "What is a Friend?",
        philosophy: "Friends aren't just names on a list. They're witnesses to your journey. They see your streaks, your region progress, your victories. You see theirs. You're walking this path together.",
        useCase: "Add friends by username or Warscythe ID. Pending requests. Accept/decline. Max 50 friends (keeps the leaderboard meaningful, prevents noise).\n\nYour friends list shows:\n- Their current operative status (what region they're in)\n- Their current streak tier\n- Their region progress\n- How far along their journey they've progressed",
        whyItMatters: "In Warscythe, you're not alone. You have witnesses. Their execution pushes you. Your execution pushes them. The campfire model: you gather around the same fire and see who else is warm."
      },
      {
        id: "friends-leaderboard",
        title: "What is the Friends Leaderboard?",
        philosophy: "The leaderboard answers one question: who else is walking this path with me?\n\nDefault view is always self-comparison. You see your own metrics first: personal bests, weekly progress, streaks. Only then do you see friends' rankings. The system refuses to make you feel inadequate by default.",
        useCase: "The leaderboard has two views:\n\n**Personal mode (default):**\n- Your current streak vs. your personal best\n- Your weekly XP vs. your personal record\n- Your operations completed this month vs. last month\n- Shown first, always, before friends' rankings\n\n**Competitive mode (opt-in):**\n- Ranked by weekly XP (not lifetime, to prevent insurmountable gaps)\n- Shows friend rank, operative status, streak tier, weekly XP\n- Story events below rankings: \"[Friend] liberated [Empress]\", \"[Friend] completed a Boss Raid\"\n- Your position pinned regardless of scroll",
        whyItMatters: "Seeing friends slightly ahead of you isn't demoralizing—it's motivating. They're playing the same game. You can catch up. The campfire model means no one is left behind. Everyone's invited to the fire."
      },
      {
        id: "legion",
        title: "What is a Legion Operation?",
        philosophy: "Legion operations are distributed wars. You can't win them alone. You need other warriors. The app becomes cooperative, not just personal.",
        useCase: "As a creator, you can invite friends to a shared operation:\n- Define the operation (name, description, difficulty)\n- Break it into sub-tasks (each friend takes one)\n- Each friend must accept their sub-task before the operation goes live\n- All must complete their assignments for the legion to succeed\n- Success = everyone gets proportional XP, rare artifacts, and a permanent \"Completed\" mark in their history\n- Failure = non-essential sub-tasks can still be marked as individual completions (pride, but no legion rewards)\n\nAs a member:\nYou receive invites to shared operations. Accept the sub-task. Commit to it. Execute it. If the legion wins, you all celebrate. If it fails, you have notes-section to explain why, with zero judgment.",
        whyItMatters: "The hardest battles need allies. This mechanic makes interdependence real. You can't freelance forever. At some point, you need to fight alongside others. And they need you."
      },
      {
        id: "xp",
        title: "What is an XP System?",
        philosophy: "XP is invisible scorekeeping. You don't need to think about it. Every operation completion, every ritual check-in, every sub-task in a legion—it all feeds a counter that determines your standing relative to friends.",
        useCase: "You earn XP for:\n- Completing personal operations\n- Completing legion sub-tasks\n- Building streaks (small XP tick every day)\n\nXP feeds:\n- Weekly leaderboard ranking (reset weekly, so no one gets permanently stuck behind)\n- Deity progression (accumulated volume = deity unlock)\n- Seasonal rewards (Post-V4)",
        whyItMatters: "Without it, execution becomes invisible. Conversations become: \"Who's winning?\" XP makes that measurable. It's not about the number—it's about the proof that effort accumulates."
      }
    ]
  },
  atmosphere: {
    title: "Atmosphere & Immersion",
    features: [
      {
        id: "soundscape",
        title: "What is a Soundscape?",
        philosophy: "Music demands attention. Soundscapes support it. The goal: work for an hour, forget the audio was playing, then feel something missing when you turn it off.\n\nAll soundscapes are original compositions. They belong to Warscythe permanently. No licensing. No copyright claims. The soundtrack is yours.",
        useCase: "Each region has a unique soundscape:\n- **Ashwood:** Forest ambience, low wind, soft percussion\n- **Kailash:** Tibetan drones, bells, Himalayan wind\n- **Moonlit Sanctuary:** Flowing water, night ambience, airy pads\n- **Icebound Cathedral:** Faint choir, icy wind, long reverbs\n- **Lava Citadel:** Deep rumbles, crackling embers, sparse percussion\n\nHow to activate:\n- Region entry shows small ambient indicator (rotating disc, gramophone, crystal)\n- One click: \"Activate the Resonance\"\n- Audio begins softly\n- Never autoplays on launch\n- Volume slider independent from system volume\n- Preference persists across sessions",
        designPrinciple: "Silence is a first-class experience. The soundscape is optional, never mandatory. If you want silence, the app respects that. If you want immersion, the soundtrack is there."
      },
      {
        id: "cache",
        title: "What is the Tactical Cache Core?",
        philosophy: "You're offline half your life. The app never punishes you for that. Soundscapes, regions, artifacts, lore—all cached locally. You can work fully offline with zero latency.",
        useCase: "Downloaded soundscapes play offline with zero buffering. If a soundscape isn't cached, it falls back to silence—no error, no broken state. Everything degrades gracefully.",
        whyItMatters: "You're building something powerful. That thing should work everywhere: your room, the gym, the train, the forest, offline. The app meets you where you are, not where WiFi happens to be."
      }
    ]
  },
  terminal: {
    title: "Power User Tools",
    features: [
      {
        id: "terminal",
        title: "What is the War Terminal?",
        philosophy: "The Terminal is a command palette. Structured commands, predictable outputs, zero latency. It's not AI. It's not natural language. It's pure intention made instant.\n\nFor users who think faster than they click, every modal and dropdown is an interruption. The terminal eliminates that interruption.\n\nNew users never need it. Everything stays clickable. Power users discover it and the terminal becomes their interface. Both valid.",
        useCase: "Open with Cmd+K / Ctrl+K (desktop) or floating button (mobile). Type commands like:\n```\n/strike Finish YC application /date sep-15 /threat legendary /region ashwood\n/ritual Morning run /frequency daily /reminder 06:00\n/workout SBD Day\n/exercise Squat 5x5@8\n```\nAll parameters are optional. Autocomplete handles discovery. You never memorize—the terminal guides you.",
        whyItExists: "Not to save time. To save context. You're in flow. An idea lands. You don't want to navigate menus. You want to create instantly. The terminal lets you."
      },
      {
        id: "terminal-commands",
        title: "Terminal Commands",
        philosophy: "All commands are immediately available. No unlock tiers. Artificial gating on a palette that maps to existing functionality is redundant complexity.",
        useCase: "**Core commands:**\n\n`/strike [title]` — Create an operation\n- Optional: `/date /threat /region /note /priority`\n- Enforces minimum duration relative to threat level\n\n`/ritual [title]` — Create a habit\n- Optional: `/frequency /reminder`\n\n`/date [value]` — Assign deadline\n- Accepts: tomorrow, mon, sep-15, 2026-09-15\n- Enforces minimum duration\n\n`/threat [level]` — Set difficulty\n- Values: low | medium | high | legendary\n- Legendary = Boss Raid (14-day minimum)\n\n`/workout [title]` — Create fitness session\n- Example: `/workout SBD Day`\n\n`/exercise [name] [sets]x[reps]@[rpe]` — Add exercise to active workout\n- Example: `/exercise Squat 5x5@8`\n\n`/region [name]` — Assign operation to region\n- Autocompletes from unlocked regions\n\n`/priority [level]` — Set priority\n- Values: low | medium | high\n- Independent of threat level",
        errorHandling: "Invalid command = inline error, terminal stays open. Missing parameter = terminal prompts inline. Date violates minimum = rejected with lore message. No crashes. No silent failures.",
        whyItMatters: "You think fast. The terminal moves fast. No friction between thought and action."
      }
    ]
  },
  wisdom: {
    title: "Wisdom & Guidance",
    features: [
      {
        id: "guardian-angel",
        title: "What is the Guardian Angel?",
        philosophy: "Not motivation. Not a cheerleader. The Guardian Angel is a witness who speaks the truth of execution. It appears during execution, validates your focus, and occasionally asks you to rest.",
        useCase: "Every 5-15 minutes during task execution, a prophecy appears.\n\nExamples:\n- \"Your brain accelerates when stakes are high. The chaos you feel is your processor scaling.\"\n- \"The shifting thoughts are not distraction; your brain is forging connections.\"\n- \"You've set this objective, and you are completing it. That's not luck. That's your architecture.\"\n- \"Pressure sharpens you. Your clock is accelerating. Most people panic. You sharpen.\"\n\nThese prophecies are contextual. The Angel reads your active focus and speaks to what you're doing right now.",
        crucialMoment: "At 200 days, the Angel sends a letter. Not congratulations. A warning. A psychological checkpoint: \"Are you doing this for you, or are you trapped?\" It gives you permission to break the streak if you need to.",
        whyItMatters: "You're not broken. You're wired differently. The Angel speaks in your language."
      },
      {
        id: "fairy",
        title: "What is a Fairy?",
        philosophy: "Every region has an imprisoned fairy. Your job isn't just to conquer. It's to liberate. The distinction matters. You're not taking territory. You're freeing souls.",
        useCase: "Each region's dragon imprisons a fairy. To free her:\n1. Complete 5 operations in the region (collect 5 keys)\n2. Defeat the dragon (Boss Raid)\n3. The fairy is liberated, claims her throne\n4. Her story is revealed in the Ledger\n\nEach liberated fairy becomes a trophy. Proof of conquest. The Ledger shows:\n- Her name and region\n- Liberation date\n- The operation through which she was freed\n- Her sovereign status (now queen of that region)",
        whyItMatters: "The narrative matters. You're not just grinding. You're restoring order. You're freeing the oppressed. That meaning is the entire point."
      },
      {
        id: "lore",
        title: "What is Lore?",
        philosophy: "Lore is the story behind each region. Why is that dragon there? What does the fairy dream of? What does her liberation mean?\n\nEvery page of lore validates the work you're doing. It answers: \"Why does this matter?\"",
        useCase: "Lore unlocks as you complete operations:\n- Complete operation 1 → unlock lore page 1\n- Complete operation 2 → unlock lore page 2\n- (And so on, 5 pages per region)\n\nEach page is a novel-style narrative with an illustration. The lore defends why restoration matters, through narrative. It's not just flavor. It's philosophy.",
        whereToFind: "Ledger > Relics & Lore > Select fairy > \"Sovereign Chronicles\"\n\nRead it slowly. It was written for you."
      }
    ]
  },
  aesthetics: {
    title: "Aesthetics & Customization",
    features: [
      {
        id: "themes",
        title: "What are Themes?",
        philosophy: "Themes aren't cosmetics. They're worlds. Each theme changes the entire aesthetic—colors, particles, atmosphere, tone. When you choose a theme, you're choosing how deeply you want to live in that region.",
        useCase: "Themes are paid cosmetics (₹200 / $7.20 each). Each is region-specific:\n- Lava Citadel theme: golden UI, heat shimmer, volcanic particles\n- Frost Palace theme: blue UI, crystalline effects, ice particles\n- Void Sanctuary theme: purple UI, cosmic glow, void particles\n\nSwitching themes switches both visuals and soundscape simultaneously (if soundscape is active).",
        whyCost: "Themes require significant design effort. Each one is a complete visual overhaul. The price reflects that care. But the price also filters: you're paying for something you genuinely want, not impulse-buying everything.",
        bestPractice: "Don't buy every theme. Buy the one that resonates. Live in it. The cohesion matters more than collection."
      }
    ]
  },
  philosophy: {
    title: "Onboarding & Philosophy",
    features: [
      {
        id: "doctrine",
        title: "The Doctrine of Will",
        philosophy: "Before you start, you should know what you're walking into. This app is for people who want to execute, not people who want to be managed.",
        useCase: "On first launch, the app shows the doctrine—the entire philosophy in ~500 words:\n\n\"You are here because you've decided something. Not because it's easy. Because it matters. The app doesn't motivate. It witnesses. It celebrates victories. It asks you to rest at 200 days. It respects your time.\n\nYour resistance is not weakness. It's signal. High resistance means you're approaching something real.\n\nThe fairies aren't metaphors. The dragons aren't metaphors. You're building something. That matters.\"",
        whyThisOnboarding: "You need to know who built this and why. You need to know it's made for you, not against you."
      },
      {
        id: "first-operation",
        title: "First Operation Tutorial",
        philosophy: "Don't learn buttons. Learn the system. Your first operation should feel sacred, not mechanical.",
        useCase: "The onboarding isn't a checklist. It's a narrative:\n1. **Screen 1:** Doctrine (lore drop, heavy atmosphere)\n2. **Screen 2:** Region unlock (cinematic, world-building)\n3. **Screen 3-5:** Interactive gold-button tutorial (learn by doing)\n4. **Screen 6:** Create your actual first operation (not a tutorial task—your real war)\n\nThe first task isn't sandboxed. It's real. It counts.",
        afterOnboarding: "You understand the world. You've created your first operation. You're ready to execute."
      }
    ]
  },
  settings: {
    title: "Settings & Personalization",
    features: [
      {
        id: "personal-mode",
        title: "What is Personal Mode?",
        philosophy: "Competition isn't for everyone. Some people thrive with friends' rankings visible. Others find it demoralizing. The app respects both.",
        useCase: "In settings, toggle Personal Mode:\n- ON: See only your metrics (personal bests, weekly progress, streaks). Friends list hidden from leaderboard.\n- OFF: See friends' rankings alongside your metrics. The campfire model.\n\nThis is a per-user setting. You can toggle it any time. No judgment either way.",
        whyItExists: "Execution is individual. The support system (seeing friends do it too) is optional. Some warriors fight better alone. The app respects that."
      },
      {
        id: "offline",
        title: "Offline Mode (Always Active)",
        philosophy: "Wifi is a luxury, not a requirement. The app works completely offline. Sync happens when you reconnect.",
        useCase: "Everything you do offline syncs automatically when connection restores:\n- Operations created offline\n- Rituals completed offline\n- Artifacts earned offline\n- All of it\n\nExceptions: Legion operations require connection (they involve other people's data). Everything else works fully offline.",
        whyThisMatters: "You're building. That happens everywhere. The app follows you."
      }
    ]
  },
  monetization: {
    title: "Monetization",
    features: [
      {
        id: "ad-free",
        title: "What is Ad-Free?",
        philosophy: "Ads appear only on transition screens—between operations, during loading. Never during execution. Execution is sacred.\n\nIf you want a clean experience, you can remove them while supporting the app.",
        useCase: "Ad-free subscription:\n- Removes all full-screen ads\n- Keeps the experience clean\n- Recurring (billed monthly)\n- Includes access to all features (no features locked behind payment)\n\nThis is optional. The app works perfectly with ads. But if execution moments matter to you, ad-free removes that friction."
      },
      {
        id: "cosmetics",
        title: "What are Cosmetics?",
        philosophy: "Cosmetics are emotional attachment. They don't make you stronger. They make the journey feel more personal.",
        useCase: "Two types of cosmetics:\n\n**Scythes**:\n- Visual variants of your scythe\n- Cosmetic only (no gameplay impact)\n- Unlock at higher tiers\n\n**Themes**:\n- Region-specific visual overhauls\n- Switch visuals AND soundscape simultaneously\n- Premium pricing reflects design effort\n\n**Bundle**:\n- 2 scythes + 1 theme + ad-free for 1 month\n- Discounted package value\n- Best value if you want everything",
        whyExists: "The journey lasts months. Looking at beautiful things matters. Cosmetics let you personalize that journey."
      },
      {
        id: "bundle",
        title: "What is the Bundle?",
        philosophy: "The bundle bundles value. You want ad-free + themes? The bundle costs less than buying them separately. It's a signal: \"We want you to have the full experience.\"",
        useCase: "Bundle includes:\n- 2 cosmetic scythes (you choose which)\n- 1 region theme (you choose which)\n- 1 month of ad-free subscription\n\nSaves on cost compared to acquiring them ala carte.\n\nRecommended first purchase for new players who want to commit fully to the experience."
      }
    ]
  },
  about: {
    title: "About",
    features: [
      {
        id: "about",
        title: "About Warscythe",
        philosophy: "This app exists because standard productivity tools are broken. They treat your focus and energy as a problem to fix. Warscythe treats it as a specific operating system that works brilliantly—if you respect how it actually works.\n\nYou hyperfocus when stakes are high. You need constraints to thrive. Paralysis is real, but so is your capacity to move when execution is framed as sacred.\n\nThis app honors that.",
        whatWeBelieve: [
          "Your wiring isn't broken",
          "Execution is sacred",
          "Hyperfocus is power",
          "Rest is wisdom",
          "You don't need ideal conditions—you need a place to begin",
          "The journey matters more than the destination",
          "Witnessing each other matters",
          "Lore matters",
          "Beauty matters"
        ],
        whyWeBuiltThis: "To give you a world that respects how you actually work.\n\nNow go execute."
      }
    ]
  }
};
