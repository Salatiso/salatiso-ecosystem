import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';

const FamilyTreePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Family Tree - MNI Intranet</title>
        <meta name="description" content="Auto-generated family tree from contact roles" />
      </Head>

      <IntranetLayout title="Family Tree - MNI Intranet">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h1 className="text-2xl font-bold text-ubuntu-warm-900 mb-2">
              Family Tree
            </h1>
            <p className="text-ubuntu-warm-600">
              Auto-generated family tree based on contact relationships and roles.
            </p>
          </div>

          {/* Family Tree Visualization */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-ubuntu-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-ubuntu-warm-900 mb-2">Family Tree Visualization</h3>
              <p className="text-ubuntu-warm-600 mb-4">
                Interactive family tree will be displayed here once contact relationships are established.
              </p>
              <button className="px-4 py-2 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors">
                Generate Family Tree
              </button>
            </div>
          </div>

          {/* Family Members */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Family Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Sample family members - in real app this would be dynamic */}
              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-ubuntu-purple rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">JD</span>
                  </div>
                  <div>
                    <p className="font-medium text-ubuntu-warm-900">John Doe</p>
                    <p className="text-sm text-ubuntu-warm-600">Head of Family</p>
                  </div>
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-ubuntu-green rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">JS</span>
                  </div>
                  <div>
                    <p className="font-medium text-ubuntu-warm-900">Jane Smith</p>
                    <p className="text-sm text-ubuntu-warm-600">Spouse</p>
                  </div>
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-ubuntu-blue rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">AJ</span>
                  </div>
                  <div>
                    <p className="font-medium text-ubuntu-warm-900">Alex Junior</p>
                    <p className="text-sm text-ubuntu-warm-600">Child</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Family Tree Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="px-4 py-2 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors">
                Add Family Member
              </button>
              <button className="px-4 py-2 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green/90 transition-colors">
                Export Family Tree
              </button>
              <button className="px-4 py-2 bg-ubuntu-blue text-white rounded-lg hover:bg-ubuntu-blue/90 transition-colors">
                Update Relationships
              </button>
              <button className="px-4 py-2 bg-ubuntu-orange text-white rounded-lg hover:bg-ubuntu-orange/90 transition-colors">
                View Timeline
              </button>
            </div>
          </div>
        </div>
      </IntranetLayout>
    </>
  );
};

export default FamilyTreePage;