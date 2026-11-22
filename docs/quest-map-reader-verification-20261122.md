# Quest Map frames and reader test access

Verified locally on 22 November 2026.

## Delivered behavior

- Quest Map panels use the shared, alpha-aware frame geometry. Expansion Log uses Hermes; Legend uses Apollo; Quick Actions uses Hercules; Region Intel uses Zeus; threats use Ares; secured sovereigns use Apollo; World Correspondence uses the artifact family; the atlas uses the universal frame.
- Removed the inset corners and old CSS brackets that crossed headings. Frame clearance includes the bottom controls. The atlas frame stays outside the scrolling/panning map.
- Phone panels stack at full width. Tablets retain two columns; desktop sidebars scale instead of squeezing the map at 1024px.
- Node intel uses a family appropriate to the node. Its outer frame and close control stay inside the window; long content scrolls inside it.
- The castle's relic counter uses the existing unique-variant catalogue helper and its current 150-variant denominator. No reward rules changed.

## Test the reader

Use the local development site, http://127.0.0.1:5176/.

1. Open **TEST REALM**. If the controls are hidden by capture mode, press **Ctrl+Shift+P**.
2. Choose **ENTER TEST REALM** if the realm is not already active.
3. Under **Lore reader preview**, choose **Open book · 48 finds**.
4. Use **Next/Previous**, keyboard page controls, or switch between **Letter**, **Codex**, and **Text**. Close the reader to return to the app.
5. Also test **Letters & archive**, **Empty archive**, and **First five finds** from the same panel.
6. Use **EXIT REALM & RESTORE NORMAL APP** to restore the saved local app state when finished testing.

The sample reader has separate bookmarks. It does not grant discoveries, mark the normal archive as read, complete onboarding, or award progress. Preview requests require an active development Test Realm; production access still follows earned discoveries. A temporary request queue allows the book button to work even while the application is first loading.

## Definition of Done and evidence

- [x] Map layout: 42 browser assertions across 320x740, 390x844, 768x1024, 1024x768, 1440x1000, and 1920x1080. Checked six panel families, corner clearance, overflow, fixed atlas frame during pan, Ares boss intel, bounded popup and runtime errors. Screenshots reviewed at phone and desktop sizes.
- [x] Node and region variations: 16 assertions covering all five nodes, reachable popup contents, relic denominator, secured Apollo state, locked Ares state, and runtime errors.
- [x] Reader access: 24 assertions across phone, tablet, and desktop, including bound pages, all 48 finds, unfolded letters, empty/partial states, progress and bookmark isolation, and normal zero-discovery access.
- [x] Fresh entry: five assertions covering immediate preview after anonymous Realm entry, original-state backup/restore, no cloud profile mutations, and rejection of sample access outside the Realm.
- [x] Domain regressions: all 35 existing tests passed for archive discovery/content, journey progress, Fitness rewards, artifact counts, WebP resolution and startup policy.
- [x] Source audit: no introduced lint findings. The five touched JavaScript/JSX files retain 18 pre-existing errors. All 109 protected Fitness/frame files are byte-identical to the baseline; the user's pre-existing private change is preserved.
- [x] Full production build passed, including responsive asset generation and PWA generation. Test Realm reader-control strings are absent from the production JavaScript.

Browser evidence uses isolated local fixtures in headless Chrome with emulated viewports. These checks do not claim physical-device testing or authenticated production-account testing. Evidence is retained in the chat workspace's `map-reader-fix-evidence` directory.

Domain regression command:

```powershell
node --test src/utils/artifactCollection.test.js src/features/archive/domain/*.test.js src/features/journey/journey.test.js src/features/fitness-v2/domain/rewardEngine.test.js src/utils/startupPolicy.test.js src/utils/assetResolver.test.js
```
