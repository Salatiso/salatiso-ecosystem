import React, { useState, useEffect } from 'react';
import { AccessibilityAuditDashboard, useAccessibilityAudit } from '@/components/accessibility';
import { Bug, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface DevAccessibilityPanelProps {
  className?: string;
}

export const DevAccessibilityPanel: React.FC<DevAccessibilityPanelProps> = ({
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { issues, isScanning, scanForIssues, clearIssues } = useAccessibilityAudit({
    autoScan: false, // Only scan when requested
  });

  const errorCount = issues.filter(issue => issue.type === 'error').length;
  const warningCount = issues.filter(issue => issue.type === 'warning').length;
  const infoCount = issues.filter(issue => issue.type === 'info').length;

  // Prevent hydration mismatch by only rendering on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isMounted) {
    return null; // Only show in development and after mount
  }

  return (
    <div className={`fixed bottom-20 right-4 z-40 ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Toggle accessibility audit panel"
        title="Accessibility Audit (Dev Only)"
      >
        <Bug className="w-5 h-5" />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 max-h-96 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center">
              <Bug className="w-4 h-4 mr-2" />
              Accessibility Audit
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
              aria-label="Close accessibility audit panel"
            >
              ×
            </button>
          </div>

          <div className="p-4">
            {/* Quick Stats */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center text-red-600">
                <XCircle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{errorCount}</span>
              </div>
              <div className="flex items-center text-yellow-600">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{warningCount}</span>
              </div>
              <div className="flex items-center text-blue-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{infoCount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={scanForIssues}
                disabled={isScanning}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {isScanning ? 'Scanning...' : 'Scan Page'}
              </button>
              <button
                onClick={clearIssues}
                className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Issues List */}
            <div className="max-h-48 overflow-y-auto">
              {issues.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  {isScanning ? 'Scanning for issues...' : 'No accessibility issues found.'}
                </p>
              ) : (
                <ul className="space-y-2">
                  {issues.slice(0, 5).map((issue) => (
                    <li key={issue.id} className="text-xs border-l-2 pl-3 py-1" style={{
                      borderLeftColor: issue.type === 'error' ? '#dc2626' :
                                     issue.type === 'warning' ? '#d97706' : '#2563eb'
                    }}>
                      <div className="font-medium text-gray-900">{issue.message}</div>
                      <div className="text-gray-600 mt-1">{issue.suggestion}</div>
                      {issue.element && (
                        <div className="text-gray-500 mt-1 font-mono">{issue.element}</div>
                      )}
                    </li>
                  ))}
                  {issues.length > 5 && (
                    <li className="text-xs text-gray-500 text-center py-2">
                      ... and {issues.length - 5} more issues
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                WCAG 2.1 AA Compliance Checker
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};