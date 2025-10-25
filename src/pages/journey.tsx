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
  BookOpen,
  Home,
  Shield,
  Scale
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
      id: 'transkei-roots',
      year: '1982-2003',
      title: 'Roots & Legacy - Transkei Foundations',
      description:
        'Born in 1982 in Transkei, with the family homestead near Mqanduli, Eastern Cape. From 1982–1996, I witnessed the transition from parliamentary to constitutional sovereignty in South Africa. This era shaped my understanding that while laws made by humans—including constitutions—can be rewritten, the biological and kinship bonds of family remain constant. My relationships with parents, uncles, aunts, and siblings have endured beyond any legal framework.',
      icon: <Home className="h-6 w-6" />,
      category: 'foundation',
      achievements: [
        'Childhood across Fort Malan, Nqabane, Mahasana, and Lencane, until settling in Drayini Location',
        'Later moved to Mbalenhle, Mpumalanga for high school',
        'Ubuntu values embedded through rural Transkei life — reciprocity, kinship, reverence for elders',
        'Xhosa heritage and cultural identity shaped by oral traditions and rituals',
        'Understanding that kinship bonds transcend legal frameworks'
      ]
    },
    {
      id: 'independence-ohs-career',
      year: '2003-2023',
      title: 'Professional Journey & Knowledge Advocacy',
      description:
        'Public and private risk management roles: Environmental Health Practitioner, Occupational Hygiene Technologist, Health and Safety Manager, Assistant Risk Manager, Risk and Governance Specialist, Consultant and Director. Recognized as Best Trainee at Anglo Platinum (2004), with safety leadership roles across SARCC Metrorail, Liberty Group, and 5G Property Consultants. Voluntary contributor to Safety1st.',
      icon: <Shield className="h-6 w-6" />,
      category: 'growth',
      achievements: [
        'Environmental Health Practitioner & Occupational Hygiene Technologist',
        'Awarded "Best Trainee" at Anglo Platinum (2004)',
        'Safety leadership across SARCC Metrorail, Liberty Group, 5G Property Consultants',
        'Books, articles, and podcasts translating lived experience into open knowledge',
        'Founder of Flamea, SafetyHelp, and LegalHelp community platforms'
      ]
    },
    {
      id: 'corporate-legal-battles',
      year: '2013-2022',
      title: 'Boardrooms & Children\'s Courts',
      description:
        'Guided enterprise risk for Telkom/Gyro, advised corporate boards on resilience. But the real fight was personal: Children\'s Court battles exposed systemic gender bias against fathers. Mapped every injustice, documented the discrimination. My son\'s rights became my mission—everything else was just a means to this end.',
      icon: <Scale className="h-6 w-6" />,
      category: 'expansion',
      achievements: [
        'Corporate risk management for national brands',
        'Children\'s Court: exposed systemic gender bias',
        'Father\'s mission: "I am a father to my son; all else is a means to this end"'
      ]
    },
    {
      id: 'books-publishing',
      year: '2023',
      title: '15+ Books - All Free & Open',
      description:
        '"Goliath\'s Reckoning" exposed gender bias in courts. "The Homeschooling Father" shared what I learned taking control of my son\'s education. "Beyond Redress" challenged race-based policies. "Safety First" series opened OHS careers to everyone—no tertiary qualification required. "Getting to Know Yourself" traced Xhosa heritage. Every book free—impact over income, empowerment over profit.',
      icon: <BookOpen className="h-6 w-6" />,
      category: 'milestone',
      achievements: [
        '15+ books published, all free and open access',
        'Legal reform advocacy through Goliath\'s Reckoning & Beyond Redress',
        'Homeschooling resources for father-led education',
        'OHS career guides accessible to all (no degree required)'
      ]
    },
    {
      id: 'mni-ecosystem',
      year: '2023-Present',
      title: 'Mlandeli-Notemba Investments (MNI) Ecosystem',
      description:
        'Named for my parents. Built to solve real problems: Sonny Network (safety I wish I had), Piggyback (ride-sharing & parcel delivery for rural areas), LifeSync (homeschooling + family governance), DocuHelp, BizHelp, Flamea (legal advocacy). Business organogram mirrors family organogram. Tech learned in boardrooms, returned to serve the roots. Personal use: free forever.',
      icon: <Lightbulb className="h-6 w-6" />,
      category: 'innovation',
      achievements: [
        'Named ecosystem after parents: Mlandeli-Notemba Investments',
        'Sonny Network: safety system for families and communities',
        'Piggyback: rural ride-sharing & parcel delivery',
        'LifeSync: homeschooling + family governance platform',
        'All platforms: personal use free forever'
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
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600'
;
  };

  const stats = [
    { label: 'Years of Living Experience', value: '43', icon: <Calendar className="h-6 w-6" /> },
    { label: 'Books Published (All Free)', value: '15+', icon: <BookOpen className="h-6 w-6" /> },
    { label: 'Years as Father', value: '15+', icon: <Heart className="h-6 w-6" /> },
    { label: 'Ecosystem Platforms', value: '9', icon: <Lightbulb className="h-6 w-6" /> }
  ];

  return (
    <PublicLayout title="My Journey">
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
              From Rural Roots to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Living Ecosystem
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
              My story does not begin with websites or code. It begins in the rural Transkei, immersed in Xhosa culture, 
              raised in the strength of extended family and informal systems. My father once walked to school barefoot; 
              I have never been without shoes. That is progress — and it is the foundation of everything I build.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p>
              My foundation was not built in a classroom; it was grounded by my duty to my family, forged by lived experience and an unquenchable thirst for knowledge. My character, values, and drive were gifted to me by my parents, my grandparents, and all my ancestors, nurtured in lived experiences with my siblings, cousins, aunts, and uncles. They were reinforced by my community, from Fort Marlan to Drayini and beyond. My family has always anchored me, provided the substance.
            </p>
            
            <p>
              The books I wrote — <em>Safety First</em>, <em>The Homeschooling Father</em>, <em>Beyond the Grave</em>,
              <em>Goliath&apos;s Reckoning</em> — became the building blocks of an ecosystem. Each manuscript was a module,
              each insight a tool. Today, the Salatiso ecosystem is not just technology: it is a continuation of family duty,
              Ubuntu, and the responsibility to empower those who come after.
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 my-8">
              <blockquote className="text-xl italic text-gray-700 border-l-4 border-purple-600 pl-6">
                &ldquo;My father walked to school barefoot. I&apos;ve never been without shoes. That&apos;s progress.
                Now my son has tools I wish existed—safety networks, homeschooling resources, platforms
                that respect family sovereignty. The cycle continues, but we&apos;re building the infrastructure
                our communities deserve.&rdquo;
              </blockquote>
              <footer className="text-right text-gray-600 font-semibold mt-4">
                — Salatiso Lonwabo Mdeni
              </footer>
            </div>

            <p className="text-center text-xl font-semibold text-gray-900 mt-8">
              This ecosystem isn&apos;t about credentials or corporate achievements. It&apos;s about lived experience
              becoming useful knowledge. It&apos;s about a rural boy learning in formal systems, then bringing
              those skills back home to empower the next generation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ubuntu: &ldquo;I Am Because We Are&rdquo;
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                This ancient African philosophy guides every decision, every product, and every interaction
                in our ecosystem. Ubuntu teaches us that our humanity is bound up in the humanity of others.
                My father&apos;s barefoot journey to school is part of my story. My son&apos;s access to tools I didn&apos;t
                have is part of the next chapter.
              </p>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Family First</h3>
                    <p className="text-gray-600">&ldquo;I am a father to my son; all else is a means to this end&rdquo;</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Community Strength</h3>
                    <p className="text-gray-600">Extended family as safety net, not formal systems</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Impact Over Income</h3>
                    <p className="text-gray-600">All books free, personal use free forever</p>
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
              The Journey: Five Chapters
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From Transkei villages to corporate boardrooms to Children&apos;s Courts to book publishing to
              ecosystem building. This is not a career timeline—it&apos;s a life journey.
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
                            {event.year}
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
                          <h4 className="font-semibold text-gray-900 mb-2">Key Milestones:</h4>
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

      {/* Books Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              15+ Books - All Free & Open
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              The journey from lived experience to ecosystem was crystallised in books. Each title documents 
              not only professional expertise but also the personal battles, cultural heritage, and family values 
              that shaped the vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://play.google.com/store/search?q=salatiso&c=books&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
              >
                View All Books on Google Play
              </a>
              <a
                href="https://www.youtube.com/@Salatiso"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-600 hover:text-white transition-colors"
              >
                Free Audiobooks on YouTube
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              The Ecosystem Lives
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Named for my parents—Mlandeli-Notemba Investments. Built to solve real problems. 
              Tech learned in boardrooms, returned to serve the roots. Personal use: free forever. 
              This is Ubuntu in action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/ecosystem"
                className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore the Ecosystem</span>
                <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="/intranet"
                className="px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-600 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join the Family
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default JourneyPage;
