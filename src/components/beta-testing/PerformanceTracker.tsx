import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { BetaTester, WeeklyReport, PerformanceMetric } from '@/types';

interface PerformanceTrackerProps {
  personId: string;
  metrics: PerformanceMetric[];
  includeTesting?: boolean;
  showCareerImpact?: boolean;
  className?: string;
}

export const PerformanceTracker: React.FC<PerformanceTrackerProps> = ({
  personId,
  metrics: initialMetrics = [],
  includeTesting = true,
  showCareerImpact = true,
  className = ''
}) => {
  const [betaTester, setBetaTester] = useState<BetaTester | null>(null);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>(initialMetrics);

  // Load beta tester data
  useEffect(() => {
    if (!includeTesting) {
      setLoading(false);
      return;
    }

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
  }, [personId, includeTesting]);

  // Load weekly reports for performance calculation
  useEffect(() => {
    if (!includeTesting) return;

    const q = query(
      collection(db, 'weekly_reports'),
      where('personId', '==', personId),
      orderBy('weekStart', 'desc'),
      where('status', '==', 'submitted')
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
  }, [personId, includeTesting]);

  // Calculate testing performance metrics
  useEffect(() => {
    if (!includeTesting || !betaTester) return;

    const testingMetrics: PerformanceMetric[] = [];

    // Report submission consistency
    const totalWeeks = Math.max(1, Math.ceil((new Date().getTime() - (betaTester.assignedDate.toDate ? betaTester.assignedDate.toDate() : betaTester.assignedDate).getTime()) / (7 * 24 * 60 * 60 * 1000)));
    const submittedReports = reports.length;
    const consistencyScore = Math.min(100, (submittedReports / totalWeeks) * 100);

    testingMetrics.push({
      id: 'testing-consistency',
      name: 'Report Submission Consistency',
      value: consistencyScore,
      target: 80,
      unit: '%',
      category: 'testing',
      trend: consistencyScore >= 80 ? 'up' : consistencyScore >= 60 ? 'stable' : 'down',
      lastUpdated: new Date()
    });

    // Average report quality
    const avgQuality = betaTester.averageReportQuality;
    testingMetrics.push({
      id: 'testing-quality',
      name: 'Average Report Quality',
      value: avgQuality,
      target: 4.0,
      unit: '/5',
      category: 'testing',
      trend: avgQuality >= 4.0 ? 'up' : avgQuality >= 3.0 ? 'stable' : 'down',
      lastUpdated: new Date()
    });

    // Performance score
    const performanceScore = betaTester.performanceScore;
    testingMetrics.push({
      id: 'testing-performance',
      name: 'Overall Testing Performance',
      value: performanceScore,
      target: 75,
      unit: '/100',
      category: 'testing',
      trend: performanceScore >= 75 ? 'up' : performanceScore >= 50 ? 'stable' : 'down',
      lastUpdated: new Date()
    });

    // Total reports submitted
    testingMetrics.push({
      id: 'testing-reports',
      name: 'Reports Submitted',
      value: submittedReports,
      target: totalWeeks,
      unit: '',
      category: 'testing',
      trend: submittedReports >= totalWeeks ? 'up' : submittedReports >= totalWeeks * 0.8 ? 'stable' : 'down',
      lastUpdated: new Date()
    });

    setPerformanceMetrics(prev => {
      // Remove existing testing metrics and add new ones
      const nonTestingMetrics = prev.filter(m => m.category !== 'testing');
      return [...nonTestingMetrics, ...testingMetrics];
    });
  }, [betaTester, reports, includeTesting]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <span className="text-green-500">↗</span>;
      case 'down':
        return <span className="text-red-500">↘</span>;
      default:
        return <span className="text-gray-500">→</span>;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Loading performance data...</span>
      </div>
    );
  }

  const testingMetrics = performanceMetrics.filter(m => m.category === 'testing');
  const careerMetrics = performanceMetrics.filter(m => m.category === 'career');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Testing Performance */}
      {includeTesting && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Beta Testing Performance</h3>
            {betaTester && (
              <div className="text-sm text-gray-600">
                Level: <span className="font-medium">{betaTester.testingLevel}</span>
              </div>
            )}
          </div>

          {testingMetrics.length === 0 ? (
            <p className="text-gray-600">No testing performance data available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testingMetrics.map((metric) => (
                <div key={metric.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{metric.name}</h4>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className={`text-lg font-bold ${getTrendColor(metric.trend)}`}>
                          {metric.value}{metric.unit}
                        </span>
                        {getTrendIcon(metric.trend)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Target</div>
                      <div className="text-sm font-medium text-gray-900">
                        {metric.target}{metric.unit}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.value >= metric.target
                            ? 'bg-green-500'
                            : metric.value >= metric.target * 0.8
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (metric.value / metric.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Achievements */}
          {betaTester && betaTester.achievements.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Achievements</h4>
              <div className="flex flex-wrap gap-2">
                {betaTester.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    🏆 {achievement.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Career Impact */}
      {showCareerImpact && careerMetrics.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Career Development Impact</h3>

          <div className="space-y-4">
            {careerMetrics.map((metric) => (
              <div key={metric.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{metric.name}</h4>
                  <p className="text-xs text-gray-600">
                    Last updated: {metric.lastUpdated.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-lg font-bold ${getTrendColor(metric.trend)}`}>
                    {metric.value}{metric.unit}
                  </span>
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
            ))}
          </div>

          {/* Career Integration Note */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">Career Integration</h4>
                <div className="mt-2 text-sm text-blue-700">
                  Your beta testing contributions are automatically included in your career development records and performance reviews, demonstrating your commitment to quality and continuous improvement.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overall Performance Summary */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {performanceMetrics.filter(m => m.trend === 'up').length}
            </div>
            <div className="text-sm text-gray-600">Improving</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {performanceMetrics.filter(m => m.trend === 'stable').length}
            </div>
            <div className="text-sm text-gray-600">Stable</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {performanceMetrics.filter(m => m.trend === 'down').length}
            </div>
            <div className="text-sm text-gray-600">Needs Attention</div>
          </div>
        </div>

        {/* Recommendations */}
        {performanceMetrics.some(m => m.trend === 'down') && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Recommendations</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {performanceMetrics
                .filter(m => m.trend === 'down')
                .map(metric => (
                  <li key={metric.id}>
                    • Focus on improving {metric.name.toLowerCase()} (currently {metric.value}{metric.unit}, target: {metric.target}{metric.unit})
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};