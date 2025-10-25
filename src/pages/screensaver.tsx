import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Sparkles,
  Heart,
  Users,
  BookOpen,
  Monitor,
  Smartphone,
  Tablet,
  Star,
  Clock,
  Loader2
} from 'lucide-react';
import ScreensaverGenerator from '@/components/screensaver/ScreensaverGenerator';
import UbuntuQuotes from '@/components/screensaver/UbuntuQuotes';
import PhotoSlideshow from '@/components/screensaver/PhotoSlideshow';

interface ScreensaverTemplate {
  id: string;
  name: string;
  description: string;
  type: 'quotes' | 'photos' | 'mixed';
  preview: string;
  downloads: number;
  rating: number;
  featured?: boolean;
}

const screensaverTemplates: ScreensaverTemplate[] = [
  {
    id: 'ubuntu-wisdom',
    name: 'Ubuntu Wisdom',
    description: 'Inspiring quotes from Ubuntu philosophy with elegant typography',
    type: 'quotes',
    preview: 'quotes',
    downloads: 1247,
    rating: 4.8,
    featured: true
  },
  {
    id: 'family-memories',
    name: 'Family Memories',
    description: 'Beautiful slideshow of family photos and milestones',
    type: 'photos',
    preview: 'photos',
    downloads: 892,
    rating: 4.9,
    featured: true
  },
  {
    id: 'ubuntu-journey',
    name: 'Ubuntu Journey',
    description: 'Alternating Ubuntu quotes and family photos',
    type: 'mixed',
    preview: 'mixed',
    downloads: 654,
    rating: 4.7,
    featured: true
  },
  {
    id: 'daily-inspiration',
    name: 'Daily Inspiration',
    description: 'Motivational Ubuntu quotes for daily reflection',
    type: 'quotes',
    preview: 'quotes',
    downloads: 523,
    rating: 4.6
  },
  {
    id: 'heritage-gallery',
    name: 'Heritage Gallery',
    description: 'Curated collection of family heritage photos',
    type: 'photos',
    preview: 'photos',
    downloads: 445,
    rating: 4.8
  }
];

const UbuntuScreensaverPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse');
  const [selectedTemplate, setSelectedTemplate] = useState<ScreensaverTemplate | null>(null);

  const handleDownload = (template: ScreensaverTemplate) => {
    // In a real implementation, this would trigger the actual download
    console.log('Downloading template:', template.name);
    // For now, just show an alert
    alert(`Downloading "${template.name}" screensaver...\n\nThis feature will be fully implemented with actual downloadable files.`);
  };

  const renderPreview = (template: ScreensaverTemplate) => {
    const previewStyle = {
      width: '100%',
      height: '200px',
      borderRadius: '8px',
      overflow: 'hidden',
      background: '#000'
    };

    switch (template.preview) {
      case 'quotes':
        return (
          <div style={previewStyle}>
            <UbuntuQuotes autoRotate={false} />
          </div>
        );
      case 'photos':
        return (
          <div style={previewStyle}>
            <PhotoSlideshow autoPlay={false} showControls={false} />
          </div>
        );
      case 'mixed':
        return (
          <div style={previewStyle}>
            <UbuntuQuotes autoRotate={false} />
          </div>
        );
      default:
        return (
          <div style={previewStyle} className="flex items-center justify-center bg-ubuntu-warm-100">
            <Sparkles className="w-8 h-8 text-ubuntu-gold" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-ubuntu-warm-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-ubuntu-warm-900 to-ubuntu-warm-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-ubuntu font-bold mb-4"
            >
              Ubuntu Screensavers
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-ubuntu-warm-200 mb-8 max-w-3xl mx-auto"
            >
              Transform your screen into a source of inspiration with Ubuntu wisdom and family memories
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'browse'
                    ? 'bg-ubuntu-gold text-ubuntu-warm-900'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Browse Templates
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'create'
                    ? 'bg-ubuntu-gold text-ubuntu-warm-900'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Create Custom
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'browse' ? (
          <>
            {/* Featured Templates */}
            <div className="mb-12">
              <h2 className="text-3xl font-ubuntu font-bold text-ubuntu-warm-900 mb-8 text-center">
                Featured Screensavers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {screensaverTemplates.filter(t => t.featured).map(template => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-ubuntu-warm-200"
                  >
                    {/* Preview */}
                    <div className="relative">
                      {renderPreview(template)}
                      <div className="absolute top-2 right-2">
                        <span className="bg-ubuntu-gold text-ubuntu-warm-900 px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-ubuntu font-semibold text-ubuntu-warm-900 mb-2">
                        {template.name}
                      </h3>
                      <p className="text-ubuntu-warm-600 mb-4">
                        {template.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-ubuntu-warm-500">
                          <div className="flex items-center">
                            <Download className="w-4 h-4 mr-1" />
                            {template.downloads.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            {template.rating}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {template.type === 'quotes' && <BookOpen className="w-4 h-4 text-blue-500" />}
                          {template.type === 'photos' && <Heart className="w-4 h-4 text-red-500" />}
                          {template.type === 'mixed' && <Users className="w-4 h-4 text-purple-500" />}
                        </div>
                      </div>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(template)}
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-ubuntu-gold text-white rounded-lg hover:bg-ubuntu-gold/90 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Free
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* All Templates */}
            <div>
              <h2 className="text-3xl font-ubuntu font-bold text-ubuntu-warm-900 mb-8 text-center">
                All Screensavers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {screensaverTemplates.map(template => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Preview */}
                    <div className="relative">
                      {renderPreview(template)}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900 mb-1">
                        {template.name}
                      </h3>
                      <p className="text-ubuntu-warm-600 text-sm mb-3">
                        {template.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3 text-xs text-ubuntu-warm-500">
                          <div className="flex items-center">
                            <Download className="w-3 h-3 mr-1" />
                            {template.downloads.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            {template.rating}
                          </div>
                        </div>
                      </div>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(template)}
                        className="w-full inline-flex items-center justify-center px-3 py-2 bg-ubuntu-gold text-white rounded-lg hover:bg-ubuntu-gold/90 transition-colors text-sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Custom Creator */
          <ScreensaverGenerator
            onDownload={(config) => {
              console.log('Custom screensaver config:', config);
              alert('Custom screensaver generation will be implemented with actual downloadable files.');
            }}
          />
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-ubuntu font-bold text-ubuntu-warm-900 mb-4">
              Why Ubuntu Screensavers?
            </h2>
            <p className="text-ubuntu-warm-600 max-w-2xl mx-auto">
              Transform idle screen time into meaningful moments of reflection and connection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-ubuntu-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-ubuntu font-semibold text-ubuntu-warm-900 mb-2">
                Ubuntu Wisdom
              </h3>
              <p className="text-ubuntu-warm-600">
                Daily inspiration from Ubuntu philosophy and African wisdom traditions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-ubuntu-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-ubuntu font-semibold text-ubuntu-warm-900 mb-2">
                Family Connection
              </h3>
              <p className="text-ubuntu-warm-600">
                Celebrate family memories and milestones with beautiful photo displays
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-ubuntu-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-ubuntu font-semibold text-ubuntu-warm-900 mb-2">
                Cultural Heritage
              </h3>
              <p className="text-ubuntu-warm-600">
                Preserve and share African cultural values through digital art
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Device Compatibility */}
      <div className="bg-ubuntu-warm-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-ubuntu font-bold text-ubuntu-warm-900 mb-4">
              Works on All Devices
            </h2>
            <p className="text-ubuntu-warm-600">
              Download screensavers optimized for desktop, tablet, and mobile
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-ubuntu-warm-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-10 h-10 text-ubuntu-warm-700" />
              </div>
              <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900 mb-2">
                Desktop & Laptop
              </h3>
              <p className="text-ubuntu-warm-600 text-sm">
                Full HD, QHD, and 4K resolutions available
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-ubuntu-warm-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tablet className="w-10 h-10 text-ubuntu-warm-700" />
              </div>
              <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900 mb-2">
                Tablet
              </h3>
              <p className="text-ubuntu-warm-600 text-sm">
                Optimized for iPad and Android tablets
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-ubuntu-warm-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-10 h-10 text-ubuntu-warm-700" />
              </div>
              <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900 mb-2">
                Mobile
              </h3>
              <p className="text-ubuntu-warm-600 text-sm">
                Beautiful screensavers for all smartphones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UbuntuScreensaverPage;