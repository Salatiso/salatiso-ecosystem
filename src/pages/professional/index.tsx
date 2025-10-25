import React, { useState } from 'react';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { motion } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Users,
  TrendingUp,
  Target,
  BookOpen,
  Calendar,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProfessionalProfile {
  id: string;
  name: string;
  title: string;
  experience: string;
  certifications: string[];
  skills: string[];
  currentProjects: string[];
}

const ProfessionalDevelopment: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profiles' | 'training' | 'certifications' | 'resources'>('profiles');

  const profiles: ProfessionalProfile[] = [
    {
      id: '1',
      name: 'Salatiso Lonwabo Mdeni',
      title: 'Software Developer & Ecosystem Architect',
      experience: '15+ years',
      certifications: [
        'AWS Certified Solutions Architect',
        'Cybersecurity Professional',
        'AI & Law (2023-2024)'
      ],
      skills: ['Full-Stack Development', 'System Architecture', 'AI Integration', 'Cloud Infrastructure'],
      currentProjects: ['Salatiso Ecosystem', 'Sonny Network', 'LifeCV Platform']
    },
    {
      id: '2',
      name: 'Visa Mdeni',
      title: 'Business Leadership & Global Marketing',
      experience: '18+ years',
      certifications: [
        'Digital Marketing Professional',
        'International Business Management'
      ],
      skills: ['Strategic Marketing', 'Global Expansion', 'Brand Development', 'Team Leadership'],
      currentProjects: ['Visa Subsidiary Expansion', 'International Market Entry', 'Brand Development']
    },
    {
      id: '3',
      name: 'Kwakho Mdeni',
      title: 'Professional Development & Education Coordinator',
      experience: '10+ years',
      certifications: [
        'Career Counseling Professional',
        'Educational Program Management'
      ],
      skills: ['Resume Writing', 'Career Development', 'Curriculum Design', 'Assessment Design'],
      currentProjects: ['Sazi Life Academy', 'Resume Coordination', 'Professional Profile Management']
    },
    {
      id: '4',
      name: 'Tina Mdeni',
      title: 'Digital Marketing & Content Strategy',
      experience: '8+ years',
      certifications: [
        'Google Digital Marketing Certification',
        'Social Media Marketing Expert'
      ],
      skills: ['Digital Campaigns', 'Social Media Strategy', 'Content Creation', 'Analytics'],
      currentProjects: ['Marketing Campaign Q4', 'Social Media Management', 'Brand Promotion']
    },
    {
      id: '5',
      name: 'Solonwabo (Solo) Mdeni',
      title: 'AI Media Creator & Content Producer',
      experience: '5+ years',
      certifications: [
        'AI Content Generation Specialist',
        'Video Production Professional'
      ],
      skills: ['AI Media Creation', 'Video Production', 'Graphics Design', 'Content Development'],
      currentProjects: ['AI Content Production', 'Family Profile Development', 'Promotional Videos']
    }
  ];

  const trainingPrograms = [
    {
      id: '1',
      title: 'Advanced AI Integration',
      description: 'Learn to integrate AI services into applications',
      duration: '6 weeks',
      level: 'Advanced'
    },
    {
      id: '2',
      title: 'Digital Marketing Mastery',
      description: 'Comprehensive digital marketing strategies',
      duration: '8 weeks',
      level: 'Intermediate'
    },
    {
      id: '3',
      title: 'Leadership Development',
      description: 'Building effective leadership skills',
      duration: '4 weeks',
      level: 'All Levels'
    },
    {
      id: '4',
      title: 'Project Management Excellence',
      description: 'Master project management methodologies',
      duration: '6 weeks',
      level: 'Intermediate'
    }
  ];

  return (
    <IntranetLayout>
      <Head>
        <title>Professional Development - MNI Ecosystem</title>
        <meta name="description" content="Professional profiles, training, and development resources" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <Briefcase className="h-10 w-10 text-indigo-600" />
            <span>Professional Development</span>
          </h1>
          <p className="text-lg text-gray-600">
            Building expertise, skills, and professional excellence across the family enterprise
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'profiles', name: 'Profiles', icon: Users },
              { id: 'training', name: 'Training', icon: GraduationCap },
              { id: 'certifications', name: 'Certifications', icon: Award },
              { id: 'resources', name: 'Resources', icon: BookOpen }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Profiles Tab */}
        {activeTab === 'profiles' && (
          <div className="space-y-6">
            {profiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                    <p className="text-indigo-600 font-medium">{profile.title}</p>
                    <p className="text-sm text-gray-600 mt-1">Experience: {profile.experience}</p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                    View Full Profile
                  </button>
                </div>

                {/* Certifications */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-indigo-600" />
                    Certifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.certifications.map((cert, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-indigo-600" />
                    Core Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Current Projects */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-indigo-600" />
                    Current Projects
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.currentProjects.map((project, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {project}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainingPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <GraduationCap className="h-10 w-10 text-indigo-600" />
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                    {program.level}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                <p className="text-gray-600 mb-4">{program.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{program.duration}</span>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                    Enroll
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <Award className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Family Certifications</h2>
              <p className="text-gray-600">
                Professional certifications earned by family members
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.flatMap(profile => 
                profile.certifications.map((cert, idx) => ({
                  cert,
                  owner: profile.name,
                  key: `${profile.id}-${idx}`
                }))
              ).map(item => (
                <div key={item.key} className="p-4 bg-gray-50 rounded-lg">
                  <Award className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">{item.cert}</h3>
                  <p className="text-sm text-gray-600">{item.owner}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <BookOpen className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Learning Resources</h3>
              <p className="text-gray-600 mb-4">
                Curated resources for professional development
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                  <span>Career Development Guides</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                  <span>Industry Best Practices</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                  <span>Skill Development Templates</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <Download className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Downloadable Tools</h3>
              <p className="text-gray-600 mb-4">
                Tools and templates for professional growth
              </p>
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mb-2">
                Download Resume Templates
              </button>
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mb-2">
                Download Career Planning Workbook
              </button>
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Download Skill Assessment Tools
              </button>
            </div>
          </div>
        )}
      </div>
    </IntranetLayout>
  );
};

export default ProfessionalDevelopment;
