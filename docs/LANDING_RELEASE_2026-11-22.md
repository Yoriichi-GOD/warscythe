# Combined world typography and landing release

Base: 9b1bbead8bb63b93eccb1deda9245e73d162bb1f. User authorized commit, deployment and a fresh-cache public check.

## Result

Existing world artwork and the interactive map remain. The landing now has distinct type roles: upright Times New Roman reading, Cormorant Garamond display titles, EB Garamond quotations and Source Sans 3 controls. Heading dividers use existing alpha-bound artwork. Story chapters and the thesis receive sentence reveals; desktop environments receive restrained depth. Phone/tablet environments remain still. Offscreen narrative groups stop being measured on every scroll, and layout reads precede animation writes. Pause and operating-system reduced-motion preferences keep all text readable. Manual pause also disables animated section navigation; this was reproduced and corrected in the browser.

The approved glass experiment ships with the landing: blurred neutral reward/reader/Chronicle/workout windows, varied regular-weight typography, local licensed fonts, shared artwork dividers, measured book pagination and a reachable Collect action for long names. Deity Affinity and reward calculations are unchanged.

## Regressions checked before release

- 42 domain, archive, onboarding, startup, asset and reward tests passed again on the combined candidate.
- Landing checked at 320, 390, 768, 1024 and 1440 pixels; headings, entry buttons, map chapters and product images fit. Pause, reduced motion, legal dialog and playable demo were exercised.
- Fresh Test Realm: saved and completed one real Operation, received one campaign advance and artifact, collected it through the chest and read the earned letter.
- Bound reader laid out all 48 documents without folio overlap at phone, tablet and desktop sizes; at 320x568 the intentional short-window Text fallback was selected and readable. Actual page turning worked.
- Workout: completed 20 kg x 5 at RPE 7, minimized, returned through Resume, archived one session and confirmed the same set in Ledger. Found and fixed the chapter notice covering Resume on a phone: defer that notice while a workout is active, preserving the pending chapter.
- Daily Ritual produced one check-in and its smaller reward receipt; Operation completion count stayed one. Ledger showed Operation, Ritual and Fitness as three separate events.

The earlier glass-only pass additionally recorded 142 browser assertions including blocked-font fallback, long-name reachability and reward previews. Those are earlier evidence, not a claim that all 142 were rerun in this release.

## Release evidence and limits

Local evidence is in the separate workspace's landing-release-20261122 directory. Final build, source audit, public deployment identity and fresh-cache measurements are recorded there. Five local Latin WOFF2 files total 112,140 bytes; adding these to the public landing is an intentional cost, not an asserted speed improvement.

Browser emulation does not establish physical phone/iPad performance. Authenticated cloud synchronization, every optional theme and native installation were not validated in this pass. Test Realm changes were isolated from real accounts. Only cached Warscythe resources and service-worker registrations are cleared for the public check; account storage is preserved.

## Post-deployment correction

The first live inspection found the reader's computed blur was none and the workout retained its old 4px blur. Reproduced the production minifier collapsing paired variable-valued backdrop-filter declarations to only the final prefixed spelling. A separate standard-property @supports rule now preserves the intended modern-browser filter while retaining the prefixed fallback for older Safari. This is verified against the actual rebuilt CSS and computed styles, not inferred from the development preview.
