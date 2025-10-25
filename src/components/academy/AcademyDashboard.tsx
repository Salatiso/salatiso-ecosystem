import React, { useState } from 'react';
import { BookOpen, Users, Award, Target, Clock, TrendingUp, GraduationCap, Heart } from 'lucide-react';
import { UbuntuIcon, JourneyIcon, MilestoneIcon, RondavelIcon } from '../icons';

interface AcademyStats {
  totalLearners: number;
  activeCourses: number;
  completedModules: number;
  averageProgress: number;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: number;
  modules: number;
  duration: string;
  enrolled: number;
  icon: React.ComponentType<any>;
}

const academyStats: AcademyStats = {
  totalLearners: 24,
  activeCourses: 8,
  completedModules: 156,
  averageProgress: 73
};

const learningPaths: LearningPath[] = [
  {
    id: 'personal-foundations',
    title: 'Personal Foundations',
    description: 'Build trust-ready habits and LifeCV literacy',
    level: 1,
    modules: 6,
    duration: '2-3 weeks',
    enrolled: 18,
    icon: Heart
  },
  {
    id: 'household-collaborator',
    title: 'Household Collaborator',
    description: 'Run household duty rosters and shared resource plans',
    level: 2,
    modules: 8,
    duration: '3-4 weeks',
    enrolled: 12,
    icon: Users
  },
  {
    id: 'field-operator',
    title: 'Field Operator',
    description: 'Deliver safe transport, parcel, and mesh operations',
    level: 3,
    modules: 10,
    duration: '4-5 weeks',
    enrolled: 8,
    icon: Target
  },
  {
    id: 'community-steward',
    title: 'Community Steward',
    description: 'Coordinate multi-household governance and incident response',
    level: 4,
    modules: 12,
    duration: '5-6 weeks',
    enrolled: 5,
    icon: GraduationCap
  },
  {
    id: 'ecosystem-superuser',
    title: 'Ecosystem Superuser',
    description: 'Mentor leaders, integrate APIs, and manage advanced governance',
    level: 5,
    modules: 15,
    duration: '6-8 weeks',
    enrolled: 2,
    icon: Award
  }
];

const AcademyDashboard: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ubuntu-purple/5 via-white to-ubuntu-gold/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <UbuntuIcon className="w-12 h-12 text-ubuntu-purple mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">Sazi Life Academy</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Family-first learning ecosystem where every member grows together through Ubuntu wisdom,
            practical skills, and community collaboration.
          </p>
        </div>

        {/* Ubuntu Philosophy Banner */}
        <div className="bg-gradient-to-r from-ubuntu-purple to-ubuntu-gold rounded-lg p-6 mb-12 text-white">
          <div className="flex items-center justify-center mb-4">
            <RondavelIcon className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">Ubuntu Learning Philosophy</h2>
          </div>
          <p className="text-center text-lg">
            &ldquo;My child is my child, your child is my child, our children are our children&rdquo; -
            We learn together, grow together, and succeed together as one family.
          </p>
        </div>

        {/* Academy Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-ubuntu-purple/20">
            <Users className="w-8 h-8 text-ubuntu-purple mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">{academyStats.totalLearners}</div>
            <div className="text-sm text-gray-600">Active Learners</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-ubuntu-gold/20">
            <BookOpen className="w-8 h-8 text-ubuntu-gold mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">{academyStats.activeCourses}</div>
            <div className="text-sm text-gray-600">Active Courses</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-ubuntu-purple/20">
            <Award className="w-8 h-8 text-ubuntu-purple mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">{academyStats.completedModules}</div>
            <div className="text-sm text-gray-600">Modules Completed</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-ubuntu-gold/20">
            <TrendingUp className="w-8 h-8 text-ubuntu-gold mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">{academyStats.averageProgress}%</div>
            <div className="text-sm text-gray-600">Average Progress</div>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => {
              const IconComponent = path.icon;
              return (
                <div
                  key={path.id}
                  className="bg-white rounded-lg shadow-lg border-2 border-ubuntu-purple/20 hover:border-ubuntu-gold/50 transition-all duration-300 p-6 cursor-pointer"
                  onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        path.level === 1 ? 'bg-emerald-100' :
                        path.level === 2 ? 'bg-blue-100' :
                        path.level === 3 ? 'bg-orange-100' :
                        path.level === 4 ? 'bg-sky-100' : 'bg-purple-100'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          path.level === 1 ? 'text-emerald-600' :
                          path.level === 2 ? 'text-blue-600' :
                          path.level === 3 ? 'text-orange-600' :
                          path.level === 4 ? 'text-sky-600' : 'text-purple-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Level {path.level}</h3>
                        <p className="text-sm text-gray-600">{path.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{path.modules} modules</div>
                      <div className="text-xs text-gray-500">{path.duration}</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{path.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ubuntu-purple font-medium">{path.enrolled} enrolled</span>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {path.duration}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {selectedPath === path.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">Key Capabilities:</span>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600">
                          {path.level === 1 && (
                            <>
                              <li>• Master personal safety practices and LifeKey OS</li>
                              <li>• Capture daily reflections and reciprocity acts</li>
                              <li>• Understand ecosystem data flows</li>
                            </>
                          )}
                          {path.level === 2 && (
                            <>
                              <li>• Create LifeSync households with tiered visibility</li>
                              <li>• Design rotating support schedules</li>
                              <li>• Host household stand-ups</li>
                            </>
                          )}
                          {path.level === 3 && (
                            <>
                              <li>• Practise Follow Me Home night mode drills</li>
                              <li>• Run parcel custody transfers with audits</li>
                              <li>• Capture incident checklists</li>
                            </>
                          )}
                          {path.level === 4 && (
                            <>
                              <li>• Run validator quorums with 60% approval rule</li>
                              <li>• Document incident drills with improvements</li>
                              <li>• Schedule community updates</li>
                            </>
                          )}
                          {path.level === 5 && (
                            <>
                              <li>• Design custom missions with badges</li>
                              <li>• Configure LifeCV & Trust APIs</li>
                              <li>• Coach regional cohorts</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Kwakho's Coordinator Role Integration */}
        <div className="bg-gradient-to-r from-ubuntu-purple/10 to-ubuntu-gold/10 rounded-lg p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Academy Leadership</h3>
            <p className="text-gray-600">Coordinated by Kwakho Mdeni - Sazi Life Academy Coordinator</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <BookOpen className="w-8 h-8 text-ubuntu-purple mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">Curriculum Development</h4>
              <p className="text-sm text-gray-600">Overseeing comprehensive learning paths and educational quality</p>
            </div>

            <div className="text-center">
              <Target className="w-8 h-8 text-ubuntu-gold mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">Testing & Assessment</h4>
              <p className="text-sm text-gray-600">Managing testing processes and ensuring Ubuntu integration</p>
            </div>

            <div className="text-center">
              <Users className="w-8 h-8 text-ubuntu-purple mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">Family Coordination</h4>
              <p className="text-sm text-gray-600">Coordinating with family members for content contributions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademyDashboard;