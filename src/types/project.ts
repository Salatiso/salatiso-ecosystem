/**
 * Project Management Types
 * Comprehensive type definitions for project planning, tracking, and notifications
 */

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // User ID or name
  status: 'not-started' | 'in-progress' | 'blocked' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date | null;
  completedDate: Date | null;
  completedBy?: string;
  notes: TaskNote[];
  subtasks: SubTask[];
  dependencies: string[]; // Task IDs that must be completed first
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  changeHistory: TaskChange[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  completedDate: Date | null;
  completedBy?: string;
}

export interface TaskNote {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TaskChange {
  id: string;
  changedBy: string;
  changedAt: Date;
  field: string;
  oldValue: any;
  newValue: any;
  notifiedUsers: string[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completedDate: Date | null;
  tasks: string[]; // Task IDs associated with this milestone
  deliverables: string[];
  status: 'upcoming' | 'in-progress' | 'completed' | 'overdue';
}

export interface ProjectDeliverable {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'registration' | 'approval' | 'payment' | 'other';
  status: 'pending' | 'in-progress' | 'submitted' | 'approved' | 'completed';
  dueDate: Date | null;
  completedDate: Date | null;
  relatedTasks: string[];
  attachments: string[];
  changeHistory: TaskChange[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: 'task-due' | 'milestone' | 'meeting' | 'deadline' | 'reminder';
  date: Date;
  endDate?: Date;
  allDay: boolean;
  relatedTaskId?: string;
  relatedMilestoneId?: string;
  notifyBefore: number; // Minutes before event to notify
  notified: boolean;
  attendees: string[];
  location?: string;
}

export interface Notification {
  id: string;
  type: 'task-assigned' | 'task-completed' | 'task-overdue' | 'task-changed' | 'milestone-approaching' | 'deliverable-due';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  userId: string;
  relatedEntityId: string;
  relatedEntityType: 'task' | 'milestone' | 'deliverable' | 'event';
  createdAt: Date;
  actionUrl?: string;
}

export interface ProjectPlan {
  id: string;
  title: string;
  description: string;
  owner: string;
  team: string[];
  startDate: Date;
  targetEndDate: Date;
  actualEndDate: Date | null;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  milestones: ProjectMilestone[];
  tasks: ProjectTask[];
  deliverables: ProjectDeliverable[];
  events: CalendarEvent[];
  progress: number; // 0-100
}
