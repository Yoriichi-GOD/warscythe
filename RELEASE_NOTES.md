# Release Notes - Warscythe v2.1.0 (Build 11)

Welcome to the **Warscythe v2.1.0** production release! This update introduces a completely redesigned, narrative-integrated onboarding tutorial flow, contextual action guidance, visual polishing, and safety sandbox features for first-time players.

## What's New

### 1. Interactive Onboarding & Tutorial Architecture
- **Narrative-Driven Onboarding**: Players are introduced to the generational execution engine through an immersive step-by-step introduction.
- **Tutorial Sandbox**: The very first task is run inside a protected tutorial sandbox. It awards XP and initial loot, but does not impact the region's overall progress (keys or level growth), ensuring a risk-free learning zone.
- **Cinematic Transition**: Upon tutorial completion, a seamless transition leads the player through the "Your journey begins here" title card into a dramatic, split-screen region unlocking screen, introducing Malgrath and the caged Dryad.

### 2. Contextual Action Pointers
- Replaced floating, passive text guides with targeted, glowing inline pointers directly attached to interactive elements:
  - **Task Initiation**: Highlights the "+ INITIATE STRIKE" button.
  - **Task Details & Completion**: Points to the "VALIDATE EXECUTION" button inside the task modal.
  - **Reality Check**: Points to the "FINISH IT" button on the reality check overlay.
  - **Loot Claim**: Guides the user's swipe on the reward scratch card.

### 3. Interface & Visual Polish
- **Dormant Scythe State**: The legendary Warscythe display remains locked in its "Dormant" status (Level 1, Power 10) during onboarding until the player completes their tutorial strike.
- **Fog of War & Map Locks**: Region 1 and the campaign theater map remain locked, obscured by fog, until the onboarding sequence has been fully conquered.
- **Responsive Pointers**: Guided UI markers are rendered inline inside modals to prevent cropping issues across various device screen aspect ratios.
- **Region Compass Redesign**: Replaced the compass overview icon with a mini zooming region preview surrounded by a golden, pulsating glow.
