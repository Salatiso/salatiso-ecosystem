import React from 'react';
import { Sun, Star, Award, TrendingUp, Users, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const WelcomeWidget: React.FC = () => {
  const { user } = useAuth();
  
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    // Extract first name from Google display name or email
    let name = 'Family Member';
    if (user?.displayName) {
      name = user.displayName.split(' ')[0];
    } else if (user?.email) {
      // Extract name before @ symbol
      name = user.email.split('@')[0];
      // Capitalize first letter
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 17) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Ubuntu: 'I am because we are.' Together we achieve greatness.",
      "Every small action contributes to our family legacy.",
      "Your growth strengthens the entire Mlandeli ecosystem.",
      "Today is another opportunity to create family value.",
      "Excellence is a family tradition - continue building it."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full border-2 border-white"></div>
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full border border-white"></div>
      </div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <Sun className="h-8 w-8 text-yellow-300" />
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium">Level {user?.gamification?.level || 1}</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">
          {getTimeBasedGreeting()}
        </h2>
        
        <p className="text-primary-100 mb-4 leading-relaxed">
          {getMotivationalMessage()}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-xl font-bold">{user?.gamification?.experiencePoints || 0}</div>
            <div className="text-xs text-primary-100">Total XP</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-xl font-bold">{user?.gamification?.streaks?.length || 0}</div>
            <div className="text-xs text-primary-100">Active Streaks</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EcosystemHealthWidget: React.FC = () => {
  // Simulated ecosystem data
  const ecosystemData = {
    totalApps: 8,
    activeUsers: 24,
    monthlyGrowth: 12,
    systemHealth: 98
  };

  const healthColor = ecosystemData.systemHealth >= 95 ? 'text-green-600' : 
                     ecosystemData.systemHealth >= 80 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Ecosystem Health</h3>
        <div className={`flex items-center space-x-2 ${healthColor}`}>
          <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">{ecosystemData.systemHealth}%</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">Total Applications</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">
            {ecosystemData.totalApps}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-600">Active Family Members</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">
            {ecosystemData.activeUsers}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-gray-600">Monthly Growth</span>
          </div>
          <span className="text-lg font-semibold text-green-600">
            +{ecosystemData.monthlyGrowth}%
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 mb-2">System Performance</div>
        <div className="progress-bar">
          <div 
            className="progress-fill bg-gradient-to-r from-green-500 to-emerald-500"
            style={{ width: `${ecosystemData.systemHealth}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const ProjectTimelineWidget: React.FC = () => {
  const upcomingProjects = [
    {
      id: 1,
      title: "BizHelp Mobile App Launch",
      deadline: new Date('2024-02-15'),
      status: 'in_progress',
      priority: 'high'
    },
    {
      id: 2,
      title: "Salatiso Legal Documentation",
      deadline: new Date('2024-02-28'),
      status: 'planning',
      priority: 'medium'
    },
    {
      id: 3,
      title: "Family Governance Framework",
      deadline: new Date('2024-03-10'),
      status: 'review',
      priority: 'high'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'planning': return 'text-yellow-600 bg-yellow-100';
      case 'review': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400';
      case 'medium': return 'border-yellow-400';
      case 'low': return 'border-green-400';
      default: return 'border-gray-400';
    }
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const today = new Date();
    const timeDiff = deadline.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {upcomingProjects.map((project) => {
          const daysLeft = getDaysUntilDeadline(project.deadline);
          
          return (
            <div
              key={project.id}
              className={`p-3 rounded-lg border-l-4 ${getPriorityColor(project.priority)} bg-gray-50`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">
                    {project.title}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className={`font-medium ${
                    daysLeft <= 3 ? 'text-red-600' : 
                    daysLeft <= 7 ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {daysLeft > 0 ? `${daysLeft} days` : 'Overdue'}
                  </div>
                  <div className="text-gray-400">
                    {project.deadline.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 text-sm text-primary-600 hover:text-primary-800 font-medium">
        View All Projects →
      </button>
    </div>
  );
};

const CareerProgressWidget: React.FC = () => {
  const { user } = useAuth();
  
  const careerData = {
    currentPath: "Technology Leadership",
    progress: 65,
    nextMilestone: "Senior Technical Architect",
    skillsInProgress: ["React Development", "Team Leadership", "System Design"],
    certificationsEarned: 3,
    upcomingAssessments: 2
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Career Progress</h3>
        <TrendingUp className="h-5 w-5 text-green-500" />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">
              {careerData.currentPath}
            </span>
            <span className="text-sm text-gray-500">
              {careerData.progress}%
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill bg-gradient-to-r from-primary-500 to-primary-600"
              style={{ width: `${careerData.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Next: {careerData.nextMilestone}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Skills in Progress</h4>
          <div className="flex flex-wrap gap-2">
            {careerData.skillsInProgress.map((skill, index) => (
              <span
                key={index}
                className="inline-flex px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {careerData.certificationsEarned}
            </div>
            <div className="text-xs text-gray-500">Certifications</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {careerData.upcomingAssessments}
            </div>
            <div className="text-xs text-gray-500">Assessments Due</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GamificationWidget: React.FC = () => {
  const { user } = useAuth();
  
  const trustScore = user?.gamification?.trustScore;
  const achievementCategories = user?.gamification?.achievementCategories || [];

  const achievements = [
    { id: 1, name: "First Login", icon: "🎯", unlocked: true },
    { id: 2, name: "Project Contributor", icon: "🛠️", unlocked: true },
    { id: 3, name: "Team Player", icon: "🤝", unlocked: false },
    { id: 4, name: "Innovation Leader", icon: "💡", unlocked: false },
  ];

  const recentActivity = [
    "Completed React Development module (+50 XP)",
    "Updated project status (+25 XP)", 
    "Participated in family meeting (+30 XP)"
  ];

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Trust & Achievements</h3>
        <div className="flex items-center space-x-1">
          <Award className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-600">
            Level {user?.gamification?.level || 1}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Trust Score Overview */}
        {trustScore && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Trust Score</span>
              <span className={`text-sm font-bold px-2 py-1 rounded-full ${getTrustScoreColor(trustScore.overall)}`}>
                {trustScore.overall}/100
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Ecosystem:</span>
                <span className={`font-medium ${getTrustScoreColor(trustScore.ecosystem).split(' ')[0]}`}>
                  {trustScore.ecosystem}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Family:</span>
                <span className={`font-medium ${getTrustScoreColor(trustScore.family).split(' ')[0]}`}>
                  {trustScore.family}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Business:</span>
                <span className={`font-medium ${getTrustScoreColor(trustScore.business).split(' ')[0]}`}>
                  {trustScore.business}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Learning:</span>
                <span className={`font-medium ${getTrustScoreColor(trustScore.learning).split(' ')[0]}`}>
                  {trustScore.learning}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Achievement Categories */}
        {achievementCategories.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Achievement Categories</h4>
            <div className="space-y-2">
              {achievementCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{category.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-primary-500 h-1.5 rounded-full"
                        style={{ width: `${category.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-900">
                      {category.totalPoints} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Level Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Level Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {user?.gamification?.experiencePoints || 0} XP
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill bg-gradient-to-r from-yellow-400 to-orange-500"
              style={{
                width: `${((user?.gamification?.experiencePoints || 0) /
                  ((user?.gamification?.experiencePoints || 0) + (user?.gamification?.pointsToNextLevel || 100))) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Recent Achievements */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Badges</h4>
          <div className="flex space-x-2">
            {achievements.filter(a => a.unlocked).map((achievement) => (
              <div
                key={achievement.id}
                className="flex flex-col items-center p-2 bg-yellow-50 rounded-lg border border-yellow-200"
                title={achievement.name}
              >
                <span className="text-lg">{achievement.icon}</span>
                <span className="text-xs text-gray-600 text-center mt-1">
                  {achievement.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h4>
          <div className="space-y-1">
            {recentActivity.map((activity, index) => (
              <div key={index} className="text-xs text-gray-600 flex items-start">
                <span className="w-1 h-1 bg-primary-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                {activity}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  WelcomeWidget,
  EcosystemHealthWidget,
  ProjectTimelineWidget,
  CareerProgressWidget,
  GamificationWidget
};