import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { db } from '../../config/firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

// Types for the Professional Context
export interface CompanyProfile {
  id: string;
  name: string;
  registrationNumber: string;
  taxId: string;
  incorporationDate: Date;
  jurisdiction: string;
  status: 'active' | 'dormant' | 'dissolved';
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  directors: string[];
  shareholders: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GovernanceData {
  constitution: {
    content: string;
    lastUpdated: Date;
    approvedBy: string[];
  };
  policies: Policy[];
  compliance: ComplianceRecord[];
  board: BoardMember[];
  meetings: BoardMeeting[];
}

export interface Policy {
  id: string;
  title: string;
  content: string;
  category: string;
  version: number;
  effectiveDate: Date;
  approvedBy: string[];
  acknowledgments: PolicyAcknowledgment[];
  status: 'draft' | 'active' | 'archived';
}

export interface PolicyAcknowledgment {
  userId: string;
  userName: string;
  acknowledgedAt: Date;
  version: number;
}

export interface ComplianceRecord {
  id: string;
  type: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'overdue';
  assignedTo: string;
  completedAt?: Date;
  documents: string[];
}

export interface BoardMember {
  id: string;
  name: string;
  position: string;
  appointedDate: Date;
  termEnd?: Date;
  contact: {
    email: string;
    phone: string;
  };
  status: 'active' | 'inactive';
}

export interface BoardMeeting {
  id: string;
  title: string;
  date: Date;
  attendees: string[];
  agenda: string[];
  minutes: string;
  decisions: string[];
  documents: string[];
}

export interface HumanCapitalData {
  roles: RoleDefinition[];
  employees: Employee[];
  contracts: EmploymentContract[];
  performance: PerformanceReview[];
  development: DevelopmentPlan[];
  skills: SkillInventory[];
}

export interface RoleDefinition {
  id: string;
  title: string;
  department: string;
  level: number;
  responsibilities: string[];
  requirements: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  reportsTo?: string;
  status: 'active' | 'inactive';
}

export interface Employee {
  id: string;
  userId: string;
  roleId: string;
  department: string;
  startDate: Date;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  salary: number;
  currency: string;
  managerId?: string;
  status: 'active' | 'inactive' | 'terminated';
}

export interface EmploymentContract {
  id: string;
  employeeId: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  terms: string;
  signedAt?: Date;
  documents: string[];
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  reviewPeriod: {
    start: Date;
    end: Date;
  };
  rating: number;
  feedback: string;
  goals: string[];
  developmentAreas: string[];
  createdAt: Date;
}

export interface DevelopmentPlan {
  id: string;
  employeeId: string;
  title: string;
  objectives: string[];
  timeline: {
    start: Date;
    end: Date;
  };
  activities: DevelopmentActivity[];
  status: 'draft' | 'active' | 'completed';
}

export interface DevelopmentActivity {
  id: string;
  title: string;
  type: 'training' | 'mentoring' | 'project' | 'certification';
  status: 'planned' | 'in-progress' | 'completed';
  dueDate: Date;
  notes?: string;
}

export interface SkillInventory {
  employeeId: string;
  skills: {
    name: string;
    level: number;
    certified: boolean;
    lastAssessed: Date;
  }[];
  certifications: Certification[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface OperationsData {
  projects: Project[];
  knowledgeBase: KnowledgeArticle[];
  risks: Risk[];
  incidents: Incident[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date;
  endDate?: Date;
  budget?: number;
  currency?: string;
  managerId: string;
  teamMembers: string[];
  milestones: Milestone[];
  deliverables: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'completed';
  completedAt?: Date;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  attachments: string[];
  views: number;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  ownerId: string;
  status: 'open' | 'mitigated' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
  reportedBy: string;
  assignedTo?: string;
  category: string;
  rootCause?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  documents: string[];
}

export interface FinanceData {
  budgets: Budget[];
  expenses: Expense[];
  financialReports: FinancialReport[];
}

export interface Budget {
  id: string;
  name: string;
  fiscalYear: number;
  categories: BudgetCategory[];
  totalAllocated: number;
  totalSpent: number;
  currency: string;
  status: 'draft' | 'approved' | 'active' | 'closed';
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  subcategories: BudgetSubcategory[];
}

export interface BudgetSubcategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  subcategory?: string;
  date: Date;
  submittedBy: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  receipts: string[];
  projectId?: string;
}

export interface FinancialReport {
  id: string;
  type: 'monthly' | 'quarterly' | 'annual';
  period: {
    start: Date;
    end: Date;
  };
  revenue: number;
  expenses: number;
  profit: number;
  currency: string;
  generatedAt: Date;
}

export interface MarketingData {
  campaigns: Campaign[];
  partners: Partner[];
  content: Content[];
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  budget: number;
  currency: string;
  targetAudience: string;
  goals: string[];
  channels: string[];
  metrics: CampaignMetric[];
}

export interface CampaignMetric {
  name: string;
  target: number;
  actual: number;
  unit: string;
}

export interface Partner {
  id: string;
  name: string;
  type: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  agreement: {
    startDate: Date;
    endDate?: Date;
    terms: string;
  };
  status: 'active' | 'inactive' | 'terminated';
  relationshipScore: number;
}

export interface Content {
  id: string;
  title: string;
  type: 'blog' | 'video' | 'social' | 'email' | 'webinar';
  status: 'draft' | 'published' | 'archived';
  publishDate?: Date;
  authorId: string;
  tags: string[];
  metrics: ContentMetric[];
}

export interface ContentMetric {
  platform: string;
  views: number;
  engagement: number;
  shares: number;
  date: Date;
}

export interface ReportingData {
  dashboards: Dashboard[];
  auditLogs: AuditLog[];
  kpis: KPI[];
  reports: Report[];
}

export interface Dashboard {
  id: string;
  name: string;
  type: 'executive' | 'department' | 'project';
  widgets: DashboardWidget[];
  createdBy: string;
  createdAt: Date;
  isPublic: boolean;
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  config: any;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  category: string;
  target: number;
  actual: number;
  unit: string;
  period: string;
  status: 'on-track' | 'at-risk' | 'off-track';
  lastUpdated: Date;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  parameters: any;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    recipients: string[];
  };
  lastGenerated?: Date;
  createdBy: string;
  createdAt: Date;
}

// Professional Context State
export interface ProfessionalState {
  company: CompanyProfile | null;
  governance: GovernanceData;
  humanCapital: HumanCapitalData;
  operations: OperationsData;
  finance: FinanceData;
  marketing: MarketingData;
  reporting: ReportingData;
  loading: {
    company: boolean;
    governance: boolean;
    humanCapital: boolean;
    operations: boolean;
    finance: boolean;
    marketing: boolean;
    reporting: boolean;
  };
  error: string | null;
}

// Action Types
export type ProfessionalAction =
  | { type: 'SET_LOADING'; module: keyof ProfessionalState['loading']; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_COMPANY'; company: CompanyProfile }
  | { type: 'UPDATE_GOVERNANCE'; data: Partial<GovernanceData> }
  | { type: 'UPDATE_HUMAN_CAPITAL'; data: Partial<HumanCapitalData> }
  | { type: 'UPDATE_OPERATIONS'; data: Partial<OperationsData> }
  | { type: 'UPDATE_FINANCE'; data: Partial<FinanceData> }
  | { type: 'UPDATE_MARKETING'; data: Partial<MarketingData> }
  | { type: 'UPDATE_REPORTING'; data: Partial<ReportingData> };

// Initial State
const initialState: ProfessionalState = {
  company: null,
  governance: {
    constitution: { content: '', lastUpdated: new Date(), approvedBy: [] },
    policies: [],
    compliance: [],
    board: [],
    meetings: []
  },
  humanCapital: {
    roles: [],
    employees: [],
    contracts: [],
    performance: [],
    development: [],
    skills: []
  },
  operations: {
    projects: [],
    knowledgeBase: [],
    risks: [],
    incidents: []
  },
  finance: {
    budgets: [],
    expenses: [],
    financialReports: []
  },
  marketing: {
    campaigns: [],
    partners: [],
    content: []
  },
  reporting: {
    dashboards: [],
    auditLogs: [],
    kpis: [],
    reports: []
  },
  loading: {
    company: false,
    governance: false,
    humanCapital: false,
    operations: false,
    finance: false,
    marketing: false,
    reporting: false
  },
  error: null
};

// Reducer
function professionalReducer(state: ProfessionalState, action: ProfessionalAction): ProfessionalState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.module]: action.loading }
      };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'SET_COMPANY':
      return { ...state, company: action.company };
    case 'UPDATE_GOVERNANCE':
      return { ...state, governance: { ...state.governance, ...action.data } };
    case 'UPDATE_HUMAN_CAPITAL':
      return { ...state, humanCapital: { ...state.humanCapital, ...action.data } };
    case 'UPDATE_OPERATIONS':
      return { ...state, operations: { ...state.operations, ...action.data } };
    case 'UPDATE_FINANCE':
      return { ...state, finance: { ...state.finance, ...action.data } };
    case 'UPDATE_MARKETING':
      return { ...state, marketing: { ...state.marketing, ...action.data } };
    case 'UPDATE_REPORTING':
      return { ...state, reporting: { ...state.reporting, ...action.data } };
    default:
      return state;
  }
}

// Context
const ProfessionalContext = createContext<{
  state: ProfessionalState;
  dispatch: React.Dispatch<ProfessionalAction>;
  // Action creators
  loadCompanyData: (companyId: string) => Promise<void>;
  updateCompanyProfile: (companyId: string, data: Partial<CompanyProfile>) => Promise<void>;
  logAuditEvent: (action: string, resource: string, resourceId: string, details?: any) => Promise<void>;
} | null>(null);

// Provider Component
export const ProfessionalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(professionalReducer, initialState);

  // Load company data from Firestore
  const loadCompanyData = async (companyId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', module: 'company', loading: true });
      dispatch({ type: 'SET_ERROR', error: null });

      const companyRef = doc(db, 'companies', companyId);
      const unsubscribe = onSnapshot(companyRef, (doc) => {
        if (doc.exists()) {
          const companyData = doc.data() as CompanyProfile;
          dispatch({ type: 'SET_COMPANY', company: companyData });
        }
      });

      // Load governance data
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: true });
      const governanceRef = doc(db, 'companies', companyId, 'governance', 'current');
      onSnapshot(governanceRef, (doc) => {
        if (doc.exists()) {
          dispatch({ type: 'UPDATE_GOVERNANCE', data: doc.data() as GovernanceData });
        }
        dispatch({ type: 'SET_LOADING', module: 'governance', loading: false });
      });

      // Load human capital data
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: true });
      const humanCapitalRef = doc(db, 'companies', companyId, 'humanCapital', 'current');
      onSnapshot(humanCapitalRef, (doc) => {
        if (doc.exists()) {
          dispatch({ type: 'UPDATE_HUMAN_CAPITAL', data: doc.data() as HumanCapitalData });
        }
        dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: false });
      });

      // Load operations data
      dispatch({ type: 'SET_LOADING', module: 'operations', loading: true });
      const operationsRef = doc(db, 'companies', companyId, 'operations', 'current');
      onSnapshot(operationsRef, (doc) => {
        if (doc.exists()) {
          dispatch({ type: 'UPDATE_OPERATIONS', data: doc.data() as OperationsData });
        }
        dispatch({ type: 'SET_LOADING', module: 'operations', loading: false });
      });

      // Load finance data
      dispatch({ type: 'SET_LOADING', module: 'finance', loading: true });
      const financeRef = doc(db, 'companies', companyId, 'finance', 'current');
      onSnapshot(financeRef, (doc) => {
        if (doc.exists()) {
          dispatch({ type: 'UPDATE_FINANCE', data: doc.data() as FinanceData });
        }
        dispatch({ type: 'SET_LOADING', module: 'finance', loading: false });
      });

      // Load marketing data
      dispatch({ type: 'SET_LOADING', module: 'marketing', loading: true });
      const marketingRef = doc(db, 'companies', companyId, 'marketing', 'current');
      onSnapshot(marketingRef, (doc) => {
        if (doc.exists()) {
          dispatch({ type: 'UPDATE_MARKETING', data: doc.data() as MarketingData });
        }
        dispatch({ type: 'SET_LOADING', module: 'marketing', loading: false });
      });

      // Load reporting data
      dispatch({ type: 'SET_LOADING', module: 'reporting', loading: true });
      const reportingRef = doc(db, 'companies', companyId, 'reporting', 'current');
      onSnapshot(reportingRef, (doc) => {
        if (doc.exists()) {
          dispatch({ type: 'UPDATE_REPORTING', data: doc.data() as ReportingData });
        }
        dispatch({ type: 'SET_LOADING', module: 'reporting', loading: false });
      });

      dispatch({ type: 'SET_LOADING', module: 'company', loading: false });

      // Return unsubscribe function for cleanup
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error('Error loading company data:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to load company data' });
      dispatch({ type: 'SET_LOADING', module: 'company', loading: false });
    }
  };

  // Update company profile
  const updateCompanyProfile = async (companyId: string, data: Partial<CompanyProfile>) => {
    try {
      const companyRef = doc(db, 'companies', companyId);
      await updateDoc(companyRef, {
        ...data,
        updatedAt: new Date()
      });

      // Log audit event
      await logAuditEvent('update', 'company', companyId, data);
    } catch (error) {
      console.error('Error updating company profile:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to update company profile' });
      throw error;
    }
  };

  // Log audit events
  const logAuditEvent = async (action: string, resource: string, resourceId: string, details?: any) => {
    try {
      if (!state.company) return;

      const auditLog: Omit<AuditLog, 'id'> = {
        timestamp: new Date(),
        userId: 'current-user', // TODO: Get from auth context
        userName: 'Current User', // TODO: Get from auth context
        action,
        resource,
        resourceId,
        details: details || {},
      };

      // Add to audit logs in state
      const newAuditLogs = [...state.reporting.auditLogs, { ...auditLog, id: Date.now().toString() }];
      dispatch({ type: 'UPDATE_REPORTING', data: { auditLogs: newAuditLogs } });

      // TODO: Persist to Firestore
      // const auditRef = collection(db, 'companies', state.company.id, 'auditlog');
      // await addDoc(auditRef, auditLog);
    } catch (error) {
      console.error('Error logging audit event:', error);
    }
  };

  const value = {
    state,
    dispatch,
    loadCompanyData,
    updateCompanyProfile,
    logAuditEvent
  };

  return (
    <ProfessionalContext.Provider value={value}>
      {children}
    </ProfessionalContext.Provider>
  );
};

// Hook to use the Professional Context
export const useProfessional = () => {
  const context = useContext(ProfessionalContext);
  if (!context) {
    throw new Error('useProfessional must be used within a ProfessionalProvider');
  }
  return context;
};

export default ProfessionalContext;