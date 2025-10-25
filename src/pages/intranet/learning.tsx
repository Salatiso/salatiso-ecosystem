import React from 'react';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { GraduationCap, BookOpenCheck, CalendarClock, Sparkles } from 'lucide-react';

const learningTracks = [
  {
    name: 'Ubuntu Leadership Lab',
    duration: '12 weeks',
    format: 'Hybrid (virtual + family residencies)',
    outcomes: [
      'Master the Family Value governance framework',
      'Design an Ubuntu-centered initiative for your venture',
      'Facilitate a community storytelling circle'
    ]
  },
  {
    name: 'Business Operator Sprint',
    duration: '8 weeks',
    format: 'Virtual - self paced with weekly coaching',
    outcomes: [
      'Build a working financial dashboard',
      'Coordinate a cross-functional operations review',
      'Deliver a quarterly performance narrative'
    ]
  },
  {
    name: 'Technology Stewardship',
    duration: '6 weeks',
    format: 'Cohort-based with practical labs',
    outcomes: [
      'Deploy an automation for DocuHelp or SafetyHelp',
      'Contribute to the shared design system',
      'Strengthen data privacy and cybersecurity skills'
    ]
  }
];

const upcomingEvents = [
  {
    title: 'Quarterly Family Knowledge Summit',
    date: 'Nov 15, 2025',
    description: 'A full-day summit featuring updates from each venture, learning showcases, and next-gen demos.'
  },
  {
    title: 'Storytelling Masterclass with Notemba',
    date: 'Dec 03, 2025',
    description: 'Interactive workshop on capturing Ubuntu narratives for the family archive.'
  },
  {
    title: 'LifeCV Portfolio Week',
    date: 'Jan 20-24, 2026',
    description: 'Curated sessions to update LifeCV achievements, secure mentor feedback, and plan 2026 goals.'
  }
];

const LearningPage: React.FC = () => {
  return (
    <IntranetLayout title="Learning">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">Sazi Life Academy Hub</h1>
              <p className="text-gray-600">
                Curated learning experiences to advance family leadership, entrepreneurial mastery, and community impact.
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 text-gray-700">
            <p className="text-sm">
              Each family member has an individualized learning plan captured in LifeCV. Select a track to
              access modules, mentors, and assessments. Completion badges are awarded quarterly.
            </p>
          </div>
        </header>

        <section className="space-y-6 mb-12">
          {learningTracks.map((track) => (
            <div key={track.name} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{track.name}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center space-x-1">
                      <CalendarClock className="h-4 w-4" />
                      <span>{track.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <BookOpenCheck className="h-4 w-4" />
                      <span>{track.format}</span>
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition">
                  Enroll via LifeCV
                </button>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                {track.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start space-x-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="bg-gradient-to-r from-primary-600 to-emerald-500 text-white rounded-3xl p-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Learning Support Services</h3>
              <p className="text-sm opacity-90">
                Need assistance selecting the right courses or preparing for a certification? Submit a request
                via DocuHelp → Learning Support to connect with a coach within 48 hours.
              </p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
              <p className="text-sm font-medium">Dedicated support team:</p>
              <p className="text-sm opacity-80">Sazi • Tina • Solo (technology enablement)</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="h-6 w-6 text-primary-500" />
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Learning Moments</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <div key={event.title} className="border border-gray-200 rounded-2xl p-4">
                <p className="text-xs uppercase tracking-wide text-primary-600 font-semibold mb-1">
                  {event.date}
                </p>
                <p className="text-sm font-semibold text-gray-900 mb-2">{event.title}</p>
                <p className="text-xs text-gray-600">{event.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </IntranetLayout>
  );
};

export default LearningPage;
