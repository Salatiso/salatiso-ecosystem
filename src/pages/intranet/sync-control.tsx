import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';

const SyncControlPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sync Control - MNI Intranet</title>
        <meta name="description" content="MNI ecosystem sync control and data management" />
      </Head>

      <IntranetLayout title="Sync Control - MNI Intranet">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h1 className="text-2xl font-bold text-ubuntu-warm-900 mb-2">
              MNI Ecosystem Sync Control
            </h1>
            <p className="text-ubuntu-warm-600">
              Centralized control panel for data synchronization across all MNI ecosystem applications and services.
            </p>
          </div>

          {/* Sync Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-green rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Systems Online</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">12/12</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-blue rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Active Syncs</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">8</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-orange rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Last Sync</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">2m ago</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-purple rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Data Transferred</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">1.2 GB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Systems */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Connected Systems</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-ubuntu-green rounded-full"></div>
                    <span className="font-medium text-ubuntu-warm-900">Intranet Portal</span>
                  </div>
                  <span className="px-2 py-1 bg-ubuntu-green text-white text-xs rounded-full">Online</span>
                </div>
                <p className="text-sm text-ubuntu-warm-600">Main intranet application</p>
                <div className="mt-2 text-xs text-ubuntu-warm-500">
                  Last sync: 2 minutes ago
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-ubuntu-green rounded-full"></div>
                    <span className="font-medium text-ubuntu-warm-900">LifeCV Platform</span>
                  </div>
                  <span className="px-2 py-1 bg-ubuntu-green text-white text-xs rounded-full">Online</span>
                </div>
                <p className="text-sm text-ubuntu-warm-600">Personal development platform</p>
                <div className="mt-2 text-xs text-ubuntu-warm-500">
                  Last sync: 5 minutes ago
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-ubuntu-green rounded-full"></div>
                    <span className="font-medium text-ubuntu-warm-900">Sonny Network</span>
                  </div>
                  <span className="px-2 py-1 bg-ubuntu-green text-white text-xs rounded-full">Online</span>
                </div>
                <p className="text-sm text-ubuntu-warm-600">Mesh networking platform</p>
                <div className="mt-2 text-xs text-ubuntu-warm-500">
                  Last sync: 1 minute ago
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-ubuntu-green rounded-full"></div>
                    <span className="font-medium text-ubuntu-warm-900">Business Operations</span>
                  </div>
                  <span className="px-2 py-1 bg-ubuntu-green text-white text-xs rounded-full">Online</span>
                </div>
                <p className="text-sm text-ubuntu-warm-600">Business management system</p>
                <div className="mt-2 text-xs text-ubuntu-warm-500">
                  Last sync: 3 minutes ago
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-ubuntu-green rounded-full"></div>
                    <span className="font-medium text-ubuntu-warm-900">Contact Database</span>
                  </div>
                  <span className="px-2 py-1 bg-ubuntu-green text-white text-xs rounded-full">Online</span>
                </div>
                <p className="text-sm text-ubuntu-warm-600">Centralized contact management</p>
                <div className="mt-2 text-xs text-ubuntu-warm-500">
                  Last sync: 4 minutes ago
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-ubuntu-green rounded-full"></div>
                    <span className="font-medium text-ubuntu-warm-900">Asset Registry</span>
                  </div>
                  <span className="px-2 py-1 bg-ubuntu-green text-white text-xs rounded-full">Online</span>
                </div>
                <p className="text-sm text-ubuntu-warm-600">Asset tracking and management</p>
                <div className="mt-2 text-xs text-ubuntu-warm-500">
                  Last sync: 6 minutes ago
                </div>
              </div>
            </div>
          </div>

          {/* Sync Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Manual Sync */}
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Manual Sync</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">Select Systems to Sync</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-ubuntu-warm-300 text-ubuntu-purple focus:ring-ubuntu-purple" defaultChecked />
                      <span className="ml-2 text-sm text-ubuntu-warm-900">All Systems</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-ubuntu-warm-300 text-ubuntu-purple focus:ring-ubuntu-purple" />
                      <span className="ml-2 text-sm text-ubuntu-warm-900">LifeCV Platform</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-ubuntu-warm-300 text-ubuntu-purple focus:ring-ubuntu-purple" />
                      <span className="ml-2 text-sm text-ubuntu-warm-900">Sonny Network</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-ubuntu-warm-300 text-ubuntu-purple focus:ring-ubuntu-purple" />
                      <span className="ml-2 text-sm text-ubuntu-warm-900">Business Operations</span>
                    </label>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors">
                  Start Manual Sync
                </button>
              </div>
            </div>

            {/* Sync Schedule */}
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Sync Schedule</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">Automatic Sync Frequency</label>
                  <select className="w-full px-3 py-2 border border-ubuntu-warm-300 rounded-lg focus:ring-2 focus:ring-ubuntu-purple focus:border-transparent">
                    <option>Every 5 minutes</option>
                    <option>Every 15 minutes</option>
                    <option>Every hour</option>
                    <option>Every 6 hours</option>
                    <option>Daily</option>
                    <option>Manual only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">Sync Windows</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-ubuntu-warm-300 text-ubuntu-purple focus:ring-ubuntu-purple" defaultChecked />
                      <span className="ml-2 text-sm text-ubuntu-warm-900">Business Hours (08:00-18:00)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-ubuntu-warm-300 text-ubuntu-purple focus:ring-ubuntu-purple" />
                      <span className="ml-2 text-sm text-ubuntu-warm-900">After Hours (18:00-08:00)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-ubuntu-warm-300 text-ubuntu-purple focus:ring-ubuntu-purple" />
                      <span className="ml-2 text-sm text-ubuntu-warm-900">Weekends</span>
                    </label>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green/90 transition-colors">
                  Update Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Sync Logs */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Recent Sync Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-ubuntu-warm-100">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-ubuntu-green rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-ubuntu-warm-900">Contact data synchronized</p>
                    <p className="text-xs text-ubuntu-warm-600">247 records updated</p>
                  </div>
                </div>
                <span className="text-xs text-ubuntu-warm-500">2 min ago</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-ubuntu-warm-100">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-ubuntu-blue rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-ubuntu-warm-900">Asset registry sync completed</p>
                    <p className="text-xs text-ubuntu-warm-600">12 new assets added</p>
                  </div>
                </div>
                <span className="text-xs text-ubuntu-warm-500">5 min ago</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-ubuntu-warm-100">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-ubuntu-green rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-ubuntu-warm-900">Project data synchronized</p>
                    <p className="text-xs text-ubuntu-warm-600">8 projects updated</p>
                  </div>
                </div>
                <span className="text-xs text-ubuntu-warm-500">8 min ago</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-ubuntu-orange rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-ubuntu-warm-900">Calendar sync in progress</p>
                    <p className="text-xs text-ubuntu-warm-600">Processing 45 events</p>
                  </div>
                </div>
                <span className="text-xs text-ubuntu-warm-500">12 min ago</span>
              </div>
            </div>
          </div>
        </div>
      </IntranetLayout>
    </>
  );
};

export default SyncControlPage;