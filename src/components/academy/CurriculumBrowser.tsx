import React, { useState } from 'react';
import { Search, Filter, BookOpen, Clock, Users, Star, ChevronRight, Play, CheckCircle } from 'lucide-react';
import { UbuntuIcon, JourneyIcon, MilestoneIcon } from '../icons';
import { AccessibleInput, AccessibleSelect } from '@/components/accessibility';

interface Module {
  id: string;
  title: string;
  description: string;
  level: number;
  duration: string;
  enrolled: number;
  rating: number;
  completed: boolean;
  category: string;
  skills: string[];
}

const modules: Module[] = [
  {
    id: 'personal-safety',
    title: 'Personal Safety & LifeKey OS',
    description: 'Master personal safety practices and digital identity management',
    level: 1,
    duration: '2 hours',
    enrolled: 24,
    rating: 4.8,
    completed: true,
    category: 'Safety',
    skills: ['Digital Identity', 'Personal Security', 'LifeKey OS']
  },
  {
    id: 'lifecv-literacy',
    title: 'LifeCV Literacy & Reflection',
    description: 'Learn to capture daily reflections and build personal evidence',
    level: 1,
    duration: '3 hours',
    enrolled: 18,
    rating: 4.9,
    completed: false,
    category: 'Personal Development',
    skills: ['Reflection', 'LifeCV', 'Self-Assessment']
  },
  {
    id: 'household-sync',
    title: 'LifeSync Household Management',
    description: 'Create and manage household duty rosters and shared resources',
    level: 2,
    duration: '4 hours',
    enrolled: 12,
    rating: 4.7,
    completed: false,
    category: 'Household',
    skills: ['Household Management', 'LifeSync', 'Resource Planning']
  },
  {
    id: 'transport-operations',
    title: 'Safe Transport & Parcel Delivery',
    description: 'Master safe transport operations and parcel custody transfers',
    level: 3,
    duration: '6 hours',
    enrolled: 8,
    rating: 4.6,
    completed: false,
    category: 'Operations',
    skills: ['Transport Safety', 'Parcel Delivery', 'Incident Response']
  },
  {
    id: 'community-governance',
    title: 'Community Governance & Validation',
    description: 'Coordinate multi-household governance and incident response',
    level: 4,
    duration: '8 hours',
    enrolled: 5,
    rating: 4.8,
    completed: false,
    category: 'Governance',
    skills: ['Community Governance', 'Validation', 'Incident Management']
  },
  {
    id: 'api-integration',
    title: 'API Integration & Advanced Governance',
    description: 'Configure LifeCV & Trust APIs for partner integrations',
    level: 5,
    duration: '10 hours',
    enrolled: 2,
    rating: 5.0,
    completed: false,
    category: 'Advanced',
    skills: ['API Integration', 'Advanced Governance', 'System Administration']
  }
];

const categories = ['All', 'Safety', 'Personal Development', 'Household', 'Operations', 'Governance', 'Advanced'];

const CurriculumBrowser: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || module.category === selectedCategory;
    const matchesLevel = selectedLevel === null || module.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-emerald-100 text-emerald-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-orange-100 text-orange-800';
      case 4: return 'bg-sky-100 text-sky-800';
      case 5: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ubuntu-purple/5 via-white to-ubuntu-gold/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="w-12 h-12 text-ubuntu-purple mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">Curriculum Browser</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive learning modules designed for family growth and Ubuntu wisdom.
            Each module builds practical skills while fostering community collaboration.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <AccessibleInput
                label="Search modules"
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <AccessibleSelect
                label="Filter by category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={categories.map(category => ({
                  value: category,
                  label: category
                }))}
                className="pl-10"
              />
            </div>

            {/* Level Filter */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    selectedLevel === level
                      ? 'bg-ubuntu-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Level {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing {filteredModules.length} of {modules.length} modules
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {selectedLevel && ` at Level ${selectedLevel}`}
          </p>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <div
              key={module.id}
              className="bg-white rounded-lg shadow-lg border-2 border-ubuntu-purple/20 hover:border-ubuntu-gold/50 transition-all duration-300 overflow-hidden"
            >
              {/* Module Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(module.level)}`}>
                        Level {module.level}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                        {module.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                    <p className="text-gray-600 text-sm">{module.description}</p>
                  </div>
                  {module.completed && (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  )}
                </div>

                {/* Module Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {module.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {module.enrolled} enrolled
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                    {module.rating}
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {module.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-ubuntu-purple/10 text-ubuntu-purple rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-ubuntu-purple to-ubuntu-gold text-white rounded-lg hover:shadow-lg transition-all duration-300">
                  {module.completed ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Review Module
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start Learning
                    </>
                  )}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No modules found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Ubuntu Wisdom Integration */}
        <div className="mt-12 bg-gradient-to-r from-ubuntu-purple/10 to-ubuntu-gold/10 rounded-lg p-8">
          <div className="text-center">
            <UbuntuIcon className="w-8 h-8 text-ubuntu-purple mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ubuntu Learning Wisdom</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              &ldquo;Knowledge is like a garden: if it is not cultivated, it cannot be harvested.&rdquo;
              Each module is designed not just to teach skills, but to cultivate wisdom that serves both
              individual growth and community prosperity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumBrowser;