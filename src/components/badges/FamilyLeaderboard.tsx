/**
 * Family Leaderboard Component
 * 
 * Displays Ubuntu badge leaderboard for family members
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { getUbuntuBadgeService, LeaderboardEntry } from '@/services/UbuntuBadgeService';

interface FamilyLeaderboardProps {
  familyId: string;
  currentUserId?: string;
  limit?: number;
}

const FamilyLeaderboard: React.FC<FamilyLeaderboardProps> = ({
  familyId,
  currentUserId,
  limit = 10
}) => {
  const { t } = useTranslation('common');
  const badgeService = getUbuntuBadgeService();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [familyId]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const entries = await badgeService.getLeaderboard(familyId, limit);
      setLeaderboard(entries);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number): string => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="leaderboard loading flex items-center justify-center py-12">
        <div className="spinner animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="leaderboard-empty text-center py-12">
        <div className="empty-icon text-6xl mb-4">🏆</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No leaderboard data yet
        </h3>
        <p className="text-gray-600">
          Start earning badges to appear on the leaderboard!
        </p>
      </div>
    );
  }

  return (
    <div className="family-leaderboard">
      {/* Header */}
      <div className="leaderboard-header mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🏆 Family Ubuntu Leaderboard
        </h2>
        <p className="text-gray-600">
          Celebrating family members who embody Ubuntu principles
        </p>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="podium mb-8 grid grid-cols-3 gap-4 max-w-3xl mx-auto">
          {/* 2nd Place */}
          <div className="podium-position order-1 flex flex-col items-center">
            <div className="podium-rank text-4xl mb-2">🥈</div>
            <div className="podium-avatar w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white text-2xl font-bold mb-2 shadow-lg">
              {leaderboard[1].userName.charAt(0).toUpperCase()}
            </div>
            <div className="podium-name text-center font-semibold">{leaderboard[1].userName}</div>
            <div className="podium-points text-sm text-gray-600">{leaderboard[1].totalPoints} pts</div>
            <div className="podium-height bg-gradient-to-b from-gray-300 to-gray-500 mt-4 w-full h-24 rounded-t-lg shadow-inner"></div>
          </div>

          {/* 1st Place */}
          <div className="podium-position order-2 flex flex-col items-center -mt-4">
            <div className="podium-rank text-5xl mb-2">🥇</div>
            <div className="podium-avatar w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-3xl font-bold mb-2 shadow-xl ring-4 ring-yellow-300">
              {leaderboard[0].userName.charAt(0).toUpperCase()}
            </div>
            <div className="podium-name text-center font-bold text-lg">{leaderboard[0].userName}</div>
            <div className="podium-points text-sm text-gray-600 font-semibold">{leaderboard[0].totalPoints} pts</div>
            <div className="podium-height bg-gradient-to-b from-yellow-400 to-yellow-600 mt-4 w-full h-32 rounded-t-lg shadow-inner"></div>
          </div>

          {/* 3rd Place */}
          <div className="podium-position order-3 flex flex-col items-center">
            <div className="podium-rank text-4xl mb-2">🥉</div>
            <div className="podium-avatar w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-2xl font-bold mb-2 shadow-lg">
              {leaderboard[2].userName.charAt(0).toUpperCase()}
            </div>
            <div className="podium-name text-center font-semibold">{leaderboard[2].userName}</div>
            <div className="podium-points text-sm text-gray-600">{leaderboard[2].totalPoints} pts</div>
            <div className="podium-height bg-gradient-to-b from-amber-600 to-amber-800 mt-4 w-full h-20 rounded-t-lg shadow-inner"></div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="leaderboard-table bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Badges
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ubuntu Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = entry.userId === currentUserId;

              return (
                <tr
                  key={entry.userId}
                  className={`transition-colors ${
                    isCurrentUser
                      ? 'bg-blue-50 hover:bg-blue-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Rank */}
                  <td className="px-6 py-4">
                    <div className={`rank-badge inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${getRankColor(rank)}`}>
                      {getRankIcon(rank)}
                    </div>
                  </td>

                  {/* Member */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="member-avatar w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow">
                        {entry.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="member-name font-semibold text-gray-900 flex items-center gap-2">
                          {entry.userName}
                          {isCurrentUser && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="member-role text-sm text-gray-600 capitalize">
                          {entry.userRole}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Badges */}
                  <td className="px-6 py-4">
                    <div className="badges-summary flex flex-col items-center gap-1">
                      <div className="total-badges text-2xl font-bold text-gray-900">
                        {entry.totalBadges}
                      </div>
                      <div className="badge-breakdown flex gap-1 text-xs">
                        {entry.platinumBadges > 0 && (
                          <span className="badge-count text-purple-600 font-semibold">
                            💎{entry.platinumBadges}
                          </span>
                        )}
                        {entry.goldBadges > 0 && (
                          <span className="badge-count text-yellow-600 font-semibold">
                            🥇{entry.goldBadges}
                          </span>
                        )}
                        {entry.silverBadges > 0 && (
                          <span className="badge-count text-gray-600 font-semibold">
                            🥈{entry.silverBadges}
                          </span>
                        )}
                        {entry.bronzeBadges > 0 && (
                          <span className="badge-count text-amber-700 font-semibold">
                            🥉{entry.bronzeBadges}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Points */}
                  <td className="px-6 py-4 text-center">
                    <div className="points text-2xl font-bold text-blue-600">
                      {entry.totalPoints}
                    </div>
                    <div className="points-label text-xs text-gray-600">points</div>
                  </td>

                  {/* Ubuntu Score */}
                  <td className="px-6 py-4 text-center">
                    <div className="ubuntu-score-container">
                      <div className="score-circle relative w-16 h-16 mx-auto">
                        {/* Background circle */}
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="4"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke={entry.ubuntuScore >= 80 ? '#10b981' : entry.ubuntuScore >= 60 ? '#3b82f6' : '#f59e0b'}
                            strokeWidth="4"
                            strokeDasharray={`${(entry.ubuntuScore / 100) * 175.93} 175.93`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="score-text absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-900">
                            {entry.ubuntuScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="leaderboard-legend mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-2">About Ubuntu Score</h4>
        <p className="text-sm text-gray-600">
          The Ubuntu Score reflects balance across all five Ubuntu principles (Respect, Community, Leadership, Sharing, Harmony).
          A high score shows consistent demonstration of Ubuntu values in family interactions.
        </p>
      </div>
    </div>
  );
};

export default FamilyLeaderboard;
