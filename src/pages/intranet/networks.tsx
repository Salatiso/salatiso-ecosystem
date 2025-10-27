import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';

const NetworksPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>My Networks - MNI Intranet</title>
        <meta name="description" content="Your community networks and connections" />
      </Head>

      <IntranetLayout title="My Networks - MNI Intranet">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h1 className="text-2xl font-bold text-ubuntu-warm-900 mb-2">
              My Networks
            </h1>
            <p className="text-ubuntu-warm-600">
              Your community networks, professional connections, and social groups.
            </p>
          </div>

          {/* Network Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-purple rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Total Connections</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">247</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-blue rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8m0 0V4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Active Groups</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">12</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-green rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Messages</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">34</p>
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
                  <p className="text-sm font-medium text-ubuntu-warm-600">Network Growth</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">+8%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Network Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Professional Networks */}
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Professional Networks</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-ubuntu-warm-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-ubuntu-blue rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-ubuntu-warm-900">Business Leaders Forum</p>
                      <p className="text-sm text-ubuntu-warm-600">Cape Town business community</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-ubuntu-green text-white text-xs rounded-full">Active</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-ubuntu-warm-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-ubuntu-purple rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-ubuntu-warm-900">Property Investment Group</p>
                      <p className="text-sm text-ubuntu-warm-600">Real estate professionals</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-ubuntu-blue text-white text-xs rounded-full">Member</span>
                </div>
              </div>
            </div>

            {/* Community Networks */}
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Community Networks</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-ubuntu-warm-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-ubuntu-green rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-ubuntu-warm-900">Ubuntu Community</p>
                      <p className="text-sm text-ubuntu-warm-600">Cultural and social support</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-ubuntu-green text-white text-xs rounded-full">Active</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-ubuntu-warm-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-ubuntu-orange rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-ubuntu-warm-900">Lifelong Learning Circle</p>
                      <p className="text-sm text-ubuntu-warm-600">Education and personal development</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-ubuntu-orange text-white text-xs rounded-full">Moderator</span>
                </div>
              </div>
            </div>
          </div>

          {/* Network Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Network Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="px-4 py-2 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors">
                Find Connections
              </button>
              <button className="px-4 py-2 bg-ubuntu-blue text-white rounded-lg hover:bg-ubuntu-blue/90 transition-colors">
                Join New Group
              </button>
              <button className="px-4 py-2 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green/90 transition-colors">
                Create Network
              </button>
              <button className="px-4 py-2 bg-ubuntu-orange text-white rounded-lg hover:bg-ubuntu-orange/90 transition-colors">
                Network Analytics
              </button>
            </div>
          </div>
        </div>
      </IntranetLayout>
    </>
  );
};

export default NetworksPage;