/**
 * Consent Dashboard Component
 * 
 * Displays and manages user consents
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  getConsentManagementService,
  ConsentRecord,
  ConsentType,
  ConsentStatus
} from '@/services/ConsentManagementService';

interface ConsentDashboardProps {
  userId: string;
  familyId: string;
}

const ConsentDashboard: React.FC<ConsentDashboardProps> = ({
  userId,
  familyId
}) => {
  const { t } = useTranslation('common');
  const consentService = getConsentManagementService();

  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRevokeModal, setShowRevokeModal] = useState<ConsentType | null>(null);

  useEffect(() => {
    loadConsents();
  }, [userId, familyId]);

  const loadConsents = async () => {
    try {
      setLoading(true);
      const userConsents = await consentService.getUserConsents(userId, familyId);
      setConsents(userConsents);
    } catch (error) {
      console.error('Error loading consents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeConsent = async (consentType: ConsentType, reason?: string) => {
    try {
      await consentService.revokeConsent(userId, familyId, consentType, reason);
      setShowRevokeModal(null);
      await loadConsents(); // Reload
    } catch (error) {
      console.error('Error revoking consent:', error);
      alert('Failed to revoke consent. Please try again.');
    }
  };

  const getConsentIcon = (type: ConsentType): string => {
    const icons: Record<ConsentType, string> = {
      [ConsentType.VIDEO_CALL]: '📹',
      [ConsentType.VIDEO_RECORDING]: '🎥',
      [ConsentType.SCREEN_SHARING]: '🖥️',
      [ConsentType.DATA_SHARING]: '📊',
      [ConsentType.AI_ANALYSIS]: '🤖',
      [ConsentType.ANALYTICS_TRACKING]: '📈',
      [ConsentType.DOCUMENT_COLLABORATION]: '📝',
      [ConsentType.PROFILE_VISIBILITY]: '👤',
      [ConsentType.NOTIFICATION_SETTINGS]: '🔔',
      [ConsentType.THIRD_PARTY_INTEGRATION]: '🔗'
    };
    return icons[type] || '📋';
  };

  const getConsentLabel = (type: ConsentType): string => {
    const labels: Record<ConsentType, string> = {
      [ConsentType.VIDEO_CALL]: 'Video Calls',
      [ConsentType.VIDEO_RECORDING]: 'Video Recording',
      [ConsentType.SCREEN_SHARING]: 'Screen Sharing',
      [ConsentType.DATA_SHARING]: 'Data Sharing',
      [ConsentType.AI_ANALYSIS]: 'AI Analysis',
      [ConsentType.ANALYTICS_TRACKING]: 'Analytics Tracking',
      [ConsentType.DOCUMENT_COLLABORATION]: 'Document Collaboration',
      [ConsentType.PROFILE_VISIBILITY]: 'Profile Visibility',
      [ConsentType.NOTIFICATION_SETTINGS]: 'Notifications',
      [ConsentType.THIRD_PARTY_INTEGRATION]: 'Third-Party Integrations'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: ConsentStatus): string => {
    const colors: Record<ConsentStatus, string> = {
      [ConsentStatus.GRANTED]: 'bg-green-100 text-green-800',
      [ConsentStatus.DENIED]: 'bg-red-100 text-red-800',
      [ConsentStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [ConsentStatus.REVOKED]: 'bg-gray-100 text-gray-800',
      [ConsentStatus.EXPIRED]: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="consent-dashboard loading flex items-center justify-center py-12">
        <div className="spinner animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="consent-dashboard">
      {/* Header */}
      <div className="dashboard-header mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔒 Privacy & Consent Management
        </h2>
        <p className="text-gray-600">
          Manage your data privacy preferences and consent for various features
        </p>
      </div>

      {/* Consent Cards Grid */}
      <div className="consents-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(ConsentType).map(consentType => {
          const consent = consents.find(c => c.consentType === consentType);
          const hasConsent = consent?.status === ConsentStatus.GRANTED;

          return (
            <div
              key={consentType}
              className={`consent-card bg-white rounded-lg shadow-md p-6 border-2 transition-all ${
                hasConsent ? 'border-green-300' : 'border-gray-200'
              }`}
            >
              {/* Icon & Title */}
              <div className="card-header mb-4">
                <div className="flex items-start justify-between">
                  <div className="icon-title flex items-center gap-3">
                    <span className="consent-icon text-3xl">
                      {getConsentIcon(consentType)}
                    </span>
                    <h3 className="consent-title font-semibold text-gray-900">
                      {getConsentLabel(consentType)}
                    </h3>
                  </div>
                  
                  {/* Status Badge */}
                  {consent && (
                    <span className={`status-badge px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(consent.status)}`}>
                      {consent.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Purpose */}
              {consent?.metadata.purpose && (
                <p className="consent-purpose text-sm text-gray-600 mb-4">
                  {consent.metadata.purpose}
                </p>
              )}

              {/* Details */}
              {consent && (
                <div className="consent-details space-y-2 mb-4">
                  {consent.grantedAt && (
                    <div className="detail-item text-xs text-gray-500">
                      <span className="font-medium">Granted:</span>{' '}
                      {new Date(consent.grantedAt).toLocaleDateString()}
                    </div>
                  )}
                  
                  {consent.expiresAt && (
                    <div className="detail-item text-xs text-gray-500">
                      <span className="font-medium">Expires:</span>{' '}
                      {new Date(consent.expiresAt).toLocaleDateString()}
                    </div>
                  )}

                  {consent.elderApprovalRequired && (
                    <div className="detail-item text-xs text-purple-600 flex items-center gap-1">
                      <span>👴</span>
                      Elder approval required
                    </div>
                  )}

                  {consent.elderApprovedBy && (
                    <div className="detail-item text-xs text-green-600 flex items-center gap-1">
                      <span>✅</span>
                      Approved by elder
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="card-actions">
                {hasConsent ? (
                  <button
                    onClick={() => setShowRevokeModal(consentType)}
                    className="revoke-button w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
                  >
                    Revoke Consent
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      await consentService.grantConsent(
                        userId,
                        familyId,
                        consentType,
                        { purpose: `Allow ${getConsentLabel(consentType)}` }
                      );
                      await loadConsents();
                    }}
                    className="grant-button w-full px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors"
                  >
                    Grant Consent
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Revoke Confirmation Modal */}
      {showRevokeModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-lg p-8 max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Revoke Consent?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to revoke consent for{' '}
              <strong>{getConsentLabel(showRevokeModal)}</strong>?
              This action will immediately stop this feature from accessing your data.
            </p>

            <div className="modal-actions flex gap-3">
              <button
                onClick={() => setShowRevokeModal(null)}
                className="cancel-button flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRevokeConsent(showRevokeModal, 'User requested revocation')}
                className="confirm-button flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="info-section mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <span>ℹ️</span>
          About Consent Management
        </h3>
        <div className="info-content space-y-2 text-sm text-blue-800">
          <p>
            <strong>Your Privacy Matters:</strong> You have full control over how your data is used.
            You can grant or revoke consent for any feature at any time.
          </p>
          <p>
            <strong>Elder Approval:</strong> Some actions require elder approval to maintain family Ubuntu principles.
            These decisions reflect collective wisdom and protect family interests.
          </p>
          <p>
            <strong>Consent History:</strong> All consent changes are logged and auditable.
            You can review your consent history at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentDashboard;
