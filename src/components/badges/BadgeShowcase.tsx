/**
 * Badge Showcase Component
 * 
 * Displays user's earned badges and progress towards new badges
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { getUbuntuBadgeService, Badge, UserBadge, UbuntuPrinciple, BadgeLevel } from '@/services/UbuntuBadgeService';
import BadgeCard from './BadgeCard';

interface BadgeShowcaseProps {
  userId: string;
  familyId: string;
  view?: 'earned' | 'available' | 'suggested';
}

const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({
  userId,
  familyId,
  view = 'earned'
}) => {
  const { t } = useTranslation('common');
  const badgeService = getUbuntuBadgeService();

  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [suggestedBadges, setSuggestedBadges] = useState<Badge[]>([]);
  const [badgeProgress, setBadgeProgress] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedPrinciple, setSelectedPrinciple] = useState<UbuntuPrinciple | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<BadgeLevel | 'all'>('all');

  useEffect(() => {
    loadBadges();
  }, [userId, familyId]);

  const loadBadges = async () => {
    try {
      setLoading(true);

      // Load user's earned badges
      const earned = await badgeService.getUserBadges(userId, familyId);
      setEarnedBadges(earned);

      // Load all available badges
      const all = badgeService.getAllBadges();
      setAllBadges(all);

      // Load suggested badges
      const suggested = await badgeService.getSuggestedBadges(userId, familyId);
      setSuggestedBadges(suggested);

      // Load progress for all badges not yet earned
      const earnedIds = new Set(earned.map(b => b.badgeId));
      const progressMap = new Map();

      for (const badge of all) {
        if (!earnedIds.has(badge.id)) {
          const progress = await badgeService.getBadgeProgress(userId, familyId, badge.id);
          progressMap.set(badge.id, progress);
        }
      }

      setBadgeProgress(progressMap);

    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter badges
  const getFilteredBadges = (): (Badge | UserBadge)[] => {
    let badges: (Badge | UserBadge)[] = [];

    if (view === 'earned') {
      badges = earnedBadges;
    } else if (view === 'available') {
      const earnedIds = new Set(earnedBadges.map(b => b.badgeId));
      badges = allBadges.filter(b => !earnedIds.has(b.id));
    } else {
      badges = suggestedBadges;
    }

    // Filter by principle
    if (selectedPrinciple !== 'all') {
      badges = badges.filter(b => {
        const badge = 'badge' in b ? b.badge : b;
        return badge.principle === selectedPrinciple;
      });
    }

    // Filter by level
    if (selectedLevel !== 'all') {
      badges = badges.filter(b => {
        const badge = 'badge' in b ? b.badge : b;
        return badge.level === selectedLevel;
      });
    }

    return badges;
  };

  const filteredBadges = getFilteredBadges();

  // Calculate stats
  const totalEarned = earnedBadges.length;
  const totalAvailable = allBadges.length;
  const totalPoints = earnedBadges.reduce((sum, b) => sum + b.badge.points, 0);

  // Group badges by principle
  const badgesByPrinciple = (badges: (Badge | UserBadge)[]) => {
    const groups = new Map<UbuntuPrinciple, (Badge | UserBadge)[]>();
    
    badges.forEach(b => {
      const badge = 'badge' in b ? b.badge : b;
      const existing = groups.get(badge.principle) || [];
      existing.push(b);
      groups.set(badge.principle, existing);
    });

    return groups;
  };

  if (loading) {
    return (
      <div className="badge-showcase loading flex items-center justify-center py-12">
        <div className="spinner animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="badge-showcase">
      {/* Header Stats */}
      <div className="showcase-header mb-8">
        <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
            <div className="stat-icon text-4xl mb-2">🏆</div>
            <div className="stat-value text-3xl font-bold">{totalEarned}</div>
            <div className="stat-label text-blue-100">Badges Earned</div>
          </div>

          <div className="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
            <div className="stat-icon text-4xl mb-2">⭐</div>
            <div className="stat-value text-3xl font-bold">{totalPoints}</div>
            <div className="stat-label text-green-100">Total Points</div>
          </div>

          <div className="stat-card bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
            <div className="stat-icon text-4xl mb-2">📊</div>
            <div className="stat-value text-3xl font-bold">
              {Math.round((totalEarned / totalAvailable) * 100)}%
            </div>
            <div className="stat-label text-purple-100">Completion</div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="view-tabs mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => { setSelectedPrinciple('all'); setSelectedLevel('all'); }}
            className={`tab-button px-4 py-2 font-medium transition-colors ${
              view === 'earned'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Earned ({totalEarned})
          </button>
          <button
            onClick={() => { setSelectedPrinciple('all'); setSelectedLevel('all'); }}
            className={`tab-button px-4 py-2 font-medium transition-colors ${
              view === 'available'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Available ({totalAvailable - totalEarned})
          </button>
          <button
            onClick={() => { setSelectedPrinciple('all'); setSelectedLevel('all'); }}
            className={`tab-button px-4 py-2 font-medium transition-colors ${
              view === 'suggested'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Suggested ({suggestedBadges.length})
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters mb-6 flex flex-wrap gap-4">
        {/* Principle Filter */}
        <div className="filter-group">
          <label className="filter-label text-sm font-medium text-gray-700 mb-2 block">
            Ubuntu Principle
          </label>
          <select
            value={selectedPrinciple}
            onChange={(e) => setSelectedPrinciple(e.target.value as UbuntuPrinciple | 'all')}
            className="filter-select px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Principles</option>
            <option value="respect">👂 Respect</option>
            <option value="community">🤝 Community</option>
            <option value="leadership">🎯 Leadership</option>
            <option value="sharing">🤲 Sharing</option>
            <option value="harmony">☮️ Harmony</option>
          </select>
        </div>

        {/* Level Filter */}
        <div className="filter-group">
          <label className="filter-label text-sm font-medium text-gray-700 mb-2 block">
            Badge Level
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as BadgeLevel | 'all')}
            className="filter-select px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="bronze">🥉 Bronze</option>
            <option value="silver">🥈 Silver</option>
            <option value="gold">🥇 Gold</option>
            <option value="platinum">💎 Platinum</option>
          </select>
        </div>
      </div>

      {/* Badge Grid */}
      {filteredBadges.length === 0 ? (
        <div className="empty-state text-center py-12">
          <div className="empty-icon text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {view === 'earned' ? 'No badges earned yet' : 'No badges available'}
          </h3>
          <p className="text-gray-600">
            {view === 'earned'
              ? 'Start participating in family activities to earn your first badge!'
              : 'You\'ve earned all available badges!'}
          </p>
        </div>
      ) : (
        <div className="badge-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBadges.map(item => {
            const badge = 'badge' in item ? item.badge : item;
            const userBadge = 'badge' in item ? item : undefined;
            const progress = badgeProgress.get(badge.id);

            return (
              <div key={badge.id} className="badge-item">
                <BadgeCard
                  badge={badge}
                  userBadge={userBadge}
                  progress={progress}
                  size="medium"
                  showProgress={view !== 'earned'}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Grouped View (Alternative) */}
      {view === 'earned' && earnedBadges.length > 0 && (
        <div className="grouped-badges mt-12">
          <h3 className="text-2xl font-bold mb-6">Badges by Ubuntu Principle</h3>
          
          {Array.from(badgesByPrinciple(earnedBadges).entries()).map(([principle, badges]) => (
            <div key={principle} className="principle-group mb-8">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="principle-icon text-2xl">
                  {principle === UbuntuPrinciple.RESPECT && '👂'}
                  {principle === UbuntuPrinciple.COMMUNITY && '🤝'}
                  {principle === UbuntuPrinciple.LEADERSHIP && '🎯'}
                  {principle === UbuntuPrinciple.SHARING && '🤲'}
                  {principle === UbuntuPrinciple.HARMONY && '☮️'}
                </span>
                {principle.charAt(0).toUpperCase() + principle.slice(1)} ({badges.length})
              </h4>
              
              <div className="badge-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {badges.map(item => {
                  const userBadge = item as UserBadge;
                  return (
                    <BadgeCard
                      key={userBadge.id}
                      badge={userBadge.badge}
                      userBadge={userBadge}
                      size="small"
                      showProgress={false}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BadgeShowcase;
