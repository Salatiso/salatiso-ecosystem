import React, { useEffect, useState } from 'react';
import { collection, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { BetaTester } from '@/types';
import { TestingDashboard } from './TestingDashboard';
import { WeeklyReport } from './WeeklyReport';
import { PerformanceTracker } from './PerformanceTracker';

interface BetaTestingProps {
  personId: string;
  testingUrl?: string;
  showWeeklyReports?: boolean;
  showPerformanceMetrics?: boolean;
  editable?: boolean;
  className?: string;
}

export const BetaTesting: React.FC<BetaTestingProps> = ({
  personId,
  testingUrl = 'https://bizhelp-lifecv.web.app/testing',
  showWeeklyReports = true,
  showPerformanceMetrics = true,
  editable = false,
  className = ''
}) => {
  const { user } = useAuth();
  const [betaTester, setBetaTester] = useState<BetaTester | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Automatic beta tester assignment
  useEffect(() => {
    const assignBetaTester = async () => {
      if (!user || !personId) return;

      try {
        const testerRef = doc(db, 'beta_testers', personId);
        const testerSnap = await getDoc(testerRef);

        if (!testerSnap.exists()) {
          // Auto-assign as beta tester
          const newTester: BetaTester = {
            id: personId,
            personId,
            assignedDate: new Date(),
            status: 'active',
            testingLevel: 'basic',
            specializations: [],
            weeklyReportRequired: true,
            totalReportsSubmitted: 0,
            averageReportQuality: 0,
            performanceScore: 0,
            achievements: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };

          await setDoc(testerRef, newTester);
          setBetaTester(newTester);
        } else {
          setBetaTester(testerSnap.data() as BetaTester);
        }
      } catch (err) {
        console.error('Error assigning beta tester:', err);
        setError('Failed to assign beta tester');
      } finally {
        setLoading(false);
      }
    };

    assignBetaTester();
  }, [user, personId]);

  // Real-time updates
  useEffect(() => {
    if (!personId) return;

    const unsubscribe = onSnapshot(
      doc(db, 'beta_testers', personId),
      (doc) => {
        if (doc.exists()) {
          setBetaTester(doc.data() as BetaTester);
        }
      },
      (error) => {
        console.error('Error listening to beta tester updates:', error);
        setError('Failed to load beta tester data');
      }
    );

    return () => unsubscribe();
  }, [personId]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Setting up beta testing...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Beta Testing Setup Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!betaTester) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Beta Testing Not Available</h3>
            <div className="mt-2 text-sm text-yellow-700">
              Unable to access beta testing features. Please contact support.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Beta Testing Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Beta Testing Status</h2>
            <p className="text-sm text-gray-500">
              Active since {betaTester.assignedDate.toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              betaTester.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {betaTester.status}
            </span>
            <span className="text-sm text-gray-500">
              Level: {betaTester.testingLevel}
            </span>
          </div>
        </div>

        {/* Testing Dashboard Link */}
        <div className="mt-4">
          <a
            href={testingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Open Testing Dashboard
            <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>

      {/* Weekly Reports */}
      {showWeeklyReports && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Reports</h3>
          <WeeklyReport
            personId={personId}
            weekStart={new Date()}
            editable={editable}
            includeInLifeCV={true}
            includeInCareerDoc={true}
          />
        </div>
      )}

      {/* Performance Metrics */}
      {showPerformanceMetrics && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
          <PerformanceTracker
            personId={personId}
            metrics={[]} // Will be populated from beta tester data
            includeTesting={true}
            showCareerImpact={true}
          />
        </div>
      )}

      {/* Testing Dashboard Preview */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Testing Overview</h3>
        <TestingDashboard
          personId={personId}
          viewMode="personal"
          timeRange="week"
          showAnalytics={true}
        />
      </div>
    </div>
  );
};