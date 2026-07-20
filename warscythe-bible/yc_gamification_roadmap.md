# Warscythe: YC Gamification & Social Roadmap

This document outlines the design concepts and architecture models for the future features planned post-YC application results, focusing on retention hooks, monetization loops, and viral sharing mechanics.

---

## 1. Strava-style "Trophy Share" Card Engine (Viral Loop)

To build organic growth, operatives need a high-aesthetic way to showcase their discipline. Similar to how Strava users share route maps, Warscythe will generate personalized **Triumph Cards** for completed tasks, workouts, and boss raids.

```
┌────────────────────────────────────────────────────────┐
│ [TRANSMISSION SECURED]                      WARSCYTHE  │
│                                                        │
│               [ REGION 3: STONEHOLLOW ]                │
│                                                        │
│     *============================================*     │
│     |                                            |     │
│     |               (Dragon Art PNG)             |     │
│     |                                            |     │
│     *============================================*     │
│                                                        │
│  OPERATIVE: Yoriichi1        STRIKE: Slack Hackathon   │
│  TIME IN FOCUS: 90 MIN       DIFFICULTY: BOSS RAID     │
│  RESCUED: Fairy Lyra         NET WORTH: 14,500 COINS   │
└────────────────────────────────────────────────────────┘
```

### Technical Implementation:
* **Canvas Synthesis:** We will use `html2canvas` or a lightweight canvas rendering wrapper. When a task is conquered (especially a Boss task), a hidden template DOM element is compiled dynamically:
  * **Background:** The active regional background image (e.g. Lava Citadel or Ironveit).
  * **Centerpiece Asset:** The specific PNG of the defeated dragon or the liberated fairy.
  * **Performance Overlay:** Tonnage lifted (Fitness), Focus sessions completed (Operations), or Streak status (Rituals).
* **Native Export Plugins:**
  * **Web:** Standard blob conversion with a direct `.png` download trigger.
  * **Mobile:** Uses `@capacitor/share` to open the native OS share sheet directly (allowing direct, one-tap sharing to Instagram Stories, WhatsApp, or Twitter).

---

## 2. Character Archetype wrapped reviews (Retention Hook)

An annual review analyzing execution metrics from the ledger database to classify user behavioral patterns into one of **12 Legendary Archetypes**.

### Behavioral Mapping Matrix:
* **The Gladiator / Berserker:** High concentration in the Fitness log, heavy tonnage focus.
* **The Tactician / Sentinel:** Dominated by complex, micro-stepped solo operations.
* **The Templar / Unyielding:** Unbroken habit streak records inside the Rituals database.
* **The Dragon Slayer:** Repeatedly targets Boss-level tasks and regional leaders.
* **The Void-Walker:** Long focus sessions in complete silence (Focus Mode active, soundscapes off).

---

## 3. Gold/Silver Pass & The Night Market (Monetization Loop)

* **Progression Tiers:** Standard seasonal progression tracker. Completing daily strikes and habits earns Pass Points. Reaching tiers unlocks exclusive scythe wraps, visual frames, soundscape tracks, and badges.
* **The Saturday Night Market:** A rotating showcase that opens every Saturday. Supabase dynamically seeds a list of 4 random premium cosmetics heavily discounted for 24 hours to drive weekend logins.

---

## 4. Social Command Hub & Profile Visiting (Accountability Layer)

* **Operative Graph Visits:** Click a friend's card on the leaderboard to load a read-only inspect panel showing:
  * Their currently equipped scythe skin and visual layout themes.
  * Equipped profile badges, custom player titles, and visual frames.
  * **Artifact Net Worth:** A calculated summation of their vault collection value.
* **Garrison Cooperatives:** Pinned Legion Tasks positioned at the top of Legion Command for synchronized operations.
I actually think you've done something smart here.

The list isn't "features."

It's a **parking lot**.

And for a product like Warscythe, that's valuable because it prevents you from continuously expanding the scope before you've validated the current experience.

If I were organizing this after the YC application, I'd group it by *what problem it solves*, not by when you thought of it.

---

# 1. Retention & Long-Term Motivation ⭐⭐⭐⭐⭐

These deepen the reason to come back every day.

* Gold Pass
* Silver Pass
* Night Market (Saturday rotation)
* Bundle System
* Streak unlocks (20/30 day milestones)
* Boss Raid music
* Achievement system
* Category milestones
* No rewards, just prestige levels

These all strengthen:

> **"I want to return tomorrow."**

---

# 2. Identity & Self-Expression ⭐⭐⭐⭐⭐

This is where Warscythe starts becoming a social identity.

* Artifact Net Worth
* Profile visiting
* Scythe flex
* Artifact showcases
* Frames
* Badges
* Warrior Archetype yearly wrap

I particularly like the yearly wrap.

Not because of virality.

Because it answers a deeper question.

Instead of asking

> "What did I complete?"

It asks

> **"Who did I become this year?"**

That's a much richer reflection.

---

# 3. Productivity Infrastructure ⭐⭐⭐⭐☆

These reduce friction.

* Widgets
* Pinned Legion tasks
* PDF exports
* PNG share cards
* Graphs
* Meal prep
* Fat loss tracking

These are practical.

They don't need fantasy to justify themselves.

---

# 4. Lore Expansion ⭐⭐⭐⭐☆

This is where your game becomes a world.

I LOVE this section.

Especially:

* Knight journals
* Dragon research notes
* Letters between Empresses
* Contradicting myths
* Liberation poems

Notice these aren't exposition.

They're discoveries.

That's much more engaging.

---

# 5. Community & Viral Loops ⭐⭐⭐⭐☆

These create reasons to share.

* Yearly Wrapped
* PNG flex cards
* Artifact Net Worth
* Profile visits

People naturally compare themselves.

---

# My favourite idea

Without hesitation:

## Warrior Archetype Wrap

Not because it looks cool.

Because it closes an entire year's story.

Imagine opening Warscythe every January.

Instead of:

```
Completed Tasks:
847
```

You get:

---

## Your Warrior Archetype

> **The Dragon Scholar**

You repeatedly returned to forgotten regions.

You completed long-form creative operations.

Your longest streak lasted 81 days.

You equipped Frost relics more than any other artifact.

Your greatest campaign was:

**An Unattended Coffee**

---

That's memorable.

---

# Another sleeper hit

Night Market.

Not because Fortnite has it.

Because it creates anticipation.

Every Saturday:

> "Let's see what's here."

Even if someone buys nothing.

They still opened the app.

That's important.

---

# One thing I'd delay

Battle Pass.

Not because it's bad.

Because Battle Passes work best once:

* retention exists
* economy exists
* cosmetics exist
* users understand progression

Right now I'd rather polish the current progression before adding another layer.

---

# What I loved most

Actually this line:

> **"Currently want to focus on the things we already have."**

That's probably the biggest difference I see compared to a few months ago.

Earlier, every conversation ended with ten new ideas.

Now you're saying:

> "They're in the vault."

Ship.

Observe.

Learn.

Then unlock the vault.

That's exactly how feature lists should be treated.

---

## If this were my roadmap after YC

I'd honestly do it in this order:

**Wave 1 (Retention)**

* Achievement System
* Pinned Legion Tasks
* Widgets
* Graphs

**Wave 2 (Identity)**

* Profile Visits
* Artifact Net Worth
* Frames
* Flex Profiles

**Wave 3 (World Building)**

* Lore Journals
* Letters
* Myths
* Boss Music

**Wave 4 (Seasonal)**

* Night Market
* Gold/Silver Pass
* Bundle System

**Wave 5 (Annual Event)**

* Warrior Archetype Wrapped

The reason I'd put the yearly wrap last is simple: it becomes much more meaningful when users have a year's worth of history. If someone has only been using the app for two weeks, the archetype won't tell much of a story. After twelve months of operations, streaks, regions, and artifacts, it becomes a genuine reflection of how they naturally worked.

Looking at this list as a whole, what stands out isn't the number of ideas—it's that almost every one fits one of the philosophies you've been talking about for months: reduce friction, deepen identity, or make progress feel meaningful. That's a much healthier backlog than a collection of unrelated features.
