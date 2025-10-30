/**
 * BizHelp Integration Service
 * 
 * Handles bi-directional sync between MNI Professional Services
 * and BizHelp comprehensive business management platform
 * 
 * @module services/bizHelpIntegration
 */

import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface BizHelpBusiness {
  id: string;
  name: string;
  type: 'SoleProp' | 'Partnership' | 'PtyLtd' | 'NPC' | 'Trust' | 'Stokvel' | 'CC';
  stage: 'planning' | 'applying' | 'registered' | 'formalized';
  registration?: {
    cipcNumber?: string;
    registeredDate?: string;
    taxNumber?: string;
  };
  compliance?: {
    obligations?: Array<{
      id: string;
      name: string;
      type: string;
      dueDate: string;
      status: string;
    }>;
  };
  partnerships?: string[];
  operations?: {
    projects: number;
    activeTeam: number;
    revenue?: number;
  };
}

export interface BusinessActivity {
  id?: string;
  type: string;
  source: 'MNI' | 'BizHelp' | 'Hub';
  companyId: string;
  userId: string;
  timestamp: any;
  data: Record<string, any>;
  visible?: string[];
}

/**
 * Subscribe to BizHelp business data for real-time updates
 */
export const subscribeToBizHelpBusiness = (
  companyId: string,
  callback: (data: BizHelpBusiness | null) => void,
  onError?: (error: any) => void
) => {
  try {
    const ref = doc(db, 'businesses', companyId);
    
    const unsubscribe = onSnapshot(
      ref,
      (docSnap) => {
        if (docSnap.exists()) {
          callback({
            id: docSnap.id,
            ...docSnap.data(),
          } as BizHelpBusiness);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error subscribing to BizHelp business:', error);
        onError?.(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up BizHelp subscription:', error);
    onError?.(error);
    return () => {};
  }
};

/**
 * Log an activity event that syncs between MNI and BizHelp
 */
export const logBusinessActivity = async (
  userId: string,
  companyId: string,
  type: string,
  data: Record<string, any>,
  source: 'MNI' | 'BizHelp' = 'MNI'
) => {
  try {
    const activity: BusinessActivity = {
      type,
      source,
      companyId,
      userId,
      timestamp: Timestamp.now(),
      data,
      visible: ['MNI', 'BizHelp', 'Hub'],
    };

    await addDoc(collection(db, `activities/${userId}`), activity);
    console.log(`Activity logged: ${type} from ${source}`);
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};

/**
 * Subscribe to business activities for ecosystem-wide sync
 */
export const subscribeToBusinessActivities = (
  userId: string,
  companyId: string,
  callback: (activities: BusinessActivity[]) => void,
  onError?: (error: any) => void
) => {
  try {
    const q = query(
      collection(db, `activities/${userId}`),
      where('companyId', '==', companyId)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnap) => {
        const activities: BusinessActivity[] = [];
        querySnap.forEach((doc) => {
          activities.push({
            id: doc.id,
            ...doc.data(),
          } as BusinessActivity);
        });
        callback(activities.sort((a, b) => b.timestamp - a.timestamp));
      },
      (error) => {
        console.error('Error subscribing to activities:', error);
        onError?.(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up activities subscription:', error);
    onError?.(error);
    return () => {};
  }
};

/**
 * Activity types for business operations
 */
export const ACTIVITY_TYPES = {
  // Projects
  PROJECT_CREATED: 'project_created',
  PROJECT_UPDATED: 'project_updated',
  PROJECT_COMPLETED: 'project_completed',
  
  // Tasks
  TASK_CREATED: 'task_created',
  TASK_STATUS_CHANGED: 'task_status_changed',
  TASK_COMPLETED: 'task_completed',
  
  // Compliance
  COMPLIANCE_COMPLETED: 'compliance_completed',
  COMPLIANCE_OVERDUE: 'compliance_overdue',
  COMPLIANCE_REMINDER: 'compliance_reminder',
  
  // Governance
  GOVERNANCE_DOCUMENT_ADDED: 'governance_document_added',
  POLICY_ADOPTED: 'policy_adopted',
  BOARD_MEETING_HELD: 'board_meeting_held',
  
  // Human Capital
  ROLE_CREATED: 'role_created',
  TEAM_MEMBER_ADDED: 'team_member_added',
  PERFORMANCE_REVIEW_COMPLETED: 'performance_review_completed',
  
  // Partnerships
  PARTNERSHIP_CREATED: 'partnership_created',
  PARTNERSHIP_SIGNED: 'partnership_signed',
  PARTNERSHIP_COMPLETED: 'partnership_completed',
  
  // Risks
  RISK_IDENTIFIED: 'risk_identified',
  RISK_MITIGATED: 'risk_mitigated',
  INCIDENT_REPORTED: 'incident_reported',
  
  // Business
  BUSINESS_REGISTERED: 'business_registered',
  ENTITY_CREATED: 'entity_created',
};

/**
 * Get deep link to BizHelp for a specific action
 */
export const getBizHelpLink = (
  action: string,
  params?: Record<string, string>
): string => {
  const baseUrl = process.env.REACT_APP_BIZHELP_URL || 'https://bizhelp-lifecv.web.app';
  
  const routes: Record<string, string> = {
    // Dashboard
    dashboard: '/dashboard',
    
    // Operations
    'projects': '/projects',
    'project-detail': '/projects/{projectId}',
    'tasks': '/tasks',
    'task-detail': '/tasks/{taskId}',
    'risks': '/risks',
    'incidents': '/incidents',
    'milestones': '/milestones',
    'knowledge-base': '/knowledge-base',
    
    // Compliance
    'compliance': '/compliance',
    'compliance-calendar': '/compliance/calendar',
    'entity-setup': '/wizard/entity',
    'entity-detail': '/entity/{businessId}',
    
    // Governance
    'governance': '/governance',
    'governance-documents': '/governance/documents',
    'policies': '/governance/policies',
    'board-registry': '/governance/board',
    
    // Human Capital
    'org-chart': '/hr/org-chart',
    'roles': '/hr/roles',
    'team': '/hr/team',
    'contracts': '/hr/contracts',
    
    // Marketplace
    'marketplace': '/marketplace',
    'professionals': '/marketplace/professionals',
    'partnerships': '/partnerships',
    'partnership-detail': '/partnerships/{partnershipId}',
    
    // Operations Dashboard
    'operations-dashboard': '/operations/dashboard',
  };

  let path = routes[action] || '/dashboard';
  
  // Replace URL parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`{${key}}`, value);
    });
  }

  return `${baseUrl}${path}`;
};

/**
 * Activity logger utility for components
 */
export class ActivityLogger {
  constructor(
    private userId: string,
    private companyId: string
  ) {}

  async log(
    type: string,
    data: Record<string, any>,
    source: 'MNI' | 'BizHelp' = 'MNI'
  ) {
    return logBusinessActivity(this.userId, this.companyId, type, data, source);
  }

  async projectCreated(projectData: any) {
    return this.log(ACTIVITY_TYPES.PROJECT_CREATED, projectData);
  }

  async projectUpdated(projectData: any) {
    return this.log(ACTIVITY_TYPES.PROJECT_UPDATED, projectData);
  }

  async taskCreated(taskData: any) {
    return this.log(ACTIVITY_TYPES.TASK_CREATED, taskData);
  }

  async taskStatusChanged(taskId: string, oldStatus: string, newStatus: string) {
    return this.log(ACTIVITY_TYPES.TASK_STATUS_CHANGED, {
      taskId,
      oldStatus,
      newStatus,
    });
  }

  async complianceCompleted(obligationId: string, obligationName: string) {
    return this.log(ACTIVITY_TYPES.COMPLIANCE_COMPLETED, {
      obligationId,
      obligationName,
    });
  }

  async partnershipSigned(partnershipId: string, partners: any[]) {
    return this.log(ACTIVITY_TYPES.PARTNERSHIP_SIGNED, {
      partnershipId,
      partners,
    });
  }

  async riskIdentified(riskData: any) {
    return this.log(ACTIVITY_TYPES.RISK_IDENTIFIED, riskData);
  }

  async incidentReported(incidentData: any) {
    return this.log(ACTIVITY_TYPES.INCIDENT_REPORTED, incidentData);
  }
}

export default {
  subscribeToBizHelpBusiness,
  logBusinessActivity,
  subscribeToBusinessActivities,
  getBizHelpLink,
  ActivityLogger,
  ACTIVITY_TYPES,
};
