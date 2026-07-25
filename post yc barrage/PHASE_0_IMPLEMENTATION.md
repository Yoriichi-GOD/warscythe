# PHASE 0 — FOUNDATION
### Implementation Plan for Remaining Items

> Phase 0 is otherwise complete. These three are what's left before Phase 1 (Retention Core) opens clean, with no known rough edges underneath it.

**Sequencing logic:** these three don't block each other, but they're not equal-risk. iOS audio is the only one with real debugging uncertainty — you're diagnosing a browser policy issue, not just writing UI code. The other two are scoped feature work. Do iOS audio first while your head is freshest, then knock out the two UI items back-to-back — they're mechanically similar (state → filter/render logic).

**Suggested order:**
1. iOS audio fix
2. Dropdown filter for rituals
3. History log rework (laptop)

---

## 1. iOS Audio Fix

**Risk: medium (diagnosis could be wrong) | Effort: small if diagnosis holds**

### Step 1 — Confirm the diagnosis before writing any fix
Don't skip this. Add a temporary test button directly in the installed PWA:

```html
<button id="audio-test">Play region music</button>
```

Wire its handler with a `.catch()` that surfaces the actual error **on-screen**, not just console — you need to see it on the phone itself.

- If the error is `NotAllowedError` → diagnosis confirmed: user-gesture policy issue, not CDN/codec/headers.
- If it's anything else (network error, decode error) → the fix below does not apply. Stop and re-diagnose rather than patching around a guess.

### Step 2 — If confirmed, implement in this order
1. Create a **single persistent** `Audio` object at app level — not a new `<audio>` element per region change.
2. On the *first* intentional user tap after load (Enter Realm / Continue / Open Region — whichever fires earliest), run a silent unlock:
   ```js
   audio.volume = 0;
   await audio.play();
   audio.pause();
   audio.currentTime = 0;
   audio.volume = 1;
   ```
   Store an `audioUnlocked` flag so this doesn't repeat every load.
3. Route all subsequent region-music changes through that same unlocked element — swap `.src`, call `.load()`, then `.play()`.
4. **Audit every place `play()` is called after an `await`** (network fetch, region data load). If the call isn't directly inside the tap handler, WebKit may no longer treat it as gesture-initiated. Move the unlock call so it fires synchronously inside the tap, before any async work.

### Step 3 — Verify on actual device
Not simulator. Test with: silent mode on/off, Bluetooth/AirPods connected/disconnected, cold install vs. update.

### Watch-out
Don't touch autoplay attributes or CDN/header config unless Step 1 says it's not a gesture issue — that's a different bug, and mixing fixes together makes it impossible to tell what actually worked.

---

## 2. Dropdown Filter for Rituals

**Risk: low | Effort: small**

### Implementation steps
1. **State:** add a `filterType` value to ritual view state — `all | today | weekly | urgent`. Decide now whether this persists across sessions or resets each time (persisted feels better for a returning user; costs one more store write).
2. **Filter logic:** derive the displayed list from existing ritual data.
   - `today` — rituals scheduled for the current day.
   - `urgent` — check whether an urgency/priority field already exists on the ritual object. If not, that's a small schema addition needed *before* wiring the UI (see decision below).
3. **Weekly special case — this is two features, not one:**
   - The filter itself (show rituals tagged weekly).
   - A date picker, exposed only when a ritual is weekly, letting the user assign/change which date it's due.
   Scope these as two small commits so each can be verified independently.
4. **UI:** standard dropdown, four options, wired to filter state. No new dependencies required.

### Decision to make before coding
Is `urgent` **user-set** (a toggle the person flips on a ritual) or **system-derived** (e.g. overdue = urgent)? This changes the implementation shape — user-set is a boolean on the ritual; system-derived is a computed property at render time. Pick one before writing the filter.

---

## 3. History Log Rework (Laptop)

**Risk: low–medium (routing/layout change touches more surface area) | Effort: medium**

### Implementation steps
1. **Define the split in writing before touching code.** "Calendar loads in a single page" — confirm: does Calendar become its own dedicated route, with History moving entirely elsewhere? Nail the exact page boundary before restructuring — this is a routing change, not a layout tweak.
2. **New route/view for History**, separate from Calendar. Move existing history-rendering logic there — lift-and-shift of existing components, ideally, not a rewrite.
3. **Calendar page simplifies** to just the calendar itself, full-width/height on desktop, since it no longer shares space with history entries.
4. **Navigation:** add a clear affordance (tab, sidebar link, breadcrumb) so History and Calendar are both easily reachable — don't bury either one.
5. **Verify laptop-only scope:** confirm this doesn't regress the mobile history/calendar experience, which may already be structured differently.

### Watch-out
This is the item most likely to have hidden coupling. If other parts of the app link directly to a specific calendar+history URL/state combo (deep links, tutorial steps, notifications), those references need updating too. **Grep for references before moving things, not after.**

---

## Definition of Done for Phase 0

- [ ] iOS audio plays reliably across cold install, update, silent mode on/off, Bluetooth on/off
- [ ] Ritual dropdown filters correctly across all four states, weekly date picker works independently of the filter
- [ ] Laptop Calendar and History are cleanly split into separate views/routes with working navigation and no dead links
- [ ] No regressions on mobile from the history rework

Once all four boxes are checked, Phase 0 is closed and Phase 1 (Fragments/Hall of Olympus, Friction Journal, notifications, barcode verification) starts on solid ground.
