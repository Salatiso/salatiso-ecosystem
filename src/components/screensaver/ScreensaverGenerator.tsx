import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Settings,
  Eye,
  Monitor,
  Smartphone,
  Tablet,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import UbuntuQuotes from './UbuntuQuotes';
import PhotoSlideshow from './PhotoSlideshow';
import type { UbuntuQuote } from './UbuntuQuotes';
import type { FamilyPhoto } from './PhotoSlideshow';

interface ScreensaverConfig {
  type: 'quotes' | 'photos' | 'mixed';
  theme: 'ubuntu' | 'family' | 'nature' | 'minimal';
  transition: 'fade' | 'slide' | 'zoom';
  interval: number;
  showClock: boolean;
  showDate: boolean;
  fontSize: 'small' | 'medium' | 'large';
  resolution: {
    width: number;
    height: number;
    device: 'desktop' | 'tablet' | 'mobile';
  };
  quotes?: {
    category?: UbuntuQuote['category'];
    language?: UbuntuQuote['language'];
  };
  photos?: {
    category?: FamilyPhoto['category'];
  };
}

const defaultConfig: ScreensaverConfig = {
  type: 'quotes',
  theme: 'ubuntu',
  transition: 'fade',
  interval: 10000,
  showClock: true,
  showDate: true,
  fontSize: 'medium',
  resolution: {
    width: 1920,
    height: 1080,
    device: 'desktop'
  }
};

interface ScreensaverGeneratorProps {
  onDownload?: (config: ScreensaverConfig) => void;
}

const ScreensaverGenerator: React.FC<ScreensaverGeneratorProps> = ({ onDownload }) => {
  const [config, setConfig] = useState<ScreensaverConfig>(defaultConfig);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const previewRef = useRef<HTMLDivElement>(null);

  const resolutions = {
    desktop: [
      { width: 1920, height: 1080, label: 'Full HD (1920x1080)' },
      { width: 2560, height: 1440, label: 'QHD (2560x1440)' },
      { width: 3840, height: 2160, label: '4K (3840x2160)' }
    ],
    tablet: [
      { width: 1024, height: 768, label: 'iPad (1024x768)' },
      { width: 2048, height: 1536, label: 'iPad Retina (2048x1536)' }
    ],
    mobile: [
      { width: 375, height: 667, label: 'iPhone SE (375x667)' },
      { width: 414, height: 896, label: 'iPhone 11 (414x896)' },
      { width: 390, height: 844, label: 'iPhone 12 (390x844)' }
    ]
  };

  const handleConfigChange = (key: keyof ScreensaverConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResolutionChange = (device: 'desktop' | 'tablet' | 'mobile', width: number, height: number) => {
    setConfig(prev => ({
      ...prev,
      resolution: { width, height, device }
    }));
  };

  const generateScreensaver = async () => {
    setIsGenerating(true);
    setGenerationStatus('generating');

    try {
      // Simulate generation process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // In a real implementation, this would:
      // 1. Generate HTML/CSS/JS bundle
      // 2. Package as executable or web app
      // 3. Create download link

      setGenerationStatus('success');
      onDownload?.(config);
    } catch (error) {
      setGenerationStatus('error');
      console.error('Screensaver generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-ubuntu font-bold text-ubuntu-warm-900 mb-2">
          Ubuntu Screensaver Generator
        </h2>
        <p className="text-ubuntu-warm-600">
          Create personalized screensavers featuring Ubuntu wisdom and family memories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-ubuntu-warm-200">
            <h3 className="text-xl font-ubuntu font-semibold text-ubuntu-warm-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-ubuntu-gold" />
              Configuration
            </h3>

            <div className="space-y-4">
              {/* Content Type */}
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                  Content Type
                </label>
                <select
                  value={config.type}
                  onChange={(e) => handleConfigChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent"
                >
                  <option value="quotes">Ubuntu Quotes Only</option>
                  <option value="photos">Family Photos Only</option>
                  <option value="mixed">Mixed (Quotes & Photos)</option>
                </select>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                  Theme
                </label>
                <select
                  value={config.theme}
                  onChange={(e) => handleConfigChange('theme', e.target.value)}
                  className="w-full px-3 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent"
                >
                  <option value="ubuntu">Ubuntu Wisdom</option>
                  <option value="family">Family Heritage</option>
                  <option value="nature">Natural Beauty</option>
                  <option value="minimal">Minimalist</option>
                </select>
              </div>

              {/* Transition */}
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                  Transition Effect
                </label>
                <select
                  value={config.transition}
                  onChange={(e) => handleConfigChange('transition', e.target.value)}
                  className="w-full px-3 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent"
                >
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="zoom">Zoom</option>
                </select>
              </div>

              {/* Interval */}
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                  Display Interval (seconds)
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={config.interval / 1000}
                  onChange={(e) => handleConfigChange('interval', parseInt(e.target.value) * 1000)}
                  className="w-full px-3 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent"
                />
              </div>

              {/* Display Options */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.showClock}
                    onChange={(e) => handleConfigChange('showClock', e.target.checked)}
                    className="text-ubuntu-gold focus:ring-ubuntu-gold"
                  />
                  <span className="ml-2 text-sm text-ubuntu-warm-700">Show Clock</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.showDate}
                    onChange={(e) => handleConfigChange('showDate', e.target.checked)}
                    className="text-ubuntu-gold focus:ring-ubuntu-gold"
                  />
                  <span className="ml-2 text-sm text-ubuntu-warm-700">Show Date</span>
                </label>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                  Font Size
                </label>
                <select
                  value={config.fontSize}
                  onChange={(e) => handleConfigChange('fontSize', e.target.value)}
                  className="w-full px-3 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Filters */}
          {(config.type === 'quotes' || config.type === 'mixed') && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-ubuntu-warm-200">
              <h4 className="font-ubuntu font-semibold text-ubuntu-warm-900 mb-4">
                Quote Settings
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                    Category
                  </label>
                  <select
                    value={config.quotes?.category || ''}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      quotes: { ...prev.quotes, category: e.target.value as UbuntuQuote['category'] || undefined }
                    }))}
                    className="w-full px-3 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    <option value="unity">Unity</option>
                    <option value="family">Family</option>
                    <option value="wisdom">Wisdom</option>
                    <option value="community">Community</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                    Language
                  </label>
                  <select
                    value={config.quotes?.language || ''}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      quotes: { ...prev.quotes, language: e.target.value as UbuntuQuote['language'] || undefined }
                    }))}
                    className="w-full px-3 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent"
                  >
                    <option value="">All Languages</option>
                    <option value="english">English</option>
                    <option value="xhosa">Xhosa</option>
                    <option value="zulu">Zulu</option>
                    <option value="afrikaans">Afrikaans</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {(config.type === 'photos' || config.type === 'mixed') && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-ubuntu-warm-200">
              <h4 className="font-ubuntu font-semibold text-ubuntu-warm-900 mb-4">
                Photo Settings
              </h4>
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                  Category
                </label>
                <select
                  value={config.photos?.category || ''}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    photos: { ...prev.photos, category: e.target.value as FamilyPhoto['category'] || undefined }
                  }))}
                  className="w-full px-3 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent"
                >
                  <option value="">All Photos</option>
                  <option value="family">Family</option>
                  <option value="events">Events</option>
                  <option value="achievements">Achievements</option>
                  <option value="memories">Memories</option>
                </select>
              </div>
            </div>
          )}

          {/* Device & Resolution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-ubuntu-warm-200">
            <h4 className="font-ubuntu font-semibold text-ubuntu-warm-900 mb-4">
              Display Settings
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                  Device Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['desktop', 'tablet', 'mobile'] as const).map(device => (
                    <button
                      key={device}
                      onClick={() => {
                        const defaultRes = resolutions[device][0];
                        handleResolutionChange(device, defaultRes.width, defaultRes.height);
                      }}
                      className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center ${
                        config.resolution.device === device
                          ? 'border-ubuntu-gold bg-ubuntu-warm-50 text-ubuntu-gold'
                          : 'border-ubuntu-warm-300 hover:border-ubuntu-warm-400'
                      }`}
                    >
                      {getDeviceIcon(device)}
                      <span className="text-xs mt-1 capitalize">{device}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                  Resolution
                </label>
                <select
                  value={`${config.resolution.width}x${config.resolution.height}`}
                  onChange={(e) => {
                    const [width, height] = e.target.value.split('x').map(Number);
                    setConfig(prev => ({
                      ...prev,
                      resolution: { ...prev.resolution, width, height }
                    }));
                  }}
                  className="w-full px-3 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent"
                >
                  {resolutions[config.resolution.device].map(res => (
                    <option key={`${res.width}x${res.height}`} value={`${res.width}x${res.height}`}>
                      {res.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-ubuntu-warm-200 overflow-hidden">
            <div className="p-4 border-b border-ubuntu-warm-200 flex items-center justify-between">
              <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-ubuntu-gold" />
                Preview
              </h3>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="px-3 py-1 text-sm bg-ubuntu-warm-100 text-ubuntu-warm-700 rounded-lg hover:bg-ubuntu-warm-200 transition-colors"
              >
                {previewMode ? 'Exit Preview' : 'Full Preview'}
              </button>
            </div>

            <div
              ref={previewRef}
              className={`relative bg-black ${previewMode ? 'h-screen' : 'h-96'}`}
              style={{
                aspectRatio: previewMode ? 'auto' : `${config.resolution.width}/${config.resolution.height}`
              }}
            >
              {config.type === 'quotes' && (
                <UbuntuQuotes
                  category={config.quotes?.category}
                  language={config.quotes?.language}
                  autoRotate={true}
                  rotationInterval={config.interval}
                />
              )}

              {config.type === 'photos' && (
                <PhotoSlideshow
                  category={config.photos?.category}
                  autoPlay={true}
                  interval={config.interval}
                  transition={config.transition}
                  showControls={!previewMode}
                />
              )}

              {config.type === 'mixed' && (
                <div className="relative w-full h-full">
                  {/* Alternating quotes and photos - simplified for preview */}
                  <UbuntuQuotes
                    category={config.quotes?.category}
                    language={config.quotes?.language}
                    autoRotate={true}
                    rotationInterval={config.interval * 2}
                  />
                </div>
              )}

              {/* Clock and Date Overlay */}
              {(config.showClock || config.showDate) && (
                <div className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-lg text-right">
                  {config.showClock && (
                    <div className="text-2xl font-mono font-bold">
                      {new Date().toLocaleTimeString()}
                    </div>
                  )}
                  {config.showDate && (
                    <div className="text-sm opacity-90">
                      {new Date().toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Generation Status */}
          {generationStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg flex items-center space-x-3 ${
                generationStatus === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : generationStatus === 'error'
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {generationStatus === 'generating' && <Loader2 className="w-5 h-5 animate-spin" />}
              {generationStatus === 'success' && <CheckCircle className="w-5 h-5" />}
              {generationStatus === 'error' && <AlertCircle className="w-5 h-5" />}

              <div>
                {generationStatus === 'generating' && <p>Generating your screensaver...</p>}
                {generationStatus === 'success' && (
                  <p>Your Ubuntu screensaver has been generated successfully!</p>
                )}
                {generationStatus === 'error' && (
                  <p>Failed to generate screensaver. Please try again.</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Generate Button */}
          <div className="mt-6 text-center">
            <button
              onClick={generateScreensaver}
              disabled={isGenerating}
              className="inline-flex items-center px-8 py-4 bg-ubuntu-gold text-white rounded-lg hover:bg-ubuntu-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-6 h-6 mr-3" />
                  Generate Screensaver
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreensaverGenerator;