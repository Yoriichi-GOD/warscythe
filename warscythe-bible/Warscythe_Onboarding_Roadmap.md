# Warscythe — Onboarding Roadmap & Guardian Script

## Overview

10-task guided unlock sequence across two regions, delivered by the Guardian character. Each unlock is a single concept (or a cluster of passive, read-only concepts) surfaced via a golden breathing-border glow on the relevant tab, triggered by completing the previous task. Fitness remains fully explorable at any time via a "curious peek" — accessible immediately, contributes zero progress toward the roadmap, exists purely for users who arrive wanting fitness specifically.

Milestone trophies at Task 5 and Task 10, each awarding a title alongside the trophy.

---

## Roadmap Modal — Structure

**Trigger:** Tapping the achievement icon in the header opens the roadmap as a full vertical progress trail — a game-style tech-tree/quest-log layout, not a checklist.

**Visual spec:**
- Vertical path, node-to-node, styled to match the existing dark-fantasy UI language (same border/glow treatment as Battle Trophies and the Weapon Evolution panel)
- Each node = one task, connected by a lit or unlit path segment depending on completion
- Completed nodes: solid gold fill, checkmark icon, brief label of what was unlocked
- Current node: pulsing/breathing gold outline (same animation as tab unlock glow), label visible
- Locked nodes: dimmed, silhouette icon only, label hidden until reached (preserves surprise)
- Milestone nodes (5, 10): larger node, trophy icon inset, title name displayed beneath
- Top of modal: overall progress bar + fraction ("4/10 Unlocked") tied to the same automated toggle system as individual unlocks
- Bottom of modal: single "Continue Your Journey" button that closes the modal and highlights the next active glow on the main screen

---

## Region 1

### Task 1 — The Scythe (+ passive intro: Sync, Notifications, Settings)

**Unlocks:** Weapon Evolution panel, Sync status indicator, Notification system, Settings menu (all read-only intro — nothing actionable yet)

**Trigger:** Completing your first Operation

**Guardian script:**

> "You've struck your first blow. Look — your Scythe stirs."
>
> "This is the Reaper's Scythe. It sleeps now, dormant, but it will not stay that way. Every task you conquer feeds it. Six tiers stand between where it is and what it will become. Watch it change, and know that the change was earned, not given."
>
> "Before you go further — three things worth knowing, though none of them need your hand yet."
>
> "Your progress travels with you. Complete a task here, and it will already be waiting the next time you open this on another device. Nothing to configure. It simply follows."
>
> "I will speak to you when it matters — a deadline closing, a region shifting. Not before. Not to fill silence."
>
> "And your settings live here, should you ever need to adjust how I reach you, or leave this world entirely. I hope you won't."

---

### Task 2 — Soundscape & Focus Mode

**Unlocks:** Soundscape selector, Focus Mode

**Trigger:** Completing your second Operation

**Guardian script:**

> "Welcome to the Soundscape."
>
> "Every region carries its own sound — the hum of a place, not just its look. Choose what plays as you walk it. This will follow you through your entire journey as a Warscythe warrior."
>
> "When you need to disappear into a single task, Focus Mode strips everything else away. No distractions. Just you, the task, and the sound of the world around it."

---

### Task 3 — The Forge, Streak Scythe & Rituals

**Unlocks:** The Forge, Streak-based Scythe evolution, Rituals tab

**Trigger:** Completing your third Operation

**Guardian script:**

> "The Forge is where consistency becomes power."
>
> "Your Rituals are the tasks you swear to daily — not once, not eventually, but every day without exception. Miss one, and the whole streak falls to zero. That is not cruelty. That is honesty. A streak that forgives isn't a streak."
>
> "Hold it, and your Scythe ascends with you. This is a second path to strength, separate from your Operations — built entirely on whether you show up when no one is forcing you to."

---

### Task 4 — The Ledger (Battle Trophies)

**Unlocks:** Ledger tab, Battle Trophies section

**Trigger:** Completing your fourth Operation

**Guardian script:**

> "This is your Ledger — the permanent record of everything you've taken from this world."
>
> "Every artifact you've claimed lives here. Every trophy. Nothing is lost, nothing forgotten. Others can see this too, if you let them — what you've built for yourself becomes something worth being seen."

---

### Task 5 — Region Change: Quest Map & The Fairy's Handover 🏆

**Unlocks:** Quest Map, region transition, first Fairy Fragment context

**Trigger:** Completing your fifth Operation — first dragon defeated, first region liberated

**MILESTONE TROPHY: "Curious Explorer"**

*(Titles earned here join the existing Operative Status title pool — Recruit, Tactician, Iron Executor, etc. Once unlocked, the user can equip "Curious Explorer" as their displayed title at any time via the Operative Status selector. If equipped, it shows beneath their name in the Operative Graph, visible to friends and Legion members — same as any level-based title.)*

**Guardian script:**

> "The dragon falls. The region is yours."
>
> "I hand you now to one who knows this land better than I do — the one you freed."
>
> *(Fairy takes over)*
>
> "Thank you for freeing me. Let me show you what you've won."
>
> "This is the Quest Map — every region you'll walk, every dragon still waiting, every fragment still unclaimed. I lived in the region you just took back. The dragon lived here too, guarding what was never his."
>
> "We are friends now, you and I. I will be watching the map with you from here."
>
> *(Trophy moment)* "You've earned the title of **Curious Explorer** — the first mark of someone who doesn't just complete tasks, but actually wants to see what's on the other side of them."

---

## Region 2

### Task 6 — Ledger: Fairy Fragments & Dragon Head Trophies

**Unlocks:** Fragment/trophy detail views inside the Ledger

**Trigger:** Completing your first Operation in Region 2

**Guardian script:**

> "Look closer at your Ledger now. Every Fairy you free leaves a Fragment — her story, not just a mark of victory. Every dragon you fell leaves a trophy behind. Both are proof. Neither is decoration."

---

### Task 7 — Social: Friends & Leaderboard

**Unlocks:** Friends system, Leaderboard (Campfire model — self-comparison first)

**Trigger:** Completing your second Operation in Region 2

**Guardian script:**

> "You are not the only one walking this path."
>
> "Add those you trust. Watch how far you've come against your own best — that comes first, always. Only after that will you see how you stand beside others. This is not a ranking meant to shame you. It's a fire to sit around, not a ladder to climb over someone."

---

### Task 8 — Lore & Shop

**Unlocks:** Lore/Codex section, cosmetic shop

**Trigger:** Completing your third Operation in Region 2

**Guardian script:**

> "Every Empress you free has a history — who she was before the dragon took her, what her freedom restores. Read it. It's not filler. It's the reason any of this means something."
>
> "And should you wish to carry yourself differently through this world — new skins for your Scythe, new themes for the land itself — the Shop is yours to browse. None of it changes your strength. All of it changes how you're seen."

---

### Task 9 — Legion (Social, Part Two)

**Unlocks:** Legion — persistent groups, sub-task delegation

**Trigger:** Completing your fourth Operation in Region 2

**Guardian script:**

> "Friends are one thing. A Legion is another."
>
> "Form one, and you can assign real tasks to real people — deadlines, priorities, consequences. Contribute, and it counts twice: once for you, once for the whole. Fail, and it's recorded honestly, not hidden. This is accountability with teeth, not just company."

---

### Task 10 — Full Release 🏆

**Trigger:** Completing your fifth and final onboarding-tracked Operation in Region 2

**MILESTONE TROPHY: "Seasoned Wanderer"**

*(Same as Curious Explorer — joins the equippable Operative Status title pool, selectable at any time, displays beneath the user's name in the Operative Graph if chosen.)*

**Guardian script:**

> "You've seen everything now. The Scythe, the Rituals, the Ledger, the Legion, two regions and two fairies freed."
>
> "There is no more I need to show you. What happens from here is yours to write."
>
> *(Trophy moment)* "You've earned the title of **Seasoned Wanderer** — you've walked the whole path once, deliberately, and that's rarer than it sounds. Most people skim. You didn't."
>
> "Go. Execute your tasks. Evolve your Scythe. Conquer the region."

---

## Notes for Implementation

- Fitness section: accessible at any point via the taskbar, opens with its own sandboxed walkthrough. Exploring it contributes nothing to the 10-task roadmap — fully parallel, zero interaction with the gate/toggle system above.
- Toggle automation: each task's completion should flip its roadmap node from locked → current → completed in the same motion that triggers the tab glow, so the modal and the live UI never fall out of sync.
- All dialogue above is a first draft — trim for actual in-app card length as needed; the roadmap modal versions of these lines should likely be 1–2 sentences max, with the fuller script reserved for the full-screen unlock moment.
