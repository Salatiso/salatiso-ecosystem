/**
 * Analytics Dashboard Component
 * 
 * Comprehensive analytics dashboard showing:
 * - Participation metrics
 * - Collaboration effectiveness
 * - Ubuntu alignment scores
 * - Business impact
 * - Visual charts and trends
 * 
 * @module AnalyticsDashboard
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AnalyticsService, getAnalyticsService } from '@/services/AnalyticsService';
import { AnalyticsDashboardData, TimePeriod } from '@/types/analytics';
import { useTranslation } from '@/contexts/I18nContext';
import MetricCard from './MetricCard';
import TrendChart from './TrendChart';
import UbuntuAlignmentGauge from './UbuntuAlignmentGauge';

interface AnalyticsDashboardProps {
  /** Family ID */
  familyId: string;
  /** User ID */
  userId: string;
  /** User role */
  userRole?: 'elder' | 'member' | 'guest';
}

/**
 * Analytics dashboard component
 */
export default function AnalyticsDashboard({
  familyId,
  userId,
  userRole = 'member'
}: AnalyticsDashboardProps) {
  const { t } = useTranslation();
  const [service] = useState<AnalyticsService>(() => getAnalyticsService(familyId));
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'participation' | 'collaboration' | 'ubuntu' | 'business'>('overview');

  // Load dashboard data
  useEffect(() => {
    loadData();
  }, [selectedPeriod, familyId]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dashboardData = await service.getDashboardData(selectedPeriod);
      setData(dashboardData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load analytics');
      setError(error);
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">{t('analytics.loading', 'Loading analytics...')}</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t('analytics.errorTitle', 'Failed to Load Analytics')}
          </h2>
          <p className="text-gray-600 mb-4">{error?.message}</p>
          <button
            onClick={loadData}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
          >
            {t('common.retry', 'Retry')}
          </button>
        </div>
      </div>
    );
  }

  const timePeriods: { value: TimePeriod; label: string }[] = [
    { value: 'day', label: t('analytics.period.day', 'Last 24 Hours') },
    { value: 'week', label: t('analytics.period.week', 'Last 7 Days') },
    { value: 'month', label: t('analytics.period.month', 'Last 30 Days') },
    { value: 'quarter', label: t('analytics.period.quarter', 'Last 3 Months') },
    { value: 'year', label: t('analytics.period.year', 'Last Year') },
    { value: 'all', label: t('analytics.period.all', 'All Time') }
  ];

  return (
    <div className="analytics-dashboard min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('analytics.title', 'Family Analytics Dashboard')}
              </h1>
              <p className="text-gray-600">
                {t('analytics.subtitle', 'Track collaboration, Ubuntu alignment, and business impact')}
              </p>
            </div>

            {/* Export button (for elders) */}
            {userRole === 'elder' && (
              <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{t('analytics.export', 'Export Report')}</span>
              </button>
            )}
          </div>

          {/* Time period selector */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {timePeriods.map(period => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedPeriod === period.value
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: t('analytics.tabs.overview', 'Overview'), icon: '📊' },
              { id: 'participation', label: t('analytics.tabs.participation', 'Participation'), icon: '👥' },
              { id: 'collaboration', label: t('analytics.tabs.collaboration', 'Collaboration'), icon: '🤝' },
              { id: 'ubuntu', label: t('analytics.tabs.ubuntu', 'Ubuntu Alignment'), icon: '🌍' },
              { id: 'business', label: t('analytics.tabs.business', 'Business Impact'), icon: '💼' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 border-b-2 font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key metrics grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title={t('analytics.metrics.participation', 'Participation Rate')}
                value={`${data.participation.participationRate.toFixed(1)}%`}
                trend={data.participation.trend}
                change={data.participation.changePercentage}
                icon="👥"
                color="blue"
              />
              <MetricCard
                title={t('analytics.metrics.collaboration', 'Collaboration Score')}
                value={data.collaboration.consensusScore}
                trend={data.collaboration.trend}
                change={data.collaboration.changePercentage}
                icon="🤝"
                color="green"
              />
              <MetricCard
                title={t('analytics.metrics.ubuntu', 'Ubuntu Alignment')}
                value={`${data.ubuntu.overallScore}%`}
                trend={data.ubuntu.trend}
                change={data.ubuntu.changePercentage}
                icon="🌍"
                color="orange"
              />
              <MetricCard
                title={t('analytics.metrics.impact', 'Economic Impact')}
                value={`$${(data.businessImpact.estimatedEconomicValue / 1000).toFixed(0)}K`}
                trend={data.businessImpact.trend}
                change={data.businessImpact.changePercentage}
                icon="💼"
                color="purple"
              />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Participation trend */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('analytics.charts.participation', 'Participation Trend')}
                </h3>
                <TrendChart
                  data={data.timeSeries.participation}
                  color="#3B82F6"
                  height={250}
                />
              </div>

              {/* Ubuntu alignment gauge */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('analytics.charts.ubuntu', 'Ubuntu Alignment')}
                </h3>
                <UbuntuAlignmentGauge
                  score={data.ubuntu.overallScore}
                  breakdown={{
                    respect: data.ubuntu.respectScore,
                    community: data.ubuntu.communityScore,
                    sharing: data.ubuntu.sharingScore,
                    harmony: data.ubuntu.harmonyScore,
                    leadership: data.ubuntu.leadershipScore
                  }}
                />
              </div>
            </div>

            {/* Activity summary */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('analytics.activity.title', 'Recent Activity')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {t('analytics.activity.videoCall', 'Video Calls')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.videoConference.totalCalls}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {t('analytics.activity.templatesCompleted', 'Templates Completed')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.businessImpact.templatesCompleted}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {t('analytics.activity.coEditing', 'Co-Editing Sessions')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.collaboration.coEditingSessionCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {t('analytics.activity.activeMembers', 'Active Members')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.participation.activeMemberCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Participation Tab */}
        {activeTab === 'participation' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title={t('analytics.participation.activeMembers', 'Active Members')}
                value={data.participation.activeMemberCount}
                subtitle={`${data.participation.participationRate.toFixed(0)}% participation`}
                icon="👥"
                color="blue"
              />
              <MetricCard
                title={t('analytics.participation.avgSessions', 'Avg Sessions')}
                value={data.participation.avgSessionsPerMember.toFixed(1)}
                subtitle={t('analytics.participation.perMember', 'per member')}
                icon="📊"
                color="green"
              />
              <MetricCard
                title={t('analytics.participation.totalTime', 'Total Time')}
                value={`${Math.floor(data.participation.totalTimeSpent / 60)}h`}
                subtitle={`${data.participation.avgSessionDuration} min avg`}
                icon="⏱️"
                color="purple"
              />
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('analytics.participation.chart', 'Participation Over Time')}
              </h3>
              <TrendChart
                data={data.timeSeries.participation}
                color="#3B82F6"
                height={300}
              />
            </div>
          </div>
        )}

        {/* Collaboration Tab */}
        {activeTab === 'collaboration' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title={t('analytics.collaboration.sessions', 'Collaborative Sessions')}
                value={data.collaboration.collaborativeSessionCount}
                icon="🤝"
                color="green"
              />
              <MetricCard
                title={t('analytics.collaboration.consensus', 'Consensus Score')}
                value={`${data.collaboration.consensusScore}%`}
                icon="✅"
                color="blue"
              />
              <MetricCard
                title={t('analytics.collaboration.elderRate', 'Elder Participation')}
                value={`${data.collaboration.elderParticipationRate}%`}
                icon="👑"
                color="orange"
              />
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('analytics.collaboration.chart', 'Collaboration Trend')}
              </h3>
              <TrendChart
                data={data.timeSeries.collaboration}
                color="#10B981"
                height={300}
              />
            </div>
          </div>
        )}

        {/* Ubuntu Tab */}
        {activeTab === 'ubuntu' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  {t('analytics.ubuntu.gaugeTitle', 'Ubuntu Alignment Score')}
                </h3>
                <UbuntuAlignmentGauge
                  score={data.ubuntu.overallScore}
                  breakdown={{
                    respect: data.ubuntu.respectScore,
                    community: data.ubuntu.communityScore,
                    sharing: data.ubuntu.sharingScore,
                    harmony: data.ubuntu.harmonyScore,
                    leadership: data.ubuntu.leadershipScore
                  }}
                />
              </div>

              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('analytics.ubuntu.practices', 'Ubuntu Practices')}
                </h3>
                <div className="space-y-4">
                  {[
                    { label: t('analytics.ubuntu.elderConsultation', 'Elder Consultation'), value: data.ubuntu.practices.elderConsultationRate },
                    { label: t('analytics.ubuntu.consensusDecisions', 'Consensus Decisions'), value: data.ubuntu.practices.consensusDecisionRate },
                    { label: t('analytics.ubuntu.knowledgeSharing', 'Knowledge Sharing'), value: data.ubuntu.practices.knowledgeSharingInstances },
                    { label: t('analytics.ubuntu.mentorship', 'Mentorship Sessions'), value: data.ubuntu.practices.mentorshipSessions }
                  ].map((practice, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{practice.label}</span>
                        <span className="font-medium text-gray-900">{practice.value}{index < 2 ? '%' : ''}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${index < 2 ? practice.value : Math.min(practice.value * 2, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business Impact Tab */}
        {activeTab === 'business' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title={t('analytics.business.templatesCompleted', 'Templates Completed')}
                value={data.businessImpact.templatesCompleted}
                icon="📄"
                color="blue"
              />
              <MetricCard
                title={t('analytics.business.economicValue', 'Economic Value')}
                value={`$${(data.businessImpact.estimatedEconomicValue / 1000).toFixed(0)}K`}
                icon="💰"
                color="green"
              />
              <MetricCard
                title={t('analytics.business.businessesStarted', 'Businesses Started')}
                value={data.businessImpact.businessesStarted}
                icon="🏢"
                color="purple"
              />
              <MetricCard
                title={t('analytics.business.jobsCreated', 'Jobs Created')}
                value={data.businessImpact.jobsCreated}
                icon="💼"
                color="orange"
              />
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('analytics.business.chart', 'Business Impact Over Time')}
              </h3>
              <TrendChart
                data={data.timeSeries.businessImpact}
                color="#8B5CF6"
                height={300}
              />
            </div>
          </div>
        )}

        {/* Ubuntu footer */}
        <div className="mt-8 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg shadow-lg p-6 text-white text-center">
          <p className="text-lg font-semibold mb-2">
            {t('analytics.ubuntu.footer', 'Umuntu Ngumuntu Ngabantu')}
          </p>
          <p className="text-orange-100">
            {t('analytics.ubuntu.footerDescription', 'I am because we are - Measuring our collective journey')}
          </p>
        </div>
      </div>
    </div>
  );
}
