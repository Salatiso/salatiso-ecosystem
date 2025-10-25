import React, { useState } from 'react';
import { usePWA } from '@/contexts/PWAContext';
import { Download, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * InstallPrompt
 * App install prompt for PWA installation
 */
export const InstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [installed, setInstalled] = useState(isInstalled);
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);

  if (dismissed || installed || !isInstallable) {
    return null;
  }

  const handleInstall = async () => {
    setInstalling(true);
    try {
      const success = await installApp();
      if (success) {
        setInstalled(true);
      }
    } finally {
      setInstalling(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-shrink-0 p-2 bg-white/20 rounded-lg">
              <Download size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-0.5">Install Salatiso App</h3>
              <p className="text-sm text-blue-100">
                Get the app on your device for a better experience. Works offline too!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <button
              onClick={handleInstall}
              disabled={installing}
              className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 disabled:bg-gray-200 disabled:text-gray-500 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
            >
              {installing ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Installing...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Install
                </>
              )}
            </button>

            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * InstalledBadge
 * Shows when app is installed
 */
export const InstalledBadge: React.FC = () => {
  const { isInstalled } = usePWA();

  if (!isInstalled) {
    return null;
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold"
    >
      <CheckCircle size={14} />
      App Installed
    </motion.div>
  );
};

/**
 * MobileAppBanner
 * Full banner promoting mobile app installation
 */
export const MobileAppBanner: React.FC<{ dismissible?: boolean }> = ({
  dismissible = true,
}) => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);

  if (dismissed || isInstalled || !isInstallable) {
    return null;
  }

  const handleInstall = async () => {
    setInstalling(true);
    try {
      await installApp();
    } finally {
      setInstalling(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="m-4 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative"
      >
        {/* Background decoration */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">Get the Salatiso App</h2>
            <p className="text-blue-100 text-sm sm:text-base">
              ✨ Works offline • 📱 Better mobile experience • ⚡ Lightning fast
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full">
                ✓ Notifications
              </div>
              <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full">
                ✓ Offline mode
              </div>
              <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full">
                ✓ Home screen
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:flex-col">
            <button
              onClick={handleInstall}
              disabled={installing}
              className="flex-1 sm:w-48 px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 disabled:bg-gray-200 disabled:text-gray-500 rounded-xl font-bold text-sm sm:text-base transition-all hover:shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
            >
              {installing ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Installing...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Install App
                </>
              )}
            </button>

            {dismissible && (
              <button
                onClick={() => setDismissed(true)}
                className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-sm font-medium"
              >
                Later
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * UpdateNotification
 * Notify user of app updates
 */
export const UpdateNotification: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Listen for service worker updates
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdate(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    setUpdating(true);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        registration?.unregister();
        window.location.reload();
      });
    }
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50"
      >
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4 shadow-lg">
          <h3 className="font-semibold text-blue-900 mb-1">Update Available</h3>
          <p className="text-sm text-blue-700 mb-3">
            A new version of Salatiso is available. Restart to update.
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="flex-1 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-1"
            >
              {updating ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Now'
              )}
            </button>

            <button
              onClick={() => setShowUpdate(false)}
              className="px-3 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg font-medium text-sm transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;
