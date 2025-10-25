/**
 * VersionHistory Component - Document Version Management
 * 
 * Features:
 * - View version snapshots
 * - Create new snapshots
 * - Restore previous versions
 * - Compare versions (diff view)
 * - Ubuntu-aligned version attribution
 * 
 * @module VersionHistory
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  CollaborativeEditingService,
  getCollaborativeEditingService,
  VersionSnapshot
} from '@/services/CollaborativeEditingService';
import { useTranslation } from '@/contexts/I18nContext';

interface VersionHistoryProps {
  /** Document ID */
  documentId: string;
  /** Current user ID */
  userId: string;
  /** Callback when version restored */
  onRestore?: (snapshot: VersionSnapshot) => void;
}

/**
 * Version history component
 */
export default function VersionHistory({
  documentId,
  userId,
  onRestore
}: VersionHistoryProps) {
  const { t } = useTranslation();
  const [service] = useState<CollaborativeEditingService>(
    () => getCollaborativeEditingService()
  );
  const [snapshots, setSnapshots] = useState<VersionSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<VersionSnapshot | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [snapshotDescription, setSnapshotDescription] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);

  // Load snapshots
  useEffect(() => {
    // TODO: Implement getSnapshots() in service
    // For now, we'll show empty state
    setSnapshots([]);
  }, [documentId, service]);

  // Create snapshot
  const handleCreateSnapshot = () => {
    if (!snapshotDescription.trim()) return;

    try {
      const snapshot = service.createSnapshot(
        documentId,
        userId,
        snapshotDescription
      );
      
      setSnapshots([snapshot, ...snapshots]);
      setSnapshotDescription('');
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Failed to create snapshot:', error);
    }
  };

  // Restore snapshot
  const handleRestoreSnapshot = async (snapshot: VersionSnapshot) => {
    if (!window.confirm(t('versionHistory.confirmRestore', 'Are you sure you want to restore this version? Current changes will be lost.'))) {
      return;
    }

    setIsRestoring(true);
    try {
      await service.restoreSnapshot(documentId, snapshot.id);
      
      if (onRestore) {
        onRestore(snapshot);
      }
    } catch (error) {
      console.error('Failed to restore snapshot:', error);
      alert(t('versionHistory.restoreError', 'Failed to restore version'));
    } finally {
      setIsRestoring(false);
    }
  };

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="version-history bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {t('versionHistory.title', 'Version History')}
        </h2>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{t('versionHistory.createSnapshot', 'Create Snapshot')}</span>
        </button>
      </div>

      {/* Create snapshot dialog */}
      {showCreateDialog && (
        <div className="border-b border-gray-200 bg-orange-50 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('versionHistory.snapshotDescription', 'Snapshot Description')}
          </label>
          <input
            type="text"
            value={snapshotDescription}
            onChange={(e) => setSnapshotDescription(e.target.value)}
            placeholder={t('versionHistory.descriptionPlaceholder', 'E.g., "Added business goals section"')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateSnapshot();
              } else if (e.key === 'Escape') {
                setShowCreateDialog(false);
                setSnapshotDescription('');
              }
            }}
          />
          <div className="flex items-center justify-end space-x-2 mt-3">
            <button
              onClick={() => {
                setShowCreateDialog(false);
                setSnapshotDescription('');
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              onClick={handleCreateSnapshot}
              disabled={!snapshotDescription.trim()}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('versionHistory.create', 'Create')}
            </button>
          </div>
        </div>
      )}

      {/* Snapshots list */}
      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
          </div>
        ) : snapshots.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 mb-2">
              {t('versionHistory.noSnapshots', 'No version snapshots yet')}
            </p>
            <p className="text-sm text-gray-500">
              {t('versionHistory.createFirst', 'Create your first snapshot to save the current state')}
            </p>
          </div>
        ) : (
          snapshots.map((snapshot, index) => (
            <div
              key={snapshot.id}
              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                selectedSnapshot?.id === snapshot.id ? 'bg-orange-50' : ''
              }`}
              onClick={() => setSelectedSnapshot(snapshot)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {index === 0 && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                        {t('versionHistory.latest', 'Latest')}
                      </span>
                    )}
                    <span className="text-sm text-gray-600">
                      {formatTimestamp(snapshot.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium mb-1">
                    {snapshot.description}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{t('versionHistory.createdBy', 'Created by')}</span>
                    <span className="font-medium">{snapshot.userId}</span>
                  </div>
                </div>

                {index !== 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestoreSnapshot(snapshot);
                    }}
                    disabled={isRestoring}
                    className="px-3 py-1.5 text-sm bg-orange-600 hover:bg-orange-700 text-white font-medium rounded transition-colors disabled:opacity-50 flex items-center space-x-1"
                  >
                    {isRestoring ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>{t('versionHistory.restoring', 'Restoring...')}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{t('versionHistory.restore', 'Restore')}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ubuntu message */}
      <div className="border-t border-gray-200 bg-orange-50 p-4">
        <p className="text-sm text-gray-700 text-center">
          <span className="font-semibold">
            {t('versionHistory.ubuntuMessage', 'Umuntu Ngumuntu Ngabantu')}
          </span>
          {' - '}
          <span className="italic">
            {t('versionHistory.ubuntuDescription', 'Every version tells the story of our collective work')}
          </span>
        </p>
      </div>
    </div>
  );
}
