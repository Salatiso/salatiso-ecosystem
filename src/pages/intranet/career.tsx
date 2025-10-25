import React from 'react';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { Briefcase, Target, TrendingUp, Award } from 'lucide-react';

const careerTracks = [
  {
    title: 'Executive Leadership',
    description:
      'Pathway for family members preparing for executive roles across the ecosystem companies.',
    milestones: [
      'Lead a cross-functional strategic initiative',
      'Complete advanced governance and finance training',
      'Mentor next-generation family talent'
    ],
    icon: TrendingUp,
    color: 'from-primary-500 to-emerald-500'
  },
  {
    title: 'Operational Excellence',
    description:
      'Focused on building operational mastery in marketing, product, and customer success.',
    milestones: [
      'Launch a new product or service line',
      'Achieve measurable growth KPI within 12 months',
      'Document a repeatable operating playbook'
    ],
    icon: Briefcase,
    color: 'from-amber-500 to-orange-500'
  },
  {
    title: 'Innovation & Technology',
    description:
      'Advance the digital backbone of the Salatiso ecosystem through innovation.',
    milestones: [
      'Ship an AI-enabled capability for the ecosystem',
      'Publish technical documentation and run a knowledge-share',
      'Maintain 99.9% uptime for owned platforms'
    ],
    icon: Target,
    color: 'from-indigo-500 to-blue-500'
  }
];

const recognitionLevels = [
  {
    title: 'Ubuntu Champion',
    criteria: 'Demonstrates outstanding collaboration, mentorship, and community impact.',
    rewards: ['Family governance voting rights', 'Annual leadership retreat access']
  },
  {
    title: 'Growth Architect',
    criteria: 'Delivers measurable business expansion or operational efficiency.',
    rewards: ['Performance-linked share allocation', 'Investment committee seat consideration']
  },
  {
    title: 'Legacy Builder',
    criteria: 'Creates sustainable assets that benefit future generations.',
    rewards: ['Trust distributions', 'Legacy storytelling feature']
  }
];

const CareerPage: React.FC = () => {
  return (
    <IntranetLayout title="Career Paths">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">
            Family Career Journeys
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Map your personal development path within the Mlandeli Notemba Investments ecosystem. Each journey combines Ubuntu-centered leadership, measurable business contribution, and continuous learning.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-12">
          {careerTracks.map((track) => (
            <div
              key={track.title}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${track.color} flex items-center justify-center text-white mb-4`}>
                <track.icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{track.title}</h2>
              <p className="text-gray-600 mb-4">{track.description}</p>
              <ul className="space-y-2 text-sm text-gray-700">
                {track.milestones.map((milestone) => (
                  <li key={milestone} className="flex items-start space-x-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                    <span>{milestone}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Performance Framework</h2>
              <p className="text-gray-600 max-w-3xl">
                Every family member selects a primary track and partners with the Family Council to
                agree on annual outcomes. Milestones unlock share vesting, leadership opportunities,
                and recognition in the LifeCV portfolio.
              </p>
            </div>
            <div className="bg-primary-50 text-primary-700 rounded-2xl px-6 py-4 flex items-center space-x-3">
              <Award className="h-8 w-8" />
              <div>
                <p className="font-semibold">Quarterly Reviews</p>
                <p className="text-sm">Guided coaching with curated learning plans</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {recognitionLevels.map((level) => (
              <div key={level.title} className="border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{level.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{level.criteria}</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {level.rewards.map((reward) => (
                    <li key={reward} className="flex items-start space-x-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                      <span>{reward}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="bg-gradient-to-r from-primary-600 to-emerald-500 text-white rounded-3xl p-6">
            <h3 className="text-xl font-semibold mb-2">Annual Goal Setting</h3>
            <p className="text-sm opacity-90 mb-4">
              Collaborate with the Family Council to define strategic goals, mentorship support, and
              financial targets linked to share vesting.
            </p>
            <div className="text-sm space-y-2 opacity-90">
              <p>• Submit personal development plan before the first quarter review.</p>
              <p>• Align measurable targets with ecosystem OKRs.</p>
              <p>• Schedule monthly check-ins with accountability partners.</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Career Support Resources</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                <span>LifeCV competency maps and personalized learning journeys.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                <span>Access to mentor network and executive coaching sessions.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                <span>Quarterly family leadership labs and innovation sprints.</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </IntranetLayout>
  );
};

export default CareerPage;
