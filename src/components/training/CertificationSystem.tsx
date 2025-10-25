import React, { useState, useEffect } from 'react';
import { Award, BookOpen, CheckCircle, Clock, Star, Trophy, Users, Target, Shield, Heart } from 'lucide-react';
import { UbuntuIcon, FamilyIcon } from '../icons';

interface Certification {
  id: string;
  title: string;
  titleXhosa: string;
  level: 'foundation' | 'intermediate' | 'advanced' | 'master';
  category: 'ubuntu' | 'leadership' | 'technical' | 'cultural' | 'business';
  description: string;
  requirements: string[];
  duration: string;
  prerequisites: string[];
  skills: string[];
  icon: React.ComponentType<any>;
  color: string;
  currentEnrollments: number;
  completionRate: number;
}

interface CertificationProgress {
  certificationId: string;
  userId: string;
  progress: number;
  completedModules: number;
  totalModules: number;
  timeSpent: number;
  lastActivity: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'certified';
}

const certifications: Certification[] = [
  {
    id: 'ubuntu-foundation',
    title: 'Ubuntu Foundation',
    titleXhosa: 'Isiseko se-Ubuntu',
    level: 'foundation',
    category: 'ubuntu',
    description: 'Master the core principles of Ubuntu philosophy and their application in daily life and business.',
    requirements: [
      'Complete Ubuntu Philosophy module',
      'Participate in community circle',
      'Submit personal Ubuntu reflection',
      'Pass Ubuntu principles assessment'
    ],
    duration: '4 weeks',
    prerequisites: [],
    skills: ['Ubuntu Philosophy', 'Community Engagement', 'Cultural Awareness', 'Ethical Decision Making'],
    icon: UbuntuIcon,
    color: 'text-purple-600',
    currentEnrollments: 247,
    completionRate: 89
  },
  {
    id: 'cultural-stewardship',
    title: 'Cultural Stewardship',
    titleXhosa: 'Ubugcisa Bamasiko',
    level: 'intermediate',
    category: 'cultural',
    description: 'Learn to preserve and promote South African cultural heritage within the digital ecosystem.',
    requirements: [
      'Ubuntu Foundation certification',
      'Cultural heritage documentation',
      'Traditional knowledge sharing',
      'Cultural impact assessment'
    ],
    duration: '6 weeks',
    prerequisites: ['ubuntu-foundation'],
    skills: ['Cultural Preservation', 'Knowledge Transfer', 'Impact Assessment', 'Community Leadership'],
    icon: Heart,
    color: 'text-red-600',
    currentEnrollments: 156,
    completionRate: 76
  },
  {
    id: 'ubuntu-leadership',
    title: 'Ubuntu Leadership',
    titleXhosa: 'UbuNkokeli be-Ubuntu',
    level: 'advanced',
    category: 'leadership',
    description: 'Develop leadership skills rooted in Ubuntu principles for community and business governance.',
    requirements: [
      'Cultural Stewardship certification',
      'Leadership case studies',
      'Community project leadership',
      'Peer mentoring program'
    ],
    duration: '8 weeks',
    prerequisites: ['cultural-stewardship'],
    skills: ['Servant Leadership', 'Community Governance', 'Conflict Resolution', 'Strategic Planning'],
    icon: Users,
    color: 'text-blue-600',
    currentEnrollments: 89,
    completionRate: 65
  },
  {
    id: 'digital-ecosystem-mastery',
    title: 'Digital Ecosystem Mastery',
    titleXhosa: 'UbuNgcaphephe be-Dijithali',
    level: 'master',
    category: 'technical',
    description: 'Master the complete Salatiso digital ecosystem and its integration with Ubuntu principles.',
    requirements: [
      'All foundation certifications',
      'System architecture understanding',
      'Integration project completion',
      'Mentorship certification'
    ],
    duration: '12 weeks',
    prerequisites: ['ubuntu-leadership', 'business-operations'],
    skills: ['System Architecture', 'Integration Design', 'Technical Leadership', 'Innovation Management'],
    icon: Shield,
    color: 'text-green-600',
    currentEnrollments: 34,
    completionRate: 52
  }
];

const CertificationSystem: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [userProgress, setUserProgress] = useState<CertificationProgress[]>([]);

  useEffect(() => {
    // Simulate loading user progress
    const mockProgress: CertificationProgress[] = [
      {
        certificationId: 'ubuntu-foundation',
        userId: 'current-user',
        progress: 100,
        completedModules: 8,
        totalModules: 8,
        timeSpent: 2400, // minutes
        lastActivity: '2025-10-05',
        status: 'certified'
      },
      {
        certificationId: 'cultural-stewardship',
        userId: 'current-user',
        progress: 75,
        completedModules: 6,
        totalModules: 8,
        timeSpent: 1800,
        lastActivity: '2025-10-07',
        status: 'in_progress'
      }
    ];
    setUserProgress(mockProgress);
  }, []);

  const filteredCertifications = certifications.filter(cert => {
    const categoryMatch = selectedCategory === 'all' || cert.category === selectedCategory;
    const levelMatch = selectedLevel === 'all' || cert.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  const getUserProgress = (certId: string) => {
    return userProgress.find(p => p.certificationId === certId);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'foundation': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'master': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ubuntu': return UbuntuIcon;
      case 'leadership': return Users;
      case 'technical': return Shield;
      case 'cultural': return Heart;
      case 'business': return Target;
      default: return BookOpen;
    }
  };

  const categories = [
    { id: 'all', name: 'All Categories', count: certifications.length },
    { id: 'ubuntu', name: 'Ubuntu Philosophy', count: certifications.filter(c => c.category === 'ubuntu').length },
    { id: 'leadership', name: 'Leadership', count: certifications.filter(c => c.category === 'leadership').length },
    { id: 'technical', name: 'Technical', count: certifications.filter(c => c.category === 'technical').length },
    { id: 'cultural', name: 'Cultural', count: certifications.filter(c => c.category === 'cultural').length },
    { id: 'business', name: 'Business', count: certifications.filter(c => c.category === 'business').length }
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'foundation', name: 'Foundation' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
    { id: 'master', name: 'Master' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Award className="w-8 h-8 text-ubuntu-purple mr-3" />
          <div>
            <h2 className="text-xl font-bold text-ubuntu-purple">Certification Center</h2>
            <p className="text-gray-600 text-sm">
              Earn Ubuntu-aligned certifications and advance your leadership journey
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-ubuntu-purple">2</div>
          <div className="text-sm text-gray-600">Active Certifications</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-ubuntu-purple text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Level</h3>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedLevel === level.id
                    ? 'bg-ubuntu-purple text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredCertifications.map((cert) => {
          const progress = getUserProgress(cert.id);
          const CategoryIcon = getCategoryIcon(cert.category);

          return (
            <div key={cert.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <cert.icon className={`w-8 h-8 ${cert.color} mr-3`} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.title}</h3>
                    <p className="text-sm text-ubuntu-purple">{cert.titleXhosa}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(cert.level)}`}>
                    {cert.level}
                  </span>
                  <CategoryIcon className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{cert.description}</p>

              {/* Progress Bar */}
              {progress && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{progress.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-ubuntu-purple h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {progress.completedModules}/{progress.totalModules} modules • {Math.round(progress.timeSpent / 60)}h spent
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {cert.requirements.slice(0, 3).map((req, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                  {cert.requirements.length > 3 && (
                    <li className="text-xs text-gray-500">+{cert.requirements.length - 3} more requirements</li>
                  )}
                </ul>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Skills You&apos;ll Gain:</h4>
                <div className="flex flex-wrap gap-1">
                  {cert.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs bg-ubuntu-purple/10 text-ubuntu-purple rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {cert.skills.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      +{cert.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {cert.duration}
                </div>
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {cert.currentEnrollments} enrolled
                </div>
                <div className="flex items-center">
                  <Trophy className="w-3 h-3 mr-1" />
                  {cert.completionRate}% completion
                </div>
              </div>

              {/* Action Button */}
              <button
                className={`w-full px-4 py-2 rounded-lg transition-colors ${
                  progress?.status === 'certified'
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : progress?.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-ubuntu-purple text-white hover:bg-ubuntu-gold'
                }`}
                disabled={progress?.status === 'certified'}
              >
                {progress?.status === 'certified' ? (
                  <div className="flex items-center justify-center">
                    <Award className="w-4 h-4 mr-2" />
                    Certified
                  </div>
                ) : progress?.status === 'in_progress' ? (
                  <div className="flex items-center justify-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Continue Learning
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Star className="w-4 h-4 mr-2" />
                    Start Certification
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Certification Pathways */}
      <div className="mt-8 bg-gradient-to-r from-ubuntu-purple to-ubuntu-gold rounded-lg p-6 text-white">
        <h3 className="text-lg font-bold mb-4">Ubuntu Certification Pathways</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold">1</span>
            </div>
            <h4 className="font-semibold mb-1">Foundation</h4>
            <p className="text-sm opacity-90">Ubuntu basics & community engagement</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold">2</span>
            </div>
            <h4 className="font-semibold mb-1">Cultural</h4>
            <p className="text-sm opacity-90">Heritage preservation & knowledge transfer</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold">3</span>
            </div>
            <h4 className="font-semibold mb-1">Leadership</h4>
            <p className="text-sm opacity-90">Servant leadership & community governance</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold">4</span>
            </div>
            <h4 className="font-semibold mb-1">Mastery</h4>
            <p className="text-sm opacity-90">System integration & innovation leadership</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationSystem;