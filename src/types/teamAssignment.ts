/**
 * Phase 4.3: Team Assignment & SLA
 * 
 * Type definitions for intelligent team assignment, SLA tracking,
 * workload management, and team performance metrics.
 */

// ─────────────────────────────────────────────────────────────────────────
// TEAM STRUCTURE & ROLES
// ─────────────────────────────────────────────────────────────────────────

export enum TeamRole {
  TEAM_LEAD = 'team_lead',           // Team manager
  SENIOR_RESPONDER = 'senior_responder', // Experienced handler
  RESPONDER = 'responder',           // Standard responder
  JUNIOR_RESPONDER = 'junior_responder', // Trainee/junior
  SPECIALIST = 'specialist',         // Specialist role (medical, legal, etc.)
}

export enum AssignmentStrategy {
  AUTOMATIC = 'automatic',           // Auto-assign based on availability
  ROUND_ROBIN = 'round_robin',       // Distribute evenly
  LOAD_BALANCED = 'load_balanced',   // Based on current workload
  SKILL_BASED = 'skill_based',       // Match to skills/expertise
  AVAILABILITY = 'availability',     // Assign to next available
  MANUAL = 'manual',                 // Manual assignment
}

export enum SLAStatus {
  NOT_STARTED = 'not_started',       // Assignment pending
  IN_PROGRESS = 'in_progress',       // Within SLA window
  AT_RISK = 'at_risk',               // Approaching deadline
  BREACHED = 'breached',             // SLA violated
  RESOLVED = 'resolved',             // Resolved within SLA
  FAILED = 'failed',                 // Failed SLA
}

// ─────────────────────────────────────────────────────────────────────────
// TEAM MEMBER & WORKLOAD
// ─────────────────────────────────────────────────────────────────────────

/**
 * Team member profile with skills, availability, and workload info
 */
export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: TeamRole;
  
  // Professional Details
  name: string;
  email: string;
  phone?: string;
  title: string;
  department?: string;
  
  // Availability
  isAvailable: boolean;
  availableFrom?: Date;
  availableUntil?: Date;
  timezone?: string;
  workHours?: {
    startTime: string;  // "09:00"
    endTime: string;    // "17:00"
    daysOfWeek: number[]; // 0-6
  };
  
  // Skills & Expertise
  skills: string[];                  // e.g., ["medical", "legal", "technical"]
  expertise: {
    skill: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsExperience: number;
  }[];
  certifications?: string[];
  languages?: string[];
  
  // Performance & Capacity
  maxActiveAssignments: number;      // Max concurrent escalations
  currentAssignmentCount: number;    // Current active assignments
  averageResolutionTime?: number;    // milliseconds
  successRate?: number;              // percentage
  satisfactionScore?: number;        // 0-100
  
  // Management
  managerId?: string;                // Direct supervisor
  trainingStatus?: 'trained' | 'in_training' | 'certified';
  isOnLeave: boolean;
  leaveUntil?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt?: Date;
}

/**
 * Team configuration and settings
 */
export interface Team {
  id: string;
  name: string;
  description?: string;
  
  // Team Composition
  members: string[];                 // User IDs
  leads: string[];                   // Lead user IDs
  
  // Assignment Configuration
  defaultAssignmentStrategy: AssignmentStrategy;
  allowManualOverride: boolean;
  autoEscalateOnTimeout: boolean;
  autoEscalateAfterMinutes: number;
  
  // SLA Settings
  defaultResponseTimeSLA: number;    // milliseconds
  defaultResolutionTimeSLA: number;  // milliseconds
  
  // Workload Management
  maxTeamAssignments: number;
  enableLoadBalancing: boolean;
  enableSkillMatching: boolean;
  
  // Availability
  isActive: boolean;
  timezone?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Team member workload snapshot for real-time availability
 */
export interface MemberWorkload {
  memberId: string;
  teamId: string;
  
  // Current Assignments
  totalActive: number;
  byPriority: {
    critical: number;
    high: number;
    normal: number;
    low: number;
  };
  byContext: {
    [key: string]: number;
  };
  
  // Performance
  avgTimePerAssignment?: number;      // milliseconds
  completionRate: number;             // percentage
  
  // Availability
  currentCapacity: number;            // 0-100 percentage
  canAcceptMore: boolean;
  estimatedAvailableTime?: Date;      // When next slot opens
  
  // Metrics
  tasksCompletedToday: number;
  tasksCompletedThisWeek: number;
  averageResolutionTime?: number;
  
  // Updated
  updatedAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────
// ASSIGNMENT & SLA TRACKING
// ─────────────────────────────────────────────────────────────────────────

/**
 * Auto-assignment configuration for a context/level combination
 */
export interface AssignmentRule {
  id: string;
  name: string;
  description?: string;
  
  // Trigger Conditions
  context?: string;                  // e.g., "health", "safety"
  level?: string;                    // e.g., "family", "community"
  severity?: string;                 // e.g., "critical", "high"
  
  // Assignment Strategy
  strategy: AssignmentStrategy;
  
  // Routing
  teamId?: string;                   // Assign to specific team
  skillsRequired?: string[];          // Required skills
  roleFilter?: TeamRole[];            // Preferred roles
  
  // SLA
  responseSLA: number;               // milliseconds
  resolutionSLA: number;             // milliseconds
  
  // Escalation
  escalateIfUnassignedAfter?: number; // milliseconds
  escalateToTeamId?: string;
  
  // Settings
  enabled: boolean;
  priority: number;                  // Higher = evaluated first
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * SLA configuration for response and resolution times
 */
export interface SLAConfiguration {
  id: string;
  name: string;
  
  // Timing
  responseTimeMinutes: number;       // Time to first response
  resolutionTimeMinutes: number;     // Time to full resolution
  
  // Scope
  applicableContexts: string[];
  applicableSeverities: string[];
  applicableLevels: string[];
  
  // Escalation
  escalateIfBreached: boolean;
  escalateToLevel?: string;
  
  // Notifications
  notifyAt: number[];                // Notify at X% of SLA window
  sendReminderAt?: number;           // Minutes before deadline
  
  // Settings
  enabled: boolean;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SLA tracking for an escalation
 */
export interface SLATracker {
  id: string;
  escalationId: string;
  assignmentId: string;
  
  // SLA Details
  responseDeadline: Date;
  resolutionDeadline: Date;
  
  // Response Tracking
  responseStatus: SLAStatus;
  firstResponseAt?: Date;
  responseTimeMs?: number;
  
  // Resolution Tracking
  resolutionStatus: SLAStatus;
  resolvedAt?: Date;
  resolutionTimeMs?: number;
  
  // Breach Tracking
  breached: boolean;
  breachType?: 'response' | 'resolution' | 'both';
  breachedAt?: Date;
  breachReasons?: string[];
  
  // Escalation
  escalatedDueToSLA: boolean;
  escalatedAt?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────
// TEAM PERFORMANCE & METRICS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Team performance metrics
 */
export interface TeamPerformance {
  teamId: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  
  // Volume Metrics
  totalAssignments: number;
  totalCompleted: number;
  totalOpen: number;
  completionRate: number;            // percentage
  
  // SLA Metrics
  slaMet: number;
  slaBreached: number;
  slaComplianceRate: number;         // percentage
  
  // Timing Metrics
  averageResponseTime: number;       // milliseconds
  medianResponseTime: number;
  averageResolutionTime: number;     // milliseconds
  medianResolutionTime: number;
  
  // Quality Metrics
  satisfactionScore: number;         // 0-100
  rework: number;                    // tasks needing rework
  reworkRate: number;                // percentage
  
  // Context Breakdown
  byContext: {
    [key: string]: {
      count: number;
      completed: number;
      slaMet: number;
      avgTime: number;
    };
  };
  
  // Member Performance
  topPerformers: {
    memberId: string;
    assignments: number;
    completed: number;
    avgTime: number;
  }[];
  
  // Updated
  calculatedAt: Date;
}

/**
 * Individual member performance metrics
 */
export interface MemberPerformance {
  memberId: string;
  teamId: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  
  // Volume
  totalAssignments: number;
  totalCompleted: number;
  completionRate: number;
  
  // SLA
  slaMet: number;
  slaBreached: number;
  slaComplianceRate: number;
  
  // Timing
  averageResponseTime: number;
  averageResolutionTime: number;
  
  // Quality
  satisfactionScore: number;
  reworkCount: number;
  
  // Context Performance
  byContext: {
    [key: string]: {
      count: number;
      avgTime: number;
      satisfaction: number;
    };
  };
  
  // Skills Usage
  skillsUsed: {
    [skill: string]: {
      usageCount: number;
      effectiveness: number; // 0-100
    };
  };
  
  // Trends
  trend: 'improving' | 'stable' | 'declining';
  trendPercentage: number;
  
  // Updated
  calculatedAt: Date;
}

/**
 * Assignment history for audit and analytics
 */
export interface AssignmentHistory {
  id: string;
  escalationId: string;
  
  assignments: {
    memberId: string;
    assignedAt: Date;
    unassignedAt?: Date;
    reason: 'auto' | 'manual' | 'escalation' | 'rotation';
    duration?: number; // milliseconds
    outcome: 'completed' | 'escalated' | 'transferred' | 'failed';
    satisfactionScore?: number;
  }[];
  
  // Summary
  totalAssignments: number;
  totalDuration: number;
  averageDuration: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS & ALERTS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Assignment notification preferences
 */
export interface AssignmentNotificationPreferences {
  userId: string;
  
  // New Assignment
  notifyOnAssignment: boolean;
  assignmentChannels: string[]; // channels to use
  
  // SLA Warnings
  notifyOnSLAWarning: boolean;
  slaWarningThreshold: number; // percentage of time remaining
  
  // SLA Breach
  notifyOnSLABreach: boolean;
  breachChannels: string[];
  
  // Escalation
  notifyOnEscalation: boolean;
  
  // Daily Summary
  sendDailySummary: boolean;
  summaryTime: string; // "09:00" format
  
  // Preferences
  quietHours?: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────
// WORKLOAD BALANCING
// ─────────────────────────────────────────────────────────────────────────

/**
 * Workload balancing configuration
 */
export interface LoadBalancingConfig {
  id: string;
  teamId: string;
  
  // Strategy
  enabled: boolean;
  algorithm: 'round_robin' | 'least_loaded' | 'skill_matched';
  
  // Thresholds
  maxAssignmentsPerMember: number;
  maxLoadPercentage: number; // 0-100
  minConcurrentCapacity: number; // minimum spare capacity to maintain
  
  // Rebalancing
  autoRebalance: boolean;
  rebalanceInterval?: number; // minutes
  
  // Settings
  considerSkills: boolean;
  considerExperience: boolean;
  considerAvailability: boolean;
  preferTeamLead: boolean; // assign to team lead first if available
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Load balancing snapshot for optimization
 */
export interface LoadBalancingSnapshot {
  teamId: string;
  timestamp: Date;
  
  // Overall Load
  totalAssignments: number;
  averageLoadPerMember: number;
  loadDistribution: 'balanced' | 'somewhat_balanced' | 'imbalanced' | 'severely_imbalanced';
  
  // Member Loads
  members: {
    memberId: string;
    currentAssignments: number;
    capacity: number;
    loadPercentage: number;
    isOverloaded: boolean;
  }[];
  
  // Recommendations
  recommendations: {
    type: 'reassign' | 'escalate' | 'defer';
    from: string; // memberId
    to?: string; // memberId
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}
