import React, { useState, useEffect } from 'react';
import { Star, Award, TrendingUp, Users, Heart, Shield, CheckCircle, Clock } from 'lucide-react';

// ============================================================================
// TRUST & RATINGS SYSTEM COMPONENT
// ============================================================================

interface TrustProfile {
  userId: string;
  displayName: string;
  overallScore: number;
  trustTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  ubuntuQualities: {
    respect: number;
    compassion: number;
    honesty: number;
    community: number;
  };
  recentInteractions: TrustInteraction[];
  totalInteractions: number;
  memberSince: number;
}

interface TrustInteraction {
  id: string;
  withUserId: string;
  withUserName: string;
  rating: number;
  quality: 'respect' | 'compassion' | 'honesty' | 'community';
  timestamp: number;
  context: string; // e.g., "Safety check-in", "Message exchange", "Emergency response"
}

interface TrustRatingsSystemProps {
  userId: string;
  onRatingSubmit?: (interaction: TrustInteraction) => void;
}

const TrustRatingsSystem: React.FC<TrustRatingsSystemProps> = ({
  userId,
  onRatingSubmit
}) => {
  const [trustProfile, setTrustProfile] = useState<TrustProfile | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [pendingRating, setPendingRating] = useState<{
    withUserId: string;
    withUserName: string;
    context: string;
  } | null>(null);

  // Mock data - in real implementation, this would come from API
  useEffect(() => {
    const mockProfile: TrustProfile = {
      userId,
      displayName: 'Current User',
      overallScore: 78,
      trustTier: 'Silver',
      ubuntuQualities: {
        respect: 82,
        compassion: 75,
        honesty: 88,
        community: 70
      },
      recentInteractions: [
        {
          id: '1',
          withUserId: 'user-123',
          withUserName: 'Sarah Johnson',
          rating: 5,
          quality: 'compassion',
          timestamp: Date.now() - 3600000, // 1 hour ago
          context: 'Emergency response'
        },
        {
          id: '2',
          withUserId: 'user-456',
          withUserName: 'Michael Chen',
          rating: 4,
          quality: 'honesty',
          timestamp: Date.now() - 86400000, // 1 day ago
          context: 'Safety check-in'
        },
        {
          id: '3',
          withUserId: 'user-789',
          withUserName: 'Emma Davis',
          rating: 5,
          quality: 'respect',
          timestamp: Date.now() - 172800000, // 2 days ago
          context: 'Message exchange'
        }
      ],
      totalInteractions: 47,
      memberSince: Date.now() - 31536000000 // 1 year ago
    };

    setTrustProfile(mockProfile);
  }, [userId]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'text-amber-600 bg-amber-100';
      case 'Silver': return 'text-gray-600 bg-gray-100';
      case 'Gold': return 'text-yellow-600 bg-yellow-100';
      case 'Platinum': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Bronze': return <Award className="h-4 w-4" />;
      case 'Silver': return <Shield className="h-4 w-4" />;
      case 'Gold': return <Star className="h-4 w-4" />;
      case 'Platinum': return <TrendingUp className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getNextTierProgress = (currentScore: number) => {
    const tiers = [
      { name: 'Bronze', min: 0, max: 49 },
      { name: 'Silver', min: 50, max: 74 },
      { name: 'Gold', min: 75, max: 89 },
      { name: 'Platinum', min: 90, max: 100 }
    ];

    const currentTier = tiers.find(tier => currentScore >= tier.min && currentScore <= tier.max);
    if (!currentTier) return { progress: 0, nextTier: 'Bronze' };

    const nextTierIndex = tiers.indexOf(currentTier) + 1;
    if (nextTierIndex >= tiers.length) return { progress: 100, nextTier: null };

    const nextTier = tiers[nextTierIndex];
    const progress = ((currentScore - currentTier.min) / (currentTier.max - currentTier.min)) * 100;

    return { progress, nextTier: nextTier.name };
  };

  const handleRateInteraction = (withUserId: string, withUserName: string, context: string) => {
    setPendingRating({ withUserId, withUserName, context });
    setShowRatingModal(true);
  };

  const submitRating = (rating: number, quality: 'respect' | 'compassion' | 'honesty' | 'community') => {
    if (!pendingRating) return;

    const interaction: TrustInteraction = {
      id: `interaction-${Date.now()}`,
      withUserId: pendingRating.withUserId,
      withUserName: pendingRating.withUserName,
      rating,
      quality,
      timestamp: Date.now(),
      context: pendingRating.context
    };

    // Update trust profile
    if (trustProfile) {
      const updatedProfile = {
        ...trustProfile,
        recentInteractions: [interaction, ...trustProfile.recentInteractions.slice(0, 9)], // Keep last 10
        totalInteractions: trustProfile.totalInteractions + 1,
        // Simple trust score update (in real implementation, this would be more sophisticated)
        overallScore: Math.min(100, trustProfile.overallScore + (rating - 3) * 2)
      };

      // Recalculate tier
      if (updatedProfile.overallScore >= 90) updatedProfile.trustTier = 'Platinum';
      else if (updatedProfile.overallScore >= 75) updatedProfile.trustTier = 'Gold';
      else if (updatedProfile.overallScore >= 50) updatedProfile.trustTier = 'Silver';
      else updatedProfile.trustTier = 'Bronze';

      setTrustProfile(updatedProfile);
    }

    if (onRatingSubmit) {
      onRatingSubmit(interaction);
    }

    setShowRatingModal(false);
    setPendingRating(null);
  };

  if (!trustProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const { progress, nextTier } = getNextTierProgress(trustProfile.overallScore);

  return (
    <div className="space-y-6">
      {/* Trust Score Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ubuntu Trust Profile</h3>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getTierColor(trustProfile.trustTier)}`}>
            {getTierIcon(trustProfile.trustTier)}
            <span>{trustProfile.trustTier} Tier</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-indigo-600 mb-2">{trustProfile.overallScore}</div>
          <div className="text-gray-600 mb-2">Overall Ubuntu Score</div>

          {nextTier && (
            <div className="text-sm text-gray-500">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              {Math.round(100 - progress)} points to {nextTier}
            </div>
          )}
        </div>

        {/* Ubuntu Qualities */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(trustProfile.ubuntuQualities).map(([quality, score]) => (
            <div key={quality} className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {quality}
                </span>
                <span className="text-sm font-semibold text-indigo-600">{score}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Interactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Interactions</h3>
          <div className="text-sm text-gray-500">
            {trustProfile.totalInteractions} total interactions
          </div>
        </div>

        <div className="space-y-3">
          {trustProfile.recentInteractions.map((interaction) => (
            <div key={interaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < interaction.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {interaction.withUserName}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {interaction.quality} • {interaction.context}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(interaction.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Rate New Interaction Button */}
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => handleRateInteraction('demo-user', 'Demo User', 'Recent interaction')}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Rate Recent Interaction
          </button>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && pendingRating && (
        <RatingModal
          userName={pendingRating.withUserName}
          context={pendingRating.context}
          onSubmit={submitRating}
          onCancel={() => {
            setShowRatingModal(false);
            setPendingRating(null);
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// RATING MODAL COMPONENT
// ============================================================================

interface RatingModalProps {
  userName: string;
  context: string;
  onSubmit: (rating: number, quality: 'respect' | 'compassion' | 'honesty' | 'community') => void;
  onCancel: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  userName,
  context,
  onSubmit,
  onCancel
}) => {
  const [rating, setRating] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState<'respect' | 'compassion' | 'honesty' | 'community'>('respect');

  const qualities = [
    { key: 'respect' as const, label: 'Respect', icon: Users, description: 'Treated others with dignity and consideration' },
    { key: 'compassion' as const, label: 'Compassion', icon: Heart, description: 'Showed empathy and care for others' },
    { key: 'honesty' as const, label: 'Honesty', icon: CheckCircle, description: 'Was truthful and transparent' },
    { key: 'community' as const, label: 'Community', icon: Shield, description: 'Contributed to family/community well-being' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Interaction</h3>

        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">With: <span className="font-medium">{userName}</span></div>
          <div className="text-sm text-gray-600">Context: <span className="font-medium">{context}</span></div>
        </div>

        {/* Star Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Quality Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Which Ubuntu quality stood out?</label>
          <div className="space-y-2">
            {qualities.map((quality) => {
              const IconComponent = quality.icon;
              return (
                <button
                  key={quality.key}
                  onClick={() => setSelectedQuality(quality.key)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    selectedQuality === quality.key
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-5 w-5 ${
                      selectedQuality === quality.key ? 'text-indigo-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <div className={`text-sm font-medium ${
                        selectedQuality === quality.key ? 'text-indigo-900' : 'text-gray-900'
                      }`}>
                        {quality.label}
                      </div>
                      <div className="text-xs text-gray-500">{quality.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(rating, selectedQuality)}
            disabled={rating === 0}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrustRatingsSystem;