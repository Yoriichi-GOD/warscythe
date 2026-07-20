# Warscythe V4 — Product Requirements Document

**Version:** 4.0  
**Status:** Pre-development  
**Last updated:** June 2026  
**Owner:** Saishreek / Peekolitix Inc.

---

## Guiding Principle

The core task architecture is locked. V4 adds no new task types, no new progression systems, no changes to how tasks are created, tracked, or completed. Every feature here is a layer on top of what already works — social infrastructure, ambient immersion, and a power-user input interface.

Incomplete is binary. Features ship complete or not at all.

---

## Priority Stack

| Priority | Feature | Dependency | Complexity |
|---|---|---|---|
| 1 | Friends System | None | Low |
| 2 | Friends Leaderboard | Friends System | Low-Medium |
| 3 | Regional Soundscapes | None (parallel) | Low |
| 4 | Legion Operations | Friends System + Leaderboard | High |
| 5 | War Terminal | None (parallel) | Medium |
| 6 | Global Leaderboard + League Tiers | User density | Post-V4 |

Soundscapes and War Terminal have no social dependencies. Build in parallel with the social layer.

---

## Feature 1: Friends System

### Why First

Legion Operations, Friends Leaderboard, and social accountability all require an existing friend graph. This is infrastructure. Nothing social works without it.

### Requirements

**Friend requests**
- Search by username or unique Warscythe ID
- Send request → recipient gets notification
- Accept / decline
- Pending state visible to sender

**Friend list**
- Shows operative status, current streak tier, and region progress per friend
- No activity feed
- Cap at 50 friends — keeps Leaderboard meaningful, prevents abuse

**Removal**
- Unfriend silently — no notification to removed user
- Removes from Leaderboard view and blocks Legion invites from that user

### What Is Explicitly Excluded

- Activity feed
- Online/offline presence indicators
- Mutual friend suggestions
- Algorithmic discovery

### Schema

```sql
friendships
  id uuid primary key
  requester_id uuid references users(id)
  receiver_id uuid references users(id)
  status text check (status in ('pending', 'accepted', 'declined'))
  created_at timestamp default now()
  updated_at timestamp default now()
```

### Acceptance Criteria

- User can send, receive, accept, and decline requests
- Friend list shows operative status and streak tier
- Unfriend removes user from all social surfaces silently
- No friendship record survives either user's account deletion

---

## Feature 2: Friends Leaderboard

### Why Second

Requires Friends System. An empty leaderboard is worse than no leaderboard — it signals a dead product. Ships after the friend graph has had time to form.

### Philosophy

The leaderboard answers one question: who else is walking this path with me? Self-comparison is the default. Friend comparison is the secondary layer. Global comparison is Post-V4.

The campfire model: users should open the leaderboard and feel inspired, curious, connected — not inadequate or behind.

### Requirements

**Default view: Self-comparison**
- Current streak vs. personal best streak
- Weekly XP vs. personal record
- Operations completed this month vs. last month
- Shown first, every time, before friend ranking

**Secondary view: Friends ranking**
- Ranked by weekly XP — not total lifetime XP, which creates insurmountable gaps
- Shows: rank, operative status title, current streak tier, weekly XP
- Maximum 50 friends
- User's own position always pinned regardless of scroll

**Story layer**
- Below rank numbers, surface narrative events:
  - "[Friend] liberated [Empress] after a [N]-day streak"
  - "[Friend] completed a Boss Raid: [operation name]"
  - "[Friend] forged [Scythe tier] after [N] days"
- Auto-generated from existing completion events
- Maximum 5 stories, most recent first

**Opt-in competitive mode**
- Default: Friends mode
- Toggle: Personal mode (hides friends ranking entirely)
- No forced competition

### XP Flow

```
Personal task completion → Personal XP → Friends Leaderboard
Legion sub-task completion → Personal XP (proportional) → Friends Leaderboard
Legion sub-task completion → Legion XP (cumulative) → Legion Level
```

Legion contribution feeds personal Leaderboard standing. Active Legion membership is a competitive advantage because completing more work earns more XP — not because membership is rewarded independently.

### What Is Explicitly Excluded

- Global ranking (Post-V4)
- League tiers (Post-V4)
- Real-time leaderboard updates (weekly snapshots only — reduces infrastructure cost)
- Notifications about friend rank changes

### Schema

```sql
leaderboard_snapshots
  id uuid primary key
  user_id uuid references users(id)
  week_start date
  weekly_xp integer default 0
  streak_days integer default 0
  operations_completed integer default 0
  created_at timestamp default now()

leaderboard_events
  id uuid primary key
  user_id uuid references users(id)
  event_type text check (event_type in (
    'empress_liberated',
    'boss_raid_completed',
    'scythe_evolved',
    'streak_milestone'
  ))
  event_description text
  created_at timestamp default now()
```

### Acceptance Criteria

- Self-comparison view is default on every open
- Friends ranking updates weekly, not real-time
- Story events auto-generate from existing completion triggers
- Personal mode toggle fully hides friend ranking
- User's own position always visible regardless of scroll

---

## Feature 3: Regional Soundscapes

### Why Parallel

Zero social dependency. Zero schema changes beyond a user preference field. Ships as a standalone update whenever it's built — not blocked by anything.

### Philosophy

Soundscapes support attention. Songs demand it. The target experience: "I worked for an hour and forgot the audio was there — but when I turned it off, something felt missing."

All soundscapes are original compositions. This is an IP decision. No licensing costs, no copyright claims, no third-party dependencies. The soundtrack belongs to Warscythe permanently.

Silence is a first-class experience. The design is built around it, not against it.

### Requirements

**Discovery — opt-in only, never autoplay**
- Small ambient indicator in each region: rotating disc, gramophone, or magical crystal
- User clicks once: "Activate the Resonance"
- Audio begins
- Never autoplays on launch or region entry

**Controls**
- One-click toggle from anywhere in the app
- Separate volume slider from system volume
- Preference persists across sessions
- Fade in/out on region switch — no hard cuts between atmospheres

**Region-to-soundscape mapping**

| Region | Soundscape Character |
|---|---|
| Ashwood (Region 1) | Forest ambience, low wind, soft percussion |
| Kailash Ascension | Tibetan-style drones, bells, Himalayan wind |
| Moonlit Sanctuary | Flowing water, night ambience, airy pads |
| Icebound Cathedral | Faint choir textures, icy wind, long reverbs |
| Lava Citadel | Deep rumbles, crackling embers, sparse percussion |

Theme change triggers simultaneous visual and soundscape switch.

**Technical specs**
- Format: .ogg primary, .mp3 fallback
- File size: under 5MB per track
- Loop-friendly with clean loop points
- Low dynamic range — no peaks that break focus
- Instrumental only — no vocals
- Cached via Tactical Cache Core alongside region assets
- User selects independently: Download theme visuals / Download soundtrack

**Offline behavior**
- Cached soundscape plays offline with zero latency
- Falls back to silence if not cached — no broken state, no error

### Schema addition

```sql
-- Add to user_preferences table or equivalent
soundscape_enabled boolean default false
soundscape_volume integer default 70 -- 0-100
last_region_sound text -- nullable, persists last active soundscape
```

### What Is Explicitly Excluded

- Global ambient track not tied to region
- User-uploaded audio
- Third-party streaming integration
- Playlist or track selection

### Acceptance Criteria

- Audio never autoplays under any circumstance
- Volume control independent of system volume
- Preference persists across app restarts and device reboots
- Clean fade between regions — no audio pop or gap
- Offline playback works with zero CDN dependency once cached
- Silence is always available — no UI pressure to enable audio

---

## Feature 4: Legion Operations

### Why Fourth

Highest complexity in V4. Requires Friends System to exist and Leaderboard to be live so Legion XP contribution has visible context. Ships last among social features, after the friend graph has formed and users have a reason to turn friendships into Legions.

### Philosophy

Real work is not solitary. Legion Operations turn shared goals into shared records. The failure state is a diagnostic, not a punishment — repeated failure with the same person across multiple operations is concrete data on who belongs in your Legion.

The founding axiom applies collectively: an operation at 80% completion is not an operation. It is a record of stopping.

### Definitions

- **Legion** — persistent group, outlives individual operations
- **Creator** — user who formed the Legion; holds final authority
- **Legion Operation** — collaborative task built on the Recalculate Protocol
- **Sub-task** — individual assignment within a Legion Operation
- **Restraint** — creator decision to exclude a member's sub-task from success condition mid-operation

### Operation Lifecycle

```
1. Creator initiates parent operation
   → Selects task level (Low / Medium / High / Boss Raid)
   → Minimum duration enforced at parent level only
   → Uses Recalculate Protocol to break into sub-tasks
   → Assigns sub-tasks to Legion members

2. Acceptance window opens
   → Each assigned member must ACTIVELY ACCEPT their sub-task
   → Window stays open until creator explicitly closes it
   → Creator can extend window or reassign at any point while open
   → Members who do not accept can be removed by creator (pre-start only)
   → Removed pre-start members: no record impact, no XP at stake

3. Creator locks the operation
   → Explicit "Start Operation" action required — no auto-start
   → Creator reviews acceptances, decides to proceed or extend
   → Once locked: assignments are PERMANENT
   → No reassignment, no removal, no mid-operation changes

4. Operation runs
   → Members complete sub-tasks independently
   → Progress visible to all Legion members
   → Creator may RESTRAIN a member (see Restraint section)

5. Terminal states
   → ALL non-restrained sub-tasks completed before deadline: SUCCESS
   → ANY non-restrained sub-task incomplete at deadline: FAILURE
```

### Sub-task Minimum Durations

Sub-tasks carry no independent minimum duration. The minimum belongs to the parent operation. A 14-day Boss Raid broken into four sub-tasks may have each piece completed in 3 days — the operation clock still runs for 14. The constraint is collective, not individual.

### XP Distribution

```
Example: Boss Raid = 1000 XP total
10 sub-tasks → 100 XP each
Member A: 2 sub-tasks → maximum 200 XP
Member B: 3 sub-tasks → maximum 300 XP

XP follows completed sub-tasks, not Legion membership.
XP awarded only on full operation SUCCESS.
On FAILURE: zero XP for everyone.
Completers receive a COMPLETED marker on Legion record — no XP, but history is honest.
```

Carry mechanic: structurally impossible. Free riding: structurally impossible.

### On Failure

- Zero XP for all members
- Members who completed their sub-tasks receive a permanent COMPLETED marker on Legion record
- Member who failed their sub-task writes a note on the Legion record
- Note is self-reported, unverified, unmoderated — the Legion witnessed the operation and weighs it accordingly
- No creator approval of the note required
- The record is the consequence

### On Covering

- A member may complete another member's sub-task on their behalf
- Covering member earns zero additional XP — only their own proportional share
- Person covered writes the note
- No redistribution of XP to the covering member
- The system does not incentivize heroics. It incentivizes selection.

### Restraint

Creator may restrain a member mid-operation. This is a team decision made with full information — the team absorbs the cost of carrying voided sub-tasks.

**When restrained:**
- Restrained member's sub-tasks are voided from the success condition
- Operation can still succeed without those sub-tasks
- No redistribution — voided tasks are simply excluded
- Restrained member earns zero XP regardless of outcome
- Covering member earns zero bonus for completing restrained tasks
- Restraint is permanently visible on Legion record: who restrained whom and when

**Abuse vector acknowledged:** Creator could restrain a member one day before deadline to void their XP. This is possible. It is publicly legible. Social accountability closes the loop — no appeals mechanism, but full transparency. Option A is accepted.

### Creator Authority and Account Deletion

Creator holds final authority on all Legion decisions. Members acknowledge this at join time — accepting a sub-task means accepting the creator's structural authority.

**On creator account deletion:**
- Deletion triggers a mandatory transfer prompt before account removal completes
- Creator must either designate a new Legion owner from the member list, or accept Legion disbandment
- If transfer designated: Legion survives, new owner inherits creator authority, active operations continue to their natural conclusion
- If no transfer: Legion disbands after current operations conclude naturally
- Creator's own sub-tasks in active operations are voided from the success condition on deletion — not reassigned

`legions.owner_id` is updatable once, at deletion trigger, before account removal.

### Communication

No free text chat. No moderation burden.

Predefined quick messages only:
- ⚔️ Strike complete
- 🔥 Streak maintained
- 🛡️ Need to talk — coordinate externally
- 👑 Operation completed

Emoji reactions on progress updates. Coordination happens outside Warscythe. The app is not competing with messaging platforms.

### Legion Level

Accumulated from collective operation XP across Legion history. Visible on Legion profile. Progression signal only — no mechanical unlocks, no gating, no advantages. Two Legions at the same level with different histories are not equivalent — the operation record shows the difference.

### Schema

```sql
legions
  id uuid primary key
  name text not null
  creator_id uuid references users(id)
  owner_id uuid references users(id) -- updatable once on creator deletion
  level integer default 1
  total_xp integer default 0
  created_at timestamp default now()

legion_members
  id uuid primary key
  legion_id uuid references legions(id)
  user_id uuid references users(id)
  role text check (role in ('creator', 'member')) default 'member'
  joined_at timestamp default now()
  status text check (status in ('active', 'removed')) default 'active'

legion_operations
  id uuid primary key
  legion_id uuid references legions(id)
  parent_task_id uuid references tasks(id)
  status text check (status in (
    'acceptance_open',
    'locked',
    'active',
    'success',
    'failed'
  )) default 'acceptance_open'
  deadline timestamp not null
  created_at timestamp default now()
  locked_at timestamp -- set when creator closes acceptance window
  completed_at timestamp -- set on terminal state

legion_subtasks
  id uuid primary key
  legion_operation_id uuid references legion_operations(id)
  assigned_to uuid references users(id)
  task_id uuid references tasks(id)
  acceptance_status text check (acceptance_status in (
    'pending',
    'accepted',
    'declined',
    'removed_pre_start'
  )) default 'pending'
  completion_status text check (completion_status in (
    'incomplete',
    'completed',
    'covered',
    'restrained',
    'voided_creator_deletion'
  )) default 'incomplete'
  completed_by uuid references users(id) -- nullable, for cover cases
  xp_value integer not null
  xp_awarded boolean default false
  note text -- nullable, written by assigned member post-failure
  restrained_at timestamp -- nullable
  restrained_by uuid references users(id) -- nullable

legion_events
  id uuid primary key
  legion_id uuid references legions(id)
  event_type text check (event_type in (
    'operation_started',
    'subtask_accepted',
    'subtask_declined',
    'subtask_completed',
    'subtask_covered',
    'member_restrained',
    'operation_success',
    'operation_failed',
    'ownership_transferred'
  ))
  actor_id uuid references users(id)
  target_id uuid references users(id) -- nullable, for restraint events
  metadata jsonb
  created_at timestamp default now()
```

### Resolved Edge Cases

| Edge Case | Resolution |
|---|---|
| Member does not accept before window closes | Creator removes pre-start, redistributes freely, extends window if needed |
| Creator deletes account | Mandatory transfer prompt; if no transfer, Legion disbands after current operations conclude |
| Member restrained mid-operation | Sub-tasks voided from success condition; restrained member earns zero XP; permanent record with timestamp and actor |
| Covering member | Earns only proportional own XP; no bonus; person covered writes note |
| Creator's own sub-tasks on account deletion | Voided from success condition; not reassigned |

### What Is Explicitly Excluded

- Mid-operation reassignment (after lock, assignments are permanent)
- Free text chat
- Separate creator and commander roles (V4)
- Global Legion leaderboard
- Legion vs Legion competition
- Automatic operation start on full acceptance (creator must explicitly lock)

### Acceptance Criteria

- Sub-task assignment requires active acceptance before operation goes live
- Creator must explicitly lock operation — no auto-start
- Assignments locked permanently once operation starts
- Operation failure is all-or-nothing on non-restrained sub-tasks
- Completed marker on Legion record for members who finished in a failed operation
- Note field available to dropout after failure; no approval required
- XP distributed proportionally, awarded only on full success
- Restraint permanently logged with timestamp and actor
- Ownership transfer prompt fires before creator deletion completes

---

## Feature 5: War Terminal

### Why Fifth

No dependencies. Can be built in parallel with anything. Ranked fifth because it's a power-user feature — it adds zero value to new users and significant value to users 30+ days into the app. Shipping it before the social layer means building for users who don't exist yet.

### Philosophy

Not a chatbot. No AI. No natural language processing. War Terminal is a deterministic command palette — structured commands, predictable outputs, zero latency, full offline capability for task creation.

The cost the terminal removes is not time. It is context switching. For users who think faster than they click, every modal and dropdown is a interruption to momentum. The terminal eliminates the interruption.

New users never need to touch it. Everything remains clickable. Power users discover it and the terminal becomes their primary interface. Both are valid.

### Architecture

War Terminal is a query runner that maps commands to existing task creation windows. The task data goes to the same database schema that already exists. The terminal is a different input surface, not a different data model. No new tables required for core functionality beyond the command log.

Commands parse on the client side, map to existing UI actions, and submit through existing flows. The terminal does not bypass validation — minimum duration enforcement, priority logic, region assignment — all existing rules apply through the terminal identically to the UI.

### Discovery

- Floating button, always visible on main screen
- Keyboard shortcut: Cmd+K / Ctrl+K on desktop
- Mobile: swipe gesture or floating button
- Not mentioned during onboarding — discovered organically by power users

### Command Set

All commands available immediately. No unlock tiers. Autocomplete handles discoverability for new users. Artificial gating on a command palette that maps to existing functionality is redundant complexity.

```
Core commands:

/strike [title]
  Maps to: Operation creation
  Required: title
  Optional: /date /threat /region /note /priority
  Example: /strike Finish YC application /date sep-15 /threat legendary /region ashwood

/ritual [title]
  Maps to: Ritual creation
  Required: title
  Optional: /frequency /reminder
  Example: /ritual Morning run /frequency daily /reminder 06:00

/date [value]
  Inline parameter for date assignment
  Accepts: tomorrow, mon, sep-15, 2026-09-15
  Enforces: minimum duration relative to parent command threat level

/threat [level]
  Maps to: Task level selection
  Values: low | medium | high | legendary
  Legendary maps to: Boss Raid (14-day minimum enforced)

/note [text]
  Appends note to active task in creation flow

/workout [title]
  Maps to: Fitness session creation
  Example: /workout SBD Day

/exercise [name] [sets]x[reps]@[rpe]
  Adds exercise to active workout session
  Example: /exercise Squat 5x5@8
  User enters actual kg/reps during workout — terminal handles pre-session setup only

/region [name]
  Assigns operation to named region
  Autocompletes from unlocked regions

/priority [level]
  Maps to: Priority selection
  Values: low | medium | high
  Independent of /threat — matches existing priority-independent-of-difficulty design
```

### Autocomplete

- User types `/` → dropdown shows all available commands
- User types `/s` → filters to `/strike`
- Parameters autocomplete from existing data: region names from unlocked regions, ritual names from active rituals, exercise names from fitness history
- User never memorizes — guided for new users, fast for power users
- Autocomplete is the discoverability mechanism — no unlock tiers needed

### Lore Language Mapping

Terminal uses Warscythe register throughout:

| Terminal input | Maps to |
|---|---|
| `/threat low` | Low-level task |
| `/threat medium` | Medium-level task |
| `/threat high` | High-level task |
| `/threat legendary` | Boss Raid |
| `/region ashwood` | Region 1: Ashwood |

### Error Handling

- Invalid command: inline error in terminal, no modal, terminal stays open
- Missing required parameter: terminal prompts inline without closing
- Date violates minimum duration: rejected with lore-language message — "Deployment window too short for this threat level. Minimum: [N] days."
- Unknown command: suggests closest match from autocomplete list
- No app crashes, no silent failures

### Offline Behavior

All commands that create or modify local task data work offline. Sync occurs when connection restores through existing offline-first architecture. Legion commands require connection — they interact with other users' data.

### Schema addition

```sql
-- Optional command log for analytics and debugging
war_terminal_log
  id uuid primary key
  user_id uuid references users(id)
  raw_input text
  parsed_command text
  success boolean
  error_message text -- nullable
  created_at timestamp default now()
```

Command log is optional and can be omitted from V4.0 if analytics are not immediately needed. Add in V4.1 when usage patterns need examination.

### What Is Explicitly Excluded

- AI interpretation of natural language
- Voice commands
- Command history visible to other users
- Batch operations across multiple tasks simultaneously
- Unlock tiers — all commands available immediately

### Acceptance Criteria

- All commands functional before ship
- Autocomplete appears on `/` with no perceptible delay
- Invalid inputs fail gracefully with inline error — no modal, no crash
- Minimum duration enforcement works through terminal identically to UI
- Terminal works fully offline for all non-Legion commands
- Cmd+K / Ctrl+K opens terminal from anywhere in the app

---

## Post-V4: Global Leaderboard + League Tiers

Not built in V4. Documented here for planning continuity.

**Trigger for build:** User density sufficient for tier populations to feel like communities, not ghost towns. A Ascendant tier with 3 users is worse than no tier system.

**League tiers:**
- Initiate
- Vanguard
- Sentinel
- Warden
- Ascendant

**Global leaderboard philosophy:** Same campfire model as Friends Leaderboard. Story surfacing over raw XP numbers. Self-comparison remains default. Global ranking is always opt-in.

---

## Build Sequencing

```
Parallel track A (social):
Week 1-2: Friends System
Week 2-3: Friends Leaderboard

Parallel track B (independent):
Week 1+:  Regional Soundscapes (ship when ready, no dependency)
Week 3+:  War Terminal (ship when ready, no dependency)

Sequential (requires track A complete):
Week 4-6: Legion Operations

Post-V4:
          Global Leaderboard + League Tiers
```

---

## What V4 Does Not Change

- Core task creation flow (Operations tab)
- Ritual system and consistency track
- Medal evaluation windows and tier thresholds
- Scythe progression and cosmic variants
- Artifact system and rarity tiers
- Scratch card reveal mechanic
- Dragon / Empress / fairy fragment lore
- Region unlock mechanism (5 keys per region)
- Greek deity fitness progression
- Tactical Cache Core and offline architecture
- Ledger structure and collectible hierarchy

V4 adds layers. It does not rebuild foundations.

---

*PRD finalized June 2026. All Legion edge cases resolved. Schema ready for commit. War Terminal requires no new schema beyond optional command log.*
