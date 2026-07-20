# Warscythe — YC Application (Refined)

## Founders

**Who writes code, or does other technical work on your product? Was any of it done by a non-founder? Please explain.**

I write all the code and do all technical work solo — product, full-stack development (Android/backend), art design, infrastructure, and UI/UX design. No non-founder has contributed to the codebase. My co-founder Abhay works on go-to-market, marketing, security, and AI-assisted marketing content generation, but not on the product's engineering.

**Are you looking for a cofounder?**

No — I have a co-founder, Abhay, who handles go-to-market, marketing, security, and AI content generation.

---

## Company

**Describe what your company does in 50 characters or less.**

An RPG where your real life is the game

**Company URL, if any**

https://warscythe.xyz

**Please provide a link to the product, if any.**

https://warscythe.xyz (login required — see credentials below)

**What is your company going to make? Please describe your product and what it does or will do.**

Warscythe is a dark fantasy execution RPG where your real tasks, habits, and gym sessions determine the fate of a kingdom. There's no separate player avatar — you are the character. Complete a workout, liberate an empress. Finish a task, evolve your scythe. Break your streak, lose ground in the world. We do not motivate. We witness.

Our thesis: most people who struggle with follow-through aren't lacking capability — they're high-potential, low-discipline. They know what to do; they just don't do it. Generic habit trackers assume the problem is information (a missing checklist) or motivation (a cheerful notification). Neither addresses the actual gap, which is that execution has no weight. Completing something and not completing it feel identical the moment you close the app.

We've already seen this thesis validated by user behavior we didn't design for. Users started competing over who has more Epic-tier artifacts, and completing real-world tasks specifically to earn them — not because we built a competition mechanic, but because it emerged on its own once artifacts became visible to friends. Our most engaged user reached region 19 — deep into deliberately slow-paced progression — by discovering she could log every small task as an Operation, trading XP-per-task for volume, a strategy we never designed but that proves the core loop rewards genuine engagement over intended usage patterns. Those two discoveries have shaped what we build next more than our original roadmap did.

Warscythe's founding principle: an incomplete task is identical to an unstarted one. Nothing in the world changes on intention — only on execution. Two systems enforce this:

**Operations** are one-off commitments with a Threat Level (Low/Medium/High/Legendary) that sets a time-bound deadline you can't shortcut — you can't mark a 14-day Legendary task complete in five days. They live inside 40 regions, each guarded by a dragon; five operations liberate a fairy, then you face a Boss Raid.

**Rituals** are daily non-negotiables tracked by a single global streak — miss any one, the whole streak resets to zero. All-or-nothing by design, because consistency, not intensity, is what compounds. A tiered notification cascade (90/30/15/5 minutes out) counts down to that real consequence rather than nudging motivationally, and it offloads the cognitive burden of remembering entirely — users don't hold deadlines in their own head, the system surfaces them only when action is actually required.

Progress is visual, not just numerical. The Scythe physically evolves through six tiers as you execute, with Cosmic Forms unlocking at streak milestones. A separate Deity Progression system converts gym volume into five mythological unlocks, so physical training feeds the same mythology as task execution. Every operation completion drops one of 125 artifacts, each carrying lore that reframes an execution pattern as a strength. At 200 days, users receive a letter asking "are you building or breaking?" — a deliberate check against runaway grind.

Social accountability runs through Legion, our persistent-group system, which feeds a Friends Leaderboard built on what we call the campfire model: the default view is self-comparison — current streak vs. personal best — shown before any friend ranking. Friend ranking sorts by weekly XP rather than lifetime totals, so gaps never become insurmountable. Legion sub-tasks route XP two ways — proportionally to personal leaderboard standing, and cumulatively to Legion Level — so contributing to a group is a competitive advantage earned through real output, not a passive membership perk. A missed sub-task gets a permanent, self-reported note on the Legion's record instead of an XP penalty, keeping group history honest.

Next, we're building shareable Triumph Cards — auto-generated visual summaries of completed operations and boss raids, exportable directly to Instagram/WhatsApp — extending the same LitPark-driven organic growth model that's gotten us this far with zero paid spend.

The product is live on web and Android, self-funded with zero marketing spend to date — currently 57 registered users, 45 peak weekly active, 26 peak daily active, growing through organic content and word-of-mouth.

**Where do you live now, and where would the company be based after YC?**

Faridabad, India / San Francisco, USA

**Explain your decision regarding location.**

I currently live and build Warscythe from Faridabad, India, entirely self-funded. If accepted, I'd relocate to San Francisco for the batch — YC backing is what makes full-time, in-person commitment possible for me right now, since I don't yet have outside funding to justify going all-in without it. I'm not tied to a location by circumstance; I'm tied to it by resources, and YC solves that directly.

---

## Progress

**How far along are you?**

Warscythe is live on the Google Play Store and web with 57 registered users, 59 peak weekly active, and 26 peak daily active — entirely organic, funded out of my own pocket with zero marketing budget. We're iterating on onboarding daily, and it's showing: average session duration rose 40% week-over-week to 7 minutes 11 seconds, while bounce rate dropped 36% to 29%, in the same 7-day window as those changes shipped. We run LitPark, our content page, where I post my poetry to gain traction and then divert it toward Warscythe marketing reels; per-reel views have risen consistently from 120 to 450+ with zero paid promotion, and we're pushing toward 50 total reels by the application deadline. We've already converted to revenue: users are purchasing cosmetic themes through Razorpay, with live captured payments on the platform. Infrastructure is stable at 99.8% request success rate with no flagged errors. I've built the entire product solo — Android app, backend, infrastructure — while my co-founder Abhay runs growth and content.

**How long have each of you been working on this? How much of that has been full-time? Please explain.**

I had the idea on April 9, 2026, and shipped a local-hosted first draft the next day — at that point it was a side project. I committed full-time on May 9, 2026, once I saw it solving a real problem for me. From there, development moved fast: the core Operations/Rituals loop, the Scythe evolution system, and the Artifact Vault were built first, followed by Deity Progression in late May. Legion and the Friends Leaderboard — our social layer — shipped last, in the final week of June, once the friend graph had time to form. I've worked on it full-time solo since May. My co-founder Abhay came on June 3rd, when we devised the marketing page together, and has been part-time since, running go-to-market, marketing, security, and content.

**What tech stack are you using, or planning to use, to build this product? Include AI models and AI coding tools you use.**

Frontend/backend: JavaScript (89.6% of codebase) with TypeScript, HTML, and CSS; PL/pgSQL for database logic. Built primarily using Antigravity IDE, with Gemini models as the primary coding assistant.

Infrastructure: Vercel for deployment, Supabase for database and auth, PostHog for analytics, Resend for transactional email, Razorpay for payments.

AI: GPT and DALL-E for image generation (artifact art, regional assets, cosmetics). We've also built an automated content pipeline — Claude pulls scripts and assets directly from our GitHub repo and generates memes and reels for LitPark, which we then upload to Instagram, orchestrated through the OpenRouter API.

**Are people using your product?** Yes.

**Do you have revenue?** Yes.

**How many active users or customers do you have? How many are paying? Who is paying you the most, and how much do they pay you?**

57 registered users, 59 peak weekly active, 26 peak daily active. One paying user so far, who purchased the Shiva/Kailash cosmetic theme for ₹200 through Razorpay. She told us she bought it because it felt visually calmer than our default dark aesthetic — a data point that lines up with something I've noticed in myself: I rotate between three Scythe skins because I can't tolerate looking at one for more than about 10 days. That single purchase is the reason Night Market and a seasonal Pass system are next on our roadmap — to formalize and accelerate cosmetic-fatigue behavior we've only observed anecdotally so far, rather than continuing to rely on organic purchases like this one.

**If you are applying with the same idea as a previous batch, did anything change? If you applied with a different idea, why did you pivot and what did you learn from the last idea?**

This is our first YC application — we haven't applied previously with this or any other idea.

**If you have already participated or committed to participate in an incubator, "accelerator" or "pre-accelerator" program, please tell us about it.**

None — we haven't participated in or committed to any incubator, accelerator, or pre-accelerator program.

---

## Idea

**Why did you pick this idea to work on? Do you have domain expertise in this area? How do you know people need what you're making?**

I built Warscythe because nothing else worked for me. I tried Apple Reminders and Google Calendar to structure my routine and abandoned both within a minute — they were bland, and bland doesn't hold attention against everything else competing for it.

My domain expertise isn't credentialed in productivity software — it's in world-building and reward design. I'm a published poet, I write the world's lore myself, and I scored 98% in high school fine arts. I've spent years studying why story-mode games like Palworld and Skyrim make objectively repetitive tasks — grinding, farming materials — feel worth doing: it's never the task itself, it's the visible progression and narrative weight attached to it. Warscythe applies that same mechanic to real execution.

That expertise is showing up in what users actually do, not just what we designed. Users started competing over who has more Epic-tier artifacts and completing real-world tasks specifically to earn them — a competition mechanic we never built, that emerged the moment artifacts became visible to friends. I've felt the same pull myself: I've caught myself doing a task partly to get the artifact, and felt genuinely disappointed seeing a friend with a rarer one than mine. That's one data point, not a proven pattern yet, but it's also why our fitness system is organized around classical Greek deities rather than muscle groups — a bet that status and story would outperform raw stats here too, which we're now watching play out rather than assuming.

I'm also the product's most demanding user — I run my SAT prep, this application, my publications, and my gym log entirely through it, so every gap in the system is one I hit myself first.

**Who are your competitors? What do you understand about your business that they don't?**

Our closest competitor is Habitica — the most established RPG-style habit tracker, using tasks-as-quests and character leveling. Broader competition includes gamified productivity apps like Finch and Forest, and generic streak/habit trackers that use points or badges without narrative wrapping.

Two things we understand that they don't, backed by what we've observed rather than just believed:

First, Legion — our collaborative system — has no real equivalent we've found in any habit tracker, including Habitica. Habitica's closest analog is "Parties": a shared HP pool against a communal boss. Legion is structurally different — friends form persistent groups, assign individual sub-tasks with per-person deadlines and priority levels, and every sub-task completion routes XP two ways simultaneously: proportionally to the individual's personal leaderboard standing, and cumulatively to the Legion's collective level. Contributing to a group is a competitive advantage earned through real output, not a passive perk for having friends on the app. Failure isn't hidden either — a missed sub-task gets a permanent, self-reported note on the Legion's record, keeping the group's history honest.

Second, we have cohesive lore, not a fantasy skin. Every liberated region has a named Empress with her own chronicle — who she was, how she was imprisoned, what her liberation restored — written by me, a published author, specifically to reframe real execution patterns as narrative strength. We've already seen three users push through small, low-reward tasks simply to reach Region 3, because they wanted to see what lay behind the fog on its icy landscape — they weren't optimizing for XP, they were curious about the world. Some have since started adding their own subtasks to existing operations specifically to spend more time there. Habitica's fantasy framing is generic and interchangeable; ours gives users a reason to complete a task that has nothing to do with the task itself.

Third, we treat immersive craft — art direction and region-specific soundscapes together — as a conversion mechanism, not decoration, and we have a live data point for it. Our one paying user bought a cosmetic theme specifically because she found it calmer than our default dark aesthetic; the art itself was the reason she paid. Our soundscapes work the same way, tied to the region you're actually playing through rather than generic wellness audio, deepening immersion in the world instead of serving a separate calm/sleep function like Habitica's. Habitica's interface is functional but visually flat, with no equivalent mechanism where aesthetic choice drives purchase behavior.

**How do or will you make money? How much could you make?**

We monetize three ways: a tiered ad-free subscription (₹100/month domestically, $3.60 internationally — adjusted for purchasing power parity), one-time cosmetic purchases (scythe skins, regional themes, ₹50-200 / $1.80-7.20), and interstitial ads for free users via AdSense integration that's built but not yet activated.

Our first real signal: one user converted to a ₹200 cosmetic purchase within a 57-user base, with zero monetization push — she bought it for the calming aesthetic against our otherwise dark theme, not because we prompted her to. That conversion trigger — genuine preference, not pressure — is harder to manufacture than to scale once it's real, which is why our pricing and roadmap are built directly around it rather than generic monetization tactics: scythes are priced low (₹50) as an easy first purchase, themes are priced higher (₹200) and designed to visually complement specific scythes rather than our default bundles, and cosmetics are grouped into thematic sets (e.g., four shadow/underworld-rooted items) with a badge for owning the complete set.

Near-term, at modest scale (10k DAU), conservative subscription and cosmetic conversion alone puts monthly revenue in the $15-20k range at 85%+ gross margin — infrastructure costs scale sublinearly with users (Supabase, Vercel, PostHog), so margin improves as we grow.

Several roadmap systems are designed to build directly on what we've already observed. Profile visiting — letting users inspect a friend's equipped scythe, theme, badges, and total artifact collection value — monetizes the artifact-envy behavior we've already seen occur organically, without us designing for it. A rotating Night Market and a seasonal Pass system round out the roadmap. None of these are built yet — we're deliberately sequencing core-loop polish before adding monetization layers, so these represent upside we haven't captured, not numbers baked into our current trajectory.

**If you had any other ideas you considered applying with, please list them.**

Two ideas, beyond Warscythe:

1. **Peekolitix** — an AI-assisted political intelligence platform pulling from government data instead of narrative-driven news. I built this because I kept struggling to cite exact government documents while debating — the noise media creates makes it genuinely hard for a civilian to get to the primary source, so I built the tool I needed myself. I launched it solo (peekolitix.in, 57 users including Supreme Court advocates and journalists) before pausing it to focus full-time on Warscythe. I considered applying with it, but its market is India-specific, while Warscythe has international reach, faster traction, and a more beautiful, higher-retention product — better fit for a first YC application.

2. **An immersive e-commerce platform** connecting Indian artisans directly to national and international buyers — navigated as a walkable, visually rendered Indian street rather than a product grid, with each artisan's page styled after their specific regional craft tradition, and a live India map that highlights regions with matching inventory as you search. I'm from Varanasi, where real Banarasi silk sarees are hand-loomed by artisans in Sarnath and Varanasi — but when I shop in Delhi, I only find cheap imitations sold as the real thing, because the actual weavers have no way to reach a buyer who doesn't already know their name. Business model: no platform fee, a 4-5% cut per sale, first month free before a recurring subscription to keep a page live. I'm still in ideation — around 10 artists are informally interested — and plan to build and launch it around a September hackathon with a 30-day build-and-traction window. I didn't apply with it because it's too early-stage and untested; Warscythe is the one I understand completely, technically and creatively.

---

## Equity

**Have you formed ANY legal entity yet?** No

**Have you taken any investment yet?** No

**Are you currently fundraising?** No

**If you have not formed the company yet, describe the planned equity ownership breakdown among the founders, employees and any other proposed stockholders.**

Planned equity split: 70% Saishreek Singh (Founder, CEO) / 30% Abhay Singh Nagarkoti (Co-Founder, COO). I handle all technical work — product, engineering, infrastructure, design. Abhay handles marketing strategy, growth testing, insight generation from that testing, and security.

---

## Curious

**What convinced you to apply to Y Combinator? Did someone encourage you to apply? Have you been to any YC events?**

I first heard of YC in mid-May 2026. I haven't attended any YC events. What actually led me here was curiosity, not ambition — I mentioned to someone I didn't have a marketing plan, and she asked, half-teasing, if I really thought I'd end up in the US with YC funding me. I didn't even know what YC was at the time. That comment made me look into it, and the more I read — YC's essays, their emphasis on talking to real users — the more it became genuine curiosity about how startups actually get built. Applying became part of that same learning process: understanding user friction firsthand, building structured walkthroughs based on it, and generally learning the fundamentals of building a company as I went.

**How did you hear about Y Combinator?**

Through a comment from someone close to me in May 2026, half-teasing me about not having a marketing plan and asking if I really thought YC would fund a trip to the US for me. I didn't know what YC was at the time, so I looked it up — that's when I started reading their essays and following their content.

---

## Batch Preference

**Which future batch do you want to do?** Winter 2027

**Why apply for a future batch rather than the upcoming one?**

I'm in the middle of college application season — applying to several US schools under early action, with essays and decisions running through December. I'm also competing in state and national athletics and powerlifting championships in the same window. Taking on Fall 2026 would mean splitting focus across college applications, competitive athletics, and a YC batch simultaneously. By Winter 2027, college admissions will be fully resolved and my competitive season will have wrapped, so I'd be joining with complete focus rather than divided attention.
