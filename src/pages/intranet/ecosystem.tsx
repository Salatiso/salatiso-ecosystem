import React from 'react';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { Globe, Server, Shield, Users, Activity, HeartHandshake } from 'lucide-react';

const progressionPrinciples = [
  {
    title: 'Individual First',
    narrative:
      'Every venture begins with equipping one person with safety, skills, trust scores, and an income roadmap. LifeKey OS, LifeSync, and Sazi deliver personal agency before any organisational commitments.',
    takeaway: 'Activate identity, learning, and safety anchors so one person can stand confidently.'
  },
  {
    title: 'Family Powered',
    narrative:
      'Once an individual is grounded, the ecosystem wraps family planning, budgeting, and shared learning around them. FinHelp, Family Value, and DocuHelp codify a home base that strengthens every member.',
    takeaway: 'Turn individual momentum into household resilience and collaborative prosperity.'
  },
  {
    title: 'Community Amplified',
    narrative:
      'Communities inherit stable families and coordinate through SafetyHelp, PigeeBack, and governance toolkits to protect neighbourhoods, stimulate commerce, and steward shared assets.',
    takeaway: 'Scale local Ubuntu by connecting prepared households into accountable networks.'
  }
];

const ecosystemApps = [
  {
    name: 'SafetyHelp',
    description: 'Community safety and emergency coordination platform powering municipal partnerships.',
    status: 'In Pilot',
    owner: 'Visa Sande Mdeni',
    metrics: '3 active municipalities, 12 000 users',
    keyFeatures: [
      'Emergency mesh with multi-level governance approvals',
      'LifeSync Seal integrations for events and venues',
      'Incident escalation pathways tuned for street, ward, and metro ops'
    ]
  },
  {
    name: 'BizHelp',
    description:
      'Digital homestead engine guiding individuals from unemployment to multi-generational income through operator ↔ professional partnerships.',
    status: 'Scale-Up',
    owner: 'Salatiso Lonwabo Mdeni',
    metrics: '860 SMMEs onboarded, 78% funding conversion',
    keyFeatures: [
      'Simulation-driven roadmap from first skill audit to sustainable income',
      'Operator and Professional Partner marketplace with DocHelp, LegalHelp, FinHelp toolchain',
      'Family legacy programmes linking parents, youth, and elders with Flamea and LifeCV'
    ]
  },
  {
    name: 'DocuHelp',
    description: 'Document execution, policy automation, and archival engine for ecosystem entities.',
    status: 'Beta',
    owner: 'Kwakho Eyona Mdeni',
    metrics: '1 200 active documents, 15 workflows',
    keyFeatures: [
      'Household-to-enterprise workflow templates for rapid adoption',
      'LegalHelp automation with professional review trails',
      'Secure archival aligned to Family Value governance'
    ]
  },
  {
    name: 'LifeSync Hub',
    description: 'Family culture, wellness, and event coordination hub anchoring the Ubuntu experience.',
    status: 'MVP',
    owner: 'Tina Sisonke Mdeni',
    metrics: 'Monthly engagement rate 76%',
    keyFeatures: [
      'Follow Me Home journeys with household check-ins',
      'Family rituals, wellness routines, and reciprocity commitments',
      'Event safety flows aligned to LifeSync Seal protocols'
    ]
  },
  {
    name: 'FinHelp Finance Suite',
    description: 'Financial management engine covering budgeting, risk, tax, and reciprocity-driven wealth planning for families and SMMEs.',
    status: 'MVP',
    owner: 'Finance Innovation Collective',
    metrics: 'BudgetSuite, TaxHelper, RiskSnapshot, Couples Alignment in one workspace',
    keyFeatures: [
      'Household-first budgeting with reciprocity scoring',
      'Integrated invoicing for BizHelp operators and partners',
      'Scenario planning for family emergencies and growth projects'
    ]
  },
  {
    name: 'Sazi Life Academy',
    description: 'Central lifelong learning hub orchestrating curricula, community schools, and educator enablement across the ecosystem.',
    status: 'Launch',
    owner: 'Sazi Learning Council',
    metrics: '70% practical curriculum, 18 mastery pathways, 240 mentor-led cohorts',
    keyFeatures: [
      'Individual competency journeys linked to LifeCV evidence',
      'Family study pods with facilitator playbooks',
      'Community micro-school kits deployable via Homestead OS'
    ]
  },
  {
    name: 'Sazi Online Homeschooling',
    description: 'Complete CAPS-aligned homeschooling pathways with offline kits, language localization, and LifeCV-linked assessments.',
    status: 'Scale-Up',
    owner: 'Homeschooling Guild',
    metrics: 'Grade R-12 coverage, 14 language packs, 7-day guest mode',
    keyFeatures: [
      'Adaptive lesson planning per learner profile',
      'Offline-first content sync for low-connectivity households',
      'Parent dashboards aligning curriculum with LifeCV goals'
    ]
  },
  {
    name: 'Sazi Language Learn',
    description: 'Immersive language journeys combining story time, vocabulary games, and community language preservation.',
    status: 'Beta',
    owner: 'Heritage & Languages Team',
    metrics: '14 South African and partner languages, 3 600 family story uploads',
    keyFeatures: [
      'Intergenerational storytelling prompts for home use',
      'Community preservation challenges with contribution badges',
      'Speech practice companions for offline repetition'
    ]
  },
  {
    name: 'Sazi Home Life',
    description: 'Household management academy covering life skills, family wellness, and intergenerational knowledge exchange.',
    status: 'Pilot',
    owner: 'Home Life Studio',
    metrics: '35 micro-courses, practical badges, reciprocity tracking',
    keyFeatures: [
      'Life skill micro-courses curated for each family member role',
      'Household task orchestration synced to Family Value goals',
      'Reciprocity tracking with weekly reflection prompts'
    ]
  },
  {
    name: 'Sazi Code Create',
    description: 'Practical digital skills academy with project-based coding, maker labs, and LifeCV portfolio evidence.',
    status: 'Beta',
    owner: 'Digital Futures Lab',
    metrics: '70+ coding challenges, AI-assisted lesson builder, educator dashboards',
    keyFeatures: [
      'Individual project tracks exporting directly to LifeCV portfolios',
      'Community maker lab templates for schools and hubs',
      'AI-assisted lesson builder for caregivers and mentors'
    ]
  },
  {
    name: 'PigeeBack',
    description:
      'Ride sharing and parcel companionship network grounded in mutual safety, enabling families to coordinate travel and deliveries with trusted community members.',
    status: 'Pilot',
    owner: 'Mobility Trust Guild',
    metrics: '1 800 verified drivers, 12 400 escorted trips, 96% follow-me-home completion rate',
    keyFeatures: [
      'Ride-sharing with Follow Me Home monitoring for individuals and families',
      'Family and community watch dashboards linked to LifeSync alerts',
      'Parcel companionship routing aligned to ukunikela mutual aid principles'
    ]
  },
  {
    name: 'LifeKey OS',
    description: 'Personal operating system for identity, credentials, and LifeCV-backed trust services across the ecosystem.',
    status: 'In Development',
    owner: 'LifeKey Platform Team',
    metrics: 'Modular identity vault, reciprocity ledger, offline-first design',
    keyFeatures: [
      'Personal trust score vault with credentials export',
      'Family guardian controls for minors and dependents',
      'Offline verification tokens for Homestead OS deployments'
    ]
  },
  {
    name: 'Homestead OS',
    description: 'Offline-first distribution of Salatiso tools bundled for rural deployment with mesh networking and content sync.',
    status: 'Prototype',
    owner: 'Homestead Engineering Crew',
    metrics: 'Edge caching, solar-ready deployments, community school kit',
    keyFeatures: [
      'Solar-ready nodes with mesh networking for remote homesteads',
      'Preloaded Sazi, BizHelp, and LifeSync toolchains for quick start',
      'Community steward controls to manage shared resources'
    ]
  }
];

const operatingPillars = [
  {
    title: 'Digital Infrastructure',
    description: 'Shared authentication, analytics, billing, and notification services managed centrally.',
    icon: Server
  },
  {
    title: 'Trust & Compliance',
    description: 'Unified governance framework covering POPIA, cybersecurity, and audit readiness.',
    icon: Shield
  },
  {
    title: 'Human Experience',
    description: 'Cross-app design system ensuring access, inclusion, and consistent Ubuntu storytelling.',
    icon: Users
  },
  {
    title: 'Impact Intelligence',
    description: 'Unified data lake with dashboards measuring family prosperity and community outcomes.',
    icon: Activity
  }
];

const EcosystemPage: React.FC = () => {
  return (
    <IntranetLayout title="Ecosystem Apps">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center">
              <Globe className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">Salatiso Ecosystem</h1>
              <p className="text-gray-600">Integrated ventures aligned to the Family Value system and Ubuntu governance model.</p>
            </div>
          </div>
          <div className="bg-primary-50 border border-primary-100 rounded-3xl p-6 text-primary-700">
            <p className="font-medium">All ventures share a central mission: protect and grow family prosperity while transforming the communities we serve. Each product is built with shared components to accelerate time-to-impact.</p>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3 mb-12">
          {progressionPrinciples.map((principle) => (
            <div key={principle.title} className="bg-white rounded-3xl border border-primary-100 shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{principle.title}</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">{principle.narrative}</p>
              <p className="text-sm font-medium text-primary-700">{principle.takeaway}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-12">
          {ecosystemApps.map((app) => (
            <div key={app.name} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{app.name}</h2>
                <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-primary-100 text-primary-700">
                  {app.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4 flex-1">{app.description}</p>
              {app.keyFeatures && (
                <ul className="mb-4 space-y-2 text-sm text-gray-600 list-disc list-inside">
                  {app.keyFeatures.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              )}
              <dl className="text-sm text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <dt className="font-medium">Product Lead</dt>
                  <dd>{app.owner}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Impact Snapshot</dt>
                  <dd>{app.metrics}</dd>
                </div>
              </dl>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Operating Pillars</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {operatingPillars.map((pillar) => (
              <div key={pillar.title} className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{pillar.title}</h3>
                  <p className="text-sm text-gray-600">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="bg-gradient-to-r from-primary-600 to-emerald-500 text-white rounded-3xl p-6">
            <h3 className="text-xl font-semibold mb-2">Next 12-Month Focus</h3>
            <ul className="space-y-3 text-sm opacity-90">
              <li>• Launch FinHelp finance console across family and SMME portfolios.</li>
              <li>• Deploy Sazi Academy offline kits via Homestead OS bundles.</li>
              <li>• Graduate LifeKey OS identity vault into beta for all hubs.</li>
              <li>• Publish the annual Ubuntu Impact & Reciprocity Report.</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaboration Requests</h3>
            <p className="text-sm text-gray-600 mb-4">
              Teams can submit collaboration ideas, integration requirements, or resource requests using the Family Planning Board. Each request is reviewed weekly by the Ecosystem Steering Committee.
            </p>
            <div className="text-sm text-gray-700 space-y-2">
              <p>• Submit feature requests via DocuHelp workflow “Ecosystem-Feature”.</p>
              <p>• Join bi-weekly product syncs on Tuesdays at 08:30.</p>
              <p>• Access design system updates in the Family Knowledge Base.</p>
            </div>
          </div>
        </section>
      </div>
    </IntranetLayout>
  );
};

export default EcosystemPage;
