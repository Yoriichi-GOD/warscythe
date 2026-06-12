# Refined Mobile Execution Plan: High-Density Side-by-Side Viewport

This refined plan outlines how we will execute the **exact visual compositions** from the screenshots directly onto mobile screen sizes (portrait viewports). We will avoid sub-tabs and vertical column-stacking (which causes "dead scrolls") by building a high-density, viewport-proportional grid layout.

---

## 📐 Layout Engine: Viewport-Relative Scaling & High Density

To fit the complete multi-column compositions onto a single mobile screen without requiring scrolling, we will apply a tight spacing and responsive scaling system:

1. **High-Density Spacing & Gaps**:
   - Reduce default layout gaps on mobile from `gap-8` or `1.5rem` to `gap-2` or `0.5rem`.
   - Reduce panel paddings from `p-6` or `1.2rem` to `p-2` or `p-3`.
2. **Proportional Typography**:
   - Use `clamp()` and relative sizes (`em` / `rem`) for headers and stats so text dynamically shrinks on narrow widths.
   - Shrunk panel tag headings to `8px` and body text to `9px`.
3. **Viewport-Height Restrictions**:
   - Constrain components to max-height percentages of the viewport (`vh`) so they never push content off the bottom of the screen.

---

## 📱 Component 1: Operations Tab (Dashboard)

We will preserve the exact desktop layout structure on mobile by creating a compact side-by-side grid of 2-column and 3-column rows:

```
+------------------------------------------+
| WARSCYTHE (Logo & Stats Bar)             |
| Region Progress [==========]         1/5 |
+------------------------------------------+
| [ ACTIVE OPERATIONS ] | [ REAPER'S SCY ] | <--- Row 1 (50% / 50% split)
| - Magic circle        | - Stage list     |
| - "+ Objective"       | - Scythe display |
+------------------------------------------+
|            COMMAND CENTER                |
| [Completions]  [Ratio]  [Fitness Log]    | <--- Row 2 (3-column split)
+------------------------------------------+
| [ ULTIMATE ART ]  | [ COMPLETION LOG ]   | <--- Row 3 (45% / 55% split)
| - Cosmic Reaper   | - Strike list        |
+------------------------------------------+
| Streak Descent [==========]     0/5 DAYS | <--- Row 4 (Full-width bar)
+------------------------------------------+
|      [OPERATIONS] [FITNESS] [MAP]        | <--- Bottom Sticky Nav
+------------------------------------------+
```

### 1. Row 1: Active Operations & Reaper's Scythe (Side-by-Side)
- **Active Operations (Left Column)**:
  - Shrink the glowing magic circle graphic from `350px` to a compact `120px` max-width/height.
  - Scale down the text and padding of the "+ INITIATE OBJECTIVE" button.
  - Set the missions list to display in a tight list with maximum height.
- **Weapon Evolution / Reaper's Scythe (Right Column)**:
  - Display the animated Scythe alongside the evolution stages inside a single panel.
  - Hide the stage description text on small screens, showing only the compact title, badge, and locked/unlocked state in a thin list.
  - Position the active Scythe display as a backdrop overlay behind the stages or as a small centered graphic (max-height `180px`).

### 2. Row 2: Command Center (3-Column Row)
- **Stats & Fitness Grid**:
  - Keep the three widgets side-by-side: **Daily Completions** | **Execution Ratio** | **Fitness Logbook**.
  - Shrink the execution ratio radial dial to `32px` diameter.
  - Shrink typography for stat values (`6` and `100%`) so they do not overlap.
  - Convert the Fitness Logbook widget to a compact icon button with minimal padding.

### 3. Row 3: Ultimate Artifact & Completion Log (Side-by-Side)
- **Ultimate Artifact (Left)**:
  - Display the Cosmic Reaper image centered inside its card, constrained to a maximum height of `120px`.
  - Place labels ("Ultimate Artifact", "Cosmic Reaper") in a small font at the top.
- **Completion Log (Right)**:
  - Display active strikes in a compact list.
  - Reduce line item padding, showing only the strike title, percentage, and time remaining in a single-line format.

---

## 🗺️ Component 2: Quest Map Tab (Campaign Theater)

We will adapt the Quest Map screen to a high-density, double-row configuration on mobile viewports:

```
+------------------------------------------+
| CAMPAIGN THEATER // LEVEL 2              |
+------------------------------------------+
|                                          |
|          ISOMETRIC MAP VIEWPORT          | <--- Top 40vh (Full-width map)
|                                          |
+------------------------------------------+
| [ EXPANSION LOG ]   | [ LEGEND ]         | <--- Row 1 (50% / 50% split)
+------------------------------------------+
| [ REGION INTEL ]    | [ UPCOMING THREAT] | <--- Row 2 (50% / 50% split)
+------------------------------------------+
| [ RECOVERED FRAGS ] | [ QUICK ACTIONS ]  | <--- Row 3 (50% / 50% split)
+------------------------------------------+
```

### 1. Map Viewport (Top half)
- The isometric map layer will occupy the top `40vh` of the screen.
- Scale nodes and leylines appropriately:
  - Node hitboxes expanded to `44px` for touch safety.
  - The node icons (Skull, Lock, and custom avatars) scaled down to fit nicely.

### 2. Details and Logs (Bottom half)
- **Row 1: Expansion Log & Legend (Side-by-Side)**:
  - The Legend is rendered in a compact 2-column or 3-column micro grid.
  - The Expansion Log displays logs in a tight font size (`8px` - `9px`).
- **Row 2: Region Intel & Upcoming Threat (Side-by-Side)**:
  - Region Completion dial shrunk to `36px` diameter.
  - Threat card re-arranged to fit the right column: small dragon thumbnail (`28px` square) next to threat name and threat level details.
- **Row 3: Recovered Fragments & Quick Actions (Side-by-Side)**:
  - Recovered fragments box is limited to `80px` height with a tiny scrollbar.
  - Quick actions (Recalculate Protocol, Deploy Strike Team, Return) rendered as three thin, stacked buttons in the right column.

---

## 🧭 Navigation & Safe Areas
- Keep the bottom tab navigation sticky, using `pb-[safe-area-bottom]` to clear phone bezels.
- Shrink the center winged medallion core to `56px` diameter to allow enough horizontal space for the surrounding tab labels.
