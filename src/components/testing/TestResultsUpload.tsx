import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface TestResult {
  testType: 'bizhelp' | 'webapp' | 'android';
  appTested: string;
  overallRating: number;
  feedback: string;
  deviceInfo: string;
  attachments?: File[];
}

interface TestResultsUploadProps {
  onSubmit: (result: TestResult) => void;
  onCancel: () => void;
}

export const TestResultsUpload: React.FC<TestResultsUploadProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<TestResult>({
    testType: 'bizhelp',
    appTested: '',
    overallRating: 5,
    feedback: '',
    deviceInfo: '',
    attachments: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: keyof TestResult, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, attachments: files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSubmit(formData);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting test results:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Thank You for Your Feedback!
        </h2>
        <p className="text-gray-600 mb-6">
          Your test results have been successfully submitted. Your feedback helps us improve our tools for South African entrepreneurs.
        </p>
        <div className="space-y-3 text-sm text-gray-500">
          <p>📧 A confirmation email has been sent to your inbox</p>
          <p>🏆 You&apos;ve earned 50 LifeCV points for testing</p>
          <p>🎯 Your feedback will be reviewed within 24 hours</p>
        </div>
        <button
          onClick={onCancel}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Return to Testing Hub
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center">
          <Upload className="w-8 h-8 mr-3" />
          <div>
            <h2 className="text-2xl font-bold">Submit Test Results</h2>
            <p className="text-blue-100">Share your testing experience and help us improve</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Test Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Type
          </label>
          <select
            value={formData.testType}
            onChange={(e) => handleInputChange('testType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="bizhelp">BizHelp Beta Testing</option>
            <option value="webapp">Web App Testing</option>
            <option value="android">Android App Testing</option>
          </select>
        </div>

        {/* App Tested */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            App/Platform Tested
          </label>
          <input
            type="text"
            value={formData.appTested}
            onChange={(e) => handleInputChange('appTested', e.target.value)}
            placeholder="e.g., BizHelp Web App, LifeSync Mobile"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleInputChange('overallRating', star)}
                className={`w-8 h-8 ${
                  star <= formData.overallRating
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
            <span className="text-sm text-gray-600 ml-2">
              {formData.overallRating} out of 5 stars
            </span>
          </div>
        </div>

        {/* Device/Browser Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Device/Browser Information
          </label>
          <input
            type="text"
            value={formData.deviceInfo}
            onChange={(e) => handleInputChange('deviceInfo', e.target.value)}
            placeholder="e.g., Chrome 120 on Windows 11, Samsung Galaxy S23"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Feedback */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Feedback
          </label>
          <textarea
            value={formData.feedback}
            onChange={(e) => handleInputChange('feedback', e.target.value)}
            placeholder="Please share your experience, any issues you encountered, suggestions for improvement, and what worked well..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            required
          />
        </div>

        {/* File Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachments (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              multiple
              accept="image/*,.txt,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
            >
              Click to upload screenshots, error logs, or other files
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Supported: Images, PDF, Word docs, Text files (Max 10MB total)
            </p>
          </div>
          {formData.attachments && formData.attachments.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              {formData.attachments.length} file{formData.attachments.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              'Submit Results'
            )}
          </button>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Privacy & Data Usage</p>
              <p>Your feedback helps us improve our services. Test results are stored securely and may be used for product development and quality assurance. Personal information is handled according to our privacy policy.</p>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};