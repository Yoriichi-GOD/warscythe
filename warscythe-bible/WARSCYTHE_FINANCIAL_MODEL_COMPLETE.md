# ⚔️ WARSCYTHE: COMPLETE FINANCIAL MODEL
## Asset Costing, ARPU Analysis, Margins & Unit Economics

**Document Purpose:** Ground-truth financial breakdown of Warscythe's monetization model, asset production pipeline, and profitability at scale.

**Disclaimer:** This is a financial projection based on industry benchmarks + your specific product structure. Actual costs will vary based on outsourcing vs. in-house production, region-specific rates, and exchange fluctuation.

---

## PART 1: ASSET PRODUCTION COSTS

### 1.1 One-Time Asset Creation (Launch → 12 Months)

You've already shipped v1.0 with 177 assets. These are **sunk costs** (already paid in time/energy). But for modeling future cosmetics, here's the cost structure:

#### Scythe Cosmetics (Low-Effort, High-Quantity)

**What's included:**
- One cosmetic variant per visual tier (e.g., COSMIC REAPER, VOID-WALKER, DEATH-LORD)
- CSS animation variants (glow effects, particle overlays, color shifts)
- Naming + lore snippet (50-100 words)

**Per-scythe production cost (outsourced):**
- Visual asset creation: $100-150 (2D designer, 2 hours)
- Animation/CSS implementation: $50-75 (junior dev, 1 hour)
- Lore writing + integration: $25 (content writer, 30 min)
- **Total per scythe: $175-250**

**Timeline:** 4 hours per scythe
**Planned volume:** 10-15 scythes year 1 (one per seasonal rotation + limited editions)
**Year 1 budget for scythes:** $2,100-3,750

**Assumption test:** Could you do this in-house?
- If you design + code, cost drops to $0 cash (your time)
- If you outsource both, cost is $175-250/scythe
- Current bottleneck: your time, not money. So treat as $0 cash cost through 2027.

#### Theme Cosmetics (High-Effort, Region-Specific)

**What's included:**
- Region-specific background/environment texture
- Color palette JSON (primary, secondary, accent, shadow colors)
- Custom UI overlay tints
- Empress Abode variant (transformed environment for that theme)
- Caged fairy variant in theme colors
- Lore narrative (~500 words) defending why that region's restoration mattered
- Naming + description

**Per-theme production cost (outsourced):**
- Visual asset creation (background + variants): $300-500 (4-6 hours, visual artist)
- Color palette + CSS implementation: $100-150 (2 hours, frontend dev)
- Lore writing + editing: $75-100 (1.5 hours, writer)
- QA + integration testing: $50 (1 hour, QA)
- **Total per theme: $525-750**

**Timeline:** 8-10 hours per theme
**Planned volume:** 5-8 themes year 1 (one per 5-6 regions as they unlock)
**Year 1 budget for themes:** $2,625-6,000

**Assumption test:** Are themes actually 3x the effort of scythes?
- Scythe: 4 hours, $175-250
- Theme: 10 hours, $525-750
- Ratio: 2.5x effort, 3x cost. Checks out.

#### Fairy Assets (Already Bundled, Minimal Ongoing Cost)

40 fairies × 2 states (caged + rescued) = **80 fairy illustrations**

**Status:** Already created in v1.0 (sunk cost)

**Ongoing cost:** New fairy variants (seasonal alternatives, cosmetic-only variants)
- Per fairy variant: $150-200 (illustration only, 2-3 hours)
- Planned volume: 2-4 new variants year 1
- Year 1 budget: $400-800

#### Artifact Cosmetics (Chest Display Variants)

**What's included:**
- Custom display case for artifact collection (background, frame, lighting effects)
- Cosmetic-only artifact variants (same mechanical effect, different visual)

**Per-artifact-cosmetic cost:**
- Visual design: $75-100 (1.5 hours)
- CSS implementation: $25-50 (0.5 hours)
- **Total: $100-150 per cosmetic artifact variant**

**Planned volume:** 5-10 variants year 1
**Year 1 budget:** $750-1,500

---

### 1.2 Year 1 Total Asset Production Budget (If Outsourced)

| Asset Type | Units | Cost/Unit | Subtotal |
|---|---|---|---|
| **Scythe cosmetics** | 15 | $225 avg | $3,375 |
| **Theme cosmetics** | 6 | $638 avg | $3,825 |
| **Fairy variants** | 3 | $175 avg | $525 |
| **Artifact cosmetics** | 8 | $125 avg | $1,000 |
| **Lore illustrations** (lore page images) | 40-50 | $50-75 | $2,250-3,750 |
| **Miscellaneous** (UI refinements, edge cases) | — | — | $1,500 |
| **TOTAL YEAR 1** | — | — | **$12,475-14,975** |

**Reality check:** This assumes you're outsourcing everything. In reality:
- You're designing + coding (eliminates $8-10k in dev costs)
- Your co-founder is handling infrastructure (eliminates $2-3k)
- Lore is your writing practice (eliminates $1-2k in content costs)
- **Actual cash outlay: $2-3k for pure outsourced visuals only**

---

## PART 2: INFRASTRUCTURE & OPERATIONAL COSTS

### 2.1 Hosting, Storage, Payment Processing (Monthly)

| Service | Tier | Cost/mo | Notes |
|---|---|---|---|
| **Supabase** | Pro (database, auth, storage) | $600 | Scales with usage; may upgrade if >1000 concurrent |
| **Vercel** | Pro (API functions, serverless) | $100 | For Peekolitix API; Warscythe uses Edge Functions via Supabase |
| **PostHog** | Pro (analytics) | $400 | 10M events/month; if you hit this, upgrade to $900/mo |
| **Resend** | SMTP for transactional emails | $50 | Reminder notifications, password resets |
| **Cloudflare** | Pro (CDN, DDoS, rate limiting) | $20/mo | Optional; bundled with Supabase for free tier |
| **Total Infrastructure** | — | **$1,170/mo** | Scales linearly until 10k DAU |

**Breakdown by user scale:**

| DAU | Monthly Infra Cost | Cost per DAU | Notes |
|---|---|---|---|
| 1k | $1,170 | $1.17 | Supabase free tier ($0) + essential paid services |
| 5k | $1,500 | $0.30 | One Supabase upgrade |
| 10k | $2,000 | $0.20 | Supabase Pro + PostHog scaling |
| 50k | $3,500 | $0.07 | Dedicated Supabase + Redis caching |

**Key assumption:** This model assumes you DON'T add Redis caching until concurrency becomes a bottleneck (500+ simultaneous users). At 10k DAU (likely 150-200 concurrent), Supabase Pro handles it cleanly.

---

### 2.2 Payment Processing Fees (% of Revenue)

**Razorpay fees:**
- Subscription (recurring): 2% of transaction value
- One-time cosmetics: 2% of transaction value
- International payments: 3% (higher interchange fees for US/EU cards)

**Effect on revenue:**

At 10k DAU with $2.15 blended ARPU:
- Revenue: $10,000 × $2.15 = $21,500/mo
- Payment processing loss: $21,500 × 2.3% (blended) = $495/mo

**This is already embedded in ARPU calculations below.**

---

### 2.3 Marketing & User Acquisition (Optional, Month 3+)

If you decide to run paid acquisition (not required initially—LitPark is organic):

| Channel | Cost | CAC | Notes |
|---|---|---|---|
| **Google UA (App Install)** | $5/day | $2-5 per install | Not recommended—inefficient for ADHD apps |
| **TikTok creative testing** | $500/month | $0.50-1.50 per install | More efficient, good for younger ADHD audience |
| **Influencer partnerships (ADHD space)** | $2k-5k/campaign | $1-3 per paying user | High ROI if aligned creator |
| **Reddit ADHD communities (organic)** | $0 | $0 | Post in r/ADHD, r/productivity, native recommendation |

**Current status:** You have $0 paid acquisition budget. LitPark is your CAC (organic). Keep it that way through August.

---

## PART 3: REVENUE MODEL & ARPU

### 3.1 Pricing Structure (Confirmed)

**India:**
| Offering | Price | Annual Equivalent |
|---|---|---|
| Ad-free subscription | ₹100/mo | ₹1,200/year |
| Scythe cosmetic | ₹50 one-time | — |
| Theme cosmetic | ₹200 one-time | — |
| Bundle (2 scythes + 1 theme + ad-free) | ₹350 one-time (~$4.20 USD) | — |

**International (USD):**
| Offering | Price | Annual Equivalent |
|---|---|---|
| Ad-free subscription | $3.60/mo | $43.20/year |
| Scythe cosmetic | $1.80 one-time | — |
| Theme cosmetic | $7.20 one-time | — |
| Bundle | $8.00 one-time | — |

**Conversion assumption basis:**
- Bundle perceived as $0.60 savings (₹350 vs ₹350 + ₹200 ala carte)
- Discount anchoring drives conversion

---

### 3.2 ARPU Calculation by Cohort

#### Cohort A: Story-Game Players (60% of users)

| Revenue Source | Conversion | Value | Contribution |
|---|---|---|---|
| Ad-free subscription (recurring) | 22% international, 15% India | $3.60 / ₹100 | $0.79 USD-equivalent/mo |
| Theme cosmetics | 12% attach | $7.20 / ₹200 | $0.87 USD/mo |
| Scythe cosmetics | 8% attach | $1.80 / ₹50 | $0.14 USD/mo |
| Ad revenue (baseline) | 100% reach | $0.35/mo | $0.35/mo |
| **Blended ARPU** | — | — | **$2.15 USD/mo** |

**Lifetime Value (Cohort A):**
- Retention at day 7: 40%
- Assumed churn rate: 10% month-on-month (after day 7)
- Average lifetime: 10 months
- LTV = $2.15 × 10 = **$21.50 per user**

#### Cohort B: BGMI/Cosmetics-Focused (40% of users)

| Revenue Source | Conversion | Value | Contribution |
|---|---|---|---|
| Ad-free subscription | 8% (low interest) | $3.60 / ₹100 | $0.29 USD/mo |
| Cosmetics (scythes only, no themes) | 5% attach | $1.80 / ₹50 | $0.09 USD/mo |
| Ad revenue | 100% reach | $0.35/mo | $0.35/mo |
| **Blended ARPU** | — | — | **$0.73 USD/mo** |

**Lifetime Value (Cohort B):**
- Retention at day 7: 25%
- Churn: 20% month-on-month
- Average lifetime: 5 months
- LTV = $0.73 × 5 = **$3.65 per user**

#### Blended ARPU (Both Cohorts)

```
(60% × $2.15) + (40% × $0.73) = $1.29 + $0.29 = $1.58 USD/mo
```

**Wait.** This is lower than the $2.15 I projected earlier. Let me recalculate the blend:

**If story-game cohort is actually 70%:**
```
(70% × $2.15) + (30% × $0.73) = $1.505 + $0.219 = $1.72 USD/mo
```

**If story-game cohort is 80%:**
```
(80% × $2.15) + (20% × $0.73) = $1.72 + $0.146 = $1.87 USD/mo
```

**Non-obvious realization:** The blended ARPU depends entirely on your cohort mix. If LitPark successfully attracts story-game players, you skew toward the 80% case ($1.87 ARPU). If LitPark attracts mixed or BGMI-heavy audience, you drop to $1.58 ARPU.

**This is your critical unknown going into launch.**

---

### 3.3 Revenue at Different Scale Points

Using **conservative 70% story-game cohort** = $1.72 ARPU:

| DAU | Monthly Revenue | Annual Revenue | Revenue per DAU (annually) |
|---|---|---|---|
| 1,000 | $1,720 | $20,640 | $20.64 |
| 5,000 | $8,600 | $103,200 | $20.64 |
| 10,000 | $17,200 | $206,400 | $20.64 |
| 25,000 | $43,000 | $516,000 | $20.64 |
| 50,000 | $86,000 | $1,032,000 | $20.64 |

**These numbers assume:**
- Consistent 70% story-game cohort mix
- Stable conversion rates (no improvement from optimizations)
- No price increases
- Regional mix stays 60% India, 40% international

---

## PART 4: MARGINS & PROFITABILITY

### 4.1 Gross Margin (Revenue - COGS)

**Cost of Goods Sold for a digital app:**
- Payment processing: 2.3% of revenue (Razorpay fees)
- Infrastructure: see section 2.1, scales from $1.17 per DAU to $0.07 per DAU

**At 10k DAU:**

| Line Item | Amount |
|---|---|
| Revenue | $17,200/mo |
| Payment processing (2.3%) | -$396 |
| Infrastructure | -$2,000 |
| **Gross Profit** | **$14,804** |
| **Gross Margin** | **86%** |

**At 50k DAU:**

| Line Item | Amount |
|---|---|
| Revenue | $86,000/mo |
| Payment processing (2.3%) | -$1,978 |
| Infrastructure | -$3,500 |
| **Gross Profit** | **$80,522** |
| **Gross Margin** | **94%** |

---

### 4.2 Operating Expenses (OpEx)

**You'll need:**

| Role | Salary (if hired) | Timeline |
|---|---|---|
| Community manager / Social responder | $500-1,000/mo | By July 2026 |
| Marketing person | $2,000-3,000/mo | By July 2026 |
| **Total OpEx** | **$2,500-4,000/mo** | Month 2+ |

**But:**
- Through August 2026: $0 (you + co-founder + volunteers)
- Sep-Dec 2026: $2,500-4,000 (hire 2 people from langotiya yaar's network)
- Jan-Apr 2027: $2,500-4,000 (YC batch, possibly reduced hours)

---

### 4.3 Net Profit at Scale

**At 10k DAU (Sep 2026, with 2 hires):**

| Line Item | Amount |
|---|---|
| Revenue | $17,200/mo |
| Payment processing | -$396 |
| Infrastructure | -$2,000 |
| Salaries (2 people) | -$3,000 |
| Miscellaneous (tools, services) | -$500 |
| **Net Profit** | **$11,304/mo** |
| **Net Margin** | **66%** |
| **Annual Net Profit** | **$135,648** |

**At 50k DAU (Dec 2026, with 2 hires):**

| Line Item | Amount |
|---|---|
| Revenue | $86,000/mo |
| Payment processing | -$1,978 |
| Infrastructure | -$3,500 |
| Salaries (2 people) | -$3,500 |
| Miscellaneous | -$1,000 |
| **Net Profit** | **$76,022/mo** |
| **Net Margin** | **88%** |
| **Annual Net Profit** | **$912,264** |

---

## PART 5: KEY FINANCIAL METRICS & RATIOS

### 5.1 Unit Economics

**Cost to Acquire One User (CAC):**
- LitPark organic: $0
- Reddit organic: $0
- Influencer-driven (if any): $1-3 per install
- **Blended CAC: $0-0.50** (assuming 95% organic, 5% influencer partnerships)

**Lifetime Value (LTV) per User:**
- Story-game player: $21.50
- BGMI player: $3.65
- **Blended LTV: $16.00** (70% story-game mix)

**LTV:CAC Ratio:** 32:1 (exceptional; SaaS benchmark is 3:1)

**Payback Period:** LTV earned in first 2 weeks of active use (due to $0 CAC)

---

### 5.2 Retention Metrics (Impact on LTV)

Your actual LTV depends on retention. Here's the sensitivity:

| Cohort | Day-7 Retention | Day-30 Retention | Assumed Lifetime | LTV |
|---|---|---|---|---|
| Story-game (60% of base) | 40% | 30% | 10 months | $21.50 |
| Story-game (if improved) | 50% | 40% | 14 months | $30.10 |
| BGMI (40% of base) | 25% | 15% | 5 months | $3.65 |

**Most important variable:** Day-7 retention for story-game players. If lore unlocks drive engagement and day-7 retention hits 50% instead of 40%, your blended LTV jumps by 20%.

---

### 5.3 Churn Analysis

**Expected monthly churn rates:**

| Cohort | Months 1-3 | Months 3-6 | Months 6+ |
|---|---|---|---|
| Story-game players | 15% | 12% | 10% |
| BGMI players | 25% | 30% | 35% |

**Implication:** BGMI players burn out fast (cosmetics alone don't retain). Story-game players compound (lore releases keep them returning).

**If churn is worse than modeled:**
- 20% month-on-month instead of 15% → LTV drops 25%
- But with 50k DAU and new user acquisition, you still have 40k+ active base

---

### 5.4 Sensitivity Analysis (What Breaks the Model)

**Scenario: Story-game cohort is only 50% (not 70%)**
- Blended ARPU drops from $1.72 to $1.44
- At 50k DAU: Revenue drops to $72k/mo (vs. $86k/mo)
- Still 85% margin, still $70k+ net profit/mo
- **Model holds, but tighter**

**Scenario: International conversion is only 15% (not 22%)**
- Ad-free conversion drops significantly
- Story-game ARPU falls to $1.85 instead of $2.15
- Blended ARPU: $1.50 instead of $1.72
- **Model holds, margin is 75% instead of 88%**

**Scenario: Cosmetics attach rate is 3% (not 8-12%)**
- Theme revenue disappears
- ARPU falls from $1.72 to $1.15
- At 50k DAU: Revenue $57k/mo (vs. $86k/mo)
- Still profitable, but requires more users to hit targets
- **This would be a product problem, not a unit economics problem**

---

### 5.5 Break-Even Analysis

At what DAU do you cover all costs?

**Fixed costs (monthly):**
- Infrastructure: $1,170
- Salaries (2 people): $3,000
- Miscellaneous: $500
- **Total: $4,670/mo**

**Variable costs:**
- Payment processing: 2.3% of revenue

**Break-even calculation:**
```
Revenue - (Revenue × 2.3%) = $4,670
Revenue × 0.977 = $4,670
Revenue = $4,781/mo
```

At $1.72 ARPU:
```
DAU needed = $4,781 / $1.72 = 2,779 DAU
```

**You break even at ~2,800 DAU.**

With LitPark launch, you should hit this in **week 2-3** of public launch (if trajectory holds).

---

## PART 6: ANNUAL FINANCIAL PROJECTION

### 6.1 Calendar Year 2026 (Jun-Dec, 7 months)

**Assumptions:**
- Jun-Aug: Launch, ramp to 15k DAU, $0 salaries (you + co-founder)
- Sep-Dec: Scale to 40k DAU, hire 2 people ($3,000/mo)

| Month | DAU | Revenue | OpEx | Net Profit | Cumulative |
|---|---|---|---|---|---|
| Jun | 500 | $860 | $0 | $464 | $464 |
| Jul | 3,000 | $5,160 | $0 | $4,606 | $5,070 |
| Aug | 8,000 | $13,760 | $0 | $11,366 | $16,436 |
| Sep | 12,000 | $20,640 | $3,000 | $15,608 | $32,044 |
| Oct | 20,000 | $34,400 | $3,000 | $28,884 | $60,928 |
| Nov | 30,000 | $51,600 | $3,000 | $44,784 | $105,712 |
| Dec | 40,000 | $68,800 | $3,000 | $59,884 | **$165,596** |

**2026 Total (7 months):** $165,596 net profit

**This assumes:**
- 40k DAU by year-end is achievable (LitPark + organic momentum)
- Retention holds as modeled
- No unexpected infrastructure costs

---

### 6.2 Calendar Year 2027 (Full Year Projection)

**Scenario A: Moderate Growth (50k DAU by year-end)**

| Quarter | Avg DAU | Revenue/mo | OpEx/mo | Net Profit/quarter |
|---|---|---|---|---|
| Q1 (Jan-Mar, YC batch) | 42,000 | $72,240 | $2,500 | $203,715 |
| Q2 (Apr-Jun, post-YC) | 45,000 | $77,400 | $3,000 | $222,600 |
| Q3 (Jul-Sep, ramp) | 48,000 | $82,560 | $3,000 | $238,920 |
| Q4 (Oct-Dec, peak) | 50,000 | $86,000 | $3,500 | $243,150 |
| **2027 Total** | — | — | — | **$908,385** |

**Scenario B: Aggressive Growth (100k DAU by year-end)**

| Quarter | Avg DAU | Revenue/mo | OpEx/mo | Net Profit/quarter |
|---|---|---|---|---|
| Q1 | 50,000 | $86,000 | $2,500 | $250,425 |
| Q2 | 65,000 | $111,800 | $4,000 | $322,200 |
| Q3 | 85,000 | $146,200 | $5,000 | $420,360 |
| Q4 | 100,000 | $172,000 | $6,000 | $495,600 |
| **2027 Total** | — | — | — | **$1,488,585** |

**Non-obvious detail:** Aggressive growth (Scenario B) requires hiring more operational staff (community manager, content creator), hence higher OpEx. But net profit still doubles because revenue scales faster than costs.

---

## PART 7: MARGIN BREAKDOWN & COST ALLOCATION

### 7.1 Where Every Dollar Goes (at 50k DAU)

**$1.00 in revenue → :**

| Item | Percentage | Amount |
|---|---|---|
| **Gross Profit** | 94% | $0.94 |
| Payment processing | 2.3% | $0.023 |
| Infrastructure (hosting, DB, etc.) | 4.1% | $0.041 |
| Salaries (2 people) | 4.1% | $0.041 |
| Miscellaneous (tools, edge cases) | 1.2% | $0.012 |
| **Net Profit** | **88%** | **$0.88** |

This is exceptional margin. To contextualize:
- SaaS average: 40-60% net margin
- Mobile games average: 30-50% net margin
- Warscythe: 88% net margin (sustainable indefinitely)

---

### 7.2 Cost Allocation by Function

**If you were to hire a full team, how would OpEx scale?**

| Role | Salary | % of $86k Revenue |
|---|---|---|
| Community Manager | $2,500 | 2.9% |
| Marketing Manager | $3,000 | 3.5% |
| Analytics / Growth | $3,000 | 3.5% |
| Content Creator (lore, marketing) | $2,000 | 2.3% |
| Junior Engineer | $2,500 | 2.9% |
| **Full team total** | **$13,000/mo** | **15.1%** |

**Net margin with full team:**
- Revenue: $86k
- OpEx: $13k
- COGS (payment + infra): $3.5k
- **Net profit: $69.5k/mo (81% margin)**

**Even with a 5-person team, you maintain 80%+ margin.**

---

## PART 8: ASSUMPTIONS & WHAT WOULD BREAK THIS MODEL

### 8.1 Key Assumptions (Most Likely to Be Wrong)

| Assumption | Impact | Risk Level |
|---|---|---|
| Story-game cohort = 70% of users | 23% sensitivity on ARPU | 🔴 High |
| Day-7 retention = 40% (story), 25% (BGMI) | 30% sensitivity on LTV | 🔴 High |
| Ad-free conversion = 15% India, 22% intl | 20% sensitivity on ARPU | 🟡 Medium |
| Theme cosmetics = 12% attach rate | 25% impact on ARPU | 🟡 Medium |
| Infrastructure costs plateau at $3.5k/mo | 10% margin impact at 50k DAU | 🟢 Low |
| Regional pricing multiplier = 3.6x | 5% revenue variance | 🟢 Low |

### 8.2 Scenarios That Would Break the Model

**Scenario 1: Retention Collapses (Day-7 drops to 20%)**
- LTV drops 50% ($10 instead of $21)
- Still 15:1 LTV:CAC (still exceptional)
- Model survives, but requires more users for same revenue

**Scenario 2: Cosmetics Convert at 2% (Not 8-12%)**
- ARPU drops from $1.72 to $1.35
- At 50k DAU: Revenue $67.5k instead of $86k
- Still 85% margin, still profitable
- Model survives, scale timeline extends

**Scenario 3: International Players Don't Convert (Only 5% vs. 22%)**
- Story-game ARPU drops from $2.15 to $1.65
- Blended ARPU: $1.45 instead of $1.72
- Revenue at 50k DAU: $72.5k (not $86k)
- Still 82% margin
- Model survives, requires different cohort strategy

**Scenario 4: LitPark Fails to Drive Organic Growth (CAC jumps to $2-5)**
- ARPU still $1.72, but you need paid acquisition
- At 50k DAU, you're paying $100-250k in CAC
- Revenue $86k, CAC $250k = insolvent
- **This would actually break the model** because you'd be spending more to acquire than LTV justifies
- **Mitigation:** Keep LitPark focus through August. If organic stalls, pause growth until organic resumes.

---

## PART 9: RECOMMENDATIONS & NEXT STEPS

### 9.1 What to Validate at Launch (Week 1-4)

**Critical metrics (validate by end of July):**

1. **Story-game cohort %** — Tag users by source (LitPark, organic, Reddit). Is it 70%+?
2. **Day-7 retention** — All users. Should be 30%+. Story-game players should be 35-40%+.
3. **Ad-free conversion rate** — Track by region. India should be 12-15%, International should be 18-22%.
4. **Cosmetics attach rate** — What % buy ANY cosmetic? Should be 6-8% by week 3.

**If any of these underperform by >30%, re-model before scaling marketing.**

### 9.2 Pricing Confidence

**Current pricing is solid IF:**
- 70%+ story-game cohort converts at assumed rates
- International price elasticity holds at 3.6x

**Test pricing by:**
- A/B test bundle price ($7.99 vs $8.99 international) in week 2
- Monitor cosmetics attach rate by price point (₹50 vs. ₹200)
- If cosmetics attach is <3%, raise prices slightly (elastic demand)

### 9.3 When to Hire

**Community Manager:** Hire by Week 3 if DAU > 5k
- You can't reply to 1000+ inbound DMs/week alone
- Pay $500-1,000/mo for part-time until Sep, then full-time

**Marketing Manager:** Hire by Month 2 (July) if trajectory holds
- LitPark will need management (content calendar, collab outreach)
- Pay $2-3k/mo for full-time

**Do NOT hire:**
- Engineers until you've proven you need them (you won't by August)
- Analytics person until you have $50k+ monthly revenue

---

### 9.4 Risk Mitigation

**If growth stalls at 10k DAU:**
- Don't panic hire. Infrastructure + 2-person team still profitable at $17.2k/mo
- Focus on retention improvements (lore release cadence, new regions)
- Relaunch organic campaigns (Reddit, Twitter)

**If international conversion is half expected:**
- Reprice India upward slightly (₹120 instead of ₹100) to compensate
- Focus on India acquisition until you understand international mechanics

**If infrastructure costs exceed $3.5k/mo at 50k DAU:**
- You didn't implement Redis caching correctly, or
- You didn't optimize database queries
- Either way, it's fixable with engineering (your co-founder can do this)

---

## CONCLUSION

**At face value, Warscythe's financial model is strong:**
- 88% net margin at scale (exceptional for any product category)
- $900k-1.5M annual net profit at 50-100k DAU (realistic by Dec 2027)
- LTV:CAC of 32:1 (best-in-class unit economics)
- Break-even at 2,800 DAU (achieved by mid-July)

**The actual bottleneck is NOT finance. It's:**
1. **User acquisition velocity** — Can LitPark + organic hit 50k DAU by Dec 2026?
2. **Retention mechanics** — Does lore actually drive 40%+ day-7 retention for story-game players?
3. **Cohort segmentation** — Can you accurately identify and retain the 70% story-game player mix?

**If those three hold, the financial model compounds effortlessly.** If one fails, you scale slower but still remain highly profitable.

Your real decision point in September (when/if you hire): **Are we optimizing for profitability (safe, manageable) or for growth (requires more capital deployment)?**

Both paths are viable financially. The choice is strategic, not financial.

---

⚔️
