// Mesh Engine Components - Bluetooth LE + WiFi Direct Protocols
// Part of Phase 3: Sonny Core Platform Integration
// Mlandeli-Notemba Investments Ecosystem

import { EventEmitter } from 'events';

// ============================================================================
// MESH NETWORK INTERFACES & TYPES
// ============================================================================

export interface MeshNetwork {
  id: string;
  name: string;
  type: NetworkType;
  status: NetworkStatus;
  nodes: Map<string, MeshNode>;
  routes: Map<string, Route[]>;
  createdAt: Date;
  lastActivity: Date;
  statistics: NetworkStatistics;
}

export enum NetworkType {
  FAMILY = 'family',                    // Family mesh network
  COMMUNITY = 'community',              // Community-wide mesh
  BUSINESS = 'business',                // Business/professional network
  EMERGENCY = 'emergency',              // Emergency response network
  HYBRID = 'hybrid'                     // Mixed network types
}

export enum NetworkStatus {
  INITIALIZING = 'initializing',
  ACTIVE = 'active',
  DEGRADED = 'degraded',
  FRAGMENTING = 'fragmenting',
  OFFLINE = 'offline'
}

export interface MeshNode {
  id: string;
  deviceId: string;
  displayName: string;
  nodeType: NodeType;
  capabilities: NodeCapabilities;
  location?: NodeLocation;
  connections: Map<string, Connection>;
  status: NodeStatus;
  batteryLevel?: number;
  signalStrength: number;
  lastSeen: Date;
  trustLevel: number;
  performance: NodePerformance;
}

export enum NodeType {
  COORDINATOR = 'coordinator',          // Network coordinator (LifeSync master)
  ROUTER = 'router',                   // Routing node (can forward messages)
  END_DEVICE = 'end_device',           // End device (basic functionality)
  BRIDGE = 'bridge',                   // Bridge to internet/other networks
  GATEWAY = 'gateway'                  // Gateway device (Smart TV, etc.)
}

export enum NodeStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  SLEEPING = 'sleeping',
  CONNECTING = 'connecting',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}

export interface NodeCapabilities {
  protocols: Protocol[];
  messageTypes: MessageType[];
  maxConnections: number;
  routingCapable: boolean;
  bridgeCapable: boolean;
  emergencyCapable: boolean;
  storageCapacity: number;             // Bytes available for message storage
  batteryPowered: boolean;
}

export enum Protocol {
  BLUETOOTH_LE = 'bluetooth_le',
  WIFI_DIRECT = 'wifi_direct',
  ZIGBEE = 'zigbee',
  LORA = 'lora',
  INTERNET_BRIDGE = 'internet_bridge'
}

export interface NodeLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  timestamp: Date;
}

export interface Connection {
  nodeId: string;
  protocol: Protocol;
  quality: ConnectionQuality;
  established: Date;
  lastActivity: Date;
  statistics: ConnectionStatistics;
}

export interface ConnectionQuality {
  signalStrength: number;              // 0-100
  latency: number;                     // milliseconds
  throughput: number;                  // bytes per second
  reliability: number;                 // 0-100 (packet success rate)
  stability: number;                   // 0-100 (connection stability)
}

export interface ConnectionStatistics {
  messagesSent: number;
  messagesReceived: number;
  bytesTransferred: number;
  packetsLost: number;
  reconnections: number;
  uptime: number;                      // seconds connected
}

export interface Route {
  destination: string;
  nextHop: string;
  hopCount: number;
  quality: number;                     // 0-100
  established: Date;
  lastUsed: Date;
  bandwidth: number;                   // estimated bytes per second
}

export interface NetworkStatistics {
  totalNodes: number;
  activeNodes: number;
  totalConnections: number;
  messagesSent: number;
  messagesReceived: number;
  averageLatency: number;
  networkReliability: number;
  coverage: NetworkCoverage;
}

export interface NetworkCoverage {
  geographicArea: number;              // square meters covered
  populationReach: number;             // estimated people within range
  redundancy: number;                  // average number of routes per destination
}

export interface NodePerformance {
  messageDeliveryRate: number;         // 0-100
  averageLatency: number;
  routingEfficiency: number;           // 0-100
  batteryUsage: number;               // mAh per hour
  dataProcessed: number;              // bytes processed per hour
}

export enum MessageType {
  DISCOVERY = 'discovery',
  ROUTING = 'routing',
  DATA = 'data',
  CONTROL = 'control',
  HEARTBEAT = 'heartbeat',
  EMERGENCY = 'emergency'
}

// ============================================================================
// MESH ENGINE SERVICE
// ============================================================================

export class MeshEngineService extends EventEmitter {
  private networks: Map<string, MeshNetwork> = new Map();
  private localNode: MeshNode;
  private protocolAdapters: Map<Protocol, ProtocolAdapter> = new Map();
  private routingTable: Map<string, Route[]> = new Map();
  private messageStore: Map<string, StoredMessage> = new Map();
  private isInitialized: boolean = false;

  constructor(
    private config: MeshEngineConfig,
    private logger: Logger,
    private cryptoService: CryptoService
  ) {
    super();
    this.localNode = this.createLocalNode();
  }

  // ========================================================================
  // INITIALIZATION & LIFECYCLE
  // ========================================================================

  async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing Mesh Engine Service...');
      
      // Initialize protocol adapters
      await this.initializeProtocolAdapters();
      
      // Start network discovery
      await this.startNetworkDiscovery();
      
      // Initialize routing engine
      await this.initializeRoutingEngine();
      
      // Start background maintenance
      this.startBackgroundMaintenance();
      
      this.isInitialized = true;
      this.emit('initialized');
      
      this.logger.info('Mesh Engine Service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Mesh Engine Service:', error);
      throw error;
    }
  }

  private async initializeProtocolAdapters(): Promise<void> {
    // Initialize Bluetooth LE adapter
    if (this.config.protocols.includes(Protocol.BLUETOOTH_LE)) {
      const bleAdapter = new BluetoothLEAdapter(this.config.bluetooth, this.logger);
      await bleAdapter.initialize();
      this.protocolAdapters.set(Protocol.BLUETOOTH_LE, bleAdapter);
      
      bleAdapter.on('nodeDiscovered', (node: MeshNode) => this.handleNodeDiscovery(node));
      bleAdapter.on('messageReceived', (message: MeshMessage, fromNode: string) => 
        this.handleIncomingMessage(message, fromNode));
      bleAdapter.on('connectionEstablished', (connection: Connection) => 
        this.handleConnectionEstablished(connection));
      bleAdapter.on('connectionLost', (nodeId: string) => 
        this.handleConnectionLost(nodeId));
    }

    // Initialize WiFi Direct adapter
    if (this.config.protocols.includes(Protocol.WIFI_DIRECT)) {
      const wifiAdapter = new WiFiDirectAdapter(this.config.wifiDirect, this.logger);
      await wifiAdapter.initialize();
      this.protocolAdapters.set(Protocol.WIFI_DIRECT, wifiAdapter);
      
      wifiAdapter.on('nodeDiscovered', (node: MeshNode) => this.handleNodeDiscovery(node));
      wifiAdapter.on('messageReceived', (message: MeshMessage, fromNode: string) => 
        this.handleIncomingMessage(message, fromNode));
      wifiAdapter.on('connectionEstablished', (connection: Connection) => 
        this.handleConnectionEstablished(connection));
      wifiAdapter.on('connectionLost', (nodeId: string) => 
        this.handleConnectionLost(nodeId));
    }

    // Initialize Internet Bridge adapter if configured
    if (this.config.protocols.includes(Protocol.INTERNET_BRIDGE)) {
      const bridgeAdapter = new InternetBridgeAdapter(this.config.internetBridge, this.logger);
      await bridgeAdapter.initialize();
      this.protocolAdapters.set(Protocol.INTERNET_BRIDGE, bridgeAdapter);
    }
  }

  // ========================================================================
  // NETWORK DISCOVERY & MANAGEMENT
  // ========================================================================

  private async startNetworkDiscovery(): Promise<void> {
    // Start discovery on all available protocols
    this.protocolAdapters.forEach(async (adapter: ProtocolAdapter, protocol: Protocol) => {
      try {
        await adapter.startDiscovery();
        this.logger.info(`Discovery started for protocol: ${protocol}`);
      } catch (error) {
        this.logger.warn(`Failed to start discovery for ${protocol}:`, error);
      }
    });

    // Periodic network discovery
    setInterval(() => {
      this.performNetworkDiscovery();
    }, this.config.discoveryInterval);
  }

  private async performNetworkDiscovery(): Promise<void> {
    this.protocolAdapters.forEach(async (adapter: ProtocolAdapter, protocol: Protocol) => {
      try {
        const discoveredNodes = await adapter.discoverNodes();
        
        for (const node of discoveredNodes) {
          await this.processDiscoveredNode(node, protocol);
        }
      } catch (error) {
        this.logger.warn(`Discovery failed for ${protocol}:`, error);
      }
    });
  }

  private async processDiscoveredNode(node: MeshNode, protocol: Protocol): Promise<void> {
    // Check if we already know this node
    const existingNetwork = this.findNodeNetwork(node.id);
    
    if (existingNetwork) {
      // Update existing node information
      const existingNode = existingNetwork.nodes.get(node.id);
      if (existingNode) {
        existingNode.lastSeen = new Date();
        existingNode.signalStrength = node.signalStrength;
        existingNode.location = node.location;
        existingNode.status = NodeStatus.ONLINE;
      }
    } else {
      // New node discovered
      await this.handleNewNodeDiscovery(node, protocol);
    }
  }

  private async handleNewNodeDiscovery(node: MeshNode, protocol: Protocol): Promise<void> {
    // Determine which network this node should join
    const targetNetwork = await this.selectTargetNetwork(node);
    
    if (targetNetwork) {
      // Add node to existing network
      targetNetwork.nodes.set(node.id, node);
      targetNetwork.lastActivity = new Date();
      
      // Attempt to establish connection
      await this.establishConnection(node.id, protocol);
    } else {
      // Create new network for this node
      await this.createNetworkForNode(node);
    }

    this.emit('nodeDiscovered', node);
  }

  private async selectTargetNetwork(node: MeshNode): Promise<MeshNetwork | null> {
    // Logic to determine which network a node should join
    // Based on network type, proximity, trust level, etc.
    
    let compatibleNetwork: MeshNetwork | null = null;
    this.networks.forEach((network: MeshNetwork) => {
      if (!compatibleNetwork && this.isNodeCompatibleWithNetwork(node, network)) {
        compatibleNetwork = network;
      }
    });
    
    return compatibleNetwork;
  }

  private isNodeCompatibleWithNetwork(node: MeshNode, network: MeshNetwork): boolean {
    // Check compatibility based on trust level, network type, etc.
    if (node.trustLevel < this.config.minTrustLevel) {
      return false;
    }
    
    // Check if network has capacity for more nodes
    if (network.nodes.size >= this.config.maxNetworkSize) {
      return false;
    }
    
    // Check geographic proximity if location is available
    if (node.location && this.config.maxNetworkRadius > 0) {
      const networkCenter = this.calculateNetworkCenter(network);
      if (networkCenter) {
        const distance = this.calculateDistance(node.location, networkCenter);
        if (distance > this.config.maxNetworkRadius) {
          return false;
        }
      }
    }
    
    return true;
  }

  // ========================================================================
  // CONNECTION MANAGEMENT
  // ========================================================================

  async establishConnection(targetNodeId: string, preferredProtocol?: Protocol): Promise<boolean> {
    const targetNode = this.findNode(targetNodeId);
    if (!targetNode) {
      this.logger.warn(`Cannot establish connection: node ${targetNodeId} not found`);
      return false;
    }

    // Determine best protocol for connection
    const protocol = preferredProtocol || await this.selectBestProtocol(targetNode);
    const adapter = this.protocolAdapters.get(protocol);
    
    if (!adapter) {
      this.logger.warn(`No adapter available for protocol ${protocol}`);
      return false;
    }

    try {
      const connection = await adapter.connect(targetNode);
      
      if (connection) {
        // Store connection
        this.localNode.connections.set(targetNodeId, connection);
        targetNode.connections.set(this.localNode.id, connection);
        
        // Update routing table
        await this.updateRoutingTable();
        
        this.emit('connectionEstablished', connection);
        this.logger.info(`Connection established with node ${targetNodeId} via ${protocol}`);
        
        return true;
      }
    } catch (error) {
      this.logger.error(`Failed to establish connection with ${targetNodeId}:`, error);
    }
    
    return false;
  }

  private async selectBestProtocol(targetNode: MeshNode): Promise<Protocol> {
    // Score each available protocol based on various factors
    const protocolScores: Array<{ protocol: Protocol; score: number }> = [];
    
    for (const protocol of targetNode.capabilities.protocols) {
      if (this.protocolAdapters.has(protocol)) {
        const score = await this.calculateProtocolScore(protocol, targetNode);
        protocolScores.push({ protocol, score });
      }
    }
    
    // Sort by score and return best protocol
    protocolScores.sort((a, b) => b.score - a.score);
    return protocolScores.length > 0 ? protocolScores[0].protocol : Protocol.BLUETOOTH_LE;
  }

  private async calculateProtocolScore(protocol: Protocol, targetNode: MeshNode): Promise<number> {
    let score = 0;
    
    // Base scores for different protocols
    switch (protocol) {
      case Protocol.WIFI_DIRECT:
        score = 100; // Highest throughput
        break;
      case Protocol.BLUETOOTH_LE:
        score = 80;  // Good balance of range and power
        break;
      case Protocol.INTERNET_BRIDGE:
        score = 70;  // Dependent on internet connectivity
        break;
      default:
        score = 50;
    }
    
    // Adjust based on node characteristics
    if (targetNode.batteryLevel && targetNode.batteryLevel < 20) {
      // Prefer low-power protocols for low battery devices
      if (protocol === Protocol.BLUETOOTH_LE) score += 20;
      if (protocol === Protocol.WIFI_DIRECT) score -= 30;
    }
    
    // Adjust based on distance (if location available)
    if (targetNode.location) {
      const distance = this.calculateNodeDistance(targetNode);
      if (distance > 50 && protocol === Protocol.WIFI_DIRECT) {
        score -= 20; // WiFi Direct has limited range
      }
    }
    
    return score;
  }

  // ========================================================================
  // MESSAGE ROUTING & DELIVERY
  // ========================================================================

  private async initializeRoutingEngine(): Promise<void> {
    // Start routing table maintenance
    setInterval(() => {
      this.maintainRoutingTable();
    }, this.config.routingUpdateInterval);
    
    // Start message processing
    this.startMessageProcessing();
  }

  async sendMessage(message: MeshMessage): Promise<boolean> {
    try {
      // Add message to store for potential retransmission
      this.storeMessage(message);
      
      if (message.recipientId) {
        // Direct message - use routing
        return await this.routeMessage(message);
      } else {
        // Broadcast message
        return await this.broadcastMessage(message);
      }
    } catch (error) {
      this.logger.error('Failed to send message:', error);
      return false;
    }
  }

  private async routeMessage(message: MeshMessage): Promise<boolean> {
    const routes = this.routingTable.get(message.recipientId!);
    
    if (!routes || routes.length === 0) {
      this.logger.warn(`No route to destination ${message.recipientId}`);
      return false;
    }
    
    // Try routes in order of quality
    const sortedRoutes = routes.sort((a, b) => b.quality - a.quality);
    
    for (const route of sortedRoutes) {
      const success = await this.sendViaRoute(message, route);
      if (success) {
        route.lastUsed = new Date();
        return true;
      }
    }
    
    return false;
  }

  private async sendViaRoute(message: MeshMessage, route: Route): Promise<boolean> {
    const nextHopNode = this.findNode(route.nextHop);
    if (!nextHopNode) {
      return false;
    }
    
    const connection = this.localNode.connections.get(route.nextHop);
    if (!connection) {
      return false;
    }
    
    const adapter = this.protocolAdapters.get(connection.protocol);
    if (!adapter) {
      return false;
    }
    
    try {
      await adapter.sendMessage(route.nextHop, message);
      
      // Update statistics
      connection.statistics.messagesSent++;
      connection.lastActivity = new Date();
      
      return true;
    } catch (error) {
      this.logger.warn(`Failed to send via route to ${route.nextHop}:`, error);
      return false;
    }
  }

  private async broadcastMessage(message: MeshMessage): Promise<boolean> {
    let successCount = 0;
    const connections = Array.from(this.localNode.connections.values());
    
    for (const connection of connections) {
      const adapter = this.protocolAdapters.get(connection.protocol);
      if (adapter) {
        try {
          await adapter.sendMessage(connection.nodeId, message);
          successCount++;
        } catch (error) {
          this.logger.warn(`Broadcast failed to ${connection.nodeId}:`, error);
        }
      }
    }
    
    return successCount > 0;
  }

  // ========================================================================
  // ROUTING TABLE MANAGEMENT
  // ========================================================================

  private async updateRoutingTable(): Promise<void> {
    // Clear existing routes
    this.routingTable.clear();
    
    // Calculate routes to all known nodes
    this.networks.forEach(async (network: MeshNetwork) => {
      network.nodes.forEach(async (node: MeshNode, nodeId: string) => {
        if (nodeId !== this.localNode.id) {
          const routes = await this.calculateRoutesToNode(nodeId);
          if (routes.length > 0) {
            this.routingTable.set(nodeId, routes);
          }
        }
      });
    });
    
    this.emit('routingTableUpdated', this.routingTable.size);
  }

  private async calculateRoutesToNode(targetNodeId: string): Promise<Route[]> {
    const routes: Route[] = [];
    
    // Direct connections (1 hop)
    if (this.localNode.connections.has(targetNodeId)) {
      const connection = this.localNode.connections.get(targetNodeId)!;
      routes.push({
        destination: targetNodeId,
        nextHop: targetNodeId,
        hopCount: 1,
        quality: connection.quality.reliability,
        established: connection.established,
        lastUsed: connection.lastActivity,
        bandwidth: connection.quality.throughput
      });
    }
    
    // Multi-hop routes through intermediate nodes
    this.localNode.connections.forEach(async (connection: Connection, nodeId: string) => {
      const intermediateNode = this.findNode(nodeId);
      if (intermediateNode && intermediateNode.capabilities.routingCapable) {
        const intermediateRoutes = await this.findRoutesViaNode(nodeId, targetNodeId);
        routes.push(...intermediateRoutes);
      }
    });
    
    // Sort by quality and limit number of routes
    return routes
      .sort((a, b) => b.quality - a.quality)
      .slice(0, this.config.maxRoutesPerDestination);
  }

  private async findRoutesViaNode(intermediateNodeId: string, targetNodeId: string): Promise<Route[]> {
    const routes: Route[] = [];
    const intermediateNode = this.findNode(intermediateNodeId);
    
    if (intermediateNode) {
      // Check if intermediate node has connection to target
      if (intermediateNode.connections.has(targetNodeId)) {
        const intermediateConnection = this.localNode.connections.get(intermediateNodeId)!;
        const targetConnection = intermediateNode.connections.get(targetNodeId)!;
        
        // Calculate combined quality
        const combinedQuality = Math.min(
          intermediateConnection.quality.reliability,
          targetConnection.quality.reliability
        ) * 0.9; // Penalty for multi-hop
        
        routes.push({
          destination: targetNodeId,
          nextHop: intermediateNodeId,
          hopCount: 2,
          quality: combinedQuality,
          established: new Date(),
          lastUsed: new Date(0),
          bandwidth: Math.min(
            intermediateConnection.quality.throughput,
            targetConnection.quality.throughput
          )
        });
      }
    }
    
    return routes;
  }

  private maintainRoutingTable(): void {
    const now = new Date();
    const staleThreshold = this.config.routeStaleThreshold;
    
    // Remove stale routes
    this.routingTable.forEach((routes: Route[], destination: string) => {
      const freshRoutes = routes.filter((route: Route) => {
        const age = now.getTime() - route.lastUsed.getTime();
        return age < staleThreshold;
      });
      
      if (freshRoutes.length === 0) {
        this.routingTable.delete(destination);
      } else {
        this.routingTable.set(destination, freshRoutes);
      }
    });
    
    // Periodic route quality assessment
    this.assessRouteQuality();
  }

  private async assessRouteQuality(): Promise<void> {
    this.routingTable.forEach((routes: Route[], destination: string) => {
      for (const route of routes) {
        const connection = this.localNode.connections.get(route.nextHop);
        if (connection) {
          route.quality = this.calculateRouteQuality(connection);
        }
      }
    });
  }

  private calculateRouteQuality(connection: Connection): number {
    const weights = {
      signalStrength: 0.3,
      reliability: 0.4,
      latency: 0.2,
      stability: 0.1
    };
    
    const normalizedLatency = Math.max(0, 100 - (connection.quality.latency / 10));
    
    return (
      connection.quality.signalStrength * weights.signalStrength +
      connection.quality.reliability * weights.reliability +
      normalizedLatency * weights.latency +
      connection.quality.stability * weights.stability
    );
  }

  // ========================================================================
  // MESSAGE PROCESSING & STORAGE
  // ========================================================================

  private startMessageProcessing(): void {
    // Process stored messages periodically
    setInterval(() => {
      this.processStoredMessages();
    }, this.config.messageProcessingInterval);
  }

  private storeMessage(message: MeshMessage): void {
    const stored: StoredMessage = {
      message,
      attempts: 0,
      stored: new Date(),
      lastAttempt: new Date()
    };
    
    this.messageStore.set(message.id, stored);
    
    // Clean up old messages
    this.cleanupMessageStore();
  }

  private processStoredMessages(): void {
    const now = new Date();
    const retryThreshold = this.config.messageRetryInterval;
    
    this.messageStore.forEach((stored: StoredMessage, messageId: string) => {
      const timeSinceLastAttempt = now.getTime() - stored.lastAttempt.getTime();
      
      if (timeSinceLastAttempt >= retryThreshold && 
          stored.attempts < this.config.maxRetryAttempts) {
        
        this.retryMessage(stored);
      }
    });
  }

  private async retryMessage(stored: StoredMessage): Promise<void> {
    stored.attempts++;
    stored.lastAttempt = new Date();
    
    const success = await this.sendMessage(stored.message);
    
    if (success) {
      this.messageStore.delete(stored.message.id);
    }
  }

  private cleanupMessageStore(): void {
    const now = new Date();
    const maxAge = this.config.messageStoreMaxAge;
    
    this.messageStore.forEach((stored: StoredMessage, messageId: string) => {
      const age = now.getTime() - stored.stored.getTime();
      
      if (age > maxAge || stored.attempts >= this.config.maxRetryAttempts) {
        this.messageStore.delete(messageId);
      }
    });
  }

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  private handleNodeDiscovery(node: MeshNode): void {
    this.emit('nodeDiscovered', node);
  }

  private async handleIncomingMessage(message: MeshMessage, fromNodeId: string): Promise<void> {
    // Validate message
    if (await this.validateMessage(message)) {
      // Check if message is for us
      if (!message.recipientId || message.recipientId === this.localNode.id) {
        this.emit('messageReceived', message, fromNodeId);
      } else {
        // Forward message if we're not the destination
        if (message.hops < message.maxHops) {
          message.hops++;
          await this.routeMessage(message);
        }
      }
    }
  }

  private handleConnectionEstablished(connection: Connection): void {
    this.updateNetworkStatistics();
    this.emit('connectionEstablished', connection);
  }

  private handleConnectionLost(nodeId: string): void {
    // Remove connection from local node
    this.localNode.connections.delete(nodeId);
    
    // Update routing table
    this.updateRoutingTable();
    
    // Update node status
    const node = this.findNode(nodeId);
    if (node) {
      node.status = NodeStatus.DISCONNECTED;
    }
    
    this.updateNetworkStatistics();
    this.emit('connectionLost', nodeId);
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  private createLocalNode(): MeshNode {
    return {
      id: this.config.nodeId,
      deviceId: this.config.deviceId,
      displayName: this.config.displayName,
      nodeType: this.config.nodeType,
      capabilities: this.config.capabilities,
      connections: new Map(),
      status: NodeStatus.OFFLINE,
      signalStrength: 100,
      lastSeen: new Date(),
      trustLevel: this.config.initialTrustLevel,
      performance: {
        messageDeliveryRate: 100,
        averageLatency: 0,
        routingEfficiency: 100,
        batteryUsage: 0,
        dataProcessed: 0
      }
    };
  }

  private findNode(nodeId: string): MeshNode | undefined {
    let foundNode: MeshNode | undefined = undefined;
    this.networks.forEach((network: MeshNetwork) => {
      if (!foundNode) {
        const node = network.nodes.get(nodeId);
        if (node) foundNode = node;
      }
    });
    return foundNode;
  }

  private findNodeNetwork(nodeId: string): MeshNetwork | undefined {
    let foundNetwork: MeshNetwork | undefined = undefined;
    this.networks.forEach((network: MeshNetwork) => {
      if (!foundNetwork && network.nodes.has(nodeId)) {
        foundNetwork = network;
      }
    });
    return foundNetwork;
  }

  private async createNetworkForNode(node: MeshNode): Promise<MeshNetwork> {
    const network: MeshNetwork = {
      id: this.generateNetworkId(),
      name: `Network-${node.displayName}`,
      type: NetworkType.FAMILY, // Default type
      status: NetworkStatus.INITIALIZING,
      nodes: new Map([[node.id, node]]),
      routes: new Map(),
      createdAt: new Date(),
      lastActivity: new Date(),
      statistics: {
        totalNodes: 1,
        activeNodes: 1,
        totalConnections: 0,
        messagesSent: 0,
        messagesReceived: 0,
        averageLatency: 0,
        networkReliability: 100,
        coverage: {
          geographicArea: 0,
          populationReach: 1,
          redundancy: 0
        }
      }
    };
    
    this.networks.set(network.id, network);
    return network;
  }

  private calculateNetworkCenter(network: MeshNetwork): NodeLocation | null {
    const locations = Array.from(network.nodes.values())
      .map(node => node.location)
      .filter(location => location !== undefined) as NodeLocation[];
    
    if (locations.length === 0) return null;
    
    const totalLat = locations.reduce((sum, loc) => sum + loc.latitude, 0);
    const totalLng = locations.reduce((sum, loc) => sum + loc.longitude, 0);
    
    return {
      latitude: totalLat / locations.length,
      longitude: totalLng / locations.length,
      accuracy: 100, // Approximate
      timestamp: new Date()
    };
  }

  private calculateDistance(location1: NodeLocation, location2: NodeLocation): number {
    // Haversine formula for distance calculation
    const R = 6371000; // Earth's radius in meters
    const dLat = (location2.latitude - location1.latitude) * Math.PI / 180;
    const dLng = (location2.longitude - location1.longitude) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(location1.latitude * Math.PI / 180) * 
              Math.cos(location2.latitude * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private calculateNodeDistance(node: MeshNode): number {
    if (!node.location || !this.localNode.location) {
      return 0;
    }
    
    return this.calculateDistance(this.localNode.location, node.location);
  }

  private async validateMessage(message: MeshMessage): Promise<boolean> {
    // Basic message validation
    if (!message.id || !message.senderId) {
      return false;
    }
    
    // Signature validation if available
    if (message.signature) {
      return await this.cryptoService.verifySignature(message, message.signature);
    }
    
    return true;
  }

  private updateNetworkStatistics(): void {
    this.networks.forEach((network: MeshNetwork) => {
      const activeNodes = Array.from(network.nodes.values())
        .filter((node: MeshNode) => node.status === NodeStatus.ONLINE).length;
      
      network.statistics.activeNodes = activeNodes;
      network.statistics.totalNodes = network.nodes.size;
      
      // Calculate total connections
      let totalConnections = 0;
      network.nodes.forEach((node: MeshNode) => {
        totalConnections += node.connections.size;
      });
      network.statistics.totalConnections = totalConnections / 2; // Avoid double counting
    });
  }

  private startBackgroundMaintenance(): void {
    // Network health monitoring
    setInterval(() => {
      this.monitorNetworkHealth();
    }, this.config.healthCheckInterval);
    
    // Performance optimization
    setInterval(() => {
      this.optimizeNetworkPerformance();
    }, this.config.optimizationInterval);
  }

  private monitorNetworkHealth(): void {
    this.networks.forEach((network: MeshNetwork) => {
      const healthScore = this.calculateNetworkHealth(network);
      
      if (healthScore < 50) {
        network.status = NetworkStatus.DEGRADED;
        this.emit('networkDegraded', network);
      } else if (healthScore < 30) {
        network.status = NetworkStatus.FRAGMENTING;
        this.emit('networkFragmenting', network);
      } else {
        network.status = NetworkStatus.ACTIVE;
      }
    });
  }

  private calculateNetworkHealth(network: MeshNetwork): number {
    let healthScore = 100;
    
    // Reduce score for offline nodes
    const offlineNodes = Array.from(network.nodes.values())
      .filter(node => node.status === NodeStatus.OFFLINE).length;
    healthScore -= (offlineNodes / network.nodes.size) * 40;
    
    // Reduce score for poor connections
    let totalQuality = 0;
    let connectionCount = 0;
    
    network.nodes.forEach(node => {
      node.connections.forEach(connection => {
        totalQuality += this.calculateRouteQuality(connection);
        connectionCount++;
      });
    });
    
    if (connectionCount > 0) {
      const averageQuality = totalQuality / connectionCount;
      if (averageQuality < 70) {
        healthScore -= (70 - averageQuality);
      }
    }
    
    return Math.max(0, healthScore);
  }

  private optimizeNetworkPerformance(): void {
    // Implement network optimization strategies
    // e.g., load balancing, route optimization, power management
  }

  private generateNetworkId(): string {
    return `network_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ========================================================================
  // PUBLIC API METHODS
  // ========================================================================

  getLocalNode(): MeshNode {
    return this.localNode;
  }

  getNetworks(): MeshNetwork[] {
    return Array.from(this.networks.values());
  }

  getConnectedNodes(): MeshNode[] {
    return Array.from(this.localNode.connections.keys())
      .map(nodeId => this.findNode(nodeId))
      .filter(node => node !== undefined) as MeshNode[];
  }

  getRoutingTable(): Map<string, Route[]> {
    return new Map(this.routingTable);
  }

  getNetworkStatistics(): NetworkStatistics {
    // Aggregate statistics across all networks
    const allNetworks = Array.from(this.networks.values());
    const networkCount = allNetworks.length || 1; // Avoid division by zero
    
    return {
      totalNodes: allNetworks.reduce((sum, net) => sum + net.statistics.totalNodes, 0),
      activeNodes: allNetworks.reduce((sum, net) => sum + net.statistics.activeNodes, 0),
      totalConnections: allNetworks.reduce((sum, net) => sum + net.statistics.totalConnections, 0),
      messagesSent: allNetworks.reduce((sum, net) => sum + net.statistics.messagesSent, 0),
      messagesReceived: allNetworks.reduce((sum, net) => sum + net.statistics.messagesReceived, 0),
      averageLatency: allNetworks.reduce((sum, net) => sum + net.statistics.averageLatency, 0) / networkCount,
      networkReliability: allNetworks.reduce((sum, net) => sum + net.statistics.networkReliability, 0) / networkCount,
      coverage: {
        geographicArea: allNetworks.reduce((sum, net) => sum + net.statistics.coverage.geographicArea, 0),
        populationReach: allNetworks.reduce((sum, net) => sum + net.statistics.coverage.populationReach, 0),
        redundancy: allNetworks.reduce((sum, net) => sum + net.statistics.coverage.redundancy, 0) / networkCount
      }
    };
  }
}

// ============================================================================
// SUPPORTING INTERFACES & CLASSES
// ============================================================================

export interface MeshEngineConfig {
  nodeId: string;
  deviceId: string;
  displayName: string;
  nodeType: NodeType;
  capabilities: NodeCapabilities;
  protocols: Protocol[];
  initialTrustLevel: number;
  discoveryInterval: number;
  routingUpdateInterval: number;
  messageProcessingInterval: number;
  messageRetryInterval: number;
  maxRetryAttempts: number;
  messageStoreMaxAge: number;
  routeStaleThreshold: number;
  maxRoutesPerDestination: number;
  maxNetworkSize: number;
  maxNetworkRadius: number;
  minTrustLevel: number;
  healthCheckInterval: number;
  optimizationInterval: number;
  bluetooth: BluetoothLEConfig;
  wifiDirect: WiFiDirectConfig;
  internetBridge: InternetBridgeConfig;
}

export interface BluetoothLEConfig {
  serviceUuid: string;
  characteristicUuid: string;
  scanInterval: number;
  advertisingInterval: number;
  connectionTimeout: number;
  maxConnections: number;
}

export interface WiFiDirectConfig {
  groupName: string;
  passphrase: string;
  port: number;
  discoveryTimeout: number;
  connectionTimeout: number;
  maxConnections: number;
}

export interface InternetBridgeConfig {
  enabled: boolean;
  serverUrl?: string;
  apiKey?: string;
  syncInterval: number;
}

export interface MeshMessage {
  id: string;
  senderId: string;
  recipientId?: string;
  type: MessageType;
  payload: any;
  timestamp: Date;
  priority: number;
  hops: number;
  maxHops: number;
  ttl: number;
  signature?: string;
}

export interface StoredMessage {
  message: MeshMessage;
  attempts: number;
  stored: Date;
  lastAttempt: Date;
}

export abstract class ProtocolAdapter extends EventEmitter {
  abstract initialize(): Promise<void>;
  abstract startDiscovery(): Promise<void>;
  abstract discoverNodes(): Promise<MeshNode[]>;
  abstract connect(node: MeshNode): Promise<Connection | null>;
  abstract disconnect(nodeId: string): Promise<void>;
  abstract sendMessage(nodeId: string, message: MeshMessage): Promise<void>;
}

// Placeholder implementations for protocol adapters
export class BluetoothLEAdapter extends ProtocolAdapter {
  constructor(private config: BluetoothLEConfig, private logger: Logger) {
    super();
  }

  async initialize(): Promise<void> {
    this.logger.info('Bluetooth LE adapter initialized');
  }

  async startDiscovery(): Promise<void> {
    this.logger.info('Bluetooth LE discovery started');
  }

  async discoverNodes(): Promise<MeshNode[]> {
    return []; // Implementation would use Web Bluetooth API
  }

  async connect(node: MeshNode): Promise<Connection | null> {
    return null; // Implementation would establish BLE connection
  }

  async disconnect(nodeId: string): Promise<void> {
    // Implementation would disconnect BLE connection
  }

  async sendMessage(nodeId: string, message: MeshMessage): Promise<void> {
    // Implementation would send via BLE characteristic
  }
}

export class WiFiDirectAdapter extends ProtocolAdapter {
  constructor(private config: WiFiDirectConfig, private logger: Logger) {
    super();
  }

  async initialize(): Promise<void> {
    this.logger.info('WiFi Direct adapter initialized');
  }

  async startDiscovery(): Promise<void> {
    this.logger.info('WiFi Direct discovery started');
  }

  async discoverNodes(): Promise<MeshNode[]> {
    return []; // Implementation would use WiFi Direct APIs
  }

  async connect(node: MeshNode): Promise<Connection | null> {
    return null; // Implementation would establish WiFi Direct connection
  }

  async disconnect(nodeId: string): Promise<void> {
    // Implementation would disconnect WiFi Direct connection
  }

  async sendMessage(nodeId: string, message: MeshMessage): Promise<void> {
    // Implementation would send via WiFi Direct socket
  }
}

export class InternetBridgeAdapter extends ProtocolAdapter {
  constructor(private config: InternetBridgeConfig, private logger: Logger) {
    super();
  }

  async initialize(): Promise<void> {
    this.logger.info('Internet Bridge adapter initialized');
  }

  async startDiscovery(): Promise<void> {
    this.logger.info('Internet Bridge discovery started');
  }

  async discoverNodes(): Promise<MeshNode[]> {
    return []; // Implementation would discover via internet services
  }

  async connect(node: MeshNode): Promise<Connection | null> {
    return null; // Implementation would establish internet connection
  }

  async disconnect(nodeId: string): Promise<void> {
    // Implementation would disconnect internet connection
  }

  async sendMessage(nodeId: string, message: MeshMessage): Promise<void> {
    // Implementation would send via internet (WebSocket/HTTP)
  }
}

export interface CryptoService {
  verifySignature(data: any, signature: string): Promise<boolean>;
}

export interface Logger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, error?: any): void;
}

export default MeshEngineService;