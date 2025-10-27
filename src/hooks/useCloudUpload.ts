/**
 * useCloudUpload Hook
 * 
 * React hook for handling picture uploads with progress tracking,
 * error handling, and state management
 */

import { useState, useCallback, useRef } from 'react'
import {
  uploadPicture,
  deletePicture,
  getPictureDownloadUrl,
  pictureMetadataToPicture,
  type PictureMetadata,
  type UploadResponse,
} from '@/lib/firebase/picture-upload'
import type { ProfilePicture } from '@/types/profile'

/**
 * Upload state
 */
export interface UploadState {
  isLoading: boolean
  isUploading: boolean
  progress: number
  error: string | null
  picture: ProfilePicture | null
  fileName: string | null
}

/**
 * Upload options
 */
export interface UploadOptions {
  maxRetries?: number
  onProgress?: (progress: number) => void
  onSuccess?: (picture: ProfilePicture) => void
  onError?: (error: string) => void
}

/**
 * Upload history entry
 */
export interface UploadHistoryEntry {
  id: string
  fileName: string
  size: number
  timestamp: Date
  success: boolean
  error?: string
}

/**
 * useCloudUpload hook
 */
export function useCloudUpload(userId: string) {
  const [state, setState] = useState<UploadState>({
    isLoading: false,
    isUploading: false,
    progress: 0,
    error: null,
    picture: null,
    fileName: null,
  })

  const [uploadHistory, setUploadHistory] = useState<UploadHistoryEntry[]>([])
  const abortControllerRef = useRef<AbortController | null>(null)

  /**
   * Handle upload
   */
  const handleUpload = useCallback(
    async (file: File, options?: UploadOptions): Promise<ProfilePicture | null> => {
      try {
        setState((prev) => ({
          ...prev,
          isLoading: true,
          isUploading: true,
          error: null,
          progress: 0,
          fileName: file.name,
        }))

        // Create abort controller
        abortControllerRef.current = new AbortController()

        // Upload picture
        const response: UploadResponse = await uploadPicture(
          file,
          userId,
          (progress) => {
            if (!abortControllerRef.current?.signal.aborted) {
              setState((prev) => ({
                ...prev,
                progress,
              }))
              options?.onProgress?.(progress)
            }
          }
        )

        if (!response.success || !response.picture) {
          const error = response.error || 'Upload failed'
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isUploading: false,
            error,
            progress: 0,
          }))

          // Add to history
          setUploadHistory((prev) => [
            ...prev,
            {
              id: `history_${Date.now()}`,
              fileName: file.name,
              size: file.size,
              timestamp: new Date(),
              success: false,
              error,
            },
          ])

          options?.onError?.(error)
          return null
        }

        // Convert metadata to Picture
        const picture = pictureMetadataToPicture(response.picture)

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isUploading: false,
          picture,
          progress: 100,
          error: null,
          fileName: null,
        }))

        // Add to history
        setUploadHistory((prev) => [
          ...prev,
          {
            id: response.picture!.id,
            fileName: file.name,
            size: file.size,
            timestamp: new Date(),
            success: true,
          },
        ])

        options?.onSuccess?.(picture)
        return picture
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed'

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isUploading: false,
          error: errorMessage,
          progress: 0,
        }))

        // Add to history
        setUploadHistory((prev) => [
          ...prev,
          {
            id: `history_${Date.now()}`,
            fileName: file.name,
            size: file.size,
            timestamp: new Date(),
            success: false,
            error: errorMessage,
          },
        ])

        options?.onError?.(errorMessage)
        return null
      }
    },
    [userId]
  )

  /**
   * Handle cancel
   */
  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort()
    setState((prev) => ({
      ...prev,
      isLoading: false,
      isUploading: false,
      progress: 0,
      error: 'Upload cancelled',
    }))
  }, [])

  /**
   * Handle delete
   */
  const handleDelete = useCallback(
    async (storagePath: string): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          isLoading: true,
        }))

        const response = await deletePicture(storagePath)

        if (!response.success) {
          const error = response.error || 'Delete failed'
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error,
          }))
          return false
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
          picture: null,
          error: null,
        }))

        return true
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Delete failed'
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }))
        return false
      }
    },
    []
  )

  /**
   * Get download URL
   */
  const getDownloadUrl = useCallback(
    async (storagePath: string): Promise<string | null> => {
      try {
        const response = await getPictureDownloadUrl(storagePath)

        if (!response.url) {
          console.error('Failed to get download URL:', response.error)
          return null
        }

        return response.url
      } catch (error) {
        console.error('Failed to get download URL:', error)
        return null
      }
    },
    []
  )

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isUploading: false,
      progress: 0,
      error: null,
      picture: null,
      fileName: null,
    })
  }, [])

  /**
   * Clear history
   */
  const clearHistory = useCallback(() => {
    setUploadHistory([])
  }, [])

  /**
   * Get upload statistics
   */
  const getStats = useCallback(() => {
    const totalUploads = uploadHistory.length
    const successfulUploads = uploadHistory.filter((h) => h.success).length
    const failedUploads = uploadHistory.filter((h) => !h.success).length
    const totalSize = uploadHistory.reduce((sum, h) => sum + h.size, 0)

    return {
      totalUploads,
      successfulUploads,
      failedUploads,
      totalSize,
      successRate:
        totalUploads > 0 ? (successfulUploads / totalUploads) * 100 : 0,
    }
  }, [uploadHistory])

  return {
    // State
    state,
    uploadHistory,

    // Actions
    handleUpload,
    handleCancel,
    handleDelete,
    getDownloadUrl,
    reset,
    clearHistory,

    // Utils
    getStats,

    // Shortcut properties
    isLoading: state.isLoading,
    isUploading: state.isUploading,
    progress: state.progress,
    error: state.error,
    picture: state.picture,
    fileName: state.fileName,
  }
}

export default useCloudUpload
