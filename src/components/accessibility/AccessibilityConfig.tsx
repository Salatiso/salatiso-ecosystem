import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilitySettings {
  // Visual preferences
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;

  // Focus and navigation
  focusVisible: boolean;
  skipLinks: boolean;

  // Screen reader support
  screenReaderOptimized: boolean;
  announcePageChanges: boolean;

  // Color preferences
  colorScheme: 'default' | 'deuteranopia' | 'protanopia' | 'tritanopia';

  // Language and content
  preferredLanguage: string;
  simplifyContent: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
  isHighContrast: boolean;
  isReducedMotion: boolean;
  isLargeText: boolean;
  isScreenReaderOptimized: boolean;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  focusVisible: true,
  skipLinks: true,
  screenReaderOptimized: false,
  announcePageChanges: true,
  colorScheme: 'default',
  preferredLanguage: 'en',
  simplifyContent: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
  initialSettings?: Partial<AccessibilitySettings>;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
  initialSettings = {},
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    ...defaultSettings,
    ...initialSettings,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('accessibility-settings');
      if (saved) {
        try {
          const parsedSettings = JSON.parse(saved);
          setSettings(prev => ({ ...prev, ...parsedSettings }));
        } catch (error) {
          console.warn('Failed to parse accessibility settings from localStorage:', error);
        }
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    }
  }, [settings]);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Large text
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Screen reader optimization
    if (settings.screenReaderOptimized) {
      root.classList.add('sr-optimized');
    } else {
      root.classList.remove('sr-optimized');
    }

    // Color scheme
    root.setAttribute('data-color-scheme', settings.colorScheme);

    // Focus visible
    if (settings.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }

  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    resetSettings,
    isHighContrast: settings.highContrast,
    isReducedMotion: settings.reducedMotion,
    isLargeText: settings.largeText,
    isScreenReaderOptimized: settings.screenReaderOptimized,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// Accessibility Settings Panel Component
interface AccessibilitySettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const AccessibilitySettingsPanel: React.FC<AccessibilitySettingsPanelProps> = ({
  isOpen,
  onClose,
  className = '',
}) => {
  const { settings, updateSetting, resetSettings } = useAccessibility();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="accessibility-settings-title">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 id="accessibility-settings-title" className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Accessibility Settings
                </h3>

                <div className="space-y-6">
                  {/* Visual Preferences */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Visual Preferences</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.highContrast}
                          onChange={(e) => updateSetting('highContrast', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">High contrast mode</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.reducedMotion}
                          onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Reduce motion and animations</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.largeText}
                          onChange={(e) => updateSetting('largeText', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Large text</span>
                      </label>
                    </div>
                  </div>

                  {/* Navigation Preferences */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Navigation</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.focusVisible}
                          onChange={(e) => updateSetting('focusVisible', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Show focus indicators</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.skipLinks}
                          onChange={(e) => updateSetting('skipLinks', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Show skip navigation links</span>
                      </label>
                    </div>
                  </div>

                  {/* Screen Reader Support */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Screen Reader Support</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.screenReaderOptimized}
                          onChange={(e) => updateSetting('screenReaderOptimized', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Screen reader optimized</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.announcePageChanges}
                          onChange={(e) => updateSetting('announcePageChanges', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Announce page changes</span>
                      </label>
                    </div>
                  </div>

                  {/* Color Vision */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Color Vision</h4>
                    <select
                      value={settings.colorScheme}
                      onChange={(e) => updateSetting('colorScheme', e.target.value as AccessibilitySettings['colorScheme'])}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                      <option value="default">Default</option>
                      <option value="deuteranopia">Deuteranopia (green-weak)</option>
                      <option value="protanopia">Protanopia (red-weak)</option>
                      <option value="tritanopia">Tritanopia (blue-weak)</option>
                    </select>
                  </div>

                  {/* Content Preferences */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Content</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.simplifyContent}
                          onChange={(e) => updateSetting('simplifyContent', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Simplify content and language</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Done
            </button>
            <button
              type="button"
              onClick={resetSettings}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Accessibility Toolbar Component (floating accessibility menu)
interface AccessibilityToolbarProps {
  className?: string;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  className = '',
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { settings, updateSetting } = useAccessibility();

  // Prevent hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2">
          <div className="flex flex-col space-y-2">
            {/* Quick toggles */}
            <button
              onClick={() => updateSetting('highContrast', !settings.highContrast)}
              className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                settings.highContrast ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label={settings.highContrast ? 'Disable high contrast' : 'Enable high contrast'}
              title={settings.highContrast ? 'Disable high contrast' : 'Enable high contrast'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>

            <button
              onClick={() => updateSetting('largeText', !settings.largeText)}
              className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                settings.largeText ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label={settings.largeText ? 'Disable large text' : 'Enable large text'}
              title={settings.largeText ? 'Disable large text' : 'Enable large text'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>

            <button
              onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
              className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                settings.reducedMotion ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label={settings.reducedMotion ? 'Enable animations' : 'Disable animations'}
              title={settings.reducedMotion ? 'Enable animations' : 'Disable animations'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 11H15m-3 7.5A9.5 9.5 0 1121.5 12 9.5 9.5 0 0112 2.5" />
              </svg>
            </button>

            {/* Settings button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Open accessibility settings"
              title="Accessibility settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AccessibilitySettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};