/**
 * @file ReminderService.ts - Sprint 4A Implementation
 * @description Service for managing event reminders and notifications
 * 
 * Features:
 * - Create/read/update/delete reminders
 * - Multiple reminders per event (15 min, 1 hour, 1 day, custom)
 * - Subscribe to due reminders for real-time notifications
 * - Track notification status
 * - Query overdue reminders
 * 
 * @author Salatiso Ecosystem - Sprint 4A Calendar Enhancements
 * @created October 25, 2025
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ApiResponse } from '@/types/calendar';

/**
 * Reminder configuration in minutes before event
 * Standard preset times and custom support
 */
export type ReminderMinutes = 15 | 60 | 360 | 1440 | 10080 | number;

/**
 * Reminder interface - represents a scheduled reminder
 */
export interface Reminder {
  id: string;
  eventId: string;
  userId: string;
  minutesBefore: ReminderMinutes;
  notificationSent: boolean;
  notificationSentAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Input for creating a reminder
 */
export interface CreateReminderInput {
  eventId: string;
  minutesBefore: ReminderMinutes;
}

/**
 * Input for updating a reminder
 */
export interface UpdateReminderInput {
  minutesBefore?: ReminderMinutes;
  notificationSent?: boolean;
}

/**
 * Reminder convenience presets
 */
export const REMINDER_PRESETS = {
  AT_TIME: 0,
  FIFTEEN_MINUTES_BEFORE: 15,
  ONE_HOUR_BEFORE: 60,
  SIX_HOURS_BEFORE: 360,
  ONE_DAY_BEFORE: 1440,
  ONE_WEEK_BEFORE: 10080,
} as const;

/**
 * ReminderService - Manages event reminders
 */
export class ReminderService {
  private db = db;
  private remindersCollection = 'reminders';

  /**
   * Create a new reminder for an event
   */
  async createReminder(
    userId: string,
    input: CreateReminderInput
  ): Promise<ApiResponse<Reminder>> {
    try {
      // Verify event exists and user has access
      const eventRef = doc(this.db, 'events', input.eventId);
      const eventDoc = await getDoc(eventRef);
      
      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }

      const eventData = eventDoc.data();
      if (eventData.userId !== userId && !eventData.roles?.some((r: any) => r.memberId === userId)) {
        throw new Error('Access denied');
      }

      // Create reminder
      const reminderData = {
        eventId: input.eventId,
        userId,
        minutesBefore: input.minutesBefore,
        notificationSent: false,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      };

      const docRef = await addDoc(
        collection(this.db, this.remindersCollection),
        reminderData
      );

      console.log(`[ReminderService] Reminder created: ${docRef.id}`);

      return {
        success: true,
        data: {
          id: docRef.id,
          ...reminderData,
        } as Reminder,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[ReminderService] Create error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create reminder',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get all reminders for an event
   */
  async getReminders(
    userId: string,
    eventId: string
  ): Promise<ApiResponse<Reminder[]>> {
    try {
      const q = query(
        collection(this.db, this.remindersCollection),
        where('eventId', '==', eventId),
        where('userId', '==', userId),
        orderBy('minutesBefore', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const reminders: Reminder[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Reminder));

      return {
        success: true,
        data: reminders,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[ReminderService] Get reminders error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch reminders',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Update a reminder
   */
  async updateReminder(
    userId: string,
    reminderId: string,
    updates: UpdateReminderInput
  ): Promise<ApiResponse<Reminder>> {
    try {
      const reminderRef = doc(this.db, this.remindersCollection, reminderId);
      const reminderDoc = await getDoc(reminderRef);

      if (!reminderDoc.exists()) {
        throw new Error('Reminder not found');
      }

      const reminderData = reminderDoc.data();
      if (reminderData.userId !== userId) {
        throw new Error('Access denied');
      }

      const updateData = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      await updateDoc(reminderRef, updateData);

      console.log(`[ReminderService] Reminder updated: ${reminderId}`);

      return {
        success: true,
        data: {
          ...reminderData,
          ...updateData,
          id: reminderId,
        } as Reminder,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[ReminderService] Update error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update reminder',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Delete a reminder
   */
  async deleteReminder(
    userId: string,
    reminderId: string
  ): Promise<ApiResponse<void>> {
    try {
      const reminderRef = doc(this.db, this.remindersCollection, reminderId);
      const reminderDoc = await getDoc(reminderRef);

      if (!reminderDoc.exists()) {
        throw new Error('Reminder not found');
      }

      const reminderData = reminderDoc.data();
      if (reminderData.userId !== userId) {
        throw new Error('Access denied');
      }

      await deleteDoc(reminderRef);

      console.log(`[ReminderService] Reminder deleted: ${reminderId}`);

      return {
        success: true,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[ReminderService] Delete error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete reminder',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Subscribe to reminders that are due (need notification)
   * Returns only reminders that haven't been notified yet
   */
  subscribeToReminders(
    userId: string,
    onUpdate: (reminders: Reminder[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    try {
      const q = query(
        collection(this.db, this.remindersCollection),
        where('userId', '==', userId),
        where('notificationSent', '==', false),
        orderBy('minutesBefore', 'asc')
      );

      const unsubscribe = onSnapshot(
        q,
        snapshot => {
          const reminders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          } as Reminder));

          onUpdate(reminders);
        },
        error => {
          console.error('[ReminderService] Subscription error:', error);
          onError?.(error as Error);
        }
      );

      console.log(`[ReminderService] Subscribed to reminders for user: ${userId}`);

      return unsubscribe;
    } catch (error: any) {
      console.error('[ReminderService] Subscribe error:', error);
      onError?.(error);
      return () => {};
    }
  }

  /**
   * Mark a reminder as notified
   */
  async markAsNotified(
    userId: string,
    reminderId: string
  ): Promise<ApiResponse<void>> {
    try {
      const reminderRef = doc(this.db, this.remindersCollection, reminderId);
      const reminderDoc = await getDoc(reminderRef);

      if (!reminderDoc.exists()) {
        throw new Error('Reminder not found');
      }

      const reminderData = reminderDoc.data();
      if (reminderData.userId !== userId) {
        throw new Error('Access denied');
      }

      await updateDoc(reminderRef, {
        notificationSent: true,
        notificationSentAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      });

      console.log(`[ReminderService] Reminder marked as notified: ${reminderId}`);

      return {
        success: true,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[ReminderService] Mark as notified error:', error);
      return {
        success: false,
        error: error.message || 'Failed to mark reminder as notified',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get overdue reminders (not yet notified)
   */
  async getOverdueReminders(userId: string): Promise<ApiResponse<Reminder[]>> {
    try {
      const q = query(
        collection(this.db, this.remindersCollection),
        where('userId', '==', userId),
        where('notificationSent', '==', false)
      );

      const querySnapshot = await getDocs(q);
      const reminders: Reminder[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Reminder));

      // Filter to only overdue reminders
      // This would need event times to properly filter
      // For now return all unsent

      return {
        success: true,
        data: reminders,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[ReminderService] Get overdue error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch overdue reminders',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Delete all reminders for an event (when event is deleted)
   */
  async deleteRemindersByEvent(
    userId: string,
    eventId: string
  ): Promise<ApiResponse<void>> {
    try {
      const q = query(
        collection(this.db, this.remindersCollection),
        where('eventId', '==', eventId),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      
      for (const docSnapshot of querySnapshot.docs) {
        await deleteDoc(doc(this.db, this.remindersCollection, docSnapshot.id));
      }

      console.log(
        `[ReminderService] Deleted ${querySnapshot.size} reminders for event: ${eventId}`
      );

      return {
        success: true,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[ReminderService] Delete by event error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete reminders',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Format reminder time for display
   */
  static formatReminderTime(minutes: ReminderMinutes): string {
    if (minutes === 0) return 'At time of event';
    if (minutes === 15) return '15 minutes before';
    if (minutes === 60) return '1 hour before';
    if (minutes === 360) return '6 hours before';
    if (minutes === 1440) return '1 day before';
    if (minutes === 10080) return '1 week before';
    
    if (minutes < 60) return `${minutes} minutes before`;
    if (minutes < 1440) return `${Math.round(minutes / 60)} hours before`;
    return `${Math.round(minutes / 1440)} days before`;
  }

  /**
   * Calculate reminder trigger time
   */
  static calculateReminderTriggerTime(eventTime: Date, minutesBefore: ReminderMinutes): Date {
    return new Date(eventTime.getTime() - minutesBefore * 60 * 1000);
  }
}

// Export singleton instance
const reminderService = new ReminderService();
export default reminderService;
