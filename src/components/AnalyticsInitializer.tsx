import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';

const AnalyticsInitializer: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { trackPageView, trackSessionStart, trackSessionEnd } = useAnalytics();

  // Track page views
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, trackPageView]);

  // Track initial page view
  useEffect(() => {
    trackPageView(router.pathname);
  }, [router.pathname, trackPageView]);

  // Track session start/end
  useEffect(() => {
    let sessionStartTime = Date.now();

    trackSessionStart();

    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - sessionStartTime;
      trackSessionEnd(sessionDuration / 1000); // Convert to seconds
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const sessionDuration = Date.now() - sessionStartTime;
        trackSessionEnd(sessionDuration / 1000);
      } else if (document.visibilityState === 'visible') {
        sessionStartTime = Date.now();
        trackSessionStart();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackSessionStart, trackSessionEnd]);

  // Track user login/logout
  useEffect(() => {
    if (user) {
      // User logged in - could track login here if needed
      // The login tracking is handled in the login components
    }
  }, [user]);

  return null; // This component doesn't render anything
};

export default AnalyticsInitializer;