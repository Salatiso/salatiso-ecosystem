import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const NotificationInitializer: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Only initialize if user is logged in and we're on the client side
    if (user && typeof window !== 'undefined') {
      // Dynamic import to avoid SSR issues
      import('@/services/notificationService').then(({ notificationService }) => {
        notificationService.initializeForegroundMessages();
      });
    }
  }, [user]);

  return null; // This component doesn't render anything
};

export default NotificationInitializer;