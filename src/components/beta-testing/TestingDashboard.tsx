import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { WeeklyReport, TestingAnalytics, BetaTester } from '@/types';

interface TestingDashboardProps {
  personId: string;
  viewMode?: 'personal' | 'family' | 'admin';
  timeRange?: 'week' | 'month' | 'quarter';
  showAnalytics?: boolean;
  className?: string;
}

export const TestingDashboard: React.FC<TestingDashboardProps> = ({
  personId,
  viewMode = 'personal',
  timeRange = 'week',
  showAnalytics = true,
  className = ''
}) => {
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [analytics, setAnalytics] = useState<TestingAnalytics | null>(null);
  const [betaTester, setBetaTester] = useState<BetaTester | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'analytics'>('overview');

  // Load beta tester data
  useEffect(() => {
    const loadBetaTester = async () => {
      try {
        const testerDoc = await getDoc(doc(db, 'beta_testers', personId));
        if (testerDoc.exists()) {
          setBetaTester(testerDoc.data() as BetaTester);
        }
      } catch (error) {
        console.error('Error loading beta tester:', error);
      }
    };

    loadBetaTester();
  }, [personId]);

  // Load weekly reports
  useEffect(() => {
    const q = query(
      collection(db, 'weekly_reports'),
      where('personId', '==', personId),
      orderBy('weekStart', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WeeklyReport[];
      setReports(reportsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [personId]);

  // Load analytics if enabled
  useEffect(() => {
    if (!showAnalytics) return;

    const loadAnalytics = async () => {
      try {
        // Get the latest analytics document
        const analyticsQuery = query(
          collection(db, 'testing_analytics'),
          orderBy('generatedAt', 'desc'),
          where('period', '==', timeRange)
        );

        const unsubscribe = onSnapshot(analyticsQuery, (snapshot) => {
          if (!snapshot.empty) {
            const latestAnalytics = snapshot.docs[0].data() as TestingAnalytics;
            setAnalytics(latestAnalytics);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading analytics:', error);
      }
    };

    loadAnalytics();
  }, [showAnalytics, timeRange]);

  const getCurrentWeekReport = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return reports.find(report => {
      const reportDate = report.weekStart.toDate ? report.weekStart.toDate() : report.weekStart;
      return reportDate.toDateString() === startOfWeek.toDateString();
    });
  };

  const getPendingReports = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return reports.filter(report => {
      const reportDate = report.weekStart.toDate ? report.weekStart.toDate() : report.weekStart;
      return report.status === 'draft' && reportDate < oneWeekAgo;
    });
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Loading testing dashboard...</span>
      </div>
    );
  }

  const currentReport = getCurrentWeekReport();
  const pendingReports = getPendingReports();

  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Testing Dashboard</h2>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              betaTester?.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {betaTester?.status || 'Inactive'}
            </span>
            <span className="text-sm text-gray-500">
              Level: {betaTester?.testingLevel || 'Not Set'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4">
          <nav className="flex space-x-8">
            {['overview', 'reports', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Current Week Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">This Week&apos;s Report</h3>
              {currentReport ? (
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      currentReport.status === 'submitted'
                        ? 'bg-green-100 text-green-800'
                        : currentReport.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {currentReport.status}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {currentReport.appsTested.length} apps tested
                    </span>
                  </div>
                    <div className="text-sm text-gray-500">
                      Due: {(() => {
                        const weekEnd = currentReport.weekEnd.toDate ? currentReport.weekEnd.toDate() : currentReport.weekEnd;
                        return new Date(weekEnd.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString();
                      })()}
                    </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No report started for this week</p>
              )}
            </div>

            {/* Pending Reports Alert */}
            {pendingReports.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      {pendingReports.length} Pending Report{pendingReports.length > 1 ? 's' : ''}
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      You have overdue weekly reports that need to be submitted.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">{reports.length}</div>
                <div className="text-sm text-gray-600">Total Reports</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-green-600">
                  {reports.filter(r => r.status === 'submitted').length}
                </div>
                <div className="text-sm text-gray-600">Submitted</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">
                  {betaTester?.averageReportQuality.toFixed(1) || '0.0'}
                </div>
                <div className="text-sm text-gray-600">Avg Quality</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-orange-600">
                  {betaTester?.performanceScore || 0}
                </div>
                <div className="text-sm text-gray-600">Performance</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Weekly Reports</h3>
            {reports.length === 0 ? (
              <p className="text-gray-600">No reports submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          Week of {(() => {
                            const weekStart = report.weekStart.toDate ? report.weekStart.toDate() : report.weekStart;
                            return weekStart.toLocaleDateString();
                          })()}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {report.appsTested.length} apps tested • {report.bugsFound.length} bugs found
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === 'submitted'
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {report.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          Rating: {report.overallRating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && showAnalytics && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Testing Analytics</h3>
            {analytics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Family Overview</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Testers:</span>
                      <span className="text-sm font-medium">{analytics.totalTesters}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Testers:</span>
                      <span className="text-sm font-medium">{analytics.activeTesters}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Reports This Period:</span>
                      <span className="text-sm font-medium">{analytics.reportsSubmitted}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Bug Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Bugs:</span>
                      <span className="text-sm font-medium">{analytics.bugsFound}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-red-600">Critical:</span>
                      <span className="text-sm font-medium">{analytics.bugsBySeverity.critical}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-orange-600">High:</span>
                      <span className="text-sm font-medium">{analytics.bugsBySeverity.high}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Analytics data not available yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};