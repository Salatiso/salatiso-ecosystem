/**
 * Sync Status Component
 * Real-time synchronization status display with conflict indicators
 * Features: status badges, pending ops, online indicator, sync metrics
 * Version: 1.0.0
 */

'use client'

import React, { useState, useEffect } from 'react'
import useSync from '@/hooks/useSyncManager'

interface SyncStatusProps {
  userId: string
  showMetrics?: boolean
  showPendingOps?: boolean
  autoHideSuccess?: boolean
  autoHideDuration?: number
  compact?: boolean
  className?: string
}

/**
 * Sync Status Component
 */
export const SyncStatus: React.FC<SyncStatusProps> = ({
  userId,
  showMetrics = true,
  showPendingOps = true,
  autoHideSuccess = true,
  autoHideDuration = 3000,
  compact = false,
  className = '',
}) => {
  const sync = useSync(userId)
  const [showSuccess, setShowSuccess] = useState(true)

  // Auto-hide success message
  useEffect(() => {
    if (autoHideSuccess && sync.status === 'success') {
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, autoHideDuration)

      return () => clearTimeout(timer)
    }
  }, [sync.status, autoHideSuccess, autoHideDuration])

  /**
   * Get status badge color
   */
  const getStatusColor = () => {
    switch (sync.status) {
      case 'syncing':
        return 'bg-blue-100 text-blue-700'
      case 'success':
        return 'bg-green-100 text-green-700'
      case 'error':
        return 'bg-red-100 text-red-700'
      case 'offline':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  /**
   * Get status icon
   */
  const getStatusIcon = () => {
    switch (sync.status) {
      case 'syncing':
        return (
          <svg className="inline-block w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )
      case 'success':
        return <span className="inline-block w-4 h-4 mr-2">✓</span>
      case 'error':
        return <span className="inline-block w-4 h-4 mr-2">✕</span>
      case 'offline':
        return <span className="inline-block w-4 h-4 mr-2">⊗</span>
      default:
        return null
    }
  }

  /**
   * Get status text
   */
  const getStatusText = () => {
    switch (sync.status) {
      case 'syncing':
        return 'Syncing...'
      case 'success':
        return 'Synced'
      case 'error':
        return 'Sync Failed'
      case 'offline':
        return 'Offline Mode'
      default:
        return 'Ready'
    }
  }

  // Compact mode
  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor()} ${className}`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
        {sync.conflictCount > 0 && <span className="ml-1 font-bold">({sync.conflictCount})</span>}
      </div>
    )
  }

  // Full view
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Sync Status</h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>
      </div>

      {/* Online/Offline Status */}
      <div className="mb-4 flex items-center gap-2">
        <span className={`inline-block w-3 h-3 rounded-full ${sync.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-gray-600">
          {sync.isOnline ? 'Connected' : 'Offline'} • Last sync:{' '}
          {sync.statistics.lastSyncTime
            ? new Date(sync.statistics.lastSyncTime).toLocaleTimeString()
            : 'Never'}
        </span>
      </div>

      {/* Error Message */}
      {sync.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <strong>Error:</strong> {sync.error}
        </div>
      )}

      {/* Conflict Count */}
      {sync.conflictCount > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
          <strong>Conflicts:</strong> {sync.conflictCount} conflict{sync.conflictCount !== 1 ? 's' : ''} detected
        </div>
      )}

      {/* Metrics */}
      {showMetrics && (
        <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-600">Total Syncs</div>
            <div className="text-lg font-bold text-gray-900">{sync.statistics.totalSyncs}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-600">Success Rate</div>
            <div className="text-lg font-bold text-gray-900">
              {sync.statistics.totalSyncs > 0
                ? (
                    (sync.statistics.successfulSyncs / sync.statistics.totalSyncs) *
                    100
                  ).toFixed(0)
                : 0}
              %
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-600">Avg Sync Time</div>
            <div className="text-lg font-bold text-gray-900">{Math.round(sync.statistics.averageSyncTime)}ms</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-600">Sync Streak</div>
            <div className="text-lg font-bold text-green-600">{sync.statistics.syncStreak}</div>
          </div>
        </div>
      )}

      {/* Pending Operations */}
      {showPendingOps && sync.pendingOperations.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">Pending Operations</div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {sync.pendingOperations.map((op) => (
              <div key={op.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                <div>
                  <span className="font-mono text-gray-600">{op.resource}</span>
                  <span className="ml-2 text-gray-500">({op.type})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Attempts: {op.attempts}</span>
                  <button
                    onClick={() => sync.cancelOperation(op.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offline Statistics */}
      {!sync.isOnline && sync.pendingOperations.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <strong>Offline Queue:</strong> {sync.pendingOperations.length} operation
          {sync.pendingOperations.length !== 1 ? 's' : ''} waiting to sync
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {sync.status === 'error' && (
          <button
            onClick={() => sync.retrySync()}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
          >
            Retry Sync
          </button>
        )}
        <button
          onClick={() => sync.resetSync()}
          className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition"
        >
          Reset
        </button>
        {sync.pendingOperations.length > 0 && sync.isOnline && (
          <button
            onClick={() => sync.performSync()}
            className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
          >
            Sync Now
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Compact Sync Indicator Component
 */
export const SyncIndicator: React.FC<{ userId: string; className?: string }> = ({ userId, className = '' }) => {
  const sync = useSync(userId)

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
        sync.isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      } ${className}`}
    >
      <span className={`inline-block w-2 h-2 rounded-full ${sync.isOnline ? 'bg-green-600' : 'bg-red-600'}`} />
      <span>{sync.isOnline ? 'Synced' : 'Offline'}</span>
      {sync.conflictCount > 0 && (
        <>
          <span>•</span>
          <span className="text-yellow-600">{sync.conflictCount} conflicts</span>
        </>
      )}
    </div>
  )
}

/**
 * Sync Status Badge Component
 */
export const SyncBadge: React.FC<{ userId: string; className?: string }> = ({ userId, className = '' }) => {
  const sync = useSync(userId)

  const statusClasses: Record<typeof sync.status, string> = {
    idle: 'bg-gray-100 text-gray-700',
    syncing: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    offline: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[sync.status]} ${className}`}>
      <span className={`inline-block w-2 h-2 rounded-full ${sync.status === 'syncing' ? 'animate-pulse' : ''}`} />
      {sync.status === 'syncing' ? 'Syncing' : sync.status === 'success' ? 'Synced' : sync.status === 'error' ? 'Error' : 'Offline'}
    </span>
  )
}

/**
 * Export components
 */
export default SyncStatus
