/**
 * Badge Card Component
 * 
 * Displays an individual Ubuntu achievement badge
 */

import React from 'react';
import { Badge, BadgeLevel, UserBadge } from '@/services/UbuntuBadgeService';

interface BadgeCardProps {
  badge: Badge;
  userBadge?: UserBadge;
  progress?: {
    progress: number;
    actionsCompleted: number;
    actionsRequired: number;
  };
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  userBadge,
  progress,
  size = 'medium',
  showProgress = true
}) => {
  const isEarned = !!userBadge;
  const progressPercent = progress?.progress || 0;

  // Size classes
  const sizeClasses = {
    small: 'w-16 h-16 text-2xl',
    medium: 'w-24 h-24 text-4xl',
    large: 'w-32 h-32 text-5xl'
  };

  // Level colors
  const levelColors = {
    bronze: 'from-amber-600 to-amber-800',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-purple-400 to-purple-600'
  };

  // Principle colors
  const principleColors = {
    respect: 'text-blue-600',
    community: 'text-green-600',
    leadership: 'text-purple-600',
    sharing: 'text-orange-600',
    harmony: 'text-pink-600'
  };

  return (
    <div className={`badge-card ${isEarned ? 'earned' : 'locked'} ${size}`}>
      {/* Badge Icon */}
      <div className={`badge-icon ${sizeClasses[size]} ${isEarned ? '' : 'grayscale opacity-50'}`}>
        <div className={`badge-background bg-gradient-to-br ${levelColors[badge.level]} rounded-full flex items-center justify-center shadow-lg`}>
          <span className="badge-emoji">{badge.icon}</span>
        </div>
        
        {/* Level indicator */}
        <div className="badge-level absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${levelColors[badge.level]} text-white shadow`}>
            {badge.level.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Badge Info */}
      <div className="badge-info mt-6 text-center">
        <h3 className={`badge-name text-lg font-bold ${isEarned ? 'text-gray-900' : 'text-gray-400'}`}>
          {badge.name}
        </h3>
        
        <p className={`badge-description text-sm mt-1 ${isEarned ? 'text-gray-600' : 'text-gray-400'}`}>
          {badge.description}
        </p>

        <div className={`badge-principle mt-2 inline-flex items-center gap-1 text-xs font-medium ${principleColors[badge.principle]}`}>
          <span className="principle-dot w-2 h-2 rounded-full bg-current"></span>
          {badge.principle.charAt(0).toUpperCase() + badge.principle.slice(1)}
        </div>

        {/* Points */}
        <div className="badge-points mt-2 text-sm font-semibold text-gray-700">
          {badge.points} points
        </div>

        {/* Earned Date */}
        {userBadge && (
          <div className="earned-date mt-2 text-xs text-gray-500">
            Earned {new Date(userBadge.earnedAt).toLocaleDateString()}
          </div>
        )}

        {/* Progress Bar */}
        {!isEarned && showProgress && progress && (
          <div className="badge-progress mt-3">
            <div className="progress-bar-container bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`progress-bar bg-gradient-to-r ${levelColors[badge.level]} h-full transition-all duration-500`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="progress-text text-xs text-gray-600 mt-1">
              {progress.actionsCompleted} / {progress.actionsRequired} completed
            </div>
          </div>
        )}
      </div>

      {/* Locked Overlay */}
      {!isEarned && (
        <div className="locked-overlay absolute top-2 right-2">
          <span className="text-2xl">🔒</span>
        </div>
      )}
    </div>
  );
};

export default BadgeCard;
