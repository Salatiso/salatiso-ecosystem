import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { SLAStatus, SLAConfiguration, SLATracker } from '../types/teamAssignment';

/**
 * SLA Tracking Service
 * Monitors and enforces Service Level Agreements
 */
class SLATrackingService {
  private readonly SLA_CONFIG_COLLECTION = 'sla_configurations';
  private readonly SLA_TRACKER_COLLECTION = 'sla_trackers';

  /**
   * Get SLA configuration for a team
   */
  async getSLAConfig(teamId: string): Promise<SLAConfiguration | null> {
    try {
      const q = query(
        collection(db, this.SLA_CONFIG_COLLECTION),
        where('teamId', '==', teamId),
        limit(1)
      );

      const snapshot = await getDocs(q);
      return snapshot.empty ? null : (snapshot.docs[0].data() as SLAConfiguration);
    } catch (error) {
      console.error('Error fetching SLA config:', error);
      return null;
    }
  }

  /**
   * Create SLA tracker for an escalation
   */
  async createSLATracker(escalationId: string, assignmentId: string, config: SLAConfiguration): Promise<SLATracker | null> {
    try {
      const now = new Date();
      const responseDeadline = new Date(now.getTime() + config.responseTimeMinutes * 60 * 1000);
      const resolutionDeadline = new Date(now.getTime() + config.resolutionTimeMinutes * 60 * 1000);

      const tracker: SLATracker = {
        id: '',
        escalationId,
        assignmentId,
        responseDeadline,
        resolutionDeadline,
        responseStatus: SLAStatus.IN_PROGRESS,
        resolutionStatus: SLAStatus.IN_PROGRESS,
        breached: false,
        escalatedDueToSLA: false,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, this.SLA_TRACKER_COLLECTION), tracker);
      return { ...tracker, id: docRef.id };
    } catch (error) {
      console.error('Error creating SLA tracker:', error);
      return null;
    }
  }

  /**
   * Record response time
   */
  async recordResponse(escalationId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, this.SLA_TRACKER_COLLECTION),
        where('escalationId', '==', escalationId),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) return false;

      const tracker = snapshot.docs[0].data() as SLATracker;
      const now = new Date();
      const responseTime = now.getTime() - new Date(tracker.createdAt).getTime();
      const isBreachy = now.getTime() > new Date(tracker.responseDeadline).getTime();

      await updateDoc(snapshot.docs[0].ref, {
        responseStatus: isBreachy ? SLAStatus.BREACHED : SLAStatus.IN_PROGRESS,
        responseTimeMs: responseTime,
        firstResponseAt: now,
      });

      return !isBreachy;
    } catch (error) {
      console.error('Error recording response:', error);
      return false;
    }
  }

  /**
   * Record resolution time
   */
  async recordResolution(escalationId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, this.SLA_TRACKER_COLLECTION),
        where('escalationId', '==', escalationId),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) return false;

      const tracker = snapshot.docs[0].data() as SLATracker;
      const now = new Date();
      const resolutionTime = now.getTime() - new Date(tracker.createdAt).getTime();
      const isBreachy = now.getTime() > new Date(tracker.resolutionDeadline).getTime();

      await updateDoc(snapshot.docs[0].ref, {
        resolutionStatus: isBreachy ? SLAStatus.FAILED : SLAStatus.RESOLVED,
        resolutionTimeMs: resolutionTime,
        resolvedAt: now,
      });

      return !isBreachy;
    } catch (error) {
      console.error('Error recording resolution:', error);
      return false;
    }
  }

  /**
   * Get SLA tracker for escalation
   */
  async getSLATracker(escalationId: string): Promise<SLATracker | null> {
    try {
      const q = query(
        collection(db, this.SLA_TRACKER_COLLECTION),
        where('escalationId', '==', escalationId),
        limit(1)
      );

      const snapshot = await getDocs(q);
      return snapshot.empty ? null : (snapshot.docs[0].data() as SLATracker);
    } catch (error) {
      console.error('Error fetching SLA tracker:', error);
      return null;
    }
  }

  /**
   * Check SLA compliance
   */
  async checkSLACompliance(escalationId: string): Promise<{
    compliant: boolean;
    status: string;
    timeRemaining: number;
  }> {
    try {
      const tracker = await this.getSLATracker(escalationId);
      if (!tracker) {
        return { compliant: false, status: 'No SLA found', timeRemaining: 0 };
      }

      const now = new Date();
      const resolutionDeadline = new Date(tracker.resolutionDeadline);
      const timeRemaining = resolutionDeadline.getTime() - now.getTime();

      let status = '';
      if (tracker.resolutionStatus === SLAStatus.RESOLVED) {
        status = 'SLA Met - Resolved';
      } else if (tracker.resolutionStatus === SLAStatus.BREACHED || tracker.resolutionStatus === SLAStatus.FAILED) {
        status = 'SLA Breached';
      } else if (timeRemaining < 300000) {
        // Less than 5 minutes
        status = 'Critical - SLA expiring soon';
      } else if (timeRemaining < 900000) {
        // Less than 15 minutes
        status = 'Warning - SLA approaching';
      } else {
        status = 'On Track';
      }

      return {
        compliant: tracker.resolutionStatus === SLAStatus.RESOLVED,
        status,
        timeRemaining,
      };
    } catch (error) {
      console.error('Error checking SLA compliance:', error);
      return { compliant: false, status: 'Error checking SLA', timeRemaining: 0 };
    }
  }

  /**
   * Get breached SLAs
   */
  async getBreachedSLAs(teamId: string): Promise<SLATracker[]> {
    try {
      const q = query(
        collection(db, this.SLA_TRACKER_COLLECTION),
        where('teamId', '==', teamId),
        where('resolutionStatus', 'in', [SLAStatus.BREACHED, SLAStatus.FAILED]),
        orderBy('resolutionDeadline', 'asc'),
        limit(50)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => d.data() as SLATracker);
    } catch (error) {
      console.error('Error fetching breached SLAs:', error);
      return [];
    }
  }

  /**
   * Get upcoming breaches (within 30 minutes)
   */
  async getUpcomingBreaches(teamId: string): Promise<SLATracker[]> {
    try {
      const now = new Date();
      const in30Mins = new Date(now.getTime() + 30 * 60 * 1000);

      const q = query(
        collection(db, this.SLA_TRACKER_COLLECTION),
        where('teamId', '==', teamId),
        where('resolutionStatus', '==', SLAStatus.IN_PROGRESS)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs
        .map(d => d.data() as SLATracker)
        .filter(t => new Date(t.resolutionDeadline) < in30Mins);
    } catch (error) {
      console.error('Error fetching upcoming breaches:', error);
      return [];
    }
  }

  /**
   * Get SLA metrics for team
   */
  async getTeamSLAMetrics(teamId: string, daysBack: number = 30): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      const q = query(
        collection(db, this.SLA_TRACKER_COLLECTION),
        where('teamId', '==', teamId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const trackers = snapshot.docs
        .map(d => d.data() as SLATracker)
        .filter(t => new Date(t.createdAt) >= startDate);

      const resolved = trackers.filter(t => t.resolutionStatus === SLAStatus.RESOLVED).length;
      const breached = trackers.filter(
        t => t.resolutionStatus === SLAStatus.BREACHED || t.resolutionStatus === SLAStatus.FAILED
      ).length;

      const avgResolutionTime =
        trackers.length > 0
          ? trackers.reduce((sum, t) => sum + (t.resolutionTimeMs || 0), 0) / trackers.length
          : 0;

      return {
        total: trackers.length,
        met: resolved,
        breached,
        complianceRate: trackers.length > 0 ? (resolved / trackers.length) * 100 : 0,
        averageResolutionTime: Math.round(avgResolutionTime / 1000 / 60), // in minutes
        period: `Last ${daysBack} days`,
      };
    } catch (error) {
      console.error('Error calculating team SLA metrics:', error);
      return {
        total: 0,
        met: 0,
        breached: 0,
        complianceRate: 0,
        averageResolutionTime: 0,
        error: `${error}`,
      };
    }
  }
}

export const slaTrackingService = new SLATrackingService();
