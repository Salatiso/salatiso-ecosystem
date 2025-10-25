/**
 * @file IncidentLogForm.tsx
 * @description Quick incident logging form with auto-escalation
 * Allows users to quickly report incidents with severity levels
 * Automatically notifies family and escalates based on severity
 * 
 * FEATURES:
 * - Quick form to report incidents
 * - Categories: Health, Safety, Property, Emotional Support, Other
 * - Severity levels: Critical, High, Medium, Low
 * - Auto-escalation warning display
 * - Real-time validation
 * - Mobile-responsive design
 * 
 * @created October 22, 2025
 */

'use client';

import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  IncidentCategory,
  SeverityLevel,
  ContextLevel,
  AUTO_ESCALATION_RULES
} from '@/types/calendar';

/**
 * Form data structure for incident logging
 */
export interface IncidentFormData {
  type: 'incident';
  category: IncidentCategory;
  severity: SeverityLevel;
  title: string;
  description: string;
  location: string;
  context: ContextLevel;
  firstResponder?: string;
}

/**
 * Props for IncidentLogForm component
 */
interface IncidentLogFormProps {
  /** Associated event ID (if logging within existing event) */
  eventId?: string;
  /** Context level for the incident */
  context: ContextLevel;
  /** Callback when form is submitted */
  onSubmit: (data: IncidentFormData) => Promise<void>;
  /** Callback when form is cancelled */
  onCancel?: () => void;
  /** Whether to focus first field on mount */
  autoFocus?: boolean;
  /** View-only mode */
  readOnly?: boolean;
  /** CSS className for custom styling */
  className?: string;
}

/**
 * Category metadata
 */
const CATEGORY_METADATA: Record<
  IncidentCategory,
  { icon: string; label: string; description: string }
> = {
  [IncidentCategory.HEALTH]: {
    icon: '🏥',
    label: 'Health',
    description: 'Illness, injury, medical concerns'
  },
  [IncidentCategory.SAFETY]: {
    icon: '🚨',
    label: 'Safety',
    description: 'Fire, hazard, security, accident'
  },
  [IncidentCategory.PROPERTY]: {
    icon: '🏠',
    label: 'Property',
    description: 'Damage, theft, maintenance'
  },
  [IncidentCategory.EMOTIONAL_SUPPORT]: {
    icon: '💙',
    label: 'Emotional Support',
    description: 'Crisis, distress, mental health'
  },
  [IncidentCategory.OTHER]: {
    icon: '❓',
    label: 'Other',
    description: 'Something else'
  }
};

/**
 * Severity metadata
 */
const SEVERITY_METADATA: Record<
  SeverityLevel,
  { icon: string; label: string; color: string }
> = {
  [SeverityLevel.CRITICAL]: {
    icon: '🔴',
    label: 'Critical',
    color: 'bg-red-50 border-red-300 text-red-900'
  },
  [SeverityLevel.HIGH]: {
    icon: '🟠',
    label: 'High',
    color: 'bg-orange-50 border-orange-300 text-orange-900'
  },
  [SeverityLevel.MEDIUM]: {
    icon: '🟡',
    label: 'Medium',
    color: 'bg-yellow-50 border-yellow-300 text-yellow-900'
  },
  [SeverityLevel.LOW]: {
    icon: '🟢',
    label: 'Low',
    color: 'bg-green-50 border-green-300 text-green-900'
  }
};

/**
 * IncidentLogForm Component
 * Quick form to log incidents with auto-escalation
 */
export const IncidentLogForm: React.FC<IncidentLogFormProps> = ({
  eventId,
  context,
  onSubmit,
  onCancel,
  autoFocus = false,
  readOnly = false,
  className = ''
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<IncidentFormData>({
    type: 'incident',
    category: IncidentCategory.OTHER,
    severity: SeverityLevel.MEDIUM,
    title: '',
    description: '',
    location: '',
    context
  });

  const [errors, setErrors] = useState<Partial<Record<keyof IncidentFormData, string>>>({});

  /**
   * Validate form data
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required (1-100 characters)';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required (10-2000 characters)';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description must be 2000 characters or less';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.length > 200) {
      newErrors.location = 'Location must be 200 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        toast.error('Please fix the errors below');
        return;
      }

      try {
        setIsSubmitting(true);
        await onSubmit(formData);
        toast.success('Incident logged successfully');
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to log incident';
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, onSubmit]
  );

  /**
   * Handle field change
   */
  const handleChange = useCallback(
    (field: keyof IncidentFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  /**
   * Get escalation info
   */
  const getEscalationInfo = () => {
    const rule = AUTO_ESCALATION_RULES[formData.severity];
    if (!rule) return null;

    const levelNames: Record<ContextLevel, string> = {
      [ContextLevel.INDIVIDUAL]: 'Individual',
      [ContextLevel.FAMILY]: 'Family',
      [ContextLevel.COMMUNITY]: 'Community',
      [ContextLevel.PROFESSIONAL]: 'Professional'
    };

    return {
      escalateTo: levelNames[rule.escalateTo],
      delay: rule.notifyDelay
    };
  };

  const escalationInfo = getEscalationInfo();

  return (
    <form onSubmit={handleSubmit} className={`incident-log-form ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">🚨</span>
          Log Incident
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Report an incident to notify family and escalate if needed
        </p>
      </div>

      {/* Category Selection */}
      <div className="mb-6">
        <label
          htmlFor="category"
          className="block text-sm font-semibold text-gray-900 mb-3"
        >
          Category <span className="text-red-600">*</span>
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value as IncidentCategory)}
          disabled={readOnly || isSubmitting}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        >
          {Object.entries(CATEGORY_METADATA).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.icon} {meta.label} - {meta.description}
            </option>
          ))}
        </select>
      </div>

      {/* Severity Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Severity <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(SEVERITY_METADATA).map(([level, meta]) => (
            <button
              key={level}
              type="button"
              onClick={() =>
                !readOnly && !isSubmitting && handleChange('severity', level as SeverityLevel)
              }
              disabled={readOnly || isSubmitting}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                formData.severity === level
                  ? `${meta.color} border-current`
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              } disabled:opacity-50`}
            >
              <div className="text-lg mb-1">{meta.icon}</div>
              <div>{meta.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Title <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., Small fire in kitchen"
            maxLength={100}
            disabled={readOnly || isSubmitting}
            autoFocus={autoFocus}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="text-xs text-gray-600 mt-1">
            {formData.title.length}/100 characters
          </div>
        </div>
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Description <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="What happened? Include relevant details..."
            maxLength={2000}
            disabled={readOnly || isSubmitting}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="text-xs text-gray-600 mt-1">
            {formData.description.length}/2000 characters
          </div>
        </div>
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Location */}
      <div className="mb-6">
        <label
          htmlFor="location"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Location <span className="text-red-600">*</span>
        </label>
        <input
          id="location"
          type="text"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Kitchen, 123 Main Street"
          maxLength={200}
          disabled={readOnly || isSubmitting}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
            errors.location ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.location && (
          <p className="text-red-600 text-sm mt-1">{errors.location}</p>
        )}
      </div>

      {/* Escalation Warning */}
      {escalationInfo && formData.severity === SeverityLevel.CRITICAL && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-red-900">Auto-Escalation Warning</h4>
              <p className="text-sm text-red-800 mt-2">
                This incident will automatically:
              </p>
              <ul className="text-sm text-red-800 mt-2 space-y-1">
                <li>✓ Notify family immediately</li>
                <li>✓ Escalate to community if not resolved in 30 min</li>
                <li>✓ Alert professional help if still unresolved</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Standard Escalation Info */}
      {escalationInfo && formData.severity !== SeverityLevel.CRITICAL && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
          <p className="text-sm text-yellow-900">
            📋 Will escalate to <strong>{escalationInfo.escalateTo}</strong> if not
            resolved in {escalationInfo.delay} minutes
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={readOnly || isSubmitting}
          className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {formData.severity === SeverityLevel.CRITICAL ? (
            <>
              <span>🚨</span>
              <span>CRITICAL - Escalate Immediately</span>
            </>
          ) : (
            <>
              <span>✓</span>
              <span>Save & Notify Family</span>
            </>
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 text-gray-900 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Auto-save indicator (optional) */}
      {isSubmitting && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-300 rounded-lg text-sm text-blue-900">
          🔄 Logging incident and notifying family...
        </div>
      )}
    </form>
  );
};

export default IncidentLogForm;
