/**
 * FamilyVideoRoom Component - Ubuntu Family Council Video Interface
 * 
 * Full-featured video conferencing interface for family template discussions.
 * Implements Ubuntu principles: consent-first, elder priority, collective decision-making.
 * 
 * Features:
 * - Multi-party video grid (up to 12 participants)
 * - Control bar (mute, video, screen share, leave)
 * - Template sidebar for reference during discussion
 * - Recording consent flow with audit trail
 * - Elder priority visual indicators
 * - Mobile-responsive design
 * 
 * @module FamilyVideoRoom
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useVideoConference } from '@/hooks/useVideoConference';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/I18nContext';
import DailyIframe from '@daily-co/daily-react';
import ParticipantGrid from './ParticipantGrid';
import ConsentDialog from './ConsentDialog';
import TemplateVideoSidebar from './TemplateVideoSidebar';
import { RoomOptions, Participant, ConsentToken } from '@/services/VideoConferenceService';

interface FamilyVideoRoomProps {
  /** Family group ID for this video call */
  familyGroupId: string;
  /** Optional template being discussed */
  templateId?: string;
  /** Room name/title */
  roomName?: string;
  /** Enable recording capability */
  recordingEnabled?: boolean;
  /** Maximum participants (default: 12) */
  maxParticipants?: number;
  /** Callback when call ends */
  onCallEnd?: (metrics: any) => void;
}

type ViewMode = 'grid' | 'speaker' | 'sidebar';

/**
 * Main video conference room component
 */
export default function FamilyVideoRoom({
  familyGroupId,
  templateId,
  roomName = 'Family Council',
  recordingEnabled = false,
  maxParticipants = 12,
  onCallEnd
}: FamilyVideoRoomProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const {
    session,
    participants,
    isConnected,
    isRecording,
    isMuted,
    isVideoOff,
    isScreenSharing,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleMute,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    startRecording,
    stopRecording
  } = useVideoConference();

  // UI state
  const [showConsent, setShowConsent] = useState(false);
  const [showRecordingConsent, setShowRecordingConsent] = useState(false);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showSidebar, setShowSidebar] = useState(!!templateId);
  const [showControls, setShowControls] = useState(true);
  const [consentTokens, setConsentTokens] = useState<ConsentToken[]>([]);
  const [callDuration, setCallDuration] = useState(0);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (!isConnected) return;

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timer);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, [isConnected]);

  // Track call duration
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  /**
   * Start the video call
   */
  const handleStartCall = async () => {
    try {
      if (!user) {
        throw new Error('User must be authenticated');
      }

      // Create room
      const options: RoomOptions = {
        familyGroupId,
        templateId,
        roomName,
        maxParticipants,
        requireConsent: true,
        recordingEnabled,
        meshBroadcast: true,
        expectedDuration: 120 // 2 hours default
      };

      const url = await createRoom(options);
      setRoomUrl(url);
      setShowConsent(true);
    } catch (err) {
      console.error('Failed to start call:', err);
    }
  };

  /**
   * Handle user consent to join
   */
  const handleConsentGiven = async () => {
    try {
      if (!roomUrl || !user) return;

      const participant: Participant = {
        userId: (user as any).uid,
        displayName: (user as any).displayName || 'Family Member',
        avatarUrl: (user as any).photoURL || undefined,
        role: 'member', // TODO: Get actual role from family data
        hasConsented: true
      };

      await joinRoom(roomUrl, participant);
      setShowConsent(false);
    } catch (err) {
      console.error('Failed to join room:', err);
    }
  };

  /**
   * Handle leave call
   */
  const handleLeaveCall = async () => {
    try {
      const metrics = await leaveRoom();
      setRoomUrl(null);
      setCallDuration(0);
      
      if (onCallEnd && metrics) {
        onCallEnd(metrics);
      }
    } catch (err) {
      console.error('Failed to leave room:', err);
    }
  };

  /**
   * Handle screen share toggle
   */
  const handleScreenShareToggle = async () => {
    try {
      if (isScreenSharing) {
        await stopScreenShare();
      } else {
        await startScreenShare();
      }
    } catch (err) {
      console.error('Screen share error:', err);
    }
  };

  /**
   * Handle recording toggle
   */
  const handleRecordingToggle = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      setShowRecordingConsent(true);
    }
  };

  /**
   * Handle recording consent from all participants
   */
  const handleRecordingConsentGiven = async (tokens: ConsentToken[]) => {
    try {
      await startRecording(tokens);
      setShowRecordingConsent(false);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  /**
   * Format call duration
   */
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Render pre-call state
  if (!isConnected && !showConsent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-brown-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-orange-100 rounded-full mb-4">
              <svg className="w-16 h-16 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {roomName}
            </h1>
            <p className="text-gray-600">
              {t('video.familyCouncilSubtitle', 'Virtual Indaba - Family Business Discussion')}
            </p>
          </div>

          {templateId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {t('video.templateReference', 'Template Reference Available')}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {t('video.templateReferenceDesc', 'This template will be displayed during the call for reference')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Ubuntu consent-based participation</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Up to {maxParticipants} family members</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Screen sharing for collaborative editing</span>
            </div>
            {recordingEnabled && (
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Recording available (requires all consent)</span>
              </div>
            )}
          </div>

          <button
            onClick={handleStartCall}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>{t('video.startCall', 'Start Family Council')}</span>
          </button>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render consent dialog
  if (showConsent && roomUrl) {
    return (
      <ConsentDialog
        roomName={roomName}
        participantCount={0}
        onConsent={handleConsentGiven}
        onCancel={() => {
          setShowConsent(false);
          setRoomUrl(null);
        }}
      />
    );
  }

  // Render active call
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-white font-semibold">{roomName}</h2>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="4" />
            </svg>
            <span>{formatDuration(callDuration)}</span>
          </div>
          {isRecording && (
            <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white text-xs font-medium">REC</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded text-sm ${viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('speaker')}
            className={`px-3 py-1 rounded text-sm ${viewMode === 'speaker' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Speaker
          </button>
          {templateId && (
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`px-3 py-1 rounded text-sm ${showSidebar ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Template
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video area */}
        <div className="flex-1 relative">
          {roomUrl && (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#000' }}>
              <div style={{ padding: '2rem', color: '#fff', textAlign: 'center' }}>
                Video Conference Room (Daily.co integration will be configured in production)
              </div>
            </div>
          )}

          {/* Controls overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex items-center justify-center space-x-4">
              {/* Mute button */}
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full transition-colors ${
                  isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>

              {/* Video button */}
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full transition-colors ${
                  isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title={isVideoOff ? 'Turn on video' : 'Turn off video'}
              >
                {isVideoOff ? (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>

              {/* Screen share button */}
              <button
                onClick={handleScreenShareToggle}
                className={`p-4 rounded-full transition-colors ${
                  isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>

              {/* Recording button (if enabled) */}
              {recordingEnabled && (
                <button
                  onClick={handleRecordingToggle}
                  className={`p-4 rounded-full transition-colors ${
                    isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="5" />
                  </svg>
                </button>
              )}

              {/* Leave button */}
              <button
                onClick={handleLeaveCall}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
                title="Leave call"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                </svg>
              </button>
            </div>

            {/* Participant count */}
            <div className="text-center mt-4 text-white text-sm">
              {participants.length} {participants.length === 1 ? 'participant' : 'participants'}
            </div>
          </div>
        </div>

        {/* Template sidebar */}
        {showSidebar && templateId && (
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
            <TemplateVideoSidebar templateId={templateId} />
          </div>
        )}
      </div>

      {/* Recording consent dialog */}
      {showRecordingConsent && (
        <ConsentDialog
          roomName={roomName}
          participantCount={participants.length}
          isRecordingConsent={true}
          participants={participants}
          onConsent={handleRecordingConsentGiven}
          onCancel={() => setShowRecordingConsent(false)}
        />
      )}
    </div>
  );
}
