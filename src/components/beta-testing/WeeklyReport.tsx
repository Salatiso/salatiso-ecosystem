import React, { useState, useEffect, useMemo } from 'react';
import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { WeeklyReport as WeeklyReportType, TestedApp, BugReport, FeatureSuggestion } from '@/types';

interface WeeklyReportProps {
  personId: string;
  weekStart: Date;
  editable?: boolean;
  includeInLifeCV?: boolean;
  includeInCareerDoc?: boolean;
  className?: string;
}

export const WeeklyReport: React.FC<WeeklyReportProps> = ({
  personId,
  weekStart,
  editable = true,
  includeInLifeCV = true,
  includeInCareerDoc = true,
  className = ''
}) => {
  const [report, setReport] = useState<WeeklyReportType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'apps' | 'bugs' | 'features' | 'review'>('overview');

  const weekEnd = useMemo(() => new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000), [weekStart]);

  // Load existing report
  useEffect(() => {
    const loadReport = async () => {
      try {
        const reportId = `${personId}_${weekStart.toISOString().split('T')[0]}`;
        const reportDoc = await getDoc(doc(db, 'weekly_reports', reportId));

        if (reportDoc.exists()) {
          setReport(reportDoc.data() as WeeklyReportType);
        } else {
          // Create new report
          const newReport: WeeklyReportType = {
            id: reportId,
            personId,
            weekStart,
            weekEnd,
            appsTested: [],
            bugsFound: [],
            featureSuggestions: [],
            usabilityIssues: [],
            performanceObservations: [],
            overallRating: 0,
            recommendations: '',
            timeSpent: 0,
            includedInLifeCV: includeInLifeCV,
            includedInCareerDoc: includeInCareerDoc,
            submittedAt: new Date(),
            status: 'draft'
          };
          setReport(newReport);
        }
      } catch (error) {
        console.error('Error loading report:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [personId, weekStart, includeInLifeCV, includeInCareerDoc, weekEnd]);

  const saveReport = async (updatedReport: WeeklyReportType) => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'weekly_reports', updatedReport.id), {
        ...updatedReport,
        submittedAt: new Date()
      });
      setReport(updatedReport);
    } catch (error) {
      console.error('Error saving report:', error);
    } finally {
      setSaving(false);
    }
  };

  const submitReport = async () => {
    if (!report) return;

    const submittedReport: WeeklyReportType = {
      ...report,
      status: 'submitted' as const,
      submittedAt: new Date()
    };

    await saveReport(submittedReport);
  };

  const addTestedApp = () => {
    if (!report) return;

    const newApp: TestedApp = {
      appName: '',
      appUrl: '',
      featuresTested: [],
      issuesFound: 0,
      rating: 0,
      notes: ''
    };

    const updatedReport = {
      ...report,
      appsTested: [...report.appsTested, newApp]
    };

    setReport(updatedReport);
  };

  const updateTestedApp = (index: number, updates: Partial<TestedApp>) => {
    if (!report) return;

    const updatedApps = [...report.appsTested];
    updatedApps[index] = { ...updatedApps[index], ...updates };

    const updatedReport = {
      ...report,
      appsTested: updatedApps
    };

    setReport(updatedReport);
  };

  const removeTestedApp = (index: number) => {
    if (!report) return;

    const updatedApps = report.appsTested.filter((_: TestedApp, i: number) => i !== index);
    const updatedReport = {
      ...report,
      appsTested: updatedApps
    };

    setReport(updatedReport);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Loading weekly report...</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-800">Failed to load weekly report</p>
      </div>
    );
  }

  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Weekly Testing Report</h2>
            <p className="text-sm text-gray-600">
              {weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}
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
            {editable && (
              <button
                onClick={submitReport}
                disabled={saving || report.status === 'submitted'}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
              >
                {saving ? 'Submitting...' : 'Submit Report'}
              </button>
            )}
          </div>
        </div>

        {/* Section Tabs */}
        <div className="mt-4">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'apps', label: 'Apps Tested' },
              { key: 'bugs', label: 'Bugs Found' },
              { key: 'features', label: 'Suggestions' },
              { key: 'review', label: 'Review' }
            ].map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeSection === section.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating (1-5)
              </label>
              <select
                value={report.overallRating}
                onChange={(e) => setReport({ ...report, overallRating: Number(e.target.value) })}
                disabled={!editable}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md disabled:bg-gray-100"
              >
                <option value={0}>Select rating...</option>
                {[1, 2, 3, 4, 5].map(rating => (
                  <option key={rating} value={rating}>{rating} - {rating === 1 ? 'Poor' : rating === 2 ? 'Below Average' : rating === 3 ? 'Average' : rating === 4 ? 'Good' : 'Excellent'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Spent Testing (hours)
              </label>
              <input
                type="number"
                value={report.timeSpent}
                onChange={(e) => setReport({ ...report, timeSpent: Number(e.target.value) })}
                disabled={!editable}
                min="0"
                step="0.5"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recommendations & Notes
              </label>
              <textarea
                value={report.recommendations}
                onChange={(e) => setReport({ ...report, recommendations: e.target.value })}
                disabled={!editable}
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-100"
                placeholder="Share your thoughts on the testing experience, any patterns you noticed, or recommendations for improvement..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={report.includedInLifeCV}
                  onChange={(e) => setReport({ ...report, includedInLifeCV: e.target.checked })}
                  disabled={!editable}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include in LifeCV</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={report.includedInCareerDoc}
                  onChange={(e) => setReport({ ...report, includedInCareerDoc: e.target.checked })}
                  disabled={!editable}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include in Career Documents</span>
              </label>
            </div>
          </div>
        )}

        {activeSection === 'apps' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Apps Tested</h3>
              {editable && (
                <button
                  onClick={addTestedApp}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  Add App
                </button>
              )}
            </div>

            {report.appsTested.length === 0 ? (
              <p className="text-gray-600">No apps tested this week.</p>
            ) : (
              <div className="space-y-4">
                {report.appsTested.map((app: TestedApp, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          App Name
                        </label>
                        <input
                          type="text"
                          value={app.appName}
                          onChange={(e) => updateTestedApp(index, { appName: e.target.value })}
                          disabled={!editable}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          App URL
                        </label>
                        <input
                          type="url"
                          value={app.appUrl}
                          onChange={(e) => updateTestedApp(index, { appUrl: e.target.value })}
                          disabled={!editable}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rating (1-5)
                        </label>
                        <select
                          value={app.rating}
                          onChange={(e) => updateTestedApp(index, { rating: Number(e.target.value) })}
                          disabled={!editable}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-100"
                        >
                          <option value={0}>Select...</option>
                          {[1, 2, 3, 4, 5].map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Issues Found
                        </label>
                        <input
                          type="number"
                          value={app.issuesFound}
                          onChange={(e) => updateTestedApp(index, { issuesFound: Number(e.target.value) })}
                          disabled={!editable}
                          min="0"
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Features Tested
                      </label>
                      <input
                        type="text"
                        value={app.featuresTested.join(', ')}
                        onChange={(e) => updateTestedApp(index, {
                          featuresTested: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                        })}
                        disabled={!editable}
                        placeholder="Comma-separated list of features"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-100"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={app.notes}
                        onChange={(e) => updateTestedApp(index, { notes: e.target.value })}
                        disabled={!editable}
                        rows={2}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-100"
                      />
                    </div>

                    {editable && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => removeTestedApp(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove App
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'bugs' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Bugs Found</h3>
            <p className="text-gray-600">Bug reporting interface will be implemented here.</p>
          </div>
        )}

        {activeSection === 'features' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Feature Suggestions</h3>
            <p className="text-gray-600">Feature suggestion interface will be implemented here.</p>
          </div>
        )}

        {activeSection === 'review' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Report Summary</h3>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Apps Tested</h4>
              <p className="text-sm text-gray-600">{report.appsTested.length} apps</p>
              <ul className="mt-2 space-y-1">
                {report.appsTested.map((app: TestedApp, index: number) => (
                  <li key={index} className="text-sm text-gray-700">
                    • {app.appName} (Rating: {app.rating}/5, Issues: {app.issuesFound})
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Overall Assessment</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Rating:</span>
                  <span className="ml-2 font-medium">{report.overallRating}/5</span>
                </div>
                <div>
                  <span className="text-gray-600">Time Spent:</span>
                  <span className="ml-2 font-medium">{report.timeSpent} hours</span>
                </div>
              </div>
            </div>

            {report.recommendations && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                <p className="text-sm text-gray-700">{report.recommendations}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Button */}
      {editable && activeSection !== 'overview' && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={() => saveReport(report)}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};