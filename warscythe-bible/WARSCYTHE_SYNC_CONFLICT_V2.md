# WARSCYTHE_SYNC_CONFLICT_V2.md

> **Status:** Deferred — Scheduled for post-YC sprint (target: week of July 28, 2026)
> **Priority:** High Engineering Value | Moderate Immediate Product Risk (see Risk Framing below — revised from original "low risk" assessment)
> **Author:** Warscythe Engineering
> **Revision:** v2.0 (refined for implementation readiness)
> **Created:** July 2026

---

## How to Use This Document

This is an **implementation ticket**, not a design essay. It is sequenced in four phases that must be executed in order — each phase is a prerequisite for the next. Do not start Phase 2 before Phase 1 is merged and verified. Do not attempt to build all four phases in one sitting; this is a multi-day sprint, not a spree.

If you are an engineer (human or agent) picking this up cold, read **Section 1 (Current State)** first. It is accurate as of July 2026 and has been verified against the live codebase — do not assume any domain separation exists until Phase 1 ships.

---

## 1. Current State (Verified, Not Aspirational)

This section was previously mislabeled "Existing Architecture" and incorrectly described a domain-separated schema that does not exist. Corrected below.

### 1.1 The Giant Profile JSONB

All personal offline-first game-loop state lives in a **single `state` JSONB column** on the `profiles` table:

- `tasks` & `completedTasks` (Operations)
- `rituals` (Rituals)
- `gymLog` & `activeWorkout` (Fitness)
- `collectedArtifacts` & `coins` (Inventory)
- `xp`, `level`, `scytheLevel`, `streakCount` (Statistics)
- `soundscapeEnabled`, `activeTheme` (User Settings)

Every sync call overwrites this entire column in one query:

```javascript
supabase.from('profiles').upsert({
  id: u,
  state: payload,           // full object, every domain, every time
  updated_at: new Date().toISOString()
});
```

There is no per-domain addressability at the database level. The client may structure `payload` internally as `{ operations: {...}, fitness: {...} }`, but Postgres sees one opaque blob. Two devices syncing this column concurrently will silently overwrite each other's *entire* state — not just the domain each device actually touched.

### 1.2 The Relational Exceptions (Proof of Pattern)

Cooperative and multi-user features are **already** stored in separate, independently-writable Postgres tables, because concurrent multi-user writes made a single blob unworkable there:

- `legions`, `legion_members`, `legion_operations`, `legion_subtasks`
- `leaderboard_snapshots`
- `friendships`
- `user_unlocks`, `user_entitlements`

**Why this matters for this ticket:** this is not a novel migration. It is the same domain-separation pattern already shipped and working in this codebase, applied to the one remaining place it's missing. Cite this prior art when scoping effort — it de-risks the estimate.

---

## 2. Risk Framing (Revised)

The original framing described the failure mode as requiring "multiple devices, both offline independently, both progressing significantly, synchronizing much later" — a rare, low-frequency scenario.

**Corrected trigger condition:** the failure mode does not require offline divergence at all. It requires only **two active sync-capable sessions overlapping in time** — e.g., a phone and a laptop both open for a few minutes, or two browser tabs. Given the current debounce-then-sync behavior, any overlap window where both sessions write is sufficient to produce a silent full-state overwrite of one session's changes by the other.

This is a materially higher-frequency scenario than "rare multi-device divergence," and the deferral decision should be made with that understood — not as a reason to abandon the deferral, but so the priority is set on accurate information. At current DAU (~100), the actual incidence is still low. Re-evaluate this deferral if DAU grows materially or if any support/feedback signal suggests users are losing data across devices.

---

## 3. Golden Rule (Unchanged)

> User effort must never disappear.

The server should reject duplicate rewards. It should never reject legitimate work.

---

## 4. Implementation Phases

Execute in order. Each phase should be a separate PR, separately tested, before starting the next.

### Phase 1 — Schema (Prerequisite for everything else)

Split the single `state` JSONB column into independently-writable domain columns (or separate tables, if a domain later needs relational queries — e.g., Statistics may eventually want indexed queries):

```
profiles.operations_state   jsonb
profiles.fitness_state      jsonb
profiles.rituals_state      jsonb
profiles.inventory_state    jsonb
profiles.statistics_state   jsonb   -- see note: derived, may not need own writes
profiles.settings_state     jsonb
```

**Deliverable:** migration script + updated Supabase types. No client behavior changes yet — this phase only prepares the schema. Verify old `state` column and new columns can coexist during transition (dual-write or backfill approach — decide and document before writing the migration).

**Exit criteria:** schema migrated in a staging/dev Supabase project, existing single-blob data successfully backfilled into new columns with no data loss, verified by spot-checking a handful of real user profiles.

### Phase 2 — Migration Script

Backfill existing `profiles.state` data into the new domain columns for all existing users. This is a one-time data migration, not a code change.

**Deliverable:** idempotent migration script (safe to re-run), a dry-run mode that reports what *would* change without writing, and a rollback plan.

**Exit criteria:** script run against a full copy of production data (not production itself), diffed against expected output, zero data loss confirmed.

### Phase 3 — Per-Domain Merge Functions

Update `saveUserState` (or split it into per-domain save functions) so each domain syncs independently to its own column. Apply the merge strategy per domain as follows — these are unchanged from the original design and remain sound:

| Domain | Merge Strategy |
|---|---|
| Operations | Union by Task UUID. Existing UUID → ignore duplicate. New UUID → append. Never overwrite. |
| Fitness | Treat workouts as immutable events, merged by chronological order. Nothing deleted. |
| Rituals | Merge by (Date + Ritual UUID). Same ritual/date pair cannot be rewarded twice. |
| Inventory | Merge by Item UUID. Artifact duplicates allowed only if earned independently — never duplicate identical reward events. |
| Statistics | Always derived server-side after sync completes. Never manually merged or client-written. |
| Settings | Latest intentional change wins (last-write-wins is correct here — these are preferences, not progress). |
| Region Progress | Cloud authoritative. Local progression is provisional until server confirms. |

**Every task/event carries permanent metadata**, unchanged from original design:
- Event UUID
- Task UUID
- Device UUID
- Local Sequence Number
- Created Timestamp
- Sync Timestamp
- Sync Status

Task UUIDs never regenerate on local→cloud sync — only sync status changes (`pending → uploaded → confirmed`).

**Ordering** for deterministic replay when timestamps collide: Occurred Timestamp → Device Sequence → Device UUID → Task UUID.

**Deliverable:** per-domain save functions, each independently debounced and independently mutex-locked (reuse the single-flight lock pattern already shipped in the infinite-spinner fix — apply it per domain, not globally, so a Fitness sync doesn't block an Operations sync).

**Exit criteria:** manually reproduce two-device concurrent writes to *different* domains (e.g., complete a task on Device A, log a workout on Device B, both within the same debounce window) and confirm both survive. Then reproduce concurrent writes to the *same* domain on two devices and confirm the union-merge produces correct results with no data loss, per the table above.

### Phase 4 — Server-Derived Progression (Hardest phase, do last)

This is the actual load-bearing piece of the whole design, and the one most likely to be underestimated. Statistics, XP, Level, and Key-issuance logic currently live client-side and get shipped up as part of derived state. For the "server owns progression" model to hold, this logic must move server-side (Supabase Edge Function or equivalent) so a client can never independently assert "I earned Key 4" — it can only assert "I completed Task A," and the server computes whether that completion crosses a Key threshold.

**The Fourth Key scenario this solves:** Device A completes Task A in Region 4 and computes Key 4 locally. Device B completes Task B in Region 4 and also computes Key 4 locally. Without server-side derivation, both keys sync and duplicate. With it: server receives both task completions, counts total unique completions server-side, recomputes progression once, and issues one canonical Key 4.

**Deliverable:** an Edge Function (or equivalent) that, on receiving accepted task-completion events, recomputes derived state (XP, Level, Keys, Region unlocks) and writes the canonical result back — the client never computes these values as source of truth, only as an optimistic local preview.

**Exit criteria:** reproduce the Fourth Key scenario above manually (two devices, same region, different tasks, synced close together) and confirm exactly one Key 4 is issued, both tasks are retained, and no XP is duplicated or lost.

---

## 5. What This Design Explicitly Rejects (Unchanged, Still Correct)

- Profile overwrite / "newest profile wins" / "highest level wins" — these are exactly what the current single-blob architecture does today, and exactly what Phase 3–4 eliminate.
- Duplicate XP or duplicate Keys.
- Lost workouts, lost Operations, or any silently discarded user effort.

---

## 6. Conflict Resolution — When to Ask the User

Automatic merge should always be attempted first, per the per-domain rules in Section 4. Prompt the user **only** when the same object was edited *differently* on two devices — e.g., an Operation's deadline changed to two different values, or its title renamed differently on each device. These are genuine human-judgment conflicts. Everything else (the vast majority of real-world cases) should merge automatically without any user-facing prompt.

---

## 7. Explicitly Out of Scope for This Ticket

- Full event-sourcing rewrite. This ticket adds domain separation and server-derived progression — it does not require re-architecting the entire client as an event-sourced system. Revisit CRDTs/OT/event-sourcing as a *future* research track only if Phase 1–4 prove insufficient at scale.
- Any change to the Legion, Leaderboard, Friendship, or Billing tables — these are already correctly separated and are not part of this migration.
- UI/UX for the manual-conflict-resolution prompt in Section 6 — build this only once real conflicts of that type are observed in telemetry; don't design it speculatively.

---

## 8. Sequencing Note (Why This Order, Specifically)

Schema must come first because nothing else is buildable against the current single-blob column — Phase 3's merge functions have nothing to address independently until Phase 1 exists. Migration (Phase 2) must follow schema and precede merge functions, because Phase 3's exit criteria require testing against real backfilled data, not empty new columns. Server-derived progression (Phase 4) is last and hardest deliberately: it's the piece most likely to be underestimated, and attempting it before Phases 1–3 are stable means debugging two unstable systems at once.

## 9. Final Philosophy

> Every completed task represents human effort.

Warscythe must never discard genuine effort. The user's work is sacred. Synchronization exists to preserve it — not replace it. The cloud should remember every battle the warrior fought, regardless of which battlefield it was fought on.
