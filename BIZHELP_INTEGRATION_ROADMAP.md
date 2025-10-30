# BizHelp Integration Roadmap for Salatiso-React-App (MNI)
**Version**: 1.0  
**Date**: October 30, 2025  
**Status**: Integration Specification  
**Purpose**: Align MNI Professional Services with BizHelp comprehensive updates

---

## 🎯 Executive Summary

The Salatiso-React-App (MNI) Professional Tab has been enhanced with enterprise-grade governance, human capital, and operations management modules (Phase 1-3 Complete). This document outlines the integration strategy to:

1. **Sync MNI Professional Services** with BizHelp updates in real-time
2. **Prevent data duplication** between apps
3. **Enable deep linking** for specialized operations in BizHelp
4. **Maintain MNI as Command Center** while BizHelp handles comprehensive business operations
5. **Create unified business management experience** across both apps

---

## 📊 Current State Analysis

### Salatiso-React-App (MNI) Professional Services
**Completed Modules:**

| Module | Components | Status | Scope |
|--------|-----------|--------|-------|
| **Governance** | CompanyProfileCard, ComplianceTracker, DocumentRepository, BoardRegistry, MeetingMinutes | ✅ Complete | Company constitution, board management, compliance |
| **Human Capital** | OrgChart, RoleDefinition, ContractManager, PerformanceReview, DevelopmentPlans | ✅ Complete | Org structure, roles, contracts, performance |
| **Operations** | ProjectCanvas, TaskTracker, MilestoneTimeline, KnowledgeBaseViewer, RiskRegister, IncidentReportForm | ✅ Complete | Projects, tasks, milestones, risks, incidents |

**Database Integration:**
- Firebase Firestore: `lifecv-d2724`
- Collections: `/companies/{companyId}/projects`, `/tasks`, `/milestones`, `/risks`
- Real-time Firestore listeners for live updates
- Audit logging for all operations

### BizHelp-React-App
**Comprehensive Business Management:**

| Module | Status | Scope |
|--------|--------|-------|
| **Entity & Compliance Wizard** | ⚠️ Partial | Multi-entity registration, document generation, CIPC workflows |
| **Partnership Toolkit** | ❌ Not Implemented | Agreement generators, operator–professional matching |
| **Marketplace** | ⚠️ Educational | Professional discovery, contracts, reputation |
| **Dual-Entity Builder** | ❌ Not Implemented | NPO + commercial structures |
| **Family Subsidiaries** | ❌ Not Implemented | Holding companies, subsidiaries |
| **Operations Dashboard** | ⚠️ Limited | Dashboard page exists but needs expansion |
| **Compliance Engine** | ⚠️ Basic | Manual tracking, needs automation |

---

## 🏗️ Integration Architecture

### Data Flow Model

```
┌─────────────────────────────────────────────────────────────┐
│ MNI (Salatiso-React-App)                                   │
│ • Professional Services Hub (Dashboard View)               │
│ • Family Governance Dashboard                              │
│ • Quick status checks for all business functions           │
│ • Navigation to specialized apps for detailed work         │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ (Read Governance, Projects, Risks)
                          │ (Write Activity Events)
                          │ (Deep Link for Edits)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ BizHelp (bizhelp-lifecv.web.app)                           │
│ • Business Operations Command Center                       │
│ • Entity Registration & Compliance                         │
│ • Comprehensive Operations Management                      │
│ • Partnership & Marketplace                                │
│ • Full CRUD for all business functions                     │
└─────────────────────────────────────────────────────────────┘
                          │
            ┌─────────────┼─────────────┐
            │             │             │
            ▼             ▼             ▼
        HRHelp        FinHelp      SafetyHelp
```

### Firestore Collection Alignment

**MNI Collections:**
- `/companies/{companyId}/governance/*` (Governance data)
- `/companies/{companyId}/humanCapital/*` (HR/People data)
- `/companies/{companyId}/projects/*` (Operations: projects)
- `/companies/{companyId}/tasks/*` (Operations: tasks)
- `/companies/{companyId}/risks/*` (Operations: risks)

**BizHelp Collections (Same Firebase Project):**
- `/businesses/{businessId}` (Entity registration, compliance)
- `/businesses/{businessId}/entities/*` (Multi-entity data)
- `/businesses/{businessId}/compliance/*` (Compliance obligations)
- `/businesses/{businessId}/partnerships/*` (Partnership agreements)
- `/businesses/{businessId}/operations/*` (Operations center data)

**Mapping Strategy:**
- `companyId` in MNI = `businessId` in BizHelp (same Firebase project)
- Collections cross-referenced via shared IDs
- Real-time listeners for bi-directional sync
- Conflict resolution: Last-write-wins with user override

---

## 🔄 Sync Strategy

### Phase 1: Read-Only Sync (MNI → BizHelp)

**MNI Reads from BizHelp:**
```javascript
// MNI queries BizHelp business data
GET /businesses/{companyId}
  Response: {
    id, name, type, stage, registration,
    directors, governance, compliance
  }

// Display business status in MNI dashboard
// Link to BizHelp for detailed management
```

**Implementation:**
```tsx
// In MNI Professional Tab
const [businessData, setBusinessData] = useState(null);

useEffect(() => {
  const ref = doc(db, 'businesses', companyId);
  const unsubscribe = onSnapshot(ref, (doc) => {
    setBusinessData(doc.data());
  });
  return unsubscribe;
}, [companyId]);

// Display snapshot of BizHelp data
// "Status: Registered | Registration: 2025/123456 | View Full Details →"
```

### Phase 2: Bi-Directional Activity Logging

**MNI Writes Activity Events to BizHelp:**
```javascript
// When MNI user creates project, updates compliance, adds governance doc
POST /activities/{userId}
  Body: {
    type: "project_created",
    source: "MNI",
    timestamp: "2025-10-30T...",
    companyId: "company_123",
    data: {
      projectId: "proj_456",
      projectName: "Q1 Expansion",
      status: "active"
    }
  }

// Activity appears in BizHelp unified activity feed
// Activity syncs to Hub for cross-app visibility
```

**Implementation:**
```tsx
// In MNI ProjectCanvas
const logActivity = async (type, data) => {
  await addDoc(collection(db, `activities/${user.uid}`), {
    type,
    source: 'MNI',
    companyId,
    timestamp: serverTimestamp(),
    data
  });
};

// After creating project
await logActivity('project_created', { projectId, projectName });
```

### Phase 3: Shared Operations Dashboard

**MNI Shows Summary, Links to BizHelp for Details:**

```tsx
// MNI Professional Tab - Operations Section
<div className="operations-dashboard">
  <div className="widget">
    <h3>Projects & Tasks</h3>
    <p>5 Active | 3 Completed | 2 At Risk</p>
    <button onClick={() => redirect(`${BIZHELP_URL}/projects`)}>
      Manage All Projects →
    </button>
  </div>

  <div className="widget">
    <h3>Compliance Status</h3>
    <p>3 Due This Month | 0 Overdue</p>
    <button onClick={() => redirect(`${BIZHELP_URL}/compliance`)}>
      View Compliance Calendar →
    </button>
  </div>

  <div className="widget">
    <h3>Partnerships & Marketplace</h3>
    <p>2 Active | 5 Professionals Available</p>
    <button onClick={() => redirect(`${BIZHELP_URL}/marketplace`)}>
      Explore Marketplace →
    </button>
  </div>
</div>
```

---

## 🔗 Deep Linking Strategy

### Route Mapping

**MNI → BizHelp Navigation:**
```javascript
// MNI Professional Services
const BIZHELP_BASE = 'https://bizhelp-lifecv.web.app';

const routes = {
  // Operations
  'project-details': `${BIZHELP_BASE}/projects/{projectId}`,
  'task-details': `${BIZHELP_BASE}/tasks/{taskId}`,
  'risk-register': `${BIZHELP_BASE}/risks`,
  
  // Compliance
  'compliance-calendar': `${BIZHELP_BASE}/compliance`,
  'entity-setup': `${BIZHELP_BASE}/wizard/entity`,
  
  // Governance
  'governance-docs': `${BIZHELP_BASE}/governance/documents`,
  'board-registry': `${BIZHELP_BASE}/governance/board`,
  
  // Human Capital
  'org-chart': `${BIZHELP_BASE}/hr/org-chart`,
  'roles': `${BIZHELP_BASE}/hr/roles`,
  
  // Marketplace
  'professionals': `${BIZHELP_BASE}/marketplace/professionals`,
  'partnerships': `${BIZHELP_BASE}/partnerships`,
  
  // Dashboard
  'dashboard': `${BIZHELP_BASE}/dashboard`
};
```

**Return Navigation:**
```javascript
// BizHelp → MNI
const returnTo = `${MNI_URL}/intranet/professional?company=${companyId}`;
const backLink = `${BIZHELP_URL}/action?returnTo=${encodeURIComponent(returnTo)}`;
```

---

## 📋 Implementation Plan

### Phase 1: MNI-BizHelp Link Integration (Week 1-2)

**Objectives:**
- Add BizHelp discovery to MNI Professional Services
- Implement read-only sync from BizHelp
- Add deep links to BizHelp for detailed operations
- Update MNI dashboard widgets to show BizHelp data

**Tasks:**

1. **Dashboard Link Widget**
   ```tsx
   // MNI Professional Tab - New Operations Section
   <BizHelpIntegrationWidget
     companyId={companyId}
     onNavigate={(path) => window.open(`${BIZHELP_URL}${path}`)}
   />
   ```

2. **Firestore Listeners for BizHelp Data**
   ```tsx
   // Listen to /businesses/{companyId} for real-time updates
   const [bizHelpData, setBizHelpData] = useState(null);
   const [bizHelpLoading, setBizHelpLoading] = useState(true);

   useEffect(() => {
     const ref = doc(db, 'businesses', companyId);
     const unsubscribe = onSnapshot(
       ref,
       (doc) => {
         setBizHelpData(doc.data());
         setBizHelpLoading(false);
       },
       (error) => console.error(error)
     );
     return unsubscribe;
   }, [companyId]);
   ```

3. **Status Cards with Links**
   ```tsx
   <div className="status-cards">
     <StatusCard
       title="Business Registration"
       status={bizHelpData?.registration?.status}
       link={`${BIZHELP_URL}/entity/${companyId}`}
     />
     <StatusCard
       title="Compliance Obligations"
       count={bizHelpData?.compliance?.obligations?.length}
       link={`${BIZHELP_URL}/compliance`}
     />
     <StatusCard
       title="Active Partnerships"
       count={bizHelpData?.partnerships?.length}
       link={`${BIZHELP_URL}/partnerships`}
     />
   </div>
   ```

4. **Activity Feed Integration**
   ```tsx
   // Show BizHelp activities in MNI activity feed
   <ActivityFeedWidget
     activities={[
       ...mniActivities,
       ...bizHelpActivities
     ]}
     source="ecosystem"
   />
   ```

### Phase 2: Bi-Directional Activity Logging (Week 3-4)

**Objectives:**
- Sync all MNI operations to BizHelp activity log
- Enable BizHelp activities to appear in MNI
- Create unified activity stream across apps

**Tasks:**

1. **Activity Logger Service**
   ```typescript
   // src/services/activityLogger.ts
   export class ActivityLogger {
     async logBusinessActivity(
       userId: string,
       companyId: string,
       type: string,
       data: any
     ) {
       await addDoc(collection(db, `activities/${userId}`), {
         type,
         source: 'MNI',
         companyId,
         timestamp: serverTimestamp(),
         data,
         visible: ['MNI', 'BizHelp', 'Hub']
       });
     }
   }
   ```

2. **Hook for Activity Logging**
   ```typescript
   // src/hooks/useActivityLogger.ts
   export const useActivityLogger = () => {
     const { user } = useAuth();
     const { company } = useProfessional();

     return {
       logProjectCreated: (project) =>
         ActivityLogger.logBusinessActivity(
           user.uid, company.id,
           'project_created',
           project
         ),
       logProjectUpdated: (project) =>
         ActivityLogger.logBusinessActivity(
           user.uid, company.id,
           'project_updated',
           project
         ),
       logComplianceCompleted: (obligation) =>
         ActivityLogger.logBusinessActivity(
           user.uid, company.id,
           'compliance_completed',
           obligation
         ),
       // ... other activity types
     };
   };
   ```

3. **Update All Operations Components**
   ```tsx
   // In ProjectCanvas.tsx
   const { logProjectCreated } = useActivityLogger();

   const handleCreateProject = async (projectData) => {
     const project = await operationsService.createProject(projectData);
     await logProjectCreated(project);
   };
   ```

### Phase 3: Shared Widgets & Views (Week 5-6)

**Objectives:**
- Create unified widget library for MNI & BizHelp
- Sync dashboard layouts between apps
- Enable widget customization across apps

**Tasks:**

1. **Shared Widget Component Library**
   ```tsx
   // src/components/shared-widgets/
   ├── KPITile.tsx
   ├── ProjectCard.tsx
   ├── ComplianceWidget.tsx
   ├── PartnershipCard.tsx
   ├── ActivityFeed.tsx
   └── StatusBadge.tsx
   ```

2. **Dashboard Configuration Sync**
   ```typescript
   // Store dashboard layout in Firestore
   // /users/{userId}/dashboardLayouts
   {
     layouts: [
       {
         name: "default",
         widgets: [
           { id: "kpi-overview", visible: true, position: 0 },
           { id: "activity-feed", visible: true, position: 1 },
           { id: "projects", visible: true, position: 2 }
         ]
       }
     ]
   }

   // MNI & BizHelp both read/write same layout
   // Changes sync across apps in real-time
   ```

3. **Unified Search**
   ```tsx
   // Search across MNI & BizHelp data
   <UnifiedSearch
     searchIn={['projects', 'risks', 'entities', 'partnerships']}
     results={
       [
         { type: 'project', title, source: 'MNI', link },
         { type: 'entity', title, source: 'BizHelp', link },
         ...
       ]
     }
   />
   ```

### Phase 4: Advanced Sync Features (Week 7+)

**Objectives:**
- Implement missing BizHelp features (Entity Wizard, Compliance Engine, Marketplace)
- Add offline support for both apps
- Enable conflict resolution workflows

**Tasks:**

1. **Entity Wizard Integration**
   - Create entity selection in MNI
   - Sync to BizHelp for full registration
   - Auto-generate compliance calendar

2. **Compliance Engine**
   - Track obligations in BizHelp
   - Show reminders in MNI
   - Automated deadline tracking

3. **Marketplace**
   - Professional discovery in BizHelp
   - Display available professionals in MNI
   - Contract management across apps

---

## 🔒 Security & Permissions

### RBAC Alignment

**MNI Roles → BizHelp Permissions:**
```
MNI Role          BizHelp Permission
─────────────────────────────────
Owner             Manage (full access)
Director          Edit (governance, compliance)
Manager           Operate (projects, tasks)
Professional      View + Respond (partnerships)
Viewer            Read-only (all)
```

### Firestore Security Rules

```javascript
// /businesses/{businessId}
match /businesses/{businessId} {
  allow read: if request.auth != null && 
    (isOwner(businessId) || isDirector(businessId));
  allow write: if request.auth != null && isOwner(businessId);
}

// /activities/{userId}/{activityId}
match /activities/{userId}/{activityId} {
  allow write: if request.auth.uid == userId;
  allow read: if request.auth != null && (
    request.auth.uid == userId || 
    isCompanyUser(getActivity(userId, activityId).companyId)
  );
}
```

---

## 📦 Deliverables Checklist

### Phase 1 (Week 1-2)
- [ ] BizHelp integration component created
- [ ] Firestore listeners implemented
- [ ] Deep links configured
- [ ] Status widgets showing BizHelp data
- [ ] Navigation buttons added to MNI Professional Tab

### Phase 2 (Week 3-4)
- [ ] Activity logger service created
- [ ] All MNI operations logging activities
- [ ] Activity feed showing cross-app events
- [ ] Real-time sync verified

### Phase 3 (Week 5-6)
- [ ] Shared widget library created
- [ ] Dashboard layouts synced
- [ ] Unified search implemented
- [ ] Widget customization working

### Phase 4 (Week 7+)
- [ ] Entity Wizard enhanced
- [ ] Compliance Engine implemented
- [ ] Marketplace functional
- [ ] Offline sync working

---

## 🚀 Deployment Strategy

### Staging Deployment (Current)
- **URL**: https://lifecv-d2724.web.app/ (MNI)
- **URL**: https://bizhelp-lifecv.web.app/ (BizHelp)
- **Firebase Project**: `lifecv-d2724`
- **Deploy**: `npm run deploy` after changes

### Production Deployment
- **Same URLs** (already configured)
- **Firebase Rules** updated for production
- **Monitoring** enabled for sync issues
- **Rollback plan** in place

---

## 📞 Communication Plan

### Stakeholder Updates
- **Weekly sync**: Show widget integration progress
- **Demo**: Live linking between MNI & BizHelp
- **UAT**: Test activity logging with real users
- **Launch**: Announce integration to all users

### Documentation
- [ ] Component integration guide
- [ ] Deep linking documentation
- [ ] Activity logging examples
- [ ] Troubleshooting guide

---

## 🎯 Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **Integration Coverage** | 80%+ of BizHelp features visible in MNI | 0% |
| **Activity Sync Latency** | <2s | N/A |
| **Cross-App Navigation** | <500ms | N/A |
| **User Satisfaction** | 4.5+/5 | N/A |
| **Data Consistency** | 100% | N/A |
| **Sync Reliability** | 99.9% uptime | N/A |

---

## 🔄 Next Steps

1. **Review this roadmap** with stakeholders
2. **Create Jira tickets** for each phase
3. **Start Phase 1 implementation** (Week 1)
4. **Deploy staging** (Week 2)
5. **Begin Phase 2** (Week 3)
6. **UAT with real users** (Week 6)
7. **Production launch** (Week 8)

---

**Questions?** Reference this document or create a detailed ticket for discussion.
