# Release Notes - Warscythe v2.1.2 (Build 14)

Welcome to **Warscythe v2.1.2**! This release introduces critical infrastructure improvements for AdMob app store verification, custom cosmetic theme syncing, layout rendering improvements, and payment flow logging.

## What's New

### 1. AdMob & Store Verification Configuration
* **AdMob Application ID:** Added the Google Mobile Ads SDK application ID to `AndroidManifest.xml` to link the native app binary to your AdMob account and prevent crashes on startup.
* **PWA Service Worker Denylist:** Configured the PWA service worker to bypass and ignore physical files (`app-ads.txt`, `robots.txt`, `.well-known/assetlinks.json`, and `privacy.html`). Visiting `/app-ads.txt` now serves the raw text file directly in all web browsers.
* **Explicit Crawler Whitelisting:** Created a `robots.txt` configuration that whitelists the `Mediapartners-Google` and `Googlebot` crawlers for the root and `app-ads.txt` paths.

### 2. State Merging & Cosmetic Syncing
* **Store Sync Fix:** Fixed a synchronization bug in `useWarscytheStore.js` where merging states would cause local `'default'` themes or scythe skins to overwrite custom cosmetics saved on the database. Custom themes now sync perfectly across devices.
* **Dynamic Region Backgrounds:** Added native support in `DashboardLayout.jsx` for dynamic region themes, allowing any region background to be unlocked and set as the active theme.

### 3. Payment Gateway Diagnostics
* **Detailed Error Unpacking:** Replaced standard `supabase.rpc` and `supabase.functions.invoke` calls with standard `fetch` requests for payment Edge Functions. This permits the app to unpack and display detailed Razorpay gateway error payloads directly to the client instead of generic HTTP errors.

---

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
