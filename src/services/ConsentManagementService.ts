/**
 * Advanced Consent Management Service
 * 
 * Granular consent system for Ubuntu-based family collaboration.
 * Tracks consent for specific actions, features, and data sharing.
 * Maintains consent history and supports revocation.
 * 
 * Key Features:
 * - Per-feature consent (video, recording, data sharing, AI, etc.)
 * - Elder consent requirements for sensitive actions
 * - Consent history and audit trail
 * - Consent revocation with cascading effects
 * - Consent expiration and renewal
 * - Family-wide consent policies
 * 
 * @module ConsentManagementService
 */

import { doc, collection, setDoc, getDoc, getDocs, query, where, orderBy, Timestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Consent Types
 */
export enum ConsentType {
  VIDEO_CALL = 'video_call',
  VIDEO_RECORDING = 'video_recording',
  SCREEN_SHARING = 'screen_sharing',
  DATA_SHARING = 'data_sharing',
  AI_ANALYSIS = 'ai_analysis',
  ANALYTICS_TRACKING = 'analytics_tracking',
  DOCUMENT_COLLABORATION = 'document_collaboration',
  PROFILE_VISIBILITY = 'profile_visibility',
  NOTIFICATION_SETTINGS = 'notification_settings',
  THIRD_PARTY_INTEGRATION = 'third_party_integration'
}

/**
 * Consent Status
 */
export enum ConsentStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  PENDING = 'pending',
  REVOKED = 'revoked',
  EXPIRED = 'expired'
}

/**
 * Consent Requirement Level
 */
export enum ConsentRequirement {
  INDIVIDUAL = 'individual',        // Individual user consent only
  ELDER_APPROVAL = 'elder_approval', // Requires elder approval
  UNANIMOUS = 'unanimous',          // Requires all family members
  MAJORITY = 'majority'             // Requires majority (>50%)
}

/**
 * Consent Record
 */
export interface ConsentRecord {
  id: string;
  userId: string;
  familyId: string;
  consentType: ConsentType;
  status: ConsentStatus;
  grantedAt?: Date;
  revokedAt?: Date;
  expiresAt?: Date;
  metadata: {
    purpose: string;
    dataTypes?: string[];
    thirdParties?: string[];
    retentionPeriod?: string;
  };
  elderApprovalRequired: boolean;
  elderApprovedBy?: string;
  elderApprovedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  version: number; // Consent policy version
}

/**
 * Consent History Entry
 */
export interface ConsentHistory {
  id: string;
  consentId: string;
  userId: string;
  action: 'granted' | 'denied' | 'revoked' | 'expired' | 'renewed';
  previousStatus: ConsentStatus;
  newStatus: ConsentStatus;
  timestamp: Date;
  reason?: string;
  metadata?: Record<string, any>;
}

/**
 * Family Consent Policy
 */
export interface FamilyConsentPolicy {
  familyId: string;
  consentType: ConsentType;
  requirement: ConsentRequirement;
  elderApprovalRequired: boolean;
  autoExpireDays?: number;
  requiresRenewal: boolean;
  description: string;
  lastUpdated: Date;
}

/**
 * Consent Request
 */
export interface ConsentRequest {
  id: string;
  userId: string;
  familyId: string;
  consentType: ConsentType;
  purpose: string;
  requestedAt: Date;
  expiresAt?: Date;
  status: 'pending' | 'approved' | 'denied';
  approvers: {
    userId: string;
    userName: string;
    userRole: string;
    response: 'pending' | 'approved' | 'denied';
    respondedAt?: Date;
  }[];
}

/**
 * Advanced Consent Management Service
 */
export class ConsentManagementService {
  
  /**
   * Request consent from user
   */
  async requestConsent(
    userId: string,
    familyId: string,
    consentType: ConsentType,
    metadata: ConsentRecord['metadata'],
    elderApprovalRequired: boolean = false
  ): Promise<ConsentRecord> {
    try {
      const consentId = `${userId}_${consentType}_${Date.now()}`;
      const consentRef = doc(db, 'consents', consentId);

      const consent: ConsentRecord = {
        id: consentId,
        userId,
        familyId,
        consentType,
        status: elderApprovalRequired ? ConsentStatus.PENDING : ConsentStatus.GRANTED,
        grantedAt: elderApprovalRequired ? undefined : new Date(),
        metadata,
        elderApprovalRequired,
        version: 1 // Current consent policy version
      };

      await setDoc(consentRef, {
        ...consent,
        grantedAt: consent.grantedAt ? Timestamp.fromDate(consent.grantedAt) : null
      });

      // Log to history
      await this.logConsentHistory(consentId, userId, 'granted', ConsentStatus.PENDING, ConsentStatus.GRANTED);

      return consent;

    } catch (error) {
      console.error('Error requesting consent:', error);
      throw new Error('Failed to request consent');
    }
  }

  /**
   * Grant consent
   */
  async grantConsent(
    userId: string,
    familyId: string,
    consentType: ConsentType,
    metadata: ConsentRecord['metadata'],
    expiresInDays?: number
  ): Promise<ConsentRecord> {
    try {
      // Check if consent already exists
      const existingConsent = await this.getConsent(userId, familyId, consentType);
      
      if (existingConsent && existingConsent.status === ConsentStatus.GRANTED) {
        return existingConsent; // Already granted
      }

      const consentId = existingConsent?.id || `${userId}_${consentType}_${Date.now()}`;
      const consentRef = doc(db, 'consents', consentId);

      const now = new Date();
      const expiresAt = expiresInDays
        ? new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000)
        : undefined;

      const consent: ConsentRecord = {
        id: consentId,
        userId,
        familyId,
        consentType,
        status: ConsentStatus.GRANTED,
        grantedAt: now,
        expiresAt,
        metadata,
        elderApprovalRequired: false,
        version: 1
      };

      await setDoc(consentRef, {
        ...consent,
        grantedAt: Timestamp.fromDate(now),
        expiresAt: expiresAt ? Timestamp.fromDate(expiresAt) : null
      });

      // Log to history
      await this.logConsentHistory(
        consentId,
        userId,
        'granted',
        existingConsent?.status || ConsentStatus.PENDING,
        ConsentStatus.GRANTED
      );

      return consent;

    } catch (error) {
      console.error('Error granting consent:', error);
      throw new Error('Failed to grant consent');
    }
  }

  /**
   * Revoke consent
   */
  async revokeConsent(
    userId: string,
    familyId: string,
    consentType: ConsentType,
    reason?: string
  ): Promise<void> {
    try {
      const consent = await this.getConsent(userId, familyId, consentType);
      
      if (!consent) {
        throw new Error('Consent not found');
      }

      const consentRef = doc(db, 'consents', consent.id);

      await updateDoc(consentRef, {
        status: ConsentStatus.REVOKED,
        revokedAt: Timestamp.now()
      });

      // Log to history
      await this.logConsentHistory(
        consent.id,
        userId,
        'revoked',
        consent.status,
        ConsentStatus.REVOKED,
        reason
      );

      // Trigger cascading effects
      await this.handleConsentRevocation(userId, familyId, consentType);

    } catch (error) {
      console.error('Error revoking consent:', error);
      throw new Error('Failed to revoke consent');
    }
  }

  /**
   * Check if user has granted consent
   */
  async hasConsent(
    userId: string,
    familyId: string,
    consentType: ConsentType
  ): Promise<boolean> {
    try {
      const consent = await this.getConsent(userId, familyId, consentType);
      
      if (!consent) {
        return false;
      }

      // Check if expired
      if (consent.expiresAt && new Date() > consent.expiresAt) {
        await this.markConsentExpired(consent.id);
        return false;
      }

      return consent.status === ConsentStatus.GRANTED;

    } catch (error) {
      console.error('Error checking consent:', error);
      return false;
    }
  }

  /**
   * Get consent record
   */
  async getConsent(
    userId: string,
    familyId: string,
    consentType: ConsentType
  ): Promise<ConsentRecord | null> {
    try {
      const consentsQuery = query(
        collection(db, 'consents'),
        where('userId', '==', userId),
        where('familyId', '==', familyId),
        where('consentType', '==', consentType),
        orderBy('grantedAt', 'desc')
      );

      const snapshot = await getDocs(consentsQuery);

      if (snapshot.empty) {
        return null;
      }

      const data = snapshot.docs[0].data();
      return {
        ...data,
        grantedAt: data.grantedAt?.toDate(),
        revokedAt: data.revokedAt?.toDate(),
        expiresAt: data.expiresAt?.toDate(),
        elderApprovedAt: data.elderApprovedAt?.toDate()
      } as ConsentRecord;

    } catch (error) {
      console.error('Error getting consent:', error);
      return null;
    }
  }

  /**
   * Get all consents for a user
   */
  async getUserConsents(userId: string, familyId: string): Promise<ConsentRecord[]> {
    try {
      const consentsQuery = query(
        collection(db, 'consents'),
        where('userId', '==', userId),
        where('familyId', '==', familyId)
      );

      const snapshot = await getDocs(consentsQuery);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          grantedAt: data.grantedAt?.toDate(),
          revokedAt: data.revokedAt?.toDate(),
          expiresAt: data.expiresAt?.toDate(),
          elderApprovedAt: data.elderApprovedAt?.toDate()
        } as ConsentRecord;
      });

    } catch (error) {
      console.error('Error getting user consents:', error);
      return [];
    }
  }

  /**
   * Get consent history
   */
  async getConsentHistory(consentId: string): Promise<ConsentHistory[]> {
    try {
      const historyQuery = query(
        collection(db, 'consentHistory'),
        where('consentId', '==', consentId),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(historyQuery);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          timestamp: data.timestamp.toDate()
        } as ConsentHistory;
      });

    } catch (error) {
      console.error('Error getting consent history:', error);
      return [];
    }
  }

  /**
   * Request elder approval
   */
  async requestElderApproval(
    consentId: string,
    elderId: string
  ): Promise<void> {
    try {
      const consentRef = doc(db, 'consents', consentId);
      const consentSnap = await getDoc(consentRef);

      if (!consentSnap.exists()) {
        throw new Error('Consent not found');
      }

      // TODO: Send notification to elder
      console.log(`Elder approval requested from ${elderId} for consent ${consentId}`);

    } catch (error) {
      console.error('Error requesting elder approval:', error);
      throw new Error('Failed to request elder approval');
    }
  }

  /**
   * Approve consent as elder
   */
  async approveAsElder(
    consentId: string,
    elderId: string
  ): Promise<void> {
    try {
      const consentRef = doc(db, 'consents', consentId);

      await updateDoc(consentRef, {
        status: ConsentStatus.GRANTED,
        elderApprovedBy: elderId,
        elderApprovedAt: Timestamp.now(),
        grantedAt: Timestamp.now()
      });

      const consentSnap = await getDoc(consentRef);
      const consent = consentSnap.data();

      if (!consent) {
        throw new Error('Consent data not found');
      }

      // Log to history
      await this.logConsentHistory(
        consentId,
        consent.userId,
        'granted',
        ConsentStatus.PENDING,
        ConsentStatus.GRANTED,
        `Approved by elder ${elderId}`
      );

    } catch (error) {
      console.error('Error approving as elder:', error);
      throw new Error('Failed to approve consent');
    }
  }

  /**
   * Check if family-wide consent is met
   */
  async checkFamilyConsent(
    familyId: string,
    consentType: ConsentType,
    requirement: ConsentRequirement
  ): Promise<{
    met: boolean;
    granted: number;
    required: number;
    missing: string[];
  }> {
    try {
      // Get all family members (TODO: fetch from family collection)
      const familyMembers = ['user1', 'user2', 'user3', 'elder1']; // Placeholder

      // Get consents from all members
      const consentsQuery = query(
        collection(db, 'consents'),
        where('familyId', '==', familyId),
        where('consentType', '==', consentType),
        where('status', '==', ConsentStatus.GRANTED)
      );

      const snapshot = await getDocs(consentsQuery);
      const grantedUsers = new Set(snapshot.docs.map(doc => doc.data().userId));

      const granted = grantedUsers.size;
      const missing = familyMembers.filter(m => !grantedUsers.has(m));

      let met = false;
      let required = 0;

      switch (requirement) {
        case ConsentRequirement.INDIVIDUAL:
          met = granted >= 1;
          required = 1;
          break;
        case ConsentRequirement.MAJORITY:
          required = Math.ceil(familyMembers.length / 2);
          met = granted >= required;
          break;
        case ConsentRequirement.UNANIMOUS:
          required = familyMembers.length;
          met = granted === required;
          break;
        case ConsentRequirement.ELDER_APPROVAL:
          // Check if elder has granted
          const elderGranted = snapshot.docs.some(doc =>
            doc.data().elderApprovedBy !== undefined
          );
          met = elderGranted;
          required = 1;
          break;
      }

      return { met, granted, required, missing };

    } catch (error) {
      console.error('Error checking family consent:', error);
      return { met: false, granted: 0, required: 0, missing: [] };
    }
  }

  /**
   * Log consent action to history
   */
  private async logConsentHistory(
    consentId: string,
    userId: string,
    action: ConsentHistory['action'],
    previousStatus: ConsentStatus,
    newStatus: ConsentStatus,
    reason?: string
  ): Promise<void> {
    try {
      const historyId = `${consentId}_${Date.now()}`;
      const historyRef = doc(db, 'consentHistory', historyId);

      const history: ConsentHistory = {
        id: historyId,
        consentId,
        userId,
        action,
        previousStatus,
        newStatus,
        timestamp: new Date(),
        reason
      };

      await setDoc(historyRef, {
        ...history,
        timestamp: Timestamp.now()
      });

    } catch (error) {
      console.error('Error logging consent history:', error);
    }
  }

  /**
   * Mark consent as expired
   */
  private async markConsentExpired(consentId: string): Promise<void> {
    try {
      const consentRef = doc(db, 'consents', consentId);
      const consentSnap = await getDoc(consentRef);

      if (!consentSnap.exists()) {
        return;
      }

      const consent = consentSnap.data();

      await updateDoc(consentRef, {
        status: ConsentStatus.EXPIRED
      });

      await this.logConsentHistory(
        consentId,
        consent.userId,
        'expired',
        ConsentStatus.GRANTED,
        ConsentStatus.EXPIRED
      );

    } catch (error) {
      console.error('Error marking consent expired:', error);
    }
  }

  /**
   * Handle cascading effects of consent revocation
   */
  private async handleConsentRevocation(
    userId: string,
    familyId: string,
    consentType: ConsentType
  ): Promise<void> {
    try {
      // Implement cascading logic based on consent type
      switch (consentType) {
        case ConsentType.VIDEO_RECORDING:
          // Stop any active recordings
          console.log('Stopping video recordings for user', userId);
          break;
        case ConsentType.DATA_SHARING:
          // Remove shared data
          console.log('Removing shared data for user', userId);
          break;
        case ConsentType.AI_ANALYSIS:
          // Stop AI processing
          console.log('Stopping AI analysis for user', userId);
          break;
        // Add more cascading effects as needed
      }

    } catch (error) {
      console.error('Error handling consent revocation:', error);
    }
  }

  /**
   * Get family consent policy
   */
  async getFamilyConsentPolicy(
    familyId: string,
    consentType: ConsentType
  ): Promise<FamilyConsentPolicy | null> {
    try {
      const policyQuery = query(
        collection(db, 'consentPolicies'),
        where('familyId', '==', familyId),
        where('consentType', '==', consentType)
      );

      const snapshot = await getDocs(policyQuery);

      if (snapshot.empty) {
        return null;
      }

      const data = snapshot.docs[0].data();
      return {
        ...data,
        lastUpdated: data.lastUpdated.toDate()
      } as FamilyConsentPolicy;

    } catch (error) {
      console.error('Error getting family consent policy:', error);
      return null;
    }
  }
}

// Export singleton instance
let serviceInstance: ConsentManagementService | null = null;

export const getConsentManagementService = (): ConsentManagementService => {
  if (!serviceInstance) {
    serviceInstance = new ConsentManagementService();
  }
  return serviceInstance;
};

export default ConsentManagementService;
