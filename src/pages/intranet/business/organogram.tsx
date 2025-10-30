import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { Users, FileDown, Edit2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const BusinessOrganogramPage: NextPage = () => {
  const organizationStructure = {
    founder: {
      name: 'Salatiso (Founder)',
      email: 'spiceinc@gmail.com',
      role: 'Founder & Visionary',
      responsibilities: ['Vision', 'Governance', 'IP Strategy', 'Oversight'],
      avatar: 'SA',
      color: 'bg-red-100 text-red-800'
    },
    motherSteward: {
      name: 'Tina (Mother & Family Steward)',
      email: 'tina@salatiso.com',
      role: 'Family Steward & Finance Lead',
      responsibilities: ['Family Governance', 'Finance Oversight', 'Education Liaison', 'Branding'],
      avatar: 'TM',
      color: 'bg-green-100 text-green-800',
      reports: ['Finance Division', 'Family Office', 'Education Programs']
    },
    businessLeads: [
      {
        name: 'Visa (Parent Company Lead)',
        email: 'visasande@gmail.com',
        role: 'Chief Marketing & Business Development',
        responsibilities: ['Marketing', 'Subsidiary Leadership', 'Global Expansion', 'Strategic Partnerships'],
        avatar: 'VL',
        color: 'bg-blue-100 text-blue-800',
        reportsTo: 'Salatiso',
        team: ['Marketing Team', 'Business Development']
      },
      {
        name: 'Kwakho (Community Lead)',
        email: 'kwakhomdeni@gmail.com',
        role: 'Community Engagement Director',
        responsibilities: ['Community Engagement', 'Support Services', 'Partnerships', 'Social Impact'],
        avatar: 'KD',
        color: 'bg-purple-100 text-purple-800',
        reportsTo: 'Salatiso',
        team: ['Community Team', 'Support Services']
      },
      {
        name: 'Solo (CTO Path / Tech Lead)',
        email: 'milandep.mdeni@gmail.com',
        role: 'Chief Technology Officer',
        responsibilities: ['Development', 'Technology Strategy', 'AI & Innovation', 'Digital Transformation'],
        avatar: 'SL',
        color: 'bg-yellow-100 text-yellow-800',
        reportsTo: 'Salatiso',
        team: ['Development Team', 'Innovation Lab']
      }
    ],
    departments: [
      {
        name: 'Finance & Treasury',
        lead: 'Tina (Mother)',
        members: 8,
        description: 'Financial planning, accounting, dividend management, and treasury operations.',
        icon: '💰'
      },
      {
        name: 'Operations & Development',
        lead: 'Solo',
        members: 12,
        description: 'Project management, property development, IT infrastructure, and operations.',
        icon: '🏗️'
      },
      {
        name: 'Marketing & Business',
        lead: 'Visa',
        members: 10,
        description: 'Marketing strategy, brand management, business development, and partnerships.',
        icon: '📈'
      },
      {
        name: 'Community & Support',
        lead: 'Kwakho',
        members: 8,
        description: 'Community engagement, support services, social impact initiatives, and HR.',
        icon: '👥'
      },
      {
        name: 'Family Office',
        lead: 'Tina (Mother)',
        members: 6,
        description: 'Family governance, education programs, legacy planning, and succession.',
        icon: '👨‍👩‍👧‍👦'
      },
      {
        name: 'Education & Development',
        lead: 'Tina (Mother)',
        members: 5,
        description: 'Career paths, training programs, skills development, and knowledge sharing.',
        icon: '🎓'
      }
    ],
    nextGeneration: [
      { name: 'Milamdeni', role: 'Tech Development', focus: 'CTO Career Path' },
      { name: 'Azora Mdeni', role: 'Community & Legal', focus: 'Legal/Governance Path' },
      { name: 'Sazi Sisimdeni', role: 'Marketing & Community', focus: 'Marketing/Community Path' },
      { name: 'Mdenit21', role: 'Finance & Operations', focus: 'Finance/Operations Path' }
    ]
  };

  return (
    <>
      <Head>
        <title>Business Organogram - MNI Intranet</title>
        <meta name="description" content="Organizational structure and hierarchy" />
      </Head>

      <IntranetLayout title="Business Organogram - MNI Intranet">
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="bg-gradient-to-r from-ubuntu-purple to-ubuntu-blue rounded-lg shadow-sm border border-ubuntu-warm-200 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              🏢 Business Organogram
            </h1>
            <p className="text-ubuntu-warm-100">
              Organizational structure and reporting hierarchy for Mlandeli-Notemba Investments
            </p>
          </motion.div>

          {/* Executive Leadership */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-ubuntu-warm-900 mb-6">👑 Executive Leadership</h2>
            
            {/* Founder */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-ubuntu-warm-600 uppercase mb-4">Founder & Visionary</h3>
              <div className={`${organizationStructure.founder.color} rounded-lg p-6 border-l-4 border-red-400`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {organizationStructure.founder.avatar}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-red-900">{organizationStructure.founder.name}</h4>
                      <p className="text-red-800 font-semibold">{organizationStructure.founder.role}</p>
                      <p className="text-sm text-red-700">{organizationStructure.founder.email}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {organizationStructure.founder.responsibilities.map((resp, idx) => (
                          <span key={idx} className="text-xs bg-red-200 text-red-900 px-2 py-1 rounded">
                            {resp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mother/Family Steward */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-ubuntu-warm-600 uppercase mb-4">Family Steward & Finance Lead</h3>
              <div className={`${organizationStructure.motherSteward.color} rounded-lg p-6 border-l-4 border-green-400`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {organizationStructure.motherSteward.avatar}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-green-900">{organizationStructure.motherSteward.name}</h4>
                      <p className="text-green-800 font-semibold">{organizationStructure.motherSteward.role}</p>
                      <p className="text-sm text-green-700">{organizationStructure.motherSteward.email}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {organizationStructure.motherSteward.responsibilities.map((resp, idx) => (
                          <span key={idx} className="text-xs bg-green-200 text-green-900 px-2 py-1 rounded">
                            {resp}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 text-sm">
                        <p className="font-semibold text-green-900 mb-2">Oversees:</p>
                        <div className="flex flex-wrap gap-2">
                          {organizationStructure.motherSteward.reports.map((dept, idx) => (
                            <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Leaders */}
            <h3 className="text-sm font-semibold text-ubuntu-warm-600 uppercase mb-4">Business Unit Leaders</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {organizationStructure.businessLeads.map((leader, idx) => (
                <motion.div 
                  key={leader.email}
                  className={`${leader.color} rounded-lg p-5 border-l-4`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={`w-12 h-12 ${leader.color.split(' ')[0].replace('bg-', 'bg-')} rounded-full flex items-center justify-center text-white text-sm font-bold`}
                      style={{ backgroundColor: leader.color.includes('blue') ? '#3b82f6' : leader.color.includes('purple') ? '#a855f7' : '#eab308' }}>
                      {leader.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{leader.name}</h4>
                      <p className="text-xs font-semibold opacity-80">{leader.role}</p>
                      <p className="text-xs opacity-70">{leader.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold opacity-80 mb-1">Responsibilities:</p>
                      <div className="flex flex-wrap gap-1">
                        {leader.responsibilities.map((resp, rIdx) => (
                          <span key={rIdx} className="text-xs bg-opacity-50 bg-white px-2 py-0.5 rounded">
                            {resp}
                          </span>
                        ))}
                      </div>
                    </div>
                    {leader.team && (
                      <div>
                        <p className="text-xs font-semibold opacity-80 mb-1">Team:</p>
                        <div className="flex flex-wrap gap-1">
                          {leader.team.map((t, tIdx) => (
                            <span key={tIdx} className="text-xs bg-opacity-30 bg-gray-600 px-2 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Departments */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-ubuntu-warm-900 mb-6">🏛️ Departments & Functions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizationStructure.departments.map((dept, idx) => (
                <motion.div 
                  key={dept.name}
                  className="border border-ubuntu-warm-300 rounded-lg p-5 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-2xl mb-2">{dept.icon}</p>
                      <h3 className="font-bold text-ubuntu-warm-900">{dept.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-ubuntu-warm-600 mb-3">{dept.description}</p>
                  <div className="space-y-2 border-t border-ubuntu-warm-200 pt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ubuntu-warm-600">Lead:</span>
                      <span className="font-semibold text-ubuntu-warm-900">{dept.lead}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ubuntu-warm-600">Members:</span>
                      <span className="font-semibold text-ubuntu-warm-900">{dept.members}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Next Generation */}
          <motion.div 
            className="bg-gradient-to-r from-ubuntu-warm-50 to-ubuntu-warm-100 rounded-lg shadow-sm border border-ubuntu-warm-300 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-ubuntu-warm-900 mb-6">🚀 Next Generation Leadership Pipeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {organizationStructure.nextGeneration.map((member, idx) => (
                <motion.div 
                  key={member.name}
                  className="bg-white rounded-lg p-4 border border-ubuntu-warm-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + idx * 0.05 }}
                >
                  <div className="w-12 h-12 bg-ubuntu-purple rounded-full flex items-center justify-center text-white font-bold mb-3 mx-auto">
                    {member.name.split(' ')[0].substring(0, 1)}
                  </div>
                  <h4 className="font-bold text-ubuntu-warm-900 text-center mb-1">{member.name}</h4>
                  <p className="text-xs text-ubuntu-warm-600 text-center mb-2">{member.role}</p>
                  <div className="bg-ubuntu-purple/10 rounded p-2 text-center">
                    <p className="text-xs font-semibold text-ubuntu-purple">{member.focus}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reporting Structure */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-ubuntu-warm-900 mb-6">📊 Reporting Structure</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 pb-4 border-b border-ubuntu-warm-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-800">SA</div>
                  <p className="text-xs mt-1 font-semibold">Salatiso</p>
                </div>
                <ArrowRight className="w-6 h-6 text-ubuntu-warm-400" />
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-800 text-sm mx-auto">TM</div>
                    <p className="text-xs mt-1">Tina</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-800 text-sm mx-auto">VL</div>
                    <p className="text-xs mt-1">Visa</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-800 text-sm mx-auto">KD</div>
                    <p className="text-xs mt-1">Kwakho</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-ubuntu-warm-600">
                <strong>Reporting Lines:</strong> Each division leader reports directly to Salatiso (Founder). 
                Tina (Mother/Family Steward) maintains independent authority over Family Office, Finance, and Education divisions 
                while coordinating with other leaders on cross-functional initiatives.
              </p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-ubuntu-warm-900 mb-6">⚙️ Organogram Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="px-6 py-3 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-purple/90 transition-colors flex items-center justify-center space-x-2">
                <FileDown className="w-5 h-5" />
                <span>Export Organogram</span>
              </button>
              <button className="px-6 py-3 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green/90 transition-colors flex items-center justify-center space-x-2">
                <Edit2 className="w-5 h-5" />
                <span>Update Structure</span>
              </button>
              <button className="px-6 py-3 bg-ubuntu-blue text-white rounded-lg hover:bg-ubuntu-blue/90 transition-colors flex items-center justify-center space-x-2">
                <Users className="w-5 h-5" />
                <span>View Team Details</span>
              </button>
            </div>
          </motion.div>
        </div>
      </IntranetLayout>
    </>
  );
};

export default BusinessOrganogramPage;