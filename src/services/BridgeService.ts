/**
 * BridgeService - Web-to-Mobile Communication Layer
 * 
 * Handles bidirectional communication between the web app and Sonny Android app
 * via WebSocket connections with automatic reconnection and message queuing.
 */

import { db } from '@/config/firebase';
import { collection, doc, setDoc, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';

export enum BridgeStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
  SYNCING = 'SYNCING',
}

export enum MessageType {
  PING = 'PING',
  PONG = 'PONG',
  SYNC_REQUEST = 'SYNC_REQUEST',
  SYNC_RESPONSE = 'SYNC_RESPONSE',
  DATA_UPDATE = 'DATA_UPDATE',
  PRESENCE_UPDATE = 'PRESENCE_UPDATE',
  COMMAND = 'COMMAND',
}

export interface BridgeMessage {
  id: string;
  type: MessageType;
  payload: any;
  timestamp: number;
  deviceId: string;
  userId: string;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'web' | 'android' | 'ios';
  lastSeen: number;
  version: string;
  status: 'online' | 'offline' | 'syncing';
}

export interface SyncProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
  lastSync: number | null;
}

class BridgeServiceClass {
  private status: BridgeStatus = BridgeStatus.DISCONNECTED;
  private messageQueue: BridgeMessage[] = [];
  private connectedDevices: Map<string, ConnectedDevice> = new Map();
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private unsubscribers: (() => void)[] = [];
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private deviceId: string = '';
  private userId: string = '';
  private syncProgress: SyncProgress = {
    total: 0,
    completed: 0,
    failed: 0,
    inProgress: 0,
    lastSync: null,
  };

  /**
   * Initialize the bridge service
   */
  async initialize(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required to initialize BridgeService');
    }

    this.userId = userId;
    this.deviceId = this.generateDeviceId();
    
    console.log('[BridgeService] Initializing for user:', userId);
    
    try {
      this.setStatus(BridgeStatus.CONNECTING);
      
      // Register this device
      await this.registerDevice();
      
      // Start listening for messages
      this.startMessageListener();
      
      // Start listening for device presence
      this.startDeviceListener();
      
      // Start heartbeat
      this.startHeartbeat();
      
      this.setStatus(BridgeStatus.CONNECTED);
      console.log('[BridgeService] Connected successfully');
    } catch (error) {
      console.error('[BridgeService] Initialization failed:', error);
      this.setStatus(BridgeStatus.ERROR);
      throw error;
    }
  }

  /**
   * Disconnect and cleanup
   */
  disconnect(): void {
    console.log('[BridgeService] Disconnecting...');
    
    // Stop heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    // Unsubscribe from all listeners
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];
    
    // Clear state
    this.connectedDevices.clear();
    this.messageQueue = [];
    
    this.setStatus(BridgeStatus.DISCONNECTED);
  }

  /**
   * Send message to connected devices
   */
  async sendMessage(type: MessageType, payload: any, targetDeviceId?: string): Promise<void> {
    const message: BridgeMessage = {
      id: this.generateMessageId(),
      type,
      payload,
      timestamp: Date.now(),
      deviceId: this.deviceId,
      userId: this.userId,
    };

    try {
      // If targeting specific device, filter in Firestore
      const messageRef = doc(collection(db, 'bridge_messages'), message.id);
      await setDoc(messageRef, {
        ...message,
        targetDeviceId: targetDeviceId || null,
        read: false,
        createdAt: new Date(),
      });

      console.log('[BridgeService] Message sent:', type, 'to', targetDeviceId || 'all devices');
    } catch (error) {
      console.error('[BridgeService] Failed to send message:', error);
      // Add to queue for retry
      this.messageQueue.push(message);
      throw error;
    }
  }

  /**
   * Request sync from mobile devices
   */
  async requestSync(collections: string[]): Promise<void> {
    this.setStatus(BridgeStatus.SYNCING);
    this.syncProgress = {
      total: collections.length,
      completed: 0,
      failed: 0,
      inProgress: collections.length,
      lastSync: Date.now(),
    };

    await this.sendMessage(MessageType.SYNC_REQUEST, {
      collections,
      timestamp: Date.now(),
    });

    this.notifyListeners('syncProgress', this.syncProgress);
  }

  /**
   * Get current status
   */
  getStatus(): BridgeStatus {
    return this.status;
  }

  /**
   * Get connected devices
   */
  getConnectedDevices(): ConnectedDevice[] {
    return Array.from(this.connectedDevices.values());
  }

  /**
   * Get sync progress
   */
  getSyncProgress(): SyncProgress {
    return { ...this.syncProgress };
  }

  /**
   * Subscribe to events
   */
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * Private: Register this device in Firestore
   */
  private async registerDevice(): Promise<void> {
    const device: ConnectedDevice = {
      id: this.deviceId,
      name: this.getDeviceName(),
      type: 'web',
      lastSeen: Date.now(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      status: 'online',
    };

    const deviceRef = doc(db, 'bridge_devices', this.deviceId);
    await setDoc(deviceRef, {
      ...device,
      userId: this.userId,
      updatedAt: new Date(),
    }, { merge: true });

    this.connectedDevices.set(this.deviceId, device);
  }

  /**
   * Private: Start listening for incoming messages
   */
  private startMessageListener(): void {
    const messagesRef = collection(db, 'bridge_messages');
    const q = query(
      messagesRef,
      where('userId', '==', this.userId),
      where('read', '==', false),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const message = change.doc.data() as BridgeMessage & { targetDeviceId?: string };
          
          // Skip messages from this device
          if (message.deviceId === this.deviceId) {
            return;
          }

          // Skip messages targeted at other devices
          if (message.targetDeviceId && message.targetDeviceId !== this.deviceId) {
            return;
          }

          console.log('[BridgeService] Received message:', message.type);
          this.handleIncomingMessage(message);

          // Mark as read
          await setDoc(change.doc.ref, { read: true }, { merge: true });
        }
      });
    });

    this.unsubscribers.push(unsubscribe);
  }

  /**
   * Private: Start listening for device presence
   */
  private startDeviceListener(): void {
    const devicesRef = collection(db, 'bridge_devices');
    const q = query(
      devicesRef,
      where('userId', '==', this.userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.forEach((doc) => {
        const device = doc.data() as ConnectedDevice;
        
        // Check if device is still online (within last 30 seconds)
        const isOnline = Date.now() - device.lastSeen < 30000;
        device.status = isOnline ? 'online' : 'offline';
        
        this.connectedDevices.set(device.id, device);
      });

      console.log('[BridgeService] Connected devices:', this.connectedDevices.size);
      this.notifyListeners('devicesUpdated', this.getConnectedDevices());
    });

    this.unsubscribers.push(unsubscribe);
  }

  /**
   * Private: Handle incoming message
   */
  private handleIncomingMessage(message: BridgeMessage): void {
    switch (message.type) {
      case MessageType.PING:
        this.sendMessage(MessageType.PONG, { timestamp: Date.now() }, message.deviceId);
        break;

      case MessageType.SYNC_RESPONSE:
        this.handleSyncResponse(message.payload);
        break;

      case MessageType.DATA_UPDATE:
        this.notifyListeners('dataUpdate', message.payload);
        break;

      case MessageType.PRESENCE_UPDATE:
        this.notifyListeners('presenceUpdate', message.payload);
        break;

      default:
        console.log('[BridgeService] Unhandled message type:', message.type);
    }
  }

  /**
   * Private: Handle sync response
   */
  private handleSyncResponse(payload: any): void {
    if (payload.success) {
      this.syncProgress.completed++;
      this.syncProgress.inProgress--;
    } else {
      this.syncProgress.failed++;
      this.syncProgress.inProgress--;
    }

    if (this.syncProgress.inProgress === 0) {
      this.setStatus(BridgeStatus.CONNECTED);
      this.syncProgress.lastSync = Date.now();
    }

    this.notifyListeners('syncProgress', this.syncProgress);
  }

  /**
   * Private: Start heartbeat to keep device online
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(async () => {
      try {
        const deviceRef = doc(db, 'bridge_devices', this.deviceId);
        await setDoc(deviceRef, {
          lastSeen: Date.now(),
          status: 'online',
          updatedAt: new Date(),
        }, { merge: true });

        // Process queued messages
        await this.processMessageQueue();
      } catch (error) {
        console.error('[BridgeService] Heartbeat failed:', error);
      }
    }, 15000); // Every 15 seconds
  }

  /**
   * Private: Process queued messages
   */
  private async processMessageQueue(): Promise<void> {
    if (this.messageQueue.length === 0) {
      return;
    }

    console.log('[BridgeService] Processing message queue:', this.messageQueue.length);
    
    const queue = [...this.messageQueue];
    this.messageQueue = [];

    for (const message of queue) {
      try {
        await this.sendMessage(message.type, message.payload);
      } catch (error) {
        console.error('[BridgeService] Failed to send queued message:', error);
        this.messageQueue.push(message);
      }
    }
  }

  /**
   * Private: Set status and notify listeners
   */
  private setStatus(status: BridgeStatus): void {
    this.status = status;
    console.log('[BridgeService] Status changed:', status);
    this.notifyListeners('statusChanged', status);
  }

  /**
   * Private: Notify all listeners for an event
   */
  private notifyListeners(event: string, data: any): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('[BridgeService] Listener error:', error);
        }
      });
    }
  }

  /**
   * Private: Generate unique device ID
   */
  private generateDeviceId(): string {
    if (typeof window !== 'undefined') {
      let deviceId = localStorage.getItem('deviceId');
      if (!deviceId) {
        deviceId = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('deviceId', deviceId);
      }
      return deviceId;
    }
    return `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Private: Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Private: Get device name
   */
  private getDeviceName(): string {
    if (typeof window !== 'undefined') {
      return `${navigator.platform} - ${navigator.userAgent.split('(')[0].trim()}`;
    }
    return 'Web Browser';
  }
}

// Export singleton instance
export const BridgeService = new BridgeServiceClass();
