# POST YC BARRAGE
### The Warscythe Post-Decision Offensive — Full Roadmap, Prioritized

> **Thesis:** Every other habit tracker gamifies statistics. Warscythe gamifies identity. Everything below exists to make that gap between us and the rest of the market unclosable — not just wider.

> **Ground rule for the whole document:** nothing here ships before the core loop is bulletproof. This is the vault, opened in order, not a wishlist executed in parallel. Sequence is the strategy — a Gold Pass launched on a shaky retention loop is just a discount code; the same Gold Pass launched after Fragments/Hall of Olympus lands is a status symbol people fight for.

---

## How This Document Is Organized

Each item has:
- **Priority tier** (P0 → P3, explained below)
- **Potency** — 1–10, how much this single feature moves the needle on retention, monetization, or distinctiveness
- **What it does for us** — which part of the business it actually serves
- **Watch-outs** — the specific way this feature dies if built carelessly
- **Marketing angle** — how this becomes a distribution/acquisition lever, not just a feature

### Priority Tiers
- **P0 — Foundation.** Broken without this. Ships before anything cosmetic or monetized.
- **P1 — Retention Core.** The next 60 days post-decision. This is what turns a novelty install into a habit.
- **P2 — Identity & Monetization.** Once retention is proven, this is where the business model and the "flex" layer get built.
- **P3 — Moat & Scale.** Features that are genuinely hard to copy and that turn Warscythe from an app into a platform / cultural object.

---

## PHASE 0 — Foundation (P0)

*Nothing below this line matters if this layer is shaky. This is unglamorous, invisible, and non-negotiable.*

| Feature | Potency | Notes |
|---|---|---|
| Sync conflict resolution (offline-first ledger) | 9 | This is the actual engineering moat. Copy the dragons, copy the scythe — nobody copies a correct CRDT-style conflict resolver overnight. |
| iOS audio unlock (user-gesture playback) | 6 | Small bug, but "music doesn't play on iPhone" is the kind of thing a reviewer notices in the first ninety seconds. |
| Manifest / icon / naming consistency (PWA) | 4 | Same category — the home-screen icon is the first visual impression, before the app even opens. |
| Mobile scroll/UX fixes (rituals, fitness, mission-in-progress) | 5 | Dead scrolls and misplaced tutorial highlights are silent churn. Nobody files a bug report for "this felt clunky," they just leave. |
| Tutorial guardian auto-scroll-to-section | 5 | Fixes a real onboarding failure mode: lesson ends while the user is looking at the wrong part of the screen. Onboarding is the only impression you get once. |
| Dropdown filter for rituals (all/today/weekly/urgent + date add) | 4 | Utility debt. Doesn't sell the dream, but its absence undermines the dream for power users. |
| History log rework for laptop (calendar single-page + history split) | 3 | Desktop-specific but matters for the segment of users who plan on laptop and execute on mobile. |

**Watch-out for this whole phase:** none of this is exciting to build and all of it is tempting to skip in favor of the fun stuff below. Resist. A gamified app with sync bugs isn't whimsical, it's untrustworthy — and trust is the only thing standing between "I lost three days of streak" and a 1-star review that mentions the word "scam."

---

## PHASE 1 — Retention Core (P1)
### Target: first 60 days post-YC-decision

*This phase exists to answer one question for good: does long-term engagement actually come from mastery, not checklists? You already believe this. This is where you get evidence at scale, not just from 57 users.*

### 1. Deity Fragments + Hall of Olympus (Fitness)
**Potency: 9/10**
Right now Operations has a full ceremony — execute, receive a relic, preserve the memory. Fitness just says "next exercise." This is the single biggest asymmetry in the current product.
- **Mechanic:** stop giving an item every workout. Give **Fragments** tied to deity affinity (Hermes, Apollo, Ares, Hercules, Zeus). At 100 affinity, the deity personally presents the completed artifact.
- **Payoff:** Hall of Olympus — a museum of completed blessings, affinity, workouts, volume, PRs. This becomes literally "a museum of your body."
- **Pair with:** automatic PR detection ("NEW PERSONAL RECORD — no checkbox, the system just notices"). This alone is a UX upgrade most fitness apps don't have — you're not asking the user to log a PR, you're witnessing it.
- **Where it benefits us:** closes the fitness/operations emotional gap; gives the weakest section of the app (by your own admission) a reason to be someone's *favorite* section.
- **Watch-out:** don't reward every rep with a drop. Ceremony requires scarcity. If Ambrosia/Fragments show up constantly, they become noise, not meaning.

### 2. Friction Journal
**Potency: 6/10**
Not a feature — a listening mechanism. "Today I had to copy something twice." "Today I switched between three apps." This is qualitative telemetry that a dashboard can't give you.
- **Where it benefits us:** direct pipeline into what to build in Phase 2/3 without guessing. Also a genuinely differentiated wellness/reflection touchpoint competitors don't have.
- **Watch-out:** this only works if it's low-friction (one line, one tap) — if it feels like a form, it becomes homework, which is the exact thing Warscythe exists to not be.

### 3. Notification Overhaul + Time-Specific Rituals
**Potency: 6/10**
Rituals need to be time-bound and notification-bound to actually change behavior, not just get logged.
- **Where it benefits us:** this is the difference between a habit tracker and a habit *former*. Most churn in this category happens because reminders are either absent or annoying — get this precisely right and it's invisible infrastructure for everything else.

### 4. Barcode Scan Task Verification
**Potency: 5/10**
Verifying task completion (e.g. scanning a product to confirm a real-world action happened) adds a layer of accountability that's rare in habit trackers.
- **Watch-out:** scope this narrowly (fitness supplements, specific rituals) before generalizing — a half-built verification system that fails often is worse than no verification at all.

### 5. Scroll/Filter/Removal Polish (Rituals, Fitness)
**Potency: 3/10**
Ritual removal on phone, scrollbars when active items exceed space. Small, but this is retention-core because it's the stuff power users hit daily.

### 6. YT Video Walkthroughs
**Potency: 4/10**
Every part of the app gets a video walkthrough.
- **Marketing angle:** this doubles as top-of-funnel content. A "how the Forge works" video is simultaneously onboarding *and* a discovery surface on YouTube/Shorts for people who've never heard of Warscythe.

**Phase 1 conviction note:** this is the phase that proves the thesis. If Fragments + Hall of Olympus + Friction Journal land and retention curves bend, everything in Phase 2 (monetization) becomes low-risk, because you're monetizing something people already can't put down — not trying to bribe them into staying.

---

## PHASE 2 — Identity & Monetization (P2)
### Target: months 2–5 post-decision

*This is where "we gamify identity" stops being a slogan and starts being a business model. The order inside this phase matters — do NOT open the Battle Pass before Triumph Cards exist, and do NOT open Triumph Cards before the Fragments system (Phase 1) exists. Sharing something with no depth behind it is a one-time flex; sharing something backed by a Hall of Olympus is a recurring one.*

### 7. Triumph Cards / Strava-Style Screenshot Engine
**Potency: 10/10 — the single highest-leverage item in this entire document**
Canvas-rendered export cards for completed boss raids, 90-minute focus sessions, streak milestones — one-tap share to Instagram Stories/Twitter/WhatsApp via native share sheet on mobile.
- **Where it benefits us:** this is the growth engine. Productivity is normally invisible and single-player. This makes it visible and social, for free, using the user's own audience.
- **Marketing angle:** this *is* the marketing plan. Zero-CAC acquisition. The dark-gothic aesthetic is instantly distinct in a feed full of boring text-based productivity screenshots — it doesn't look like a to-do list app, it looks like game key art. Someone's friend sees a dragon-defeat card, not a checklist.
- **Watch-out:** privacy discipline matters here — others see the *achievement*, never the task detail. The moment this leaks personal task content into a public flex, it becomes a liability instead of a growth loop.
- **Tip:** ship this right after Fragments/Hall of Olympus, not before — a Triumph Card of a boss raid is good; a Triumph Card that also shows "3rd Hermes Blessing this month" is unbeatable.

### 8. Gold/Silver/Free Pass — reframed as Colosseum, not battle pass
**Potency: 8/10**
Your own correction on this is the right one: don't sell "₹400 of value for ₹400 paid." Sell **entry into a season that has its own mythology** (Gem Kingdom, Eclipse Monastery, Search for the Seven Sages). The Gold Pass leaderboard is a separate arena — paid players fight paid players, free players have their own leaderboard, nobody is disadvantaged by not paying.
- **Where it benefits us:** primary monetization lever that doesn't compromise "money cannot buy strength" — your own stated principle, and the single most defensible thing about this monetization model versus every P2W-adjacent competitor.
- **Watch-out (this is the important one):** the moment a player mentally converts the pass into a rupee-value spreadsheet, the mythology is dead. Never publish "X rupees of value" framing anywhere in-product. Frame it as **entry fee into a season**, not a purchase of goods.
- **Marketing angle:** "we don't gate features behind payment, we gate *seasonal prestige*" is a sentence that differentiates you from literally every mobile game monetization model people are cynical about.

### 9. Night Market (Saturday rotation)
**Potency: 6/10**
Weekly 24-hour discounted rotation, Supabase-seeded.
- **Where it benefits us:** solves the weekend drop-off problem most productivity apps suffer from — gives a reason to open the app on a day when there's otherwise no habit-driven reason to.
- **Watch-out:** this only works downstream of the pass system's mythology being intact. A random discount shelf with no lore is just a shop. Frame it in-world (whose market is this, why does it only open at night, what season is it tied to).

### 10. Warrior Archetype Yearly Wrap
**Potency: 9/10**
Annual analysis of ledger data → one of 12 mythological archetypes (Berserker, Sentinel, Templar, Dragon Slayer, Void-Walker, etc.), delivered as a shareable, beautifully designed summary.
- **Marketing angle:** this is your Spotify Wrapped. It is arguably the highest-ROI single feature on this list for organic acquisition because it's engineered for one specific human behavior — people love sharing what their personality type says about them, especially once a year.
- **Where it benefits us:** annual re-engagement spike + acquisition spike simultaneously, because the wrap format is inherently viral and inherently nostalgic ("Eclipse Monastery was peak" only works if there's a Wrap reminding people what season they lived through).
- **Watch-out:** needs a full year of clean ledger data to be accurate and satisfying. Don't rush this — a bad first Wrap poisons trust in every future one.

### 11. Profile Visiting + Artifact Net Worth
**Potency: 7/10**
Read-only inspection of a friend's equipped scythe, themes, frames, badges, and a calculated "net worth" of their cosmetic collection.
- **Where it benefits us:** converts the app from single-player utility into social status game. Peer pressure from seeing a friend's premium weapon or high level is a proven driver of execution in every social game genre.
- **Watch-out:** absolutely no leaderboard for cosmetics alone (your own instinct here is correct) — net worth should be a badge of dedication/spend, never a competitive ranking on its own. Keep competitive rankings tied to *discipline metrics* (streaks, consistency, tasks), not purchase history.

### 12. Achievement System + Category Milestones
**Potency: 5/10**
"First task in this category," "first streak scythe," multi-streak categories — no rewards, just prestige levels.
- **Where it benefits us:** low-cost retention layer for the segment of users motivated purely by completionism, independent of the pass system.

### 13. Lore Fragments / Journal Discoveries
**Potency: 6/10**
Structured `lore_fragments` unlocked probabilistically on regional liberation — knight's journals, dragon research notes, contradicting myths.
- **Where it benefits us:** turns daily task completion into ongoing narrative discovery. This is one of the only mechanics on this list that gets *more* valuable the longer someone stays, since lore compounds and cross-references over time — a genuine long-tail retention hook.

### 14. Artifact Lore Bible
**Potency: 4/10**
A compiled reference of everything unlocked. Utility for the completionist/lore-focused segment, and doubles as content for the YT walkthrough series above.

### 15. Boss Raid Music + Category-Specific Soundscapes
**Potency: 3/10**
Reinforces the ceremony of high-stakes tasks. Cheap to build, meaningfully raises perceived production value.

### 16. Monetization Tiers: Elite Status / Divine Intervention / Combo
**Potency: 7/10**
Three tiers: ad-free (Elite Status), AI-driven fitness/meal planning (Divine Intervention), and the combo.
- **Where it benefits us:** this is the subscription layer that funds AI inference costs specifically, kept separate from the cosmetic/pass economy so the two monetization models never contaminate each other's trust.
- **Watch-out:** the Elite Status pitch should stay exactly as minimal as you originally framed it — "ad-free" + "you're supporting the vision." Don't oversell it with fake feature gates. The moment ad-free starts feeling like it's withholding real functionality, it stops being a "support us" purchase and starts being a "I'm being nickel-and-dimed" purchase.
- **Tip:** Divine Intervention is your strongest subscription argument because it's backed by something competitors' AI plans aren't — your own domain knowledge (splits, research literature) built into the questionnaire logic, not a generic LLM wrapper. Say this explicitly in marketing.

### 17. Meal Prep / Fat Loss Tracking Ritual Layer
**Potency: 5/10**
Non-AI meal logging as a ritual-style section — the missing half of "fitness" as you've identified it yourself.
- **Where it benefits us:** completes the fitness vertical before AI layer is added on top, so Divine Intervention has real tracked data to work from rather than starting cold.

### 18. Loginless / Local-First Entry
**Potency: 8/10**
No account required to enter the kingdom. Local IndexedDB/native DB identity. Login requested only at emotionally meaningful moments (first artifact, joining a Legion, cross-device, before real-money purchase).
- **Where it benefits us:** this is a funnel fix with outsized impact — every point of forced friction before value-delivery is measurable install-to-activation loss. This reverses the standard "sign up to try it" flow into "try it, then protect what you've built."
- **Marketing angle:** massively improves the conversion rate of the Triumph Card growth loop above — someone clicking a shared card from Instagram lands *inside the product*, not at a signup wall.
- **Watch-out (technical, not optional):** the anonymous→authenticated merge must be idempotent and must never silently overwrite an existing account's history. Currency (coins/XP) should be recomputed/validated server-side on merge, not blindly summed — this is the one place a bug becomes a trust-destroying incident, not just an annoying one.

**Phase 2 conviction note:** everything in this phase either (a) makes money without compromising the "money can't buy strength" principle, or (b) makes the app spread without spending on ads. Both goals are served by the same underlying belief: identity-as-progression is more valuable, and more shareable, than a productivity dashboard will ever be.

---

## PHASE 3 — Moat & Scale (P3)
### Target: month 6+, budget-gated

*This phase is where you stop competing with habit trackers and start building something without a real category comparison.*

### 19. Legion Wars + Seasonal Campaigns (world-building monetization)
**Potency: 9/10**
Group-vs-group competition tied to named historical events (The Siege of Ashen Vale, The Crimson Tournament) rather than "Season 3." Multiple leaderboards by discipline type (ritual consistency, operations volume, fitness performance, streak preservation) rather than one flattening number.
- **Where it benefits us:** solves the single hardest design problem in competitive productivity — how do you rank effort across completely different life situations (the person studying for Harvard vs. the athlete vs. the night-shift worker) without making it feel zero-sum. Multiple legions/ranks (Sapphire/Emerald/Ruby/Obsidian) instead of one winner preserves this.
- **Watch-out:** the instant this becomes "who used the app most" instead of "who lived the most disciplined month," you've built a Skinner box, not a mythology. Guard the metrics carefully — optimize for effort signals that are hard to game (wake-up consistency, streak preservation) over raw volume, which power users will farm.

### 20. Alternative Interpretation Themes (Hand Drawn, Line Art, Blueprint, Ink & Parchment, Minimalist)
**Potency: 6/10**
Canon Themes (Gem Kingdom, Eclipse Monastery, etc.) change the *world*. Expression Themes are art-style reinterpretations of the same product — separating "engine" from "presentation."
- **Where it benefits us:** broadens addressable audience without diluting the core identity — someone who wants the sync architecture and Legion system but not the fantasy skin can still be a paying user.
- **The Minimalist Easter egg specifically:** keep this exactly as conceived — a joke that never mocks minimalist users, delivered dead straight ("Fairies are currently employed in Human Resources"). This is exactly the kind of screenshot-native humor that becomes its own tiny marketing moment on its own, with zero additional spend.
- **Watch-out:** Hand Drawn/Ink & Parchment should be priced as genuinely premium (they're more expensive to produce, and should feel like it) — don't bucket them at the same price as a recolor.

### 21. Warrior Archetype Yearly Wrap → Nostalgia Engine
**(cross-reference to #10, escalated)**
Once multiple seasons exist, seasons themselves become nostalgia objects ("Eclipse Monastery was peak," the way people say "Wrath of the Lich King was peak"). Don't try to engineer a "best" season — the goal is that *every* season becomes someone's favorite, tied to what was happening in their real life during it.
- **Potency: 8/10** — this is a multi-year compounding asset, not a single feature. It only becomes visible in year 2–3, but it's the mechanism by which Warscythe stops being an app people use and becomes a timeline people remember.

### 22. Plugin/Integration Layer (fetch data from other apps)
**Potency: 6/10**
External data ingestion (e.g. wearables, other trackers).
- **Where it benefits us:** reduces the "I need three subscriptions to run my whole day" problem you identified as your own original pain point — this is literally the thing that got you started building.
- **Watch-out:** scope tightly. Integrations rot fast if third-party APIs change and nobody maintains them — this is a maintenance-cost feature, not a ship-and-forget one.

### 23. Legion as Multiplayer AI Hub (MCP-integrated collaborative workspace)
**Potency: 7/10 (high ceiling, long horizon)**
Long-term vision: Legions become spaces where teams can code together with agent integration, reviewed in real time.
- **Where it benefits us:** this is the eventual Notion-replacement thesis — the hardest phase-3 target on your own competitive roadmap (P&G-style trackers → Habitica → Apple Reminders/Todoist/Notion). Don't attempt this until Legion's social/coordination layer is already proven at the habit-tracking scale.
- **Watch-out:** this is the one item on the entire roadmap where being early is more dangerous than being late. A half-built collaborative AI hub actively damages trust in the "Legion" concept for its actual current use case (accountability groups). Gate this hard behind budget and behind Legion's current-form product-market fit.

### 24. Mini-Games / 2.5D PvP Between Friends
**Potency: 4/10**
Scythe-based PvP, Brawl Stars-style.
- **Where it benefits us:** high fun ceiling, but genuinely the most speculative item on this list — it's the furthest thing from "productivity expressed through game systems" and closest to "game bolted onto productivity app," which is the exact failure mode you've spent this entire roadmap defining yourself against.
- **Honest take:** deprioritize this relative to its potency score suggests. It's a good idea for a game studio. It's a distraction for a company trying to win the "we gamify identity, not statistics" argument with YC and with users. Revisit only after Phase 2 monetization is proven and only if user data explicitly asks for it (this is exactly what the Friction Journal / Voice of User system in Phase 1 is for).

### 25. Voice of User System
**Potency: 7/10 (infrastructure, not user-facing)**
One taxonomy across support email, store reviews, YouTube comments, in-app feedback, analytics — categorized by Onboarding/Operations/Rituals/Fitness/Progression/Legions/Performance/Bugs/Monetization/Art&UX/Feature Request, ranked by frequency × severity × affected cohort × strategic alignment.
- **Where it benefits us:** this is what turns "10,000 unrelated opinions" into "12 recurring problems" — the actual mechanism by which everything in Phase 2/3 gets correctly re-prioritized as real user data comes in, instead of staying a founder's intuition forever.
- **Tip:** pair analytics (silence) with support inbox (voices) — your most vocal complainers are often your most invested users, not your churn risk. The users who quietly vanish in 90 seconds never write you an email; telemetry is the only way you'll ever see them.

---

## Cross-Cutting Principles (apply to everything above, always)

1. **Money never buys strength.** Cosmetics, prestige, and seasonal entry are for sale. Streaks, discipline metrics, and consistency are never purchasable. This is the single most defensible line in the entire roadmap — the day it's crossed, Warscythe becomes indistinguishable from every gacha-adjacent competitor.
2. **Every reward needs ceremony, not frequency.** The Fragments/Ambrosia insight generalizes: rewards that show up every single time stop meaning anything. Scarcity is what makes a drop feel earned instead of expected.
3. **The game is the tracker, not a skin on top of the tracker.** Before shipping anything, ask: does this express progress through the world state, or does it just decorate a dashboard? If it's the second one, it doesn't belong on this roadmap regardless of how fun it sounds.
4. **Universal metrics only.** Anything that implicitly favors one lifestyle (e.g. wake-before-7am mechanics) risks narrowing who can be a "warrior" in this world. The athlete, the night-shift worker, and the student at 2am all need to be able to win.
5. **Don't chase nostalgia — manufacture the conditions for it.** You can't remaster your way back to a season being someone's favorite. Every season should be *a* favorite for *someone*, not a competition against your own past seasons.

---

## Overall Potency Assessment

**How distinctive does this make Warscythe, in total?**

Individually, plenty of these ideas exist elsewhere in fragments — battle passes exist in mobile games, wrapped-style summaries exist (Spotify), Strava has share cards, RPGs have collectible progression. None of that is new in isolation, and it shouldn't be overstated as if it were.

What's genuinely rare is the **combination, applied specifically to real-world execution, held together by one consistent design law** (progress is communicated through world-state, never through a dashboard) — applied simultaneously across Operations, Rituals, Fitness, and Legions, with a monetization model that structurally cannot sell power. Competitors can copy a scythe image. They can copy an artifact. Rebuilding an entire product philosophy around persistent progression instead of task completion is a multi-year commitment most teams won't make, because most teams are optimizing for shipping a habit tracker, not building a mythology that happens to make people more disciplined.

**Highest-conviction bets on this entire document, ranked:**
1. Deity Fragments + Hall of Olympus — fixes the biggest existing asymmetry in the product
2. Triumph Cards — the actual growth engine, at effectively zero CAC
3. Colosseum-framed Pass system — monetizes without compromising the one principle that makes this defensible
4. Warrior Archetype Wrap — highest single-feature virality ceiling in the whole roadmap
5. Loginless entry — the funnel fix that makes every acquisition channel above convert better

Everything else on this list is real, worth building, and sequenced correctly below those five. But those five are where conviction should be highest and where corners should never be cut.
