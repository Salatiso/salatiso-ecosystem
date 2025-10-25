import React, { useState } from 'react';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { BadgeCheck, ClipboardList, Medal, PenSquare, UserCircle, ExternalLink, Zap } from 'lucide-react';
import LifeCVStatus from '@/components/lifecv/LifeCVStatus';

const LifecvPage: React.FC = () => {
  const [showFullProfile, setShowFullProfile] = useState(false);

  const handleOpenLifeSync = () => {
    // Open LifeSync in new tab for full LifeCV management
    window.open('https://lifesync-lifecv.web.app/', '_blank');
  };

  return (
    <IntranetLayout title="LifeCV">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <UserCircle className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">Your LifeCV</h1>
              <p className="text-gray-600 max-w-2xl mt-1">
                Your digital life portfolio synced across the entire Salatiso ecosystem. Managed and maintained in LifeSync.
              </p>
            </div>
          </div>
        </header>

        {/* Ecosystem Architecture Info */}
        <div className="mb-8 grid md:grid-cols-2 gap-6">
          {/* LifeSync Home */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-3xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900">LifeSync - Home of LifeCV</h3>
              <ExternalLink className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-blue-800 text-sm mb-4">
              LifeSync is the official home of your LifeCV in the Salatiso ecosystem. All comprehensive profile updates happen there.
            </p>
            <ul className="text-sm text-blue-700 space-y-2 mb-4">
              <li>✓ Complete profile management</li>
              <li>✓ Trust score calculations</li>
              <li>✓ Official trust seals</li>
              <li>✓ Real-time ecosystem sync</li>
            </ul>
            <button
              onClick={handleOpenLifeSync}
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
            >
              <span>Go to LifeSync</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>

          {/* Ecosystem Strategy */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-3xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-amber-900">Ecosystem Strategy</h3>
              <Medal className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-amber-800 text-sm mb-4">
              All ecosystem apps show your LifeCV status and link to LifeSync for full updates. Your data syncs in real-time.
            </p>
            <ul className="text-sm text-amber-700 space-y-2 mb-4">
              <li>✓ Minimal registration per app</li>
              <li>✓ Single source of truth: LifeSync</li>
              <li>✓ Real-time cross-app sync</li>
              <li>✓ Trust seals recognized everywhere</li>
            </ul>
            <div className="text-xs text-amber-700 font-medium">
              Currently viewing: http://localhost:3000/intranet/lifecv/
            </div>
          </div>
        </div>

        {/* Main LifeCV Status Display */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your LifeCV Status</h2>
            <button
              onClick={() => setShowFullProfile(!showFullProfile)}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {showFullProfile ? 'Compact View' : 'Full Details'}
            </button>
          </div>
          
          <LifeCVStatus
            showFullDetails={showFullProfile}
            compact={!showFullProfile}
            onOpenLifeSync={handleOpenLifeSync}
          />
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* How It Works */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8">
            <div className="flex items-center space-x-3 mb-4">
              <BadgeCheck className="h-6 w-6 text-primary-500" />
              <h3 className="text-lg font-semibold text-gray-900">How It Works</h3>
            </div>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="font-bold text-primary-600 flex-shrink-0">1.</span>
                <span>Visit <strong>LifeSync</strong> to create and maintain your complete LifeCV</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-bold text-primary-600 flex-shrink-0">2.</span>
                <span>Your profile is secured with trust seals and verification badges</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-bold text-primary-600 flex-shrink-0">3.</span>
                <span>Data syncs automatically to all ecosystem apps in real-time</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-bold text-primary-600 flex-shrink-0">4.</span>
                <span>Each app shows relevant LifeCV information for that context</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-bold text-primary-600 flex-shrink-0">5.</span>
                <span>Update once in LifeSync, see changes everywhere instantly</span>
              </li>
            </ol>
          </div>

          {/* Connected Ecosystem */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8">
            <div className="flex items-center space-x-3 mb-4">
              <ClipboardList className="h-6 w-6 text-primary-500" />
              <h3 className="text-lg font-semibold text-gray-900">Connected Ecosystem</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-semibold text-blue-900">🔗 LifeSync (LifeCV Home)</p>
                <p className="text-xs text-blue-700 mt-1">Primary profile management - https://lifesync-lifecv.web.app</p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="font-semibold text-purple-900">🏢 Business Apps</p>
                <p className="text-xs text-purple-700 mt-1">BizHelp, FinHelp, DocHelp - show registration data + trust status</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-semibold text-green-900">👥 Community Apps</p>
                <p className="text-xs text-green-700 mt-1">SafetyHelp, PigeeBack - show community profile + trust level</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-semibold text-amber-900">📚 Learning Apps</p>
                <p className="text-xs text-amber-700 mt-1">Sazi.Life Academy - show skills, certifications, achievements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sync & Updates Info */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-3xl p-8 mb-12">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Sync</h3>
              <p className="text-gray-700 mb-4">
                Your LifeCV information is synchronized across all ecosystem apps in real-time. When you update your profile in LifeSync, 
                the changes appear automatically everywhere.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Changes sync instantly across all connected apps</li>
                <li>✓ Trust seals and verification badges update in real-time</li>
                <li>✓ All ecosystem apps access your latest profile data</li>
                <li>✓ Your data stays secure and owned by you</li>
              </ul>
            </div>
            <Zap className="h-12 w-12 text-primary-600 flex-shrink-0" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={handleOpenLifeSync}
            className="p-6 bg-white border-2 border-primary-600 rounded-2xl hover:bg-primary-50 transition text-left"
          >
            <h4 className="font-semibold text-gray-900 mb-2">Complete Your Profile</h4>
            <p className="text-sm text-gray-600 mb-4">
              Go to LifeSync to add more details, skills, work experience, and certifications.
            </p>
            <span className="inline-flex items-center space-x-2 text-primary-600 font-semibold text-sm">
              <span>Open LifeSync</span>
              <ExternalLink className="h-4 w-4" />
            </span>
          </button>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl">
            <h4 className="font-semibold text-gray-900 mb-2">Get Verified</h4>
            <p className="text-sm text-gray-600 mb-4">
              Submit your profile for verification to earn trust badges and official seals.
            </p>
            <button className="text-primary-600 font-semibold text-sm hover:text-primary-700">
              Learn More →
            </button>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl">
            <h4 className="font-semibold text-gray-900 mb-2">View in Hub</h4>
            <p className="text-sm text-gray-600 mb-4">
              Manage all your ecosystem profiles from the central Hub dashboard.
            </p>
            <button className="text-primary-600 font-semibold text-sm hover:text-primary-700">
              Go to Hub →
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <div className="flex items-center space-x-2 justify-center mb-2">
            <PenSquare className="h-4 w-4" />
            <span>LifeCV is your living profile in the Salatiso ecosystem</span>
          </div>
          <p className="text-xs text-gray-500">
            Managed in LifeSync • Synced across all apps • Always under your control
          </p>
        </footer>
      </div>
    </IntranetLayout>
  );
};

export default LifecvPage;
