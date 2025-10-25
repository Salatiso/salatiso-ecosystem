// Sonny Bridge Service - Core TypeScript Implementation
// Part of Phase 3: Sonny Core Platform Integration
// Mlandeli-Notemba Investments Ecosystem

import { EventEmitter } from 'events';

// ============================================================================
// CORE INTERFACES & TYPES
// ============================================================================

export interface MeshPeer {
  id: string;
  name: string;
  deviceType: 'lifesync' | 'salatiso' | 'ekhaya' | 'sonny-chat' | 'web-bridge';
  capabilities: MeshCapability[];
  trustScore: number;
  lastSeen: Date;
  location?: LocationSummary;
  batteryLevel?: number;
  connectionStrength: number; // 0-100
}

export interface MeshCapability {
  type: 'messaging' | 'triggers' | 'consent' | 'trust' | 'location' | 'emergency';
  version: string;
  enabled: boolean;
}

export interface LocationSummary {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  what3words?: string;
}

export interface MeshMessage {
  id: string;
  type: MessageType;
  senderId: string;
  recipientId?: string; // undefined for broadcast
  payload: any;
  timestamp: Date;
  priority: MessagePriority;
  hops: number;
  maxHops: number;
  ttl: number; // Time to live in seconds
  signature: string; // Cryptographic signature
}

export enum MessageType {
  // Family Coordination
  FAMILY_STATUS = 'family_status',
  QUICK_CHECKIN = 'quick_checkin',
  LOCATION_UPDATE = 'location_update',
  
  // Safety & Triggers
  TRIGGER_ALERT = 'trigger_alert',
  EMERGENCY_ALERT = 'emergency_alert',
  SAFETY_CHECKIN = 'safety_checkin',
  
  // Trust & Consent
  TRUST_UPDATE = 'trust_update',
  CONSENT_REQUEST = 'consent_request',
  CONSENT_RESPONSE = 'consent_response',
  
  // Ecosystem Coordination
  APP_STATUS = 'app_status',
  CROSS_APP_MESSAGE = 'cross_app_message',
  GOSSIP_MESSAGE = 'gossip_message',
  
  // Network Management
  MESH_DISCOVERY = 'mesh_discovery',
  PEER_ANNOUNCEMENT = 'peer_announcement',
  NETWORK_STATUS = 'network_status'
}

export enum MessagePriority {
  EMERGENCY = 0,
  HIGH = 1,
  NORMAL = 2,
  LOW = 3,
  BACKGROUND = 4
}

export interface ConnectionStatus {
  isConnected: boolean;
  connectionType: 'bluetooth' | 'wifi-direct' | 'internet' | 'hybrid';
  signalStrength: number;
  latency: number;
  throughput: number; // KB/s
  lastActivity: Date;
}

// ============================================================================
// SONNY BRIDGE SERVICE CORE
// ============================================================================

export class SonnyBridgeService extends EventEmitter {
  private peers: Map<string, MeshPeer> = new Map();
  private connections: Map<string, ConnectionStatus> = new Map();
  private messageQueue: MeshMessage[] = [];
  private isInitialized: boolean = false;
  private networkAdapter: NetworkAdapter;
  private securityManager: SecurityManager;
  private routingEngine: RoutingEngine;
  private webSocketConnections: Set<WebSocket> = new Set();
  
  constructor(
    private config: SonnyBridgeConfig,
    private logger: Logger,
    networkAdapter: NetworkAdapter,
    securityManager: SecurityManager,
    routingEngine: RoutingEngine
  ) {
    super();
    this.networkAdapter = networkAdapter;
    this.securityManager = securityManager;
    this.routingEngine = routingEngine;
    
    this.setupEventHandlers();
  }

  // Initialize Sonny Bridge Service
  async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing Sonny Bridge Service...');
      
      // Initialize security layer
      await this.securityManager.initialize();
      
      // Initialize network adapters
      await this.networkAdapter.initialize();
      
      // Start mesh discovery
      await this.startMeshDiscovery();
      
      // Initialize web interface
      if (this.config.webInterface.enabled) {
        await this.initializeWebInterface();
      }
      
      this.isInitialized = true;
      this.emit('initialized');
      
      this.logger.info('Sonny Bridge Service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Sonny Bridge Service:', error);
      throw error;
    }
  }

  // ========================================================================
  // MESH DISCOVERY & CONNECTION MANAGEMENT
  // ========================================================================

  async discoverPeers(): Promise<MeshPeer[]> {
    try {
      const discoveredPeers = await this.networkAdapter.discoverPeers();
      
      // Filter and validate peers
      const validPeers = discoveredPeers.filter(peer => 
        this.securityManager.validatePeer(peer)
      );
      
      // Update peer registry
      for (const peer of validPeers) {
        this.peers.set(peer.id, peer);
        this.emit('peerDiscovered', peer);
      }
      
      return Array.from(this.peers.values());
    } catch (error) {
      this.logger.error('Peer discovery failed:', error);
      throw error;
    }
  }

  async connectToPeer(peerId: string): Promise<boolean> {
    try {
      const peer = this.peers.get(peerId);
      if (!peer) {
        throw new Error(`Peer ${peerId} not found`);
      }

      // Establish connection based on peer capabilities
      const connection = await this.networkAdapter.connectToPeer(peer);
      
      if (connection.isConnected) {
        this.connections.set(peerId, connection);
        this.emit('peerConnected', peer, connection);
        
        // Start keep-alive mechanism
        this.startKeepAlive(peerId);
        
        return true;
      }
      
      return false;
    } catch (error) {
      this.logger.error(`Failed to connect to peer ${peerId}:`, error);
      return false;
    }
  }

  async disconnectFromPeer(peerId: string): Promise<void> {
    const connection = this.connections.get(peerId);
    if (connection && connection.isConnected) {
      await this.networkAdapter.disconnectFromPeer(peerId);
      this.connections.delete(peerId);
      this.emit('peerDisconnected', peerId);
    }
  }

  // ========================================================================
  // MESSAGE HANDLING & ROUTING
  // ========================================================================

  async sendMessage(message: Omit<MeshMessage, 'id' | 'timestamp' | 'signature'>): Promise<void> {
    try {
      // Create complete message
      const completeMessage: MeshMessage = {
        ...message,
        id: this.generateMessageId(),
        timestamp: new Date(),
        signature: await this.securityManager.signMessage(message)
      };

      // Route message through mesh network
      await this.routeMessage(completeMessage);
      
      this.emit('messageSent', completeMessage);
    } catch (error) {
      this.logger.error('Failed to send message:', error);
      throw error;
    }
  }

  private async routeMessage(message: MeshMessage): Promise<void> {
    // Check message TTL
    const messageAge = (Date.now() - message.timestamp.getTime()) / 1000;
    if (messageAge > message.ttl) {
      this.logger.warn('Message expired, dropping:', message.id);
      return;
    }

    // Direct message routing
    if (message.recipientId) {
      const connection = this.connections.get(message.recipientId);
      if (connection && connection.isConnected) {
        await this.networkAdapter.sendDirectMessage(message.recipientId, message);
        return;
      }
      
      // Route through mesh if direct connection unavailable
      await this.routingEngine.routeMessage(message, this.peers, this.connections);
    } else {
      // Broadcast message
      await this.broadcastMessage(message);
    }
  }

  private async broadcastMessage(message: MeshMessage): Promise<void> {
    const connectedPeers = Array.from(this.connections.entries())
      .filter(([_, connection]) => connection.isConnected);
    
    const broadcastPromises = connectedPeers.map(([peerId, _]) =>
      this.networkAdapter.sendDirectMessage(peerId, message)
        .catch(error => this.logger.warn(`Broadcast to ${peerId} failed:`, error))
    );
    
    await Promise.allSettled(broadcastPromises);
  }

  // Handle incoming messages
  private async handleIncomingMessage(message: MeshMessage, senderId: string): Promise<void> {
    try {
      // Verify message signature
      const isValid = await this.securityManager.verifyMessage(message);
      if (!isValid) {
        this.logger.warn('Invalid message signature, dropping:', message.id);
        return;
      }

      // Check for duplicate messages
      if (this.isDuplicateMessage(message.id)) {
        return;
      }

      // Update sender peer info
      this.updatePeerActivity(senderId);

      // Handle message based on type
      switch (message.type) {
        case MessageType.FAMILY_STATUS:
          await this.handleFamilyStatusMessage(message);
          break;
        case MessageType.TRIGGER_ALERT:
          await this.handleTriggerAlert(message);
          break;
        case MessageType.EMERGENCY_ALERT:
          await this.handleEmergencyAlert(message);
          break;
        case MessageType.CONSENT_REQUEST:
          await this.handleConsentRequest(message);
          break;
        case MessageType.TRUST_UPDATE:
          await this.handleTrustUpdate(message);
          break;
        default:
          this.emit('messageReceived', message);
      }

      // Forward message if needed (gossip protocol)
      if (message.hops < message.maxHops) {
        await this.forwardMessage(message, senderId);
      }
    } catch (error) {
      this.logger.error('Error handling incoming message:', error);
    }
  }

  // ========================================================================
  // FAMILY & ECOSYSTEM INTEGRATION
  // ========================================================================

  async syncFamilyStatus(): Promise<FamilyStatus> {
    try {
      // Collect status from all connected family members
      const statusRequests = Array.from(this.peers.values())
        .filter(peer => peer.capabilities.some(cap => cap.type === 'messaging'))
        .map(peer => this.requestFamilyStatus(peer.id));

      const results = await Promise.allSettled(statusRequests);
      
      // Aggregate family status
      const familyMembers: FamilyMemberStatus[] = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          familyMembers.push(result.value);
        }
      });

      const familyStatus: FamilyStatus = {
        timestamp: new Date(),
        members: familyMembers,
        activeTriggers: await this.getActiveTriggers(),
        meshHealth: this.calculateMeshHealth(),
        trustNetworkStatus: await this.getTrustNetworkStatus()
      };

      this.emit('familyStatusUpdated', familyStatus);
      return familyStatus;
    } catch (error) {
      this.logger.error('Failed to sync family status:', error);
      throw error;
    }
  }

  private async requestFamilyStatus(peerId: string): Promise<FamilyMemberStatus> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Family status request timeout'));
      }, 5000);

      const message: Omit<MeshMessage, 'id' | 'timestamp' | 'signature'> = {
        type: MessageType.FAMILY_STATUS,
        senderId: this.config.deviceId,
        recipientId: peerId,
        payload: { request: 'status' },
        priority: MessagePriority.NORMAL,
        hops: 0,
        maxHops: 3,
        ttl: 30
      };

      this.sendMessage(message).then(() => {
        // Listen for response
        const responseHandler = (responseMessage: MeshMessage) => {
          if (responseMessage.senderId === peerId && 
              responseMessage.type === MessageType.FAMILY_STATUS) {
            clearTimeout(timeout);
            this.off('messageReceived', responseHandler);
            resolve(responseMessage.payload as FamilyMemberStatus);
          }
        };
        
        this.on('messageReceived', responseHandler);
      }).catch(reject);
    });
  }

  // ========================================================================
  // WEB INTERFACE FOR BROWSER INTEGRATION
  // ========================================================================

  private async initializeWebInterface(): Promise<void> {
    // Web interface will be handled by React components
    // This method prepares the service for web socket connections
    this.logger.info('Web interface bridge ready for WebSocket connections');
  }

  // Method to handle WebSocket connections from React components
  public handleWebSocketConnection(ws: WebSocket): void {
    const clientId = this.generateClientId();
    this.webSocketConnections.add(ws);
    
    ws.addEventListener('message', async (event) => {
      try {
        const message = JSON.parse(event.data);
        await this.handleWebInterfaceMessage(ws, clientId, message);
      } catch (error) {
        this.logger.error('Web interface message error:', error);
        this.sendWebSocketMessage(ws, { error: 'Invalid message format' });
      }
    });

    ws.addEventListener('close', () => {
      this.webSocketConnections.delete(ws);
      this.logger.info(`Web client ${clientId} disconnected`);
    });

    // Send initial status
    this.sendWebSocketMessage(ws, {
      type: 'connection_established',
      clientId,
      meshStatus: this.getMeshStatus()
    });
  }

  private sendWebSocketMessage(ws: WebSocket, message: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private async handleWebInterfaceMessage(ws: WebSocket, clientId: string, message: any): Promise<void> {
    switch (message.type) {
      case 'get_peers':
        this.sendWebSocketMessage(ws, {
          type: 'peers_list',
          peers: Array.from(this.peers.values())
        });
        break;
        
      case 'send_message':
        await this.sendMessage(message.payload);
        this.sendWebSocketMessage(ws, { type: 'message_sent', success: true });
        break;
        
      case 'get_family_status':
        const status = await this.syncFamilyStatus();
        this.sendWebSocketMessage(ws, { type: 'family_status', data: status });
        break;
        
      default:
        this.sendWebSocketMessage(ws, { error: 'Unknown message type' });
    }
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  private setupEventHandlers(): void {
    this.networkAdapter.on('peerDiscovered', (peer: MeshPeer) => {
      this.peers.set(peer.id, peer);
      this.emit('peerDiscovered', peer);
    });

    this.networkAdapter.on('messageReceived', (message: MeshMessage, senderId: string) => {
      this.handleIncomingMessage(message, senderId);
    });

    this.networkAdapter.on('connectionLost', (peerId: string) => {
      this.connections.delete(peerId);
      this.emit('peerDisconnected', peerId);
    });
  }

  private async startMeshDiscovery(): Promise<void> {
    // Start periodic peer discovery
    setInterval(async () => {
      try {
        await this.discoverPeers();
      } catch (error) {
        this.logger.warn('Periodic peer discovery failed:', error);
      }
    }, this.config.discovery.interval);

    // Initial discovery
    await this.discoverPeers();
  }

  private startKeepAlive(peerId: string): void {
    const interval = setInterval(async () => {
      const connection = this.connections.get(peerId);
      if (!connection || !connection.isConnected) {
        clearInterval(interval);
        return;
      }

      try {
        const pingMessage: Omit<MeshMessage, 'id' | 'timestamp' | 'signature'> = {
          type: MessageType.NETWORK_STATUS,
          senderId: this.config.deviceId,
          recipientId: peerId,
          payload: { type: 'ping' },
          priority: MessagePriority.LOW,
          hops: 0,
          maxHops: 1,
          ttl: 10
        };

        await this.sendMessage(pingMessage);
      } catch (error) {
        this.logger.warn(`Keep-alive failed for peer ${peerId}:`, error);
        await this.disconnectFromPeer(peerId);
        clearInterval(interval);
      }
    }, 30000); // 30 second keep-alive
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isDuplicateMessage(messageId: string): boolean {
    // Implement duplicate detection logic
    // For now, simple in-memory cache (should use persistent storage)
    return false; // TODO: Implement proper duplicate detection
  }

  private updatePeerActivity(peerId: string): void {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.lastSeen = new Date();
      this.peers.set(peerId, peer);
    }
  }

  private async forwardMessage(message: MeshMessage, excludePeerId: string): Promise<void> {
    const forwardMessage = {
      ...message,
      hops: message.hops + 1
    };

    const forwardTargets = Array.from(this.connections.entries())
      .filter(([peerId, connection]) => 
        peerId !== excludePeerId && 
        peerId !== message.senderId &&
        connection.isConnected
      );

    const forwardPromises = forwardTargets.map(([peerId, _]) =>
      this.networkAdapter.sendDirectMessage(peerId, forwardMessage)
        .catch(error => this.logger.warn(`Forward to ${peerId} failed:`, error))
    );

    await Promise.allSettled(forwardPromises);
  }

  private getMeshStatus(): any {
    return {
      peersCount: this.peers.size,
      connectionsCount: this.connections.size,
      isInitialized: this.isInitialized,
      networkHealth: this.calculateMeshHealth()
    };
  }

  private calculateMeshHealth(): number {
    const totalPeers = this.peers.size;
    const connectedPeers = this.connections.size;
    
    if (totalPeers === 0) return 100;
    return Math.round((connectedPeers / totalPeers) * 100);
  }

  private async getActiveTriggers(): Promise<any[]> {
    // Integration with Trigger Manager Service
    return []; // TODO: Implement trigger integration
  }

  private async getTrustNetworkStatus(): Promise<any> {
    // Integration with Trust Framework API
    return {}; // TODO: Implement trust network integration
  }

  // Message type handlers
  private async handleFamilyStatusMessage(message: MeshMessage): Promise<void> {
    this.emit('familyStatusMessage', message);
  }

  private async handleTriggerAlert(message: MeshMessage): Promise<void> {
    this.emit('triggerAlert', message);
  }

  private async handleEmergencyAlert(message: MeshMessage): Promise<void> {
    this.emit('emergencyAlert', message);
  }

  private async handleConsentRequest(message: MeshMessage): Promise<void> {
    this.emit('consentRequest', message);
  }

  private async handleTrustUpdate(message: MeshMessage): Promise<void> {
    this.emit('trustUpdate', message);
  }
}

// ============================================================================
// SUPPORTING INTERFACES & TYPES
// ============================================================================

export interface SonnyBridgeConfig {
  deviceId: string;
  deviceName: string;
  network: NetworkConfig;
  security: SecurityConfig;
  routing: RoutingConfig;
  discovery: DiscoveryConfig;
  webInterface: WebInterfaceConfig;
}

export interface NetworkConfig {
  bluetoothEnabled: boolean;
  wifiDirectEnabled: boolean;
  internetBridgeEnabled: boolean;
  maxConnections: number;
  connectionTimeout: number;
}

export interface SecurityConfig {
  encryptionKey: string;
  certificatePath?: string;
  trustStoreEnabled: boolean;
  signatureValidation: boolean;
}

export interface RoutingConfig {
  maxHops: number;
  routingTable: Map<string, string[]>;
  gossipEnabled: boolean;
  redundantPaths: boolean;
}

export interface DiscoveryConfig {
  interval: number; // milliseconds
  timeout: number;  // milliseconds
  retryAttempts: number;
}

export interface WebInterfaceConfig {
  enabled: boolean;
  host: string;
  port: number;
  sslEnabled: boolean;
}

export interface FamilyStatus {
  timestamp: Date;
  members: FamilyMemberStatus[];
  activeTriggers: any[];
  meshHealth: number;
  trustNetworkStatus: any;
}

export interface FamilyMemberStatus {
  memberId: string;
  displayName: string;
  status: 'online' | 'offline' | 'mesh-only';
  lastActivity: Date;
  trustScore: number;
  location?: LocationSummary;
  activeTriggers: number;
}

// Abstract classes for dependency injection
export abstract class NetworkAdapter extends EventEmitter {
  abstract initialize(): Promise<void>;
  abstract discoverPeers(): Promise<MeshPeer[]>;
  abstract connectToPeer(peer: MeshPeer): Promise<ConnectionStatus>;
  abstract disconnectFromPeer(peerId: string): Promise<void>;
  abstract sendDirectMessage(peerId: string, message: MeshMessage): Promise<void>;
}

export abstract class SecurityManager {
  abstract initialize(): Promise<void>;
  abstract validatePeer(peer: MeshPeer): boolean;
  abstract signMessage(message: any): Promise<string>;
  abstract verifyMessage(message: MeshMessage): Promise<boolean>;
}

export abstract class RoutingEngine {
  abstract routeMessage(message: MeshMessage, peers: Map<string, MeshPeer>, connections: Map<string, ConnectionStatus>): Promise<void>;
}

export interface Logger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, error?: any): void;
}

export default SonnyBridgeService;