import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';

const BusinessOrganogramPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Business Organogram - MNI Intranet</title>
        <meta name="description" content="Organizational structure and hierarchy" />
      </Head>

      <IntranetLayout title="Business Organogram - MNI Intranet">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h1 className="text-2xl font-bold text-ubuntu-warm-900 mb-2">
              Business Organogram
            </h1>
            <p className="text-ubuntu-warm-600">
              Organizational structure and reporting hierarchy for Mlandeli-Notemba Investments.
            </p>
          </div>

          {/* Organogram Visualization */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-ubuntu-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-ubuntu-warm-900 mb-2">Organizational Chart</h3>
              <p className="text-ubuntu-warm-600 mb-4">
                Interactive organizational chart will be displayed here.
              </p>
              <button className="px-4 py-2 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors">
                View Full Organogram
              </button>
            </div>
          </div>

          {/* Leadership Team */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-ubuntu-purple rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-white">JD</span>
                </div>
                <h3 className="font-semibold text-ubuntu-warm-900">John Doe</h3>
                <p className="text-sm text-ubuntu-warm-600">Chief Executive Officer</p>
                <p className="text-xs text-ubuntu-warm-500">Executive Management</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-ubuntu-blue rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-white">SM</span>
                </div>
                <h3 className="font-semibold text-ubuntu-warm-900">Sarah Mthembu</h3>
                <p className="text-sm text-ubuntu-warm-600">Chief Financial Officer</p>
                <p className="text-xs text-ubuntu-warm-500">Finance</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-ubuntu-green rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-white">TN</span>
                </div>
                <h3 className="font-semibold text-ubuntu-warm-900">Thabo Nkosi</h3>
                <p className="text-sm text-ubuntu-warm-600">Chief Operations Officer</p>
                <p className="text-xs text-ubuntu-warm-500">Operations</p>
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Departments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <h3 className="font-semibold text-ubuntu-warm-900 mb-2">Finance & Accounting</h3>
                <p className="text-sm text-ubuntu-warm-600 mb-3">Financial planning, accounting, and treasury operations.</p>
                <div className="flex items-center text-sm text-ubuntu-warm-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  8 members
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <h3 className="font-semibold text-ubuntu-warm-900 mb-2">Operations & Development</h3>
                <p className="text-sm text-ubuntu-warm-600 mb-3">Project management, property development, and operations.</p>
                <div className="flex items-center text-sm text-ubuntu-warm-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  12 members
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <h3 className="font-semibold text-ubuntu-warm-900 mb-2">Information Technology</h3>
                <p className="text-sm text-ubuntu-warm-600 mb-3">IT infrastructure, software development, and digital transformation.</p>
                <div className="flex items-center text-sm text-ubuntu-warm-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  6 members
                </div>
              </div>

              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <h3 className="font-semibold text-ubuntu-warm-900 mb-2">Human Resources</h3>
                <p className="text-sm text-ubuntu-warm-600 mb-3">Talent management, employee development, and organizational culture.</p>
                <div className="flex items-center text-sm text-ubuntu-warm-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  4 members
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Organogram Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="px-4 py-2 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors">
                Export Organogram
              </button>
              <button className="px-4 py-2 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green/90 transition-colors">
                Update Structure
              </button>
              <button className="px-4 py-2 bg-ubuntu-blue text-white rounded-lg hover:bg-ubuntu-blue/90 transition-colors">
                View Reporting Lines
              </button>
            </div>
          </div>
        </div>
      </IntranetLayout>
    </>
  );
};

export default BusinessOrganogramPage;