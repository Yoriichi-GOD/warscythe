# Mobile frame and overlap correction

Definition of done: reproduce the escaping Rituals ornament and workout overlay, keep mobile ornaments inside their scrolling owner, bound side rails to the panel, preserve desktop placement, verify the collapsed drawer and workout resume, pass build/regression checks, then publish and check production.

The old phone replay at 393x667 put the rose at y40..110 inside the y0..100 header. The portal's computed clip was zero despite a requested 592px clip: a later Operations selector overrode the Rituals clip. At the same size the workout bar started at y463 while the scroll stage continued to y667, covering live content.

The mobile Rituals rose now belongs to its own panel. Mobile body-level frame portals are hidden; existing desktop portals remain. Side rail artwork uses the height of its own size container and removes the global image-width clamp, replacing the viewport-dependent length and 360px minimum. Neighboring phone Soundscape and Guardian cards stretch to equal height so the Guardian corner no longer crosses the dropdown. The compact workout bar and terminal share a reserved lane above the existing navigation.

The original scroll replay passed after the fix. Twenty layout/scroll combinations passed at 320x568, 393x667, 430x800, 768x1024 and 1440x900 (scroll offsets 0,300,600,1000). Checks covered ornament ownership/visibility, rail bounds, phone content clearance, terminal separation, widget alignment, horizontal overflow and workout-bar bounds. The collapsed drawer passed, and Resume returned the saved disposable test workout to focused workout mode. Operations retained its inline mobile corner and clear content area.

53 existing Node tests passed. The normal production build runs the responsive-image pipeline; its result and published checks are recorded in after/. No workout calculations, deity-affinity rules, archive readers, audio behavior or image assets were edited. Existing unrelated private work remains excluded.

These are Chromium layout and UI checks using an isolated local Test Realm, not physical iPhone/Safari validation. No live user workout or progress was changed. Screenshots with a blank browser capture area were cropped only to the actual phone viewport.

The mechanical design scan reported existing gradient-text and grid-background patterns outside the changed lines; neither was introduced by this correction.
