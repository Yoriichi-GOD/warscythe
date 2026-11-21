# Fitness frame adjustment

Follow-up to the UI polish pass, 21 November 2026. The uniform inset corners were crossing Fitness headings and crowding the small timer/RPE panels. Only src/pages/Fitness.jsx and the new src/pages/fitnessFrames.css changed in this follow-up.

The main panel corners now use 30px artwork with a 10px anchor inset, reducing to 24px/7px on phones. Recovery widgets use 24px/8px, reducing to 22px/7px on phones. The metrics strip uses 20px/6px. The existing Hercules family and source artwork are retained. The adjustment is scoped to Fitness; other pages keep their frame placements.

The visual check compares opaque frame pixels against rendered text ranges, rather than just checking that a decoration stays within the window. Across the same 15 overview, active-workout and focused-workout renders, baseline frame/text intersections fell from 68 to 0. That baseline count includes repeated labels across states and sizes; it is not a count of unique bugs.

Final checks: 15/15 renders at 360×800, 390×844, 768×1024, 1024×768 and 1440×1000; zero detected text intersections, panel-edge clipping, page overflow or runtime exceptions. Production build and all 8 existing Fitness reward tests passed. These are Chromium viewport checks, not physical-device tests.

All 14 protected Fitness files and 95 frame assets remain byte-identical to their baseline. No affinity, reward or workout behavior changed. No stage, commit or deployment was performed.

Evidence: pass-evidence/fitness-frames-before and pass-evidence/fitness-frames-final in the sibling chat workspace; build and reward logs have the fitness-frames prefix.
