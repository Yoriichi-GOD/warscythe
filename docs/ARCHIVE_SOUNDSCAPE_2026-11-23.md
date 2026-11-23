# Archive, Fitness and Soundscape release

## Definition of done

- Custom keyboard-operable archive filters preserve earned-document filtering.
- Stronger neutral frost on archive, Fitness training split and Soundscape menus.
- Soundscape opens downward and rotates only when media reports audible playback.
- Stale audio requests cannot tear down a newer track; failures offer retry.
- Main lore library receives frames/dividers; letters and book pages remain unchanged.
- Phone, tablet and desktop popup boundaries verified; build and regression tests pass.
- Commit only the release allowlist, preserve private work, deploy, then verify the live site with old caches bypassed.

## Local verification, 23 November 2026

53 Node tests passed, zero failures, including 11 audio regressions. Production Vite build passed after the final timer correction, with 2,353 modules and a 67-entry service-worker precache. The full image-optimization/build pipeline had passed earlier in this task; no image inputs changed afterward.

Archive filters were exercised with mouse, arrows, Home/End, typeahead, Enter, Tab, Escape and outside clicks. Letter filtering returned the expected 18 documents; Letter plus Closed Road returned nine; reset returned 48 in the Veteran test fixture. Unfound-document protection is covered by the existing domain tests.

Archive frame bounds and menus were checked at 320x568, 390x844, 768x1024, 1024x768 and 1440x900. Fitness and Soundscape received final five-size replays after the navigation-boundary adjustment. All final menus fit the viewport and stayed above the app navigation; both requested menus opened downward. Fitness End navigation kept Custom Workout Split visible in every size. Tab did not start a workout; selecting a split entered the existing workout flow.

Real local-browser audio playback and remote track switching passed. Retry recovered from an injected one-shot autoplay refusal. Volume and Operations/Rituals navigation preserved the chosen track. Pause released both audio elements and fade timers and stopped the spinner. The temporary failure harness was removed. This checks decoded media playback state, not a physical speaker listening test.

The failing old-track race was reproduced before the fix. A real-browser crossfade also exposed a Window timer receiver error in the candidate; it was fixed and given a regression test before release.

Actual Letter and Codex views were opened, and book pagination worked. The new library ornaments were absent from those readers. Nineteen protected archive/Fitness source hashes and the pre-existing private SECURITY_FIXES.txt hash remained unchanged. Scoped lint comparison found zero new diagnostics (16 existing errors remain in the touched legacy files, down from 22).

## Scope and limits

No deity-affinity, reward calculation, document authoring, image asset or native application changes. The existing audio catalogue still contains ten regional tracks plus two theme tracks; later regions retain their previous fallback. Browser sizes simulate devices; physical phone/iPad, Safari, native Android and exhaustive app-wide testing were not performed. The native discard-workout confirmation could not be automated reliably and is not claimed as a passed check.

Evidence JSON and screenshots are in `after/`. Deployment status, final commit and live checks are recorded separately after publication.
