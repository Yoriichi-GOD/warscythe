# ⚔️ WARSCYTHE: Generational Execution Engine

> *"A figure carved into the stone watches with hollow eyes... The gates open slowly, resisting decades of rust."*

**Warscythe** is a high-fantasy, zero-friction productivity engine designed specifically to crush ADHD paralysis. It transforms mundane daily tasks into a tactical campaign where consistent execution evolves your digital weaponry and unlocks hidden lore.

## 🐉 Core Features

- **The Reaper's Scythe:** Your primary weapon. Completing "Operations" (tasks) levels up your Scythe from a dormant piece of wood to a shimmering Platinum blade. Miss a day, and the scythe degrades.
- **Neural Focus Mode (ADHD Special):** Break massive, overwhelming tasks into 15-minute tactical chunks using the "Recalculate" protocol. Removes the mental block of getting started.
- **Infinite Campaign Map:** A procedurally generated tactical theater. As you conquer tasks, you scout and secure new territories (Villages, Iron Jails, Castles) and face Boss nodes (Dragon Nests).
- **The Artifact Vault:** Collect rare artifacts and mount the heads of dragons you slay on your dashboard.
- **Zero-Latency Cloud Sync:** Powered by Supabase, your operative status and armory are synchronized instantly.

## 🛠️ Tactical Stack

- **Frontend:** React + Vite
- **State Management:** Zustand (w/ LocalStorage + Supabase sync)
- **Styling:** Vanilla CSS (Glassmorphism & High-Fantasy Aesthetics)
- **Animations:** Framer Motion
- **Analytics:** PostHog
- **Hosting:** Vercel

## 🚀 Deployment

This engine is pre-configured for Vercel edge deployment. Ensure you have the following environment variables active in your cloud vault (`.env`):

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_POSTHOG_KEY=...
VITE_POSTHOG_HOST=https://app.posthog.com
```

## 📐 Layout Coupling & Magic Numbers

To prevent layout collapse arising from indefinite CSS Grid/Flexbox height calculations on desktop browsers, the Scythe display area utilizes absolute positioning on desktop viewports. This creates a specific layout coupling:

* **Sidebar Width & Offset Coupling**: In both [Operations.jsx](file:///c:/Users/saart/.gemini/antigravity-ide/scratch/warlord/src/pages/Operations.jsx) and [Rituals.jsx](file:///c:/Users/saart/.gemini/antigravity-ide/scratch/warlord/src/pages/Rituals.jsx), the Scythe display area wrapper is styled with the class `lg:left-64`. This offsets the container by exactly `256px` from the left edge of the page, matching the width of the Weapon Evolution sidebar, which is styled with `lg:w-64` (`256px`). If the sidebar's width is ever altered, this absolute offset class must be updated to match.
