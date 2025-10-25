/**
 * Image Upload Component for Contacts
 * Allows uploading up to 5 images per contact to Firebase Storage
 * Supports drag-drop and file picker
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  X,
  Trash2,
  Plus,
  Image as ImageIcon,
  Loader
} from 'lucide-react';

interface ImageUploadProps {
  contactId: string;
  userId: string;
  images: string[]; // Array of image URLs
  onImagesUpdate: (images: string[]) => void;
  maxImages?: number;
  compact?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  contactId,
  userId,
  images = [],
  onImagesUpdate,
  maxImages = 5,
  compact = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newImages = Array.from(files);
    const remainingSlots = maxImages - images.length;

    if (newImages.length > remainingSlots) {
      setError(`You can only add ${remainingSlots} more image(s). Maximum is ${maxImages} per contact.`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Validate file types
      for (const file of newImages) {
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          throw new Error('Image size must be less than 5MB');
        }
      }

      // In a real implementation, you would upload to Firebase Storage
      // For now, we'll create data URLs (for demo purposes)
      const uploadedImages: string[] = [];

      for (const file of newImages) {
        const reader = new FileReader();
        const fileId = Math.random().toString(36).substring(7);
        
        reader.onload = (e) => {
          if (e.target?.result) {
            uploadedImages.push(e.target.result as string);
            setUploadProgress(prev => ({
              ...prev,
              [fileId]: 100
            }));

            if (uploadedImages.length === newImages.length) {
              // All files loaded
              onImagesUpdate([...images, ...uploadedImages]);
              setUploading(false);
              setUploadProgress({});
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }
          }
        };

        reader.onerror = () => {
          setError('Failed to read file');
          setUploading(false);
        };

        reader.readAsDataURL(file);
        // Simulate upload progress
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: 30
        }));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload images';
      setError(message);
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesUpdate(newImages);
  };

  const canAddMore = images.length < maxImages;

  if (compact && images.length === 0) {
    return (
      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
        title="Add images to this contact"
        disabled={uploading}
      >
        <ImageIcon className="w-3 h-3 mr-1" />
        Add Photos ({images.length}/{maxImages})
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Image Gallery */}
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          <h4 className="text-sm font-semibold text-ubuntu-warm-900">
            Photos ({images.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <img
                    src={image}
                    alt={`Contact photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-ubuntu-warm-200"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-ubuntu-gold bg-ubuntu-gold/5'
                : 'border-ubuntu-warm-300 hover:border-ubuntu-gold hover:bg-ubuntu-warm-50'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              disabled={uploading}
            />

            <div className="flex flex-col items-center gap-2">
              {uploading ? (
                <>
                  <Loader className="w-8 h-8 text-ubuntu-gold animate-spin" />
                  <p className="text-sm font-medium text-ubuntu-warm-700">Uploading images...</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-ubuntu-gold" />
                  <p className="text-sm font-medium text-ubuntu-warm-900">
                    Drag and drop images here
                  </p>
                  <p className="text-xs text-ubuntu-warm-600">
                    or click to browse ({images.length}/{maxImages} used)
                  </p>
                  <p className="text-xs text-ubuntu-warm-500 mt-1">
                    Max 5MB per image, up to {maxImages - images.length} more
                  </p>
                </>
              )}
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              <p className="font-medium">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 underline text-xs mt-1"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {!canAddMore && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
          <p className="font-medium">Maximum images reached</p>
          <p className="text-xs mt-1">Remove an image to add more</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
