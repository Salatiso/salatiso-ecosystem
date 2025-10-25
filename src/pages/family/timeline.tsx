import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import FamilyTimeline from '@/components/family/FamilyTimeline';
import { Calendar } from 'lucide-react';
import { UbuntuIcon } from '@/components/icons';

const FamilyTimelinePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Family Timeline - MNI Intranet</title>
        <meta name="description" content="Chronological family history with educational content and Ubuntu wisdom" />
      </Head>

      <IntranetLayout title="Family Timeline - Homestead OS">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-8 h-8 text-ubuntu-purple" />
              <h1 className="text-3xl font-ubuntu font-bold text-ubuntu-warm-900">
                Mlandeni-Notemba Family Timeline
              </h1>
            </div>

            <div className="bg-gradient-to-r from-ubuntu-warm-50 to-ubuntu-warm-100 rounded-xl p-6 border border-ubuntu-warm-200">
              <div className="flex items-start space-x-4">
                <UbuntuIcon className="w-12 h-12 text-ubuntu-gold flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-ubuntu font-semibold text-ubuntu-warm-900 mb-2">
                    Our Journey Through Time
                  </h2>
                  <p className="text-ubuntu-warm-700 leading-relaxed">
                    This comprehensive family timeline chronicles our journey, serving as both a historical record
                    and an educational tool within the MNI intranet. It integrates information from family experiences
                    to provide context for our Ubuntu philosophy and family-first principles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Family Timeline Component */}
          <div className="bg-white rounded-xl shadow-sm border border-ubuntu-warm-200 p-6">
            <FamilyTimeline />
          </div>

          {/* Key Periods Summary */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-ubuntu-warm-25 rounded-xl p-6 border border-ubuntu-warm-200">
              <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900 mb-3">
                Pre-2003: Foundations
              </h3>
              <p className="text-ubuntu-warm-700 text-sm leading-relaxed">
                Early establishment of financial responsibility, community involvement,
                and family values that would guide our future.
              </p>
            </div>

            <div className="bg-ubuntu-warm-25 rounded-xl p-6 border border-ubuntu-warm-200">
              <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900 mb-3">
                2003-2017: Stability
              </h3>
              <p className="text-ubuntu-warm-700 text-sm leading-relaxed">
                Financial stability through bond management and home ownership,
                providing a solid foundation for family growth.
              </p>
            </div>

            <div className="bg-ubuntu-warm-25 rounded-xl p-6 border border-ubuntu-warm-200">
              <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900 mb-3">
                2017-2018: Parenthood
              </h3>
              <p className="text-ubuntu-warm-700 text-sm leading-relaxed">
                New life brings new responsibilities. The birth of Sazi and early
                family expansion marked a period of growth and challenges.
              </p>
            </div>

            <div className="bg-ubuntu-warm-25 rounded-xl p-6 border border-ubuntu-warm-200">
              <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900 mb-3">
                2019-2024: Advocacy
              </h3>
              <p className="text-ubuntu-warm-700 text-sm leading-relaxed">
                Legal advocacy for equal parental rights tested family resilience
                and demonstrated the importance of justice in family matters.
              </p>
            </div>

            <div className="bg-ubuntu-warm-25 rounded-xl p-6 border border-ubuntu-warm-200">
              <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900 mb-3">
                2024-2025: Resolution
              </h3>
              <p className="text-ubuntu-warm-700 text-sm leading-relaxed">
                Legal resolution opens new chapters for family business development
                and continued growth in Ubuntu principles.
              </p>
            </div>

            <div className="bg-ubuntu-warm-25 rounded-xl p-6 border border-ubuntu-warm-200">
              <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900 mb-3">
                Ongoing: Legacy
              </h3>
              <p className="text-ubuntu-warm-700 text-sm leading-relaxed">
                Building MNI ecosystem, preserving family wisdom, and nurturing
                the next generation with Ubuntu values.
              </p>
            </div>
          </div>

          {/* Educational Applications */}
          <div className="mt-8 bg-ubuntu-warm-25 rounded-xl p-6 border border-ubuntu-warm-200">
            <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900 mb-3">
              Educational Applications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-ubuntu-warm-900 mb-2">Teaching Tools</h4>
                <ul className="text-sm text-ubuntu-warm-700 space-y-1">
                  <li>• Real-world application of Ubuntu principles</li>
                  <li>• Personal growth stories and lessons learned</li>
                  <li>• Examples of overcoming adversity</li>
                  <li>• Career development case studies</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-ubuntu-warm-900 mb-2">Family Repository</h4>
                <ul className="text-sm text-ubuntu-warm-700 space-y-1">
                  <li>• Preserves family history and wisdom</li>
                  <li>• Documents generational knowledge transfer</li>
                  <li>• Provides context for current decisions</li>
                  <li>• Guides future generations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </IntranetLayout>
    </>
  );
};

export default FamilyTimelinePage;