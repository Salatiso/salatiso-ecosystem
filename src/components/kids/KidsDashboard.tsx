/**
 * Smart Kids Dashboard
 * Phase 5 - STEP 7
 * Age-based auto-redirect, child-friendly interface
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Gamepad2, BookOpen, Trophy, Users, Heart, Sparkles, ChevronRight, Lock } from 'lucide-react';

// ===== Age Groups =====

export const KIDS_BY_AGE = {
  toddler: { ageRange: '4-6', names: ['Azanya', 'Mila'], color: 'pink' },
  early: { ageRange: '7-10', names: ['Sazi', 'Milande'], color: 'blue' },
  preteen: { ageRange: '11-13', names: ['Milani'], color: 'green' },
  early_teen: { ageRange: '14-16', names: ['Solo', 'Azora'], color: 'purple' },
};

// ===== Role Progression =====

export type KidsRole = 'explorer' | 'learner' | 'contributor' | 'leader';

export const ROLE_PROGRESSION: Record<KidsRole, {
  title: string;
  color: string;
  icon: React.ReactNode;
  permissions: string[];
}> = {
  explorer: {
    title: 'Family Explorer',
    color: 'amber',
    icon: <Sparkles className="w-5 h-5" />,
    permissions: ['view-family', 'view-tasks', 'play-games'],
  },
  learner: {
    title: 'Young Learner',
    color: 'blue',
    icon: <BookOpen className="w-5 h-5" />,
    permissions: ['view-family', 'view-tasks', 'create-tasks', 'learning-paths'],
  },
  contributor: {
    title: 'Family Contributor',
    color: 'green',
    icon: <Users className="w-5 h-5" />,
    permissions: [
      'view-family',
      'manage-tasks',
      'create-projects',
      'join-events',
    ],
  },
  leader: {
    title: 'Young Leader',
    color: 'purple',
    icon: <Trophy className="w-5 h-5" />,
    permissions: [
      'all-family',
      'manage-projects',
      'mentor-peers',
      'view-admin',
    ],
  },
};

// ===== Activity Types =====

export interface KidsActivity {
  id: string;
  title: string;
  description: string;
  category: 'game' | 'learning' | 'task' | 'event' | 'challenge';
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: keyof typeof KIDS_BY_AGE;
  duration?: number; // minutes
  icon: React.ReactNode;
  reward?: number; // XP
}

const KIDS_ACTIVITIES: KidsActivity[] = [
  {
    id: 'game-1',
    title: 'Family Quiz Challenge',
    description: 'Learn about family history through interactive quiz',
    category: 'game',
    difficulty: 'easy',
    ageGroup: 'toddler',
    duration: 15,
    icon: <Gamepad2 className="w-5 h-5" />,
    reward: 100,
  },
  {
    id: 'learning-1',
    title: 'Ubuntu Values Explorer',
    description: 'Discover Ubuntu philosophy through stories',
    category: 'learning',
    difficulty: 'easy',
    ageGroup: 'toddler',
    duration: 20,
    icon: <BookOpen className="w-5 h-5" />,
    reward: 150,
  },
  {
    id: 'task-1',
    title: 'Family Task',
    description: 'Help with family projects and initiatives',
    category: 'task',
    difficulty: 'medium',
    ageGroup: 'early',
    icon: <Users className="w-5 h-5" />,
    reward: 200,
  },
  {
    id: 'challenge-1',
    title: 'Leadership Challenge',
    description: 'Take on responsibilities and earn badges',
    category: 'challenge',
    difficulty: 'hard',
    ageGroup: 'early_teen',
    duration: 60,
    icon: <Trophy className="w-5 h-5" />,
    reward: 500,
  },
];

// ===== Components =====

/**
 * Activity Card
 */
const ActivityCard: React.FC<{ activity: KidsActivity; onStart?: () => void }> = ({
  activity,
  onStart,
}) => {
  const difficultyColors: Record<string, string> = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-amber-100 text-amber-800',
    hard: 'bg-red-100 text-red-800',
  };

  const categoryEmojis: Record<KidsActivity['category'], string> = {
    game: '🎮',
    learning: '📚',
    task: '✅',
    event: '🎉',
    challenge: '🏆',
  };

  return (
    <div className="bg-white rounded-lg border-2 border-purple-200 hover:shadow-lg transition p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{categoryEmojis[activity.category]}</div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">{activity.title}</h4>
            <p className="text-sm text-gray-600">{activity.description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[activity.difficulty]}`}>
          {activity.difficulty}
        </span>
        {activity.duration && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
            {activity.duration}m
          </span>
        )}
        {activity.reward && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium flex items-center gap-1">
            +{activity.reward} XP
          </span>
        )}
      </div>

      <button
        onClick={onStart}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
      >
        Start <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * Achievement Badge
 */
const AchievementBadge: React.FC<{
  icon: string;
  title: string;
  description: string;
  earned: boolean;
}> = ({ icon, title, description, earned }) => {
  return (
    <div className={`text-center p-3 rounded-lg border-2 ${
      earned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50 opacity-50'
    }`}>
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="font-bold text-sm text-gray-900">{title}</h4>
      <p className="text-xs text-gray-600 mt-1">{description}</p>
      {!earned && <Lock className="w-4 h-4 mx-auto mt-2 text-gray-400" />}
    </div>
  );
};

/**
 * Role Card
 */
const RoleCard: React.FC<{
  role: KidsRole;
  isCurrentRole: boolean;
}> = ({ role, isCurrentRole }) => {
  const roleData = ROLE_PROGRESSION[role];
  const bgColor = {
    amber: 'bg-amber-50 border-amber-300',
    blue: 'bg-blue-50 border-blue-300',
    green: 'bg-green-50 border-green-300',
    purple: 'bg-purple-50 border-purple-300',
  }[roleData.color];

  return (
    <div className={`border-2 rounded-lg p-4 ${bgColor} ${
      isCurrentRole ? 'ring-2 ring-offset-2 ring-blue-500' : ''
    }`}>
      <div className="flex items-start gap-3 mb-2">
        <div className="text-2xl">{roleData.icon}</div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900">{roleData.title}</h4>
          {isCurrentRole && (
            <span className="text-xs font-semibold text-blue-600 uppercase">
              ✓ Current Role
            </span>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-700">
        <p className="font-medium mb-2">Permissions:</p>
        <ul className="space-y-1">
          {roleData.permissions.map((perm, idx) => (
            <li key={idx} className="text-xs">✓ {perm.replace('-', ' ')}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/**
 * Smart Kids Dashboard
 */
export const SmartKidsDashboard: React.FC<{
  childName?: string;
  childAge?: number;
  role?: KidsRole;
}> = ({ childName = 'Azora', childAge = 14, role = 'learner' }) => {
  const ageGroup = Object.entries(KIDS_BY_AGE).find(
    ([_, data]) => data.names.includes(childName)
  )?.[0] as keyof typeof KIDS_BY_AGE || 'early_teen';

  const relevantActivities = KIDS_ACTIVITIES.filter(
    (a) => a.ageGroup === ageGroup
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            👋 Welcome, {childName}!
          </h1>
          <p className="text-purple-700 text-lg">Age {childAge} • {ROLE_PROGRESSION[role].title}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'XP Points', value: '2,450', icon: '⭐' },
            { label: 'Badges Earned', value: '12', icon: '🏆' },
            { label: 'Tasks Completed', value: '34', icon: '✅' },
            { label: 'Streak Days', value: '7', icon: '🔥' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md p-4 text-center border-2 border-purple-100"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-purple-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Left Column - Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Activities */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Gamepad2 className="w-6 h-6" />
              Today's Adventures
            </h2>
            <div className="grid gap-4">
              {relevantActivities.slice(0, 3).map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onStart={() => console.log(`Starting ${activity.title}`)}
                />
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Achievement Badges
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: '🌟', title: 'Star Starter', description: 'Complete first task', earned: true },
                { icon: '📚', title: 'Scholar', description: 'Complete 5 learning paths', earned: true },
                { icon: '👥', title: 'Team Hero', description: 'Help 10 family members', earned: false },
                { icon: '🎓', title: 'Master', description: 'Earn 1000 XP', earned: false },
                { icon: '🚀', title: 'Rocket', description: 'Participate in 10 events', earned: false },
                { icon: '👑', title: 'Leader', description: 'Mentor a peer', earned: false },
              ].map((badge, idx) => (
                <AchievementBadge key={idx} {...badge} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Current Role */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Your Role
            </h2>
            <RoleCard role={role} isCurrentRole={true} />
          </div>

          {/* Next Role */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🎯 Next Role
            </h2>
            <RoleCard
              role={role === 'explorer' ? 'learner' : role === 'learner' ? 'contributor' : 'leader'}
              isCurrentRole={false}
            />
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-900">
                <strong>Complete 5 more tasks</strong> to unlock next role!
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
            <div className="space-y-2">
              {[
                { icon: '👨‍👩‍👧‍👦', label: 'Family', href: '#' },
                { icon: '📚', label: 'Learning', href: '#' },
                { icon: '⚙️', label: 'Settings', href: '#' },
                { icon: '❓', label: 'Help', href: '#' },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="block p-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-2 text-gray-700 hover:text-gray-900"
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Age-based Auto-Redirect Hook
 */
export const useKidsAutoRedirect = (age?: number): boolean => {
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (age && age <= 16) {
      setShouldRedirect(true);
    }
  }, [age]);

  return shouldRedirect;
};
