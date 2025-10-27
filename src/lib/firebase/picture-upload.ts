/**
 * Picture Upload & Management Service
 * 
 * High-level API for picture management:
 * - Upload picture (with compression & optimization)
 * - Delete picture
 * - Get picture download URL
 * - Manage picture metadata
 * - Handle picture history/versions
 */

import {
  uploadFile,
  deleteFile,
  getFileDownloadUrl,
  getUserPicturePath,
  getTempFilePath,
  validateFile,
  STORAGE_ERRORS,
} from './storage'
import type { ProfilePicture } from '@/types/profile'

/**
 * Picture compression settings
 */
export const PICTURE_COMPRESSION = {
  QUALITY: 0.8, // 80% quality
  MAX_WIDTH: 2000,
  MAX_HEIGHT: 2000,
  FORMAT: 'image/webp', // Convert to WebP for smaller size
} as const

/**
 * Picture metadata
 */
export interface PictureMetadata {
  id: string
  userId: string
  originalName: string
  uploadedAt: Date
  fileSize: number
  dimensions: {
    width: number
    height: number
  }
  mimeType: string
  downloadUrl: string
  storagePath: string
  version: number
}

/**
 * Upload response
 */
export interface UploadResponse {
  success: boolean
  picture?: PictureMetadata
  error?: string
  progress?: number
}

/**
 * Compress image using canvas
 */
async function compressImage(
  file: File,
  maxWidth: number = PICTURE_COMPRESSION.MAX_WIDTH,
  maxHeight: number = PICTURE_COMPRESSION.MAX_HEIGHT,
  quality: number = PICTURE_COMPRESSION.QUALITY
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }

            const compressedFile = new File([blob], file.name, {
              type: PICTURE_COMPRESSION.FORMAT,
              lastModified: Date.now(),
            })

            resolve(compressedFile)
          },
          PICTURE_COMPRESSION.FORMAT,
          quality
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Get image dimensions
 */
async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        })
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Generate unique file name
 */
function generateFileName(userId: string, originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  const ext = originalName.split('.').pop() || 'jpg'
  return `${userId}_${timestamp}_${random}.${ext}`
}

/**
 * Upload picture with compression and optimization
 */
export async function uploadPicture(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  try {
    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      }
    }

    onProgress?.(10)

    // Compress image
    let compressedFile: File
    try {
      compressedFile = await compressImage(file)
      console.log(
        `Image compressed: ${file.size} -> ${compressedFile.size} bytes (${Math.round((compressedFile.size / file.size) * 100)}%)`
      )
    } catch (error) {
      console.warn('Image compression failed, using original:', error)
      compressedFile = file
    }

    onProgress?.(30)

    // Get image dimensions
    let dimensions: { width: number; height: number }
    try {
      dimensions = await getImageDimensions(file)
    } catch (error) {
      console.warn('Failed to get image dimensions:', error)
      dimensions = { width: 0, height: 0 }
    }

    onProgress?.(50)

    // Generate unique file name
    const fileName = generateFileName(userId, file.name)
    const storagePath = getUserPicturePath(userId, fileName)

    // Upload to Firebase Cloud Storage
    const downloadUrl = await uploadFile(
      compressedFile,
      storagePath,
      (progress) => {
        onProgress?.(50 + progress * 0.4)
      }
    )

    onProgress?.(90)

    // Create metadata
    const metadata: PictureMetadata = {
      id: `pic_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId,
      originalName: file.name,
      uploadedAt: new Date(),
      fileSize: compressedFile.size,
      dimensions,
      mimeType: compressedFile.type,
      downloadUrl,
      storagePath,
      version: 1,
    }

    onProgress?.(100)

    return {
      success: true,
      picture: metadata,
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : STORAGE_ERRORS.UPLOAD_FAILED
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Delete picture from cloud storage
 */
export async function deletePicture(
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteFile(storagePath)
    return { success: true }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : STORAGE_ERRORS.DELETE_FAILED
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Get picture download URL
 */
export async function getPictureDownloadUrl(
  storagePath: string
): Promise<{ url?: string; error?: string }> {
  try {
    const url = await getFileDownloadUrl(storagePath)
    return { url }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : STORAGE_ERRORS.DOWNLOAD_FAILED
    return {
      error: errorMessage,
    }
  }
}

/**
 * Convert Picture to PictureMetadata
 */
export function pictureToPictureMetadata(picture: ProfilePicture): PictureMetadata {
  return {
    id: picture.id,
    userId: '', // Will be set from context
    originalName: picture.name,
    uploadedAt: new Date(picture.uploadedAt),
    fileSize: picture.metadata?.size || 0,
    dimensions: picture.metadata?.dimensions || { width: 0, height: 0 },
    mimeType: picture.metadata?.mimeType || 'image/jpeg',
    downloadUrl: picture.url,
    storagePath: '', // Will be set from context
    version: 1,
  }
}

/**
 * Convert PictureMetadata to Picture
 */
export function pictureMetadataToPicture(metadata: PictureMetadata): ProfilePicture {
  return {
    id: metadata.id,
    url: metadata.downloadUrl,
    name: metadata.originalName,
    uploadedAt: metadata.uploadedAt.toISOString(),
    isPrimary: false,
    metadata: {
      size: metadata.fileSize,
      mimeType: metadata.mimeType,
      dimensions: metadata.dimensions,
    },
  }
}

export default {
  uploadPicture,
  deletePicture,
  getPictureDownloadUrl,
  pictureToPictureMetadata,
  pictureMetadataToPicture,
}
