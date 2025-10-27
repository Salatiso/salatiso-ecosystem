/**
 * Phase 6.5 - Security Hardening: Data Retention Manager
 * GDPR compliance and data retention policies
 */

import { getFirestore } from 'firebase-admin/firestore'

// ============================================================================
// Types
// ============================================================================

export type RetentionPolicy = 'temporary' | 'short-term' | 'long-term' | 'permanent' | 'custom'

export interface RetentionConfig {
  policy: RetentionPolicy
  retentionDays?: number
  autoDelete: boolean
  archiveBeforeDelete: boolean
  notifications: boolean
}

export interface DataClassification {
  dataType: string
  classification: 'public' | 'internal' | 'confidential' | 'restricted'
  retentionConfig: RetentionConfig
  owningDepartment: string
}

export interface RetentionRecord {
  id: string
  dataType: string
  createdAt: Date
  lastAccessedAt: Date
  scheduledDeletionDate?: Date
  archived: boolean
  archivedAt?: Date
  tags: string[]
}

export interface DataExport {
  userId: string
  exportedAt: Date
  dataFormat: 'json' | 'csv' | 'pdf'
  includePersonalData: boolean
  dataTypes: string[]
  fileUrl?: string
}

export interface GDPRRequest {
  id: string
  userId: string
  requestType: 'access' | 'delete' | 'export' | 'portability'
  status: 'pending' | 'processing' | 'completed' | 'denied'
  createdAt: Date
  completedAt?: Date
  reason?: string
  result?: Record<string, unknown>
}

// ============================================================================
// Configuration
// ============================================================================

const DEFAULT_RETENTION_POLICIES: Record<RetentionPolicy, number> = {
  temporary: 7, // 1 week
  'short-term': 30, // 1 month
  'long-term': 365, // 1 year
  permanent: -1, // Never delete
  custom: 0, // Custom duration
}

const DEFAULT_DATA_CLASSIFICATIONS: Map<string, DataClassification> = new Map([
  [
    'user:profile',
    {
      dataType: 'user:profile',
      classification: 'confidential',
      retentionConfig: {
        policy: 'long-term',
        retentionDays: 365,
        autoDelete: true,
        archiveBeforeDelete: true,
        notifications: true,
      },
      owningDepartment: 'User Management',
    },
  ],
  [
    'user:activity',
    {
      dataType: 'user:activity',
      classification: 'internal',
      retentionConfig: {
        policy: 'short-term',
        retentionDays: 90,
        autoDelete: true,
        archiveBeforeDelete: false,
        notifications: false,
      },
      owningDepartment: 'Analytics',
    },
  ],
  [
    'auth:logs',
    {
      dataType: 'auth:logs',
      classification: 'restricted',
      retentionConfig: {
        policy: 'long-term',
        retentionDays: 730,
        autoDelete: true,
        archiveBeforeDelete: true,
        notifications: true,
      },
      owningDepartment: 'Security',
    },
  ],
  [
    'audit:logs',
    {
      dataType: 'audit:logs',
      classification: 'restricted',
      retentionConfig: {
        policy: 'long-term',
        retentionDays: 1825, // 5 years
        autoDelete: false,
        archiveBeforeDelete: true,
        notifications: true,
      },
      owningDepartment: 'Compliance',
    },
  ],
])

// ============================================================================
// Data Retention Manager
// ============================================================================

export class DataRetentionManager {
  private classifications: Map<string, DataClassification>
  private initialized: boolean

  constructor() {
    this.classifications = new Map(DEFAULT_DATA_CLASSIFICATIONS)
    this.initialized = false
  }

  // ========================================================================
  // Initialization
  // ========================================================================

  /**
   * Initialize the retention manager
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    try {
      const db = getFirestore()
      await db.collection('data_classifications').limit(1).get()
      this.initialized = true
    } catch (error) {
      throw new Error(`Failed to initialize retention manager: ${error}`)
    }
  }

  /**
   * Get initialization status
   */
  isInitialized(): boolean {
    return this.initialized
  }

  // ========================================================================
  // Data Classification
  // ========================================================================

  /**
   * Register a data classification
   */
  registerClassification(classification: DataClassification): void {
    this.classifications.set(classification.dataType, classification)
  }

  /**
   * Get classification for data type
   */
  getClassification(dataType: string): DataClassification | undefined {
    return this.classifications.get(dataType)
  }

  /**
   * List all classifications
   */
  listClassifications(): DataClassification[] {
    return Array.from(this.classifications.values())
  }

  /**
   * Update classification
   */
  updateClassification(dataType: string, updates: Partial<DataClassification>): void {
    const current = this.classifications.get(dataType)
    if (!current) {
      throw new Error(`Classification for '${dataType}' not found`)
    }

    const updated = { ...current, ...updates, dataType }
    this.classifications.set(dataType, updated)
  }

  // ========================================================================
  // Retention Policies
  // ========================================================================

  /**
   * Get retention days for data type
   */
  getRetentionDays(dataType: string): number | undefined {
    const classification = this.classifications.get(dataType)
    if (!classification) {
      return undefined
    }

    const config = classification.retentionConfig
    if (config.policy === 'permanent') {
      return -1
    }

    if (config.retentionDays !== undefined) {
      return config.retentionDays
    }

    return DEFAULT_RETENTION_POLICIES[config.policy]
  }

  /**
   * Calculate retention expiry date
   */
  getExpiryDate(dataType: string, createdDate: Date = new Date()): Date | null {
    const retentionDays = this.getRetentionDays(dataType)

    if (retentionDays === undefined || retentionDays === -1) {
      return null // Never expires
    }

    const expiryDate = new Date(createdDate)
    expiryDate.setDate(expiryDate.getDate() + retentionDays)
    return expiryDate
  }

  /**
   * Check if data has expired
   */
  hasExpired(dataType: string, createdDate: Date): boolean {
    const expiryDate = this.getExpiryDate(dataType, createdDate)
    if (!expiryDate) {
      return false
    }

    return new Date() > expiryDate
  }

  /**
   * Get days until expiry
   */
  getDaysUntilExpiry(dataType: string, createdDate: Date): number | null {
    const expiryDate = this.getExpiryDate(dataType, createdDate)
    if (!expiryDate) {
      return null
    }

    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, daysUntilExpiry)
  }

  // ========================================================================
  // Data Cleanup
  // ========================================================================

  /**
   * Identify expired data
   */
  async identifyExpiredData(dataType?: string): Promise<RetentionRecord[]> {
    if (!this.initialized) {
      throw new Error('Retention manager not initialized')
    }

    const db = getFirestore()
    const expiredRecords: RetentionRecord[] = []

    const types = dataType ? [dataType] : Array.from(this.classifications.keys())

    for (const type of types) {
      const classification = this.classifications.get(type)
      if (!classification || classification.retentionConfig.policy === 'permanent') {
        continue
      }

      const retentionDays = this.getRetentionDays(type)
      if (!retentionDays || retentionDays === -1) {
        continue
      }

      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

      const query = db
        .collection('retention_records')
        .where('dataType', '==', type)
        .where('createdAt', '<', cutoffDate)
        .where('archived', '==', false)

      const snapshot = await query.get()

      snapshot.forEach((doc) => {
        expiredRecords.push(doc.data() as RetentionRecord)
      })
    }

    return expiredRecords
  }

  /**
   * Archive data
   */
  async archiveData(recordIds: string[], reason?: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('Retention manager not initialized')
    }

    const db = getFirestore()
    const batch = db.batch()

    for (const recordId of recordIds) {
      const ref = db.collection('retention_records').doc(recordId)
      batch.update(ref, {
        archived: true,
        archivedAt: new Date(),
        notes: reason || '',
      })
    }

    await batch.commit()
  }

  /**
   * Delete data
   */
  async deleteData(recordIds: string[]): Promise<void> {
    if (!this.initialized) {
      throw new Error('Retention manager not initialized')
    }

    const db = getFirestore()
    const batch = db.batch()

    for (const recordId of recordIds) {
      const ref = db.collection('retention_records').doc(recordId)
      batch.delete(ref)
    }

    await batch.commit()
  }

  /**
   * Execute retention cleanup
   */
  async executeCleanup(): Promise<{ archived: number; deleted: number }> {
    if (!this.initialized) {
      throw new Error('Retention manager not initialized')
    }

    let archived = 0
    let deleted = 0

    for (const classification of this.classifications.values()) {
      if (classification.retentionConfig.policy === 'permanent') {
        continue
      }

      const expiredRecords = await this.identifyExpiredData(classification.dataType)

      if (expiredRecords.length > 0) {
        const recordIds = expiredRecords.map((r) => r.id)

        if (classification.retentionConfig.archiveBeforeDelete) {
          await this.archiveData(recordIds, 'Automatic archival before deletion')
          archived += recordIds.length
        }

        if (classification.retentionConfig.autoDelete) {
          await this.deleteData(recordIds)
          deleted += recordIds.length
        }
      }
    }

    return { archived, deleted }
  }

  // ========================================================================
  // GDPR Compliance
  // ========================================================================

  /**
   * Create GDPR access request
   */
  async createGDPRRequest(
    userId: string,
    requestType: 'access' | 'delete' | 'export' | 'portability'
  ): Promise<GDPRRequest> {
    if (!this.initialized) {
      throw new Error('Retention manager not initialized')
    }

    const db = getFirestore()

    const request: GDPRRequest = {
      id: `gdpr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      requestType,
      status: 'pending',
      createdAt: new Date(),
    }

    await db.collection('gdpr_requests').doc(request.id).set(request)

    return request
  }

  /**
   * Process GDPR access request
   */
  async processGDPRAccessRequest(userId: string): Promise<Record<string, unknown>> {
    if (!this.initialized) {
      throw new Error('Retention manager not initialized')
    }

    const db = getFirestore()

    const userdata: Record<string, unknown> = {}

    // Collect user profile
    const profileDoc = await db.collection('users').doc(userId).get()
    if (profileDoc.exists) {
      userdata.profile = profileDoc.data()
    }

    // Collect user activity
    const activityDocs = await db.collection('user_activity').where('userId', '==', userId).limit(1000).get()
    userdata.activities = activityDocs.docs.map((doc) => doc.data())

    // Collect audit logs
    const auditDocs = await db
      .collection('audit_logs')
      .where('events', 'array-contains', { userId })
      .limit(100)
      .get()
    userdata.auditLogs = auditDocs.docs.map((doc) => doc.data())

    return userdata
  }

  /**
   * Process GDPR deletion request
   */
  async processGDPRDeletionRequest(userId: string): Promise<{ deleted: number }> {
    if (!this.initialized) {
      throw new Error('Retention manager not initialized')
    }

    const db = getFirestore()
    let deleted = 0

    // Delete user profile
    await db.collection('users').doc(userId).delete()
    deleted++

    // Delete user activities
    const activityDocs = await db.collection('user_activity').where('userId', '==', userId).get()
    const batch = db.batch()

    activityDocs.docs.forEach((doc) => {
      batch.delete(doc.ref)
      deleted++
    })

    await batch.commit()

    return { deleted }
  }

  /**
   * Export user data
   */
  async exportUserData(
    userId: string,
    format: 'json' | 'csv' = 'json'
  ): Promise<{ content: string; filename: string }> {
    const userData = await this.processGDPRAccessRequest(userId)

    let content: string
    let filename: string

    if (format === 'json') {
      content = JSON.stringify(userData, null, 2)
      filename = `user-${userId}-data.json`
    } else {
      // CSV format (simplified)
      const csv = this.convertToCSV(userData)
      content = csv
      filename = `user-${userId}-data.csv`
    }

    return { content, filename }
  }

  /**
   * Get GDPR request status
   */
  async getGDPRRequestStatus(requestId: string): Promise<GDPRRequest | null> {
    if (!this.initialized) {
      throw new Error('Retention manager not initialized')
    }

    const db = getFirestore()
    const doc = await db.collection('gdpr_requests').doc(requestId).get()

    return (doc.data() as GDPRRequest) || null
  }

  // ========================================================================
  // Reporting
  // ========================================================================

  /**
   * Generate retention report
   */
  async generateRetentionReport(): Promise<Record<string, unknown>> {
    if (!this.initialized) {
      throw new Error('Retention manager not initialized')
    }

    const report: Record<string, unknown> = {
      generatedAt: new Date(),
      classifications: [],
      expiredData: [],
      totalRecords: 0,
    }

    for (const classification of this.classifications.values()) {
      const classificationReport = {
        dataType: classification.dataType,
        classification: classification.classification,
        retentionPolicy: classification.retentionConfig.policy,
        retentionDays: this.getRetentionDays(classification.dataType),
      }

      ;(report.classifications as Record<string, unknown>[]).push(classificationReport)
    }

    return report
  }

  // ========================================================================
  // Private Helper Methods
  // ========================================================================

  private convertToCSV(data: Record<string, unknown>): string {
    const rows: string[] = []

    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        rows.push(`"${key}","${value.length} items"`)
      } else if (typeof value === 'object') {
        rows.push(`"${key}","[Object]"`)
      } else {
        rows.push(`"${key}","${value}"`)
      }
    }

    return rows.join('\n')
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let retentionManagerInstance: DataRetentionManager | null = null

export function getDataRetentionManager(): DataRetentionManager {
  if (!retentionManagerInstance) {
    retentionManagerInstance = new DataRetentionManager()
  }
  return retentionManagerInstance
}

export function resetDataRetentionManager(): void {
  retentionManagerInstance = null
}
