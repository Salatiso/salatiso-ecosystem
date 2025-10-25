import React, { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layouts/PublicLayout';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Home,
  Lightbulb,
  Network,
  Shield,
  Sparkles,
  User,
  Users,
  Zap
} from 'lucide-react';

const pathwaySteps = [
  {
    id: 'individual',
    title: 'Individual',
    description:
      'Everything begins with personal agency. LifeKey OS, LifeCV, and Safety First tools equip each person with identity, safety, and a strategic roadmap before any organisational engagement.',
    icon: User
  },
  {
    id: 'family',
    title: 'Family',
    description:
      'Families convert individual progress into household resilience. Family Value frameworks, LifeSync rituals, and FinHelp budgeting align everyone around shared goals and reciprocity.',
    icon: Home
  },
  {
    id: 'community',
    title: 'Community',
    description:
      'Prepared households collaborate through SafetyHelp, PigeeBack, and community governance to secure streets, schools, and local economies using Ubuntu principles.',
    icon: Users
  },
  {
    id: 'professional',
    title: 'Professional',
    description:
      'Businesses and professionals plug into BizHelp, DocuHelp, and marketplace partnerships, scaling compliant services while mentoring the next generation of operators.',
    icon: Briefcase
  }
];

const timeline = [
  {
    phase: 'Transkei Roots',
    period: '1982 – 2003',
    summary:
      'Born in 1982 in his mother\'s home village (32 deg 09\'03.6\"S 28 deg 31\'58.6\"E) near Willowvale in Transkei to parents Mlandeli & Notemba, with paternal roots in Nqabane. Raised across Mahasana and Lencane before the family settled in Drayini (32 deg 08\'09.2\"S 28 deg 20\'39.4\"E).',
    points: [
      'Ubuntu values embedded from childhood in rural Transkei communities and extended family networks.',
      'Early schooling in the Eastern Cape included days learning under a tree when classrooms were unavailable.',
  'After his father\'s passing at age 11, he moved to Mpumalanga to live with his uncle and attended Kiriyatswane High School.'
    ]
  },
  {
    phase: 'Lived Experience & Mastery',
    period: '2003 – 2012',
    summary:
      'From rural boy to safety leader. At 18, independent. At 21, providing. Mastering the systems that keep workplaces, communities, and infrastructure safe across government, mining, banking, transport, and telecom sectors.',
    points: [
      'Junior Environmental Health Practitioner for the Eastern Cape Department of Health.',
      'Ventilation & Occupational Hygiene Technologist at Anglo Platinum – awarded Best Trainee (2004).',
      'Safety leadership across SARCC Metrorail, Liberty Group Properties, and 5G Property Consultants.'
    ]
  },
  {
    phase: 'Strategic Stewardship',
    period: '2013 – 2022',
    summary:
      'Guiding enterprise risk, audit, and business continuity for Telkom (CRES) / Gyro Group and advising corporate boards while keeping the family mission central.',
    points: [
      'Designed national compliance frameworks, emergency readiness, and resilience playbooks.',
      'Mentored teams across finance, property, and technology portfolios to embed safety-first cultures.',
      'Mapped recurring injustices facing fathers, boys, and families inside South Africa’s legal system.'
    ]
  },
  {
    phase: 'Knowledge to Books',
    period: '2023',
    summary:
      'Transforming personal battles into open-access books that document the evidence, the pain, and the path to reform, with every title released for free to maximise reach.',
    points: [
      'Launched the Safety First series and “Goliath’s Reckoning”, exposing systemic bias against fathers.',
      'Published “Beyond the Grave” and “The Homeschooling Father”, blending spirituality, tradition, and practical homeschooling.',
      'Catalogued podcasts, guides, and journals as open knowledge to serve families, advocates, and practitioners.'
    ]
  },
  {
    phase: 'Books to Ecosystem',
    period: '2023 – Present',
    summary:
      'Each manuscript became a module; each insight evolved into software. Salatiso.com matured into Mlandeni-Notemba Investments (MNI) – a tribute to the parents who seeded the vision.',
    points: [
      'Built interconnected platforms (LifeSync, Sazi suite, FinHelp, SafetyHelp, DocuHelp, BizHelp Marketplace, Flamea advocacy).',
      'Codified the family governance model so the business organogram mirrors the family organogram.',
      'Kept personal usage free for life while enabling sustainable professional partnerships.'
    ]
  }
];

const lifeCVHighlights = [
  {
    title: 'Mission Statement',
    description:
      '“I am a father to my son; all else is a means to this end.” Every platform is engineered to defend family integrity, equality before the law, and practical opportunities for the next generation.'
  },
  {
    title: 'Career Vision',
    description:
      'Leverage two decades of OHS, risk, and legal advocacy to dismantle discriminatory systems, especially in family law, while giving individuals free access to world-class tools.'
  },
  {
    title: 'Core Values',
    description:
      'Equality before the law, reciprocity, resilience, meritocracy, and the golden rule. Policy scepticism balanced with data, evidence, and lived experience.'
  },
  {
    title: 'Work Style',
    description:
      'Proactive, strategic, data-driven. Comfortable in boardrooms and township councils alike, translating complexity into actionable systems that honour Ubuntu.'
  }
];

const familyOrganogram = [
  {
    level: 'Foundational Generation',
    members: [
      {
        name: 'Mlandeni Mdeni',
        role: 'Patriarch & Co-Founder of the Legacy',
        focus: 'Modelled disciplined entrepreneurship and community duty.'
      },
      {
        name: 'Notemba Mdeni',
        role: 'Matriarch & Cultural Custodian',
        focus: 'Anchored the family in faith, education, and Ubuntu reciprocity.'
      }
    ]
  },
  {
    level: 'Current Stewards',
    members: [
      {
        name: 'Salatiso Lonwabo Mdeni',
        role: 'Chief Steward • Ecosystem Architect',
        focus:
          'Risk strategist, author, and digital builder translating lived experience into the Salatiso ecosystem and MNI portfolio.'
      },
      {
        name: 'Visa Sande Mdeni',
        role: 'SafetyHelp & Community Security Lead',
        focus: 'Municipal partnerships, emergency readiness, and LifeSync Seal deployments.'
      },
      {
        name: 'Kwakho Eyona Mdeni',
        role: 'DocuHelp & Knowledge Systems Custodian',
        focus: 'Document automation, legal workflows, and archival governance.'
      },
      {
        name: 'Tina Sisonke Mdeni',
        role: 'LifeSync Hub & Family Wellness Champion',
        focus: 'Household rituals, events, and the Family Planning Board.'
      }
    ]
  },
  {
    level: 'Legacy Builders (Children)',
    members: [
      {
        name: 'Next Generation Guild',
        role: 'Kids Zones Explorers',
        focus:
          'Immersed in Sazi Life Academy labs, language quests, coding studios, and LifeSync safety drills designed to protect and elevate every child.'
      }
    ]
  }
];

const ecosystemTabs = [
  {
    id: 'personal',
    title: 'Individual • Free Personal Access',
    tagline: 'Lifetime tools for identity, safety, and learning – no paywall, no expiry.',
    description:
      'Anyone can register, download, or self-host the personal stack at zero cost. Your story, evidence, finances, and safety blueprint stay yours.',
    flows: [
      {
        label: 'LifeKey OS',
        detail: 'Secure personal operating system for identity, credentials, and reciprocity scores. Offline capable for Homestead OS deployments.'
      },
      {
        label: 'LifeCV',
        detail: 'Dynamic portfolio for documenting experience, achievements, and community impact. Integrates with every module in the ecosystem.'
      },
      {
        label: 'Sazi Suite',
        detail: 'Micro-courses, homeschooling support, language immersion, and maker labs that capture evidence back into LifeCV.'
      },
      {
        label: 'LifeSync Safety',
        detail: 'Follow Me Home journeys, emergency contacts, and mesh-based alerts for individuals and kids on the move.'
      }
    ],
    footer:
      'Personal use is deliberately free for life. Families keep sovereignty over their data while benefiting from enterprise-grade infrastructure.'
  },
  {
    id: 'family',
    title: 'Family • Collective Prosperity',
    tagline: 'Household governance, rituals, and reciprocity dashboards built on Ubuntu.',
    description:
      'Families align finances, learning, and culture through shared boards and transparent commitments. Everyone contributes, everyone benefits.',
    flows: [
      {
        label: 'Family Value Framework',
        detail: 'Family constitution templates, decision logs, and reciprocity trackers encoded in DocuHelp and FinHelp.'
      },
      {
        label: 'LifeSync Hub',
        detail: 'Shared calendars, rituals, and wellbeing check-ins. Kids zones give children safe autonomy with guardian controls.'
      },
      {
        label: 'FinHelp Finance Suite',
        detail: 'Budgeting, emergency funds, and legacy planning tailored for households and blended families.'
      },
      {
        label: 'Homestead OS',
        detail: 'Offline bundles so rural or low-connectivity homesteads can run the full suite via solar-powered edge devices.'
      }
    ],
    footer:
      'The family organogram is the business organogram. Decisions move through councils that mirror household governance.'
  },
  {
    id: 'business',
    title: 'Professional • BizHelp Marketplace',
    tagline: 'Operator ↔ Professional partnerships that convert expertise into compliant offerings.',
    description:
      'Inspired by https://bizhelp-lifecv.web.app/marketplace, engagements follow a transparent pathway from simulation to signed-off delivery.',
    flows: [
      {
        label: 'Simulation & Readiness',
        detail: 'Individuals run free simulations to map their strengths, gaps, and recommended toolkits before onboarding.'
      },
      {
        label: 'Operator Model',
        detail: 'Skilled operators use LegalHelp, HRHelp, FinHelp, and DocuHelp to produce 90% of the work, documented in LifeCV.'
      },
      {
        label: 'Professional Partner Sign-Off',
        detail: 'Accredited professionals review, mentor, and legally authorise outputs – earning revenue while uplifting new talent.'
      },
      {
        label: 'Client Delivery & Legacy',
        detail: 'Clients receive affordable, compliant solutions. Families see income flow justified by transparent records and reciprocity tracking.'
      }
    ],
    footer:
      'Zero upfront cost partnerships, brand ambassador programmes, and Foundry builds help domain experts launch sustainable ventures.'
  },
  {
    id: 'community',
    title: 'Community • Safety & Governance',
    tagline: 'Neighbourhoods organised around trust, emergency readiness, and cultural preservation.',
    description:
      'LifeSync Community Hub, SafetyHelp, and PigeeBack orchestrate mesh communication, governance quorums, and mobility support.',
    flows: [
      {
        label: 'SafetyHelp & LifeSync Seal',
        detail: 'Incident reporting, emergency assistance, and event safety protocols with LifeSync Seal verification.'
      },
      {
        label: 'PigeeBack',
        detail: 'Ride sharing, Follow Me Home escorts, and parcel companionship rooted in ukunikela mutual aid.'
      },
      {
        label: 'Community Governance',
        detail: '60% validator quorums, escalation rules, and trust badges connected to LifeKey credentials.'
      },
      {
        label: 'Knowledge Commons',
        detail: 'Open libraries, podcasts, and research prompts so every community can adapt the blueprint to local realities.'
      }
    ],
    footer:
      'Communities inherit equipped individuals and strengthened families, closing the loop back to the person at the centre.'
  }
];

const kidZones = [
  {
    title: 'Sazi Life Academy',
    description:
      '70% practical learning with parent-and-child cohorts, mastery badges, and story-based assessments that feed straight into LifeCV portfolios.'
  },
  {
    title: 'Sazi Language Learn',
    description:
      'Immersive language quests and intergenerational storytelling challenges that preserve culture while building literacy.'
  },
  {
    title: 'Sazi Code Create',
    description:
      'Maker labs, robotics kits, and AI-assisted lesson builders giving kids a safe space to experiment and publish projects.'
  },
  {
    title: 'LifeSync Kids Mode',
    description:
      'Follow Me Home routes, safe arrival notifications, and emergency contacts tuned for children’s autonomy with guardian oversight.'
  }
];

const AboutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const currentTab = ecosystemTabs.find((tab) => tab.id === activeTab) ?? ecosystemTabs[0];

  return (
    <PublicLayout title="About MNI & the Salatiso Ecosystem">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-20">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <p className="uppercase tracking-[0.3em] text-sm text-primary-100 mb-4">
              Salatiso.com → Mlandeni-Notemba Investments (MNI)
            </p>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6">
              The Evolution of a Family Legacy: Individual, Family, Community, Professional – always in that order.
            </h1>
            <p className="text-lg md:text-xl text-primary-100 leading-relaxed mb-8">
              Born from lived experience, refined through books, and manifested as a digital ecosystem that keeps personal usage free while enabling dignified enterprise. MNI is a tribute to Mr. Mlandeni and Mrs. Notemba – the parents who started it all.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/ecosystem"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl shadow-sm hover:bg-gray-100 transition"
              >
                Explore the Ecosystem
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <a
                href="https://bizhelp-lifecv.web.app/marketplace"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition"
              >
                View BizHelp Marketplace
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Individual → Family → Community → Professional */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">From the Person Outwards</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Each layer strengthens the next. The ecosystem never bypasses the individual because a stable person builds a resilient family, which then powers thriving communities and professional enterprises.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pathwaySteps.map((step, index) => (
              <motion.div
                key={step.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Experience Became an Ecosystem</h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Every season of work, advocacy, and writing added another building block. This timeline captures the progression from hands-on OHS practice to open-source knowledge and finally to the interconnected platforms that run today.
            </p>
          </motion.div>
          <div className="space-y-8">
            {timeline.map((entry, index) => (
              <motion.div
                key={entry.phase}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{entry.phase}</h3>
                    <p className="text-primary-600 font-medium">{entry.period}</p>
                  </div>
                  <span className="mt-2 inline-flex items-center text-sm text-gray-500">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Documented through journals, audits, and later, books.
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{entry.summary}</p>
                <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                  {entry.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LifeCV Snapshot */}
      <section className="py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">LifeCV Snapshot • Salatiso Lonwabo Mdeni</h2>
            <p className="text-lg text-primary-100 max-w-3xl mx-auto">
              A comprehensive record of professional, personal, and advocacy work – the blueprint that informs every platform decision inside the ecosystem.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2">
            {lifeCVHighlights.map((item, index) => (
              <motion.div
                key={item.title}
                className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-primary-50 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Family Organogram */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Family & Business Organogram</h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              The family organogram is the business organogram. Governance, stewardship, and accountability flow through the same council structures, honouring the legacy of Mlandeni and Notemba while empowering every new voice.
            </p>
          </motion.div>
          <div className="space-y-8">
            {familyOrganogram.map((tier, index) => (
              <motion.div
                key={tier.level}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{tier.level}</h3>
                    <p className="text-sm text-gray-500">Decision-making tier {index + 1}</p>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {tier.members.map((member) => (
                    <div
                      key={member.name}
                      className="rounded-xl border border-gray-100 p-4 bg-gray-50"
                    >
                      <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                      <p className="text-primary-600 text-sm font-medium">{member.role}</p>
                      <p className="text-sm text-gray-600 mt-2">{member.focus}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Overview Tabs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How the Ecosystem Interconnects</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Inspired by the BizHelp marketplace tabs, this overview shows how individual access, family collaboration, business engagements, and community impact loop into one another.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {ecosystemTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  activeTab === tab.id
                    ? 'bg-primary-600 border-primary-600 text-white shadow'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-primary-200 hover:text-primary-600'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          <motion.div
            key={currentTab.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="max-w-3xl">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{currentTab.title}</h3>
                <p className="text-primary-600 font-medium mb-4">{currentTab.tagline}</p>
                <p className="text-gray-700 mb-6">{currentTab.description}</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center">
                <Network className="h-8 w-8" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {currentTab.flows.map((flow) => (
                <div key={flow.label} className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center mb-2">
                    <Sparkles className="h-4 w-4 mr-2 text-primary-600" />
                    {flow.label}
                  </h4>
                  <p className="text-sm text-gray-600">{flow.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-primary-50 border border-primary-100 p-4 text-sm text-primary-700 flex items-start space-x-3">
              <Zap className="h-4 w-4 mt-1" />
              <p>{currentTab.footer}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kids Zones */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Children at the Centre</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every platform includes comprehensive kids zones because legacy without children is a broken promise. From STEM labs to safety escorts, the ecosystem protects and elevates the next generation.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2">
            {kidZones.map((zone, index) => (
              <motion.div
                key={zone.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{zone.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{zone.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ubuntu in Action</h2>
            <p className="text-lg text-primary-100 max-w-3xl mx-auto mb-8">
              The Salatiso ecosystem remains free for personal use, accountable to family councils, and open to community collaboration. When you are ready for professional partnerships, the BizHelp marketplace and Foundry are waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl shadow-sm hover:bg-gray-100 transition"
              >
                Connect with the Family Stewardship Team
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link
                href="/intranet"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition"
              >
                Family & Partner Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default AboutPage;