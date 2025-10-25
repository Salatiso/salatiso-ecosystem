# Android App Specification - Updated
## Salatiso Mobile Platform - Offline-First Architecture

**Document Version:** 3.0 - Architecture Aligned  
**Created:** October 22, 2025  
**Platform:** Android 8.0+ (API Level 26+)  
**Development Framework:** React Native + TypeScript  
**Status:** Ready for Development (Q4 2025)

---

## 1. ARCHITECTURE ALIGNMENT

### 1.1 Platform Comparison

| Feature | Web App | Android | Google TV | Homestead |
|---------|---------|---------|-----------|-----------|
| **Offline Capability** | ❌ None | ✅ Full SQLite | ✅ Full SQLite | ✅ Full SQLite |
| **Push Notifications** | ❌ Disabled | ✅ FCM Enabled | ✅ FCM Enabled | ✅ FCM Enabled |
| **Background Services** | ❌ No | ✅ Yes | ⚠️ Limited | ✅ Yes |
| **Local Cache** | ❌ Session only | ✅ SQLite | ✅ SQLite | ✅ SQLite |
| **Sync Queue** | N/A | ✅ Auto-sync | ✅ Auto-sync | ✅ Auto-sync |
| **Feature Parity** | ✅ Full (online) | ✅ Full (always) | ✅ Full (always) | ✅ Full (always) |
| **Development Status** | ✅ Production | ⏳ Q4 2025 | ⏳ Q1 2026 | ⏳ Q1 2026 |

### 1.2 Key Principle

**Native apps enable features that web cannot support:**
- Offline-first architecture (SQLite local cache)
- Push notifications (Firebase Cloud Messaging)
- Background services (geofencing, check-in)
- Local notifications (no internet needed)
- Enhanced security (encrypted storage)

---

## 2. ANDROID ARCHITECTURE

### 2.1 Technology Stack

```typescript
{
  "framework": "React Native 0.73+",
  "language": "TypeScript 5.x",
  "build_system": "Expo EAS or bare RN",
  "state_management": "Redux / Zustand",
  "async_storage": "SQLite (offline cache)",
  
  "firebase": {
    "auth": "react-native-firebase/auth",
    "firestore": "react-native-firebase/firestore",
    "messaging": "react-native-firebase/messaging (FCM)",
    "storage": "react-native-firebase/storage"
  },
  
  "native_modules": {
    "bluetooth": "react-native-ble-plx",
    "wifi_direct": "react-native-wifi-p2p",
    "geolocation": "react-native-geolocation-service",
    "background_tasks": "@react-native-community/hooks",
    "notifications": "react-native-push-notification",
    "encryption": "react-native-encrypted-storage"
  },
  
  "ui_libraries": {
    "navigation": "React Navigation 6+",
    "animations": "Reanimated 3+",
    "components": "React Native Paper or NativeBase",
    "icons": "react-native-vector-icons"
  }
}
```

### 2.2 Data Architecture (Offline-First)

```
┌─────────────────────────────────────┐
│     User Interface Layer             │
│  (React Native Components)           │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │ State Layer │  (Redux/Zustand)
        └──────┬──────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────────┐      ┌─────▼──────────┐
│   SQLite   │      │ Firebase API   │
│  (Local)   │      │   (Remote)     │
└───┬────────┘      └─────┬──────────┘
    │                     │
    │  ┌──────────────────┘
    │  │
┌───▼──▼────────────────┐
│  Sync Engine           │
│  - Conflict detection  │
│  - Queue management    │
│  - Timestamp handling  │
└───┬─────────────────────┘
    │
    └─ Network Check
       └─ If online: Sync
       └─ If offline: Queue
```

### 2.3 Data Flow

**Case 1: Online - User Creates Project**
```
User enters project name
    ↓
Submit in UI
    ↓
Write to SQLite (immediate feedback)
    ↓ (parallel)
Queue sync to Firebase
    ↓
Network available → POST to Firestore
    ↓
Firebase updates timestamp
    ↓
FCM notifies other family members
    ↓
✅ Complete
```

**Case 2: Offline - User Creates Project**
```
User enters project name
    ↓
Submit in UI
    ↓
Write to SQLite (immediate feedback)
    ↓
Add to Sync Queue
    ↓
Show "Offline - Will sync when connected"
    ↓
User continues working locally
    ↓
[Later] Connection restored
    ↓
Sync queue processes
    ↓
POST all queued items to Firestore
    ↓
FCM notifies others
    ↓
✅ Synced
```

---

## 3. OFFLINE-FIRST IMPLEMENTATION

### 3.1 SQLite Schema

```sql
-- Users Table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT,
  profile_data JSON,
  last_synced INTEGER,
  created_at INTEGER,
  updated_at INTEGER
);

-- Family Members
CREATE TABLE family_members (
  id TEXT PRIMARY KEY,
  family_id TEXT,
  user_id TEXT,
  relationship TEXT,
  email TEXT,
  name TEXT,
  last_synced INTEGER,
  created_at INTEGER,
  updated_at INTEGER,
  FOREIGN KEY(family_id) REFERENCES users(id)
);

-- Projects
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  family_id TEXT,
  title TEXT,
  description TEXT,
  status TEXT,
  progress REAL,
  data JSON,
  last_synced INTEGER,
  created_at INTEGER,
  updated_at INTEGER,
  FOREIGN KEY(family_id) REFERENCES users(id)
);

-- Documents
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  family_id TEXT,
  title TEXT,
  content TEXT,
  file_path TEXT,
  last_synced INTEGER,
  created_at INTEGER,
  updated_at INTEGER,
  FOREIGN KEY(family_id) REFERENCES users(id)
);

-- Events
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  family_id TEXT,
  title TEXT,
  description TEXT,
  start_date INTEGER,
  end_date INTEGER,
  event_data JSON,
  last_synced INTEGER,
  created_at INTEGER,
  updated_at INTEGER,
  FOREIGN KEY(family_id) REFERENCES users(id)
);

-- Sync Queue (pending operations)
CREATE TABLE sync_queue (
  id TEXT PRIMARY KEY,
  operation TEXT, -- 'create', 'update', 'delete'
  collection TEXT, -- 'projects', 'documents', etc.
  document_id TEXT,
  data JSON,
  status TEXT, -- 'pending', 'syncing', 'failed'
  retry_count INTEGER,
  last_attempt INTEGER,
  error_message TEXT,
  created_at INTEGER
);

-- Encryption Keys
CREATE TABLE encryption_keys (
  id TEXT PRIMARY KEY,
  device_id TEXT,
  public_key TEXT,
  private_key TEXT (encrypted),
  key_rotation_date INTEGER,
  algorithm TEXT
);

-- Audit Log
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  timestamp INTEGER,
  action TEXT,
  user_id TEXT,
  before_data JSON,
  after_data JSON,
  synced BOOLEAN
);
```

### 3.2 Sync Engine Implementation

```typescript
// services/SyncEngine.ts

export class SyncEngine {
  private db: SQLiteDatabase;
  private queue: SyncQueue[] = [];
  private isOnline = false;
  
  // Monitor network status
  monitorNetwork() {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected && state.isInternetReachable;
      
      if (wasOffline && this.isOnline) {
        // Transitioned from offline to online
        this.processQueueWhenOnline();
      }
    });
  }
  
  // Write operation (user action)
  async writeProject(data: ProjectData) {
    // 1. Write to SQLite immediately
    const id = uuid.v4();
    const timestamp = Date.now();
    
    await this.db.runAsync(
      `INSERT INTO projects (id, family_id, title, description, status, 
       progress, data, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.familyId, data.title, data.description, 'draft', 0, 
       JSON.stringify(data), timestamp, timestamp]
    );
    
    // 2. Add to sync queue
    await this.addToQueue({
      operation: 'create',
      collection: 'projects',
      documentId: id,
      data: data,
      timestamp: timestamp
    });
    
    // 3. Try sync if online
    if (this.isOnline) {
      this.syncToFirebase('projects', id, data);
    } else {
      // Show offline banner
      return { id, status: 'pending', message: 'Offline - Will sync when connected' };
    }
    
    return { id, status: 'synced' };
  }
  
  // Sync queue processing
  async processQueueWhenOnline() {
    console.log('🔄 Online detected - processing sync queue...');
    
    const pending = await this.db.getAllAsync(
      `SELECT * FROM sync_queue WHERE status = 'pending' 
       ORDER BY created_at ASC LIMIT 50`
    );
    
    for (const item of pending) {
      try {
        await this.markAsSyncing(item.id);
        
        // Sync to Firebase
        const response = await this.syncToFirebase(
          item.collection,
          item.document_id,
          item.data
        );
        
        // Mark as synced
        await this.markAsSynced(item.id);
        
      } catch (error) {
        await this.markAsFailed(item.id, error.message);
      }
    }
  }
  
  // Sync single item to Firebase
  private async syncToFirebase(
    collection: string,
    docId: string,
    data: any
  ) {
    const firestore = getFirestore();
    
    // Get reference
    const docRef = doc(firestore, collection, docId);
    
    // Check if exists
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Update existing
      await updateDoc(docRef, {
        ...data,
        synced_at: serverTimestamp(),
        platform: 'android'
      });
    } else {
      // Create new
      await setDoc(docRef, {
        ...data,
        created_by: auth.currentUser?.uid,
        created_at: serverTimestamp(),
        platform: 'android'
      });
    }
  }
  
  // Conflict resolution
  async resolveConflict(
    local: { data: any; timestamp: number },
    remote: { data: any; timestamp: number }
  ) {
    if (local.timestamp > remote.timestamp) {
      // Local is newer - use local
      return local.data;
    } else if (remote.timestamp > local.timestamp) {
      // Remote is newer - use remote
      return remote.data;
    } else {
      // Same timestamp - deep comparison
      if (deepEqual(local.data, remote.data)) {
        return local.data; // Identical
      } else {
        // Real conflict - need manual resolution
        return null; // Return null to trigger conflict UI
      }
    }
  }
}
```

---

## 4. PUSH NOTIFICATIONS (FCM)

### 4.1 Firebase Cloud Messaging Setup

```typescript
// services/NotificationService.ts

export class NotificationService {
  async initializeFCM() {
    const messaging = getMessaging();
    
    // Get FCM token
    const token = await messaging.getToken({
      vapidKey: process.env.EXPO_PUBLIC_FCM_VAPID_KEY
    });
    
    // Save token to user profile
    await updateDoc(doc(db, 'users', auth.currentUser!.uid), {
      fcm_tokens: arrayUnion({
        token,
        platform: 'android',
        deviceId: getDeviceId(),
        createdAt: serverTimestamp()
      })
    });
    
    // Handle foreground notifications
    onMessage(messaging, (payload) => {
      this.showLocalNotification(payload);
    });
    
    // Handle background notifications
    // (Background message handler set in App.tsx)
  }
  
  private showLocalNotification(payload: any) {
    const { notification, data } = payload;
    
    PushNotification.localNotification({
      channelId: 'default',
      title: notification.title,
      message: notification.body,
      data: data,
      userInteraction: true
    });
  }
}

// Background message handler (App.tsx)
messaging().onBackgroundMessage(async (remoteMessage) => {
  console.log('Message handled in background!', remoteMessage);
  
  // Handle offline check-in requests
  if (remoteMessage.data?.type === 'check_in') {
    await handleCheckInRequest(remoteMessage.data);
  }
  
  // Handle safety alerts
  if (remoteMessage.data?.type === 'safety_alert') {
    await handleSafetyAlert(remoteMessage.data);
  }
  
  // Handle family messages
  if (remoteMessage.data?.type === 'family_message') {
    await handleFamilyMessage(remoteMessage.data);
  }
});
```

### 4.2 Notification Types

| Type | Trigger | When Used |
|------|---------|-----------|
| **Check-in Request** | Family member initiates | Periodic safety check-in |
| **Safety Alert** | Geofence trigger or panic | Emergency notifications |
| **Family Message** | Message sent in chat | Real-time communication |
| **Project Update** | Project status changes | Collaborative notification |
| **Event Reminder** | Event approaching | Calendar-based reminders |
| **Document Shared** | Document shared with user | Access notification |
| **Sync Complete** | Offline sync finished | Data consistency confirmation |

---

## 5. BACKGROUND SERVICES

### 5.1 Geofencing (Safety Features)

```typescript
// services/GeofenceService.ts

export class GeofenceService {
  async setupGeofences() {
    // Get user's geofences from SQLite
    const geofences = await this.db.getAllAsync(
      `SELECT * FROM geofences WHERE user_id = ?`,
      [auth.currentUser!.uid]
    );
    
    // Add each geofence
    for (const geo of geofences) {
      await Geolocation.startMonitoring({
        id: geo.id,
        latitude: geo.latitude,
        longitude: geo.longitude,
        radius: geo.radius,
        notifyOnEntry: true,
        notifyOnExit: true
      });
    }
  }
  
  async onGeofenceEnter(geofence: Geofence) {
    console.log(`📍 Entered: ${geofence.name}`);
    
    // 1. Log entry locally
    await this.db.runAsync(
      `INSERT INTO geofence_events (geofence_id, event_type, timestamp)
       VALUES (?, ?, ?)`,
      [geofence.id, 'enter', Date.now()]
    );
    
    // 2. Show local notification
    PushNotification.localNotification({
      title: `Arrived at ${geofence.name}`,
      message: `You entered ${geofence.name}`
    });
    
    // 3. Queue sync if configured
    if (geofence.notify_family) {
      await this.queueGeofenceUpdate(geofence.id, 'enter');
    }
    
    // 4. Sync when online
    if (this.isOnline) {
      await this.syncGeofenceEvent(geofence.id, 'enter');
    }
  }
  
  async onGeofenceExit(geofence: Geofence) {
    console.log(`📍 Exited: ${geofence.name}`);
    // Similar to entry, but for exit events
  }
}
```

### 5.2 Check-in Service

```typescript
// services/CheckInService.ts

export class CheckInService {
  async setupCheckInSchedule() {
    // Get user's check-in schedule from SQLite
    const schedule = await this.db.getFirstAsync(
      `SELECT * FROM check_in_schedule WHERE user_id = ?`,
      [auth.currentUser!.uid]
    );
    
    if (schedule?.enabled) {
      // Use react-native-background-fetch or similar
      BackgroundFetch.configure(
        {
          minimumFetchInterval: schedule.interval_minutes,
          stopOnTerminate: false,
          startOnBoot: true
        },
        async (taskId) => {
          await this.performCheckIn();
          BackgroundFetch.finish(taskId);
        }
      );
    }
  }
  
  async performCheckIn() {
    console.log('✅ Performing check-in...');
    
    // 1. Record check-in locally
    await this.db.runAsync(
      `INSERT INTO check_ins (user_id, timestamp)
       VALUES (?, ?)`,
      [auth.currentUser!.uid, Date.now()]
    );
    
    // 2. If online, notify family
    if (this.isOnline) {
      const userId = auth.currentUser!.uid;
      await updateDoc(doc(db, 'users', userId), {
        last_check_in: serverTimestamp(),
        check_in_status: 'active'
      });
      
      // Notify family via FCM
      await fetch('https://your-backend/notify-check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          timestamp: Date.now(),
          type: 'check_in'
        })
      });
    } else {
      // Queue for later sync
      await this.queueCheckInSync();
    }
  }
}
```

---

## 6. SECURITY IMPLEMENTATION

### 6.1 Encrypted Local Storage

```typescript
// services/SecureStorageService.ts

import RNEncryptedStorage from 'react-native-encrypted-storage';

export class SecureStorageService {
  async saveEncrypted(key: string, value: any) {
    try {
      const jsonString = JSON.stringify(value);
      await RNEncryptedStorage.setItem(key, jsonString);
    } catch (error) {
      console.error('Error saving encrypted data:', error);
    }
  }
  
  async getEncrypted(key: string) {
    try {
      const jsonString = await RNEncryptedStorage.getItem(key);
      return jsonString ? JSON.parse(jsonString) : null;
    } catch (error) {
      console.error('Error retrieving encrypted data:', error);
      return null;
    }
  }
  
  async saveFirebaseToken(token: string) {
    // Save FCM token encrypted
    await this.saveEncrypted('fcm_token', {
      token,
      savedAt: Date.now()
    });
  }
  
  async saveAuthTokens(idToken: string, refreshToken: string) {
    // Save auth tokens encrypted
    await this.saveEncrypted('auth_tokens', {
      idToken,
      refreshToken,
      savedAt: Date.now()
    });
  }
  
  async saveSensitiveData(collection: string, data: any) {
    // Example: Save sensitive documents
    await this.saveEncrypted(`${collection}_sensitive`, data);
  }
}
```

### 6.2 Firestore Security Rules (Same for All Platforms)

```javascript
// firestore.rules - UNCHANGED for Android/Web/TV
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read/create/update/delete their own profile
    match /users/{userId} {
      allow read, create, update, delete: if request.auth.uid == userId;
    }
    
    // Family members can read shared data
    match /family/{familyId}/members/{memberId} {
      allow read: if request.auth.uid == familyId;
      allow create, update: if request.auth.uid == familyId;
    }
    
    // Projects shared within family
    match /projects/{projectId} {
      allow read: if isSharedWithUser(projectId);
      allow create, update: if request.auth.uid == resource.data.created_by;
      allow delete: if request.auth.uid == resource.data.created_by;
    }
    
    // Helper function
    function isSharedWithUser(docId) {
      let doc = get(/databases/$(database)/documents/projects/$(docId));
      return request.auth.uid == doc.data.created_by ||
             request.auth.uid in doc.data.shared_with;
    }
  }
}
```

---

## 7. USER INTERFACE

### 7.1 Key Screens

**1. Authentication Screen**
```
┌─────────────────────────────────┐
│   Salatiso Mobile               │
│   "I am because we are"         │
├─────────────────────────────────┤
│                                 │
│   [Email/Password Input]        │
│   [Google Sign-in Button]       │
│                                 │
│   [Biometric Login Button]      │
│   (if enabled)                  │
│                                 │
└─────────────────────────────────┘
```

**2. Dashboard (Home Screen)**
```
┌─────────────────────────────────┐
│ Status: ✅ ONLINE               │
│ Last Sync: 2 mins ago           │
├─────────────────────────────────┤
│ Family Network                  │
│ ├─ 5 members online             │
│ └─ 3 members offline            │
│                                 │
│ Quick Actions                   │
│ ├─ 🚨 Panic Button              │
│ ├─ ✅ Check-in                  │
│ └─ 💬 Messages (3 new)          │
│                                 │
│ Sync Status                     │
│ ├─ ✅ 12 items synced           │
│ └─ ⏳ 2 pending (offline)       │
│                                 │
└─────────────────────────────────┘
```

**3. Projects List (Offline-enabled)**
```
┌─────────────────────────────────┐
│ Projects                        │
├─────────────────────────────────┤
│ [+ New Project]                 │
│                                 │
│ Project 1                       │
│ ├─ Status: In Progress          │
│ ├─ Progress: 60%                │
│ └─ 🔄 Synced                    │
│                                 │
│ Project 2                       │
│ ├─ Status: Pending              │
│ ├─ Progress: 20%                │
│ └─ ⏳ Pending sync              │
│                                 │
└─────────────────────────────────┘
```

**4. Sync Status Screen**
```
┌─────────────────────────────────┐
│ Sync Status                     │
├─────────────────────────────────┤
│ Connection: ✅ Online           │
│ Last Sync: 1 minute ago         │
│                                 │
│ Pending Items: 0                │
│ ├─ 0 Creates                    │
│ ├─ 0 Updates                    │
│ └─ 0 Deletes                    │
│                                 │
│ Failed Items: 0                 │
│ (Retrying automatically)        │
│                                 │
│ [Sync Now]  [Settings]          │
│                                 │
└─────────────────────────────────┘
```

### 7.2 Offline Indicators

```
Online Status Indicator (Top Bar)
├─ ✅ GREEN: Online & Synced
├─ 🟡 YELLOW: Online but syncing
├─ 🔴 RED: Offline (local mode)
└─ ⚠️ GRAY: Poor connection

Item Status Badge
├─ ✅ Synced
├─ ⏳ Pending (will sync when online)
├─ 🔄 Syncing...
└─ ❌ Failed (tap to retry)
```

---

## 8. TESTING STRATEGY

### 8.1 Offline Testing

```typescript
// Test utilities for offline scenarios

// Simulate offline
DevSettings.setNetworkActivityIndicatorVisible(true);
NetInfo.fetch().then(state => {
  if (!state.isConnected) {
    console.log('✅ Successfully simulated offline');
  }
});

// Test sync queue
async function testSyncQueue() {
  // 1. Go offline
  // 2. Create new project
  // 3. Verify it's in SQLite
  // 4. Verify sync_queue has entry
  // 5. Go online
  // 6. Verify sync completed
  // 7. Verify in Firestore
}

// Test conflict resolution
async function testConflicts() {
  // Scenario: Edit same document offline and online
  // Expected: Conflict resolution dialog
}
```

### 8.2 FCM Testing

```typescript
// Send test notification via Firebase Console
const testPayload = {
  notification: {
    title: 'Test Notification',
    body: 'This is a test'
  },
  data: {
    type: 'family_message',
    senderId: 'test-user'
  }
};
// Firebase Console → Cloud Messaging → Create campaign
```

### 8.3 Geofence Testing

```
Manual testing:
1. Set up test geofence (Home: 50m radius)
2. Walk around the location
3. Verify entry/exit notifications
4. Check local database for events
5. When online: Verify synced to Firebase
```

---

## 9. DEVELOPMENT ROADMAP

### Phase 1: Foundation (Week 1-2)
- ✅ React Native project setup (Expo EAS)
- ✅ Firebase integration (Auth + Firestore)
- ✅ SQLite setup
- ✅ Basic authentication UI

### Phase 2: Offline-First (Week 3-4)
- ✅ SQLite schema
- ✅ Sync engine
- ✅ Conflict resolution
- ✅ Offline indicators UI

### Phase 3: FCM (Week 5-6)
- ✅ Firebase Cloud Messaging setup
- ✅ Background message handlers
- ✅ Local notifications
- ✅ Notification preferences

### Phase 4: Background Services (Week 7-8)
- ✅ Geofencing
- ✅ Check-in service
- ✅ Foreground service (notification)
- ✅ Background sync

### Phase 5: Features (Week 9-10)
- ✅ Project management (full UI)
- ✅ Document management
- ✅ Family network view
- ✅ Messages/chat

### Phase 6: Testing & Launch (Week 11-12)
- ✅ E2E testing
- ✅ Performance optimization
- ✅ Security audit
- ✅ Google Play Store submission

---

## 10. PERFORMANCE METRICS

### Target Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| **App Size** | < 150 MB | Exclude assets |
| **Startup Time** | < 3 seconds | Cold start |
| **Resume Time** | < 1 second | Warm start |
| **SQLite Size** | < 100 MB | Full offline cache |
| **Memory Usage** | < 200 MB | Typical usage |
| **Battery Impact** | < 15% per 8hrs | Background services |
| **Sync Time** | < 5 seconds | 50 items offline |
| **Offline Latency** | < 100ms | Local SQLite queries |

---

## 11. COMPARISON: WEB VS ANDROID

### Side-by-Side Functionality Matrix

| Feature | Web | Android | Why Different? |
|---------|-----|---------|-----------------|
| **Core Features** | ✅ Full | ✅ Full | Same functionality |
| **Data Sync** | Real-time Firebase | Offline-first SQLite | Browser vs mobile |
| **Push Notifications** | ❌ N/A | ✅ FCM Enabled | Web doesn't need background |
| **Offline Mode** | ❌ None | ✅ Full SQLite | Mobile requires offline |
| **Geofencing** | ❌ N/A | ✅ Yes | Mobile location feature |
| **Background Service** | ❌ No | ✅ Yes | Mobile capability |
| **Panic Button** | ❌ UI only | ✅ Native hardware | Emergency feature |
| **Sync Speed** | Instant | Queued (offline) | Platform characteristic |
| **Battery Impact** | N/A | Optimized | Mobile consideration |

---

## 12. SIGNING OFF

**Architecture Review:** ✅ Approved October 22, 2025  
**Development Status:** Ready to begin Q4 2025  
**Next Milestone:** Android MVP by December 2025  

---

**Document Version:** 3.0  
**Last Updated:** October 22, 2025  
**Status:** Active - Ready for Development
