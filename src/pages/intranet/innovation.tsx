import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';

const InnovationLabPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Innovation Lab - MNI Intranet</title>
        <meta name="description" content="Innovation and experimental features" />
      </Head>

      <IntranetLayout title="Innovation Lab - MNI Intranet">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h1 className="text-2xl font-bold text-ubuntu-warm-900 mb-2">
              Innovation Lab
            </h1>
            <p className="text-ubuntu-warm-600">
              Experimental features, cutting-edge technologies, and innovative solutions for the MNI ecosystem.
            </p>
          </div>

          {/* Lab Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-purple rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Active Experiments</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">7</p>
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
                  <p className="text-sm font-medium text-ubuntu-warm-600">Successful Projects</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">23</p>
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
                  <p className="text-sm font-medium text-ubuntu-warm-600">Innovation Rate</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">+45%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Experiments */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Current Experiments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-ubuntu-warm-900">AI-Powered Analytics</h3>
                  <span className="px-2 py-1 bg-ubuntu-blue text-white text-xs rounded-full">Active</span>
                </div>
                <p className="text-ubuntu-warm-600 mb-3">
                  Machine learning algorithms for predictive analytics and automated insights generation.
                </p>
                <div className="flex items-center text-sm text-ubuntu-warm-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Started 3 weeks ago • 85% complete
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-ubuntu-warm-900">Blockchain Integration</h3>
                  <span className="px-2 py-1 bg-ubuntu-green text-white text-xs rounded-full">Testing</span>
                </div>
                <p className="text-ubuntu-warm-600 mb-3">
                  Decentralized ledger technology for secure, transparent transaction processing.
                </p>
                <div className="flex items-center text-sm text-ubuntu-warm-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Started 2 weeks ago • 60% complete
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-ubuntu-warm-900">IoT Sensor Network</h3>
                  <span className="px-2 py-1 bg-ubuntu-purple text-white text-xs rounded-full">Pilot</span>
                </div>
                <p className="text-ubuntu-warm-600 mb-3">
                  Connected sensor network for real-time environmental and operational monitoring.
                </p>
                <div className="flex items-center text-sm text-ubuntu-warm-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Started 1 week ago • 30% complete
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-ubuntu-warm-900">Augmented Reality</h3>
                  <span className="px-2 py-1 bg-ubuntu-orange text-white text-xs rounded-full">Research</span>
                </div>
                <p className="text-ubuntu-warm-600 mb-3">
                  AR interfaces for enhanced user experiences and remote collaboration.
                </p>
                <div className="flex items-center text-sm text-ubuntu-warm-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Started 4 days ago • 15% complete
                </div>
              </div>
            </div>
          </div>

          {/* Innovation Pipeline */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Innovation Pipeline</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-ubuntu-blue rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-ubuntu-warm-900">Idea Generation</h3>
                  <p className="text-sm text-ubuntu-warm-600">Brainstorming and concept development phase</p>
                </div>
                <span className="px-2 py-1 bg-ubuntu-blue text-white text-xs rounded-full">Active</span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-ubuntu-orange rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-ubuntu-warm-900">Prototype Development</h3>
                  <p className="text-sm text-ubuntu-warm-600">Building minimum viable products</p>
                </div>
                <span className="px-2 py-1 bg-ubuntu-orange text-white text-xs rounded-full">Next</span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-ubuntu-purple rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-ubuntu-warm-900">Testing & Validation</h3>
                  <p className="text-sm text-ubuntu-warm-600">User testing and feedback collection</p>
                </div>
                <span className="px-2 py-1 bg-ubuntu-purple text-white text-xs rounded-full">Upcoming</span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-ubuntu-green rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-ubuntu-warm-900">Implementation</h3>
                  <p className="text-sm text-ubuntu-warm-600">Full-scale deployment and integration</p>
                </div>
                <span className="px-2 py-1 bg-ubuntu-green text-white text-xs rounded-full">Future</span>
              </div>
            </div>
          </div>

          {/* Lab Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Lab Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="p-4 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Experiment
              </button>

              <button className="p-4 bg-ubuntu-blue text-white rounded-lg hover:bg-ubuntu-blue/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Research Hub
              </button>

              <button className="p-4 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Team Collaboration
              </button>

              <button className="p-4 bg-ubuntu-orange text-white rounded-lg hover:bg-ubuntu-orange/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics Dashboard
              </button>
            </div>
          </div>
        </div>
      </IntranetLayout>
    </>
  );
};

export default InnovationLabPage;