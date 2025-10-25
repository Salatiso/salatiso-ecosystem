import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users, Target, TrendingUp, Award } from 'lucide-react';
import { UbuntuIcon, FamilyIcon, RondavelIcon, JourneyIcon } from '../icons';

interface TeamMember {
  id: string;
  name: string;
  title: string;
  responsibilities: string[];
  reportsTo?: string;
  level: number;
}

const teamMembers: TeamMember[] = [
  {
    id: 'notemba',
    name: 'Nozukile Cynthia Mdeni (Notemba)',
    title: 'Family Matriarch & Trust Beneficiary',
    responsibilities: [
      'Family Guidance & Ubuntu Wisdom',
      'Trust Administration',
      'Strategic Family Governance',
      'Next Generation Mentoring'
    ],
    level: 0
  },
  {
    id: 'visa',
    name: 'Visa Mdeni',
    title: 'CEO & Front Face',
    responsibilities: [
      'Overall Company Activities Promoter',
      'Brand Ambassador',
      'Strategic Leadership'
    ],
    reportsTo: 'notemba',
    level: 1
  },
  {
    id: 'salatiso',
    name: 'Salatiso Lonwabo Mdeni',
    title: 'Founder & Visionary Leader',
    responsibilities: [
      'Strategic Direction',
      'Ecosystem Development',
      'Technology Innovation',
      'IP Governance'
    ],
    reportsTo: 'visa',
    level: 2
  },
  {
    id: 'kwakho',
    name: 'Kwakho Mdeni',
    title: 'Multi-Role Coordinator',
    responsibilities: [
      'Professional Profile Management (Resume Coordinator)',
      'Career Documentation & Brand Storytelling',
      'Curriculum Development (Sazi Life Academy)',
      'Testing & Assessment',
      'Educational Program Management'
    ],
    reportsTo: 'visa',
    level: 2
  },
  {
    id: 'tina',
    name: 'Tina Mdeni',
    title: 'Online Marketing & Promotion Lead',
    responsibilities: [
      'Digital Marketing Campaigns',
      'Social Media Management',
      'Promotional Content Creation'
    ],
    reportsTo: 'visa',
    level: 2
  },
  {
    id: 'solo',
    name: 'Solonwabo (Solo) Mdeni',
    title: 'AI Media Creator & Family Profile Developer',
    responsibilities: [
      'AI-Generated Content Production',
      'Promo Videos & Screen Savers',
      'Advertising Materials',
      'Immersive Family Profiles'
    ],
    reportsTo: 'visa',
    level: 2
  }
];

const BusinessOrganogram: React.FC = () => {
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set(['visa']));

  const toggleExpansion = (memberId: string) => {
    const newExpanded = new Set(expandedMembers);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedMembers(newExpanded);
  };

  const getMembersByLevel = (level: number) => {
    return teamMembers.filter(member => member.level === level);
  };

  const getDirectReports = (managerId: string) => {
    return teamMembers.filter(member => member.reportsTo === managerId);
  };

  const renderMemberCard = (member: TeamMember, isExpanded: boolean = false) => {
    const directReports = getDirectReports(member.id);
    const hasReports = directReports.length > 0;

    return (
      <div key={member.id} className="relative">
        {/* Connection line to parent (except for CEO) */}
        {member.level > 0 && (
          <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-gradient-to-t from-ubuntu-purple to-transparent transform -translate-x-1/2" />
        )}

        <div className="bg-white rounded-lg shadow-lg border-2 border-ubuntu-purple/20 hover:border-ubuntu-gold/50 transition-all duration-300 p-6 min-w-[280px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-ubuntu-purple to-ubuntu-gold rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                <p className="text-ubuntu-purple font-medium">{member.title}</p>
              </div>
            </div>
            {hasReports && (
              <button
                onClick={() => toggleExpansion(member.id)}
                className="p-2 hover:bg-ubuntu-purple/10 rounded-full transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-ubuntu-purple" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-ubuntu-purple" />
                )}
              </button>
            )}
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 flex items-center">
              <Target className="w-4 h-4 mr-2 text-ubuntu-gold" />
              Key Responsibilities
            </h4>
            <ul className="space-y-1">
              {member.responsibilities.map((responsibility, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="w-1.5 h-1.5 bg-ubuntu-gold rounded-full mt-2 mr-3 flex-shrink-0" />
                  {responsibility}
                </li>
              ))}
            </ul>
          </div>

          {/* Expand indicator */}
          {hasReports && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center text-sm text-ubuntu-purple">
                <span>{directReports.length} team member{directReports.length !== 1 ? 's' : ''}</span>
                {!isExpanded && (
                  <ChevronRight className="w-4 h-4 ml-1" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Connection line to reports */}
        {hasReports && isExpanded && (
          <div className="absolute -bottom-4 left-1/2 w-0.5 h-4 bg-gradient-to-b from-ubuntu-purple to-transparent transform -translate-x-1/2" />
        )}
      </div>
    );
  };

  const renderLevel = (level: number) => {
    const members = getMembersByLevel(level);
    if (members.length === 0) return null;

    return (
      <div key={level} className="flex flex-wrap justify-center gap-8 mb-12">
        {members.map(member => {
          const isExpanded = expandedMembers.has(member.id);
          const directReports = getDirectReports(member.id);

          return (
            <div key={member.id} className="flex flex-col items-center">
              {renderMemberCard(member, isExpanded)}

              {/* Render direct reports */}
              {isExpanded && directReports.length > 0 && (
                <div className="mt-8 flex flex-wrap justify-center gap-6">
                  {directReports.map(report => (
                    <div key={report.id} className="relative">
                      {/* Connection line */}
                      <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-gradient-to-t from-ubuntu-purple to-transparent transform -translate-x-1/2" />
                      {renderMemberCard(report)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ubuntu-purple/5 via-white to-ubuntu-gold/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <UbuntuIcon className="w-12 h-12 text-ubuntu-purple mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">MNI Business Organogram</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our vibrant, family-first organizational structure embodies Ubuntu principles with interconnected roles,
            clear reporting lines, and collaborative energy that creates a holistic business entity.
          </p>
        </div>

        {/* Ubuntu Philosophy Banner */}
        <div className="bg-gradient-to-r from-ubuntu-purple to-ubuntu-gold rounded-lg p-6 mb-12 text-white">
          <div className="flex items-center justify-center mb-4">
            <FamilyIcon className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">Ubuntu Business Philosophy</h2>
          </div>
          <p className="text-center text-lg">
            &ldquo;I am because we are&rdquo; - Our success comes from collective growth,
            mutual support, and the understanding that each role contributes to our shared prosperity.
          </p>
        </div>

        {/* Organogram */}
        <div className="space-y-8">
          {renderLevel(0)} {/* CEO */}
          {renderLevel(1)} {/* Core Team */}
        </div>

        {/* Footer Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-ubuntu-purple/20">
            <Users className="w-8 h-8 text-ubuntu-purple mx-auto mb-3" />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Family-First Team</h3>
            <p className="text-gray-600">6 dedicated family members working together</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-ubuntu-gold/20">
            <TrendingUp className="w-8 h-8 text-ubuntu-gold mx-auto mb-3" />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Growth Focused</h3>
            <p className="text-gray-600">Continuous development and career progression</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-ubuntu-purple/20">
            <Award className="w-8 h-8 text-ubuntu-purple mx-auto mb-3" />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Ubuntu Values</h3>
            <p className="text-gray-600">Interconnected success through mutual support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessOrganogram;