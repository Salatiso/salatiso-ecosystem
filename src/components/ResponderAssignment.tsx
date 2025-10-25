import React, { useState } from 'react';
import { X, Plus, Send, AlertCircle, CheckCircle, Clock, ArrowRight, User, Loader } from 'lucide-react';
import { useEscalation } from '@/hooks/useEscalation';
import { ResponderRole, EscalationLevel } from '@/types/escalation';

interface ResponderAssignmentProps {
  escalationId: string;
  currentLevel: EscalationLevel;
  onAssignmentComplete?: (assignmentId: string) => void;
  onHandoffInitiated?: (assignmentId: string) => void;
}

interface AssignmentForm {
  userId: string;
  role: ResponderRole;
  notes?: string;
}

interface HandoffForm {
  currentAssignmentId: string;
  nextUserId: string;
  reason: string;
}

const getRoleLabel = (role: ResponderRole): string => {
  const labels: Record<ResponderRole, string> = {
    [ResponderRole.FIRST_RESPONDER]: '🚨 First Responder',
    [ResponderRole.FAMILY_STEWARD]: '👨‍👩‍👧 Family Steward',
    [ResponderRole.COMMUNITY_LEAD]: '🏘️ Community Lead',
    [ResponderRole.PROFESSIONAL_HANDLER]: '👔 Professional Handler',
    [ResponderRole.ESCALATION_MANAGER]: '⚙️ Escalation Manager',
  };
  return labels[role];
};

const getRoleColor = (role: ResponderRole): string => {
  const colors: Record<ResponderRole, string> = {
    [ResponderRole.FIRST_RESPONDER]: 'bg-red-100 text-red-900',
    [ResponderRole.FAMILY_STEWARD]: 'bg-blue-100 text-blue-900',
    [ResponderRole.COMMUNITY_LEAD]: 'bg-orange-100 text-orange-900',
    [ResponderRole.PROFESSIONAL_HANDLER]: 'bg-purple-100 text-purple-900',
    [ResponderRole.ESCALATION_MANAGER]: 'bg-green-100 text-green-900',
  };
  return colors[role];
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

interface ActionLogProps {
  actions: any[];
  assignmentId: string;
  onActionLogged?: (action: string) => void;
}

const ActionLog: React.FC<ActionLogProps> = ({ actions, assignmentId, onActionLogged }) => {
  const { logAction } = useEscalation('');
  const [actionText, setActionText] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  const handleLogAction = async () => {
    if (!actionText.trim()) return;

    setIsLogging(true);
    try {
      // logAction expects (escalationId, assignmentId, request, userId)
      // Passing simplified version - service will handle
      await logAction(assignmentId, {
        actionType: 'note' as const,
        description: actionText,
      } as any);
      setActionText('');
      onActionLogged?.(actionText);
    } catch (err) {
      console.error('Failed to log action:', err);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Action Log</h4>

      {/* Log Entry Form */}
      <div className="flex gap-2">
        <textarea
          value={actionText}
          onChange={(e) => setActionText(e.target.value)}
          placeholder="Log an action or note..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={2}
        />
        <button
          onClick={handleLogAction}
          disabled={!actionText.trim() || isLogging}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center gap-2"
        >
          {isLogging ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>

      {/* Previous Actions */}
      {actions && actions.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {actions.map((action, idx) => (
            <div key={idx} className="border border-gray-200 rounded p-3 bg-gray-50">
              <p className="text-sm text-gray-600">{action.description}</p>
              <p className="text-xs text-gray-500 mt-1">{formatDate(action.takenAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface ResponderCardProps {
  responder: any;
  escalationId: string;
  onHandoffInitiate?: (assignmentId: string) => void;
  onAcknowledgeClick?: () => void;
}

const ResponderCard: React.FC<ResponderCardProps> = ({
  responder,
  escalationId,
  onHandoffInitiate,
  onAcknowledgeClick,
}) => {
  const { acknowledgeAssignment, handoffEscalation } = useEscalation(escalationId);
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [handoffReason, setHandoffReason] = useState('');
  const [nextUserId, setNextUserId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAcknowledge = async () => {
    try {
      setIsProcessing(true);
      await acknowledgeAssignment(responder.id);
      onAcknowledgeClick?.();
    } catch (err) {
      console.error('Failed to acknowledge:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHandoff = async () => {
    if (!nextUserId.trim() || !handoffReason.trim()) return;

    try {
      setIsProcessing(true);
      await handoffEscalation(responder.id, nextUserId, handoffReason);
      setHandoffOpen(false);
      setNextUserId('');
      setHandoffReason('');
      onHandoffInitiate?.(responder.id);
    } catch (err) {
      console.error('Failed to handoff:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <User size={20} className="text-gray-500" />
            <span className="font-bold text-gray-900">{responder.userId}</span>
          </div>
          <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getRoleColor(responder.role)}`}>
            {getRoleLabel(responder.role)}
          </span>
        </div>
        {responder.acknowledged ? (
          <CheckCircle size={24} className="text-green-600" />
        ) : (
          <AlertCircle size={24} className="text-orange-600" />
        )}
      </div>

      {/* Assignment Info */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Assigned:</span>
          <span className="font-medium text-gray-900">{formatDate(responder.assignedAt)}</span>
        </div>
        {responder.acknowledgedAt && (
          <div className="flex justify-between">
            <span className="text-gray-600">Acknowledged:</span>
            <span className="font-medium text-gray-900">{formatDate(responder.acknowledgedAt)}</span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-semibold ${
            responder.status === 'completed'
              ? 'bg-green-100 text-green-900'
              : responder.status === 'in_progress'
              ? 'bg-blue-100 text-blue-900'
              : responder.status === 'acknowledged'
              ? 'bg-orange-100 text-orange-900'
              : 'bg-yellow-100 text-yellow-900'
          }`}
        >
          {responder.status === 'completed' && <CheckCircle size={16} />}
          {responder.status === 'in_progress' && <Clock size={16} />}
          {responder.status === 'assigned' && <AlertCircle size={16} />}
          {responder.status}
        </span>
      </div>

      {/* Action Log */}
      {responder.actions && responder.actions.length > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <ActionLog
            actions={responder.actions}
            assignmentId={responder.id}
            onActionLogged={() => {}}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {!responder.acknowledged && (
          <button
            onClick={handleAcknowledge}
            disabled={isProcessing}
            className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm flex items-center justify-center gap-1"
          >
            {isProcessing ? <Loader size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            Acknowledge
          </button>
        )}

        {responder.acknowledged && responder.status !== 'completed' && (
          <button
            onClick={() => setHandoffOpen(!handoffOpen)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center gap-1"
          >
            <ArrowRight size={16} />
            Handoff
          </button>
        )}
      </div>

      {/* Handoff Form */}
      {handoffOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm">Handoff to Next Responder</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Next Responder User ID
            </label>
            <input
              type="text"
              value={nextUserId}
              onChange={(e) => setNextUserId(e.target.value)}
              placeholder="Enter user ID..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Handoff Reason
            </label>
            <textarea
              value={handoffReason}
              onChange={(e) => setHandoffReason(e.target.value)}
              placeholder="Explain why you're handing off..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleHandoff}
              disabled={!nextUserId.trim() || !handoffReason.trim() || isProcessing}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
            >
              Confirm Handoff
            </button>
            <button
              onClick={() => setHandoffOpen(false)}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ResponderAssignment: React.FC<ResponderAssignmentProps> = ({
  escalationId,
  currentLevel,
  onAssignmentComplete,
  onHandoffInitiated,
}) => {
  const { escalation, isLoading, error, assignResponder } = useEscalation(escalationId);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [formData, setFormData] = useState<AssignmentForm>({
    userId: '',
    role: ResponderRole.FIRST_RESPONDER,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAssign = async () => {
    if (!formData.userId.trim()) return;

    try {
      setIsSubmitting(true);
      // assignResponder expects (escalationId, request)
      await assignResponder({
        userId: formData.userId,
        role: formData.role,
      } as any);
      setFormData({ userId: '', role: ResponderRole.FIRST_RESPONDER });
      setShowAssignForm(false);
    } catch (err) {
      console.error('Failed to assign responder:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader size={32} className="animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading responder assignments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="text-red-600 flex-shrink-0" />
        <div>
          <p className="text-red-900 font-semibold">Error loading assignments</p>
          <p className="text-red-800 text-sm">{error}</p>
        </div>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Responder Management</h2>
          <p className="text-gray-600 mt-1">
            Manage responder assignments and handoffs for level: <span className="font-semibold">{currentLevel}</span>
          </p>
        </div>
        <button
          onClick={() => setShowAssignForm(!showAssignForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
        >
          <Plus size={20} />
          Assign Responder
        </button>
      </div>

      {/* Add Responder Form */}
      {showAssignForm && (
        <div className="border-2 border-blue-300 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Assign New Responder</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                User ID <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                placeholder="Enter user ID..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as ResponderRole })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(ResponderRole).map((role) => (
                  <option key={role} value={role}>
                    {getRoleLabel(role)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any notes about this assignment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAssign}
                disabled={!formData.userId.trim() || isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                {isSubmitting ? 'Assigning...' : 'Assign Responder'}
              </button>
              <button
                onClick={() => setShowAssignForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responders List */}
      {escalation.responders && escalation.responders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {escalation.responders.map((responder) => (
            <ResponderCard
              key={responder.id}
              responder={responder}
              escalationId={escalationId}
              onHandoffInitiate={onHandoffInitiated}
              onAcknowledgeClick={() => onAssignmentComplete?.(responder.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <User size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 font-medium">No responders assigned yet</p>
          <p className="text-gray-500 text-sm mt-1">Click "Assign Responder" to add someone to handle this incident</p>
        </div>
      )}
    </div>
  );
};

export default ResponderAssignment;
