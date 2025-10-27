import React, { useState } from 'react';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  updated: string;
}

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpArticles: HelpArticle[] = [
    {
      id: '1',
      title: 'Getting Started with MNI Intranet',
      category: 'Getting Started',
      content:
        'Welcome to MNI Intranet! This guide will help you get started. You can navigate using the sidebar, access your profile, and manage your information.',
      updated: 'Oct 20, 2025',
    },
    {
      id: '2',
      title: 'How to Update Your Profile',
      category: 'Profile',
      content:
        'Learn how to update your personal and professional information, upload profile pictures, and track your profile completion.',
      updated: 'Oct 26, 2025',
    },
    {
      id: '3',
      title: 'Managing Profile Pictures',
      category: 'Profile',
      content: 'Upload and manage up to 5 profile pictures. Learn how to set a primary picture and delete unwanted photos.',
      updated: 'Oct 26, 2025',
    },
    {
      id: '4',
      title: 'Exporting Your Profile',
      category: 'Profile',
      content: 'Export your complete profile as JSON for backup or to sync with other platforms like LifeSync.',
      updated: 'Oct 26, 2025',
    },
    {
      id: '5',
      title: 'Understanding Context Parameters',
      category: 'Navigation',
      content:
        'Learn about individual, family, and professional contexts. These parameters help organize information by life role.',
      updated: 'Oct 25, 2025',
    },
    {
      id: '6',
      title: 'Navigating the Sidebar',
      category: 'Navigation',
      content:
        'The sidebar contains organized sections for Dashboard, Profile, Family, Professional, and more. Click sections to expand/collapse.',
      updated: 'Oct 25, 2025',
    },
    {
      id: '7',
      title: 'LifeSync Integration',
      category: 'Integration',
      content: 'Sync your profile with LifeSync to maintain a comprehensive LifeCV across multiple platforms.',
      updated: 'Oct 26, 2025',
    },
    {
      id: '8',
      title: 'Troubleshooting Common Issues',
      category: 'Troubleshooting',
      content:
        'Solutions for common problems: cache clearing, browser compatibility, JavaScript errors, and more.',
      updated: 'Oct 24, 2025',
    },
    {
      id: '9',
      title: 'Browser Compatibility',
      category: 'Technical',
      content: 'MNI Intranet works best in Chrome, Firefox, Safari, and Edge. Learn about browser requirements.',
      updated: 'Oct 23, 2025',
    },
    {
      id: '10',
      title: 'Keyboard Shortcuts',
      category: 'Productivity',
      content: 'Master keyboard shortcuts for faster navigation and productivity within MNI Intranet.',
      updated: 'Oct 22, 2025',
    },
  ];

  const categories = ['all', ...new Set(helpArticles.map(a => a.category))];

  const filteredArticles = helpArticles.filter(
    article =>
      (selectedCategory === 'all' || article.category === selectedCategory) &&
      (searchTerm === '' ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <IntranetLayout>
      <Head>
        <title>Help & Support | MNI Intranet</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 shadow-lg">
          <h1 className="text-4xl font-bold">Help & Support</h1>
          <p className="text-blue-100 mt-2">Find answers to common questions and learn how to use MNI Intranet</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500 hover:shadow-lg transition cursor-pointer">
            <div className="text-2xl mb-2">📖</div>
            <h3 className="font-bold text-gray-800">Documentation</h3>
            <p className="text-gray-600 text-sm">Read comprehensive guides</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition cursor-pointer">
            <div className="text-2xl mb-2">🎓</div>
            <h3 className="font-bold text-gray-800">Tutorials</h3>
            <p className="text-gray-600 text-sm">Learn step-by-step</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition cursor-pointer">
            <div className="text-2xl mb-2">❓</div>
            <h3 className="font-bold text-gray-800">FAQs</h3>
            <p className="text-gray-600 text-sm">Quick answers to questions</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500 hover:shadow-lg transition cursor-pointer">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="font-bold text-gray-800">Contact Support</h3>
            <p className="text-gray-600 text-sm">Get help from our team</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition font-medium capitalize ${
                  selectedCategory === category
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Help Articles */}
        <div className="space-y-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-l-4 border-purple-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">{article.updated}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{article.title}</h3>
                    <p className="text-gray-600">{article.content}</p>
                  </div>
                  <span className="text-gray-400 ml-4">→</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or browse all categories</p>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                q: 'How do I update my profile?',
                a: 'Navigate to the Profile section from the sidebar, fill in your information, upload pictures, and click save.',
              },
              {
                q: 'What is the maximum file size for pictures?',
                a: 'The maximum file size for profile pictures is 10MB each, and you can upload up to 5 pictures.',
              },
              {
                q: 'How do I reset my password?',
                a: 'Go to Settings > Security and click "Reset Password". You will receive an email with instructions.',
              },
              {
                q: 'Can I export my profile?',
                a: 'Yes! Go to Profile > File Management and click "Export Profile" to download a JSON backup.',
              },
              {
                q: 'Is my data secure?',
                a: 'Yes, we use HTTPS encryption and follow industry-standard security practices. See Privacy Settings for more.',
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              >
                <summary className="font-semibold text-gray-800 cursor-pointer">{faq.q}</summary>
                <p className="text-gray-600 mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="mb-6">Can't find what you're looking for? Our support team is here to help.</p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-medium">
              📧 Email Support
            </button>
            <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-purple-600 transition font-medium">
              💬 Chat with us
            </button>
            <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-purple-600 transition font-medium">
              📞 Call us
            </button>
          </div>
          <p className="text-purple-100 mt-6 text-sm">
            Response time: Monday-Friday 9AM-5PM SAST | Emergency support available 24/7
          </p>
        </div>
      </div>
    </IntranetLayout>
  );
}
