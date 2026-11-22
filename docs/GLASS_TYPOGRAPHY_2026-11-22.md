# Frosted world windows and varied typography — 22 November 2026

Status: approved for the combined typography and landing release. The checks below describe the original local glass experiment on base 9b1bbea; the combined release is documented in LANDING_RELEASE_2026-11-22.md.

## Direction and coverage

The reward reveal, receipt, Unquiet Post library and reader shell, Kingdom Chronicle, and workout logging/control surfaces now behave as windows into the existing scene. There is no solid black/blue panel fill or plain gold rectangle around the large windows. A neutral blur with a modest brightness adjustment keeps the background present and text readable. No opacity is applied to the whole panel or text. The requested transparency is interpreted as a frosted visual effect, not a literal opacity on the content.

Full reward, reader and Chronicle windows temporarily hide the work panels underneath, revealing the existing world illustration rather than blurring the old dark cards. Their layout, entered values and scroll position remain in place. Closing the window restores the working area. Routine nonmodal rewards leave the working interface visible.

Workout panels, the session bar and minimized-workout dock share the neutral glass. The exercise chooser also uses a blurred surface. Form controls retain readable outlines and clear states. The deity display and Affinity system are outside this styling pass.

## Typography

| Role | Face | Treatment |
| --- | --- | --- |
| Reward names, story/chapter headings, workout headings | Cormorant Garamond | Weight 500, with italic titles where appropriate |
| Letter/book prose and narrative passages | EB Garamond | Regular 400; italic for short reward descriptions and editorial notes |
| Actions, metadata and workout inputs | Source Sans 3 | Upright regular 400; tabular numerals for recorded data |

These roles override the old global single-font rule only on the named surfaces. Default typography elsewhere remains available; bottom navigation labels are lighter. Body copy and control labels do not use bold. The five local Latin-subset WOFF2 files total 112,140 bytes and carry their SIL Open Font License notices under public/fonts. They are requested when used. The combined landing refinement also uses these faces on the public page. Other scripts fall back to the existing font stack.

## Divider artwork

The reward has the existing gold diamond line and central gem between discovery art and reward facts. The archive has a sapphire divider above the footer. Chronicle paragraphs use the gold divider below the chapter title. All use the existing alpha-bound FrameAsset renderer to trim transparent canvas margins without modifying the artwork. Existing outer frame families remain; plain CSS borders around the large glass surfaces were removed. Shared dividers are retained as local/offline assets by the native packaging policy.

## Reading and safety

Changing the book font also changes line widths. Pagination now measures the actual prose class and waits for the book faces to settle before binding the leaves. A blocked font request still produces a readable, turnable fallback book. All 48 source documents were laid out in the browser at each of the five widths, checking the final paragraph against the page folio. Document content, discovery ownership and source-paragraph bookmarks are unchanged.

A stress test reproduced Collect being pushed beyond a 320×568 viewport by a long reward name and task description. The heading now has a bounded scroll area, keeping Collect visible without truncating the title or task context.

## Verification

- 42 existing domain/startup/asset/reward tests pass.
- 142 browser assertions pass: the surface checks, five-width working flows, reward transfer/reduced motion, font-failure fallback, and long-header reachability.
- Widths: 320, 390, 768, 1024 and 1440 pixels. Book page turning works after the font change; recorded workouts still archive once; reward previews leave earned progress unchanged.
- Sampled reward and plain-reader body text reached at least 4.5:1 contrast on the starter-world background; large reward titles reached at least 3:1. These samples do not establish contrast on every region, optional theme, device or dynamic frame.
- Production build passes. All five local font URLs return 200. Development preview controls are absent from the production JavaScript. The original glass-only experiment added no landing font requests. The combined release intentionally uses the local fonts on the landing page and measures its new loading behavior separately.
- No introduced lint findings; the touched JavaScript retains the same 16 pre-existing lint errors as the starting snapshot. This is not a repository-wide clean-lint claim.
- All 109 protected Fitness/frame hashes match. The private SECURITY_FIXES.txt and other unrelated files remain untouched.

Physical phones/iPads, installed native packages, authenticated cloud synchronization and every optional visual theme were not exercised. The experiment was initially kept local. The user subsequently approved committing and deploying it with the landing refinement.

## Reviewing the experiment

Open http://127.0.0.1:5176/. The browser preview is already showing the castle reward. Use Collect to see the chest transfer, then Test Realm → Reward chest preview to change rarity or scene. In the same panel, use Preview letters and archive or Open book to inspect the reader. The workout UI remains on its normal Fitness route.

Evidence lives in glass-type-20261122/after: screenshots, before/after long-header reproduction, font-fallback results, page-layout checks, contrast samples and verification.json. The original font-source metadata and licenses are preserved locally and in the candidate.
