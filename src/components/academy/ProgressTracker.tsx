import React, { useState } from 'react';
import { Trophy, Target, TrendingUp, Award, Clock, CheckCircle, Circle, Star } from 'lucide-react';
import { UbuntuIcon, JourneyIcon, MilestoneIcon } from '../icons';

interface ProgressItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
  totalSteps: number;
  lastActivity: string;
  level: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
  icon: React.ComponentType<any>;
}

const progressItems: ProgressItem[] = [
  {
    id: 'personal-safety',
    title: 'Personal Safety & LifeKey OS',
    description: 'Master personal safety practices and digital identity management',
    completed: true,
    progress: 100,
    totalSteps: 6,
    lastActivity: '2 days ago',
    level: 1
  },
  {
    id: 'lifecv-literacy',
    title: 'LifeCV Literacy & Reflection',
    description: 'Learn to capture daily reflections and build personal evidence',
    completed: false,
    progress: 75,
    totalSteps: 8,
    lastActivity: '1 day ago',
    level: 1
  },
  {
    id: 'household-sync',
    title: 'LifeSync Household Management',
    description: 'Create and manage household duty rosters and shared resources',
    completed: false,
    progress: 40,
    totalSteps: 10,
    lastActivity: '3 days ago',
    level: 2
  },
  {
    id: 'transport-operations',
    title: 'Safe Transport & Parcel Delivery',
    description: 'Master safe transport operations and parcel custody transfers',
    completed: false,
    progress: 20,
    totalSteps: 12,
    lastActivity: '1 week ago',
    level: 3
  }
];

const achievements: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first learning module',
    earned: true,
    earnedDate: 'October 5, 2025',
    icon: Star
  },
  {
    id: 'safety-champion',
    title: 'Safety Champion',
    description: 'Complete all Level 1 safety modules',
    earned: true,
    earnedDate: 'October 8, 2025',
    icon: Award
  },
  {
    id: 'household-hero',
    title: 'Household Hero',
    description: 'Successfully manage household operations',
    earned: false,
    icon: Trophy
  },
  {
    id: 'community-leader',
    title: 'Community Leader',
    description: 'Lead community governance activities',
    earned: false,
    icon: Target
  }
];

const ProgressTracker: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'progress' | 'achievements'>('progress');

  const totalProgress = progressItems.reduce((sum, item) => sum + item.progress, 0) / progressItems.length;
  const completedModules = progressItems.filter(item => item.completed).length;
  const totalModules = progressItems.length;

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'text-emerald-600 bg-emerald-100';
      case 2: return 'text-blue-600 bg-blue-100';
      case 3: return 'text-orange-600 bg-orange-100';
      case 4: return 'text-sky-600 bg-sky-100';
      case 5: return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ubuntu-purple/5 via-white to-ubuntu-gold/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <JourneyIcon className="w-12 h-12 text-ubuntu-purple mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">Learning Progress</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your journey through the Sazi Life Academy. Every step forward brings you closer
            to mastering Ubuntu wisdom and community leadership.
          </p>
        </div>

        {/* Overall Progress Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#6B46C1"
                    strokeWidth="2"
                    strokeDasharray={`${totalProgress}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-ubuntu-purple">{Math.round(totalProgress)}%</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Overall Progress</h3>
              <p className="text-gray-600">Across all learning paths</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-ubuntu-gold rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{completedModules}/{totalModules}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Modules Completed</h3>
              <p className="text-gray-600">Learning milestones achieved</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-ubuntu-purple rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {achievements.filter(a => a.earned).length}/{achievements.length}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Achievements Earned</h3>
              <p className="text-gray-600">Recognition of excellence</p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setSelectedView('progress')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedView === 'progress'
                  ? 'bg-ubuntu-purple text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Learning Progress
            </button>
            <button
              onClick={() => setSelectedView('achievements')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedView === 'achievements'
                  ? 'bg-ubuntu-purple text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Achievements
            </button>
          </div>
        </div>

        {/* Progress View */}
        {selectedView === 'progress' && (
          <div className="space-y-6">
            {progressItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(item.level)}`}>
                        Level {item.level}
                      </span>
                      {item.completed && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-ubuntu-purple mb-1">
                      {item.progress}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.progress}/{item.totalSteps} steps
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-ubuntu-purple to-ubuntu-gold h-3 rounded-full transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>

                {/* Module Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {Array.from({ length: item.totalSteps }, (_, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {index < Math.floor((item.progress / 100) * item.totalSteps) ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${
                        index < Math.floor((item.progress / 100) * item.totalSteps)
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }`}>
                        Step {index + 1}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Last activity: {item.lastActivity}</span>
                  <button className="text-ubuntu-purple hover:text-ubuntu-gold font-medium">
                    Continue Learning →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Achievements View */}
        {selectedView === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`rounded-lg p-6 border-2 transition-all duration-300 ${
                    achievement.earned
                      ? 'bg-gradient-to-br from-ubuntu-purple/10 to-ubuntu-gold/10 border-ubuntu-gold'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      achievement.earned
                        ? 'bg-gradient-to-br from-ubuntu-purple to-ubuntu-gold'
                        : 'bg-gray-200'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        achievement.earned ? 'text-white' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-1 ${
                        achievement.earned ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm mb-3 ${
                        achievement.earned ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                      {achievement.earned && achievement.earnedDate && (
                        <div className="flex items-center text-sm text-ubuntu-purple">
                          <Trophy className="w-4 h-4 mr-1" />
                          Earned on {achievement.earnedDate}
                        </div>
                      )}
                      {!achievement.earned && (
                        <div className="text-sm text-gray-400">
                          Not yet earned
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Ubuntu Wisdom */}
        <div className="mt-12 bg-gradient-to-r from-ubuntu-purple/10 to-ubuntu-gold/10 rounded-lg p-8">
          <div className="text-center">
            <MilestoneIcon className="w-8 h-8 text-ubuntu-purple mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ubuntu Progress Wisdom</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              &ldquo;The journey of a thousand miles begins with a single step.&rdquo;
              Every module completed, every achievement earned, brings you closer to the wisdom
              that serves both your individual growth and the prosperity of your community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;