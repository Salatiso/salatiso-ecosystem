import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';

const EkhayaCommunitiesPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Ekhaya Communities - MNI Intranet</title>
        <meta name="description" content="Ekhaya community groups and networks" />
      </Head>

      <IntranetLayout title="Ekhaya Communities - MNI Intranet">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h1 className="text-2xl font-bold text-ubuntu-warm-900 mb-2">
              Ekhaya Communities
            </h1>
            <p className="text-ubuntu-warm-600">
              Connect with local community groups, neighborhood networks, and regional initiatives through the Ekhaya platform.
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-purple rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Active Groups</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">24</p>
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
                  <p className="text-sm font-medium text-ubuntu-warm-600">Discussions</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">156</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-ubuntu-green rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ubuntu-warm-600">Events</p>
                  <p className="text-2xl font-bold text-ubuntu-warm-900">12</p>
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
                  <p className="text-2xl font-bold text-ubuntu-warm-900">+18%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Community Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Neighborhood Groups */}
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-ubuntu-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Neighborhood Groups
              </h2>
              <div className="space-y-4">
                <div className="border border-ubuntu-warm-200 rounded-lg p-4 hover:bg-ubuntu-warm-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-ubuntu-warm-900">Sandton Community Watch</h3>
                    <span className="px-2 py-1 bg-ubuntu-green text-white text-xs rounded-full">Active</span>
                  </div>
                  <p className="text-sm text-ubuntu-warm-600 mb-2">
                    Neighborhood safety and security coordination for Sandton area residents.
                  </p>
                  <div className="flex items-center text-xs text-ubuntu-warm-500">
                    <span>47 members</span>
                    <span className="mx-2">•</span>
                    <span>12 discussions</span>
                    <span className="mx-2">•</span>
                    <span>3 events</span>
                  </div>
                </div>

                <div className="border border-ubuntu-warm-200 rounded-lg p-4 hover:bg-ubuntu-warm-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-ubuntu-warm-900">Rosebank Residents</h3>
                    <span className="px-2 py-1 bg-ubuntu-blue text-white text-xs rounded-full">Growing</span>
                  </div>
                  <p className="text-sm text-ubuntu-warm-600 mb-2">
                    Community forum for Rosebank residents to discuss local issues and initiatives.
                  </p>
                  <div className="flex items-center text-xs text-ubuntu-warm-500">
                    <span>32 members</span>
                    <span className="mx-2">•</span>
                    <span>8 discussions</span>
                    <span className="mx-2">•</span>
                    <span>2 events</span>
                  </div>
                </div>

                <div className="border border-ubuntu-warm-200 rounded-lg p-4 hover:bg-ubuntu-warm-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-ubuntu-warm-900">Parktown North Connect</h3>
                    <span className="px-2 py-1 bg-ubuntu-purple text-white text-xs rounded-full">New</span>
                  </div>
                  <p className="text-sm text-ubuntu-warm-600 mb-2">
                    Building connections among Parktown North residents and businesses.
                  </p>
                  <div className="flex items-center text-xs text-ubuntu-warm-500">
                    <span>18 members</span>
                    <span className="mx-2">•</span>
                    <span>4 discussions</span>
                    <span className="mx-2">•</span>
                    <span>1 event</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interest Groups */}
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-ubuntu-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Interest Groups
              </h2>
              <div className="space-y-4">
                <div className="border border-ubuntu-warm-200 rounded-lg p-4 hover:bg-ubuntu-warm-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-ubuntu-warm-900">Gardening Enthusiasts</h3>
                    <span className="px-2 py-1 bg-ubuntu-green text-white text-xs rounded-full">Popular</span>
                  </div>
                  <p className="text-sm text-ubuntu-warm-600 mb-2">
                    Share gardening tips, organize community gardens, and exchange plants.
                  </p>
                  <div className="flex items-center text-xs text-ubuntu-warm-500">
                    <span>89 members</span>
                    <span className="mx-2">•</span>
                    <span>23 discussions</span>
                    <span className="mx-2">•</span>
                    <span>5 events</span>
                  </div>
                </div>

                <div className="border border-ubuntu-warm-200 rounded-lg p-4 hover:bg-ubuntu-warm-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-ubuntu-warm-900">Local Art & Culture</h3>
                    <span className="px-2 py-1 bg-ubuntu-orange text-white text-xs rounded-full">Creative</span>
                  </div>
                  <p className="text-sm text-ubuntu-warm-600 mb-2">
                    Artists, musicians, and culture enthusiasts sharing and creating together.
                  </p>
                  <div className="flex items-center text-xs text-ubuntu-warm-500">
                    <span>67 members</span>
                    <span className="mx-2">•</span>
                    <span>18 discussions</span>
                    <span className="mx-2">•</span>
                    <span>7 events</span>
                  </div>
                </div>

                <div className="border border-ubuntu-warm-200 rounded-lg p-4 hover:bg-ubuntu-warm-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-ubuntu-warm-900">Fitness & Wellness</h3>
                    <span className="px-2 py-1 bg-ubuntu-blue text-white text-xs rounded-full">Active</span>
                  </div>
                  <p className="text-sm text-ubuntu-warm-600 mb-2">
                    Group fitness activities, wellness workshops, and health discussions.
                  </p>
                  <div className="flex items-center text-xs text-ubuntu-warm-500">
                    <span>54 members</span>
                    <span className="mx-2">•</span>
                    <span>15 discussions</span>
                    <span className="mx-2">•</span>
                    <span>8 events</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Upcoming Community Events</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-ubuntu-warm-50 rounded-lg">
                <div className="p-3 bg-ubuntu-green rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ubuntu-warm-900">Community Garden Workshop</h3>
                  <p className="text-sm text-ubuntu-warm-600 mt-1">
                    Learn organic gardening techniques and start your own vegetable patch.
                  </p>
                  <div className="flex items-center text-xs text-ubuntu-warm-500 mt-2">
                    <span>Saturday, Nov 15 • 10:00 AM</span>
                    <span className="mx-2">•</span>
                    <span>Sandton Community Center</span>
                    <span className="mx-2">•</span>
                    <span>25 attending</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green/90 transition-colors">
                  Join
                </button>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-ubuntu-warm-50 rounded-lg">
                <div className="p-3 bg-ubuntu-blue rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ubuntu-warm-900">Local Music Jam Session</h3>
                  <p className="text-sm text-ubuntu-warm-600 mt-1">
                    Bring your instruments and join fellow musicians for an evening of music and connection.
                  </p>
                  <div className="flex items-center text-xs text-ubuntu-warm-500 mt-2">
                    <span>Friday, Nov 20 • 7:00 PM</span>
                    <span className="mx-2">•</span>
                    <span>Rosebank Rooftop</span>
                    <span className="mx-2">•</span>
                    <span>18 attending</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-ubuntu-blue text-white rounded-lg hover:bg-ubuntu-blue/90 transition-colors">
                  Join
                </button>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-ubuntu-warm-50 rounded-lg">
                <div className="p-3 bg-ubuntu-purple rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ubuntu-warm-900">Neighborhood Book Club</h3>
                  <p className="text-sm text-ubuntu-warm-600 mt-1">
                    Discussing "The Alchemist" by Paulo Coelho. All welcome to join the conversation.
                  </p>
                  <div className="flex items-center text-xs text-ubuntu-warm-500 mt-2">
                    <span>Sunday, Nov 22 • 3:00 PM</span>
                    <span className="mx-2">•</span>
                    <span>Parktown Library</span>
                    <span className="mx-2">•</span>
                    <span>12 attending</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Community Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Community Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="p-4 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Group
              </button>

              <button className="p-4 bg-ubuntu-blue text-white rounded-lg hover:bg-ubuntu-blue/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Start Discussion
              </button>

              <button className="p-4 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Plan Event
              </button>

              <button className="p-4 bg-ubuntu-orange text-white rounded-lg hover:bg-ubuntu-orange/90 transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find Groups
              </button>
            </div>
          </div>
        </div>
      </IntranetLayout>
    </>
  );
};

export default EkhayaCommunitiesPage;