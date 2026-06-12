# Refined Mobile Execution Plan: Warscythe Responsive Cockpit

This plan outlines the detailed UI/UX adaptations required to translate the high-fidelity desktop dashboard layout into a premium, responsive mobile application for iOS and Android viewports (360px - 480px width) without compromising visual style, map accessibility, or gesture integrity.

---

## 🧭 1. Header Collapse Specification (Viewports < 640px)

To fit narrow mobile viewports down to `320px` without line wraps or icon crowding, the header layout will collapse using the following strict priorities:

### Header Button Rules
- **Hide Redundant Navigation Buttons**: The following header buttons duplicate features already persistently available on the bottom tab bar and will be hidden (`display: none`):
  - **Tactical Map** (handled by `QUEST MAP` tab)
  - **Gym log** (handled by `FITNESS` tab)
  - **Artifact Vault** (handled by `LEDGER` tab)
- **Keep Critical Core Actions**: Keep only the following three buttons which control global application states:
  - **Sync status** (`sync-btn` with `RefreshCw`/`AlertCircle`) — Essential for offline-sync diagnostics.
  - **Account/Auth** (`ShieldCheck`/`Fingerprint`) — Allows authentication check and logout.
  - **Neural Focus** (`Brain` icon) — Activates full-screen focus overlay from any tab.

### Header Layout Structure (Mobile)
```
+-------------------------------------------------------------+
| [Core Logo] WARSCYTHE      XP: 2,641     [Sync] [Auth] [Brain] |
+-------------------------------------------------------------+
```
- **Operative Status (Tactician)**: Hidden on viewports `< 480px` to protect horizontal spacing.
- **XP value**: Shown in a smaller font, positioned next to the logo.

---

## 🔀 2. Gesture Resolution: Swipe vs. Tab Navigation

To prevent gesture collision between horizontal swipe-to-navigate patterns on different hierarchy levels:

### Resolution Strategy
1. **Main Navigation (Bottom Bar)**: Swiping at the bottom nav page-level is **disabled**. Switching between major tabs (Operations, Fitness, Map, Forge...) remains strictly **tap-only**.
2. **Operations Sub-Tabs (Strikes ↔ Scythe ↔ Stats)**: Horizontal swipe gesture is **exclusively enabled** and bounded within the sub-tab content zone.

### Visual & Swipe Affordances
- **Sub-Tab Pill Bar**: A sliding segmented control is visible at the top of the Operations tab. A gold indicator block slides behind the pills to reflect the swipe progress.
- **Swipe Zone Bounds**: Uses `framer-motion`'s `<motion.div>` with `drag="x"`. Drag constraints are set to `0` with high drag-resistance (`dragElastic={0.1}`).
- **Threshold Change**: A swipe triggers a sub-tab transition if the drag distance exceeds `100px` and drag velocity exceeds `200px/s`. If the gesture is released before these limits, the tab snaps back to the active view.
- **Edge Fades**: A thin, semi-transparent gold gradient overlay (2% opacity) is rendered at the left and right margins of the viewport to hint that further content is swipeable.

---

## 🗺️ 3. Quest Map (Campaign Theater) Mobile Resolution

The isometric map uses a fixed 2D backdrop render with close-together interactive nodes. To ensure perfect usability on a 390px portrait viewport:

### 1. Map Viewport Pan & Zoom
- **Drag-to-Pan**: Wrap the `isometric-map-wrapper` inside a larger bounding box that supports drag-to-pan (`drag` on both X/Y axes in `framer-motion`) when zoomed.
- **Zoom Controls**: Position compact gold-bordered `[ + ]` and `[ - ]` toggle buttons in the bottom-right corner of the map viewport. 
  - Tapping `[ + ]` scales the map scale to `1.6x` using smooth spring animations.
  - Tapping `[ - ]` snaps the viewport back to fit the mobile screen width (`1x`).

### 2. Tap Disambiguation & Overlap Resolution
When bounding boxes overlap or multiple nodes sit close to each other (e.g. Basalt Keep ↔ Citadel of Ash ↔ center medallion path):
- **Euclidean Distance Match**: On a touch event, calculate the exact Euclidean distance from the touch coordinate (`e.clientX`, `e.clientY`) to the absolute center of all rendering nodes on screen. The closest node is selected.
- **Node Priority Rules**: If the distance calculation results in a tie (equidistant tap), resolve targets by the following priority hierarchy:
  1. **Active / In-Progress Node** (e.g., node containing active strikes)
  2. **Unlocked / Secured Node**
  3. **Locked Node** (lowest priority)
- **Node Scale-Up**: On mobile devices, double the hit-test radius of the central glowing circles from `8px`/`12px` to `18px` (while keeping the visual circle small), wrapped in a `44px` transparent clickable container.

### 3. Bottom Sheet Drawer
- Clicking a resolved node triggers a **slide-up bottom sheet** that covers the lower 40% of the viewport. This keeps the active node visible in the top 60% of the map view for navigation context.

---

## 🛠️ Verification & Testing
- Test layouts on simulated portrait widths: iPhone SE (375px), iPhone 13 Pro (390px), and Galaxy S20 (360px).
- Verify gesture boundaries to ensure dragging inside scroll lists (e.g., Completion log) does not trigger horizontal sub-tab changes.
- Ensure the map panning bounding constraints prevent the user from dragging the map off-screen.
