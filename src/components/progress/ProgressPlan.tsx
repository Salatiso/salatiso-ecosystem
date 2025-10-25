/**
 * Personal Progress Plan Component
 * Phase 5 - STEP 6
 * Goals, milestones, achievements, 103-year arc
 */

'use client';

import React, { useState } from 'react';
import { Target, Zap, Star, TrendingUp, Award, Calendar, CheckCircle } from 'lucide-react';

// ===== Data Models =====

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'short-term' | 'medium-term' | 'long-term';
  status: 'not-started' | 'in-progress' | 'completed' | 'paused';
  progress: number; // 0-100
  startDate: string;
  targetDate: string;
  milestones: Milestone[];
  xpReward?: number;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  targetDate: string;
  completed: boolean;
  completedDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: string;
}

export interface ProgressArc {
  year: number;
  ageRange: string;
  phase: string;
  keyFocuses: string[];
  milestones: string[];
}

// ===== Example Progress Plan =====

export const EXAMPLE_PROGRESS_PLANS: Record<string, Goal[]> = {
  azora: [
    {
      id: 'azora-1',
      title: 'Azora Academy - 3 Year Program',
      description: 'Complete advanced leadership academy with honors',
      category: 'medium-term',
      status: 'in-progress',
      progress: 45,
      startDate: '2024-01-01',
      targetDate: '2027-01-01',
      xpReward: 5000,
      milestones: [
        {
          id: 'm1',
          title: 'Foundation Module',
          targetDate: '2024-06-01',
          completed: true,
          completedDate: '2024-05-28',
        },
        {
          id: 'm2',
          title: 'Leadership Certificate',
          targetDate: '2025-06-01',
          completed: false,
        },
        {
          id: 'm3',
          title: 'Advanced Studies',
          targetDate: '2026-06-01',
          completed: false,
        },
        {
          id: 'm4',
          title: 'Capstone Project',
          targetDate: '2027-01-01',
          completed: false,
        },
      ],
    },
    {
      id: 'azora-2',
      title: 'STEM Excellence Badge',
      description: 'Master science, technology, engineering & mathematics',
      category: 'medium-term',
      status: 'in-progress',
      progress: 65,
      startDate: '2023-09-01',
      targetDate: '2025-06-01',
      xpReward: 2500,
      milestones: [
        {
          id: 'm5',
          title: 'Physics Mastery',
          targetDate: '2024-06-01',
          completed: true,
          completedDate: '2024-06-15',
        },
        {
          id: 'm6',
          title: 'Coding Bootcamp',
          targetDate: '2025-01-01',
          completed: true,
          completedDate: '2025-01-10',
        },
        {
          id: 'm7',
          title: 'Innovation Project',
          targetDate: '2025-06-01',
          completed: false,
        },
      ],
    },
  ],
  solo: [
    {
      id: 'solo-1',
      title: 'Health & Sustainability 3-Year Program',
      description: 'Become certified in sustainable health practices',
      category: 'medium-term',
      status: 'in-progress',
      progress: 35,
      startDate: '2024-01-01',
      targetDate: '2027-01-01',
      xpReward: 4500,
      milestones: [
        {
          id: 'm8',
          title: 'Health Science Foundation',
          targetDate: '2024-12-01',
          completed: false,
        },
        {
          id: 'm9',
          title: 'Sustainability Certificate',
          targetDate: '2025-12-01',
          completed: false,
        },
        {
          id: 'm10',
          title: 'Field Experience',
          targetDate: '2026-12-01',
          completed: false,
        },
      ],
    },
  ],
};

export const LIFE_JOURNEY_ARC: ProgressArc[] = [
  {
    year: 0,
    ageRange: '0-7 years',
    phase: 'Foundation',
    keyFocuses: ['Learning fundamentals', 'Building confidence', 'Exploring interests'],
    milestones: ['First school day', 'Reading proficiency', 'Friendship building'],
  },
  {
    year: 7,
    ageRange: '7-14 years',
    phase: 'Growth & Discovery',
    keyFocuses: ['Academic excellence', 'Skill development', 'Community engagement'],
    milestones: [
      'Educational achievements',
      'First projects',
      'Leadership roles',
    ],
  },
  {
    year: 14,
    ageRange: '14-21 years',
    phase: 'Emergence',
    keyFocuses: ['Identity formation', 'Career exploration', 'Independence'],
    milestones: [
      'Qualification exams',
      'Career path choice',
      'First opportunities',
    ],
  },
  {
    year: 21,
    ageRange: '21-35 years',
    phase: 'Establishment',
    keyFocuses: ['Career building', 'Relationship development', 'Impact creation'],
    milestones: ['Career launch', 'Leadership role', 'First business venture'],
  },
  {
    year: 35,
    ageRange: '35-50 years',
    phase: 'Mastery',
    keyFocuses: [
      'Expertise deepening',
      'Legacy building',
      'Mentorship',
    ],
    milestones: [
      'Industry recognition',
      'Mentoring others',
      'Strategic positioning',
    ],
  },
  {
    year: 50,
    ageRange: '50-65 years',
    phase: 'Wisdom',
    keyFocuses: ['Knowledge transfer', 'Strategic vision', 'Community leadership'],
    milestones: ['Thought leadership', 'Foundation work', 'Succession planning'],
  },
  {
    year: 65,
    ageRange: '65-80 years',
    phase: 'Legacy',
    keyFocuses: ['Heritage preservation', 'Story sharing', 'Impact amplification'],
    milestones: [
      'Documentations',
      'Mentoring programs',
      'Cultural preservation',
    ],
  },
  {
    year: 80,
    ageRange: '80-103 years',
    phase: 'Elderhood',
    keyFocuses: ['Storytelling', 'Wisdom sharing', 'Eternal legacy'],
    milestones: [
      'Family gatherings',
      'Oral histories',
      'Cultural celebration',
    ],
  },
];

// ===== Components =====

/**
 * Goal Progress Card
 */
const GoalCard: React.FC<{ goal: Goal }> = ({ goal }) => {
  const categoryColors: Record<Goal['category'], string> = {
    'short-term': 'bg-amber-50 border-amber-200',
    'medium-term': 'bg-blue-50 border-blue-200',
    'long-term': 'bg-purple-50 border-purple-200',
  };

  const statusColors: Record<Goal['status'], string> = {
    'not-started': 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    paused: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${categoryColors[goal.category]}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{goal.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${statusColors[goal.status]}`}>
          {goal.status}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-medium text-gray-600">Progress</p>
          <p className="text-sm font-bold text-gray-900">{goal.progress}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      {/* Milestones */}
      {goal.milestones.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 uppercase">Milestones</p>
          {goal.milestones.map((milestone) => (
            <div key={milestone.id} className="flex items-center gap-2 p-2 bg-white rounded opacity-75">
              <CheckCircle
                className={`w-4 h-4 ${
                  milestone.completed ? 'text-green-600' : 'text-gray-400'
                }`}
              />
              <span className={`text-sm ${milestone.completed ? 'line-through' : ''}`}>
                {milestone.title}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* XP Reward */}
      {goal.xpReward && (
        <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm font-medium text-blue-700">
          <Zap className="w-4 h-4" />
          <span>{goal.xpReward} XP reward</span>
        </div>
      )}
    </div>
  );
};

/**
 * Goals Dashboard
 */
export const GoalsDashboard: React.FC<{ personId?: string }> = ({
  personId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'short-term' | 'medium-term' | 'long-term' | 'all'
  >('all');

  const goals = EXAMPLE_PROGRESS_PLANS[personId || 'azora'] || [];
  const filteredGoals =
    selectedCategory === 'all'
      ? goals
      : goals.filter((g) => g.category === selectedCategory);

  const totalProgress = Math.round(
    goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Target className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Personal Progress Plan</h2>
          <p className="text-sm text-gray-600">Track your goals and achievements</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
        <p className="text-sm font-semibold text-blue-600 mb-2">Overall Progress</p>
        <div className="flex items-end gap-4">
          <div>
            <p className="text-4xl font-bold text-blue-900">{totalProgress}%</p>
          </div>
          <div className="flex-1">
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        {['all', 'short-term', 'medium-term', 'long-term'].map((category) => (
          <button
            key={category}
            onClick={() =>
              setSelectedCategory(
                category as
                  | 'short-term'
                  | 'medium-term'
                  | 'long-term'
                  | 'all'
              )
            }
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.replace('-', ' ').replace(/^\w/, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {filteredGoals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No goals in this category
        </div>
      )}
    </div>
  );
};

/**
 * Life Journey Arc Timeline
 */
export const LifeJourneyArc: React.FC<{ currentAge?: number }> = ({
  currentAge = 14,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-purple-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Life Journey Arc</h2>
          <p className="text-sm text-gray-600">Your 103-year developmental path</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {LIFE_JOURNEY_ARC.map((arc, idx) => {
          const isCurrent = currentAge >= arc.year && (idx === LIFE_JOURNEY_ARC.length - 1 || currentAge < LIFE_JOURNEY_ARC[idx + 1].year);
          return (
            <div
              key={arc.year}
              className={`p-4 rounded-lg border-2 transition ${
                isCurrent
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{arc.phase}</h4>
                  <p className="text-sm text-gray-600">{arc.ageRange}</p>
                </div>
                {isCurrent && (
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                    Current
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">
                    Key Focuses
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {arc.keyFocuses.map((focus, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white text-gray-700 text-xs rounded"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">
                    Milestones
                  </p>
                  <ul className="text-sm text-gray-700 mt-1 space-y-1">
                    {arc.milestones.map((milestone, i) => (
                      <li key={i}>• {milestone}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Achievements Gallery
 */
export const AchievementsGallery: React.FC<{
  achievements?: Achievement[];
}> = ({
  achievements = [
    {
      id: 'a1',
      title: 'Foundation Master',
      description: 'Completed foundation module with distinction',
      icon: '🏆',
      earnedDate: '2024-05-28',
      category: 'academics',
    },
    {
      id: 'a2',
      title: 'Code Wizard',
      description: 'Completed coding bootcamp',
      icon: '💻',
      earnedDate: '2025-01-10',
      category: 'skills',
    },
    {
      id: 'a3',
      title: 'Team Player',
      description: 'Led successful team project',
      icon: '👥',
      earnedDate: '2024-11-15',
      category: 'leadership',
    },
  ],
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Award className="w-6 h-6 text-amber-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
          <p className="text-sm text-gray-600">
            {achievements.length} badges earned
          </p>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="flex flex-col items-center text-center p-4 rounded-lg border border-amber-200 bg-amber-50 hover:shadow-lg transition"
          >
            <div className="text-4xl mb-2">{achievement.icon}</div>
            <h4 className="font-semibold text-sm text-gray-900">
              {achievement.title}
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              {achievement.description}
            </p>
            <p className="text-xs text-amber-600 mt-2">
              {new Date(achievement.earnedDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
