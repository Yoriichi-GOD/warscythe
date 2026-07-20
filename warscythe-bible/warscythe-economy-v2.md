# Warscythe Economy & Progression System
**Version:** 2.0  
**Last updated:** June 2026  
**Status:** Revised — flat coin skin pricing, conversion rate adjusted

---

## What This Document Governs

- XP calculation and modifiers
- Operative titles and level thresholds
- Daily scythe evolution
- Progression coins: earning rate and spending
- Weapon skin shop (coin-purchased)
- Streak scythes (earned, never purchasable)

The philosophical separation this document enforces:

**Coins buy aesthetic identity. Streaks buy discipline identity. Neither is purchasable with the other's currency.**

---

## 1. XP System

### Base XP by Task Level

Baseline: `POINTS_BASE = 100 XP`

| Task Level | Multiplier | Base XP |
|---|---|---|
| Low Effort | 1.0x | 100 XP |
| Medium Effort | 1.5x | 150 XP |
| High Effort | 2.0x | 200 XP |
| Boss Raid | 5.0x | 500 XP |

$$\text{Base XP} = \text{Round}(\text{POINTS\_BASE} \times \text{Multiplier})$$

### Rarity Bonus Loot XP

Every completed task triggers a randomized loot roll that awards additional XP alongside the artifact:

| Rarity | Bonus XP Range |
|---|---|
| Common | +25 to +75 XP |
| Uncommon | +75 to +150 XP |
| Rare | +150 to +250 XP |
| Epic | +300 to +500 XP |
| Mythic | +500 to +800 XP |

Total XP per task = Base XP + Bonus XP (before modifiers).

### Active Modifiers

**⚡ Stalled Mode (Overcoming Resistance)**
Triggered when a task has been active for more than 48 hours (`STALLED_HRS = 48`).
Completing a stalled task doubles both Base XP and Bonus XP.

$$\text{Stalled XP} = (\text{Base XP} + \text{Bonus XP}) \times 2$$

Rationale: The hardest moment in any operation is not starting — it is breaking through after momentum has died. Stalled Mode rewards the specific act of pushing through paralysis, not just completion. This is the most philosophically coherent mechanic in the XP system.

**🌾 Farming Mitigation**
Multiple repetitive tasks completed in rapid succession trigger reward scaling to 25% of normal value.
Prevents artificial progression grinding without punishing genuine burst productivity.

---

## 2. Operative Status & Titles

### Level Threshold

Every 5 completed tasks (`TASKS_PER_LEVEL = 5`) triggers a level up.
Each level up unlocks the next regional map area and a new fragment of regional lore.

### Hierarchical Titles

| Level | Title |
|---|---|
| 1 | Recruit |
| 2 | Tactician |
| 3 | Iron Executor |
| 4 | Shadow Marshal |
| 5 | The Relentless |
| 6 | Siege Commander |
| 7 | Voidbreaker |
| 8 | Storm Sovereign |
| 9 | Dragon Lord |
| 10 | The Architect |
| 11+ | Warscythe Supreme → Legend Incarnate |

---

## 3. Daily Scythe Evolution

The Daily Scythe Level is a transient status indicator — not a permanent identity marker. It reflects focus points accumulated within the current calendar day and resets to `DORMANT` at 5:00 AM daily.

This is separate from streak scythes and coin weapon skins. It is not purchasable, not earnable through consistency — only through active daily output.

| Daily Points | Scythe State |
|---|---|
| 0 – 99 | DORMANT |
| 100 – 249 | AWAKENED |
| 250 – 399 | HARDENED |
| 400 – 699 | REFINED |
| 700 – 999 | ASCENDED |
| 1000+ | PLATINUM |

Resets daily. Provides weapon visual variety independent of streak status or coin purchases. A user on day 1 with enough daily output can see ASCENDED. A Death-Lord Reaper user who has a low output day sees DORMANT. The daily state is honest about today, not about history.

---

## 4. Progression Coins

### What Coins Are

Coins are an in-game currency earned exclusively through task and ritual completion. They are spent on weapon skins in the Dread Armory. They cannot be purchased with real money. They cannot buy streak scythes.

### Earning Rate

**Revised from v1.0: conversion rate increased from 10% to 15%.**

Rationale: At 10% conversion, an engaged user completing 2-3 meaningful tasks daily earned 50-80 coins/day. At a 5,000 coin flat skin price, that required 62-100 days — close to the 2-3 month target but with no margin for lower-output periods. At 15%, daily earning rises to 75-120 coins/day, putting the target at 42-67 days of consistent engagement. With realistic lower-output periods factored in, actual time to first skin lands at 60-90 days — exactly the 2-3 month campaign feel the pricing targets.

$$\text{Coins Awarded} = \text{Round}(\text{Base XP} \times 0.15) + \text{Round}(\text{Bonus XP} \times 0.15)$$

**Stalled Mode coins:** Stalled Mode doubles XP, which doubles coin output through the same formula. No separate modifier needed.

**Farming mitigation coins:** Farming mitigation reduces XP to 25%, which reduces coin output proportionally. No separate modifier needed.

### Expected Coin Earning by Usage Pattern

| Usage Pattern | Tasks/Day | Avg XP/Task | Daily Coins | Days to 5,000 |
|---|---|---|---|---|
| Light (1 low task) | 1 | ~150 XP | ~22 coins | ~227 days |
| Moderate (2-3 mixed) | 2.5 | ~200 XP | ~75 coins | ~67 days |
| Active (3-4 mixed) | 3.5 | ~250 XP | ~131 coins | ~38 days |
| Boss Raid heavy | 1 BR + 1 med | ~700 XP | ~105 coins | ~48 days |

Light users are not the target for coin skins. Moderate-to-active users hit the skin in 38-67 days of real engagement. This is the intended range.

---

## 5. Weapon Skin Shop (Dread Armory)

### Pricing Philosophy

All weapon skins are priced equally at **5,000 coins**.

This is a taste-based model, not a quality hierarchy model. The skins are not tiered by visual complexity or impressiveness — they are different aesthetic identities at equal prestige. A user who chooses Shadow Blade over Storm Caller is making a statement about who they are, not settling for what they could afford.

Equal pricing enforces this: there is no "right answer" skin. There is only the skin that fits the operative.

**Design requirement this creates:** The rendered assets must support equal desirability. If Storm Caller reads as objectively superior to Shadow Blade in the Dread Armory UI, the equal pricing model will feel dishonest. The descriptions and visual presentation must communicate identity differentiation, not quality hierarchy. This is a design responsibility, not a pricing fix.

### Available Skins

All skins: **5,000 🪙 each**

These skins do not dynamically evolve with daily scythe state. They are static equipped cosmetics — distinct from the base Reaper's Scythe which evolves daily.

| Skin | Visual Identity | Description |
|---|---|---|
| **Shadow Blade** | Subtle / Dark | Sleek obsidian metal wrapped in shifting semi-transparent black smoke. For operatives who move without announcing themselves. |
| **Golden Harvester** | Ornate / Warm | Ornate gilded metal with detailed sunburst engravings. For operatives who execute in full view. |
| **Cinder Reaper** | Brutal / Industrial | Charred dry gray wood shaft with iron blade tips smoldering with orange coals. For operatives who leave nothing standing. |
| **Frost Cleaver** | Precise / Cold | Carved from glacial ice with glowing white runes emitting cold fog. For operatives who operate without heat. |
| **Storm Caller** | Kinetic / Electric | Double-edged metallic white scythe with coiling electric blue lightning arcs. For operatives who move at the speed of decision. |

The one-line identity description beneath each skin is new. Its function is to frame the choice as identity selection, not visual preference. A user reading "for operatives who move without announcing themselves" is thinking about who they are, not whether the smoke effect is impressive enough to justify the price.

### What Coins Cannot Buy

- Streak scythes (any tier)
- Premium themes (Dread Armory real-money purchases)
- Regional lore unlocks
- XP boosts
- Artifact rarity upgrades

---

## 6. Streak Scythes

### Isolation Principle

Streak scythes are completely isolated from both the coin economy and the real-money shop. They cannot be purchased, gifted, or transferred. They exist in one place only: earned through unbroken daily task completion streaks.

This isolation is the founding design decision of the entire weapon system. Coin skins and daily scythe evolution provide weapon variety for all users. Streak scythes provide status that cannot be replicated through any other path. The moment a streak scythe becomes purchasable, it stops being a status symbol and becomes inventory.

### Milestone Unlocks

| Streak | Scythe |
|---|---|
| 0 days | Dormant Scythe (default) |
| 5 days | Neophyte Reaper |
| 15 days | Acolyte Reaper |
| 30 days | Reaper |
| 60 days | Executioner Reaper |
| 120 days | Sovereign Reaper |
| 200 days | Void-Walker Reaper |
| 300 days | Eternal Reaper |
| 360 days | Death-Lord Reaper |

### UI Lock State

No purchase button, no price tag, no transactional pathway exists for streak scythes in any screen. Selecting a locked streak scythe in the Forge displays:

`Locked — Requires [N]-Day Streak`

No alternative unlock path is shown. No coin equivalent is suggested. The lock message is the complete response.

---

## 7. Three-Layer Weapon System Summary

| Layer | Source | Resets | Purchasable | Identity Type |
|---|---|---|---|---|
| Daily Scythe Evolution | Daily XP output | Daily at 5AM | No | Transient — who you are today |
| Coin Weapon Skins | Coin accumulation | Never | Coins only | Aesthetic — how you choose to look |
| Streak Scythes | Unbroken streak | On streak break | Never | Permanent — what you have sustained |

Each layer operates independently. A user can have a Death-Lord Reaper equipped as their streak scythe, a Storm Caller skin active, and be at DORMANT daily state because they haven't completed a task yet today. All three are simultaneously true and non-contradictory.

---

*Document revised June 2026. Key changes from v1.0: coin conversion rate raised from 10% to 15%; all weapon skin prices standardized to 5,000 coins flat; identity framing added to each skin description; three-layer system summary added.*
