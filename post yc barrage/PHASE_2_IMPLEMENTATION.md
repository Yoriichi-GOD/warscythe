# PHASE 2 — IDENTITY & MONETIZATION
### Implementation Plan
### Target window: months 2–5 post-decision

> This is where "we gamify identity" stops being a slogan and becomes a business model. Sequence matters more in this phase than any other — sharing something with no depth behind it is a one-time flex; sharing something backed by Phase 1's Fragments/Hall of Olympus is a recurring one. Don't open the Pass system before Triumph Cards exist, and don't launch Triumph Cards before Phase 1's ceremony-driven progression is live and stable.

**Sequencing logic:** Loginless entry goes first because it's a pure funnel fix that makes every acquisition channel below it convert better — building Triumph Cards before fixing the signup wall means your growth engine dumps traffic into a leaky funnel. Triumph Cards comes second because it's the actual distribution engine and the rest of the phase (Pass, Night Market) benefits from having real share-driven traffic before you start monetizing it. Monetization tiers and the Meal Prep layer can run in parallel with those two since they don't depend on either. The Pass/Colosseum system and Night Market come after Triumph Cards is proven, because the mythology framing that makes the Pass defensible needs an audience that already understands the world. The Wrap gets its data pipeline built early but doesn't actually launch until you have a full year of clean data — build the infrastructure now, ship the feature later.

**Suggested order:**
1. Loginless / Local-First Entry
2. Triumph Cards / Screenshot Engine
3. Monetization Tiers (Elite Status / Divine Intervention / Combo)
4. Meal Prep / Fat Loss Ritual Layer
5. Achievement System + Boss Raid Music (quick wins, thread in parallel)
6. Profile Visiting + Artifact Net Worth
7. Colosseum-Framed Pass System (Gold/Silver/Free)
8. Night Market
9. Lore Fragments / Journal Discoveries + Artifact Lore Bible
10. Warrior Archetype Yearly Wrap (infra now, launch later)

---

## 1. Loginless / Local-First Entry

**Risk: high (technical) — this is the item most likely to cause a real trust-destroying bug if rushed | Effort: large**

### Step 1 — Local identity layer
1. Generate a permanent local identity on first launch: `local_user_id`, `device_id`, `installation_id`, `created_at`.
2. Anonymous users get the full meaningful core: create Operations, create Rituals, complete tasks, earn XP/coins, evolve the Scythe, explore Fitness, unlock early progression — all running through the same domain models as authenticated users, just with a nullable cloud identity instead of a separate "guest app" codepath.
3. Persist to IndexedDB (or native persistent DB on mobile) — not plain `localStorage`. Persist the operation ledger itself, not just a final snapshot, so the merge in Step 3 has full history to reconcile against.

### Step 2 — Prompt for login only at meaningful moments
Not on a timer. Trigger points: first completed Operation, first Artifact unlock, attempting to join a Legion, opening Social, switching devices, before any real-money purchase, roughly 5–10 completed tasks in. Copy should protect, not gate: *"Your legend currently lives only on this device. Bind it to protect your progress and enter the Legions."* Never "create an account to continue."

### Step 3 — Merge logic (the dangerous part — build this carefully)
1. Design `claimLocalProfile({ localProfileId, authenticatedUserId, operationLedger, clientMutationId })` as an idempotent operation from day one — it will get retried, plan for that up front rather than patching it in later.
2. Handle the case where an authenticated account already has its own history: don't blindly overwrite either side. Merge completed Operations/Rituals/rewards without duplicating canonical completions, using your existing earliest-canonical-completion logic as the base.
3. **Currency is the actual risk here.** XP and coins should be recomputed or server-validated on merge, not summed client-side — a naive sum is exploitable and also just plain wrong if either side has partial/corrupted state.
4. Explicit rules needed for: streaks, purchased Scythes, equipped theme, unlocked artifacts, progression gates, conflicting task edits, deleted records. Write these rules down before writing the merge function, not while debugging it.

### Step 4 — Purchases
Require login before any real-money transaction — let anonymous users browse, preview, and equip free content, but bind at checkout: *"Bind this Scythe to your legend so it can never be lost."* This reads as protective, not obstructive.

### Step 5 — Landing page
Compact: hero visual, one-line thesis, "Enter the Realm" (primary) / "Sign in" (secondary), small privacy note. Don't front-load 40 regions and the full feature set — let the product reveal itself after entry.

### Watch-out
This is the one item in the entire roadmap where a bug doesn't just annoy a user, it can silently destroy someone's progress. Test the merge path adversarially — retries, partial network failures, two devices claiming the same local profile — before this goes anywhere near production traffic.

---

## 2. Triumph Cards / Screenshot Engine

**Risk: medium (rendering/export edge cases) | Effort: medium-large**

This is the highest-leverage single item in the whole roadmap — the actual growth engine, not a nice-to-have.

### Implementation steps
1. **Canvas synthesis:** on completion of a qualifying event (boss raid, long focus session, streak milestone, deity ascension from Phase 1), compile a hidden template DOM element using `html2canvas` or an equivalent lightweight renderer.
2. **Card contents:** regional background art, the specific artifact/dragon/deity asset relevant to the achievement, and a performance overlay (time in focus, tonnage, streak status) — pull this from data structures Phase 1 already built (Hall of Olympus, ledger) rather than computing fresh.
3. **Export paths:**
   - Web: blob conversion → direct `.png` download.
   - Mobile: `@capacitor/share` → native OS share sheet, one tap to Instagram Stories/WhatsApp/Twitter.
4. **Privacy discipline, non-negotiable:** the card shows the *achievement*, never task detail/content. Build the template so it's structurally impossible to leak task text onto a card — don't rely on a copy-review process to catch this later.
5. Trigger qualifying events narrowly at first (boss raids, defined milestones) rather than every single completion — a card generated for everything becomes noise and undermines the "this is worth sharing" framing.

### Watch-out
Ship this *after* Phase 1's Fragments/Hall of Olympus is live and stable — a Triumph Card of a boss raid alone is good, but paired with "3rd Hermes Blessing this month" it's a materially stronger share. Sequence discipline here directly affects how well this performs as a growth channel.

---

## 3. Monetization Tiers — Elite Status / Divine Intervention / Combo

**Risk: medium | Effort: medium (Elite Status) to large (Divine Intervention, AI-dependent)**

### Elite Status (ad-free)
1. Keep the pitch exactly as minimal as originally framed: ad-free experience + "you're supporting the vision." No fake feature gates behind this tier.
2. Implementation is mechanically simple — ad-serving toggle tied to subscription status. The discipline required here is restraint, not engineering.

### Divine Intervention (AI fitness/meal plans)
1. Build the intake questionnaire using actual domain knowledge (training splits, research-backed principles) rather than a generic LLM wrapper prompt — this is the stated competitive differentiator, so the questionnaire design deserves real time, not a rushed first pass.
2. Requires workouts logged *before* the user enters the gym to unlock — decide the UX for this gating clearly (is it a session-by-session requirement, or a one-time onboarding log?).
3. This is the one place in the roadmap that genuinely needs LLM/AI integration — scope the inference cost model before committing to a price point, since this tier needs to cover its own infrastructure cost, unlike Elite Status.

### Combo tier
Straightforward bundling of the above two once both exist independently — don't build combo-specific logic beyond entitlement stacking.

### Watch-out
Don't let Divine Intervention's AI output feel generic — that's precisely the failure mode you're positioning against (competitors giving mediocre, one-size-fits-all plans). If the first version isn't meaningfully better-tailored than a free workout template site, delay launch rather than ship something indistinguishable from the competition you're arguing against.

---

## 4. Meal Prep / Fat Loss Ritual Layer

**Risk: low | Effort: medium**

1. Build this as a ritual-style section inside Fitness — plain meal logging, not AI-driven at this stage. This is explicitly the missing half of the fitness vertical by your own assessment.
2. Keep the data model compatible with what Divine Intervention will eventually consume — if this is built as a disconnected bolt-on, the AI layer above has to be retrofitted onto messy data later.
3. No need for calorie-database integration complexity yet — start with structured logging (what/when) and let Phase 3+ decide if a full nutrition database is worth the maintenance cost.

### Watch-out
This needs to exist *before* Divine Intervention launches, not after — the AI tier is meant to work with real tracked data, not start cold.

---

## 5. Achievement System + Boss Raid Music

**Risk: low | Effort: small — genuine quick wins, thread these in whenever engineering has slack**

- Achievement system: "first task in category," "first streak scythe," multi-streak categories, no rewards attached — pure prestige. Build as a flag-and-display system against existing ledger data; no new gameplay logic required.
- Boss raid music / category-specific soundscapes: audio asset work plus trigger logic tied to existing task-difficulty tagging. Cheap to build, raises perceived production value disproportionately to its cost.

---

## 6. Profile Visiting + Artifact Net Worth

**Risk: medium (the "no cosmetic leaderboard" line needs to be enforced structurally) | Effort: medium**

### Implementation steps
1. Read-only inspect panel, reachable from a friend's card on the leaderboard/friends list, showing equipped scythe skin, active theme, badges, frames, titles.
2. Artifact Net Worth: calculated summation of unlocked premium themes, cosmetic skins, and trophies — a derived/computed value, not a stored one, so it stays accurate as new cosmetics ship.
3. **The model (confirmed, PUBG Mobile-style):** you can visit anyone's inventory and see their cosmetics — pure visibility, no scoring implication. The leaderboard is a fully separate system driven only by season performance (streaks, tasks, consistency). Artifacts are visible; they never feed the score.
4. **Structural rule:** keep these as genuinely separate systems, not just separately-displayed data — different endpoints/queries for "profile inventory" vs. "leaderboard rank," no shared computed object between them. This isn't about the design being wrong — it's that "visible but non-scoring" rules tend to blur later not through a deliberate decision, but through someone adding a convenience feature (e.g. a "sort by net worth" filter) without registering it as touching the leaderboard at all. Structural separation makes that mistake much harder to make by accident.

### Watch-out
The rule itself is sound and matches how cosmetic-only-flex systems already work elsewhere (PUBG Mobile inventory vs. season rank is the clean comparison). The risk is purely in maintaining the separation as the codebase grows — own "artifact visibility" and "leaderboard score" as different systems from day one so they can't accidentally merge under future feature pressure.

---

## 7. Colosseum-Framed Pass System (Gold / Silver / Free)

**Risk: high (framing failure = monetization model damages trust) | Effort: large**

### Step 1 — Season definition, before any pass logic
Each season needs its own named mythology (Gem Kingdom, Eclipse Monastery, etc.) — theme, soundtrack direction, exclusive scythe/artifact concepts — defined *before* the pass tier structure is built. The pass wraps around the season, not the other way around.

### Step 2 — Tier structure
1. Gold / Silver / Free tiers, each with separate leaderboards — Gold competes against Gold, Silver against Silver, Free has its own. No tier is disadvantaged relative to another in terms of core mechanics; only cosmetic reward density differs.
2. **The actual price justification (confirmed):** Gold costs more than Silver for exactly one or two extra cosmetics that season — an additional theme, or a gold-edition variant of that season's scythe. Nothing else. No leverage, no power, no gameplay advantage of any kind. Keep this as the literal spec, not just a principle — when writing the reward table for each tier, the delta between Gold and Silver should be countable on one hand and entirely cosmetic.
3. A combined season-wide leaderboard also exists, where a Free-tier player can outrank paid players purely on discipline metrics (streak, consistency, task volume) — this is the proof point that money doesn't buy the thing that actually matters.
4. Progression gate (e.g. ~50 tasks to unlock full pass rewards) tied to the same ledger data everything else in this roadmap uses.

### Step 3 — Framing discipline (this is the part that makes or breaks the whole system)
1. **Never publish rupee-value framing anywhere in-product.** No "get ₹600 of value for ₹400." The moment a user mentally converts this into a spreadsheet, the mythology is dead.
2. Frame purchase copy as **entry into a season/campaign**, not a purchase of goods — "join the Siege of Ashen Vale," not "buy the September pass."
3. No leaderboard for cosmetics alone, ever (same rule as Profile Visiting above) — competitive tiers are always tied to discipline, never to spend.

### Watch-out
This is the highest-risk monetization item on the roadmap specifically because the failure mode isn't "it doesn't sell" — it's "it sells, but damages the trust that makes everything else in the roadmap credible." Get a second read on all pass-related copy before shipping; if any sentence could be read as "pay more, get more power," rewrite it.

---

## 8. Night Market

**Risk: low | Effort: small-medium — depends on Pass system existing first**

1. Weekly rotating showcase (Saturday), server-seeded catalog of discounted cosmetics — a lightweight Supabase function keyed on week number is sufficient, no need for a complex recommendation engine at this stage.
2. Frame it in-world from day one — whose market is this, why does it only open at night, is it tied to the current season's mythology — a random discount shelf with no narrative framing is just a shop, and undercuts the discipline you're building into the Pass system above.

### Watch-out
Build this only after the Pass system's mythology framing is solid — the Night Market inherits its credibility from the same "this is a world, not a store" principle, and will feel hollow if it launches in isolation.

---

## 9. Lore Fragments / Journal Discoveries + Artifact Lore Bible

**Risk: low | Effort: medium (mostly content, some light backend)**

1. Structure `lore_fragments` in the database with a drop-probability tied to regional liberation events, rather than flat unlocked strings.
2. Write the actual lore content in batches ahead of the features that reference it — this is a content pipeline as much as an engineering task, budget writing time accordingly.
3. Artifact Lore Bible: a compiled reference view of everything unlocked so far — build this as a natural byproduct of the lore_fragments structure, not a separate content system.

### Watch-out
This is a long-tail retention mechanic — it gets more valuable the longer someone stays, since fragments compound and cross-reference. Don't rush initial content out just to ship the feature; a thin lore library undersells the mechanic's actual long-term value.

---

## 10. Warrior Archetype Yearly Wrap

**Risk: medium (requires a full year of clean data to be trustworthy) | Effort: medium (analysis logic) + design-heavy (the actual Wrap output)**

### Step 1 — Build the data pipeline now, even though launch is later
1. Parse the historical ledger array into category dominance: Fitness-heavy → Gladiator/Berserker, Operations-heavy (complex micro-steps) → Tactician/Sentinel, unbroken ritual streaks → Templar/Unyielding, boss-raid frequency → Dragon Slayer, long silent focus sessions → Void-Walker, and so on across all 12 archetypes.
2. Instrument this incrementally as Phase 1/2 data starts flowing, rather than trying to reconstruct a year of behavior retroactively when launch time comes.

### Step 2 — Output design
1. Beautifully designed, shareable summary format — this is your highest single-feature virality ceiling on the whole roadmap, so the design budget here should reflect that, not be an afterthought bolted onto the data logic.
2. Reuse the Triumph Card export pipeline (native share sheet, blob download) rather than building a separate export system.

### Watch-out
**Do not launch this on partial-year or noisy data.** A bad first Wrap poisons trust in every future one — this is a once-a-year moment, and there's no quick way to recover credibility if the first one feels inaccurate or generic. Hold it until the data genuinely supports it, even if that means the first Wrap ships later than the rest of Phase 2.

---

## Definition of Done for Phase 2

- [ ] Anonymous local-first entry live, merge logic tested adversarially (retries, partial failures, dual-device claims), zero data-loss incidents in testing
- [ ] Triumph Cards exporting cleanly on web and mobile, task-detail leakage structurally impossible, triggered only on qualifying events
- [ ] Elite Status and Divine Intervention both live, Divine Intervention questionnaire meaningfully differentiated from generic AI fitness plans
- [ ] Meal Prep ritual layer live and structured for future AI consumption
- [ ] Achievement system and boss raid music shipped
- [ ] Profile Visiting live, Artifact Net Worth never appears as a standalone competitive leaderboard
- [ ] Pass system live with season mythology defined before tier mechanics, zero rupee-value framing anywhere in-product, combined leaderboard proves free-tier players can outrank paid
- [ ] Night Market live, narratively framed, launched after Pass system is stable
- [ ] Lore fragment pipeline live with a real content backlog, not a thin placeholder set
- [ ] Wrap data pipeline instrumented and running silently in the background, held for launch until a full year of clean data exists

Once this phase closes, you'll have proof of two things simultaneously: that the identity-driven progression thesis converts into real willingness to pay, and that the growth loop (Triumph Cards, eventually the Wrap) can acquire users without ad spend. Phase 3 — Legion Wars, seasonal nostalgia, the AI hub — only makes sense to fund once both of those are actually demonstrated, not assumed.
