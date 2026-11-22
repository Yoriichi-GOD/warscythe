# World archive and first-use delivery

22 November 2026. Candidate based on `79dcd379ca0d6796715dabbcbcf3819a8fc6d3dd`. This report records checks performed against the actual local application, not an assertion that a compile constitutes full product validation.

## Delivered behavior

**The Unquiet Post:** 48 original documents, approximately 5,725 words, connected across five threads in one kingdom. Letters, accounts, notices, prayers, witness records and prison scraps replace the region/five-chapter reading tabs. Finds follow a curated nonchronological order. All 48 records form a linked network; search, filters and related-document links operate on collected documents only. Existing completion totals and legacy fragment entitlements preserve the greater amount of reading access. The catalogue is a finite first volume, not procedural filler.

The header, Map correspondence panel and Ledger open the same archive. Letter view opens a physical folded paper treatment, with different materials for ledgers, scraps and prayers. Codex view turns actual HTML leaves with readable, selectable prose. Phone layouts use a portrait leaf; wider stages use spreads. Page controls and keyboard turn pages. Native prose is canonical; page count is a presentation that can change with the viewport. Text view remains available if the engine cannot load or the window is too short for a bound page. The book dependency is pinned, lazy-loaded and shipped with its notices/source-access link.

**Onboarding:** a short attributed-world introduction offers Task, Workout, Habit or Explore freely. Basic task/habit/workout tools are immediately available. Existing history prevents a compulsory reintroduction. Guidance advances from actual saved records, pauses when leaving its workspace, preserves drafts and can be resumed/chosen from the Chronicle. Returning users do not receive a permanent idle guide bar. The former oath/workout rehearsal is optional and can be left. The ten-victory Chronicle remains tied to earned Operations, with an introductory chapter available at the beginning; normal story notices no longer launch a forced tab tour.

New users no longer need to submit a practice Operation before their first real Operation can count. The existing tutorial flags separate learned controls from completed work; entering the guide awards nothing and leaves `firstTaskCompleted` false. Explicitly marked legacy tutorial tasks remain practice. The two classification conditions in the store changed; reward formulas did not.

The first-use task form suggests Low effort and a visible next-day deadline, compatible with the existing deadline rules. Category, effort, deadline, priority and substeps remain available in an expandable section. Existing drafts retain their chosen values. Habit and workout flows save real work rather than requiring a sandbox performance first.

## Bugs reproduced and corrected

| Observed problem | Correction | Evidence |
| --- | --- | --- |
| Body-level Operations ornament overlapped the archive heading | Hide portal furniture while the archive is open | Visible-page checks and screenshots at six widths |
| Book rebuilt as its page output changed, briefly going blank or restarting | Freeze the engine's initial page for a mounted binding | Presentation switch, repeated mount and page-turn checks |
| Rotation could land on the previous document's left leaf | Begin documents on fresh spreads and restore the logical document/paragraph | Last-document deep link rotated portrait → spread |
| Long book titles crowded prose | Measure each document heading and reserve its actual height | Every source word preserved; every document measured at narrow/wide leaf sizes |
| Reading restoration discarded paragraph position | Persist and reconcile the paragraph anchor | Domain restore checks and close/reopen browser checks |
| A short landscape window could remain in a layout spinner | Explicit short-window message with the Text view still available | 844 × 390 browser check |
| Simplified default Medium deadline violated the existing three-day requirement | Suggest a small Low task; keep all effort/deadline rules | Real first-use save and completion through UI |
| An invisible exiting Task Detail captured Finish clicks | Make its exiting layer inert and stop pointer input | Click trace reproduced the interception; full reward flow passed after correction |
| A closing Chronicle could intercept the newly revealed guide controls | Apply the same exit-input protection | Chronicle → guide → optional rehearsal → leave regression |
| Ledger denominator said 125 despite 30 names × 5 tiers | Derive 150 from the catalogue; count current variants uniquely and preserve historical entries separately | Domain tests and card/inspector checks at 320/768/1440 |
| Missing artwork produced a broken historical-item image | Accessible unavailable-art fallback, without deleting/replacing the record | Card and inspector failure cases at three widths |

## Verification performed

- **35/35 domain tests:** archive entitlement compatibility/search/links/reading state, manuscript IDs/connections/content, goal guidance, catalogue/repeat preservation, existing Fitness rewards, startup policy and WebP resolution.
- **71/71 reader checks:** 320, 360, 390, 768, 1024 and 1440 widths, plus short landscape, reduced motion and reflow. Included native mouse selection, page/prose bounds, full-manuscript word preservation, heading/footer separation, search, presentation switches, bookmark return, focus return and runtime errors.
- **7/7 reader edge checks:** chosen last document, rotation at the same document, final-page boundary, keyboard turns, close during a turn, repeated React Strict Mode mounts/teardown and a deliberately blocked book-module download falling back to the canonical text.
- **10/10 initial goal-flow checks:** real task/habit saving, no invented work progress, immediate workout access, real set entry/completion and minimize/navigation preservation.
- **17/17 journey edge checks:** paused guide and draft recovery, first actual Operation → confirmation → unchanged first Epic reward → one global discovery, optional chapter notice, actual workout archive, restored-record guide recovery, skippable prologue bounds and existing-account preservation, Chronicle access to optional rehearsal.
- **23/23 Ledger/entry checks:** unique/current/historical count separation, all owned cards, repeat recovery history, missing-art fallbacks in card and inspector, shared archive entry, Map entry and page bounds at phone/tablet/laptop widths.
- **24/24 existing workout regressions:** 360/768/1440; parameters, set completion, rest timer, navigation/minimize, canceled discard, unfinished-session guard and exactly-one archive.
- Full `npm run build` passed, including the existing generated-WebP pipeline and PWA build. Generated image files had no Git drift.
- Source comparison found **no introduced lint findings**. The touched legacy files still have 39 pre-existing errors versus 41 in their baseline; this is not a claim that repository-wide lint is green.
- **109/109 protected hashes match**: Fitness-v2 source and public frame assets. No unexpected changes to other baseline source files. Private handover/bible files and the pre-existing `SECURITY_FIXES.txt` change are excluded from release staging.

The browser suites use isolated local fixture accounts and block cloud mutations. They exercise the real components/store/actions. The auth service is deliberately blocked, so an account-restore scenario supplies its recorded fixture state after reload; this proves guide/migration behavior with restored data, not a live Supabase authentication or cross-device sync test. Earlier failed test attempts were diagnosed before the final runs; no simulated cloud success is reported.

## Performance and practical limits

The bound-reader code is loaded separately from the core reader and plain-text path. There are no new large raster story assets. The full PWA build still precaches its generated chunks, so lazy module loading is not a claim of zero additional background transfer. Build sizes are available in the build output; no retention, page-load improvement or device frame-rate gain is inferred from them.

These are Chrome responsive/interaction checks, not physical iPhone/iPad/Safari/Android hardware validation, a full screen-reader study or an empirical novice onboarding study. No real user's production account was exercised or altered for QA.

The wider app retains legacy map-stage versus art-province naming differences. This release does not silently rename production geography or the Fitness pantheon. The new volume's common-world canon, event chronology, knowledge boundaries and unresolved story obligations are documented in `world-archive-editorial-bible-20261122.md`. That gazetteer decision should precede another province or geographic storyboard asset pass.

The reward research is a separate ten-source report plus a current-code audit and bounded next plan. Larger collection redesign, a new Legendary acquisition contract, duplicate protection, economy changes and reward efficacy testing remain proposals. The only reward-display work shipped here is the verified count/artwork correctness fix; drop odds, points, coins and affinity rules remain intact.
