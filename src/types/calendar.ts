/**
 * @file Calendar Types - Extended for Activity & Incident Management
 * @description Comprehensive TypeScript interfaces for the enhanced calendar system
 * supporting planned activities, incidents, role assignment, voting, and escalation
 * 
 * BACKWARD COMPATIBILITY: All new fields are optional. Existing calendar events
 * continue to work without modification.
 * 
 * @author Salatiso Ecosystem
 * @created October 22, 2025
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Context levels for events and incidents
 * Individual → Family → Community → Professional
 */
export enum ContextLevel {
  INDIVIDUAL = 'individual',
  FAMILY = 'family',
  COMMUNITY = 'community',
  PROFESSIONAL = 'professional'
}

/**
 * Event type classification
 */
export enum EventType {
  ACTIVITY = 'activity',      // Planned: meetings, celebrations, projects
  INCIDENT = 'incident'       // Unplanned: emergencies, problems, safety events
}

/**
 * Activity categories
 */
export enum ActivityCategory {
  MEETING = 'meeting',
  CELEBRATION = 'celebration',
  PROJECT = 'project',
  WELLNESS = 'wellness',
  FAMILY_TIME = 'family_time',
  COMMUNITY_EVENT = 'community_event',
  OTHER = 'other'
}

/**
 * Incident categories
 */
export enum IncidentCategory {
  HEALTH = 'health',
  SAFETY = 'safety',
  PROPERTY = 'property',
  EMOTIONAL_SUPPORT = 'emotional_support',
  OTHER = 'other'
}

/**
 * Severity levels (for incidents)
 */
export enum SeverityLevel {
  CRITICAL = 'critical',      // Requires immediate professional response
  HIGH = 'high',              // Requires family escalation
  MEDIUM = 'medium',          // Requires family attention
  LOW = 'low'                 // Informational/monitoring
}

/**
 * Event/Incident status lifecycle
 */
export enum EventStatus {
  PLANNED = 'planned',           // Activity scheduled (not yet happened)
  OPEN = 'open',                 // Incident reported, awaiting response
  IN_PROGRESS = 'in_progress',  // Activity happening or incident being handled
  RESOLVED = 'resolved',         // Incident resolved or activity completed
  ARCHIVED = 'archived'          // Closed and stored for history
}

/**
 * Role types in an event
 */
export enum RoleType {
  ORGANIZER = 'organizer',      // Plans and coordinates
  PARTICIPANT = 'participant',  // Attends and contributes
  SUPPORTER = 'supporter',      // Provides help/resources
  STEWARD = 'steward'           // Oversees execution/safety
}

/**
 * Role response status
 */
export enum RoleStatus {
  ASSIGNED = 'assigned',        // Role offered to user
  ACCEPTED = 'accepted',        // User accepted role
  DECLINED = 'declined',        // User declined role
  COMPLETED = 'completed'       // User fulfilled role
}

/**
 * Permissions in the system
 */
export enum Permission {
  VIEW = 'view',                // Can see event/incident
  EDIT = 'edit',                // Can modify event/incident
  RESPOND = 'respond',          // Can accept/decline role or response
  ESCALATE = 'escalate',        // Can escalate incident
  ASSIGN_ROLES = 'assign_roles', // Can assign roles to others
  APPROVE = 'approve',          // Can approve decisions/actions
  RESOLVE = 'resolve',          // Can mark as resolved
  REPORT = 'report',            // Can generate reports
  ARCHIVE = 'archive'           // Can archive completed items
}

/**
 * Assistance request types
 */
export enum AssistanceType {
  LOGISTICS = 'logistics',      // Setup, transportation, materials
  SETUP = 'setup',              // Decoration, preparation
  SUPPORT = 'support',          // Emotional, physical assistance
  SKILLS = 'skills',            // Expertise needed (cooking, music, etc.)
  RESOURCES = 'resources',      // Equipment, supplies
  OTHER = 'other'
}

/**
 * Assistance response status
 */
export enum AssistanceStatus {
  REQUESTED = 'requested',      // Help needed
  OFFERED = 'offered',          // Someone offered help
  ACCEPTED = 'accepted',        // Help was accepted
  IN_PROGRESS = 'in_progress',  // Help being provided
  COMPLETED = 'completed',      // Help provided, task done
  DECLINED = 'declined'         // Help declined
}

/**
 * Polling/Voting types
 */
export enum PollType {
  SINGLE_CHOICE = 'single_choice',    // Only one answer
  MULTIPLE_CHOICE = 'multiple_choice', // Multiple answers allowed
  RANKING = 'ranking'                  // Order options by preference
}

/**
 * Poll status
 */
export enum PollStatus {
  OPEN = 'open',               // Voting in progress
  CLOSED = 'closed',           // Voting ended
  ARCHIVED = 'archived'        // Historical data
}

/**
 * Escalation action types
 */
export enum EscalationAction {
  LOG = 'log',                 // Initial incident logging
  NOTIFY_FAMILY = 'notify_family',     // Escalate to family level
  NOTIFY_COMMUNITY = 'notify_community', // Escalate to community
  NOTIFY_PROFESSIONAL = 'notify_professional', // Escalate to authorities/professionals
  AUTO_ESCALATE = 'auto_escalate',    // Automatic escalation due to severity
  MANUAL_ESCALATE = 'manual_escalate' // User requested escalation
}

/**
 * Audit action types
 */
export enum AuditAction {
  CREATED = 'created',
  UPDATED = 'updated',
  ASSIGNED_ROLE = 'assigned_role',
  RESPONDED_ROLE = 'responded_role',
  REQUESTED_ASSISTANCE = 'requested_assistance',
  OFFERED_ASSISTANCE = 'offered_assistance',
  CREATED_POLL = 'created_poll',
  VOTED = 'voted',
  LOGGED_INCIDENT = 'logged_incident',
  ESCALATED = 'escalated',
  RESOLVED = 'resolved',
  ARCHIVED = 'archived',
  COMMENTED = 'commented'
}

// ============================================================================
// CORE INTERFACES
// ============================================================================

/**
 * Role assignment for an event
 * Links a user to a role with specific permissions
 */
export interface EventRole {
  id: string;                           // Unique role assignment ID
  eventId: string;                      // Event this role belongs to
  userId: string;                       // User assigned to role
  role: RoleType;                       // What role they play
  permissions: Permission[];            // What they can do
  status: RoleStatus;                   // Have they accepted?
  assignedAt: Date;                     // When role was assigned
  acceptedAt?: Date;                    // When they accepted (null if declined)
  completedAt?: Date;                   // When they completed the role
  notes?: string;                       // Special instructions or notes
}

/**
 * Assistance request - when someone needs help
 */
export interface AssistanceRequest {
  id: string;                           // Unique request ID
  eventId: string;                      // Associated event
  requestedBy: string;                  // User ID who needs help
  requestedAt: Date;                    // When help was requested
  description: string;                  // What kind of help needed
  type: AssistanceType;                 // Category of help
  priority: 'critical' | 'high' | 'medium' | 'low';
  requiredBy?: Date;                    // Deadline for help
  responses: AssistanceResponse[];      // People responding to request
  status: AssistanceStatus;             // Current status
  completedAt?: Date;                   // When help provided
  completedBy?: string;                 // Who provided help
  notes?: string;                       // Resolution notes
}

/**
 * Someone's response to an assistance request
 */
export interface AssistanceResponse {
  userId: string;                       // Who is responding
  respondedAt: Date;                    // When they responded
  status: 'offered' | 'accepted' | 'declined'; // Their response
  comment?: string;                     // What they said (e.g., "I can help until 3pm")
  timeAvailable?: {
    start: Date;
    end: Date;
  };
  skills?: string[];                    // Skills they're offering
}

/**
 * Polling/Voting option
 */
export interface PollOption {
  id: string;                           // Unique option ID
  text: string;                         // What the option says
  order?: number;                       // For ranking polls
  voteCount?: number;                   // How many votes (computed)
}

/**
 * A single vote cast by a user
 */
export interface Vote {
  userId: string;                       // Who voted
  choice: string | string[];            // Their choice(s) - string for single, array for multiple
  rank?: number;                        // For ranking polls
  timestamp: Date;                      // When they voted
  anonymous?: boolean;                  // Is this vote anonymous?
}

/**
 * Poll/Voting interface - for decisions like "when should we have the party?"
 */
export interface Poll {
  id: string;                           // Unique poll ID
  eventId: string;                      // Associated event
  question: string;                     // What are we voting on?
  description?: string;                 // More details
  type: PollType;                       // Single/multiple/ranking
  options: PollOption[];                // Available choices
  votes: Vote[];                        // All votes cast
  deadline: Date;                       // When voting ends
  anonymous: boolean;                   // Are votes hidden?
  status: PollStatus;                   // Open/closed/archived
  createdBy: string;                    // Who created the poll
  createdAt: Date;                      // When created
  results?: {
    winner?: string;                    // Most popular option (for single choice)
    totalVotes: number;
    participation: number;              // % of participants who voted
  };
}

/**
 * Comment on an event or incident
 */
export interface EventComment {
  id: string;                           // Unique comment ID
  eventId: string;                      // Event being commented on
  userId: string;                       // Who commented
  text: string;                         // Comment content
  timestamp: Date;                      // When commented
  edited?: Date;                        // When last edited
  replies?: EventComment[];             // Nested replies
  reactions?: {
    emoji: string;                      // 👍 💬 ❤️ etc.
    userIds: string[];
  }[];
}

/**
 * Escalation entry - tracks incident escalation history
 */
export interface EscalationEntry {
  id: string;                           // Unique escalation ID
  eventId: string;                      // Which incident
  fromLevel: ContextLevel;              // Where escalated from
  toLevel: ContextLevel;                // Where escalated to
  reason: string;                       // Why escalated
  action: EscalationAction;             // What action triggered escalation
  escalatedBy: string;                  // Who escalated
  escalatedAt: Date;                    // When escalated
  assignedTo?: string[];                // Responders at new level
  resolved?: boolean;                   // Was it resolved at this level?
  resolutionDetails?: string;           // How it was resolved
}

/**
 * Audit trail entry - logs all important actions
 */
export interface AuditTrailEntry {
  id: string;                           // Unique audit entry ID
  eventId: string;                      // Event being audited
  userId: string;                       // Who did the action
  action: AuditAction;                  // What action
  context: ContextLevel;                // In which context
  timestamp: Date;                      // When it happened
  details: Record<string, any>;         // Additional details
  ipAddress?: string;                   // For security tracking
  userAgent?: string;                   // Browser/app info
}

/**
 * Notification triggered by calendar events
 */
export interface CalendarNotification {
  id: string;                           // Unique notification ID
  eventId: string;                      // Related event
  userId: string;                       // Who to notify
  type: 'event_created' | 'incident_logged' | 'role_assigned' | 
        'assistance_requested' | 'poll_created' | 'escalated' |
        'incident_resolved' | 'role_reminder' | 'poll_deadline';
  title: string;                        // Notification title
  message: string;                      // Notification message
  context: ContextLevel;                // Severity context
  priority: 'low' | 'medium' | 'high' | 'critical'; // Urgency
  actionUrl?: string;                   // Where to click to respond
  createdAt: Date;                      // When notification created
  deliveredAt?: Date;                   // When it reached user
  readAt?: Date;                        // When user read it
  channels: ('push' | 'email' | 'mesh')[];  // How to send it
}

/**
 * Incident tracking data (for events of type INCIDENT)
 */
export interface IncidentData {
  // Classification
  category: IncidentCategory;           // Health/safety/property/etc
  severity: SeverityLevel;              // How serious
  
  // Details
  description: string;                  // What happened
  location?: string;                    // Where it happened
  injuries?: string;                    // Any injuries (health incidents)
  damageDescription?: string;           // Property damage (property incidents)
  
  // Response
  firstResponder?: string;              // User ID of first person to respond
  assignedResponders?: string[];        // Team assigned to handle
  responseTime?: number;                // Minutes until first response
  
  // Resolution
  resolutionNotes?: string;             // How it was resolved
  resolvedAt?: Date;                    // When resolved
  resolvedBy?: string;                  // User who marked resolved
  followUpRequired?: boolean;            // Does this need follow-up?
  followUpNotes?: string;               // What follow-up is needed
  
  // Escalation
  escalationPath: EscalationEntry[];    // History of escalations
  currentLevel: ContextLevel;           // Where it currently sits
  
  // Reports
  linkedReports?: string[];             // Report IDs (for compliance)
  complianceRequired?: boolean;         // OSHA/legal reporting needed?
  reportingDue?: Date;                  // When must be reported
}

/**
 * Activity tracking data (for events of type ACTIVITY)
 */
export interface ActivityData {
  // Classification
  category: ActivityCategory;           // Meeting/celebration/project/etc
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval: number;                   // Every X days/weeks/months
    endDate?: Date;                     // When does recurrence end
  };
  
  // Execution
  expectedDuration?: number;            // Minutes expected to take
  actualDuration?: number;              // How long it actually took
  attendanceCount?: number;             // How many actually attended
  participationRate?: number;           // % of assigned roles who participated
  
  // Outcomes
  successRating?: number;               // 1-5 star rating
  successNotes?: string;                // What went well/poorly
  lessonsLearned?: string[];            // What we learned
}

/**
 * THE MAIN EVENT TYPE - Enhanced Calendar Event
 * 
 * BACKWARD COMPATIBILITY: This extends the existing event type.
 * All new fields are optional, so existing events continue to work.
 */
export interface EnhancedCalendarEvent {
  // === EXISTING FIELDS (UNCHANGED FOR BACKWARD COMPATIBILITY) ===
  id: string;                           // Unique event ID (Firebase doc ID)
  title: string;                        // Event title
  description?: string;                 // Event description
  dateTime: Date;                       // When event occurs/occurred
  location?: string;                    // Where event occurs
  
  // === NEW: CLASSIFICATION ===
  type: EventType;                      // Activity or Incident
  category: ActivityCategory | IncidentCategory; // Specific category
  
  // === NEW: CONTEXT & SCOPE ===
  context: ContextLevel;                // Individual/Family/Community/Professional
  visibility: ContextLevel[];           // Who can see this (multi-level)
  
  // === NEW: ROLE MANAGEMENT ===
  roles: EventRole[];                   // Assigned roles
  organizer: string;                    // Primary organizer user ID
  
  // === NEW: INCIDENT SPECIFIC ===
  incidentData?: IncidentData;          // If type === INCIDENT
  
  // === NEW: ACTIVITY SPECIFIC ===
  activityData?: ActivityData;          // If type === ACTIVITY
  
  // === NEW: COLLABORATION ===
  assistanceRequests: AssistanceRequest[]; // Help requests
  polls: Poll[];                        // Voting/decisions
  comments: EventComment[];             // Discussion thread
  
  // === NEW: STATUS LIFECYCLE ===
  status: EventStatus;                  // Planned/Open/In Progress/Resolved/Archived
  statusHistory: {
    from: EventStatus;
    to: EventStatus;
    changedBy: string;
    changedAt: Date;
    reason?: string;
  }[];
  
  // === NEW: RESOLUTION ===
  resolutionNotes?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  
  // === NEW: GOVERNANCE & COMPLIANCE ===
  escalationPath: EscalationEntry[];    // History of escalations
  auditTrail: AuditTrailEntry[];        // Complete action history
  
  // === NEW: PERSISTENCE ===
  tags?: string[];                      // For filtering/organizing
  linkedEvents?: string[];              // Related event IDs
  attachments?: {
    url: string;
    name: string;
    type: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];
  
  // === FIREBASE SYNC FIELDS ===
  createdAt: Date;                      // When created
  updatedAt: Date;                      // Last modification
  createdBy: string;                    // Who created
  lastModifiedBy: string;               // Who last modified
  
  // === OPTIONAL EXTENSIONS ===
  customData?: Record<string, any>;     // App-specific data
}

// ============================================================================
// ROLE PERMISSION MAPPINGS (Constants)
// ============================================================================

/**
 * Define what permissions each role has
 * Used for authorization checks throughout the app
 */
export const ROLE_PERMISSIONS: Record<RoleType, Permission[]> = {
  [RoleType.ORGANIZER]: [
    Permission.VIEW,
    Permission.EDIT,
    Permission.RESPOND,
    Permission.ESCALATE,
    Permission.ASSIGN_ROLES,
    Permission.APPROVE,
    Permission.RESOLVE,
    Permission.REPORT,
    Permission.ARCHIVE
  ],
  [RoleType.PARTICIPANT]: [
    Permission.VIEW,
    Permission.RESPOND
  ],
  [RoleType.SUPPORTER]: [
    Permission.VIEW,
    Permission.RESPOND
  ],
  [RoleType.STEWARD]: [
    Permission.VIEW,
    Permission.EDIT,
    Permission.RESPOND,
    Permission.ESCALATE,
    Permission.ASSIGN_ROLES,
    Permission.APPROVE,
    Permission.RESOLVE,
    Permission.REPORT,
    Permission.ARCHIVE
  ]
};

/**
 * Auto-escalation rules based on severity and incident type
 * If severity level triggers, automatically escalate to this context level
 */
export const AUTO_ESCALATION_RULES = {
  [SeverityLevel.CRITICAL]: {
    escalateTo: ContextLevel.PROFESSIONAL,
    notifyDelay: 0  // Immediate
  },
  [SeverityLevel.HIGH]: {
    escalateTo: ContextLevel.COMMUNITY,
    notifyDelay: 5  // 5 minutes
  },
  [SeverityLevel.MEDIUM]: {
    escalateTo: ContextLevel.FAMILY,
    notifyDelay: 15 // 15 minutes
  },
  [SeverityLevel.LOW]: {
    escalateTo: ContextLevel.INDIVIDUAL,
    notifyDelay: 60 // 1 hour
  }
};

// ============================================================================
// TYPE GUARDS & UTILITIES
// ============================================================================

/**
 * Check if event is an incident
 */
export function isIncident(event: EnhancedCalendarEvent): boolean {
  return event.type === EventType.INCIDENT;
}

/**
 * Check if event is an activity
 */
export function isActivity(event: EnhancedCalendarEvent): boolean {
  return event.type === EventType.ACTIVITY;
}

/**
 * Check if user has permission to perform action
 */
export function userHasPermission(
  event: EnhancedCalendarEvent,
  userId: string,
  requiredPermission: Permission
): boolean {
  const userRole = event.roles.find(r => r.userId === userId);
  if (!userRole) return false;
  return userRole.permissions.includes(requiredPermission);
}

/**
 * Check if incident should auto-escalate
 */
export function shouldAutoEscalate(
  severity: SeverityLevel,
  currentLevel: ContextLevel
): boolean {
  const rule = AUTO_ESCALATION_RULES[severity];
  if (!rule) return false;
  
  const levels = [
    ContextLevel.INDIVIDUAL,
    ContextLevel.FAMILY,
    ContextLevel.COMMUNITY,
    ContextLevel.PROFESSIONAL
  ];
  
  const currentIndex = levels.indexOf(currentLevel);
  const targetIndex = levels.indexOf(rule.escalateTo);
  
  return targetIndex > currentIndex;
}

/**
 * Get the next escalation level
 */
export function getNextEscalationLevel(current: ContextLevel): ContextLevel | null {
  const levels = [
    ContextLevel.INDIVIDUAL,
    ContextLevel.FAMILY,
    ContextLevel.COMMUNITY,
    ContextLevel.PROFESSIONAL
  ];
  
  const currentIndex = levels.indexOf(current);
  if (currentIndex === -1 || currentIndex === levels.length - 1) {
    return null;
  }
  
  return levels[currentIndex + 1];
}

/**
 * Create a minimal valid event (for backward compatibility)
 */
export function createMinimalEvent(
  title: string,
  dateTime: Date,
  userId: string
): EnhancedCalendarEvent {
  return {
    id: `event_${Date.now()}`,
    title,
    dateTime,
    type: EventType.ACTIVITY,
    category: ActivityCategory.OTHER,
    context: ContextLevel.INDIVIDUAL,
    visibility: [ContextLevel.INDIVIDUAL],
    organizer: userId,
    roles: [{
      id: `role_${Date.now()}`,
      eventId: `event_${Date.now()}`,
      userId,
      role: RoleType.ORGANIZER,
      permissions: ROLE_PERMISSIONS[RoleType.ORGANIZER],
      status: RoleStatus.ACCEPTED,
      assignedAt: new Date()
    }],
    assistanceRequests: [],
    polls: [],
    comments: [],
    status: EventStatus.PLANNED,
    statusHistory: [],
    escalationPath: [],
    auditTrail: [{
      id: `audit_${Date.now()}`,
      eventId: `event_${Date.now()}`,
      userId,
      action: AuditAction.CREATED,
      context: ContextLevel.INDIVIDUAL,
      timestamp: new Date(),
      details: { reason: 'Event created' }
    }],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
    lastModifiedBy: userId
  };
}

// ============================================================================
// API INPUT TYPES (For form submissions and service calls)
// ============================================================================

/**
 * Input type for creating a new event
 */
export interface CreateEventInput {
  title: string;
  description?: string;
  type: EventType;
  category: ActivityCategory | IncidentCategory;
  context: ContextLevel;
  visibility?: ContextLevel[];
  dateTime?: Date;
  endDateTime?: Date;
  location?: string;
  
  // For incidents
  severity?: SeverityLevel;
  injuries?: string;
  damageDescription?: string;
  
  // For activities
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval: number;
    endDate?: Date;
  };
  
  // Collaboration
  initialRoles?: Omit<EventRole, 'id' | 'eventId'>[];
  tags?: string[];
}

/**
 * Input type for updating an event
 */
export interface UpdateEventInput {
  id: string;
  title?: string;
  description?: string;
  category?: ActivityCategory | IncidentCategory;
  dateTime?: Date;
  location?: string;
  status?: EventStatus;
  resolutionNotes?: string;
  tags?: string[];
  customData?: Record<string, any>;
}

/**
 * Input type for creating a poll
 */
export interface CreatePollInput {
  eventId: string;
  question: string;
  description?: string;
  type: PollType;
  options: string[];
  deadline: Date;
  anonymous?: boolean;
}

/**
 * Input type for voting on a poll
 */
export interface VotePollInput {
  pollId: string;
  userId: string;
  choice: string | string[];
  anonymous?: boolean;
}

/**
 * Input type for creating an assistance request
 */
export interface CreateAssistanceRequestInput {
  eventId: string;
  type: AssistanceType;
  description: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  requiredBy?: Date;
  targetAudience?: string;
}

/**
 * Input type for creating an incident
 */
export interface CreateIncidentInput extends CreateEventInput {
  type: EventType.INCIDENT;
  category: IncidentCategory;
  severity: SeverityLevel;
  firstResponder?: string;
}

/**
 * Input type for assigning a role
 */
export interface AssignRoleInput {
  eventId: string;
  userId: string;
  role: RoleType;
  permissions?: Permission[];
  notes?: string;
}

/**
 * Input type for responding to a role assignment
 */
export interface RoleResponseInput {
  roleId: string;
  status: 'accepted' | 'declined';
  notes?: string;
}

// ============================================================================
// QUERY & FILTER TYPES
// ============================================================================

/**
 * Filter options for querying events
 */
export interface EventFilters {
  userId?: string;
  type?: EventType;
  category?: (ActivityCategory | IncidentCategory)[];
  context?: ContextLevel[];
  status?: EventStatus[];
  severity?: SeverityLevel[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  searchText?: string;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  pageSize: number;
  page: number;
  sortBy?: 'dateTime' | 'createdAt' | 'updatedAt' | 'status';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated query result
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ============================================================================
// SYNC & CACHE TYPES
// ============================================================================

/**
 * User's sync preferences across contexts
 */
export interface UserSyncSettings {
  userId: string;
  contexts: ContextLevel[];
  syncStrategy: 'real-time' | 'polling' | 'on-demand';
  pollInterval?: number; // milliseconds
  offlineQueueEnabled: boolean;
  meshSyncEnabled: boolean;
  autoSyncIncidents: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Log entry for sync operations
 */
export interface SyncLogEntry {
  id: string;
  userId: string;
  eventId: string;
  action: 'sync_initiated' | 'sync_completed' | 'sync_failed' | 'conflict_detected' | 'conflict_resolved';
  source: 'firestore' | 'local' | 'mesh';
  timestamp: Date;
  details?: Record<string, any>;
  error?: string;
}

/**
 * Conflict detection result
 */
export interface ConflictDetection {
  eventId: string;
  conflictType: 'version_mismatch' | 'concurrent_edit' | 'delete_update';
  localVersion: EnhancedCalendarEvent;
  remoteVersion: EnhancedCalendarEvent;
  resolutionStrategy: 'local' | 'remote' | 'merge' | 'manual';
  resolvedAt?: Date;
  resolvedBy?: string;
}

// ============================================================================
// SERVICE RESPONSE TYPES
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: Date;
}

/**
 * Error response with details
 */
export interface ErrorResponse extends ApiResponse<null> {
  success: false;
  error: string;
  code: string;
  details?: Record<string, any>;
  retryable: boolean;
}

/**
 * Batch operation result
 */
export interface BatchOperationResult {
  totalRequested: number;
  successful: number;
  failed: number;
  errors: Array<{
    itemId: string;
    error: string;
  }>;
  timestamp: Date;
}

export default EnhancedCalendarEvent;
