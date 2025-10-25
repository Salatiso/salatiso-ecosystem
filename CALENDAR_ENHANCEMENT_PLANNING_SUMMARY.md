# 🎉 Calendar Enhancement - Planning Complete
**Date**: October 25, 2025  
**Project**: Phase 2 Sprint 3 - Major Calendar Enhancement  
**Status**: ✅ Planning & Specification Complete - Ready for Implementation

---

## 📊 Project Overview

A comprehensive, context-aware calendar system that transforms from a simple event tracker into a sophisticated multi-level event management platform supporting:

- **4 Context Levels**: Individual → Family → Community → Professional
- **2 Event Types**: Activities (planned) + Incidents (unplanned, escalation)
- **5 Roles**: Organizer, Participant, Supporter, Steward, Responder
- **Deep Integrations**: Contacts (birthdays, meetings), Assets (maintenance), Timeline (read-only), Projects (milestones)
- **Collaboration Features**: Polls with governance, assistance requests, incident escalation
- **Mesh Networking**: Sonny-first alerts, offline queuing, emergency dispatch
- **Multi-App Sync**: MNI (test), Web, Android, Community Dashboard, Professional Portal

**Preservation**: Zero breaking changes to existing Month/Week/Day views, categories, import/export, or event CRUD.

---

## 📚 Planning Documents Created

### 1. **CALENDAR_ENHANCEMENT_SPECIFICATION.md** (15 KB)
**Purpose**: Core technical specification  
**Contents**:
- Executive summary & project goals
- Existing functionality (preserved)
- Enhanced architecture (contexts, roles, event types)
- Complete data model (Event, Incident, Poll, Role, Sync types)
- Integration points (Contacts, Assets, Timeline, Projects)
- UI/UX design (layout, workflows, components)
- Firestore schema & security rules (pseudocode)
- Implementation phases (3.1-3.5)
- Success metrics & completion checklist

**Key Sections**:
- Event model with 40+ fields (metadata, timing, roles, links, audit trail)
- Incident model with severity + escalation path
- Role-based permissions (5 roles, granular per-role controls)
- Context-aware visibility (private, context, cross_context)
- Poll governance (quorum, veto, approval workflows)
- Firestore rules pseudocode (events, polls, assistance, sync)

---

### 2. **ECOSYSTEM_CALENDAR_SPECIFICATION.md** (12 KB)
**Purpose**: Multi-app deployment & mesh networking  
**Contents**:
- Multi-app architecture (Firestore SSOT + Sonny mesh)
- MNI (Mobile Native Interface) testing framework
- Ecosystem apps (Web, Android, Community, Professional)
- Sonny mesh integration (offline incidents, peer dispatch)
- Sync layers (Firestore, Mesh, App cache)
- Conflict resolution strategies (last_write_wins, prompt, policy_by_context)
- Rollout timeline (MNI → Web → Android → Ecosystem)
- Security & privacy controls (context-based visibility)

**Key Sections**:
- CalendarAPI contract (all apps implement same interface)
- Incident dispatch priority (CRITICAL > HIGH > MEDIUM > LOW)
- Offline logging with local queue → Firestore sync
- Sonny mesh transport priorities (WiFi Direct > Bluetooth > Internet)
- Feature flags for staged rollout
- Multi-layer data consistency (read/write paths)
- Mesh network configuration

---

### 3. **CALENDAR_ENHANCEMENT_ROADMAP.md** (14 KB)
**Purpose**: Implementation plan & sprint structure  
**Contents**:
- High-level sprint map (3.1-3.5, ~8-10 weeks)
- Sprint 3.1: Foundation (CalendarService, types, EventForm, Firestore rules)
- Sprint 3.2: Integrations (Contacts, Assets, Timeline, Projects)
- Sprint 3.3: Collaboration (Incidents, polls, assistance, roles)
- Sprint 3.4: Mesh Networking (Offline sync, Sonny integration)
- Sprint 3.5: Reporting & Rollout (Reports, migration, accessibility)
- Testing plans per sprint (unit, integration, manual, staging)
- Deliverables checklist
- Success metrics & KPIs
- Risk mitigation strategies
- Communication plan

**Key Sections**:
- Sprint 3.1 detailed: 5 tasks (CalendarService, types, EventForm, rules, build/deploy)
- Each task includes effort estimate, owner, DoD, test cases
- Integration testing strategy
- Manual QA checklist (browsers, devices, performance)
- Staging deployment validation
- Rollout timeline (weeks 1-7+)
- Success metrics (build quality, functional, performance, UX, rollout)
- External/internal dependencies
- Risk matrix (4 known risks with mitigations)

---

## 🎯 What's Preserved

### Existing Calendar Features (No Breaking Changes)
✅ **Month/Week/Day views** - Layout, navigation, rendering unchanged  
✅ **6 event categories** - Personal, work, family, maintenance, travel, compliance  
✅ **Event CRUD** - Add, edit, delete operations  
✅ **Recurring events** - daily, weekly, monthly, yearly  
✅ **Import/export** - .ics (iCalendar) and JSON formats  
✅ **Sidebar panels** - Selected date, upcoming, legend  
✅ **Search** - Title-based filtering  
✅ **Reminders** - Per-event notifications  
✅ **Attendees** - (enhanced to contact IDs)  
✅ **All-day events** - isAllDay flag  
✅ **User scoping** - Per-user event collections  

**Implementation Strategy**:
1. Map existing `CalendarEvent` → new `Event` interface with safe defaults
2. Add new fields with sensible defaults that don't affect old data
3. Feature flag (`CALENDAR_CONTEXT_ENABLED = false`) gates new UX
4. When flag disabled: show classic calendar view
5. When flag enabled: show context tabs + new features
6. Backward compatibility: events created before feature flag still work

---

## 🆕 New Capabilities (High-Level)

### 1. Multi-Context Organization
- **Individual**: Personal events (private)
- **Family**: Shared household/family events
- **Community**: Community group events (~5-50 people)
- **Professional**: Team/org events

### 2. Advanced Collaboration
- **Roles**: Organizer (full control) → Participant (RSVP) → Supporter (help)
- **Polls**: Vote on dates, themes, budgets with quorum logic
- **Assistance**: "Help needed" broadcast with responder tracking
- **Role Permissions**: Granular (read, rsvp, comment, vote, invite, edit, escalate, resolve)

### 3. Incident Management
- **Types**: Health, Safety, Property, Emotional Support, Other
- **Severity**: Low, Medium, High, Critical (with auto-escalation)
- **Escalation**: Move incidents between contexts (Individual → Family → Community → Professional)
- **Tracking**: Resolution notes, responder assignment, completion status

### 4. Deep Integrations
- **Contacts**: Birthdays auto-create annual events; meetings linked to contacts
- **Assets**: Maintenance schedules auto-create events; warranty dates → compliance events
- **Timeline**: Life events (births, ceremonies) appear read-only in calendar
- **Projects**: Milestones/tasks appear as events; bi-directional date sync

### 5. Offline & Mesh First
- **Offline Queue**: Create/edit events offline → sync on reconnect
- **Sonny Mesh**: Critical incidents broadcast via WiFi mesh + Bluetooth
- **Emergency Mode**: Incident dispatch prioritizes mesh, then internet
- **Local Caching**: Full calendar available offline

### 6. Reporting & Compliance
- **Individual Reports**: Participation metrics, goals alignment
- **Family Reports**: Event volume, support network health
- **Community Reports**: Participation rates, incident trends
- **Professional Reports**: Compliance calendars, SLA adherence
- **Export**: PDF/CSV with optional anonymization

---

## 📁 File Structure (Post-Implementation)

```
src/
├── services/
│   ├── CalendarService.ts          [NEW] Core calendar CRUD + context binding
│   └── ...existing services
│
├── types/
│   ├── calendar.ts                 [NEW] Event, Incident, Poll, Role, Sync types
│   └── ...existing types
│
├── components/calendar/
│   ├── EventForm.tsx               [NEW] Quick-add + advanced modes
│   ├── EventDetails.tsx            [NEW] Full event view with actions
│   ├── ContextSwitcher.tsx         [NEW] Individual/Family/Community/Prof tabs
│   ├── IncidentDashboard.tsx       [NEW] Incident tracking & escalation
│   ├── SyncControlPanel.tsx        [NEW] Per-user/per-module sync settings
│   ├── PollCard.tsx                [ENHANCE] Real-time voting UI
│   ├── AssistanceRequestCard.tsx   [ENHANCE] Help request broadcasting
│   ├── RoleAssignmentCard.tsx      [ENHANCE] Granular permission assignment
│   ├── IncidentLogForm.tsx         [ENHANCE] Quick-log + severity
│   └── ...existing components
│
├── pages/intranet/
│   └── calendar.tsx                [UPDATE] Refactored with new architecture
│
└── config/
    ├── featureFlags.ts             [UPDATE] CALENDAR_CONTEXT_ENABLED flag
    └── sonnyMesh.ts                [NEW] Mesh configuration + transport priority

firestore.rules                      [UPDATE] Add events, polls, assistance, sync rules
```

---

## 🚀 Implementation Phases (5 Sprints, ~8-10 weeks)

### Sprint 3.1: Foundation (Weeks 1-2)
**Deliverables**:
- CalendarService (CRUD, context binding, links)
- Type system (Event, Incident, Poll, Role, Sync)
- EventForm component (quick + advanced)
- Firestore rules (all new collections)
- Staging deployment

**Success Criteria**:
- ✅ Build: 0 errors
- ✅ CalendarService: 80%+ coverage
- ✅ All unit tests pass
- ✅ No permission-denied Firestore errors
- ✅ Existing calendar still works

### Sprint 3.2: Integrations (Weeks 3-4)
**Deliverables**:
- Contacts integration (birthdays → events)
- Assets integration (maintenance → events)
- Timeline integration (read-only)
- Projects integration (milestones → events)

**Success Criteria**:
- ✅ All integrations bi-directional
- ✅ No data loss/corruption
- ✅ Performance: <500ms per multi-link event
- ✅ All tests pass

### Sprint 3.3: Collaboration (Week 5)
**Deliverables**:
- Incident logging UI
- Polls with quorum logic
- Assistance requests
- Role assignment UI
- Escalation workflow

**Success Criteria**:
- ✅ Incidents escalate correctly
- ✅ Polls calculate quorum
- ✅ Assistance broadcast works
- ✅ Role permissions enforced

### Sprint 3.4: Mesh Networking (Week 6)
**Deliverables**:
- Offline incident logging
- Sonny mesh integration
- Emergency dispatch
- Local caching

**Success Criteria**:
- ✅ Offline queueing works
- ✅ Mesh delivery < 200ms (local)
- ✅ Sync on reconnect works
- ✅ No data loss

### Sprint 3.5: Reporting & Rollout (Week 7+)
**Deliverables**:
- Multi-context reports (Individual/Family/Community/Professional)
- Export with anonymization
- User migration guide
- Accessibility review (WCAG 2.1 AA)
- Ecosystem rollout (MNI → Web → Android → Community/Professional)

**Success Criteria**:
- ✅ Reports accurate
- ✅ Accessibility: AA compliance
- ✅ MNI testing complete
- ✅ Ecosystem apps integrated
- ✅ <2% critical bugs post-launch

---

## 📋 Implementation Checklist (Next Steps)

### Immediate (This Sprint)
- [ ] **Read & Review**: All 3 specification documents
- [ ] **Team Alignment**: Discuss architecture with backend/frontend/QA leads
- [ ] **Sprint Planning**: Detailed tasks for Sprint 3.1 (stories in Jira/Linear)
- [ ] **Codebase Prep**: Review existing calendar.tsx, ContactsService, AssetsService
- [ ] **Firestore Prep**: Ensure staging project ready for new rules

### Sprint 3.1 Kickoff
- [ ] Task 1: CalendarService implementation (8h)
- [ ] Task 2: Type system (6h)
- [ ] Task 3: EventForm component (10h)
- [ ] Task 4: Firestore rules (4h)
- [ ] Task 5: Build & deploy (2h)

### Testing & Quality
- [ ] Set up unit test infrastructure (Jest)
- [ ] Set up integration test infrastructure
- [ ] Configure ESLint + TypeScript strict mode
- [ ] Set up staging Firebase for testing
- [ ] Create QA checklist for each sprint

### Documentation
- [ ] Create CALENDAR_SPRINT_3.1_SUMMARY.md (post-sprint)
- [ ] Create CalendarService API reference
- [ ] Create UX guide with screenshots
- [ ] Create user migration guide (Phase 3.5)

---

## 🎓 Key Design Decisions

### 1. Preservation Over Breaking Changes
**Decision**: Add new features without removing old functionality  
**Rationale**: Users trust the existing calendar; gradual enhancement builds confidence  
**Implementation**: Feature flags, default values, backward-compatible schema

### 2. Firestore as SSOT (Single Source of Truth)
**Decision**: Firestore owns all event data; Sonny mesh is transport layer only  
**Rationale**: Ensures data consistency across apps; mesh handles latency/offline  
**Implementation**: Real-time listeners + local cache with conflict resolution

### 3. Context as Top-Level Organizer
**Decision**: Individual/Family/Community/Professional contexts are primary UI structure  
**Rationale**: Reflects Salatiso's philosophy ("from within to without")  
**Implementation**: Context tabs, filters, role assignment per context

### 4. Role-Based Permissions
**Decision**: Not just owner/viewer, but 5 granular roles with per-permission control  
**Rationale**: Enables sophisticated collaboration (polls, assistance, escalation)  
**Implementation**: EventRole interface with permission bitmap

### 5. Incidents as First-Class Events
**Decision**: Incidents (unplanned) treated as events with escalation workflows  
**Rationale**: Safety/health issues need immediate tracking + broadcast  
**Implementation**: IncidentEvent interface with severity + responder assignment

### 6. Mesh-First for Incidents, Internet-First for Events
**Decision**: Critical incidents prioritize Sonny mesh; normal events use Firestore  
**Rationale**: Emergency response can't wait for internet; reliability tradeoff  
**Implementation**: Dual dispatch with timeout + fallback

---

## 📞 Points of Contact

### Planning & Architecture
- **Project Lead**: [Name] - Overall project direction
- **Architecture Lead**: [Name] - Technical design, decisions
- **Product Manager**: [Name] - User needs, feature prioritization

### Implementation
- **Backend Lead**: [Name] - CalendarService, Firestore, integrations
- **Frontend Lead**: [Name] - UI components, EventForm, ContextSwitcher
- **Mesh/Sonny Lead**: [Name] - Offline sync, mesh integration

### Quality & DevOps
- **QA Lead**: [Name] - Testing strategy, automation
- **DevOps/Firebase**: [Name] - Deployments, Firestore management

---

## ✅ Sign-Off

**Planning Status**: 🟢 **COMPLETE**  
**Specification Quality**: ✅ Comprehensive, detailed, ready for implementation  
**Team Readiness**: 🟡 **Pending kickoff & resource allocation**  
**Next Milestone**: Sprint 3.1 Kickoff (detailed task planning)

---

## 📖 Related Documents

1. **CALENDAR_ENHANCEMENT_SPECIFICATION.md** - Core technical spec
2. **ECOSYSTEM_CALENDAR_SPECIFICATION.md** - Multi-app deployment
3. **CALENDAR_ENHANCEMENT_ROADMAP.md** - Sprint-by-sprint plan
4. **Existing Calendar Page**: `src/pages/intranet/calendar.tsx`
5. **Existing Components**: `src/components/calendar/` (IncidentLogForm, PollCreationForm, etc.)
6. **ContactsService**: `src/services/ContactsService.ts` (for birthday integration)

---

## 🎯 Success Vision (Phase 3 Complete)

**User Scenario**:
> "Grandma logs a health incident (fever) on her phone → Sonny mesh alerts the family → Aunt Sarah gets notification via WiFi mesh while at home → She responds "On my way" → Incident shows escalation path to doctor/hospital. Later, the family reviews the incident report in calendar, and it syncs to the professional healthcare portal. Grandma's health metrics from the community care contact are linked to the incident for context."

**Technical Excellence**:
- Zero permission-denied errors
- <100ms incident delivery over mesh
- 80%+ test coverage
- WCAG 2.1 AA accessibility
- Offline events queue → sync reliably
- Calendar loads <2s (100+ events)

---

**Document Created**: October 25, 2025  
**Version**: 1.0  
**Status**: 🟢 READY FOR SPRINT 3.1  
**Next Action**: Conduct team kickoff → assign Sprint 3.1 tasks

