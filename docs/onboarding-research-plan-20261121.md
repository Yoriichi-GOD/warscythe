# Warscythe onboarding research and proposed plan

21 November 2026. Research and planning only. No product implementation, state migration, account interaction, commit or deployment is part of this work.

## Recommendation

Give Warscythe a short playable prologue that teaches one useful workflow, followed by optional lessons at the moment a feature becomes relevant. Keep the ten-victory roadmap as the campaign's Chronicle. Completing that story and learning to use the app should have different finish lines.

The world can remain deep. The immediate action should be plain. Frame families, serif typography, characters and the living-dragon setting remain the presentation system; the learning sequence becomes smaller and more responsive to the user's purpose.

This is a design hypothesis supported by source inspection and external references. No novice study, activation baseline, retention effect or comparative performance has been measured.

## What the games actually support

| Reference | Verified primary evidence | Useful adaptation |
| --- | --- | --- |
| Clash of Clans | Supercell's 2021 Starter Challenges announcement describes progression-linked challenges that reveal more challenges after completion. Its 2019 Practice Mode announcement describes a guided initial attempt, then replay or independent strategy. [Starter Challenges](https://supercell.com/en/games/clashofclans/blog/game-updates/spring-update-sp2/), [Practice Mode, Spanish original](https://supercell.com/en/games/clashofclans/es/blog/game-updates/training-und-layoutlinks-2/) | Use a small action/result/next-opportunity loop. Introduce a feature when the player has a reason to use it. Offer independent use and replay. The exact sequence should follow productivity needs rather than copied game timers. |
| Elden Ring | Bandai Namco's 2 March 2022 guide describes Cave of Knowledge practice, conditionally teaching magic to magic users, and rereading completed tutorials from the Info menu. [Official early-game guide](https://en.bandainamcoent.eu/elden-ring/news/elden-ring-early-game-tips) | Teach the selected route, preserve a place to recover instructions, and keep mystery in the world rather than in the meaning of a control. |
| The Elder Scrolls V: Skyrim | Bethesda's original PC manual explains that selecting an active quest connects the journal to its destinations, while the Help menu retains instructions. It also documents skill progression through use. [Official manual, printed pp. 5 and 10](https://assets.ctfassets.net/rporu91m20dc/2VLVwistnGywCKuO8CUwCE/12180919f2102d4253bb034b0bb4b632/manual_skyrim-le_pc_en-int.pdf) | Make the Chronicle a reliable return point with a current objective, discovered history and optional help. Let users establish their preferred activity by using it. We do not need to copy Skyrim's compass arrows. |

NN/G's mobile-onboarding research recommends brief, optional instruction focused on what is necessary, and timely, unobtrusive guidance during a task. It also warns that explanatory overlays cannot repair an unclear interface. [NN/G, 21 June 2020](https://www.nngroup.com/articles/mobile-app-onboarding/)

Evidence limits: the Clash examples above describe their published 2019/2021 designs, not a replay of the November 2026 opening. Supercell's [16 November 2026 release notes](https://supercell.com/en/games/clashofclans/blog/release-notes/the-clash-of-titans-update-is-rolling-out/) explicitly change some tutorial guidance, reinforcing that version distinction. Original tutorial videos could not be inspected. No exact cannon/attack/economy order, gem prompt, duration or forced action is asserted. Skyrim is the representative Elder Scrolls title used here; its entire opening dungeon was not replayed. The suggestions in the right-hand column are our design inferences, not developer intent or measured effects.

## What is currently asking too much of the user

The current implementation already contains good foundations: progressive milestones, usable highlight rings, real interactions, explicit rehearsal labels in several lessons, a story Chronicle and repeatable help. This is a sequencing refinement rather than a reason to discard those systems.

The static inventory found 48 authored steps across seven active tab-lesson definitions, 16 Guardian milestone messages, and nine Fitness walkthrough steps. The tab and Guardian copy contain approximately 1,585 words, before the Fitness walkthrough and other forms. These are authored totals across the journey, not a claim that everyone must read 73 screens in one sitting. Unused legacy Ritual steps are excluded; Codex/Shop aliases reuse part of the existing Lore definition. The inspected files and counts are recorded in the sibling chat workspace's onboarding-research/current-audit.json.

Specific source findings:

- App.jsx gates Rituals and Forge until three onboarding Operations, Ledger until four, Map until five, and Social until seven. Fitness has separate first-entry oath and practice handling. The same Operation count therefore influences access to activities with different user goals.
- App.jsx automatically changes tabs for post-Guardian lessons. The user can finish useful work and be transported into a different subject.
- GuardianOverlay.jsx has contextual cards at early milestones, while later messages use a full-screen darkened presentation. Milestones can also have pending reward, region, level, title and subsequent lesson states. The exact sequence depends on the user's state; there is no claim that every completion always shows all of them.
- TabTutorialOverlay.jsx has a 15-step Lore/Armory definition and an eight-step Legion rehearsal. Its common GuardianCard has continuation controls but no general skip/save-for-later action. A phone card can occupy up to 42dvh of the viewport.
- TaskModal.jsx teaches category, effort and other fields through a multi-field sequence. The store initially flags a created Operation as tutorial work until firstTaskCompleted changes; tutorial work is excluded from regional progress. That separation needs to be explicit to a new user.
- RoadmapModal.jsx describes ten task milestones as onboarding and feature unlocks. KINGDOM_CHAPTERS already provides a narrative structure that can carry the campaign instead.

These findings support a likely burden from terminology, interruptions and route mismatch. They do not prove which one causes the recurring complaints. That requires observing new users.

## The proposed first-use experience

### 1. One scene, one premise

Use one short, skippable panel over existing world art. Proposed copy for review:

> The kingdom rests on a living dragon. Its sibling's creatures have broken the roads. Restore the way, one kept promise at a time.

Keep the divine parents, regional Empresses, villain's history, currencies and equipment taxonomy for later chapters. This is a shorter introduction to the existing canon, not new approved names or a replacement cosmology. A five-minute full story can remain optional Chronicle content; it should not precede basic use.

### 2. Let the purpose choose the first lesson

Offer three concrete starting actions: **Start a task**, **Log a workout**, **Build one habit**. Operations is the default recommendation for someone unsure. This choice is reversible and is not a permanent character class. An Explore freely option provides the independent route.

The screen is worthwhile only if it makes the subsequent workflow meaningfully shorter. If testing shows the question itself causes hesitation, use an Operations default and expose the other two entry actions beside it rather than adding a survey.

### 3. Guide real work in a small sequence

| Starting action | Guided work | What waits |
| --- | --- | --- |
| Start a task | Give one genuine task a title; use visible, editable defaults; optionally identify one small next action; save it and show where to resume or finish | Explaining every category, effort tier, priority, deadline and breakdown control |
| Log a workout | Enter focused workout mode; choose one movement; enter the relevant load/repetitions or other supported fields; record an actually performed set; show saved state and recovery when relevant | A full Pantheon tour, every RPE/set-type explanation, blessing inventories and all progression parameters |
| Build one habit | Name a real recurring action; set its cadence; save it and make its next occurrence/completion control clear | The complete streak-weapon catalogue, Forge shelves and cosmetic shop |

All advanced parameters stay reachable. The guide simply stops demanding that they be learned before the user can act. Necessary workout parameters cannot be dropped merely to shorten onboarding. Existing deity affinity/reward calculations are explicitly out of scope.

Instruction ends once the user can save something meaningful and knows the next action. An Operation might take hours or days to perform; onboarding must not trap someone until it is completed. A saved plan is a setup success, while a completed real action is a separate activation measure. Never encourage marking an unfinished task, habit or exercise complete just to advance the guide.

Optional practice can remain a clearly labeled Training Ground. Its data and rewards must stay separate. A real first Operation must not be silently classified as disposable practice; changing that classification would require an explicit future contract and migration review. Reading, clicking through guidance or rehearsing never earns regional victories or Fitness affinity.

### 4. Show the result and return control

After saving, highlight the real saved item. After genuine completion, highlight the actual consequence: recorded history, earned reward or current regional progress. Say what happened in plain language. Distinguish local saving from confirmed cross-device sync when applicable.

Offer one primary next step such as Continue working, with a quieter Explore the next chapter choice. Consolidate a milestone's related rewards into one intelligible celebration instead of automatically chaining a reward reveal, title reveal, narration and a new tour. Detailed lore and reward inspection remain available on demand.

### 5. Convert the ten steps into the first ten victories

The existing ten-node map becomes the campaign Chronicle. It records earned story events and keeps one recommended next action visible. Basic onboarding can be finished while the campaign is only beginning.

Separate three concepts in the future design: **access to a useful tool**, **whether its lesson has been learned**, and **earned story/reward progression**. Do not let one counter stand in for all three. This is a proposed behavior contract, not authorization to bypass permissions or earned rewards. Existing users keep their current progress and should not be thrown back into a new compulsory tutorial.

## When the rest of the world should appear

| System | Suggested learning trigger | Access/progression distinction |
| --- | --- | --- |
| Operations | Chosen starting action | Core task creation remains immediately usable |
| Rituals | Habit intent or an explicit wish to repeat an action | Avoid requiring unrelated completed Operations to create a habit |
| Fitness | Workout intent or first voluntary Fitness visit | Begin logging through brief contextual help; keep the oath/story optional and preserve the deity system |
| Ledger | First saved/completed item the user wants to inspect | Basic own-history access should be immediate; deeper relic/story discoveries can remain earned |
| Forge | First relevant earned item or deliberate exploration | Explain one equip/preview action; no compulsory tour through every shelf |
| Map | User asks where they are or an earned region event occurs | Show orientation early; preserve real requirements for region liberation and rewards |
| Friends/Legion | A genuine invitation, cooperation goal or voluntary visit | Use actual membership/permission prerequisites, not an unrelated solo-task quota; solo use remains complete |
| Codex | User opens lore or earns a story chapter | Rich optional reading, replayable at any time once earned |
| Shop | Deliberate visit | No required purchase, currency spend or shop inspection in the core learning route |

The exact existing milestone contracts should be reviewed before implementation. The table proposes contextual teaching and basic tool availability; it does not promise that all story content becomes unlocked immediately.

## Highlights without arrows

- Highlight one control or changed result at a time. Keep a short instruction adjacent to it, with the same action wording as the actual control.
- Explain both the action and its immediate value: Add one task you want to finish today; then Your task is saved here. The Guardian supplies voice and warmth without narrating every icon.
- Add a plain-language meaning on first encounter: Operation — task; Ritual — recurring habit; Ledger — history. Retain the fantasy labels.
- Keep phone guidance compact and nonblocking. Scroll the target into view only when needed; account for the keyboard and fixed bars. Avoid instructions such as above when the target can move responsively.
- Offer Later, Skip guidance and Resume from the Chronicle. Preserve entered work when guidance pauses. Do not switch tabs on someone's behalf while they are doing something else.
- Advance on a verified successful action, not just a click. An empty submission, loading request, error or canceled confirmation is not a completed lesson.
- Keep the guide readable with reduced motion and assistive input. A highlight has accompanying words and normal focus behavior; color or animation alone cannot carry the instruction.

These are proposed Warscythe presentation rules, not a claim that Clash itself avoids arrows.

## How the lore should unfold

1. Arrival: the living dragon carries a kingdom; one road needs your help.
2. First genuine result: the Guardian connects a kept promise to the actual progress shown by the app.
3. Voluntary feature entry: recurring watchfires explain Rituals; the anvil explains Forge; the archive explains history. Only introduce the character needed for the current scene.
4. Earned first-region liberation: the freed guide shows what that real victory restored and offers the next destination.
5. Deeper Chronicle: reveal the divine family, hostile sibling and regional accounts in earned chapters or voluntary reading.

The current regional names, Empresses, titles and Fitness deities remain intact. Reuse the existing storyboard as a library of story moments, while changing its mandatory placement. Lock the action flow before generating more PNG layers, narration or cinematic transitions.

## The next work, in order

1. **Observe the existing flow.** Run a small formative study with 5–8 first-time users, including people who arrive for workouts or habits. Give them a real goal and ask them to think aloud. Record where assistance is needed. This has not been performed.
2. **Write a click-through storyboard.** Prototype just the short Operations route and Fitness entry, plus skip/resume. Start with existing assets and plain static frames. Add the Ritual route after the core pattern is understood. This is a future deliverable, not implemented by this research.
3. **Test the proposal with fresh novices.** Check independent use and recovery from interruption. Do not infer retention or statistical significance from this small qualitative sample, or treat speed gained from prior exposure as evidence of the redesign.
4. **Implement the smallest validated change.** Prefer reducing forced handoffs and teaching one loop before creating a new general-purpose onboarding framework. Review first-real-work classification, progress preservation and old-user migration explicitly.
5. **Extend, then produce the story assets.** Apply the proven learning pattern to remaining contextual lessons. Only then storyboard/render the richer cinematics.

Suggested measures: time to first saved useful item (separate from time spent doing real work), unassisted completion of a second action, number of interruptions, help requests, use of skip/resume, and ability to explain what happened and what to do next. Next-day return and repeated real use require a later cohort observation; they are not established here. Numeric time/retention targets should follow the baseline rather than being invented now.

Definition of Done for a later implementation: a novice can perform the chosen core workflow, locate its real saved result, repeat it without coaching, pause/reload/resume without lost input, and opt out of guidance. Practice cannot inflate victories or rewards; duplicate events cannot award twice. Layouts work at phone/tablet/laptop sizes, including keyboard and reduced motion. Existing users retain progress. The underlying controls remain usable after all teaching overlays are dismissed.

Expected consequence, not a measured outcome: reducing mandatory explanation and matching the first route to intent should make the initial action clearer. The main risk is reduced discovery of secondary systems. A visible Chronicle, clear optional destinations, and timely invitations to relevant features are the countermeasure. If new users still cannot perform the core action without help, improve that control or wording before adding another tutorial card.

## Inspected local evidence

- src/App.jsx: tab gates, Fitness entry, navigation sealing, post-Guardian handoffs and pending milestone overlays.
- src/components/TabTutorialOverlay.jsx: seven active lesson definitions, GuardianCard, highlight behavior and rehearsal flows.
- src/components/GuardianOverlay.jsx: milestone dialogue and contextual/full-screen presentation.
- src/pages/Fitness.jsx and src/components/FitnessOathGate.jsx: first-entry story and nine-step workout rehearsal.
- src/components/TaskModal.jsx and src/store/useWarscytheStore.js: field-level creation guidance, tutorial classification and earned regional progression.
- src/components/RoadmapModal.jsx, src/data/kingdomChapters.js and docs/kingdom-onboarding-storyboard-20261121.md: current campaign/story model.

The user reports recurring onboarding complaints. No complaint transcripts, funnel data, fresh production account or physical-device usability session were inspected. The report distinguishes source facts, external references and proposed behavior accordingly.
