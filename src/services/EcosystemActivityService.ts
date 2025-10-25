/**
 * EcosystemActivityService.ts
 * 
 * Unified activity management service for the Salatiso Ecosystem.
 * Handles real-time activity logging, retrieval, filtering, and synchronization
 * across all ecosystem apps.
 * 
 * This service is the backbone of the activity system - all apps use it to:
 * 1. Log activities when users take action
 * 2. Subscribe to real-time activity updates
 * 3. Query activities with filters
 * 4. Manage activity read status
 * 
 * @version 1.0.0
 * @author Ecosystem Architecture Team
 */

import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Query,
  DocumentSnapshot,
  QueryConstraint,
  onSnapshot,
  Unsubscribe,
  updateDoc,
  deleteDoc,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { getAuth } from 'firebase/auth';

/**
 * Activity type definitions
 * These are the official activity types across all ecosystem apps
 */
export type ActivityType =
  // LifeSync
  | 'profile_updated'
  | 'verification_completed'
  | 'badge_earned'
  | 'trust_score_changed'
  // BizHelp
  | 'project_created'
  | 'client_added'
  | 'milestone_completed'
  | 'team_member_joined'
  | 'revenue_recorded'
  // FinHelp
  | 'payment_received'
  | 'budget_created'
  | 'financial_goal_created'
  | 'financial_alert'
  // SafetyHelp
  | 'incident_reported'
  | 'training_completed'
  | 'protocol_updated'
  | 'safety_drill_executed'
  // PigeeBack
  | 'ride_offered'
  | 'booking_confirmed'
  | 'rating_given'
  | 'property_listed'
  // Ekhaya
  | 'group_joined'
  | 'event_created'
  | 'event_attended'
  | 'connection_made'
  // DocHelp
  | 'document_created'
  | 'document_shared'
  | 'document_version_updated'
  // Sazi Academy
  | 'course_enrolled'
  | 'lesson_completed'
  | 'certificate_earned'
  | 'quiz_passed';

/**
 * Source app definitions
 */
export type SourceApp =
  | 'LifeSync'
  | 'Hub'
  | 'BizHelp'
  | 'FinHelp'
  | 'SafetyHelp'
  | 'PigeeBack'
  | 'Ekhaya'
  | 'DocHelp'
  | 'SaziAcademy';

/**
 * Activity category for filtering and organization
 */
export type ActivityCategory =
  | 'profile'
  | 'business'
  | 'finance'
  | 'safety'
  | 'community'
  | 'learning'
  | 'document';

/**
 * Activity priority level
 */
export type ActivityPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Activity visibility settings
 */
export type ActivityVisibility = 'private' | 'family' | 'public';

/**
 * Main Activity interface
 */
export interface Activity {
  id: string;
  timestamp: Timestamp;
  sourceApp: SourceApp;
  activityType: ActivityType;
  activityTitle: string;
  activityDescription?: string;
  activityIcon?: string;
  appIcon?: string;
  appColor?: string;
  deepLink: string;
  userId: string;
  affectedUsers?: string[];
  category: ActivityCategory;
  priority: ActivityPriority;
  visibility: ActivityVisibility;
  data?: Record<string, any>;
  metadata?: {
    source?: 'mobile' | 'web';
    ipAddress?: string;
    readBy?: { [userId: string]: Timestamp };
    deletedAt?: Timestamp;
  };
}

/**
 * Activity logging options
 */
export interface LogActivityOptions {
  sourceApp: SourceApp;
  activityType: ActivityType;
  activityTitle: string;
  activityDescription?: string;
  activityIcon?: string;
  appIcon?: string;
  appColor?: string;
  deepLink: string;
  affectedUsers?: string[];
  category: ActivityCategory;
  priority?: ActivityPriority;
  visibility?: ActivityVisibility;
  data?: Record<string, any>;
}

/**
 * Activity filtering options
 */
export interface ActivityFilters {
  sourceApp?: string;
  sourceApps?: string[];
  activityType?: string;
  activityTypes?: string[];
  category?: ActivityCategory;
  categories?: ActivityCategory[];
  priority?: ActivityPriority;
  priorities?: ActivityPriority[];
  dateFrom?: Date;
  dateTo?: Date;
  unreadOnly?: boolean;
  visibility?: ActivityVisibility;
  visibilities?: ActivityVisibility[];
}

/**
 * Activity statistics
 */
export interface ActivityStats {
  totalActivities: number;
  activitiesByApp: { [app: string]: number };
  activitiesByCategory: { [category: string]: number };
  activitiesByDay: { [date: string]: number };
  averageActivitiesPerDay: number;
  mostActiveApp: string;
  mostActiveCategory: string;
  unreadCount: number;
  lastActivityTime: Date | null;
}

/**
 * Sync result for manual sync operations
 */
export interface ActivitySyncResult {
  success: boolean;
  activitiesCount: number;
  lastSyncDate: Date;
  error?: string;
}

/**
 * EcosystemActivityService class
 * 
 * Manages all activity operations for the ecosystem.
 * Implements singleton pattern for consistency.
 */
class EcosystemActivityService {
  private static instance: EcosystemActivityService;
  private activityCache = new Map<string, Activity[]>();
  private realtimeListeners = new Map<string, Unsubscribe>();
  private lastSyncAttempt = new Map<string, number>();
  private syncThrottleMs = 5000; // 5 second minimum between syncs per user

  /**
   * Get singleton instance
   */
  static getInstance(): EcosystemActivityService {
    if (!EcosystemActivityService.instance) {
      EcosystemActivityService.instance = new EcosystemActivityService();
    }
    return EcosystemActivityService.instance;
  }

  /**
   * Log an activity to Firestore
   * 
   * This is called by apps when a user performs an action.
   * The activity is written to /activities/{userId}/{activityId}
   * Real-time listeners in all other apps will pick it up automatically.
   * 
   * @param userId - The user who performed the action
   * @param options - Activity details
   * @returns Promise with the activity ID
   */
  async logActivity(
    userId: string | undefined,
    options: LogActivityOptions
  ): Promise<string> {
    try {
      const actualUserId = userId || this.getCurrentUserId();
      if (!actualUserId) {
        throw new Error('User not authenticated');
      }

      const activityId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const activityRef = doc(
        collection(db, 'activities', actualUserId, 'items'),
        activityId
      );

      const activity: Activity = {
        id: activityId,
        timestamp: Timestamp.now(),
        sourceApp: options.sourceApp,
        activityType: options.activityType,
        activityTitle: options.activityTitle,
        activityDescription: options.activityDescription,
        activityIcon: options.activityIcon,
        appIcon: options.appIcon,
        appColor: options.appColor,
        deepLink: options.deepLink,
        userId: actualUserId,
        affectedUsers: options.affectedUsers,
        category: options.category,
        priority: options.priority || 'medium',
        visibility: options.visibility || 'private',
        data: options.data,
        metadata: {
          source: this.getSource(),
          readBy: { [actualUserId]: Timestamp.now() },
        },
      };

      await setDoc(activityRef, activity);

      // Clear cache for this user
      this.activityCache.delete(actualUserId);

      console.log(`✅ Activity logged: ${options.activityTitle}`);
      return activityId;
    } catch (error) {
      console.error('❌ Error logging activity:', error);
      throw error;
    }
  }

  /**
   * Get recent activities with optional filtering
   * 
   * Fetches activities from Firestore with pagination support.
   * Results are sorted by timestamp (most recent first).
   * 
   * @param userId - The user to fetch activities for
   * @param limitCount - Maximum number of activities to return
   * @param filters - Optional filtering options
   * @returns Promise with array of activities
   */
  async getRecentActivities(
    userId: string | undefined,
    limitCount: number = 10,
    filters?: ActivityFilters
  ): Promise<Activity[]> {
    try {
      const actualUserId = userId || this.getCurrentUserId();
      if (!actualUserId) {
        return [];
      }

      // Check cache first
      const cacheKey = `${actualUserId}_${limitCount}_${JSON.stringify(filters || {})}`;
      if (this.activityCache.has(cacheKey)) {
        return this.activityCache.get(cacheKey)!;
      }

      const constraints: QueryConstraint[] = [
        orderBy('timestamp', 'desc'),
        limit(limitCount),
      ];

      // Add filter constraints
      if (filters?.sourceApp) {
        constraints.push(where('sourceApp', '==', filters.sourceApp));
      }
      if (filters?.priority) {
        constraints.push(where('priority', '==', filters.priority));
      }
      if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
      }

      const q = query(
        collection(db, 'activities', actualUserId, 'items'),
        ...constraints
      );

      const snapshot = await getDocs(q);
      const activities = snapshot.docs.map((doc) =>
        doc.data() as Activity
      );

      // Client-side date filtering
      if (filters?.dateFrom || filters?.dateTo) {
        const dateFrom = filters.dateFrom?.getTime() || 0;
        const dateTo = filters.dateTo?.getTime() || Date.now();
        return activities.filter((a) =>
          a.timestamp.toDate().getTime() >= dateFrom &&
          a.timestamp.toDate().getTime() <= dateTo
        );
      }

      // Cache the result
      this.activityCache.set(cacheKey, activities);

      // Clear cache after 5 minutes
      setTimeout(() => this.activityCache.delete(cacheKey), 5 * 60 * 1000);

      return activities;
    } catch (error) {
      console.error('❌ Error fetching recent activities:', error);
      return [];
    }
  }

  /**
   * Get activities by source app
   * 
   * @param userId - The user to fetch activities for
   * @param sourceApp - Filter by source app
   * @param limitCount - Maximum number of activities
   * @returns Promise with array of activities
   */
  async getActivitiesByApp(
    userId: string | undefined,
    sourceApp: SourceApp,
    limitCount: number = 20
  ): Promise<Activity[]> {
    return this.getRecentActivities(userId, limitCount, { sourceApp });
  }

  /**
   * Get activities by category
   * 
   * @param userId - The user to fetch activities for
   * @param category - Filter by category
   * @param limitCount - Maximum number of activities
   * @returns Promise with array of activities
   */
  async getActivitiesByCategory(
    userId: string | undefined,
    category: ActivityCategory,
    limitCount: number = 20
  ): Promise<Activity[]> {
    return this.getRecentActivities(userId, limitCount, { category });
  }

  /**
   * Get activities by date range
   * 
   * @param userId - The user to fetch activities for
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Promise with array of activities
   */
  async getActivitiesByDateRange(
    userId: string | undefined,
    startDate: Date,
    endDate: Date
  ): Promise<Activity[]> {
    return this.getRecentActivities(userId, 100, {
      dateFrom: startDate,
      dateTo: endDate,
    });
  }

  /**
   * Subscribe to real-time activity updates
   * 
   * This sets up a real-time listener using Firestore's onSnapshot.
   * The callback is invoked immediately and whenever activities change.
   * 
   * **IMPORTANT:** Always call the returned unsubscribe function when
   * the component unmounts to prevent memory leaks.
   * 
   * @param userId - The user to listen for
   * @param callback - Function called with activity updates
   * @param filters - Optional filtering options
   * @returns Unsubscribe function (MUST be called on cleanup)
   */
  subscribeToActivities(
    userId: string | undefined,
    callback: (activities: Activity[]) => void,
    filters?: ActivityFilters
  ): Unsubscribe {
    try {
      const actualUserId = userId || this.getCurrentUserId();
      if (!actualUserId) {
        console.error('❌ No user authenticated for real-time listener');
        return () => {};
      }

      const constraints: QueryConstraint[] = [
        orderBy('timestamp', 'desc'),
        limit(20),
      ];

      if (filters?.sourceApp) {
        constraints.push(where('sourceApp', '==', filters.sourceApp));
      }
      if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
      }
      if (filters?.priority) {
        constraints.push(where('priority', '==', filters.priority));
      }

      const q = query(
        collection(db, 'activities', actualUserId, 'items'),
        ...constraints
      );

      // Create unique listener key
      const listenerKey = `${actualUserId}_${JSON.stringify(filters || {})}`;

      // Unsubscribe from previous listener if exists
      const previousUnsub = this.realtimeListeners.get(listenerKey);
      if (previousUnsub) {
        previousUnsub();
      }

      // Setup new listener
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const activities = snapshot.docs.map((doc) =>
            doc.data() as Activity
          );
          callback(activities);
        },
        (error) => {
          console.error('❌ Real-time listener error:', error);
          callback([]);
        }
      );

      // Store listener for cleanup
      this.realtimeListeners.set(listenerKey, unsubscribe);

      console.log(`📡 Real-time listener activated for ${actualUserId}`);

      return () => {
        unsubscribe();
        this.realtimeListeners.delete(listenerKey);
        console.log(`📡 Real-time listener deactivated for ${actualUserId}`);
      };
    } catch (error) {
      console.error('❌ Error setting up real-time listener:', error);
      return () => {};
    }
  }

  /**
   * Get a specific activity by ID
   * 
   * @param userId - The user's ID
   * @param activityId - The activity ID
   * @returns Promise with activity or null
   */
  async getActivityById(
    userId: string | undefined,
    activityId: string
  ): Promise<Activity | null> {
    try {
      const actualUserId = userId || this.getCurrentUserId();
      if (!actualUserId) {
        return null;
      }

      const docRef = doc(
        db,
        'activities',
        actualUserId,
        'items',
        activityId
      );
      const docSnap = await getDoc(docRef);

      return docSnap.exists() ? (docSnap.data() as Activity) : null;
    } catch (error) {
      console.error('❌ Error fetching activity by ID:', error);
      return null;
    }
  }

  /**
   * Mark an activity as read
   * 
   * @param userId - The user's ID
   * @param activityId - The activity ID
   * @returns Promise
   */
  async updateActivityRead(
    userId: string | undefined,
    activityId: string
  ): Promise<void> {
    try {
      const actualUserId = userId || this.getCurrentUserId();
      if (!actualUserId) {
        return;
      }

      const docRef = doc(
        db,
        'activities',
        actualUserId,
        'items',
        activityId
      );

      await updateDoc(docRef, {
        [`metadata.readBy.${actualUserId}`]: Timestamp.now(),
      });

      // Clear cache
      this.activityCache.clear();
    } catch (error) {
      console.error('❌ Error updating activity read status:', error);
    }
  }

  /**
   * Delete an activity (soft delete)
   * 
   * @param userId - The user's ID
   * @param activityId - The activity ID
   * @returns Promise
   */
  async deleteActivity(
    userId: string | undefined,
    activityId: string
  ): Promise<void> {
    try {
      const actualUserId = userId || this.getCurrentUserId();
      if (!actualUserId) {
        return;
      }

      const docRef = doc(
        db,
        'activities',
        actualUserId,
        'items',
        activityId
      );

      await updateDoc(docRef, {
        'metadata.deletedAt': Timestamp.now(),
      });

      // Clear cache
      this.activityCache.clear();
    } catch (error) {
      console.error('❌ Error deleting activity:', error);
    }
  }

  /**
   * Manually trigger sync (with throttling)
   * 
   * Useful for forcing a refresh. Throttled to 5-second minimum
   * between calls per user to prevent excessive Firestore reads.
   * 
   * @param userId - The user's ID
   * @returns Promise with sync result
   */
  async triggerSync(userId: string | undefined): Promise<ActivitySyncResult> {
    try {
      const actualUserId = userId || this.getCurrentUserId();
      if (!actualUserId) {
        return {
          success: false,
          activitiesCount: 0,
          lastSyncDate: new Date(),
          error: 'No user authenticated',
        };
      }

      // Check throttle
      const lastSync = this.lastSyncAttempt.get(actualUserId) || 0;
      const timeSinceLastSync = Date.now() - lastSync;
      if (timeSinceLastSync < this.syncThrottleMs) {
        const waitTime = Math.ceil((this.syncThrottleMs - timeSinceLastSync) / 1000);
        return {
          success: false,
          activitiesCount: 0,
          lastSyncDate: new Date(lastSync),
          error: `Sync throttled. Try again in ${waitTime}s`,
        };
      }

      // Perform sync
      this.lastSyncAttempt.set(actualUserId, Date.now());
      this.activityCache.clear();

      const activities = await this.getRecentActivities(actualUserId, 100);

      return {
        success: true,
        activitiesCount: activities.length,
        lastSyncDate: new Date(),
      };
    } catch (error) {
      console.error('❌ Error triggering sync:', error);
      return {
        success: false,
        activitiesCount: 0,
        lastSyncDate: new Date(),
        error: String(error),
      };
    }
  }

  /**
   * Get activity statistics
   * 
   * @param userId - The user's ID
   * @returns Promise with activity stats
   */
  async getActivityStats(userId: string | undefined): Promise<ActivityStats> {
    try {
      const actualUserId = userId || this.getCurrentUserId();
      if (!actualUserId) {
        return {
          totalActivities: 0,
          activitiesByApp: {},
          activitiesByCategory: {},
          activitiesByDay: {},
          averageActivitiesPerDay: 0,
          mostActiveApp: '',
          mostActiveCategory: '',
          unreadCount: 0,
          lastActivityTime: null,
        };
      }

      const activities = await this.getRecentActivities(actualUserId, 1000);

      const stats: ActivityStats = {
        totalActivities: activities.length,
        activitiesByApp: {},
        activitiesByCategory: {},
        activitiesByDay: {},
        averageActivitiesPerDay: 0,
        mostActiveApp: '',
        mostActiveCategory: '',
        unreadCount: 0,
        lastActivityTime: activities[0]?.timestamp?.toDate() || null,
      };

      // Calculate stats
      activities.forEach((activity) => {
        // By app
        stats.activitiesByApp[activity.sourceApp] =
          (stats.activitiesByApp[activity.sourceApp] || 0) + 1;

        // By category
        stats.activitiesByCategory[activity.category] =
          (stats.activitiesByCategory[activity.category] || 0) + 1;

        // By day
        const dateKey = activity.timestamp
          .toDate()
          .toISOString()
          .split('T')[0];
        stats.activitiesByDay[dateKey] =
          (stats.activitiesByDay[dateKey] || 0) + 1;

        // Unread
        if (
          !activity.metadata?.readBy ||
          !activity.metadata.readBy[actualUserId]
        ) {
          stats.unreadCount += 1;
        }
      });

      // Most active
      stats.mostActiveApp = Object.keys(stats.activitiesByApp).sort(
        (a, b) => stats.activitiesByApp[b] - stats.activitiesByApp[a]
      )[0] || '';

      stats.mostActiveCategory = Object.keys(stats.activitiesByCategory).sort(
        (a, b) =>
          stats.activitiesByCategory[b] - stats.activitiesByCategory[a]
      )[0] || '';

      // Average per day
      const daysActive = Object.keys(stats.activitiesByDay).length;
      stats.averageActivitiesPerDay =
        daysActive > 0 ? Math.round(stats.totalActivities / daysActive) : 0;

      return stats;
    } catch (error) {
      console.error('❌ Error fetching activity stats:', error);
      return {
        totalActivities: 0,
        activitiesByApp: {},
        activitiesByCategory: {},
        activitiesByDay: {},
        averageActivitiesPerDay: 0,
        mostActiveApp: '',
        mostActiveCategory: '',
        unreadCount: 0,
        lastActivityTime: null,
      };
    }
  }

  /**
   * Cleanup all listeners and caches
   * 
   * Call this when the app unmounts or user logs out
   */
  cleanup(): void {
    // Unsubscribe from all listeners
    this.realtimeListeners.forEach((unsub) => unsub());
    this.realtimeListeners.clear();

    // Clear caches
    this.activityCache.clear();
    this.lastSyncAttempt.clear();

    console.log('🧹 Ecosystem Activity Service cleaned up');
  }

  /**
   * Get current authenticated user ID
   * @private
   */
  private getCurrentUserId(): string {
    const auth = getAuth();
    return auth.currentUser?.uid || '';
  }

  /**
   * Get device/app source
   * @private
   */
  private getSource(): 'mobile' | 'web' {
    return /mobile|android|iphone/i.test(navigator.userAgent)
      ? 'mobile'
      : 'web';
  }
}

// Export singleton instance
export const activityService = EcosystemActivityService.getInstance();

export default EcosystemActivityService;
