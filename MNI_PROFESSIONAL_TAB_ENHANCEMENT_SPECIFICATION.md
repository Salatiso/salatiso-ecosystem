# MNI Professional Tab Enhancement Specification
**Version 1.0** | **Date**: October 30, 2025

---

## Executive Overview

This specification outlines a comprehensive enhancement to the **Professional Tab** in the Salatiso Ecosystem's main React application. The Professional Tab will transform from a basic career development view into a **complete company management platform** that enables MNI (Mlandeli-Notemba Investments) to manage all business aspects including governance, HR, operations, finance, marketing, and commercialization.

### Key Philosophy
- **Build on existing functionality** - All current professional features preserved and enhanced
- **Enterprise-grade management** - Support full company lifecycle from registration to scaling
- **Ecosystem integration** - Seamlessly link to specialized apps (HRHelp, FinHelp, BizHelp, LegalHelp, SafetyHelp)
- **Family-centered** - Maintain Ubuntu values and family governance principles
- **Modular architecture** - Each module can be specialized in dedicated apps during Phase 2

---

## Current State Analysis

### Existing Professional Tab Features (to preserve & enhance):
1. **Professional Profiles** - Team member profiles with skills, certifications, projects
2. **Training Programs** - Professional development courses
3. **Certifications** - Track professional certifications
4. **Resources** - Learning materials and downloadable tools

### Existing Business Tab Features (to preserve & enhance):
1. **Career Paths** - Career development framework
2. **Organogram** - Organizational structure (recently updated with MNI hierarchy)
3. **Operations** - Basic operations metrics

### Integration Opportunities:
- **Projects page** - Already has governance progression tracking
- **Contacts** - Has full contact management with family tree
- **Calendar** - Can be used for scheduling appointments, reviews, board meetings
- **Assets** - Can track company assets and property

---

## PHASE 1: CORE COMPANY BACKBONE

### Module 1: Company Setup & Governance
**Goal**: Establish and manage company legal/governance foundation

#### 1.1 Company Registration & Compliance
**Functionality**:
- Company profile dashboard
  - Registration number, tax ID, legal name
  - Incorporation date, jurisdiction
  - Company status (active, dormant, etc.)
  - Director/shareholder information
  
- Document repository
  - Certificate of incorporation
  - Memorandum & Articles of Association
  - Tax clearance certificates
  - Professional indemnity certificates
  - Licenses and permits
  - Insurance certificates
  
- Compliance tracking
  - Annual returns due dates
  - Tax filing deadlines
  - Audit dates
  - Company name change records
  - Address change records
  - Share issuance records
  
- Automated reminders
  - 60-day pre-notification for renewals
  - 30-day pre-notification for filings
  - 14-day pre-notification for audits
  - Email notifications to compliance owner

**Data Model**:
```typescript
interface CompanyProfile {
  id: string;
  name: string;
  registrationNumber: string;
  taxId: string;
  incorporationDate: Date;
  jurisdiction: string;
  status: 'active' | 'dormant' | 'dissolved';
  registrationDocs: Document[];
  complianceCalendar: ComplianceEvent[];
  documentRepository: {
    incorporation: Document[];
    governance: Document[];
    tax: Document[];
    insurance: Document[];
    licenses: Document[];
  };
}

interface ComplianceEvent {
  id: string;
  type: 'annual_return' | 'tax_filing' | 'audit' | 'renewal';
  dueDate: Date;
  description: string;
  owner: string;
  status: 'pending' | 'completed' | 'overdue';
  reminderSent: boolean;
}
```

**UI Components**:
- CompanyProfileCard
- ComplianceTracker
- DocumentRepository
- ReminderNotifications

---

#### 1.2 Governance Framework
**Functionality**:
- Constitution/Charter Builder
  - Vision statement aligned with family values
  - Mission statement
  - Values & principles
  - Objectives
  - Decision-making framework (voting rules, quorum requirements)
  - Approval workflows
  
- Policy Library
  - HR Policies (code of conduct, hiring, termination, disciplinary)
  - Finance Policies (budgeting, approval limits, audit)
  - IT Policies (security, data protection, backup)
  - Ethics & Compliance (conflict of interest, whistleblowing)
  - Safety Policies (linked to SafetyHelp)
  - Communication Policies
  - Travel & Expenses Policies
  
- Version Control
  - Policy versioning with effective dates
  - Change log and audit trail
  - Approval workflows (who approved, when, signature)
  - Superseded policies archive
  
- Policy Acknowledgment
  - Track which team members have read each policy
  - Acknowledge and sign policies
  - Re-certification requirements (annual, bi-annual)

**Data Model**:
```typescript
interface GovernanceFramework {
  id: string;
  companyId: string;
  constitution: Constitution;
  policies: Policy[];
}

interface Constitution {
  id: string;
  vision: string;
  mission: string;
  values: string[];
  objectives: string[];
  votingRules: VotingRule[];
  decisionFramework: DecisionFramework;
  approvedDate: Date;
  approvedBy: User[];
  effectiveDate: Date;
}

interface Policy {
  id: string;
  name: string;
  category: 'hr' | 'finance' | 'it' | 'ethics' | 'safety' | 'communication' | 'travel';
  content: string;
  version: number;
  effectiveDate: Date;
  expiryDate?: Date;
  approvedBy: User[];
  createdDate: Date;
  lastModifiedDate: Date;
  lastModifiedBy: User;
  acknowledgments: PolicyAcknowledgment[];
}

interface PolicyAcknowledgment {
  id: string;
  userId: string;
  policyId: string;
  acknowledgedDate: Date;
  expiryDate?: Date;
  signature?: string;
}
```

**UI Components**:
- ConstitutionBuilder
- PolicyLibrary
- PolicyEditor
- VersionControl
- PolicyAcknowledgmentTracker

---

#### 1.3 Board & Leadership Management
**Functionality**:
- Board Member Registry
  - Name, email, contact
  - Appointment date, term length
  - Position (Chairman, Director, Company Secretary)
  - Rotation schedule
  - Biography and qualifications
  
- Voting & Decision Logging
  - Board meeting minutes
  - Decisions and resolutions
  - Voting records (who voted, how, date)
  - Action items and assignment
  
- Conflict of Interest Declarations
  - Declaration form
  - Conflict categories (related party, business interest, financial interest)
  - Declaration history
  - Approval/acknowledgment workflow

**Data Model**:
```typescript
interface BoardMember {
  id: string;
  userId: string;
  companyId: string;
  name: string;
  email: string;
  position: 'chairman' | 'director' | 'company_secretary' | 'member';
  appointmentDate: Date;
  termLength?: number; // months
  retirementDate?: Date;
  qualifications: string[];
  biography: string;
  rotationSchedule: Date[];
}

interface Decision {
  id: string;
  companyId: string;
  meetingId: string;
  title: string;
  description: string;
  votingResults: VotingResult[];
  resolutionText: string;
  passedDate: Date;
  assignedActions: Action[];
}

interface ConflictDeclaration {
  id: string;
  userId: string;
  companyId: string;
  type: 'related_party' | 'business_interest' | 'financial';
  description: string;
  disclosedDate: Date;
  acknowledgedBy: User;
  acknowledgedDate: Date;
  mitigationMeasures?: string;
}
```

**UI Components**:
- BoardRegistry
- MeetingMinutesEditor
- VotingRecorder
- ConflictDeclarationForm

---

### Module 2: Human Capital & Role Management
**Goal**: Manage organizational roles, appointments, and development

#### 2.1 Role Assignment & Org Chart
**Functionality**:
- Dynamic Org Chart
  - Hierarchical visualization (already has organogram)
  - Family + external hire roles
  - Role-based access control configuration
  - Drag-drop to restructure
  - Show reporting lines
  
- Role Definitions
  - Role name and description
  - Responsibilities
  - Required skills
  - Reporting to (manager)
  - Access permissions
  - Salary grade/range
  - Department/division
  
- Role-Based Access Control (RBAC)
  - Link roles to system permissions
  - Module access (HRHelp, FinHelp, BizHelp, etc.)
  - Data access levels (view own, view team, view all)
  - Feature toggles per role

**Data Model**:
```typescript
interface RoleDefinition {
  id: string;
  companyId: string;
  name: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  reportsTo?: string; // roleId
  salaryGrade: string;
  department: string;
  accessPermissions: Permission[];
  moduleAccess: ModuleAccess[];
  status: 'active' | 'inactive';
  createdDate: Date;
  lastModifiedDate: Date;
}

interface RoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  companyId: string;
  assignmentDate: Date;
  expiryDate?: Date;
  status: 'active' | 'suspended' | 'terminated';
  primaryRole: boolean;
}

interface ModuleAccess {
  module: 'hrhelp' | 'finhelp' | 'bizhelp' | 'legalhelp' | 'safetyhelp';
  level: 'none' | 'viewer' | 'editor' | 'admin';
}
```

**UI Components**:
- OrgChartViewer (enhanced)
- RoleDefinitionEditor
- RoleAssignmentManager
- RBACConfigurationPanel

---

#### 2.2 Appointments & Contracts
**Functionality**:
- Contract Templates
  - Employment contracts
  - Consultancy contracts
  - Partnership agreements
  - Independent contractor agreements
  - Board member agreements
  
- Contract Management
  - Fill contract template with data
  - Generate PDF
  - Track signatures
  - E-signature integration (DocuSign, SignEasy)
  - Version history
  
- Appointment Tracking
  - Appointment date, duration, terms
  - Renewal reminders
  - Document storage
  - Status (active, expired, terminated)
  
- Exit Management
  - Off-boarding checklist
  - Final payment tracker
  - Equipment return
  - Access revocation
  - Document retrieval

**Data Model**:
```typescript
interface Contract {
  id: string;
  userId: string;
  companyId: string;
  type: 'employment' | 'consultancy' | 'partnership' | 'contractor' | 'board';
  templateId: string;
  data: Record<string, any>;
  signatureStatus: 'unsigned' | 'pending_signature' | 'signed' | 'cancelled';
  signatures: Signature[];
  effectiveDate: Date;
  expiryDate?: Date;
  documentUrl: string;
  createdDate: Date;
  lastModifiedDate: Date;
}

interface Signature {
  id: string;
  signer: User;
  signedDate: Date;
  signatureMethod: 'esignature' | 'manual' | 'scanned';
  signatureData?: string;
}
```

**UI Components**:
- ContractTemplateSelector
- ContractBuilder
- SignatureTracker
- ESignatureIntegration
- AppointmentTracker

---

#### 2.3 Performance Management
**Functionality**:
- Goal Setting
  - SMART goals aligned with company strategy
  - Set goals for team/individual
  - Track goal progress
  - Quarterly and annual goals
  
- Performance Reviews
  - Self-assessment
  - Manager assessment
  - 360° feedback (peer, subordinate, manager)
  - Review period (quarterly, bi-annual, annual)
  - Rating scale (Exceeds, Meets, Needs Improvement, Does Not Meet)
  
- Skills Tracking
  - Current skills inventory
  - Required skills for roles
  - Skill gap analysis
  - Training recommendations
  - Link to Sazi Life Academy
  
- Development Plans
  - Personalized development plans based on gaps
  - Learning pathway recommendations
  - Mentorship assignments
  - Career progression tracking

**Data Model**:
```typescript
interface PerformanceGoal {
  id: string;
  userId: string;
  period: 'quarterly' | 'annual';
  year: number;
  quarter?: number;
  goals: Goal[];
  status: 'draft' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
}

interface Goal {
  id: string;
  description: string;
  category: 'strategic' | 'operational' | 'development';
  targetDate: Date;
  successCriteria: string[];
  progress: number; // 0-100
  status: 'not_started' | 'in_progress' | 'completed' | 'missed';
}

interface PerformanceReview {
  id: string;
  userId: string;
  period: 'quarterly' | 'annual';
  year: number;
  reviewer: User;
  selfAssessment?: Assessment;
  managerAssessment: Assessment;
  feedbackRounds: FeedbackRound[];
  overallRating: 'exceeds' | 'meets' | 'needs_improvement' | 'does_not_meet';
  developmentPlan: DevelopmentPlan;
  completedDate: Date;
}

interface DevelopmentPlan {
  id: string;
  userId: string;
  skillGaps: SkillGap[];
  trainingRecommendations: TrainingRecommendation[];
  mentorAssignment?: User;
  careerPathway: string;
}
```

**UI Components**:
- GoalSettingWizard
- PerformanceReviewForm
- 360FeedbackCollector
- SkillsInventory
- DevelopmentPlanBuilder

---

### Module 3: Operations & Project Management
**Goal**: Execute and track business initiatives

#### 3.1 Project Lifecycle Management
**Functionality**:
- Project Canvas
  - Project name, description, objective
  - Business case and ROI
  - Owner/sponsor
  - Start and end dates
  - Status (Pipeline, Active, Completed, Cancelled)
  
- Approval Workflows
  - Idea submission
  - Review and approval process
  - Budget approval
  - Executive sign-off
  
- Execution Tracking
  - Task assignment and tracking
  - Milestone dates and completion
  - Risk and issue logging
  - Progress dashboards
  - Budget vs. actual
  
- Post-Project Review
  - Lessons learned
  - ROI realization
  - Team feedback
  - Documentation

**Data Model**:
```typescript
interface Project {
  id: string;
  companyId: string;
  name: string;
  description: string;
  objective: string;
  businessCase: string;
  roi: number;
  owner: User;
  sponsor: User;
  startDate: Date;
  endDate: Date;
  status: 'pipeline' | 'approved' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  budget: Budget;
  tasks: Task[];
  milestones: Milestone[];
  risks: Risk[];
  issues: Issue[];
  team: TeamMember[];
  timeline: ProjectTimeline;
}

interface ProjectApproval {
  id: string;
  projectId: string;
  stage: 'idea' | 'proposal' | 'budget' | 'executive';
  approver: User;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approvedDate?: Date;
}
```

**UI Components**:
- ProjectCanvas
- ApprovalWorkflowManager
- TaskTracker (link to projects.tsx)
- MilestoneTimeline
- RiskIssueLogger

---

#### 3.2 Knowledge Base & SOPs
**Functionality**:
- Knowledge Repository
  - Standard Operating Procedures (SOPs)
  - Process manuals
  - Best practices
  - FAQ
  - Lessons learned library
  
- Content Organization
  - Category/tag system
  - Search functionality
  - Version control
  - Ownership and review schedule
  
- Access Control
  - Public, internal, restricted access
  - Role-based visibility
  - Approval workflows for changes

**Data Model**:
```typescript
interface KnowledgeBase {
  id: string;
  companyId: string;
  documents: Document[];
  categories: Category[];
  searchIndex: SearchIndex;
}

interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  owner: User;
  version: number;
  accessLevel: 'public' | 'internal' | 'restricted';
  createdDate: Date;
  lastModifiedDate: Date;
  reviewDueDate?: Date;
}
```

**UI Components**:
- KnowledgeBaseViewer
- DocumentEditor
- SearchInterface

---

#### 3.3 Risk & Safety Management
**Functionality**:
- Risk Register
  - Identify risks (operational, financial, compliance, reputational)
  - Risk assessment (probability x impact)
  - Mitigation strategies
  - Owner assignment
  - Review schedule
  
- Incident Reporting (linked to SafetyHelp)
  - Incident report form
  - Investigation tracking
  - Corrective actions
  - Reporting analytics
  
- Safety Compliance
  - Safety policies
  - Incident trends
  - Near-miss reporting
  - Safety training records

**Data Model**:
```typescript
interface RiskRegister {
  id: string;
  companyId: string;
  risks: RiskItem[];
}

interface RiskItem {
  id: string;
  category: 'operational' | 'financial' | 'compliance' | 'reputational';
  description: string;
  probability: 1 | 2 | 3 | 4 | 5; // Low to High
  impact: 1 | 2 | 3 | 4 | 5;
  riskScore: number;
  owner: User;
  mitigationStrategy: string;
  status: 'active' | 'mitigated' | 'closed';
  reviewDate: Date;
}

interface IncidentReport {
  id: string;
  companyId: string;
  dateOccurred: Date;
  description: string;
  category: string;
  reporter: User;
  investigation: Investigation;
  correctiveActions: Action[];
  safetyHelpLinked?: string; // Link to SafetyHelp incident
}
```

**UI Components**:
- RiskRegister
- IncidentReportForm
- MitigationTracker

---

### Module 4: Finance & Commercialization
**Goal**: Manage financial operations and revenue streams

#### 4.1 Financial Management
**Functionality**:
- Budgeting
  - Annual budget planning
  - Department/project budgets
  - Budget vs. actual tracking
  - Variance analysis
  - Budget amendments
  
- Expense Tracking
  - Expense categories
  - Approval workflows (based on amount/category)
  - Receipt management
  - Reimbursement processing
  
- Integration with FinHelp
  - Link to FinHelp for detailed accounting
  - Import/export GL data
  - Financial statements (P&L, Balance Sheet)
  - Cash flow forecasting
  
- Financial Dashboards
  - Key metrics (revenue, expenses, cash, ROI)
  - Department performance
  - Project profitability
  - Trend analysis

**Data Model**:
```typescript
interface Budget {
  id: string;
  companyId: string;
  year: number;
  quarter?: number;
  department?: string;
  categories: BudgetCategory[];
  totalBudget: number;
  approvedBy: User;
  status: 'draft' | 'submitted' | 'approved' | 'active';
}

interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  spent: number;
  variance: number;
  owner: User;
}

interface Expense {
  id: string;
  companyId: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  receiptUrl?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'reimbursed';
  submittedDate: Date;
  approvedDate?: Date;
}
```

**UI Components**:
- BudgetPlanner
- ExpenseTracker
- FinancialDashboard

---

#### 4.2 Revenue & Marketplace
**Functionality**:
- Product/Service Catalog
  - Product/service name, description, price
  - Category
  - Availability status
  - Linked to commercialization pathways
  
- Sales Pipeline
  - Leads
  - Opportunities
  - Quotations
  - Orders
  - Invoices
  
- Client Management
  - Client profiles
  - Communication history
  - Order history
  - Payment history
  - Contract linking

**Data Model**:
```typescript
interface Product {
  id: string;
  companyId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'inactive' | 'discontinued';
}

interface SalesOpportunity {
  id: string;
  companyId: string;
  clientId: string;
  productId: string;
  value: number;
  stage: 'lead' | 'prospect' | 'quotation' | 'negotiation' | 'won' | 'lost';
  owner: User;
  expectedCloseDate: Date;
  actualCloseDate?: Date;
}

interface Invoice {
  id: string;
  companyId: string;
  opportunityId: string;
  invoiceNumber: string;
  amount: number;
  issueDate: Date;
  dueDate: Date;
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'overdue';
}
```

**UI Components**:
- ProductCatalog
- SalesPipeline
- ClientManagement

---

#### 4.3 Commercialization Pathways
**Functionality**:
- IP Management
  - Patents, trademarks, copyrights
  - Registration status
  - Filing dates, renewal dates
  - Commercialization status
  
- Licensing & Royalty Tracking
  - License agreements
  - Licensee information
  - Royalty rates
  - Payment tracking
  
- Revenue Streams
  - Revenue type (product sales, licensing, services)
  - Revenue tracking
  - Profitability analysis
  - Growth projections

**Data Model**:
```typescript
interface IntellectualProperty {
  id: string;
  companyId: string;
  type: 'patent' | 'trademark' | 'copyright';
  title: string;
  description: string;
  filingDate: Date;
  registrationDate?: Date;
  expiryDate?: Date;
  jurisdiction: string[];
  status: 'pending' | 'registered' | 'expired' | 'cancelled';
  owner: User;
  commercializationStatus: 'concept' | 'development' | 'launched' | 'retired';
}

interface License {
  id: string;
  ipId: string;
  licensee: string;
  agreementUrl: string;
  royaltyRate: number;
  startDate: Date;
  expiryDate: Date;
  paymentTerms: string;
  paymentHistory: Payment[];
}
```

**UI Components**:
- IPRegistry
- LicenseManager
- RoyaltyTracker

---

### Module 5: Marketing & External Relations
**Goal**: Build brand and manage external relationships

#### 5.1 Marketing Hub
**Functionality**:
- Campaign Planning
  - Campaign name, objective, target audience
  - Campaign type (digital, print, events, PR)
  - Timeline and milestones
  - Budget
  - Success metrics
  
- Content Calendar
  - Content planning by channel
  - Approval workflows
  - Publishing schedule
  - Performance tracking
  
- Analytics Integration
  - Link to marketing dashboards
  - Track metrics (reach, engagement, conversions)
  - Campaign ROI
  - Channel performance

**Data Model**:
```typescript
interface MarketingCampaign {
  id: string;
  companyId: string;
  name: string;
  objective: string;
  targetAudience: string;
  type: 'digital' | 'print' | 'events' | 'pr' | 'influencer';
  startDate: Date;
  endDate: Date;
  budget: number;
  owner: User;
  contentCalendar: ContentItem[];
  metrics: CampaignMetrics;
}

interface ContentItem {
  id: string;
  title: string;
  channel: 'social' | 'email' | 'blog' | 'print' | 'video';
  content: string;
  publishDate: Date;
  status: 'draft' | 'approved' | 'published';
  performance: PerformanceMetrics;
}
```

**UI Components**:
- CampaignPlanner
- ContentCalendar
- MarketingAnalytics

---

#### 5.2 Partnerships & Stakeholder Management
**Functionality**:
- CRM
  - Partner/supplier profiles
  - Contact information
  - Relationship status
  - Communication history
  - Contracts and agreements
  
- Relationship Scoring
  - Trust/relationship score (Ubuntu-inspired)
  - Engagement level
  - Value assessment
  - Collaboration opportunities
  
- Meeting & Event Management
  - Schedule partner meetings
  - Event tracking
  - Follow-up tasks
  - Relationship milestones

**Data Model**:
```typescript
interface Partner {
  id: string;
  companyId: string;
  name: string;
  type: 'supplier' | 'client' | 'strategic' | 'distribution';
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  relationshipScore: number;
  engagementLevel: 'high' | 'medium' | 'low';
  contracts: Contract[];
  communications: Communication[];
}

interface RelationshipMetrics {
  partnerId: string;
  trustScore: number; // Ubuntu-inspired
  engagementScore: number;
  valueAssessment: number;
  lastInteraction: Date;
  collaborationOpportunities: string[];
}
```

**UI Components**:
- PartnerRegistry
- RelationshipDashboard
- MeetingScheduler

---

### Module 6: Audit, Reporting & Legacy
**Goal**: Track, report, and embed family values

#### 6.1 Audit Trails & Compliance
**Functionality**:
- Comprehensive Logging
  - Every decision logged (who, what, when, why)
  - Transaction logging
  - Policy changes tracked
  - Approval workflows logged
  
- Compliance Reporting
  - Generate compliance reports
  - Audit-ready documentation
  - Regulatory alignment
  - Export functionality

**Data Model**:
```typescript
interface AuditLog {
  id: string;
  companyId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
}
```

**UI Components**:
- AuditLogViewer
- ComplianceReportGenerator

---

#### 6.2 Dashboards & KPIs
**Functionality**:
- Executive Dashboard
  - Real-time KPIs
  - Department performance
  - Financial snapshot
  - Risk overview
  - Project status
  
- Department Dashboards
  - Role-specific views
  - Department metrics
  - Team performance
  - Departmental risks
  
- Custom Dashboards
  - Build custom dashboards
  - Widget selection
  - Data filtering
  - Sharing capabilities

**Data Model**:
```typescript
interface Dashboard {
  id: string;
  name: string;
  owner: User;
  widgets: DashboardWidget[];
  accessLevel: 'personal' | 'team' | 'company';
}

interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'gauge';
  metric: string;
  dataSource: string;
  refreshRate: number;
}

interface KPI {
  id: string;
  companyId: string;
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  owner: User;
  lastUpdated: Date;
}
```

**UI Components**:
- ExecutiveDashboard
- DepartmentDashboard
- DashboardBuilder

---

#### 6.3 Legacy & Stewardship
**Functionality**:
- Family Values Integration
  - Ubuntu Index dashboard
  - Community impact metrics
  - Generosity tracker
  - Family legacy documentation
  
- Living Ledger
  - Record of giving
  - Community impact
  - Succession planning
  - Knowledge transfer
  
- Legacy Reports
  - Annual stewardship reports
  - Impact stories
  - Values alignment assessment
  - Recommendations for next generation

**Data Model**:
```typescript
interface UbuntuIndex {
  id: string;
  companyId: string;
  period: 'monthly' | 'quarterly' | 'annual';
  communityImpactScore: number;
  generosityScore: number;
  valuesAlignmentScore: number;
  overallIndex: number;
  trends: Trend[];
}

interface LegacyEntry {
  id: string;
  companyId: string;
  type: 'decision' | 'achievement' | 'learning' | 'value_moment';
  description: string;
  recordedBy: User;
  recordedDate: Date;
  impact: string;
  linkedTo: string[]; // Other entities it's linked to
}
```

**UI Components**:
- UbuntuIndexDashboard
- LivingLedger
- LegacyReportGenerator

---

## PHASE 2: SPECIALIZED MODULES (Future)

Each module below will become a specialized application linked to from the main Professional tab:

### Module 7: Specialized Module Integration Points

**HRHelp Integration**:
- Performance management (link existing reviews to HRHelp)
- Recruitment & hiring
- Training & development (advanced features)
- Payroll & compensation
- Benefits management
- Employee relations

**FinHelp Integration**:
- Detailed accounting and bookkeeping
- Tax planning and compliance
- Investment management
- Wealth management
- Financial planning

**BizHelp Integration**:
- Business plan development
- Market research
- Business model canvas
- Financial projections
- Funding/investment documentation

**LegalHelp Integration**:
- Contract templates and management (enhanced)
- Compliance documentation
- Legal research
- Risk assessment
- IP protection

**SafetyHelp Integration**:
- Health & safety management
- Incident management (linked)
- Risk assessments
- Compliance tracking
- Training management

---

## INTEGRATION WITH EXISTING SYSTEMS

### Contacts Integration
- Link team members to contact profiles
- Sync contact information
- Family tree integration for succession planning
- Communication history linking

### Calendar Integration
- Schedule board meetings, reviews, planning sessions
- Compliance reminder calendar
- Training calendar
- Event management
- Integration with lifecycle events

### Projects Integration
- Embed governance and approval workflows
- Link projects to strategic objectives
- Team capacity planning
- Resource allocation

### Asset Register Integration
- Track company assets
- Depreciation management
- Asset maintenance scheduling
- Insurance coordination

### Family Tree Integration
- Show family relationships in organogram
- Succession planning visualization
- Role progression tracking
- Generational handover documentation

---

## IMPLEMENTATION ROADMAP

### PHASE 1: Core Foundation (12 weeks)
**Weeks 1-4**: Company Governance
- Company setup & compliance
- Policy library
- Board management

**Weeks 5-8**: HR & Roles
- Role assignment & org chart
- Appointments & contracts
- Performance management basics

**Weeks 9-12**: Operations & Finance
- Project lifecycle
- Basic financial dashboard
- Knowledge base

### PHASE 2: Enhanced Capabilities (8 weeks)
**Weeks 1-4**: Finance & Marketing
- Full finance integration
- Marketing hub
- Commercialization pathways

**Weeks 5-8**: Advanced Features
- Dashboards & analytics
- Risk management
- Legacy & stewardship

### PHASE 3: Specialization & Scale (Ongoing)
- Extract modules to dedicated apps
- Deep integration with ecosystem apps
- Advanced analytics and AI insights
- Mobile app support

---

## TECHNICAL ARCHITECTURE

### Component Structure
```
src/
  pages/
    professional/
      index.tsx (main professional page)
    intranet/
      business/
        governance/ (new)
        human-capital/ (new)
        operations/ (new)
        finance/ (new)
        marketing/ (new)
        reporting/ (new)
        audit/ (new)
  components/
    professional/
      governance/
        CompanyProfileCard.tsx
        PolicyLibrary.tsx
        BoardManagement.tsx
      human-capital/
        OrgChart.tsx
        RoleManager.tsx
        PerformanceReview.tsx
      operations/
        ProjectManager.tsx
        KnowledgeBase.tsx
        RiskRegister.tsx
      finance/
        BudgetPlanner.tsx
        ExpenseTracker.tsx
        FinancialDashboard.tsx
      marketing/
        CampaignManager.tsx
        PartnerCRM.tsx
      reporting/
        ExecutiveDashboard.tsx
        AuditLog.tsx
  contexts/
    ProfessionalContext.tsx (shared state)
  services/
    governance.service.ts
    humanCapital.service.ts
    operations.service.ts
    finance.service.ts
    marketing.service.ts
    reporting.service.ts
  hooks/
    useCompanyGovernance.ts
    usePerformanceReview.ts
    useBudgeting.ts
    etc.
```

### Data Flow
```
Firebase Firestore Collections:
  /companies/{companyId}/
    governance/
    roles/
    employees/
    contracts/
    projects/
    budgets/
    campaigns/
    partners/
    auditlogs/
```

### Integration Points
```
AuthContext: 
  - Uses to determine user role and access level
  - Links to RBAC configuration

Projects Module:
  - Links project approvals to governance workflows
  - Embeds project management in operations

Contacts:
  - Links team members to contact profiles
  - Syncs communication history

Calendar:
  - Schedules governance events
  - Tracks compliance dates

Assets:
  - Tracks company assets
  - Links to finance management
```

---

## USER ROLES & PERMISSIONS

### Role-Based Access

**Executive/CEO**
- Full access to all modules
- Approval authority for governance
- Dashboard access
- Report generation

**Finance Manager**
- Budget management
- Expense approval
- Financial reporting
- Financial dashboards

**HR Manager**
- Role & org chart management
- Contract management
- Performance reviews
- Training coordination

**Operations Manager**
- Project management
- Risk management
- Knowledge base
- Team coordination

**Department Head**
- Role management for department
- Project oversight
- Budget management for department
- Team performance tracking

**Team Member**
- Access own profile and performance data
- View org chart
- Submit timesheets/expenses
- Self-assessment in reviews

**Accountant** (linked to FinHelp)
- Expense management
- Financial record access
- Reporting

**Auditor**
- Audit log access
- Compliance reporting
- Policy review

---

## MIGRATION & ROLLOUT STRATEGY

### Phase 1 Implementation
1. Set up core data structures in Firestore
2. Create governance module UI
3. Implement role-based access control
4. Build HR and role management
5. Deploy and test with beta users

### Phase 2 Enhancement
1. Build finance and marketing modules
2. Create dashboards
3. Implement reporting and audit trails
4. Add legacy/stewardship features
5. Full rollout to organization

### Parallel App Development
- Extract finance module → FinHelp
- Extract HR module → HRHelp
- Extract marketing module → BizHelp
- Link specialized apps to main professional tab

---

## SUCCESS METRICS

### Adoption
- User login frequency
- Feature usage statistics
- Time spent per module

### Efficiency
- Time to complete governance tasks
- Approval workflow speed
- Report generation time

### Compliance
- Policy acknowledgment rate
- Audit trail completeness
- Compliance task completion

### Financial
- Budget accuracy
- Expense processing speed
- Financial visibility improvement

### Quality
- User satisfaction scores
- Support ticket volume
- System uptime

---

## DOCUMENT REFERENCES

### Related Specifications
- `ECOSYSTEM_UNIFIED_AUTHENTICATION_CONFIGURATION_OCT30.md`
- `CALENDAR_ENHANCEMENT_SPECIFICATION.md`
- `CONTACT_MANAGEMENT_COMPLETE_OCTOBER_25_2025.md`
- `HRHelp_Technical_Specification_V3.md`
- `FinHelp_Technical_Specification_V3.md`
- `BizHelp_Technical_Specifications.md`
- `LegalHelp_Unified_Technical_Specification_V4.md`
- `SafetyHelp_Technical_Specification_V3.md`

---

## Next Steps

1. **Code Architecture Review** - Validate component structure
2. **Database Schema Design** - Create Firestore collections
3. **UI Component Development** - Build core components
4. **Integration Testing** - Test with existing systems
5. **User Testing** - Beta rollout with team
6. **Full Deployment** - Launch to production

