/**
 * useVideoConference Hook - React Integration for Video Conferencing
 * 
 * Provides React-friendly interface to VideoConferenceService with state management,
 * event handling, and Ubuntu-aligned consent flows.
 * 
 * @module useVideoConference
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  VideoConferenceService,
  getVideoConferenceService,
  RoomOptions,
  Participant,
  VideoSession,
  SessionMetrics,
  ConsentToken
} from '@/services/VideoConferenceService';
import { DailyParticipant } from '@daily-co/daily-js';

interface UseVideoConferenceReturn {
  // State
  session: VideoSession | null;
  participants: DailyParticipant[];
  isConnected: boolean;
  isRecording: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  error: string | null;
  
  // Actions
  createRoom: (options: RoomOptions) => Promise<string>;
  joinRoom: (roomUrl: string, participant: Participant) => Promise<void>;
  leaveRoom: () => Promise<SessionMetrics | null>;
  toggleMute: () => Promise<void>;
  toggleVideo: () => Promise<void>;
  startScreenShare: () => Promise<void>;
  stopScreenShare: () => Promise<void>;
  startRecording: (consentTokens: ConsentToken[]) => Promise<void>;
  stopRecording: () => Promise<void>;
}

/**
 * Custom hook for managing video conference functionality
 */
export function useVideoConference(): UseVideoConferenceReturn {
  const serviceRef = useRef<VideoConferenceService | null>(null);
  const [session, setSession] = useState<VideoSession | null>(null);
  const [participants, setParticipants] = useState<DailyParticipant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize service
  useEffect(() => {
    serviceRef.current = getVideoConferenceService();

    // Set up event listeners
    if (serviceRef.current) {
      serviceRef.current.on('participant-joined', handleParticipantJoined);
      serviceRef.current.on('participant-left', handleParticipantLeft);
      serviceRef.current.on('participant-updated', handleParticipantUpdated);
      serviceRef.current.on('recording-started', handleRecordingStarted);
      serviceRef.current.on('recording-stopped', handleRecordingStopped);
      serviceRef.current.on('error', handleError);
    }

    return () => {
      // Cleanup
      if (serviceRef.current) {
        serviceRef.current.off('participant-joined', handleParticipantJoined);
        serviceRef.current.off('participant-left', handleParticipantLeft);
        serviceRef.current.off('participant-updated', handleParticipantUpdated);
        serviceRef.current.off('recording-started', handleRecordingStarted);
        serviceRef.current.off('recording-stopped', handleRecordingStopped);
        serviceRef.current.off('error', handleError);
      }
    };
  }, []);

  // Event handlers
  const handleParticipantJoined = useCallback((event: any) => {
    console.log('Participant joined:', event);
    updateParticipants();
  }, []);

  const handleParticipantLeft = useCallback((event: any) => {
    console.log('Participant left:', event);
    updateParticipants();
  }, []);

  const handleParticipantUpdated = useCallback((event: any) => {
    console.log('Participant updated:', event);
    updateParticipants();
  }, []);

  const handleRecordingStarted = useCallback(() => {
    setIsRecording(true);
  }, []);

  const handleRecordingStopped = useCallback(() => {
    setIsRecording(false);
  }, []);

  const handleError = useCallback((event: any) => {
    console.error('Video conference error:', event);
    setError(event.errorMsg || 'An error occurred');
  }, []);

  const updateParticipants = useCallback(() => {
    if (serviceRef.current) {
      const newParticipants = serviceRef.current.getParticipants();
      setParticipants(newParticipants);
    }
  }, []);

  // Action: Create a new room
  const createRoom = useCallback(async (options: RoomOptions): Promise<string> => {
    try {
      setError(null);
      if (!serviceRef.current) {
        throw new Error('Video service not initialized');
      }

      const roomInfo = await serviceRef.current.createRoom(options);
      // Daily API returns room info with URL constructed from domain
      const roomUrl = `https://${process.env.NEXT_PUBLIC_DAILY_DOMAIN || 'salatiso.daily.co'}/${roomInfo.name}`;
      return roomUrl;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create room';
      setError(errorMsg);
      throw err;
    }
  }, []);

  // Action: Join a room
  const joinRoom = useCallback(async (roomUrl: string, participant: Participant): Promise<void> => {
    try {
      setError(null);
      if (!serviceRef.current) {
        throw new Error('Video service not initialized');
      }

      const newSession = await serviceRef.current.joinRoom(roomUrl, participant);
      setSession(newSession);
      setIsConnected(true);
      updateParticipants();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to join room';
      setError(errorMsg);
      throw err;
    }
  }, [updateParticipants]);

  // Action: Leave the room
  const leaveRoom = useCallback(async (): Promise<SessionMetrics | null> => {
    try {
      if (!serviceRef.current || !session) {
        return null;
      }

      const metrics = await serviceRef.current.endSession(session);
      setSession(null);
      setIsConnected(false);
      setParticipants([]);
      setIsRecording(false);
      setIsScreenSharing(false);
      return metrics;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to leave room';
      setError(errorMsg);
      return null;
    }
  }, [session]);

  // Action: Toggle mute
  const toggleMute = useCallback(async (): Promise<void> => {
    try {
      if (!serviceRef.current) return;
      
      const newMuteState = !isMuted;
      await serviceRef.current.setLocalAudio(!newMuteState);
      setIsMuted(newMuteState);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to toggle mute';
      setError(errorMsg);
    }
  }, [isMuted]);

  // Action: Toggle video
  const toggleVideo = useCallback(async (): Promise<void> => {
    try {
      if (!serviceRef.current) return;
      
      const newVideoState = !isVideoOff;
      await serviceRef.current.setLocalVideo(!newVideoState);
      setIsVideoOff(newVideoState);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to toggle video';
      setError(errorMsg);
    }
  }, [isVideoOff]);

  // Action: Start screen share
  const startScreenShare = useCallback(async (): Promise<void> => {
    try {
      if (!serviceRef.current || !session) {
        throw new Error('No active session');
      }

      await serviceRef.current.shareScreen(session);
      setIsScreenSharing(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start screen share';
      setError(errorMsg);
    }
  }, [session]);

  // Action: Stop screen share
  const stopScreenShare = useCallback(async (): Promise<void> => {
    try {
      if (!serviceRef.current) return;

      await serviceRef.current.stopScreenShare();
      setIsScreenSharing(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to stop screen share';
      setError(errorMsg);
    }
  }, []);

  // Action: Start recording
  const startRecording = useCallback(async (consentTokens: ConsentToken[]): Promise<void> => {
    try {
      if (!serviceRef.current || !session) {
        throw new Error('No active session');
      }

      await serviceRef.current.recordSession(session, consentTokens);
      setIsRecording(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMsg);
      throw err; // Re-throw for consent error handling
    }
  }, [session]);

  // Action: Stop recording
  const stopRecording = useCallback(async (): Promise<void> => {
    try {
      if (!serviceRef.current) return;

      await serviceRef.current.stopRecording();
      setIsRecording(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to stop recording';
      setError(errorMsg);
    }
  }, []);

  return {
    // State
    session,
    participants,
    isConnected,
    isRecording,
    isMuted,
    isVideoOff,
    isScreenSharing,
    error,
    
    // Actions
    createRoom,
    joinRoom,
    leaveRoom,
    toggleMute,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    startRecording,
    stopRecording
  };
}

export default useVideoConference;
