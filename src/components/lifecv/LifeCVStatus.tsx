import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Zap,
  TrendingUp,
  Clock,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { LifeCVProfile, lifecvDashboardService } from '@/services/LifeCVDashboardService';

interface LifeCVStatusProps {
  userId?: string;
  onOpenLifeSync?: () => void;
  showFullDetails?: boolean;
  compact?: boolean;
}

interface TrustTierConfig {
  label: string;
  color: string;
  description: string;
  icon: React.ReactNode;
}

const trustTierConfigs: Record<string, TrustTierConfig> = {
  'unknown': {
    label: 'Unknown',
    color: 'text-gray-500',
    description: 'Profile not yet verified',
    icon: '○'
  },
  'emerging': {
    label: 'Emerging',
    color: 'text-blue-500',
    description: 'Building trust in ecosystem',
    icon: '◐'
  },
  'developing': {
    label: 'Developing',
    color: 'text-cyan-500',
    description: 'Consistent participation',
    icon: '◑'
  },
  'established': {
    label: 'Established',
    color: 'text-green-500',
    description: 'Trusted community member',
    icon: '◕'
  },
  'exemplary': {
    label: 'Exemplary',
    color: 'text-amber-500',
    description: 'Ubuntu leader in ecosystem',
    icon: '●'
  },
};

export const LifeCVStatus: React.FC<LifeCVStatusProps> = ({
  userId,
  onOpenLifeSync,
  showFullDetails = true,
  compact = false
}) => {
  const [profile, setProfile] = useState<LifeCVProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const lifecvProfile = await lifecvDashboardService.getLifeCVProfile(userId);
        setProfile(lifecvProfile);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load LifeCV profile';
        setError(errorMessage);
        console.error('Error loading LifeCV profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    // Setup real-time sync if userId provided
    if (userId) {
      const unsubscribe = lifecvDashboardService.setupRealtimeSync(userId, (updatedProfile) => {
        setProfile(updatedProfile);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [userId]);

  // Handle manual sync
  const handleSync = async () => {
    if (!profile || syncing) return;
    
    try {
      setSyncing(true);
      const result = await lifecvDashboardService.triggerSync(profile.userId);
      
      if (result.success && result.profile) {
        setProfile(result.profile);
      } else {
        setError(result.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sync failed';
      setError(errorMessage);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900">LifeCV Profile Unavailable</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Unable to load your LifeCV profile. Please ensure you&apos;re logged in and try again.
        </p>
        <button
          onClick={onOpenLifeSync}
          className="w-full px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition"
        >
          Go to LifeSync
        </button>
      </div>
    );
  }

  const trustTierConfig = trustTierConfigs[profile.trustTier] || trustTierConfigs['unknown'];
  const completionColor = 
    profile.completionPercentage < 25 ? 'text-red-500' :
    profile.completionPercentage < 50 ? 'text-amber-500' :
    profile.completionPercentage < 75 ? 'text-blue-500' :
    'text-green-500';

  if (compact) {
    // Compact view for dashboard summaries
    return (
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-2xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">LifeCV Status</h3>
            <p className="text-xs text-gray-600 mt-1">{profile.displayName}</p>
          </div>
          <div className={`text-2xl ${trustTierConfig.color}`}>
            {trustTierConfig.icon}
          </div>
        </div>
        
        <div className="space-y-2 mb-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">Completion</span>
              <span className={`text-xs font-bold ${completionColor}`}>{profile.completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${completionColor.replace('text', 'bg')}`}
                style={{ width: `${profile.completionPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">
              <Zap className="h-3 w-3 inline mr-1" />
              Trust: {profile.trustScore}
            </span>
            <span className="text-gray-600">
              <Clock className="h-3 w-3 inline mr-1" />
              {lifecvDashboardService.formatDate(profile.lastUpdatedDate)}
            </span>
          </div>
        </div>

        <button
          onClick={onOpenLifeSync}
          className="w-full px-3 py-2 bg-white text-primary-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition border border-primary-200"
        >
          Update LifeCV
        </button>
      </div>
    );
  }

  // Full view
  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">{error}</p>
            <p className="text-xs text-red-700 mt-1">Try refreshing or contact support if the issue persists.</p>
          </div>
        </div>
      )}

      {/* Main Status Card */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.displayName}</h2>
            <p className="text-gray-600 mt-1">{profile.email || 'No email provided'}</p>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition"
            title="Sync with LifeSync"
          >
            <RefreshCw className={`h-5 w-5 ${syncing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Trust Status Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Trust Tier */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className={`h-6 w-6 ${trustTierConfig.color}`} />
              <h3 className="text-sm font-semibold text-gray-700">Trust Tier</h3>
            </div>
            <div className={`text-2xl font-bold ${trustTierConfig.color} mb-1`}>
              {trustTierConfig.label}
            </div>
            <p className="text-xs text-gray-600">{trustTierConfig.description}</p>
            <div className="mt-3 text-2xl">{trustTierConfig.icon}</div>
          </div>

          {/* Trust Score */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-700">Trust Score</h3>
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-1">
              {profile.trustScore}
              <span className="text-lg text-blue-500">/100</span>
            </div>
            <p className="text-xs text-gray-600">Based on interactions and verifications</p>
          </div>

          {/* Completion */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-sm font-semibold text-gray-700">Completion</h3>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-1">
              {profile.completionPercentage}
              <span className="text-lg text-green-500">%</span>
            </div>
            <p className="text-xs text-gray-600">
              {lifecvDashboardService.getCompletionStatusMessage(profile.completionPercentage)}
            </p>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8">
          <div className="flex items-center space-x-2">
            {profile.isVerified ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Profile Verified</span>
                <span className="text-xs text-green-600 ml-auto">
                  Status: {profile.verificationStatus}
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Profile Not Yet Verified</span>
                <span className="text-xs text-amber-600 ml-auto">
                  Status: {profile.verificationStatus}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Sync Status */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Last Synced</p>
              <p className="text-sm font-semibold text-gray-900">
                {lifecvDashboardService.formatDate(profile.lastSyncDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600">Updated</p>
              <p className="text-sm font-semibold text-gray-900">
                {lifecvDashboardService.formatDate(profile.lastUpdatedDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Completion */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Sections</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(profile.sectionsCompleted).map(([section, completed]) => (
            <div
              key={section}
              className={`flex items-center space-x-3 p-4 rounded-xl border ${
                completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {completed ? (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
              )}
              <span className={`text-sm font-medium capitalize ${
                completed ? 'text-green-700' : 'text-gray-700'
              }`}>
                {section.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Seals */}
      {profile.trustSeals.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Trust Seals</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.trustSeals.map((seal) => (
              <div
                key={seal.id}
                className={`p-4 rounded-xl border-2 ${
                  seal.status === 'active'
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">{seal.name}</h4>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    seal.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {seal.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{seal.description}</p>
                <div className="mt-2 text-2xl">{seal.icon || '🛡️'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activities */}
      {profile.recentActivities.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-3">
            {profile.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-lg">{activity.icon || '📝'}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {lifecvDashboardService.formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenLifeSync}
          className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition flex items-center justify-center space-x-2"
        >
          <span>Update Your LifeCV on LifeSync</span>
          <ExternalLink className="h-4 w-4" />
        </button>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default LifeCVStatus;
