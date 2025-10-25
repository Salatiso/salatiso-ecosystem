import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Eye, Star, Clock, ExternalLink } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: 'personal' | 'professional' | 'family' | 'quickstart';
  type: 'guide' | 'manual' | 'interactive' | 'brochure' | 'pack';
  description: string;
  version: string;
  path: string;
  saziFocus: string;
  lifecvProofType: string;
  downloadCount?: number;
  rating?: number;
  lastUpdated: string;
}

interface TemplatePreviewProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (template: Template) => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  isOpen,
  onClose,
  onDownload
}) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!template) return null;

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-4 md:inset-8 bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20`}>
                      {template.category}
                    </div>
                    <div className="text-sm text-purple-100">
                      v{template.version}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{template.name}</h2>
                  <p className="text-purple-100 mb-4">{template.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-300" />
                      {template.rating} rating
                    </div>
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      {template.downloadCount} downloads
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {template.saziFocus}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row h-full max-h-[calc(100vh-200px)]">
              {/* Preview Panel */}
              <div className="flex-1 relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading template preview...</p>
                    </div>
                  </div>
                )}
                <iframe
                  src={template.path}
                  className="w-full h-full min-h-[400px] border-0"
                  onLoad={handleIframeLoad}
                  title={`${template.name} Preview`}
                />
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-80 bg-gray-50 p-6 border-t lg:border-t-0 lg:border-l border-gray-200">
                <div className="space-y-6">
                  {/* Template Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Template Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Type:</span>
                        <span className="ml-2 text-gray-600 capitalize">{template.type}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Category:</span>
                        <span className="ml-2 text-gray-600 capitalize">{template.category}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Sazi Focus:</span>
                        <span className="ml-2 text-gray-600">{template.saziFocus}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">LifeCV Proof:</span>
                        <span className="ml-2 text-gray-600">{template.lifecvProofType}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Last Updated:</span>
                        <span className="ml-2 text-gray-600">{template.lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => window.open(template.path, '_blank')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in New Tab
                      </button>

                      <button
                        onClick={() => onDownload(template)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Template
                      </button>

                      <button
                        onClick={() => window.print()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Print Preview
                      </button>
                    </div>
                  </div>

                  {/* Usage Tips */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Usage Tips
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Customize the template with your specific information</p>
                      <p>• Use the print function for PDF generation</p>
                      <p>• Templates are designed for South African business contexts</p>
                      <p>• Completing templates may generate LifeCV proof</p>
                    </div>
                  </div>

                  {/* Related Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h4>
                    <p className="text-sm text-blue-800">
                      Templates are optimized for both digital viewing and print. Use your browser&apos;s print function to save as PDF.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};