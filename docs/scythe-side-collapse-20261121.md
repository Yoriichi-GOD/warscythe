# Sideways scythe collapse

Collapsing the Scythe now changes the Operations/Rituals grid. The display shrinks horizontally into a 44px vertical restore handle, and the active-work panel receives the freed width. This works on phone, tablet and laptop. Command Center keeps its previous width. Expanded artwork and the original column proportions return when the handle is opened.

| Viewport | Operations expanded-scythe state | Operations collapsed-scythe state | Restore handle |
| --- | --- | --- | --- |
| 360px | 188.8px | 292.0px | 44px |
| 390px | 210.4px | 322.0px | 44px |
| 768px | 427.8px | 700.0px | 44px |
| 1024px | 295.0px | 634.5px | 44px |
| 1440px | 425.0px | 933.5px | 44px |

The earlier implementation only hid the display contents; it left the grid column in place. The saved pre-change measurements reproduce that failure. The replacement hides the scythe frame and sidebar together, makes the restore handle fill the work panel’s height, and lets the existing frame observer follow the resized Operations panel.

Verification: 10/10 measured Operations/Rituals cases at 360, 390, 768, 1024 and 1440px, with no page overflow or runtime exceptions. All 15 focused interaction checks pass: Space/Enter controls, saved state after navigation, temporary expansion for the Scythe lesson, restoration of the saved state afterward, and collapse while the scythe is progression-locked. Fitness retains its separate vertical artwork toggle. Production build passed; no new lint findings relative to the saved baseline.

Only Operations.jsx, Rituals.jsx, MobileDisplay.jsx and mobileDisplay.css changed in this follow-up. All protected Fitness files and frame artwork remain unchanged. Local only; no stage, commit or deployment. Evidence: pass-evidence/scythe-side-before, pass-evidence/scythe-side-after, and pass-evidence/scythe-side-interactions.json in the sibling chat workspace.
