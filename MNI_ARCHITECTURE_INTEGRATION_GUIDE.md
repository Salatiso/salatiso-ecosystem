# MNI Professional Tab - Architecture & Integration Guide
**Date**: October 30, 2025

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Component Structure](#component-structure)
3. [Data Flow & State Management](#data-flow--state-management)
4. [Firebase Schema](#firebase-schema)
5. [Service Layer](#service-layer)
6. [Integration Points](#integration-points)
7. [API Specifications](#api-specifications)

---

## Architecture Overview

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                  Professional Tab Main Page                 │
│            (src/pages/professional/index.tsx)              │
└────────────┬────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    v                 v
┌─────────────┐  ┌──────────────┐
│ Governance  │  │ Human Capital│  ┌─────────────┐
│   Module    │  │   Module     │  │ Operations  │
└─────────────┘  └──────────────┘  │   Module    │
                                   └─────────────┘
    │                 │                  │
    v                 v                  v
┌─────────────┐  ┌──────────────┐  ┌──────────────┐
│Company Setup│  │Role & Org    │  │Project Mgmt  │
│Governance   │  │Appointments  │  │Knowledge Base│
│Board Mgmt   │  │Performance   │  │Risk Mgmt     │
└─────────────┘  └──────────────┘  └──────────────┘

    │                 │                  │
    └─────────────────┼──────────────────┘
                      │
            ┌─────────┴────────┐
            │                  │
            v                  v
      ┌──────────────┐   ┌──────────────┐
      │ Finance Tab  │   │ Marketing Tab│
      └──────────────┘   └──────────────┘
            │                  │
            v                  v
      ┌──────────────┐   ┌──────────────┐
      │  FinHelp     │   │  BizHelp     │
      │  (External)  │   │  (External)  │
      └──────────────┘   └──────────────┘
```

### Technology Stack

- **Frontend**: React 18+ with TypeScript
- **State Management**: Context API + Custom Hooks
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth (integrated with AuthContext)
- **Styling**: Tailwind CSS (consistent with existing app)
- **Animation**: Framer Motion
- **Icons**: Lucide React

---

## Component Structure

### Folder Organization

```
src/
├── pages/
│   ├── professional/
│   │   ├── index.tsx                 # Main professional page
│   │   └── [module].tsx               # Dynamic module pages
│   ├── intranet/
│   │   └── business/
│   │       ├── governance.tsx         # Governance module
│   │       ├── human-capital.tsx      # HR module
│   │       ├── operations.tsx         # Operations module
│   │       ├── finance.tsx            # Finance module (NEW)
│   │       ├── marketing.tsx          # Marketing module (NEW)
│   │       └── reporting.tsx          # Reporting module (NEW)
│   │
├── components/
│   ├── professional/
│   │   ├── layouts/
│   │   │   └── ProfessionalLayout.tsx
│   │   ├── governance/
│   │   │   ├── CompanyProfileCard.tsx
│   │   │   ├── ComplianceTracker.tsx
│   │   │   ├── DocumentRepository.tsx
│   │   │   ├── PolicyLibrary.tsx
│   │   │   ├── PolicyEditor.tsx
│   │   │   ├── BoardRegistry.tsx
│   │   │   ├── MeetingMinutes.tsx
│   │   │   ├── ConflictDeclaration.tsx
│   │   │   └── index.ts
│   │   ├── human-capital/
│   │   │   ├── OrgChartViewer.tsx
│   │   │   ├── RoleDefinitionEditor.tsx
│   │   │   ├── RoleAssignmentManager.tsx
│   │   │   ├── RBACConfigurationPanel.tsx
│   │   │   ├── ContractManager.tsx
│   │   │   ├── GoalSettingWizard.tsx
│   │   │   ├── PerformanceReviewForm.tsx
│   │   │   ├── 360FeedbackCollector.tsx
│   │   │   ├── SkillsInventory.tsx
│   │   │   ├── DevelopmentPlanBuilder.tsx
│   │   │   └── index.ts
│   │   ├── operations/
│   │   │   ├── ProjectCanvas.tsx
│   │   │   ├── ApprovalWorkflow.tsx
│   │   │   ├── TaskTracker.tsx
│   │   │   ├── KnowledgeBase.tsx
│   │   │   ├── RiskRegister.tsx
│   │   │   ├── IncidentReporter.tsx
│   │   │   └── index.ts
│   │   ├── finance/
│   │   │   ├── BudgetPlanner.tsx
│   │   │   ├── ExpenseTracker.tsx
│   │   │   ├── FinancialDashboard.tsx
│   │   │   └── index.ts
│   │   ├── marketing/
│   │   │   ├── CampaignManager.tsx
│   │   │   ├── PartnerCRM.tsx
│   │   │   └── index.ts
│   │   └── reporting/
│   │       ├── ExecutiveDashboard.tsx
│   │       ├── DepartmentDashboard.tsx
│   │       ├── AuditLogViewer.tsx
│   │       └── index.ts
│   │
├── contexts/
│   ├── ProfessionalContext.tsx         # NEW
│   ├── AuthContext.tsx                 # EXISTING
│   └── index.ts
│
├── services/
│   ├── governance.service.ts           # NEW
│   ├── humanCapital.service.ts         # NEW
│   ├── operations.service.ts           # NEW
│   ├── finance.service.ts              # NEW
│   ├── marketing.service.ts            # NEW
│   ├── reporting.service.ts            # NEW
│   └── index.ts
│
├── hooks/
│   ├── useGovernance.ts                # NEW
│   ├── useHumanCapital.ts              # NEW
│   ├── useOperations.ts                # NEW
│   ├── useFinance.ts                   # NEW
│   ├── useMarketing.ts                 # NEW
│   ├── useReporting.ts                 # NEW
│   └── index.ts
│
├── types/
│   ├── professional.types.ts           # NEW
│   └── index.ts
│
└── utils/
    ├── dateUtils.ts
    ├── formatters.ts
    └── validators.ts
```

---

## Data Flow & State Management

### Context Structure

```typescript
// src/contexts/ProfessionalContext.tsx

interface CompanyData {
  id: string;
  name: string;
  registrationNumber: string;
  taxId: string;
  incorporationDate: Date;
  jurisdiction: string;
  status: 'active' | 'dormant' | 'dissolved';
}

interface GovernanceData {
  constitution: Constitution;
  policies: Policy[];
  boardMembers: BoardMember[];
  complianceEvents: ComplianceEvent[];
}

interface HumanCapitalData {
  roles: RoleDefinition[];
  assignments: RoleAssignment[];
  contracts: Contract[];
  reviews: PerformanceReview[];
}

interface OperationsData {
  projects: Project[];
  risks: RiskItem[];
  incidents: IncidentReport[];
  documents: Document[];
}

interface FinanceData {
  budgets: Budget[];
  expenses: Expense[];
  invoices: Invoice[];
}

interface MarketingData {
  campaigns: MarketingCampaign[];
  partners: Partner[];
}

interface ProfessionalContextType {
  // Company State
  currentCompany: CompanyData | null;
  setCurrentCompany: (company: CompanyData) => void;
  
  // Module States
  governance: GovernanceData;
  humanCapital: HumanCapitalData;
  operations: OperationsData;
  finance: FinanceData;
  marketing: MarketingData;
  
  // Loading/Error States
  loading: boolean;
  error: string | null;
  
  // Actions
  loadCompanyData: (companyId: string) => Promise<void>;
  updateCompany: (updates: Partial<CompanyData>) => Promise<void>;
  refreshData: () => Promise<void>;
}

export const ProfessionalContext = createContext<ProfessionalContextType | undefined>(undefined);

export const ProfessionalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCompany, setCurrentCompany] = useState<CompanyData | null>(null);
  const [governance, setGovernance] = useState<GovernanceData>({/* ... */});
  const [humanCapital, setHumanCapital] = useState<HumanCapitalData>({/* ... */});
  const [operations, setOperations] = useState<OperationsData>({/* ... */});
  const [finance, setFinance] = useState<FinanceData>({/* ... */});
  const [marketing, setMarketing] = useState<MarketingData>({/* ... */});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ... implementation
};

export const useProfessional = () => {
  const context = useContext(ProfessionalContext);
  if (!context) {
    throw new Error('useProfessional must be used within ProfessionalProvider');
  }
  return context;
};
```

### Data Flow Diagram

```
User Action (e.g., click "Save Policy")
        ↓
React Component Event Handler
        ↓
Service Layer Call (governanceService.updatePolicy())
        ↓
Firebase Firestore Update
        ↓
Real-time Listener Triggers
        ↓
Context State Updated
        ↓
Component Re-renders
        ↓
UI Updated
```

---

## Firebase Schema

### Collections Structure

```
firebase.google.com/firestore:

companies/
├── {companyId}/
│   ├── metadata: {
│   │     name: string
│   │     registrationNumber: string
│   │     taxId: string
│   │     incorporationDate: timestamp
│   │     jurisdiction: string
│   │     status: string
│   │     createdDate: timestamp
│   │     lastModified: timestamp
│   │   }
│   │
│   ├── governance/
│   │   ├── constitution/
│   │   │   ├── {constitutionId}: {
│   │   │   │     vision: string
│   │   │   │     mission: string
│   │   │   │     values: string[]
│   │   │   │     votingRules: object
│   │   │   │     effectiveDate: timestamp
│   │   │   │     approvedBy: User[]
│   │   │   │   }
│   │   │
│   │   ├── policies/
│   │   │   ├── {policyId}: {
│   │   │   │     name: string
│   │   │   │     category: string
│   │   │   │     content: string
│   │   │   │     version: number
│   │   │   │     effectiveDate: timestamp
│   │   │   │     approvedBy: string[]
│   │   │   │     acknowledgments: sub-collection
│   │   │   │   }
│   │   │   └── {policyId}/acknowledgments/
│   │   │       └── {userId}: {
│   │   │             acknowledgedDate: timestamp
│   │   │             expiryDate: timestamp
│   │   │           }
│   │   │
│   │   ├── board/
│   │   │   └── {memberId}: {
│   │   │         userId: string
│   │   │         name: string
│   │   │         position: string
│   │   │         appointmentDate: timestamp
│   │   │         qualifications: string[]
│   │   │       }
│   │   │
│   │   └── compliance/
│   │       └── {eventId}: {
│   │             type: string
│   │             dueDate: timestamp
│   │             status: string
│   │             description: string
│   │             owner: string
│   │           }
│   │
│   ├── roles/
│   │   ├── definitions/
│   │   │   └── {roleId}: {
│   │   │         name: string
│   │   │         description: string
│   │   │         responsibilities: string[]
│   │   │         requiredSkills: string[]
│   │   │         reportsTo: string
│   │   │         salaryGrade: string
│   │   │         accessPermissions: object
│   │   │       }
│   │   │
│   │   └── assignments/
│   │       └── {assignmentId}: {
│   │             userId: string
│   │             roleId: string
│   │             assignmentDate: timestamp
│   │             status: string
│   │           }
│   │
│   ├── employees/
│   │   └── {userId}/
│   │       ├── profile: {
│   │       │     name: string
│   │       │     email: string
│   │       │     phone: string
│   │       │     department: string
│   │       │   }
│   │       ├── contracts/
│   │       │   └── {contractId}: {
│   │       │         type: string
│   │       │         effectiveDate: timestamp
│   │       │         expiryDate: timestamp
│   │       │         status: string
│   │       │       }
│   │       ├── reviews/
│   │       │   └── {reviewId}: {
│   │       │         period: string
│   │       │         year: number
│   │       │         rating: string
│   │       │         completedDate: timestamp
│   │       │       }
│   │       └── skills/
│   │           └── {skillId}: {
│   │                 name: string
│   │                 level: number
│   │                 verified: boolean
│   │               }
│   │
│   ├── projects/
│   │   └── {projectId}: {
│   │         name: string
│   │         status: string
│   │         owner: string
│   │         startDate: timestamp
│   │         endDate: timestamp
│   │         budget: number
│   │         tasks: sub-collection
│   │       }
│   │
│   ├── budgets/
│   │   └── {budgetId}: {
│   │         year: number
│   │         quarter: number
│   │         total: number
│   │         categories: object
│   │         approvedBy: string
│   │         status: string
│   │       }
│   │
│   ├── campaigns/
│   │   └── {campaignId}: {
│   │         name: string
│   │         objective: string
│   │         startDate: timestamp
│   │         budget: number
│   │         metrics: object
│   │       }
│   │
│   └── auditlog/
│       └── {logId}: {
│             userId: string
│             action: string
│             entityType: string
│             entityId: string
│             changes: object
│             timestamp: timestamp
│           }
```

---

## Service Layer

### Service Architecture

Each module has a dedicated service file following this pattern:

```typescript
// src/services/governance.service.ts

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { auditLog } from './audit.service';

export const governanceService = {
  // Company Profile
  async getCompanyProfile(companyId: string) {
    try {
      const docRef = doc(db, 'companies', companyId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error('Company not found');
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error('Error fetching company profile:', error);
      throw error;
    }
  },

  async updateCompanyProfile(companyId: string, data: any, userId: string) {
    try {
      const docRef = doc(db, 'companies', companyId);
      await updateDoc(docRef, {
        ...data,
        lastModified: serverTimestamp(),
        lastModifiedBy: userId,
      });
      
      // Log audit trail
      await auditLog.log({
        userId,
        action: 'UPDATE_COMPANY_PROFILE',
        entityType: 'company',
        entityId: companyId,
        changes: data,
      });
    } catch (error) {
      console.error('Error updating company profile:', error);
      throw error;
    }
  },

  // Compliance
  async getCompliance(companyId: string) {
    try {
      const q = query(
        collection(db, `companies/${companyId}/governance/compliance`)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching compliance events:', error);
      throw error;
    }
  },

  async addComplianceEvent(
    companyId: string,
    event: any,
    userId: string
  ) {
    try {
      const eventRef = collection(
        db,
        `companies/${companyId}/governance/compliance`
      );
      const newEvent = await setDoc(doc(eventRef), {
        ...event,
        createdDate: serverTimestamp(),
        createdBy: userId,
      });

      await auditLog.log({
        userId,
        action: 'CREATE_COMPLIANCE_EVENT',
        entityType: 'compliance',
        entityId: companyId,
        changes: event,
      });

      return newEvent;
    } catch (error) {
      console.error('Error adding compliance event:', error);
      throw error;
    }
  },

  // Policies
  async getPolicies(companyId: string) {
    try {
      const q = query(
        collection(db, `companies/${companyId}/governance/policies`),
        orderBy('effectiveDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching policies:', error);
      throw error;
    }
  },

  async createPolicy(companyId: string, policy: any, userId: string) {
    try {
      const policyRef = collection(
        db,
        `companies/${companyId}/governance/policies`
      );
      const docRef = await setDoc(doc(policyRef), {
        ...policy,
        version: 1,
        createdDate: serverTimestamp(),
        createdBy: userId,
        approvedBy: [userId],
      });

      await auditLog.log({
        userId,
        action: 'CREATE_POLICY',
        entityType: 'policy',
        entityId: companyId,
        changes: policy,
      });

      return docRef;
    } catch (error) {
      console.error('Error creating policy:', error);
      throw error;
    }
  },

  // ... more methods for each entity
};
```

---

## Integration Points

### 1. Authentication Integration

```typescript
// Use existing AuthContext for user identification
import { useAuth } from '@/contexts/AuthContext';

export const SomeComponent = () => {
  const { user, firebaseUser } = useAuth();
  
  // Use user data for role-based access
  if (!hasPermission(user?.role, 'view_governance')) {
    return <AccessDenied />;
  }
};
```

### 2. Contacts Integration

```typescript
// Link team members to contacts
import { useContacts } from '@/hooks/useContacts';

const manageTeamMember = async (userId: string, roleId: string) => {
  // Update professional tab
  await humanCapitalService.assignRole(companyId, userId, roleId);
  
  // Link to contact
  const contact = await contactService.getContact(userId);
  if (contact) {
    await contactService.updateContact(userId, {
      profession: role.name,
      organization: company.name,
    });
  }
};
```

### 3. Calendar Integration

```typescript
// Create calendar events for compliance and reviews
import { useCalendar } from '@/hooks/useCalendar';

const scheduleReview = async (userId: string, date: Date) => {
  // Create review in professional tab
  const review = await humanCapitalService.createReview(
    companyId,
    userId,
    { period: 'annual', year: 2025 }
  );
  
  // Add to calendar
  await calendarService.createEvent({
    title: `Performance Review: ${userName}`,
    date,
    type: 'performance_review',
    linkedEntity: { type: 'review', id: review.id },
  });
};
```

### 4. Projects Integration

```typescript
// Embed governance workflows in projects
import { useProjects } from '@/hooks/useProjects';

const approveProject = async (projectId: string, approverId: string) => {
  // Log approval decision
  const decision = await governanceService.createDecision(
    companyId,
    {
      title: `Project Approval: ${projectName}`,
      linkedEntity: { type: 'project', id: projectId },
      approver: approverId,
    }
  );
  
  // Update project status
  await projectService.updateProject(projectId, {
    status: 'approved',
    governanceDecisionId: decision.id,
  });
};
```

### 5. Assets Integration

```typescript
// Track company assets in finance
import { useAssets } from '@/hooks/useAssets';

const purchaseAsset = async (assetData: any) => {
  // Create asset record
  const asset = await assetService.createAsset(assetData);
  
  // Log expense in finance
  await financeService.createExpense(companyId, {
    amount: asset.purchasePrice,
    category: 'asset_purchase',
    description: `Purchase: ${asset.name}`,
    linkedEntity: { type: 'asset', id: asset.id },
  });
};
```

### 6. Family Tree Integration

```typescript
// Succession planning with family tree
import { useFamilyTree } from '@/hooks/useFamilyTree';

const planSuccession = async (roleId: string, successorUserId: string) => {
  // Get family relationship
  const relationship = await familyTreeService.getRelationship(
    currentUserId,
    successorUserId
  );
  
  // Create succession plan
  const plan = await humanCapitalService.createSuccessionPlan(
    companyId,
    roleId,
    {
      successor: successorUserId,
      familyRelationship: relationship,
      timeline: '2026-Q4',
      trainingPlan: [],
    }
  );
};
```

---

## API Specifications

### Authentication Flow

All API calls require authentication via Firebase Auth. The AuthContext provides the token.

```typescript
// All service calls automatically include auth token via Firebase SDK
```

### Error Handling

```typescript
export const handleServiceError = (error: any, context: string) => {
  console.error(`[${context}] Error:`, error);
  
  if (error.code === 'permission-denied') {
    throw new Error('You do not have permission to perform this action');
  }
  
  if (error.code === 'not-found') {
    throw new Error('Resource not found');
  }
  
  if (error.code === 'failed-precondition') {
    throw new Error('Operation failed due to missing prerequisites');
  }
  
  throw new Error(`${context} failed: ${error.message}`);
};
```

### Response Format

```typescript
// Success Response
{
  success: true,
  data: {
    // Entity data
  },
  timestamp: ISO8601
}

// Error Response
{
  success: false,
  error: {
    code: string,
    message: string,
    details: {}
  },
  timestamp: ISO8601
}
```

---

## Real-time Updates

### Firestore Listeners

```typescript
// Set up real-time listener for company data
export const useRealTimeCompanyData = (companyId: string) => {
  const [data, setData] = useState<CompanyData | null>(null);
  
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'companies', companyId),
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as CompanyData);
        }
      },
      (error) => {
        console.error('Error listening to company data:', error);
      }
    );
    
    return () => unsubscribe();
  }, [companyId]);
  
  return data;
};
```

---

## Performance Optimization

### Caching Strategy

```typescript
// Cache frequently accessed data
const cache = new Map<string, any>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedData = async (key: string, fetcher: () => Promise<any>) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};
```

### Pagination

```typescript
// Paginate large datasets
export const getPaginatedData = async (
  collectionPath: string,
  pageSize: number = 25,
  pageNumber: number = 1
) => {
  const q = query(
    collection(db, collectionPath),
    limit(pageSize),
    offset((pageNumber - 1) * pageSize)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};
```

---

## Security & Access Control

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Companies
    match /companies/{companyId} {
      allow read, write: if request.auth.uid in resource.data.allowedUsers;
      
      match /governance/{document=**} {
        allow read: if isCompanyMember(companyId);
        allow write: if hasRole(companyId, 'governance_admin');
      }
      
      match /roles/{document=**} {
        allow read: if isCompanyMember(companyId);
        allow write: if hasRole(companyId, 'hr_admin');
      }
      
      match /employees/{userId}/{document=**} {
        allow read: if request.auth.uid == userId || hasRole(companyId, 'hr_admin');
        allow write: if request.auth.uid == userId || hasRole(companyId, 'hr_admin');
      }
      
      match /auditlog/{document=**} {
        allow read: if hasRole(companyId, 'auditor');
        allow create: if request.auth != null;
      }
    }
    
    function isCompanyMember(companyId) {
      return request.auth.uid in get(/databases/$(database)/documents/companies/$(companyId)).data.members;
    }
    
    function hasRole(companyId, roleName) {
      let userRole = get(/databases/$(database)/documents/companies/$(companyId)/employees/$(request.auth.uid)).data.role;
      return userRole == roleName;
    }
  }
}
```

---

## Monitoring & Analytics

```typescript
// Track feature usage
export const trackFeatureUsage = async (
  feature: string,
  userId: string,
  metadata: any = {}
) => {
  await analyticsService.log({
    event: 'professional_feature_used',
    feature,
    userId,
    timestamp: new Date(),
    ...metadata,
  });
};

// Example usage
trackFeatureUsage('governance', userId, { section: 'policies' });
trackFeatureUsage('performance_review', userId, { reviewType: 'annual' });
```

---

## Next Steps

1. Review and approve architecture
2. Create detailed component specifications
3. Set up development environment
4. Begin Phase 1 implementation
5. Schedule integration testing

---

**Document Version**: 1.0  
**Last Updated**: October 30, 2025  
**Author**: Development Team

