# ⚔️ WARSCYTHE: SCREENSHOT FEATURE BRIEF

**Purpose:** Design screenshots that are Instagram Reel + Twitter/X worthy without dark patterns  
**Philosophy:** Beautiful enough to share organically. Competitive without manipulation.  
**Privacy:** Others see achievement. Never see the task details.

---

## CORE DESIGN PRINCIPLE

Every screenshot is **cinematic, not functional**.

Not a data dump. Not a leaderboard. Not a stats page. A *moment*. A celebration of execution.

Visual-first. Minimal text. Emotional impact. Worth screenshotting before the button appears.

---

## PLATFORM SPECIFICATIONS

### Instagram Stories / Reels
- **Aspect ratio:** 9:16 (vertical, full-screen mobile)
- **Safe area:** 1080×1920px
- **Text overlay safe:** 150px from top/bottom
- **Export format:** PNG (transparent background optional), WebP
- **Max file size:** 4MB

### Twitter/X Posts
- **Aspect ratio:** 16:9 (landscape, feed scroll)
- **Dimensions:** 1200×675px minimum (2x for retina)
- **Safe area:** 50px margin on all sides
- **Export format:** PNG, WebP
- **Max file size:** 5MB

### Discord / Mobile Share
- **Square format (secondary):** 1:1 (400×400px minimum)
- **Vertical (primary):** 9:16 (same as Instagram)
- **Shareable link generation:** warscythe.io/moment/[unique-id]

---

## COLOR PALETTE (Consistent Across All Screenshots)

### Primary Colors
- **Deep Black:** `#0a0e27` (background, main)
- **Gold Accent:** `#d4a574` (primary highlights, text emphasis)
- **Deep Purple:** `#2a1a4e` (secondary accents, borders)
- **Void Purple:** `#1a0f2e` (dark overlays, depth)

### Rarity Colors (Artifact-tied)
- **Common:** `#808080` (grey)
- **Uncommon:** `#2ecc71` (green luminescent)
- **Rare:** `#f1c40f` (gold)
- **Epic:** `#e74c3c` (crimson)
- **Mythic:** `#9b59b6` (purple void)

### Accent Hierarchy
- Gold for primary CTA / main achievement
- Purple for secondary info / context
- White (`#ffffff`) for text, max contrast
- Soft white (`#e8e8e8`) for secondary text

---

## TYPOGRAPHY

### Fonts
- **Header/Title:** "Space Mono" Bold or similar monospace (gothic, technical feel)
- **Body/Info:** "Inter" or "Roboto" Regular (clean, readable)
- **Numbers/Stats:** "Space Mono" Regular (tabular, precise)

### Size Hierarchy
- **Achievement Name (Main):** 48-56px, bold, gold color, 1.2 line height
- **Secondary Info:** 24-32px, white, 1.1 line height
- **Metadata (date, user):** 14-16px, soft white, opacity 0.8
- **Stat Numbers:** 28-36px, gold, space mono

### Text Rules
- **Maximum 3-4 text elements** per screenshot (less is more)
- **Always use hierarchy** — one clear focal point
- **Avoid clutter** — whitespace is design
- **No drop shadows** unless necessary for contrast (use opacity instead)

---

## SCREENSHOT TYPES & DETAILED DESIGNS

---

## 1️⃣ OPERATION COMPLETION SCREENSHOT

### Design Layout

```
[Background: Dark gradient with region aesthetic]
[Center: Region emblem or dragon silhouette faded]

[Top-right: Golden corner accent]
[Top-left: Region name in gothic font]

[Center-left: Artifact image (photorealistic, large)]
[Center-right: Achievement text aligned right]

[Bottom: Metadata strip (date, streak counter)]
```

### Visual Hierarchy

**Main Element:** Artifact (rarity-appropriate drip effect)
- Base artifact size: 240×240px (left side)
- Rarity glow matches artifact type (Common: muted, Mythic: intense)
- Light source from top-left (consistent cinematic lighting)

**Achievement Text (Right side):**
```
Operation Complete
[Region Name]
```
- Achievement line: 32px, gold, uppercase
- Region name: 48px, white, bold
- Padding: 40px from right edge

**Metadata (Bottom strip):**
```
Day 47 Streak  |  Threat: Legendary  |  Region 3 of 5
```
- Small text, soft white, monospace
- 20px from bottom
- Three-column layout, center-aligned

### Dimensions
- **Instagram Stories:** 1080×1920px
- **Twitter:** 1200×675px (cropped, artifact left, text centered)

### Animation (Optional, for social posting)
- Artifact fades in (0.5s ease)
- Text slides from right (0.3s delay, 0.4s duration)
- Glow pulses once (rarity-dependent intensity)
- No loops (static screenshot, animation for preview only)

### Example Copy (Minimal)
```
Operation Complete
[REGION NAME]

Day [streak] Streak
```

---

## 2️⃣ REGION COMPLETION / FAIRY LIBERATION SCREENSHOT

### Design Layout

```
[Full-screen: Region-specific background]
[Center: Fairy silhouette becoming visible/throne]
[Top-center: Region name in gold gothic font]
[Right side: Shield crest emblem (region-specific)]
[Bottom: Completion stats]
```

### Visual Hierarchy

**Background:** Region aesthetic (procedurally colored, 10 base variations)
- Ashwood: Forest-toned greens/blacks
- Kailash: Ice blues/whites
- Lava Citadel: Volcano reds/golds
- Each with particle effects (falling leaves, snowflakes, embers)

**Center Image:** Liberated fairy on throne
- Size: 400×500px
- Photorealistic illustration
- Golden light source from above
- Subtle glow around throne

**Region Name (Top-center):**
```
ASHWOOD LIBERATED
```
- 56px, gold, uppercase, gothic font
- Centered, 60px from top
- Single line only

**Shield Crest (Top-right corner):**
- 120×120px
- Region-specific heraldic design
- Gold outline, semi-transparent background
- 30px from top-right corner

**Completion Stats (Bottom bar):**
```
5/5 Operations Complete  |  Dragon Vanquished  |  Fairy Freed
```
- Three columns, monospace, 18px
- Soft white, opacity 0.9
- 40px from bottom

### Dimensions
- **Instagram Stories:** 1080×1920px (full-screen vertical)
- **Twitter:** 1200×675px (cropped horizontally, centered on fairy)

### Animation (Optional)
- Background fade in (0.8s)
- Fairy appears (0.5s delay, magical glow pulse)
- Crest slides in from top-right (0.3s)
- Stats slide in from bottom (0.4s delay)

### Example Copy
```
REGION LIBERATED
[Region Name]

5 Operations Conquered
Dragon Slain
Fairy Freed
```

---

## 3️⃣ DEITY PROGRESSION UNLOCK SCREENSHOT

### Design Layout

```
[Background: Black, with subtle golden particle effects]
[Center: Photorealistic deity statue (large, glowing)]
[Top-center: Deity name in gold gothic]
[Right side: Volume progress bar (vertical)]
[Bottom: Volume achieved / next milestone]
```

### Visual Hierarchy

**Deity Statue (Photorealistic):**
- Size: 500×600px (centered)
- Cinematic lighting (raking light, strong shadows)
- Intense glow effect proportional to deity tier:
  - Hermes: Subtle gold glow
  - Apollo: Medium golden radiance
  - Ares: Sharp crimson edges
  - Hercules: Full golden transcendence
  - Zeus: Cosmic void + gold hybrid

**Deity Name (Top-center):**
```
APOLLO UNLOCKED
```
- 64px, gold, uppercase, gothic font
- 80px from top

**Volume Progress (Right side, vertical bar):**
```
Current: 150,000 kg
Next: Apollo → Ares (250,000 kg)
Progress: ████████░░░ 60%
```
- Bar width: 40px, height: 300px
- Filled: gold (`#d4a574`), empty: void purple (`#2a1a4e`)
- Numbers: 16px monospace, soft white
- 80px from right edge, vertically centered

**Bottom Metadata:**
```
150,000 kg Accumulated  |  Gym Volume Milestone  |  25 Heavy Workouts
```
- 18px monospace, soft white
- 60px from bottom

### Dimensions
- **Instagram Stories:** 1080×1920px
- **Twitter:** 1200×675px (statue centered, progress bar vertical right)

### Animation (Optional)
- Background particles float (subtle, continuous)
- Deity statue rises from bottom (0.8s ease-out)
- Glow intensity pulses (0.5s, repeats 2x)
- Progress bar fills (0.6s delay, smooth animation to current %)

### Example Copy
```
DEITY UNLOCKED
[Deity Name]

[Current Volume] kg Accumulated
Next: [Next Deity] at [Volume Needed] kg
```

---

## 4️⃣ RITUAL STREAK MILESTONE SCREENSHOT

### Design Layout

```
[Background: Black with subtle streak-color glow]
[Center-large: Scythe cosmic form (if applicable)]
[Top-center: Streak number in gold]
[Right: Ritual list (completed today)]
[Bottom: Scythe tier + cosmic form name]
```

### Visual Hierarchy

**Scythe Cosmic Form (Center-left):**
- Size: 300×400px
- Photorealistic, glowing intensity matches form:
  - COSMIC REAPER: Deep space voids, star clusters
  - VOID-WALKER: Purple-black tendrils, gravitational distortion
  - ETERNAL: Silvery-golden ethereal light
  - DEATH-LORD: Crimson cosmic horrors, reality bending
- Glow matches form aesthetic

**Streak Number (Top-center, extremely large):**
```
200
```
- 120px, gold, ultra-bold, space mono
- Centered, 100px from top
- Slight texture/gradient

**Milestone Badge:**
```
DAY STREAK ACHIEVED
```
- 24px, gold, above/below streak number
- Uppercase, gothic font

**Ritual List (Right side):**
```
✓ Morning Run
✓ Meditation
✓ Writing Hour
✓ Gym Session
```
- Checkmarks in gold
- Text in white, 18px
- Vertical list, 60px from right
- Max 5-6 items shown

**Scythe Tier + Form Name (Bottom):**
```
PLATINUM SCYTHE
COSMIC REAPER
```
- First line: 28px, white, monospace
- Second line: 32px, gold, gothic
- 60px from bottom, center-aligned

### Dimensions
- **Instagram Stories:** 1080×1920px (vertical)
- **Twitter:** 1200×675px (scythe left, rituals right, number centered)

### Animation (Optional)
- Scythe glows with intensity (0.6s pulse, repeats 3x)
- Streak number appears with impact (0.4s scale-up)
- Checkmarks appear sequentially (0.1s delay between each)
- Cosmic form name glows in (0.3s delay, 0.4s fade)

### Example Copy
```
[Streak Number]
DAY STREAK

Rituals Completed Today:
✓ [Ritual 1]
✓ [Ritual 2]
✓ [Ritual 3]
✓ [Ritual 4]

[Scythe Form Name]
```

---

## 5️⃣ ARTIFACT REVEAL SCREENSHOT (Post-Scratch-Card)

### Design Layout

```
[Background: Black, rarity-matched particle effects]
[Center-large: Artifact photorealistic image]
[Top: Artifact name in gold]
[Left: Hook lore (5-10 words)]
[Right: Rarity tier + drop context]
[Bottom: Region earned + threat level]
```

### Visual Hierarchy

**Artifact Image (Center, dominant):**
- Size: 350×350px
- Photorealistic object on black background
- Rarity drip effect (matching rarity color):
  - Common: Grey metallic drip, subtle glow
  - Uncommon: Green luminescent drip, medium glow
  - Rare: Gold leaf drip, high luminescence
  - Epic: Crimson steaming drip, intense glow
  - Mythic: Purple void drip, cosmic particles, transcendent glow
- Light source consistent (top-left, cinematic)

**Artifact Name (Top-center):**
```
CROWN
```
- 56px, rarity-matched color (gold for Rare+, white for Common)
- Uppercase, gothic font
- 60px from top

**Hook Lore (Left side):**
```
You iterated.
That made it better.
```
- 20px, white, italic, max 2 lines
- Left-aligned, 40px from left edge
- Vertically centered

**Rarity + Context (Right side):**
```
RARE

Forged on Day 47
Deep Hyperfocus Session
```
- Rarity label: 24px, rarity-color, uppercase
- Context: 14px, soft white, opacity 0.8
- Right-aligned, 40px from right edge
- Vertical stack

**Bottom Metadata:**
```
Operation: Finish YC Application | Threat: Legendary | Region: Ashwood
```
- 14px monospace, soft white
- Center-aligned, 40px from bottom

### Dimensions
- **Instagram Stories:** 1080×1920px
- **Twitter:** 1200×675px (artifact centered, hook left, context right)

### Animation (Optional)
- Scratch card effect (visual reveal, 0.6s, simulated cursor drag)
- Artifact glows in (0.4s delay, 0.5s fade-in)
- Particle drip effect animates (0.3s delay, gravity-like fall)
- Text fades in sequentially (hook first, then rarity, then context)

### Example Copy
```
[Artifact Name]

[Hook Lore - 1-2 lines max]

[Rarity]
Forged on Day [X]
[Context from drop time]

Operation: [Operation Name]
Threat: [Level]
Region: [Region Name]
```

---

## GENERAL DESIGN RULES

### Contrast & Readability
- **Minimum contrast ratio:** 4.5:1 for body text
- **Always test on iPhone 12** (standard mobile reference)
- **Text shadows:** Use opacity layers, not drop shadows (cleaner on screenshots)
- **Background blur:** Subtle (opacity 0.05-0.1 only) — keep visuals clear

### Spacing & Layout
- **Margins:** 40-60px from edges (not edge-to-edge)
- **Vertical rhythm:** 1.5x line height minimum
- **Padding between elements:** 30-50px
- **Whitespace is design** — don't fill every gap

### Visual Consistency
- **Particle effects:** Subtle, thematic (no overwhelming animation)
- **Glows:** Match rarity/theme, not blindingly bright
- **Shadows:** Cinematic (top-left light source), subtle
- **Grid alignment:** 8px grid for precise layout

### Performance
- **File size:** Max 4MB per screenshot
- **Optimization:** Compress PNG/WebP without quality loss
- **Rendering:** Generate server-side (not client-side animation)
- **Caching:** Store rendered screenshots, serve from CDN

---

## SCREENSHOT GENERATION PIPELINE

### Architecture
1. **Trigger:** Operation completed → generate screenshot
2. **Server-side rendering:** Use Puppeteer/Playwright to render HTML template
3. **Template system:** One template per screenshot type
4. **Dynamic data injection:**
   - User UID (never shown publicly)
   - Achievement data (operation name, region, etc.)
   - Timestamp
   - Streak counter
   - Rarity tiers

5. **Image export:** Render to PNG (Instagram), WebP (Twitter/web), both
6. **Unique ID:** `warscythe_moment_[uuid]_[timestamp]`
7. **Storage:** Save to CDN, generate shareable link
8. **Display:** Show in Ledger under "Shared Moments"

### Database Schema
```javascript
ScreenshotArchive {
  id: uuid (unique_id),
  userId: uuid (via auth, never displayed),
  momentType: enum (operation, region, deity, ritual, artifact),
  achievementData: JSON {
    operationName?: string,
    regionName?: string,
    deityName?: string,
    artfactName?: string,
    rarityTier?: string,
    streakNumber?: number,
    threatLevel?: string,
    timestamp: ISO8601
  },
  screenshotPath: url (CDN),
  shareableLink: url (warscythe.io/moment/[id]),
  shareCount: number (internal tracking only, never displayed),
  createdAt: timestamp,
  archivedAt: timestamp
}
```

### Privacy Implementation
- **User UID:** Never included in screenshot or shareable link
- **Task details:** Visible in screenshot only to user
- **Friends see:** Achievement name, rarity (if artifact), date
- **Public shareable link:** Shows screenshot, no user ID
- **No leaderboards:** Screenshots stored, never ranked by engagement

---

## SHARING MECHANICS (No Dark Patterns)

### Screenshot Appears (Post-Completion)
```
[Achievement screenshot fills screen]

[Bottom buttons:]
[← Back to App]     [Share →]
```

**UX Rules:**
- Screenshot appears automatically
- Share button is *optional*, not pushed
- Back button returns to app (default action)
- No "share to unlock" mechanics
- No bonus XP for sharing

### Share Flow
- **Tap Share:**
  - Native share sheet (iOS/Android)
  - Pre-fill: Achievement name + URL to shareable link
  - Copy link option
  - No social media automation

### Shareable Link Format
```
warscythe.io/moment/[unique-id]

Shows:
- Screenshot
- Achievement name
- Region/Rarity (public-safe info only)
- Date achieved
- "Download Warscythe" CTA (single, subtle button)

Does NOT show:
- User name
- Specific task details
- Comparative metrics
- Friend tags
```

### Archive System
- All screenshots stored in **Ledger → Shared Moments**
- Sortable by: date, type, rarity, region
- Re-shareable (one tap to share old moment)
- Deletable (user can remove if they want)
- Privacy default: Only user sees, unless explicitly shared

---

## QUALITY ASSURANCE CHECKLIST

### Visual Design
- [ ] Tested on iPhone 12, Pixel 6, tablet
- [ ] Text readable at small size (Twitter feed scroll)
- [ ] Gold accents pop without oversaturation
- [ ] Particle effects don't distract from main visual
- [ ] Artifact/deity/scythe image is the focal point
- [ ] No elements cut off on any platform
- [ ] Consistent spacing/alignment across all types

### Copy
- [ ] Maximum 4-5 text elements per screenshot
- [ ] Hierarchy clear (no competing for attention)
- [ ] No typos or grammar errors
- [ ] Achievement name is prominent
- [ ] Metadata (date/streak) is readable but secondary
- [ ] Hook lore (if artifact) is emotionally resonant

### Platform-Specific
- [ ] Instagram Stories: Full 9:16 no cropping, safe margins respected
- [ ] Twitter: 16:9 ratio, readable in feed scroll
- [ ] Mobile share: Fast load, under 4MB
- [ ] Desktop web: Displays correctly in shareable link

### Privacy/Compliance
- [ ] No user names visible
- [ ] No user IDs in URL or image
- [ ] Task details not publicly visible
- [ ] Shareable link generation working
- [ ] Archive system functional
- [ ] No analytics tied to shares
- [ ] GDPR compliant (no tracking pixels in screenshots)

### Performance
- [ ] Screenshot generates in <2 seconds
- [ ] File size <4MB per screenshot
- [ ] CDN serving screenshots (not dynamic generation)
- [ ] Caching working (images served from edge)
- [ ] No server bottleneck at scale

---

## EXAMPLE: FULL OPERATION COMPLETION FLOW

```
User completes Boss Raid operation

System generates screenshot:
- Artifact image (Mythic rarity, void drip effect)
- Operation name: "Finish YC Application"
- Region: "Ashwood"
- Threat: "Legendary"
- Streak: Day 47
- Timestamp: Dec 15, 2026

Screenshot appears full-screen
User sees their achievement cinematic moment

Two options:
[← Return]  [Share →]

If Share:
- Native sheet appears
- Pre-filled: "Just completed Finish YC Application in Warscythe"
- Link: warscythe.io/moment/[uuid]
- User can share to Stories, Twitter, Discord, or copy link

If Return:
- Screenshot stored in Ledger
- User can re-share later
- Notification: "Achievement archived"

Friend sees shared link:
- Opens warscythe.io/moment/[uuid]
- Sees screenshot, artifact name, date
- No user name, no task details visible
- Single "Download Warscythe" button

Friend gets inspired:
- Downloads app
- Tries to achieve similar
- Competitive motivation, no manipulation
```

---

## FINAL PRINCIPLES

✅ **Beautiful by default** — Shares organically because it's gorgeous  
✅ **No dark patterns** — Share button optional, metrics independent of sharing  
✅ **Privacy first** — Others see achievement, never task details  
✅ **Platform-native** — Works seamlessly on Instagram, Twitter, Discord, iMessage  
✅ **Competitive without manipulation** — Drives growth through genuine inspiration, not algorithms  

---

**⚔️ Build this and users will screenshot naturally. Beauty is the marketing.**

