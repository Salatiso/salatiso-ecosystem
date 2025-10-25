/**
 * Ubuntu Badges Page
 * 
 * Main page for viewing and tracking Ubuntu achievement badges
 */

import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layouts/AppLayout';
import BadgeShowcase from '@/components/badges/BadgeShowcase';
import FamilyLeaderboard from '@/components/badges/FamilyLeaderboard';

type ViewMode = 'earned' | 'available' | 'suggested' | 'leaderboard';

const BadgesPage: React.FC = () => {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('earned');

  // Mock family ID - in production, fetch from user profile
  const familyId = (user as any)?.familyId || 'mock-family-id';
  const userId = (user as any)?.uid || 'mock-user-id';

  return (
    <>
      <Head>
        <title>{t('badges.title', 'Ubuntu Badges')} - Salatiso</title>
        <meta
          name="description"
          content="Track and earn Ubuntu achievement badges for demonstrating Respect, Community, Leadership, Sharing, and Harmony"
        />
      </Head>

      <AppLayout>
        <div className="badges-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="page-header mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
              <span className="header-icon text-5xl">🏆</span>
              Ubuntu Achievement Badges
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Celebrate family members who embody Ubuntu values: Respect, Community, Leadership, Sharing, and Harmony.
              Track your progress and see how you compare with your family!
            </p>
          </div>

          {/* Ubuntu Principles Overview */}
          <div className="principles-overview mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="principle-card bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
              <div className="principle-icon text-3xl mb-2">👂</div>
              <h3 className="principle-name font-bold text-blue-900 mb-1">Respect</h3>
              <p className="principle-description text-sm text-blue-700">
                Honor elders, listen actively, value wisdom
              </p>
            </div>

            <div className="principle-card bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
              <div className="principle-icon text-3xl mb-2">🤝</div>
              <h3 className="principle-name font-bold text-green-900 mb-1">Community</h3>
              <p className="principle-description text-sm text-green-700">
                Participate, decide collectively, build together
              </p>
            </div>

            <div className="principle-card bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-2 border-purple-200">
              <div className="principle-icon text-3xl mb-2">🎯</div>
              <h3 className="principle-name font-bold text-purple-900 mb-1">Leadership</h3>
              <p className="principle-description text-sm text-purple-700">
                Mentor others, facilitate, guide with vision
              </p>
            </div>

            <div className="principle-card bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border-2 border-orange-200">
              <div className="principle-icon text-3xl mb-2">🤲</div>
              <h3 className="principle-name font-bold text-orange-900 mb-1">Sharing</h3>
              <p className="principle-description text-sm text-orange-700">
                Share knowledge, resources, collaborate
              </p>
            </div>

            <div className="principle-card bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border-2 border-pink-200">
              <div className="principle-icon text-3xl mb-2">☮️</div>
              <h3 className="principle-name font-bold text-pink-900 mb-1">Harmony</h3>
              <p className="principle-description text-sm text-pink-700">
                Resolve conflicts, maintain peace, build unity
              </p>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="view-mode-tabs mb-8">
            <div className="tabs-container bg-white rounded-lg shadow-md p-2 inline-flex gap-2">
              <button
                onClick={() => setViewMode('earned')}
                className={`tab-button px-6 py-3 rounded-lg font-medium transition-all ${
                  viewMode === 'earned'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="tab-icon mr-2">🏆</span>
                My Badges
              </button>

              <button
                onClick={() => setViewMode('available')}
                className={`tab-button px-6 py-3 rounded-lg font-medium transition-all ${
                  viewMode === 'available'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="tab-icon mr-2">🎯</span>
                Available
              </button>

              <button
                onClick={() => setViewMode('suggested')}
                className={`tab-button px-6 py-3 rounded-lg font-medium transition-all ${
                  viewMode === 'suggested'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="tab-icon mr-2">💡</span>
                Suggested
              </button>

              <button
                onClick={() => setViewMode('leaderboard')}
                className={`tab-button px-6 py-3 rounded-lg font-medium transition-all ${
                  viewMode === 'leaderboard'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="tab-icon mr-2">📊</span>
                Leaderboard
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="content-area">
            {viewMode === 'leaderboard' ? (
              <FamilyLeaderboard
                familyId={familyId}
                currentUserId={userId}
                limit={10}
              />
            ) : (
              <BadgeShowcase
                userId={userId}
                familyId={familyId}
                view={viewMode}
              />
            )}
          </div>

          {/* Help Section */}
          <div className="help-section mt-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>❓</span>
              How to Earn Badges
            </h2>

            <div className="help-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="help-item">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-xl">👂</span>
                  Respect Badges
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Participate in video calls with elders</li>
                  <li>Defer to elder wisdom in decisions</li>
                  <li>Document and share elder teachings</li>
                </ul>
              </div>

              <div className="help-item">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-xl">🤝</span>
                  Community Badges
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Attend family council meetings</li>
                  <li>Contribute to collective decisions</li>
                  <li>Help achieve unanimous consent</li>
                </ul>
              </div>

              <div className="help-item">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  Leadership Badges
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Mentor family members</li>
                  <li>Facilitate family meetings</li>
                  <li>Lead strategic planning sessions</li>
                </ul>
              </div>

              <div className="help-item">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-xl">🤲</span>
                  Sharing Badges
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Collaborate on templates</li>
                  <li>Share expertise in sessions</li>
                  <li>Contribute resources to initiatives</li>
                </ul>
              </div>

              <div className="help-item md:col-span-2">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-xl">☮️</span>
                  Harmony Badges
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Help resolve family disagreements</li>
                  <li>Mediate disputes to peaceful resolution</li>
                  <li>Maintain family harmony through challenges</li>
                </ul>
              </div>
            </div>

            <div className="help-tip mt-6 p-4 bg-white rounded-lg border border-blue-300">
              <p className="text-sm text-gray-700">
                <strong className="text-blue-600">💡 Tip:</strong> The Ubuntu Score rewards balance across all five principles.
                Focus on developing strength in all areas rather than just one!
              </p>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};

export default BadgesPage;
