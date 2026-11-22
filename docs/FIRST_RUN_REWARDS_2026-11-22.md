# First-run usability and 2D reward delivery — 22 November 2026

Starting checkout: 0826386354f5fc2cfd6051a0710c71e7eb91ac08. This change follows the new-user walkthrough and the request for game-style reward collection.

## Finished behavior

- A first real Operation can be saved with the visible defaults. The goal guide no longer competes with hidden legacy field instructions. New tasks count as real work; one real completion advances the campaign and earns its first archive document. Explicit older practice tasks keep their practice status.
- Guidance can be hidden, paused in a compact strip and resumed through the Kingdom Chronicle. The Operations highlight now has its intended target.
- Without an existing display preference, a newcomer starts with the Scythe folded sideways. Expanding and folding it actually redistributes width to the Operations column. Saved display choices are respected.
- Command widgets explain their unlock instead of filling the panel with an enormous animated padlock. Ritual medal projections and already-earned Ledger inspections remain accessible without unrelated personal-Operation requirements.
- Legion is available without completing nine personal Operations. On mobile, the current board appears before the garrison. Owners expand “New shared Operation” when needed; the existing form, membership checks and action permissions remain. Friends and joining guidance use clearer names.
- The workout log explains that a split names a session, exposes the existing exercise chooser, and explains RPE/AMRAP beside the sets. No exercises or completed sets are invented. A minimized session no longer produces a second Resume dock over its own Fitness form.
- Ledger includes recorded Ritual check-ins in the calendar and daily history. Replayed event IDs are deduplicated; deleted-Ritual titles remain readable. Missing historical check-ins are not manufactured. “Focus Journal” distinguishes work messages from the Kingdom Chronicle.
- The map distinguishes known outposts from completed Operations. Forge copy explains daily power, streak weapons and optional cosmetics. Optional cosmetics can be browsed before eight Operations, with the existing payment/ownership checks retained. Sign-in agreement appears before the disabled sign-in choices; Personal Mode help points to the actual Leaderboard control.

## Reward experience

First finds, boss victories and new high-rarity variants receive a full discovery reveal. Routine repeats use a smaller nonmodal card with optional inspection and a short auto-collection delay that pauses during interaction. Actual recorded XP, coins, keys, task context and item details are displayed.

The item arrives above a rarity aura inside one of three illustrated settings: a roadside cave, castle alcove or courier’s dispatch box. Collecting sends it toward a lower-right chest, which enters, shakes, opens, receives the item, closes and leaves. The transfer lasts about 1.3 seconds after Collect. A short receipt links back to the Ledger. An actually earned document can be collected and opened directly in the existing reader.

The queue preserves two synchronous completions in order and rejects repeated event IDs. Completion still owns the award; the presentation does not grant anything. Skipping, repeated collection, failed artwork, reduced motion and account-reset interruption do not duplicate the credited state. The queue is session-local; recorded inventory and progression remain authoritative if a page is refreshed during a ceremony.

Reduced motion uses a short fade and receipt without the flying item or chest shake. Focus is trapped in the full dialog, Escape skips motion, and collection controls remain reachable at 320 pixels. Ordinary rewards do not require the former decrypt-and-claim sequence.

## Artwork and packaging

Five new images were generated directly for this change: matching closed/open chest states plus the cave, castle and dispatch-box staging illustrations. Their original PNGs are preserved in the local evidence folder. Only transparent WebP derivatives are shipped. Sampled outside corners have zero alpha; browser captures confirm the illustrations blend into the reward panel.

The five WebP files total 299,886 bytes. Scenes are requested when used; the chest pair is preloaded in the signed-in application. The native asset policy retains this small set for offline use. Artwork selection is presentation context, not a new canonical lore event or an invented document unlock.

The existing frame families are reused by rarity: Hermes, Apollo, Zeus, Artifact and Ares. Existing frame source artwork and Fitness deity Affinity calculations remain unchanged.

## Verification

- 42 domain/startup/asset/reward tests pass, including the native reward asset-retention contract.
- 117 browser assertions pass across the guided first save, five-width working-flow checks, reward presentation, real first completion/document access, rapid completions, failed artwork and interruption paths.
- Working flows checked at 320, 390, 768, 1024 and 1440 pixels. All three discovery scenes and all five rarity frames checked at 320 pixels. Chest transfer checked at 390 and 1440 pixels.
- Real client completion paths were exercised with isolated Test Realm/synthetic records. Ritual completion records one check-in without advancing regional Operation counts. Repeated collection preserves the already-awarded state.
- Production build passes. Preview controls and their opening event are absent from production output.
- Source audit: no introduced lint findings. The changed files still contain 70 pre-existing lint errors versus 71 at the starting snapshot; this is not a claim that the whole repository has a clean lint run.
- All 109 protected Fitness/frame hashes match the starting snapshot. The pre-existing private SECURITY_FIXES.txt content is preserved and excluded from the commit, alongside the other private/unrelated files.

### Motion measurement and limits

The first slower-CPU development run exposed a long pause at the handoff. A timeline trace attributed the largest task to React’s surrounding interface update, rather than the item’s transform animation. Portal decoration stays suppressed through the transfer so it is not restored halfway through the chest sequence.

Three production-browser samples at Chrome’s simulated 4x CPU slowdown recorded 95th-percentile animation-frame gaps of 4.3–8.3 ms and largest gaps of 62.6–129.5 ms, concentrated at handoff boundaries. These are local headless-browser observations, not a physical-phone benchmark or a promise of stutter-free 60 fps. The broader application update still has measurable cost and should be profiled separately before attempting a large state/rendering refactor. No unqualified speed-improvement percentage is claimed.

Email/OAuth delivery, live-account synchronization, real teammate actions, payments, a physical iPad/phone and an installed APK were not exercised. Existing backend/payment rules were not rewritten. The native asset-retention rule is tested, but no new native package was built.

## Replay it locally

1. Open http://127.0.0.1:5176/ and refresh after the update.
2. Enter Test Realm; use Ctrl+Shift+P if its control panel is hidden.
3. In “Reward chest preview”, choose a setting and rarity, then “Play discovery reward” or “Play quick reward”. These previews do not grant progress.
4. Existing reader previews remain available in the same panel. In a normal journey, completing an actual Operation exposes its earned document from the reward card.

Local evidence: first-run-rewards-20261122/after contains the assertion results, screenshots, asset audits, production motion samples and verification manifest. The source candidate and original generated images are retained beside it.

## Definition of Done

The requested first-run fixes, working-area changes, three discovery settings, animated chest transfer, progress-free replay controls and regression checks are implemented and verified as described above. Commit and deployment verification are the remaining release steps; hosted checks must match this candidate’s generated assets before the release is called live.
