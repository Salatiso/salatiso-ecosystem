import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Star,
  Heart,
  Zap,
  Award,
  Trophy,
  Target,
  Users,
  BookOpen,
  Gamepad2,
  Volume2,
  Lock,
  Unlock,
  ChevronRight,
  Plus,
  Settings,
  BarChart3,
  Calendar,
  TrendingUp,
  Lightbulb,
  Brain,
  Palette,
  Music,
  Coins,
  Shield,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOffline } from '@/hooks/useOffline';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'creative' | 'physical' | 'social' | 'thinking';
  difficulty: 'easy' | 'medium' | 'hard';
  ageRange: [number, number];
  duration: number; // minutes
  xpReward: number;
  coins: number;
  completed: boolean;
  completedAt?: string;
  progress: number;
  icon: string;
  instructions: string[];
  tips: string[];
  parentalGuidance?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  unlockedAt?: string;
  locked: boolean;
  progress: number; // 0-100
}

interface KidsProfile {
  id: string;
  name: string;
  age: number;
  level: number;
  xp: number;
  coins: number;
  totalChallengesCompleted: number;
  streak: number;
  avatar?: string;
  interests: string[];
  achievements: Achievement[];
}

interface ParentalControl {
  screenTimeLimit: number; // minutes per day
  contentFilter: 'all-ages' | 'age-appropriate' | 'restricted';
  enableNotifications: boolean;
  enableChallenges: boolean;
  enableShop: boolean;
  blockedTimes: { start: string; end: string }[];
}

const KidsZone: React.FC = () => {
  const { user } = useAuth();
  const { isOnline } = useOffline();
  
  const [activeTab, setActiveTab] = useState<'challenges' | 'profile' | 'shop' | 'parental'>('challenges');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [kidsProfile, setKidsProfile] = useState<KidsProfile>({
    id: 'kid-1',
    name: 'Zuri Mdeni',
    age: 8,
    level: 5,
    xp: 2450,
    coins: 1250,
    totalChallengesCompleted: 23,
    streak: 7,
    interests: ['art', 'music', 'science'],
    achievements: []
  });

  const [parentalControls, setParentalControls] = useState<ParentalControl>({
    screenTimeLimit: 60,
    contentFilter: 'age-appropriate',
    enableNotifications: true,
    enableChallenges: true,
    enableShop: true,
    blockedTimes: []
  });

  // Sample challenges
  const challenges: Challenge[] = [
    {
      id: 'ch-paint-dream',
      title: 'Paint Your Dream',
      description: 'Create a colorful artwork using watercolors or digital tools.',
      category: 'creative',
      difficulty: 'easy',
      ageRange: [5, 12],
      duration: 30,
      xpReward: 100,
      coins: 50,
      completed: true,
      completedAt: '2025-10-14',
      progress: 100,
      icon: '🎨',
      instructions: [
        'Gather your materials (paper, paint, or use a digital canvas)',
        'Think about what you want to create',
        'Paint freely without worrying about perfection',
        'Share your creation with your family!'
      ],
      tips: [
        'Mix colors to see what happens',
        'Use different brush sizes for variety',
        'Start light and add darker colors'
      ]
    },
    {
      id: 'ch-math-quest',
      title: 'Math Quest Adventure',
      description: 'Solve 10 math problems to complete the treasure hunt.',
      category: 'learning',
      difficulty: 'medium',
      ageRange: [6, 11],
      duration: 20,
      xpReward: 150,
      coins: 75,
      completed: true,
      completedAt: '2025-10-13',
      progress: 100,
      icon: '🔢',
      instructions: [
        'Answer math questions correctly',
        'Each correct answer gets you closer to the treasure',
        'Try to beat your personal best time'
      ],
      tips: [
        'Take your time with each problem',
        'Use paper to work through problems',
        'Double-check your answers'
      ]
    },
    {
      id: 'ch-nature-explorer',
      title: 'Nature Explorer Challenge',
      description: 'Find and photograph 5 different plants or animals in your area.',
      category: 'physical',
      difficulty: 'easy',
      ageRange: [5, 14],
      duration: 60,
      xpReward: 200,
      coins: 100,
      completed: false,
      progress: 60,
      icon: '🌿',
      instructions: [
        'Go outside (with adult supervision)',
        'Look for different plants, insects, or animals',
        'Take photos or draw what you find',
        'Learn something new about each discovery'
      ],
      tips: [
        'Early morning or late afternoon is best for spotting animals',
        'Look under leaves and logs',
        'Use a field guide to identify species'
      ],
      parentalGuidance: 'Encourage safe exploration. Discuss staying aware of surroundings.'
    },
    {
      id: 'ch-music-maker',
      title: 'Compose Your Song',
      description: 'Create a simple melody using available instruments or apps.',
      category: 'creative',
      difficulty: 'medium',
      ageRange: [6, 13],
      duration: 45,
      xpReward: 175,
      coins: 85,
      completed: false,
      progress: 0,
      icon: '🎵',
      instructions: [
        'Choose an instrument or music app',
        'Experiment with different notes',
        'Create a short 8-note melody',
        'Share your composition'
      ],
      tips: [
        'Try repeating patterns',
        'Use the same notes from a favorite song',
        'Record your music to share'
      ]
    },
    {
      id: 'ch-kindness-quest',
      title: 'Kindness Quest',
      description: 'Perform 5 acts of kindness and journal about them.',
      category: 'social',
      difficulty: 'easy',
      ageRange: [5, 14],
      duration: 120,
      xpReward: 250,
      coins: 150,
      completed: false,
      progress: 40,
      icon: '💚',
      instructions: [
        'Think of ways to help others',
        'Help a family member with a chore',
        'Share something with a friend',
        'Compliment someone',
        'Journal how helping made you feel'
      ],
      tips: [
        'Small gestures matter',
        'Being kind to yourself counts too',
        'Notice how others respond'
      ],
      parentalGuidance: 'Help your child reflect on empathy and gratitude. Discuss emotional growth.'
    },
    {
      id: 'ch-brain-maze',
      title: 'Brain Teaser Maze',
      description: 'Solve logic puzzles and navigate through challenging mazes.',
      category: 'thinking',
      difficulty: 'hard',
      ageRange: [8, 14],
      duration: 30,
      xpReward: 300,
      coins: 200,
      completed: false,
      progress: 25,
      icon: '🧩',
      instructions: [
        'Examine each puzzle carefully',
        'Find the pattern or solution',
        'Navigate through the maze',
        'Try to solve in minimum time'
      ],
      tips: [
        'Work backwards from the end',
        'Look for patterns',
        'Take breaks if stuck'
      ]
    },
    {
      id: 'ch-science-experiment',
      title: 'Cool Science Experiment',
      description: 'Conduct a fun, safe science experiment and document results.',
      category: 'learning',
      difficulty: 'medium',
      ageRange: [7, 13],
      duration: 40,
      xpReward: 200,
      coins: 120,
      completed: false,
      progress: 0,
      icon: '🔬',
      instructions: [
        'Choose an experiment from the list',
        'Gather safe household materials',
        'Follow steps carefully',
        'Write down what you observe',
        'Share your findings'
      ],
      tips: [
        'Ask an adult for help',
        'Measure ingredients carefully',
        'Observe closely'
      ],
      parentalGuidance: 'Supervise experiments. Encourage hypothesis testing and observation skills.'
    },
    {
      id: 'ch-storyteller',
      title: 'Story Creator Challenge',
      description: 'Write or tell a story with a beginning, middle, and end.',
      category: 'creative',
      difficulty: 'medium',
      ageRange: [5, 14],
      duration: 45,
      xpReward: 175,
      coins: 100,
      completed: false,
      progress: 0,
      icon: '📖',
      instructions: [
        'Think of a character or situation',
        'Plan your story structure',
        'Write or record your story',
        'Share it with family or friends'
      ],
      tips: [
        'Start with "Once upon a time..."',
        'Include a problem to solve',
        'End with a satisfying conclusion'
      ]
    }
  ];

  const achievements: Achievement[] = [
    {
      id: 'ach-first-step',
      name: 'First Steps',
      description: 'Complete your first challenge',
      icon: '👣',
      rarity: 'common',
      locked: false,
      unlockedAt: '2025-09-15',
      progress: 100
    },
    {
      id: 'ach-creativity',
      name: 'Creative Genius',
      description: 'Complete 5 creative challenges',
      icon: '🎨',
      rarity: 'uncommon',
      locked: false,
      unlockedAt: '2025-10-01',
      progress: 100
    },
    {
      id: 'ach-streak-7',
      name: 'Week Warrior',
      description: 'Complete challenges 7 days in a row',
      icon: '⚡',
      rarity: 'uncommon',
      locked: false,
      unlockedAt: '2025-10-14',
      progress: 100
    },
    {
      id: 'ach-collector',
      name: 'Coin Collector',
      description: 'Collect 1000 coins',
      icon: '💰',
      rarity: 'uncommon',
      locked: false,
      unlockedAt: '2025-10-10',
      progress: 100
    },
    {
      id: 'ach-scholar',
      name: 'Young Scholar',
      description: 'Complete 10 learning challenges',
      icon: '📚',
      rarity: 'rare',
      locked: true,
      progress: 70
    },
    {
      id: 'ach-master',
      name: 'Challenge Master',
      description: 'Complete all challenges',
      icon: '👑',
      rarity: 'legendary',
      locked: true,
      progress: 29
    }
  ];

  const xpToNextLevel = 5000;
  const xpProgress = (kidsProfile.xp % xpToNextLevel) / xpToNextLevel;

  // Filter challenges
  const filteredChallenges = useMemo(() => {
    let filtered = challenges.filter(ch => {
      const ageMatch = kidsProfile.age >= ch.ageRange[0] && kidsProfile.age <= ch.ageRange[1];
      const categoryMatch = selectedCategory === 'all' || ch.category === selectedCategory;
      return ageMatch && categoryMatch;
    });

    // Sort by recommended (incomplete first, then by difficulty)
    filtered.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const diffOrder = { easy: 0, medium: 1, hard: 2 };
      return diffOrder[a.difficulty] - diffOrder[b.difficulty];
    });

    return filtered;
  }, [selectedCategory, kidsProfile.age]);

  const categoryIcons = {
    learning: <BookOpen className="w-5 h-5" />,
    creative: <Palette className="w-5 h-5" />,
    physical: <Zap className="w-5 h-5" />,
    social: <Users className="w-5 h-5" />,
    thinking: <Brain className="w-5 h-5" />
  };

  const rarityColors = {
    common: 'bg-gray-100 text-gray-800 border-gray-300',
    uncommon: 'bg-green-100 text-green-800 border-green-300',
    rare: 'bg-blue-100 text-blue-800 border-blue-300',
    legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };

  const getChallengeColor = (category: string) => {
    switch (category) {
      case 'learning': return 'bg-blue-50 border-blue-200';
      case 'creative': return 'bg-purple-50 border-purple-200';
      case 'physical': return 'bg-green-50 border-green-200';
      case 'social': return 'bg-pink-50 border-pink-200';
      case 'thinking': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '⭐';
      case 'medium': return '⭐⭐';
      case 'hard': return '⭐⭐⭐';
      default: return '⭐';
    }
  };

  // Challenges View
  const renderChallenges = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'learning', 'creative', 'physical', 'social', 'thinking'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
            }`}
          >
            {cat === 'all' ? '🎯 All' : `${categoryIcons[cat as keyof typeof categoryIcons]} ${cat}`}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="space-y-4">
        {filteredChallenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg shadow-sm p-6 border-2 ${getChallengeColor(challenge.category)}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start gap-4 flex-1">
                <span className="text-5xl">{challenge.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{challenge.title}</h3>
                    <span className="text-sm opacity-60">{getDifficultyEmoji(challenge.difficulty)}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{challenge.description}</p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-2 py-1 bg-white bg-opacity-60 rounded">
                      ⏱️ {challenge.duration}min
                    </span>
                    <span className="px-2 py-1 bg-white bg-opacity-60 rounded">
                      ✨ {challenge.xpReward} XP
                    </span>
                    <span className="px-2 py-1 bg-white bg-opacity-60 rounded">
                      💰 {challenge.coins} coins
                    </span>
                  </div>
                </div>
              </div>
              <button className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                challenge.completed
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}>
                {challenge.completed ? '✓ Done' : 'Start'}
              </button>
            </div>

            {/* Progress Bar */}
            {challenge.progress > 0 && challenge.progress < 100 && (
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold">{challenge.progress}%</span>
                </div>
                <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Expandable Details */}
            <details className="cursor-pointer mt-3 text-sm">
              <summary className="font-semibold text-gray-700 hover:text-gray-900">
                View Instructions & Tips ➤
              </summary>
              <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg space-y-3">
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">📋 Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    {challenge.instructions.map((inst, idx) => (
                      <li key={idx}>{inst}</li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">💡 Tips:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {challenge.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
                {challenge.parentalGuidance && (
                  <div className="bg-blue-100 border border-blue-300 rounded p-2">
                    <h4 className="font-bold text-blue-900 mb-1">👨‍👩‍👧 Parental Guidance:</h4>
                    <p className="text-blue-800 text-sm">{challenge.parentalGuidance}</p>
                  </div>
                )}
              </div>
            </details>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Profile View
  const renderProfile = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-lg p-8 text-white"
      >
        <div className="flex items-center gap-6 mb-6">
          <div className="text-6xl">🎮</div>
          <div>
            <h2 className="text-4xl font-bold">{kidsProfile.name}</h2>
            <p className="text-lg opacity-90">Age {kidsProfile.age} • Level {kidsProfile.level}</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span>Experience Points</span>
            <span>{kidsProfile.xp.toLocaleString()} / {(Math.floor(kidsProfile.xp / xpToNextLevel) + 1) * xpToNextLevel}</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all"
              style={{ width: `${xpProgress * 100}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white border-opacity-30">
          <div>
            <p className="opacity-90">Coins</p>
            <p className="text-2xl font-bold">💰 {kidsProfile.coins}</p>
          </div>
          <div>
            <p className="opacity-90">Challenges</p>
            <p className="text-2xl font-bold">🏆 {kidsProfile.totalChallengesCompleted}</p>
          </div>
          <div>
            <p className="opacity-90">Streak</p>
            <p className="text-2xl font-bold">🔥 {kidsProfile.streak} days</p>
          </div>
          <div>
            <p className="opacity-90">Achievements</p>
            <p className="text-2xl font-bold">⭐ {achievements.filter(a => !a.locked).length}/{achievements.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Achievements
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <motion.div
              key={ach.id}
              whileHover={{ scale: 1.05 }}
              className={`rounded-lg p-4 text-center border-2 cursor-pointer transition-all ${
                ach.locked
                  ? 'bg-gray-100 border-gray-300 opacity-60'
                  : `border-2 ${rarityColors[ach.rarity]}`
              }`}
            >
              <div className="text-4xl mb-2">{ach.icon}</div>
              <h4 className="font-bold text-sm">{ach.name}</h4>
              <p className="text-xs opacity-70 mt-1">{ach.description}</p>
              {ach.progress < 100 && (
                <div className="mt-2 w-full bg-gray-300 rounded-full h-1">
                  <div
                    className="bg-green-500 h-1 rounded-full"
                    style={{ width: `${ach.progress}%` }}
                  />
                </div>
              )}
              {ach.locked && (
                <div className="mt-2 flex items-center justify-center gap-1 text-yellow-600 text-xs font-semibold">
                  <Lock className="w-3 h-3" />
                  Locked
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {kidsProfile.interests.map((interest) => (
            <span key={interest} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  // Shop View
  const renderShop = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border-2 border-yellow-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">🎁 Reward Shop</h3>
          <div className="text-right">
            <p className="text-sm text-gray-600">Your Balance</p>
            <p className="text-3xl font-bold text-yellow-600">💰 {kidsProfile.coins}</p>
          </div>
        </div>
        <p className="text-gray-600">Spend your coins on awesome rewards!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: 1, name: 'Extra Game Time', price: 100, emoji: '⏱️' },
          { id: 2, name: 'Movie Night Pass', price: 150, emoji: '🎬' },
          { id: 3, name: 'Choose Family Activity', price: 200, emoji: '🎪' },
          { id: 4, name: 'Dessert of Your Choice', price: 80, emoji: '🍰' },
          { id: 5, name: 'Sleepover Privilege', price: 250, emoji: '🏕️' },
          { id: 6, name: 'Skip Chore Pass', price: 120, emoji: '✋' }
        ].map((reward) => (
          <motion.div
            key={reward.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-4 border-2 border-purple-200"
          >
            <div className="text-5xl mb-3">{reward.emoji}</div>
            <h4 className="font-bold text-lg mb-2">{reward.name}</h4>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-yellow-600">💰 {reward.price}</span>
              <button
                disabled={kidsProfile.coins < reward.price}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  kidsProfile.coins >= reward.price
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Redeem
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Parental Controls View
  const renderParentalControls = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
        <h3 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Parental Controls
        </h3>
        <p className="text-blue-800">Manage your child&apos;s experience and screen time.</p>
      </div>

      <div className="space-y-4">
        {/* Screen Time Limit */}
        <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
          <label className="flex items-center justify-between mb-4">
            <span className="font-bold text-gray-900">Daily Screen Time Limit</span>
            <span className="text-2xl font-bold text-orange-600">{parentalControls.screenTimeLimit} min</span>
          </label>
          <input
            type="range"
            min="15"
            max="120"
            step="15"
            value={parentalControls.screenTimeLimit}
            onChange={(e) => setParentalControls({ ...parentalControls, screenTimeLimit: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>15 min</span>
            <span>120 min</span>
          </div>
        </div>

        {/* Content Filter */}
        <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
          <label className="font-bold text-gray-900 mb-3 block">Content Filter</label>
          <div className="space-y-2">
            {['all-ages', 'age-appropriate', 'restricted'].map((filter) => (
              <label key={filter} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="content-filter"
                  value={filter}
                  checked={parentalControls.contentFilter === filter}
                  onChange={(e) => setParentalControls({ ...parentalControls, contentFilter: e.target.value as any })}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 capitalize font-medium">{filter.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Toggle Settings */}
        <div className="bg-white rounded-lg p-6 border-2 border-gray-200 space-y-3">
          {[
            { key: 'enableNotifications', label: 'Enable Notifications', icon: '🔔' },
            { key: 'enableChallenges', label: 'Enable Challenges', icon: '🎯' },
            { key: 'enableShop', label: 'Enable Reward Shop', icon: '🎁' }
          ].map((setting) => (
            <label key={setting.key} className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-gray-900">{setting.icon} {setting.label}</span>
              <input
                type="checkbox"
                checked={parentalControls[setting.key as keyof ParentalControl] as boolean}
                onChange={(e) => setParentalControls({
                  ...parentalControls,
                  [setting.key]: e.target.checked
                })}
                className="w-5 h-5"
              />
            </label>
          ))}
        </div>

        {/* Save Button */}
        <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );

  return (
    <IntranetLayout>
      <Head>
        <title>Kids Zone | MNI Intranet</title>
        <meta name="description" content="Educational and interactive learning portal for children" />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mb-2">
            🎮 Welcome to Kids Zone!
          </h1>
          <p className="text-xl text-gray-600">Fun learning challenges, achievements, and rewards</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-white rounded-lg shadow-sm p-2 flex-wrap">
          {['challenges', 'profile', 'shop', 'parental'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-lg font-bold transition-all capitalize ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab === 'challenges' && '🎯 '}
              {tab === 'profile' && '👤 '}
              {tab === 'shop' && '🎁 '}
              {tab === 'parental' && '👨‍👩‍👧 '}
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        {activeTab === 'challenges' && renderChallenges()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'shop' && renderShop()}
        {activeTab === 'parental' && renderParentalControls()}
      </div>
    </IntranetLayout>
  );
};

export default KidsZone;
