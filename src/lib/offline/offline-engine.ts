/**
 * Offline Support Engine
 * Manages offline-first synchronization with local queue and reconciliation
 * Features: queue management, retry logic, connectivity detection, data persistence
 * Version: 1.0.0
 */

import { LifeCVProfile } from '@/types/profile'

/**
 * Pending operation in offline queue
 */
export interface PendingOperation {
  id: string
  type: 'create' | 'update' | 'delete' | 'sync'
  resource: string
  data: any
  timestamp: number
  attempts: number
  maxAttempts: number
  lastError?: string
  retryAfter?: number
  metadata: Record<string, any>
}

/**
 * Offline queue state
 */
export interface OfflineQueueState {
  operations: PendingOperation[]
  lastProcessedTime: number
  isPaused: boolean
  retryPolicy: RetryPolicy
  isOnline: boolean
  queueVersion: number
}

/**
 * Retry policy configuration
 */
export interface RetryPolicy {
  maxAttempts: number
  initialDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
  jitterFactor: number
}

/**
 * Reconciliation result
 */
export interface ReconciliationResult {
  success: boolean
  processedCount: number
  failedCount: number
  syncedCount: number
  timestamp: number
  errors: string[]
  timeElapsed: number
}

/**
 * Offline engine state listener callback
 */
export type OfflineStateListener = (state: OfflineQueueState) => void

/**
 * Default retry policy
 */
export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 5,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  jitterFactor: 0.1,
}

/**
 * Local storage keys
 */
const STORAGE_KEYS = {
  QUEUE: 'offline_queue',
  STATE: 'offline_state',
  METADATA: 'offline_metadata',
}

/**
 * Offline Support Engine
 */
export class OfflineEngine {
  private queue: PendingOperation[] = []
  private isOnline: boolean = navigator.onLine || true
  private stateListeners: Set<OfflineStateListener> = new Set()
  private retryPolicy: RetryPolicy = DEFAULT_RETRY_POLICY
  private processingTimer: NodeJS.Timeout | null = null
  private connectivity: 'online' | 'offline' | 'unknown' = 'unknown'

  constructor(retryPolicy: Partial<RetryPolicy> = {}) {
    this.retryPolicy = { ...DEFAULT_RETRY_POLICY, ...retryPolicy }
    this.setupConnectivityListeners()
    this.loadQueueFromStorage()
  }

  /**
   * Setup online/offline event listeners
   */
  private setupConnectivityListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.setConnectivity(true)
      })

      window.addEventListener('offline', () => {
        this.setConnectivity(false)
      })
    }
  }

  /**
   * Set connectivity status and notify listeners
   */
  private setConnectivity(online: boolean): void {
    const wasOnline = this.isOnline
    this.isOnline = online
    this.connectivity = online ? 'online' : 'offline'

    if (!wasOnline && online) {
      // Went from offline to online - trigger reconciliation
      this.processQueue()
    }

    this.notifyStateChange()
  }

  /**
   * Check if engine is online
   */
  public isConnected(): boolean {
    return this.isOnline
  }

  /**
   * Get current connectivity status
   */
  public getConnectivity(): 'online' | 'offline' | 'unknown' {
    return this.connectivity
  }

  /**
   * Add operation to queue
   */
  public queueOperation(
    type: PendingOperation['type'],
    resource: string,
    data: any,
    metadata: Record<string, any> = {}
  ): PendingOperation {
    const operation: PendingOperation = {
      id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      resource,
      data,
      timestamp: Date.now(),
      attempts: 0,
      maxAttempts: this.retryPolicy.maxAttempts,
      metadata,
    }

    this.queue.push(operation)
    this.saveQueueToStorage()
    this.notifyStateChange()

    return operation
  }

  /**
   * Get current queue
   */
  public getQueue(): PendingOperation[] {
    return [...this.queue]
  }

  /**
   * Get queue size
   */
  public getQueueSize(): number {
    return this.queue.length
  }

  /**
   * Get pending operations by type
   */
  public getPendingOperations(type?: PendingOperation['type']): PendingOperation[] {
    if (!type) {
      return [...this.queue]
    }
    return this.queue.filter((op) => op.type === type)
  }

  /**
   * Remove operation from queue
   */
  public removeOperation(operationId: string): boolean {
    const index = this.queue.findIndex((op) => op.id === operationId)
    if (index > -1) {
      this.queue.splice(index, 1)
      this.saveQueueToStorage()
      this.notifyStateChange()
      return true
    }
    return false
  }

  /**
   * Clear entire queue
   */
  public clearQueue(): void {
    this.queue = []
    this.saveQueueToStorage()
    this.notifyStateChange()
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(attempts: number): number {
    const exponentialDelay = this.retryPolicy.initialDelayMs * Math.pow(this.retryPolicy.backoffMultiplier, attempts)
    const cappedDelay = Math.min(exponentialDelay, this.retryPolicy.maxDelayMs)
    const jitter = cappedDelay * this.retryPolicy.jitterFactor * Math.random()
    return cappedDelay + jitter
  }

  /**
   * Mark operation for retry
   */
  public markForRetry(operationId: string, error?: string): boolean {
    const operation = this.queue.find((op) => op.id === operationId)
    if (!operation) {
      return false
    }

    operation.attempts++
    operation.lastError = error

    if (operation.attempts < operation.maxAttempts) {
      operation.retryAfter = Date.now() + this.calculateRetryDelay(operation.attempts)
      this.saveQueueToStorage()
      this.notifyStateChange()
      return true
    }

    return false
  }

  /**
   * Process queue and sync pending operations
   */
  public async processQueue(
    syncFn?: (operation: PendingOperation) => Promise<void>
  ): Promise<ReconciliationResult> {
    const startTime = Date.now()
    const result: ReconciliationResult = {
      success: true,
      processedCount: 0,
      failedCount: 0,
      syncedCount: 0,
      timestamp: Date.now(),
      errors: [],
      timeElapsed: 0,
    }

    if (!this.isOnline) {
      result.success = false
      result.errors.push('Device is offline')
      return result
    }

    for (const operation of this.queue) {
      // Skip if not ready for retry
      if (operation.retryAfter && operation.retryAfter > Date.now()) {
        continue
      }

      try {
        if (syncFn) {
          await syncFn(operation)
        }

        result.processedCount++
        result.syncedCount++
        this.removeOperation(operation.id)
      } catch (error) {
        result.processedCount++
        result.failedCount++

        const errorMessage = error instanceof Error ? error.message : String(error)
        const retryable = this.markForRetry(operation.id, errorMessage)

        if (!retryable) {
          result.errors.push(`Operation ${operation.id} failed: ${errorMessage}`)
          this.removeOperation(operation.id)
        }
      }
    }

    result.timeElapsed = Date.now() - startTime
    this.notifyStateChange()
    return result
  }

  /**
   * Start automatic queue processing
   */
  public startAutoProcessing(interval: number = 30000, syncFn?: (operation: PendingOperation) => Promise<void>): void {
    if (this.processingTimer) {
      clearInterval(this.processingTimer)
    }

    this.processingTimer = setInterval(async () => {
      if (this.isOnline && this.queue.length > 0) {
        await this.processQueue(syncFn)
      }
    }, interval)
  }

  /**
   * Stop automatic queue processing
   */
  public stopAutoProcessing(): void {
    if (this.processingTimer) {
      clearInterval(this.processingTimer)
      this.processingTimer = null
    }
  }

  /**
   * Pause queue processing
   */
  public pauseProcessing(): void {
    this.stopAutoProcessing()
  }

  /**
   * Resume queue processing
   */
  public resumeProcessing(interval: number = 30000, syncFn?: (operation: PendingOperation) => Promise<void>): void {
    this.startAutoProcessing(interval, syncFn)
  }

  /**
   * Save queue to local storage
   */
  private saveQueueToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(this.queue))
      } catch (error) {
        console.warn('Failed to save offline queue to storage:', error)
      }
    }
  }

  /**
   * Load queue from local storage
   */
  private loadQueueFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.QUEUE)
        if (stored) {
          this.queue = JSON.parse(stored)
        }
      } catch (error) {
        console.warn('Failed to load offline queue from storage:', error)
      }
    }
  }

  /**
   * Get current state
   */
  public getState(): OfflineQueueState {
    return {
      operations: [...this.queue],
      lastProcessedTime: Date.now(),
      isPaused: this.processingTimer === null,
      retryPolicy: this.retryPolicy,
      isOnline: this.isOnline,
      queueVersion: 1,
    }
  }

  /**
   * Subscribe to state changes
   */
  public subscribe(listener: OfflineStateListener): () => void {
    this.stateListeners.add(listener)

    // Return unsubscribe function
    return () => {
      this.stateListeners.delete(listener)
    }
  }

  /**
   * Notify all listeners of state change
   */
  private notifyStateChange(): void {
    const state = this.getState()
    this.stateListeners.forEach((listener) => {
      try {
        listener(state)
      } catch (error) {
        console.error('Error in offline state listener:', error)
      }
    })
  }

  /**
   * Get queue statistics
   */
  public getQueueStatistics() {
    const total = this.queue.length
    const byType = {
      create: this.queue.filter((op) => op.type === 'create').length,
      update: this.queue.filter((op) => op.type === 'update').length,
      delete: this.queue.filter((op) => op.type === 'delete').length,
      sync: this.queue.filter((op) => op.type === 'sync').length,
    }

    const totalAttempts = this.queue.reduce((sum, op) => sum + op.attempts, 0)
    const avgAttempts = total > 0 ? totalAttempts / total : 0

    return {
      total,
      byType,
      totalAttempts,
      avgAttempts,
      oldestOperation: this.queue.length > 0 ? Math.min(...this.queue.map((op) => op.timestamp)) : null,
      newestOperation: this.queue.length > 0 ? Math.max(...this.queue.map((op) => op.timestamp)) : null,
    }
  }

  /**
   * Export queue for debugging
   */
  public exportQueue(): string {
    return JSON.stringify(this.queue, null, 2)
  }

  /**
   * Import queue from JSON
   */
  public importQueue(json: string): void {
    try {
      this.queue = JSON.parse(json)
      this.saveQueueToStorage()
      this.notifyStateChange()
    } catch (error) {
      console.error('Failed to import queue:', error)
    }
  }

  /**
   * Destroy engine and cleanup
   */
  public destroy(): void {
    this.stopAutoProcessing()
    this.stateListeners.clear()
  }
}

/**
 * Create singleton instance
 */
let offlineEngineInstance: OfflineEngine | null = null

/**
 * Get or create offline engine instance
 */
export function getOfflineEngine(retryPolicy?: Partial<RetryPolicy>): OfflineEngine {
  if (!offlineEngineInstance) {
    offlineEngineInstance = new OfflineEngine(retryPolicy)
  }
  return offlineEngineInstance
}

/**
 * Reset offline engine (for testing)
 */
export function resetOfflineEngine(): void {
  if (offlineEngineInstance) {
    offlineEngineInstance.destroy()
    offlineEngineInstance = null
  }
}

/**
 * Export offline engine
 */
export default {
  OfflineEngine,
  getOfflineEngine,
  resetOfflineEngine,
  DEFAULT_RETRY_POLICY,
}
