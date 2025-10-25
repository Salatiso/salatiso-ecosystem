# 📚 Calendar Enhancement - Quick Reference Guide
**Last Updated**: October 25, 2025  
**Purpose**: One-stop reference for all planning documents and key decisions  
**Audience**: Developers, QA, project managers

---

## 📖 Document Map

### Planning Phase Documents (✅ COMPLETE)
1. **CALENDAR_ENHANCEMENT_SPECIFICATION.md** (15 KB)
   - What: Comprehensive technical specification
   - Contains: Data models, UI/UX design, Firestore schema, integration specs
   - Use When: Need to understand feature requirements or API contracts
   - For: Developers, architects

2. **ECOSYSTEM_CALENDAR_SPECIFICATION.md** (12 KB)
   - What: Multi-app deployment & Sonny mesh integration
   - Contains: MNI testing framework, cross-app sync, incident dispatch
   - Use When: Integrating with Android/Community/Professional apps or mesh
   - For: Architects, DevOps, cross-team leads

3. **CALENDAR_ENHANCEMENT_ROADMAP.md** (14 KB)
   - What: Sprint-by-sprint implementation plan
   - Contains: 5 sprints, tasks, testing strategy, dependencies
   - Use When: Planning work, estimating effort, tracking progress
   - For: Project managers, tech leads, engineers

4. **CALENDAR_ENHANCEMENT_PLANNING_SUMMARY.md** (This file)
   - What: Executive summary & quick reference
   - Contains: Overview, key decisions, file structure, sign-off
   - Use When: New team member onboarding or quick lookup
   - For: Everyone

---

## 🎯 At a Glance

| Aspect | Details |
|--------|---------|
| **Project** | Phase 2 Sprint 3 - Calendar Major Enhancement |
| **Duration** | 5 sprints, ~8-10 weeks |
| **Contexts** | Individual, Family, Community, Professional |
| **Event Types** | Activities (planned), Incidents (unplanned) |
| **Roles** | Organizer, Participant, Supporter, Steward, Responder |
| **Integrations** | Contacts, Assets, Timeline, Projects |
| **Key Feature** | Sonny mesh-first incident dispatch |
| **Preservation** | 100% backward compatible, feature flag gated |
| **Build Status** | Ready to implement, 0 breaking changes |

---

## 🚀 Quick Start for Developers

### I'm Starting Sprint 3.1 - What Do I Do?

1. **Read** (1 hour):
   - CALENDAR_ENHANCEMENT_SPECIFICATION.md (Event data model section)
   - CALENDAR_ENHANCEMENT_ROADMAP.md (Sprint 3.1 section)

2. **Understand** (30 min):
   - Context levels (Individual → Family → Community → Professional)
   - Event type hierarchy (Activity vs Incident)
   - Role-based permissions (5 roles, granular per-permission)

3. **Code** (2 weeks):
   - Task 1: Implement CalendarService.ts
   - Task 2: Create types/calendar.ts
   - Task 3: Build EventForm.tsx
   - Task 4: Update firestore.rules
   - Task 5: Deploy to staging

### I'm Implementing Contacts Integration - What Do I Do?

1. **Read**:
   - CALENDAR_ENHANCEMENT_SPECIFICATION.md (Contacts Integration section)
   - CALENDAR_ENHANCEMENT_ROADMAP.md (Sprint 3.2 section)

2. **Understand**:
   - Birthday/anniversary → auto-create annual event
   - Meeting linked to contact with role assignment
   - Bi-directional sync (event change → contact update)

3. **Code**:
   - Add birthday field listener in ContactsService
   - Hook into calendar event creation for anniversaries
   - Implement contact profile quick-view in EventDetails

### I'm Testing the Calendar - What Do I Do?

1. **Read**:
   - CALENDAR_ENHANCEMENT_ROADMAP.md (Testing sections)
   - ECOSYSTEM_CALENDAR_SPECIFICATION.md (MNI Testing Framework)

2. **Setup**:
   - MNI mode: `?mni_mode=true` URL param
   - Feature flag: `CALENDAR_CONTEXT_ENABLED` toggle
   - Test in staging Firebase project

3. **Test**:
   - Context switching (all 4 tabs)
   - Event CRUD (create, read, update, delete)
   - Incident escalation
   - Polls & voting
   - Offline sync
   - Mesh dispatch

---

## 📋 Key Concepts Explained

### Context Levels
```
Individual
  ↓ (expands to family scope)
Family
  ↓ (expands to community scope)
Community
  ↓ (expands to professional scope)
Professional
```

**Example**: 
- Grandma creates "Community safety meeting" (Community context)
- Uncle sees it because he's family (cross-context visibility)
- He adds a note (participant role)
- Family gets notification via Sonny mesh (urgent)
- Meeting is added to professional incident log (escalation)

### Event Status Flow
```
planned → in_progress → completed → archived
  (or)
open → in_progress → resolved → archived  (for incidents)
  (or)
planned → cancelled → archived
```

### Incident Severity & Auto-Escalation
```
Low      → stays in Individual context
Medium   → notifies Family (30s timeout)
High     → notifies Family + Community (15s timeout)
Critical → broadcasts via Sonny mesh (5s timeout, then escalate)
```

### Sync Strategies
```
Firestore (Internet):
  ├─ Latency: 500ms-2s
  ├─ Guaranteed: Yes
  └─ Use: Standard events, voting, general updates

Sonny Mesh (WiFi/BT):
  ├─ Latency: 50-200ms
  ├─ Guaranteed: Best-effort
  └─ Use: Incidents, emergency alerts, family broadcasts

App Cache (Local):
  ├─ Latency: 0ms
  ├─ Guaranteed: Yes (but stale)
  └─ Use: Offline view, search, filtering
```

---

## 📁 File Structure (Post-Implementation)

```
Core Services & Types:
  src/services/CalendarService.ts       [NEW] 400+ lines
  src/types/calendar.ts                 [NEW] 300+ lines

UI Components:
  src/components/calendar/EventForm.tsx           [NEW] Quick + advanced
  src/components/calendar/EventDetails.tsx        [NEW] Full view
  src/components/calendar/ContextSwitcher.tsx    [NEW] Tab navigation
  src/components/calendar/IncidentDashboard.tsx  [NEW] Incident tracking
  src/components/calendar/SyncControlPanel.tsx   [NEW] User preferences
  src/components/calendar/PollCard.tsx           [ENHANCE]
  src/components/calendar/AssistanceRequestCard.tsx [ENHANCE]
  src/components/calendar/RoleAssignmentCard.tsx [ENHANCE]
  src/components/calendar/IncidentLogForm.tsx    [ENHANCE]

Page & Config:
  src/pages/intranet/calendar.tsx               [UPDATE]
  src/config/featureFlags.ts                    [UPDATE]
  src/config/sonnyMesh.ts                       [NEW]

Firestore:
  firestore.rules                               [UPDATE]
```

---

## 🎮 Feature Flags

### Development
```typescript
// src/config/featureFlags.ts

const MNI_CALENDAR_FLAGS = {
  CALENDAR_CONTEXT_ENABLED: false,      // 4 context tabs
  CALENDAR_INCIDENTS_ENABLED: false,    // Incident logging
  CALENDAR_POLLS_ENABLED: false,        // Voting UI
  CALENDAR_MESH_ENABLED: false,         // Sonny mesh
  CALENDAR_SYNC_CONTROL_ENABLED: false, // Sync prefs
};
```

### Rollout Timeline
```
Week 1-2:  All flags = false (internal testing)
Week 3-4:  Flags = true in MNI only
Week 5-6:  Flags = true in web app
Week 7+:   Flags = true everywhere
```

---

## 🧪 Testing Levels

### Unit (Per Component)
- CalendarService methods
- EventForm validation
- Type safety (TypeScript)
- Role permission logic
- Poll quorum calculation

### Integration (Cross-Module)
- Event creation → Firestore sync
- Contact birthday → auto-event
- Asset maintenance → auto-event
- Event update → real-time listener
- Incident → escalation workflow

### End-to-End (Full Feature)
- User logs in → sees calendar
- Creates event → appears in calendar
- Edits event → sync to Firestore
- Deletes event → removed from calendar
- Views incident → escalates correctly
- Offline → creates event → syncs on reconnect

### Load & Performance
- 100+ events load <2s
- Event add <500ms
- Real-time listener <100ms
- Mesh incident <200ms
- 50 concurrent users (no degradation)

---

## ⚠️ Known Constraints & Workarounds

| Constraint | Impact | Workaround |
|-----------|--------|-----------|
| Firestore write contention | Simultaneous edits on same event | Conflict resolution strategy (last_write_wins) |
| Mesh availability | Not in all areas | Fallback to internet (Firestore + FCM) |
| Offline queue size | Local storage limit | Prioritize incidents, auto-cleanup old events |
| Cross-context visibility | Performance | Indexed queries, pagination |
| Quorum calculation | Voting delays | Pre-calculate, cache results |

---

## 🔐 Security Model (Simple Version)

```
Firestore Rules:
  READ:   Owner OR in roles[] OR visibility=='cross_context'
  CREATE: Authenticated + set userId to self
  UPDATE: Owner OR has 'edit' permission
  DELETE: Owner only

Context Privacy:
  Private:       Only owner + invited participants
  Context:       Owner's context only
  CrossContext:  All allowed contexts can see
```

---

## 📊 Success Metrics (How We Know It Works)

**Code Quality**
- Build: 0 errors
- TypeScript: strict mode, 0 errors
- Tests: 80%+ coverage
- ESLint: <5 warnings

**Functional**
- All 5 sprints completed
- All 40+ requirements met
- Zero breaking changes
- All integrations working
- Offline sync functional

**Performance**
- Event load: <2s
- Add event: <500ms
- Real-time: <100ms
- Mesh incident: <200ms

**User Experience**
- Accessibility: WCAG 2.1 AA
- Mobile responsive
- Keyboard navigation
- Color contrast: 4.5:1

**Rollout**
- MNI testing: complete
- Web deployment: successful
- Android build: shipped
- Ecosystem integration: live
- Critical bugs: <2%

---

## 🔗 Integration Checklist

### Before Each Sprint
- [ ] Read sprint section from CALENDAR_ENHANCEMENT_ROADMAP.md
- [ ] Understand dependencies (what other sprints enable this)
- [ ] Review testing strategy for sprint
- [ ] Set up test data in staging Firebase

### After Each Sprint
- [ ] All unit tests pass (80%+ coverage)
- [ ] All integration tests pass
- [ ] Manual QA checklist complete
- [ ] No console errors or warnings
- [ ] Deploy to staging
- [ ] Get team sign-off before next sprint

### Before Production
- [ ] All 5 sprints complete
- [ ] Load testing passed
- [ ] Accessibility review (AA)
- [ ] Documentation complete
- [ ] Feature flag ready
- [ ] Rollout plan finalized

---

## 💬 Common Questions

**Q: Will existing events be lost?**  
A: No. Existing CalendarEvent data migrates to Event with new fields set to defaults. Feature flag lets users opt into new UI.

**Q: Can I use this without Sonny mesh?**  
A: Yes. Mesh is optional for performance. Falls back to Firestore + FCM push notifications.

**Q: How do I test offline functionality?**  
A: Use browser DevTools → Network tab → "Offline" checkbox. Create events while offline, see them queue for sync on reconnect.

**Q: What if Firestore rules are too restrictive?**  
A: Check browser console for "permission-denied" errors. Review firestore.rules and update to match intended access (use provided template).

**Q: Can I rollback the feature?**  
A: Yes. Feature flag = false disables all new UX. Events stay in Firestore (read-only via old calendar).

**Q: How many events can the calendar handle?**  
A: Tested up to 500 events in local cache. Firestore can handle millions (indexed queries on userId + context).

---

## 📞 Getting Help

### Documentation Questions
- Check relevant spec doc (CALENDAR_ENHANCEMENT_SPECIFICATION.md)
- Search this Quick Reference for concept explanation
- Ask in #calendar-sprint Slack channel

### Implementation Questions
- Sprint 3.1: Ask backend lead or @backend
- Integrations: Ask integration lead or @integration
- Mesh: Ask Sonny/mesh lead or @mesh
- Testing: Ask QA lead or @qa

### Deployment Questions
- Firestore rules: Ask Firebase lead or @firebase
- Staging: Ask DevOps or @devops
- Production rollout: Ask product manager or @pm

---

## ✅ Checklist for New Team Members

- [ ] Read this Quick Reference (10 min)
- [ ] Read CALENDAR_ENHANCEMENT_SPECIFICATION.md (30 min)
- [ ] Review CALENDAR_ENHANCEMENT_ROADMAP.md for your sprint (20 min)
- [ ] Explore existing calendar.tsx codebase (30 min)
- [ ] Check out feature branch (git clone + setup)
- [ ] Set up staging Firebase access
- [ ] Ask questions in team standup
- [ ] Pick up first task from Sprint 3.1

**Total onboarding time**: ~2 hours

---

## 📚 Related Files in Codebase

- **Existing Calendar**: `src/pages/intranet/calendar.tsx` (862 lines)
- **Existing Components**: `src/components/calendar/` (IncidentLogForm, PollCreationForm, etc.)
- **Existing Services**: `src/services/ContactsService.ts`, `AssetsService.ts`, `ProjectsService.ts`
- **Firestore Config**: `firestore.rules`
- **Firebase Config**: `src/config/firebase.ts`

---

## 🎓 Learning Resources

### Concepts
- **Contexts**: "From within to without" philosophy (individual → family → community → professional)
- **Mesh Networking**: Decentralized, offline-first with Sonny protocol
- **Event Hierarchy**: Activities (planned) vs Incidents (emergency)
- **Governance**: Role-based with quorum/veto for polls

### Technologies
- **Firestore**: Real-time database, security rules, transactions
- **Sonny Mesh**: WiFi Direct, Bluetooth peer-to-peer
- **React**: Hooks, context, real-time listeners
- **TypeScript**: Strict types, interfaces

### Examples
- **Contact Birthday**: Contacts → Calendar auto-event creation
- **Asset Maintenance**: Assets → Calendar schedule sync
- **Incident Escalation**: Individual health issue → Family alert → Professional medical record
- **Poll Voting**: Collaborative decision-making with governance rules

---

## 📝 Document Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Oct 25, 2025 | Initial creation - Planning phase complete |

---

## 🎯 Next Steps

1. **Now**: Team reads & discusses this guide + CALENDAR_ENHANCEMENT_SPECIFICATION.md
2. **Tomorrow**: Sprint 3.1 planning meeting with task assignments
3. **Next Week**: Begin Task 1 implementation (CalendarService)
4. **Sprint 3.1 Goal**: Foundation complete, staging deployment ready

---

**Document Status**: ✅ Complete & Ready for Team Distribution  
**Created**: October 25, 2025  
**For Questions**: Contact project lead or post in #calendar-sprint  

