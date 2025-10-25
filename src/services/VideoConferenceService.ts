/**
 * Video Conference Service - Ubuntu Family Council Video Meetings
 * 
 * Enables virtual "indaba" (family councils) where distributed family members
 * can discuss templates, make decisions, and maintain cultural connections face-to-face.
 * 
 * Features:
 * - Multi-party video calls (up to 12 participants)
 * - Screen sharing for collaborative document editing
 * - Session recording with explicit consent
 * - Integration with Sonny mesh for offline fallback
 * - Ubuntu-aligned features (elder priority, talking stick, consent rituals)
 * 
 * @module VideoConferenceService
 */

import DailyIframe, { 
  DailyCall, 
  DailyEvent, 
  DailyEventObject,
  DailyParticipant,
  DailyCallOptions,
  DailyRoomInfo
} from '@daily-co/daily-js';

export interface RoomOptions {
  /** Link to active template being discussed */
  templateId?: string;
  /** Which family group this concerns */
  familyGroupId: string;
  /** Maximum participants (default: 12 for extended family) */
  maxParticipants?: number;
  /** Require Ubuntu consent before joining */
  requireConsent?: boolean;
  /** Enable session recording (requires all participant consent) */
  recordingEnabled?: boolean;
  /** Broadcast room status via Sonny mesh */
  meshBroadcast?: boolean;
  /** Room name/title for display */
  roomName?: string;
  /** Expected duration in minutes */
  expectedDuration?: number;
}

export interface Participant {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  role: 'elder' | 'member' | 'guest';
  hasConsented: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
}

export interface VideoSession {
  sessionId: string;
  roomUrl: string;
  roomName: string;
  startedAt: Date;
  participants: Map<string, Participant>;
  isRecording: boolean;
  templateId?: string;
  familyGroupId: string;
}

export interface SessionMetrics {
  sessionId: string;
  duration: number; // seconds
  participantCount: number;
  recordingDuration?: number;
  speakingTime: Map<string, number>; // userId -> seconds
  screenShareTime: number;
  endedAt: Date;
}

export interface ConsentToken {
  userId: string;
  timestamp: Date;
  consentType: 'recording' | 'participation';
  signature: string;
}

/**
 * Video Conference Service
 * Manages Daily.co integration for family video councils
 */
export class VideoConferenceService {
  private callObject: DailyCall | null = null;
  private currentSession: VideoSession | null = null;
  private eventHandlers: Map<string, Function[]> = new Map();
  private readonly DAILY_API_KEY: string;
  private readonly DAILY_DOMAIN: string;

  constructor(apiKey?: string, domain?: string) {
    // In production, these should come from environment variables
    this.DAILY_API_KEY = apiKey || process.env.NEXT_PUBLIC_DAILY_API_KEY || '';
    this.DAILY_DOMAIN = domain || process.env.NEXT_PUBLIC_DAILY_DOMAIN || '';
  }

  /**
   * Create a new video conference room
   * @param options Room configuration options
   * @returns Room information including join URL
   */
  async createRoom(options: RoomOptions): Promise<DailyRoomInfo> {
    try {
      // Call Daily API to create room
      const response = await fetch('https://api.daily.co/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.DAILY_API_KEY}`
        },
        body: JSON.stringify({
          name: this.generateRoomName(options.familyGroupId),
          privacy: 'private', // Require token to join
          properties: {
            max_participants: options.maxParticipants || 12,
            enable_screenshare: true,
            enable_chat: true,
            enable_recording: options.recordingEnabled ? 'cloud' : 'off',
            start_video_off: false,
            start_audio_off: false,
            exp: Math.floor(Date.now() / 1000) + (options.expectedDuration || 120) * 60, // Auto-expire
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create room: ${response.statusText}`);
      }

      const roomInfo = await response.json();
      
      // Store room metadata in Firestore (for persistence)
      await this.saveRoomMetadata(roomInfo.name, options);

      return roomInfo;
    } catch (error) {
      console.error('Error creating video room:', error);
      throw new Error('Failed to create video conference room');
    }
  }

  /**
   * Join an existing video conference room
   * @param roomUrl Daily.co room URL
   * @param participant Participant information
   * @returns Active video session
   */
  async joinRoom(roomUrl: string, participant: Participant): Promise<VideoSession> {
    try {
      // Check consent requirement
      if (!participant.hasConsented) {
        throw new Error('Ubuntu consent required before joining video council');
      }

      // Create Daily call object
      this.callObject = DailyIframe.createCallObject({
        url: roomUrl
      });

      // Set up event listeners
      this.setupEventListeners();

      // Join the call
      await this.callObject.join({
        userName: participant.displayName,
        userData: {
          userId: participant.userId,
          role: participant.role,
          avatarUrl: participant.avatarUrl
        }
      });

      // Get room info
      const roomInfo = await this.callObject.room();
      const roomName = (roomInfo && 'name' in roomInfo) ? roomInfo.name : 'Unknown';

      // Create session object
      const sessionId = this.generateSessionId();
      this.currentSession = {
        sessionId,
        roomUrl,
        roomName,
        startedAt: new Date(),
        participants: new Map([[participant.userId, participant]]),
        isRecording: false,
        familyGroupId: 'unknown' // Will be updated from room metadata
      };

      return this.currentSession;
    } catch (error) {
      console.error('Error joining video room:', error);
      throw new Error('Failed to join video conference');
    }
  }

  /**
   * Start screen sharing for collaborative template editing
   * @param session Active video session
   * @returns Screen share stream
   */
  async shareScreen(session: VideoSession): Promise<MediaStream | null> {
    try {
      if (!this.callObject) {
        throw new Error('No active call to share screen');
      }

      await this.callObject.startScreenShare();
      
      // Get the screen share track
      const localParticipant = this.callObject.participants().local;
      return localParticipant.screenVideoTrack ? 
        new MediaStream([localParticipant.screenVideoTrack]) : 
        null;
    } catch (error) {
      console.error('Error sharing screen:', error);
      return null;
    }
  }

  /**
   * Stop screen sharing
   */
  async stopScreenShare(): Promise<void> {
    if (this.callObject) {
      await this.callObject.stopScreenShare();
    }
  }

  /**
   * Start recording the session (requires all participant consent)
   * @param session Active video session
   * @param consentTokens Consent from all participants
   * @returns Recording ID
   */
  async recordSession(session: VideoSession, consentTokens: ConsentToken[]): Promise<string> {
    try {
      if (!this.callObject) {
        throw new Error('No active call to record');
      }

      // Verify consent from all participants
      const participants = Array.from(session.participants.keys());
      const consentedUsers = consentTokens
        .filter(token => token.consentType === 'recording')
        .map(token => token.userId);

      const missingConsent = participants.filter(p => !consentedUsers.includes(p));
      if (missingConsent.length > 0) {
        throw new Error(`Missing recording consent from: ${missingConsent.join(', ')}`);
      }

      // Start recording
      await this.callObject.startRecording();
      
      if (this.currentSession) {
        this.currentSession.isRecording = true;
      }

      // Store consent tokens in Firestore for audit trail
      await this.saveConsentTokens(session.sessionId, consentTokens);

      return `recording-${session.sessionId}`;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to start session recording');
    }
  }

  /**
   * Stop recording
   */
  async stopRecording(): Promise<void> {
    if (this.callObject) {
      await this.callObject.stopRecording();
      if (this.currentSession) {
        this.currentSession.isRecording = false;
      }
    }
  }

  /**
   * End the video session and collect metrics
   * @param session Active video session
   * @returns Session metrics for analytics
   */
  async endSession(session: VideoSession): Promise<SessionMetrics> {
    try {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - session.startedAt.getTime()) / 1000);

      // Stop recording if active
      if (session.isRecording) {
        await this.stopRecording();
      }

      // Leave the call
      if (this.callObject) {
        await this.callObject.leave();
        this.callObject.destroy();
        this.callObject = null;
      }

      // Calculate metrics
      const metrics: SessionMetrics = {
        sessionId: session.sessionId,
        duration,
        participantCount: session.participants.size,
        speakingTime: new Map(), // Would need Daily Analytics API for actual data
        screenShareTime: 0, // Tracked via events
        endedAt: endTime
      };

      // Save metrics to Firestore
      await this.saveSessionMetrics(metrics);

      this.currentSession = null;
      return metrics;
    } catch (error) {
      console.error('Error ending session:', error);
      throw new Error('Failed to end video session');
    }
  }

  /**
   * Get current participant list
   */
  getParticipants(): DailyParticipant[] {
    if (!this.callObject) return [];
    const participants = this.callObject.participants();
    return Object.values(participants);
  }

  /**
   * Mute/unmute local audio
   */
  async setLocalAudio(enabled: boolean): Promise<void> {
    if (this.callObject) {
      await this.callObject.setLocalAudio(enabled);
    }
  }

  /**
   * Enable/disable local video
   */
  async setLocalVideo(enabled: boolean): Promise<void> {
    if (this.callObject) {
      await this.callObject.setLocalVideo(enabled);
    }
  }

  /**
   * Subscribe to video conference events
   * @param event Event name
   * @param handler Event handler function
   */
  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(handler);
  }

  /**
   * Unsubscribe from events
   */
  off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Private helper methods

  private setupEventListeners(): void {
    if (!this.callObject) return;

    this.callObject.on('participant-joined', (event) => {
      this.emitEvent('participant-joined', event);
      this.updateParticipantList();
    });

    this.callObject.on('participant-left', (event) => {
      this.emitEvent('participant-left', event);
      this.updateParticipantList();
    });

    this.callObject.on('participant-updated', (event) => {
      this.emitEvent('participant-updated', event);
    });

    this.callObject.on('recording-started', () => {
      this.emitEvent('recording-started', {});
    });

    this.callObject.on('recording-stopped', () => {
      this.emitEvent('recording-stopped', {});
    });

    this.callObject.on('error', (event) => {
      this.emitEvent('error', event);
    });
  }

  private updateParticipantList(): void {
    if (!this.callObject || !this.currentSession) return;

    const dailyParticipants = this.callObject.participants();
    const updatedParticipants = new Map<string, Participant>();

    Object.values(dailyParticipants).forEach((dp) => {
      if (dp.userData && typeof dp.userData === 'object' && 'userId' in dp.userData) {
        const userData = dp.userData as Record<string, any>;
        const participant: Participant = {
          userId: userData.userId as string,
          displayName: dp.user_name || 'Unknown',
          avatarUrl: userData.avatarUrl as string | undefined,
          role: (userData.role as 'elder' | 'member' | 'guest') || 'member',
          hasConsented: true, // Already joined, so consented
          isMuted: !dp.audio,
          isVideoOff: !dp.video
        };
        updatedParticipants.set(participant.userId, participant);
      }
    });

    this.currentSession.participants = updatedParticipants;
  }

  private emitEvent(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  private generateRoomName(familyGroupId: string): string {
    const timestamp = Date.now();
    return `family-council-${familyGroupId}-${timestamp}`;
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async saveRoomMetadata(roomName: string, options: RoomOptions): Promise<void> {
    // TODO: Implement Firestore save
    // Store room metadata for later retrieval
    console.log('Saving room metadata:', roomName, options);
  }

  private async saveConsentTokens(sessionId: string, tokens: ConsentToken[]): Promise<void> {
    // TODO: Implement Firestore save for audit trail
    console.log('Saving consent tokens:', sessionId, tokens);
  }

  private async saveSessionMetrics(metrics: SessionMetrics): Promise<void> {
    // TODO: Implement Firestore save for analytics
    console.log('Saving session metrics:', metrics);
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.callObject) {
      this.callObject.destroy();
      this.callObject = null;
    }
    this.currentSession = null;
    this.eventHandlers.clear();
  }
}

// Export singleton instance
let serviceInstance: VideoConferenceService | null = null;

export const getVideoConferenceService = (): VideoConferenceService => {
  if (!serviceInstance) {
    serviceInstance = new VideoConferenceService();
  }
  return serviceInstance;
};

export default VideoConferenceService;
