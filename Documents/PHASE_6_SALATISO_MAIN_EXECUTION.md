# 🚀 Phase 6 - Salatiso Main Replication: Complete Execution Guide

## Current Date: October 23, 2025
## Status: STARTING REPLICATION

---

## 📋 Phase 6 Files to Copy (10 Total)

### 🔧 Services (3 Files - 1,580 lines)
1. **BridgeService.ts** (485 lines) - Mobile bridge sync
2. **OfflineQueueManager.ts** (550 lines) - Offline persistence
3. **MeshNetworkManager.ts** (650 lines) - Network coordination

### 💼 Analytics Files (2 Files - 778 lines)
4. **ExportManager.ts** (320 lines) - CSV/Excel export
5. **InsightsDashboard.tsx** (458 lines) - Analytics UI

### 🤝 Collaboration Files (2 Files - 787 lines)
6. **CommentsThread.tsx** (470 lines) - Comments system
7. **ActivityFeed.tsx** (317 lines) - Activity stream

### 🧠 AI Files (2 Files - 810 lines)
8. **AIService.ts** (550 lines) - AI backend
9. **SmartInput.tsx** (260 lines) - AI-powered input

### ⚙️ Support Files (1 File - 342 lines)
10. **PresenceService.ts** (342 lines) - User presence tracking

---

## ✅ Step-by-Step Execution

### STEP 1: Locate Salatiso Main App (30 mins)

**Question 1**: Where is the Salatiso Main App repository?
- [ ] Same folder as MNI? (d:\WebSites\salatiso-ecosystem\Salatiso-Main\)
- [ ] Different location? (Please specify)
- [ ] Need to create new GitHub repo first?

**Once confirmed, we'll**:
1. Verify Salatiso Main project structure
2. Check Firebase config for Salatiso Main
3. Confirm Firestore database name

---

### STEP 2: Copy Phase 6 Services to Salatiso Main

**Files to copy**:
```
MNI/src/services/BridgeService.ts
MNI/src/services/OfflineQueueManager.ts
MNI/src/services/MeshNetworkManager.ts
MNI/src/services/PresenceService.ts
MNI/src/services/AIService.ts
MNI/src/services/ExportManager.ts
```

**Copy to**:
```
Salatiso-Main/src/services/
```

**Validation**: No TypeScript errors in new services

---

### STEP 3: Copy Phase 6 Components

**Analytics Components**:
```
MNI/src/components/analytics/InsightsDashboard.tsx
```

**Collaboration Components**:
```
MNI/src/components/collaboration/CommentsThread.tsx
MNI/src/components/collaboration/ActivityFeed.tsx
```

**AI Components**:
```
MNI/src/components/ai/SmartInput.tsx
```

**Copy to**: Salatiso-Main with same folder structure

---

### STEP 4: Customize Analytics for Salatiso Main

**Edit**: `InsightsDashboard.tsx`

**Change from MNI metrics**:
```typescript
// MNI (Family)
- Family Members: 5
- Incidents: 24
- Response Time: 15 mins
- Trust Score: 94%
```

**To Salatiso Main metrics**:
```typescript
// Salatiso Main (Content Platform)
- Total Users: XXX,XXX
- Content Items: XX,XXX
- Engagement Rate: XX%
- Avg Session: XX mins
- Return Rate: XX%
```

**Action Required**: What should the KPIs be for Salatiso Main?

---

### STEP 5: Create/Update Firestore Collections

**Run in Firebase Console**:
```
1. Create collection: comments
2. Create collection: activity_feed
3. Create collection: presence
4. Create collection: exports
5. Create collection: ai_suggestions
```

**Alternative - Add to firestore.rules**:
```javascript
match /comments/{commentId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow update: if request.auth.uid == resource.data.userId;
  allow delete: if request.auth.uid == resource.data.userId || isAdmin();
}

match /activity_feed/{activityId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
}

match /presence/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == userId;
}

match /exports/{exportId} {
  allow read: if request.auth.uid == resource.data.userId;
  allow create: if request.auth != null;
}

match /ai_suggestions/{suggestionId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
}
```

---

### STEP 6: Update Salatiso Main Firestore Rules

**Deploy**:
```bash
firebase deploy --only firestore:rules --project salatiso-main
```

---

### STEP 7: Create Firestore Indexes

**Via Firebase Console** or `firestore.indexes.json`:
```json
{
  "indexes": [
    {
      "collectionGroup": "comments",
      "queryScope": "Collection",
      "fields": [
        { "fieldPath": "documentId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "activity_feed",
      "queryScope": "Collection",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

### STEP 8: Add Components to Salatiso Main Pages

**Analytics**:
- Add `<InsightsDashboard />` to `/dashboard` page
- Add export button to reporting section

**Comments**:
- Add `<CommentsThread />` to content detail pages
- Example: `/content/[id]` or `/articles/[id]`

**Activity Feed**:
- Add `<ActivityFeed />` to dashboard
- Show recent activities

**Smart Input**:
- Add `<SmartInput />` to search/create forms
- Enable AI suggestions

---

### STEP 9: Build & Test on Staging

```bash
cd Salatiso-Main
npm run build
npm run dev  # or local staging server
```

**Test Checklist**:
- [ ] Analytics page loads
- [ ] KPIs show correct data
- [ ] Comments can be posted
- [ ] Activity feed updates in real-time
- [ ] AI suggestions appear
- [ ] Export works
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Mobile responsive

---

### STEP 10: Deploy to Staging

```bash
firebase deploy --project salatiso-main-staging
```

**Staging URL**: `https://salatiso-main-staging.web.app`

---

### STEP 11: Family Testing (1-2 hours)

**Send to family**:
- Link to staging
- Testing checklist
- Issue reporting template

**Gather Feedback**:
- [ ] What works well?
- [ ] What's confusing?
- [ ] Any bugs?
- [ ] Performance acceptable?

---

### STEP 12: Fix Issues & Deploy to Production

```bash
# After fixes
npm run build
firebase deploy --project salatiso-main
```

---

## 🎯 Success Criteria - BEFORE MOVING TO BRIDGE

✅ **Code**:
- [ ] All 10 Phase 6 files copied
- [ ] No TypeScript errors
- [ ] Components integrate into pages
- [ ] No console errors

✅ **Firestore**:
- [ ] 5 new collections created
- [ ] Security rules deployed
- [ ] Indexes created
- [ ] Real-time listeners work

✅ **Testing**:
- [ ] Staging deployment successful
- [ ] All features functional
- [ ] Family tested and approved
- [ ] No performance issues

✅ **Production**:
- [ ] Deployed to salatiso-main.web.app
- [ ] Monitoring active
- [ ] Backup tested

---

## 📊 Timeline

| Task | Time | Owner |
|------|------|-------|
| Step 1-3: Copy files | 30 mins | You |
| Step 4: Customize | 30 mins | You |
| Step 5-7: Firestore | 30 mins | You |
| Step 8: Page integration | 1 hour | You |
| Step 9-10: Build & deploy | 30 mins | You |
| Step 11: Family testing | 2 hours | Family |
| Step 12: Production | 30 mins | You |
| **TOTAL** | **~5 hours** | |

---

## 🆘 Common Issues & Fixes

### Issue: "Cannot find module 'BridgeService'"
**Solution**: Verify file was copied to correct path
```bash
ls -la src/services/BridgeService.ts
```

### Issue: Firestore permission denied
**Solution**: Check security rules deployed correctly
```bash
firebase rules:list --project salatiso-main
```

### Issue: Performance slow
**Solution**: Add Firestore indexes
- [ ] Check missing indexes in Firebase console
- [ ] Create missing indexes
- [ ] Wait 5-10 mins for indexing

### Issue: Real-time updates not working
**Solution**: Verify real-time listeners
```typescript
// Check in browser console
db.collection('comments').onSnapshot(snapshot => {
  console.log('Updates:', snapshot.docs.length);
});
```

---

## 🚀 Next: Ready for Phase 7

**Once Salatiso Main is production-ready**, we move to:
1. **Bridge Site Adaptation** (2-3 days)
2. **Sonny Android Preparation** (3-5 days)
3. **Production Deployment** (1 day)
4. **Phase 7 Features** (New features!)

---

## ⏰ TIME TO START: ~15 seconds

**First Action**: Tell me the location of Salatiso Main App 👇
