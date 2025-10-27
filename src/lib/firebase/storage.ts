/**
 * Firebase Cloud Storage Configuration & Client
 * 
 * Handles all cloud storage operations for the Salatiso app
 * - Picture uploads to cloud
 * - Picture downloads
 * - Picture deletion
 * - Error handling & retry logic
 * - Progress tracking
 */

import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  getBytes,
  getDownloadURL,
  listAll,
  StorageError,
} from 'firebase/storage'
import { app } from './config'

/**
 * Initialize Firebase Cloud Storage
 */
export const storage = getStorage(app, 'gs://salatiso-ecosystem.appspot.com')

/**
 * Storage path constants
 */
export const STORAGE_PATHS = {
  USERS: 'users',
  PICTURES: 'pictures',
  TEMP: 'temp',
} as const

/**
 * File size limits (in bytes)
 */
export const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10 MB
  MIN_SIZE: 100 * 1024, // 100 KB
} as const

/**
 * Allowed file types
 */
export const ALLOWED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
} as const

/**
 * Storage error messages
 */
export const STORAGE_ERRORS = {
  FILE_TOO_LARGE: 'File is too large. Maximum size is 10 MB.',
  FILE_TOO_SMALL: 'File is too small. Minimum size is 100 KB.',
  INVALID_TYPE: 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed.',
  UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  DELETE_FAILED: 'Failed to delete file. Please try again.',
  DOWNLOAD_FAILED: 'Failed to download file. Please try again.',
  NOT_FOUND: 'File not found in storage.',
  UNAUTHORIZED: 'You do not have permission to perform this action.',
  QUOTA_EXCEEDED: 'Storage quota exceeded. Please contact support.',
} as const

/**
 * Retry configuration
 */
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000, // 1 second
  MAX_DELAY: 5000, // 5 seconds
} as const

/**
 * Calculate exponential backoff delay
 */
function getRetryDelay(attempt: number): number {
  const delay = RETRY_CONFIG.INITIAL_DELAY * Math.pow(2, attempt)
  return Math.min(delay, RETRY_CONFIG.MAX_DELAY)
}

/**
 * Wait for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > FILE_LIMITS.MAX_SIZE) {
    return { valid: false, error: STORAGE_ERRORS.FILE_TOO_LARGE }
  }

  if (file.size < FILE_LIMITS.MIN_SIZE) {
    return { valid: false, error: STORAGE_ERRORS.FILE_TOO_SMALL }
  }

  // Check file type
  if (!(file.type in ALLOWED_TYPES)) {
    return { valid: false, error: STORAGE_ERRORS.INVALID_TYPE }
  }

  return { valid: true }
}

/**
 * Get file storage path for a user
 */
export function getUserPicturePath(userId: string, fileName: string): string {
  return `${STORAGE_PATHS.USERS}/${userId}/${STORAGE_PATHS.PICTURES}/${fileName}`
}

/**
 * Get temporary file storage path
 */
export function getTempFilePath(fileName: string): string {
  return `${STORAGE_PATHS.TEMP}/${fileName}`
}

/**
 * Upload file to Firebase Cloud Storage with retry logic
 */
export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: number) => void,
  attempt = 0
): Promise<string> {
  try {
    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    // Create reference
    const fileRef = ref(storage, path)

    // Upload with metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        originalName: file.name,
      },
    }

    // Simulate progress (Firebase doesn't provide real progress)
    onProgress?.(0)

    const snapshot = await uploadBytes(fileRef, file, metadata)

    onProgress?.(100)

    // Get download URL
    const downloadUrl = await getDownloadURL(snapshot.ref)

    return downloadUrl
  } catch (error) {
    // Handle Firebase-specific errors
    if (error instanceof StorageError) {
      switch (error.code) {
        case 'storage/object-not-found':
          throw new Error(STORAGE_ERRORS.NOT_FOUND)
        case 'storage/unauthorized':
          throw new Error(STORAGE_ERRORS.UNAUTHORIZED)
        case 'storage/canceled':
          throw new Error('Upload canceled')
        case 'storage/unknown':
          // Retry on unknown errors
          if (attempt < RETRY_CONFIG.MAX_RETRIES) {
            const delay = getRetryDelay(attempt)
            await sleep(delay)
            return uploadFile(file, path, onProgress, attempt + 1)
          }
          throw new Error(STORAGE_ERRORS.UPLOAD_FAILED)
        default:
          throw error
      }
    }

    throw error
  }
}

/**
 * Delete file from Firebase Cloud Storage
 */
export async function deleteFile(path: string, attempt = 0): Promise<void> {
  try {
    const fileRef = ref(storage, path)
    await deleteObject(fileRef)
  } catch (error) {
    if (error instanceof StorageError) {
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist, treat as success
          return
        case 'storage/unauthorized':
          throw new Error(STORAGE_ERRORS.UNAUTHORIZED)
        case 'storage/unknown':
          // Retry on unknown errors
          if (attempt < RETRY_CONFIG.MAX_RETRIES) {
            const delay = getRetryDelay(attempt)
            await sleep(delay)
            return deleteFile(path, attempt + 1)
          }
          throw new Error(STORAGE_ERRORS.DELETE_FAILED)
        default:
          throw error
      }
    }

    throw error
  }
}

/**
 * Download file from Firebase Cloud Storage
 */
export async function downloadFile(
  path: string,
  attempt = 0
): Promise<ArrayBuffer> {
  try {
    const fileRef = ref(storage, path)
    const bytes = await getBytes(fileRef, FILE_LIMITS.MAX_SIZE)
    return bytes
  } catch (error) {
    if (error instanceof StorageError) {
      switch (error.code) {
        case 'storage/object-not-found':
          throw new Error(STORAGE_ERRORS.NOT_FOUND)
        case 'storage/unauthorized':
          throw new Error(STORAGE_ERRORS.UNAUTHORIZED)
        case 'storage/unknown':
          // Retry on unknown errors
          if (attempt < RETRY_CONFIG.MAX_RETRIES) {
            const delay = getRetryDelay(attempt)
            await sleep(delay)
            return downloadFile(path, attempt + 1)
          }
          throw new Error(STORAGE_ERRORS.DOWNLOAD_FAILED)
        default:
          throw error
      }
    }

    throw error
  }
}

/**
 * Get download URL for a file
 */
export async function getFileDownloadUrl(path: string): Promise<string> {
  try {
    const fileRef = ref(storage, path)
    return await getDownloadURL(fileRef)
  } catch (error) {
    if (error instanceof StorageError) {
      if (error.code === 'storage/object-not-found') {
        throw new Error(STORAGE_ERRORS.NOT_FOUND)
      }
    }
    throw error
  }
}

/**
 * List all files in a directory
 */
export async function listFiles(path: string): Promise<string[]> {
  try {
    const dirRef = ref(storage, path)
    const result = await listAll(dirRef)

    const fileUrls: string[] = []
    for (const file of result.items) {
      try {
        const url = await getDownloadURL(file)
        fileUrls.push(url)
      } catch (error) {
        console.error(`Failed to get URL for ${file.name}:`, error)
      }
    }

    return fileUrls
  } catch (error) {
    console.error('Failed to list files:', error)
    return []
  }
}

/**
 * Check storage quota status
 */
export async function getStorageStatus(): Promise<{
  used: number
  quota: number
  percentage: number
}> {
  // Note: Firebase Realtime Database has quota, but Cloud Storage is metered
  // This is a placeholder for future implementation
  return {
    used: 0,
    quota: 10 * 1024 * 1024 * 1024, // 10 GB
    percentage: 0,
  }
}

export default storage
