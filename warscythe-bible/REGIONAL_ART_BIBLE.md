# 🎨 WARSCYTHE — REGIONAL ART BIBLE (10 ENVIRONMENTS)

This document is a visual design reference sheet. Use these element, color, and landmark specifications when generating regional map textures, crests, dragons, and trophies to keep the visual identity unified.

---

## 🗺️ REGIONAL DESIGN MATRIX

| Region / Level | Theme Archetype | Primary Colors | Map Landmarks | Shield Crest Design | Dragon Boss | Trophy Wall Relic |
|---|---|---|---|---|---|---|
| **1 — The Threshold** | Grasslands Gateway | Forest green, stone grey, gold | Fortress gatehouse, rolling green hills, mossy stone walls | **Shield of the Gateway:** Iron shield bound in moss and vines | `dragon-wyrm.png` (Moss-covered forest Wyrm, glowing yellow eyes) | Severed Mossy Horn |
| **2 — Ashenveil** | Volcanic Rift | Crimson, obsidian black, ash grey | Active lava flows, iron bridges, dark volcanic canyons | **Crest of the Caldera:** Molten iron anvil shape with glowing embers | `dragon-lava.png` (Lava Wyrm/Drake wrapped in fire) | Glowing Obsidian Scale |
| **3 — Frostmere** | Glacial Valleys | Cyan, ice blue, snow white | Frozen mountain peaks, sapphire ice spires, snow blizzards | **Sigil of Glacial Peaks:** Ice crystal snowflake bounded in silver | `dragon-frost.png` (Spiked blue Frost Drake with frost breath) | Ice-frozen Dragon Claw |
| **4 — Shadowfen** | Ancient Ruins | Midnight purple, swamp green, black | Twisted dead oak trees, glowing toxic moss, crumbling arches | **Mark of the Old Wood:** Runic oak leaf glowing with purple magic | `dragon-shadow.png` (Shadow Serpent fading into dark violet clouds) | Glowing Purple Dragon Eye |
| **5 — The Oasis** | Desert Dunes | Sand yellow, bright gold, jade green | Desert dunes, jade-green oasis spring, sandstone ruins | **Seal of the Oasis:** Jade-inlaid golden scarab beetle | `dragon-wyvern.png` (Sand-colored, stone-scaled desert Wyvern) | Golden Sand-worn Horn |
| **6 — Aurelius Keep** | Sky Temples | Pristine white, sun gold, sky blue | Floating marble islands, cascading aqueducts, sun rays | **Aegis of Sun-Temple:** Golden shield with sunburst emblem | `dragon-celestial.png` (Feathered golden-scaled Celestial Wyrm) | Radiant Sun-temple Scale |
| **7 — Bonehollow** | Undead Cavern | Pale neon green, bone white, charcoal | Cavern stalactites, piles of skulls, green spectral flames | **Sigil of Bonehollow:** Runic bone gate locked with iron chains | `dragon-skeletal.png` (Skeletal Dragon with neon green soul embers) | Severed Skeletal Jaw / Skull |
| **8 — Stormspire** | Storm Ridge | Electric blue, storm grey, dark teal | Jagged lightning rods, storm clouds, electrical arcs | **Crest of Stormspire:** Shield split by a crackling lightning bolt | `dragon-storm.png` (Teal-scaled Storm Wyvern with spiked wings) | Lightning-charged Talons |
| **9 — The Abyss** | Void Cavern | Midnight indigo, deep violet, matte black | Floating obsidian shards, gravity distortions, void vortex | **Void-shard Emblem:** Cracked circular rune leaking dark energy | `dragon-abyssal.png` (Abyssal Leviathan with multiple glowing blue eyes) | Void-shard Core |
| **10 — Titan's Rest** | Golden Citadel | Antique bronze, copper, royal red | Colossal titan statues, bronze pillars, ancient combat arena | **Golden Citadel Seal:** Crossed war hammers inside a bronze circle | `dragon-ancient.png` (Bronze-plated Titan Dragon, ancient armor plates) | Ancient Bronze Crown Relic |

---

## 🎨 ART STYLE GUIDE (FOR GENERATING ASSETS)

### 1. 🗺️ Region Maps (`public/maps/`)
* **Aspect Ratio:** 16:9 widescreen canvas.
* **Vibe:** Highly detailed, high-fantasy tactical battle maps (top-down or 3/4 isometric perspective).
* **Atmosphere:** Dark, moody, and atmospheric. Use the **Primary Colors** listed in the matrix to define the sky and ambient lighting.

### 2. 🛡️ Region Shield Crests (`public/crests/`)
* **Format:** Transparent PNG (square aspect ratio, background removed).
* **Vibe:** Embossed iron/bronze/gold crest badges with a glowing neon outline corresponding to the element (e.g. green for Threshold, gold for Sun-Temple).
* **Scale:** Clean silhouettes so they look crisp on small mobile screens.

### 3. 🐉 Dragon Bosses (`public/dragons/`)
* **Format:** Transparent PNG (vertical or square portrait, background removed).
* **Subject:** Profile/side shot of the dragon. Focus on head, neck, and upper chest details.
* **Aesthetic:** Menacing, intelligent, ancient. Avoid cartoonish designs. The lighting on the dragon's scales should reflect the region's element (e.g. blue highlights for Frostmere).

### 4. 🐲 Trophy Relics (`public/trophies/`)
* **Format:** Transparent PNG (square aspect ratio, background removed).
* **Subject:** A single, isolated trophy fragment of the slain beast (e.g. a broken horn, a glowing scale, or a severed claw).
* **Vibe:** High-fantasy relic wall items, polished with a subtle drop shadow.

---

*Note: For regions 11 to 40, we repeat the visual cycle (Maps 1-10, Dragons 1-10, Crests 1-10) but apply color shifts (e.g., green grasslands in Region 1 shift to autumn gold in Region 11) in code to create a total of 40 unique environments.*
