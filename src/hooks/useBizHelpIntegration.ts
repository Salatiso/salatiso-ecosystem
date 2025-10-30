/**
 * useBizHelpIntegration Hook
 * 
 * Manages BizHelp business data and activity logging
 * with real-time sync capabilities
 * 
 * @hook useBizHelpIntegration
 */

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  subscribeToBizHelpBusiness,
  subscribeToBusinessActivities,
  BizHelpBusiness,
  BusinessActivity,
  ActivityLogger,
} from '@/services/bizHelpIntegration';

interface UseBizHelpIntegrationReturn {
  business: BizHelpBusiness | null;
  activities: BusinessActivity[];
  loading: boolean;
  error: string | null;
  activityLogger: ActivityLogger | null;
  refresh: () => void;
}

/**
 * Hook for accessing BizHelp business data and logging activities
 * 
 * @param companyId - The company ID to sync data for
 * @returns Business data, activities, and activity logger
 */
export const useBizHelpIntegration = (companyId?: string): UseBizHelpIntegrationReturn => {
  const { user } = useAuth();
  const [business, setBusiness] = useState<BizHelpBusiness | null>(null);
  const [activities, setActivities] = useState<BusinessActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: any) => {
    const errorMessage = err?.message || 'Failed to load BizHelp data';
    setError(errorMessage);
    console.error('BizHelp integration error:', err);
  }, []);

  useEffect(() => {
    if (!user || !companyId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to business data
    const unsubscribeBusiness = subscribeToBizHelpBusiness(
      companyId,
      (data) => {
        setBusiness(data);
      },
      handleError
    );

    // Subscribe to activities
    const unsubscribeActivities = subscribeToBusinessActivities(
      user.id,
      companyId,
      (data) => {
        setActivities(data);
      },
      handleError
    );

    setLoading(false);

    return () => {
      unsubscribeBusiness();
      unsubscribeActivities();
    };
  }, [user, companyId, handleError]);

  const activityLogger = user && companyId ? new ActivityLogger(user.id, companyId) : null;

  const refresh = useCallback(() => {
    if (companyId && user) {
      // Trigger a re-subscription to refresh data
      setLoading(true);
    }
  }, [companyId, user]);

  return {
    business,
    activities,
    loading,
    error,
    activityLogger,
    refresh,
  };
};

export default useBizHelpIntegration;
