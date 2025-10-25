import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';

interface TestGuide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  steps: number;
  estimatedTime: string;
  color: string;
}

interface TestGuideCardProps {
  guide: TestGuide;
  index: number;
}

export const TestGuideCard: React.FC<TestGuideCardProps> = ({ guide, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className={`bg-gradient-to-r ${guide.color} p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          {guide.icon}
          <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
            {guide.steps} steps
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
        <p className="text-white text-opacity-90 mb-4">{guide.description}</p>
        <div className="text-sm text-white text-opacity-75 flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {guide.estimatedTime}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Step-by-step instructions
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Built-in feedback forms
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Progress tracking
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Downloadable results
          </div>
        </div>

        <button
          onClick={() => window.open(guide.path, '_blank')}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Start Testing Guide
        </button>
      </div>
    </motion.div>
  );
};