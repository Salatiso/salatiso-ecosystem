# 🚀 FIREBASE DEPLOYMENT PROCEDURES - PHASE 1

**October 23, 2025 | Step-by-Step Deployment Guide**

---

## 📋 DEPLOYMENT OVERVIEW

This guide provides **exact step-by-step procedures** for deploying the Calendar Enhancement system to Firestore in a safe, verifiable manner.

**Timeline:** Oct 23-24 (2 days)
**Risk Level:** 🟢 LOW (non-breaking changes, 100% backward compatible)
**Rollback:** Possible (see rollback section)

---

## ⚠️ PRE-DEPLOYMENT CHECKLIST

Before starting deployment, verify:

- [ ] All tests passing locally: `npm test`
- [ ] Build succeeds without errors: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Firebase CLI installed: `firebase --version`
- [ ] Firebase project ID available
- [ ] Staging environment ready
- [ ] Team notified of deployment window
- [ ] Backup of current Firestore rules created

---

## 🔑 STEP 1: SETUP & AUTHENTICATION (10 minutes)

### 1.1 Install Firebase CLI (if not already installed)

```powershell
# PowerShell
npm install -g firebase-tools

# Verify installation
firebase --version
# Expected output: Firebase CLI version X.X.X
```

### 1.2 Authenticate with Firebase

```powershell
# Login to Google account
firebase login

# You'll be redirected to browser for Google Sign-In
# Approve the Firebase CLI access request
```

### 1.3 Select Firebase Project

```powershell
# List available projects
firebase projects:list

# Output example:
# ✓ salatiso-calendar (salatiso-calendar)
# ✓ my-staging-project (my-staging-project)
```

### 1.4 Set Project for Deployment

```powershell
# Option 1: Interactive selection
firebase use --add

# Option 2: Direct project selection
firebase use salatiso-calendar
```

**Verification:**
```powershell
# Check current project
firebase projects:list | grep '*'
# Should show selected project marked with asterisk
```

---

## 📋 STEP 2: VERIFY FIRESTORE SETUP (15 minutes)

### 2.1 Check Firestore Database Exists

```powershell
# Go to Firebase Console:
# https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore

# Navigate to:
# Firestore Database > Data

# You should see existing collections:
# - family
# - business
# - projects
# - documents
# - users
# - contacts
# - presence
```

### 2.2 Backup Current Security Rules

```powershell
# Export current rules
firebase firestore:get-config > firestore.rules.backup-$(Get-Date -Format 'yyyy-MM-dd-HHmmss').rules

# Verify backup created
ls firestore.rules.backup-*.rules
# Example output: firestore.rules.backup-2025-10-23-143000.rules
```

### 2.3 Dry Run: Test New Rules (IMPORTANT!)

```powershell
# Test rules without deploying
firebase firestore:get-config

# Now check our new rules have correct syntax
# Review src/services/firebaseCalendarService.ts integration patterns
```

---

## 🔐 STEP 3: DEPLOY FIRESTORE SECURITY RULES (5 minutes)

### 3.1 Review Updated Rules

```powershell
# Display the new rules that will be deployed
Get-Content firestore.rules | head -100

# Verify key sections present:
# - isEventOrganizer() function
# - hasRoleInEvent() function
# - events collection rules
# - assistance_requests collection rules
# - escalations collection rules
# - audit_log collection rules
```

### 3.2 Deploy Rules to Firestore

```powershell
# Deploy only Firestore rules (not hosting, functions, etc)
firebase deploy --only firestore:rules

# Process should take 1-2 minutes
```

**Expected Output:**
```powershell
i  deploying firestore
i  cloud firestore index definitions.
✔  firestore:rules deployed successfully

Project Console: https://console.firebase.google.com/project/YOUR_PROJECT_ID
Firestore Security Rules URL: https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore/rules
```

### 3.3 Verify Rules Deployed

```powershell
# Check deployed rules
firebase firestore:get-config

# Should show our new rules with calendar event sections
```

---

## 📊 STEP 4: CREATE FIRESTORE COLLECTIONS (10 minutes)

Collections are automatically created when first document written, but we can initialize them manually.

### 4.1 Create Events Collection

**Via Firebase Console:**
1. Go to Firestore Database
2. Click "+ Start collection"
3. Collection ID: `events`
4. Click "Next"
5. Add sample document (or skip)

**Via Firebase CLI:**
```powershell
# Create collection with a sample document
firebase firestore:delete events --yes

# The collection will be auto-created on first write
```

### 4.2 Create Assistance Requests Collection

**Via Firebase Console:**
1. Click "+ Start collection"
2. Collection ID: `assistance_requests`
3. Click "Next"

### 4.3 Create Escalations Collection

**Via Firebase Console:**
1. Click "+ Start collection"
2. Collection ID: `escalations`
3. Click "Next"

### 4.4 Create Audit Log Collection

**Via Firebase Console:**
1. Click "+ Start collection"
2. Collection ID: `audit_log`
3. Click "Next"

**Verification:**
```powershell
# All collections should now appear in Firestore Console under Data tab
# Collections created:
# ✓ events
# ✓ assistance_requests
# ✓ escalations
# ✓ audit_log
```

---

## 🔍 STEP 5: CONFIGURE INDEXES (Optional, but Recommended)

### 5.1 Create Recommended Indexes

Firestore will suggest indexes based on queries. You can create them proactively:

**Via Firebase Console:**
1. Go to Firestore > Indexes
2. Click "Create Index"
3. Add these composite indexes:

```
Index 1:
  Collection: events
  Fields: context (Asc), dateTime (Desc)
  
Index 2:
  Collection: events
  Fields: status (Asc), updatedAt (Desc)
  
Index 3:
  Collection: assistance_requests
  Fields: requestedBy (Asc), requestedAt (Desc)
  
Index 4:
  Collection: assistance_requests
  Fields: status (Asc), updatedAt (Desc)
  
Index 5:
  Collection: escalations
  Fields: eventId (Asc), escalatedAt (Desc)
  
Index 6:
  Collection: escalations
  Fields: resolved (Asc), updatedAt (Desc)
```

**Status:** These will auto-create as queries are executed if not manually created

---

## 💻 STEP 6: UPDATE APPLICATION IMPORTS (10 minutes)

### 6.1 Update Hook Imports

In `src/hooks/useRoleAssignment.ts`:
```typescript
// OLD
import CalendarService from '@/services/CalendarService';

// NEW
import FirebaseCalendarService from '@/services/firebaseCalendarService';
```

### 6.2 Update Component Imports

In components that use calendar service:
```typescript
// OLD
import CalendarService from '@/services/CalendarService';

// NEW
import FirebaseCalendarService from '@/services/firebaseCalendarService';
```

### 6.3 Update Service References

Replace all calls:
```typescript
// OLD
const event = await CalendarService.createEvent(data);

// NEW
const event = await FirebaseCalendarService.createEvent(data);
```

### 6.4 Verify TypeScript Compilation

```powershell
# Check for TypeScript errors
npm run type-check

# Should output: No errors found
# If errors: Fix them before proceeding
```

---

## ✅ STEP 7: TESTING IN DEVELOPMENT (15 minutes)

### 7.1 Start Development Server

```powershell
# Clear build cache
rm -r .next -Force -ErrorAction SilentlyContinue

# Start dev server
npm run dev

# Server should start on http://localhost:3000
```

### 7.2 Test Firebase Connection

**Create a test page:**

```typescript
// pages/test-firebase.tsx
import { useEffect, useState } from 'react';
import FirebaseCalendarService from '@/services/firebaseCalendarService';

export default function TestFirebase() {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test 1: Create event
      const event = await FirebaseCalendarService.createEvent({
        title: 'Test Event',
        description: 'Testing Firebase integration',
        dateTime: new Date(),
        location: 'Test Location',
        type: 'activity' as const,
        category: 'family_time' as const,
        context: 'family' as const,
        visibility: ['family' as const],
        organizer: 'test_user_id',
        roles: [],
        assistanceRequests: [],
        polls: [],
        comments: [],
        status: 'planned' as const,
        statusHistory: [],
        escalationPath: [],
        auditTrail: []
      });

      setStatus(`✅ Event created: ${event.id}`);
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return <div>{status}</div>;
}
```

**Navigate to:** `http://localhost:3000/test-firebase`

**Expected Result:** ✅ Event created with ID

### 7.3 Check Browser Console

```javascript
// Should see logs like:
[FirebaseCalendarService] Event created: event_1729614000000_abc123
```

### 7.4 Verify in Firebase Console

1. Go to Firebase Console > Firestore > Data
2. Click "events" collection
3. Should see test document with your data

---

## 🌐 STEP 8: DEPLOY TO STAGING (20 minutes)

### 8.1 Build for Production

```powershell
# Create production build
npm run build

# Expected output:
# ✓ compiled successfully
# ✓ All pages generated
```

### 8.2 Deploy to Firebase Hosting (Staging)

```powershell
# Deploy to staging target
firebase deploy --only hosting:salatiso-lifecv --project salatiso-calendar

# Process takes 2-5 minutes
```

**Expected Output:**
```powershell
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/YOUR_PROJECT_ID
Hosting URL: https://salatiso-calendar.web.app
```

### 8.3 Test Staging Deployment

```powershell
# Visit staging site
start https://salatiso-calendar.web.app

# Test flows:
# 1. Create event
# 2. Assign role
# 3. Log incident
# 4. Create assistance request
# 5. Verify real-time updates
```

### 8.4 Monitor for Errors

```powershell
# Check Firebase console for errors
# Monitor > Logging

# Should see:
# - INFO: [FirebaseCalendarService] Event created: ...
# - INFO: [FirebaseCalendarService] Subscribed to event updates: ...

# Should NOT see:
# - ERROR: Permission denied
# - ERROR: Collection not found
# - ERROR: Firestore connection failed
```

---

## 🐛 STEP 9: VERIFY SECURITY RULES WORK (10 minutes)

### 9.1 Test Permission Enforcement

```typescript
// Test: Non-organizer cannot delete event
const eventId = 'event_from_other_user';
try {
  await FirebaseCalendarService.deleteEvent(eventId);
  // Should fail with permission-denied error
} catch (error) {
  if (error.code === 'permission-denied') {
    console.log('✅ Security rules working: Permission denied');
  }
}
```

### 9.2 Test Role-Based Access

```typescript
// Test: User without role cannot edit event
const eventId = 'event_without_role';
try {
  await FirebaseCalendarService.updateEvent(eventId, { title: 'New Title' }, userId);
  // Should fail with permission-denied error
} catch (error) {
  if (error.code === 'permission-denied') {
    console.log('✅ Security rules working: Role check enforced');
  }
}
```

### 9.3 Test Audit Logging

```typescript
// Verify audit trail entry created
// Check Firebase Console > Firestore > audit_log collection
// Should see entries for each operation with:
// - action: 'event_created', 'role_assigned', etc
// - userId: current user
// - timestamp: operation time
// - metadata: operation details
```

---

## 📈 STEP 10: PERFORMANCE BASELINE (15 minutes)

### 10.1 Load Testing

```powershell
# Use Artillery for load testing (optional)
npm install -g artillery

# Create load-test.yml
$yaml = @"
config:
  target: 'https://salatiso-calendar.web.app'
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 300
      arrivalRate: 10
      name: "Sustained load"
scenarios:
  - name: "Calendar API"
    flow:
      - get:
          url: "/api/events"
      - think: 5
      - post:
          url: "/api/events"
"@

# Run load test
# artillery run load-test.yml
```

### 10.2 Monitor Firestore Metrics

**Firebase Console > Monitoring:**
1. Read operations: < 1000/sec ✓
2. Write operations: < 100/sec ✓
3. Query latency: < 100ms avg ✓
4. Error rate: < 0.1% ✓

### 10.3 Document Baseline

```powershell
# Record metrics for comparison
$metrics = @{
  timestamp = Get-Date
  reads_per_sec = 500
  writes_per_sec = 50
  avg_latency_ms = 45
  error_rate = 0.05
}

$metrics | ConvertTo-Json | Out-File 'baseline-metrics.json'
```

---

## ✅ STEP 11: SIGN-OFF CHECKLIST

Before moving to production, verify all checks:

**Firebase Setup:**
- [ ] Firestore database initialized
- [ ] Collections created (events, assistance_requests, escalations, audit_log)
- [ ] Security rules deployed
- [ ] Indexes created (if needed)

**Application:**
- [ ] Imports updated to use FirebaseCalendarService
- [ ] TypeScript compilation successful
- [ ] Development server working
- [ ] Production build successful

**Testing:**
- [ ] Firebase connection test passed
- [ ] Create event test passed
- [ ] Security rules enforced
- [ ] Real-time subscriptions working
- [ ] Staging deployment successful
- [ ] Performance baseline recorded

**Monitoring:**
- [ ] Logging enabled
- [ ] Error tracking enabled
- [ ] Metrics collected
- [ ] Alerts configured

---

## 🔄 ROLLBACK PROCEDURE (If Needed)

### Rollback from Firestore

```powershell
# Restore previous Firestore rules
firebase firestore:set --import firestore.rules.backup-2025-10-23-143000.rules

# OR manually restore from Firebase Console:
# 1. Go to Firestore > Rules tab
# 2. Click "Delete" on current version
# 3. Copy-paste previous rules from backup file
# 4. Click "Publish"
```

### Rollback from Code

```powershell
# If needed, revert to previous commit
git revert HEAD
npm run build
firebase deploy --only hosting:salatiso-lifecv
```

---

## 📊 DEPLOYMENT TIMELINE

```
Timeline for Oct 23-24 (2 days)

Oct 23 (Day 1):
  08:00 - Pre-deployment checklist
  08:15 - Firebase authentication
  08:30 - Verify Firestore setup
  08:45 - Deploy security rules
  09:15 - Create collections
  09:45 - Configure indexes (optional)
  10:00 - Update application imports
  10:15 - Test in development
  11:00 - Deploy to staging

Oct 24 (Day 2):
  09:00 - Verify security rules
  09:30 - Performance baseline
  10:00 - Staging testing complete
  10:30 - Solo's testing prep
  11:00 - Ready for Level 2 testing (Oct 28)
```

---

## 🎯 SUCCESS CRITERIA

✅ **Deployment Successful When:**

- ✅ Firestore rules deployed
- ✅ All collections created
- ✅ Application connects to Firestore
- ✅ Create/Read/Update operations working
- ✅ Real-time subscriptions active
- ✅ Security rules enforced
- ✅ Audit trail recording
- ✅ Performance meets baseline
- ✅ Zero errors in production
- ✅ Staging deployment successful

---

## 📞 TROUBLESHOOTING

### Issue: "Permission denied" error

```
Cause: Security rules blocking access
Solution:
1. Check user has correct role
2. Verify eventId is correct
3. Review security rules in firestore.rules
4. Check browser console for auth errors
```

### Issue: "Collection not found"

```
Cause: Collection doesn't exist
Solution:
1. Create collection via Firebase Console
2. Write first document to auto-create
3. Verify collection name spelled correctly
```

### Issue: Real-time updates not working

```
Cause: Listener not active or disconnected
Solution:
1. Check network connection
2. Verify listener not unsubscribed
3. Check browser console for errors
4. Restart development server
```

### Issue: Staging deployment fails

```
Cause: Build errors or configuration issues
Solution:
1. Run: npm run build
2. Check for TypeScript errors
3. Verify Firebase project selected
4. Check Firebase CLI authentication
```

---

## 📚 DOCUMENTATION

**Related Documents:**
- ✅ FIREBASE_INTEGRATION_GUIDE.md - Integration overview
- ✅ firebaseCalendarService.ts - Service implementation
- ✅ firestore.rules - Security rules
- ✅ SOLOS_L2_TESTING_GUIDE.md - Testing guide

**External Resources:**
- [Firebase Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/start)

---

## ✅ NEXT STEPS

### When Deployment Complete:
1. ✅ Document deployment time and metrics
2. ✅ Update team on completion
3. ✅ Monitor for issues in first 24 hours
4. ⏳ Prepare for Solo's Level 2 testing (Oct 28)
5. ⏳ Create post-deployment summary

---

*Firebase Deployment Procedures | Phase 1 Calendar Enhancement | October 23, 2025*
