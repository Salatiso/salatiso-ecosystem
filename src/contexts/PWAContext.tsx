import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import pwaService from '@/services/PWAService';

// ==================== Types ====================

interface PWAContextType {
  isOnline: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  installApp: () => Promise<boolean>;
  offlineDataCount: number;
  syncOfflineData: () => Promise<{ synced: number; failed: number }>;
  storageUsage: number;
  storageQuota: number;
}

// ==================== Context ====================

const PWAContext = createContext<PWAContextType | undefined>(undefined);

// ==================== Provider ====================

interface PWAProviderProps {
  children: ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [offlineDataCount, setOfflineDataCount] = useState(0);
  const [storageUsage, setStorageUsage] = useState(0);
  const [storageQuota, setStorageQuota] = useState(0);

  useEffect(() => {
    // Initialize PWA
    pwaService.init();

    // Set initial status
    setIsOnline(pwaService.getOnlineStatus());
    setIsInstallable(pwaService.isInstallPromptAvailable());
    setIsInstalled(pwaService.isAppInstalled());

    // Subscribe to status changes
    pwaService.onStatusChange((status) => {
      setIsOnline(status === 'online');
    });

    pwaService.onInstallPromptReady(() => {
      setIsInstallable(true);
    });

    pwaService.onAppInstalled(() => {
      setIsInstalled(true);
      setIsInstallable(false);
    });

    // Update offline data count
    const updateOfflineCount = async () => {
      const data = await pwaService.getOfflineData();
      setOfflineDataCount(data.length);
    };

    updateOfflineCount();
    const interval = setInterval(updateOfflineCount, 5000);

    // Update storage usage
    const updateStorageUsage = async () => {
      const quota = await pwaService.getStorageQuota();
      setStorageUsage(quota.usage);
      setStorageQuota(quota.quota);
    };

    updateStorageUsage();
    const storageInterval = setInterval(updateStorageUsage, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(storageInterval);
    };
  }, []);

  const handleInstallApp = async (): Promise<boolean> => {
    return await pwaService.promptInstall();
  };

  const handleSyncOfflineData = async () => {
    return await pwaService.syncOfflineData();
  };

  const value: PWAContextType = {
    isOnline,
    isInstallable,
    isInstalled,
    installApp: handleInstallApp,
    offlineDataCount,
    syncOfflineData: handleSyncOfflineData,
    storageUsage,
    storageQuota,
  };

  return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>;
};

// ==================== Hook ====================

export const usePWA = (): PWAContextType => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within PWAProvider');
  }
  return context;
};

export default PWAProvider;
