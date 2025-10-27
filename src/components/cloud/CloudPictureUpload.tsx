/**
 * CloudPictureUpload Component
 * 
 * React component for uploading pictures to cloud storage
 * Features:
 * - Drag & drop support
 * - File selection
 * - Progress tracking
 * - Error handling
 * - Image preview
 * - Optimized upload
 */

'use client'

import React, { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { useCloudUpload } from '@/hooks/useCloudUpload'
import { validateFile, STORAGE_ERRORS } from '@/lib/firebase/storage'
import type { ProfilePicture } from '@/types/profile'

/**
 * Component props
 */
export interface CloudPictureUploadProps {
  userId: string
  onUploadComplete?: (picture: ProfilePicture) => void
  onError?: (error: string) => void
  className?: string
  maxSize?: number
  showPreview?: boolean
  showHistory?: boolean
}

/**
 * CloudPictureUpload Component
 */
export function CloudPictureUpload({
  userId,
  onUploadComplete,
  onError,
  className = '',
  maxSize = 10 * 1024 * 1024,
  showPreview = true,
  showHistory = false,
}: CloudPictureUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const {
    state,
    uploadHistory,
    handleUpload,
    handleCancel,
    handleDelete,
    reset,
    clearHistory,
    getStats,
  } = useCloudUpload(userId)

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback(
    async (files: FileList) => {
      if (!files.length) return

      const file = files[0]

      // Validate file
      const validation = validateFile(file)
      if (!validation.valid) {
        const error = validation.error || STORAGE_ERRORS.UPLOAD_FAILED
        onError?.(error)
        return
      }

      // Create preview
      if (showPreview) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }

      // Upload
      const picture = await handleUpload(file, {
        onSuccess: (pic) => {
          onUploadComplete?.(pic)
        },
        onError: (error) => {
          onError?.(error)
        },
      })

      if (picture) {
        // Clear form
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [handleUpload, onUploadComplete, onError, showPreview]
  )

  /**
   * Handle file input change
   */
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files!)
  }

  /**
   * Handle drag over
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  /**
   * Handle drag leave
   */
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  /**
   * Handle drop
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  /**
   * Handle click on drop area
   */
  const handleDropAreaClick = () => {
    fileInputRef.current?.click()
  }

  /**
   * Get upload stats
   */
  const stats = getStats()

  return (
    <div className={`cloud-picture-upload ${className}`}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleDropAreaClick}
        className={`upload-area ${isDragging ? 'dragging' : ''} ${state.isUploading ? 'uploading' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          onChange={handleFileInputChange}
          disabled={state.isUploading}
          className="hidden"
        />

        {!state.isUploading && !preview && (
          <>
            <div className="upload-icon">📸</div>
            <h3>Drop picture here or click to select</h3>
            <p>Supports JPEG, PNG, WebP, and SVG (max 10 MB)</p>
          </>
        )}

        {state.isUploading && (
          <div className="uploading-state">
            <div className="spinner" />
            <h3>Uploading... {state.progress}%</h3>
            <p>{state.fileName}</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${state.progress}%` }}
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCancel()
              }}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        )}

        {preview && !state.isUploading && (
          <div className="preview-state">
            <img src={preview} alt="Preview" className="preview-image" />
            <button onClick={() => setPreview(null)} className="clear-button">
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{state.error}</span>
          <button
            onClick={reset}
            className="close-error"
            aria-label="Close error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload Stats */}
      {stats.totalUploads > 0 && (
        <div className="upload-stats">
          <div className="stat">
            <span className="label">Total Uploads:</span>
            <span className="value">{stats.totalUploads}</span>
          </div>
          <div className="stat">
            <span className="label">Successful:</span>
            <span className="value success">{stats.successfulUploads}</span>
          </div>
          <div className="stat">
            <span className="label">Failed:</span>
            <span className="value error">{stats.failedUploads}</span>
          </div>
          <div className="stat">
            <span className="label">Success Rate:</span>
            <span className="value">
              {Math.round(stats.successRate)}%
            </span>
          </div>
          <div className="stat">
            <span className="label">Total Size:</span>
            <span className="value">
              {(stats.totalSize / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>
      )}

      {/* Upload History */}
      {showHistory && uploadHistory.length > 0 && (
        <div className="upload-history">
          <div className="history-header">
            <h4>Upload History</h4>
            <button onClick={clearHistory} className="clear-history-button">
              Clear History
            </button>
          </div>
          <div className="history-list">
            {uploadHistory.map((entry) => (
              <div
                key={entry.id}
                className={`history-entry ${entry.success ? 'success' : 'failed'}`}
              >
                <span className="timestamp">
                  {entry.timestamp.toLocaleTimeString()}
                </span>
                <span className="filename">{entry.fileName}</span>
                <span className="size">
                  {(entry.size / 1024).toFixed(2)} KB
                </span>
                {!entry.success && entry.error && (
                  <span className="error-text">{entry.error}</span>
                )}
                <span className="status">
                  {entry.success ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .cloud-picture-upload {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .upload-area {
          border: 2px dashed #e0e0e0;
          border-radius: 8px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background-color: #f9f9f9;
        }

        .upload-area:hover {
          border-color: #4f46e5;
          background-color: #f3f4f6;
        }

        .upload-area.dragging {
          border-color: #4f46e5;
          background-color: #eef2ff;
          transform: scale(1.02);
        }

        .upload-area.uploading {
          pointer-events: none;
          opacity: 0.6;
        }

        .upload-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .upload-area h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .upload-area p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .uploading-state {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e5e7eb;
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .uploading-state h3 {
          margin: 0;
          color: #1f2937;
        }

        .uploading-state p {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background-color: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background-color: #4f46e5;
          transition: width 0.3s ease;
        }

        .cancel-button {
          padding: 6px 16px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .cancel-button:hover {
          background-color: #dc2626;
        }

        .preview-state {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }

        .preview-image {
          max-width: 200px;
          max-height: 200px;
          border-radius: 4px;
        }

        .clear-button {
          padding: 6px 16px;
          background-color: #6b7280;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .clear-button:hover {
          background-color: #4b5563;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 4px;
          color: #991b1b;
          font-size: 14px;
        }

        .error-icon {
          font-size: 18px;
        }

        .close-error {
          margin-left: auto;
          background: none;
          border: none;
          color: #991b1b;
          cursor: pointer;
          font-size: 16px;
          padding: 0;
        }

        .upload-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          padding: 12px;
          background-color: #f9fafb;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }

        .stat .label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .stat .value {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .stat .value.success {
          color: #16a34a;
        }

        .stat .value.error {
          color: #dc2626;
        }

        .upload-history {
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 12px;
          background-color: #f9fafb;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }

        .history-header h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .clear-history-button {
          padding: 4px 8px;
          font-size: 12px;
          background-color: #e5e7eb;
          color: #374151;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .clear-history-button:hover {
          background-color: #d1d5db;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
        }

        .history-entry {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background-color: white;
          border-radius: 3px;
          border: 1px solid #e5e7eb;
          font-size: 12px;
        }

        .history-entry.success {
          border-color: #86efac;
          background-color: #f0fdf4;
        }

        .history-entry.failed {
          border-color: #fca5a5;
          background-color: #fef2f2;
        }

        .history-entry .timestamp {
          color: #6b7280;
          font-weight: 500;
          min-width: 70px;
        }

        .history-entry .filename {
          flex: 1;
          color: #374151;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .history-entry .size {
          color: #6b7280;
          font-weight: 500;
        }

        .history-entry .error-text {
          color: #dc2626;
          font-size: 11px;
        }

        .history-entry .status {
          font-weight: 600;
          font-size: 14px;
        }

        .history-entry.success .status {
          color: #16a34a;
        }

        .history-entry.failed .status {
          color: #dc2626;
        }

        .hidden {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default CloudPictureUpload
