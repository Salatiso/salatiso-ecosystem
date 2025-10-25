/**
 * Incident Dashboard Service - Phase 3
 * 
 * Backend service for aggregating incident data, computing metrics,
 * and generating reports for the incident dashboard.
 * 
 * Features:
 * - Aggregate incident metrics by status, severity, context
 * - Calculate responder performance metrics
 * - Generate trends and historical analysis
 * - Query open incidents with filtering
 * - Real-time metric subscriptions
 * - Performance and response time analytics
 */

import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
  QueryConstraint,
  onSnapshot,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import {
  EscalationEvent,
  EscalationStatus,
  EscalationLevel,
  EscalationContext,
  SeverityLevel,
  ResponderRole,
  IncidentMetrics,
  EscalationStatusSummary,
  ResponderPerformance,
  SeverityTrend,
  EscalationFilterOptions,
  PaginatedEscalations,
  MetricsSubscriptionCallback,
  GetIncidentMetricsRequest,
} from '@/types/escalation';

// ─────────────────────────────────────────────────────────────────────────
// METRICS CALCULATION
// ─────────────────────────────────────────────────────────────────────────

/**
 * Get comprehensive incident metrics for dashboard
 */
export async function calculateIncidentMetrics(
  timeRange: 'day' | 'week' | 'month' | 'all' = 'week'
): Promise<IncidentMetrics> {
  const endDate = new Date();
  const startDate = new Date();

  // Set time range
  if (timeRange === 'day') {
    startDate.setDate(startDate.getDate() - 1);
  } else if (timeRange === 'week') {
    startDate.setDate(startDate.getDate() - 7);
  } else if (timeRange === 'month') {
    startDate.setMonth(startDate.getMonth() - 1);
  } else {
    startDate.setFullYear(1970);
  }

  // Query escalations in time range
  const q = query(
    collection(db, 'escalations'),
    where('createdAt', '>=', startDate),
    where('createdAt', '<=', endDate),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const escalations = querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);

  // Initialize metrics object
  const metrics: IncidentMetrics = {
    totalOpen: 0,
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
    totalResponders: new Set<string>().size,
    responderPerformance: [],
    incidentsLast24h: 0,
    incidentsLast7d: 0,
    incidentsLast30d: 0,
    severityTrend: [],
  };

  // Calculate totals by status
  metrics.totalByStatus = {
    [EscalationStatus.OPEN]: 0,
    [EscalationStatus.ESCALATED]: 0,
    [EscalationStatus.IN_PROGRESS]: 0,
    [EscalationStatus.AWAITING_RESPONSE]: 0,
    [EscalationStatus.ON_HOLD]: 0,
    [EscalationStatus.RESOLVED]: 0,
    [EscalationStatus.ARCHIVED]: 0,
    [EscalationStatus.CANCELLED]: 0,
  };

  Object.values(EscalationStatus).forEach((status) => {
    metrics.totalByStatus[status] = escalations.filter((e) => e.status === status).length;
  });

  // Count open incidents (not resolved or archived)
  metrics.totalOpen = escalations.filter(
    (e) =>
      e.status !== EscalationStatus.RESOLVED &&
      e.status !== EscalationStatus.ARCHIVED &&
      e.status !== EscalationStatus.CANCELLED
  ).length;

  // Calculate totals by severity
  metrics.totalBySeverity = {
    [SeverityLevel.CRITICAL]: 0,
    [SeverityLevel.HIGH]: 0,
    [SeverityLevel.MEDIUM]: 0,
    [SeverityLevel.LOW]: 0,
  };

  Object.values(SeverityLevel).forEach((severity) => {
    metrics.totalBySeverity[severity] = escalations.filter((e) => e.severity === severity)
      .length;
  });

  // Calculate totals by context
  metrics.totalByContext = {
    [EscalationContext.HEALTH]: 0,
    [EscalationContext.SAFETY]: 0,
    [EscalationContext.PROPERTY]: 0,
    [EscalationContext.EMOTIONAL]: 0,
    [EscalationContext.FINANCIAL]: 0,
    [EscalationContext.LEGAL]: 0,
    [EscalationContext.OTHER]: 0,
  };

  Object.values(EscalationContext).forEach((context) => {
    metrics.totalByContext[context] = escalations.filter((e) => e.context === context).length;
  });

  // Calculate resolution times
  const resolved = escalations.filter((e) => e.resolvedAt);
  if (resolved.length > 0) {
    const resolutionTimes = resolved.map((e) => e.resolvedAt!.getTime() - e.createdAt.getTime());
    metrics.averageResolutionTime = resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length;
  }

  // Calculate first response times
  const withResponders = escalations.filter((e) => e.responders && e.responders.length > 0);
  if (withResponders.length > 0) {
    const responseTimes = withResponders
      .map((e) => {
        const firstResponder = e.responders[0];
        return firstResponder.statusUpdatedAt.getTime() - e.createdAt.getTime();
      });
    metrics.averageTimeToFirstResponse = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  }

  // Collect unique responders
  const responderSet = new Set<string>();
  escalations.forEach((e) => {
    e.responders.forEach((r) => {
      responderSet.add(r.userId);
    });
  });
  metrics.totalResponders = responderSet.size;

  // Calculate escalation rate
  const escalatedIncidents = escalations.filter((e) => e.previousLevel);
  metrics.escalationRate = escalations.length > 0 ? (escalatedIncidents.length / escalations.length) * 100 : 0;

  // Calculate average escalations per incident
  const totalEscalationsCount = escalations.reduce((sum, e) => sum + (e.previousLevel ? 1 : 0), 0);
  metrics.averageEscalationsPerIncident = escalations.length > 0 ? totalEscalationsCount / escalations.length : 0;

  // Calculate 24h, 7d, 30d incident counts
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  metrics.incidentsLast24h = escalations.filter((e) => e.createdAt > last24h).length;
  metrics.incidentsLast7d = escalations.filter((e) => e.createdAt > last7d).length;
  metrics.incidentsLast30d = escalations.filter((e) => e.createdAt > last30d).length;

  return metrics;
}

// ─────────────────────────────────────────────────────────────────────────
// INCIDENT QUERYING WITH FILTERING
// ─────────────────────────────────────────────────────────────────────────

/**
 * Get open incidents with optional filtering
 */
export async function getOpenIncidents(
  filters?: EscalationFilterOptions,
  limit?: number,
  offset?: number
): Promise<PaginatedEscalations> {
  const constraints: QueryConstraint[] = [
    where('status', '!=', EscalationStatus.RESOLVED),
    where('status', '!=', EscalationStatus.ARCHIVED),
    where('status', '!=', EscalationStatus.CANCELLED),
    orderBy('status'),
    orderBy('severity', 'desc'),
    orderBy('createdAt', 'asc'),
  ];

  // Apply optional filters
  if (filters?.statuses && filters.statuses.length > 0) {
    // Note: Firestore has limitations with multiple OR conditions
    // This is a simplified implementation
    const validStatuses = filters.statuses.filter(
      (s) =>
        s !== EscalationStatus.RESOLVED &&
        s !== EscalationStatus.ARCHIVED &&
        s !== EscalationStatus.CANCELLED
    );
    if (validStatuses.length > 0) {
      // Apply first status as where clause
      constraints[0] = where('status', '==', validStatuses[0]);
    }
  }

  if (filters?.severities && filters.severities.length > 0) {
    // Would need composite index for multiple severity filters
    // Using first severity for now
    constraints.push(where('severity', '==', filters.severities[0]));
  }

  if (filters?.contexts && filters.contexts.length > 0) {
    constraints.push(where('context', '==', filters.contexts[0]));
  }

  if (filters?.createdBy) {
    constraints.push(where('createdBy', '==', filters.createdBy));
  }

  if (filters?.currentOwner) {
    constraints.push(where('currentOwner', '==', filters.currentOwner));
  }

  const q = query(collection(db, 'escalations'), ...constraints);
  const querySnapshot = await getDocs(q);

  const allItems = querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);
  const pageSize = limit || 20;
  const pageOffset = offset || 0;

  return {
    items: allItems.slice(pageOffset, pageOffset + pageSize),
    total: allItems.length,
    page: Math.floor(pageOffset / pageSize),
    pageSize,
    hasMore: pageOffset + pageSize < allItems.length,
  };
}

/**
 * Get incidents by status with pagination
 */
export async function getIncidentsByStatus(
  status: EscalationStatus,
  limit: number = 20,
  offset: number = 0
): Promise<PaginatedEscalations> {
  const q = query(
    collection(db, 'escalations'),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const allItems = querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);

  return {
    items: allItems.slice(offset, offset + limit),
    total: allItems.length,
    page: Math.floor(offset / limit),
    pageSize: limit,
    hasMore: offset + limit < allItems.length,
  };
}

/**
 * Get critical incidents (severity-based filtering)
 */
export async function getCriticalIncidents(): Promise<EscalationEvent[]> {
  const q = query(
    collection(db, 'escalations'),
    where('severity', '==', SeverityLevel.CRITICAL),
    where('status', '!=', EscalationStatus.RESOLVED),
    orderBy('createdAt', 'asc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);
}

// ─────────────────────────────────────────────────────────────────────────
// STATUS SUMMARY CALCULATIONS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Get status summary for each escalation level
 */
export async function getStatusSummaryByLevel(
  level: EscalationLevel
): Promise<EscalationStatusSummary> {
  const q = query(
    collection(db, 'escalations'),
    where('currentLevel', '==', level),
    where('status', '!=', EscalationStatus.ARCHIVED),
    where('status', '!=', EscalationStatus.CANCELLED)
  );

  const querySnapshot = await getDocs(q);
  const escalations = querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);

  // Calculate metrics
  const open = escalations.filter((e) => e.status === EscalationStatus.OPEN).length;
  const inProgress = escalations.filter((e) => e.status === EscalationStatus.IN_PROGRESS).length;
  const awaitingResponse = escalations.filter((e) => e.status === EscalationStatus.AWAITING_RESPONSE).length;
  const resolved = escalations.filter((e) => e.status === EscalationStatus.RESOLVED).length;

  // Calculate average resolution time for this level
  const resolved_escalations = escalations.filter((e) => e.resolvedAt && e.currentLevel === level);
  let avgResolutionTime = 0;
  if (resolved_escalations.length > 0) {
    const totalTime = resolved_escalations.reduce(
      (sum, e) => sum + (e.resolvedAt!.getTime() - e.createdAt.getTime()),
      0
    );
    avgResolutionTime = totalTime / resolved_escalations.length;
  }

  return {
    level,
    open,
    inProgress,
    awaitingResponse,
    resolved,
    avgResolutionTime,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// SEVERITY TREND ANALYSIS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Calculate severity trends over time
 */
export async function calculateSeverityTrends(
  days: number = 30
): Promise<SeverityTrend[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const q = query(
    collection(db, 'escalations'),
    where('createdAt', '>=', startDate),
    where('createdAt', '<=', endDate),
    orderBy('createdAt', 'asc')
  );

  const querySnapshot = await getDocs(q);
  const escalations = querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);

  // Group by date
  const trendMap = new Map<string, SeverityTrend>();

  escalations.forEach((e) => {
    const dateStr = e.createdAt.toISOString().split('T')[0];
    if (!trendMap.has(dateStr)) {
      trendMap.set(dateStr, {
        date: new Date(dateStr),
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      });
    }

    const trend = trendMap.get(dateStr)!;
    if (e.severity === SeverityLevel.CRITICAL) trend.critical++;
    else if (e.severity === SeverityLevel.HIGH) trend.high++;
    else if (e.severity === SeverityLevel.MEDIUM) trend.medium++;
    else if (e.severity === SeverityLevel.LOW) trend.low++;
  });

  return Array.from(trendMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
}

// ─────────────────────────────────────────────────────────────────────────
// RESPONDER PERFORMANCE METRICS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Get performance metrics for a specific responder
 */
export async function getResponderPerformance(userId: string): Promise<ResponderPerformance | null> {
  // Find all escalations where this user was a responder
  const q = query(
    collection(db, 'escalations'),
    where('responders', 'array-contains-any', [{ userId }])
  );

  const querySnapshot = await getDocs(q);
  const escalations = querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);

  if (escalations.length === 0) {
    return null;
  }

  // Find responder assignments for this user
  const assignments = escalations
    .flatMap((e) => e.responders)
    .filter((r) => r.userId === userId);

  if (assignments.length === 0) {
    return null;
  }

  // Calculate metrics
  const completed = assignments.filter((a) => a.status === 'completed').length;
  const completionRate = (completed / assignments.length) * 100;

  // Calculate average response time
  let totalResponseTime = 0;
  let responseCount = 0;
  assignments.forEach((a) => {
    if (a.acknowledgedAt) {
      const responseTime = a.acknowledgedAt.getTime() - a.assignedAt.getTime();
      totalResponseTime += responseTime;
      responseCount++;
    }
  });
  const avgResponseTime = responseCount > 0 ? totalResponseTime / responseCount : 0;

  // Calculate average resolution time
  const completedAssignments = assignments.filter((a) => a.status === 'completed');
  let totalResolutionTime = 0;
  completedAssignments.forEach((a) => {
    if (a.statusUpdatedAt) {
      const resolutionTime = a.statusUpdatedAt.getTime() - a.assignedAt.getTime();
      totalResolutionTime += resolutionTime;
    }
  });
  const avgResolutionTime = completedAssignments.length > 0 ? totalResolutionTime / completedAssignments.length : 0;

  // Calculate handoff rate
  const handoffs = assignments.filter((a) => a.status === 'handoff').length;
  const handoffRate = (handoffs / assignments.length) * 100;

  // Calculate resolution success rate (completed / assigned)
  const successRate = (completed / assignments.length) * 100;

  // Get last assignment time
  const lastAssignmentAt = assignments.length > 0 ? assignments[assignments.length - 1].assignedAt : undefined;

  // Count currently handling
  const currentlyHandling = assignments.filter((a) => a.status === 'in_progress').length;

  return {
    userId,
    userName: userId, // Would need to fetch actual name from user doc
    role: assignments[0].role,
    totalAssignments: assignments.length,
    completedAssignments: completed,
    completionRate,
    averageResponseTime: avgResponseTime,
    averageResolutionTime: avgResolutionTime,
    escalationHandoffRate: handoffRate,
    resolutionSuccessRate: successRate,
    lastAssignmentAt,
    currentlyHandling,
  };
}

/**
 * Get performance metrics for all responders
 */
export async function getAllResponderPerformance(): Promise<ResponderPerformance[]> {
  // Get all escalations
  const q = query(collection(db, 'escalations'));
  const querySnapshot = await getDocs(q);
  const escalations = querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);

  // Collect unique responder IDs
  const responderIds = new Set<string>();
  escalations.forEach((e) => {
    e.responders.forEach((r) => {
      responderIds.add(r.userId);
    });
  });

  // Get performance for each responder
  const performances: ResponderPerformance[] = [];
  for (const userId of responderIds) {
    const perf = await getResponderPerformance(userId);
    if (perf) {
      performances.push(perf);
    }
  }

  // Sort by completion rate descending
  return performances.sort((a, b) => b.completionRate - a.completionRate);
}

// ─────────────────────────────────────────────────────────────────────────
// REAL-TIME SUBSCRIPTIONS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Subscribe to metrics updates
 */
export function subscribeToMetrics(
  timeRange: 'day' | 'week' | 'month' = 'week',
  callback: MetricsSubscriptionCallback
): () => void {
  // Poll metrics every 60 seconds
  const updateMetrics = async () => {
    try {
      const metrics = await calculateIncidentMetrics(timeRange);
      callback(metrics);
    } catch (error) {
      console.error('Error calculating metrics:', error);
    }
  };

  // Initial update
  updateMetrics();

  // Set interval for periodic updates
  const interval = setInterval(updateMetrics, 60000); // 60 seconds

  // Return cleanup function
  return () => clearInterval(interval);
}

/**
 * Subscribe to open incidents updates
 */
export function subscribeToOpenIncidents(
  callback: (incidents: EscalationEvent[]) => void
): () => void {
  const q = query(
    collection(db, 'escalations'),
    where('status', '!=', EscalationStatus.RESOLVED),
    where('status', '!=', EscalationStatus.ARCHIVED),
    orderBy('severity', 'desc'),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const incidents = querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);
    callback(incidents);
  });
}

/**
 * Subscribe to critical incidents
 */
export function subscribeToCriticalIncidents(
  callback: (incidents: EscalationEvent[]) => void
): () => void {
  const q = query(
    collection(db, 'escalations'),
    where('severity', '==', SeverityLevel.CRITICAL),
    where('status', '!=', EscalationStatus.RESOLVED),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const incidents = querySnapshot.docs.map((doc) => doc.data() as EscalationEvent);
    callback(incidents);
  });
}

// ─────────────────────────────────────────────────────────────────────────
// EXPORT DEFAULT
// ─────────────────────────────────────────────────────────────────────────

export default {
  calculateIncidentMetrics,
  getOpenIncidents,
  getIncidentsByStatus,
  getCriticalIncidents,
  getStatusSummaryByLevel,
  calculateSeverityTrends,
  getResponderPerformance,
  getAllResponderPerformance,
  subscribeToMetrics,
  subscribeToOpenIncidents,
  subscribeToCriticalIncidents,
};
