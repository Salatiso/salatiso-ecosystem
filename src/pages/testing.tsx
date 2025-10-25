import React from 'react';
import { motion } from 'framer-motion';
import { TestTube, Smartphone, Globe, FileText, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/router';
import PublicLayout from '@/components/layouts/PublicLayout';

const TestingPage: React.FC = () => {
  const router = useRouter();

  const testGuides = [
    {
      id: 'mni-beta',
      title: 'MNI Beta Testing',
      description: 'Comprehensive testing guide for the MNI business platform',
      icon: <FileText className="w-8 h-8" />,
      path: '/testing/mni-beta-guide.html',
      steps: 15,
      estimatedTime: '45-60 minutes',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'web-app',
      title: 'Web App Testing',
      description: 'Universal testing guide for all Salatiso ecosystem web applications',
      icon: <Globe className="w-8 h-8" />,
      path: '/testing/web-app-guide.html',
      steps: 9,
      estimatedTime: '30-45 minutes',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'android-app',
      title: 'Android App Testing',
      description: 'Native Android testing guide for mobile ecosystem applications',
      icon: <Smartphone className="w-8 h-8" />,
      path: '/testing/android-app-guide.html',
      steps: 11,
      estimatedTime: '40-55 minutes',
      color: 'from-orange-500 to-orange-600'
    }
  ];

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
    <PublicLayout title="Testing Hub - Salatiso">
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
                onClick={() => document.getElementById('test-guides')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Testing
              </button>
              <button
                onClick={() => router.push('/templates')}
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

      {/* Test Guides Section */}
      <section id="test-guides" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Testing Guide
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the appropriate testing guide based on the platform you&apos;re testing.
              Each guide includes step-by-step instructions and feedback forms.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testGuides.map((guide, index) => (
              <motion.div
                key={guide.id}
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
                  <div className="text-sm text-white text-opacity-75">
                    ⏱️ {guide.estimatedTime}
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
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Your testing feedback helps us create better tools for South African entrepreneurs.
              Join our community of beta testers today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('test-guides')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started Now
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </PublicLayout>
  );
};

export default TestingPage;