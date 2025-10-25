# Ecosystem LifeCV Integration Specification
**Version:** 1.0  
**Date:** October 2025  
**Status:** Active - Foundation for all Ecosystem Apps  

---

## 📋 Executive Summary

This specification defines how all Salatiso Ecosystem apps integrate with the LifeCV system, establishing a unified approach to user profiles, trust management, and real-time data synchronization. The strategy centers on a single source of truth (LifeSync) while allowing ecosystem apps to show contextual information and drive updates back to LifeSync.

### Core Principle
> **"Keep apps light. Keep LifeCV comprehensive. Sync everything in real-time."**

Each ecosystem app maintains only the minimum profile information needed for registration and core functionality. Full LifeCV updates happen in LifeSync, and all changes propagate automatically across the ecosystem.

---

## 🎯 Strategy Overview

### 1. LifeSync as LifeCV Home
- **Primary URL:** `https://lifesync-lifecv.web.app/`
- **Authority:** Single authoritative LifeCV database
- **Completeness:** Full 15+ sections (profile, skills, work, education, certifications, projects, languages, achievements, etc.)
- **Trust System:** Exclusive home for trust score calculations, badge management, and seal verification
- **Features:** Comprehensive profile builder with rich editors, media upload, verification workflows

### 2. Hub as Ecosystem Central
- **Primary URL:** `https://the-hub-lifecv.web.app/`
- **Role:** Central dashboard for all ecosystem apps
- **Functionality:** Manage profiles across all apps, sync settings, permissions, data export
- **Integration:** Aggregates profile status from all ecosystem apps

### 3. Ecosystem Apps (Light Version)
**Examples:** BizHelp, FinHelp, DocHelp, SafetyHelp, PigeeBack, Sazi.Life Academy

**LifeCV Integration Pattern:**
- **On Registration:** Collect minimal information (name, email, phone, basic profile)
- **On Dashboard:** Show LifeCV status widget with:
  - Profile completion percentage (0-100%)
  - Trust tier badge
  - Trust score (0-100)
  - Active trust seals
  - Last update timestamp
  - Sync status indicator
- **On Profile:** Link to LifeSync for comprehensive updates
- **Real-Time:** Auto-updates when user changes profile in LifeSync

---

## 🏗️ Technical Architecture

### Firestore Schema

#### Collection: `lifecv`
```javascript
// Document ID: {userId}
{
  userId: "auth-uid",
  displayName: "Full Name",
  email: "user@example.com",
  avatarUrl: "https://...",
  
  // Completion Tracking
  completionPercentage: 65,          // 0-100
  lastUpdatedDate: Timestamp,
  
  // Trust System
  trustScore: 78,                    // 0-100
  trustTier: "established",          // unknown|emerging|developing|established|exemplary
  trustSeals: [
    {
      id: "seal-1",
      name: "Email Verified",
      type: "personal",              // personal|professional|verified|achievement
      status: "active",              // active|inactive|pending|expired
      issuedDate: Timestamp,
      expiresAt: Timestamp,
      issuer: "LifeSync"
    }
  ],
  
  // Verification
  isVerified: true,
  verificationStatus: "verified",    // unverified|pending|verified|rejected
  
  // Sections
  profile: { firstName: "", lastName: "", bio: "", ... },
  skills: [{ name: "", level: "", ... }],
  workExperience: [{ company: "", role: "", ... }],
  education: [{ school: "", degree: "", ... }],
  certifications: [{ name: "", issuer: "", ... }],
  projects: [{ name: "", description: "", ... }],
  languages: [{ language: "", proficiency: "", ... }],
  achievements: [{ title: "", description: "", ... }],
  
  // Sync Metadata
  lastSyncDate: Timestamp,
  syncStatus: "synced",              // synced|syncing|failed|pending
  
  // Activity Log
  recentActivities: [
    {
      id: "act-1",
      type: "section_updated",       // section_updated|seal_earned|verification_changed
      description: "Work Experience updated",
      timestamp: Timestamp
    }
  ],
  
  // Ecosystem Registration Data (per app)
  registrationData: {
    bizhelp: {
      businessName: "My Company",
      businessNumber: "12345",
      registeredDate: Timestamp
    },
    finhelp: {
      accountNumber: "FH12345",
      bankInfo: { masked: "****1234" }
    },
    // ... other apps
  }
}
```

#### Collection: `lifecvSyncLog`
```javascript
// Document ID: {userId}-{timestamp}
{
  userId: "auth-uid",
  appName: "bizhelp",               // Which app triggered sync
  syncType: "registration",         // registration|update|manual
  dataChanged: {
    fields: ["displayName", "email"],
    oldValues: { displayName: "Old" },
    newValues: { displayName: "New" }
  },
  timestamp: Timestamp,
  status: "completed"               // completed|failed|pending
}
```

---

## 🔄 Integration Flow

### Phase 1: User Registration in Ecosystem App

```
┌─────────────────────────────────┐
│ User registers in App (e.g. BizHelp)
├─────────────────────────────────┤
│ Collects:
│ - Name, Email, Phone (minimal)
│ - App-specific data (business info, etc)
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Save to App Database
│ + Create LifeCV entry if needed
├─────────────────────────────────┤
│ 1. Check if LifeCV exists
│ 2. If not, create default profile
│ 3. Link app registration data
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Show LifeCV Dashboard Widget
├─────────────────────────────────┤
│ - Completion: 15% (just registered)
│ - Trust Tier: Unknown
│ - 1 Activity: "Profile created"
└────────────┬────────────────────┘
             │
             ▼
        [User sees CTA]
    "Complete profile in LifeSync"
```

### Phase 2: User Updates Profile in LifeSync

```
┌─────────────────────────────────┐
│ User goes to LifeSync
│ Updates profile sections
├─────────────────────────────────┤
│ - Adds work experience
│ - Adds skills
│ - Adds certifications
│ - Updates bio
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ LifeSync calculates:
├─────────────────────────────────┤
│ - New completionPercentage: 65%
│ - New trustTier: "developing"
│ - Updates lastUpdatedDate
│ - Logs activity
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Real-time Firestore Update
│ (Listener active in all apps)
├─────────────────────────────────┤
│ Writes to: lifecv/{userId}
│ Logs to: lifecvSyncLog
└────────────┬────────────────────┘
             │
             ▼
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
 [BizHelp]        [FinHelp]
  Updates         Updates
  Widget          Widget
  (Auto)          (Auto)
```

### Phase 3: Real-Time Sync Across Apps

```
Timeline:
─────────────────────────────────────────

T+0s: User updates profile in LifeSync
     ├─ Work Experience added
     └─ Skills section completed

T+100ms: Firestore listener notifies all connected apps
        ├─ BizHelp receives update
        ├─ FinHelp receives update
        ├─ SafetyHelp receives update
        └─ PigeeBack receives update

T+150ms: Each app's LifeCV widget refreshes
        ├─ Completion % updates to 65%
        ├─ Trust tier changes to "developing"
        ├─ Recent activities show new entry
        └─ User sees "Updated 3 seconds ago"

T+500ms: Full sync cycle complete
        └─ All apps display consistent data
```

---

## 📱 App-Specific Implementation

### For New Ecosystem Apps

#### 1. Installation & Setup
```typescript
// Import the shared service
import { lifecvDashboardService } from '@/services/LifeCVDashboardService';

// Initialize in your app
useEffect(() => {
  const userId = getCurrentUserId();
  lifecvDashboardService.getLifeCVProfile(userId);
}, []);
```

#### 2. Show LifeCV Status Widget (Compact)
```typescript
import { LifeCVStatus } from '@/components/lifecv/LifeCVStatus';

<LifeCVStatus
  userId={currentUser.uid}
  compact={true}
  onOpenLifeSync={() => window.open('https://lifesync-lifecv.web.app/')}
/>
```

#### 3. Setup Real-Time Sync
```typescript
useEffect(() => {
  const userId = getCurrentUserId();
  
  // Setup listener for auto-updates
  const unsubscribe = lifecvDashboardService.setupRealtimeSync(
    userId,
    (updatedProfile) => {
      // Component automatically re-renders with new data
      setProfile(updatedProfile);
    }
  );
  
  return () => unsubscribe();
}, []);
```

#### 4. Store Registration Data
```typescript
// When user registers in your app, link to LifeCV
const registerUser = async (userData: UserRegistration) => {
  // 1. Create user in your app
  const appUser = await createAppUser(userData);
  
  // 2. Fetch or create LifeCV profile
  let profile = await lifecvDashboardService.getLifeCVProfile(appUser.uid);
  if (!profile) {
    // Create default profile
    profile = await createDefaultLifeCVProfile(appUser);
  }
  
  // 3. Store app-specific registration data in LifeCV
  await updateLifeCVRegistrationData(appUser.uid, 'your-app-name', {
    registeredDate: new Date(),
    accountNumber: appUser.accountNumber,
    // ... app-specific fields
  });
};
```

---

## 🔐 Security & Privacy

### Data Access Rules

```javascript
// Firestore Rules
match /lifecv/{userId} {
  allow read: if request.auth.uid == userId 
              || hasPermission(request.auth.uid, userId, 'view');
  allow write: if request.auth.uid == userId 
               || hasRole(request.auth.uid, 'admin');
  allow create: if isNewUser(request.auth.uid);
}

match /lifecvSyncLog/{logId} {
  allow read: if request.auth.uid == resource.data.userId;
  allow write: if request.auth.uid == resource.data.userId 
               || isCloudFunction();
}
```

### Principles
- **User Ownership:** Users own their LifeCV data
- **App Access:** Apps only access their own registration data
- **Audit Trail:** All changes logged in `lifecvSyncLog`
- **GDPR Compliant:** User can request, modify, or delete profile
- **Consent-based:** Apps request permission to access full profile

---

## 📊 Monitoring & Analytics

### Key Metrics to Track

```typescript
interface LifeCVMetrics {
  // Adoption
  profilesCreated: number;
  profilesCompleted: number;         // >80% completion
  avgCompletionPercentage: number;
  
  // Trust
  avgTrustScore: number;
  trustTierDistribution: {
    unknown: number;
    emerging: number;
    developing: number;
    established: number;
    exemplary: number;
  };
  
  // Sync Performance
  avgSyncTime: number;               // milliseconds
  syncSuccessRate: number;           // percentage
  syncFailures: number;
  
  // Activity
  profileUpdatesPerDay: number;
  activeSealCount: number;
  verifiedUsersPercentage: number;
}
```

### Monitoring Dashboard
- Real-time sync health
- Profile completion trends
- Trust score distribution
- Ecosystem app adoption rates
- Sync failure alerts

---

## 🚀 Rollout Strategy

### Phase 1: Core Apps (Week 1-2)
- ✅ LifeSync (already complete)
- ⏳ Hub (integration in progress)
- ⏳ Salatiso (intranet lifecv page - THIS UPDATE)

### Phase 2: Business Apps (Week 3-4)
- BizHelp
- FinHelp
- DocHelp

### Phase 3: Community Apps (Week 5-6)
- SafetyHelp
- PigeeBack
- Ekhaya

### Phase 4: Learning (Week 7)
- Sazi.Life Academy

### Rollout Checklist per App
- [ ] Install LifeCVDashboardService
- [ ] Create UI for LifeCV widget
- [ ] Setup real-time listeners
- [ ] Store registration data
- [ ] Add LifeSync deep link button
- [ ] Test sync with LifeSync
- [ ] Deploy to staging
- [ ] UAT & validation
- [ ] Production deployment

---

## 🔗 Deep Linking Strategy

### LifeSync Links
```
// From any ecosystem app to LifeSync
https://lifesync-lifecv.web.app/?returnTo=bizhelp

// Return to app after update
https://lifesync-lifecv.web.app/?returnTo={appName}&returnUrl={url}
```

### Hub Links
```
// Central hub for all profiles
https://the-hub-lifecv.web.app/profiles/{userId}

// App-specific view
https://the-hub-lifecv.web.app/profiles/{userId}?app=bizhelp
```

---

## 📚 API Reference

### LifeCVDashboardService

```typescript
// Fetch profile
async getLifeCVProfile(userId?: string): Promise<LifeCVProfile | null>

// Real-time sync
setupRealtimeSync(userId: string, onUpdate: (profile: LifeCVProfile) => void): Unsubscribe
stopRealtimeSync(userId: string): void

// Manual sync
async triggerSync(userId: string): Promise<LifeCVSyncResult>

// Cache management
clearCache(userId: string): void
clearAllCache(): void

// Utilities
getActiveTrustSeals(profile: LifeCVProfile): TrustSeal[]
getTrustSealsByType(profile: LifeCVProfile, type: string): TrustSeal[]
getCompletionStatusMessage(percentage: number): string
getTrustTierColor(tier: string): string
formatDate(date: Date | undefined): string
```

---

## 🔄 Migration Guide

### For Existing Apps
1. **Audit Current Profile System**
   - What profile data do you store?
   - What fields are used?
   - How often does it change?

2. **Map to LifeCV Schema**
   - Map existing fields to LifeCV sections
   - Identify registration-only vs LifeCV fields

3. **Install LifeCV Service**
   - Add LifeCVDashboardService
   - Configure Firestore access
   - Setup authentication

4. **Replace Profile UI**
   - Keep app-specific registration form
   - Add LifeCV status widget
   - Link to LifeSync for full profile

5. **Deploy & Test**
   - Test with LifeSync updates
   - Verify real-time sync
   - Monitor for any issues

---

## 🛠️ Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| LifeCV widget shows "unavailable" | User not logged in | Check auth status |
| Sync doesn't update | Listener not setup | Call setupRealtimeSync |
| Old data shown | Cache not cleared | Call clearCache on logout |
| Completion % wrong | Fields not recognized | Check data structure matches schema |
| Trust seals don't show | LifeSync hasn't set them | User needs to update in LifeSync |

---

## 📞 Support & Questions

**LifeCV Architecture Lead:** [Contact Info]  
**LifeSync Team:** [Contact Info]  
**Hub Team:** [Contact Info]  

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Oct 2025 | Initial specification - Foundation for ecosystem |

---

**Document Classification:** Public - Ecosystem Apps  
**Next Review:** November 2025  
**Owner:** Architecture Team  
