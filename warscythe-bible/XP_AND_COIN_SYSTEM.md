# Warscythe Economy & Progression System Documentation

This document defines the mathematical and logical rules governing the **XP system**, **Progression Coins**, **Operative Titles**, and the **Scythe Progression tracks** inside Warscythe.

---

## 1. The XP System (Objective Conquest)
XP is awarded upon the completion of a Task or Daily Ritual. The value is calculated using the baseline effort level modified by any active status conditions and random loot drops.

### A. Effort & Multipliers
The baseline reward is **100 XP** (`POINTS_BASE = 100`). Multipliers are applied according to the selected effort level:
* **Low Effort** (Multiplier: `1.0x`) $\rightarrow$ **100 Base XP**
* **Medium Effort** (Multiplier: `1.5x`) $\rightarrow$ **150 Base XP**
* **High Effort** (Multiplier: `2.0x`) $\rightarrow$ **200 Base XP**
* **Boss Raid** (Multiplier: `5.0x`) $\rightarrow$ **500 Base XP**

$$\text{Base Points} = \text{Round}(\text{POINTS\_BASE} \times \text{Multiplier})$$

### B. Rarity Bonus Loot XP
Completing an objective triggers a randomized loot roll. In addition to a regional artifact fragment, the user is awarded a rarity-based XP bonus:
* **Common**: $+25$ to $+75\text{ XP}$
* **Uncommon**: $+75$ to $+150\text{ XP}$
* **Rare**: $+150$ to $+250\text{ XP}$
* **Epic**: $+300$ to $+500\text{ XP}$
* **Mythic**: $+500$ to $+800\text{ XP}$

### C. Active Modifiers
* ⚡ **Overcoming Resistance (Stalled Mode)**: If an objective has been active for more than **48 hours** (`STALLED_HRS = 48`), completing it triggers the Stalled Mode modifier. This **doubles ($2\times$)** both the Base XP and the Bonus XP to reward breaking through ADHD paralysis.
* 🌾 **Farming Mitigation**: If multiple repetitive tasks are completed in rapid succession, rewards are scaled down to **$25\%$** of their value to mitigate artificial progression grinding.

---

## 2. Operative Status & Titles
XP accumulation directly translates to leveling up and climbing the military command hierarchy.

### A. Level Up Threshold
* Every **5 completed tasks** (`TASKS_PER_LEVEL = 5`) triggers a Level Up.
* Each level up grants access to the next regional map area and unlocks a new fragment of regional lore.

### B. Hierarchical Titles
Operative rank is mapped to the current level index:
1. **Level 1**: Recruit
2. **Level 2**: Tactician
3. **Level 3**: Iron Executor
4. **Level 4**: Shadow Marshal
5. **Level 5**: The Relentless
6. **Level 6**: Siege Commander
7. **Level 7**: Voidbreaker
8. **Level 8**: Storm Sovereign
9. **Level 9**: Dragon Lord
10. **Level 10**: The Architect
11. **Level 11+**: Warscythe Supreme (continuing to Legend Incarnate)

### C. Daily Scythe Evolution (Energy Levels)
Separate from permanent account levels, your **Daily Scythe Level** is a daily status indicator reflecting active focus points accumulated within the calendar day. It resets to `DORMANT` at 5:00 AM daily:
* **0 - 99 Daily Points**: `DORMANT`
* **100 - 249 Daily Points**: `AWAKENED`
* **250 - 399 Daily Points**: `HARDENED`
* **400 - 699 Daily Points**: `REFINED`
* **700 - 999 Daily Points**: `ASCENDED`
* **1000+ Daily Points**: `PLATINUM`

---

## 3. Progression Coins (In-Game Store Currency)
Progression Coins (🪙) are a separate in-game currency earned purely through task and ritual completion. They are used to unlock non-premium visual assets.

### A. Earning Coins
Coins are awarded at a flat rate of **15%** of the total XP points awarded for a completed objective:
$$\text{Coins Awarded} = \text{Round}(\text{Base XP} \times 0.15) + \text{Round}(\text{Bonus XP} \times 0.15)$$

### B. Progression Coin Weapons (The Shop)
Progression coins can be spent in the Dread Armory to purchase the following custom weapons. Unlike premium weapons, these are high-concept weapon skins that do not dynamically evolve throughout the day and are priced equally at **5,000 coins each**:
* **Shadow Blade** (Price: `5000 🪙`): Sleek obsidian metal wrapped in shifting semi-transparent black smoke. For operatives who move without announcing themselves.
* **Golden Harvester** (Price: `5000 🪙`): Ornate gilded metal with detailed sunburst engravings. For operatives who execute in full view.
* **Cinder Reaper** (Price: `5000 🪙`): Charred dry gray wood shaft with iron blade tips smoldering with orange coals. For operatives who leave nothing standing.
* **Frost Cleaver** (Price: `5000 🪙`): Carved from glacial ice with glowing white runes emitting cold fog. For operatives who operate without heat.
* **Storm Caller** (Price: `5000 🪙`): Double-edged metallic white scythe with coiling electric blue lightning arcs. For operatives who move at the speed of decision.

---

## 4. Strict Isolation: Streak Scythes
**Streak-based Scythes are completely isolated from the coin and monetary shops. They can never be bought.**

### A. Milestone Unlocks
Streak scythes are awarded automatically to players who achieve unbroken daily task completion streaks. They are displayed and equipped inside the **Weapon Forge**:
* **Dormant Scythe**: Unlocked at `0 Days` (Default baseline)
* **Neophyte Reaper**: Unlocked at `5 Days`
* **Acolyte Reaper**: Unlocked at `15 Days`
* **Reaper**: Unlocked at `30 Days`
* **Executioner Reaper**: Unlocked at `60 Days`
* **Sovereign Reaper**: Unlocked at `120 Days`
* **Void-Walker Reaper**: Unlocked at `200 Days`
* **Eternal Reaper**: Unlocked at `300 Days`
* **Death-Lord Reaper**: Unlocked at `360 Days` (Ultimate Milestone)

### B. Purchasing Blocked
There are no purchase buttons, price tags, or transactional pathways in either the Forge UI or the Shop Modal for these items. If a player tries to select a locked streak scythe in the Forge, the interface will display:
`Locked (Requires [req] Day Streak)`
This guarantees that streak weapons remain pure status symbols of daily discipline.
