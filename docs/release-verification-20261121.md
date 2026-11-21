# Warscythe release verification — 21 November 2026

This release includes the earlier uncommitted motion, frame, workout, typography and progressive onboarding work, plus the landing story and WebP delivery changes. It is ready for the authorized Git commit and Vercel deployment after these checks. Deployment status is verified separately against the resulting commit.

## Landing page and startup

Reference: [STEPLOCK industrial-requiem at 38f3c4b](https://github.com/Yoriichi-GOD/steplock/tree/38f3c4b/frontend/src/components/marketing). The inherited idea is one evolving scene synchronized to narrative chapters, with a native phone scroll path and an intentional reduced-motion alternative. Warscythe uses its own realm map and existing Motion/CSS stack; no new animation library was installed.

The map stays beside four chapters explaining Operations, Rituals, Fitness and the Ledger. Its path and selected territory advance with the chapter. Territories remain clickable, the story can be skipped, and motion can be paused. Ambient motion pauses offscreen or in a hidden tab. Reduced motion retains the complete path and meaningful state/color feedback. Serif typography and the existing dark fantasy artwork are retained. Landing controls use consistent curved edges. Demo and legal dialogs now own focus, contain keyboard navigation, close with Escape and return focus.

Fresh web visitors load the public landing bundle before the progression application. Existing sessions, expired sessions, cached operative state, OAuth/recovery callbacks and native entry continue through the application. This is bundle selection; Supabase still performs authentication. Entering from the landing opens the existing authentication options.

## Images

157 existing WebPs were uploaded to the existing public cosmetics bucket without changing its policies. Public responses were checked for successful status, image/webp content type and identical SHA-256 hashes. 127 downloadable catalog entries also passed the repository CDN check. The resolver no longer translates remote WebP requests back to PNG. Existing PNG objects remain so the previous deployment is still compatible.

For 155 matched source pairs, the total falls from 406.67 MB to 48.28 MB (88.1% smaller). This is an asset byte comparison, not a claim about whole-site speed.

The asset optimizer now accepts existing WebP inputs and generates 186 responsive derivatives, including scythes, landing artwork and small emblems. Landing images declare dimensions and responsive sources; the hero is prioritized, later imagery is lazy/low priority. The 259 KB favicon is replaced by a 1.3 KB WebP. Oversized header/footer emblems and the particle texture also use small derivatives. Original frame artwork is unchanged. The local watcher ignores generated images and output directories so a build does not repeatedly refresh the live preview.

## Controlled speed comparison

Three cold samples per viewport for the unchanged pre-release build and the final candidate, with isolated Chromium contexts, disabled HTTP cache, service-worker bypass, 1.6 Mbps download, 40 ms latency and 4x CPU slowdown. The capture ends one second after the hero finishes. Values are medians; byte totals describe the page resources observed by that point, not every asset available in the app.

| Viewport | Before LCP | Candidate LCP | Before observed bytes | Candidate observed bytes |
| --- | --- | --- | --- | --- |
| 390px | 4.24 s | 2.46 s | 1558 KB | 271 KB |
| 1440px | 4.12 s | 2.02 s | 2087 KB | 430 KB |

These are local laboratory comparisons, not production field Core Web Vitals or physical-phone measurements. No Lighthouse score or real-user percentile is claimed. The raw timing, resource lists, screenshots and layout-shift values are retained in the sibling chat workspace under release-evidence/speed-before-*.json and speed-after-*.json.

## Definition of done

| Check | Result |
| --- | --- |
| Public WebP responses and checksum match | 157/157 |
| Downloadable catalog URLs | 127/127 |
| Compiled landing interaction and responsive checks | 70/70 |
| App pages/dialogs at five viewport widths | 115/115; zero detected frame clipping, horizontal overflow or runtime exceptions |
| Workout logging, rest, minimize/resume and archive | 24/24 |
| Startup/session/callback policy | 8/8 |
| Image routing regression | 3/3 |
| Existing affinity/reward domain suite | 8/8 |
| Production build and PWA generation | Passed through npm run build |
| Lint regression | Zero new findings; existing source findings fell from 160 to 159 |
| Protected Fitness feature source and frame assets | All 14 source files and 95 assets unchanged by hash |
| Credential-pattern scan of release files | No matches; this is not a full security audit |

Earlier frame placement, the sideways scythe rail, workout mode and lore/onboarding decisions remain documented in the other 20261121 verification notes. Their local evidence is retained. Private planning drafts, funding PDFs and temporary build outputs are excluded from the app release.

## Limits and rollback

The responsive suite uses Chromium emulation and isolated fixtures. Real Safari/iPad/native rendering, actual sign-in/account creation, purchases and multiplayer writes were not exercised. The 159 existing lint findings remain debt. No database schema, permissions, reward formulas or private user data were changed. If the new production deployment fails, restore the previous Vercel production deployment; its PNG URLs remain available.
