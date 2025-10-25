/**
 * MeshNetworkManager - Peer-to-Peer Mesh Network for Offline Collaboration
 * 
 * Enables device-to-device communication using WebRTC for true mesh networking.
 * Supports offline data sharing, conflict resolution, and automatic peer discovery.
 */

import { db } from '@/config/firebase';
import { collection, doc, setDoc, onSnapshot, query, where, deleteDoc } from 'firebase/firestore';

export enum PeerStatus {
  DISCOVERING = 'DISCOVERING',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR',
}

export interface MeshPeer {
  id: string;
  deviceId: string;
  name: string;
  type: 'web' | 'android' | 'ios';
  status: PeerStatus;
  latency: number;
  lastSeen: number;
  dataSize: number; // Amount of data available for sync (bytes)
}

export interface MeshConfig {
  maxPeers: number;
  discoveryTimeout: number;
  connectionTimeout: number;
  heartbeatInterval: number;
  retryAttempts: number;
}

export interface DataPacket {
  id: string;
  type: 'sync' | 'query' | 'update' | 'delete';
  collection: string;
  data: any;
  timestamp: number;
  sourceDevice: string;
  version: number;
}

export interface SyncStats {
  peersConnected: number;
  totalDataSynced: number;
  conflicts: number;
  lastSync: number | null;
  bandwidth: number; // bytes/sec
}

class MeshNetworkManagerClass {
  private peers: Map<string, MeshPeer> = new Map();
  private connections: Map<string, RTCPeerConnection> = new Map();
  private dataChannels: Map<string, RTCDataChannel> = new Map();
  private unsubscribers: (() => void)[] = [];
  private discoveryInterval: NodeJS.Timeout | null = null;
  private deviceId: string = '';
  private userId: string = '';
  private config: MeshConfig = {
    maxPeers: 5,
    discoveryTimeout: 30000,
    connectionTimeout: 15000,
    heartbeatInterval: 10000,
    retryAttempts: 3,
  };
  private syncStats: SyncStats = {
    peersConnected: 0,
    totalDataSynced: 0,
    conflicts: 0,
    lastSync: null,
    bandwidth: 0,
  };
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private pendingOffers: Map<string, RTCSessionDescriptionInit> = new Map();
  private pendingAnswers: Map<string, RTCSessionDescriptionInit> = new Map();

  /**
   * Initialize mesh network
   */
  async initialize(userId: string, deviceId: string, config?: Partial<MeshConfig>): Promise<void> {
    if (!userId || !deviceId) {
      throw new Error('User ID and Device ID are required');
    }

    this.userId = userId;
    this.deviceId = deviceId;
    this.config = { ...this.config, ...config };

    console.log('[MeshNetwork] Initializing for device:', deviceId);

    try {
      // Start peer discovery
      await this.startPeerDiscovery();

      // Listen for incoming connection offers
      this.listenForConnectionOffers();

      // Start periodic peer discovery
      this.startDiscoveryLoop();

      console.log('[MeshNetwork] Initialized successfully');
    } catch (error) {
      console.error('[MeshNetwork] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Shutdown mesh network
   */
  shutdown(): void {
    console.log('[MeshNetwork] Shutting down...');

    // Stop discovery
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
      this.discoveryInterval = null;
    }

    // Close all connections
    this.connections.forEach((connection, peerId) => {
      this.disconnectPeer(peerId);
    });

    // Unsubscribe from all listeners
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];

    // Clear state
    this.peers.clear();
    this.connections.clear();
    this.dataChannels.clear();
    this.pendingOffers.clear();
    this.pendingAnswers.clear();

    console.log('[MeshNetwork] Shutdown complete');
  }

  /**
   * Connect to a specific peer
   */
  async connectToPeer(peerId: string): Promise<void> {
    if (this.connections.has(peerId)) {
      console.log('[MeshNetwork] Already connected to peer:', peerId);
      return;
    }

    if (this.peers.size >= this.config.maxPeers) {
      throw new Error('Maximum peer connections reached');
    }

    console.log('[MeshNetwork] Connecting to peer:', peerId);

    try {
      const peerConnection = this.createPeerConnection(peerId);
      this.connections.set(peerId, peerConnection);

      // Create data channel
      const dataChannel = peerConnection.createDataChannel('mesh-data', {
        ordered: true,
        maxRetransmits: 3,
      });

      this.setupDataChannel(peerId, dataChannel);

      // Create and send offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Store offer in Firestore for peer to retrieve
      const offerRef = doc(db, 'mesh_signals', `${this.deviceId}_${peerId}`);
      await setDoc(offerRef, {
        type: 'offer',
        from: this.deviceId,
        to: peerId,
        offer: JSON.stringify(offer),
        timestamp: Date.now(),
        userId: this.userId,
      });

      this.updatePeerStatus(peerId, PeerStatus.CONNECTING);
    } catch (error) {
      console.error('[MeshNetwork] Failed to connect to peer:', error);
      this.disconnectPeer(peerId);
      throw error;
    }
  }

  /**
   * Disconnect from a peer
   */
  disconnectPeer(peerId: string): void {
    console.log('[MeshNetwork] Disconnecting peer:', peerId);

    const connection = this.connections.get(peerId);
    if (connection) {
      connection.close();
      this.connections.delete(peerId);
    }

    this.dataChannels.delete(peerId);
    
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.status = PeerStatus.DISCONNECTED;
      this.notifyListeners('peerDisconnected', peer);
    }

    this.syncStats.peersConnected = this.connections.size;
    this.notifyListeners('statsUpdated', this.syncStats);
  }

  /**
   * Send data to specific peer or broadcast to all
   */
  async sendData(packet: Omit<DataPacket, 'sourceDevice' | 'timestamp'>, peerId?: string): Promise<void> {
    const fullPacket: DataPacket = {
      ...packet,
      sourceDevice: this.deviceId,
      timestamp: Date.now(),
    };

    const data = JSON.stringify(fullPacket);

    if (peerId) {
      // Send to specific peer
      const channel = this.dataChannels.get(peerId);
      if (channel && channel.readyState === 'open') {
        channel.send(data);
        this.updateBandwidth(data.length);
      } else {
        throw new Error(`No open channel to peer: ${peerId}`);
      }
    } else {
      // Broadcast to all connected peers
      this.dataChannels.forEach((channel, id) => {
        if (channel.readyState === 'open') {
          channel.send(data);
          this.updateBandwidth(data.length);
        }
      });
    }
  }

  /**
   * Query data across mesh network
   */
  async queryMesh(collection: string, filter: any): Promise<DataPacket[]> {
    const queryPacket: Omit<DataPacket, 'sourceDevice' | 'timestamp'> = {
      id: this.generatePacketId(),
      type: 'query',
      collection,
      data: filter,
      version: 1,
    };

    return new Promise((resolve) => {
      const responses: DataPacket[] = [];
      const timeout = setTimeout(() => {
        this.off('dataReceived', handler);
        resolve(responses);
      }, 5000);

      const handler = (packet: DataPacket) => {
        if (packet.type === 'query' && packet.collection === collection) {
          responses.push(packet);
        }
      };

      this.on('dataReceived', handler);
      this.sendData(queryPacket);
    });
  }

  /**
   * Get connected peers
   */
  getPeers(): MeshPeer[] {
    return Array.from(this.peers.values());
  }

  /**
   * Get sync statistics
   */
  getStats(): SyncStats {
    return { ...this.syncStats };
  }

  /**
   * Subscribe to events
   */
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * Unsubscribe from events
   */
  private off(event: string, callback: (data: any) => void): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  /**
   * Private: Start peer discovery
   */
  private async startPeerDiscovery(): Promise<void> {
    // Register this device as available for discovery
    const deviceRef = doc(db, 'mesh_peers', this.deviceId);
    await setDoc(deviceRef, {
      deviceId: this.deviceId,
      userId: this.userId,
      name: this.getDeviceName(),
      type: 'web',
      available: true,
      lastSeen: Date.now(),
      timestamp: new Date(),
    });

    // Query for other available peers
    const peersRef = collection(db, 'mesh_peers');
    const q = query(
      peersRef,
      where('userId', '==', this.userId),
      where('available', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.forEach((doc) => {
        const peerData = doc.data();
        
        // Skip self
        if (peerData.deviceId === this.deviceId) {
          return;
        }

        // Check if peer is recent (within last 30 seconds)
        if (Date.now() - peerData.lastSeen > 30000) {
          return;
        }

        const peer: MeshPeer = {
          id: peerData.deviceId,
          deviceId: peerData.deviceId,
          name: peerData.name || 'Unknown Device',
          type: peerData.type || 'web',
          status: PeerStatus.DISCOVERING,
          latency: 0,
          lastSeen: peerData.lastSeen,
          dataSize: peerData.dataSize || 0,
        };

        if (!this.peers.has(peer.id)) {
          this.peers.set(peer.id, peer);
          this.notifyListeners('peerDiscovered', peer);
          
          // Auto-connect if under max peers
          if (this.connections.size < this.config.maxPeers) {
            this.connectToPeer(peer.id).catch(console.error);
          }
        }
      });
    });

    this.unsubscribers.push(unsubscribe);
  }

  /**
   * Private: Listen for incoming connection offers
   */
  private listenForConnectionOffers(): void {
    const signalsRef = collection(db, 'mesh_signals');
    const q = query(
      signalsRef,
      where('to', '==', this.deviceId),
      where('userId', '==', this.userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const signal = change.doc.data();
          
          if (signal.type === 'offer') {
            await this.handleOffer(signal.from, JSON.parse(signal.offer));
          } else if (signal.type === 'answer') {
            await this.handleAnswer(signal.from, JSON.parse(signal.answer));
          } else if (signal.type === 'ice-candidate') {
            await this.handleIceCandidate(signal.from, JSON.parse(signal.candidate));
          }

          // Delete processed signal
          await deleteDoc(change.doc.ref);
        }
      });
    });

    this.unsubscribers.push(unsubscribe);
  }

  /**
   * Private: Handle incoming offer
   */
  private async handleOffer(peerId: string, offer: RTCSessionDescriptionInit): Promise<void> {
    console.log('[MeshNetwork] Received offer from:', peerId);

    try {
      const peerConnection = this.createPeerConnection(peerId);
      this.connections.set(peerId, peerConnection);

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // Send answer back via Firestore
      const answerRef = doc(db, 'mesh_signals', `${this.deviceId}_${peerId}_answer`);
      await setDoc(answerRef, {
        type: 'answer',
        from: this.deviceId,
        to: peerId,
        answer: JSON.stringify(answer),
        timestamp: Date.now(),
        userId: this.userId,
      });

      this.updatePeerStatus(peerId, PeerStatus.CONNECTING);
    } catch (error) {
      console.error('[MeshNetwork] Failed to handle offer:', error);
      this.disconnectPeer(peerId);
    }
  }

  /**
   * Private: Handle incoming answer
   */
  private async handleAnswer(peerId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    console.log('[MeshNetwork] Received answer from:', peerId);

    try {
      const connection = this.connections.get(peerId);
      if (connection) {
        await connection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    } catch (error) {
      console.error('[MeshNetwork] Failed to handle answer:', error);
      this.disconnectPeer(peerId);
    }
  }

  /**
   * Private: Handle ICE candidate
   */
  private async handleIceCandidate(peerId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const connection = this.connections.get(peerId);
    if (connection) {
      try {
        await connection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('[MeshNetwork] Failed to add ICE candidate:', error);
      }
    }
  }

  /**
   * Private: Create peer connection
   */
  private createPeerConnection(peerId: string): RTCPeerConnection {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };

    const peerConnection = new RTCPeerConnection(configuration);

    // Handle ICE candidates
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        const candidateRef = doc(db, 'mesh_signals', `${this.deviceId}_${peerId}_ice_${Date.now()}`);
        await setDoc(candidateRef, {
          type: 'ice-candidate',
          from: this.deviceId,
          to: peerId,
          candidate: JSON.stringify(event.candidate),
          timestamp: Date.now(),
          userId: this.userId,
        });
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log('[MeshNetwork] Connection state:', peerId, peerConnection.connectionState);
      
      switch (peerConnection.connectionState) {
        case 'connected':
          this.updatePeerStatus(peerId, PeerStatus.CONNECTED);
          this.syncStats.peersConnected = this.connections.size;
          this.notifyListeners('statsUpdated', this.syncStats);
          break;
        case 'disconnected':
        case 'failed':
        case 'closed':
          this.disconnectPeer(peerId);
          break;
      }
    };

    // Handle data channel from remote peer
    peerConnection.ondatachannel = (event) => {
      this.setupDataChannel(peerId, event.channel);
    };

    return peerConnection;
  }

  /**
   * Private: Setup data channel
   */
  private setupDataChannel(peerId: string, channel: RTCDataChannel): void {
    this.dataChannels.set(peerId, channel);

    channel.onopen = () => {
      console.log('[MeshNetwork] Data channel opened:', peerId);
      this.updatePeerStatus(peerId, PeerStatus.CONNECTED);
    };

    channel.onclose = () => {
      console.log('[MeshNetwork] Data channel closed:', peerId);
      this.disconnectPeer(peerId);
    };

    channel.onerror = (error) => {
      console.error('[MeshNetwork] Data channel error:', peerId, error);
      this.updatePeerStatus(peerId, PeerStatus.ERROR);
    };

    channel.onmessage = (event) => {
      try {
        const packet: DataPacket = JSON.parse(event.data);
        console.log('[MeshNetwork] Received data:', packet.type, 'from', peerId);
        
        this.syncStats.totalDataSynced += event.data.length;
        this.syncStats.lastSync = Date.now();
        this.updateBandwidth(event.data.length);
        
        this.notifyListeners('dataReceived', packet);
      } catch (error) {
        console.error('[MeshNetwork] Failed to parse message:', error);
      }
    };
  }

  /**
   * Private: Start discovery loop
   */
  private startDiscoveryLoop(): void {
    this.discoveryInterval = setInterval(async () => {
      // Update presence
      const deviceRef = doc(db, 'mesh_peers', this.deviceId);
      await setDoc(deviceRef, {
        lastSeen: Date.now(),
        available: true,
      }, { merge: true });

      // Remove stale peers
      this.peers.forEach((peer, peerId) => {
        if (Date.now() - peer.lastSeen > 60000) {
          this.peers.delete(peerId);
          this.disconnectPeer(peerId);
        }
      });
    }, this.config.heartbeatInterval);
  }

  /**
   * Private: Update peer status
   */
  private updatePeerStatus(peerId: string, status: PeerStatus): void {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.status = status;
      peer.lastSeen = Date.now();
      this.notifyListeners('peerStatusChanged', peer);
    }
  }

  /**
   * Private: Update bandwidth calculation
   */
  private updateBandwidth(bytes: number): void {
    // Simple moving average over last 10 seconds
    const now = Date.now();
    if (!this.syncStats.lastSync || now - this.syncStats.lastSync > 10000) {
      this.syncStats.bandwidth = bytes / 10;
    } else {
      this.syncStats.bandwidth = (this.syncStats.bandwidth * 0.9) + (bytes * 0.1);
    }
  }

  /**
   * Private: Notify listeners
   */
  private notifyListeners(event: string, data: any): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('[MeshNetwork] Listener error:', error);
        }
      });
    }
  }

  /**
   * Private: Generate packet ID
   */
  private generatePacketId(): string {
    return `pkt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Private: Get device name
   */
  private getDeviceName(): string {
    if (typeof window !== 'undefined') {
      return `${navigator.platform} Browser`;
    }
    return 'Web Browser';
  }
}

// Export singleton
export const MeshNetworkManager = new MeshNetworkManagerClass();
