# PHASE 1 — RETENTION CORE
### Implementation Plan
### Target window: first 60 days post-decision

> This phase exists to answer one question with real data, not intuition: does long-term engagement actually come from mastery, not checklists? Everything below is built to produce evidence at scale, not just from your current ~57 paying users.

**Sequencing logic:** Fragments + Hall of Olympus is the load-bearing item in this phase — it's the piece every other Phase 2 feature (Triumph Cards, the Wrap) depends on having real depth behind it. Build it first. Friction Journal comes second because it's cheap to ship and starts generating the qualitative data you'll want *before* you commit engineering time to notifications and barcode verification — let it tell you what's actually causing friction rather than guessing. The polish items are low-risk and can be threaded in parallel by whoever has spare cycles.

**Suggested order:**
1. Deity Fragments + Hall of Olympus (Fitness)
2. Friction Journal
3. Notification Overhaul + Time-Specific Rituals
4. Scroll/Filter/Removal Polish (Rituals, Fitness)
5. Barcode Scan Task Verification
6. YT Video Walkthroughs

---

## 1. Deity Fragments + Hall of Olympus

**Risk: medium (design-sensitive, not just technical) | Effort: large — the biggest single build in this phase**

This is the fix for the asymmetry you've already identified yourself: Operations has a full ceremony (execute → relic → preserved memory), Fitness just says "next exercise." Everything else in Phase 2 that leans on fitness data (the Wrap, Triumph Cards) is weaker without this existing first.

### Step 1 — Data model
1. Define the deity roster and their fragment sets (you already have this: Hermes/Winged Sandals+Caduceus+Cloak, Apollo/Laurel+Lyre+Sun Disc, Ares/Helm+Spear+Banner, Hercules/Pelt+Club+Shard, Zeus/Thunderbolt+Crest+Crown).
2. Add an `affinity` field per deity per user (0–100), and a `fragments` collection tracking which pieces are unlocked.
3. Decide the affinity-gain formula *before* writing any UI. Don't gate deities behind exclusive exercise categories (e.g. "only cardio counts for Hermes") — real training doesn't work that way (a sprinter still squats), and a hard exclusion is what actually breaks the mythology, not overlap. Instead, define a **weighted contribution matrix**: every exercise type contributes to every deity, at different rates.

   Rough starting point (tune against real workout logs once live, not final numbers):

   | Exercise type | Ares | Hermes | Hercules | Apollo | Zeus |
   |---|---|---|---|---|---|
   | Heavy compound lift | high | low-mid | high | low | mid |
   | Sprint/agility | low | high | low | low | mid |
   | Endurance/cardio | low | mid-high | low | mid | mid |
   | Accessory/isolation | mid | low | mid | mid | low |

   The rule to hold the line on: no exercise type should ever give *more* affinity to a deity it's thematically wrong for than the exercise type that's actually representative of that deity — e.g. a squat session should never out-earn a sprint session on Hermes affinity. That's the actual mythology break; contribution overlap isn't.

### Step 2 — Ceremony logic (this is the part that makes it land)
1. On workout completion, run the affinity calculation server-side (or in the same trust boundary as XP/coins — don't let this be purely client-computed given your existing currency-integrity concerns).
2. At 100 affinity, trigger the "deity personally presents [artifact]" moment — this needs its own animation/modal beat, not a toast notification. This is the emotional payoff; treat it with the same weight as a boss-raid completion screen.
3. **Automatic PR detection, bundled into this same build:** when a set beats a stored previous best, surface it immediately — "NEW PERSONAL RECORD — 105kg × 5, previous 102.5kg × 5, +2.5kg" — with zero manual input from the user. The system already has every workout logged; it should never ask.

### Step 3 — Hall of Olympus (the payoff screen)
1. New view: one entry per deity, showing current affinity, completed blessings, workouts logged toward that deity, total volume, and PRs.
2. Completed deities (100 affinity reached) get a distinct "ascended" visual state — this is the "museum of your body" framing, so treat completed entries like trophies, not just filled progress bars.
3. This screen should be shareable-ready even if Triumph Cards (Phase 2) haven't shipped yet — build the data structure so a card-export layer can be bolted on later without a rework.

### Watch-out
Do not reward every rep or every workout with a drop. Ceremony requires scarcity — if fragments show up constantly, they become noise instead of meaning, and you'll have rebuilt exactly the "generic XP number" problem this feature exists to solve.

---

## 2. Friction Journal

**Risk: low | Effort: small**

Not a feature — a listening mechanism. One-line qualitative entries ("Today I had to copy something twice," "Today I switched between three apps") that a dashboard can't surface.

### Implementation steps
1. Single-input capture point — one line, one tap, no multi-field form. If this requires more than ~5 seconds of user effort, it will not get used and the whole point of low-friction listening is defeated.
2. Storage: simple timestamped log per user, no complex schema needed at this stage — this is a data-gathering tool, not a user-facing analytics feature yet.
3. Placement: surface it at a natural pause point (end of day, after a completed operation) rather than as a persistent nag — test whether a gentle end-of-session prompt outperforms an always-visible button.
4. **Internal-only for now:** don't build a review/analytics UI for this yet. Export raw entries periodically and read them yourself — that's the entire Phase 1 scope. A structured review dashboard is Voice of User System territory (Phase 3), not this.

### Watch-out
The moment this feels like a form, it becomes homework — the exact thing Warscythe exists to not be. If early usage data shows low completion, cut the friction further before adding features to it.

---

## 3. Notification Overhaul + Time-Specific Rituals

**Risk: medium (touches scheduling infra, platform-specific quirks) | Effort: medium**

### Implementation steps
1. Add a scheduled-time field to rituals (currently rituals likely lack a specific time-of-day binding — confirm current schema first).
2. Local notification scheduling tied to that time, respecting platform constraints (iOS background execution limits are stricter than Android — test both, don't assume parity).
3. Notification copy should stay in-world (Guardian voice / mythology language), consistent with the rest of the app's tone — a generic system notification breaks immersion at the exact moment you're trying to pull someone back in.
4. Build a lightweight de-duplication/rate-limit check so a user with many time-bound rituals doesn't get notification-fatigued into disabling all of them — this is the single most common way notification systems kill their own usefulness.

### Watch-out
Get this wrong (too frequent, too generic, mistimed) and it actively drives uninstalls rather than retention — this is the highest-blast-radius item in Phase 1 if shipped carelessly. Roll out to a small user segment first if you can, before going to everyone.

---

## 4. Scroll/Filter/Removal Polish (Rituals, Fitness)

**Risk: low | Effort: small, but several small items — track as a checklist, not one ticket**

- Scrollbar for active rituals when list exceeds visible space
- Scrollbar/blur treatment for fitness log on scroll
- Scrollbar for mission-in-progress on phone screens (reference the rituals pattern once built, for consistency)
- Ritual removal option on phone

### Implementation notes
Build the ritual scroll pattern once, then reuse the same component/styling approach for fitness and mission-in-progress rather than solving each individually — you flagged "take reference from rituals" yourself, so treat this as one shared scroll/overflow component, not three separate fixes.

---

## 5. Barcode Scan Task Verification

**Risk: medium (scope creep risk is the main danger, not the tech itself) | Effort: medium**

### Implementation steps
1. **Scope narrowly first** — pick one category (e.g. a specific fitness supplement or a specific recurring ritual) rather than building a generalized verification system for all task types.
2. Use a standard barcode/QR scanning library (native camera API — this is well-trodden ground, don't over-engineer it).
3. On scan, match against a whitelist or pattern tied to the specific verified task, mark completion with a "verified" flag distinct from a normal self-reported completion.
4. Decide whether verified completions carry any extra weight (bonus XP, a distinct visual marker) — if they do, make sure that doesn't create an incentive to game the scan itself (e.g. scanning the same barcode repeatedly without doing the actual task).

### Watch-out
A half-built verification system that fails often (bad scan reliability, unclear error states) is worse than no verification at all — it introduces friction into exactly the moment (task completion) where friction is most costly. Ship this only after the narrow scope works reliably, then consider expanding.

---

## 6. YT Video Walkthroughs

**Risk: low | Effort: medium (content production, not engineering)**

### Implementation steps
1. Script one walkthrough per major system (Operations, Rituals, Fitness/deities once shipped, Forge, Legion) — keep each short and focused on one system rather than one long onboarding video.
2. Link relevant videos contextually inside the app (e.g. a small "how this works" icon near each system) rather than only publishing externally — this serves onboarding *and* discovery simultaneously.
3. Treat these as dual-purpose from day one: they're onboarding material inside the app and top-of-funnel discovery content on YouTube/Shorts for people who've never heard of Warscythe. Script and shoot with both audiences in mind — don't produce an internal-only tutorial and repurpose it later.

### Watch-out
Sequence this after Fragments/Hall of Olympus ships — a walkthrough of the fitness section made before the deity system exists will need to be redone. Film the systems that are actually stable first.

---

## Definition of Done for Phase 1

- [ ] Deity affinity system live, ceremony-gated (not per-rep), Hall of Olympus screen shows all five deities with accurate progress
- [ ] Automatic PR detection surfaces with zero manual input
- [ ] Friction Journal capturable in under 5 seconds, entries being collected and reviewed
- [ ] Time-specific ritual notifications live on both iOS and Android, rate-limited, in-world copy
- [ ] Scroll/filter/removal fixes shipped across rituals, fitness log, and mission-in-progress
- [ ] Barcode verification working reliably for its initial narrow scope
- [ ] Core system walkthrough videos published and linked contextually in-app

Once these are done, you'll have real retention data on whether the mastery-over-checklists thesis holds — which is what should determine how aggressively Phase 2 (monetization) gets built, rather than building it on faith.
