/**
 * Phase 3: Incident Escalation Service (Rewrite)
 * 
 * Complete backend service for managing incident escalation workflows.
 * Handles escalation logic, responder assignments, audit trails,
 * and real-time status tracking.
 * 
 * Features:
 * - Create and manage escalations
 * - Track escalations through workflow states
 * - Assign and manage responders at each level
 * - Generate comprehensive audit trails
 * - Real-time status monitoring
 * - Metric calculation and reporting
 */

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  onSnapshot,
  FieldValue,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  QueryConstraint,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import {
  EscalationEvent,
  EscalationStatus,
  EscalationLevel,
  EscalationContext,
  SeverityLevel,
  ResponderRole,
  ResponderAssignment,
  ResponderAction,
  AuditEntry,
  CreateEscalationRequest,
  EscalateIncidentRequest,
  UpdateEscalationStatusRequest,
  AssignResponderRequest,
  RespondActionRequest,
  GetIncidentsRequest,
  GetIncidentMetricsRequest,
  IncidentMetrics,
  EscalationRule,
} from '@/types/escalation';

// ─────────────────────────────────────────────────────────────────────────
// ESCALATION CREATION & INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────

/**
 * Create a new escalation event for an incident
 */
export async function createEscalation(
  request: CreateEscalationRequest,
  userId: string
): Promise<EscalationEvent> {
  const escalationRef = doc(collection(db, 'escalations'));
  
  const escalation: EscalationEvent = {
    id: escalationRef.id,
    incidentId: request.incidentId,
    eventId: request.eventId,
    context: request.context,
    severity: request.severity,
    currentLevel: EscalationLevel.INDIVIDUAL,
    status: EscalationStatus.OPEN,
    createdBy: userId,
    currentOwner: userId,
    title: request.title,
    description: request.description,
    location: request.location,
    escalationReason: '', // Will be set when escalating
    responders: [],
    auditTrail: [],
    metadata: {},
    createdAt: new Date(),
  };

  // Add initial audit entry
  const auditEntry: AuditEntry = {
    id: `audit_${Date.now()}`,
    escalationId: escalation.id,
    action: 'created',
    userId,
    timestamp: new Date(),
    level: EscalationLevel.INDIVIDUAL,
    changes: {
      title: request.title,
      context: request.context,
      severity: request.severity,
    },
  };

  escalation.auditTrail.push(auditEntry);

  // If requested, assign initial responder
  if (request.assignToRole) {
    const assignment: ResponderAssignment = {
      id: `responder_${Date.now()}`,
      escalationId: escalation.id,
      userId,
      role: request.assignToRole,
      assignedAt: new Date(),
      assignedBy: userId,
      acknowledged: false,
      status: 'assigned',
      statusUpdatedAt: new Date(),
      actions: [],
    };
    escalation.responders.push(assignment);
  }

  // Save to Firestore
  await setDoc(escalationRef, {
    ...escalation,
    createdAt: serverTimestamp(),
    auditTrail: escalation.auditTrail.map((entry) => ({
      ...entry,
      timestamp: entry.timestamp.toISOString(),
    })),
    responders: escalation.responders.map((r) => ({
      ...r,
      assignedAt: r.assignedAt.toISOString(),
      statusUpdatedAt: r.statusUpdatedAt.toISOString(),
    })),
  });

  return escalation;
}

// ─────────────────────────────────────────────────────────────────────────
// ESCALATION RETRIEVAL & QUERYING
// ─────────────────────────────────────────────────────────────────────────

/**
 * Get escalation by ID
 */
export async function getEscalationById(escalationId: string): Promise<EscalationEvent | null> {
  const docRef = doc(db, 'escalations', escalationId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docSnap.data() as EscalationEvent;
}

/**
 * Get escalations for a specific incident
 */
export async function getEscalationsByIncidentId(
  incidentId: string
): Promise<EscalationEvent[]> {
  const q = query(
    collection(db, 'escalations'),
    where('incidentId', '==', incidentId),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);
}

/**
 * Get open escalations at a specific level
 */
export async function getOpenEscalationsByLevel(
  level: EscalationLevel,
  context?: EscalationContext
): Promise<EscalationEvent[]> {
  const constraints: QueryConstraint[] = [
    where('currentLevel', '==', level),
    where('status', '!=', EscalationStatus.RESOLVED),
    where('status', '!=', EscalationStatus.ARCHIVED),
    orderBy('severity', 'desc'),
    orderBy('createdAt', 'asc'),
  ];

  if (context) {
    constraints.push(where('context', '==', context));
  }

  const q = query(collection(db, 'escalations'), ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);
}

/**
 * Get escalations assigned to a specific user
 */
export async function getUserAssignedEscalations(
  userId: string,
  status?: EscalationStatus
): Promise<EscalationEvent[]> {
  const constraints: QueryConstraint[] = [
    where('responders', 'array-contains-any', [{ userId }]),
    orderBy('createdAt', 'desc'),
  ];

  if (status) {
    constraints.push(where('status', '==', status));
  }

  const q = query(collection(db, 'escalations'), ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);
}

/**
 * Get escalations created by a user
 */
export async function getCreatedEscalations(userId: string): Promise<EscalationEvent[]> {
  const q = query(
    collection(db, 'escalations'),
    where('createdBy', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);
}

// ─────────────────────────────────────────────────────────────────────────
// ESCALATION STATUS MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────

/**
 * Update escalation status
 */
export async function updateEscalationStatus(
  escalationId: string,
  request: UpdateEscalationStatusRequest,
  userId: string
): Promise<void> {
  const escalationRef = doc(db, 'escalations', escalationId);
  const batch = writeBatch(db);

  // Update main escalation
  batch.update(escalationRef, {
    status: request.status,
  });

  // Add audit entry
  const auditRef = doc(collection(db, 'escalations', escalationId, 'audit_trail'));
  batch.set(auditRef, {
    id: auditRef.id,
    escalationId,
    action: 'updated',
    userId,
    timestamp: serverTimestamp(),
    level: (await getEscalationById(escalationId))?.currentLevel,
    changes: {
      status: request.status,
      notes: request.notes,
    },
  });

  // If resolving, set resolution details
  if (request.status === EscalationStatus.RESOLVED) {
    batch.update(escalationRef, {
      resolvedAt: serverTimestamp(),
      resolutionNotes: request.notes || '',
      resolutionApprovedBy: userId,
      resolutionApprovedAt: serverTimestamp(),
    });
  }

  await batch.commit();
}

/**
 * Escalate incident to next level
 */
export async function escalateToNextLevel(
  escalationId: string,
  request: EscalateIncidentRequest,
  userId: string
): Promise<void> {
  const escalationRef = doc(db, 'escalations', escalationId);
  const escalation = await getEscalationById(escalationId);

  if (!escalation) {
    throw new Error('Escalation not found');
  }

  // Determine next level
  const currentLevel = escalation.currentLevel;
  const nextLevel = getNextEscalationLevel(currentLevel);

  if (!nextLevel) {
    throw new Error('Cannot escalate beyond professional level');
  }

  const batch = writeBatch(db);

  // Update escalation
  batch.update(escalationRef, {
    currentLevel: nextLevel,
    previousLevel: currentLevel,
    status: EscalationStatus.ESCALATED,
    escalatedAt: serverTimestamp(),
    currentOwner: request.assignToUserId || userId,
  });

  // Add audit entry
  const auditRef = doc(collection(db, 'escalations', escalationId, 'audit_trail'));
  batch.set(auditRef, {
    id: auditRef.id,
    escalationId,
    action: 'escalated',
    userId,
    timestamp: serverTimestamp(),
    level: nextLevel,
    changes: {
      fromLevel: currentLevel,
      toLevel: nextLevel,
      reason: request.reason,
      approvedBy: userId,
    },
  });

  // If assigning to new user, create assignment
  if (request.assignToUserId) {
    const responderRef = doc(collection(db, 'escalations', escalationId, 'responders'));
    batch.set(responderRef, {
      id: responderRef.id,
      escalationId,
      userId: request.assignToUserId,
      role: getRoleForLevel(nextLevel),
      assignedAt: serverTimestamp(),
      assignedBy: userId,
      acknowledged: false,
      status: 'assigned',
      statusUpdatedAt: serverTimestamp(),
      actions: [],
    });
  }

  await batch.commit();
}

// ─────────────────────────────────────────────────────────────────────────
// RESPONDER MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────

/**
 * Assign responder to escalation
 */
export async function assignResponder(
  escalationId: string,
  request: AssignResponderRequest,
  userId: string
): Promise<ResponderAssignment> {
  const responderRef = doc(collection(db, 'escalations', escalationId, 'responders'));

  const assignment: ResponderAssignment = {
    id: responderRef.id,
    escalationId,
    userId: request.userId,
    role: request.role,
    assignedAt: new Date(),
    assignedBy: userId,
    acknowledged: false,
    status: 'assigned',
    statusUpdatedAt: new Date(),
    actions: [],
  };

  const batch = writeBatch(db);

  // Save assignment
  batch.set(responderRef, {
    ...assignment,
    assignedAt: serverTimestamp(),
    statusUpdatedAt: serverTimestamp(),
  });

  // Add audit entry
  const auditRef = doc(collection(db, 'escalations', escalationId, 'audit_trail'));
  batch.set(auditRef, {
    id: auditRef.id,
    escalationId,
    action: 'assigned',
    userId,
    timestamp: serverTimestamp(),
    level: (await getEscalationById(escalationId))?.currentLevel,
    changes: {
      assignedUserId: request.userId,
      role: request.role,
      assignedBy: userId,
    },
  });

  await batch.commit();
  return assignment;
}

/**
 * Acknowledge assignment (responder confirms receipt)
 */
export async function acknowledgeAssignment(
  escalationId: string,
  assignmentId: string,
  userId: string
): Promise<void> {
  const assignmentRef = doc(db, 'escalations', escalationId, 'responders', assignmentId);

  const batch = writeBatch(db);

  // Update assignment
  batch.update(assignmentRef, {
    acknowledged: true,
    acknowledgedAt: serverTimestamp(),
    status: 'acknowledged',
    statusUpdatedAt: serverTimestamp(),
  });

  // Add audit entry
  const auditRef = doc(collection(db, 'escalations', escalationId, 'audit_trail'));
  batch.set(auditRef, {
    id: auditRef.id,
    escalationId,
    action: 'assigned',
    userId,
    timestamp: serverTimestamp(),
    changes: {
      assignmentAcknowledged: true,
      assignmentId,
    },
  });

  await batch.commit();
}

/**
 * Update responder assignment status
 */
export async function updateResponderStatus(
  escalationId: string,
  assignmentId: string,
  newStatus: string,
  userId: string
): Promise<void> {
  const assignmentRef = doc(db, 'escalations', escalationId, 'responders', assignmentId);

  const batch = writeBatch(db);

  batch.update(assignmentRef, {
    status: newStatus,
    statusUpdatedAt: serverTimestamp(),
  });

  // Log action
  const actionRef = doc(
    collection(db, 'escalations', escalationId, 'responders', assignmentId, 'actions')
  );
  batch.set(actionRef, {
    id: actionRef.id,
    responderAssignmentId: assignmentId,
    actionType: 'update',
    description: `Status changed to ${newStatus}`,
    takenBy: userId,
    takenAt: serverTimestamp(),
  });

  await batch.commit();
}

/**
 * Handoff escalation to next responder
 */
export async function handoffEscalation(
  escalationId: string,
  assignmentId: string,
  nextUserId: string,
  reason: string,
  userId: string
): Promise<void> {
  const assignmentRef = doc(db, 'escalations', escalationId, 'responders', assignmentId);
  const escalationRef = doc(db, 'escalations', escalationId);

  const batch = writeBatch(db);

  // Update current assignment
  batch.update(assignmentRef, {
    status: 'handoff',
    handoffTo: nextUserId,
    handoffReason: reason,
    handoffAt: serverTimestamp(),
    statusUpdatedAt: serverTimestamp(),
  });

  // Update escalation owner
  batch.update(escalationRef, {
    currentOwner: nextUserId,
    previousOwner: userId,
  });

  // Log action
  const actionRef = doc(
    collection(db, 'escalations', escalationId, 'responders', assignmentId, 'actions')
  );
  batch.set(actionRef, {
    id: actionRef.id,
    responderAssignmentId: assignmentId,
    actionType: 'handoff',
    description: `Handed off to ${nextUserId}: ${reason}`,
    takenBy: userId,
    takenAt: serverTimestamp(),
  });

  await batch.commit();
}

// ─────────────────────────────────────────────────────────────────────────
// RESPONDER ACTIONS & NOTES
// ─────────────────────────────────────────────────────────────────────────

/**
 * Log responder action
 */
export async function logResponderAction(
  escalationId: string,
  assignmentId: string,
  request: RespondActionRequest,
  userId: string
): Promise<ResponderAction> {
  const actionRef = doc(
    collection(db, 'escalations', escalationId, 'responders', assignmentId, 'actions')
  );

  const action: ResponderAction = {
    id: actionRef.id,
    responderAssignmentId: assignmentId,
    actionType: request.actionType,
    description: request.description,
    takenBy: userId,
    takenAt: new Date(),
    metadata: request.metadata,
  };

  await setDoc(actionRef, {
    ...action,
    takenAt: serverTimestamp(),
  });

  return action;
}

/**
 * Get all actions for a responder assignment
 */
export async function getResponderActions(
  escalationId: string,
  assignmentId: string
): Promise<ResponderAction[]> {
  const q = query(
    collection(db, 'escalations', escalationId, 'responders', assignmentId, 'actions'),
    orderBy('takenAt', 'asc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as ResponderAction);
}

// ─────────────────────────────────────────────────────────────────────────
// AUDIT TRAIL MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────

/**
 * Get audit trail for escalation
 */
export async function getAuditTrail(escalationId: string): Promise<AuditEntry[]> {
  const q = query(
    collection(db, 'escalations', escalationId, 'audit_trail'),
    orderBy('timestamp', 'asc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as AuditEntry);
}

// ─────────────────────────────────────────────────────────────────────────
// METRICS & REPORTING
// ─────────────────────────────────────────────────────────────────────────

/**
 * Get incident metrics
 */
export async function getIncidentMetrics(
  request: GetIncidentMetricsRequest
): Promise<IncidentMetrics> {
  // Calculate time range
  const endDate = new Date();
  const startDate = new Date();

  if (request.timeRange === 'day') {
    startDate.setDate(startDate.getDate() - 1);
  } else if (request.timeRange === 'week') {
    startDate.setDate(startDate.getDate() - 7);
  } else if (request.timeRange === 'month') {
    startDate.setMonth(startDate.getMonth() - 1);
  } else {
    startDate.setFullYear(1970);
  }

  // Get all escalations in range
  const q = query(
    collection(db, 'escalations'),
    where('createdAt', '>=', startDate),
    where('createdAt', '<=', endDate)
  );

  const querySnapshot = await getDocs(q);
  const escalations = querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);

  // Calculate metrics
  const metrics: IncidentMetrics = {
    totalOpen: escalations.filter((e) => e.status !== EscalationStatus.RESOLVED).length,
    totalByStatus: {},
    totalBySeverity: {},
    totalByContext: {},
    averageResolutionTime: 0,
    averageTimeToFirstResponse: 0,
    averageTimeAtEachLevel: {
      [EscalationLevel.INDIVIDUAL]: 0,
      [EscalationLevel.FAMILY]: 0,
      [EscalationLevel.COMMUNITY]: 0,
      [EscalationLevel.PROFESSIONAL]: 0,
    },
    totalEscalations: escalations.length,
    escalationRate: 0,
    averageEscalationsPerIncident: 0,
    totalResponders: 0,
    responderPerformance: [],
    incidentsLast24h: 0,
    incidentsLast7d: 0,
    incidentsLast30d: 0,
    severityTrend: [],
  };

  // Count by status
  Object.values(EscalationStatus).forEach((status) => {
    metrics.totalByStatus[status] = escalations.filter((e) => e.status === status).length;
  });

  // Count by severity
  Object.values(SeverityLevel).forEach((severity) => {
    metrics.totalBySeverity[severity] = escalations.filter((e) => e.severity === severity)
      .length;
  });

  // Count by context
  Object.values(EscalationContext).forEach((context) => {
    metrics.totalByContext[context] = escalations.filter((e) => e.context === context).length;
  });

  // Calculate resolution time
  const resolved = escalations.filter((e) => e.resolvedAt);
  if (resolved.length > 0) {
    const totalTime = resolved.reduce((sum, e) => {
      return sum + (e.resolvedAt!.getTime() - e.createdAt.getTime());
    }, 0);
    metrics.averageResolutionTime = totalTime / resolved.length;
  }

  // Time range counts
  const last24h = new Date();
  last24h.setDate(last24h.getDate() - 1);
  metrics.incidentsLast24h = escalations.filter((e) => e.createdAt > last24h).length;

  const last7d = new Date();
  last7d.setDate(last7d.getDate() - 7);
  metrics.incidentsLast7d = escalations.filter((e) => e.createdAt > last7d).length;

  const last30d = new Date();
  last30d.setMonth(last30d.getMonth() - 1);
  metrics.incidentsLast30d = escalations.filter((e) => e.createdAt > last30d).length;

  return metrics;
}

// ─────────────────────────────────────────────────────────────────────────
// REAL-TIME SUBSCRIPTIONS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Subscribe to escalation changes
 */
export function subscribeToEscalation(
  escalationId: string,
  callback: (escalation: EscalationEvent | null) => void
): () => void {
  const docRef = doc(db, 'escalations', escalationId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as EscalationEvent);
    } else {
      callback(null);
    }
  });
}

/**
 * Subscribe to user's escalations
 */
export function subscribeToUserEscalations(
  userId: string,
  callback: (escalations: EscalationEvent[]) => void
): () => void {
  const q = query(
    collection(db, 'escalations'),
    where('responders', 'array-contains-any', [{ userId }]),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const escalations = querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);
    callback(escalations);
  });
}

/**
 * Subscribe to metrics updates
 */
export function subscribeToIncidentMetrics(
  request: GetIncidentMetricsRequest,
  callback: (metrics: IncidentMetrics) => void
): () => void {
  // Poll for updates every 30 seconds
  const interval = setInterval(async () => {
    const metrics = await getIncidentMetrics(request);
    callback(metrics);
  }, 30000);

  // Initial call
  getIncidentMetrics(request).then(callback);

  return () => clearInterval(interval);
}

// ─────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Determine next escalation level
 */
function getNextEscalationLevel(current: EscalationLevel): EscalationLevel | null {
  const levels = [
    EscalationLevel.INDIVIDUAL,
    EscalationLevel.FAMILY,
    EscalationLevel.COMMUNITY,
    EscalationLevel.PROFESSIONAL,
  ];

  const currentIndex = levels.indexOf(current);
  return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
}

/**
 * Get appropriate responder role for escalation level
 */
function getRoleForLevel(level: EscalationLevel): ResponderRole {
  const roleMap: Record<EscalationLevel, ResponderRole> = {
    [EscalationLevel.INDIVIDUAL]: ResponderRole.FIRST_RESPONDER,
    [EscalationLevel.FAMILY]: ResponderRole.FAMILY_STEWARD,
    [EscalationLevel.COMMUNITY]: ResponderRole.COMMUNITY_LEAD,
    [EscalationLevel.PROFESSIONAL]: ResponderRole.PROFESSIONAL_HANDLER,
  };

  return roleMap[level];
}

export default {
  createEscalation,
  getEscalationById,
  getEscalationsByIncidentId,
  getOpenEscalationsByLevel,
  getUserAssignedEscalations,
  getCreatedEscalations,
  updateEscalationStatus,
  escalateToNextLevel,
  assignResponder,
  acknowledgeAssignment,
  updateResponderStatus,
  handoffEscalation,
  logResponderAction,
  getResponderActions,
  getAuditTrail,
  getIncidentMetrics,
  subscribeToEscalation,
  subscribeToUserEscalations,
  subscribeToIncidentMetrics,
};
