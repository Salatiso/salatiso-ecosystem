/**
 * Phase 6.5 - Security Hardening: Audit Logger
 * Comprehensive audit logging for security events
 */

import { getFirestore } from 'firebase-admin/firestore'

// ============================================================================
// Types
// ============================================================================

export type AuditEventType =
  | 'user:login'
  | 'user:logout'
  | 'user:create'
  | 'user:update'
  | 'user:delete'
  | 'role:grant'
  | 'role:revoke'
  | 'permission:grant'
  | 'permission:revoke'
  | 'data:access'
  | 'data:create'
  | 'data:update'
  | 'data:delete'
  | 'data:export'
  | 'auth:failure'
  | 'auth:success'
  | 'access:denied'
  | 'security:alert'
  | 'config:change'
  | 'api:call'

export interface AuditEvent {
  id: string
  timestamp: number
  eventType: AuditEventType
  userId: string
  userEmail?: string
  action: string
  resource?: string
  resourceId?: string
  status: 'success' | 'failure'
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  affected?: string[]
}

export interface AuditLog {
  id: string
  events: AuditEvent[]
  createdAt: Date
  updatedAt: Date
}

export interface AuditSearchCriteria {
  userId?: string
  eventType?: AuditEventType
  startTime?: number
  endTime?: number
  severity?: 'low' | 'medium' | 'high' | 'critical'
  status?: 'success' | 'failure'
  limit?: number
}

export interface AuditReport {
  period: { start: number; end: number }
  totalEvents: number
  eventsByType: Record<AuditEventType, number>
  eventsBySeverity: Record<string, number>
  failureRate: number
  criticalEvents: AuditEvent[]
  topUsers: { userId: string; eventCount: number }[]
}

// ============================================================================
// Configuration
// ============================================================================

interface AuditLoggerConfig {
  collectionName: string
  maxEventsPerLog: number
  autoFlushInterval: number
  enableConsoleLogging: boolean
}

const DEFAULT_CONFIG: AuditLoggerConfig = {
  collectionName: 'audit_logs',
  maxEventsPerLog: 1000,
  autoFlushInterval: 60000, // 1 minute
  enableConsoleLogging: false,
}

// ============================================================================
// Audit Logger
// ============================================================================

export class AuditLogger {
  private config: AuditLoggerConfig
  private events: AuditEvent[]
  private flushTimer: NodeJS.Timeout | null
  private currentLogId: string
  private initialized: boolean

  constructor(config?: Partial<AuditLoggerConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.events = []
    this.flushTimer = null
    this.currentLogId = this.generateLogId()
    this.initialized = false
  }

  // ========================================================================
  // Initialization
  // ========================================================================

  /**
   * Initialize the audit logger
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    try {
      // Test Firestore connection
      const db = getFirestore()
      await db.collection(this.config.collectionName).limit(1).get()
      this.initialized = true

      // Start auto-flush
      this.startAutoFlush()
    } catch (error) {
      throw new Error(`Failed to initialize audit logger: ${error}`)
    }
  }

  /**
   * Cleanup and flush remaining events
   */
  async destroy(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }

    if (this.events.length > 0) {
      await this.flush()
    }

    this.initialized = false
  }

  // ========================================================================
  // Event Logging
  // ========================================================================

  /**
   * Log an audit event
   */
  async logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<string> {
    if (!this.initialized) {
      console.warn('Audit logger not initialized. Event not logged.')
      return ''
    }

    const auditEvent: AuditEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: Date.now(),
    }

    // Log to console if enabled
    if (this.config.enableConsoleLogging) {
      console.log(`[AUDIT] ${auditEvent.eventType}:`, auditEvent)
    }

    // Store event
    this.events.push(auditEvent)

    // Flush if buffer is full
    if (this.events.length >= this.config.maxEventsPerLog) {
      await this.flush()
    }

    return auditEvent.id
  }

  /**
   * Log user login
   */
  async logUserLogin(userId: string, userEmail: string, ipAddress?: string): Promise<string> {
    return this.logEvent({
      eventType: 'user:login',
      userId,
      userEmail,
      action: 'User login',
      status: 'success',
      severity: 'low',
      ipAddress,
    })
  }

  /**
   * Log user logout
   */
  async logUserLogout(userId: string, userEmail: string): Promise<string> {
    return this.logEvent({
      eventType: 'user:logout',
      userId,
      userEmail,
      action: 'User logout',
      status: 'success',
      severity: 'low',
    })
  }

  /**
   * Log authentication failure
   */
  async logAuthFailure(userId: string, reason: string, ipAddress?: string): Promise<string> {
    return this.logEvent({
      eventType: 'auth:failure',
      userId,
      action: 'Authentication failed',
      status: 'failure',
      severity: 'medium',
      details: { reason },
      ipAddress,
    })
  }

  /**
   * Log access denied
   */
  async logAccessDenied(userId: string, resource: string, action: string): Promise<string> {
    return this.logEvent({
      eventType: 'access:denied',
      userId,
      action: `Access denied to ${resource}`,
      resource,
      details: { action },
      status: 'failure',
      severity: 'medium',
    })
  }

  /**
   * Log data access
   */
  async logDataAccess(userId: string, resourceId: string, action: string): Promise<string> {
    return this.logEvent({
      eventType: 'data:access',
      userId,
      action: `Accessed ${action}`,
      resourceId,
      status: 'success',
      severity: 'low',
    })
  }

  /**
   * Log data modification
   */
  async logDataModification(
    userId: string,
    resourceId: string,
    action: 'create' | 'update' | 'delete',
    details?: Record<string, unknown>
  ): Promise<string> {
    return this.logEvent({
      eventType: `data:${action}` as AuditEventType,
      userId,
      action: `Data ${action}`,
      resourceId,
      status: 'success',
      severity: 'medium',
      details,
    })
  }

  /**
   * Log role change
   */
  async logRoleChange(
    userId: string,
    affectedUserId: string,
    role: string,
    action: 'grant' | 'revoke'
  ): Promise<string> {
    return this.logEvent({
      eventType: `role:${action}` as AuditEventType,
      userId,
      action: `Role ${action}ed: ${role}`,
      status: 'success',
      severity: 'high',
      affected: [affectedUserId],
      details: { role },
    })
  }

  /**
   * Log security alert
   */
  async logSecurityAlert(
    userId: string,
    alertType: string,
    severity: 'medium' | 'high' | 'critical',
    details?: Record<string, unknown>
  ): Promise<string> {
    return this.logEvent({
      eventType: 'security:alert',
      userId,
      action: `Security alert: ${alertType}`,
      status: 'success',
      severity,
      details,
    })
  }

  /**
   * Log configuration change
   */
  async logConfigChange(
    userId: string,
    configName: string,
    oldValue: unknown,
    newValue: unknown
  ): Promise<string> {
    return this.logEvent({
      eventType: 'config:change',
      userId,
      action: `Configuration changed: ${configName}`,
      status: 'success',
      severity: 'high',
      details: { oldValue, newValue },
    })
  }

  /**
   * Log API call
   */
  async logApiCall(
    userId: string,
    endpoint: string,
    method: string,
    statusCode: number,
    duration?: number
  ): Promise<string> {
    return this.logEvent({
      eventType: 'api:call',
      userId,
      action: `API call: ${method} ${endpoint}`,
      resource: endpoint,
      status: statusCode >= 200 && statusCode < 400 ? 'success' : 'failure',
      severity: 'low',
      details: { statusCode, duration },
    })
  }

  // ========================================================================
  // Data Retrieval & Analysis
  // ========================================================================

  /**
   * Search audit logs
   */
  async searchEvents(criteria: AuditSearchCriteria): Promise<AuditEvent[]> {
    if (!this.initialized) {
      throw new Error('Audit logger not initialized')
    }

    const db = getFirestore()
    let query: any = db.collection(this.config.collectionName)

    if (criteria.userId) {
      query = query.where('events', 'array-contains', { userId: criteria.userId })
    }

    if (criteria.startTime || criteria.endTime) {
      if (criteria.startTime) {
        query = query.where('createdAt', '>=', new Date(criteria.startTime))
      }
      if (criteria.endTime) {
        query = query.where('createdAt', '<=', new Date(criteria.endTime))
      }
    }

    const snapshot = await query.limit(criteria.limit || 100).get()

    const events: AuditEvent[] = []
    snapshot.forEach((doc) => {
      const log = doc.data() as AuditLog
      for (const event of log.events) {
        // Apply additional filters
        if (criteria.eventType && event.eventType !== criteria.eventType) continue
        if (criteria.severity && event.severity !== criteria.severity) continue
        if (criteria.status && event.status !== criteria.status) continue

        events.push(event)
      }
    })

    return events
  }

  /**
   * Get events by user
   */
  async getEventsByUser(userId: string, limit: number = 100): Promise<AuditEvent[]> {
    return this.searchEvents({ userId, limit })
  }

  /**
   * Get events by type
   */
  async getEventsByType(eventType: AuditEventType, limit: number = 100): Promise<AuditEvent[]> {
    return this.searchEvents({ eventType, limit })
  }

  /**
   * Get critical events
   */
  async getCriticalEvents(hours: number = 24): Promise<AuditEvent[]> {
    const startTime = Date.now() - hours * 3600000
    return this.searchEvents({
      severity: 'critical',
      startTime,
      limit: 1000,
    })
  }

  /**
   * Generate audit report
   */
  async generateReport(startTime: number, endTime: number): Promise<AuditReport> {
    const events = await this.searchEvents({ startTime, endTime, limit: 10000 })

    const eventsByType: Record<AuditEventType, number> = {} as any
    const eventsBySeverity: Record<string, number> = {}
    const userEventCounts: Record<string, number> = {}
    const criticalEvents: AuditEvent[] = []

    for (const event of events) {
      // Count by type
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1

      // Count by severity
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1

      // Count by user
      userEventCounts[event.userId] = (userEventCounts[event.userId] || 0) + 1

      // Collect critical events
      if (event.severity === 'critical') {
        criticalEvents.push(event)
      }
    }

    // Calculate failure rate
    const failureCount = events.filter((e) => e.status === 'failure').length
    const failureRate = events.length > 0 ? failureCount / events.length : 0

    // Get top users
    const topUsers = Object.entries(userEventCounts)
      .map(([userId, count]) => ({ userId, eventCount: count }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 10)

    return {
      period: { start: startTime, end: endTime },
      totalEvents: events.length,
      eventsByType,
      eventsBySeverity,
      failureRate,
      criticalEvents: criticalEvents.slice(0, 50),
      topUsers,
    }
  }

  /**
   * Export events as JSON
   */
  async exportEvents(criteria: AuditSearchCriteria): Promise<string> {
    const events = await this.searchEvents(criteria)
    return JSON.stringify(events, null, 2)
  }

  /**
   * Export events as CSV
   */
  async exportEventsAsCSV(criteria: AuditSearchCriteria): Promise<string> {
    const events = await this.searchEvents(criteria)

    if (events.length === 0) {
      return ''
    }

    // Create CSV header
    const headers = [
      'id',
      'timestamp',
      'eventType',
      'userId',
      'userEmail',
      'action',
      'resource',
      'resourceId',
      'status',
      'severity',
      'ipAddress',
    ]

    // Create CSV rows
    const rows = events.map((event) => [
      event.id,
      new Date(event.timestamp).toISOString(),
      event.eventType,
      event.userId,
      event.userEmail || '',
      event.action,
      event.resource || '',
      event.resourceId || '',
      event.status,
      event.severity,
      event.ipAddress || '',
    ])

    // Combine header and rows
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')

    return csv
  }

  // ========================================================================
  // Persistence
  // ========================================================================

  /**
   * Flush events to Firestore
   */
  async flush(): Promise<void> {
    if (!this.initialized || this.events.length === 0) {
      return
    }

    try {
      const db = getFirestore()

      const auditLog: AuditLog = {
        id: this.currentLogId,
        events: [...this.events],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await db.collection(this.config.collectionName).doc(this.currentLogId).set(auditLog)

      this.events = []
      this.currentLogId = this.generateLogId()
    } catch (error) {
      console.error('Failed to flush audit logs:', error)
      throw error
    }
  }

  /**
   * Start auto-flush timer
   */
  private startAutoFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }

    this.flushTimer = setInterval(() => {
      this.flush().catch((error) => {
        console.error('Auto-flush error:', error)
      })
    }, this.config.autoFlushInterval)
  }

  // ========================================================================
  // Utility Methods
  // ========================================================================

  private generateLogId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private generateEventId(): string {
    return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get pending event count
   */
  getPendingEventCount(): number {
    return this.events.length
  }

  /**
   * Get initialization status
   */
  isInitialized(): boolean {
    return this.initialized
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let auditLoggerInstance: AuditLogger | null = null

export function getAuditLogger(config?: Partial<AuditLoggerConfig>): AuditLogger {
  if (!auditLoggerInstance) {
    auditLoggerInstance = new AuditLogger(config)
  }
  return auditLoggerInstance
}

export function resetAuditLogger(): void {
  if (auditLoggerInstance) {
    auditLoggerInstance.destroy().catch((error) => {
      console.error('Error destroying audit logger:', error)
    })
  }
  auditLoggerInstance = null
}
