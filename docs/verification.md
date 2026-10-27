# Evidence and verification

[Back to README](../README.md)

## What is established

The documentation describes source-observed screens and integrations. The included entry-screen image is an existing emulator capture. Neither establishes that all product flows work today.

## Historical engineering report

The [July 20, 2026 pre-YC report](../WARSCYTHE_FINAL_PRE_YC_VALIDATION.md) is preserved unchanged. Its summary lists 13 original checks plus 13 fix assertions, but its methodology explicitly says results were static-analysis confirmed rather than runtime-confirmed, with no live browser/device execution in that pass. Do **not** cite this as 26 freshly passing integration tests.

The report names ritual reconciliation work, UI flicker and leaderboard trust concerns. Its historical “GO” conclusion is not a current production-readiness statement. Reproduce relevant checks in a development environment before closing those risks.

## Known gaps

- No fresh-machine install or complete backend provisioning was validated for this presentation update.
- No current end-to-end authentication, payment, cross-device sync or multi-user authorization result is claimed.
- No verified latency, scale, retention or outcome benchmark is published here. Historical projections and marketing plans are not measurements.
- The working checkout includes unfinished asset and Fitness V2 changes; it can differ from the committed revision.
- The mobile entry screenshot has no recorded capture date or build identifier.

## Before calling a product change done

Record the exact revision and environment. Run the relevant lint/build checks in a suitable checkout, accounting for asset-generation side effects. Exercise the changed interaction, reload it, verify backend state where applicable, and regression-check adjacent flows. Capture desktop and mobile evidence, including empty/error states. Separate visual success from persistence, authorization and payment success.

For documentation changes, check local paths and anchors against versioned files, render desktop/mobile previews, inspect light/dark readability and review the staged file list. Do not stage credentials, private reports, dependencies or unrelated product work.

## Roadmaps are proposals

The repository retains [future expansion strategy](../warscythe-bible/FUTURE_EXPANSION_STRATEGY.md) and [ad revenue model](../warscythe-bible/WARSCYTHE_AD_REVENUE_MODEL.md) documents. They describe plans and assumptions, not verified earnings or delivered functionality. Historical evidence and planning files have not been rewritten as part of this presentation pass.

## Presentation review — October 27, 2026

Checked 47 local references across the README and four guides, including image paths and versioned source destinations. Rendered all five documents at 390px and 1440px in light and dark themes: 20 local browser renders, with no broken images or document-width overflow. Representative screenshots were visually inspected. This uses a local Markdown preview stylesheet, not GitHub's exact renderer.

Commands were checked against package scripts and environment templates, not executed as a fresh installation. The staged diff contains documentation and one existing screenshot only. A SHA-256 baseline comparison found no changes to 1,109 unrelated tracked/untracked files, including existing deletions. Application tests, backend checks and deployment were not run. A whole-worktree whitespace check also surfaced pre-existing application whitespace issues; the documentation-only diff check passed.
