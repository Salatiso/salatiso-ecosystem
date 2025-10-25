# Mlandeli Notemba Trust Framework
**"Building Trust Through Reciprocity and Transparency"**

**Version:** 3.0.0 (Sonny Chat Integration)  
**Last Updated:** October 13, 2025  
**Framework Owner:** Salatiso Ecosystem  
**Philosophical Foundation:** Ubuntu - "I am because we are"

---

## Table of Contents
1. [Philosophical Foundation](#philosophical-foundation)
2. [Trust Framework Principles](#trust-framework-principles)
3. [Trust Score Mechanics](#trust-score-mechanics)
4. [Check-In Reliability System](#check-in-reliability-system)
5. [Reciprocity Tracking](#reciprocity-tracking)
6. [Consent & Monitoring Ethics](#consent-monitoring-ethics)
7. [Cross-Ecosystem Trust Propagation](#cross-ecosystem-trust-propagation)
8. [Trust Tier Progression](#trust-tier-progression)
9. [Gaming Prevention](#gaming-prevention)
10. [Redemption & Appeals](#redemption-appeals)

---

## Philosophical Foundation

### Ubuntu: The Foundation of Trust

**"Umuntu ngumuntu ngabantu"** - A person is a person through other people.

The Mlandeli Notemba Trust Framework is built on the African philosophy of **Ubuntu**, which recognizes that human identity and dignity are inseparable from community. In this framework, trust is not an individual attribute but a **relational quality** that emerges from consistent, ethical interactions within a community.

### Mlandeli Notemba Defined

**Mlandeli** (isiXhosa/isiZulu) - "The one who follows" or "follower"  
**Notemba** (isiXhosa/isiZulu) - "With faithfulness/reliability"

**Mlandeli Notemba** - "The faithful follower" or "one who walks the path with reliability"

This name embodies the framework's core principle: **Trust is built by consistently following through on commitments and treating others with respect and reciprocity.**

### Core Values

#### 1. **Reciprocity (Ukuphindisela Okuhle)**
Every interaction is mutual. If I monitor your safety, you monitor mine. If you rate me, I rate you. Trust flows in both directions.

#### 2. **Transparency (Ukucaca)**
Trust scores are calculated using transparent, auditable algorithms. Users can see what contributes to their score and how to improve it.

#### 3. **Consent (Imvume)**
No monitoring, tracking, or visibility without explicit, informed consent. Consent is granular, time-boxed, and revocable.

#### 4. **Reliability (Ukuthembeka)**
Actions speak louder than words. Trust is earned through consistent follow-through on check-ins, commitments, and reciprocal obligations.

#### 5. **Community (Ubuntu)**
Individual trust scores are influenced by community standing. Strong community ties enhance trust; isolation or exclusion diminishes it.

#### 6. **Redemption (Ukubuyisana)**
Everyone deserves a path to rebuild trust after mistakes. The framework includes mechanisms for appealing unfair ratings and earning back trust through consistent positive behavior.

---

## Trust Framework Principles

### Principle 1: Trust is Earned, Not Given

Unlike traditional identity systems where verification (ID, passport) confers automatic trust, Mlandeli Notemba requires **demonstrated reliability over time**. Even verified users start at baseline trust and must earn higher tiers through:

- Consistent check-in compliance
- Mutual rating participation
- Reciprocal safety exchange completion
- Community engagement and endorsements
- Cross-ecosystem positive interactions

### Principle 2: Trust is Context-Aware

A user may be highly trusted in one context (e.g., transportation) but unknown in another (e.g., hospitality). The framework:

- Tracks trust across multiple contexts
- Rewards context diversity (prevents single-app gaming)
- Allows context-specific trust display (show relevant ratings)
- Enables context-specific consent (monitor during trips but not at home)

### Principle 3: Trust Requires Reciprocity

To prevent gaming and ensure fairness:

- **Reciprocal ratings**: Both parties must rate each other after interactions
- **Reciprocal exchanges**: Safety data exchange must be mutual
- **Reciprocal monitoring**: If I monitor you, you get visibility into my monitoring behavior
- **Reciprocal transparency**: Trust score calculation is identical for all users

### Principle 4: Trust Decays Without Activity

Trust is not permanent. To maintain high trust scores:

- Users must remain active in the ecosystem
- Inactive users experience gradual trust decay
- Returning users can rebuild trust through renewed activity
- Decay prevents abandoned accounts from retaining high trust

### Principle 5: Trust is Multi-Dimensional

A single number (trust score 0-100) is supplemented by:

- **Trust Tier** (New, Bronze, Silver, Gold, Platinum)
- **Context badges** (Trusted Driver, Reliable Commuter, Verified Host)
- **Reliability metrics** (Check-in rate, response time, cancellation rate)
- **Community standing** (Endorsements, references, tenure)

---

## Trust Score Mechanics

### Formula Overview

```
Trust Score = (
    Check-In Reliability × 0.25 +
    Average Rating × 0.20 +
    Reciprocity Compliance × 0.15 +
    Context Diversity × 0.15 +
    Endorsement Quality × 0.10 +
    Account Longevity × 0.10 +
    Verification Level × 0.05
) × Activity Decay × 100
```

### Component Breakdown

#### 1. Check-In Reliability (25% weight)

**Why it matters:** Check-ins are the most objective measure of reliability. They require action at specific times and can't be faked.

**Calculation:**
```
Check-In Reliability = (
    Successful Check-Ins × 1.0 +
    Late Check-Ins × 0.5 +
    Missed Check-Ins × 0.0
) / Total Check-Ins

Bonus: If recent 20 check-ins have 95%+ success rate, apply 10% bonus
```

**Examples:**
- **100 check-ins: 95 success, 3 late, 2 missed**
  - Score = (95 × 1.0 + 3 × 0.5 + 2 × 0.0) / 100 = 0.965
  - With bonus: 0.965 × 1.10 = 1.0 (capped)

- **50 check-ins: 40 success, 7 late, 3 missed**
  - Score = (40 × 1.0 + 7 × 0.5 + 3 × 0.0) / 50 = 0.87

#### 2. Average Rating (20% weight)

**Why it matters:** Community perception matters. Good ratings from real users indicate trustworthiness.

**Calculation:**
```
Average Rating = Sum of All Ratings / Number of Ratings
Normalized to 0.0 - 1.0 scale (divide by 5)

Note: Only counts ratings where reciprocal rating was also given
```

**Gaming prevention:**
- Ratings without reciprocal rating don't count
- Ratings from low-trust users have reduced weight
- Extreme outlier ratings are flagged for review

#### 3. Reciprocity Compliance (15% weight)

**Why it matters:** Reciprocity is a core principle. Users who receive ratings but don't give them are gaming the system.

**Calculation:**
```
Exchange Completion Rate = Completed Exchanges / Total Exchanges
Rating Reciprocity Rate = Mutual Ratings / Total Ratings Received

Reciprocity Compliance = (
    Exchange Completion Rate × 0.5 +
    Rating Reciprocity Rate × 0.5
)
```

**Examples:**
- **Completed all 20 exchanges, gave ratings for all 18 received ratings**
  - Exchange: 20/20 = 1.0
  - Rating: 18/18 = 1.0
  - Compliance = (1.0 × 0.5 + 1.0 × 0.5) = 1.0

- **Completed 15 of 20 exchanges, gave ratings for 10 of 15 received ratings**
  - Exchange: 15/20 = 0.75
  - Rating: 10/15 = 0.67
  - Compliance = (0.75 × 0.5 + 0.67 × 0.5) = 0.71

#### 4. Context Diversity (15% weight)

**Why it matters:** Trust across multiple contexts is more reliable than trust in a single context (prevents single-app gaming).

**Calculation:**
```
Context Diversity Score = 
    0 contexts: 0.0
    1 context:  0.3
    2 contexts: 0.5
    3 contexts: 0.7
    4 contexts: 0.85
    5+ contexts: 1.0
```

**Contexts:**
- Transportation (PigeeBack, taxi, bus)
- Hospitality (Ekhaya, hosting, visiting)
- Workplace (SafetyHelp, HRHelp, contractor)
- Education (Sazi Life Academy, student, parent)
- Community (Flamea Sazi, church, events)
- Commerce (marketplace, services)
- Social (friends, family, neighbors)

#### 5. Endorsement Quality (10% weight)

**Why it matters:** Endorsements from trusted community members carry weight.

**Calculation:**
```
Weighted Endorsement Sum = Σ (Endorser Trust Score / 100)
Average = Weighted Endorsement Sum / Number of Endorsements
Diminishing Returns = min(Number of Endorsements / 10, 1.0)

Endorsement Quality = Average × Diminishing Returns
```

**Example:**
- **8 endorsements from users with trust scores: 85, 78, 92, 65, 88, 71, 95, 82**
  - Weighted sum = (85 + 78 + 92 + 65 + 88 + 71 + 95 + 82) / 100 = 6.56
  - Average = 6.56 / 8 = 0.82
  - Diminishing = 8 / 10 = 0.8
  - Quality = 0.82 × 0.8 = 0.656

#### 6. Account Longevity (10% weight)

**Why it matters:** Older accounts with sustained activity demonstrate commitment to the ecosystem.

**Calculation:**
```
Days Since Account Creation = (Now - Account Created Date) / (24 * 60 * 60 * 1000)

Longevity Score =
    < 30 days:   0.2
    30-90 days:  0.4
    90-180 days: 0.6
    180-365 days: 0.8
    365+ days:   1.0
```

#### 7. Verification Level (5% weight)

**Why it matters:** Identity verification adds baseline trust but is not sufficient alone.

**Calculation:**
```
Verification Score =
    No verification:      0.0
    Phone verified:       0.3
    Email verified:       0.3
    ID verified:          0.5
    Address verified:     0.6
    Biometric verified:   0.7
    Background check:     0.9
    All verifications:    1.0
```

### Activity Decay Multiplier

**Why it matters:** Trust decays without sustained activity.

**Calculation:**
```
Days Since Last Interaction = (Now - Last Interaction Date) / (24 * 60 * 60 * 1000)

Activity Decay =
    < 30 days:   1.0   (no decay)
    30-90 days:  0.95  (5% decay)
    90-180 days: 0.85  (15% decay)
    180-365 days: 0.70  (30% decay)
    365+ days:   0.50  (50% decay)
```

---

## Check-In Reliability System

### Why Check-Ins Matter

Check-ins are the **most objective, game-proof measure** of reliability in the Mlandeli Notemba framework. Unlike ratings (which can be faked or biased) or endorsements (which can be coerced), check-ins require:

1. **Action at specific times** (can't be backdated)
2. **Location verification** (proves physical presence)
3. **Pattern consistency** (builds reliability over time)
4. **Consequence if missed** (escalation affects trust)

### Check-In Types

#### 1. Trigger-Based Check-Ins
Automatically required based on user-defined triggers:

**Trip Check-Ins:**
- Start: "Boarding vehicle" → Must check in within 5 min of start time
- Mid-trip: "On route" → Check in every 15-30 min during trip
- End: "Arrived safely" → Check in within 10 min of expected arrival

**Periodic Check-Ins:**
- School run: Daily at specific times
- Work commute: Mon-Fri mornings
- Regular visits: Weekly or monthly

**Geofence Check-Ins:**
- Entry: "Entered location" → Check in upon entering geofence
- Exit: "Left location" → Check in upon leaving geofence

#### 2. Manual Check-Ins
User-initiated for ad-hoc situations:

- "Visiting friend's house"
- "Shopping at mall"
- "Meeting at restaurant"
- "Working late"

#### 3. Automatic Check-Ins
Location-based, no user action required:

- User enters known safe zone (home, work)
- User passes expected waypoint on known route
- User arrives at expected destination within tolerance

### Check-In Status Definitions

| Status | Definition | Trust Impact | Example |
|--------|-----------|--------------|---------|
| **SUCCESS** | Check-in within required window | +1.0 | Arrived at 7:55 AM (expected 8:00 AM) |
| **SUCCESS_AUTO** | Automatic check-in via location | +1.0 | Entered home geofence at expected time |
| **LATE** | Check-in after window, before escalation | +0.5 | Checked in at 8:10 AM (5 min grace expired) |
| **MISSED** | No check-in, escalation triggered | +0.0 | No check-in by 8:15 AM, alert sent |
| **CANCELLED** | User cancelled trigger before start | No impact | Cancelled morning commute trigger |

### Check-In Reliability Calculation

```kotlin
fun calculateCheckInReliability(userId: String): CheckInReliabilityScore {
    val checkIns = getAllCheckIns(userId)
    
    val total = checkIns.size
    val successful = checkIns.count { it.status == SUCCESS || it.status == SUCCESS_AUTO }
    val late = checkIns.count { it.status == LATE }
    val missed = checkIns.count { it.status == MISSED }
    
    // Base score
    val baseScore = (successful * 1.0 + late * 0.5) / total
    
    // Recent performance bonus
    val recent20 = checkIns.takeLast(20)
    val recentSuccessRate = recent20.count { 
        it.status == SUCCESS || it.status == SUCCESS_AUTO 
    }.toFloat() / recent20.size
    
    val bonusMultiplier = if (recentSuccessRate >= 0.95) 1.10 else 1.0
    
    // Streak bonus
    val currentStreak = calculateSuccessStreak(checkIns)
    val streakBonus = when {
        currentStreak >= 50 -> 0.05
        currentStreak >= 20 -> 0.03
        currentStreak >= 10 -> 0.01
        else -> 0.0
    }
    
    val finalScore = (baseScore * bonusMultiplier + streakBonus).coerceIn(0.0, 1.0)
    
    return CheckInReliabilityScore(
        score = finalScore,
        totalCheckIns = total,
        successfulCheckIns = successful,
        lateCheckIns = late,
        missedCheckIns = missed,
        currentStreak = currentStreak,
        longestStreak = calculateLongestStreak(checkIns)
    )
}
```

### Check-In Streak Mechanics

**Success Streak:** Consecutive successful or auto check-ins

**Benefits:**
- 10+ streak: +1% reliability bonus, "Reliable" badge
- 20+ streak: +3% reliability bonus, "Very Reliable" badge
- 50+ streak: +5% reliability bonus, "Exceptionally Reliable" badge
- 100+ streak: +10% reliability bonus, "Platinum Reliability" badge

**Streak breaking:**
- Late check-in: Reduces streak by 50% (not broken entirely)
- Missed check-in: Breaks streak entirely
- Cancelled triggers: No impact on streak

---

## Reciprocity Tracking

### The Reciprocity Principle

**"Ukuphindisela okuhle"** - Returning good for good

In the Mlandeli Notemba framework, **every trust-building action must be mutual**:

1. **Ratings:** If you rate me, I must rate you
2. **Safety exchanges:** If I store your data, you store mine
3. **Monitoring:** If I can see your location, you can see I'm monitoring
4. **Endorsements:** If I endorse you, you're encouraged to endorse others
5. **Check-ins:** If I'm checking in for our trip, you should too

### Reciprocity Violations

#### Rating Asymmetry
**Problem:** User receives 20 ratings but only gives 5 ratings

**Impact:**
- Reciprocity compliance score drops
- Trust score penalized
- Profile shows "Low reciprocity" warning
- May be hidden from search results

**Resolution:**
- Complete pending reciprocal ratings
- Participate in future interactions fully
- Score gradually improves with compliant behavior

#### Exchange Non-Completion
**Problem:** User initiates safety exchanges but doesn't provide their data

**Impact:**
- Exchange marked as failed
- Reciprocity compliance drops
- Future exchange requests may be auto-declined by system
- Trust score affected

**Resolution:**
- Complete pending exchanges
- Provide explanation if unable to complete
- Build track record of successful exchanges

#### Monitoring Without Consent
**Problem:** User attempts to monitor someone without reciprocal consent

**Impact:**
- Immediate trust score penalty
- Consent violation logged immutably
- May be flagged for review
- Severe violations result in temporary suspension

**Resolution:**
- Request consent properly
- Respect consent boundaries
- Demonstrate understanding of privacy principles

### Reciprocity Score Calculation

```kotlin
fun calculateReciprocityScore(userId: String): ReciprocityScore {
    // Rating reciprocity
    val receivedRatings = getRatingsReceived(userId)
    val givenRatings = getRatingsGiven(userId)
    val expectedGivenRatings = receivedRatings.size
    val actualGivenRatings = givenRatings.count { rating ->
        receivedRatings.any { it.fromUserId == rating.toUserId }
    }
    val ratingReciprocity = actualGivenRatings.toFloat() / expectedGivenRatings.coerceAtLeast(1)
    
    // Exchange reciprocity
    val exchanges = getAllExchanges(userId)
    val completedExchanges = exchanges.count { it.status == COMPLETED }
    val exchangeReciprocity = completedExchanges.toFloat() / exchanges.size.coerceAtLeast(1)
    
    // Monitoring reciprocity
    val monitoringRelationships = getMonitoringRelationships(userId)
    val reciprocalMonitoring = monitoringRelationships.count { relationship ->
        val reverseExists = monitoringRelationships.any {
            it.monitorId == relationship.monitoredId && 
            it.monitoredId == relationship.monitorId
        }
        reverseExists || relationship.level == MINIMAL // Minimal level doesn't require reciprocal
    }
    val monitoringReciprocity = reciprocalMonitoring.toFloat() / monitoringRelationships.size.coerceAtLeast(1)
    
    // Overall reciprocity
    val overallScore = (
        ratingReciprocity * 0.4 +
        exchangeReciprocity * 0.4 +
        monitoringReciprocity * 0.2
    )
    
    return ReciprocityScore(
        overallScore = overallScore,
        ratingReciprocity = ratingReciprocity,
        exchangeReciprocity = exchangeReciprocity,
        monitoringReciprocity = monitoringReciprocity,
        pendingRatings = expectedGivenRatings - actualGivenRatings,
        pendingExchanges = exchanges.size - completedExchanges
    )
}
```

---

## Consent & Monitoring Ethics

### The Consent Imperative

**"Imvume"** - Consent

In Mlandeli Notemba, **consent is not a legal formality—it is a sacred trust principle**. Monitoring without consent is:

- **Ethically wrong** (violates Ubuntu principles)
- **Technically blocked** (system architecture prevents it)
- **Severely penalized** (trust score impact)
- **Immutably logged** (audit trail)

### Consent Principles

#### 1. Explicit, Not Implied
- Consent must be actively given (opt-in), never assumed
- Pre-checked consent boxes are prohibited
- Consent request must clearly state what is being consented to
- User must confirm understanding before granting consent

#### 2. Granular, Not All-or-Nothing
Users can consent to:
- **What:** Location, check-ins, safety data, LifeCV profile
- **When:** Always, during trips only, at specific times, in emergencies only
- **Who:** Specific individuals, household members, community, emergency contacts
- **Level:** Minimal, standard, enhanced, full monitoring

#### 3. Time-Boxed, Not Permanent
- All consent has expiration date
- Maximum consent period: 1 year (renewable)
- User receives reminders before expiration
- Auto-renewal requires re-confirmation
- Expired consent automatically revokes monitoring

#### 4. Revocable, Instantly
- User can revoke consent at any moment
- Revocation takes effect immediately (<5 seconds)
- Monitor is notified of revocation
- Revoked consent is logged immutably
- Revocation reason is optional but encouraged

#### 5. Auditable, Transparently
- All consent grants logged with timestamp
- All data access logged with timestamp
- All consent revocations logged
- Users can view complete consent history
- Monitors cannot delete audit logs

### Consent Ledger Structure

```kotlin
@Entity(tableName = "consent_ledger")
data class ConsentLedgerEntry(
    @PrimaryKey val id: String,
    val timestamp: Long,
    val entryType: ConsentEntryType,
    val monitorId: String,
    val monitoredId: String,
    val relationshipType: RelationshipType,
    val monitoringLevel: MonitoringLevel,
    val monitoringScope: MonitoringScope,
    val duration: Long?,
    val expiresAt: Long?,
    val reason: String?,
    
    // Cryptographic verification
    val monitorSignature: String,
    val monitoredSignature: String?,
    val previousEntryHash: String,
    val entryHash: String
)

enum class ConsentEntryType {
    CONSENT_REQUESTED,
    CONSENT_GRANTED,
    CONSENT_DENIED,
    CONSENT_RENEWED,
    CONSENT_REVOKED,
    CONSENT_EXPIRED,
    DATA_ACCESSED,
    CONSENT_VIOLATION_ATTEMPTED
}
```

### Monitoring Levels & Their Ethics

#### Level 1: MINIMAL
**What:** Location only when check-in missed  
**Why:** Emergency use only  
**Ethics:** Least invasive, respects privacy maximally

**Appropriate for:**
- Adult children monitoring elderly parents
- Friends monitoring each other during solo trips
- Community watch programs

#### Level 2: STANDARD
**What:** Regular check-ins + location when check-in made  
**Why:** Routine safety monitoring  
**Ethics:** Balanced privacy and safety

**Appropriate for:**
- Parents monitoring teenage children
- Spouses monitoring each other during travel
- Household members during daily routines

#### Level 3: ENHANCED
**What:** Real-time location + status updates  
**Why:** High-risk situations  
**Ethics:** Significant privacy trade-off justified by risk

**Appropriate for:**
- Parents monitoring young children
- Guardians monitoring vulnerable adults
- High-risk workplace contractors
- PigeeBack drivers and passengers during rides

#### Level 4: FULL
**What:** Real-time + full safety data access + LifeCV  
**Why:** Maximum safety in extreme situations  
**Ethics:** Only acceptable with explicit, informed consent and clear justification

**Appropriate for:**
- Emergency response situations
- Court-ordered monitoring
- High-value asset protection
- Voluntary participation in safety research

### Consent Violation Responses

| Violation | Response | Trust Impact | Recovery |
|-----------|----------|--------------|----------|
| **Attempted monitoring without consent** | Blocked by system, logged | -10 points | Demonstrate understanding of consent principles |
| **Accessing data beyond scope** | Access revoked, logged | -15 points | Complete privacy training module |
| **Not responding to consent expiration** | Monitoring auto-revoked | -5 points | Renew consent properly |
| **Repeated violations** | Account suspended | -50 points | Appeal to review board |
| **Severe abuse** | Permanent ban | Score reset to 0 | No recovery path |

---

## Cross-Ecosystem Trust Propagation

### The Multi-App Trust Challenge

Traditional reputation systems are siloed:
- Uber driver rating doesn't transfer to Airbnb hosting
- eBay seller rating doesn't transfer to LinkedIn hiring
- School volunteer background check doesn't transfer to sports league

**Mlandeli Notemba solves this** with cross-ecosystem trust propagation.

### Ecosystem Architecture

```
                    TRUST SCORE (Universal)
                            ↓
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    LifeSync          LifeCV (Identity)    Trust Ledger
  (Master Hub)        (Profile Core)      (Immutable Log)
        │                   │                   │
        └───────────────────┴───────────────────┘
                            ↓
        ┌───────────┬───────────┬───────────┬───────────┐
        │           │           │           │           │
    PigeeBack    Ekhaya   SafetyHelp   Flamea    Sazi Academy
  (Transport) (Home/Host) (Workplace) (Community) (Education)
        │           │           │           │           │
        └───────────┴───────────┴───────────┴───────────┘
                            ↓
                    CONTEXT-SPECIFIC
                      TRUST BADGES
```

### Trust Propagation Rules

#### Rule 1: Universal Score, Context Badges
- **Universal Trust Score** (0-100) visible across all apps
- **Context-specific badges** earned in each app independently
- Example: User has Trust Score 78, badges: "Reliable Driver", "Verified Host", "Punctual Employee"

#### Rule 2: Context Contribution Weighting
Each ecosystem app contributes to universal trust score based on activity:

```
PigeeBack contributions: 30% (if active)
Ekhaya contributions: 20% (if active)
SafetyHelp contributions: 15% (if active)
Sazi Academy contributions: 15% (if active)
Flamea Sazi contributions: 10% (if active)
LifeCV contributions: 10% (base profile)
```

**If user is only active in 2 apps:**
```
Active apps: PigeeBack (50%), Ekhaya (30%), LifeCV (20%)
```

#### Rule 3: Cross-Context Verification
Trust actions in one app can verify trust in another:

**Example 1:**
- User is "Verified Driver" in PigeeBack (trust score 85)
- User applies to be contractor in SafetyHelp
- SafetyHelp sees: "This user has high trust in transportation context with 95% check-in reliability"
- SafetyHelp onboarding is accelerated

**Example 2:**
- User is "Trusted Host" in Ekhaya (trust score 92)
- User joins church community in Flamea Sazi
- Flamea Sazi sees: "This user has strong hospitality trust with 98% positive ratings"
- Church community is more likely to trust for event hosting

#### Rule 4: Negative Trust Propagation
Trust violations in one app affect universal score:

**Scenario:**
- User repeatedly misses check-ins in PigeeBack (drops to trust score 45)
- User's trust score in ALL apps drops to 45
- However, context badges remain: "Verified Host" in Ekhaya is still visible
- Other apps display: "Trust score recently decreased due to reliability issues in another app"

**Rationale:** If you can't be relied upon in one context, other contexts should be cautious until you rebuild trust.

### Context-Specific Trust Badges

#### PigeeBack (Transportation)
- 🚗 **Verified Driver** - ID, license, vehicle verified
- ⭐ **5-Star Driver** - Average 4.8+ rating, 50+ trips
- ✅ **Reliable Driver** - 95%+ check-in success, 100+ trips
- 🛡️ **Safety Champion** - Zero safety incidents, 500+ trips
- 🌟 **Platinum Driver** - Top 5% of drivers

#### Ekhaya (Home & Hospitality)
- 🏠 **Verified Host** - Property and ID verified
- ⭐ **5-Star Host** - Average 4.8+ rating, 20+ guests
- 🧹 **Clean & Tidy** - Consistent cleanliness ratings
- 🤝 **Welcoming** - Hospitality ratings 4.9+
- 👨‍👩‍👧 **Family Friendly** - Child-safe environment verified

#### SafetyHelp (Workplace)
- 💼 **Verified Contractor** - Background check passed
- ⏰ **Punctual** - 95%+ on-time arrivals
- 🛠️ **Skilled Tradesperson** - Certifications verified
- 🦺 **Safety Compliant** - Zero OH&S violations
- ⭐ **Highly Recommended** - 4.8+ rating from employers

#### Sazi Life Academy (Education)
- 📚 **Verified Student** - Enrollment confirmed
- 🎓 **Excellent Attendance** - 95%+ attendance rate
- 📖 **Engaged Learner** - Active participation ratings
- 👨‍🏫 **Verified Educator** - Teaching credentials verified
- 🌟 **Academic Excellence** - Top performer status

#### Flamea Sazi (Community)
- ⛪ **Active Member** - Regular attendance
- 🤝 **Community Leader** - Organizes events
- 💝 **Generous Contributor** - Donations/volunteering
- 🎵 **Worship Leader** - Musical ministry
- 👥 **Mentor** - Guides new members

### Trust Transfer Matrix

| From Context | To Context | Transfer Factor | Rationale |
|--------------|-----------|-----------------|-----------|
| PigeeBack Driver | Ekhaya Host | 0.7 | Both require hospitality, safety |
| PigeeBack Driver | SafetyHelp Contractor | 0.8 | Both require punctuality, reliability |
| Ekhaya Host | PigeeBack Driver | 0.6 | Hosting ≠ driving skills |
| SafetyHelp Worker | PigeeBack Driver | 0.5 | Workplace ≠ transportation |
| Sazi Student | PigeeBack Driver | 0.3 | Limited overlap |
| Flamea Member | Ekhaya Host | 0.9 | Strong community trust overlap |

**Transfer Factor** determines how much context-specific trust contributes to initial trust estimate in new context.

---

## Trust Tier Progression

### Tier System

| Tier | Score Range | Color | Benefits | Requirements |
|------|-------------|-------|----------|--------------|
| **NEW** | 0-20 | Gray | Basic access | Account created |
| **BRONZE** | 21-40 | Bronze | Standard access | 10+ interactions |
| **SILVER** | 41-60 | Silver | Priority support | 50+ interactions, 2+ contexts |
| **GOLD** | 61-80 | Gold | Premium features | 200+ interactions, 3+ contexts, 90%+ reliability |
| **PLATINUM** | 81-100 | Platinum | All features, recognition | 500+ interactions, 4+ contexts, 95%+ reliability, endorsements |

### Tier Progression Paths

#### Path 1: Slow & Steady (Recommended)
**Timeline:** 12-18 months to PLATINUM

**Strategy:**
- Focus on check-in consistency (build streak)
- Participate fully in every interaction (reciprocal ratings)
- Expand to multiple contexts gradually
- Build community relationships (endorsements)
- Maintain activity (prevent decay)

**Milestones:**
- Month 1: NEW → BRONZE (10 successful interactions)
- Month 3: BRONZE → SILVER (50 interactions, 2 contexts)
- Month 9: SILVER → GOLD (200 interactions, 90% reliability)
- Month 18: GOLD → PLATINUM (500 interactions, 95% reliability, endorsements)

#### Path 2: Fast Track (High Activity)
**Timeline:** 6-9 months to PLATINUM

**Strategy:**
- Very high activity (daily interactions)
- Perfect check-in record
- Immediate expansion to all contexts
- Active community engagement
- Request endorsements from high-trust users

**Milestones:**
- Month 1: NEW → BRONZE (20 interactions)
- Month 2: BRONZE → SILVER (75 interactions, 3 contexts)
- Month 5: SILVER → GOLD (250 interactions, 95% reliability)
- Month 9: GOLD → PLATINUM (600 interactions, endorsements)

#### Path 3: Redemption (After Trust Drop)
**Timeline:** 6-12 months to recover previous tier

**Strategy:**
- Address root cause of trust drop
- Consistent positive behavior
- Extra effort on reliability
- Transparent communication about past issues
- Seek endorsements from users aware of improvement

**Milestones:**
- Month 1: Stabilize score (prevent further drops)
- Month 3: Show consistent improvement trend
- Month 6: Recover to previous tier -1
- Month 12: Recover fully to previous tier

### Tier Benefits Detail

#### NEW TIER
**Access:**
- Basic app features
- Limited to 5 interactions per day
- Cannot initiate high-value transactions

**Support:**
- Community help only
- No priority support

**Visibility:**
- Profile visible to other NEW/BRONZE users only
- Lower in search results

#### BRONZE TIER
**Access:**
- Standard app features
- Up to 20 interactions per day
- Can initiate moderate-value transactions

**Support:**
- Email support (48h response)
- Community help

**Visibility:**
- Profile visible to all users
- Standard search ranking

#### SILVER TIER
**Access:**
- Full app features
- Unlimited interactions
- Can initiate high-value transactions

**Support:**
- Email support (24h response)
- Live chat support

**Visibility:**
- Prioritized in search results
- "Trusted Member" badge

**Perks:**
- Discounts from ecosystem partners
- Early access to new features

#### GOLD TIER
**Access:**
- Full app features + premium features
- Unlimited interactions
- Can initiate very high-value transactions

**Support:**
- Priority email support (12h response)
- Priority live chat
- Dedicated account manager (shared)

**Visibility:**
- Top of search results
- "Highly Trusted" badge
- Featured member status

**Perks:**
- Significant discounts (10-20%)
- Beta testing invitations
- Community leadership opportunities

#### PLATINUM TIER
**Access:**
- All features
- Unlimited interactions
- Trusted for any transaction level

**Support:**
- VIP email support (4h response)
- Priority live chat
- Dedicated account manager

**Visibility:**
- Premium search placement
- "Platinum Trust" badge
- Verified profile highlight

**Perks:**
- Maximum discounts (20-30%)
- First access to all features
- Invitation to ecosystem advisory board
- Annual recognition event
- Exclusive Platinum member community

---

## Gaming Prevention

### Gaming Vectors & Countermeasures

#### Vector 1: Fake Ratings (Collusion)

**Attack:**
- Two users repeatedly rate each other 5 stars
- No real interactions occurred
- Attempting to inflate trust scores

**Detection:**
- Pattern analysis: Repeated ratings between same users
- Interaction validation: No check-ins or exchanges logged
- Time analysis: Ratings without proper interaction duration
- Network analysis: Isolated rating cluster

**Countermeasure:**
- Require check-in or exchange before rating enabled
- Limit rating weight between same users (diminishing returns)
- Flag suspicious patterns for manual review
- Penalize both parties if collusion confirmed

#### Vector 2: Rating Farms (Paid Ratings)

**Attack:**
- User pays others to give 5-star ratings
- Creates artificial high trust score
- No genuine interactions

**Detection:**
- Geographic dispersion: Raters in different cities with no logical connection
- Velocity: Too many ratings in short time
- Profile mismatch: Raters with low trust or suspicious profiles
- Payment trails: Financial connections detected

**Countermeasure:**
- Weight ratings by rater's trust score
- Require context-appropriate interactions
- Flag rapid trust score increases
- Investigate payment connections

#### Vector 3: New Account Abandonment

**Attack:**
- User creates account, gets negative ratings
- Abandons account, creates new one
- Repeats to avoid trust consequences

**Detection:**
- Device fingerprinting
- Phone number reuse
- IP address patterns
- Behavioral biometrics

**Countermeasure:**
- Phone verification required
- Device limits (max 2 accounts per device)
- Suspended accounts block new accounts from same phone
- ID verification for higher tiers

#### Vector 4: Check-In Spoofing

**Attack:**
- User fakes GPS location to auto check-in
- Inflates check-in reliability without real compliance

**Detection:**
- GPS accuracy analysis (spoofed often has perfect accuracy)
- Movement patterns (teleportation)
- Cell tower triangulation mismatch
- Accelerometer/gyroscope data inconsistencies

**Countermeasure:**
- Require multiple location signals (GPS + cell + WiFi)
- Check for impossible movement speeds
- Validate with reciprocal party's location
- Flag suspicious patterns for manual check-ins

#### Vector 5: Context Exploitation

**Attack:**
- User focuses on easiest context to game
- Ignores context diversity to specialize in one context

**Detection:**
- Single-context activity pattern
- Disproportionate ratings in one app
- No cross-context interactions

**Countermeasure:**
- Context diversity component in trust score (15%)
- Diminishing returns from single context
- Encourage multi-context participation
- Tier progression requires multiple contexts

### Algorithmic Gaming Prevention

```kotlin
class GamingDetector {
    
    suspend fun detectGaming(userId: String): GamingRiskScore {
        val signals = mutableListOf<GamingSignal>()
        
        // Signal 1: Rating pattern analysis
        val ratingPattern = analyzeRatingPattern(userId)
        if (ratingPattern.isSuspicious) {
            signals.add(GamingSignal.SUSPICIOUS_RATING_PATTERN)
        }
        
        // Signal 2: Interaction validation
        val interactions = getInteractions(userId)
        val ratingsWithoutInteractions = interactions.count { 
            it.hasRating && !it.hasCheckIn && !it.hasExchange 
        }
        if (ratingsWithoutInteractions > 5) {
            signals.add(GamingSignal.RATINGS_WITHOUT_INTERACTIONS)
        }
        
        // Signal 3: Velocity check
        val recentRatings = getRatingsReceived(userId, lastDays = 7)
        if (recentRatings.size > 20) {
            signals.add(GamingSignal.RAPID_RATING_VELOCITY)
        }
        
        // Signal 4: Geographic dispersion
        val raterLocations = recentRatings.map { it.raterLocation }
        val avgDistance = calculateAverageDistance(raterLocations)
        if (avgDistance > 500) { // 500km average distance
            signals.add(GamingSignal.GEOGRAPHIC_DISPERSION)
        }
        
        // Signal 5: Reciprocity check
        val reciprocityScore = calculateReciprocityScore(userId)
        if (reciprocityScore.overallScore < 0.5) {
            signals.add(GamingSignal.LOW_RECIPROCITY)
        }
        
        // Signal 6: Device fingerprint
        val devices = getUserDevices(userId)
        if (devices.size > 3) {
            signals.add(GamingSignal.MULTIPLE_DEVICES)
        }
        
        // Calculate risk score
        val riskScore = signals.size * 15 // Each signal adds 15 points
        
        return GamingRiskScore(
            userId = userId,
            riskScore = riskScore,
            riskLevel = when {
                riskScore < 30 -> RiskLevel.LOW
                riskScore < 60 -> RiskLevel.MEDIUM
                riskScore < 90 -> RiskLevel.HIGH
                else -> RiskLevel.CRITICAL
            },
            signals = signals,
            recommendedAction = determineAction(riskScore)
        )
    }
    
    private fun determineAction(riskScore: Int): GamingAction {
        return when {
            riskScore < 30 -> GamingAction.NONE
            riskScore < 60 -> GamingAction.FLAG_FOR_REVIEW
            riskScore < 90 -> GamingAction.TEMPORARY_SUSPENSION
            else -> GamingAction.PERMANENT_BAN
        }
    }
}
```

---

## Redemption & Appeals

### The Path to Redemption

**"Ukubuyisana"** - Reconciliation, Coming back together

Mlandeli Notemba recognizes that **people make mistakes** and deserve opportunities to rebuild trust. The framework provides structured paths for redemption.

### Appeal System

#### When Can You Appeal?

1. **Unfair Rating** - You believe a rating was malicious or undeserved
2. **Technical Error** - Check-in failed due to app bug, not your fault
3. **Context Misunderstanding** - Rating was based on miscommunication
4. **False Accusation** - You were accused of consent violation you didn't commit
5. **Gaming False Positive** - System incorrectly flagged your behavior

#### Appeal Process

**Step 1: Submit Appeal**
```
User submits appeal with:
- Incident ID (rating ID, check-in ID, etc.)
- Description of issue
- Supporting evidence (screenshots, logs, witness statements)
- Desired resolution
```

**Step 2: Automated Review**
```
System checks:
- Appeal eligibility (not frivolous)
- Evidence validity (not tampered)
- User appeal history (not serial appealer)
- Incident context (what really happened)
```

**Step 3: Community Review (For eligible appeals)**
```
Panel of 5 GOLD+ tier users reviews:
- Cannot be involved in incident
- Must be from different communities
- Reviews evidence blindly (anonymized)
- Votes on resolution
- Majority decision wins
```

**Step 4: Resolution**
```
Possible outcomes:
- Appeal granted: Rating removed/adjusted, trust restored
- Appeal partially granted: Mitigation applied
- Appeal denied: Original decision stands
- Incident escalated: Requires admin review
```

**Step 5: Implementation**
```
- Trust score recalculated
- Notifications sent to all parties
- Decision logged immutably
- Appeal cannot be re-submitted unless new evidence
```

### Redemption Paths

#### Path 1: Post-Violation Redemption

**Scenario:** User had consent violation or trust drop

**Requirements:**
- Acknowledge mistake
- Complete trust training module
- Demonstrate 60 days of compliant behavior
- Obtain 3 endorsements from GOLD+ users
- Write reflection statement

**Timeline:**
- Months 1-2: Training & education
- Months 3-4: Supervised activity (extra monitoring)
- Months 5-6: Normal activity with progress tracking
- Month 7: Review by redemption committee
- Month 8: Conditional trust restoration
- Months 9-12: Probation period
- Month 13: Full trust restoration (if compliant)

**Outcome:**
- Trust score penalty reduced by 50% after Month 8
- Remaining penalty removed after Month 13
- Violation remains in history but marked "Redeemed"

#### Path 2: Inactive Account Reactivation

**Scenario:** User was inactive for 1+ year, trust decayed

**Requirements:**
- Re-verify identity
- Update profile information
- Complete refresher tutorial
- Start with reduced activity limits

**Timeline:**
- Week 1: Re-verification & onboarding
- Weeks 2-4: Limited activity (5 interactions/day)
- Months 2-3: Standard activity resumes
- Months 4-6: Trust score rebuilds with bonus for returning users

**Outcome:**
- Trust score recovery accelerated (1.5x normal rate)
- "Returning Member" badge
- Access to all previous tier benefits after 3 months

#### Path 3: Rating Dispute Resolution

**Scenario:** User received unfair 1-star rating, trust dropped

**Requirements:**
- Submit detailed appeal
- Provide evidence of good faith effort
- Allow community review
- Accept arbitration decision

**Timeline:**
- Days 1-3: Appeal submission window
- Days 4-7: Community review panel selection
- Days 8-14: Panel reviews evidence
- Day 15: Decision announced
- Day 16: Implementation

**Outcome:**
- If appeal granted: Rating removed, trust restored
- If appeal denied: Trust restoration path offered (3-month proven behavior)
- If partial grant: Rating adjusted to fair value

### Second Chances Policy

**First Violation:**
- Full redemption path available
- Trust score partially restored
- No permanent record impact after redemption

**Second Violation (Same type):**
- Redemption path available but longer
- Trust score partially restored (lesser degree)
- Permanent "Redeemed Violation" marker

**Third Violation (Same type):**
- Final redemption path offered
- Trust score penalty permanent (reduced but not removed)
- Permanent "Multiple Violations (Redeemed)" marker
- Extra monitoring indefinitely

**Fourth Violation (Same type):**
- No redemption available
- Permanent account suspension
- No appeal possible

### Community Forgiveness

Users can publicly acknowledge redemption:

**Endorsement After Redemption:**
- GOLD+ users can endorse a redeemed user
- Endorsement statement: "I believe [User] has learned and grown"
- Carries extra weight in trust calculation
- Demonstrates community forgiveness (Ubuntu)

---

## Conclusion

The **Mlandeli Notemba Trust Framework** is more than an algorithm—it's a **social contract** rooted in African values of Ubuntu, reciprocity, and community. By making trust:

- **Earned through action** (not just verification)
- **Context-aware** (not one-size-fits-all)
- **Reciprocal** (not one-sided)
- **Transparent** (not black-box)
- **Redeemable** (not permanently damning)

We create an ecosystem where **trust becomes the currency of safety, connection, and community thriving**.

---

**"Umuntu ngumuntu ngabantu"**  
*A person is a person through other people*

---

**Document Status:** FINAL v3.0  
**Last Review:** October 13, 2025  
**Next Review:** April 2026  
**Maintained by:** Salatiso Trust & Safety Team
