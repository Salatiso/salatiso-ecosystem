/**
 * @file escalationNotificationTrigger.ts
 * @description Connects escalation events to notification delivery service
 * 
 * Triggers notifications for:
 * - ESCALATION_CREATED - when new escalation is created
 * - ESCALATION_ASSIGNED - when escalation is assigned to responder
 * - ESCALATION_ESCALATED - when escalation moves to higher level
 * - ESCALATION_RESOLVED - when escalation is resolved
 */

import { notificationDeliveryService } from '@/services/notificationDeliveryService';
import { 
  NotificationType, 
  NotificationPriority, 
  NotificationChannel 
} from '@/types/notifications';

/**
 * Event types that trigger notifications
 */
export enum EscalationEventType {
  CREATED = 'escalation.created',
  ASSIGNED = 'escalation.assigned',
  ESCALATED = 'escalation.escalated',
  RESOLVED = 'escalation.resolved',
}

/**
 * Escalation event data passed to trigger functions
 */
export interface EscalationEvent {
  escalationId: string;
  escalationTitle: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  currentLevel: string;
  createdBy: string;
  assignedTo?: string[];
  reason?: string;
  timestamp: Date;
}

/**
 * Map severity to notification priority
 */
function mapSeverityToPriority(severity: string): NotificationPriority {
  switch (severity) {
    case 'critical':
      return NotificationPriority.CRITICAL;
    case 'high':
      return NotificationPriority.HIGH;
    case 'medium':
      return NotificationPriority.NORMAL;
    default:
      return NotificationPriority.LOW;
  }
}

/**
 * Trigger notification when escalation is created
 */
export async function triggerEscalationCreatedNotification(event: EscalationEvent): Promise<void> {
  try {
    const priority = mapSeverityToPriority(event.severity);
    
    await notificationDeliveryService.sendNotification({
      userId: event.createdBy,
      type: NotificationType.ESCALATION_CREATED,
      priority,
      title: `Escalation Created: ${event.escalationTitle}`,
      message: `New ${event.severity} severity escalation at ${event.currentLevel} level`,
      body: `New ${event.severity} severity escalation at ${event.currentLevel} level`, // Add body field
      data: {
        escalationId: event.escalationId,
        actionUrl: `/intranet/escalations/${event.escalationId}`,
      },
      channels: [NotificationChannel.WEB, NotificationChannel.EMAIL],
      createdAt: new Date(),
    });

    console.log(`✓ Escalation created notification sent for ${event.escalationId}`);
  } catch (error) {
    console.error('Error sending escalation created notification:', error);
  }
}

/**
 * Trigger notification when escalation is assigned
 */
export async function triggerEscalationAssignedNotification(event: EscalationEvent): Promise<void> {
  try {
    if (!event.assignedTo || event.assignedTo.length === 0) {
      return;
    }

    const priority = mapSeverityToPriority(event.severity);

    // Send notification to each assigned responder
    for (const responderId of event.assignedTo) {
      await notificationDeliveryService.sendNotification({
        userId: responderId,
        type: NotificationType.ESCALATION_ASSIGNED,
        priority,
        title: `Escalation Assigned: ${event.escalationTitle}`,
        message: `You have been assigned to handle this ${event.severity} severity escalation`,
        data: {
          escalationId: event.escalationId,
          responderUserId: responderId,
          actionUrl: `/intranet/escalations/${event.escalationId}`,
        },
        channels: [NotificationChannel.WEB, NotificationChannel.PUSH, NotificationChannel.SMS],
        createdAt: new Date(),
      });
    }

    console.log(`✓ Escalation assigned notification sent to ${event.assignedTo.length} responders for ${event.escalationId}`);
  } catch (error) {
    console.error('Error sending escalation assigned notification:', error);
  }
}

/**
 * Trigger notification when escalation moves to higher level
 */
export async function triggerEscalationEscalatedNotification(event: EscalationEvent): Promise<void> {
  try {
    const priority = mapSeverityToPriority(event.severity);
    
    // Notify escalation manager/supervisor
    await notificationDeliveryService.sendNotification({
      userId: event.createdBy,
      type: NotificationType.ESCALATION_ESCALATED,
      priority,
      title: `Escalation Escalated: ${event.escalationTitle}`,
      message: `Escalation has been escalated to ${event.currentLevel} level. ${event.reason ? `Reason: ${event.reason}` : ''}`,
      data: {
        escalationId: event.escalationId,
        actionUrl: `/intranet/escalations/${event.escalationId}`,
      },
      channels: [NotificationChannel.WEB, NotificationChannel.EMAIL, NotificationChannel.PUSH],
      createdAt: new Date(),
    });

    console.log(`✓ Escalation escalated notification sent for ${event.escalationId}`);
  } catch (error) {
    console.error('Error sending escalation escalated notification:', error);
  }
}

/**
 * Trigger notification when escalation is resolved
 */
export async function triggerEscalationResolvedNotification(event: EscalationEvent): Promise<void> {
  try {
    await notificationDeliveryService.sendNotification({
      userId: event.createdBy,
      type: NotificationType.ESCALATION_RESOLVED,
      priority: NotificationPriority.NORMAL,
      title: `Escalation Resolved: ${event.escalationTitle}`,
      message: `The escalation has been successfully resolved`,
      data: {
        escalationId: event.escalationId,
        actionUrl: `/intranet/escalations/${event.escalationId}`,
      },
      channels: [NotificationChannel.WEB, NotificationChannel.EMAIL],
      createdAt: new Date(),
    });

    console.log(`✓ Escalation resolved notification sent for ${event.escalationId}`);
  } catch (error) {
    console.error('Error sending escalation resolved notification:', error);
  }
}

/**
 * Main trigger function - routes to appropriate handler
 */
export async function triggerEscalationNotification(
  eventType: EscalationEventType,
  event: EscalationEvent
): Promise<void> {
  switch (eventType) {
    case EscalationEventType.CREATED:
      await triggerEscalationCreatedNotification(event);
      break;
    case EscalationEventType.ASSIGNED:
      await triggerEscalationAssignedNotification(event);
      break;
    case EscalationEventType.ESCALATED:
      await triggerEscalationEscalatedNotification(event);
      break;
    case EscalationEventType.RESOLVED:
      await triggerEscalationResolvedNotification(event);
      break;
    default:
      console.warn(`Unknown escalation event type: ${eventType}`);
  }
}
