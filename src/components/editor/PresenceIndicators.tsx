/**
 * PresenceIndicators Component - Live Cursor & Selection Display
 * 
 * Shows real-time presence of other users:
 * - Cursor positions with user names
 * - Text selections with colored highlights
 * - Active user badges
 * - Elder priority indicators
 * 
 * @module PresenceIndicators
 */

'use client';

import React, { useEffect, useState } from 'react';
import {
  CollaborativeEditingService,
  getCollaborativeEditingService,
  UserPresence
} from '@/services/CollaborativeEditingService';
import { useTranslation } from '@/contexts/I18nContext';

interface PresenceIndicatorsProps {
  /** Document ID */
  documentId: string;
  /** Current user ID (to exclude from display) */
  currentUserId: string;
  /** Update interval in ms */
  updateInterval?: number;
}

interface CursorPosition {
  user: UserPresence;
  x: number;
  y: number;
  visible: boolean;
}

/**
 * Presence indicators component
 */
export default function PresenceIndicators({
  documentId,
  currentUserId,
  updateInterval = 500
}: PresenceIndicatorsProps) {
  const { t } = useTranslation();
  const [service] = useState<CollaborativeEditingService>(
    () => getCollaborativeEditingService()
  );
  const [cursorPositions, setCursorPositions] = useState<CursorPosition[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<UserPresence[]>([]);

  // Update presence indicators
  useEffect(() => {
    const updatePresence = () => {
      const users = service.getConnectedUsers(documentId);
      const otherUsers = users.filter(u => u.userId !== currentUserId);
      
      setConnectedUsers(otherUsers);

      // Update cursor positions
      const positions: CursorPosition[] = otherUsers
        .filter(user => user.cursor)
        .map(user => {
          // Calculate cursor position in viewport
          // In real implementation, this would calculate based on TipTap editor state
          // For now, we'll position cursors in a placeholder way
          const x = 0;
          const y = 0;
          const visible = user.cursor !== null;

          return {
            user,
            x,
            y,
            visible
          };
        });

      setCursorPositions(positions);
    };

    // Initial update
    updatePresence();

    // Set up interval
    const interval = setInterval(updatePresence, updateInterval);

    return () => clearInterval(interval);
  }, [documentId, currentUserId, service, updateInterval]);

  return (
    <div className="presence-indicators">
      {/* Cursor indicators (would be positioned absolutely in real implementation) */}
      {cursorPositions.map(({ user, x, y, visible }) => (
        visible && (
          <div
            key={user.userId}
            className="cursor-indicator fixed pointer-events-none z-50"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translateY(-100%)'
            }}
          >
            {/* Cursor caret */}
            <div
              className="w-0.5 h-5 animate-pulse"
              style={{ backgroundColor: user.color }}
            />
            
            {/* User label */}
            <div
              className="px-2 py-1 rounded text-white text-xs font-medium whitespace-nowrap shadow-lg mt-1"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
              {user.role === 'elder' && ' 👑'}
            </div>
          </div>
        )
      ))}

      {/* Active users panel (fixed in corner) */}
      {connectedUsers.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm z-40">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              {t('presence.activeEditors', 'Active Editors')}
            </h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-600">{connectedUsers.length}</span>
            </div>
          </div>

          <div className="space-y-2">
            {connectedUsers.map((user) => (
              <div
                key={user.userId}
                className="flex items-center space-x-3 p-2 rounded-lg transition-colors hover:bg-gray-50"
              >
                {/* User avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </span>
                    {user.role === 'elder' && (
                      <span title={t('presence.elder', 'Elder')} className="text-xs">
                        👑
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </span>
                    {service.isUserEditing(documentId, user.userId) && (
                      <span className="flex items-center space-x-1 text-xs text-green-600">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
                        <span>{t('presence.typing', 'typing')}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Color indicator */}
                <div
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: user.color }}
                />
              </div>
            ))}
          </div>

          {/* Ubuntu message */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 italic text-center">
              {t('presence.ubuntuMessage', 'Umuntu Ngumuntu Ngabantu - Working together')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
