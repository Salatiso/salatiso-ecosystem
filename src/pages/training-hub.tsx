import React from 'react';

const TrainingHubPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">Advanced Training Hub</h1>
          <p className="text-gray-600">
            Phase 4: Deepen your Ubuntu leadership journey through advanced certifications,
            cultural competency assessment, and comprehensive learning analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-purple-600 mb-4">Certifications</h3>
            <p className="text-gray-600 mb-4">Earn Ubuntu-aligned certifications through our comprehensive program.</p>
            <div className="space-y-2 text-sm">
              <div>• Foundation Level</div>
              <div>• Cultural Level</div>
              <div>• Leadership Level</div>
              <div>• Mastery Level</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-purple-600 mb-4">Cultural Assessment</h3>
            <p className="text-gray-600 mb-4">Test your Ubuntu competency with our interactive assessment.</p>
            <div className="space-y-2 text-sm">
              <div>• Ubuntu Philosophy</div>
              <div>• Cultural Awareness</div>
              <div>• Leadership Skills</div>
              <div>• Business Ethics</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-purple-600 mb-4">Learning Analytics</h3>
            <p className="text-gray-600 mb-4">Track training progress and impact with comprehensive analytics.</p>
            <div className="space-y-2 text-sm">
              <div>• Progress Tracking</div>
              <div>• Performance Metrics</div>
              <div>• Cultural Impact</div>
              <div>• Program Effectiveness</div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-600 to-yellow-500 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Building Ubuntu Leaders for Tomorrow</h3>
          <p className="text-lg opacity-90">
            Through advanced training and cultural certification, we&apos;re creating a new generation
            of leaders who understand that true success is measured by collective prosperity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainingHubPage;