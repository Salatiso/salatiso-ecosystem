/**
 * Sync Server Utilities
 * Advanced server-side synchronization layer for bidirectional data sync
 * Features: conflict resolution, version management, change tracking, sync history
 * Version: 1.0.0
 */

import { ProfileSyncData, ProfilePicture } from '@/types/profile'
import { Timestamp } from 'firebase/firestore'

/**
 * Sync metadata tracking all synchronization events and state
 */
export interface SyncMetadata {
  lastSyncTime: number
  syncCount: number
  conflictCount: number
  errorCount: number
  averageSyncTime: number
  lastConflictStrategy: ConflictStrategy
  pendingOperations: number
  syncVersion: number
}

/**
 * Conflict resolution strategies
 */
export type ConflictStrategy = 'last-write-wins' | 'local-wins' | 'remote-wins' | 'merge' | 'manual'

/**
 * Change tracking for version management
 */
export interface ChangeRecord {
  field: string
  oldValue: any
  newValue: any
  timestamp: number
  syncVersion: number
  operationType: 'create' | 'update' | 'delete'
  changeHash: string
}

/**
 * Sync event for audit trail
 */
export interface SyncEvent {
  id: string
  timestamp: number
  type: 'sync-request' | 'sync-success' | 'sync-failure' | 'conflict-resolved' | 'offline-stored' | 'offline-reconciled'
  userId: string
  dataSize: number
  syncDuration: number
  conflictCount: number
  metadata: Record<string, any>
}

/**
 * Sync result from server
 */
export interface SyncResult {
  success: boolean
  syncedAt: number
  version: number
  conflicts: ConflictResolution[]
  changes: ChangeRecord[]
  metadata: SyncMetadata
  errors: SyncError[]
}

/**
 * Conflict resolution record
 */
export interface ConflictResolution {
  field: string
  localValue: any
  remoteValue: any
  resolvedValue: any
  strategy: ConflictStrategy
  timestamp: number
  resolved: boolean
}

/**
 * Sync error tracking
 */
export interface SyncError {
  code: string
  message: string
  field?: string
  timestamp: number
  recoverable: boolean
}

/**
 * Version information
 */
export interface VersionInfo {
  current: number
  previous: number
  changesSinceVersion: ChangeRecord[]
  createdAt: number
  modifiedAt: number
  hash: string
}

/**
 * Calculates a hash of the profile data for change detection
 */
export function calculateProfileHash(profile: any): string {
  try {
    const normalized = JSON.stringify(profile, Object.keys(profile).sort())
    let hash = 0
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16)
  } catch (error) {
    return 'error'
  }
}

/**
 * Detects changes between two profile versions
 */
export function detectChanges(
  localProfile: any,
  remoteProfile: any,
  version: number
): ChangeRecord[] {
  const changes: ChangeRecord[] = []
  const timestamp = Date.now()

  if (!remoteProfile) {
    return changes
  }

  const allKeys = new Set([...Object.keys(localProfile), ...Object.keys(remoteProfile)])

  for (const key of allKeys) {
    const localValue = localProfile[key]
    const remoteValue = remoteProfile[key]

    // Skip if values are identical
    if (JSON.stringify(localValue) === JSON.stringify(remoteValue)) {
      continue
    }

    // Determine operation type
    let operationType: 'create' | 'update' | 'delete' = 'update'
    if (localValue === undefined || localValue === null) {
      operationType = 'delete'
    } else if (remoteValue === undefined || remoteValue === null) {
      operationType = 'create'
    }

    const changeHash = calculateProfileHash({ key, localValue, remoteValue })

    changes.push({
      field: key,
      oldValue: remoteValue,
      newValue: localValue,
      timestamp,
      syncVersion: version,
      operationType,
      changeHash,
    })
  }

  return changes
}

/**
 * Resolves conflicts using specified strategy
 */
export function resolveConflict(
  field: string,
  localValue: any,
  remoteValue: any,
  strategy: ConflictStrategy,
  localTimestamp: number,
  remoteTimestamp: number
): ConflictResolution {
  let resolvedValue = localValue
  const timestamp = Date.now()

  switch (strategy) {
    case 'last-write-wins':
      resolvedValue = remoteTimestamp > localTimestamp ? remoteValue : localValue
      break

    case 'local-wins':
      resolvedValue = localValue
      break

    case 'remote-wins':
      resolvedValue = remoteValue
      break

    case 'merge':
      resolvedValue = mergeValues(localValue, remoteValue)
      break

    case 'manual':
      // Manual resolution - keep local, flag for review
      resolvedValue = localValue
      break

    default:
      resolvedValue = localValue
  }

  return {
    field,
    localValue,
    remoteValue,
    resolvedValue,
    strategy,
    timestamp,
    resolved: true,
  }
}

/**
 * Merges two values intelligently
 */
export function mergeValues(local: any, remote: any): any {
  // If both are objects (not arrays), perform deep merge
  if (typeof local === 'object' && typeof remote === 'object' && !Array.isArray(local) && !Array.isArray(remote)) {
    const merged: any = { ...remote, ...local }
    return merged
  }

  // If both are arrays, merge unique items
  if (Array.isArray(local) && Array.isArray(remote)) {
    const merged = [...remote]
    for (const item of local) {
      const itemStr = JSON.stringify(item)
      if (!merged.some((m: any) => JSON.stringify(m) === itemStr)) {
        merged.push(item)
      }
    }
    return merged
  }

  // Otherwise, prefer local value
  return local
}

/**
 * Resolves multiple conflicts in a profile sync
 */
export function resolveConflicts(
  localProfile: any,
  remoteProfile: any,
  strategy: ConflictStrategy,
  syncVersion: number
): ConflictResolution[] {
  const conflicts: ConflictResolution[] = []

  if (!remoteProfile) {
    return conflicts
  }

  const allKeys = new Set([...Object.keys(localProfile), ...Object.keys(remoteProfile)])

  for (const key of allKeys) {
    const localValue = localProfile[key]
    const remoteValue = remoteProfile[key]

    // Skip if values are identical
    if (JSON.stringify(localValue) === JSON.stringify(remoteValue)) {
      continue
    }

    const localTimestamp = localProfile[`${key}_timestamp`] || Date.now()
    const remoteTimestamp = remoteProfile[`${key}_timestamp`] || 0

    const resolution = resolveConflict(key, localValue, remoteValue, strategy, localTimestamp, remoteTimestamp)

    conflicts.push(resolution)
  }

  return conflicts
}

/**
 * Creates a version checkpoint
 */
export function createVersionCheckpoint(profile: any, version: number): VersionInfo {
  const hash = calculateProfileHash(profile)
  const now = Date.now()

  return {
    current: version,
    previous: version - 1,
    changesSinceVersion: [],
    createdAt: now,
    modifiedAt: now,
    hash,
  }
}

/**
 * Validates sync compatibility between versions
 */
export function validateSyncCompatibility(
  localVersion: number,
  remoteVersion: number,
  maxVersionDifference: number = 10
): { compatible: boolean; reason?: string } {
  if (Math.abs(localVersion - remoteVersion) > maxVersionDifference) {
    return {
      compatible: false,
      reason: `Version difference (${Math.abs(localVersion - remoteVersion)}) exceeds maximum allowed (${maxVersionDifference})`,
    }
  }

  return { compatible: true }
}

/**
 * Generates a sync result
 */
export function generateSyncResult(
  success: boolean,
  version: number,
  conflicts: ConflictResolution[],
  changes: ChangeRecord[],
  metadata: SyncMetadata,
  errors: SyncError[] = []
): SyncResult {
  return {
    success,
    syncedAt: Date.now(),
    version,
    conflicts,
    changes,
    metadata,
    errors,
  }
}

/**
 * Initializes sync metadata
 */
export function initializeSyncMetadata(): SyncMetadata {
  return {
    lastSyncTime: Date.now(),
    syncCount: 0,
    conflictCount: 0,
    errorCount: 0,
    averageSyncTime: 0,
    lastConflictStrategy: 'last-write-wins',
    pendingOperations: 0,
    syncVersion: 1,
  }
}

/**
 * Updates sync metadata after sync operation
 */
export function updateSyncMetadata(
  metadata: SyncMetadata,
  syncDuration: number,
  conflictCount: number,
  strategy: ConflictStrategy,
  success: boolean
): SyncMetadata {
  const updated = { ...metadata }

  updated.lastSyncTime = Date.now()
  updated.syncCount++

  if (success) {
    const totalTime = metadata.averageSyncTime * (metadata.syncCount - 1) + syncDuration
    updated.averageSyncTime = totalTime / metadata.syncCount
  } else {
    updated.errorCount++
  }

  updated.conflictCount += conflictCount
  updated.lastConflictStrategy = strategy

  return updated
}

/**
 * Creates a sync event for audit trail
 */
export function createSyncEvent(
  userId: string,
  type: SyncEvent['type'],
  dataSize: number,
  syncDuration: number,
  conflictCount: number,
  metadata: Record<string, any> = {}
): SyncEvent {
  return {
    id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    type,
    userId,
    dataSize,
    syncDuration,
    conflictCount,
    metadata,
  }
}

/**
 * Validates profile data for sync
 */
export function validateProfileForSync(profile: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!profile) {
    errors.push('Profile is required')
  }

  if (profile.userId && typeof profile.userId !== 'string') {
    errors.push('userId must be a string')
  }

  if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.push('Invalid email format')
  }

  if (profile.firstName && typeof profile.firstName !== 'string') {
    errors.push('firstName must be a string')
  }

  if (profile.lastName && typeof profile.lastName !== 'string') {
    errors.push('lastName must be a string')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Calculates data size in bytes
 */
export function calculateDataSize(data: any): number {
  try {
    return new Blob([JSON.stringify(data)]).size
  } catch {
    return 0
  }
}

/**
 * Performs bidirectional sync with conflict resolution
 */
export function performSync(
  localProfile: ProfileSyncData,
  remoteProfile: any,
  strategy: ConflictStrategy = 'last-write-wins',
  currentVersion: number = 1
): SyncResult {
  const startTime = Date.now()
  const errors: SyncError[] = []

  // Validate profiles
  const localValidation = validateProfileForSync(localProfile)
  if (!localValidation.valid) {
    localValidation.errors.forEach((error) => {
      errors.push({
        code: 'VALIDATION_ERROR',
        message: error,
        timestamp: Date.now(),
        recoverable: true,
      })
    })
  }

  // Detect changes
  const changes = detectChanges(localProfile, remoteProfile, currentVersion)

  // Resolve conflicts
  const conflicts = resolveConflicts(localProfile, remoteProfile, strategy, currentVersion)

  // Update metadata
  let metadata = initializeSyncMetadata()
  const syncDuration = Date.now() - startTime
  metadata = updateSyncMetadata(metadata, syncDuration, conflicts.length, strategy, errors.length === 0)

  // Generate result
  const result = generateSyncResult(
    errors.length === 0,
    currentVersion + 1,
    conflicts,
    changes,
    metadata,
    errors
  )

  return result
}

/**
 * Builds a merged profile from local and remote versions
 */
export function buildMergedProfile(
  localProfile: ProfileSyncData,
  remoteProfile: any,
  conflicts: ConflictResolution[]
): ProfileSyncData {
  const merged: any = { ...remoteProfile }

  // Apply local changes
  Object.keys(localProfile).forEach((key) => {
    merged[key] = localProfile[key]
  })

  // Apply conflict resolutions
  conflicts.forEach((conflict) => {
    merged[conflict.field] = conflict.resolvedValue
  })

  return merged as ProfileSyncData
}

/**
 * Exports sync utilities
 */
export default {
  calculateProfileHash,
  detectChanges,
  resolveConflict,
  resolveConflicts,
  mergeValues,
  createVersionCheckpoint,
  validateSyncCompatibility,
  generateSyncResult,
  initializeSyncMetadata,
  updateSyncMetadata,
  createSyncEvent,
  validateProfileForSync,
  calculateDataSize,
  performSync,
  buildMergedProfile,
}
