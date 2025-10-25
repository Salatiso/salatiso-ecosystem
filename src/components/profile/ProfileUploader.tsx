import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import { Upload, Camera, X, Check, Image as ImageIcon } from 'lucide-react';

interface ProfileUploaderProps {
  currentPhotoURL?: string;
  onUpload: (file: File) => Promise<void>;
  onWebcamCapture: (imageSrc: string) => Promise<void>;
}

const ProfileUploader: React.FC<ProfileUploaderProps> = ({
  currentPhotoURL,
  onUpload,
  onWebcamCapture,
}) => {
  const [preview, setPreview] = useState<string | null>(currentPhotoURL || null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [uploading, setUploading] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, or GIF)');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const capturePhoto = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setPreview(imageSrc);
    setShowWebcam(false);
    setUploading(true);
    
    try {
      await onWebcamCapture(imageSrc);
    } catch (error) {
      console.error('Webcam capture error:', error);
      alert('Failed to save captured photo. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onWebcamCapture]);

  return (
    <div className="space-y-4">
      {/* Current/Preview Photo */}
      {preview && !showWebcam && (
        <div className="relative">
          <img
            src={preview}
            alt="Profile preview"
            className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-200"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      )}

      {/* Webcam View */}
      {showWebcam && (
        <div className="relative">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="w-full rounded-lg"
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: 'user'
            }}
          />
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={capturePhoto}
              disabled={uploading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>Capture Photo</span>
            </button>
            <button
              onClick={() => setShowWebcam(false)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Upload Options */}
      {!showWebcam && (
        <div className="space-y-3">
          {/* Drag & Drop / File Upload */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            {isDragActive ? (
              <p className="text-sm text-primary-600 font-medium">
                Drop your photo here...
              </p>
            ) : (
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Drag & drop your photo here, or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG or GIF • Max 5MB
                </p>
              </div>
            )}
          </div>

          {/* Webcam Button */}
          <button
            onClick={() => setShowWebcam(true)}
            disabled={uploading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Take Photo with Webcam
            </span>
          </button>

          {/* Mobile Camera (uses file input with camera constraint) */}
          <label className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-400 hover:bg-gray-50 transition-colors cursor-pointer">
            <ImageIcon className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Upload from Phone Camera
            </span>
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onDrop([e.target.files[0]]);
                }
              }}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-primary-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span>Uploading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileUploader;
