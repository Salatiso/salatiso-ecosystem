# Quick LifeCV Integration Guide for Ecosystem Apps

**Purpose:** Get your app showing LifeCV status in 15 minutes  
**Audience:** Developers adding LifeCV to new ecosystem apps  
**Reference:** See `ECOSYSTEM_LIFECV_INTEGRATION_SPECIFICATION.md` for full details

---

## 🚀 5-Minute Quick Start

### Step 1: Copy the Service (1 min)
Copy `LifeCVDashboardService.ts` from Salatiso to your app:
```bash
src/services/LifeCVDashboardService.ts
```

### Step 2: Copy the Component (1 min)
Copy the LifeCV Status component:
```bash
src/components/lifecv/LifeCVStatus.tsx
```

### Step 3: Add to Your Dashboard (2 min)
```typescript
import LifeCVStatus from '@/components/lifecv/LifeCVStatus';

export const YourDashboard = () => {
  return (
    <div>
      {/* Your other dashboard content */}
      
      {/* Add LifeCV widget */}
      <LifeCVStatus
        compact={true}
        onOpenLifeSync={() => window.open('https://lifesync-lifecv.web.app/')}
      />
    </div>
  );
};
```

### Step 4: Setup Real-Time Sync (2 min)
```typescript
import { lifecvDashboardService } from '@/services/LifeCVDashboardService';
import { useEffect, useState } from 'react';

export const useLifeCVSync = (userId: string) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Setup auto-updating listener
    const unsubscribe = lifecvDashboardService.setupRealtimeSync(
      userId,
      setProfile
    );

    return () => unsubscribe();
  }, [userId]);

  return profile;
};
```

### Step 5: Build & Test (1 min)
```bash
npm run build
# Should compile with 0 errors
```

---

## 🎨 Display Options

### Option 1: Compact Widget (Recommended for Dashboards)
```typescript
<LifeCVStatus
  compact={true}
  userId={currentUser.uid}
  onOpenLifeSync={() => window.open('https://lifesync-lifecv.web.app/')}
/>
```

**What it shows:**
- Profile name
- Completion percentage (0-100%)
- Trust tier (with icon)
- Trust score
- Last update time
- "Update LifeCV" button

**Use when:** Limited dashboard space, overview needed

---

### Option 2: Full Profile View (For Dedicated Pages)
```typescript
<LifeCVStatus
  showFullDetails={true}
  userId={currentUser.uid}
  onOpenLifeSync={() => window.open('https://lifesync-lifecv.web.app/')}
/>
```

**What it shows:**
- Full profile card with avatar
- Trust tier, score, and completion
- Verification status
- All section completion states
- Trust seals list
- Recent activities
- Sync history
- Full action buttons

**Use when:** Dedicated LifeCV page or detailed view needed

---

### Option 3: Embed in Settings
```typescript
// In your settings/profile page
<div className="max-w-2xl">
  <LifeCVStatus
    compact={false}
    showFullDetails={false}
  />
</div>
```

---

## 🔗 Adding Registration Link

When user registers in your app, link to LifeSync:

```typescript
const handleRegistrationComplete = async (userData) => {
  // 1. Save user in your app
  const user = await createUser(userData);
  
  // 2. Show prompt to complete LifeCV
  showModal({
    title: "Complete Your LifeCV Profile",
    message: "Your profile is ready! Go to LifeSync to add more details.",
    buttons: [
      {
        text: "Go to LifeSync",
        onClick: () => window.open('https://lifesync-lifecv.web.app/')
      },
      {
        text: "Later",
        onClick: () => { /* close modal */ }
      }
    ]
  });
};
```

---

## 📊 Displaying Trust Tier

The component automatically handles trust tier styling:

```
Unknown  →  ○  (gray)
Emerging →  ◐  (blue)  
Developing → ◑ (cyan)
Established → ◕ (green)
Exemplary → ● (amber)
```

To use in your own components:

```typescript
import { lifecvDashboardService } from '@/services/LifeCVDashboardService';

const TrustBadge = ({ trustTier }) => {
  const { label, color } = getTrustTierConfig(trustTier);
  
  return (
    <div className={`px-3 py-1 rounded-full ${color}`}>
      {lifecvDashboardService.getTrustTierBadge(trustTier)} {label}
    </div>
  );
};
```

---

## 🔄 Real-Time Sync Examples

### Auto-Update Dashboard
```typescript
export const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const userId = getCurrentUserId();

  useEffect(() => {
    // This listener automatically updates whenever LifeSync changes the profile
    return lifecvDashboardService.setupRealtimeSync(userId, setProfile);
  }, [userId]);

  if (!profile) return <Loading />;

  return (
    <div>
      <h2>Welcome, {profile.displayName}</h2>
      <p>Profile Completion: {profile.completionPercentage}%</p>
      <p>Trust Score: {profile.trustScore}</p>
    </div>
  );
};
```

### Listen & React to Changes
```typescript
export const TrustIndicator = ({ userId }) => {
  const [trustTier, setTrustTier] = useState('unknown');

  useEffect(() => {
    return lifecvDashboardService.setupRealtimeSync(userId, (profile) => {
      setTrustTier(profile.trustTier);
      
      // React to changes
      if (profile.trustTier === 'established' && trustTier !== 'established') {
        showNotification('Congratulations! You reached Established trust tier!');
      }
    });
  }, [userId, trustTier]);

  return <TrustBadge tier={trustTier} />;
};
```

---

## 🛡️ Security Best Practices

### 1. Only Load for Authenticated Users
```typescript
const LifeCVWidget = ({ userId }) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    return <div>Please log in</div>;
  }
  
  if (currentUser.uid !== userId) {
    return <div>Cannot view other users' profiles</div>;
  }
  
  return <LifeCVStatus userId={userId} />;
};
```

### 2. Handle Firestore Errors Gracefully
```typescript
useEffect(() => {
  lifecvDashboardService.getLifeCVProfile(userId)
    .then(profile => {
      if (!profile) {
        setError('Profile not found');
      } else {
        setProfile(profile);
      }
    })
    .catch(err => {
      console.error('Error loading profile:', err);
      setError('Failed to load LifeCV profile');
    });
}, [userId]);
```

### 3. Cleanup Listeners on Unmount
```typescript
useEffect(() => {
  const unsubscribe = lifecvDashboardService.setupRealtimeSync(userId, setProfile);
  
  return () => {
    unsubscribe();  // IMPORTANT: Cleanup listener
    lifecvDashboardService.clearCache(userId);
  };
}, [userId]);
```

---

## 🧪 Testing Checklist

Before deploying, test:

- [ ] **Component Loads**
  - ` LifeCVStatus shows without errors
  - No console errors

- [ ] **Real-Time Sync Works**
  - Update profile in LifeSync
  - Widget updates within 1 second
  - No manual refresh needed

- [ ] **Links Work**
  - "Update LifeCV" button opens LifeSync
  - Sync button refreshes data

- [ ] **Error Handling**
  - Show error if user not logged in
  - Show error if profile fetch fails
  - Graceful degradation

- [ ] **Performance**
  - Component renders quickly (< 500ms)
  - No memory leaks
  - Listeners cleanup on unmount

---

## 🚨 Common Issues

### Widget shows "Profile Unavailable"
**Cause:** User not authenticated  
**Fix:** Check auth.currentUser exists

### Profile data is stale
**Cause:** Real-time listener not setup  
**Fix:** Call setupRealtimeSync in useEffect

### Listener doesn't auto-update
**Cause:** Listener callback not firing  
**Fix:** Check Firestore rules allow read access

### Memory leak warning
**Cause:** Listener not unsubscribed  
**Fix:** Return unsubscribe function from useEffect

---

## 📞 Need Help?

1. **Check the Full Spec:**  
   `ECOSYSTEM_LIFECV_INTEGRATION_SPECIFICATION.md`

2. **Reference Implementation:**  
   `src/pages/intranet/lifecv.tsx` in Salatiso-React-App

3. **Service Documentation:**  
   Inline comments in `LifeCVDashboardService.ts`

---

## 🎯 Integration Checklist

- [ ] LifeCVDashboardService installed
- [ ] LifeCVStatus component available
- [ ] Dashboard shows LifeCV widget
- [ ] Real-time sync working
- [ ] Links to LifeSync functional
- [ ] Error handling in place
- [ ] Tested with LifeSync updates
- [ ] Performance validated
- [ ] Security rules reviewed
- [ ] Ready for production

**Estimated Time: 15-30 minutes**

---

**Version:** 1.0  
**Last Updated:** October 2025  
**Maintained By:** Architecture Team
