import React from 'react';
import PublicLayout from '@/components/layouts/PublicLayout';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  GraduationCap, 
  Heart,
  Target,
  TrendingUp,
  Building2,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface EcosystemApp {
  id: string;
  name: string;
  category: 'business' | 'family' | 'education' | 'lifestyle';
  description: string;
  icon: React.ReactNode;
  status: 'live' | 'beta' | 'development' | 'planned';
  url?: string;
  features: string[];
}

const EcosystemPage: React.FC = () => {
  const ecosystemApps: EcosystemApp[] = [
    {
      id: 'bizhelp',
      name: 'BizHelp',
      category: 'business',
      description: 'Comprehensive business management platform for SMEs and entrepreneurs',
      icon: <Briefcase className="h-8 w-8" />,
      status: 'live',
      url: 'https://bizhelp.co.za',
      features: ['Business Planning', 'Financial Management', 'Compliance Tracking', 'Resource Library']
    },
    {
      id: 'hrhelp',
      name: 'HrHelp',
      category: 'business',
      description: 'Human resources management system for growing businesses',
      icon: <Users className="h-8 w-8" />,
      status: 'live',
      url: 'https://hrhelp.co.za',
      features: ['Employee Management', 'Payroll Processing', 'Performance Reviews', 'Compliance']
    },
    {
      id: 'pigeeback',
      name: 'PigeeBack',
      category: 'business',
      description: 'Smart logistics and transportation platform connecting communities',
      icon: <TrendingUp className="h-8 w-8" />,
      status: 'live',
      url: 'https://pigeeback.co.za',
      features: ['Route Optimization', 'Driver Matching', 'Community Transport', 'Safety Features']
    },
    {
      id: 'ekhaya',
      name: 'Ekhaya',
      category: 'lifestyle',
      description: 'Home and community connection platform',
      icon: <Heart className="h-8 w-8" />,
      status: 'live',
      url: 'https://ekhaya.co.za',
      features: ['Community Connect', 'Home Services', 'Local Networks', 'Ubuntu Integration']
    },
    {
      id: 'lifesync',
      name: 'LifeSync',
      category: 'lifestyle',
      description: 'Personal life management and synchronization platform',
      icon: <Target className="h-8 w-8" />,
      status: 'live',
      url: 'https://lifesync.co.za',
      features: ['Life Planning', 'Goal Tracking', 'Calendar Sync', 'Habit Management']
    },
    {
      id: 'family-value',
      name: 'Family Value',
      category: 'family',
      description: 'Family financial planning and value recognition system',
      icon: <Users className="h-8 w-8" />,
      status: 'live',
      url: 'https://familyvalue.co.za',
      features: ['Family Budgeting', 'Value Recognition', 'Financial Education', 'Wealth Planning']
    },
    {
      id: 'safetyhelp',
      name: 'SafetyHelp',
      category: 'lifestyle',
      description: 'Community safety and emergency response platform',
      icon: <Building2 className="h-8 w-8" />,
      status: 'live',
      url: 'https://safetyhelp.co.za',
      features: ['Emergency Response', 'Community Safety', 'Alert Systems', 'Safety Education']
    },
    {
      id: 'legalhelp',
      name: 'LegalHelp',
      category: 'business',
      description: 'Legal assistance and document management platform',
      icon: <Briefcase className="h-8 w-8" />,
      status: 'live',
      url: 'https://legalhelp.co.za',
      features: ['Legal Documents', 'Consultation Services', 'Compliance Tracking', 'Legal Education']
    },
    {
      id: 'dochelp',
      name: 'DocHelp',
      category: 'business',
      description: 'Document management and generation platform',
      icon: <Lightbulb className="h-8 w-8" />,
      status: 'live',
      url: 'https://dochelp.co.za',
      features: ['Document Templates', 'Auto Generation', 'Version Control', 'Collaboration Tools']
    },
    {
      id: 'flamea',
      name: 'Flamea',
      category: 'lifestyle',
      description: 'Creative expression and community arts platform',
      icon: <Heart className="h-8 w-8" />,
      status: 'live',
      url: 'https://flamea.co.za',
      features: ['Art Creation', 'Community Gallery', 'Creative Collaboration', 'Cultural Expression']
    },
    {
      id: 'pubhelp',
      name: 'PubHelp',
      category: 'business',
      description: 'Publishing and content creation assistance platform',
      icon: <GraduationCap className="h-8 w-8" />,
      status: 'live',
      url: 'https://pubhelp.co.za',
      features: ['Content Creation', 'Publishing Tools', 'Marketing Support', 'Distribution Network']
    },
    {
      id: 'family-hub',
      name: 'Family Hub',
      category: 'family',
      description: 'Private family intranet for the Mlandeli ecosystem',
      icon: <Heart className="h-8 w-8" />,
      status: 'live',
      url: 'https://salatiso.com/intranet',
      features: ['Family Directory', 'Project Management', 'Career Tracking', 'Gamification']
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      business: 'from-blue-500 to-blue-600',
      family: 'from-green-500 to-green-600',
      education: 'from-purple-500 to-purple-600',
      lifestyle: 'from-orange-500 to-orange-600'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      live: 'bg-green-100 text-green-800 border-green-200',
      beta: 'bg-blue-100 text-blue-800 border-blue-200',
      development: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      planned: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const categories = [
    { id: 'business', name: 'Business Solutions', count: ecosystemApps.filter(app => app.category === 'business').length },
    { id: 'family', name: 'Family Tools', count: ecosystemApps.filter(app => app.category === 'family').length },
    { id: 'education', name: 'Education Platform', count: ecosystemApps.filter(app => app.category === 'education').length },
    { id: 'lifestyle', name: 'Lifestyle Apps', count: ecosystemApps.filter(app => app.category === 'lifestyle').length }
  ];

  return (
    <PublicLayout title="Ecosystem Overview">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              The Salatiso
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Ecosystem
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
              A comprehensive suite of interconnected platforms designed to empower 
              businesses, families, and communities through Ubuntu principles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#apps"
                className="px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Our Apps
              </motion.a>
              <motion.a
                href="/intranet"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Family Access
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ecosystem Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our interconnected platforms serve every aspect of modern life, 
              from business operations to family connections.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {category.count}
                  </div>
                  <div className="font-medium text-gray-900">
                    {category.name}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <section id="apps" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Applications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each application is designed with Ubuntu principles at its core, 
              fostering interconnectedness and shared prosperity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ecosystemApps.map((app, index) => (
              <motion.div
                key={app.id}
                id={app.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Card Header */}
                <div className={`h-32 bg-gradient-to-br ${getCategoryColor(app.category)} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        {app.icon}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{app.name}</h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {app.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {app.features.map((feature, fIndex) => (
                        <li key={fIndex} className="text-sm text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-gray-100">
                    {app.url ? (
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors group"
                      >
                        <span>Visit Application</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    ) : (
                      <button 
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled
                      >
                        {app.status === 'planned' ? 'Coming Soon' : 'In Development'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ubuntu Connection Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ubuntu: &ldquo;I am because we are&rdquo;
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Every application in our ecosystem embodies Ubuntu principles, recognizing that 
              individual success is intrinsically linked to collective prosperity. Together, 
              we build stronger businesses, families, and communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/about"
                className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn About Ubuntu
              </motion.a>
              <motion.a
                href="/journey"
                className="px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-600 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Our Journey
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default EcosystemPage;