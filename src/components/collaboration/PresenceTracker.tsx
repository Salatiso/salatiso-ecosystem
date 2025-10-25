import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import collaborationService, { PresenceInfo } from '@/services/CollaborationService';
import { Circle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PresenceTrackerProps {
  eventId: string;
  showLabels?: boolean;
  compact?: boolean;
  onPresenceChange?: (users: PresenceInfo[]) => void;
}

/**
 * PresenceTracker
 * Real-time user presence indicator showing who's viewing/editing the event
 */
export const PresenceTracker: React.FC<PresenceTrackerProps> = ({
  eventId,
  showLabels = true,
  compact = false,
  onPresenceChange,
}) => {
  const { user } = useAuth();
  const [presence, setPresence] = useState<PresenceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  // Subscribe to presence updates
  useEffect(() => {
    if (!user) return;

    // Set own presence
    collaborationService.setUserPresence(eventId, user.id, 'online', user.displayName);

    setLoading(true);

    const unsubscribe = collaborationService.subscribeToPresence(
      eventId,
      (presenceList) => {
        // Filter out current user from list
        const otherUsers = presenceList.filter((p) => p.userId !== user.id);
        setPresence(otherUsers);
        setLoading(false);

        if (onPresenceChange) {
          onPresenceChange(otherUsers);
        }
      },
      (error) => {
        console.error('Failed to load presence:', error);
        setLoading(false);
      }
    );

    // Cleanup - set offline when component unmounts
    return () => {
      unsubscribe();
      collaborationService.setUserPresence(eventId, user.id, 'offline', user.displayName);
    };
  }, [eventId, user, onPresenceChange]);

  const statusColor = (status: string): string => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300';
    }
  };

  const statusLabel = (status: string): string => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'offline':
        return 'Offline';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg animate-pulse">
        <div className="w-3 h-3 bg-gray-300 rounded-full" />
        <div className="text-xs text-gray-400">Loading presence...</div>
      </div>
    );
  }

  const onlineCount = presence.filter((p) => p.status === 'online').length;
  const awayCount = presence.filter((p) => p.status === 'away').length;
  const totalCount = presence.length;

  if (compact) {
    // Compact view - just avatars with count
    return (
      <div className="flex items-center gap-2">
        {presence.slice(0, 3).map((user) => (
          <motion.div
            key={user.userId}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="relative"
            title={user.userName}
          >
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-md">
              {user.userName.charAt(0)}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${statusColor(user.status)} rounded-full border-2 border-white`} />
          </motion.div>
        ))}
        {totalCount > 3 && (
          <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-semibold">
            +{totalCount - 3}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <span>👥 Active Users</span>
          <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {totalCount}
          </span>
        </h3>
      </div>

      {/* Status Summary */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <Circle size={8} className="text-green-500 fill-green-500" />
          <span className="text-gray-600">
            {onlineCount} Online
          </span>
        </div>
        {awayCount > 0 && (
          <div className="flex items-center gap-1.5">
            <Circle size={8} className="text-yellow-500 fill-yellow-500" />
            <span className="text-gray-600">
              {awayCount} Away
            </span>
          </div>
        )}
      </div>

      {/* User List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {presence.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4 text-gray-400 text-sm"
            >
              No other users online
            </motion.div>
          ) : (
            presence.map((presenceUser) => (
              <motion.div
                key={presenceUser.userId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {presenceUser.userName.charAt(0)}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusColor(
                        presenceUser.status
                      )} rounded-full border-2 border-white`}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">
                      {presenceUser.userName}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusColor(presenceUser.status)}`} />
                      <span>{statusLabel(presenceUser.status)}</span>
                      {presenceUser.isTyping && (
                        <span className="ml-1 flex items-center gap-0.5">
                          <Zap size={10} className="text-yellow-600" />
                          typing...
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Time */}
                <div className="text-xs text-gray-400 ml-2">
                  {new Date(presenceUser.lastSeen).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Current User Info */}
      <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
        <div className="flex items-center gap-1.5 px-2 py-1.5 bg-blue-50 rounded">
          <Circle size={6} className="text-green-500 fill-green-500" />
          <span>You are online</span>
        </div>
      </div>
    </div>
  );
};

/**
 * CompactPresenceIndicator
 * Minimal presence indicator for sidebars or headers
 */
export const CompactPresenceIndicator: React.FC<{
  eventId: string;
  threshold?: number;
}> = ({ eventId, threshold = 5 }) => {
  const { user } = useAuth();
  const [presence, setPresence] = useState<PresenceInfo[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = collaborationService.subscribeToPresence(
      eventId,
      (presenceList) => {
        setPresence(presenceList.filter((p) => p.userId !== user.id));
      }
    );

    return unsubscribe;
  }, [eventId, user]);

  const onlineCount = presence.filter((p) => p.status === 'online').length;

  if (onlineCount === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 rounded-full text-xs"
    >
      <div className="relative flex items-center -space-x-2">
        {presence.slice(0, threshold).map((u) => (
          <div
            key={u.userId}
            className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm"
            title={u.userName}
          >
            {u.userName.charAt(0)}
          </div>
        ))}
        {onlineCount > threshold && (
          <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
            +{onlineCount - threshold}
          </div>
        )}
      </div>
      <span className="text-green-700 font-semibold">
        {onlineCount} {onlineCount === 1 ? 'user' : 'users'} online
      </span>
    </motion.div>
  );
};

export default PresenceTracker;
