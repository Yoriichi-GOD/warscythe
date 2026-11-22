# Warscythe reward design: primary-source research

Verified against the sources below on **22 November 2026 (Asia/Kolkata)**. Research only: no reward implementation, app-code changes, installation, commit, or deployment. Current Warscythe behavior is being audited separately; the proposals here must be reconciled with that audit.

## Decision supported by the evidence

Make a reward understandable and worth keeping before making its reveal longer. The most transferable patterns are explicit acquisition rules, a persistent collection, visible ownership/provenance, and feedback about the player's chosen work. Game examples demonstrate possible designs; they do **not** establish that these designs improve Warscythe retention or real-world habits. Behavioral studies also do not establish an optimal rarity distribution or reveal duration for this app.

Recommended first scope: clarify the existing rarity contract and improve reward cards/Ledger presentation. Defer a new currency, crafting system, trading, pity counter, battle pass, or larger reward catalog until the current reward loop is verified and users can explain it.

## What other games actually document

### 1. Supercell: the reveal belongs to a defined reward system

**Source:** [NEW: The Treasure Hunt Event!](https://supercell.com/en/games/clashofclans/blog/news/intro/), Supercell, **10 September 2024**. First-party design explanation; historical launch description, not a current event schedule.

Supercell describes four chest tiers, rewards appropriate to Town Hall/Builder Hall progression, and a four-hit opening sequence. The stated goals were extra rewards, surprise, and distributing relevant rewards to players at different progression stages. These are developer intentions, not published experiment results. The launch article said those chests were earned through attacks and not purchasable. [Source](https://supercell.com/en/games/clashofclans/blog/news/intro/)

**Bounded implication:** a short anticipation/reveal can add ceremony, but the reward must first relate to what the person did and what they can use. Borrow the readable sequence, not the mandatory repeated taps, event pressure, or assumption that randomness causes delight.

### 2. Supercell: rarity is disclosed; duplicates have rules

**Source:** [Chest Drop Chances](https://support.supercell.com/clash-of-clans/en/articles/chest-drop-chances.html), Supercell Support, **undated living page**; checked 22 November 2026. The page did not provide readable body text on direct open; findings were verified in indexed first-party page excerpts, including its table and duplicate-policy text.

The page lists chest rarity rates of **Common 58%, Rare 32%, Epic 8%, Legendary 2%**, progression-dependent reward tables, and ineligible cosmetic categories when all available items are owned. Its Hero Journey section specifies a **50 Starry Ore** fallback when all available Epic Equipment for a hero is owned. Chest tier and contained item category are separate concepts. [Source](https://support.supercell.com/clash-of-clans/en/articles/chest-drop-chances.html)

**Bounded implication:** Warscythe should distinguish rarity, eligibility, and acquisition route. If rewards are random, disclose the actual implemented odds and any duplicate rule. If deterministic, show the condition and progress instead. These Clash percentages are an example, not a recommended Warscythe economy.

### 3. Bungie: collecting an object and completing an achievement are different jobs

**Source:** [This Week At Bungie – 6/07/2018](https://www.bungie.net/7/en/News/article/46940), Bungie, **7 June 2018**. First-party Forsaken feature announcement.

Bungie introduced Collections to track acquirable items and Triumphs to track achievements and lore. The same announcement describes weapon customization and weapons leveling over time. This supports separating an object catalog from a record of accomplishments; it does not prove either interface increased engagement. [Source](https://www.bungie.net/7/en/News/article/46940)

**Bounded implication:** a Ledger item needs its identity and acquisition story. A task completion needs its own real-world evidence. Do not make “many rewards owned” silently stand in for “meaningful progress made.”

### 4. Bungie: preserve history while explaining what remains obtainable

**Source:** [This Week at Bungie – 9/3/20, “Triumphs Evolved”](https://www.bungie.net/7/en/News/article/49507), Bungie, **3 September 2020**. Historical system-design explanation.

Bungie described a Career Score for total accomplishments, an Active Score for currently available pursuits, and Legacy Triumphs for retired content. It organized pursuits by lifetime, destinations, and seasons, and gave lore a separate presentation with book covers. Earned titles remained equippable. The article explicitly discusses clarity problems in the previous approach. [Source](https://www.bungie.net/7/en/News/article/49507)

**Bounded implication:** retain earned rewards and their provenance through catalog changes. Distinguish Owned, Not yet earned, and Unavailable; unavailable items should not masquerade as actionable goals. A permanent record need not create a new score or seasonal system.

### 5. Blizzard: a collection is useful after the original drop

**Source:** [Preview: Wardrobe Updates](https://worldofwarcraft.blizzard.com/en-us/news/20183993/preview-wardrobe-updates), Blizzard Entertainment, **15 July 2016**. Historical Legion preview. Direct fetch returned 403; findings/date were checked against indexed first-party article text, not an independently operated game session.

Blizzard describes permanent appearance unlocks even after selling/destroying the item, separate treatment for unowned appearances, favorites, type filters, search, previews, saved outfits, and a guide to where gear is obtained. These are documented interface capabilities, not experimental findings. [Source](https://worldofwarcraft.blizzard.com/en-us/news/20183993/preview-wardrobe-updates)

**Bounded implication:** the Ledger should be browsable and personally useful: search, owned-state filters, favorite/showcase selection, a detail view, and acquisition guidance. Permanent collection credit prevents “my progress disappeared” when an item's operational state changes. Saved outfits are inspiration only if Warscythe already has a meaningful display/equipment use.

### 6. Valve: separate presentation, progress, and availability

**Source:** [Step by Step: Achievements](https://partner.steamgames.com/doc/features/achievements/ach_guide), Valve Steamworks, **undated living documentation**, checked 22 November 2026.

The documentation defines distinct fields for name, description, achieved/unachieved icons, progress range, visibility, availability, and set membership. It recommends colorful earned icons and grayscale unearned icons. It also documents archiving rather than deleting earned achievements and grouping achievements so additions do not erase base-game completion. **Achievement Sets are explicitly marked beta on the checked page.** [Source](https://partner.steamgames.com/doc/features/achievements/ach_guide)

**Bounded implication:** a reward should communicate what it is, how it was earned, whether it is owned, and what progress remains. Use an icon/state label in addition to color. Treat future catalog expansion carefully so an old completed chapter remains completed.

## What behavioral research supports—and does not

### 7. Deci (1971): the kind of reward matters

**Source:** Edward L. Deci, [Effects of Externally Mediated Rewards on Intrinsic Motivation](https://www.selfdeterminationtheory.org/SDT/documents/1971_Deci.pdf), **1971**, Journal of Personality and Social Psychology 18(1), 105–115. Original research: two laboratory experiments and one field experiment; author-associated full-paper host.

External rewards were introduced during the second of three observation periods. The paper reports that monetary rewards tended to reduce subsequent intrinsic motivation, while verbal reinforcement/positive feedback tended to increase it. The relevant outcome concerns motivation for the activity when the reward is no longer operating, not just rewarded output. [Paper](https://www.selfdeterminationtheory.org/SDT/documents/1971_Deci.pdf)

**Limit:** small early studies and specific activities are not evidence that every digital reward harms motivation. A Warscythe badge is not equivalent to cash, and a workout is not a puzzle task.

### 8. Ryan, Mims & Koestner (1983): informative and controlling rewards differ

**Source:** [Relation of Reward Contingency and Interpersonal Context to Intrinsic Motivation](https://selfdeterminationtheory.org/SDT/documents/1983_RyanMimsKoestner.pdf), **1983**, Journal of Personality and Social Psychology 45(4), 736–750. Review plus an original experiment with **96 college students** completing a puzzle activity.

The authors distinguish expected reward contingencies and test the importance of the interpersonal context. Their findings support the distinction between rewards experienced as controlling and those carrying competence-relevant information without undue pressure. The paper emphasizes that the context of administration matters; an award's presence alone is an inadequate explanation. [Paper](https://selfdeterminationtheory.org/SDT/documents/1983_RyanMimsKoestner.pdf)

**Bounded implication:** recognize a specific, chosen achievement with factual feedback. Make the reward optional to inspect; avoid turning it into a demand to work more. This is an inference for Warscythe, not a tested copywriting formula.

### 9. Deci, Koestner & Ryan (1999): expected contingent rewards warrant care

**Source:** [A Meta-Analytic Review of Experiments Examining the Effects of Extrinsic Rewards on Intrinsic Motivation](https://selfdeterminationtheory.org/wp-content/uploads/2014/04/1999_DeciKoestnerRyan_Meta.pdf), **1999**, Psychological Bulletin 125(6), 627–668. Original **meta-analysis of 128 studies**, not a new app experiment.

The synthesis found negative average effects on free-choice intrinsic motivation for engagement-, completion-, and performance-contingent rewards, and positive average effects for positive feedback. Effects differed by outcome measure and age. The paper reviews disagreements with other syntheses; its findings concern the included reward conditions and measures, not universal effects of all gamification. [Paper](https://selfdeterminationtheory.org/wp-content/uploads/2014/04/1999_DeciKoestnerRyan_Meta.pdf)

**Bounded implication:** maintain the person's reasons for studying, training, or building. Avoid promising escalating prizes for every action or calling more app time a health/productivity success. Optional celebratory recognition is a design direction to test, not proof against motivational crowding.

### 10. Mekler et al. (2017): more output does not establish more motivation

**Source:** Mekler, Brühlmann, Tuch & Opwis, [Towards understanding the effects of individual gamification elements on intrinsic motivation and performance](https://edoc.unibas.ch/entities/publication/ccec8ccc-aa54-417d-b205-334b518d6eed), University of Basel repository, **issued 1 January 2017**; DOI **10.1016/j.chb.2015.08.048**. Original online **2 × 4 experiment**, described in the institutional research abstract.

In an image-annotation task, points, levels, and leaderboards did not significantly affect competence or intrinsic motivation compared with control, while tag quantity increased. The authors bound the interpretation to that context and distinguish performance quantity from intrinsic motivation. [Institutional record](https://edoc.unibas.ch/entities/publication/ccec8ccc-aa54-417d-b205-334b518d6eed)

**Bounded implication:** reward clicks, repeat opens, more logs, and longer sessions are not sufficient success metrics. Check the real-world goal and the user's experience. Nonsignificant effects are not proof of equivalence or universal harmlessness.

## Proposed Warscythe direction — not implemented or validated

### A. Give Epic and Legendary a contract before giving them more particles

Choose the meaning of the tier first. A usable candidate is **Epic = a substantial named achievement within an arc; Legendary = a capstone that completes or transforms an arc**. These are proposed semantics, not claims about the current catalog. Reconcile them with actual acquisition rules before assigning items to tiers.

Use the same tier name consistently in the reveal, card, detail view, and Ledger. Differentiate by explicit label, emblem silhouette/frame, art composition, and a short explanation of significance; color is supplementary. A Legendary should have a reason to exist beyond being an Epic with a warmer border. Do not equate random luck with greater discipline or human worth.

If tiers instead describe random scarcity, disclose that and keep accomplishment significance separate. Never invent an ownership percentile or imply a global rarity without an actual population denominator and measurement date. Deterministic milestones need criteria/progress, not fictional drop odds. These proposals transfer the explicit system contracts in Sources 1–2 and the ownership/achievement distinction in Sources 3–4.

### B. Treat the reward as a receipt plus a keepsake

The immediate result should answer: **what did I earn, why now, and where can I see it again?** Present the real activity first, then item name, tier, art, and a brief line of lore. A detail view should show actual acquisition date, source activity/milestone, first acquisition, total times earned where applicable, and any existing effect/use. Missing historical data should be labeled unknown; lore should not fabricate provenance.

Keep a direct “View in Ledger” path and optional showcase/favorite selection. If rewards currently do nothing mechanical, say what they do provide—collection, story, or display—without implying hidden power. These proposals draw on Sources 3–6; whether users value them remains untested.

### C. Make the Ledger a collection with a readable map

Use a stable item grid/list with strong art, readable name and tier, and explicit states. Start with **Owned / All**, search, and existing-category/tier filters. Show useful collection progress with a defined denominator; separate retired/unavailable content so it cannot make an attainable set look perpetually incomplete. Group by existing story arc/source only where the catalog supports it. Let people revisit the associated story and choose favorites. Do not manufacture ten new taxonomy layers to rescue a confusing card.

### D. Give duplicates honest meaning without immediately creating an economy

First decide whether repeats are valid acquisitions or accidental duplicate awards. For valid repeats, a low-complexity option is a count plus dated activity history, retaining the first discovery and marking the latest as a repeat. Keep unique-item progress separate from total awards. Do not reuse the full “new discovery” treatment for a known item.

If duplicate conversion already exists, show its exact outcome. If it does not, research does not justify introducing a currency/crafting loop yet. Duplicate protection and fallback conversion are alternatives with different costs; Supercell demonstrates that they require explicit rules (Source 2), not that Warscythe needs both.

### E. Celebration should respect the goal and the person's time

Candidate treatment: fast ordinary confirmation; a more distinct composition for Epic/Legendary; a short reveal people can skip immediately; an instant, complete result with reduced motion; sound optional. The same reward must be granted and understandable when animation is skipped or unavailable. Avoid fake near misses, a changing apparent tier after the result is determined, repeated forced taps, expiring earned items, shame after missed days, or pressure to overtrain for a drop. These are product safeguards/proposals, not experimentally established optimal animation settings.

Use specific feedback such as “Completed the training plan you chose this week” only when the underlying data supports it. Let the user set the goal. This applies the informational-feedback direction in Sources 7–9 while keeping the real-world purpose visible.

## What to prove before expanding

1. **Contract audit:** enumerate existing item types, tier assignments, acquisition conditions, any random odds, duplicate behavior, and storage/provenance fields. Explain every Epic/Legendary distinction. Mark missing evidence explicitly.
2. **Comprehension check:** with a small formative sample, ask people to rank tiers, explain why an item was earned, distinguish new/repeat, locate it in the Ledger, and identify a next attainable reward. Record participant count, errors, task time, and direct feedback. A five-person check can expose problems; it cannot establish population retention effects.
3. **Integrity/regressions:** first award, repeat award, interrupted reveal, repeated completion event, reload, empty/full collection, unavailable item, missing historical metadata, small screen, keyboard operation, and reduced motion. Verify one real event creates the intended stored outcome once. Confirm skipping does not change grant/storage behavior.
4. **Outcome check:** ask whether recognition feels meaningful, understandable, pressuring, or distracting; examine progress toward the user's chosen real-world goal alongside voluntary return. Measure quality where possible, not only logged quantity (Source 10). A retention or habit-formation claim needs a separately designed longitudinal evaluation; none was run here.

**Closure gate:** a consistent tier contract, understandable first/repeat result, persistent truthful provenance, a usable Ledger, and passing regression checks. Stop there before adding a new economy.

## Evidence limitations

This is a focused set of ten primary-source documents, not a systematic review. Developer documentation establishes published behavior/design intent, not independent proof that a game works as documented or that its design caused retention. Historical examples are dated deliberately and should not be presented as current live-game inventories. Some sources were available only through indexed first-party text, as marked above; PDF findings were checked against indexed author-hosted paper text, and the Mekler result against its institutional abstract. No game was installed or instrumented, no Warscythe reward change was made, and no user study or outcome experiment was conducted.
