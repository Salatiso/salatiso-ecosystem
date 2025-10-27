import React from 'react';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { CalendarDays, Flag, Rocket, Users } from 'lucide-react';

const timelinePhases = [
  {
    title: 'Foundation Reset',
    window: 'Q4 2025',
    focus: 'Stabilize systems, align brand language, and relaunch governance rituals.',
    highlights: [
      'Deploy SafetyHelp and DocuHelp automations to all ventures',
      'Complete branding refresh for intranet and client-facing portals',
      'Publish updated Family Governance charter and accountability map'
    ]
  },
  {
    title: 'Growth Momentum',
    window: 'Q1-Q2 2026',
    focus: 'Accelerate venture delivery with shared services and cross-venture playbooks.',
    highlights: [
      'Roll out Sales Sprints program with weekly deal reviews',
      'Launch shared insight dashboards for finance and operations',
      'Host Ubuntu Innovation Residency featuring partner ecosystem demo days'
    ]
  },
  {
    title: 'Global Signal',
    window: 'Q3 2026',
    focus: 'Position the family portfolio for continental partnerships and capital access.',
    highlights: [
      'Secure anchor partnerships for three ventures',
      'Publish the Family Impact Almanac 2026 edition',
      'Stage the Salatiso Heritage Summit in Cape Town'
    ]
  }
];

const milestoneMoments = [
  {
    title: 'Quarterly Governance Circles',
    cadence: 'Every 90 days',
    lead: 'Family Council',
    impact: 'Aligns priorities, confirms capital allocations, and reviews LifeCV recognitions.'
  },
  {
    title: 'Delivery Showcase',
    cadence: 'Monthly',
    lead: 'Venture Operators',
    impact: 'Share progress, surface blockers, and celebrate quick wins across ventures.'
  },
  {
    title: 'Community Activation Wave',
    cadence: 'Twice per year',
    lead: 'Impact Office',
    impact: 'Mobilize volunteers, run changemaker labs, and document Ubuntu stories.'
  }
];

const TimelinePage: React.FC = () => {
  return (
    <IntranetLayout title="Timeline">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12">
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <CalendarDays className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">Execution Timeline</h1>
              <p className="text-gray-600 max-w-2xl">
                Track the family portfolio delivery rhythm. Each phase blends operations, learning, and storytelling milestones—anchored in Ubuntu values and commercial goals.
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
            <div className="flex flex-col gap-3 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <Rocket className="h-4 w-4 text-primary-500" />
                <span>Current focus: completing the Foundation Reset objectives before 31 December 2025.</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary-500" />
                <span>Timeline steward: Sazi (Portfolio Operations) with support from Tina (Delivery) and Solo (Tech).</span>
              </div>
            </div>
          </div>
        </header>

        <section className="space-y-6 mb-12">
          {timelinePhases.map((phase) => (
            <div key={phase.title} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-primary-600 font-semibold">{phase.window}</p>
                  <h2 className="text-xl font-semibold text-gray-900">{phase.title}</h2>
                  <p className="text-sm text-gray-600 mt-2 max-w-xl">{phase.focus}</p>
                </div>
                <button className="px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition">
                  View workboard
                </button>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-gray-700">
                {phase.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start space-x-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="bg-gradient-to-r from-primary-600 to-indigo-500 text-white rounded-3xl p-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Accountability Cadence</h3>
              <p className="text-sm opacity-90">
                Every milestone feeds into LifeCV recognitions and informs capital deployment decisions. Keep your
                venture dashboard current ahead of each governance circle.
              </p>
            </div>
            <div className="border border-white/20 bg-white/10 rounded-2xl px-4 py-3 text-sm">
              <p className="font-medium">Key checkpoints</p>
              <ul className="opacity-90 space-y-1">
                <li>• Weekly: Delivery huddles (Monday)</li>
                <li>• Monthly: Portfolio Strategy Sync (last Friday)</li>
                <li>• Quarterly: Family Heritage Council (in-person)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Flag className="h-6 w-6 text-primary-500" />
            <h2 className="text-xl font-semibold text-gray-900">Signature Milestone Moments</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {milestoneMoments.map((milestone) => (
              <div key={milestone.title} className="border border-gray-200 rounded-2xl p-4 text-sm text-gray-700">
                <p className="text-xs uppercase tracking-wide text-primary-600 font-semibold mb-1">
                  {milestone.cadence}
                </p>
                <p className="text-gray-900 font-semibold mb-1">{milestone.title}</p>
                <p className="mb-1">Lead: {milestone.lead}</p>
                <p className="text-xs text-gray-600">{milestone.impact}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </IntranetLayout>
  );
};

export default TimelinePage;
