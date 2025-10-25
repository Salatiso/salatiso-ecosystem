import React from 'react';
import { motion } from 'framer-motion';
import { TestTube, FileText, Globe, Smartphone, CheckCircle, Users, TrendingUp, Clock } from 'lucide-react';

interface TestGuideCardProps {
  guide: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    path: string;
    steps: number;
    estimatedTime: string;
    color: string;
  };
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

interface TestingHubProps {
  onStartTesting: () => void;
  onViewTemplates: () => void;
}

export const TestingHub: React.FC<TestingHubProps> = ({ onStartTesting, onViewTemplates }) => {
  const benefits = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Quality Assurance',
      description: 'Help us identify and fix issues before official release'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Impact',
      description: 'Your feedback shapes the future of South African business tools'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Early Access',
      description: 'Get priority access to new features and improvements'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <TestTube className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Testing Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Help us build better tools for South African entrepreneurs.
              Your feedback drives our quality assurance process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onStartTesting}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Testing
              </button>
              <button
                onClick={onViewTemplates}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                View Templates
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Test With Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our community of beta testers and help shape the future of business tools in South Africa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="flex justify-center mb-4 text-blue-600">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};