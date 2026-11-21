# Warscythe UI polish verification

Local candidate, 21 November 2026. The original production checkout and prior uncommitted work were preserved. No stage, commit, push or deployment was performed. Preview: http://127.0.0.1:5176/.

## What changed

The established visual world is retained. New frames cover Forge, Legion, social panels, Fitness panels, map side panels and fourteen remaining dialog/secondary surfaces. Phone and tablet artwork can collapse. Workout logging has readable set controls and a focused session mode. The ten-step roadmap now also contains an optional, progressively revealed Kingdom Chronicle. The previous app-wide motion pass remains in place.

54 source files differ from the start of this pass, including new reusable components and targeted fixes. The accompanying JSON records exact files and hashes. This count excludes the earlier motion pass already present at the baseline.

## Frame placement

The asset inventory contains 95 frame pieces. Canvas dimensions alone were unreliable: several rails have a large transparent canvas around a thin visible strip. Each source was measured at alpha thresholds 8, 32 and 128. New placements crop the transparent canvas through an SVG viewBox at alpha 8, retain original corner proportions, and anchor corners at the intersection of their rails. Original pixels and all 95 files remain unchanged.

| Surface | Treatment |
| --- | --- |
| Forge | Hercules full frame and crest; preview width constrained to its available space |
| Legion garrison | Ares frame; existing level 1–10 avatar frames, clamped to the current tier |
| Social detail / standings panels | Ledger full frame; added scroll padding exposes the decorative edge |
| Collective operation form | Quiet universal corners |
| Fitness logger and secondary panels | Inset Hercules corners; dense set controls remain plain and readable |
| Map side panels and map/roadmap dialogs | Apollo corners |
| Ritual create/edit and focus task panel | Quiet universal corners |
| Auth, identity, information, cache manager and video help | Hermes corners |
| Premium dialog | Zeus corners |
| Shop and legacy gym log | Hercules corners |
| Vault dialog | Ledger corners |
| Guardian lesson cards | Hermes, with Apollo for the freed guide’s contextual exchange |

Existing Operations/Rituals portal frames, Ledger artifact treatments, task forms/details, reward ceremonies and authored Codex imagery remain. Frames follow panel ownership, not every input or small data row. All new decoration ignores pointer input and is hidden from assistive technology. Dialog corners are inset inside containers that intentionally clip or scroll. Full primary frames retain a small outward ornament bleed with enough surrounding scroll padding.

The geometry audit measures the new alpha-cropped frame elements and checks whether scrollable ancestors can reveal a piece. Normal offscreen content is not reported as permanently clipped. Long vertical rails are expected to span a scrollable panel, so their entire length is not required to fit a single viewport. Screenshots supplement those bounds checks; they do not prove every decorative pixel of legacy art has been machine-inspected.

## Mobile and workout behavior

Operations/Rituals scythes and the main Fitness deity decoration have accessible Show/Hide controls below 1024px. Preferences persist locally. The Scythe is expanded during its specific Guardian teaching moment, then returns to the saved preference. Collapsing the Fitness artwork leaves Olympus recognition accessible.

Starting a real workout enters workout mode. It hides the main header, navigation, other Fitness columns and floating terminal control, while keeping the logger and recovery controls. Minimize restores the app, and Resume returns to the same session. A sticky bar keeps Minimize and the current rest time reachable during long sessions. Archived templates also enter this mode.

The logger preserves split, exercise name, set type, load in kilograms, repetitions, per-set RPE, completion state and session notes. It shows previous recorded exercise/set values, supports fractional load, keeps notes in their original case and uses at least 44px controls. Finish requires a valid completed session; unfinished sets stay saved for correction or removal. Discard asks before losing an active session. The model remains a strength-workout logger; no new cardio schema or coaching system was added.

Rest time uses a deadline rather than counting delivered interval callbacks. It catches up after navigation or a delayed tab, supports pause/resume and adjustment, survives a same-tab reload, and stops its updates at expiry. Session data continues through the existing business store; the new UI-only store keeps focus and rest state in session storage. Cross-device or cross-tab rest-timer synchronization is not part of this change.

## Reproduced rough edges and fixes

| Gap | Cause and correction | Evidence |
| --- | --- | --- |
| Legion owner offered Exile on their own row | Role-label check disagreed with ownership checks elsewhere. Recognize owner ID and both creator/owner labels. | Before failed at 390/768/1440px; identical checks passed after. |
| Asset manager freezes | Cache scan published a fresh but identical downloaded-ID list into an effect dependency, causing repeated updates. Publish only changed lists. | Bounded baseline reproduction reached 13 writes before the test cap; corrected UI settled after 1. |
| Ritual practice skips the completion and Forge handoff | A generic highlight click and ritual-specific handoff both advanced the step. Give the ritual form its own gates; prevent repeated delayed advances. | Full campaign replay created and completed the practice vow, entered Forge, and cleaned up the practice record. |
| Guardian card covers its highlighted phone control | Large lower card and scrolling of overflow-hidden ancestors could move the control out of the teaching stage. Use a smaller phone card and scroll only user-scrollable containers. | Actual phone lessons through all ten milestones completed through their controls. |
| Exiting task form catches the next click | The fading form could still receive pointer input. Give the root an exit lifecycle and make it inert while absent. | Opening practice task can be reached after deployment; interaction/draft regressions pass. |
| Fitness practice opens real reward ceremony on exit | A practice Iron Report survived until the real Fitness experience remounted. Keep practice out of that report handoff. | Fitness lesson finishes with no canonical workout, no gym-log entry, unchanged campaign progress and no reward overlay. |
| Workout disappears from view / rest timer resets on navigation | Session existed in the business store but the timer lived only in the page. Add focused/minimized UI state and persisted deadline. | 46 mobile/recovery checks pass, including reload, notes, pause, many sets and long names. |
| Accidental workout discard or unfinished archive | Immediate Abandon and permissive archive controls. Add discard confirmation and explicit validation. | Canceling discard preserves the workout; unfinished archive stays active; valid archive occurs once. |
| Tiny set controls and repeated tutorial IDs | Compact flex rows and one ID reused on each set. Use labeled grids, 44px targets and the tutorial ID only on its first target. | Touch-height checks and duplicate-ID checks pass across four widths. |
| Frame ornaments clipped | Transparent padding and ancestor overflow were not accounted for. Use visible alpha bounds, inset quiet corners, available-width guards and scroll padding. | 115 responsive page/dialog cases, zero measured clipping/overflow/runtime exceptions. |
| Forge title contains a literal backslash | JSX text escaped an apostrophe unnecessarily. Correct the displayed title. | Rendered Forge title corrected. |
| React style-attribute warnings | Styled-JSX attributes were used without that transform. Remove unsupported attributes from 29 unprotected UI files; preserve their CSS. | Existing protected Fitness files excluded from this cleanup. |
| Local preview stops during builds | Windows file watcher attempted to watch a generated video copy. Ignore output artifacts in the development watcher. | Final build completed while preview remained available. |

## New onboarding format

The initial practice still teaches one Operation. Ten real Operations retain their original unlocks: Scythe, sound/focus, Rituals/Forge, Ledger, first liberation/map, inspection, friends, Codex/cosmetics, Legion and independent play. Short lore exchanges explain why each place matters. Actions still teach the controls; reading the Chronicle grants no progress.

The optional Chronicle connects the inhabited carrier dragon, its hostile sibling and the regional keepers. It offers a next-action prompt and replayable chapters alongside the original map. Future story outcomes remain sealed. The full proposed narration, timing, transition directions, separate portrait/landscape PNG briefs, game references and remaining phone recommendations are in [the storyboard](kingdom-onboarding-storyboard-20261121.md). No new PNGs or cinematic video are claimed as delivered.

## Verification

| Check | Result |
| --- | --- |
| Production build and PWA generation | Passed; no asset optimizer run |
| Existing Fitness reward domain suite | 8/8 |
| New deadline/pause/session-isolation checks | 3/3 |
| Workout interaction checks at 360, 768 and 1440px | 24/24 |
| Collapse, recovery, reload and worst-case logging at 360, 768, 1024 and 1440px | 46/46 |
| Final expiry, teaching-collapse and cache-loop regressions | 12/12 |
| Existing interaction / reduced-motion regressions | 24/24, zero page exceptions |
| Full fresh onboarding on 390px phone | Practice plus all 10 real milestones and their actual lessons completed |
| Separate Fitness practice on 390px phone | Completed; no real workout/reward report leaked |
| Chronicle gates and rereading on phone/laptop | 18/18; reading does not change progress |
| Responsive render audit | 115/115; 360×800, 390×844, 768×1024, 1024×768, 1440×1000 |
| Protected deity/affinity feature files | 14/14 byte-identical |
| Frame artwork | 95/95 byte-identical |
| Existing business store | Byte-identical |
| Lint compared with saved baseline | 160 existing diagnostics versus 161; zero new diagnostics |

Evidence is in the sibling chat workspace’s pass-evidence folder, with the earlier motion interaction regression under motion-evidence/interactions-ui-pass. The JSON beside this report records source hashes and check counts. Tests use an isolated browser fixture, block backend auth/data writes and do not exercise real accounts or purchases. Rest reload testing restores only the fixture identity after hydration because that fake identity has no real authenticated session; production sign-out cleanup is unchanged.

## Limits and follow-up

These are Chromium viewport/touch emulations, not physical iPhone/iPad or Safari checks. Real multi-user Legion permissions, authenticated cross-device sync, purchases and native background alarms were not tested. Asset-manager tests verify rendering and update-loop behavior; no paid download or destructive cache action was run. Existing lint debt remains, including protected code the user asked to leave unchanged. A full production-certification claim would be unsupported.

The current two-column phone Operations/Rituals layout can still truncate long titles. The storyboard proposes a separate single-stack phone review, preserving all detail inside task views. It is not silently redesigned here. Existing regional naming inconsistencies are documented before any lore renaming. The next step is user review of the local candidate, then the future storyboard art pass after the story and character titles are approved.
