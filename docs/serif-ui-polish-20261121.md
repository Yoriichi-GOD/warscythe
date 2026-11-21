# Serif typography and workout surface polish

Local candidate, 21 November 2026. Preview: http://127.0.0.1:5176/. No staging, commit, push or deployment.

## Result

The workout resume dock now has a 22px phone / 24px desktop radius, a filled gold pill action, a workout icon and a clearer caption/title hierarchy. On phones the action reads “Resume” while its accessible name remains “Resume workout.” Ordinary workout titles remain visible; exceptionally long titles truncate inside the dock and retain their full title attribute. The phone dock clears the bottom navigation crest, and the War Terminal moves above it.

The workout status bar, set cards, inputs, exercise suggestions, notes, finish action and discard action now have consistent curved edges. Fields remain upright, at least 16px on phones and 46px tall. Set completion and other controls retain at least 44px targets. Keyboard focus remains visible. Workout callbacks, persistence and reward calculation are unchanged.

Times New Roman is the main interface family, including older component overrides and body-level dialogs. Source Serif 4 italic provides headings, narrative text and literary accents, with Times New Roman italic as its fallback. Labels, editable values and timers remain upright. Literal code and keyboard shortcuts keep a code font. The scratch-card canvas label explicitly uses Times New Roman; canvas cannot resolve a CSS custom property in its font string. The old multi-family Google import was replaced by one italic serif request with font-display swap.

## Scope and preservation

Eight source files changed from the saved pre-typography snapshot: App.jsx, Fitness.jsx, main.jsx, styles/main.css, styles/typography.css, components/WorkoutStatus.jsx, components/workoutSession.css and components/ScratchCard.jsx. index.html also changed to load the italic face and scope the application typography. WorkoutStatus contains the reusable resume dock and workout status bar. Earlier uncommitted work remains present.

All 14 protected Fitness feature files, all 95 frame assets and the business store are byte-identical to the earlier preservation baseline. The requested global typography affects the rendered Fitness text; affinity and reward logic were not edited.

## Definition of done and evidence

| Requirement | Evidence |
| --- | --- |
| Curved workout surfaces and usable controls | Render inspection on phone and laptop; 37/37 targeted typography, geometry, keyboard, long-title and reduced-motion checks |
| Times New Roman plus italic serif across pages/dialogs | 115/115 rendered cases across 360, 390, 768, 1024 and 1440px; visible non-code text reports the two requested serif stacks; browser platform-font inspection confirms actual Times New Roman glyphs |
| Preserve workout behavior | 24/24 interaction regressions: logging parameters, rest timer, minimize/navigation/resume, cancel discard, archive guards and valid archive |
| Fitness artwork clears the new text | 15/15 overview, active-session and focused-session cases; zero measured frame-alpha/text intersections or panel clipping |
| Sideways collapse still enlarges Operations | 10/10 Operations/Rituals cases; 44px restore rail, larger primary panel, preserved Command Center width and correct expansion restoration |
| Preserve affinity/rewards | 8/8 existing reward domain tests; protected-source and business-store hashes unchanged |
| Build and lint regression | Vite production build and PWA generation passed without running the artwork optimizer; no new scoped lint findings relative to the saved baseline |

The first reduced-motion check exposed a local “transition:none” rule losing to the shared important duration. The targeted rule now wins for the workout controls, and its regression passes. Existing lint findings remain (11 App, 7 Fitness and 1 ScratchCard); this is not a clean-repository lint claim.

Evidence is in the sibling chat workspace under pass-evidence: serif-verification.json, serif-final-checks.json, serif-app-audit/results.json, fitness-frames-serif/results.json, scythe-side-serif/results.json, workout-results.json, serif-lint-comparison.json and serif-build.log. Before/after renders are retained there. The temporary build output was removed after verification.

## Limits

Responsive verification used Chromium viewport and touch emulation with isolated fixtures. It does not establish physical iPad/iPhone Safari or native-wrapper behavior. Dialog rendering checks do not establish real authentication, purchase or multiplayer backend flows. No production data was changed. The optional italic web font falls back to Times New Roman italic when unavailable.
