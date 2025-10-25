import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle, AlertCircle, Settings } from 'lucide-react';

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

interface TemplateDownloadProps {
  template: Template;
  onDownload: (template: Template, customizedData?: any) => void;
  onCancel: () => void;
}

export const TemplateDownload: React.FC<TemplateDownloadProps> = ({
  template,
  onDownload,
  onCancel
}) => {
  const [downloadType, setDownloadType] = useState<'standard' | 'customized'>('standard');
  const [customizationData, setCustomizationData] = useState({
    userName: '',
    businessName: '',
    date: new Date().toISOString().split('T')[0],
    location: ''
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setCustomizationData(prev => ({ ...prev, [field]: value }));
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const data = downloadType === 'customized' ? customizationData : undefined;
      onDownload(template, data);
      setDownloadComplete(true);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (downloadComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Download Complete!
        </h2>
        <p className="text-gray-600 mb-6">
          Your template has been downloaded successfully. You can now customize it with your information.
        </p>
        <div className="space-y-3 text-sm text-gray-500 mb-6">
          <p>📄 Template: {template.name}</p>
          <p>📊 Format: HTML (Print-optimized)</p>
          <p>🎯 Use browser print function to save as PDF</p>
        </div>
        <button
          onClick={onCancel}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Return to Templates
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex items-center">
          <Download className="w-8 h-8 mr-3" />
          <div>
            <h2 className="text-2xl font-bold">Download Template</h2>
            <p className="text-purple-100">{template.name}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Download Options */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Options</h3>

          <div className="space-y-3">
            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="downloadType"
                value="standard"
                checked={downloadType === 'standard'}
                onChange={(e) => setDownloadType(e.target.value as 'standard')}
                className="mr-3"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">Standard Download</div>
                <div className="text-sm text-gray-600">Download the template as-is</div>
              </div>
              <FileText className="w-5 h-5 text-gray-400" />
            </label>

            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="downloadType"
                value="customized"
                checked={downloadType === 'customized'}
                onChange={(e) => setDownloadType(e.target.value as 'customized')}
                className="mr-3"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">Customized Download</div>
                <div className="text-sm text-gray-600">Add your information before downloading</div>
              </div>
              <Settings className="w-5 h-5 text-gray-400" />
            </label>
          </div>
        </div>

        {/* Customization Form */}
        {downloadType === 'customized' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg"
          >
            <h4 className="font-medium text-purple-900 mb-3 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Customize Template
            </h4>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={customizationData.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={customizationData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter your business name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={customizationData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={customizationData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Province"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Template Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Template Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Version:</span>
              <span className="ml-2 text-gray-600">v{template.version}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Category:</span>
              <span className="ml-2 text-gray-600 capitalize">{template.category}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Type:</span>
              <span className="ml-2 text-gray-600 capitalize">{template.type}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Downloads:</span>
              <span className="ml-2 text-gray-600">{template.downloadCount}</span>
            </div>
          </div>
        </div>

        {/* Download Tips */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Download Tips</p>
              <p>• Templates open in your browser for preview</p>
              <p>• Use Ctrl+P (or Cmd+P on Mac) to print/save as PDF</p>
              <p>• Choose &quot;Save as PDF&quot; in the print dialog</p>
              <p>• Customized data will be pre-filled in the template</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isDownloading}
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Downloading...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download Template
              </div>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};