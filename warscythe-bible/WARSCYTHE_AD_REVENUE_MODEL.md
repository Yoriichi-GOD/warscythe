# ⚔️ WARSCYTHE: AD REVENUE MODEL & AD-FREE CANNIBALIZATION

**Focus:** AdMob revenue at different DAU levels, ad-free subscription impact, per-session impression frequency

---

## PART 1: ADMOB REVENUE FUNDAMENTALS

### 1.1 Key Metrics Explained

**CPM (Cost Per Mille):** Revenue per 1,000 ad impressions shown
- India average: $0.50-1.50
- International (US/UK/EU) average: $2.00-6.00
- Warscythe best case (engagement + quality): $0.80-2.00 (India), $4.00-8.00 (Intl)

**RPM (Revenue Per Mille):** Revenue per 1,000 users (what YOU actually get after platform takes cut)
- AdMob takes ~32% of CPM
- You receive ~68% as RPM
- India RPM: $0.34-1.02 per 1,000 users per day
- International RPM: $1.36-5.44 per 1,000 users per day

**Impression frequency:** How many ads does a user see per session?
- Warscythe placement: Transition screens only (not execution moments)
- At 10 mins/session, typical engagement apps show 2-4 interstitials
- Conservative: 2 ads per session
- Aggressive: 4 ads per session

---

### 1.2 Session-Based Ad Math (10-Minute Session)

**Scenario: User spends 10 mins on Warscythe per day**

| Action | Frequency/Session | Ad Trigger |
|---|---|---|
| Click "+ Initiate Objective" | 1-2x | Interstitial #1 |
| Click "EXECUTE" completion | 1-2x | Interstitial #2 |
| Switch to Ledger tab | 0-1x | Interstitial #3 (optional) |
| Switch between tabs | 0-2x | Interstitial #4 (optional, mobile only) |

**Conservative scenario (2-3 ads per 10-min session):**
- User sees 2-3 full-screen ads daily
- Over 30 days: 60-90 impressions per user per month

**Aggressive scenario (4 ads per 10-min session):**
- User sees 4 ads daily
- Over 30 days: 120 impressions per user per month

**Using conservative estimate (60-90 impressions/user/month):**

---

## PART 2: ADMOB REVENUE BY DAU & GEOGRAPHY

### 2.1 India Market (AdMob Revenue Only, No Ad-Free)

**Assumptions:**
- CPM (India): $0.75 (middle of $0.50-1.50 range)
- Your RPM (68% of CPM): $0.51 per 1,000 impressions
- Impression frequency: 2.5 ads per 10-min session = 75 impressions/user/month
- Ad-free conversion: 0% (for this scenario—only ad revenue)

**At different DAU levels (India):**

| DAU | Monthly Impressions | RPM Revenue | Daily Revenue |
|---|---|---|---|
| **1,000** | 75,000 | $38.25 | $1.28 |
| **5,000** | 375,000 | $191.25 | $6.38 |
| **10,000** | 750,000 | $382.50 | $12.75 |
| **20,000** | 1,500,000 | $765 | $25.50 |
| **50,000** | 3,750,000 | $1,912.50 | $63.75 |
| **100,000** | 7,500,000 | $3,825 | $127.50 |

**Key insight:** At 50k DAU (India only), ad revenue is **$1,912.50/month** (~$23k/year). This is baseline, not primary revenue.

---

### 2.2 International Market (AdMob Revenue Only, No Ad-Free)

**Assumptions:**
- CPM (US/UK/EU): $4.50 (middle of $2-8 range, adjusted down because Warscythe is niche)
- Your RPM (68% of CPM): $3.06 per 1,000 impressions
- Impression frequency: Same 2.5 ads per 10-min session = 75 impressions/user/month
- Ad-free conversion: 0% (for this scenario)

**At different DAU levels (International):**

| DAU | Monthly Impressions | RPM Revenue | Daily Revenue |
|---|---|---|---|
| **1,000** | 75,000 | $229.50 | $7.65 |
| **5,000** | 375,000 | $1,147.50 | $38.25 |
| **10,000** | 750,000 | $2,295 | $76.50 |
| **20,000** | 1,500,000 | $4,590 | $153 |
| **30,000** | 2,250,000 | $6,885 | $229.50 |
| **50,000** | 3,750,000 | $11,475 | $382.50 |
| **100,000** | 7,500,000 | $22,950 | $765 |

**Key insight:** At 50k DAU (International only), ad revenue is **$11,475/month** (~$137k/year). This is material but still secondary to subscription + cosmetics.

---

### 2.3 Blended (India 40% + International 60%, Ad Revenue Only)

**At 50k DAU (20k India + 30k International):**

| Revenue Source | India | International | Total |
|---|---|---|---|
| **Ad revenue** | $1,912.50 | $11,475 | **$13,387.50/mo** |
| **% of total** | 14.3% | 85.7% | — |

**Annual ad revenue from 50k DAU: ~$160k**

---

## PART 3: AD-FREE SUBSCRIPTION IMPACT

### 3.1 The Cannibalization Problem

When users buy ad-free, they stop seeing ads. This trades:

**What you lose:** Ad impressions + ad revenue
**What you gain:** Subscription revenue

**Example: One user switches to ad-free**

| Metric | Ad-Supported | Ad-Free | Difference |
|---|---|---|---|
| **Monthly cost to you** | $0 | $0 | $0 |
| **Ad impressions/month** | 75 | 0 | -75 |
| **Ad revenue/month** | $0.51 (India) or $3.06 (Intl) | $0 | -$0.51 to -$3.06 |
| **Subscription revenue/month** | $0 | ₹100 ($1.20) or $3.60 | +₹100 or +$3.60 |
| **Net revenue change** | — | — | **+$0.69 to +$2.54** |

**Verdict:** Ad-free subscription more than compensates for lost ad revenue in both markets. The trade-off favors ad-free.

---

### 3.2 Blended Revenue Model (Ad Revenue + Ad-Free Mix)

**Scenario: 50k DAU with 20% ad-free conversion**

**India (20k DAU, 20% ad-free):**
- Ad-supported users: 16,000 × $0.51 RPM × (75 impressions/30 days) = $408/mo
- Ad-free users: 4,000 × $1.20/mo = $4,800/mo
- **Total: $5,208/mo**

Wait, that's wrong. Let me recalculate correctly.

**Correct calculation (India 20k DAU, 20% ad-free):**

| User Type | Count | Monthly Revenue/User | Total Monthly |
|---|---|---|---|
| **Ad-supported** | 16,000 | $0.0765 (75 impressions × $0.51 RPM ÷ 1000) | $1,224 |
| **Ad-free** | 4,000 | $1.20 (subscription) | $4,800 |
| **Total India** | 20,000 | — | **$6,024/mo** |

**International (30k DAU, 25% ad-free):**

| User Type | Count | Monthly Revenue/User | Total Monthly |
|---|---|---|---|
| **Ad-supported** | 22,500 | $0.4590 (75 impressions × $3.06 RPM ÷ 1000) | $10,327.50 |
| **Ad-free** | 7,500 | $3.60 (subscription) | $27,000 |
| **Total International** | 30,000 | — | **$37,327.50/mo** |

**Blended 50k DAU with mixed ad-free:**
- India: $6,024/mo
- International: $37,327.50/mo
- **Total: $43,351.50/mo from subscription + ad revenue alone**

---

## PART 4: FULL MONETIZATION (Subscription + Ads + Cosmetics)

### 4.1 Complete Revenue Model at 50k DAU

**Recall from earlier analysis:**
- Ad-free subscription: Drives recurring revenue
- Cosmetics (themes + scythes): Drives impulse + attachment revenue
- Ad revenue: Baseline from non-paying users

**Full breakdown at 50k DAU (20k India + 30k International):**

#### India Cohort (20k DAU):

| Revenue Stream | Conversion | ARPU | Monthly Revenue |
|---|---|---|---|
| **Ad-free subscription** (₹100/mo) | 15% (3k users) | $0.36 | $3,600 |
| **Scythe cosmetics** (₹50) | 6% attach | $0.06 | $1,200 |
| **Theme cosmetics** (₹200) | 5% attach | $0.10 | $2,000 |
| **Ad revenue (80% non-paying)** | 80% (16k users) | $0.061 | $976 |
| **India Total** | — | **$0.60/user** | **$7,776/mo** |

#### International Cohort (30k DAU):

| Revenue Stream | Conversion | ARPU | Monthly Revenue |
|---|---|---|---|
| **Ad-free subscription** ($3.60/mo) | 22% (6.6k users) | $0.79 | $23,760 |
| **Scythe cosmetics** ($1.80) | 8% attach | $0.14 | $4,200 |
| **Theme cosmetics** ($7.20) | 12% attach | $0.86 | $25,800 |
| **Ad revenue (78% non-paying)** | 78% (23.4k users) | $0.15 | $3,510 |
| **International Total** | — | **$1.94/user** | **$57,270/mo** |

#### Blended 50k DAU:

| Revenue Stream | India | International | Total Monthly | Annual |
|---|---|---|---|---|
| **Ad-free subscription** | $3,600 | $23,760 | **$27,360** | $328.3k |
| **Cosmetics (scythes + themes)** | $3,200 | $30,000 | **$33,200** | $398.4k |
| **Ad revenue** | $976 | $3,510 | **$4,486** | $53.8k |
| **TOTAL** | $7,776 | $57,270 | **$65,046/mo** | **$780.5k/year** |

---

### 4.2 Revenue Contribution Breakdown (% of Total)

At 50k DAU with this mix:

| Revenue Source | Amount | % of Total |
|---|---|---|
| **Ad-free subscription** | $27,360 | 42% |
| **Cosmetics** | $33,200 | 51% |
| **Ad revenue** | $4,486 | 7% |
| **TOTAL** | $65,046 | 100% |

**Key insight:** Ad revenue is only 7% of total. The 80% non-paying users generate just $4.5k/mo. Ad-free subscription (42%) and cosmetics (51%) are your actual revenue drivers.

---

## PART 5: SENSITIVITY ANALYSIS - CPM VARIATIONS

### 5.1 What If CPM Is Lower Than Estimated?

**Scenario: India CPM drops to $0.40 (recession, lower advertiser demand)**

| DAU | Previous Ad Revenue | New Ad Revenue | % Difference |
|---|---|---|---|
| **10k** | $191 | $102 | -47% |
| **50k** | $4,486 | $2,393 | -47% |
| **100k** | $8,972 | $4,786 | -47% |

**Impact on 50k DAU total revenue:** $65,046 - $2,093 = $62,953 (4% reduction)

**Verdict:** Ad revenue fluctuations don't materially impact total revenue. A 50% CPM drop reduces overall revenue by only 3-4%.

---

### 5.2 What If Impression Frequency Is Higher?

**Scenario: Users see 4 ads per 10-min session (instead of 2.5)**

This increases impressions from 75/month to 120/month.

| Cohort | Previous Ad Revenue | New Ad Revenue | Increase |
|---|---|---|---|
| **India 20k DAU** | $976 | $1,562 | +$586 |
| **International 30k DAU** | $3,510 | $5,616 | +$2,106 |
| **Total 50k DAU** | $4,486 | $7,178 | +$2,692 |

**New total revenue at 50k DAU:** $65,046 + $2,692 = **$67,738/mo** (4% increase)

**Trade-off:** More ads = higher ad revenue, but might reduce user engagement / cosmetics conversion. Not worth optimizing heavily for ad frequency.

---

### 5.3 What If Ad-Free Conversion Is Lower?

**Scenario: 12% India ad-free (instead of 15%), 18% International (instead of 22%)**

| Cohort | Users at lower conversion | Ad revenue from additional ad-supported users | Subscription revenue loss |
|---|---|---|---|
| **India** | +800 more ad-supported | +$488 | -$960 |
| **International** | +2,400 more ad-supported | +$3,528 | -$8,640 |
| **Total** | — | +$4,016 | -$9,600 |

**Net: -$5,584/mo** (8.6% reduction in total revenue)

**Verdict:** Ad-free conversion is more important than ad CPM. Focus on converting users to ad-free, not maximizing ad impressions.

---

## PART 6: THE ACTUAL TRADE-OFF (Ad Revenue vs. Ad-Free)

### 6.1 Revenue Per User: Ad-Supported vs. Ad-Free

**India user (10-min daily session):**

| Path | Monthly Revenue to You |
|---|---|
| **Ad-supported (no purchases)** | $0.076 (75 impressions × $1.02 RPM ÷ 1000) |
| **Ad-free ($1.20/mo)** | $1.20 |
| **Ad-free + 1 cosmetic purchase** | $1.20 + $0.50 = $1.70 |
| **Multiplier** | 1.70 is **22x** the ad-supported user |

**International user (10-min daily session):**

| Path | Monthly Revenue to You |
|---|---|
| **Ad-supported (no purchases)** | $0.46 (75 impressions × $6.12 RPM ÷ 1000) |
| **Ad-free ($3.60/mo)** | $3.60 |
| **Ad-free + 1 cosmetic purchase** | $3.60 + $7.20 = $10.80 |
| **Multiplier** | 10.80 is **23.5x** the ad-supported user |

**Conclusion:** An ad-free user with one cosmetic purchase generates 20-23x the revenue of a pure ad-supported user.

**This means:** Every user you convert to ad-free is worth more than the ad revenue you lose. Your monetization strategy is correct.

---

## PART 7: AD REVENUE BY DAU (QUICK REFERENCE TABLE)

### 7.1 Ad Revenue Only (No Subscriptions, No Cosmetics)

**India DAU (75 impressions/month, $0.75 CPM = $0.51 RPM):**

| DAU | Monthly Ad Revenue |
|---|---|
| 1,000 | $38 |
| 5,000 | $191 |
| 10,000 | $382 |
| 20,000 | $765 |
| 50,000 | $1,912 |
| 100,000 | $3,825 |

**International DAU (75 impressions/month, $4.50 CPM = $3.06 RPM):**

| DAU | Monthly Ad Revenue |
|---|---|
| 1,000 | $229 |
| 5,000 | $1,148 |
| 10,000 | $2,295 |
| 20,000 | $4,590 |
| 50,000 | $11,475 |
| 100,000 | $22,950 |

**Blended (assuming 60% International / 40% India):**

| Total DAU | Monthly Ad Revenue | As % of $100k/year threshold |
|---|---|---|
| 5,000 | $1,339 | 1.6% of $100k |
| 10,000 | $2,677 | 3.2% of $100k |
| 20,000 | $5,355 | 6.4% of $100k |
| 50,000 | $13,387 | 16% of $100k |
| 100,000 | $26,775 | 32% of $100k |

---

## PART 8: REAL SCENARIO - WARSCYTHE AT 50K DAU

### 8.1 Complete Revenue Model (What Actually Happens)

**Assuming:**
- 50k DAU (20k India, 30k International)
- 15% India ad-free conversion, 22% International
- 6-8% cosmetics attach per cohort
- 75 impressions/user/month (2.5 ads per 10-min session)
- $0.75 CPM India, $4.50 CPM International

**Revenue breakdown:**

| Category | Amount | % |
|---|---|---|
| **Subscriptions (ad-free)** | $27,360 | 42% |
| **Cosmetics** | $33,200 | 51% |
| **Ads** | $4,486 | 7% |
| **TOTAL** | **$65,046/mo** | 100% |

**Monthly profit (after 30% platform fee + payment processing + infra):**

| Item | Amount |
|---|---|
| Gross revenue | $65,046 |
| Platform fees (30%) | -$19,514 |
| Net revenue | $45,532 |
| Payment processing (2.3%) | -$1,048 |
| Infrastructure | -$860 |
| **Operating profit (before team)** | **$43,624/mo** |
| **Annual** | **$523.5k** |

---

### 8.2 The Role of Ad Revenue

At 50k DAU, ad revenue is **$4,486/month** (7% of total).

**This is:**
- Not critical to your business (could lose it, still hit $100k+ ARR)
- A nice-to-have baseline from non-paying users
- Less important than conversion to ad-free + cosmetics

**Why keep ads then?**
- Captures some value from users who won't pay
- Provides motivation to buy ad-free (friction removal)
- Doesn't significantly harm engagement (transition screens only)

---

## PART 9: FINAL ANALYSIS

### What Actually Happens With Ad Revenue

**The honest breakdown:**

At 10-min daily sessions:
- Users see ~2.5 ads/day = 75 ads/month
- CPM varies: $0.75 (India) to $4.50 (International)
- Your RPM: $0.51 (India) to $3.06 (International)
- **Per ad-supported user: $0.04-0.23/month from ads**

**Vs. ad-free user:**
- Pays $1.20 (India) to $3.60 (International)/month
- **23x the revenue of ad-supported user**

**At 50k DAU:**
- Ad revenue: $13,387/mo (7% of total)
- Subscription revenue: $27,360/mo (42% of total)
- Cosmetics revenue: $33,200/mo (51% of total)

**Conclusion:**
- Ads are secondary revenue (7%)
- Real money is subscriptions (42%) + cosmetics (51%)
- Ad revenue is nice but not critical
- Optimize for ad-free conversion first, ad CPM secondw

---

### Should You Optimize Ad Placement?

**Current strategy: 2.5 ads per 10-min session on transition screens**

**Options:**
1. **Keep as-is:** $4.5k/mo ad revenue, maximum engagement
2. **Add more ads:** $7k/mo ad revenue, might reduce cosmetics conversion
3. **Remove ads entirely:** $0 ad revenue, but might increase ad-free conversion slightly

**Recommendation:** Keep current placement. Ad revenue (7%) isn't worth optimizing if it reduces cosmetics conversion (51%) or ad-free conversion (42%). The math doesn't work.

---

**⚔️ Ad revenue is gravy. Your real monetization is subscriptions + cosmetics. Don't over-optimize for it.**
