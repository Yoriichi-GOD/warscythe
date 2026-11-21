# Landing choreography and Fitness frame correction — 21 November 2026

## What was wrong

The earlier pass concentrated on the realm map. Lower landing sections retained heavy labels, mostly static imagery and overlapping figure layouts. The Fitness wrapper used quiet framing: two small diagonal corner pieces, without the complete rails and corner intersections used by the approved Forge presentation. Geometric non-overlap alone had not proved visual consistency.

## Final presentation

Landing navigation, controls, captions and emphasis now use regular weight. Italic serif display text carries the headings; upright Times New Roman provides the reading copy. Hierarchy comes from size, spacing and placement. Decorative labels were removed from the lower section headings. The map's interaction and chapter model remain intact.

Operations, Rituals, Olympus, Ledger, Legion, the roadmap panel, proof text and the closing invitation now use phrase/word choreography. Copy rises into view, remains fully opaque and stationary through the reading band, then fades and travels a short distance as it reaches the top. Images enter with a small perspective movement and leave with the section. No text mask or fixed line-height crop is used. Scroll updates are batched outside React: read layout boxes first, then update paused Web Animations playheads. Idle pages do not run a continuous scroll-animation loop.

Every animated phrase retains one complete accessible reading copy. Reduced motion and the existing pause control cancel travel and restore the whole page to a stable, fully visible state. The assistive-technology tree was inspected to verify that headings and prose remain exposed.

Lower product captures now retain their natural aspect ratios. The secondary captures no longer cover the main captures or captions. Both images remain available on phones. Lazy images explicitly reserve their aspect ratio before loading, fixing a reproduced navigation jump of roughly 894px. The closing phone action is constrained to its content gutter, and its two heading phrases occupy separate blocks.

## Fitness frame placement

The wrapper now requests full Hercules framing: four correctly mirrored corners and connected top, bottom and side rails. Intersections align with the actual panel edge. Ornament may extend outside that edge, as it does in Forge; separate outside margins keep the visible pixels within the viewport. Content has its own inset gutter. Main corners use 76px on larger screens / 58px on phones, compact controls 52px / 44px, and metrics 44px / 40px. The header icon is anchored separately so a wrapped decree control does not strand it on a new row.

No global frame component, frame artwork, affinity/reward calculation or protected Fitness feature source changed. All 14 protected files and 95 frame assets match the earlier preservation hashes. The business store is unchanged. Operations, Ledger and Forge layouts are preserved.

## Design reasoning and limits

The direction uses fewer competing weights, a stable reading band, and complete imagery to make the dense product easier to scan. Those are design decisions, not measured improvements in visitor conversion. NN/G's [aesthetic-usability discussion](https://www.nngroup.com/articles/aesthetic-usability-effect/) also cautions that visual appeal can mask interaction problems, so screenshots were paired with actual navigation and form regressions. Motion controls follow the intent of [W3C's interaction-animation guidance](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions): nonessential movement can be disabled. This is not a blanket accessibility-conformance claim.

## Verification

| Check | Result |
| --- | --- |
| Presentation and animation states at 320, 360, 390, 768, 1024 and 1440px | 103/103 |
| Existing landing controls, map, dialogs and authentication entry | 70/70 |
| Fitness overview, active session and focused mode at five widths | 15/15; zero alpha/text intersections, horizontal art cutoff or runtime errors |
| Workout logging, rest, minimize/resume, discard and archive | 24/24 |
| Reward, startup and image-routing tests | 19/19 |
| Production build | Passed |
| New scoped lint findings | Zero; existing Fitness findings retained |
| Four-second synthetic scroll with 4x CPU slowdown | No captured long tasks in either run; phone max frame interval 20.9ms, desktop one interval above 34ms (41.7ms) |

The scroll profile is browser laboratory evidence, not a physical-device frame-rate guarantee. The first named CSS-timeline approach failed the measured entrance/exit check and was replaced. A narrow-phone check initially sampled before the next animation frame completed; explicit frame synchronization and a separate playhead trace verified the actual states. The final measurements check entrance, the opaque reading region and exit separately.

DOM line boxes were compared with clipping ancestors, including italic overshoot. This does not inspect text already baked into product screenshot pixels. Responsive evidence uses Chromium emulation, not physical Safari/iPad/native hardware. No real account creation, purchase or production user-data write was performed.

Source changes: LandingPage.jsx, LandingNarrative.jsx, useLandingNarrative.js, landingNarrative.css, Fitness.jsx, fitnessFrames.css and responsiveAssets.js. Evidence and a 30-state real-browser motion GIF are retained in the sibling chat workspace under craft-evidence. Deployment is checked separately against the resulting Git commit.
