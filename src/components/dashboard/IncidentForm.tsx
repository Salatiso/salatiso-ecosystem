'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { EscalationLevel, EscalationStatus, SeverityLevel } from '@/types/escalation';
import { X, Plus } from 'lucide-react';
import { triggerEscalationCreatedNotification, EscalationEventType } from '@/services/escalationNotificationTrigger';

interface CreateIncidentForm {
  title: string;
  description: string;
  location?: string;
  severity: SeverityLevel;
}

/**
 * IncidentForm Component
 * 
 * Form to create new escalation incidents with:
 * - Title and description
 * - Location (optional)
 * - Severity level (determines auto-escalation)
 * - Real-time Firestore save
 */
export const IncidentForm: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen: initialIsOpen = false, onClose }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateIncidentForm>({
    title: '',
    description: '',
    location: '',
    severity: SeverityLevel.MEDIUM,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('[IncidentForm] Submit attempt with:', formData); // Debug log

    if (!user) {
      toast.error('You must be signed in to create an incident');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter an incident title');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter an incident description');
      return;
    }

    setLoading(true);

    try {
      // Determine initial level and status based on severity
      let initialLevel = EscalationLevel.INDIVIDUAL;
      let status = EscalationStatus.OPEN;

      if (formData.severity === SeverityLevel.CRITICAL) {
        initialLevel = EscalationLevel.PROFESSIONAL;
        status = EscalationStatus.ESCALATED;
      } else if (formData.severity === SeverityLevel.HIGH) {
        initialLevel = EscalationLevel.FAMILY;
        status = EscalationStatus.ESCALATED;
      }

      // Create escalation document
      const escalationRef = collection(db, 'escalations');
      const now = new Date();
      const docRef = await addDoc(escalationRef, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location?.trim() || '',
        severity: formData.severity,
        currentLevel: initialLevel,
        status,
        createdBy: user.id,
        createdAt: serverTimestamp(),
        escalatedAt: status === EscalationStatus.ESCALATED ? serverTimestamp() : null,
        currentOwner: user.id,
        responders: [],
        auditTrail: [
          {
            id: `audit_${Date.now()}`,
            escalationId: '', // Will be set by Firestore
            action: 'created',
            userId: user.id,
            timestamp: now.toISOString(), // Use ISO string instead of serverTimestamp() in arrays
            level: initialLevel,
            changes: {
              status,
              severity: formData.severity,
            },
          },
        ],
        metadata: {
          reportedBy: user.email,
          reportedAt: new Date().toISOString(),
        },
      });

      // Trigger notification for escalation creation
      await triggerEscalationCreatedNotification({
        escalationId: docRef.id,
        escalationTitle: formData.title.trim(),
        severity: formData.severity as 'low' | 'medium' | 'high' | 'critical',
        currentLevel: initialLevel,
        createdBy: user.id,
        timestamp: new Date(),
      });

      toast.success(
        formData.severity === SeverityLevel.CRITICAL
          ? '🚨 Critical incident created and escalated to professional level'
          : formData.severity === SeverityLevel.HIGH
          ? '⚠️ High-priority incident created and escalated to family level'
          : '📋 Incident created successfully',
        {
          duration: 4000,
        }
      );

      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        severity: SeverityLevel.MEDIUM,
      });
      setIsOpen(false);
      if (onClose) onClose();
    } catch (error: any) {
      console.error('Error creating incident:', error);
      toast.error(`Failed to create incident: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log('[IncidentForm] Field changed:', name, '=', value); // Debug log
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        New Incident
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Create New Incident</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Incident Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Medical emergency, Conflict resolution, System failure"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information about the incident..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Location <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Home, Office, School"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Severity Level <span className="text-red-600">*</span>
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value={SeverityLevel.LOW}>
                🟢 Low - Minor issue, logging only
              </option>
              <option value={SeverityLevel.MEDIUM}>
                🟡 Medium - Moderate issue, family notification
              </option>
              <option value={SeverityLevel.HIGH}>
                🟠 High - Serious issue, escalates to family level
              </option>
              <option value={SeverityLevel.CRITICAL}>
                🔴 Critical - Emergency, escalates to professional level
              </option>
            </select>

            {/* Severity Info */}
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
              <p className="font-semibold mb-1">Auto-Escalation Rules:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>🟢 Low: Logged only (no escalation)</li>
                <li>🟡 Medium: Family notified (no auto-escalation)</li>
                <li>🟠 High: Automatically escalates to family level</li>
                <li>🔴 Critical: Immediately escalates to professional level</li>
              </ul>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Incident'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentForm;
