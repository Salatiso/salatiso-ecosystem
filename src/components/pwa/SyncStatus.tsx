import React, { useState, useEffect } from 'react';
import { usePWA } from '@/contexts/PWAContext';
import pwaService from '@/services/PWAService';
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SyncStatus
 * Display sync status and history
 */
export const SyncStatus: React.FC = () => {
  const { isOnline, offlineDataCount, syncOfflineData } = usePWA();
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncHistory, setSyncHistory] = useState<
    Array<{ id: string; type: string; status: 'success' | 'failed'; timestamp: Date }>
  >([]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncOfflineData();

      // Add to history
      setSyncHistory((prev) => [
        {
          id: `sync-${Date.now()}`,
          type: `${result.synced} items synced, ${result.failed} failed`,
          status: result.failed === 0 ? 'success' : 'failed',
          timestamp: new Date(),
        },
        ...prev.slice(0, 9),
      ]);

      setLastSync(new Date());
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Sync Button */}
      <button
        onClick={handleSync}
        disabled={syncing || !isOnline || offlineDataCount === 0}
        className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
      >
        {syncing ? (
          <>
            <RefreshCw size={18} className="animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            <RefreshCw size={18} />
            Sync Now
          </>
        )}
      </button>

      {/* Status Info */}
      <div className="space-y-2">
        {offlineDataCount > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-700 text-sm font-medium">
              <Clock size={16} />
              {offlineDataCount} changes waiting to sync
            </div>
            <p className="text-xs text-amber-600 mt-1">
              {isOnline
                ? 'Ready to sync. Click button above.'
                : 'You are offline. Changes will sync when back online.'}
            </p>
          </div>
        )}

        {lastSync && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
              <CheckCircle size={16} />
              Last synced
            </div>
            <p className="text-xs text-green-600 mt-1">
              {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        )}
      </div>

      {/* Sync History */}
      {syncHistory.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            Sync History
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            <AnimatePresence>
              {syncHistory.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`p-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    item.status === 'success'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {item.status === 'success' ? (
                    <CheckCircle size={14} />
                  ) : (
                    <AlertCircle size={14} />
                  )}
                  <div className="flex-1">
                    <p>{item.type}</p>
                    <p className="text-xs opacity-75">
                      {item.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * SyncBadge
 * Minimal sync status badge
 */
export const SyncBadge: React.FC = () => {
  const { isOnline, offlineDataCount } = usePWA();

  if (isOnline && offlineDataCount === 0) {
    return null;
  }

  return (
    <motion.div
      layout
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        offlineDataCount > 0
          ? 'bg-amber-100 text-amber-700'
          : 'bg-green-100 text-green-700'
      }`}
    >
      {offlineDataCount > 0 ? (
        <>
          <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
          {offlineDataCount} pending
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-green-600 rounded-full" />
          Synced
        </>
      )}
    </motion.div>
  );
};

/**
 * SyncProgress
 * Display sync progress
 */
export const SyncProgress: React.FC = () => {
  const { offlineDataCount, syncOfflineData } = usePWA();
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSync = async () => {
    setSyncing(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 100);

    try {
      await syncOfflineData();
      setProgress(100);
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setSyncing(false);
        setProgress(0);
      }, 1000);
    }
  };

  if (offlineDataCount === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Sync Progress</span>
        <span className="text-xs text-gray-500">{progress}%</span>
      </div>

      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {syncing ? (
        <div className="text-xs text-gray-600 text-center">Syncing your changes...</div>
      ) : (
        <button
          onClick={handleSync}
          className="w-full px-3 py-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Sync Now
        </button>
      )}
    </div>
  );
};

export default SyncStatus;
