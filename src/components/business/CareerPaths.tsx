import React, { useState } from 'react';
import { ChevronDown, ChevronRight, GraduationCap, Briefcase, Award, BookOpen, Users, Target } from 'lucide-react';
import { UbuntuIcon, JourneyIcon, MilestoneIcon, RondavelIcon } from '../icons';

interface CareerPath {
  id: string;
  name: string;
  title: string;
  careerPath: string;
  currentRole: string;
  responsibilities: string[];
  deliverables: string[];
  trainingPrerequisites: string[];
  hrRequirements: string[];
}

const careerPaths: CareerPath[] = [
  {
    id: 'visa',
    name: 'Visa Mdeni',
    title: 'CEO & Front Face',
    careerPath: 'Professional Development → Career Documentation Specialist',
    currentRole: 'Resume Updates Coordinator (with Solo\'s assistance)',
    responsibilities: [
      'Manage professional profile updates',
      'Coordinate with Solo for content enhancement',
      'Ensure accurate representation of skills and achievements',
      'Contribute to family brand storytelling'
    ],
    deliverables: [
      'Updated resume documents',
      'Professional profile summaries',
      'Career progression narratives',
      'Brand alignment content'
    ],
    trainingPrerequisites: [
      'Resume writing and career counseling',
      'Professional branding workshops',
      'Content creation basics',
      'Ubuntu storytelling techniques'
    ],
    hrRequirements: [
      'Access to professional development tools',
      'Career coaching sessions',
      'Portfolio management resources',
      'Networking opportunities'
    ]
  },
  {
    id: 'kwakho',
    name: 'Kwakho Mdeni',
    title: 'Sazi Life Academy Coordinator',
    careerPath: 'Education Enthusiast → Curriculum Developer → Academy Coordinator',
    currentRole: 'Educational Program Leadership',
    responsibilities: [
      'Oversee curriculum development for Sazi Life Academy',
      'Manage testing and assessment processes',
      'Ensure educational quality and Ubuntu integration',
      'Coordinate with family members for content contributions'
    ],
    deliverables: [
      'Curriculum documentation',
      'Assessment frameworks',
      'Student progress reports',
      'Educational impact metrics'
    ],
    trainingPrerequisites: [
      'Educational leadership programs',
      'Curriculum design workshops',
      'Assessment methodology training',
      'Ubuntu educational applications'
    ],
    hrRequirements: [
      'Educational resource access',
      'Professional development in pedagogy',
      'Collaboration tools for curriculum work',
      'Student management systems'
    ]
  },
  {
    id: 'tina',
    name: 'Tina Mdeni',
    title: 'Online Marketing & Promotion Lead',
    careerPath: 'Digital Enthusiast → Marketing Specialist → Online Promotion Lead',
    currentRole: 'Digital Marketing Coordinator',
    responsibilities: [
      'Develop and execute online marketing campaigns',
      'Manage social media presence',
      'Create promotional content aligned with Ubuntu values',
      'Analyze campaign effectiveness and ROI'
    ],
    deliverables: [
      'Marketing campaign reports',
      'Social media content calendars',
      'Promotional material designs',
      'Engagement analytics'
    ],
    trainingPrerequisites: [
      'Digital marketing certifications',
      'Social media management training',
      'Content creation workshops',
      'Analytics and reporting skills'
    ],
    hrRequirements: [
      'Marketing tool subscriptions',
      'Creative software access',
      'Campaign budget management',
      'Performance tracking systems'
    ]
  },
  {
    id: 'solo',
    name: 'Lukhanyo Sazi Mkosana (Solo)',
    title: 'AI Media Creator & Family Profile Developer',
    careerPath: 'Student → Homeschooler → AI Content Creator → Media Specialist',
    currentRole: 'AI Media Production & Family Documentation',
    responsibilities: [
      'Create AI-generated promotional videos',
      'Develop screensavers for computers and phones (portrait/landscape)',
      'Produce advertising materials',
      'Build immersive holistic family profiles (starting with mother)'
    ],
    deliverables: [
      'AI-generated media assets',
      'Interactive family profile documents',
      'Screen saver packages',
      'Promotional content libraries'
    ],
    trainingPrerequisites: [
      'AI tool proficiency (Midjourney, ChatGPT, Canva AI)',
      'Video production basics',
      'HTML/CSS for interactive profiles',
      'Ubuntu content integration'
    ],
    hrRequirements: [
      'AI tool subscriptions and training',
      'Creative software licenses',
      'Hardware for media production',
      'Portfolio development support'
    ]
  }
];

const CareerPaths: React.FC = () => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const toggleExpansion = (pathId: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(pathId)) {
      newExpanded.delete(pathId);
    } else {
      newExpanded.add(pathId);
    }
    setExpandedPaths(newExpanded);
  };

  const renderCareerCard = (career: CareerPath) => {
    const isExpanded = expandedPaths.has(career.id);

    return (
      <div key={career.id} className="bg-white rounded-lg shadow-lg border-2 border-ubuntu-purple/20 hover:border-ubuntu-gold/50 transition-all duration-300 overflow-hidden">
        {/* Header */}
        <div
          className="p-6 cursor-pointer hover:bg-ubuntu-purple/5 transition-colors"
          onClick={() => toggleExpansion(career.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-ubuntu-purple to-ubuntu-gold rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{career.name}</h3>
                <p className="text-lg text-ubuntu-purple font-medium">{career.title}</p>
                <p className="text-sm text-gray-600 mt-1">{career.currentRole}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-4">
                <div className="flex items-center text-sm text-gray-500">
                  <JourneyIcon className="w-4 h-4 mr-1" />
                  Career Path
                </div>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-6 h-6 text-ubuntu-purple" />
              ) : (
                <ChevronRight className="w-6 h-6 text-ubuntu-purple" />
              )}
            </div>
          </div>

          {/* Career Path Summary */}
          <div className="mt-4 p-3 bg-ubuntu-purple/10 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Career Journey:</span> {career.careerPath}
            </p>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Responsibilities */}
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-ubuntu-gold" />
                  Responsibilities
                </h4>
                <ul className="space-y-2">
                  {career.responsibilities.map((responsibility, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-ubuntu-gold rounded-full mt-2 mr-3 flex-shrink-0" />
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deliverables */}
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-ubuntu-purple" />
                  Key Deliverables
                </h4>
                <ul className="space-y-2">
                  {career.deliverables.map((deliverable, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-ubuntu-purple rounded-full mt-2 mr-3 flex-shrink-0" />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Training Prerequisites */}
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-ubuntu-gold" />
                  Training Prerequisites
                </h4>
                <ul className="space-y-2">
                  {career.trainingPrerequisites.map((prerequisite, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-ubuntu-gold rounded-full mt-2 mr-3 flex-shrink-0" />
                      {prerequisite}
                    </li>
                  ))}
                </ul>
              </div>

              {/* HR Requirements */}
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-ubuntu-purple" />
                  HR Requirements
                </h4>
                <ul className="space-y-2">
                  {career.hrRequirements.map((requirement, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-ubuntu-purple rounded-full mt-2 mr-3 flex-shrink-0" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ubuntu-purple/5 via-white to-ubuntu-gold/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <JourneyIcon className="w-12 h-12 text-ubuntu-purple mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">Career Development Paths</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Our career development framework emphasizes mentorship, skill building, performance tracking,
            and growth opportunities within our Ubuntu philosophy of collective success.
          </p>
        </div>

        {/* Ubuntu Philosophy Banner */}
        <div className="bg-gradient-to-r from-ubuntu-purple to-ubuntu-gold rounded-lg p-6 mb-12 text-white">
          <div className="flex items-center justify-center mb-4">
            <RondavelIcon className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">Ubuntu Career Philosophy</h2>
          </div>
          <p className="text-center text-lg">
            &ldquo;My success is your success&rdquo; - We grow together through cross-family knowledge sharing,
            continuous learning, and mutual support in our professional journeys.
          </p>
        </div>

        {/* Career Framework Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-ubuntu-purple/20">
            <Users className="w-8 h-8 text-ubuntu-purple mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Mentorship</h3>
            <p className="text-sm text-gray-600">Cross-family knowledge sharing</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-ubuntu-gold/20">
            <BookOpen className="w-8 h-8 text-ubuntu-gold mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Skill Building</h3>
            <p className="text-sm text-gray-600">Ongoing training and certification</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-ubuntu-purple/20">
            <Target className="w-8 h-8 text-ubuntu-purple mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Performance</h3>
            <p className="text-sm text-gray-600">Regular reviews and feedback</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-ubuntu-gold/20">
            <Award className="w-8 h-8 text-ubuntu-gold mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Growth</h3>
            <p className="text-sm text-gray-600">Role expansion opportunities</p>
          </div>
        </div>

        {/* Career Paths */}
        <div className="space-y-6">
          {careerPaths.map(career => renderCareerCard(career))}
        </div>

        {/* Integration Note */}
        <div className="mt-12 bg-gradient-to-r from-ubuntu-purple/10 to-ubuntu-gold/10 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">MNI Intranet Integration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div>
              <h4 className="font-semibold text-ubuntu-purple mb-2">Interactive Profiles</h4>
              <p className="text-sm text-gray-600">Customizable HTML documents for each role with progress tracking</p>
            </div>
            <div>
              <h4 className="font-semibold text-ubuntu-gold mb-2">Collaboration Tools</h4>
              <p className="text-sm text-gray-600">Shared workspaces for team coordination and resource access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPaths;