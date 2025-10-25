/**
 * Video Conference Service Tests
 * 
 * Tests for Daily.co video conferencing integration
 * 
 * @jest-environment jsdom
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { VideoConferenceService } from '@/services/VideoConferenceService';

// Mock Daily.co
jest.mock('@daily-co/daily-js', () => ({
  __esModule: true,
  default: {
    createCallObject: jest.fn(() => ({
      join: jest.fn().mockResolvedValue({ local: { user_name: 'Test User' } }),
      leave: jest.fn().mockResolvedValue(undefined),
      setLocalVideo: jest.fn(),
      setLocalAudio: jest.fn(),
      startScreenShare: jest.fn().mockResolvedValue(undefined),
      stopScreenShare: jest.fn(),
      startRecording: jest.fn().mockResolvedValue({ id: 'recording-123' }),
      stopRecording: jest.fn(),
      participants: jest.fn().mockReturnValue({}),
      destroy: jest.fn(),
      on: jest.fn(),
      off: jest.fn()
    }))
  }
}));

// Mock Firestore
jest.mock('@/config/firebase', () => ({
  db: {},
  auth: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn().mockResolvedValue(undefined),
  getDoc: jest.fn().mockResolvedValue({ exists: () => false }),
  updateDoc: jest.fn().mockResolvedValue(undefined),
  Timestamp: {
    fromDate: jest.fn((date) => date),
    now: jest.fn(() => new Date())
  }
}));

describe('VideoConferenceService', () => {
  let service: VideoConferenceService;

  beforeEach(() => {
    service = new VideoConferenceService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createRoom', () => {
    it('should create a video conference room', async () => {
      const roomConfig = {
        familyId: 'family-123',
        templateId: 'template-456',
        hostId: 'user-789',
        hostName: 'John Doe',
        maxParticipants: 10
      };

      const room = await service.createRoom(roomConfig);

      expect(room).toBeDefined();
      expect(room.roomId).toBeDefined();
      expect(room.roomUrl).toContain('daily.co');
      expect(room.familyId).toBe('family-123');
      expect(room.templateId).toBe('template-456');
      expect(room.hostId).toBe('user-789');
      expect(room.maxParticipants).toBe(10);
      expect(room.participants).toHaveLength(0);
      expect(room.isRecording).toBe(false);
    });

    it('should use default max participants if not specified', async () => {
      const roomConfig = {
        familyId: 'family-123',
        templateId: 'template-456',
        hostId: 'user-789',
        hostName: 'John Doe'
      };

      const room = await service.createRoom(roomConfig);

      expect(room.maxParticipants).toBe(12); // Default value
    });

    it('should generate unique room IDs', async () => {
      const roomConfig = {
        familyId: 'family-123',
        templateId: 'template-456',
        hostId: 'user-789',
        hostName: 'John Doe'
      };

      const room1 = await service.createRoom(roomConfig);
      const room2 = await service.createRoom(roomConfig);

      expect(room1.roomId).not.toBe(room2.roomId);
    });
  });

  describe('joinRoom', () => {
    it('should allow user to join room with consent', async () => {
      const room = await service.createRoom({
        familyId: 'family-123',
        templateId: 'template-456',
        hostId: 'user-789',
        hostName: 'Host User'
      });

      const joinResult = await service.joinRoom({
        roomId: room.roomId,
        userId: 'user-456',
        userName: 'John Doe',
        userRole: 'member',
        hasConsent: true
      });

      expect(joinResult.success).toBe(true);
      expect(joinResult.callObject).toBeDefined();
    });

    it('should reject join without consent', async () => {
      const room = await service.createRoom({
        familyId: 'family-123',
        templateId: 'template-456',
        hostId: 'user-789',
        hostName: 'Host User'
      });

      await expect(
        service.joinRoom({
          roomId: room.roomId,
          userId: 'user-456',
          userName: 'John Doe',
          userRole: 'member',
          hasConsent: false
        })
      ).rejects.toThrow('User consent required');
    });

    it('should reject join when room is full', async () => {
      const room = await service.createRoom({
        familyId: 'family-123',
        templateId: 'template-456',
        hostId: 'user-789',
        hostName: 'Host User',
        maxParticipants: 2
      });

      // Fill the room
      await service.joinRoom({
        roomId: room.roomId,
        userId: 'user-1',
        userName: 'User 1',
        userRole: 'member',
        hasConsent: true
      });

      await service.joinRoom({
        roomId: room.roomId,
        userId: 'user-2',
        userName: 'User 2',
        userRole: 'member',
        hasConsent: true
      });

      // Try to join when full
      await expect(
        service.joinRoom({
          roomId: room.roomId,
          userId: 'user-3',
          userName: 'User 3',
          userRole: 'member',
          hasConsent: true
        })
      ).rejects.toThrow('Room is full');
    });
  });

  describe('startRecording', () => {
    it('should start recording with all participants consent', async () => {
      const room = await service.createRoom({
        familyId: 'family-123',
        templateId: 'template-456',
        hostId: 'user-789',
        hostName: 'Host User'
      });

      // Add participants
      await service.joinRoom({
        roomId: room.roomId,
        userId: 'user-1',
        userName: 'User 1',
        userRole: 'member',
        hasConsent: true
      });

      // Grant recording consent
      await service.grantRecordingConsent(room.roomId, 'user-789');
      await service.grantRecordingConsent(room.roomId, 'user-1');

      const result = await service.startRecording(room.roomId, 'user-789');

      expect(result.success).toBe(true);
      expect(result.recordingId).toBeDefined();
    });

    it('should reject recording without unanimous consent', async () => {
      const room = await service.createRoom({
        familyId: 'family-123',
        templateId: 'template-456',
        hostId: 'user-789',
        hostName: 'Host User'
      });

      await service.joinRoom({
        roomId: room.roomId,
        userId: 'user-1',
        userName: 'User 1',
        userRole: 'member',
        hasConsent: true
      });

      // Only host grants consent
      await service.grantRecordingConsent(room.roomId, 'user-789');

      await expect(
        service.startRecording(room.roomId, 'user-789')
      ).rejects.toThrow('All participants must consent');
    });
  });

  describe('endSession', () => {
    it('should end session and cleanup resources', async () => {
      const room = await service.createRoom({
        familyId: 'family-123',
        templateId: 'template-456',
        hostId: 'user-789',
        hostName: 'Host User'
      });

      await service.joinRoom({
        roomId: room.roomId,
        userId: 'user-789',
        userName: 'Host User',
        userRole: 'elder',
        hasConsent: true
      });

      const metrics = await service.endSession(room.roomId, 'user-789');

      expect(metrics).toBeDefined();
      expect(metrics.duration).toBeGreaterThanOrEqual(0);
      expect(metrics.participantCount).toBeGreaterThan(0);
    });

    it('should calculate session metrics correctly', async () => {
      const room = await service.createRoom({
        familyId: 'family-123',
        templateId: 'template-456',
        hostId: 'user-789',
        hostName: 'Host User'
      });

      const startTime = Date.now();

      await service.joinRoom({
        roomId: room.roomId,
        userId: 'user-789',
        userName: 'Host User',
        userRole: 'elder',
        hasConsent: true
      });

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));

      const metrics = await service.endSession(room.roomId, 'user-789');

      expect(metrics.duration).toBeGreaterThan(0);
      expect(metrics.participantCount).toBe(1);
    });
  });

  describe('Ubuntu principles', () => {
    it('should prioritize elder participants', async () => {
      const room = await service.createRoom({
        familyId: 'family-123',
        templateId: 'template-456',
        hostId: 'user-elder',
        hostName: 'Elder User'
      });

      await service.joinRoom({
        roomId: room.roomId,
        userId: 'user-elder',
        userName: 'Elder User',
        userRole: 'elder',
        hasConsent: true
      });

      await service.joinRoom({
        roomId: room.roomId,
        userId: 'user-member',
        userName: 'Member User',
        userRole: 'member',
        hasConsent: true
      });

      const participants = service.getParticipants(room.roomId);
      
      // Elder should be first
      expect(participants[0].role).toBe('elder');
    });

    it('should require consent for all sensitive operations', async () => {
      const room = await service.createRoom({
        familyId: 'family-123',
        templateId: 'template-456',
        hostId: 'user-789',
        hostName: 'Host User'
      });

      // No consent = should fail
      await expect(
        service.joinRoom({
          roomId: room.roomId,
          userId: 'user-456',
          userName: 'John Doe',
          userRole: 'member',
          hasConsent: false
        })
      ).rejects.toThrow();
    });
  });
});
