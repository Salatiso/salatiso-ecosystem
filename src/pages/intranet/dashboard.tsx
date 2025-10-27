import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';

const DashboardPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard - MNI Intranet</title>
        <meta name="description" content="Main dashboard overview" />
      </Head>

      <IntranetLayout title="Dashboard - MNI Intranet">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h1 className="text-2xl font-bold text-ubuntu-warm-900 mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-ubuntu-warm-600">
              Your central hub for all MNI ecosystem activities and information.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-purple rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Contacts</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">24</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-green rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Projects</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">8</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-orange rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M9 11h6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Assets</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">12</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-blue rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Messages</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">3</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-ubuntu-green rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-ubuntu-warm-900">New contact added to your network</p>
                  <p className="text-xs text-ubuntu-warm-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-ubuntu-blue rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-ubuntu-warm-900">Project milestone completed</p>
                  <p className="text-xs text-ubuntu-warm-600">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-ubuntu-orange rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-ubuntu-warm-900">Asset inventory updated</p>
                  <p className="text-xs text-ubuntu-warm-600">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IntranetLayout>
    </>
  );
};

export default DashboardPage;