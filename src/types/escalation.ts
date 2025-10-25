/**
 * Phase 3: Escalation Workflows & Incident Dashboard
 * 
 * Core type definitions for intelligent incident escalation,
 * multi-level workflow management, responder assignments,
 * and comprehensive incident tracking across contexts.
 * 
 * Escalation Model:
 * Individual → Family → Community → Professional
 * 
 * Each level has specific roles, permissions, and responsibilities.
 */

// ─────────────────────────────────────────────────────────────────────────
// ESCALATION LEVELS & CONTEXTS
// ─────────────────────────────────────────────────────────────────────────

export enum EscalationLevel {
  INDIVIDUAL = 'individual',      // Personal level (self-management)
  FAMILY = 'family',              // Family level (collective decision-making)
  COMMUNITY = 'community',        // Community/group level (broader support)
  PROFESSIONAL = 'professional'   // Professional level (formal management)
}

export enum EscalationContext {
  HEALTH = 'health',              // Medical incidents, wellness
  SAFETY = 'safety',              // Physical safety, emergencies
  PROPERTY = 'property',          // Asset damage, maintenance
  EMOTIONAL = 'emotional',        // Emotional support, mental health
  FINANCIAL = 'financial',        // Financial decisions, resources
  LEGAL = 'legal',                // Legal matters, compliance
  OTHER = 'other'                 // Other escalation needs
}

export enum EscalationStatus {
  OPEN = 'open',                  // Just logged, not yet processed
  ESCALATED = 'escalated',        // Moved to higher level
  IN_PROGRESS = 'in_progress',    // Being actively handled
  AWAITING_RESPONSE = 'awaiting_response',  // Waiting for action
  ON_HOLD = 'on_hold',            // Temporarily paused
  RESOLVED = 'resolved',          // Closed successfully
  ARCHIVED = 'archived',          // Historical record
  CANCELLED = 'cancelled'         // Closed without resolution
}

export enum SeverityLevel {
  CRITICAL = 'critical',          // Immediate danger/emergency (0-5 min)
  HIGH = 'high',                  // Urgent, requires quick action (5-30 min)
  MEDIUM = 'medium',              // Important, needs attention (30 min - 2 hours)
  LOW = 'low'                      // Can wait, routine handling (2+ hours)
}

export enum ResponderRole {
  FIRST_RESPONDER = 'first_responder',        // Immediate handler
  FAMILY_STEWARD = 'family_steward',          // Family coordinator
  COMMUNITY_LEAD = 'community_lead',          // Community representative
  PROFESSIONAL_HANDLER = 'professional_handler', // Professional responder
  ESCALATION_MANAGER = 'escalation_manager'   // Workflow coordinator
}

// ─────────────────────────────────────────────────────────────────────────
// ESCALATION WORKFLOW INTERFACES
// ─────────────────────────────────────────────────────────────────────────

/**
 * Represents an escalation rule that determines when and how incidents move up levels
 */
export interface EscalationRule {
  id: string;
  context: EscalationContext;
  fromLevel: EscalationLevel;
  toLevel: EscalationLevel;
  severity: SeverityLevel;
  timeoutMinutes: number;          // Auto-escalate if not resolved in X minutes
  conditions: string[];            // Custom conditions for escalation
  notifyRoles: ResponderRole[];     // Roles to notify when escalating
  requiresApproval: boolean;        // Must approve before escalating to next level
  createdAt: Date;
  updatedAt: Date;
  enabled: boolean;
}

/**
 * Represents an individual escalation event - tracks the incident through its lifecycle
 */
export interface EscalationEvent {
  id: string;
  incidentId: string;              // Reference to original incident
  eventId: string;                 // Reference to calendar event
  context: EscalationContext;      // Type of escalation needed
  severity: SeverityLevel;         // Severity at time of escalation
  currentLevel: EscalationLevel;   // Current escalation level
  previousLevel?: EscalationLevel; // What level it came from
  status: EscalationStatus;        // Current workflow status
  
  // Escalation Timeline
  createdAt: Date;
  escalatedAt?: Date;              // When moved to current level
  resolvedAt?: Date;               // When incident resolved
  cancelledAt?: Date;              // When escalation cancelled
  
  // Originator & Ownership
  createdBy: string;               // User who reported/escalated
  currentOwner: string;            // User responsible for current level
  previousOwner?: string;          // User at previous level
  
  // Description & Context
  title: string;
  description: string;
  location?: string;
  
  // Responder Assignments (can have multiple at each level)
  responders: ResponderAssignment[];
  
  // Escalation Details
  escalationReason: string;        // Why it was escalated
  escalationApprovedBy?: string;   // Who approved escalation
  escalationApprovedAt?: Date;
  
  // Resolution
  resolutionNotes?: string;
  resolutionApprovedBy?: string;
  resolutionApprovedAt?: Date;
  
  // Audit & Tracking
  auditTrail: AuditEntry[];
  metadata: Record<string, any>;   // Custom data
}

/**
 * Represents a responder assignment - who's handling this escalation at this level
 */
export interface ResponderAssignment {
  id: string;
  escalationId: string;
  userId: string;
  role: ResponderRole;
  assignedAt: Date;
  assignedBy: string;
  
  // Acknowledgment
  acknowledged: boolean;
  acknowledgedAt?: Date;
  
  // Status Tracking
  status: 'assigned' | 'acknowledged' | 'in_progress' | 'completed' | 'handoff';
  statusUpdatedAt: Date;
  
  // Actions Taken
  actions: ResponderAction[];
  
  // Handoff to Next Level
  handoffTo?: string;              // UserId of next responder
  handoffReason?: string;
  handoffAt?: Date;
}

/**
 * Represents an action taken by a responder during escalation handling
 */
export interface ResponderAction {
  id: string;
  responderAssignmentId: string;
  actionType: 'update' | 'decision' | 'handoff' | 'resolution' | 'communication' | 'note';
  description: string;
  takenBy: string;
  takenAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Audit trail entry for compliance and accountability
 */
export interface AuditEntry {
  id: string;
  escalationId: string;
  action: 'created' | 'escalated' | 'assigned' | 'updated' | 'resolved' | 'cancelled';
  userId: string;
  timestamp: Date;
  level: EscalationLevel;
  changes: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// ─────────────────────────────────────────────────────────────────────────
// INCIDENT TRACKING & METRICS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Aggregated incident metrics for dashboard display
 */
export interface IncidentMetrics {
  totalOpen: number;
  totalByStatus: Record<string, number>;
  totalBySeverity: Record<string, number>;
  totalByContext: Record<string, number>;
  
  // Timing Metrics
  averageResolutionTime: number;   // milliseconds
  averageTimeToFirstResponse: number;
  averageTimeAtEachLevel: Record<EscalationLevel, number>;
  
  // Escalation Metrics
  totalEscalations: number;
  escalationRate: number;          // % of incidents that escalated
  averageEscalationsPerIncident: number;
  
  // Responder Metrics
  totalResponders: number;
  responderPerformance: ResponderPerformance[];
  
  // Trends
  incidentsLast24h: number;
  incidentsLast7d: number;
  incidentsLast30d: number;
  severityTrend: SeverityTrend[];
}

/**
 * Performance tracking for individual responders
 */
export interface ResponderPerformance {
  userId: string;
  userName: string;
  role: ResponderRole;
  
  // Assignment Metrics
  totalAssignments: number;
  completedAssignments: number;
  completionRate: number;
  
  // Response Metrics
  averageResponseTime: number;     // milliseconds
  averageResolutionTime: number;
  
  // Quality Metrics
  escalationHandoffRate: number;   // % of cases where they handed off
  resolutionSuccessRate: number;
  
  // Recent Activity
  lastAssignmentAt?: Date;
  currentlyHandling: number;
}

/**
 * Historical trend data for severity
 */
export interface SeverityTrend {
  date: Date;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

/**
 * Status summary for dashboard overview
 */
export interface EscalationStatusSummary {
  level: EscalationLevel;
  open: number;
  inProgress: number;
  awaitingResponse: number;
  resolved: number;
  avgResolutionTime: number;
}

// ─────────────────────────────────────────────────────────────────────────
// COMPONENT PROP INTERFACES
// ─────────────────────────────────────────────────────────────────────────

export interface IncidentDashboardProps {
  userId: string;
  viewerRole: ResponderRole;
  escalationLevel: EscalationLevel;
  onIncidentSelect: (escalation: EscalationEvent) => void;
  onEscalate: (escalationId: string, toLevel: EscalationLevel) => void;
  refreshInterval?: number;        // Auto-refresh milliseconds
}

export interface EscalationTrackerProps {
  escalation: EscalationEvent;
  userId: string;
  editable: boolean;
  onStatusUpdate: (status: EscalationStatus) => void;
  onResponderUpdate: (assignment: ResponderAssignment) => void;
  onResolve: (notes: string) => void;
}

export interface ResponderAssignmentProps {
  escalation: EscalationEvent;
  currentLevel: EscalationLevel;
  userId: string;
  canAssign: boolean;
  onAssign: (userId: string, role: ResponderRole) => void;
  onAcknowledge: () => void;
  onHandoff: (nextUserId: string, reason: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────
// API REQUEST/RESPONSE TYPES
// ─────────────────────────────────────────────────────────────────────────

export interface CreateEscalationRequest {
  incidentId: string;
  eventId: string;
  context: EscalationContext;
  severity: SeverityLevel;
  title: string;
  description: string;
  location?: string;
  assignToRole?: ResponderRole;
}

export interface EscalateIncidentRequest {
  escalationId: string;
  toLevel: EscalationLevel;
  reason: string;
  assignToUserId?: string;
}

export interface UpdateEscalationStatusRequest {
  escalationId: string;
  status: EscalationStatus;
  notes?: string;
}

export interface AssignResponderRequest {
  escalationId: string;
  userId: string;
  role: ResponderRole;
}

export interface RespondActionRequest {
  assignmentId: string;
  actionType: 'update' | 'decision' | 'handoff' | 'resolution' | 'communication' | 'note';
  description: string;
  metadata?: Record<string, any>;
}

export interface GetIncidentsRequest {
  level?: EscalationLevel;
  status?: EscalationStatus;
  context?: EscalationContext;
  severity?: SeverityLevel;
  limit?: number;
  offset?: number;
}

export interface GetIncidentMetricsRequest {
  timeRange: 'day' | 'week' | 'month' | 'all';
  groupBy?: 'level' | 'context' | 'severity' | 'status';
}

// ─────────────────────────────────────────────────────────────────────────
// UTILITY TYPES
// ─────────────────────────────────────────────────────────────────────────

/**
 * Workflow state for UI coordination
 */
export type EscalationWorkflowState = {
  escalation: EscalationEvent;
  currentUserRole: ResponderRole;
  allowedActions: string[];
  isLoading: boolean;
  error?: string;
};

/**
 * Filter options for dashboard queries
 */
export interface EscalationFilterOptions {
  levels?: EscalationLevel[];
  statuses?: EscalationStatus[];
  contexts?: EscalationContext[];
  severities?: SeverityLevel[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  createdBy?: string;
  currentOwner?: string;
  responderRole?: ResponderRole;
}

/**
 * Sorted/paginated query result
 */
export interface PaginatedEscalations {
  items: EscalationEvent[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type EscalationSubscriptionCallback = (escalation: EscalationEvent) => void;
export type MetricsSubscriptionCallback = (metrics: IncidentMetrics) => void;
