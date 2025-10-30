# MNI Professional Tab - Phase 1 Implementation Roadmap
**Date**: October 30, 2025 | **Phase**: 1 Core Foundation

---

## Overview

This document provides a step-by-step implementation guide for Phase 1 of the Professional Tab enhancement, focusing on building the core company management backbone over 12 weeks.

---

## WEEK 1-4: COMPANY GOVERNANCE MODULE

### Week 1: Project Setup & Architecture

**Objectives**:
- Create folder structure
- Set up contexts and hooks
- Design database schema
- Create component scaffolding

**Tasks**:

1. Create folder structure
```
src/
  pages/
    intranet/
      business/
        governance.tsx (new main page)
        governance/
          compliance.tsx
          policies.tsx
          board.tsx
  components/
    professional/
      governance/
        CompanyProfileCard.tsx
        ComplianceTracker.tsx
        DocumentRepository.tsx
        PolicyLibrary.tsx
        BoardRegistry.tsx
        ConflictDeclaration.tsx
  contexts/
    ProfessionalContext.tsx (new)
  services/
    governance.service.ts (new)
  hooks/
    useGovernance.ts (new)
```

2. Create Firestore collections schema:
```javascript
// Database Structure
/companies/{companyId}/
  - name: string
  - registrationNumber: string
  - taxId: string
  - incorporationDate: timestamp
  - jurisdiction: string
  - status: 'active'|'dormant'|'dissolved'

/companies/{companyId}/governance/
  - constitutionId: string
  - policies[]: string[]

/companies/{companyId}/governance/constitution/
  - vision: string
  - mission: string
  - values: string[]
  - votingRules: object
  - approvedDate: timestamp

/companies/{companyId}/governance/policies/
  - name: string
  - category: string
  - content: string
  - version: number
  - effectiveDate: timestamp

/companies/{companyId}/governance/board/
  - name: string
  - position: string
  - appointmentDate: timestamp

/companies/{companyId}/governance/compliance/
  - type: string
  - dueDate: timestamp
  - status: 'pending'|'completed'|'overdue'
```

3. Create ProfessionalContext:
```typescript
// src/contexts/ProfessionalContext.tsx
import React, { createContext, useState, useCallback } from 'react';

interface CompanyData {
  id: string;
  name: string;
  registrationNumber: string;
  // ... other fields
}

interface ProfessionalContextType {
  currentCompany: CompanyData | null;
  setCurrentCompany: (company: CompanyData) => void;
  // ... other context values
}

export const ProfessionalContext = createContext<ProfessionalContextType | undefined>(undefined);

export const ProfessionalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCompany, setCurrentCompany] = useState<CompanyData | null>(null);
  
  return (
    <ProfessionalContext.Provider value={{ currentCompany, setCurrentCompany }}>
      {children}
    </ProfessionalContext.Provider>
  );
};

export const useProfessional = () => {
  const context = React.useContext(ProfessionalContext);
  if (!context) throw new Error('useProfessional must be used within ProfessionalProvider');
  return context;
};
```

4. Create governance service:
```typescript
// src/services/governance.service.ts
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export const governanceService = {
  async getCompanyProfile(companyId: string) {
    try {
      const docRef = doc(db, 'companies', companyId);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    } catch (error) {
      console.error('Error fetching company profile:', error);
      throw error;
    }
  },

  async updateCompanyProfile(companyId: string, data: any) {
    try {
      const docRef = doc(db, 'companies', companyId);
      await updateDoc(docRef, {
        ...data,
        lastModified: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating company profile:', error);
      throw error;
    }
  },

  async getCompliance(companyId: string) {
    try {
      const q = query(
        collection(db, `companies/${companyId}/governance/compliance`),
        where('status', 'in', ['pending', 'overdue'])
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching compliance events:', error);
      throw error;
    }
  },

  // ... other methods
};
```

**Deliverables**:
- [ ] Folder structure created
- [ ] Database schema defined
- [ ] ProfessionalContext created
- [ ] Governance service scaffolded
- [ ] Component files created (empty)

---

### Week 2: Company Profile & Compliance

**Objectives**:
- Build company profile UI
- Implement compliance tracker
- Create document repository UI
- Set up document upload functionality

**Tasks**:

1. Build CompanyProfileCard component:
```typescript
// src/components/professional/governance/CompanyProfileCard.tsx
import React, { useEffect, useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { governanceService } from '@/services/governance.service';

interface CompanyProfileCardProps {
  companyId: string;
}

export const CompanyProfileCard: React.FC<CompanyProfileCardProps> = ({ companyId }) => {
  const [company, setCompany] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    loadCompanyProfile();
  }, [companyId]);

  const loadCompanyProfile = async () => {
    try {
      const data = await governanceService.getCompanyProfile(companyId);
      setCompany(data);
      setFormData(data);
    } catch (error) {
      console.error('Error loading company profile:', error);
    }
  };

  const handleSave = async () => {
    try {
      await governanceService.updateCompanyProfile(companyId, formData);
      setCompany(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving company profile:', error);
    }
  };

  if (!company) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-ubuntu-warm-900">Company Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 px-4 py-2 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90"
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ubuntu-warm-900 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={formData?.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:border-ubuntu-purple"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ubuntu-warm-900 mb-1">
                Registration Number
              </label>
              <input
                type="text"
                value={formData?.registrationNumber || ''}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full px-4 py-2 border border-ubuntu-warm-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ubuntu-warm-900 mb-1">
                Tax ID
              </label>
              <input
                type="text"
                value={formData?.taxId || ''}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="w-full px-4 py-2 border border-ubuntu-warm-300 rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-2 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green/90"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-ubuntu-warm-600 mb-1">Company Name</p>
            <p className="text-lg font-semibold text-ubuntu-warm-900">{company.name}</p>
          </div>
          <div>
            <p className="text-sm text-ubuntu-warm-600 mb-1">Registration Number</p>
            <p className="text-lg font-semibold text-ubuntu-warm-900">{company.registrationNumber}</p>
          </div>
          <div>
            <p className="text-sm text-ubuntu-warm-600 mb-1">Tax ID</p>
            <p className="text-lg font-semibold text-ubuntu-warm-900">{company.taxId}</p>
          </div>
          <div>
            <p className="text-sm text-ubuntu-warm-600 mb-1">Status</p>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              company.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {company.status}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
```

2. Build ComplianceTracker component:
```typescript
// src/components/professional/governance/ComplianceTracker.tsx
import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { governanceService } from '@/services/governance.service';
import { formatDate } from '@/utils/dateUtils';

interface ComplianceTrackerProps {
  companyId: string;
}

export const ComplianceTracker: React.FC<ComplianceTrackerProps> = ({ companyId }) => {
  const [complianceEvents, setComplianceEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompliance();
  }, [companyId]);

  const loadCompliance = async () => {
    try {
      const data = await governanceService.getCompliance(companyId);
      setComplianceEvents(data);
    } catch (error) {
      console.error('Error loading compliance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilDue = (dueDate: any) => {
    const due = new Date(dueDate.seconds * 1000);
    const now = new Date();
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'overdue':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) return <div className="p-4">Loading compliance data...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6 mt-6">
      <h2 className="text-2xl font-bold text-ubuntu-warm-900 mb-4 flex items-center space-x-2">
        <Calendar className="w-6 h-6 text-orange-500" />
        <span>Compliance Tracker</span>
      </h2>

      <div className="space-y-3">
        {complianceEvents.map((event) => (
          <div
            key={event.id}
            className={`border border-l-4 rounded-lg p-4 ${getStatusColor(event.status)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-ubuntu-warm-900">{event.type.replace(/_/g, ' ')}</h3>
                <p className="text-sm text-ubuntu-warm-600 mt-1">{event.description}</p>
              </div>
              <div className="text-right">
                {event.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : event.status === 'overdue' ? (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <Calendar className="w-6 h-6 text-yellow-600" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-current border-opacity-10">
              <span className="text-sm font-medium">Due: {formatDate(event.dueDate)}</span>
              {event.status !== 'completed' && (
                <span className="text-xs font-semibold text-orange-600">
                  {getDaysUntilDue(event.dueDate)} days left
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

3. Build DocumentRepository component:
```typescript
// src/components/professional/governance/DocumentRepository.tsx
import React, { useState } from 'react';
import { FileText, Upload, Download, Trash2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';

interface DocumentRepositoryProps {
  companyId: string;
}

export const DocumentRepository: React.FC<DocumentRepositoryProps> = ({ companyId }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const categories = [
    { id: 'incorporation', name: 'Incorporation Documents' },
    { id: 'governance', name: 'Governance Documents' },
    { id: 'tax', name: 'Tax Documents' },
    { id: 'insurance', name: 'Insurance Certificates' },
    { id: 'licenses', name: 'Licenses & Permits' },
  ];

  const handleUpload = async (file: File, category: string) => {
    try {
      setUploading(true);
      const storageRef = ref(storage, `companies/${companyId}/${category}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      // Add to documents list
      const newDoc = {
        id: Date.now().toString(),
        name: file.name,
        category,
        url,
        uploadedDate: new Date(),
        size: file.size,
      };
      setDocuments([...documents, newDoc]);
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6 mt-6">
      <h2 className="text-2xl font-bold text-ubuntu-warm-900 mb-4 flex items-center space-x-2">
        <FileText className="w-6 h-6 text-blue-600" />
        <span>Document Repository</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border-2 border-dashed border-ubuntu-warm-300 rounded-lg p-6 hover:border-ubuntu-purple transition-colors"
          >
            <div className="text-center">
              <Upload className="w-8 h-8 text-ubuntu-warm-400 mx-auto mb-2" />
              <h3 className="font-semibold text-ubuntu-warm-900 mb-2">{category.name}</h3>
              <label className="cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleUpload(e.target.files[0], category.id);
                    }
                  }}
                  className="hidden"
                />
                <span className="text-sm text-ubuntu-purple hover:underline">
                  {uploading ? 'Uploading...' : 'Click to upload'}
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {documents.length > 0 && (
        <div className="mt-6 border-t border-ubuntu-warm-200 pt-6">
          <h3 className="font-semibold text-ubuntu-warm-900 mb-4">Uploaded Documents</h3>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-ubuntu-warm-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-ubuntu-warm-400" />
                  <div>
                    <p className="font-medium text-ubuntu-warm-900">{doc.name}</p>
                    <p className="text-xs text-ubuntu-warm-600">{new Date(doc.uploadedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-ubuntu-warm-200 rounded"
                  >
                    <Download className="w-4 h-4 text-ubuntu-purple" />
                  </a>
                  <button className="p-2 hover:bg-red-100 rounded">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

**Deliverables**:
- [ ] CompanyProfileCard built and tested
- [ ] ComplianceTracker built with real data
- [ ] DocumentRepository with upload functionality
- [ ] Integration with Firebase Storage

---

### Week 3: Governance & Policies

**Objectives**:
- Build policy library UI
- Create policy editor
- Implement version control
- Add policy acknowledgment tracking

**Tasks**:
- Create PolicyLibrary component
- Create PolicyEditor component
- Implement version history viewer
- Build policy acknowledgment tracker
- Add policy search functionality

**Deliverables**:
- [ ] Policy management system complete
- [ ] Version control working
- [ ] Acknowledgment tracking functional
- [ ] Search indexed

---

### Week 4: Board & Leadership

**Objectives**:
- Build board registry
- Create meeting minutes module
- Implement decision logging
- Add conflict of interest tracking

**Tasks**:
- Create BoardRegistry component
- Create MeetingMinutes editor
- Build Decision logger
- Create ConflictDeclaration form
- Add voting tracker

**Deliverables**:
- [ ] Board management module complete
- [ ] Decision logging working
- [ ] Meeting minutes functionality
- [ ] Conflict tracking operational

---

## WEEK 5-8: HUMAN CAPITAL & ROLE MANAGEMENT

### Week 5: Role Assignment & Org Chart

**Objectives**:
- Enhance organogram with RBAC config
- Build role definition editor
- Implement role assignment UI
- Create RBAC matrix

**Tasks**:
- Enhance OrgChart component
- Create RoleDefinition service and UI
- Build role assignment interface
- Create RBAC configuration panel
- Add drag-drop org chart restructuring

**Deliverables**:
- [ ] Enhanced org chart with roles
- [ ] Role definition management
- [ ] RBAC configuration complete
- [ ] Drag-drop functionality working

---

### Week 6: Appointments & Contracts

**Objectives**:
- Build contract management system
- Implement e-signature integration
- Create contract templates
- Build appointment tracker

**Tasks**:
- Create ContractManager service
- Build ContractTemplateSelector
- Create ContractBuilder UI
- Integrate e-signature (e.g., SignEasy)
- Build appointment tracker
- Implement exit management

**Deliverables**:
- [ ] Contract management system live
- [ ] E-signature integration working
- [ ] Appointment tracking operational
- [ ] Exit management module complete

---

### Week 7-8: Performance Management

**Objectives**:
- Build goal-setting module
- Create performance review system
- Implement 360 feedback
- Build development plans

**Tasks**:
- Create GoalSetting wizard
- Build PerformanceReview form
- Create 360° feedback collector
- Build SkillsInventory
- Create DevelopmentPlanBuilder
- Link to Sazi Life Academy

**Deliverables**:
- [ ] Goal-setting module complete
- [ ] Performance review system live
- [ ] 360° feedback working
- [ ] Skills tracking functional
- [ ] Development plans generating

---

## WEEK 9-12: OPERATIONS & FINANCE

### Week 9: Project Lifecycle & Knowledge Base

**Objectives**:
- Build project canvas
- Create knowledge base
- Implement risk register
- Add safety integration

**Tasks**:
- Enhance project management (link to existing projects.tsx)
- Create ProjectCanvas component
- Build KnowledgeBase viewer
- Create RiskRegister
- Implement IncidentReporter

**Deliverables**:
- [ ] Project lifecycle management complete
- [ ] Knowledge base indexed and searchable
- [ ] Risk register operational
- [ ] Safety integration working

---

### Week 10: Financial Management

**Objectives**:
- Build budgeting system
- Create expense tracker
- Implement financial dashboards
- Add FinHelp integration

**Tasks**:
- Create BudgetPlanner
- Build ExpenseTracker
- Create FinancialDashboard
- Implement FinHelp API integration
- Add financial forecasting

**Deliverables**:
- [ ] Budget management complete
- [ ] Expense tracking live
- [ ] Dashboard operational
- [ ] FinHelp integration working

---

### Week 11-12: Marketing & Reporting

**Objectives**:
- Build marketing hub
- Create CRM for partners
- Implement dashboards
- Add audit trails

**Tasks**:
- Create CampaignManager
- Build PartnerCRM
- Create ExecutiveDashboard
- Implement AuditLog viewer
- Add compliance reporting

**Deliverables**:
- [ ] Marketing hub complete
- [ ] Partner CRM operational
- [ ] Executive dashboard live
- [ ] Audit trails comprehensive
- [ ] Compliance reporting functional

---

## INTEGRATION CHECKLIST

### With Existing Systems

**Contacts Integration**
- [ ] Link team members to contact profiles
- [ ] Sync contact information bidirectionally
- [ ] Display contact history in professional modules

**Calendar Integration**
- [ ] Create calendar events for compliance dates
- [ ] Schedule performance reviews
- [ ] Display board meetings
- [ ] Show training dates

**Projects Integration**
- [ ] Link professional roles to project assignments
- [ ] Embed governance workflows in project approvals
- [ ] Track team capacity
- [ ] Show project portfolio

**Assets Integration**
- [ ] Track company assets
- [ ] Link to finance management
- [ ] Show asset depreciation
- [ ] Manage asset maintenance

**Family Tree Integration**
- [ ] Show family relationships in organogram
- [ ] Enable succession planning
- [ ] Track role progression
- [ ] Manage generational handover

---

## TESTING STRATEGY

### Unit Tests
```typescript
// Example: governanceService.test.ts
describe('governanceService', () => {
  it('should fetch company profile', async () => {
    const profile = await governanceService.getCompanyProfile('test-company');
    expect(profile).toBeDefined();
    expect(profile.name).toBe('Test Company');
  });

  it('should update company profile', async () => {
    await governanceService.updateCompanyProfile('test-company', {
      name: 'Updated Company'
    });
    const profile = await governanceService.getCompanyProfile('test-company');
    expect(profile.name).toBe('Updated Company');
  });

  it('should fetch compliance events', async () => {
    const events = await governanceService.getCompliance('test-company');
    expect(Array.isArray(events)).toBe(true);
  });
});
```

### Integration Tests
- Test data flow between modules
- Test authentication/authorization
- Test Firebase integration
- Test ecosystem app connections

### User Acceptance Tests
- Test with MNI team members
- Gather feedback
- Iterate based on feedback
- Validate workflows

---

## DEPLOYMENT STRATEGY

### Staging Deployment (Week 13)
1. Deploy to Firebase staging environment
2. Internal testing with MNI team
3. Fix issues and iterate
4. Performance testing

### Production Rollout (Week 14)
1. Deploy to production
2. Monitor usage and errors
3. Support team standby
4. Gather user feedback

### Post-Launch (Week 15+)
1. Weekly monitoring
2. Bug fixes and optimizations
3. Prepare Phase 2
4. Plan specialization apps

---

## Success Criteria

### Phase 1 Completion
- All 6 core modules functional
- All components tested and working
- Integration with existing systems complete
- Team trained and confident using system
- User satisfaction score ≥ 4.0/5.0
- System uptime ≥ 99%
- No critical bugs

### Adoption Metrics
- ≥ 80% of team using system weekly
- ≥ 60% of governance tasks completed in system
- ≥ 50% of role assignments documented
- ≥ 100% of policies acknowledged

---

## Resource Requirements

### Development Team
- 1 Lead Developer (full-time)
- 2 Frontend Engineers (full-time)
- 1 Backend Engineer (part-time)
- 1 QA Engineer (full-time)
- 1 Product Manager (part-time)

### Infrastructure
- Firebase Firestore (scale as needed)
- Firebase Storage (documents)
- Firebase Authentication
- Cloud Functions (if needed)

### Third-Party Services
- E-signature provider (SignEasy/DocuSign)
- Email service (SendGrid/Firebase)
- Analytics service

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Scope creep | High | High | Strict sprint planning, clear requirements |
| Integration issues | Medium | High | Early integration testing, API contracts |
| Performance issues | Medium | High | Load testing, optimization sprints |
| User adoption | Medium | Medium | Training, support, gradual rollout |
| Data migration | Low | High | Backup strategy, dry runs |

---

## Next Steps

1. **Approve Specification** - Get stakeholder sign-off
2. **Set Up Infrastructure** - Create Firebase collections, configure storage
3. **Create Sprint Schedule** - Assign tasks to team
4. **Begin Week 1** - Start project setup and architecture
5. **Establish Feedback Loop** - Weekly check-ins with MNI team

---

**Document Owner**: Development Team  
**Last Updated**: October 30, 2025  
**Next Review**: Weekly during Phase 1 implementation

