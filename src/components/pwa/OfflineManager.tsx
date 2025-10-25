import React, { useState, useEffect } from 'react';
import { usePWA } from '@/contexts/PWAContext';
import { Cloud, CloudOff, Download, Wifi, WifiOff, HardDrive, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * OfflineManager
 * Visual indicator and manager for offline capabilities
 */
export const OfflineManager: React.FC = () => {
  const {
    isOnline,
    offlineDataCount,
    syncOfflineData,
    storageUsage,
    storageQuota,
  } = usePWA();

  const [syncing, setSyncing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncOfflineData();
      console.log('Sync result:', result);
    } finally {
      setSyncing(false);
    }
  };

  const storagePercent = storageQuota > 0 ? (storageUsage / storageQuota) * 100 : 0;
  const storageLabel = formatBytes(storageUsage);
  const quotaLabel = formatBytes(storageQuota);

  if (isOnline && offlineDataCount === 0 && storagePercent < 80) {
    // All good - show minimal indicator
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-4 right-4 z-40"
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 font-medium">
          <Wifi size={14} className="text-green-600" />
          Online
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {/* Offline Banner */}
      {!isOnline && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <WifiOff size={18} className="animate-pulse" />
            <span className="font-medium">You are offline</span>
            {offlineDataCount > 0 && (
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-2">
                {offlineDataCount} changes pending
              </span>
            )}
          </div>
          {offlineDataCount > 0 && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className="text-xs font-semibold bg-white/20 hover:bg-white/30 disabled:bg-white/10 px-3 py-1 rounded transition-colors"
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          )}
        </motion.div>
      )}

      {/* Storage Warning */}
      {storagePercent > 80 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="fixed top-16 right-4 z-40 max-w-sm"
        >
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <HardDrive size={16} className="text-red-600" />
              <span className="font-medium text-red-900 text-sm">Storage Low</span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(storagePercent, 100)}%` }}
              />
            </div>
            <div className="text-xs text-red-700">
              {storageLabel} / {quotaLabel} used
            </div>
          </div>
        </motion.div>
      )}

      {/* Offline Data Status */}
      {offlineDataCount > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="fixed bottom-4 right-4 z-40 max-w-sm"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-2">
              <CloudOff size={16} className="text-blue-600" />
              <span className="font-medium text-blue-900 text-sm">
                {offlineDataCount} changes pending sync
              </span>
            </div>

            <div className="space-y-1 text-xs text-blue-700">
              <p>Your changes are saved locally and will sync when online.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex-1 text-xs px-2 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors font-medium"
              >
                {showDetails ? 'Hide' : 'Details'}
              </button>

              {isOnline && (
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1.5 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 rounded transition-colors font-medium"
                >
                  {syncing ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Download size={12} />
                      Sync Now
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * OnlineIndicator
 * Simple online/offline indicator badge
 */
export const OnlineIndicator: React.FC = () => {
  const { isOnline } = usePWA();

  return (
    <motion.div
      layout
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
        isOnline
          ? 'bg-green-100 text-green-700'
          : 'bg-amber-100 text-amber-700 animate-pulse'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi size={12} />
          Online
        </>
      ) : (
        <>
          <WifiOff size={12} />
          Offline
        </>
      )}
    </motion.div>
  );
};

/**
 * StorageIndicator
 * Display storage usage with progress bar
 */
export const StorageIndicator: React.FC = () => {
  const { storageUsage, storageQuota } = usePWA();

  if (storageQuota === 0) return null;

  const percent = (storageUsage / storageQuota) * 100;
  const isWarning = percent > 80;
  const isCritical = percent > 95;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 font-medium text-gray-700">
          <HardDrive size={14} />
          Storage
        </div>
        <span className="text-gray-600">
          {formatBytes(storageUsage)} / {formatBytes(storageQuota)}
        </span>
      </div>

      <div className={`w-full h-2 rounded-full overflow-hidden ${
        isCritical
          ? 'bg-red-200'
          : isWarning
          ? 'bg-amber-200'
          : 'bg-green-200'
      }`}>
        <motion.div
          className={`h-full transition-all ${
            isCritical
              ? 'bg-red-600'
              : isWarning
              ? 'bg-amber-600'
              : 'bg-green-600'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percent, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="text-xs text-gray-500">
        {percent.toFixed(1)}% used
        {isCritical && ' - Storage critical'}
        {isWarning && !isCritical && ' - Storage low'}
      </div>
    </div>
  );
};

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export default OfflineManager;
