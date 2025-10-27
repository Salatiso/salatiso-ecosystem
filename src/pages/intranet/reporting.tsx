import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';

const ReportingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Reporting - MNI Intranet</title>
        <meta name="description" content="Reports and analytics dashboard" />
      </Head>

      <IntranetLayout title="Reporting - MNI Intranet">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h1 className="text-2xl font-bold text-ubuntu-warm-900 mb-2">
              Reports & Analytics
            </h1>
            <p className="text-ubuntu-warm-600">
              Comprehensive reporting and analytics for all MNI ecosystem activities.
            </p>
          </div>

          {/* Report Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Financial Reports */}
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-ubuntu-green rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-ubuntu-warm-900 ml-3">Financial Reports</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Monthly P&L Statement</p>
                  <p className="text-sm text-ubuntu-warm-600">Revenue, expenses, and profitability</p>
                </button>
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Cash Flow Analysis</p>
                  <p className="text-sm text-ubuntu-warm-600">Operating, investing, and financing activities</p>
                </button>
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Balance Sheet</p>
                  <p className="text-sm text-ubuntu-warm-600">Assets, liabilities, and equity</p>
                </button>
              </div>
            </div>

            {/* Operational Reports */}
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-ubuntu-blue rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-ubuntu-warm-900 ml-3">Operational Reports</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Project Status Report</p>
                  <p className="text-sm text-ubuntu-warm-600">Active projects and milestones</p>
                </button>
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Resource Utilization</p>
                  <p className="text-sm text-ubuntu-warm-600">Team capacity and allocation</p>
                </button>
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Performance Metrics</p>
                  <p className="text-sm text-ubuntu-warm-600">KPIs and operational efficiency</p>
                </button>
              </div>
            </div>

            {/* Compliance Reports */}
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-ubuntu-purple rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-ubuntu-warm-900 ml-3">Compliance Reports</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Regulatory Compliance</p>
                  <p className="text-sm text-ubuntu-warm-600">Legal and regulatory requirements</p>
                </button>
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Audit Trail</p>
                  <p className="text-sm text-ubuntu-warm-600">System access and changes</p>
                </button>
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Risk Assessment</p>
                  <p className="text-sm text-ubuntu-warm-600">Risk analysis and mitigation</p>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Recent Reports</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-ubuntu-warm-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-ubuntu-green rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-ubuntu-warm-900">Q4 2025 Financial Summary</p>
                    <p className="text-sm text-ubuntu-warm-600">Generated on October 25, 2025</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-ubuntu-blue text-white rounded hover:bg-ubuntu-blue/90 transition-colors">
                    View
                  </button>
                  <button className="px-3 py-1 text-sm bg-ubuntu-green text-white rounded hover:bg-ubuntu-green/90 transition-colors">
                    Download
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-ubuntu-warm-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-ubuntu-blue rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-ubuntu-warm-900">Project Performance Dashboard</p>
                    <p className="text-sm text-ubuntu-warm-600">Generated on October 24, 2025</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-ubuntu-blue text-white rounded hover:bg-ubuntu-blue/90 transition-colors">
                    View
                  </button>
                  <button className="px-3 py-1 text-sm bg-ubuntu-green text-white rounded hover:bg-ubuntu-green/90 transition-colors">
                    Download
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-ubuntu-warm-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-ubuntu-purple rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-ubuntu-warm-900">Compliance Audit Report</p>
                    <p className="text-sm text-ubuntu-warm-600">Generated on October 23, 2025</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-ubuntu-blue text-white rounded hover:bg-ubuntu-blue/90 transition-colors">
                    View
                  </button>
                  <button className="px-3 py-1 text-sm bg-ubuntu-green text-white rounded hover:bg-ubuntu-green/90 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Report Generation */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Generate Custom Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">Report Type</label>
                <select className="w-full px-3 py-2 border border-ubuntu-warm-300 rounded-lg focus:ring-2 focus:ring-ubuntu-purple focus:border-transparent">
                  <option>Financial Summary</option>
                  <option>Operational Metrics</option>
                  <option>Compliance Report</option>
                  <option>Custom Dashboard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">Date Range</label>
                <select className="w-full px-3 py-2 border border-ubuntu-warm-300 rounded-lg focus:ring-2 focus:ring-ubuntu-purple focus:border-transparent">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last 12 months</option>
                  <option>Custom range</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <button className="px-6 py-2 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </IntranetLayout>
    </>
  );
};

export default ReportingPage;