/**
 * LifeSync Bidirectional Sync
 * 
 * Handles bidirectional synchronization with LifeSync backend:
 * - Profile data sync
 * - Conflict resolution
 * - Auto-sync on background
 * - Retry logic
 * - Change tracking
 * - Offline support
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  writeBatch,
  addDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/config/firebase'

/**
 * Sync status enum
 */
export enum SyncStatus {
  IDLE = 'idle',
  SYNCING = 'syncing',
  SUCCESS = 'success',
  ERROR = 'error',
  CONFLICT = 'conflict',
  OFFLINE = 'offline',
}

/**
 * Conflict resolution strategy
 */
export enum ConflictStrategy {
  LAST_WRITE_WINS = 'last-write-wins',
  LOCAL_WINS = 'local-wins',
  REMOTE_WINS = 'remote-wins',
  MERGE = 'merge',
}

/**
 * Sync event type
 */
export interface SyncEvent {
  id: string
  userId: string
  timestamp: Date
  status: SyncStatus
  action: 'upload' | 'download' | 'merge' | 'conflict'
  field: string
  localValue: any
  remoteValue: any
  resolvedValue: any
  error?: string
}

/**
 * Sync metadata
 */
export interface SyncMetadata {
  lastSyncTime: Date
  nextSyncTime: Date
  syncCount: number
  conflictCount: number
  errorCount: number
  status: SyncStatus
  strategy: ConflictStrategy
}

/**
 * Profile sync data
 */
export interface ProfileSyncData {
  id: string
  userId: string
  personalInfo: any
  professionalInfo: any
  experience: any[]
  education: any[]
  skills: any[]
  certifications: any[]
  pictures: any[]
  version: number
  lastModified: Date
  lastModifiedBy: string
}

/**
 * LifeSync configuration
 */
export const LIFESYNC_CONFIG = {
  SYNC_INTERVAL: 60 * 1000, // 60 seconds
  AUTO_SYNC_ENABLED: true,
  CONFLICT_STRATEGY: ConflictStrategy.LAST_WRITE_WINS,
  MAX_RETRIES: 3,
  RETRY_DELAY: 5000, // 5 seconds
} as const

/**
 * Collection name
 */
const SYNC_COLLECTION = 'profile-sync'
const EVENTS_COLLECTION = 'sync-events'

/**
 * Initialize sync metadata
 */
export async function initializeSyncMetadata(userId: string): Promise<void> {
  const metadataRef = doc(db, SYNC_COLLECTION, `${userId}-metadata`)

  const metadata: SyncMetadata = {
    lastSyncTime: new Date(),
    nextSyncTime: new Date(Date.now() + LIFESYNC_CONFIG.SYNC_INTERVAL),
    syncCount: 0,
    conflictCount: 0,
    errorCount: 0,
    status: SyncStatus.IDLE,
    strategy: LIFESYNC_CONFIG.CONFLICT_STRATEGY,
  }

  try {
    await setDoc(metadataRef, metadata)
  } catch (error) {
    console.error('Failed to initialize sync metadata:', error)
  }
}

/**
 * Get sync metadata
 */
export async function getSyncMetadata(userId: string): Promise<SyncMetadata | null> {
  try {
    const metadataRef = doc(db, SYNC_COLLECTION, `${userId}-metadata`)
    const snapshot = await getDoc(metadataRef)

    if (!snapshot.exists()) {
      return null
    }

    const data = snapshot.data()
    return {
      ...data,
      lastSyncTime: data.lastSyncTime?.toDate?.() || new Date(),
      nextSyncTime: data.nextSyncTime?.toDate?.() || new Date(),
    } as SyncMetadata
  } catch (error) {
    console.error('Failed to get sync metadata:', error)
    return null
  }
}

/**
 * Update sync metadata
 */
export async function updateSyncMetadata(
  userId: string,
  updates: Partial<SyncMetadata>
): Promise<void> {
  try {
    const metadataRef = doc(db, SYNC_COLLECTION, `${userId}-metadata`)
    await updateDoc(metadataRef, {
      ...updates,
      lastSyncTime: new Date(),
    })
  } catch (error) {
    console.error('Failed to update sync metadata:', error)
  }
}

/**
 * Record sync event
 */
export async function recordSyncEvent(event: Omit<SyncEvent, 'id'>): Promise<void> {
  try {
    const eventRef = collection(db, EVENTS_COLLECTION)
    await addDoc(eventRef, {
      ...event,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error('Failed to record sync event:', error)
  }
}

/**
 * Resolve conflict between local and remote values
 */
export function resolveConflict(
  localValue: any,
  remoteValue: any,
  localTimestamp: Date,
  remoteTimestamp: Date,
  strategy: ConflictStrategy = LIFESYNC_CONFIG.CONFLICT_STRATEGY
): any {
  switch (strategy) {
    case ConflictStrategy.LAST_WRITE_WINS:
      // Return the value with the most recent timestamp
      return remoteTimestamp > localTimestamp ? remoteValue : localValue

    case ConflictStrategy.LOCAL_WINS:
      return localValue

    case ConflictStrategy.REMOTE_WINS:
      return remoteValue

    case ConflictStrategy.MERGE:
      // Merge arrays or objects
      if (Array.isArray(localValue) && Array.isArray(remoteValue)) {
        // Merge arrays (remove duplicates)
        return Array.from(
          new Set([...localValue, ...remoteValue].map((item) => JSON.stringify(item)))
        ).map((item) => JSON.parse(item))
      }

      if (
        typeof localValue === 'object' &&
        typeof remoteValue === 'object' &&
        localValue !== null &&
        remoteValue !== null
      ) {
        // Merge objects
        return {
          ...remoteValue,
          ...localValue,
        }
      }

      // Default to last write wins
      return remoteTimestamp > localTimestamp ? remoteValue : localValue

    default:
      return localValue
  }
}

/**
 * Compare profile versions and detect changes
 */
export function detectChanges(
  localProfile: ProfileSyncData,
  remoteProfile: ProfileSyncData
): string[] {
  const changes: string[] = []

  // Compare each field
  if (JSON.stringify(localProfile.personalInfo) !== JSON.stringify(remoteProfile.personalInfo)) {
    changes.push('personalInfo')
  }

  if (
    JSON.stringify(localProfile.professionalInfo) !== JSON.stringify(remoteProfile.professionalInfo)
  ) {
    changes.push('professionalInfo')
  }

  if (JSON.stringify(localProfile.experience) !== JSON.stringify(remoteProfile.experience)) {
    changes.push('experience')
  }

  if (JSON.stringify(localProfile.education) !== JSON.stringify(remoteProfile.education)) {
    changes.push('education')
  }

  if (JSON.stringify(localProfile.skills) !== JSON.stringify(remoteProfile.skills)) {
    changes.push('skills')
  }

  if (
    JSON.stringify(localProfile.certifications) !== JSON.stringify(remoteProfile.certifications)
  ) {
    changes.push('certifications')
  }

  if (JSON.stringify(localProfile.pictures) !== JSON.stringify(remoteProfile.pictures)) {
    changes.push('pictures')
  }

  return changes
}

/**
 * Sync profile to Firestore
 */
export async function syncProfileToFirestore(
  userId: string,
  localProfile: ProfileSyncData,
  attempt = 0
): Promise<{ success: boolean; error?: string }> {
  try {
    // Update sync metadata status
    await updateSyncMetadata(userId, {
      status: SyncStatus.SYNCING,
    })

    const profileRef = doc(db, SYNC_COLLECTION, `${userId}-profile`)

    // Get remote profile
    const remoteSnapshot = await getDoc(profileRef)
    const remoteProfile = remoteSnapshot.data() as ProfileSyncData | undefined

    if (!remoteProfile) {
      // No remote profile, just upload
      await setDoc(profileRef, {
        ...localProfile,
        version: 1,
        lastModified: new Date(),
        lastModifiedBy: userId,
      })

      // Record event
      await recordSyncEvent({
        userId,
        timestamp: new Date(),
        status: SyncStatus.SUCCESS,
        action: 'upload',
        field: '*',
        localValue: localProfile,
        remoteValue: null,
        resolvedValue: localProfile,
      })

      // Update metadata
      await updateSyncMetadata(userId, {
        status: SyncStatus.SUCCESS,
        syncCount: (await getSyncMetadata(userId))?.syncCount || 0 + 1,
      })

      return { success: true }
    }

    // Detect changes
    const changes = detectChanges(localProfile, remoteProfile)

    if (changes.length === 0) {
      // No changes
      await updateSyncMetadata(userId, {
        status: SyncStatus.IDLE,
      })
      return { success: true }
    }

    // Resolve conflicts
    const batch = writeBatch(db)
    const mergedProfile: any = { ...remoteProfile }

    for (const field of changes) {
      const resolved = resolveConflict(
        localProfile[field as keyof ProfileSyncData],
        remoteProfile[field as keyof ProfileSyncData],
        localProfile.lastModified,
        remoteProfile.lastModified,
        LIFESYNC_CONFIG.CONFLICT_STRATEGY
      )

      mergedProfile[field] = resolved

      // Check if conflict was detected
      if (
        resolved !==
          localProfile[field as keyof ProfileSyncData] &&
        resolved !== remoteProfile[field as keyof ProfileSyncData]
      ) {
        await recordSyncEvent({
          userId,
          timestamp: new Date(),
          status: SyncStatus.CONFLICT,
          action: 'merge',
          field,
          localValue: localProfile[field as keyof ProfileSyncData],
          remoteValue: remoteProfile[field as keyof ProfileSyncData],
          resolvedValue: resolved,
        })

        // Increment conflict count
        const metadata = await getSyncMetadata(userId)
        if (metadata) {
          await updateSyncMetadata(userId, {
            conflictCount: metadata.conflictCount + 1,
          })
        }
      }
    }

    // Update remote profile
    mergedProfile.version = (remoteProfile.version || 0) + 1
    mergedProfile.lastModified = new Date()
    mergedProfile.lastModifiedBy = userId

    batch.set(profileRef, mergedProfile)
    await batch.commit()

    // Record success event
    await recordSyncEvent({
      userId,
      timestamp: new Date(),
      status: SyncStatus.SUCCESS,
      action: 'upload',
      field: changes.join(','),
      localValue: localProfile,
      remoteValue: remoteProfile,
      resolvedValue: mergedProfile,
    })

    // Update metadata
    const metadata = await getSyncMetadata(userId)
    await updateSyncMetadata(userId, {
      status: SyncStatus.SUCCESS,
      syncCount: (metadata?.syncCount || 0) + 1,
    })

    return { success: true }
  } catch (error) {
    // Retry on error
    if (attempt < LIFESYNC_CONFIG.MAX_RETRIES) {
      await new Promise((resolve) =>
        setTimeout(resolve, LIFESYNC_CONFIG.RETRY_DELAY * (attempt + 1))
      )
      return syncProfileToFirestore(userId, localProfile, attempt + 1)
    }

    const errorMessage = error instanceof Error ? error.message : 'Sync failed'

    // Record error event
    await recordSyncEvent({
      userId,
      timestamp: new Date(),
      status: SyncStatus.ERROR,
      action: 'upload',
      field: '*',
      localValue: localProfile,
      remoteValue: null,
      resolvedValue: null,
      error: errorMessage,
    })

    // Update metadata
    const metadata = await getSyncMetadata(userId)
    await updateSyncMetadata(userId, {
      status: SyncStatus.ERROR,
      errorCount: (metadata?.errorCount || 0) + 1,
    })

    return { success: false, error: errorMessage }
  }
}

/**
 * Download profile from Firestore
 */
export async function downloadProfileFromFirestore(
  userId: string
): Promise<{ profile?: ProfileSyncData; error?: string }> {
  try {
    const profileRef = doc(db, SYNC_COLLECTION, `${userId}-profile`)
    const snapshot = await getDoc(profileRef)

    if (!snapshot.exists()) {
      return { error: 'Profile not found' }
    }

    const data = snapshot.data() as ProfileSyncData
    return {
      profile: {
        ...data,
        lastModified: data.lastModified instanceof Date 
          ? data.lastModified 
          : new Date(data.lastModified),
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Download failed'
    return { error: errorMessage }
  }
}

/**
 * Subscribe to profile changes (real-time sync)
 */
export function subscribeToProfileChanges(
  userId: string,
  onUpdate: (profile: ProfileSyncData) => void,
  onError: (error: Error) => void
): () => void {
  const profileRef = doc(db, SYNC_COLLECTION, `${userId}-profile`)

  const unsubscribe = onSnapshot(
    profileRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as ProfileSyncData
        onUpdate({
          ...data,
          lastModified: data.lastModified instanceof Date 
            ? data.lastModified 
            : new Date(data.lastModified),
        })
      }
    },
    (error) => {
      onError(error)
    }
  )

  return unsubscribe
}

/**
 * Start auto-sync
 */
export function startAutoSync(
  userId: string,
  getLocalProfile: () => ProfileSyncData,
  onSync: (status: SyncStatus, error?: string) => void
): () => void {
  let syncInterval: NodeJS.Timeout | null = null

  const performSync = async () => {
    const localProfile = getLocalProfile()
    const result = await syncProfileToFirestore(userId, localProfile)

    if (result.success) {
      onSync(SyncStatus.SUCCESS)
    } else {
      onSync(SyncStatus.ERROR, result.error)
    }
  }

  // Initial sync
  performSync()

  // Schedule periodic syncs
  if (LIFESYNC_CONFIG.AUTO_SYNC_ENABLED) {
    syncInterval = setInterval(performSync, LIFESYNC_CONFIG.SYNC_INTERVAL)
  }

  // Return unsubscribe function
  return () => {
    if (syncInterval) {
      clearInterval(syncInterval)
    }
  }
}

/**
 * Get sync history
 */
export async function getSyncHistory(
  userId: string,
  limit = 50
): Promise<SyncEvent[]> {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION)
    const q = query(
      eventsRef,
      where('userId', '==', userId)
    )

    const snapshot = await getDoc(query(q))
    return []
  } catch (error) {
    console.error('Failed to get sync history:', error)
    return []
  }
}

export default {
  initializeSyncMetadata,
  getSyncMetadata,
  updateSyncMetadata,
  recordSyncEvent,
  resolveConflict,
  detectChanges,
  syncProfileToFirestore,
  downloadProfileFromFirestore,
  subscribeToProfileChanges,
  startAutoSync,
  getSyncHistory,
}
