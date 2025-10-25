/**
 * RecommendationCard Component - AI Template Recommendation Display
 * 
 * Displays a single template recommendation with:
 * - Relevance score and reasoning
 * - Ubuntu alignment indicators
 * - Collaboration suggestions
 * - Accept/reject actions
 * - Expandable explanation
 * 
 * @module RecommendationCard
 */

'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/contexts/I18nContext';
import { Recommendation } from '@/services/AIRecommendationService';
import { useRouter } from 'next/router';

interface RecommendationCardProps {
  /** Recommendation data */
  recommendation: Recommendation;
  /** Callback when user accepts recommendation */
  onAccept: () => void;
  /** Callback when user rejects recommendation */
  onReject: () => void;
  /** Full explanation text */
  explanation: string;
}

/**
 * Template recommendation card
 */
export default function RecommendationCard({
  recommendation,
  onAccept,
  onReject,
  explanation
}: RecommendationCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [isActioning, setIsActioning] = useState(false);

  const handleAccept = async () => {
    setIsActioning(true);
    await onAccept();
    // Navigate to template
    router.push(`/templates/${recommendation.templateId}`);
  };

  const handleReject = async () => {
    setIsActioning(true);
    await onReject();
    setIsActioning(false);
  };

  // Get relevance color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Header with score */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 border-b border-orange-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {recommendation.templateTitle}
              </h3>
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(recommendation.relevanceScore)}`}>
                {recommendation.relevanceScore}% {t('ai.match', 'Match')}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{recommendation.estimatedTime} {t('ai.minutes', 'min')}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{recommendation.collaborationSuggestion.optimalGroupSize} {t('ai.people', 'people')}</span>
              </div>
            </div>
          </div>

          {/* AI badge */}
          <div className="ml-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
              <span>{t('ai.aiSuggested', 'AI Suggested')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
        {/* Why this template */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {t('ai.whyRecommended', 'Why we recommend this:')}
          </h4>
          <ul className="space-y-2">
            {recommendation.reasoning.slice(0, 3).map((reason, index) => (
              <li key={index} className="flex items-start text-sm text-gray-700">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ubuntu alignment */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r-lg mb-4">
          <h4 className="text-sm font-semibold text-orange-900 mb-2">
            {t('ai.ubuntuAlignment', 'Ubuntu Alignment')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendation.ubuntuAlignment.principles.map((principle, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full"
              >
                🤝 {principle}
              </span>
            ))}
          </div>
        </div>

        {/* Collaboration suggestion */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            {t('ai.collaborationSuggestion', 'Collaboration Suggestion')}
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span>
                {t('ai.optimalGroup', 'Optimal group:')} {recommendation.collaborationSuggestion.optimalGroupSize} {t('ai.familyMembers', 'family members')}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {recommendation.collaborationSuggestion.requiredRoles.map((role, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Prerequisites */}
        {recommendation.prerequisites.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <h4 className="text-sm font-semibold text-yellow-900 mb-2">
              {t('ai.prerequisites', 'Complete these first:')}
            </h4>
            <ul className="space-y-1">
              {recommendation.prerequisites.map((prereq, index) => (
                <li key={index} className="text-sm text-yellow-800 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  {prereq}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expandable details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1 mb-4"
        >
          <span>{showDetails ? t('ai.hideDetails', 'Hide Details') : t('ai.showDetails', 'Show Full Explanation')}</span>
          <svg
            className={`w-4 h-4 transition-transform ${showDetails ? 'transform rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
              {explanation}
            </pre>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <button
          onClick={handleReject}
          disabled={isActioning}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{t('ai.notInterested', 'Not Interested')}</span>
        </button>

        <button
          onClick={handleAccept}
          disabled={isActioning}
          className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isActioning ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{t('ai.starting', 'Starting...')}</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t('ai.startTemplate', 'Start Template')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
