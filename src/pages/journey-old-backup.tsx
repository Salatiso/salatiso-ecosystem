import React from 'react';
import PublicLayout from '@/components/layouts/PublicLayout';
import { motion } from 'framer-motion';
import { 
  MapPin,
  Calendar,
  Users,
  Target,
  Lightbulb,
  ArrowRight,
  Heart,
  BookOpen
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  year: string;
  quarter?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'foundation' | 'growth' | 'expansion' | 'innovation' | 'milestone';
  achievements?: string[];
}

const JourneyPage: React.FC = () => {
  const timelineEvents: TimelineEvent[] = [
    {
      id: 'public-health-foundations',
      year: '2003',
      quarter: 'Q1',
      title: 'Public Health Foundations',
      description:
        'Began serving as a Junior Environmental Health Practitioner in the Eastern Cape, grounding the work in community care, inspections, and Ubuntu-centred public health.',
      icon: <MapPin className="h-6 w-6" />,
      category: 'foundation',
      achievements: [
        'Delivered hygiene education programmes for rural communities',
        'Built inspection and compliance routines that still inform today’s checklists'
      ]
    },
    {
      id: 'industrial-safety-leadership',
      year: '2004 – 2012',
      title: 'Industrial Safety Leadership',
      description:
        'Led ventilation, occupational hygiene, and rail safety programmes across Anglo Platinum, SARCC Metrorail, and Liberty Group, honing crisis response and governance discipline.',
      icon: <Target className="h-6 w-6" />,
      category: 'growth',
      achievements: [
        'Awarded “Best Trainee” at Anglo Platinum (2004)',
        'Rolled out national SHE reforms for SARCC Metrorail',
        'Implemented incident recovery systems for Liberty Group'
      ]
    },
    {
      id: 'entrepreneurial-risk-practice',
      year: '2012 – 2020',
      title: 'Entrepreneurial Risk Practice',
      description:
        'Established 5G Property Consultants and advised national brands on compliance, continuity, and built-environment risk, turning decades of practice into independent stewardship.',
      icon: <Users className="h-6 w-6" />,
      category: 'expansion',
      achievements: [
        'Served clients including Ster-Kinekor and Alexander Forbes',
        'Integrated business continuity with family-first governance',
        'Documented lessons that seeded future publications'
      ]
    },
    {
      id: 'authorship-and-advocacy',
      year: '2016 – 2023',
      title: 'Books, Advocacy & Flamea',
      description:
        'Turned lived experience into public scholarship — publishing books, articles, and podcasts while launching Flamea to fight for equality before the law. LifeCV served as the proof vault for every milestone.',
      icon: <BookOpen className="h-6 w-6" />,
      category: 'milestone',
      achievements: [
        'Released works like “Beyond the Grave” and “Goliath’s Reckoning”',
        'Launched Flamea advocacy collective and podcast',
        'Opened salatiso.com as a free knowledge hub'
      ]
    },
    {
      id: 'prototype-year',
      year: '2024',
      quarter: 'Q3',
      title: 'Prototype Year for the Ecosystem',
      description:
        'Shifted from publishing to product, committing full-time to application builds. LifeCV, PigeeBack, Sazi Life Academy, and Homestead OS took shape inside modern Next.js stacks.',
      icon: <Lightbulb className="h-6 w-6" />,
      category: 'innovation',
      achievements: [
        'Designed LifeKey identity flows and LifeCV proof architecture',
        'Prototyped PigeeBack guild training and Sazi Life Academy curricula',
        'Mapped Homestead OS playbooks into household-ready software'
      ]
    },
    {
      id: 'mni-return-home',
      year: '2025',
      quarter: 'Q1',
      title: 'Return Home as Mlandeni Notemba Investments',
      description:
        'Rebuilt salatiso.com into MNI, bringing the individual journey back to the family, consolidating training, library, and intranet resources under one Ubuntu-aligned portal.',
      icon: <Heart className="h-6 w-6" />,
      category: 'milestone',
      achievements: [
        'Unified family intranet, training academy, and library',
        'Introduced Kids Zone and multi-generational missions',
        'Set the stage for public app launches and partner pilots'
      ]
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      foundation: 'from-purple-500 to-purple-600',
      growth: 'from-green-500 to-green-600',
      expansion: 'from-blue-500 to-blue-600',
      innovation: 'from-orange-500 to-orange-600',
      milestone: 'from-red-500 to-red-600'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const stats = [
    { label: 'Years of Professional Practice', value: '20+', icon: <Calendar className="h-6 w-6" /> },
    { label: 'Books & Longform Works', value: '8+', icon: <BookOpen className="h-6 w-6" /> },
    { label: 'Advocacy & Community Projects', value: '3', icon: <Heart className="h-6 w-6" /> },
    { label: 'Apps & Tools in Development', value: '9', icon: <Lightbulb className="h-6 w-6" /> }
  ];

  return (
    <PublicLayout title="Our Journey">
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
              Our
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
              Trace the path from Salatiso.com’s solo voice to Mlandeni Notemba Investments — an Ubuntu homecoming where personal mastery, family stewardship, and digital tools fuse into one ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-600 leading-relaxed">
              The evolution of this app mirrors Salatiso’s own story — from a single practitioner and author to a family collective that brings the work back home under the Mlandeni Notemba banner.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ubuntu Philosophy Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ubuntu: The Foundation of Everything We Do
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                &ldquo;I am because we are&rdquo; - This ancient African philosophy guides every decision, 
                every product, and every interaction in our ecosystem. Ubuntu teaches us that 
                our humanity is bound up in the humanity of others.
              </p>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Interconnectedness</h3>
                    <p className="text-gray-600">Every solution connects and enhances others</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Collective Prosperity</h3>
                    <p className="text-gray-600">Individual success strengthens the whole</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Purposeful Impact</h3>
                    <p className="text-gray-600">Every action creates positive change</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Timeline
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones marking the shift from professional practice and publishing into a family-led ecosystem of apps, training, and shared legacy.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-primary-200" />

            {/* Timeline Events */}
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center w-8 h-8 bg-white border-4 border-primary-400 rounded-full z-10">
                    <div className="w-2 h-2 bg-primary-600 rounded-full" />
                  </div>

                  {/* Content */}
                  <div className={`w-full md:w-1/2 ${
                    index % 2 === 0 ? 'md:pr-8 pl-16 md:pl-0' : 'md:pl-8 pl-16 md:pr-0'
                  }`}>
                    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      {/* Header */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${getCategoryColor(event.category)} text-white`}>
                          {event.icon}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{event.title}</div>
                          <div className="text-primary-600 font-medium">
                            {event.year} {event.quarter && `• ${event.quarter}`}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Achievements */}
                      {event.achievements && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                          <ul className="space-y-1">
                            {event.achievements.map((achievement, aIndex) => (
                              <li key={aIndex} className="text-sm text-gray-600 flex items-center">
                                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Looking Forward
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              2025 is about hardening the prototypes, publishing transparent proof trails, and inviting partners into a family platform that honours both the individual story and the collective home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/ecosystem"
                className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore Our Ecosystem</span>
                <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="/intranet"
                className="px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-600 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Our Family
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default JourneyPage;