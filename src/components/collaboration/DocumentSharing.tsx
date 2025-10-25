import React, { useState, useRef } from 'react';
import { FileUp, Download, Trash2, Lock, Globe, File, Image, FileText, Music, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SharedDocument {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedByName?: string;
  uploadedAt: Date;
  url: string;
  isPublic: boolean;
  downloads: number;
}

interface DocumentSharingProps {
  eventId: string;
  documents?: SharedDocument[];
  onUpload?: (file: File) => Promise<void>;
  onDelete?: (documentId: string) => Promise<void>;
  onDownload?: (documentId: string) => void;
  maxFileSize?: number; // MB
  allowedTypes?: string[];
  readOnly?: boolean;
}

/**
 * DocumentSharing
 * File upload, sharing, and download management component
 */
export const DocumentSharing: React.FC<DocumentSharingProps> = ({
  eventId,
  documents = [],
  onUpload,
  onDelete,
  onDownload,
  maxFileSize = 25,
  allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'video/mp4',
    'audio/mpeg',
  ],
  readOnly = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image size={20} className="text-pink-500" />;
    if (fileType.startsWith('video/')) return <Video size={20} className="text-purple-500" />;
    if (fileType.startsWith('audio/')) return <Music size={20} className="text-orange-500" />;
    if (fileType.includes('pdf')) return <FileText size={20} className="text-red-500" />;
    if (fileType.includes('word') || fileType.includes('document'))
      return <FileText size={20} className="text-blue-500" />;
    if (fileType.includes('sheet') || fileType.includes('excel'))
      return <FileText size={20} className="text-green-500" />;
    return <File size={20} className="text-gray-500" />;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      setError(`File size exceeds ${maxFileSize}MB limit`);
      return;
    }

    // Upload file
    if (onUpload) {
      setUploading(true);
      try {
        await onUpload(file);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  // Sort documents
  const sortedDocuments = [...documents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.fileName.localeCompare(b.fileName);
      case 'size':
        return b.fileSize - a.fileSize;
      case 'date':
      default:
        return (
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
    }
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FileUp size={20} />
          Document Sharing
          <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {documents.length}
          </span>
        </h3>
      </div>

      {/* Upload Section */}
      {!readOnly && (
        <div className="space-y-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Uploading...
              </>
            ) : (
              <>
                <FileUp size={18} />
                Upload Document
              </>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept={allowedTypes.join(',')}
            disabled={uploading}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
            >
              {error}
            </motion.div>
          )}

          <div className="text-xs text-gray-500 text-center">
            Max file size: {maxFileSize}MB • Supported formats: PDF, DOC, XLS, Images, Video, Audio
          </div>
        </div>
      )}

      {/* Sort Controls */}
      {sortedDocuments.length > 0 && (
        <div className="flex gap-2">
          <label className="text-xs font-medium text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
            className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Latest</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
          </select>
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {sortedDocuments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8 text-gray-400"
            >
              <FileUp size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No documents yet</p>
              {!readOnly && (
                <p className="text-xs mt-1">Upload files to share with collaborators</p>
              )}
            </motion.div>
          ) : (
            sortedDocuments.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                {/* Icon */}
                <div className="p-2 bg-gray-200 rounded-lg group-hover:bg-gray-300 transition-colors">
                  {getFileIcon(doc.fileType)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {doc.fileName}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span>•</span>
                    <span>
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{doc.uploadedByName || doc.uploadedBy}</span>
                    <span>•</span>
                    <span>{doc.downloads} downloads</span>
                  </div>
                </div>

                {/* Visibility */}
                <div className="flex items-center gap-1 text-xs">
                  {doc.isPublic ? (
                    <Globe size={14} className="text-blue-500" title="Public" />
                  ) : (
                    <Lock size={14} className="text-gray-500" title="Private" />
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onDownload?.(doc.id)}
                    className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download size={16} className="text-blue-600" />
                  </button>
                  {!readOnly && (
                    <button
                      onClick={() => onDelete?.(doc.id)}
                      className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Stats */}
      {sortedDocuments.length > 0 && (
        <div className="pt-2 border-t border-gray-200 text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Total files:</span>
            <span className="font-medium">{documents.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Total size:</span>
            <span className="font-medium">
              {formatFileSize(documents.reduce((sum, doc) => sum + doc.fileSize, 0))}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total downloads:</span>
            <span className="font-medium">
              {documents.reduce((sum, doc) => sum + doc.downloads, 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSharing;
