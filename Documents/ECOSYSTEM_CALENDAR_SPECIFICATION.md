# ECOSYSTEM CALENDAR SPECIFICATION

**Version:** 1.0  
**Date:** October 21, 2025  
**Status:** MASTER SPECIFICATION - Ready for Implementation  
**Scope:** MNI (Salatiso-React-App), LifeSync, The Hub  
**Timeline:** 6 weeks for Phase 1 implementation

---

## EXECUTIVE SUMMARY

This specification defines a unified, ecosystem-wide calendar system that serves as the backbone for:
- **Personal time management** (appointments, tasks, reminders)
- **Asset maintenance & renewals** (linked to AssetService)
- **Family coordination** (shared calendar with merged events)
- **Compliance tracking** (SARS dates, renewals, deadlines)
- **Guardian notifications** (travel alerts, follow-me-home)
- **External sync** (Google Calendar, imports from other apps)

### Core Principle
The calendar is not just a time tracker; it's a **relationship engine** that connects people, assets, events, and compliance obligations.

---

## VISION: CALENDAR AS OPERATIONAL HUB

### Level 1: Personal Calendar (Individual)
- User creates/manages own calendar events
- Events are evidence in their LifeCV (time allocation)
- Events linked to assets (maintenance dates)
- Events linked to contacts (follow-up reminders)
- Offline-first: works without internet
- Syncs to Google Calendar (optional)

**Example:**
- "Service car" event → Linked to vehicle asset → Mechanic contact notified → Receipt uploaded → Asset maintenance record updated

### Level 2: Family Calendar (Shared)
- User syncs calendar with family members
- User chooses what to share: all, work-only, personal-only, etc.
- Family members see user's shared events
- Family members' shared events appear
- Common events detected ("Mom picks up groceries" → shows on multiple calendars)
- Merged family view shows everyone's events
- Consensus for family events (dinner, trips, etc.)

**Example:**
- Sister and I sync calendars → I see her work trip to Cape Town → I mark as "require guardian notification" → I get alerts when her flight lands

### Level 3: Compliance Calendar (Ecosystem)
- Automatic events: SARS submission dates, license renewals, insurance renewals
- Linked to assets and contacts
- Pull from:
  - **AssetService:** "Renew vehicle license" (based on vehicle registration)
  - **FinHelp:** "Submit tax return" (based on SARS calendar)
  - **Insurance:** "Renew policy" (from InsuranceInfo on asset)
- Multi-jurisdiction (SA, ZA, US tax calendars available)

---

## COMPREHENSIVE DATA MODEL

### 1. Core Calendar Event Entity

```typescript
interface CalendarEvent {
  // Identity
  id: string;
  calendarId: string; // which calendar owns this event
  createdBy: string; // userId
  
  // Basic Info
  title: string;
  description?: string;
  location?: string;
  
  // Time (Critical for ecosystem)
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  timezone?: string;
  
  // Recurrence
  recurrence?: RecurrenceRule; // RRULE format
  recurringSeriesId?: string; // if part of series
  instanceDate?: Date; // if specific instance
  
  // Classification & Categories
  type: EventType;
  category: EventCategory;
  tags: string[]; // user-defined tags
  priority: 'critical' | 'high' | 'medium' | 'low';
  
  // Linking (Network Effects)
  linkedAssets: LinkedAsset[];
  linkedContacts: LinkedContact[];
  linkedDocuments: string[]; // documentIds
  linkedEvents: string[]; // other eventIds
  
  // Participants & Sharing
  attendees: EventAttendee[];
  isPublic: boolean;
  sharedWith: EventShare[];
  visibility: 'private' | 'family' | 'community' | 'public';
  requiresConfirmation: boolean;
  
  // Travel & Guardian Features (Critical for family)
  isTravel?: boolean;
  travelDetails?: {
    destination: string;
    transportation: string; // 'car', 'flight', 'train', 'bus'
    startPoint?: string;
    endPoint?: string;
    estimatedDistance?: number;
    estimatedDuration?: string; // "2 hours", "5 days"
    flightNumber?: string;
    driverContact?: string; // contactId
  };
  
  guardianNotification?: {
    enabled: boolean;
    guardianIds: string[]; // who to notify
    notificationType: 'departure' | 'arrival' | 'both' | 'checkpoint';
    notificationThreshold?: number; // miles away
  };
  
  followMeHome?: {
    enabled: boolean;
    guardianId?: string; // who to notify
    location: GeoLocation;
    radius: number; // meters
  };
  
  // Compliance & Tax Features
  complianceType?: ComplianceEventType;
  dueDate?: Date;
  reminderDaysBeforeDue?: number[];
  complianceStatus: 'upcoming' | 'due-soon' | 'overdue' | 'completed' | 'not-applicable';
  documentationRequired?: string[]; // what docs needed
  documentsAttached?: string[]; // which docs uploaded
  
  // Asset Linking (Maintenance Events)
  assetMaintenanceType?: MaintenanceType;
  estimatedCost?: number;
  actualCost?: number;
  costCategory?: 'maintenance' | 'repair' | 'upgrade' | 'inspection';
  maintenanceStatus: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  completionDate?: Date;
  notes?: string;
  
  // Integration with External Systems
  googleCalendarId?: string; // synced to Google
  externalSource?: {
    source: 'google' | 'outlook' | 'facebook' | 'linkedin' | 'custom';
    externalId: string;
    syncStatus: 'synced' | 'pending' | 'error';
    lastSyncDate?: Date;
  };
  
  // Reminders & Notifications
  reminders: Reminder[];
  notificationsSent: NotificationRecord[];
  
  // Sync Across Apps
  syncStatus: 'synced' | 'pending' | 'conflicted' | 'local';
  syncedToApps: ('mni' | 'lifesync' | 'hub')[];
  syncedWith: SyncRecord[];
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
  auditLog: AuditEntry[];
  
  // Status
  status: 'active' | 'cancelled' | 'completed' | 'tentative';
}

type EventType = 
  | 'personal'
  | 'work'
  | 'family'
  | 'community'
  | 'compliance'
  | 'maintenance'
  | 'travel'
  | 'health'
  | 'education'
  | 'other';

type EventCategory = 
  | 'meeting'
  | 'appointment'
  | 'deadline'
  | 'reminder'
  | 'celebration'
  | 'travel'
  | 'maintenance'
  | 'renewal'
  | 'tax-filing'
  | 'insurance'
  | 'task'
  | 'block-time'
  | 'other';

type ComplianceEventType = 
  | 'tax-filing'
  | 'renewal'
  | 'inspection'
  | 'registration'
  | 'review'
  | 'submission'
  | 'other';

type MaintenanceType = 
  | 'routine'
  | 'preventive'
  | 'repair'
  | 'inspection'
  | 'upgrade'
  | 'other';

interface LinkedAsset {
  assetId: string;
  assetName: string;
  linkType: string; // 'maintenance', 'renewal', 'inspection', 'tax-event'
  isPrimary: boolean;
}

interface LinkedContact {
  contactId: string;
  contactName: string;
  role: string; // 'participant', 'organizer', 'service-provider', 'guardian'
  notification: boolean; // notify this contact?
}

interface EventAttendee {
  userId?: string;
  contactId?: string;
  name: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
  responseDate?: Date;
}

interface EventShare {
  sharedWith: string; // userId or groupId
  scope: 'view' | 'edit';
  shareType: 'individual' | 'family' | 'community';
  consent: ConsentStatus;
}

interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  interval?: number;
  daysOfWeek?: string[];
  endDate?: Date;
  occurrences?: number;
  rruleString?: string; // RFC 5545 format
}

interface Reminder {
  id: string;
  type: 'notification' | 'email' | 'sms';
  minutesBefore: number;
  message?: string;
}

interface NotificationRecord {
  sentAt: Date;
  sentTo: string;
  method: 'push' | 'email' | 'sms' | 'in-app';
  status: 'sent' | 'failed' | 'delivered';
  message?: string;
}

interface SyncRecord {
  appId: 'mni' | 'lifesync' | 'hub';
  lastSyncDate: Date;
  status: 'success' | 'pending' | 'error';
  externalSync?: {
    platform: 'google' | 'outlook' | 'facebook' | 'linkedin';
    status: 'synced' | 'pending';
    error?: string;
  };
}

interface AuditEntry {
  timestamp: Date;
  action: string; // 'created', 'updated', 'synced', 'notified'
  changedBy: string;
  changes?: Record<string, any>;
}
```

### 2. Calendar Container

```typescript
interface Calendar {
  // Identity
  id: string;
  ownerId: string; // user who owns this calendar
  name: string;
  description?: string;
  color?: string;
  
  // Type
  calendarType: 'personal' | 'family' | 'work' | 'community' | 'compliance';
  
  // Sharing
  isShared: boolean;
  sharedWith: CalendarShare[];
  
  // Integration
  googleCalendarId?: string; // for Google sync
  importedFrom?: {
    source: 'google' | 'outlook' | 'facebook' | 'linkedin' | 'csv' | 'ics';
    lastImportDate: Date;
  };
  
  // Settings
  settings: {
    showWeekends: boolean;
    timeZone: string;
    defaultEventLength: number; // minutes
    workHoursStart?: string; // "09:00"
    workHoursEnd?: string; // "17:00"
  };
  
  // Sync
  syncStatus: 'synced' | 'pending' | 'error';
  syncedToApps: ('mni' | 'lifesync' | 'hub')[];
  
  createdAt: Date;
  updatedAt: Date;
}

interface CalendarShare {
  sharedWith: string; // userId
  role: 'view' | 'edit' | 'manage';
  sharedAt: Date;
}
```

---

## INTEGRATION: CALENDAR + ASSETS + CONTACTS

### Asset Maintenance Event Creation (Automatic)

```
WORKFLOW:
1. User creates ASSET: "2020 Toyota Camry"
   - Linked to contact: "John's Auto Service"
   - Last service: 12 months ago
   
2. SYSTEM AUTOMATICALLY CREATES EVENT:
   - Title: "Service car - 2020 Toyota Camry"
   - Category: Maintenance
   - Date: [today + 365 days]
   - Linked Asset: Vehicle
   - Linked Contact: John's Auto Service
   - Reminder: 7 days before
   
3. USER SEES EVENT IN CALENDAR:
   - Color-coded: maintenance events (e.g., orange)
   - Can click to see: vehicle details, contact info, service history
   
4. AS DUE DATE APPROACHES:
   - Reminder: "Service car in 7 days"
   - Reminder: "Service car in 1 day"
   - On due date: "Service car - today"
   
5. USER MARKS COMPLETE:
   - Enter actual cost: $150
   - Upload receipt photo
   - Mark as complete
   - System auto-updates asset record:
     - Last service date
     - Service cost logged
     - Next service automatically scheduled
```

### SARS Tax Calendar (Automatic Compliance)

```
SYSTEM CREATES ANNUAL EVENTS:
- January 15: "Estimate Q1 tax liability"
- February 28: "Annual financial records deadline"
- March 15: "Quarterly tax payment due"
- April 30: "Annual income tax return deadline (provisional)"
- June 15: "Balance of tax return due"
- August 15: "Final tax payment deadline"
- September 30: "VAT return due"
- November 15: "Quarterly tax payment due"
- December 15: "Estimate Q4 tax liability"

USER GETS NOTIFICATIONS:
- 30 days before: "Tax filing due in one month"
- 7 days before: "Tax filing due in one week"
- 1 day before: "Tax filing due tomorrow"

WHEN USER COMPLETES:
- Uploads tax return documents
- Marks event "completed"
- System flags in FinHelp integration
- Receipt stored in document repository
```

### Travel & Guardian Notification

```
SCENARIO: User plans trip to Durban

WORKFLOW:
1. User creates event: "Trip to Durban"
   - Date: Oct 25-27
   - Type: Travel
   - Destination: Durban
   - Transportation: Car
   - Enable Guardian Notification: YES
   - Guardian: Sister (contact)
   
2. SYSTEM CREATES LINKED EVENTS:
   - Oct 25, 08:00: "Departure to Durban"
   - Oct 27, 18:00: "Arrival from Durban"
   
3. NOTIFICATIONS SENT:
   - Sister gets: "Your sibling is traveling to Durban"
   - Sister can: See route, ETA, contact info
   - Sister's calendar: Event appears as "Sister in Durban"
   
4. "FOLLOW ME HOME" FEATURE:
   - As user drives home: app tracks location (with consent)
   - If app detects user hasn't arrived by ETA + 1 hour
   - Send alert to sister: "Sister hasn't arrived, distance still 150km"
   - Sister can: Call, text, or send emergency services if needed
   
5. ON ARRIVAL:
   - User app detects arrival at home location
   - Notification sent: "Sister arrived home safely"
   - Calendar event auto-marked complete
```

---

## EXTERNAL SYNC: GOOGLE CALENDAR & IMPORTS

### Google Calendar Integration

```typescript
interface GoogleCalendarSync {
  // OAuth Integration
  oauthToken: string; // encrypted in Firestore
  refreshToken: string; // encrypted
  accessTokenExpiry: Date;
  
  // Sync Settings
  syncDirection: 'one-way-import' | 'one-way-export' | 'two-way';
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'manual';
  
  // Calendar Mapping
  googleCalendarIds: string[]; // which Google calendars to sync
  mniBoundCalendarIds: string[]; // which MNI calendars receive data
  
  // Conflict Resolution
  conflictStrategy: 'keep-mni' | 'keep-google' | 'merge' | 'ask-user';
  
  // Status
  lastSyncDate: Date;
  syncStatus: 'synced' | 'syncing' | 'error';
  lastError?: string;
}

SYNC FLOW:
1. User clicks "Connect Google Calendar"
2. OAuth2 flow: User authorizes app
3. Tokens stored encrypted in Firestore
4. Initial sync: Get all Google Calendar events
5. Map Google events → MNI events
6. On ongoing sync:
   - Every event in Google → appears in MNI (with source marker)
   - Every event in MNI → can optionally sync to Google
   - Conflicts: Use conflict strategy
```

### Import from Other Sources

```
SUPPORTED FORMATS:
1. Google Calendar (OAuth + export ICS)
2. Outlook Calendar (export .ics)
3. Facebook Events (download .ics)
4. LinkedIn Events (CSV export)
5. Generic ICS file (drag & drop)
6. CSV file (with field mapping)
7. JSON file (with instructions)

IMPORT WORKFLOW:

For ICS files:
  1. User clicks "Import from ICS"
  2. Drag & drop or browse for file
  3. Preview: Show events to be imported
  4. Confirm: "Import 42 events?"
  5. System parses ICS
  6. Creates MNI events
  7. Links to calendars
  8. Shows summary: "42 events imported"

For CSV files:
  1. User clicks "Import from CSV"
  2. Upload CSV file
  3. Field mapping: Help user map columns
     - Column A (Date) → Event Start Date
     - Column B (Time) → Event Start Time
     - Column C (Title) → Event Title
     - Column D (Location) → Event Location
  4. Preview: Show mapped events
  5. Confirm import
  6. System creates events
  7. Shows summary

For JSON files:
  1. User clicks "Import from JSON"
  2. Upload JSON file
  3. System attempts to parse using schema
  4. If error: Show user conversion instructions
  5. User can paste instructions + JSON into Claude/Gemini
  6. Claude outputs correctly formatted JSON
  7. User uploads converted JSON
  8. System imports
```

---

## FIRESTORE SCHEMA

```
users/{userId}
  ├─ calendars/
  │  ├─ {calendarId}
  │  │  ├─ name: string
  │  │  ├─ type: 'personal' | 'family' | 'work'
  │  │  ├─ color: string
  │  │  ├─ googleCalendarId: string
  │  │  └─ settings: {}
  │  │
  │  └─ events/
  │     └─ {eventId}
  │        ├─ title: string
  │        ├─ startTime: Timestamp
  │        ├─ endTime: Timestamp
  │        ├─ linkedAssets: LinkedAsset[]
  │        ├─ linkedContacts: LinkedContact[]
  │        ├─ syncStatus: string
  │        ├─ isTravel: boolean
  │        ├─ guardianNotification: {}
  │        └─ auditLog: AuditEntry[]
  │
  └─ googleCalendarSync/
     ├─ token: string (encrypted)
     ├─ refreshToken: string (encrypted)
     ├─ syncStatus: 'synced' | 'error'
     └─ lastSyncDate: Timestamp

families/{familyId}
  └─ sharedCalendar/
     └─ events/ (merged view of family member calendars)

compliance/
  └─ templates/
     ├─ sa-tax-calendar/
     │  └─ events: []
     ├─ sa-vehicle-renewal/
     │  └─ events: []
     └─ insurance-renewal/
        └─ events: []
```

---

## SERVICE INTERFACE

```typescript
interface ICalendarService {
  // Calendar CRUD
  createCalendar(userId: string, calendar: Partial<Calendar>): Promise<string>;
  getCalendar(userId: string, calendarId: string): Promise<Calendar>;
  getUserCalendars(userId: string): Promise<Calendar[]>;
  updateCalendar(userId: string, calendarId: string, updates: Partial<Calendar>): Promise<void>;
  deleteCalendar(userId: string, calendarId: string): Promise<void>;
  
  // Event CRUD
  createEvent(userId: string, calendarId: string, event: Partial<CalendarEvent>): Promise<string>;
  getEvent(userId: string, eventId: string): Promise<CalendarEvent>;
  getCalendarEvents(userId: string, calendarId: string, dateRange?: DateRange): Promise<CalendarEvent[]>;
  updateEvent(userId: string, eventId: string, updates: Partial<CalendarEvent>): Promise<void>;
  deleteEvent(userId: string, eventId: string): Promise<void>;
  
  // Asset Linking
  linkAssetToEvent(userId: string, eventId: string, assetId: string, linkType: string): Promise<void>;
  unlinkAssetFromEvent(userId: string, eventId: string, assetId: string): Promise<void>;
  getAssetEvents(userId: string, assetId: string): Promise<CalendarEvent[]>;
  
  // Contact Linking
  linkContactToEvent(userId: string, eventId: string, contactId: string, role: string): Promise<void>;
  unlinkContactFromEvent(userId: string, eventId: string, contactId: string): Promise<void>;
  
  // Family Calendar
  createFamilyCalendar(familyId: string): Promise<string>;
  getFamilyCalendar(familyId: string): Promise<MergedCalendarView>;
  
  // Compliance Events
  createComplianceEvent(userId: string, complianceType: string): Promise<string>;
  getComplianceEvents(userId: string, year: number): Promise<CalendarEvent[]>;
  
  // Travel & Guardian
  enableGuardianNotification(userId: string, eventId: string, guardianId: string): Promise<void>;
  enableFollowMeHome(userId: string, eventId: string, guardianId: string): Promise<void>;
  notifyGuardian(eventId: string, event: 'departure' | 'arrival' | 'checkpoint'): Promise<void>;
  
  // Google Calendar Integration
  authorizeGoogleCalendar(userId: string, code: string): Promise<void>;
  syncGoogleCalendar(userId: string, direction?: 'import' | 'export' | 'both'): Promise<void>;
  
  // Import/Export
  importFromICS(userId: string, calendarId: string, icsContent: string): Promise<number>;
  importFromCSV(userId: string, calendarId: string, csvContent: string, fieldMapping: FieldMapping): Promise<number>;
  importFromJSON(userId: string, calendarId: string, jsonContent: string): Promise<number>;
  exportToICS(userId: string, calendarId: string): Promise<string>;
  exportToJSON(userId: string, calendarId: string): Promise<string>;
  
  // Sharing
  shareCalendar(userId: string, calendarId: string, targetUserId: string, role: 'view' | 'edit'): Promise<void>;
  unshareCalendar(userId: string, calendarId: string, targetUserId: string): Promise<void>;
  getSharedCalendars(userId: string): Promise<Calendar[]>;
  
  // Sync
  syncCalendar(userId: string, calendarId: string, targetApp: string): Promise<void>;
  getSyncHistory(userId: string, calendarId: string): Promise<SyncRecord[]>;
}
```

---

## UI/UX FLOWS

### Calendar Page - Main View

```
HEADER:
├─ Calendar selector dropdown (Personal / Family / Work / Compliance)
├─ View toggle (Month / Week / Day / List)
├─ Date picker (jump to date)
└─ Search bar (find events)

LEFT SIDEBAR:
├─ Calendar list with checkboxes (show/hide)
├─ "Create Event" button
├─ "Import Calendar" button
├─ "Share Calendar" button
├─ "Settings" button
└─ "Google Sync" toggle

MAIN CALENDAR AREA:
├─ Color-coded events by type:
│  ├─ Personal (blue)
│  ├─ Maintenance (orange)
│  ├─ Compliance (red)
│  ├─ Travel (green)
│  ├─ Family (purple)
│  └─ Other (gray)
│
├─ Event details on hover:
│  ├─ Title
│  ├─ Time
│  ├─ Linked asset/contact (if any)
│  └─ Status badges (synced, pending, conflict)
│
└─ Click event → Open detail view
```

### Event Detail View

```
HEADER:
├─ Event title
├─ Time display
├─ Status badge (pending, synced, etc.)
└─ Action buttons: Edit / Delete / Sync

SECTIONS:
├─ Basic Info
│  ├─ Title
│  ├─ Description
│  ├─ Time & Date
│  ├─ Location
│  └─ Category/Type
│
├─ Linked Assets
│  ├─ Asset name
│  ├─ Link type (maintenance, renewal, etc.)
│  ├─ Remove link button
│  └─ "Link another asset" button
│
├─ Linked Contacts
│  ├─ Contact name
│  ├─ Role
│  ├─ Notification checkbox
│  └─ "Link another contact" button
│
├─ Travel & Guardian (if applicable)
│  ├─ Travel destination
│  ├─ Transportation method
│  ├─ Guardian notification: ON/OFF
│  ├─ Guardian selector
│  ├─ Follow-me-home: ON/OFF
│  └─ Map showing route
│
├─ Recurrence (if recurring)
│  ├─ Frequency selector
│  ├─ End date
│  └─ Edit series / Edit only this event
│
├─ Reminders
│  ├─ Add reminder button
│  ├─ Reminder list with times
│  └─ Remove reminder buttons
│
└─ Sync Status
   ├─ Synced to apps: MNI / LifeSync / Hub
   ├─ Google Calendar sync status
   ├─ Last sync date
   └─ Manual sync button
```

---

## IMPLEMENTATION ROADMAP

### Phase 1A (Week 1-2): Foundation
- [ ] Enhance `CalendarService.ts` with asset/contact linking
- [ ] Update Event data model
- [ ] Build calendar main page with month/week view
- [ ] Build event creation wizard
- [ ] Create event detail page
- [ ] Deploy to MNI

### Phase 1B (Week 3-4): External Sync
- [ ] Implement Google Calendar OAuth integration
- [ ] Build ICS import functionality
- [ ] Build CSV import functionality
- [ ] Add import/export UI buttons
- [ ] Test syncing with Google Calendar

### Phase 2 (Week 5-6): Family & Advanced
- [ ] Implement family calendar merging
- [ ] Add travel & guardian notification
- [ ] Implement follow-me-home feature
- [ ] Create compliance calendar templates
- [ ] Add maintenance event automation
- [ ] Sync to LifeSync

### Phase 3 (Week 7-8): Polish
- [ ] Mobile optimization
- [ ] Performance tuning
- [ ] Full sync to Hub
- [ ] Testing & bug fixes
- [ ] Deployment

---

## SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| Google Sync | 100% | Events sync correctly |
| Import Success | 95% | Files import without errors |
| Family Merge | 100% | Calendars merge correctly |
| Travel Alerts | 100% | Guardians notified |
| Asset Linking | 100% | Events linked to assets |
| Performance | < 1s load | All views responsive |

---

**Status:** ✅ SPECIFICATION COMPLETE  
**Next:** Enhance Calendar Service & UI Components

