/**
 * 📊 POLL CREATION FORM
 * 
 * Create new polls for events with customizable options, types, and configuration
 * Full support for single-choice, multiple-choice, and ranking polls
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  PollType,
  Poll,
  PollConfig,
  CreatePollRequest,
  PollCreationFormProps,
} from '@/types/polling';
import { createPoll } from '@/services/pollService';

/**
 * Poll Creation Form Component
 */
export const PollCreationForm: React.FC<PollCreationFormProps> = ({
  eventId,
  onSuccess,
  onError,
  onCancel,
  context = 'family',
  prefilledTitle,
  prefilledQuestion,
}) => {
  // Form state
  const [title, setTitle] = useState(prefilledTitle || '');
  const [question, setQuestion] = useState(prefilledQuestion || '');
  const [description, setDescription] = useState('');
  const [pollType, setPollType] = useState<PollType>(PollType.SINGLE_CHOICE);
  const [options, setOptions] = useState<string[]>(['', '']);
  const [deadline, setDeadline] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('23:59');

  // Configuration state
  const [anonymous, setAnonymous] = useState(true);
  const [allowChangeVote, setAllowChangeVote] = useState(true);
  const [allowWithdrawVote, setAllowWithdrawVote] = useState(true);
  const [showResultsBeforeClose, setShowResultsBeforeClose] = useState(true);
  const [showVoterNames, setShowVoterNames] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'options' | 'settings'>('basic');

  // Handle option change
  const handleOptionChange = useCallback((index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }, [options]);

  // Add new option
  const handleAddOption = useCallback(() => {
    setOptions([...options, '']);
  }, [options]);

  // Remove option
  const handleRemoveOption = useCallback((index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  }, [options]);

  // Validate form
  const validateForm = useCallback((): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!title.trim()) {
      errors.push('Poll title is required');
    }

    if (!question.trim()) {
      errors.push('Poll question is required');
    }

    const validOptions = options.filter(opt => opt.trim().length > 0);
    if (validOptions.length < 2) {
      errors.push('Poll must have at least 2 options');
    }

    if (!deadline) {
      errors.push('Deadline date is required');
    }

    if (deadline) {
      const deadlineDate = new Date(`${deadline}T${deadlineTime}`);
      const now = new Date();
      if (deadlineDate <= now) {
        errors.push('Deadline must be in the future');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }, [title, question, options, deadline, deadlineTime]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateForm();
    if (!validation.valid) {
      setError(validation.errors.join('; '));
      return;
    }

    try {
      setLoading(true);

      const deadlineDate = new Date(`${deadline}T${deadlineTime}`);

      const request: CreatePollRequest = {
        eventId,
        title,
        question,
        description: description || undefined,
        type: pollType,
        options: options.filter(opt => opt.trim().length > 0),
        deadline: deadlineDate,
        config: {
          anonymous,
          allowChangeVote,
          allowWithdrawVote,
          showResultsBeforeClose,
          showVoterNames,
          multipleVotesPerUser: false,
          requireComment: false,
          notifyOnVote: false,
          notifyOnClose: true,
        },
        participantIds: [], // Would be populated by backend
        context,
      };

      const response = await createPoll(request);

      if (!response.success) {
        setError(response.error || 'Failed to create poll');
        onError?.(response.error || 'Failed to create poll');
        return;
      }

      if (response.poll) {
        onSuccess(response.poll);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create poll';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum deadline (tomorrow)
  const getMinDeadlineDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Render basic tab
  const renderBasicTab = () => (
    <div className="space-y-4">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Poll Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Party Date Poll"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Question Input */}
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Poll Question *
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., Which date works best for you?"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Description Input */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add context or details about this poll..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Poll Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Poll Type *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { type: PollType.SINGLE_CHOICE, label: 'Single Choice', icon: '⭕' },
            { type: PollType.MULTIPLE_CHOICE, label: 'Multiple Choice', icon: '☑️' },
            { type: PollType.RANKING, label: 'Ranking', icon: '🏆' },
          ].map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => setPollType(type)}
              className={`p-3 rounded-lg border-2 transition ${
                pollType === type
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-xs font-medium">{label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Render options tab
  const renderOptionsTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Poll Options * (at least 2 required)
        </label>

        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => handleRemoveOption(index)}
                disabled={options.length <= 2}
                className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                title="Remove option"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddOption}
          className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition text-sm font-medium"
        >
          + Add Option
        </button>
      </div>

      {/* Deadline Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Deadline Date *
          </label>
          <input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={getMinDeadlineDate()}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="deadline-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Deadline Time *
          </label>
          <input
            id="deadline-time"
            type="time"
            value={deadlineTime}
            onChange={(e) => setDeadlineTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  // Render settings tab
  const renderSettingsTab = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        {/* Anonymous Voting */}
        <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white text-sm">Anonymous Voting</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Don't reveal who voted for what</div>
          </div>
        </label>

        {/* Show Results Before Close */}
        <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition">
          <input
            type="checkbox"
            checked={showResultsBeforeClose}
            onChange={(e) => setShowResultsBeforeClose(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white text-sm">Show Results Before Closing</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Voters can see live results as votes come in</div>
          </div>
        </label>

        {/* Allow Change Vote */}
        <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition">
          <input
            type="checkbox"
            checked={allowChangeVote}
            onChange={(e) => setAllowChangeVote(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white text-sm">Allow Vote Changes</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Voters can change their vote before deadline</div>
          </div>
        </label>

        {/* Allow Withdraw Vote */}
        <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition">
          <input
            type="checkbox"
            checked={allowWithdrawVote}
            onChange={(e) => setAllowWithdrawVote(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white text-sm">Allow Vote Withdrawal</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Voters can remove their vote before deadline</div>
          </div>
        </label>

        {/* Show Voter Names (only if not anonymous) */}
        {!anonymous && (
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition">
            <input
              type="checkbox"
              checked={showVoterNames}
              onChange={(e) => setShowVoterNames(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-white text-sm">Show Voter Names in Results</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Display which voters chose which options</div>
            </div>
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 border-b border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                📊 Create Poll
              </h2>
              <p className="text-blue-100 text-sm mt-1">Set up a new poll for this event</p>
            </div>
            <button
              onClick={onCancel}
              className="text-2xl hover:opacity-75 transition"
              disabled={loading}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {(['basic', 'options', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 font-medium text-sm transition ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {tab === 'basic' && '📝 Basic'}
              {tab === 'options' && '⭕ Options'}
              {tab === 'settings' && '⚙️ Settings'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'basic' && renderBasicTab()}
          {activeTab === 'options' && renderOptionsTab()}
          {activeTab === 'settings' && renderSettingsTab()}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 dark:bg-opacity-30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
              <div className="font-medium">Error</div>
              <div>{error}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 p-6 border-t border-gray-200 dark:border-gray-600 flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 font-medium transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Creating...
              </>
            ) : (
              <>
                ✓ Create Poll
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollCreationForm;
