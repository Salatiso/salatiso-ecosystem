# 📅 Calendar Enhancement Specification
**Last Updated**: October 25, 2025  
**Status**: Phase 2 Sprint 3 - Major Enhancement  
**Scope**: Deep integration with Contacts, Assets, Family Timeline, Projects + Sonny mesh networking

---

## 📋 Executive Summary

This specification outlines a comprehensive calendar enhancement that transforms the calendar from a simple event tracker into a sophisticated, context-aware, multi-level event management system that:

- **Preserves** all existing functionality (Month/Week/Day views, categories, import/export)
- **Integrates** deeply with Contacts (birthdays, meetings), Assets (maintenance, compliance), Family Timeline, and Projects
- **Organizes** events by context (Individual → Family → Community → Professional) with role-based collaboration
- **Controls** sync preferences per user and per module with fine-grained permissions
- **Empowers** Sonny mesh networking for offline-first alerts and incident escalation

**Core Philosophy**: "From within to without" - Individual events build family activities, which grow into community initiatives, supported by professional infrastructure.

---

## 🎯 Project Goals

### Primary Objectives
1. **Preserve**: Zero breaking changes to existing views and functionality
2. **Enhance**: Add event types (Activities, Incidents), contexts (Individual/Family/Community/Professional), and collaboration features
3. **Integrate**: Two-way sync with Contacts, Assets, Family Timeline, Projects
4. **Mesh-First**: Prioritize Sonny for alerts, offline support, and incident escalation
5. **Govern**: Role-based access with context-aware permissions and audit trails

### Success Criteria
- ✅ All 6 existing event categories maintained (personal, work, family, maintenance, travel, compliance)
- ✅ 4 context levels (Individual, Family, Community, Professional) with tab-based filtering
- ✅ Role assignment (Organizer, Participant, Supporter, Steward, Responder) with granular permissions
- ✅ Event-contact/asset/project/timeline links with bidirectional sync
- ✅ Polls with quorum logic and governance validation
- ✅ Incident tracking with severity levels and escalation workflows
- ✅ Offline incident logging with mesh-first dispatch via Sonny
- ✅ Comprehensive reporting across all contexts
- ✅ Zero Firestore security rule errors (permission-denied on reads/writes)
- ✅ Build completes with 0 errors on first pass

---

## 📊 Existing Calendar Functionality (PRESERVED)

### Current Views
| View | Status | Features |
|------|--------|----------|
| **Month** | ✅ Keep | Grid layout, date selection, event preview |
| **Week** | ✅ Keep | 7-day horizontal grid, timeslot view |
| **Day** | ✅ Keep | Time-sequenced event list with sorting |

### Current Categories (Enhanced)
```typescript
'personal' | 'work' | 'family' | 'maintenance' | 'travel' | 'compliance' | 'other'
```
**Enhancement**: Map to standardized internal model, add custom categories, preserve labels in UI.

### Current Features
- ✅ **Event CRUD**: Add, edit, delete, view events
- ✅ **Recurring Events**: daily, weekly, monthly, yearly
- ✅ **Import/Export**: .ics (iCalendar) and JSON formats
- ✅ **Sidebar Panels**: 
  - Selected date events
  - Upcoming events (next 5)
  - Category legend
- ✅ **Search**: Title-based event filtering
- ✅ **Reminders**: Boolean flag per event
- ✅ **Attendees**: String array of attendee names
- ✅ **All-Day Events**: isAllDay flag

### Current Data Model (CalendarEvent)
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  attendees?: string[];  // Will be enhanced to contact IDs + names
  category: 'personal' | 'work' | 'family' | 'maintenance' | 'travel' | 'compliance' | 'other';
  color?: string;
  reminder?: boolean;
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  linkedAsset?: string;  // Will be enhanced to bidirectional links
  isAllDay?: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
```

---

## 🏗️ Enhanced Architecture

### Context Levels

Events bind to **primary context** with optional **cross-context visibility**:

| Context | Level | Participants | Governance | Example |
|---------|-------|--------------|-----------|---------|
| **Individual** | 0 | 1 person | Self | "Personal exercise routine" |
| **Family** | 1 | 2+ household/family | Family governance rules | "Weekly family dinner" |
| **Community** | 2 | ~5-50 people | Community charter | "Town hall meeting" |
| **Professional** | 3 | Team/org | Org chart + roles | "Q1 planning session" |

### Role Model

```typescript
type Role = 'organizer' | 'participant' | 'supporter' | 'steward' | 'responder';

interface EventRole {
  userId: string;
  contactId?: string;
  role: Role;
  permissions: {
    read: boolean;
    rsvp: boolean;
    comment: boolean;
    vote: boolean;
    invite: boolean;
    edit: boolean;
    escalate: boolean;
    resolve: boolean;  // Incidents only
  };
  status?: 'accepted' | 'declined' | 'tentative';
  rsvpedAt?: Date;
}
```

**Role Permissions**:
- **Organizer**: Full event control, invite, manage roles, edit dates/times
- **Participant**: RSVP, comment, vote, see details
- **Supporter**: Offer assistance, attach resources, see details
- **Steward**: Create/edit events, manage polls, invite participants
- **Responder**: For incidents - receive alerts, update status, escalate

### Event Types

#### 1. Activity Events
Planned events within any context.

```typescript
interface ActivityEvent extends BaseEvent {
  type: 'activity';
  category: 'celebration' | 'meeting' | 'chore' | 'maintenance' | 'training' | 'custom';
  status: 'planned' | 'confirmed' | 'cancelled' | 'completed' | 'archived';
  recurrence?: RecurrenceRule;
  polls?: Poll[];  // Date/time voting, theme voting, budget polls
  assistanceRequests?: AssistanceRequest[];  // "Who can help?"
}
```

#### 2. Incident Events
Unplanned events requiring tracking and resolution.

```typescript
interface IncidentEvent extends BaseEvent {
  type: 'incident';
  category: 'health' | 'safety' | 'property' | 'emotional_support' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'archived';
  responderRoles: EventRole[];  // Context-specific responders
  resolutionNotes?: string;
  resolvedAt?: Date;
  escalationPath: EscalationStep[];
  autoEscalationTriggered?: boolean;  // Severity-based
}
```

### Core Event Schema (Enhanced CalendarEvent → Event)

```typescript
interface Event {
  // Core metadata
  id: string;
  userId: string;  // Owner
  title: string;
  description?: string;
  
  // Timing
  startDateTime: Date;
  endDateTime?: Date;
  allDay?: boolean;
  timezone?: string;
  
  // Location & Participants
  location?: string;
  roles: EventRole[];  // Enhanced from attendees
  
  // Categorization
  type: 'activity' | 'incident';
  category: string;  // Standardized: personal, family, work, etc.
  primaryContextId: 'individual' | 'family' | 'community' | 'professional';
  contextIds: ('individual' | 'family' | 'community' | 'professional')[];  // Cross-context visibility
  
  // Collaboration
  status: 'planned' | 'open' | 'in_progress' | 'resolved' | 'completed' | 'cancelled' | 'archived';
  polls: Poll[];
  assistanceRequests: AssistanceRequest[];
  
  // Integration Links
  links: {
    contactIds: string[];  // Linked contacts
    assetIds: string[];    // Linked assets
    projectIds: string[];  // Linked projects
    timelineEntryIds: string[];  // Linked timeline events
    documents: string[];   // File storage URLs
  };
  
  // Recurrence & Reminders
  recurrence?: RecurrenceRule;
  reminders: {
    type: 'email' | 'in_app' | 'mesh' | 'sms';
    minutesBeforeStart: number;
  }[];
  notifications: {
    channel: 'email' | 'in_app' | 'mesh';
    sentAt: Date;
  }[];
  
  // Privacy & Access
  visibility: 'private' | 'context' | 'cross_context';
  permissions: {
    role: Role;
    canView: string[];      // User IDs who can view
    canRsvp: string[];      // User IDs who can RSVP
    canEdit: string[];      // User IDs who can edit
    canInvite: string[];    // User IDs who can invite
  };
  
  // Audit Trail
  audit: AuditEntry[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface BaseEvent {
  // Shared fields for Activity and Incident
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDateTime: Date;
  endDateTime?: Date;
  allDay?: boolean;
  location?: string;
  roles: EventRole[];
  primaryContextId: ContextLevel;
  contextIds: ContextLevel[];
  status: string;
  visibility: 'private' | 'context' | 'cross_context';
  links: EventLinks;
  reminders: Reminder[];
  notifications: Notification[];
  audit: AuditEntry[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Supporting Types

```typescript
// Polling
interface Poll {
  id: string;
  question: string;
  type: 'date_time' | 'theme' | 'budget' | 'custom';
  options: {
    id: string;
    label: string;
    votes: number;
  }[];
  voters: {
    userId: string;
    optionId: string;
    votedAt: Date;
  }[];
  closesAt: Date;
  requiredQuorum?: number;  // % or count
  governance?: 'simple_majority' | 'supermajority' | 'consensus';
}

// Assistance Requests
interface AssistanceRequest {
  id: string;
  eventId: string;
  requestedBy: string;  // User ID
  targetAudience: 'personal' | 'family' | 'community' | 'professional';
  type: 'help_needed' | 'volunteer' | 'donation' | 'expertise';
  description: string;
  respondees: {
    userId: string;
    status: 'accepted' | 'declined' | 'pending';
    respondedAt: Date;
  }[];
  createdAt: Date;
  closesAt?: Date;
}

// Incidents - Extended
interface IncidentEvent extends Event {
  type: 'incident';
  severity: 'low' | 'medium' | 'high' | 'critical';
  responderRoles: EventRole[];
  resolutionNotes?: string;
  resolvedAt?: Date;
  escalationPath: EscalationStep[];
  autoEscalationTriggered?: boolean;
}

interface EscalationStep {
  fromContextId: string;
  toContextId: string;
  reason: string;
  approvedBy: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
}

// Sync Preferences
interface UserSyncSettings {
  userId: string;
  contacts: 'none' | 'anniversaries_only' | 'meetings' | 'all';
  assets: 'none' | 'maintenance_only' | 'purchases' | 'all';
  projects: 'none' | 'milestones_only' | 'tasks' | 'all';
  timeline: 'none' | 'major_events_only' | 'all';
  conflictHandling: 'prompt' | 'last_write_wins' | 'policy_by_context';
  createdAt: Date;
  updatedAt: Date;
}

// Recurrence
interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
  daysOfWeek?: string[];  // ['Mon', 'Wed', 'Fri']
  exclusions: Date[];
}

// Audit
interface AuditEntry {
  userId: string;
  field: string;
  from: any;
  to: any;
  timestamp: Date;
  action: 'create' | 'update' | 'delete' | 'restore';
}
```

---

## 🔗 Integration Points

### Contacts Integration

**Auto-create events for**:
- Birthdays (anniversary field) → all-day event, "Birthday - [Contact Name]"
- Meeting requests → contact-linked event with automatic role assignment
- Check-ins → reminder-based activity

**Data Flow**:
```
Contacts Service
  ├─ Anniversary → Calendar
  │   └─ Create recurring annual event
  └─ Meeting link → Calendar
      └─ Create event, add contact as participant

Calendar
  ├─ Contact linked → Contacts Service
  │   └─ Display contact profile in event details
  └─ Event participant added → Contacts Service
      └─ Auto-create/suggest relationship if not exists
```

**UI Features**:
- Contact quick-view modal in event details
- Contact multi-select when creating events
- Meeting history with contact
- Automatic role tagging ("spouse", "colleague", etc.)

### Assets Integration

**Auto-create events for**:
- Maintenance schedule → "Maintenance - [Asset Name]"
- Service dates → linked to service provider contact
- Warranty expiry → compliance event
- Purchase anniversaries → optional reminder event

**Data Flow**:
```
Assets Service
  ├─ Maintenance schedule → Calendar
  │   └─ Create recurring event with service details
  ├─ Warranty expiry → Calendar
  │   └─ Create compliance event
  └─ Service provider → Calendar
      └─ Link to contact
      
Calendar
  ├─ Asset linked → Assets Service
  │   └─ Display asset details, maintenance history
  └─ Event completed → Assets Service
      └─ Log maintenance completion, update schedules
```

**UI Features**:
- Asset maintenance history in event details
- Service provider contact auto-linked
- Maintenance checklist attachment
- Cost/warranty info display

### Family Timeline Integration

**Read-only sync**:
- Life events (births, rites of passage, memorials) appear in calendar
- Family admins can add reminders/ceremonies
- Project links (ceremonies, celebrations) for major events

**Data Flow**:
```
Timeline Service
  └─ Major events → Calendar (read-only)
      ├─ Display with timeline icon
      └─ Allow admin reminder attachment

Calendar
  └─ Timeline entry linked → Timeline Service
      └─ Update ceremony project if exists
```

**UI Features**:
- Timeline event icons in calendar
- "Add reminder" → creates activity event
- Link to ceremony project if exists
- Family memory display on event

### Projects Integration

**Bi-directional sync**:
- Milestones → calendar events with task details
- Task deadlines → calendar events grouped by project
- Event updates → project status changes
- Project completion → calendar notification

**Data Flow**:
```
Projects Service
  ├─ Milestone → Calendar
  │   └─ Create event, deep link to project
  ├─ Task deadline → Calendar
  │   └─ Create event with task details
  └─ Status change → Calendar
      └─ Update event status/completion

Calendar
  ├─ Event date changed → Projects Service
  │   └─ Update milestone/task deadline
  └─ Event completed → Projects Service
      └─ Mark task as done / milestone reached
```

**UI Features**:
- Project-scoped event filters
- Task checklist in event details
- Project milestone timeline view
- Bidirectional date editing

---

## 🎨 UI & UX Design

### Page Layout

```
┌─────────────────────────────────────────────────────┐
│ Header: Calendar | Add Event | Download | Import   │
├─────────────────────────────────────────────────────┤
│ Context Tabs: [Individual] [Family] [Community] [Prof]
│ Filters: Type | Category | Role | Links            │
├──────────────────────────┬──────────────────────────┤
│                          │                          │
│   Calendar View          │   Sidebar                │
│   (Month/Week/Day)       │   ├─ Selected Date      │
│                          │   ├─ Upcoming (grouped) │
│                          │   ├─ Polls              │
│                          │   ├─ Assistance         │
│                          │   └─ Legend             │
│                          │                          │
└──────────────────────────┴──────────────────────────┘
```

### Context Switcher

```typescript
// Top tab bar: Show primary context + count of events
Individual  [12 events] → Family [25] → Community [8] → Professional [30]

// Toggle cross-context visibility
☐ Show cross-context events
```

### Color Coding

```
Type:
  ● Activities: Standard colors
  ● Incidents: Red/Orange gradients (↑ saturation with severity)

Context:
  Individual: Blue
  Family: Green
  Community: Purple
  Professional: Teal

Severity (incidents):
  ◆ Low: Yellow
  ◆ Medium: Orange
  ◆ High: Red
  ◆ Critical: Dark Red + animated pulse
```

### Event Quick-Add vs. Advanced

**Quick Add** (1 click):
```
Title: [______________]
Date: [Today ▼]
Type: [Activity ▼]  Context: [Family ▼]
Time: [Optional]
[Create]
```

**Advanced** (multi-step):
1. Details (title, desc, date/time, location)
2. Roles & Participants (assign contacts, roles, permissions)
3. Links (contact/asset/project/timeline)
4. Polls (optional voting)
5. Assistance (optional help request)
6. Visibility & Reminders
7. Review & Create

### Assistance & Voting UI

**Seek Help**:
```
┌─────────────────────────────────┐
│ Help Needed                      │
├─────────────────────────────────┤
│ Type: [Help ▼] Audience: [Family ▼]
│ Description: [________________]  │
│ Closes: [Date/Time]              │
│ [Send Request]                   │
└─────────────────────────────────┘
```

**Poll Card**:
```
┌──────────────────────────────────┐
│ 🗳️ When's best for dinner?     │
├──────────────────────────────────┤
│ ⬤ Saturday 6pm    [3 votes] 60% │
│ ○ Sunday 5pm      [2 votes] 40% │
│                                  │
│ [Vote]  Closes: Oct 30, 2025    │
└──────────────────────────────────┘
```

### Incident Quick-Log

```
┌──────────────────────────────────┐
│ 🚨 Quick Incident Log            │
├──────────────────────────────────┤
│ Category: [Health ▼]              │
│ Severity: [🟡 Medium ▼]          │
│ Description: [________________]  │
│ Location: [________________]      │
│ Affected Person(s): [____]       │
│ [Log Incident]                   │
└──────────────────────────────────┘
```

---

## 📱 Responsive Behavior

| Screen | Layout | Changes |
|--------|--------|---------|
| **Desktop** | 3-column (calendar, sidebar, details) | Full filters, advanced forms |
| **Tablet** | 2-column or stacked | Compact sidebar, simplified forms |
| **Mobile** | Full-width stacked | Tab navigation, modal forms, swipe navigation |

---

## 🔐 Firestore Schema & Rules

### Collections Structure

```
firestore
├── users/{userId}
│   └── ... (existing)
│
├── events/{eventId}
│   ├── userId: string
│   ├── type: 'activity' | 'incident'
│   ├── title, description, location
│   ├── startDateTime, endDateTime, timezone
│   ├── allDay, primaryContextId, contextIds[]
│   ├── status, visibility
│   ├── roles: EventRole[]
│   ├── links: { contactIds[], assetIds[], projectIds[], timelineEntryIds[], documents[] }
│   ├── recurrence: RecurrenceRule
│   ├── reminders, notifications[]
│   ├── polls: Poll[]
│   ├── assistanceRequests: AssistanceRequest[]
│   ├── [Incident-only] severity, responderRoles[], resolutionNotes, escalationPath[]
│   ├── audit: AuditEntry[]
│   ├── createdAt, updatedAt
│   └── ... (category, color, etc.)
│
├── polls/{pollId}
│   ├── eventId
│   ├── question, type, options[]
│   ├── voters[], closesAt
│   ├── requiredQuorum, governance
│   └── createdAt, updatedAt
│
├── assistanceRequests/{requestId}
│   ├── eventId, requestedBy
│   ├── targetAudience, type, description
│   ├── respondees[]
│   ├── createdAt, closesAt
│   └── updatedAt
│
├── incidents/{incidentId}
│   ├── eventId
│   ├── severity, status
│   ├── responderRoles[]
│   ├── resolutionNotes, resolvedAt
│   ├── escalationPath[]
│   ├── autoEscalationTriggered
│   └── createdAt, updatedAt
│
├── userSyncSettings/{userId}
│   ├── contacts, assets, projects, timeline
│   ├── conflictHandling
│   ├── createdAt, updatedAt
│
└── syncLogs/{syncLogId}
    ├── userId, sourceModule, targetModule
    ├── eventId, status, error
    ├── timestamp, details
```

### Firestore Security Rules (Pseudocode)

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Events
    match /events/{eventId} {
      // Read: Owner, or user in roles[], or cross-context visible to user's contexts
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        request.auth.uid in resource.data.roles[].userId ||
        (resource.data.visibility == 'cross_context' && 
         resource.data.contextIds contains request.auth.uid) ||
        (resource.data.visibility == 'context' &&
         resource.data.primaryContextId in request.auth.uid)
      );
      
      // Create: Must be authenticated, set userId to current user
      allow create: if request.auth != null &&
                       request.resource.data.userId == request.auth.uid;
      
      // Update: Owner or user with 'edit' permission
      allow update: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        (existingRole(resource.data.roles, request.auth.uid).permissions.edit == true)
      );
      
      // Delete: Owner only
      allow delete: if request.auth != null &&
                       resource.data.userId == request.auth.uid;
    }
    
    // Polls
    match /polls/{pollId} {
      allow read: if eventReadable(eventId);
      allow create: if request.auth != null && canVote(eventId);
      allow update: if request.auth != null && canVote(eventId);
    }
    
    // Assistance Requests
    match /assistanceRequests/{requestId} {
      allow read: if eventReadable(eventId);
      allow create: if request.auth != null &&
                       canRequestAssistance(eventId);
      allow update: if request.auth != null &&
                       (canRequestAssistance(eventId) || isRespondee());
    }
    
    // User Sync Settings
    match /userSyncSettings/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
  
  // Helper functions
  function eventReadable(eventId) {
    let event = get(/databases/$(database)/documents/events/$(eventId)).data;
    return request.auth != null && (
      event.userId == request.auth.uid ||
      request.auth.uid in event.roles[].userId ||
      event.visibility == 'cross_context'
    );
  }
  
  function canVote(eventId) {
    let event = get(/databases/$(database)/documents/events/$(eventId)).data;
    return request.auth.uid in event.roles[].userId;
  }
  
  function existingRole(roles, userId) {
    return roles[where(userId == userId)][0];
  }
}
```

---

## 🚀 Implementation Phases

### Phase 3.1: Foundation (1-2 sprints)
- [x] Specification complete
- [ ] Create `CalendarService` with CRUD
- [ ] Create `types/calendar.ts` with all interfaces
- [ ] Build `EventForm` (quick + advanced)
- [ ] Update Firestore rules
- [ ] Build & deploy to staging

### Phase 3.2: Integrations (1-2 sprints)
- [ ] Contacts integration (birthdays, meetings)
- [ ] Assets integration (maintenance, compliance)
- [ ] Family Timeline integration (read-only)
- [ ] Projects integration (milestones, tasks)
- [ ] Build & deploy to staging

### Phase 3.3: Collaboration (1 sprint)
- [ ] Incident logging & escalation
- [ ] Polls & voting with governance
- [ ] Assistance requests
- [ ] Role assignment UI
- [ ] Build & deploy to staging

### Phase 3.4: Sonny Mesh (1 sprint)
- [ ] Offline event logging
- [ ] Mesh-first alert dispatch (incidents)
- [ ] Sonny integration for presence
- [ ] Emergency incident broadcasting
- [ ] Build & deploy to staging

### Phase 3.5: Reporting & Polish (1 sprint)
- [ ] Individual/Family/Community/Professional reports
- [ ] Export with anonymization
- [ ] Migration guide & data hydration
- [ ] User education & tooltips
- [ ] Accessibility review
- [ ] Build & deploy to staging

---

## 📚 Documentation Requirements

### For Phase 2 Sprint 2 Release
1. **CALENDAR_USER_GUIDE.md** - Tutorials for each context, feature walkthroughs
2. **CALENDAR_TECHNICAL_GUIDE.md** - Architecture, APIs, integration patterns
3. **CALENDAR_MIGRATION_GUIDE.md** - Schema migration, data hydration, rollout
4. **CALENDAR_ECOSYSTEM_SPECIFICATION.md** - MNI testing, mesh networking, multi-app sync
5. **CALENDAR_API_REFERENCE.md** - All service methods with examples

---

## ✅ Completion Checklist

### Code
- [ ] `src/services/CalendarService.ts` (CRUD, context binding, integrations)
- [ ] `src/types/calendar.ts` (Event, Incident, Poll, Role, Sync types)
- [ ] `src/components/calendar/EventForm.tsx` (quick + advanced modes)
- [ ] `src/components/calendar/EventDetails.tsx` (full event view with actions)
- [ ] `src/components/calendar/ContextSwitcher.tsx` (Individual/Family/Community/Prof tabs)
- [ ] `src/components/calendar/IncidentDashboard.tsx` (severity, escalation, resolution)
- [ ] `src/components/calendar/SyncControlPanel.tsx` (user sync preferences)
- [ ] Enhanced existing components (IncidentLogForm, PollCreationForm, etc.)
- [ ] Updated `src/pages/intranet/calendar.tsx` (new architecture)

### Testing
- [ ] Unit: Role permissions, poll quorum, recurrence math
- [ ] Integration: Cross-module links, sync preferences
- [ ] Load: 100+ events, 50+ reminders, mesh alerts
- [ ] UX: Color contrast, keyboard navigation, screen reader

### Documentation
- [ ] User guide with tutorials
- [ ] Technical architecture guide
- [ ] Migration plan with feature flags
- [ ] API reference documentation
- [ ] Ecosystem deployment guide

### Deployment
- [ ] Firestore rules updated & deployed
- [ ] All features tested on staging
- [ ] Build: 0 errors
- [ ] Team review & approval
- [ ] Rollout plan (feature flags by context)

---

## 🎯 Success Metrics

- ✅ Calendar loads without permission-denied errors
- ✅ All 4 contexts (Individual/Family/Community/Professional) functional
- ✅ Event-contact links work bidirectionally
- ✅ Incident escalation follows governance rules
- ✅ Polls show quorum progress in real-time
- ✅ Offline logging queues incidents for mesh dispatch
- ✅ Reports show accurate participation/support metrics
- ✅ Zero breaking changes to existing event viewing
- ✅ Build completes with 0 errors
- ✅ Staging deployment successful

---

## 📞 Questions & Clarifications

**Q**: Should existing events be migrated to new schema?  
**A**: Yes - add new fields with safe defaults; feature flag for new UX; show migration prompt to user.

**Q**: How do cross-context events behave?  
**A**: Visible in all selected contexts; default privacy is 'context' (only primary); 'cross_context' shows in all.

**Q**: What happens if a contact is deleted?  
**A**: Event links remain (soft references); UI shows "[Deleted Contact]"; no cascade delete.

**Q**: How are incident responders chosen?  
**A**: Auto-assign by governance (family steward, community safety lead, professional manager); user can override.

**Q**: Can users opt-out of event syncs?  
**A**: Yes - SyncSettings per module and context; respects privacy (no sync = no visibility).

---

## 📖 References

- **Existing Calendar**: `src/pages/intranet/calendar.tsx`
- **Existing Components**: `src/components/calendar/` (IncidentLogForm, PollCreationForm, etc.)
- **Contacts Service**: `src/services/ContactsService.ts`
- **Firestore Rules**: `firestore.rules`
- **User Model**: `src/contexts/AuthContext.tsx`

---

**Document Status**: 🟢 Complete | **Next Step**: Task 2 - Create types/calendar.ts
