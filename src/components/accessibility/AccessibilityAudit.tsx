import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

export interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  suggestion: string;
  wcagGuideline: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
}

interface AccessibilityAuditProps {
  component?: React.ComponentType;
  pagePath?: string;
  autoScan?: boolean;
  onIssuesFound?: (issues: AccessibilityIssue[]) => void;
}

export const useAccessibilityAudit = ({
  component,
  pagePath,
  autoScan = false,
  onIssuesFound,
}: AccessibilityAuditProps = {}) => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();

  const scanForIssues = useCallback(async () => {
    setIsScanning(true);
    const foundIssues: AccessibilityIssue[] = [];

    // Scan for common accessibility issues
    const scanDocument = () => {
      // Check for missing alt text on images
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (!img.getAttribute('alt') && !img.getAttribute('aria-label')) {
          foundIssues.push({
            id: `img-alt-${index}`,
            type: 'error',
            message: 'Image missing alt text or aria-label',
            element: `img[src="${img.src}"]`,
            suggestion: 'Add alt attribute describing the image content, or aria-label if decorative',
            wcagGuideline: '1.1.1 Non-text Content',
            impact: 'critical',
          });
        }
      });

      // Check for missing form labels
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach((input, index) => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
          foundIssues.push({
            id: `input-label-${index}`,
            type: 'error',
            message: 'Form input missing associated label',
            element: input.tagName.toLowerCase(),
            suggestion: 'Add a <label> element with for attribute, or aria-label/aria-labelledby',
            wcagGuideline: '1.3.1 Info and Relationships',
            impact: 'serious',
          });
        }
      });

      // Check for insufficient color contrast
      const textElements = document.querySelectorAll('*');
      textElements.forEach((element, index) => {
        const style = window.getComputedStyle(element);
        const color = style.color;
        const backgroundColor = style.backgroundColor;

        // Basic contrast check (simplified - in production use a proper contrast library)
        if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
          // This is a simplified check - real implementation would calculate actual contrast ratio
          if (color === backgroundColor) {
            foundIssues.push({
              id: `contrast-${index}`,
              type: 'warning',
              message: 'Potential insufficient color contrast',
              element: element.tagName.toLowerCase(),
              suggestion: 'Ensure contrast ratio is at least 4.5:1 for normal text, 3:1 for large text',
              wcagGuideline: '1.4.3 Contrast (Minimum)',
              impact: 'moderate',
            });
          }
        }
      });

      // Check for missing heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level - lastLevel > 1 && lastLevel !== 0) {
          foundIssues.push({
            id: `heading-hierarchy-${index}`,
            type: 'warning',
            message: 'Skipped heading level in hierarchy',
            element: heading.tagName.toLowerCase(),
            suggestion: 'Ensure heading levels follow a logical hierarchy (h1 → h2 → h3, etc.)',
            wcagGuideline: '1.3.1 Info and Relationships',
            impact: 'moderate',
          });
        }
        lastLevel = level;
      });

      // Check for missing lang attribute
      if (!document.documentElement.getAttribute('lang')) {
        foundIssues.push({
          id: 'missing-lang',
          type: 'error',
          message: 'Missing lang attribute on html element',
          element: 'html',
          suggestion: 'Add lang attribute to <html> element (e.g., lang="en")',
          wcagGuideline: '3.1.1 Language of Page',
          impact: 'serious',
        });
      }

      // Check for focus management issues
      const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
      focusableElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          foundIssues.push({
            id: `focus-hidden-${index}`,
            type: 'warning',
            message: 'Focusable element may be hidden or have zero dimensions',
            element: element.tagName.toLowerCase(),
            suggestion: 'Ensure focusable elements are visible and have appropriate dimensions',
            wcagGuideline: '2.4.7 Focus Visible',
            impact: 'moderate',
          });
        }
      });

      // Check for missing ARIA roles where needed
      const customElements = document.querySelectorAll('[role]');
      customElements.forEach((element, index) => {
        const role = element.getAttribute('role');
        if (role === 'button' && element.tagName.toLowerCase() !== 'button') {
          if (!element.getAttribute('tabindex')) {
            foundIssues.push({
              id: `aria-button-tabindex-${index}`,
              type: 'error',
              message: 'Custom button role missing tabindex',
              element: element.tagName.toLowerCase(),
              suggestion: 'Add tabindex="0" to make the element focusable',
              wcagGuideline: '4.1.2 Name, Role, Value',
              impact: 'serious',
            });
          }
        }
      });
    };

    // Run the scan
    if (typeof window !== 'undefined') {
      scanDocument();
    }

    setIssues(foundIssues);
    onIssuesFound?.(foundIssues);
    setIsScanning(false);

    return foundIssues;
  }, [onIssuesFound]);

  useEffect(() => {
    if (autoScan) {
      // Delay scan to allow component to render
      const timer = setTimeout(() => {
        scanForIssues();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [autoScan, scanForIssues, router.pathname]);

  return {
    issues,
    isScanning,
    scanForIssues,
    clearIssues: () => setIssues([]),
  };
};

// Accessibility Audit Dashboard Component
interface AccessibilityAuditDashboardProps {
  issues: AccessibilityIssue[];
  isScanning: boolean;
  onScan: () => void;
  onClear: () => void;
  className?: string;
}

export const AccessibilityAuditDashboard: React.FC<AccessibilityAuditDashboardProps> = ({
  issues,
  isScanning,
  onScan,
  onClear,
  className = '',
}) => {
  const errorCount = issues.filter(issue => issue.type === 'error').length;
  const warningCount = issues.filter(issue => issue.type === 'warning').length;
  const infoCount = issues.filter(issue => issue.type === 'info').length;

  const getImpactColor = (impact: AccessibilityIssue['impact']) => {
    switch (impact) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'serious': return 'text-orange-600 bg-orange-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'minor': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeColor = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Accessibility Audit</h2>
          <div className="flex space-x-2">
            <button
              onClick={onScan}
              disabled={isScanning}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isScanning ? 'Scanning...' : 'Scan Page'}
            </button>
            <button
              onClick={onClear}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-4 flex space-x-6">
          <div className="flex items-center">
            <span className="text-sm text-gray-500">Errors:</span>
            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${errorCount > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
              {errorCount}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">Warnings:</span>
            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${warningCount > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
              {warningCount}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">Info:</span>
            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${infoCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
              {infoCount}
            </span>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {issues.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            {isScanning ? 'Scanning for accessibility issues...' : 'No accessibility issues found.'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {issues.map((issue) => (
              <li key={issue.id} className="px-6 py-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(issue.type)} bg-current bg-opacity-10`}>
                      {issue.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">{issue.message}</p>
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(issue.impact)}`}>
                        {issue.impact}
                      </span>
                    </div>
                    {issue.element && (
                      <p className="mt-1 text-sm text-gray-500">Element: {issue.element}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-700">{issue.suggestion}</p>
                    <p className="mt-1 text-xs text-gray-500">WCAG: {issue.wcagGuideline}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Hook for automated accessibility testing in development
export const useAccessibilityTesting = () => {
  const [testResults, setTestResults] = useState<{
    passed: number;
    failed: number;
    total: number;
    details: AccessibilityIssue[];
  }>({ passed: 0, failed: 0, total: 0, details: [] });

  const { scanForIssues } = useAccessibilityAudit({ autoScan: false });

  const runAccessibilityTests = useCallback(async () => {
    const issues = await scanForIssues();

    const passed = issues.filter(issue => issue.type === 'info').length;
    const failed = issues.filter(issue => issue.type !== 'info').length;

    const results = {
      passed,
      failed,
      total: issues.length,
      details: issues,
    };

    setTestResults(results);
    return results;
  }, [scanForIssues]);

  return {
    testResults,
    runAccessibilityTests,
  };
};