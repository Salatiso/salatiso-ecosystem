import React from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, Database } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';

interface OfflineIndicatorProps {
  className?: string;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
  const { isOnline, isServiceWorkerRegistered, cachedDocuments, offlineActions } = useOffline();

  if (isOnline && offlineActions.length === 0) {
    return null; // Don't show anything when fully online with no pending actions
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className={`rounded-lg shadow-lg border p-3 max-w-sm ${
        isOnline
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-yellow-50 border-yellow-200 text-yellow-800'
      }`}>
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-yellow-600" />
          )}

          <div className="flex-1">
            <div className="font-medium text-sm">
              {isOnline ? 'Online' : 'Offline Mode'}
            </div>

            {isServiceWorkerRegistered && (
              <div className="text-xs opacity-75 flex items-center space-x-3 mt-1">
                <span className="flex items-center">
                  <Database className="w-3 h-3 mr-1" />
                  {cachedDocuments.length} cached
                </span>

                {offlineActions.length > 0 && (
                  <span className="flex items-center">
                    {isOnline ? (
                      <Cloud className="w-3 h-3 mr-1" />
                    ) : (
                      <CloudOff className="w-3 h-3 mr-1" />
                    )}
                    {offlineActions.length} pending
                  </span>
                )}
              </div>
            )}

            {!isOnline && (
              <div className="text-xs opacity-75 mt-1">
                Your progress will sync when connection returns
              </div>
            )}
          </div>
        </div>

        {/* Progress bar for pending actions */}
        {offlineActions.length > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  isOnline ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: isOnline ? '100%' : '0%' }}
              />
            </div>
            <div className="text-xs mt-1 opacity-75">
              {isOnline ? 'Syncing...' : 'Will sync when online'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;