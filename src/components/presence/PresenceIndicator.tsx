import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import presenceService, { UserPresence, PresenceStatus } from '@/services/PresenceService';

interface PresenceIndicatorProps {
  userId: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  userId,
  showLabel = false,
  size = 'md',
  className = ''
}) => {
  const [presence, setPresence] = useState<UserPresence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time presence updates
    const unsubscribe = presenceService.subscribeToPresence(userId, (presenceData) => {
      setPresence(presenceData);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  if (loading) {
    return null;
  }

  if (!presence) {
    return null;
  }

  const getStatusColor = (status: PresenceStatus): string => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-gray-400';
      case 'invisible':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: PresenceStatus): string => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'invisible':
        return 'Offline';
      default:
        return 'Offline';
    }
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const ringClasses = {
    sm: 'ring-1',
    md: 'ring-2',
    lg: 'ring-2'
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} rounded-full ${getStatusColor(presence.status)} ${ringClasses[size]} ring-white`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
        {presence.status === 'online' && (
          <motion.div
            className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-green-500 opacity-75`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.75, 0, 0.75],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>
      {showLabel && (
        <span className="text-xs text-gray-600">
          {presence.status === 'online' 
            ? 'Active now' 
            : presenceService.formatLastSeen(presence.lastSeen, presence.status)}
        </span>
      )}
    </div>
  );
};

export default PresenceIndicator;
