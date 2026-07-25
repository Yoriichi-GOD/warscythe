# Warscythe Legion — Human + AI Execution Units

## The Idea

Warscythe Legions can evolve beyond groups of friends completing tasks together.

A Legion can become a **shared human + AI execution environment** where a group of people works on the same project alongside coding agents such as Codex.

The existing **Wall Terminal** becomes the shared command interface.

Humans talk to each other there.  
Humans talk to agents there.  
Agents report their work there.  
The Legion sees the project changing in real time.

The goal is not to place a chatbot inside a Legion.

The goal is to make AI agents behave like **working members of the Legion**.

---

## Core Architecture

The correct hierarchy is:

```text
Legion
  ↓
Project
  ↓
Operation
  ↓
Agent Session
  ↓
MCP / Tool Layer
  ↓
Repository + Infrastructure
```

An agent is therefore not loosely attached to a chat window.

An **Agent Session belongs to an Operation**, and that Operation belongs to a Project inside the Legion.

For example:

```text
Legion: Warscythe Core

Project:
Warscythe

Operation:
Fix Legion Realtime Presence

Humans:
Saishreek
Abhay

Agent:
Codex-01

Branch:
agent/legion-realtime-431
```

This gives every agent a clear objective, context, permission boundary, and workspace.

---

## The Wall Terminal

The existing Wall Terminal becomes the shared conversation and execution surface.

```text
Saishreek:
@Codex inspect the Legion realtime subscription.

Codex:
I found two duplicated listeners.

Abhay:
@Codex show us where.

Codex:
Both originate inside useLegionPresence.ts.

Saishreek:
Patch them.

SYSTEM:
Codex modified 2 files.

Abhay:
Run the tests.

SYSTEM:
Codex is running the test suite...

SYSTEM:
34 passed.
2 failed.

Codex:
The remaining failures are caused by stale presence state.
I can patch the subscription cleanup.

[ APPROVE PATCH ]   [ VIEW DIFF ]   [ ASK CODEX ]
```

Everyone in the Legion can see the same execution history.

The terminal is therefore simultaneously:

- a human group chat,
- an AI interface,
- an execution log,
- an approval surface,
- and a live view into the project.

---

## Real-Time Does Not Mean Continuous AI Execution

The execution system should remain **event-driven**.

```text
Human instruction
      ↓
Agent reasoning
      ↓
Tool call
      ↓
Result
      ↓
Next agent action
```

What becomes real-time is the **observation layer**.

Every meaningful agent action emits an event:

```text
agent.started
file.read
file.modified
command.started
test.started
test.failed
test.passed
diff.created
approval.requested
commit.created
agent.completed
```

Those events are streamed to every Legion member through the realtime layer.

So if Codex begins modifying a file, everyone can immediately see:

```text
⚔ CODEX-01

STATUS
Editing

CURRENT OPERATION
Realtime Legion Synchronization

CURRENT FILE
src/hooks/useLegionPresence.ts

LAST ACTION
Removed duplicate subscription listener
```

The agent does not need to continuously poll the repository.

**Execution stays event-driven. Telemetry becomes real-time.**

---

## MCP as the Capability Layer

MCP can sit between the agent and the systems it is allowed to operate.

Conceptually:

```text
Codex
  ↓
MCP
  ↓
Available Capabilities
```

An engineering agent might receive tools such as:

```text
read_project_file()
write_project_file()
get_git_diff()
run_tests()
inspect_logs()
query_database()
create_branch()
create_commit()
open_pull_request()
```

This keeps Warscythe independent from one specific agent.

Today the Legion might contain:

```text
Codex → Engineering
```

Later:

```text
Coding Agent     → Engineering
Research Agent   → Research
Design Agent     → Assets
Analytics Agent  → Product Metrics
Security Agent   → Audit
```

Warscythe only needs to understand agents, operations, capabilities, permissions, and events.

---

## Agent State

Every active agent can have a persistent Legion state.

```ts
type LegionAgent = {
  id: string;
  legionId: string;
  projectId: string;
  operationId: string;

  provider: "openai" | "anthropic" | "custom";
  agentType: "coding" | "research" | "design" | "security";

  status:
    | "idle"
    | "thinking"
    | "reading"
    | "editing"
    | "testing"
    | "waiting_approval"
    | "complete";

  currentTask?: string;
  currentFile?: string;
  branch?: string;

  permissions: {
    read: boolean;
    write: boolean;
    execute: boolean;
    commit: boolean;
    push: boolean;
    deploy: boolean;
  };
};
```

That state can be broadcast to the Legion exactly like presence information for human members.

The result is that the agent starts feeling like another participant in the Operation.

```text
LEGION — WARSCYTHE CORE

Saishreek        ONLINE
Abhay            ONLINE
Aarav            AWAY
Codex-01         ⚒ BUILDING

Current Operation
━━━━━━━━━━━━━━━━━━━━━━━━━━
Realtime Legion Terminal

Codex-01
██████████████░░

Editing:
useLegionPresence.ts

Last Action:
Fixed stale WebSocket subscription
```

---

## Operations Solve Concurrent Authority

The difficult problem is not putting an AI inside a group chat.

The difficult problem is deciding **who controls what when several humans and several agents are operating simultaneously**.

Operations provide that boundary naturally.

Instead of giving a Legion unrestricted control over an agent:

```text
Legion
  ↓
Agent
```

the model becomes:

```text
Legion
  ↓
Operation
  ↓
Agent Session
  ↓
Dedicated Branch / Worktree
```

Each Operation owns its agent context.

For example:

```text
Operation #431
Fix Legion Realtime State

Owner:
Saishreek

Collaborators:
Abhay
Dev

Agent:
Codex-01

Workspace:
agent/legion-realtime-431
```

Everyone can participate in the conversation, while the agent remains attached to one clearly defined execution context.

This prevents unrelated instructions from different members from corrupting the same working state.

---

## Humans and Agents Become One Execution Graph

Warscythe already understands:

```text
Legion
  ↓
Operation
  ↓
Members
  ↓
Objectives
  ↓
Completion
```

Agents simply become another type of participant.

An Operation could look like:

```text
OPERATION
Build Legion Voice Chat

Saishreek
└── Product + UI

Abhay
└── Backend Architecture

Codex-FE
└── Frontend Implementation

Codex-BE
└── Signalling Infrastructure

Codex-QA
└── Integration Tests

Security Agent
└── Permission Audit
```

At that point, Warscythe is not merely storing tasks.

It is representing an **execution graph** containing both humans and autonomous workers.

---

## Permission Boundaries

Agents should not receive unlimited authority.

Low-risk capabilities can execute directly:

```text
READ
EDIT
TEST
DIFF
```

Higher-risk actions should require explicit approval:

```text
COMMIT
PUSH
DATABASE MIGRATION
DEPLOYMENT
SECRET ACCESS
DESTRUCTIVE COMMAND
```

The Wall Terminal can surface these moments directly:

```text
CODEX REQUESTS PERMISSION

Action:
Apply database migration

Project:
Warscythe Production

Operation:
Legion Presence Rewrite

[ APPROVE ]   [ DENY ]   [ INSPECT ]
```

This keeps autonomy useful without turning the agent into an uncontrolled production operator.

---

## MVP

The first version does not need a massive autonomous multi-agent system.

It needs:

```text
1 Legion
1 Project
1 Operation
1 Codex Agent
1 Wall Terminal
```

Initial agent capabilities:

```text
READ
EDIT
TEST
DIFF
```

Initial realtime events:

```text
Agent started
Agent reading file
Agent editing file
Tests running
Tests passed
Tests failed
Approval requested
Agent completed
```

That alone proves the central interaction:

> **A group of friends can work with an AI coding agent inside the same Legion and watch the project evolve live.**

---

## Expansion

Once the single-agent model works, multiple specialized agents can operate through isolated Operations and workspaces.

```text
@Codex-Frontend
@Codex-Backend
@Codex-Test
@Security
```

Eventually a Legion member could issue a high-level objective:

```text
Legion, ship party voice chat.
```

The system could decompose it into an execution graph:

```text
                    OPERATION
                 PARTY VOICE CHAT

                       │
              Architecture Agent
                       │
          ┌────────────┴────────────┐
          │                         │
   Frontend Agent             Backend Agent
          │                         │
          └────────────┬────────────┘
                       │
                    QA Agent
                       │
                 Security Agent
                       │
                  HUMAN REVIEW
                       │
                     MERGE
```

Humans remain inside the loop while agents perform the implementation work.

---

## What This Turns Legion Into

A Legion begins as:

> **A group of friends executing together.**

With agent infrastructure, it becomes:

> **A group of humans and AI agents executing together.**

The existing Warscythe concepts already map naturally onto the problem:

```text
Legion      → Team
Project     → Shared environment
Operation   → Execution boundary
Member      → Human participant
Agent       → AI participant
Wall        → Communication layer
Terminal    → Command surface
MCP         → Capability layer
Realtime    → Observation layer
Artifacts   → Execution history
```

That is why this fits Warscythe frighteningly well.

The product does not need an unrelated AI feature bolted onto it.

The existing Legion architecture can evolve into something much larger:

# **Human + AI Execution Units**

Friends, builders, and agents operating from one command room, against one objective, with one visible execution history.


---

# The Larger Warscythe Vision

## Why This Belongs in Warscythe

Warscythe begins with a simple psychological observation: **finishing real work rarely feels like anything**.

The current product turns execution into visible progression. Operations convert work into campaigns, Rituals make consistency legible, Fitness turns physical effort into progression, and Fragments, artifacts, kingdoms, dragons, and liberated Empresses make completion emotionally tangible. The exact number of tiers or collectible states is secondary; the important part is the psychological loop:

```text
REAL ACTION
    ↓
VISIBLE CONSEQUENCE
    ↓
PROGRESSION
    ↓
EMOTIONAL REWARD
    ↓
RETURN TO EXECUTION
```

That remains the core.

But the same architecture creates a much larger opportunity.

Warscythe already has **Legions**, where people can execute together, and it already has the **Vault Terminal**, a command-room interface inside the world.

The long-term plan is to make those systems converge.

---

# From Multiplayer Execution to Human + AI Execution

A Legion should eventually be able to contain not only human collaborators, but AI workers.

The hierarchy is:

```text
Legion
  ↓
Project
  ↓
Operation
  ↓
Human + Agent Sessions
  ↓
MCP / Controlled Tools
  ↓
Repository + Infrastructure
```

An AI coding agent such as Codex would not simply be attached to a generic chatbot.

It would join a specific Operation, inherit that Operation's project context and permissions, and work from an isolated branch or worktree.

The Vault Terminal becomes the shared command surface.

```text
Saishreek:
@Codex inspect the realtime subscription.

Codex:
I found two duplicated listeners.

Abhay:
@Codex show us where.

Codex:
Both originate inside useLegionPresence.ts.

Saishreek:
Patch them.

SYSTEM:
Codex modified 2 files.

Abhay:
Run the tests.

SYSTEM:
Codex is testing...

SYSTEM:
34 passed.
2 failed.

Codex:
The remaining failures are caused by stale presence state.

[ APPROVE PATCH ]   [ VIEW DIFF ]   [ ASK CODEX ]
```

The important part is not merely that an AI can write code.

The important part is that **everyone in the Legion can see the same execution state and collaborate with the agent from the same place they already collaborate with one another.**

---

# Real-Time Agent Presence

Agent execution remains event-driven.

```text
Instruction
    ↓
Agent
    ↓
Tool
    ↓
Result
    ↓
Next Action
```

The observation layer becomes real-time.

Every meaningful action can emit an event:

```text
agent.started
file.read
file.modified
command.started
test.started
test.failed
test.passed
diff.created
approval.requested
commit.created
agent.completed
```

Those events are streamed to the Legion.

An agent therefore becomes visibly present:

```text
LEGION — WARSCYTHE CORE

Saishreek        ONLINE
Abhay            ONLINE
Codex-01         ⚒ BUILDING

Current Operation
━━━━━━━━━━━━━━━━━━━━━━━━━━
Forge Region XXI

Codex-01
Editing:
RegionRegistry.ts

Last Action:
Registered new cathedral environment

Tests:
RUNNING
```

This matters because status does not have to feel sterile.

An agent can feel like another entity in the party: visibly reading, building, testing, waiting, or completing work.

The objective is not to gamify the AI for decoration.

The objective is to make invisible computation **legible, social, and emotionally present**.

---

# Building Warscythe From Inside Warscythe

The eventual result is deliberately self-referential:

> **We should be able to build Warscythe from inside Warscythe.**

A Legion could be playing through the current world while simultaneously building the next part of that world from the Vault Terminal.

```text
OPERATION
Forge Region XXI

Saishreek       Art Direction
Abhay           Infrastructure
Codex-FE        Implementation
Codex-QA        Tests
```

The team can attach an environment, direct the agent, inspect the diff, run tests, approve changes, and eventually see the new region appear in the same product from which it was built.

We could literally be collecting Fragments, liberating an Empress, open the Vault Terminal, and start coding the kingdom that comes next.

That sounds playful because it is.

It is also a serious product direction: **the execution environment and the product being executed on begin to converge.**

---

# MCP as a Capability Boundary

MCP or an equivalent controlled tool layer can expose only the actions an agent is permitted to perform.

For an engineering agent:

```text
read_project_file()
write_project_file()
get_git_diff()
run_tests()
inspect_logs()
create_branch()
open_pull_request()
```

Higher-risk actions remain permission-gated:

```text
COMMIT
PUSH
DATABASE MIGRATION
DEPLOYMENT
SECRET ACCESS
DESTRUCTIVE COMMAND
```

This makes the safety model capability-based rather than relying only on instructions to the model.

The agent cannot perform an action it has never been given.

---

# Operations Solve Multi-Agent Coordination

The hard part of multi-agent collaboration is not chat.

It is authority.

If several humans and several agents can issue changes simultaneously, each piece of work needs a clear execution boundary.

Warscythe already has that primitive: **Operations**.

```text
Legion
  ↓
Project
  ↓
Operation
  ↓
Agent Session
  ↓
Dedicated Branch / Worktree
```

An Operation can therefore contain both humans and agents:

```text
OPERATION
Build Legion Voice Chat

Saishreek
└── Product + UI

Abhay
└── Backend Architecture

Codex-FE
└── Frontend Implementation

Codex-BE
└── Signalling Infrastructure

Codex-QA
└── Integration Tests

Security Agent
└── Permission Audit
```

Warscythe stops representing only a task list.

It begins representing an **execution graph**.

---

# Personal Software Without Becoming a Developer

There is a second direction that connects naturally to this.

We believe software will become increasingly personal.

That does not mean every user needs to learn React, inspect a repository, edit CSS, or understand deployment.

It means users should increasingly be able to express:

> "I want my interface to feel like this."

and have the software safely adapt itself.

The principle is:

> **Give people frontend-level authorship without requiring them to become frontend developers.**

Warscythe can begin with the world itself.

Users could customize selected parts of their realm:

```text
Scythes
Altars
Backgrounds
Legion banners
Selected interface treatments
Theme presets
Animation intensity
Surface treatments
```

Custom images remain isolated in user-owned storage namespaces rather than modifying canonical Warscythe assets.

Conceptually:

```text
DEFAULT
/assets/scythes/dormant.png

USER OVERRIDE
/users/{userId}/customizations/scythes/dormant/{assetId}.png
```

The rendering rule remains simple:

```text
userOverride ?? defaultAsset
```

The core product stays intact while the user's version becomes increasingly personal.

---

# The Forge

Warscythe can eventually expose this through a controlled customization system: **the Forge**.

A user does not receive repository access.

A user does not receive arbitrary CSS or JavaScript access.

They describe intent.

```text
Make my Vault feel colder, more arcane,
and slightly less transparent.
```

Warscythe generates compatible choices:

```text
OPTION I — FROSTED CATHEDRAL
Panel opacity: 82%
Blur: Medium
Border: Silver Rune
Glow: Low
Texture: Frosted Obsidian
Motion: Slow

OPTION II — DEAD WINTER
Panel opacity: 91%
Blur: Low
Border: Thin Ice
Glow: None
Texture: Black Stone
Motion: Minimal
```

The user chooses.

Internally, Warscythe applies validated design tokens:

```json
{
  "panelOpacity": 0.82,
  "blurLevel": "medium",
  "borderPreset": "silver-rune",
  "glowPreset": "low",
  "surfacePreset": "frosted-obsidian",
  "motionPreset": "slow"
}
```

The system therefore becomes:

```text
USER INTENT
    ↓
AI
    ↓
WARSCYTHE DESIGN SYSTEM
    ↓
APPROVED CONFIGURATIONS
    ↓
PREVIEW
    ↓
USER SELECTION
    ↓
APPLY
```

The user gets creative control.

Warscythe keeps the guardrails.

---

# The App Becomes Self-Reliant

This removes an unnecessary workflow.

A user should not have to:

```text
Leave Warscythe
    ↓
Open repository
    ↓
Find component
    ↓
Understand CSS
    ↓
Edit code
    ↓
Build
    ↓
Deploy
    ↓
Return to Warscythe
```

just to change the feeling of their own environment.

Instead:

```text
Vault Terminal
    ↓
Describe Intent
    ↓
Choose Approved Variant
    ↓
Preview
    ↓
Apply
```

The app understands its own customizable surfaces.

The user only needs to understand what they want.

---

# External Creation Can Come First

Warscythe does not initially need to pay for every generated asset.

The Forge can teach users how to create compatible assets with whichever image-generation system they already use.

For example:

```text
FORGE A SCYTHE

1. Download reference.
2. Copy the Warscythe-compatible prompt.
3. Generate using your preferred image model.
4. Required format:
   - PNG
   - transparent background
   - correct aspect ratio
   - subject inside safe area
5. Upload.
6. Preview.
7. Equip.
```

As generation becomes cheaper, more of this pipeline can move directly inside Warscythe.

The architecture remains the same.

---

# Creative Ownership as Retention

There is an important consequence to personalization.

If someone spends time building:

- their scythe,
- their altar,
- their realm,
- their Legion banner,
- their visual theme,

Warscythe becomes more than a replaceable productivity interface.

The user has authored part of the environment.

For an individual, it becomes:

> **my realm.**

For a Legion:

> **our realm.**

The retention mechanism is not artificial lock-in.

It is accumulated creative ownership.

---

# Where the Two Directions Meet

AI execution and customization eventually converge inside the Vault Terminal.

```text
Saishreek:
@Warscythe make our Vault less transparent.

Warscythe:
Three compatible variants generated.

[ FROSTED CATHEDRAL ]
[ DEAD WINTER ]
[ OBSIDIAN KEEP ]

Saishreek:
Second.

SYSTEM:
Vault appearance updated.

Saishreek:
@Codex continue Region XXI.

Codex:
Continuing from RegionRegistry.ts.

SYSTEM:
Codex is forging...
```

One terminal can eventually control two fundamentally different things:

```text
THE ENVIRONMENT
        +
THE WORK HAPPENING INSIDE THE ENVIRONMENT
```

That is the larger idea.

---

# Product Evolution

The progression can happen incrementally.

```text
WARSCYTHE
Execution RPG
    ↓
PERSONAL WARSCYTHE
Execution RPG + user-authored realm
    ↓
AI LEGIONS
Humans + agents executing together
    ↓
THE FORGE
Controlled authorship over the experience
    ↓
SELF-BUILDING WARSCYTHE
The environment from which you work
can also modify the environment itself
```

None of this requires abandoning the current core.

Fragments, Fitness, Rituals, Operations, progression, kingdoms, artifacts, dragons, and Empresses continue doing what they were designed to do:

**make real execution emotionally tangible.**

The future systems extend the same principle.

First, Warscythe makes execution feel like a world.

Then the user can shape that world.

Then their friends can inhabit and work inside it.

Then AI agents can join their Legion.

And eventually the Legion can build the world from inside the world.

---

# Why the Vault Terminal Already Exists

The Vault Terminal is intentionally present before the complete system around it exists.

Today, it establishes the command-room metaphor.

Tomorrow, it can become the surface through which humans coordinate with agents, inspect execution, approve actions, customize their environment, and eventually operate on Warscythe itself.

Its presence is therefore not a disconnected UI experiment.

It is an architectural placeholder for where we want the product to go.

It reminds us that there is a version of Warscythe we still have to pull off.

---

# The Thesis

Warscythe starts with a psychological problem:

> **Real-world progress often has terrible feedback.**

So we make progress visible.

But once execution has a world, a team system, a command surface, and persistent identity, the natural next question becomes:

> **What else can that world become?**

Our answer is:

### A personal execution environment.

### A multiplayer command room.

### A place where humans and AI agents work together.

### A piece of software the user can increasingly author without needing to become a developer.

And eventually:

# **A world capable of helping build itself.**

That is why the Legion and Vault Terminal matter beyond their current implementations.

They give us a path from a gamified execution product to something much stranger:

> **Human + AI execution units operating inside software they can progressively make their own.**
