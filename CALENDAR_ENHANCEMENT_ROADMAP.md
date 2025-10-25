# 🗺️ Calendar Enhancement - Implementation Roadmap
**Last Updated**: October 25, 2025  
**Project**: Phase 3 Sprint Series - Calendar Major Enhancement  
**Status**: Planning Complete - Ready for Sprint 3.1

---

## 📋 Project Overview

This roadmap translates the specifications (CALENDAR_ENHANCEMENT_SPECIFICATION.md and ECOSYSTEM_CALENDAR_SPECIFICATION.md) into actionable sprints with deliverables, testing gates, and deployment milestones.

**Project Duration**: 5 sprints (~8-10 weeks)  
**Delivery**: Phased rollout starting with MNI, expanding to ecosystem  
**Quality Gate**: 0 build errors, <2% critical bugs, accessibility AA

---

## 🎯 High-Level Sprint Map

```
Sprint 3.1: Foundation (Weeks 1-2)
  ├─ CalendarService + Types
  ├─ EventForm (quick + advanced)
  ├─ Firestore rules
  └─ Build & deploy to staging
  
Sprint 3.2: Integrations (Weeks 3-4)
  ├─ Contacts integration (birthdays, meetings)
  ├─ Assets integration (maintenance, compliance)
  ├─ Timeline integration (read-only)
  ├─ Projects integration (milestones)
  └─ Build & deploy to staging
  
Sprint 3.3: Collaboration (Week 5)
  ├─ Incidents logging & escalation
  ├─ Polls & voting with quorum
  ├─ Assistance requests
  ├─ Role assignment UI
  └─ Build & deploy to staging
  
Sprint 3.4: Mesh Networking (Week 6)
  ├─ Offline incident logging
  ├─ Sonny mesh integration
  ├─ Emergency dispatch
  └─ Build & deploy to staging
  
Sprint 3.5: Reporting & Rollout (Week 7+)
  ├─ Multi-context reports
  ├─ Export with anonymization
  ├─ User education & migration
  ├─ Accessibility review
  ├─ Final deployment
  └─ Ecosystem rollout
```

---

## 📦 Sprint 3.1: Foundation (Weeks 1-2)

### Overview
Establish the core architecture: service layer, type definitions, Firestore rules, and basic UI components. All existing functionality preserved during this sprint.

### Goals
- ✅ CalendarService fully functional with CRUD
- ✅ Type system complete (Event, Incident, Poll, Role, Sync types)
- ✅ EventForm supports quick-add and advanced flows
- ✅ Firestore rules secure all new collections
- ✅ Zero breaking changes to existing calendar
- ✅ Build with 0 errors

### Stories & Tasks

#### Task 1: Create CalendarService (`src/services/CalendarService.ts`)
**Effort**: 8 hours  
**Owner**: Backend lead  
**Definition of Done**:
- [ ] CRUD operations (create, read, update, delete events)
- [ ] Context binding (events linked to Individual/Family/Community/Professional)
- [ ] Link management (contact/asset/project/timeline)
- [ ] Real-time listeners for all collections
- [ ] Batch operations for imports
- [ ] Conflict resolution (last_write_wins, prompt, policy_by_context)
- [ ] Error logging with [CalendarService] prefix
- [ ] Unit tests: 80% coverage

**Implementation Checklist**:
```typescript
// src/services/CalendarService.ts

class CalendarService {
  // CRUD
  async createEvent(userId: string, data: CreateEventInput): Promise<string>
  async getEvent(eventId: string): Promise<Event | null>
  async getEvents(userId: string, filters?: EventFilters): Promise<Event[]>
  async updateEvent(eventId: string, updates: UpdateEventInput): Promise<void>
  async deleteEvent(eventId: string): Promise<void>
  
  // Context
  async getEventsByContext(userId: string, context: ContextLevel): Promise<Event[]>
  async bindEventToContext(eventId: string, context: ContextLevel): Promise<void>
  
  // Links
  async addEventLink(eventId: string, type: 'contact' | 'asset' | 'project' | 'timeline', id: string): Promise<void>
  async removeEventLink(eventId: string, type: string, id: string): Promise<void>
  async getLinkedData(eventId: string, type: string): Promise<any[]>
  
  // Real-time
  onEventsSnapshot(userId: string, callback: (events: Event[]) => void): () => void
  onEventSnapshot(eventId: string, callback: (event: Event | null) => void): () => void
  
  // Batch
  async importEvents(userId: string, events: Event[]): Promise<string[]>
  async exportEvents(userId: string, context?: string): Promise<Event[]>
  
  // Conflict Resolution
  private async resolveConflict(local: Event, remote: Event, strategy: ConflictStrategy): Promise<Event>
}
```

**Test Cases**:
- [ ] Create event with all fields
- [ ] Create event with minimal fields
- [ ] Get event by ID (exists/not exists)
- [ ] Update event fields individually
- [ ] Delete event (permanent)
- [ ] Add/remove links
- [ ] Real-time listener fires on updates
- [ ] Batch import 100 events
- [ ] Conflict resolution: last_write_wins
- [ ] Conflict resolution: prompt
- [ ] Error: permission denied
- [ ] Error: invalid context

---

#### Task 2: Create Type System (`src/types/calendar.ts`)
**Effort**: 6 hours  
**Owner**: Type system lead  
**Definition of Done**:
- [ ] All types defined and exported
- [ ] JSDoc comments on all interfaces
- [ ] Constants for enums (context levels, roles, categories, etc.)
- [ ] Type safety: no `any` types (except necessary escapes)
- [ ] Re-exported in `index.ts` for convenience
- [ ] TypeScript compilation: 0 errors

**Implementation**:
```typescript
// src/types/calendar.ts

// Base types
export type ContextLevel = 'individual' | 'family' | 'community' | 'professional';
export type Role = 'organizer' | 'participant' | 'supporter' | 'steward' | 'responder';
export type EventType = 'activity' | 'incident';
export type EventStatus = 'planned' | 'open' | 'in_progress' | 'resolved' | 'completed' | 'cancelled' | 'archived';
export type Visibility = 'private' | 'context' | 'cross_context';

// Event interface
export interface Event {
  id: string;
  userId: string;
  type: EventType;
  title: string;
  // ... (all 40+ fields as per spec)
}

// Incident interface
export interface IncidentEvent extends Event {
  type: 'incident';
  severity: SeverityLevel;
  // ... (incident-specific fields)
}

// Poll, Role, Sync, etc. interfaces

// Constants
export const CONTEXT_LEVELS: ContextLevel[] = ['individual', 'family', 'community', 'professional'];
export const ROLES: Role[] = ['organizer', 'participant', 'supporter', 'steward', 'responder'];
// ...
```

**Files Modified/Created**:
- [ ] `src/types/calendar.ts` (new, ~400 lines)
- [ ] `src/types/index.ts` (add export)

---

#### Task 3: Build EventForm Component (`src/components/calendar/EventForm.tsx`)
**Effort**: 10 hours  
**Owner**: UI lead  
**Definition of Done**:
- [ ] Quick-add flow (title, date, type, context)
- [ ] Advanced flow (5-step modal with sections)
- [ ] Form validation with error messages
- [ ] Context selector (Individual/Family/Community/Professional)
- [ ] Date/time picker with timezone support
- [ ] Category selector (maps to existing categories)
- [ ] Responsive: works on desktop, tablet, mobile
- [ ] Accessibility: keyboard nav, labels, ARIA
- [ ] Unit tests: form validation, submission
- [ ] Storybook stories

**Component Structure**:
```typescript
// src/components/calendar/EventForm.tsx
interface EventFormProps {
  mode: 'quick' | 'advanced';
  event?: Event;  // For editing
  onSubmit: (data: CreateEventInput) => Promise<void>;
  onCancel?: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ mode, event, onSubmit, onCancel }) => {
  if (mode === 'quick') return <QuickAddForm {...} />;
  return <AdvancedEventForm {...} />;
};

// Step 1: Details
// Step 2: Roles & Participants
// Step 3: Links (Contact/Asset/Project/Timeline)
// Step 4: Polls (optional)
// Step 5: Assistance (optional)
```

**Test Cases**:
- [ ] Quick-add: create event with title, date
- [ ] Quick-add: validation error for missing title
- [ ] Advanced: all 5 steps complete
- [ ] Advanced: skip optional steps
- [ ] Date picker: select date, time, timezone
- [ ] Category selector: shows all 6 categories
- [ ] Context tabs: switch between 4 contexts
- [ ] Mobile: form layout responsive
- [ ] Accessibility: Tab through all fields
- [ ] Submit: calls onSubmit with correct data

---

#### Task 4: Update Firestore Rules
**Effort**: 4 hours  
**Owner**: Security lead  
**Definition of Done**:
- [ ] `events` collection rules added
- [ ] `polls` collection rules added
- [ ] `assistanceRequests` collection rules added
- [ ] `userSyncSettings` collection rules added
- [ ] Role-based permissions enforced (organizer, participant, etc.)
- [ ] Context-aware access control
- [ ] Privacy rules: private/context/cross_context
- [ ] All rules deployed to Firebase
- [ ] No permission-denied errors in logs

**Rules Template** (pseudocode):
```rules
match /events/{eventId} {
  allow read: if canReadEvent();
  allow create: if canCreateEvent();
  allow update: if canUpdateEvent();
  allow delete: if canDeleteEvent();
}

function canReadEvent() {
  return request.auth != null && (
    isOwner() || 
    isInRoles() || 
    isCrossContextVisible()
  );
}

// ... (other functions)
```

**Testing**:
- [ ] Deploy rules to staging Firebase
- [ ] Test: Owner can read/write own event
- [ ] Test: Participant can read/vote/comment
- [ ] Test: Non-participant cannot read private event
- [ ] Test: Cross-context visible to allowed users
- [ ] Test: No permission-denied errors

---

#### Task 5: Build & Deploy Sprint 3.1
**Effort**: 2 hours  
**Owner**: DevOps lead  
**Definition of Done**:
- [ ] `npm run build` completes with 0 errors
- [ ] 0 TypeScript warnings
- [ ] 0 critical ESLint violations
- [ ] Firebase deploy: `firebase deploy --only firestore:rules,hosting:lifecv-d2724`
- [ ] Staging URL: https://lifecv-d2724.web.app
- [ ] Calendar page loads without permission errors
- [ ] Existing calendar views (Month/Week/Day) still work
- [ ] New event creation works (saves to Firestore)

**Pre-Deployment Checklist**:
- [ ] All unit tests pass
- [ ] No console errors in browser
- [ ] Firestore rules validated
- [ ] Git commit with sprint 3.1 tag
- [ ] Changelog updated

---

### Sprint 3.1 Testing Plan

#### Unit Testing
- [ ] CalendarService: 80%+ coverage
- [ ] EventForm: form validation and submission
- [ ] Type system: TypeScript compilation

#### Integration Testing
- [ ] Create event → appears in Firestore
- [ ] Update event → reflected in UI real-time
- [ ] Delete event → removed from calendar
- [ ] Form submission → saves to database
- [ ] Existing month/week/day views → still work

#### Manual Testing (QA)
- [ ] Browser: Chrome, Firefox, Safari
- [ ] Mobile: iOS Safari, Chrome Android
- [ ] Tablet: iPad landscape
- [ ] Firestore Console: verify events collection
- [ ] User: Can add event, see it on calendar, delete it

#### Staging Deployment
- [ ] Deploy to https://lifecv-d2724.web.app
- [ ] Test live with staging data
- [ ] No permission-denied errors
- [ ] Performance: event load <2s

---

### Sprint 3.1 Deliverables

| Deliverable | Status | File(s) |
|-----------|--------|---------|
| CalendarService | ✅ | `src/services/CalendarService.ts` |
| Type Definitions | ✅ | `src/types/calendar.ts` |
| EventForm Component | ✅ | `src/components/calendar/EventForm.tsx` |
| Firestore Rules | ✅ | `firestore.rules` |
| Updated Calendar Page | ✅ | `src/pages/intranet/calendar.tsx` |
| Unit Tests | ✅ | `src/**/*.test.ts` |
| Documentation | ✅ | `CALENDAR_SPRINT_3.1_SUMMARY.md` |

---

## 📦 Sprint 3.2: Integrations (Weeks 3-4)

### Overview
Connect calendar to Contacts, Assets, Family Timeline, and Projects. Build bi-directional sync where applicable.

### Goals
- ✅ Contact anniversaries auto-create calendar events
- ✅ Asset maintenance auto-create calendar events
- ✅ Family timeline events appear in calendar (read-only)
- ✅ Project milestones appear in calendar
- ✅ Event-contact/asset/project links work bi-directionally
- ✅ All integrations preserve data integrity
- ✅ Zero breaking changes to existing modules

### Key Stories

1. **Contacts Integration**
   - Birthday/anniversary → annual recurring event
   - Meeting request → contact-linked event
   - Contact profile quick-view in event details

2. **Assets Integration**
   - Maintenance schedule → recurring maintenance event
   - Warranty expiry → compliance event
   - Service provider → auto-linked contact

3. **Timeline Integration**
   - Life events (births, ceremonies) → read-only calendar entries
   - Admin can add reminders/activities
   - Link to ceremony project if exists

4. **Projects Integration**
   - Milestones → calendar events with deep links
   - Task deadlines → calendar events
   - Bi-directional date editing (event date change → project update)

### Testing Gates
- [ ] All integrations tested end-to-end
- [ ] No data loss or corruption
- [ ] Performance: <500ms for multi-link events
- [ ] Bi-directional sync working

---

## 📦 Sprint 3.3: Collaboration (Week 5)

### Overview
Enable multi-user event collaboration with roles, polls, assistance, and incident logging.

### Key Stories
1. **Incident Logging**: Quick-log with severity + auto-escalation
2. **Polls & Voting**: Date/time/theme polls with quorum logic
3. **Assistance Requests**: "Help needed" broadcast to audience
4. **Role Assignment**: Granular permissions per role
5. **Incident Escalation**: Move incidents between contexts with approval

---

## 📦 Sprint 3.4: Mesh Networking (Week 6)

### Overview
Integrate Sonny mesh for offline-first incident dispatch and peer-to-peer sync.

### Key Stories
1. **Offline Incident Logging**: Queue incidents locally, sync on reconnect
2. **Sonny Mesh Integration**: High-priority incident delivery
3. **Emergency Broadcast**: Critical incidents push via mesh + internet
4. **Local Caching**: Full calendar view works offline

---

## 📦 Sprint 3.5: Reporting & Rollout (Week 7+)

### Overview
Build reports, finalize documentation, and execute rollout plan.

### Key Stories
1. **Individual Reports**: Participation, assistance metrics
2. **Family Reports**: Event volume, support network health
3. **Community Reports**: Participation rates, incident trends
4. **Professional Reports**: Compliance, SLA adherence
5. **Export with Anonymization**: Generate PDFs/CSVs for sharing
6. **User Migration**: Feature flags + education
7. **Accessibility Review**: WCAG 2.1 AA compliance
8. **Ecosystem Rollout**: MNI → Web → Android → Community/Professional

---

## 🚀 Rollout Timeline

### Week 1-2: Sprint 3.1 (Foundation)
- [ ] Internal staging deployment
- [ ] Team review & sign-off
- [ ] Feature flag disabled (not visible in MNI)

### Week 3-4: Sprint 3.2 (Integrations)
- [ ] Enable feature flag in MNI only
- [ ] Internal testing of integrations
- [ ] Refinement based on feedback

### Week 5: Sprint 3.3 (Collaboration)
- [ ] Enable collaboration features in MNI
- [ ] Team testing
- [ ] Bug fixes

### Week 6: Sprint 3.4 (Mesh)
- [ ] Sonny mesh integration in MNI
- [ ] Offline testing
- [ ] Performance testing

### Week 7+: Sprint 3.5 & Rollout
- [ ] Documentation finalization
- [ ] Enable for all web app users
- [ ] Android app build & release
- [ ] Ecosystem app rollout
- [ ] Monitoring & hotfixes

---

## 📊 Success Metrics

### Build Quality
- ✅ 0 build errors
- ✅ 0 critical TypeScript errors
- ✅ <5 linter warnings
- ✅ 80%+ test coverage

### Functional
- ✅ All 5 sprints completed
- ✅ All 40+ requirements implemented
- ✅ Zero breaking changes to existing calendar
- ✅ All integrations working
- ✅ Offline sync functional

### Performance
- ✅ Event page load: <2s
- ✅ Add event form: <500ms submission
- ✅ Real-time listener: <100ms update
- [ ] Mesh incident delivery: <200ms (local WiFi)

### User Experience
- ✅ Accessibility: WCAG 2.1 AA
- ✅ Mobile responsive: tested on 3 sizes
- ✅ Color contrast: 4.5:1 minimum
- ✅ Keyboard navigation: full access without mouse

### Rollout
- ✅ MNI testing complete
- ✅ Web app deployment successful
- ✅ Android app released
- ✅ Ecosystem apps integrated
- ✅ <2% critical bug rate post-launch

---

## 📋 Dependencies & Blockers

### External Dependencies
- ✅ Firestore available (no changes to Firebase setup)
- ✅ ContactsService stable (exists in codebase)
- ✅ AssetsService stable (exists in codebase)
- ✅ ProjectsService stable (exists in codebase)
- ✅ TimelineService stable (exists in codebase)

### Internal Dependencies
- Sprint 3.1 must complete before 3.2 (service layer dependency)
- Sprint 3.2 must complete before 3.3 (data model dependency)
- Sprint 3.3 must complete before 3.4 (incident model dependency)
- Sprint 3.5 depends on all (1-4) complete

### Known Risks
- **Risk**: Firestore rules too restrictive → all operations fail
  - **Mitigation**: Test all CRUD operations in staging before rollout
- **Risk**: Performance issue with 100+ events
  - **Mitigation**: Load test in Sprint 3.1, optimize queries
- **Risk**: Integration bugs with existing modules
  - **Mitigation**: Extensive integration testing, feature flags for rollback
- **Risk**: Sonny mesh not available in community
  - **Mitigation**: Graceful fallback to internet-only, document limitation

---

## 📞 Communication Plan

### Weekly Standup
- Monday 10am: Sprint planning & blockers
- Wednesday 2pm: Progress check-in
- Friday 4pm: Week recap & next week preview

### Status Updates
- Daily: Slack #calendar-sprint channel
- Weekly: Status report in project tracker
- Sprint: Sprint review + retrospective

### Stakeholder Demos
- End of Sprint 3.1: Architecture & service layer
- End of Sprint 3.2: Integration demo
- End of Sprint 3.3: Collaboration demo
- End of Sprint 3.4: Offline & mesh demo
- End of Sprint 3.5: Full system demo + rollout plan

---

## 📚 Documentation Deliverables

| Document | Owner | Sprint | Status |
|----------|-------|--------|--------|
| CALENDAR_ENHANCEMENT_SPECIFICATION.md | Arch | 3.1 | ✅ Done |
| ECOSYSTEM_CALENDAR_SPECIFICATION.md | Arch | 3.1 | ✅ Done |
| CALENDAR_SPRINT_3.1_SUMMARY.md | Tech Lead | 3.1 | ⏳ TBD |
| CalendarService API Docs | Backend | 3.1 | ⏳ TBD |
| Calendar UX Guide | Design | 3.2 | ⏳ TBD |
| Sonny Mesh Integration Guide | Arch | 3.4 | ⏳ TBD |
| User Migration Guide | Product | 3.5 | ⏳ TBD |
| MNI Testing Framework | QA | 3.5 | ⏳ TBD |
| Accessibility Report | QA | 3.5 | ⏳ TBD |

---

## ✅ Sign-Off

**Project Lead**: [Name]  
**Arch Lead**: [Name]  
**Tech Lead**: [Name]  
**QA Lead**: [Name]  
**Date**: October 25, 2025  
**Status**: 🟢 Ready for Sprint 3.1 Kickoff

---

**Next Step**: Sprint 3.1 Planning Meeting → Begin Task 1: CalendarService implementation

