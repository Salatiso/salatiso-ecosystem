/**
 * @file NotificationManagementService.ts - Sprint 4B Implementation
 * @description Core notification management with CRUD, filtering, and real-time updates
 * 
 * Features:
 * - Create/read/update/delete notifications
 * - Filter by type/priority/read status
 * - Real-time subscriptions for unread count
 * - Pagination support
 * - Event-linked notifications
 * - Archive old notifications
 * 
 * @author Salatiso Ecosystem - Sprint 4B Notifications Hub
 * @created October 25, 2025
 */

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  writeBatch,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ApiResponse } from '@/types/calendar';

// ============================================================================
// TYPES
// ============================================================================

export type NotificationType = 'critical' | 'reminder' | 'digest' | 'activity' | 'mention' | 'system';

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  data?: Record<string, any>;
  read: boolean;
  readAt?: Timestamp;
  createdAt: Timestamp;
  expiresAt?: Timestamp;
  relatedEventId?: string;
  relatedUserId?: string;
  archived?: boolean;
}

export interface CreateNotificationInput {
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  data?: Record<string, any>;
  expiresIn?: number;
  relatedEventId?: string;
  relatedUserId?: string;
}

export interface UpdateNotificationInput {
  read?: boolean;
  archived?: boolean;
  priority?: NotificationPriority;
}

export interface NotificationFilters {
  type?: NotificationType;
  priority?: NotificationPriority;
  read?: boolean;
  archived?: boolean;
}

export interface PaginationOptions {
  pageSize?: number;
  pageNumber?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// SERVICE
// ============================================================================

class NotificationManagementService {
  private readonly collectionName = 'notifications';

  /**
   * Create a new notification
   */
  async createNotification(
    userId: string,
    input: CreateNotificationInput
  ): Promise<ApiResponse<Notification>> {
    try {
      const now = Timestamp.now();

      const notificationData = {
        userId,
        type: input.type,
        priority: input.priority || NotificationPriority.MEDIUM,
        title: input.title,
        message: input.message,
        actionUrl: input.actionUrl || null,
        actionLabel: input.actionLabel || null,
        data: input.data || {},
        read: false,
        createdAt: now,
        expiresAt: input.expiresIn
          ? Timestamp.fromDate(new Date(now.toDate().getTime() + input.expiresIn * 3600000))
          : null,
        relatedEventId: input.relatedEventId || null,
        relatedUserId: input.relatedUserId || null,
        archived: false,
      };

      const docRef = await addDoc(collection(db, this.collectionName), notificationData);

      return {
        success: true,
        data: {
          id: docRef.id,
          ...notificationData,
        } as Notification,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[NotificationManagementService] Create error:', error);
      return {
        success: false,
        error: `Failed to create notification: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get a single notification by ID
   */
  async getNotification(userId: string, notificationId: string): Promise<ApiResponse<Notification>> {
    try {
      const docRef = doc(db, this.collectionName, notificationId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Notification not found',
          timestamp: new Date(),
        };
      }

      const notification = { id: docSnap.id, ...docSnap.data() } as Notification;

      if (notification.userId !== userId) {
        return {
          success: false,
          error: 'Access denied',
          timestamp: new Date(),
        };
      }

      return {
        success: true,
        data: notification,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[NotificationManagementService] Get error:', error);
      return {
        success: false,
        error: `Failed to get notification: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Update a notification
   */
  async updateNotification(
    userId: string,
    notificationId: string,
    updates: UpdateNotificationInput
  ): Promise<ApiResponse<Notification>> {
    try {
      const getResult = await this.getNotification(userId, notificationId);
      if (!getResult.success) {
        return getResult;
      }

      const docRef = doc(db, this.collectionName, notificationId);
      const updateData: any = { ...updates };

      if (updates.read === true) {
        updateData.readAt = Timestamp.now();
      }

      await updateDoc(docRef, updateData);

      const updated = await this.getNotification(userId, notificationId);
      return updated;
    } catch (error: any) {
      console.error('[NotificationManagementService] Update error:', error);
      return {
        success: false,
        error: `Failed to update notification: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(userId: string, notificationId: string): Promise<ApiResponse<void>> {
    try {
      const getResult = await this.getNotification(userId, notificationId);
      if (!getResult.success) {
        return {
          success: false,
          error: 'Notification not found',
          timestamp: new Date(),
        };
      }

      await deleteDoc(doc(db, this.collectionName, notificationId));
      return {
        success: true,
        data: null,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[NotificationManagementService] Delete error:', error);
      return {
        success: false,
        error: `Failed to delete notification: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(userId: string, notificationId: string): Promise<ApiResponse<void>> {
    try {
      const docRef = doc(db, this.collectionName, notificationId);
      await updateDoc(docRef, {
        read: true,
        readAt: Timestamp.now(),
      });
      return {
        success: true,
        data: null,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[NotificationManagementService] Mark as read error:', error);
      return {
        success: false,
        error: `Failed to mark as read: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Mark a notification as unread
   */
  async markAsUnread(userId: string, notificationId: string): Promise<ApiResponse<void>> {
    try {
      const docRef = doc(db, this.collectionName, notificationId);
      await updateDoc(docRef, {
        read: false,
        readAt: null,
      });
      return {
        success: true,
        data: null,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[NotificationManagementService] Mark as unread error:', error);
      return {
        success: false,
        error: `Failed to mark as unread: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<ApiResponse<void>> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('read', '==', false)
      );

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.docs.forEach((docSnap) => {
        batch.update(docSnap.ref, {
          read: true,
          readAt: Timestamp.now(),
        });
      });

      await batch.commit();
      return {
        success: true,
        data: null,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[NotificationManagementService] Mark all as read error:', error);
      return {
        success: false,
        error: `Failed to mark all as read: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get paginated notifications with filters
   */
  async getNotifications(
    userId: string,
    filters: NotificationFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<ApiResponse<PaginatedResult<Notification>>> {
    try {
      const pageSize = pagination.pageSize || 10;
      const pageNumber = pagination.pageNumber || 1;
      const pageOffset = (pageNumber - 1) * pageSize;

      const conditions = [where('userId', '==', userId)];

      if (filters.type) {
        conditions.push(where('type', '==', filters.type));
      }
      if (filters.priority) {
        conditions.push(where('priority', '==', filters.priority));
      }
      if (filters.read !== undefined) {
        conditions.push(where('read', '==', filters.read));
      }
      if (filters.archived !== undefined) {
        conditions.push(where('archived', '==', filters.archived));
      }

      const q = query(
        collection(db, this.collectionName),
        ...conditions,
        orderBy('createdAt', 'desc'),
        limit(pageSize * 5)
      );

      const querySnapshot = await getDocs(q);
      const allNotifications = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Notification));
      const total = allNotifications.length;

      const items = allNotifications.slice(pageOffset, pageOffset + pageSize);

      const result: PaginatedResult<Notification> = {
        items,
        total,
        page: pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };

      return {
        success: true,
        data: result,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[NotificationManagementService] Get notifications error:', error);
      return {
        success: false,
        error: `Failed to get notifications: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get count of unread notifications
   */
  async getUnreadCount(userId: string): Promise<ApiResponse<number>> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('read', '==', false)
      );

      const querySnapshot = await getDocs(q);
      return {
        success: true,
        data: querySnapshot.size,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[NotificationManagementService] Get unread count error:', error);
      return {
        success: false,
        error: `Failed to get unread count: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get notifications by type
   */
  async getNotificationsByType(userId: string, type: NotificationType): Promise<ApiResponse<Notification[]>> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('type', '==', type),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Notification));

      return {
        success: true,
        data: notifications,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[NotificationManagementService] Get by type error:', error);
      return {
        success: false,
        error: `Failed to get notifications by type: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Subscribe to real-time notification updates
   */
  subscribeToNotifications(
    userId: string,
    onUpdate: (notifications: Notification[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const notifications = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Notification));
        onUpdate(notifications);
      },
      (error) => {
        if (onError) onError(error);
        console.error('[NotificationManagementService] Subscription error:', error);
      }
    );

    return unsubscribe;
  }

  /**
   * Subscribe to unread count changes
   */
  subscribeToUnreadCount(
    userId: string,
    onUpdate: (count: number) => void,
    onError?: (error: Error) => void
  ): () => void {
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        onUpdate(querySnapshot.size);
      },
      (error) => {
        if (onError) onError(error);
        console.error('[NotificationManagementService] Unread count subscription error:', error);
      }
    );

    return unsubscribe;
  }

  /**
   * Delete notifications older than specified days
   */
  async deleteOlderThan(userId: string, days: number): Promise<ApiResponse<void>> {
    try {
      const cutoffDate = Timestamp.fromDate(new Date(Date.now() - days * 24 * 60 * 60 * 1000));

      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('createdAt', '<', cutoffDate)
      );

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });

      await batch.commit();
      return {
        success: true,
        data: null,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[NotificationManagementService] Delete old error:', error);
      return {
        success: false,
        error: `Failed to delete old notifications: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Archive multiple notifications
   */
  async archiveNotifications(userId: string, notificationIds: string[]): Promise<ApiResponse<void>> {
    try {
      const batch = writeBatch(db);

      for (const notificationId of notificationIds) {
        const docRef = doc(db, this.collectionName, notificationId);
        batch.update(docRef, { archived: true });
      }

      await batch.commit();
      return {
        success: true,
        data: null,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[NotificationManagementService] Archive error:', error);
      return {
        success: false,
        error: `Failed to archive notifications: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get notifications for a related event
   */
  async getNotificationsForEvent(eventId: string): Promise<ApiResponse<Notification[]>> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('relatedEventId', '==', eventId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Notification));

      return {
        success: true,
        data: notifications,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[NotificationManagementService] Get for event error:', error);
      return {
        success: false,
        error: `Failed to get event notifications: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Delete all notifications for a related event
   */
  async deleteNotificationsForEvent(eventId: string): Promise<ApiResponse<void>> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('relatedEventId', '==', eventId)
      );

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });

      await batch.commit();
      return {
        success: true,
        data: null,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[NotificationManagementService] Delete for event error:', error);
      return {
        success: false,
        error: `Failed to delete event notifications: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }
}

export const notificationManagementService = new NotificationManagementService();
export default notificationManagementService;
