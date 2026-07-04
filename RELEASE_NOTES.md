# Release Notes - Warscythe v4.1.0 (Build 21)

Welcome to **Warscythe v4.1.0**! This release introduces **Dynamic Audio Soundscapes**, interactive region selectors, custom deep-linking social logins, and critical data synchronization protections.

## What's New

### 1. Immersive Atmospheric Soundscapes
* **12 Custom Music Themes**: Integrated slow, peaceful, and immersive ambient loops for all 10 regions, plus Mount Kailash (Shiva) and Industrial Core (Lava) premium themes.
* **Smart Crossfades**: Seamless crossfading transitions between tracks as you level up or switch themes.
* **On-Demand CDN Streaming**: Configured mobile assets to download and cache audio files dynamically from the CDN (Supabase Storage) to keep the app footprint small, while Region 1 & 2 music is pre-bundled for instant startup.

### 2. CommandCenter Jukebox & Selector
* **Region Theme Selector**: Added an elite-style dropdown below the Jukebox image in the Command Center. You can now select and preview any region's soundscape directly.
* **Atmosphere Descriptions**: Shows a 5-6 word description matching the emotional tone and instrumentation of each region's soundscape.
* **Interactive Jukebox**: Click on the spinning Jukebox PNG to toggle the Soundscape ON/OFF directly.

### 3. Native Deep-Linking OAuth (Google Login)
* **Custom Scheme Redirection**: Configured intent filters to catch `warscythe://login-callback` redirects from social OAuth browser sessions and route them back into the native app.
* **Robust Token Parser**: Upgraded token parser to manually extract session parameters from query/hash fragments, ensuring compatibility across all native webviews.

### 4. Data Safety & Asset Fixes
* **Startup Sync Protection**: Implemented a two-stage startup handshake to prevent old local storage states on legacy devices from overwriting newer progress saved in the cloud.
* **Themed Platform Assets**: Fixed a path-matching bug where themed ritual platforms (`ritual-platform.png`) for Shiva and Lava would fail to load because they were mistakenly categorized as bundled assets. They now resolve to the CDN correctly.

---

# Release Notes - Warscythe v4.0.0 (Build 20)

Welcome to **Warscythe v4.0.0**! This major release introduces the **Info Icon Navigation System**, cosmetic custom overrides, and multiple Quality of Life improvements across all modules.

## What's New

### 1. Unified Info Icon Navigation System
* **Contextual Triggers**: Added small interactive info icons next to headers across all major pages (Operations, CommandCenter, Rituals, Fitness, Social, WarTerminal, ShopModal, PremiumModal, TutorialModal, and Header).
* **Gothic Lore Modal**: Opens a dark, gold-fantasy themed slide-up modal.
  * **Level 1**: Lists sub-features inside the selected section as clickable gold links.
  * **Level 2**: Displays dynamic lore **Philosophy**, **Use Case & Rules**, and **Key Operational Directives** with back buttons.
* **Smart Back Interception**: Intercepts native device popstate to return to the list view first, and then dismisses the modal on the second tap instead of exiting the app.
* **Dynamic Deep Linking**: Links to URLs containing specific section hashes (e.g., `/#boss-raid` or `/#streak`) directly open the respective info overlay on mount.

### 2. Forge & Customization Overrides
* **Paid Scythes over Paid Themes**: Custom equipped scythe skins now override active environment themes correctly. Themes default back to their themed scythes only when no custom skin is equipped.
* **Forge Unequip Toggle**: The equipped scythe slot button is now an active `EQUIPPED (UNEQUIP)` toggle, enabling you to click it to return to baseline defaults.

### 3. Localization & Fitness Upgrades
* **No Price Demoralization**: Scrubbed currency tags and specific pricing references (e.g. `₹` or `$`) from the info descriptions to support dynamic localization.
* **High Contrast Triggers**: The info button next to **THE IRON LEDGER** was upgraded to high-visibility gold. Added a second info icon next to the **PANTHEON TIER / ASCENSION PATH** header in the right-hand column.
* **Event Propagation Decoupling**: Stopped event propagation on Soundscape and Guardian cards to prevent clicking the info icons from triggering music state changes or loading prophecies.

---

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
