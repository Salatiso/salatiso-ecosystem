import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';

const BusinessOperationsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Business Operations - MNI Intranet</title>
        <meta name="description" content="Business operations management" />
      </Head>

      <IntranetLayout title="Business Operations - MNI Intranet">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h1 className="text-2xl font-bold text-ubuntu-warm-900 mb-2">
              Business Operations
            </h1>
            <p className="text-ubuntu-warm-600">
              Manage and monitor all business operations and processes.
            </p>
          </div>

          {/* Operations Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-green rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Active Projects</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">12</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-blue rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Revenue</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">R2.4M</p>
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
                  <p className="text-sm font-medium text-ubuntu-warm-600">Growth</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">+15%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-purple rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Team Size</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">24</p>
                </div>
              </div>
            </div>
          </div>

          {/* Operations Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Operations */}
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Current Operations</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-ubuntu-warm-50 rounded-lg">
                  <div>
                    <p className="font-medium text-ubuntu-warm-900">Property Development</p>
                    <p className="text-sm text-ubuntu-warm-600">Phase 2 construction</p>
                  </div>
                  <span className="px-2 py-1 bg-ubuntu-green text-white text-xs rounded-full">Active</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-ubuntu-warm-50 rounded-lg">
                  <div>
                    <p className="font-medium text-ubuntu-warm-900">Investment Portfolio</p>
                    <p className="text-sm text-ubuntu-warm-600">Q4 review pending</p>
                  </div>
                  <span className="px-2 py-1 bg-ubuntu-orange text-white text-xs rounded-full">Pending</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-ubuntu-warm-50 rounded-lg">
                  <div>
                    <p className="font-medium text-ubuntu-warm-900">HR Recruitment</p>
                    <p className="text-sm text-ubuntu-warm-600">Senior developer position</p>
                  </div>
                  <span className="px-2 py-1 bg-ubuntu-blue text-white text-xs rounded-full">Planning</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors">
                  <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Project
                </button>

                <button className="p-4 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green/90 transition-colors">
                  <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Report
                </button>

                <button className="p-4 bg-ubuntu-blue text-white rounded-lg hover:bg-ubuntu-blue/90 transition-colors">
                  <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Team Chat
                </button>

                <button className="p-4 bg-ubuntu-orange text-white rounded-lg hover:bg-ubuntu-orange/90 transition-colors">
                  <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </IntranetLayout>
    </>
  );
};

export default BusinessOperationsPage;