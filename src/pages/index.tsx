import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, Compass, Users, Shield, Sparkles, BookOpen, Network } from 'lucide-react';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;
import PublicLayout from '@/components/layouts/PublicLayout';

const journeyPhases = [
  {
    title: 'Salatiso Era (1982 – 2023)',
    description:
      'From Transkei roots to public health and industrial safety leadership',
    points: [
      'Born 1982 in Transkei, with family homestead near Mqanduli, Eastern Cape',
      '1982–1996: Transition from parliamentary to constitutional sovereignty in South Africa shaped understanding of kinship beyond legal frameworks',
      'Childhood across Fort Malan, Nqabane, Mahasana, and Lencane, until settling in Drayini Location',
      'High school in Mbalenhle, Mpumalanga',
      '2003-2012: Environmental Health Practitioner, Best Trainee at Anglo Platinum (2004), safety leadership roles',
      'Books, articles, and podcasts translating lived experience into open knowledge',
      'Founder of Flamea, SafetyHelp, and LegalHelp community platforms'
    ]
  },
  {
    title: 'MNI Era (2024 – Present)',
    description:
      'Family intranet, training academy, and library unified under one domain',
    points: [
      'Family intranet, training academy, and library unified under one domain',
      'Sazi Life Academy, Homestead OS, LifeKey, and patent filings held by MNI',
      'Kids Zone, partner readiness, and revenue pathways designed for multi-generational stewardship'
    ]
  }
];

const ubuntuPrinciples: Array<{ icon: IconType; title: string; description: string }> = [
  {
    icon: Users,
    title: 'Family First',
    description:
      'Every technology decision prioritizes family unity, values preservation, and intergenerational connection.'
  },
  {
    icon: Shield,
    title: 'Community Strength',
    description:
      'Building tools that strengthen not just individual families, but entire communities and networks.'
  },
  {
    icon: Sparkles,
    title: 'Empowerment Through Tech',
    description:
      'Leveraging cutting-edge technology to make every family member more capable, confident, and connected.'
  }
];

const ecosystemCategories: Array<{ label: string; description: string; count: string }> = [
  {
    label: 'Sazi Life Academy',
    description: 'Comprehensive education platform',
    count: '5 Apps'
  },
  {
    label: 'Business Tools',
    description: 'BizHelp, HrHelp, FinHelp & more',
    count: '8 Apps'
  },
  {
    label: 'Family & Home',
    description: 'Sonny Network, eKhaya, FamilyValue',
    count: '4 Apps'
  },
  {
    label: 'Creative & Legal',
    description: 'Flamea, DocHelp, LegalHelp',
    count: '3 Apps'
  }
];

const sonnyHighlights: string[] = [
  '🌐 Mesh networking connects family members even without internet',
  '🛡️ Automated safety check-ins and emergency coordination',
  '🤝 Ubuntu trust system builds stronger family relationships',
  '📱 Works seamlessly across phones, tablets, and computers'
];

const familyNetworkStatus: Array<{ initials: string; name: string; location: string; trust: number }> = [
  { initials: 'L', name: 'Lonwabo (Dad)', location: 'Home', trust: 95 },
  { initials: 'N', name: 'Nomsa (Mom)', location: 'Work', trust: 98 },
  { initials: 'S', name: 'Sipho (Son)', location: 'School', trust: 85 },
  { initials: 'T', name: 'Thandi (Daughter)', location: 'Friends', trust: 88 }
];

const moreThanSoftware: string[] = [
  'Family heritage preservation and storytelling',
  'Career development paths for every family member',
  'Gamified learning that makes education engaging',
  'Business tools that scale from family to enterprise'
];

const HomePage: React.FC = () => {

  return (
    <PublicLayout>
      <Head>
        <title>Building a Family Legacy Through Technology & Ubuntu | Mlandeli Notemba Investments</title>
        <meta name="description" content="Mlandeli Notemba Investments is the family holding company behind the Salatiso ecosystem — consolidating every intellectual property, training asset, and business venture including Sazi Life Academy, Homestead OS, LifeKey, and pending patents." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
      </Head>
      <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <p className="uppercase tracking-widest text-sm font-semibold mb-4 text-blue-100">Mlandeli Notemba Investments</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Building a Family Legacy Through Technology & Ubuntu</h1>
          <p className="text-lg leading-relaxed mb-6">
            Mlandeli Notemba Investments is the family holding company behind the Salatiso ecosystem — consolidating every intellectual property, training asset, and business venture including Sazi Life Academy, Homestead OS, LifeKey, and pending patents.
          </p>
          <p className="text-base md:text-lg leading-relaxed mb-8">
            What began as Salatiso.com&apos;s books and articles now lives as a family intranet, learning academy, and partner-ready platform that brings the individual story back home under MNI stewardship.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/ecosystem" className="btn-primary inline-flex items-center">
              Explore Our Ecosystem
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/journey" className="btn-secondary">Our Journey</Link>
            <Link href="/training#kids-zone" className="btn-secondary">Kids Zone</Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">From Salatiso.com to MNI</h2>
          <p className="mb-6 text-gray-700">
            The individual journey matured into a family holding company. Salatiso.com captured decades of risk leadership, authorship, and advocacy. In 2024 the work shifted into live prototypes for LifeCV, PigeeBack, and Sazi Life Academy. 2025 marks the homecoming as Mlandeli Notemba Investments, where every lesson, book, and build is managed as shared family IP.
          </p>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {journeyPhases.map((phase) => (
              <div key={phase.title} className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{phase.title}</h3>
                <p className="text-gray-700 mb-4">{phase.description}</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {phase.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <h3 className="font-semibold text-lg mb-2">Why the transition matters</h3>
          <p className="mb-4 text-gray-700">
            Hosting on Salatiso.com keeps the public doorway familiar while making it clear that Mlandeli Notemba Investments is now the steward. Families, partners, and future investors can see the lineage from an individual&apos;s fight for justice to a multi-application ecosystem owned and governed by the household.
          </p>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Ubuntu: I Am Because We Are</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {ubuntuPrinciples.map((principle) => (
              <div key={principle.title} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <principle.icon className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{principle.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">A Complete Digital Ecosystem</h2>
              <p className="text-gray-700 mt-2 max-w-2xl">
                From education and business development to family heritage and personal growth, our integrated platform covers every aspect of family enterprise.
              </p>
            </div>
            <Link href="/ecosystem" className="inline-flex items-center text-blue-700 font-medium">
              Explore All Applications
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {ecosystemCategories.map((category) => (
              <div key={category.label} className="border border-gray-200 rounded-xl p-6">
                <p className="uppercase text-xs tracking-wide text-blue-700 font-semibold mb-1">{category.count}</p>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.label}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 grid gap-8 md:grid-cols-2">
          <div>
            <p className="uppercase tracking-widest text-xs font-semibold text-blue-700 mb-2">Introducing</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sonny Network</h2>
            <p className="text-gray-700 mb-6">
              Ubuntu-inspired mesh networking keeps your family connected, coordinated, and safe. Built on the principle “I am because we are” — ensuring no family member walks alone.
            </p>
            <ul className="space-y-3 text-gray-700">
              {sonnyHighlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link href="/sonny" className="btn-primary inline-flex items-center">
                Launch Sonny Network
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/ecosystem#sonny" className="btn-secondary">Learn More</Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase text-blue-700 font-semibold">Family Network Status</p>
                <h3 className="text-2xl font-bold text-gray-900">4 Connected</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Compass className="h-6 w-6 text-blue-700" />
              </div>
            </div>
            <div className="space-y-4">
              {familyNetworkStatus.map((member) => (
                <div key={member.name} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-800">
                      {member.initials}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.location}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">Trust: {member.trust}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">More Than Software - It&apos;s a Way of Life</h2>
            <p className="text-gray-700 mb-6">
              Our ecosystem isn&apos;t just about managing tasks or storing data. It&apos;s about creating a digital foundation that supports how families actually live, learn, work, and grow together.
            </p>
            <ul className="space-y-3 text-gray-700">
              {moreThanSoftware.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-blue-700 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-50 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">MNI Intranet Access</h3>
            <p className="text-gray-700 mb-4">
              Family members get secure access to personalized dashboards, career tracking, project management, and proof archives held by Mlandeli Notemba Investments.
            </p>
            <Link href="/intranet" className="btn-primary inline-flex items-center">
              <span className="text-xl mr-2">MNI</span>
              Open MNI Intranet
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 text-white">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Family Legacy?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Join us in creating a digital ecosystem that preserves your family’s values while empowering future generations with cutting-edge tools and education.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/journey" className="btn-primary inline-flex items-center">
              Learn Our Story
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/contact" className="btn-secondary">Get In Touch</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;