# 🎮 WARSCYTHE — ASSET CHECKLIST

Track all PNG assets needed. Check off as you complete each one.

---

## ⚔️ BOSS TASK SCREENS — `public/boss-kill/`

| Status | Filename | Description |
|---|---|---|
| ✅ | `boss-initiate-screen.png` | Warrior faces the living dragon under full moon — shown when INITIATING a boss raid task |
| ✅ | `boss-kill-screen.png` | Warrior stands ON dead dragon at sunrise — shown when COMPLETING a boss raid task |

**Total: 2 files**

---

## 🐉 DRAGON BOSSES — `public/dragons/`

One dragon per region archetype. 10 base assets cycled across 40 regions (every 10 regions repeats the dragon family with a new name/lore).

| Status | Filename | Dragon Type | Color Theme | Regions |
|---|---|---|---|---|
| ✅ | `dragon-wyrm.png` | Dread Wyrm | Red / Fire | 1, 11, 21, 31 |
| ✅ | `dragon-wyvern.png` | Stone Wyvern | Grey / Earth | 2, 12, 22, 32 |
| ✅ | `dragon-frost.png` | Frost Drake | Blue / Ice | 3, 13, 23, 33 |
| ✅ | `dragon-shadow.png` | Shadow Serpent | Purple / Dark | 4, 14, 24, 34 |
| ✅ | `dragon-lava.png` | Lava Drake | Orange / Volcanic | 5, 15, 25, 35 |
| ✅ | `dragon-celestial.png` | Celestial Wyrm | White / Gold | 6, 16, 26, 36 |
| ✅ | `dragon-skeletal.png` | Skeletal Dragon | Bone / Undead | 7, 17, 27, 37 |
| ✅ | `dragon-storm.png` | Storm Wyvern | Electric / Teal | 8, 18, 28, 38 |
| ✅ | `dragon-abyssal.png` | Abyssal Leviathan | Black / Void | 9, 19, 29, 39 |
| ✅ | `dragon-ancient.png` | Ancient Titan | Bronze / Golden | 10, 20, 30, 40 |

**Total: 10 files**

> **Style guide:** Each dragon should be a dramatic side/front profile shot on a dark background.
> Should feel like a bestiary entry — epic, detailed, atmospheric.

---

## 💎 ARTIFACTS — `public/artifacts/`

25 artifact types × 5 rarity color variants = 125 files.

### Rarity Color System (drip/glow style — same aesthetic as skull relic)

| Rarity | Drip/Glow Color | Suffix |
|---|---|---|
| Common | Grey | `-common` |
| Uncommon | Green | `-uncommon` |
| Rare | Gold | `-rare` |
| Epic | Red | `-epic` |
| Mythic | Purple | `-mythic` |

### Artifact Types

| Status | Base Name | Full Filenames (5 variants each) | Description |
|---|---|---|---|
| ✅ | `skull` | `artifact-skull-common/uncommon/rare/epic/mythic.png` | Ancient skull relic |
| ✅ | `crown` | `artifact-crown-[rarity].png` | Ancient war crown |
| ✅ | `orb` | `artifact-orb-[rarity].png` | Glowing power orb |
| ✅ | `blade` | `artifact-blade-[rarity].png` | Cursed blade shard |
| ✅ | `tome` | `artifact-tome-[rarity].png` | Forbidden tome |
| ✅ | `rune` | `artifact-rune-[rarity].png` | Runic stone |
| ✅ | `ring` | `artifact-ring-[rarity].png` | Power ring |
| ✅ | `scroll` | `artifact-scroll-[rarity].png` | Ancient scroll |
| ✅ | `idol` | `artifact-idol-[rarity].png` | Stone idol |
| ✅ | `gem` | `artifact-gem-[rarity].png` | Mystic gem |
| ✅ | `amulet` | `artifact-amulet-[rarity].png` | Bone amulet |
| ✅ | `chalice` | `artifact-chalice-[rarity].png` | Blood chalice |
| ✅ | `gauntlet` | `artifact-gauntlet-[rarity].png` | Iron gauntlet |
| ✅ | `helm` | `artifact-helm-[rarity].png` | War helm fragment |
| ✅ | `shield` | `artifact-shield-[rarity].png` | Cracked shield |
| ✅ | `horn` | `artifact-horn-[rarity].png` | Dragon horn |
| ✅ | `eye` | `artifact-eye-[rarity].png` | Eye of the void |
| ✅ | `chain` | `artifact-chain-[rarity].png` | Cursed chains |
| ✅ | `staff` | `artifact-staff-[rarity].png` | Warlock staff |
| ✅ | `map` | `artifact-map-[rarity].png` | Torn battle map |
| ✅ | `compass` | `artifact-compass-[rarity].png` | Obsidian compass |
| ✅ | `coin` | `artifact-coin-[rarity].png` | Ancient war coin |
| ✅ | `hourglass` | `artifact-hourglass-[rarity].png` | Frozen hourglass |
| ✅ | `mirror` | `artifact-mirror-[rarity].png` | Shattered mirror |
| ✅ | `lantern` | `artifact-lantern-[rarity].png` | Soul lantern |

**Total: 125 files** (25 types × 5 rarities)

> **Style guide:** Same drip/glow aesthetic as the skull relic.
> Dark/transparent or white background. Photorealistic with colored drip effect.
> Each rarity tier has progressively more glow and drip intensity.

---

## 🗺️ REGION MAPS — `public/maps/`

10 base maps rotated across 40 regions. We will apply custom hue/color shifts in code to create 40 unique environments.

| Status | Filename | Description | Regions |
|---|---|---|---|
| ✅ | `campaign-map-1.png` | Starting grasslands / fortress gateway | 1, 11, 21, 31 |
| ✅ | `campaign-map-2.png` | Volcanic rift / ashen canyons | 2, 12, 22, 32 |
| ✅ | `campaign-map-3.png` | Frozen peaks / glacial valleys | 3, 13, 23, 33 |
| ✅ | `campaign-map-4.png` | Shadow forest / ancient ruins | 4, 14, 24, 34 |
| ✅ | `campaign-map-5.png` | Desert dunes / crystal oasis | 5, 15, 25, 35 |
| ✅ | `campaign-map-6.png` | Floating skylands / celestial temples | 6, 16, 26, 36 |
| ✅ | `campaign-map-7.png` | Sunken cavern / abyssal deeps | 7, 17, 27, 37 |
| ✅ | `campaign-map-8.png` | Toxic swampland / glowing fungal groves | 8, 18, 28, 38 |
| ✅ | `campaign-map-9.png` | Cosmic void / shattered gravity islands | 9, 19, 29, 39 |
| ✅ | `campaign-map-10.png` | Ancient titan colosseum / golden citadel | 10, 20, 30, 40 |
| ✅ | `map-lock-icon.png` | Gothic padlock overlay for locked regions | - |
| ✅ | `map-fog-overlay.png` | Looping cloud/fog texture for sliding transitions | - |

**Total: 12 files**

---

## 💎 SCRATCH CARD FOIL TEXTURES — `public/scratch/`

Textures representing the scratchable foil card covers. The color/glow intensity scales with rarity.

| Status | Filename | Description |
|---|---|---|
| ✅ | `scratch-foil-common.png` | Slate metallic card cover |
| ✅ | `scratch-foil-uncommon.png` | Verdigris copper metallic card cover |
| ✅ | `scratch-foil-rare.png` | Gold leaf brushed metallic card cover |
| ✅ | `scratch-foil-epic.png` | Crimson steel engraved card cover |
| ✅ | `scratch-foil-mythic.png` | Cosmic obsidian glowing card cover |

**Total: 5 files**

---

## 🛡️ REGION SHIELD CRESTS — `public/crests/`

Emblems to display on the Ascension / Level Up popup instead of basic emojis (e.g. replacing the 🏰 emoji).

| Status | Filename | Description | Archetype |
|---|---|---|---|
| ✅ | `region-crest-1.png` | Shield of the Gateway | Grasslands |
| ✅ | `region-crest-2.png` | Crest of the Caldera | Volcanic |
| ✅ | `region-crest-3.png` | Sigil of the Glacial Peaks | Frozen |
| ✅ | `region-crest-4.png` | Mark of the Old Wood | Shadow Forest |
| ✅ | `region-crest-5.png` | Seal of the Oasis | Desert |
| ✅ | `region-crest-6.png` | Aegis of the Sun-Temple | Sky Temple |
| ✅ | `region-crest-7.png` | Rune of the Abyss | Sunken Cavern |
| ✅ | `region-crest-8.png` | Token of the Fungal Groves | Toxic Swamp |
| ✅ | `region-crest-9.png` | Void-shard emblem | Cosmic Void |
| ✅ | `region-crest-10.png` | Golden Citadel seal | Titan Rest |

**Total: 10 files**

---

## 🐲 DRAGON TROPHY RELICS — `public/trophies/`

High-fantasy trophies showing the severed heads/remnants of the regional dragon bosses. Displayed in the Ledger Trophy Wall instead of basic dragon emojis (🐲).

| Status | Filename | Slain Boss Target |
|---|---|---|
| ✅ | `trophy-dragon-wyrm.png` | Dread Wyrm Trophy |
| ✅ | `trophy-dragon-wyvern.png` | Stone Wyvern Trophy |
| ✅ | `trophy-dragon-frost.png` | Frost Drake Trophy |
| ✅ | `trophy-dragon-shadow.png` | Shadow Serpent Trophy |
| ✅ | `trophy-dragon-lava.png` | Lava Drake Trophy |
| ✅ | `trophy-dragon-celestial.png` | Celestial Wyrm Trophy |
| ✅ | `trophy-dragon-skeletal.png` | Skeletal Dragon Trophy |
| ✅ | `trophy-dragon-storm.png` | Storm Wyvern Trophy |
| ✅ | `trophy-dragon-abyssal.png` | Abyssal Leviathan Trophy |
| ✅ | `trophy-dragon-ancient.png` | Ancient Titan Trophy |

**Total: 10 files**

---

## 🏰 MAP NODE DETAIL ARTWORKS — `public/nodes/`

Illustrations rendered inside the right-side Region Intel detail panels on the quest map, replacing generic placeholders and emojis.

| Status | Filename | Node Target | Thematic Setting |
|---|---|---|---|
| ✅ | `node-stonehollow.png` | Stonehollow | Training grounds / Fitness logbook |
| ✅ | `node-ashendale.png` | Ashendale | Runic shrine / Rituals & Habits |
| ✅ | `node-blackvale.png` | Castle Blackvale | Gothic library / Ledger relic vault |
| ✅ | `node-ironjail.png` | Iron Jail | Fortress keep / Active operations |
| ⏳ | `node-empress-abode.png` | Empress' Abode | Ethereal sanctuary / Rescued Fairy details |

**Total: 5 files**

---

## 🧚 FAIRY EMPRESS PORTRAITS — `public/fairies/`

Ethereal, neon translucent wings, dreamy halo. Each region has exactly 2 states (Caged vs Liberated) showing the transition from imprisonment to restoration in full-scene widescreen environment layouts (16:9).

| Status | Filename | Theme / Class | State | Description / prompt keywords |
|---|---|---|---|---|
| ⏳ | `empress-1-caged.png` | Dryad (Warrior) | Caged | Wrapped tightly in thorny black briars in a dark, dead forest floor. |
| ⏳ | `empress-1-liberated.png` | Dryad (Warrior) | Liberated | Sitting majestically on a glowing leaf-embroidered wooden throne in the restored sunlit emerald forest palace. |
| ⏳ | `empress-2-caged.png` | Pyra (Warrior) | Caged | Bound in obsidian cuffs suspended over a molten volcanic magma chasm. |
| ⏳ | `empress-2-liberated.png` | Pyra (Warrior) | Liberated | Sitting on an ornate crown throne of magma glass and fire in a restored crystal volcano citadel. |
| ⏳ | `empress-3-caged.png` | Frost (Scholar) | Caged | Frozen inside a dark, jagged pillar of ice in a blizzard-swept cathedral ruin. |
| ⏳ | `empress-3-liberated.png` | Frost (Scholar) | Liberated | Floating gracefully in a majestic icebound sanctuary, reading glowing runic books. |
| ⏳ | `empress-4-caged.png` | Shadow (Recovery) | Caged | Bound by heavy, smoking black void chains inside a dark, bottomless cave. |
| ⏳ | `empress-4-liberated.png` | Shadow (Recovery) | Liberated | Sitting in a glowing stardust garden, tending and healing tiny forest sprites. |
| ⏳ | `empress-5-caged.png` | Jade (Fitness) | Caged | Trapped inside a shattered jade sarcophagus wrapped in red sealing talismans. |
| ⏳ | `empress-5-liberated.png` | Jade (Fitness) | Liberated | Flying dynamically through massive golden arches and waterfalls of a lush oasis palace. |
| ⏳ | `empress-6-caged.png` | Zephyr (Scholar) | Caged | Sealed inside a high-pressure glass cage floating over stormy cloudspire skies. |
| ⏳ | `empress-6-liberated.png` | Zephyr (Scholar) | Liberated | Floating gracefully in a sun-drenched cloud library, holding a glowing astrolabe. |
| ⏳ | `empress-7-caged.png` | Spectral (Recovery) | Caged | Imprisoned inside a cage of giant glowing green rib-bones in a dark dungeon. |
| ⏳ | `empress-7-liberated.png` | Spectral (Recovery) | Liberated | Sitting in a glowing cavern garden, surrounded by light, healing cave fairies. |
| ⏳ | `empress-8-caged.png` | Lightning (Warrior) | Caged | Locked inside a glowing electric prison dome crackling with blue shackles. |
| ⏳ | `empress-8-liberated.png` | Lightning (Warrior) | Liberated | Sitting on a jagged teal throne of lightning glass inside a storm fortress. |
| ⏳ | `empress-9-caged.png` | Cosmic (Scholar) | Caged | Suspended inside a dark gravity singularity / black-hole rift. |
| ⏳ | `empress-9-liberated.png` | Cosmic (Scholar) | Liberated | Floating gracefully in a celestial space observatory, pointing to a swirling galaxy. |
| ⏳ | `empress-10-caged.png` | Sol (Fitness) | Caged | Locked in an iron sun-cage that blocks all light in a dark colosseum. |
| ⏳ | `empress-10-liberated.png` | Sol (Fitness) | Liberated | Soaring dynamically through a golden colosseum dome, trailing solar rays. |

**Total: 20 files**

---

## 🎵 AUDIO & SOUNDSCAPE CONTROLS — `public/`

| Status | Filename | Description |
|---|---|---|
| ⏳ | `soundscape-jukebox.png` | Ethereal, floating dark fantasy musical jukebox widget for controlling ambient soundscapes |

**Total: 1 file**

---

## 📊 GRAND TOTAL

| Folder | Count |
|---|---|
| `public/boss-kill/` | 2 (desktop) + 2 (mobile) = 4 |
| `public/dragons/` | 10 |
| `public/artifacts/` | 125 |
| `public/maps/` | 12 |
| `public/scratch/` | 5 |
| `public/crests/` | 10 |
| `public/trophies/` | 10 |
| `public/nodes/` | 5 |
| `public/fairies/` | 20 |
| `public/` (Audio Controls) | 1 |
| **TOTAL** | **202 assets** |

---

## 🗺️ REGION → DRAGON MAPPING (40 Regions)

| Region | Dragon Asset | Dragon Name (Lore) |
|---|---|---|
| 1 — The Threshold | `dragon-wyrm.png` | Malgrath the Dread |
| 2 — Ashenveil | `dragon-wyvern.png` | Stoneback Krul |
| 3 — Frostmere | `dragon-frost.png` | Glacius the Eternal |
| 4 — Shadowfen | `dragon-shadow.png` | Vreth the Unseen |
| 5 — The Calderon | `dragon-lava.png` | Ignarax the Burning |
| 6 — Aurelius Keep | `dragon-celestial.png` | Sol-Varen the Radiant |
| 7 — Bonehollow | `dragon-skeletal.png` | Duskbone Revenant |
| 8 — Stormspire | `dragon-storm.png` | Thundercoil Zarak |
| 9 — The Abyss | `dragon-abyssal.png` | Nyxara the Void |
| 10 — Titan's Rest | `dragon-ancient.png` | Gorvek the Ancient |
| 11–20 | *(repeat cycle)* | New names, same assets |
| 21–30 | *(repeat cycle)* | New names, same assets |
| 31–40 | *(repeat cycle)* | New names, same assets |

---

## 🧠 DESIGN DECISIONS & RATIONALE

### 🐉 Why 10 Dragons, Not 40?

Think Pokémon / Dark Souls — reuse base models with variants:
- **8-10 dragon archetypes** (Wyrm, Wyvern, Drake, Serpent, Skeletal, Frost, Lava, Shadow, Celestial, Abyssal)
- Each archetype gets a **color/hue shift + different name per region**
- Region 1 = Red Dread Wyrm, Region 6 = Celestial Wyrm, Region 11 = Red Dread Wyrm (new name) etc.
- The regions just cycle through them with different names and lore
- **Real asset count: 10 PNGs — not 40**

### 💎 Why 125 Artifacts, Not 200 Unique?

5 per region × 40 regions = 200 artifacts in the game world BUT:
- You don't want 200 unique art assets — too much work, inconsistent style
- Better: **25 visual types × 5 rarity variants = 125 files**
- Each region's 5 artifacts pull from the 25-type pool but have **unique names + lore text**
- **Rarity** (Common → Mythic) determines the drip/glow color treatment
- Same drip aesthetic as the skull relic — just different base shape + drip color

### ⚔️ Boss Task Screens — Two Moments

Two cinematic flash screens for boss raids:
1. **`boss-initiate-screen.png`** — Shown when player clicks INITIATE BOSS RAID. Warrior faces the living, menacing dragon. Full moon. Ominous. Feels threatening.
2. **`boss-kill-screen.png`** — Shown when player COMPLETES the boss raid task. Warrior standing ON the dead dragon. Sunrise/golden horizon. Pure triumph.

The contrast between the two images tells the complete story of the battle without a single word.

### 📦 Asset Generation Order (Priority)

1. ✅ `boss-kill-screen.png` / `boss-kill-screen-mobile.png` — Done
2. ✅ `boss-initiate-screen.png` / `boss-initiate-screen-mobile.png` — Done
3. ✅ 10 Region Map PNGs (`campaign-map-1.png` to `campaign-map-10.png`) (Completed)
4. ✅ `dragon-wyrm.png` — First/default region boss (Completed)
5. ✅ Remaining 9 dragons (Completed)
6. ⏳ Skull artifact (5 rarity variants — started)
7. ⏳ Remaining 24 artifact types (5 variants each — base files completed)
8. ✅ 10 Region Shield Crests (Completed)
9. ✅ 5 Scratch Card Foil Textures (Completed)
10. ✅ 10 Dragon Trophy Relics (Completed)
11. ✅ 4 Map Node Detail Artworks (Completed)
