# ⚔️ Warscythe

> *"A figure carved into the stone watches with hollow eyes... The gates open slowly, resisting decades of rust."*

**Warscythe** is a high-fantasy, zero-friction execution engine designed to crush ADHD paralysis. It transforms mundane daily tasks into a tactical campaign where consistent execution evolves your digital weaponry and unlocks deep, hidden lore.

*Built for the Y Combinator cycle.*

---

## 📖 The Philosophy

We don't build "productivity apps." We build **games**. 

- **The Game Box Model:** The browser landing page is the priority. It is the narrative entry point that sets the tone, the lore, and the stakes. The app itself is the execution engine.
- **No Demos, Only Play:** Like a AAA game, you don't "demo" Warscythe. You download it, play it, or watch YouTube walkthroughs.
- **Zero Friction Execution:** Designed specifically for ADHD brains. Break massive, overwhelming tasks into 15-minute tactical chunks using the "Recalculate" protocol, instantly removing the mental block of getting started.

---

## ⚙️ Engineering & Architecture

Warscythe is engineered for zero-latency, offline-first execution, backing a high-fidelity React frontend wrapped for native deployment.

### The Stack
- **Frontend Engine:** React 19 + Vite 8
- **Native Wrapper:** Capacitor 8
- **State Management:** Zustand 5 (Local-first, reactive stores)
- **Backend & Auth:** Supabase (PostgreSQL)
- **Analytics & Telemetry:** PostHog
- **Transactional Email:** Resend
- **Hosting & Delivery:** Vercel (Edge deployment)

### Sync V2: The Core Engine
The beating heart of Warscythe is a custom, offline-first synchronization engine designed for absolute data integrity across devices.
- **Monotonic Reconciliation:** Custom PL/pgSQL RPCs (`sync_warscythe_domain`) handle complex, multi-device merge conflicts at the database layer (e.g., Device A completes a ritual offline while Device B edits its title, merging seamlessly without data loss).
- **Strict Idempotency:** Utilizing UUID-based primary keys and `ON CONFLICT DO NOTHING` patterns to guarantee zero double-counting of XP or progression, even during offline-batch retry storms.
- **Domain Segmentation:** Sync payloads are segmented (Operations, Rituals, Inventory, Fitness, Settings) with isolated `FOR UPDATE` row-level locks, ensuring massive parallel sync requests never collide.

---

## 🐉 World Building & Lore

Every interaction in Warscythe is rooted in a meticulously crafted dark-fantasy universe.

- **The Reaper's Scythe:** Your primary weapon. Completing "Operations" (tasks) levels up your Scythe from a dormant piece of wood to a shimmering Platinum blade. Stagnate, and the scythe degrades.
- **Rituals & The Fourth Key:** Daily habits that generate specific energies. Master them to forge the Fourth Key, unlocking the deepest tiers of the world.
- **The Legion & The Map:** An infinite, procedurally generated tactical theater. As you execute tasks, you scout new territories (Villages, Iron Jails, Castles), rescue fairies, collect rare Artifacts, and mount the heads of slain dragons in your Vault.

---

## 🚀 Setup & Deployment

Warscythe is pre-configured for Vercel edge deployment and Capacitor native builds. 

**Environment Variables (`.env`):**
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_POSTHOG_KEY=your_posthog_key
VITE_POSTHOG_HOST=https://app.posthog.com
```

### Layout Coupling Notice
To prevent layout collapse from indefinite CSS calculations, the Scythe display area utilizes absolute positioning on desktop viewports. The wrapper uses `lg:left-64` (offset 256px), strictly coupled to the Weapon Evolution sidebar (`lg:w-64`). If sidebar width changes, this offset must be synchronized.

---

*Engineered by a 19-year-old first-time founder. 80 WAUs projected by the end of Week 1.*
*No faked data. Just pure execution.*
