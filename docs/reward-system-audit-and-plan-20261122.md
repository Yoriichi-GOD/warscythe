# Warscythe rewards — current audit and next plan

22 November 2026. Sources: live checkout code plus the accompanying ten-source primary research report. This document is a proposal except for the small correctness fixes explicitly listed below. No drop odds, XP, coins, farming rules, prices, Fitness affinity, blessing rules or ownership records were changed.

## What the current app actually does

`rollReward` in `src/store/useWarscytheStore.js` uses the following marginal probabilities, derived from its successive thresholds. These are code probabilities, not observed production frequencies.

| Artifact tier | Ordinary roll | Boss roll | Ordinary bonus-points range |
| --- | ---: | ---: | ---: |
| Common | 60% | 0% | 25–74 |
| Uncommon | 25% | 0% | 75–149 |
| Rare | 10% | 0% | 150–249 |
| Epic | 4% | 75% | 300–499 |
| Mythic | 1% | 25% | 500–799 |

The first completed task overrides the roll with an Epic artifact and 300 bonus points. This remains true for the first real Operation in the new guide. Ritual completion uses the same roll function. There is no implemented Legendary drop tier, pity counter, duplicate protection or crafting conversion in this path.

Base points are 100 × effort multiplier (Low 1, Medium 1.5, High 2, Boss 5). From the third consecutive Low-effort completion, base and bonus are each quartered and floored. A recorded stall can double both when the farming condition does not apply. Coins are the separately rounded 15% of each resulting component. These are existing policies; this delivery does not endorse or rebalance them.

**Policy concern to investigate:** three legitimately small tasks can satisfy the same condition as farming. The new first-use form suggests a small task, so the distinction should be explained and reviewed before promoting short-task completion as an indefinitely neutral reward strategy. Do not infer cheating from task size alone. Medium, High and Boss tasks also have existing minimum deadline intervals; an economy review must include these constraints rather than simply raising rewards.

The artifact roll chooses uniformly from **30 named entries**. Across the existing five rarity values, the current catalogue contains **150 name/tier combinations**. The old Ledger denominator was hard-coded to 125, apparently matching 25 image families rather than the named collection identities. Several distinct named items share an image family; those are not automatically the same owned item.

`getArtifactCollection` already groups repeats by normalized name + rarity, records each recovery and shows counts. The inspector already has dated recovery history and activity context. The gallery is sorted by latest recovery. Recommending a new duplicate database or pretending provenance is absent would repeat work already done.

The delivery corrects only this factual display bug: the denominator is derived from the actual catalogue, current-catalogue ownership is counted uniquely, and historical names remain in the gallery/history with a separate preserved count. No old record is renamed or discarded to force the fraction to fit.

A historical item whose image no longer resolves also receives an explicit artwork-unavailable fallback in the card and inspector. The item, name and recovery records remain available; no replacement identity or benefit is invented.

Other systems have different meanings: Operations grant regional progression; the first ten real Operations advance the Chronicle; Ritual medals use scheduled consistency; Fitness affinity is based on its existing evidence engine. The new world archive derives access from real Operation totals or retained legacy lore entitlements, whichever preserves more access, capped at the 48 authored records. Reading creates no rewards. These systems should not be silently collapsed into a new common currency.

## The decision: clarity before a sixth rarity

Keep the five existing artifact tiers in the first presentation experiment. They currently describe a random reward category. They cannot honestly certify superior discipline or higher-quality real-world work.

If Legendary is introduced later, choose its contract explicitly. The preferred candidate is a **named, deterministic capstone distinction** for completing a defined journey, separate from the random artifact scale. A recorded milestone is still self-reported activity evidence, not independent proof of work quality. Do not rename old Mythic rewards or demote owned Epics to create room for another label.

A second option is a sixth random artifact tier, but that requires an approved distribution, new catalogue/legacy contract, assets, duplicate rules and tests. There is no evidence here that the extra tier would improve Warscythe. It should not displace fixing comprehension and acquisition clarity.

The transferable pattern is the separation of item ownership, achievement significance, and lasting history. Bungie's developers describe distinct collection/achievement jobs and preserved legacy accomplishments; Valve documents separate achievement progress, visibility and availability. These are design examples, not evidence of a retention lift in Warscythe. [Bungie collection announcement](https://www.bungie.net/7/en/News/article/46940), [Bungie Triumphs design](https://www.bungie.net/7/en/News/article/49507), [Valve achievement documentation](https://partner.steamgames.com/doc/features/achievements/ach_guide).

## The next presentation, in three connected moments

### 1. At completion: a receipt and a keepsake

Show the completed activity first, followed by the actual earned points/coins, item name, tier and whether it is new or a repeat. Offer one direct route to that exact item in the Ledger and an immediate Continue action. A brief optional reveal can make an important find feel ceremonial; repeated acquisitions should not replay the full discovery treatment.

Proposed motion timings, to test rather than claim optimal: normal first discovery 250–450 ms; a capstone ceremony under 900 ms with Skip; repeats 120–180 ms; reduced motion replaces travel/folding/scale with an instant state change or short opacity change. No mandatory scratch sequence for accessibility or urgency. Keep the existing quick decrypt route while evaluating an alternative.

The reveal must follow the stored award, not award on animation completion. Reloading, skipping, switching tabs, network retries and double-clicking must never create another reward. A visual “new” state needs a persisted definition; a UI rerender cannot decide that an old item was just discovered.

Supercell's chest design demonstrates the importance of a defined reward system around the reveal. Its repeated taps and event schedule are not prescriptions for a productivity app. [Supercell's historical chest introduction](https://supercell.com/en/games/clashofclans/blog/news/intro/).

### 2. In the Ledger: a readable collection

The proposed layout is a collection header, a stable catalogue and a single selected-item inspector. Start with Owned / Catalogue, search, tier and source filters. Owned cards show art, readable names and explicit tier labels. Locked/retired states have text or an emblem as well as color. Unknown future story text stays concealed until discovered.

At laptop width, keep the established gallery + side inspector frame geometry. At tablet width, open the inspector below the selected row. At phone width, show a compact two-column gallery or list, with a full-width detail sheet and a clear Back action. Keep the selected item and filter when returning. A giant ornamental frame must not squeeze the title or steal the collection's touch area.

Reuse existing frame families for the chamber and activity/source identity. Do not make a divine frame family synonymous with a rarity rank; that would confuse the established deity/chamber language. Differentiate rarity with a consistent badge silhouette, explicit name and restrained color treatment. Keep artifact tier, Fitness affinity and earned titles visibly distinct.

The inspector promotes existing data rather than inventing it: first recovery, latest recovery, number of valid acquisitions, real source context and a short lore passage. Where old data is missing, say unknown. A favorite/showcase slot is optional after users can reliably find what they just earned. No new crafting market is needed to make an object worth revisiting.

### 3. Later: the record survives

Maintain separate current-catalogue progress and historical ownership. Retired or unknown legacy entries remain inspectable. Do not expand a completed named volume/set retroactively and tell the user they never finished it. The 48-document volume is complete as a volume, even if a second volume is written later.

Valid duplicate awards remain a count plus their dated recovery records. Accidental duplicate events must be investigated as integrity bugs, not described as repeats. Duplicate protection, pity systems and conversion currencies are possible future policies; none is required for this first presentation test. If ever introduced, show the exact implemented rules and preserve existing entitlements.

## What “more effective” must mean

The target is useful recognition of the person's chosen task, habit or training—not more reward-screen time. Reward framing and context matter; points and visual feedback alone are not established causes of intrinsic motivation or sustained real-world progress. The behavioral sources include specific tasks, populations and outcome measures, not a clinical or universal verdict on gamification. [Ryan, Mims and Koestner](https://selfdeterminationtheory.org/SDT/documents/1983_RyanMimsKoestner.pdf), [Mekler and colleagues, institutional record](https://edoc.unibas.ch/entities/publication/ccec8ccc-aa54-417d-b205-334b518d6eed).

Working hypotheses:

- A clear activity → award → exact Ledger item path should reduce uncertainty about what was earned. Measure whether users can explain the reward and locate it; do not infer success from more clicks.
- Separating random scarcity from earned milestones should reduce the impression that a lucky Mythic makes one person's work more valuable. Ask users to explain the distinction without coaching.
- Shorter repeat treatment should reduce interruption during real work. Measure time back to the chosen activity and ability to inspect later, not reward-open count.
- Visible provenance may make an otherwise cosmetic object worth revisiting. Test actual recall and voluntary use; do not assume emotional attachment from a polished mockup.

These are qualified predictions, not measured effects or invented probabilities.

## Priorities and the gate before implementation

1. **Integrity and truth:** preserve event IDs and ownership; fix false catalogue counts (done); specify New versus Repeat; expose accurate acquisition rules. Review the Low-effort penalty separately with existing users before changing it.
2. **One presentation prototype:** current tiers, clear names, source receipt and direct Ledger return. Use the current data model. No new currency, sixth random tier or pity mechanic.
3. **Comprehension study:** 5–8 representative first-time/returning users as a formative usability check, not a powered causal experiment. Give them new, repeat, capstone and historical-item scenarios. Can they explain what was earned, why, whether it changed their work progress, and where to find it?
4. **Technical acceptance:** exact same awards through reveal/skip/reload/double-click; no lost recovery history; readable 320/390/768/1024/1440 layouts; keyboard and reduced-motion paths; no source/type filter that hides the just-earned item without explanation.
5. **Only then consider policy:** if a Legendary distinction or duplicate protection solves a demonstrated problem, write the acquisition/migration contract, simulate distributions against real activity patterns and test the proposed change. Do not present synthetic economics as production evidence.

There is no new rewards economy in this delivery. The source research, implementation audit and proposed next experiment are separate artifacts so an appealing idea cannot quietly become a shipped rule.
