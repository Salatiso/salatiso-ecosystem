/**
 * useSync Manager Hook
 * React hook for managing profile synchronization, offline mode, and sync state
 * Features: sync operations, offline detection, state management, statistics
 * Version: 1.0.0
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { LifeCVProfile } from '@/types/profile'
import { ConflictStrategy } from '@/lib/server/sync-utilities'
import { getOfflineEngine } from '@/lib/offline/offline-engine'

/**
 * Sync operation status
 */
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'offline'

/**
 * Sync statistics
 */
export interface SyncStatistics {
  totalSyncs: number
  successfulSyncs: number
  failedSyncs: number
  averageSyncTime: number
  totalDataSize: number
  lastSyncTime?: number
  syncStreak: number
}

/**
 * Pending operation
 */
export interface PendingOp {
  id: string
  type: 'create' | 'update' | 'delete'
  resource: string
  attempts: number
}

/**
 * Sync response
 */
export interface SyncResponse {
  success: boolean
  conflicts: any[]
  changes: any[]
  version: number
  mergedProfile?: LifeCVProfile
}

/**
 * Hook configuration
 */
export interface UseSyncConfig {
  autoSync?: boolean
  autoSyncInterval?: number
  conflictStrategy?: ConflictStrategy
  maxRetries?: number
  enableOffline?: boolean
  debugMode?: boolean
}

/**
 * useSync Hook
 */
export function useSync(userId: string, config: UseSyncConfig = {}) {
  const {
    autoSync = true,
    autoSyncInterval = 60000,
    conflictStrategy = 'last-write-wins',
    maxRetries = 3,
    enableOffline = true,
    debugMode = false,
  } = config

  // State
  const [status, setStatus] = useState<SyncStatus>('idle')
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [error, setError] = useState<string | null>(null)
  const [conflictCount, setConflictCount] = useState(0)
  const [pendingOperations, setPendingOperations] = useState<PendingOp[]>([])
  const [statistics, setStatistics] = useState<SyncStatistics>({
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    averageSyncTime: 0,
    totalDataSize: 0,
    syncStreak: 0,
  })

  // Refs
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastSyncRef = useRef<number>(0)
  const offlineEngineRef = useRef(enableOffline ? getOfflineEngine() : null)
  const unsubscribeOfflineRef = useRef<(() => void) | null>(null)

  /**
   * Log debug messages
   */
  const debug = useCallback(
    (message: string, data?: any) => {
      if (debugMode) {
        console.log(`[useSyncManager] ${message}`, data)
      }
    },
    [debugMode]
  )

  /**
   * Setup connectivity listeners
   */
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => {
      debug('Device went online')
      setIsOnline(true)
      setStatus('idle')
      // Trigger sync when back online
      performSync(undefined, conflictStrategy)
    }

    const handleOffline = () => {
      debug('Device went offline')
      setIsOnline(false)
      setStatus('offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [debug, conflictStrategy])

  /**
   * Setup offline engine listeners
   */
  useEffect(() => {
    if (!offlineEngineRef.current) return

    unsubscribeOfflineRef.current = offlineEngineRef.current.subscribe((state) => {
      setPendingOperations(
        state.operations.map((op) => ({
          id: op.id,
          type: op.type as 'create' | 'update' | 'delete',
          resource: op.resource,
          attempts: op.attempts,
        }))
      )
      debug('Offline queue updated', state)
    })

    return () => {
      if (unsubscribeOfflineRef.current) {
        unsubscribeOfflineRef.current()
      }
    }
  }, [debug])

  /**
   * Perform sync operation
   */
  const performSync = useCallback(
    async (profile?: LifeCVProfile, strategy: ConflictStrategy = conflictStrategy) => {
      // Skip if already syncing
      if (status === 'syncing') {
        debug('Sync already in progress')
        return
      }

      // Skip if offline and offline mode disabled
      if (!isOnline && !enableOffline) {
        setStatus('offline')
        setError('Device is offline')
        return
      }

      if (!isOnline) {
        debug('Queuing sync operation (offline)')
        if (profile && offlineEngineRef.current) {
          offlineEngineRef.current.queueOperation('sync', 'profile', profile, {
            userId,
            strategy,
          })
        }
        return
      }

      setStatus('syncing')
      setError(null)
      const syncStartTime = Date.now()

      try {
        debug(`Starting sync with strategy: ${strategy}`)

        // Call sync API
        const response = await fetch('/api/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
          },
          body: JSON.stringify({
            userId,
            localProfile: profile,
            strategy,
            timestamp: Date.now(),
          }),
        })

        if (!response.ok) {
          throw new Error(`Sync API returned ${response.status}`)
        }

        const result = (await response.json()) as SyncResponse

        const syncDuration = Date.now() - syncStartTime

        // Update statistics
        setStatistics((prev) => ({
          ...prev,
          totalSyncs: prev.totalSyncs + 1,
          successfulSyncs: result.success ? prev.successfulSyncs + 1 : prev.successfulSyncs,
          failedSyncs: result.success ? prev.failedSyncs : prev.failedSyncs + 1,
          averageSyncTime:
            (prev.averageSyncTime * prev.totalSyncs + syncDuration) / (prev.totalSyncs + 1),
          syncStreak: result.success ? prev.syncStreak + 1 : 0,
          lastSyncTime: Date.now(),
        }))

        setConflictCount(result.conflicts.length)
        lastSyncRef.current = Date.now()

        if (result.success) {
          debug('Sync successful', result)
          setStatus('success')

          // Process offline queue if online
          if (offlineEngineRef.current && offlineEngineRef.current.isConnected()) {
            await offlineEngineRef.current.processQueue(async (op) => {
              debug(`Processing offline operation: ${op.id}`)
              // Operations would be synced through API
            })
          }

          // Clear error after success
          setTimeout(() => setError(null), 2000)
        } else {
          debug('Sync completed with conflicts', result)
          setStatus('success') // Partial success
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown sync error'
        debug('Sync failed', err)

        // Update failure statistics
        setStatistics((prev) => ({
          ...prev,
          failedSyncs: prev.failedSyncs + 1,
          syncStreak: 0,
        }))

        setStatus('error')
        setError(errorMessage)

        // Queue for offline if enabled
        if (enableOffline && profile && offlineEngineRef.current) {
          offlineEngineRef.current.queueOperation('sync', 'profile', profile)
        }
      }
    },
    [userId, status, isOnline, conflictStrategy, enableOffline, debug]
  )

  /**
   * Start auto-sync
   */
  useEffect(() => {
    if (!autoSync || status === 'offline') return

    syncTimerRef.current = setInterval(() => {
      debug(`Auto-sync triggered (interval: ${autoSyncInterval}ms)`)
      performSync(undefined, conflictStrategy)
    }, autoSyncInterval)

    return () => {
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current)
      }
    }
  }, [autoSync, autoSyncInterval, conflictStrategy, performSync, debug, status])

  /**
   * Queue operation for offline mode
   */
  const queueOperation = useCallback(
    (type: 'create' | 'update' | 'delete', resource: string, data: any) => {
      if (!offlineEngineRef.current) {
        throw new Error('Offline engine not enabled')
      }

      const op = offlineEngineRef.current.queueOperation(type, resource, data, { userId })
      debug(`Operation queued: ${op.id}`, { type, resource })

      setPendingOperations((prev) => [
        ...prev,
        {
          id: op.id,
          type,
          resource,
          attempts: 0,
        },
      ])
    },
    [userId, debug]
  )

  /**
   * Cancel pending operation
   */
  const cancelOperation = useCallback((operationId: string) => {
    if (!offlineEngineRef.current) return

    const removed = offlineEngineRef.current.removeOperation(operationId)
    if (removed) {
      debug(`Operation cancelled: ${operationId}`)
      setPendingOperations((prev) => prev.filter((op) => op.id !== operationId))
    }
  }, [debug])

  /**
   * Get sync status
   */
  const getSyncStatus = useCallback(() => {
    return {
      status,
      isOnline,
      error,
      conflictCount,
      pendingOperations,
      lastSyncTime: lastSyncRef.current,
    }
  }, [status, isOnline, error, conflictCount, pendingOperations])

  /**
   * Get offline statistics
   */
  const getOfflineStats = useCallback(() => {
    if (!offlineEngineRef.current) {
      return null
    }

    return offlineEngineRef.current.getQueueStatistics()
  }, [])

  /**
   * Retry failed sync
   */
  const retrySync = useCallback(
    async (profile?: LifeCVProfile) => {
      debug('Retrying sync')
      await performSync(profile, conflictStrategy)
    },
    [performSync, conflictStrategy, debug]
  )

  /**
   * Reset sync state
   */
  const resetSync = useCallback(() => {
    setStatus('idle')
    setError(null)
    setConflictCount(0)
    setPendingOperations([])
    debug('Sync state reset')
  }, [debug])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current)
      }
      if (unsubscribeOfflineRef.current) {
        unsubscribeOfflineRef.current()
      }
    }
  }, [])

  return {
    // State
    status,
    isOnline,
    error,
    conflictCount,
    pendingOperations,
    statistics,

    // Methods
    performSync,
    queueOperation,
    cancelOperation,
    retrySync,
    resetSync,

    // Getters
    getSyncStatus,
    getOfflineStats,
  }
}

/**
 * useSync with auto-cleanup
 */
export function useSyncWithCleanup(userId: string, config?: UseSyncConfig) {
  const sync = useSync(userId, config)

  useEffect(() => {
    return () => {
      // Cleanup
      if (sync.status === 'syncing') {
        sync.resetSync()
      }
    }
  }, [sync])

  return sync
}

/**
 * Export hook
 */
export default useSync
