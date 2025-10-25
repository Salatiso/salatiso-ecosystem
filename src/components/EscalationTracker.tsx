import React, { useMemo } from 'react';
import { ChevronRight, Clock, User, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useEscalation } from '@/hooks/useEscalation';
import {
  EscalationLevel,
  EscalationStatus,
  SeverityLevel,
  ResponderRole,
} from '@/types/escalation';

interface EscalationTrackerProps {
  escalationId: string;
  onStatusChange?: (status: EscalationStatus) => void;
  onResponderAction?: (assignmentId: string, action: string) => void;
  compact?: boolean;
}

const getLevelOrder = (): EscalationLevel[] => [
  EscalationLevel.INDIVIDUAL,
  EscalationLevel.FAMILY,
  EscalationLevel.COMMUNITY,
  EscalationLevel.PROFESSIONAL,
];

const getLevelLabel = (level: EscalationLevel): string => {
  const labels: Record<EscalationLevel, string> = {
    [EscalationLevel.INDIVIDUAL]: '👤 Individual',
    [EscalationLevel.FAMILY]: '👨‍👩‍👧 Family',
    [EscalationLevel.COMMUNITY]: '🏘️ Community',
    [EscalationLevel.PROFESSIONAL]: '👔 Professional',
  };
  return labels[level];
};

const getLevelColor = (level: EscalationLevel): string => {
  const colors: Record<EscalationLevel, string> = {
    [EscalationLevel.INDIVIDUAL]: 'bg-green-100 border-green-300 text-green-900',
    [EscalationLevel.FAMILY]: 'bg-blue-100 border-blue-300 text-blue-900',
    [EscalationLevel.COMMUNITY]: 'bg-orange-100 border-orange-300 text-orange-900',
    [EscalationLevel.PROFESSIONAL]: 'bg-red-100 border-red-300 text-red-900',
  };
  return colors[level];
};

const getStatusIcon = (status: EscalationStatus) => {
  const icons: Record<EscalationStatus, React.ReactNode> = {
    [EscalationStatus.OPEN]: <AlertCircle size={18} />,
    [EscalationStatus.IN_PROGRESS]: <Clock size={18} />,
    [EscalationStatus.ESCALATED]: <ArrowRight size={18} />,
    [EscalationStatus.AWAITING_RESPONSE]: <Clock size={18} />,
    [EscalationStatus.ON_HOLD]: <AlertCircle size={18} />,
    [EscalationStatus.RESOLVED]: <CheckCircle size={18} />,
    [EscalationStatus.ARCHIVED]: <AlertCircle size={18} />,
    [EscalationStatus.CANCELLED]: <AlertCircle size={18} />,
  };
  return icons[status];
};

const getStatusColor = (status: EscalationStatus): string => {
  const colors: Record<EscalationStatus, string> = {
    [EscalationStatus.OPEN]: 'text-blue-600',
    [EscalationStatus.ESCALATED]: 'text-red-600',
    [EscalationStatus.IN_PROGRESS]: 'text-orange-600',
    [EscalationStatus.AWAITING_RESPONSE]: 'text-cyan-600',
    [EscalationStatus.ON_HOLD]: 'text-purple-600',
    [EscalationStatus.RESOLVED]: 'text-green-600',
    [EscalationStatus.ARCHIVED]: 'text-gray-600',
    [EscalationStatus.CANCELLED]: 'text-slate-600',
  };
  return colors[status];
};

const formatDate = (date: Date | number): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

interface ResponderRowProps {
  responder: any;
  isActive: boolean;
  onAcknowledge?: () => void;
  onHandoff?: () => void;
}

const ResponderRow: React.FC<ResponderRowProps> = ({ responder, isActive, onAcknowledge, onHandoff }) => {
  const roleLabels: Record<ResponderRole, string> = {
    [ResponderRole.FIRST_RESPONDER]: '🚨 First Responder',
    [ResponderRole.FAMILY_STEWARD]: '👨‍👩‍👧 Family Steward',
    [ResponderRole.COMMUNITY_LEAD]: '🏘️ Community Lead',
    [ResponderRole.PROFESSIONAL_HANDLER]: '👔 Professional',
    [ResponderRole.ESCALATION_MANAGER]: '⚙️ Manager',
  };

  return (
    <div className={`border rounded-lg p-4 ${isActive ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <User size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
            <span className="font-semibold text-gray-900">{responder.userId}</span>
            <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
              {roleLabels[responder.role] || responder.role}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Assigned: {formatDate(responder.assignedAt)}
          </p>
        </div>
        {responder.acknowledged ? (
          <CheckCircle size={20} className="text-green-600" />
        ) : (
          <AlertCircle size={20} className="text-orange-600" />
        )}
      </div>

      {responder.acknowledgedAt && (
        <p className="text-sm text-gray-600 mb-3">
          Acknowledged: {formatDate(responder.acknowledgedAt)}
        </p>
      )}

      {/* Status Badge */}
      <div className="mb-3">
        <span
          className={`inline-block px-3 py-1 rounded text-sm font-medium ${
            responder.status === 'completed'
              ? 'bg-green-100 text-green-900'
              : responder.status === 'in_progress'
              ? 'bg-blue-100 text-blue-900'
              : responder.status === 'acknowledged'
              ? 'bg-orange-100 text-orange-900'
              : 'bg-yellow-100 text-yellow-900'
          }`}
        >
          {responder.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {!responder.acknowledged && (
          <button
            onClick={onAcknowledge}
            className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium"
          >
            Acknowledge
          </button>
        )}
        {responder.acknowledged && responder.status !== 'completed' && (
          <button
            onClick={onHandoff}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
          >
            Handoff
          </button>
        )}
      </div>
    </div>
  );
};

export const EscalationTracker: React.FC<EscalationTrackerProps> = ({
  escalationId,
  onStatusChange,
  onResponderAction,
  compact = false,
}) => {
  const { escalation, isLoading, error, canEscalate, escalateToNext, acknowledgeAssignment } =
    useEscalation(escalationId);

  const levels = useMemo(() => getLevelOrder(), []);

  const activeLevel = escalation?.currentLevel || EscalationLevel.INDIVIDUAL;

  const levelStatus = useMemo(() => {
    return levels.map((level) => ({
      level,
      isActive: level === activeLevel,
      isCompleted: levels.indexOf(level) < levels.indexOf(activeLevel),
    }));
  }, [levels, activeLevel]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
          <p className="text-gray-600">Loading escalation details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-900 font-semibold">Error loading escalation</p>
        <p className="text-red-800 text-sm">{error}</p>
      </div>
    );
  }

  if (!escalation) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">No escalation data available</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Context</p>
            <p className="text-lg font-semibold text-gray-900">{escalation.context}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Severity</p>
            <p className="text-lg font-semibold text-gray-900">{escalation.severity}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Created</p>
            <p className="text-lg font-semibold text-gray-900">{formatDate(escalation.createdAt)}</p>
          </div>
        </div>

        {escalation.description && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 font-medium mb-1">Description</p>
            <p className="text-gray-700">{escalation.description}</p>
          </div>
        )}
      </div>

      {/* Escalation Path */}
      {!compact && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Escalation Path</h3>

          <div className="space-y-4">
            {levelStatus.map((item, index) => (
              <div key={item.level}>
                <div
                  className={`border-2 rounded-lg p-4 transition ${
                    item.isActive
                      ? 'border-blue-400 bg-blue-50'
                      : item.isCompleted
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        item.isActive
                          ? 'bg-blue-600'
                          : item.isCompleted
                          ? 'bg-green-600'
                          : 'bg-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{getLevelLabel(item.level)}</p>
                      {item.isActive && (
                        <p className="text-sm text-blue-600 font-medium">Current Level</p>
                      )}
                      {item.isCompleted && (
                        <p className="text-sm text-green-600 font-medium">Completed</p>
                      )}
                    </div>
                  </div>
                </div>

                {index < levelStatus.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ChevronRight className="text-gray-400 transform -rotate-90" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {canEscalate && activeLevel !== EscalationLevel.PROFESSIONAL && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => escalateToNext('Escalating to next level', undefined)}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Escalate to Next Level
              </button>
            </div>
          )}
        </div>
      )}

      {/* Timeline */}
      {!compact && escalation.auditTrail && escalation.auditTrail.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Timeline</h3>

          <div className="space-y-4">
            {escalation.auditTrail.map((entry, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(entry.action as EscalationStatus)} bg-current`}></div>
                  {index < escalation.auditTrail!.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200 my-1"></div>
                  )}
                </div>
                <div className="pb-4">
                  <p className="font-semibold text-gray-900">{entry.action}</p>
                  <p className="text-sm text-gray-600">
                    {Object.entries(entry.changes)
                      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                      .join(', ')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(entry.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Responders */}
      {escalation.responders && escalation.responders.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Assigned Responders</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {escalation.responders.map((responder) => (
              <ResponderRow
                key={responder.id}
                responder={responder}
                isActive={responder.status === 'in_progress' || responder.status === 'acknowledged'}
                onAcknowledge={() => acknowledgeAssignment(responder.id)}
                onHandoff={() => {
                  // Handoff logic would go here
                  onResponderAction?.(responder.id, 'handoff');
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Status Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Status Summary</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Current Status</span>
            <span
              className={`px-3 py-1 rounded font-medium text-sm flex items-center gap-1 ${
                escalation.status === EscalationStatus.RESOLVED
                  ? 'bg-green-100 text-green-900'
                  : escalation.status === EscalationStatus.IN_PROGRESS
                  ? 'bg-blue-100 text-blue-900'
                  : escalation.status === EscalationStatus.ESCALATED
                  ? 'bg-red-100 text-red-900'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {getStatusIcon(escalation.status)}
              {escalation.status}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Current Level</span>
            <span className={`px-3 py-1 rounded font-medium text-sm ${getLevelColor(activeLevel)}`}>
              {getLevelLabel(activeLevel)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Time in Current Level</span>
            <span className="font-medium text-gray-900">
              {escalation.escalatedAt
                ? formatDuration(Date.now() - new Date(escalation.escalatedAt).getTime())
                : formatDuration(Date.now() - new Date(escalation.createdAt).getTime())}
            </span>
          </div>

          {escalation.responders && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Assigned Responders</span>
              <span className="font-medium text-gray-900">{escalation.responders.length}</span>
            </div>
          )}

          {escalation.resolvedAt && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Resolved At</span>
              <span className="font-medium text-gray-900">{formatDate(escalation.resolvedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EscalationTracker;
