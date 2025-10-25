import React, { useState } from 'react';
import { CheckSquare, Trash2, Send, AlertTriangle, CheckCircle, Loader } from 'lucide-react';

interface BulkOperationRecord {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'assigned' | 'escalated' | 'resolved';
  assignedTo: string;
  createdAt: Date;
}

interface BulkOperationProgress {
  total: number;
  completed: number;
  failed: number;
  isProcessing: boolean;
}

const BulkOperationsComponent: React.FC = () => {
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [selectedAll, setSelectedAll] = useState(false);
  const [bulkAction, setBulkAction] = useState<'assign' | 'status' | 'delete' | null>(null);
  const [targetAssignee, setTargetAssignee] = useState('');
  const [targetStatus, setTargetStatus] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [progress, setProgress] = useState<BulkOperationProgress>({
    total: 0,
    completed: 0,
    failed: 0,
    isProcessing: false,
  });
  const [operationResult, setOperationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Mock data
  const mockRecords: BulkOperationRecord[] = [
    {
      id: 'ESC-001',
      title: 'Critical System Outage',
      priority: 'critical',
      status: 'escalated',
      assignedTo: 'Senior Engineer',
      createdAt: new Date('2025-10-15'),
    },
    {
      id: 'ESC-002',
      title: 'Data Sync Issue',
      priority: 'high',
      status: 'assigned',
      assignedTo: 'Mobile Team',
      createdAt: new Date('2025-10-16'),
    },
    {
      id: 'ESC-003',
      title: 'User Authentication Failure',
      priority: 'high',
      status: 'resolved',
      assignedTo: 'Auth Team',
      createdAt: new Date('2025-10-14'),
    },
    {
      id: 'ESC-004',
      title: 'API Rate Limiting',
      priority: 'medium',
      status: 'assigned',
      assignedTo: 'Backend Team',
      createdAt: new Date('2025-10-12'),
    },
    {
      id: 'ESC-005',
      title: 'UI Rendering Issue',
      priority: 'medium',
      status: 'open',
      assignedTo: 'Frontend Team',
      createdAt: new Date('2025-10-11'),
    },
    {
      id: 'ESC-006',
      title: 'Email Notification Delay',
      priority: 'low',
      status: 'resolved',
      assignedTo: 'DevOps',
      createdAt: new Date('2025-10-10'),
    },
  ];

  const allAssignees = [...new Set(mockRecords.map(r => r.assignedTo))];
  const recordCount = selectedRecords.size;

  const handleToggleRecord = (id: string) => {
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRecords(newSelected);
    setSelectedAll(newSelected.size === mockRecords.length);
  };

  const handleSelectAll = () => {
    if (selectedAll) {
      setSelectedRecords(new Set());
      setSelectedAll(false);
    } else {
      setSelectedRecords(new Set(mockRecords.map(r => r.id)));
      setSelectedAll(true);
    }
  };

  const handleBulkActionStart = (action: 'assign' | 'status' | 'delete') => {
    if (recordCount === 0) return;
    setBulkAction(action);
    setShowConfirmation(true);
  };

  const executeBulkOperation = async () => {
    setShowConfirmation(false);
    setProgress({
      total: recordCount,
      completed: 0,
      failed: 0,
      isProcessing: true,
    });

    // Simulate operation with progress
    let completed = 0;
    let failed = 0;

    for (let i = 0; i < recordCount; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));

      // Simulate occasional failures
      if (Math.random() > 0.95) {
        failed++;
      } else {
        completed++;
      }

      setProgress(prev => ({
        ...prev,
        completed,
        failed,
      }));
    }

    setProgress(prev => ({
      ...prev,
      isProcessing: false,
    }));

    const action =
      bulkAction === 'assign'
        ? `assigned to ${targetAssignee}`
        : bulkAction === 'status'
        ? `status changed to ${targetStatus}`
        : 'deleted';

    setOperationResult({
      success: failed === 0,
      message:
        failed === 0
          ? `✓ Successfully ${action} ${completed} record${completed !== 1 ? 's' : ''}.`
          : `✓ Completed with issues: ${completed} succeeded, ${failed} failed.`,
    });

    setTimeout(() => {
      setBulkAction(null);
      setSelectedRecords(new Set());
      setSelectedAll(false);
      setTargetAssignee('');
      setTargetStatus('');
      setOperationResult(null);
      setProgress({ total: 0, completed: 0, failed: 0, isProcessing: false });
    }, 3000);
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canExecute =
    recordCount > 0 &&
    ((bulkAction === 'assign' && targetAssignee) ||
      (bulkAction === 'status' && targetStatus) ||
      bulkAction === 'delete');

  return (
    <div className="w-full bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-teal-100 rounded-lg">
            <CheckSquare className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Bulk Operations</h2>
            <p className="text-sm text-gray-600">Manage multiple escalations at once</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-teal-700">{recordCount}</p>
          <p className="text-sm text-gray-600">Selected</p>
        </div>
      </div>

      {/* Operation Result */}
      {operationResult && (
        <div className={`p-4 rounded-lg flex items-start space-x-3 ${
          operationResult.success
            ? 'bg-green-50 border border-green-200'
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            operationResult.success ? 'text-green-600' : 'text-yellow-600'
          }`} />
          <p className={operationResult.success ? 'text-green-800' : 'text-yellow-800'}>
            {operationResult.message}
          </p>
        </div>
      )}

      {/* Processing Progress */}
      {progress.isProcessing && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Loader className="w-5 h-5 text-teal-600 animate-spin" />
              <span className="font-semibold text-gray-800">Processing...</span>
            </div>
            <span className="text-sm text-gray-600">
              {progress.completed + progress.failed} / {progress.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full transition-all duration-300"
              style={{
                width: `${((progress.completed + progress.failed) / progress.total) * 100}%`,
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center p-2 bg-green-50 rounded">
              <p className="font-semibold text-green-700">{progress.completed}</p>
              <p className="text-xs text-green-600">Completed</p>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded">
              <p className="font-semibold text-yellow-700">{progress.failed}</p>
              <p className="text-xs text-yellow-600">Failed</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="font-semibold text-gray-700">{progress.total - progress.completed - progress.failed}</p>
              <p className="text-xs text-gray-600">Remaining</p>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Buttons */}
      {!progress.isProcessing && bulkAction === null && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleBulkActionStart('assign')}
            disabled={recordCount === 0}
            className={`p-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
              recordCount === 0
                ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Assign ({recordCount})</span>
          </button>
          <button
            onClick={() => handleBulkActionStart('status')}
            disabled={recordCount === 0}
            className={`p-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
              recordCount === 0
                ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Change Status</span>
          </button>
          <button
            onClick={() => handleBulkActionStart('delete')}
            disabled={recordCount === 0}
            className={`p-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
              recordCount === 0
                ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                : 'bg-red-100 hover:bg-red-200 text-red-700'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Bulk Action Config */}
      {bulkAction && !progress.isProcessing && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          {bulkAction === 'assign' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Assign to:</label>
              <select
                value={targetAssignee}
                onChange={(e) => setTargetAssignee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select assignee...</option>
                {allAssignees.map(assignee => (
                  <option key={assignee} value={assignee}>
                    {assignee}
                  </option>
                ))}
              </select>
            </div>
          )}

          {bulkAction === 'status' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Change status to:</label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select status...</option>
                <option value="open">Open</option>
                <option value="assigned">Assigned</option>
                <option value="escalated">Escalated</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          )}

          {bulkAction === 'delete' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Confirm deletion</p>
                <p className="text-sm text-red-700">This action cannot be undone. {recordCount} record{recordCount !== 1 ? 's' : ''} will be permanently deleted.</p>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              onClick={executeBulkOperation}
              disabled={!canExecute}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                canExecute
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              Execute {bulkAction === 'assign' ? 'Assignment' : bulkAction === 'status' ? 'Update' : 'Deletion'}
            </button>
            <button
              onClick={() => {
                setBulkAction(null);
                setTargetAssignee('');
                setTargetStatus('');
              }}
              className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Selection Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedAll}
            onChange={handleSelectAll}
            className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
          <span className="font-semibold text-gray-800">
            {selectedAll ? 'Deselect All' : 'Select All'} ({mockRecords.length} records)
          </span>
        </label>
      </div>

      {/* Records List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {mockRecords.map(record => (
          <div
            key={record.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={selectedRecords.has(record.id)}
                onChange={() => handleToggleRecord(record.id)}
                className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-800">{record.title}</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${priorityColor(record.priority)}`}>
                    {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{record.id}</span>
                  <span className={`px-2 py-1 rounded ${statusColor(record.status)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                  <span>{record.assignedTo}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-800">Confirm Action</h3>
            </div>
            <p className="text-gray-600 mb-6">
              {bulkAction === 'assign'
                ? `Assign ${recordCount} record${recordCount !== 1 ? 's' : ''} to ${targetAssignee}?`
                : bulkAction === 'status'
                ? `Change status of ${recordCount} record${recordCount !== 1 ? 's' : ''} to ${targetStatus}?`
                : `Delete ${recordCount} record${recordCount !== 1 ? 's' : ''}? This cannot be undone.`}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={executeBulkOperation}
                className="flex-1 py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkOperationsComponent;
