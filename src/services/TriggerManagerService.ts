// Trigger Manager Service - Safety Automation System
// Part of Phase 3: Sonny Core Platform Integration
// Mlandeli-Notemba Investments Ecosystem

import { EventEmitter } from 'events';

// ============================================================================
// TRIGGER INTERFACES & TYPES
// ============================================================================

export interface SafetyTrigger {
  id: string;
  ownerId: string;
  name: string;
  type: TriggerType;
  status: TriggerStatus;
  configuration: TriggerConfiguration;
  escalationLevels: EscalationLevel[];
  createdAt: Date;
  lastTriggered?: Date;
  isActive: boolean;
  trustRequirement: number; // Minimum trust score required
}

export enum TriggerType {
  TRIP_BASED = 'trip_based',           // Start/End locations with expected duration
  TIME_BASED = 'time_based',           // Periodic check-ins (daily/weekly)
  LOCATION_BASED = 'location_based',   // Geo-fence entry/exit zones
  ACTIVITY_BASED = 'activity_based',   // Custom events and manual check-ins
  EMERGENCY = 'emergency',             // Panic button triggers
  FAMILY_COORDINATION = 'family_coordination' // Family-specific coordination triggers
}

export enum TriggerStatus {
  ACTIVE = 'active',
  WAITING = 'waiting',
  TRIGGERED = 'triggered',
  ESCALATING = 'escalating',
  RESOLVED = 'resolved',
  EXPIRED = 'expired',
  DISABLED = 'disabled'
}

export interface TriggerConfiguration {
  // Location-based configuration
  startLocation?: LocationPoint;
  endLocation?: LocationPoint;
  geofences?: Geofence[];
  
  // Time-based configuration
  expectedDuration?: number; // minutes
  checkInInterval?: number;   // minutes
  gracePeriod?: number;      // minutes
  
  // Schedule configuration
  schedule?: TriggerSchedule;
  
  // Family coordination
  requiredParticipants?: string[]; // Family member IDs
  allowedResponders?: string[];    // Who can respond to this trigger
  
  // Emergency configuration
  immediateEscalation?: boolean;
  panicMode?: boolean;
  
  // Custom configuration
  customRules?: CustomRule[];
}

export interface LocationPoint {
  latitude: number;
  longitude: number;
  accuracy: number;
  what3words?: string;
  name?: string;
}

export interface Geofence {
  center: LocationPoint;
  radius: number; // meters
  type: 'entry' | 'exit' | 'presence';
  name: string;
}

export interface TriggerSchedule {
  days: number[]; // 0-6 (Sunday-Saturday)
  startTime?: string; // HH:mm format
  endTime?: string;   // HH:mm format
  timezone: string;
}

export interface CustomRule {
  condition: string;
  action: string;
  parameters: Record<string, any>;
}

export interface EscalationLevel {
  level: number;
  name: string;
  delayMinutes: number;
  actions: EscalationAction[];
  autoResolve: boolean;
  requiredResponders?: number;
}

export interface EscalationAction {
  type: ActionType;
  configuration: ActionConfiguration;
  priority: number;
}

export enum ActionType {
  MESH_ALERT = 'mesh_alert',           // Alert via mesh network
  FAMILY_NOTIFICATION = 'family_notification', // Notify family members
  COMMUNITY_ALERT = 'community_alert',  // Alert community network
  LOCATION_BROADCAST = 'location_broadcast', // Share location
  EMERGENCY_SERVICES = 'emergency_services', // Contact authorities
  SMS_ALERT = 'sms_alert',             // Send SMS (if internet available)
  VOICE_CALL = 'voice_call',           // Automated voice call
  CUSTOM_ACTION = 'custom_action'       // Custom defined action
}

export interface ActionConfiguration {
  recipients?: string[]; // Family member IDs
  message?: string;
  locationSharing?: boolean;
  serviceEndpoint?: string;
  phoneNumbers?: string[];
  customPayload?: Record<string, any>;
}

export interface TriggerEvent {
  id: string;
  triggerId: string;
  timestamp: Date;
  eventType: TriggerEventType;
  location?: LocationPoint;
  context: Record<string, any>;
  response?: TriggerResponse;
}

export enum TriggerEventType {
  TRIGGER_CREATED = 'trigger_created',
  TRIGGER_ACTIVATED = 'trigger_activated',
  CHECK_IN_RECEIVED = 'check_in_received',
  CHECK_IN_MISSED = 'check_in_missed',
  ESCALATION_STARTED = 'escalation_started',
  RESPONSE_RECEIVED = 'response_received',
  TRIGGER_RESOLVED = 'trigger_resolved',
  TRIGGER_EXPIRED = 'trigger_expired'
}

export interface TriggerResponse {
  responderId: string;
  timestamp: Date;
  responseType: 'safe' | 'need_help' | 'false_alarm' | 'resolved';
  message?: string;
  location?: LocationPoint;
}

// ============================================================================
// TRIGGER MANAGER SERVICE
// ============================================================================

export class TriggerManagerService extends EventEmitter {
  private activeTriggers: Map<string, SafetyTrigger> = new Map();
  private triggerEvents: Map<string, TriggerEvent[]> = new Map();
  private escalationTimers: Map<string, NodeJS.Timeout> = new Map();
  private isInitialized: boolean = false;

  constructor(
    private config: TriggerManagerConfig,
    private logger: Logger,
    private meshBridge: MeshBridge,
    private locationService: LocationService,
    private notificationService: NotificationService
  ) {
    super();
    this.setupEventHandlers();
  }

  // ========================================================================
  // INITIALIZATION & LIFECYCLE
  // ========================================================================

  async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing Trigger Manager Service...');
      
      // Load existing triggers from storage
      await this.loadTriggers();
      
      // Start background monitoring
      await this.startBackgroundMonitoring();
      
      // Initialize location monitoring
      await this.locationService.initialize();
      
      this.isInitialized = true;
      this.emit('initialized');
      
      this.logger.info('Trigger Manager Service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Trigger Manager Service:', error);
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    // Clear all timers
    for (const timer of this.escalationTimers.values()) {
      clearTimeout(timer);
    }
    this.escalationTimers.clear();

    // Save trigger state
    await this.saveTriggers();

    this.isInitialized = false;
    this.emit('shutdown');
  }

  // ========================================================================
  // TRIGGER MANAGEMENT
  // ========================================================================

  async createTrigger(triggerData: Omit<SafetyTrigger, 'id' | 'createdAt' | 'status'>): Promise<SafetyTrigger> {
    try {
      const trigger: SafetyTrigger = {
        ...triggerData,
        id: this.generateTriggerId(),
        createdAt: new Date(),
        status: TriggerStatus.ACTIVE
      };

      // Validate trigger configuration
      await this.validateTrigger(trigger);

      // Store trigger
      this.activeTriggers.set(trigger.id, trigger);

      // Setup monitoring for this trigger
      await this.setupTriggerMonitoring(trigger);

      // Log event
      await this.logTriggerEvent(trigger.id, TriggerEventType.TRIGGER_CREATED, {
        triggerType: trigger.type,
        configuration: trigger.configuration
      });

      this.emit('triggerCreated', trigger);
      this.logger.info(`Trigger created: ${trigger.id} (${trigger.name})`);

      return trigger;
    } catch (error) {
      this.logger.error('Failed to create trigger:', error);
      throw error;
    }
  }

  async updateTrigger(triggerId: string, updates: Partial<SafetyTrigger>): Promise<SafetyTrigger> {
    const trigger = this.activeTriggers.get(triggerId);
    if (!trigger) {
      throw new Error(`Trigger ${triggerId} not found`);
    }

    const updatedTrigger = { ...trigger, ...updates };
    await this.validateTrigger(updatedTrigger);

    this.activeTriggers.set(triggerId, updatedTrigger);
    
    // Restart monitoring with new configuration
    await this.setupTriggerMonitoring(updatedTrigger);

    this.emit('triggerUpdated', updatedTrigger);
    return updatedTrigger;
  }

  async deleteTrigger(triggerId: string): Promise<void> {
    const trigger = this.activeTriggers.get(triggerId);
    if (!trigger) {
      throw new Error(`Trigger ${triggerId} not found`);
    }

    // Clear any active escalations
    const timer = this.escalationTimers.get(triggerId);
    if (timer) {
      clearTimeout(timer);
      this.escalationTimers.delete(triggerId);
    }

    // Remove trigger
    this.activeTriggers.delete(triggerId);

    this.emit('triggerDeleted', triggerId);
    this.logger.info(`Trigger deleted: ${triggerId}`);
  }

  // ========================================================================
  // TRIGGER ACTIVATION & MONITORING
  // ========================================================================

  async activateTrigger(triggerId: string, context: Record<string, any> = {}): Promise<void> {
    const trigger = this.activeTriggers.get(triggerId);
    if (!trigger) {
      throw new Error(`Trigger ${triggerId} not found`);
    }

    if (trigger.status !== TriggerStatus.ACTIVE) {
      throw new Error(`Trigger ${triggerId} is not in active state`);
    }

    // Update trigger status
    trigger.status = TriggerStatus.WAITING;
    trigger.lastTriggered = new Date();

    // Log activation event
    await this.logTriggerEvent(triggerId, TriggerEventType.TRIGGER_ACTIVATED, context);

    // Start monitoring based on trigger type
    switch (trigger.type) {
      case TriggerType.TRIP_BASED:
        await this.startTripMonitoring(trigger, context);
        break;
      case TriggerType.TIME_BASED:
        await this.startTimeBasedMonitoring(trigger);
        break;
      case TriggerType.LOCATION_BASED:
        await this.startLocationMonitoring(trigger);
        break;
      case TriggerType.ACTIVITY_BASED:
        await this.startActivityMonitoring(trigger);
        break;
      case TriggerType.EMERGENCY:
        await this.handleEmergencyTrigger(trigger, context);
        break;
    }

    this.emit('triggerActivated', trigger, context);
    this.logger.info(`Trigger activated: ${triggerId} (${trigger.name})`);
  }

  async checkIn(triggerId: string, response: TriggerResponse): Promise<void> {
    const trigger = this.activeTriggers.get(triggerId);
    if (!trigger) {
      throw new Error(`Trigger ${triggerId} not found`);
    }

    // Log check-in event
    await this.logTriggerEvent(triggerId, TriggerEventType.CHECK_IN_RECEIVED, {
      responderId: response.responderId,
      responseType: response.responseType,
      location: response.location
    });

    // Handle response based on type
    switch (response.responseType) {
      case 'safe':
        await this.resolveTrigger(triggerId, response);
        break;
      case 'need_help':
        await this.escalateTrigger(triggerId, 'manual_escalation', response);
        break;
      case 'false_alarm':
        await this.resolveTrigger(triggerId, response);
        break;
      case 'resolved':
        await this.resolveTrigger(triggerId, response);
        break;
    }

    this.emit('checkInReceived', triggerId, response);
  }

  // ========================================================================
  // ESCALATION HANDLING
  // ========================================================================

  private async escalateTrigger(triggerId: string, reason: string, context?: any): Promise<void> {
    const trigger = this.activeTriggers.get(triggerId);
    if (!trigger) return;

    trigger.status = TriggerStatus.ESCALATING;

    // Log escalation start
    await this.logTriggerEvent(triggerId, TriggerEventType.ESCALATION_STARTED, {
      reason,
      context
    });

    // Start escalation sequence
    await this.executeEscalationSequence(trigger, context);

    this.emit('triggerEscalated', trigger, reason, context);
    this.logger.warn(`Trigger escalated: ${triggerId} (${reason})`);
  }

  private async executeEscalationSequence(trigger: SafetyTrigger, initialContext?: any): Promise<void> {
    for (const level of trigger.escalationLevels.sort((a, b) => a.level - b.level)) {
      // Wait for delay (unless it's level 0 - immediate)
      if (level.level > 0 && level.delayMinutes > 0) {
        await this.delay(level.delayMinutes * 60 * 1000);
      }

      // Check if trigger has been resolved
      const currentTrigger = this.activeTriggers.get(trigger.id);
      if (!currentTrigger || currentTrigger.status === TriggerStatus.RESOLVED) {
        return;
      }

      this.logger.info(`Executing escalation level ${level.level} for trigger ${trigger.id}`);

      // Execute all actions in this level
      const actionPromises = level.actions.map(action => 
        this.executeEscalationAction(trigger, action, initialContext)
      );

      await Promise.allSettled(actionPromises);

      // If auto-resolve is enabled for this level, wait for responses
      if (level.autoResolve) {
        const resolved = await this.waitForResponses(trigger, level);
        if (resolved) {
          return;
        }
      }
    }

    // If we reach here, all escalation levels have been exhausted
    this.logger.error(`All escalation levels exhausted for trigger ${trigger.id}`);
    trigger.status = TriggerStatus.EXPIRED;
    
    await this.logTriggerEvent(trigger.id, TriggerEventType.TRIGGER_EXPIRED, {
      reason: 'escalation_exhausted'
    });
  }

  private async executeEscalationAction(
    trigger: SafetyTrigger, 
    action: EscalationAction, 
    context?: any
  ): Promise<void> {
    try {
      switch (action.type) {
        case ActionType.MESH_ALERT:
          await this.sendMeshAlert(trigger, action.configuration, context);
          break;
        case ActionType.FAMILY_NOTIFICATION:
          await this.sendFamilyNotification(trigger, action.configuration);
          break;
        case ActionType.COMMUNITY_ALERT:
          await this.sendCommunityAlert(trigger, action.configuration);
          break;
        case ActionType.LOCATION_BROADCAST:
          await this.broadcastLocation(trigger, action.configuration);
          break;
        case ActionType.EMERGENCY_SERVICES:
          await this.contactEmergencyServices(trigger, action.configuration);
          break;
        case ActionType.SMS_ALERT:
          await this.sendSMSAlert(trigger, action.configuration);
          break;
        case ActionType.VOICE_CALL:
          await this.makeVoiceCall(trigger, action.configuration);
          break;
        case ActionType.CUSTOM_ACTION:
          await this.executeCustomAction(trigger, action.configuration);
          break;
      }
    } catch (error) {
      this.logger.error(`Failed to execute escalation action ${action.type}:`, error);
    }
  }

  // ========================================================================
  // ESCALATION ACTIONS IMPLEMENTATION
  // ========================================================================

  private async sendMeshAlert(
    trigger: SafetyTrigger, 
    config: ActionConfiguration,
    context?: any
  ): Promise<void> {
    const meshMessage = {
      type: 'trigger_alert',
      senderId: trigger.ownerId,
      payload: {
        triggerId: trigger.id,
        triggerName: trigger.name,
        alertLevel: 'HIGH',
        message: config.message || `Safety trigger activated: ${trigger.name}`,
        location: await this.locationService.getCurrentLocation(),
        timestamp: new Date().toISOString(),
        context
      },
      priority: 'HIGH',
      hops: 0,
      maxHops: 5,
      ttl: 300 // 5 minutes
    };

    await this.meshBridge.broadcastMessage(meshMessage);
  }

  private async sendFamilyNotification(
    trigger: SafetyTrigger, 
    config: ActionConfiguration
  ): Promise<void> {
    const recipients = config.recipients || trigger.configuration.allowedResponders || [];
    
    for (const recipientId of recipients) {
      await this.notificationService.sendNotification(recipientId, {
        title: 'Family Safety Alert',
        body: config.message || `${trigger.name} requires attention`,
        data: {
          triggerId: trigger.id,
          type: 'safety_alert',
          location: await this.locationService.getCurrentLocation()
        }
      });
    }
  }

  private async sendCommunityAlert(
    trigger: SafetyTrigger, 
    config: ActionConfiguration
  ): Promise<void> {
    // Broadcast to community mesh network
    const communityMessage = {
      type: 'community_alert',
      senderId: trigger.ownerId,
      payload: {
        alertType: 'safety_concern',
        message: config.message || 'Community member needs assistance',
        location: await this.locationService.getCurrentLocation(),
        urgency: 'high'
      }
    };

    await this.meshBridge.broadcastToCommunity(communityMessage);
  }

  private async broadcastLocation(
    trigger: SafetyTrigger, 
    config: ActionConfiguration
  ): Promise<void> {
    const currentLocation = await this.locationService.getCurrentLocation();
    
    if (currentLocation) {
      const locationMessage = {
        type: 'location_broadcast',
        senderId: trigger.ownerId,
        payload: {
          triggerId: trigger.id,
          location: currentLocation,
          timestamp: new Date().toISOString(),
          accuracy: currentLocation.accuracy
        }
      };

      await this.meshBridge.broadcastMessage(locationMessage);
    }
  }

  private async contactEmergencyServices(
    trigger: SafetyTrigger, 
    config: ActionConfiguration
  ): Promise<void> {
    // This requires internet connectivity
    const location = await this.locationService.getCurrentLocation();
    
    const emergencyData = {
      triggerId: trigger.id,
      triggerName: trigger.name,
      location,
      contactInfo: trigger.ownerId,
      timestamp: new Date().toISOString(),
      message: config.message || 'Automated safety alert from MNI ecosystem'
    };

    // Send to configured emergency service endpoint
    if (config.serviceEndpoint) {
      try {
        await fetch(config.serviceEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emergencyData)
        });
      } catch (error) {
        this.logger.error('Failed to contact emergency services:', error);
      }
    }
  }

  private async sendSMSAlert(
    trigger: SafetyTrigger, 
    config: ActionConfiguration
  ): Promise<void> {
    // SMS sending implementation (requires internet and SMS service)
    this.logger.info('SMS alert would be sent here');
  }

  private async makeVoiceCall(
    trigger: SafetyTrigger, 
    config: ActionConfiguration
  ): Promise<void> {
    // Voice call implementation (requires internet and voice service)
    this.logger.info('Voice call would be made here');
  }

  private async executeCustomAction(
    trigger: SafetyTrigger, 
    config: ActionConfiguration
  ): Promise<void> {
    // Custom action execution based on configuration
    this.logger.info('Custom action would be executed here');
  }

  // ========================================================================
  // TRIGGER MONITORING IMPLEMENTATIONS
  // ========================================================================

  private async startTripMonitoring(trigger: SafetyTrigger, context: any): Promise<void> {
    const expectedDuration = trigger.configuration.expectedDuration || 60; // Default 1 hour
    const gracePeriod = trigger.configuration.gracePeriod || 15; // Default 15 minutes
    
    // Set timer for expected completion
    const timer = setTimeout(async () => {
      await this.handleMissedCheckIn(trigger.id, 'trip_overdue');
    }, (expectedDuration + gracePeriod) * 60 * 1000);

    this.escalationTimers.set(trigger.id, timer);
  }

  private async startTimeBasedMonitoring(trigger: SafetyTrigger): Promise<void> {
    const interval = trigger.configuration.checkInInterval || 60; // Default 1 hour
    
    const timer = setTimeout(async () => {
      await this.handleMissedCheckIn(trigger.id, 'scheduled_checkin_missed');
    }, interval * 60 * 1000);

    this.escalationTimers.set(trigger.id, timer);
  }

  private async startLocationMonitoring(trigger: SafetyTrigger): Promise<void> {
    // Monitor geofences
    if (trigger.configuration.geofences) {
      this.locationService.monitorGeofences(
        trigger.id,
        trigger.configuration.geofences,
        (event) => this.handleGeofenceEvent(trigger.id, event)
      );
    }
  }

  private async startActivityMonitoring(trigger: SafetyTrigger): Promise<void> {
    // Activity-based monitoring setup
    // This would integrate with app activity monitoring
    this.logger.info(`Activity monitoring started for trigger ${trigger.id}`);
  }

  private async handleEmergencyTrigger(trigger: SafetyTrigger, context: any): Promise<void> {
    // Emergency triggers start escalation immediately
    await this.escalateTrigger(trigger.id, 'emergency_activated', context);
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  private async handleMissedCheckIn(triggerId: string, reason: string): Promise<void> {
    await this.logTriggerEvent(triggerId, TriggerEventType.CHECK_IN_MISSED, { reason });
    await this.escalateTrigger(triggerId, reason);
  }

  private async handleGeofenceEvent(triggerId: string, event: any): Promise<void> {
    // Handle geofence entry/exit events
    this.emit('geofenceEvent', triggerId, event);
  }

  private async resolveTrigger(triggerId: string, response: TriggerResponse): Promise<void> {
    const trigger = this.activeTriggers.get(triggerId);
    if (!trigger) return;

    // Clear any active timers
    const timer = this.escalationTimers.get(triggerId);
    if (timer) {
      clearTimeout(timer);
      this.escalationTimers.delete(triggerId);
    }

    trigger.status = TriggerStatus.RESOLVED;
    
    await this.logTriggerEvent(triggerId, TriggerEventType.TRIGGER_RESOLVED, {
      responderId: response.responderId,
      resolution: response.responseType
    });

    this.emit('triggerResolved', trigger, response);
    this.logger.info(`Trigger resolved: ${triggerId}`);
  }

  private async waitForResponses(trigger: SafetyTrigger, level: EscalationLevel): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 5 * 60 * 1000); // 5 minute timeout
      
      const responseHandler = (triggerId: string) => {
        if (triggerId === trigger.id) {
          clearTimeout(timeout);
          this.off('checkInReceived', responseHandler);
          resolve(true);
        }
      };
      
      this.on('checkInReceived', responseHandler);
    });
  }

  private async validateTrigger(trigger: SafetyTrigger): Promise<void> {
    // Validate trigger configuration
    if (!trigger.name || trigger.name.trim().length === 0) {
      throw new Error('Trigger name is required');
    }
    
    if (!trigger.ownerId) {
      throw new Error('Trigger owner is required');
    }
    
    if (trigger.escalationLevels.length === 0) {
      throw new Error('At least one escalation level is required');
    }
  }

  private async setupTriggerMonitoring(trigger: SafetyTrigger): Promise<void> {
    // Clear existing monitoring
    const existingTimer = this.escalationTimers.get(trigger.id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.escalationTimers.delete(trigger.id);
    }

    // Setup new monitoring if trigger is active
    if (trigger.status === TriggerStatus.WAITING) {
      // Re-setup monitoring based on trigger type
      // Implementation depends on trigger type
    }
  }

  private async logTriggerEvent(triggerId: string, eventType: TriggerEventType, context: any): Promise<void> {
    const event: TriggerEvent = {
      id: this.generateEventId(),
      triggerId,
      timestamp: new Date(),
      eventType,
      context
    };

    const events = this.triggerEvents.get(triggerId) || [];
    events.push(event);
    this.triggerEvents.set(triggerId, events);

    this.emit('triggerEvent', event);
  }

  private setupEventHandlers(): void {
    this.meshBridge.on('messageReceived', (message: any) => {
      if (message.type === 'trigger_response') {
        this.handleTriggerResponse(message);
      }
    });
  }

  private async handleTriggerResponse(message: any): Promise<void> {
    const { triggerId, response } = message.payload;
    if (this.activeTriggers.has(triggerId)) {
      await this.checkIn(triggerId, response);
    }
  }

  private async startBackgroundMonitoring(): Promise<void> {
    // Start periodic cleanup and maintenance
    setInterval(() => {
      this.cleanupExpiredTriggers();
    }, 60000); // Check every minute
  }

  private cleanupExpiredTriggers(): void {
    const now = Date.now();
    for (const [id, trigger] of this.activeTriggers.entries()) {
      // Remove expired triggers based on your business logic
      if (trigger.status === TriggerStatus.EXPIRED) {
        this.activeTriggers.delete(id);
        this.triggerEvents.delete(id);
      }
    }
  }

  private async loadTriggers(): Promise<void> {
    // Load triggers from persistent storage
    // Implementation depends on storage mechanism
  }

  private async saveTriggers(): Promise<void> {
    // Save triggers to persistent storage
    // Implementation depends on storage mechanism
  }

  private generateTriggerId(): string {
    return `trigger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ========================================================================
  // PUBLIC API METHODS
  // ========================================================================

  getTrigger(triggerId: string): SafetyTrigger | undefined {
    return this.activeTriggers.get(triggerId);
  }

  getAllTriggers(): SafetyTrigger[] {
    return Array.from(this.activeTriggers.values());
  }

  getTriggersByOwner(ownerId: string): SafetyTrigger[] {
    return Array.from(this.activeTriggers.values())
      .filter(trigger => trigger.ownerId === ownerId);
  }

  getTriggerEvents(triggerId: string): TriggerEvent[] {
    return this.triggerEvents.get(triggerId) || [];
  }

  getActiveTriggerCount(): number {
    return Array.from(this.activeTriggers.values())
      .filter(trigger => trigger.status === TriggerStatus.ACTIVE || 
                        trigger.status === TriggerStatus.WAITING).length;
  }
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

export interface TriggerManagerConfig {
  maxActiveTriggers: number;
  defaultEscalationDelay: number;
  emergencyServiceEndpoint?: string;
  communityAlertRadius: number;
  locationAccuracyThreshold: number;
}

export interface MeshBridge {
  broadcastMessage(message: any): Promise<void>;
  broadcastToCommunity(message: any): Promise<void>;
  on(event: string, listener: (...args: any[]) => void): void;
}

export interface LocationService {
  initialize(): Promise<void>;
  getCurrentLocation(): Promise<LocationPoint | null>;
  monitorGeofences(triggerId: string, geofences: Geofence[], callback: (event: any) => void): void;
}

export interface NotificationService {
  sendNotification(recipientId: string, notification: {
    title: string;
    body: string;
    data?: any;
  }): Promise<void>;
}

export interface Logger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, error?: any): void;
}

export default TriggerManagerService;