/**
 * TemplateVideoSidebar Component - Template Reference During Video Calls
 * 
 * Displays template content in a sidebar during video calls for reference.
 * Allows family members to discuss template sections while viewing them.
 * 
 * @module TemplateVideoSidebar
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/I18nContext';

interface TemplateVideoSidebarProps {
  /** Template ID to display */
  templateId: string;
}

interface TemplateSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface TemplateData {
  id: string;
  title: string;
  category: string;
  description: string;
  sections: TemplateSection[];
  progress?: number;
}

/**
 * Template sidebar for video calls
 */
export default function TemplateVideoSidebar({ templateId }: TemplateVideoSidebarProps) {
  const { t } = useTranslation();
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Load template data
  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual Firestore query
      // For now, mock template data
      const mockTemplate: TemplateData = {
        id: templateId,
        title: 'Family Business Strategy Template',
        category: 'Business',
        description: 'Strategic planning template for family business development',
        progress: 45,
        sections: [
          {
            id: 'section-1',
            title: 'Business Vision',
            content: 'Define the long-term vision for your family business. Consider how this vision aligns with Ubuntu values and collective well-being.',
            order: 1
          },
          {
            id: 'section-2',
            title: 'Market Analysis',
            content: 'Analyze your target market, competitors, and opportunities. Focus on community needs and sustainable growth.',
            order: 2
          },
          {
            id: 'section-3',
            title: 'Financial Planning',
            content: 'Develop financial projections, budget allocations, and funding strategies. Ensure transparency and collective decision-making.',
            order: 3
          },
          {
            id: 'section-4',
            title: 'Family Roles',
            content: 'Define roles and responsibilities for family members. Honor elder wisdom while empowering younger generations.',
            order: 4
          },
          {
            id: 'section-5',
            title: 'Governance Structure',
            content: 'Establish decision-making processes, conflict resolution mechanisms, and accountability systems.',
            order: 5
          }
        ]
      };

      setTemplate(mockTemplate);
    } catch (err) {
      setError('Failed to load template');
      console.error('Template load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">{t('video.loadingTemplate', 'Loading template...')}</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 mb-4">{error || t('video.templateNotFound', 'Template not found')}</p>
          <button
            onClick={loadTemplate}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            {t('video.retry', 'Retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-orange-100 text-xs font-medium uppercase tracking-wide">
              {t('video.templateReference', 'Template Reference')}
            </p>
            <h3 className="text-white font-semibold text-lg mt-1">
              {template.title}
            </h3>
          </div>
        </div>

        {/* Progress bar */}
        {template.progress !== undefined && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-orange-100 mb-1">
              <span>{t('video.progress', 'Progress')}</span>
              <span>{template.progress}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${template.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="p-4 bg-orange-50 border-b border-orange-100">
        <p className="text-sm text-gray-700">{template.description}</p>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {template.sections
            .sort((a, b) => a.order - b.order)
            .map((section, index) => (
              <div
                key={section.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-orange-300 transition-colors"
              >
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{section.title}</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedSection === section.id ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Section content */}
                {expandedSection === section.id && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Footer actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => {
            // TODO: Open full template in new window or separate view
            window.open(`/templates/${templateId}`, '_blank');
          }}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>{t('video.openFullTemplate', 'Open Full Template')}</span>
        </button>
      </div>
    </div>
  );
}
