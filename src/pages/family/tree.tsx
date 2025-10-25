import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import FamilyTree from '@/components/family/FamilyTree';
import { FamilyIcon, UbuntuIcon } from '@/components/icons';

const FamilyTreePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Family Tree - MNI Intranet</title>
        <meta name="description" content="Interactive family tree showcasing Mlandeni-Notemba family connections and Ubuntu wisdom" />
      </Head>

      <IntranetLayout title="Family Tree - Homestead OS">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <FamilyIcon className="w-8 h-8 text-ubuntu-purple" />
              <h1 className="text-3xl font-ubuntu font-bold text-ubuntu-warm-900">
                Mlandeni-Notemba Family Tree
              </h1>
            </div>

            <div className="bg-gradient-to-r from-ubuntu-warm-50 to-ubuntu-warm-100 rounded-xl p-6 border border-ubuntu-warm-200">
              <div className="flex items-start space-x-4">
                <UbuntuIcon className="w-12 h-12 text-ubuntu-gold flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-ubuntu font-semibold text-ubuntu-warm-900 mb-2">
                    Ubuntu Philosophy: &ldquo;I am because we are&rdquo;
                  </h2>
                  <p className="text-ubuntu-warm-700 leading-relaxed">
                    Our family tree represents the core foundation of Mlandeni-Notemba Investments,
                    embodying our Ubuntu philosophy of interconnectedness and mutual support.
                    Each member contributes to our collective strength and wisdom.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Family Tree Component */}
          <div className="bg-white rounded-xl shadow-sm border border-ubuntu-warm-200 p-6">
            <FamilyTree />
          </div>

          {/* Educational Note */}
          <div className="mt-8 bg-ubuntu-warm-25 rounded-xl p-6 border border-ubuntu-warm-200">
            <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900 mb-3">
              Educational Purpose
            </h3>
            <p className="text-ubuntu-warm-700 leading-relaxed">
              This interactive family tree serves as both a historical record and an educational tool,
              highlighting generational wisdom, achievements, and the interconnectedness of our family members.
              It includes biographical details, key life events, and contributions to our family legacy,
              demonstrating how Ubuntu principles guide our family-first approach to business and life.
            </p>
          </div>
        </div>
      </IntranetLayout>
    </>
  );
};

export default FamilyTreePage;