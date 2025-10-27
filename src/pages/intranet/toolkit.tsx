import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';

const ToolkitPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Toolkit - MNI Intranet</title>
        <meta name="description" content="Utilities and tools for MNI ecosystem" />
      </Head>

      <IntranetLayout title="Toolkit - MNI Intranet">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h1 className="text-2xl font-bold text-ubuntu-warm-900 mb-2">
              MNI Toolkit
            </h1>
            <p className="text-ubuntu-warm-600">
              Essential utilities and tools for efficient operations across the MNI ecosystem.
            </p>
          </div>

          {/* Tool Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Productivity Tools */}
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-ubuntu-blue rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-ubuntu-warm-900 ml-3">Productivity</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Document Templates</p>
                  <p className="text-sm text-ubuntu-warm-600">Standardized templates for reports and proposals</p>
                </button>
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Meeting Scheduler</p>
                  <p className="text-sm text-ubuntu-warm-600">Automated meeting coordination</p>
                </button>
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Task Manager</p>
                  <p className="text-sm text-ubuntu-warm-600">Project task tracking and assignment</p>
                </button>
              </div>
            </div>

            {/* Communication Tools */}
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-ubuntu-green rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-ubuntu-warm-900 ml-3">Communication</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Email Templates</p>
                  <p className="text-sm text-ubuntu-warm-600">Professional email templates and signatures</p>
                </button>
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Video Conferencing</p>
                  <p className="text-sm text-ubuntu-warm-600">Integrated video meeting tools</p>
                </button>
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Team Chat</p>
                  <p className="text-sm text-ubuntu-warm-600">Internal messaging and collaboration</p>
                </button>
              </div>
            </div>

            {/* Data Tools */}
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-ubuntu-purple rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-ubuntu-warm-900 ml-3">Data & Analytics</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Data Import/Export</p>
                  <p className="text-sm text-ubuntu-warm-600">Bulk data operations and migrations</p>
                </button>
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Report Builder</p>
                  <p className="text-sm text-ubuntu-warm-600">Custom report generation tools</p>
                </button>
                <button className="w-full text-left p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors">
                  <p className="font-medium text-ubuntu-warm-900">Dashboard Creator</p>
                  <p className="text-sm text-ubuntu-warm-600">Interactive dashboard builder</p>
                </button>
              </div>
            </div>
          </div>

          {/* Development Tools */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Development Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 bg-ubuntu-orange text-white rounded-lg hover:bg-ubuntu-orange/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Code Editor
              </button>

              <button className="p-4 bg-ubuntu-blue text-white rounded-lg hover:bg-ubuntu-blue/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                </svg>
                API Tester
              </button>

              <button className="p-4 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                Database Tools
              </button>

              <button className="p-4 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documentation
              </button>
            </div>
          </div>

          {/* Quick Access Tools */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Quick Access Tools</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <button className="p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors text-center">
                <svg className="w-6 h-6 mx-auto mb-2 text-ubuntu-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-ubuntu-warm-900">Calculator</span>
              </button>

              <button className="p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors text-center">
                <svg className="w-6 h-6 mx-auto mb-2 text-ubuntu-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M9 11h6" />
                </svg>
                <span className="text-sm font-medium text-ubuntu-warm-900">Converter</span>
              </button>

              <button className="p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors text-center">
                <svg className="w-6 h-6 mx-auto mb-2 text-ubuntu-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-ubuntu-warm-900">Timer</span>
              </button>

              <button className="p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors text-center">
                <svg className="w-6 h-6 mx-auto mb-2 text-ubuntu-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-sm font-medium text-ubuntu-warm-900">Notes</span>
              </button>

              <button className="p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors text-center">
                <svg className="w-6 h-6 mx-auto mb-2 text-ubuntu-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm font-medium text-ubuntu-warm-900">Bookmarks</span>
              </button>

              <button className="p-3 bg-ubuntu-warm-50 rounded-lg hover:bg-ubuntu-warm-100 transition-colors text-center">
                <svg className="w-6 h-6 mx-auto mb-2 text-ubuntu-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
                <span className="text-sm font-medium text-ubuntu-warm-900">Clipboard</span>
              </button>
            </div>
          </div>

          {/* Custom Tools */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Custom Tools</h2>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-ubuntu-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-ubuntu-warm-900 mb-2">Build Custom Tools</h3>
              <p className="text-ubuntu-warm-600 mb-4">
                Create and deploy custom tools tailored to your workflow needs.
              </p>
              <button className="px-4 py-2 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors">
                Tool Builder
              </button>
            </div>
          </div>
        </div>
      </IntranetLayout>
    </>
  );
};

export default ToolkitPage;