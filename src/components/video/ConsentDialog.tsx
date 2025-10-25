/**
 * ConsentDialog Component - Ubuntu Consent Flow for Video Calls
 * 
 * Implements Ubuntu principle of explicit consent before joining calls or recording.
 * Displays clear explanation, collects consent, and provides audit trail.
 * 
 * @module ConsentDialog
 */

'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/contexts/I18nContext';
import { ConsentToken } from '@/services/VideoConferenceService';
import { DailyParticipant } from '@daily-co/daily-js';

interface ConsentDialogProps {
  /** Room/call name */
  roomName: string;
  /** Number of current participants */
  participantCount: number;
  /** Is this for recording consent (vs join consent) */
  isRecordingConsent?: boolean;
  /** List of participants (for recording consent) */
  participants?: DailyParticipant[];
  /** Callback when consent is given */
  onConsent: (tokens?: ConsentToken[]) => void;
  /** Callback when user cancels */
  onCancel: () => void;
}

/**
 * Ubuntu-themed consent dialog for video calls
 */
export default function ConsentDialog({
  roomName,
  participantCount,
  isRecordingConsent = false,
  participants = [],
  onConsent,
  onCancel
}: ConsentDialogProps) {
  const { t } = useTranslation();
  const [hasRead, setHasRead] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConsent = async () => {
    setIsSubmitting(true);
    
    // If recording consent, generate consent tokens for all participants
    if (isRecordingConsent) {
      const tokens: ConsentToken[] = participants.map(p => ({
        userId: (p.userData && typeof p.userData === 'object' && 'userId' in p.userData) 
          ? p.userData.userId as string 
          : p.session_id,
        timestamp: new Date(),
        consentType: 'recording',
        signature: generateSignature(p.session_id)
      }));
      onConsent(tokens);
    } else {
      onConsent();
    }
  };

  const generateSignature = (sessionId: string): string => {
    // Simple signature generation (in production, use proper crypto)
    return `sig-${sessionId}-${Date.now()}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isRecordingConsent 
                  ? t('consent.recordingTitle', 'Ubuntu Recording Consent') 
                  : t('consent.joinTitle', 'Ubuntu Family Council Consent')
                }
              </h2>
              <p className="text-orange-100 text-sm">
                {t('consent.subtitle', 'Umuntu Ngumuntu Ngabantu - I am because we are')}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Call information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              {t('consent.callInfo', 'Call Information')}
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>{t('consent.roomName', 'Room')}:</span>
                <span className="font-medium text-gray-900">{roomName}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('consent.participants', 'Current Participants')}:</span>
                <span className="font-medium text-gray-900">{participantCount}</span>
              </div>
              {isRecordingConsent && (
                <div className="flex justify-between">
                  <span>{t('consent.recordingType', 'Recording Type')}:</span>
                  <span className="font-medium text-gray-900">Cloud Recording</span>
                </div>
              )}
            </div>
          </div>

          {/* Consent explanation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              {isRecordingConsent 
                ? t('consent.recordingExplanation', 'What happens when you consent to recording?')
                : t('consent.joinExplanation', 'What happens when you join this call?')
              }
            </h3>

            {isRecordingConsent ? (
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {t('consent.recording.audio', 'Your audio and video will be recorded and stored securely for documentation purposes')}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {t('consent.recording.access', 'Only family members can access the recording')}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {t('consent.recording.retention', 'Recording will be automatically deleted after 30 days (POPIA compliance)')}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {t('consent.recording.audit', 'An audit trail of consent will be maintained')}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-orange-700">
                    {t('consent.recording.allRequired', 'ALL participants must consent before recording starts')}
                  </span>
                </li>
              </ul>
            ) : (
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {t('consent.join.video', 'Your camera and microphone will be accessible to other family members')}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {t('consent.join.participation', 'You agree to participate respectfully in collective decision-making')}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {t('consent.join.respect', 'You will honor the speaking order and elder guidance')}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {t('consent.join.confidentiality', 'You will keep family discussions confidential')}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {t('consent.join.ubuntu', 'You embrace the Ubuntu principle: "I am because we are"')}
                  </span>
                </li>
              </ul>
            )}
          </div>

          {/* Ubuntu principle highlight */}
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-orange-900">
                  {t('consent.ubuntuPrinciple', 'Ubuntu Principle')}
                </p>
                <p className="text-sm text-orange-700 mt-1">
                  {t('consent.ubuntuMeaning', 'A person is a person through other people. By consenting, you affirm your commitment to collective well-being and mutual respect.')}
                </p>
              </div>
            </div>
          </div>

          {/* Consent checkboxes */}
          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasRead}
                onChange={(e) => setHasRead(e.target.checked)}
                className="mt-1 w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">
                {isRecordingConsent
                  ? t('consent.checkRead.recording', 'I have read and understand that this call will be recorded with the consent of all participants')
                  : t('consent.checkRead.join', 'I have read and understand the terms of participation in this family council')
                }
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">
                {t('consent.checkAgree', 'I freely give my consent and commit to upholding Ubuntu values during this call')}
              </span>
            </label>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex items-center justify-between">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors disabled:opacity-50"
          >
            {t('consent.cancel', 'Cancel')}
          </button>
          
          <button
            onClick={handleConsent}
            disabled={!hasRead || !agreedToTerms || isSubmitting}
            className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{t('consent.submitting', 'Processing...')}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  {isRecordingConsent
                    ? t('consent.consentRecording', 'I Consent to Recording')
                    : t('consent.consentJoin', 'I Consent - Join Call')
                  }
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
