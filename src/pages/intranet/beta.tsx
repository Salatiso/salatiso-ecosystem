import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';

const BetaTestingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Beta Testing - MNI Intranet</title>
        <meta name="description" content="Beta features and testing program" />
      </Head>

      <IntranetLayout title="Beta Testing - MNI Intranet">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-ubuntu-warm-900 mb-2">
                  Beta Testing Program
                </h1>
                <p className="text-ubuntu-warm-600">
                  Access cutting-edge features, provide feedback, and help shape the future of the MNI ecosystem.
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors">
                  Join Beta Program
                </button>
                <button className="px-4 py-2 border border-ubuntu-warm-300 text-ubuntu-warm-700 rounded-lg hover:bg-ubuntu-warm-50 transition-colors">
                  Report Issue
                </button>
              </div>
            </div>
          </div>

          {/* Beta Program Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-purple rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Active Testers</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">247</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-blue rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Beta Features</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">18</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-green rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Issues Fixed</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">1,203</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-orange rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Success Rate</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">94%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Beta Features */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Current Beta Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-ubuntu-warm-900">AI-Powered Insights</h3>
                  <span className="px-2 py-1 bg-ubuntu-purple text-white text-xs rounded-full">Phase 2</span>
                </div>
                <p className="text-ubuntu-warm-600 mb-3">
                  Machine learning algorithms that provide personalized insights and recommendations across all MNI systems.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ubuntu-warm-600">47 testers • 4.8/5 rating</span>
                  <button className="px-3 py-1 bg-ubuntu-purple text-white text-xs rounded hover:bg-ubuntu-purple/90">
                    Try Now
                  </button>
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-ubuntu-warm-900">Advanced Analytics Dashboard</h3>
                  <span className="px-2 py-1 bg-ubuntu-blue text-white text-xs rounded-full">Phase 1</span>
                </div>
                <p className="text-ubuntu-warm-600 mb-3">
                  Comprehensive analytics with predictive modeling and automated report generation.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ubuntu-warm-600">89 testers • 4.6/5 rating</span>
                  <button className="px-3 py-1 bg-ubuntu-blue text-white text-xs rounded hover:bg-ubuntu-blue/90">
                    Try Now
                  </button>
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-ubuntu-warm-900">Blockchain Integration</h3>
                  <span className="px-2 py-1 bg-ubuntu-green text-white text-xs rounded-full">Phase 3</span>
                </div>
                <p className="text-ubuntu-warm-600 mb-3">
                  Secure, decentralized transaction processing and digital asset management.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ubuntu-warm-600">23 testers • 4.9/5 rating</span>
                  <button className="px-3 py-1 bg-ubuntu-green text-white text-xs rounded hover:bg-ubuntu-green/90">
                    Try Now
                  </button>
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-ubuntu-warm-900">Voice Commands</h3>
                  <span className="px-2 py-1 bg-ubuntu-orange text-white text-xs rounded-full">Phase 1</span>
                </div>
                <p className="text-ubuntu-warm-600 mb-3">
                  Natural language processing for hands-free system interaction and control.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ubuntu-warm-600">156 testers • 4.3/5 rating</span>
                  <button className="px-3 py-1 bg-ubuntu-orange text-white text-xs rounded hover:bg-ubuntu-orange/90">
                    Try Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Beta Tester Dashboard */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Your Beta Testing Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tester Status */}
              <div className="space-y-4">
                <h3 className="font-semibold text-ubuntu-warm-900">Testing Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ubuntu-warm-600">Beta Level</span>
                    <span className="px-2 py-1 bg-ubuntu-purple text-white text-xs rounded-full">Advanced</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ubuntu-warm-600">Reports Submitted</span>
                    <span className="font-semibold text-ubuntu-warm-900">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ubuntu-warm-600">Average Rating</span>
                    <span className="font-semibold text-ubuntu-warm-900">4.7/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ubuntu-warm-600">Bugs Found</span>
                    <span className="font-semibold text-ubuntu-warm-900">23</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-4">
                <h3 className="font-semibold text-ubuntu-warm-900">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-ubuntu-green rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-ubuntu-warm-900">Reported AI Insights Bug</p>
                      <p className="text-xs text-ubuntu-warm-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-ubuntu-blue rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-ubuntu-warm-900">Completed Voice Commands Test</p>
                      <p className="text-xs text-ubuntu-warm-600">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-ubuntu-purple rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-ubuntu-warm-900">Joined Blockchain Beta</p>
                      <p className="text-xs text-ubuntu-warm-600">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-4">
                <h3 className="font-semibold text-ubuntu-warm-900">Beta Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-ubuntu-purple rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ubuntu-warm-900">Bug Hunter</p>
                      <p className="text-xs text-ubuntu-warm-600">Found 20+ bugs</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-ubuntu-blue rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ubuntu-warm-900">Quality Champion</p>
                      <p className="text-xs text-ubuntu-warm-600">5-star average rating</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-ubuntu-green rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ubuntu-warm-900">Early Adopter</p>
                      <p className="text-xs text-ubuntu-warm-600">First to test 10 features</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Beta Testing Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Beta Testing Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="p-4 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Submit Feedback
              </button>

              <button className="p-4 bg-ubuntu-blue text-white rounded-lg hover:bg-ubuntu-blue/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Report Bug
              </button>

              <button className="p-4 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Reports
              </button>

              <button className="p-4 bg-ubuntu-orange text-white rounded-lg hover:bg-ubuntu-orange/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Feature Requests
              </button>
            </div>
          </div>

          {/* Beta Program Guidelines */}
          <div className="bg-ubuntu-warm-50 rounded-lg border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Beta Program Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-ubuntu-warm-900 mb-2">What We Expect</h3>
                <ul className="text-sm text-ubuntu-warm-600 space-y-1">
                  <li>• Thorough testing of assigned features</li>
                  <li>• Detailed bug reports with reproduction steps</li>
                  <li>• Honest feedback on user experience</li>
                  <li>• Timely completion of testing assignments</li>
                  <li>• Participation in feedback sessions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-ubuntu-warm-900 mb-2">What You Get</h3>
                <ul className="text-sm text-ubuntu-warm-600 space-y-1">
                  <li>• Early access to cutting-edge features</li>
                  <li>• Direct influence on product development</li>
                  <li>• Recognition in release notes</li>
                  <li>• Exclusive beta tester badges</li>
                  <li>• Priority support for beta features</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </IntranetLayout>
    </>
  );
};

export default BetaTestingPage;