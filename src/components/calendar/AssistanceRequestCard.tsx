/**
 * @file AssistanceRequestCard.tsx
 * @description Component for displaying and responding to assistance requests
 * Allows users to request help and family members to offer/accept assistance
 * 
 * FEATURES:
 * - Display assistance requests with status
 * - Show who offered to help
 * - Quick respond buttons (offer/decline)
 * - Track assistance workflow
 * - Mobile-responsive design
 * 
 * @created October 22, 2025
 */

'use client';

import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  AssistanceRequest,
  AssistanceStatus,
  AssistanceType,
  EnhancedCalendarEvent
} from '@/types/calendar';

/**
 * Props for AssistanceRequestCard component
 */
interface AssistanceRequestCardProps {
  /** The assistance request to display */
  request: AssistanceRequest;
  /** The associated event */
  event: EnhancedCalendarEvent;
  /** Current user ID */
  currentUserId: string;
  /** Callback when user responds to request */
  onRespond?: (
    requestId: string,
    status: 'offered' | 'declined',
    comment?: string
  ) => Promise<void>;
  /** Callback when help is marked complete */
  onComplete?: (requestId: string) => Promise<void>;
  /** CSS className for custom styling */
  className?: string;
}

/**
 * Assistance type metadata
 */
const ASSISTANCE_TYPE_METADATA: Record<
  AssistanceType,
  { icon: string; label: string; color: string }
> = {
  [AssistanceType.LOGISTICS]: {
    icon: '🚚',
    label: 'Logistics',
    color: 'bg-blue-50 text-blue-900'
  },
  [AssistanceType.SETUP]: {
    icon: '🔧',
    label: 'Setup',
    color: 'bg-orange-50 text-orange-900'
  },
  [AssistanceType.SUPPORT]: {
    icon: '🤝',
    label: 'Support',
    color: 'bg-green-50 text-green-900'
  },
  [AssistanceType.SKILLS]: {
    icon: '👨‍🍳',
    label: 'Skills',
    color: 'bg-purple-50 text-purple-900'
  },
  [AssistanceType.RESOURCES]: {
    icon: '📦',
    label: 'Resources',
    color: 'bg-yellow-50 text-yellow-900'
  },
  [AssistanceType.OTHER]: {
    icon: '❓',
    label: 'Other',
    color: 'bg-gray-50 text-gray-900'
  }
};

/**
 * Status metadata
 */
const STATUS_METADATA: Record<
  AssistanceStatus,
  { icon: string; label: string; color: string }
> = {
  [AssistanceStatus.REQUESTED]: {
    icon: '🆘',
    label: 'Need Help',
    color: 'bg-red-100 text-red-800'
  },
  [AssistanceStatus.OFFERED]: {
    icon: '🙋',
    label: 'Someone Offered',
    color: 'bg-yellow-100 text-yellow-800'
  },
  [AssistanceStatus.ACCEPTED]: {
    icon: '✓',
    label: 'Help Accepted',
    color: 'bg-blue-100 text-blue-800'
  },
  [AssistanceStatus.IN_PROGRESS]: {
    icon: '⚙️',
    label: 'In Progress',
    color: 'bg-indigo-100 text-indigo-800'
  },
  [AssistanceStatus.COMPLETED]: {
    icon: '🎉',
    label: 'Complete',
    color: 'bg-green-100 text-green-800'
  },
  [AssistanceStatus.DECLINED]: {
    icon: '✗',
    label: 'Declined',
    color: 'bg-gray-100 text-gray-800'
  }
};

/**
 * AssistanceRequestCard Component
 * Displays and manages assistance requests
 */
export const AssistanceRequestCard: React.FC<AssistanceRequestCardProps> = ({
  request,
  event,
  currentUserId,
  onRespond,
  onComplete,
  className = ''
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseComment, setResponseComment] = useState('');

  const userStatus = request.responses.find((r) => r.userId === currentUserId);
  const hasResponded = !!userStatus;
  const typeMetadata = ASSISTANCE_TYPE_METADATA[request.type];
  const statusMetadata = STATUS_METADATA[request.status];

  /**
   * Get requester's display name
   */
  const getRequesterName = () => {
    const userMap: Record<string, string> = {
      'user_mukurwe': 'Mukurwe',
      'user_solo': 'Solo',
      'user_flamea': 'Flamea'
    };
    return userMap[request.requestedBy] || request.requestedBy;
  };

  /**
   * Get time remaining
   */
  const getTimeRemaining = () => {
    if (!request.requiredBy) return null;
    const now = new Date();
    const diff = new Date(request.requiredBy).getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes} min`;
    return 'overdue';
  };

  /**
   * Handle offering to help
   */
  const handleOffer = useCallback(async () => {
    if (!onRespond) return;

    try {
      setIsUpdating(true);
      await onRespond(request.id, 'offered', responseComment);
      toast.success("You've offered to help!");
      setShowResponseForm(false);
      setResponseComment('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to respond';
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  }, [request.id, responseComment, onRespond]);

  /**
   * Handle declining
   */
  const handleDecline = useCallback(async () => {
    if (!onRespond) return;

    try {
      setIsUpdating(true);
      await onRespond(request.id, 'declined', '');
      toast.success('Declined');
      setShowResponseForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to respond';
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  }, [request.id, onRespond]);

  /**
   * Handle marking complete
   */
  const handleComplete = useCallback(async () => {
    if (!onComplete) return;

    try {
      setIsUpdating(true);
      await onComplete(request.id);
      toast.success('Marked as complete!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark complete';
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  }, [request.id, onComplete]);

  return (
    <div
      className={`assistance-request-card ${className} border-2 rounded-lg p-4 ${typeMetadata.color}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{typeMetadata.icon}</span>
          <div>
            <h4 className="font-semibold text-gray-900">{request.description}</h4>
            <p className="text-sm text-gray-600">Needed by {getRequesterName()}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusMetadata.color}`}>
          {statusMetadata.icon} {statusMetadata.label}
        </div>
      </div>

      {/* Category badge */}
      <div className="mb-3">
        <span className="inline-block px-3 py-1 bg-white border border-gray-300 rounded-full text-xs font-medium text-gray-700">
          {typeMetadata.label}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 text-sm text-gray-700">
        {request.requiredBy && (
          <div className="flex items-center gap-2">
            <span>⏰</span>
            <span>Due in: {getTimeRemaining()}</span>
          </div>
        )}
        {request.priority && (
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span>Priority: {request.priority}</span>
          </div>
        )}
      </div>

      {/* Responses */}
      {request.responses.length > 0 && (
        <div className="mb-4 p-3 bg-white bg-opacity-50 rounded-lg border border-gray-300">
          <p className="text-xs font-semibold text-gray-700 mb-2">Responses:</p>
          <div className="space-y-2">
            {request.responses.map((response, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-700">
                  {getUserName(response.userId)}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      response.status === 'offered'
                        ? 'bg-yellow-200 text-yellow-900'
                        : response.status === 'accepted'
                          ? 'bg-green-200 text-green-900'
                          : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {response.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current user response form */}
      {!hasResponded && request.status !== AssistanceStatus.COMPLETED && (
        <div className="mb-4">
          {!showResponseForm ? (
            <button
              onClick={() => setShowResponseForm(true)}
              disabled={isUpdating}
              className="w-full px-4 py-2 bg-white hover:bg-gray-50 disabled:bg-gray-200 border-2 border-gray-400 text-gray-900 font-medium rounded-lg transition-colors"
            >
              Can I Help?
            </button>
          ) : (
            <div className="space-y-3">
              <textarea
                value={responseComment}
                onChange={(e) => setResponseComment(e.target.value)}
                placeholder="e.g., I can help until 3pm, or What supplies do you need?"
                maxLength={200}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleOffer}
                  disabled={isUpdating}
                  className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  Offer Help
                </button>
                <button
                  onClick={handleDecline}
                  disabled={isUpdating}
                  className="flex-1 px-3 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-500 text-gray-900 font-medium rounded-lg transition-colors text-sm"
                >
                  Can't Help
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User's response */}
      {hasResponded && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-300 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Your response:</strong> {userStatus.status}
            {userStatus.comment && ` - "${userStatus.comment}"`}
          </p>
        </div>
      )}

      {/* Complete button (for helpers) */}
      {userStatus?.status === 'accepted' && request.status === AssistanceStatus.IN_PROGRESS && (
        <button
          onClick={handleComplete}
          disabled={isUpdating}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
        >
          ✓ Mark Complete
        </button>
      )}

      {/* Thank you message */}
      {request.status === AssistanceStatus.COMPLETED && (
        <div className="p-3 bg-green-50 border border-green-300 rounded-lg">
          <p className="text-sm text-green-900 font-medium">
            🎉 Thank you for helping! The request is complete.
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Helper function to get user display name
 */
function getUserName(userId: string): string {
  const userMap: Record<string, string> = {
    'user_mukurwe': 'Mukurwe',
    'user_solo': 'Solo',
    'user_flamea': 'Flamea'
  };
  return userMap[userId] || userId;
}

export default AssistanceRequestCard;
