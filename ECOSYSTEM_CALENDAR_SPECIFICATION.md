# 🌐 Ecosystem Calendar Specification
**Last Updated**: October 25, 2025  
**Purpose**: Multi-app sync, MNI testing framework, Sonny mesh networking  
**Audience**: Platform architects, system integrators, ecosystem app developers

---

## 📋 Overview

This document specifies how the enhanced calendar operates across the **Salatiso Ecosystem**:

- **MNI**: The "mobile native interface" testing app where all features are validated before ecosystem-wide rollout
- **Satellite Apps**: Multiple ecosystem applications (Android app, web portals, community dashboards)
- **Sonny Mesh**: Decentralized, privacy-first networking with offline-first incident dispatch
- **Shared Identity**: LifeCV user as central identity propagates across all apps

**Core Principle**: "Feature parity with trust boundaries" - All apps see the same calendar data their user owns/is invited to, respecting privacy rules.

---

## 🏗️ Architecture: Multi-App Sync

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              Firestore (Shared Data Layer)                  │
│  ├─ events (multi-app visible)                             │
│  ├─ polls (real-time voting across apps)                   │
│  ├─ assistanceRequests (broadcast to subscribers)          │
│  └─ userSyncSettings (per-app preferences)                 │
└────────────┬────────────────────────────────────────────────┘
             │
        ┌────┴─────┬──────────────┬───────────────────┐
        │           │              │                   │
     ┌──▼──┐   ┌───▼───┐    ┌────▼────┐      ┌──────▼──────┐
     │ MNI │   │Android│    │ Web App │      │ Community   │
     │     │   │ App   │    │ Portal  │      │ Dashboard   │
     └──┬──┘   └───┬───┘    └────┬────┘      └──────┬──────┘
        │          │             │                  │
        └──────────┴─────────────┴──────────────────┘
                   │
        ┌──────────▼────────────┐
        │   Sonny Mesh Network  │
        │  (Peer-to-peer, BT)   │
        │  ├─ Local sync        │
        │  ├─ Offline queue     │
        │  └─ Emergency alerts  │
        └───────────────────────┘
```

### Sync Layers

#### Layer 1: Firestore (Cloud Sync)
- **Latency**: ~500ms-2s (internet)
- **Guaranteed Delivery**: Yes (Firestore transactions)
- **Offline Support**: Local cache with conflict resolution
- **Use Case**: Standard event updates, polling, notifications

**Firestore Write Path**:
```
App (MNI/Android/Web)
  ├─ Create event
  ├─ Validate against Firestore rules
  ├─ Write to events collection
  ├─ Trigger Firestore function (optional)
  └─ Broadcast to other apps via real-time listeners
```

#### Layer 2: Sonny Mesh (Peer-to-Peer Sync)
- **Latency**: ~50-200ms (local WiFi/Bluetooth)
- **Guaranteed Delivery**: Best-effort (may retry)
- **Offline Support**: Full (queues reconcile on reconnect)
- **Use Case**: Incident alerts, emergency broadcasts, family group messaging

**Sonny Mesh Write Path** (High-Priority Incidents):
```
App (local user creates incident)
  ├─ Log locally with Sonny ID
  ├─ Prioritize: CRITICAL > HIGH > MEDIUM > LOW
  ├─ Dispatch:
  │  ├─ Check WiFi mesh first (Sonny router)
  │  ├─ Fall back to Bluetooth (direct peer)
  │  └─ Fall back to internet (Firestore)
  ├─ Send to responders in parallel
  └─ Wait for delivery confirmation (5s timeout)
     ├─ If confirmed → sync to Firestore
     └─ If timeout → queue for retry + Firestore fallback
```

#### Layer 3: App-Specific Cache
- **Latency**: ~0ms (in-memory)
- **Offline Support**: Full (read-only)
- **Use Case**: Rendering, filtering, search during offline periods

---

## 📱 MNI (Mobile Native Interface) Testing Framework

### Purpose
MNI is the **primary testing app** for all calendar features before ecosystem rollout. All Phase 3 calendar enhancements are tested in MNI first.

### MNI Feature Rollout Process

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 3.1-3.5 Development in Web App (staging)             │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ Feature Flag: CALENDAR_CONTEXT_ENABLED = false             │
│ Status: Hidden from all apps                               │
│ Action: Internal testing with console logs                 │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ Feature Flag: CALENDAR_CONTEXT_ENABLED = true              │
│ Status: Visible in MNI only                                │
│ Action: User testing, bug reports, refinement              │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ Feature Freeze & Code Review                               │
│ Status: Testing in MNI complete, approved for rollout      │
│ Action: Enable for web app users                           │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ Android App Build & Test                                   │
│ Status: Calendar engine tested with MNI flows              │
│ Action: Release to Android app version N                   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ Ecosystem Rollout (Community, Professional dashboards)     │
│ Status: Feature available to all ecosystem apps            │
│ Action: Monitor incidents, user feedback                   │
└────────────────────────────────────────────────────────────┘
```

### MNI Configuration

**Firebase Project**: `lifecv-d2724` (same as web app for shared data)

**MNI URLs**:
- Web: `https://lifecv-d2724.web.app/intranet/calendar?mni_mode=true`
- Android: In-app calendar view with `isMniMode = true`

**Feature Flags** (in `src/config/featureFlags.ts`):
```typescript
const MNI_CALENDAR_FLAGS = {
  CALENDAR_CONTEXT_ENABLED: false,      // Individual/Family/Community/Prof tabs
  CALENDAR_INCIDENTS_ENABLED: false,    // Incident logging & escalation
  CALENDAR_POLLS_ENABLED: false,        // Voting & governance
  CALENDAR_MESH_ENABLED: false,         // Sonny mesh alerts
  CALENDAR_SYNC_CONTROL_ENABLED: false, // User sync preferences
};

const shouldEnableForMni = () => {
  const url = new URL(window.location);
  const isMni = url.searchParams.get('mni_mode') === 'true';
  return isMni ? MNI_CALENDAR_FLAGS : {};
};
```

### MNI Testing Checklist

- [ ] Context switching works (all 4 contexts)
- [ ] Event CRUD operations preserve existing data
- [ ] Incidents create with correct severity
- [ ] Polls vote, calculate quorum, close correctly
- [ ] Assistance requests broadcast to audience
- [ ] Contact links sync bidirectionally
- [ ] Asset maintenance events auto-create
- [ ] Project milestones appear in calendar
- [ ] Timeline events show read-only
- [ ] Roles assign & permission check
- [ ] Offline logging queues for sync
- [ ] Mesh alerts deliver to responders
- [ ] Reports calculate correctly
- [ ] Export includes all selected contexts
- [ ] Import handles conflicts (prompt vs auto-resolve)
- [ ] Mobile responsive layout works
- [ ] Accessibility: keyboard nav, screen reader, color contrast
- [ ] Performance: <3s load, <500ms add event
- [ ] No console errors or warnings
- [ ] Firestore rules allow all operations

---

## 🌍 Ecosystem App Specifications

### Calendar API Contract

All ecosystem apps expose a **read-only Calendar API** for their users:

```typescript
// Implemented by: Web App (reference), Android App, Community Dashboard, etc.

interface CalendarAPI {
  // Initialization
  initialize(userId: string, config: CalendarConfig): Promise<void>;
  
  // Event queries (filtered by permissions)
  getEvents(filters: EventFilters): Promise<Event[]>;
  getEvent(eventId: string): Promise<Event | null>;
  getEventsInRange(start: Date, end: Date): Promise<Event[]>;
  getUpcomingEvents(limit?: number): Promise<Event[]>;
  
  // Event mutations (respects Firestore permissions)
  createEvent(data: CreateEventInput): Promise<string>;
  updateEvent(eventId: string, updates: UpdateEventInput): Promise<void>;
  deleteEvent(eventId: string): Promise<void>;
  
  // RSVP & participation
  rsvpEvent(eventId: string, status: 'accepted' | 'declined' | 'tentative'): Promise<void>;
  
  // Voting
  voteOnPoll(pollId: string, optionId: string): Promise<void>;
  
  // Assistance
  requestAssistance(eventId: string, data: AssistanceInput): Promise<string>;
  respondToAssistanceRequest(requestId: string, status: 'accepted' | 'declined'): Promise<void>;
  
  // Incidents
  logIncident(data: IncidentInput): Promise<string>;
  escalateIncident(incidentId: string, toContext: string): Promise<void>;
  resolveIncident(incidentId: string, notes: string): Promise<void>;
  
  // Sync settings
  getSyncSettings(): Promise<UserSyncSettings>;
  updateSyncSettings(settings: Partial<UserSyncSettings>): Promise<void>;
  
  // Search & filter
  searchEvents(query: string): Promise<Event[]>;
  filterEvents(filters: EventFilters): Promise<Event[]>;
  
  // Export
  exportEvents(format: 'ics' | 'json', context?: string): Promise<string>;
}

interface CalendarConfig {
  userId: string;
  appName: string;  // 'MNI', 'Android', 'WebApp', 'CommunityDash'
  offline?: boolean;
  meshEnabled?: boolean;
  maxCacheSize?: number;
}

interface EventFilters {
  contexts?: string[];
  types?: ('activity' | 'incident')[];
  categories?: string[];
  roles?: Role[];
  dateRange?: { start: Date; end: Date };
  search?: string;
  linkedModules?: ('contact' | 'asset' | 'project' | 'timeline')[];
}
```

### Web App (Existing + Enhanced)
- **Platform**: React 18 + Next.js 14.2
- **Data Source**: Firestore + local cache
- **Sync Method**: Real-time listeners + polling fallback
- **Offline**: Service Worker + IndexedDB cache
- **Mesh**: Sonny mesh (optional, for urgent incidents)
- **Status**: Reference implementation

### Android App
- **Platform**: Native (Java/Kotlin) or React Native
- **Data Source**: Firestore + local database (Room)
- **Sync Method**: WorkManager + background sync
- **Offline**: Full local storage, queued writes
- **Mesh**: Sonny mesh (WiFi Direct + Bluetooth)
- **Status**: Implements CalendarAPI contract
- **Notable**: Notifications via Firebase Cloud Messaging (FCM)

### Community Dashboard
- **Platform**: React or Vue + Vite
- **Data Source**: Read-only Firestore queries
- **Sync Method**: Periodic polling (5-60s)
- **Offline**: Not applicable (community-wide view)
- **Mesh**: Not applicable
- **Status**: Aggregate view of family/community events
- **Notable**: No create/update/delete (read-only)

---

## 🔗 Sonny Mesh Networking Integration

### Overview
**Sonny** is the decentralized, mesh-first communication layer. Calendar incidents use Sonny as the primary dispatch mechanism for urgent situations.

### Incident Dispatch Priority

```
┌─────────────────────────────────────────────────────┐
│ Incident Created (Severity = CRITICAL)              │
├─────────────────────────────────────────────────────┤
│ 1. Check Sonny mesh availability:                   │
│    ├─ WiFi mesh connected? → Route to nearby peers │
│    ├─ Bluetooth available? → Direct peer routing   │
│    └─ Internet only? → Firestore + FCM push       │
│                                                     │
│ 2. Build responder list (auto-assigned by context):│
│    ├─ Family: Household adults + elders           │
│    ├─ Community: Safety lead + neighbors          │
│    ├─ Professional: Manager + on-call team        │
│    └─ Individual: Self + emergency contact        │
│                                                     │
│ 3. Send parallel alerts:                           │
│    ├─ Sonny mesh (high priority) → 5s delivery    │
│    ├─ Firestore write → Cloud Messaging (FCM)     │
│    └─ Local notification                          │
│                                                     │
│ 4. Wait for acknowledgments:                       │
│    ├─ Peer acks over mesh → update status         │
│    ├─ FCM delivery confirmed → update status      │
│    └─ No response after 30s → escalate            │
└─────────────────────────────────────────────────────┘
```

### Offline Incident Logging

```typescript
// In app (no internet):

// 1. User logs incident locally
const localIncident = {
  id: generateLocalId(),
  ...incidentData,
  userId: currentUser.id,
  createdAt: new Date(),
  syncStatus: 'pending',
  meshDispatched: false,
  localOnly: true
};

// 2. Store in app's local queue
await localDB.incidents.add(localIncident);

// 3. Trigger Sonny mesh broadcast
sonnyMesh.broadcast('incident', {
  type: 'incident',
  severity: localIncident.severity,
  responders: localIncident.responderRoles,
  data: localIncident
});

// 4. On reconnect, sync to Firestore
onNetworkRestore(() => {
  calendarService.syncQueuedIncidents()
    .then(() => updateSyncStatus('synced'))
    .catch(err => console.error('Sync failed', err));
});
```

### Sonny Mesh Topics & Subscriptions

```typescript
// Calendar incident broadcasts
sonnyMesh.subscribe('incidents/critical', (incident) => {
  // Handle urgent incidents
  showEmergencyAlert(incident);
  attemptAutoEscalation(incident);
});

sonnyMesh.subscribe('incidents/high', (incident) => {
  // Handle high-priority incidents
  notifyResponders(incident);
});

sonnyMesh.subscribe('polls/active', (poll) => {
  // Real-time poll updates across mesh peers
  updatePollResults(poll);
});

sonnyMesh.subscribe('events/broadcast', (event) => {
  // Family/community event broadcast (e.g., dinner is ready)
  showEventNotification(event);
});
```

### Mesh Network Configuration (Firebase + Sonny)

```typescript
// src/config/sonnyMesh.ts

export const SONNY_MESH_CONFIG = {
  transports: [
    {
      type: 'wifi_direct',
      priority: 1,
      latency: '~50ms',
      range: '~100m',
      bandwidth: 'High'
    },
    {
      type: 'bluetooth',
      priority: 2,
      latency: '~100ms',
      range: '~10m',
      bandwidth: 'Medium'
    },
    {
      type: 'internet',
      priority: 3,
      latency: '~500ms',
      range: 'Unlimited',
      bandwidth: 'Variable'
    }
  ],
  
  incidents: {
    autoEscalateCritical: true,
    escalationDelayMs: 30000,  // 30s to confirm receipt
    responderTimeoutMs: 60000, // 1min to respond
    parentNotificationThreshold: 2, // Notify parents if 2+ responders unreachable
  },
  
  events: {
    broadcastThreshold: 'high',  // Only broadcast important events (weddings, emergencies)
    localOnlyMode: true,         // Cache locally first, sync when online
  },
  
  cache: {
    maxLocalEvents: 500,
    conflictStrategy: 'last_write_wins',  // Can be 'prompt'
    persistenceLayer: 'indexeddb'
  }
};
```

---

## 📊 Multi-App Data Consistency

### Read Path (Guaranteed Consistent)
```
┌──────────────────┐
│ Firestore (SSOT) │
└────────┬─────────┘
         │
    ┌────┴─────────────────────────┐
    │ App subscribes to real-time   │
    │ listener (onSnapshot)         │
    │                               │
    │ ├─ If online: get live data  │
    │ └─ If offline: get local     │
    │    cache + flag 'stale'      │
    └────┬──────────┬──────────┬───┘
         │          │          │
       ┌─▼─┐    ┌──▼──┐   ┌──▼──┐
       │MNI│    │Web  │   │Droid│
       └───┘    └─────┘   └─────┘
```

### Write Path (Conflict Resolution)
```
┌──────────────────┐
│ App A (MNI)      │ Event X updated
│ Updates Event X  │ ├─ title: "New Title"
└────────┬─────────┘ └─ updatedAt: T1
         │
         ▼
    Firestore
    (validates rules, accepts write)
         │
    ┌────┴────┬────────┬─────────────┐
    │ Broadcast to real-time listeners
    │          │        │
    ▼          ▼        ▼
  App B (Android) sees update
  └─ Merges with local changes
  └─ Resolves conflicts per strategy
     └─ If 'last_write_wins': Accept A's version
     └─ If 'prompt': Show conflict dialog
```

### Conflict Resolution Strategy

**Setting**: `userSyncSettings.conflictHandling`

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| **last_write_wins** | Latest timestamp wins | Individual events (no collab) |
| **prompt** | Show dialog to user | Collaborative events |
| **policy_by_context** | Family=vote, Prof=manager, Indiv=auto | Mixed events |

**Example**:
```typescript
// User A & B both editing event title simultaneously

// User A: title = "Family Dinner"
// User B: title = "Weekly Dinner"
// Same event, updated at T1 and T1+10ms

// If conflictHandling = 'last_write_wins':
//   Result: "Weekly Dinner" (User B's, later timestamp)

// If conflictHandling = 'prompt':
//   Show: "Conflict detected! Family Dinner vs Weekly Dinner"
//   User chooses one

// If conflictHandling = 'policy_by_context':
//   Context = 'family'
//   Poll family members (quorum rule)
//   Result = majority vote
```

---

## 🚀 Rollout Plan

### Week 1: MNI Internal Testing
- [ ] Web app with `CALENDAR_CONTEXT_ENABLED=true` in MNI mode only
- [ ] Internal team testing of all features
- [ ] Bug fixes and refinements
- [ ] Feature freeze decision

### Week 2: Web App General Availability
- [ ] Enable feature flag for all web app users
- [ ] Monitor error logs and user feedback
- [ ] Hotfixes as needed

### Week 3: Android App Build
- [ ] Implement CalendarAPI in Android native code
- [ ] Integrate Sonny mesh networking
- [ ] Run integration tests with web app
- [ ] Build and sign APK

### Week 4: Android Release
- [ ] Alpha testing with select users
- [ ] Beta release to app stores
- [ ] Monitor incidents and crashes

### Week 5: Ecosystem Rollout
- [ ] Community Dashboard enables calendar
- [ ] Professional portal enables calendar
- [ ] Monitor cross-app sync
- [ ] Celebration 🎉

---

## 📡 Deployment Checklist

### Firebase Setup
- [ ] `events` collection created with proper rules
- [ ] `polls` collection created
- [ ] `assistanceRequests` collection created
- [ ] `userSyncSettings` collection created
- [ ] All Firestore rules deployed (see CALENDAR_ENHANCEMENT_SPECIFICATION.md)
- [ ] Cloud Functions set up for escalation (if needed)
- [ ] Firestore backups enabled

### Code Deployment
- [ ] All services in `src/services/`
- [ ] All types in `src/types/calendar.ts`
- [ ] All components in `src/components/calendar/`
- [ ] Updated `src/pages/intranet/calendar.tsx`
- [ ] Feature flags in `src/config/featureFlags.ts`
- [ ] No build errors: `npm run build`
- [ ] No console warnings

### Documentation
- [ ] User guide with tutorials
- [ ] Technical guide for developers
- [ ] Migration guide for existing users
- [ ] API reference
- [ ] Sonny mesh integration guide
- [ ] MNI testing framework docs

### Testing
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Load test: 100+ events, 50 concurrent users
- [ ] Accessibility: WCAG 2.1 AA
- [ ] Cross-app sync verified
- [ ] Offline sync verified
- [ ] Mesh alert delivery verified

---

## 🔒 Security & Privacy

### Privacy Rules by Context

| Context | Visibility | Access | Share |
|---------|-----------|--------|-------|
| **Individual** | Private by default | Only owner | Not shared |
| **Family** | Family circle | Family members + roles | Not shared outside |
| **Community** | Community only | Approved members | Not shared outside |
| **Professional** | Team only | Team + manager approval | Not shared outside |

### Data Minimization

- Incidents broadcast minimal data (severity + responders only)
- Contact profiles shown only to invited participants
- Financial data (asset values) hidden in mesh messages
- Personal health info restricted to health-cleared recipients

### Encryption

- Firestore: Data-at-rest (Google-managed)
- In Transit: HTTPS (Firestore), TLS (Sonny mesh)
- At-Rest in Apps: Local encryption via Firebase Encryption SDK (optional)
- Mesh: Peer-to-peer encryption (Sonny manages)

---

## 📚 References

- **CALENDAR_ENHANCEMENT_SPECIFICATION.md** - Core calendar features
- **Sonny Mesh Docs** - Mesh networking and offline sync
- **Firebase Documentation** - Security rules, real-time sync
- **MNI Framework Guide** - Testing app configuration
- **Ecosystem Integration Guide** - Multi-app deployment

---

## ✅ Document Sign-Off

**Author**: System Architect  
**Date**: October 25, 2025  
**Status**: 🟢 Ready for Phase 3 Implementation  
**Next Step**: Create `src/types/calendar.ts` with all type definitions

