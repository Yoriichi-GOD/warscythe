# Warscythe frame-family system — 21 November 2026

## Direction and placement plan

Reuse the chambers' established materials as recurring role identifiers throughout the app. Keep the approved Operations, Ledger and Forge layouts intact. Use full connected frames for major Fitness panels and the existing quieter two-corner treatment for dialogs. Vary the family with the role, while retaining the alpha-trimmed artwork, mirrored corners and anchored rail intersections.

| Family | Recurring role | New placements | Existing related placements retained |
| --- | --- | --- | --- |
| Hercules: bronze and amber | Physical strength and making | Primary workout logging remains Hercules | Forge and strength displays |
| Hermes: green, ivory and wings | Recovery, movement and guidance | Rest timer; active Hermes display | Authentication, information and tutorial dialogs |
| Apollo: gold, ivory and violet | Measurement, focus through practice and rhythm | Fitness metrics; ritual creation and editing | Map, roadmap and fairy guidance |
| Ares: dark bronze and red | Deliberate exertion and tactical commitment | RPE dial; Focus task area | Legion operations and Ares chamber |
| Zeus: blue, silver and gold | Ascension and authority | Pantheon progression | Premium dialog and Zeus chamber |
| Ledger: restrained dark gold | Records and memory | Recent workouts; legacy GymLogBook component | Ledger/history and Legion records |
| Artifact: amber and carved gold | Equipment, collection and ownership | Armory shop; legacy VaultModal component | Relic presentation |

The active deity panel takes its family directly from the already-calculated active deity ID. This changes the surrounding artwork only. The five chambers, affinity calculations, thresholds, rewards and progression logic are unchanged. Universal outer framing remains useful for the world's shared shell.

The separate GymLogBook and VaultModal components are not currently routed from the app. Their family choices were checked through isolated mounting as legacy consistency work; they do not introduce a visible production flow. The live bundle check covers the routed Armory, Fitness, Rituals and Focus changes. The approved Ledger vault layout remains untouched.

This is an aesthetic and orientation decision. Enjoyment, retention and psychological effects have not been measured. Labels, icons and layout still identify each role; frame color is additional information.

## Optical corrections found while testing

- Hermes has wider wing tips than Hercules. At 768px, the first same-size substitution extended roughly two pixels past each viewport edge. Full-size Hermes corners now use 64px above the phone breakpoint and 58px on phones. The rail intersection geometry is unchanged.
- The Ares corner initially intersected the Focus category and title. The frame now sits on the content boundary, with separate text gutters of 48px horizontally on larger screens and 36px on smaller screens.
- Apollo's phone ritual ornament touched the header label and icon. Phone corners now sit 10px inside the panel edge; the header has its own left gutter, 64px on larger screens and 48px on phones.

No source images were recolored, regenerated or replaced. No fonts, landing-page behavior, global frame anchors or business-store logic changed.

## Definition of Done and evidence

| Requirement | Evidence |
| --- | --- |
| All five deity identities appear correctly; seven Fitness roles use the intended families | 25/25 family layouts at 360, 390, 768, 1024 and 1440px; actual visible corner pixels checked against text and icons |
| Related dialogs repeat those same roles | 30/30 isolated component layouts across six changed dialogs and five widths, including 10 legacy-component cases; no frame/text/icon intersections or horizontal frame cutoff |
| Fitness remains usable in overview, active session and focused mode | 15/15 layouts; no measured text collisions, horizontal art cutoff, document overflow or runtime errors |
| Logging, rest, minimize/resume, discard and archive remain functional | 24/24 browser regressions |
| Deity rewards and affinity remain stable | 8/8 reward-domain tests; all 14 protected feature files and the business store retain their hashes |
| Approved art and frame placement are preserved | All 95 frame assets, frame metadata, shared frame component, main stylesheet, Operations, Ledger, Forge and ScytheCenter remain byte-identical to the baseline; only the two scoped frame CSS adjustments above differ from the 119-file preservation inventory |
| Candidate compiles and adds no lint findings | Production build passed; zero added findings against 24 existing findings in the seven changed JSX files |

The final source change is limited to family props and three local optical adjustments. Private uncommitted material is excluded from the commit. The browser evidence uses Chromium viewport emulation, not physical phone/iPad/Safari hardware. Tests use isolated local fixture data and block production account/data endpoints. No purchases or production user-data writes were performed. Deployment verification is recorded separately after the commit exists.

Screenshots, per-case geometry, alpha intersection checks and test scripts are retained in the sibling chat workspace under frame-family-evidence.
