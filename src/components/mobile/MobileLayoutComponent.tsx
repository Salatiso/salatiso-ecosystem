import React, { useState, useEffect } from 'react';
import { Menu, X, Home, AlertCircle, BarChart3, Users, Clock, TrendingUp, Settings } from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  screenWidth: number;
  screenHeight: number;
  isLandscape: boolean;
  platform: 'ios' | 'android' | 'web';
}

const MobileLayoutComponent: React.FC<MobileLayoutProps> = ({ 
  children, 
  currentTab = 'home', 
  onTabChange 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    isLandscape: false,
    platform: 'web',
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isLandscape = width > height;

      // Detect platform
      let platform: 'ios' | 'android' | 'web' = 'web';
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        platform = 'ios';
      } else if (/Android/.test(navigator.userAgent)) {
        platform = 'android';
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        screenWidth: width,
        screenHeight: height,
        isLandscape,
        platform,
      });

      setIsPortrait(!isLandscape);
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  // Safe area insets for notched devices (iOS)
  const safeAreaInsets = {
    top: 'max(0px, env(safe-area-inset-top))',
    right: 'max(0px, env(safe-area-inset-right))',
    bottom: 'max(0px, env(safe-area-inset-bottom))',
    left: 'max(0px, env(safe-area-inset-left))',
  };

  const bottomTabBarHeight = 'calc(60px + max(0px, env(safe-area-inset-bottom)))';
  const topBarHeight = 'calc(56px + max(0px, env(safe-area-inset-top)))';

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'escalations', label: 'Escalations', icon: AlertCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'more', label: 'More', icon: Settings },
  ];

  const handleTabChange = (tabId: string) => {
    onTabChange?.(tabId);
    setIsMobileMenuOpen(false);
  };

  // Show bottom tabs only on mobile
  const showBottomTabs = deviceInfo.isMobile;

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        paddingTop: `var(--sat, ${safeAreaInsets.top})`,
        paddingRight: `var(--sar, ${safeAreaInsets.right})`,
        paddingBottom: `var(--sab, ${safeAreaInsets.bottom})`,
        paddingLeft: `var(--sal, ${safeAreaInsets.left})`,
        overflow: 'hidden',
        backgroundColor: '#f9fafb',
      }}
      className="mobile-layout"
    >
      {/* Top Status Bar (Mobile) */}
      {deviceInfo.isMobile && (
        <div className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white text-sm z-50 border-b border-blue-700">
          <span className="font-semibold">Salatiso</span>
          <span className="text-xs opacity-75">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )}

      {/* Mobile Header with Menu Toggle */}
      {deviceInfo.isMobile && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 z-40">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
          
          <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
            U
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {deviceInfo.isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity">
          <div 
            className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg overflow-y-auto"
            onClick={e => e.stopPropagation()}
            style={{ top: topBarHeight }}
          >
            <div className="p-4 space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                      currentTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              <hr className="my-4" />
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium">
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{
          paddingBottom: showBottomTabs ? bottomTabBarHeight : '0',
        }}
      >
        {/* For non-mobile, show desktop layout */}
        {!deviceInfo.isMobile && (
          <div className="h-full">
            {children}
          </div>
        )}

        {/* For mobile, show responsive layout */}
        {deviceInfo.isMobile && (
          <div className="p-4 pb-8">
            {children}
          </div>
        )}
      </div>

      {/* Bottom Tab Navigation (Mobile Only) */}
      {showBottomTabs && (
        <div 
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40"
          style={{
            paddingBottom: `max(0px, env(safe-area-inset-bottom))`,
            paddingLeft: `max(0px, env(safe-area-inset-left))`,
            paddingRight: `max(0px, env(safe-area-inset-right))`,
          }}
        >
          <div className="flex justify-around">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors border-t-2 ${
                    currentTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600'
                  }`}
                  aria-label={tab.label}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Device Info Badge (Debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 right-4 text-xs bg-black text-white p-2 rounded z-50 font-mono max-w-xs">
          <div>Mobile: {deviceInfo.isMobile ? '✓' : '✗'}</div>
          <div>Tablet: {deviceInfo.isTablet ? '✓' : '✗'}</div>
          <div>Size: {deviceInfo.screenWidth}x{deviceInfo.screenHeight}</div>
          <div>Platform: {deviceInfo.platform}</div>
          <div>Orientation: {deviceInfo.isLandscape ? 'Landscape' : 'Portrait'}</div>
        </div>
      )}
    </div>
  );
};

export default MobileLayoutComponent;

// Utility hook for component consumption
export const useMobileDetect = () => {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    screenWidth: 0,
    screenHeight: 0,
    isLandscape: false,
    platform: 'web',
  });

  React.useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isLandscape = width > height;

      let platform: 'ios' | 'android' | 'web' = 'web';
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        platform = 'ios';
      } else if (/Android/.test(navigator.userAgent)) {
        platform = 'android';
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        screenWidth: width,
        screenHeight: height,
        isLandscape,
        platform,
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};
