// Consent Ledger Web Interface - Permission Tracking System
// Part of Phase 3: Sonny Core Platform Integration
// Mlandeli-Notemba Investments Ecosystem

import { EventEmitter } from 'events';

// ============================================================================
// CONSENT INTERFACES & TYPES
// ============================================================================

export interface ConsentRecord {
  id: string;
  grantorId: string;        // Person giving consent
  granteeId: string;        // Person receiving consent
  consentType: ConsentType;
  permissions: Permission[];
  status: ConsentStatus;
  expirationDate?: Date;
  createdAt: Date;
  lastModified: Date;
  revokedAt?: Date;
  context: ConsentContext;
  auditTrail: ConsentAuditEntry[];
  signature: string;        // Cryptographic signature
}

export enum ConsentType {
  MONITORING = 'monitoring',           // Location/activity monitoring
  DATA_SHARING = 'data_sharing',       // Share personal data
  EMERGENCY_ACCESS = 'emergency_access', // Emergency override permissions
  FAMILY_COORDINATION = 'family_coordination', // Family activity coordination
  BUSINESS_ACCESS = 'business_access',  // Business data access
  HEALTH_SHARING = 'health_sharing',   // Health information sharing
  FINANCIAL_ACCESS = 'financial_access', // Financial data access
  COMMUNICATION = 'communication',      // Communication permissions
  LOCATION_TRACKING = 'location_tracking', // Real-time location sharing
  MESH_PARTICIPATION = 'mesh_participation' // Mesh network participation
}

export enum ConsentStatus {
  PENDING = 'pending',       // Awaiting grantor approval
  ACTIVE = 'active',         // Currently active and valid
  EXPIRED = 'expired',       // Expired based on time
  REVOKED = 'revoked',       // Manually revoked
  SUSPENDED = 'suspended',   // Temporarily suspended
  REJECTED = 'rejected'      // Request was rejected
}

export interface Permission {
  id: string;
  type: PermissionType;
  scope: PermissionScope;
  conditions: PermissionCondition[];
  granularity: PermissionGranularity;
  timeRestrictions?: TimeRestriction[];
  locationRestrictions?: LocationRestriction[];
}

export enum PermissionType {
  READ = 'read',             // Read access to data
  WRITE = 'write',           // Write access to data
  MONITOR = 'monitor',       // Monitor activities/location
  ALERT = 'alert',           // Send alerts/notifications
  EMERGENCY = 'emergency',   // Emergency access override
  SHARE = 'share',           // Share data with others
  CONTROL = 'control'        // Control devices/settings
}

export enum PermissionScope {
  LOCATION = 'location',                 // Location data
  PERSONAL_INFO = 'personal_info',       // Personal information
  ACTIVITY_DATA = 'activity_data',       // Activity and behavior data
  COMMUNICATION = 'communication',        // Messages and calls
  FAMILY_DATA = 'family_data',           // Family-related information
  BUSINESS_DATA = 'business_data',       // Business information
  HEALTH_DATA = 'health_data',           // Health information
  FINANCIAL_DATA = 'financial_data',     // Financial information
  EMERGENCY_CONTACTS = 'emergency_contacts', // Emergency contact info
  DEVICE_CONTROL = 'device_control'      // Device control permissions
}

export enum PermissionGranularity {
  FULL = 'full',             // Complete access
  LIMITED = 'limited',       // Limited access with restrictions
  SUMMARY_ONLY = 'summary_only', // Only summary/aggregated data
  EMERGENCY_ONLY = 'emergency_only', // Only during emergencies
  SCHEDULED = 'scheduled'    // Only during specific times/conditions
}

export interface PermissionCondition {
  type: ConditionType;
  operator: ConditionOperator;
  value: any;
  description: string;
}

export enum ConditionType {
  TIME_OF_DAY = 'time_of_day',
  DAY_OF_WEEK = 'day_of_week',
  LOCATION = 'location',
  EMERGENCY_STATUS = 'emergency_status',
  TRUST_SCORE = 'trust_score',
  FAMILY_PRESENCE = 'family_presence',
  CUSTOM = 'custom'
}

export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  IN_RANGE = 'in_range',
  CONTAINS = 'contains',
  WITHIN_RADIUS = 'within_radius'
}

export interface TimeRestriction {
  startTime: string;         // HH:mm format
  endTime: string;           // HH:mm format
  days: number[];            // 0-6 (Sunday-Saturday)
  timezone: string;
}

export interface LocationRestriction {
  type: 'geofence' | 'radius' | 'exclusion_zone';
  center?: { latitude: number; longitude: number };
  radius?: number;           // meters
  boundaries?: Array<{ latitude: number; longitude: number }>;
  name: string;
}

export interface ConsentContext {
  purpose: string;           // Why this consent is needed
  duration: ConsentDuration;
  reciprocity?: ReciprocityRequirement; // Ubuntu reciprocal expectations
  familyRole?: string;       // Role in family structure
  businessContext?: string;  // Business relationship context
  emergencyOverride: boolean; // Can be overridden in emergencies
  trustThreshold: number;    // Minimum trust score required
  customMetadata?: Record<string, any>;
}

export interface ConsentDuration {
  type: 'indefinite' | 'fixed' | 'renewable' | 'session';
  duration?: number;         // Duration in hours (for fixed/renewable)
  maxRenewals?: number;      // Max number of renewals allowed
  autoRenewal?: boolean;     // Automatic renewal if conditions met
}

export interface ReciprocityRequirement {
  required: boolean;
  reciprocalPermissions: Permission[];
  balanceThreshold: number;  // Required balance in reciprocal exchanges
}

export interface ConsentAuditEntry {
  id: string;
  timestamp: Date;
  action: AuditAction;
  performedBy: string;
  changes?: any;
  reason?: string;
  ipAddress?: string;
  deviceInfo?: string;
}

export enum AuditAction {
  CREATED = 'created',
  GRANTED = 'granted',
  MODIFIED = 'modified',
  ACCESSED = 'accessed',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
  RENEWED = 'renewed',
  REJECTED = 'rejected'
}

export interface ConsentRequest {
  id: string;
  requesterId: string;
  targetId: string;
  requestedPermissions: Permission[];
  purpose: string;
  urgency: RequestUrgency;
  context: ConsentContext;
  createdAt: Date;
  expiresAt: Date;
  response?: ConsentResponse;
}

export enum RequestUrgency {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  EMERGENCY = 'emergency'
}

export interface ConsentResponse {
  approved: boolean;
  modifiedPermissions?: Permission[];
  conditions?: PermissionCondition[];
  message?: string;
  respondedAt: Date;
}

// ============================================================================
// CONSENT LEDGER SERVICE
// ============================================================================

export class ConsentLedgerService extends EventEmitter {
  private consentRecords: Map<string, ConsentRecord> = new Map();
  private pendingRequests: Map<string, ConsentRequest> = new Map();
  private auditLog: ConsentAuditEntry[] = [];
  private isInitialized: boolean = false;

  constructor(
    private config: ConsentLedgerConfig,
    private logger: Logger,
    private cryptoService: CryptoService,
    private notificationService: NotificationService,
    private trustService: TrustService
  ) {
    super();
    this.setupEventHandlers();
  }

  // ========================================================================
  // INITIALIZATION & LIFECYCLE
  // ========================================================================

  async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing Consent Ledger Service...');
      
      // Load existing consent records
      await this.loadConsentRecords();
      
      // Start background maintenance
      this.startBackgroundMaintenance();
      
      this.isInitialized = true;
      this.emit('initialized');
      
      this.logger.info('Consent Ledger Service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Consent Ledger Service:', error);
      throw error;
    }
  }

  // ========================================================================
  // CONSENT REQUEST MANAGEMENT
  // ========================================================================

  async requestConsent(
    requestData: Omit<ConsentRequest, 'id' | 'createdAt' | 'expiresAt'>
  ): Promise<ConsentRequest> {
    try {
      // Validate trust level
      const requesterTrust = await this.trustService.getTrustScore(requestData.requesterId);
      if (requesterTrust < requestData.context.trustThreshold) {
        throw new Error('Insufficient trust score for consent request');
      }

      const request: ConsentRequest = {
        ...requestData,
        id: this.generateConsentId(),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)) // 24 hour default expiry
      };

      // Store pending request
      this.pendingRequests.set(request.id, request);

      // Send notification to target user
      await this.notificationService.sendNotification(request.targetId, {
        title: 'Consent Request',
        body: `${request.requesterId} is requesting ${request.purpose}`,
        data: {
          requestId: request.id,
          type: 'consent_request',
          urgency: request.urgency
        }
      });

      // Log audit entry
      await this.addAuditEntry({
        action: AuditAction.CREATED,
        performedBy: request.requesterId,
        changes: { requestId: request.id, purpose: request.purpose }
      });

      this.emit('consentRequested', request);
      this.logger.info(`Consent requested: ${request.id}`);

      return request;
    } catch (error) {
      this.logger.error('Failed to create consent request:', error);
      throw error;
    }
  }

  async respondToConsentRequest(
    requestId: string, 
    response: ConsentResponse,
    responderId: string
  ): Promise<ConsentRecord | null> {
    try {
      const request = this.pendingRequests.get(requestId);
      if (!request) {
        throw new Error(`Consent request ${requestId} not found`);
      }

      // Verify responder is the target
      if (request.targetId !== responderId) {
        throw new Error('Unauthorized to respond to this consent request');
      }

      // Update request with response
      request.response = response;

      if (response.approved) {
        // Create consent record
        const consentRecord = await this.createConsentRecord(request, response);
        
        // Remove from pending
        this.pendingRequests.delete(requestId);
        
        // Notify requester
        await this.notificationService.sendNotification(request.requesterId, {
          title: 'Consent Granted',
          body: `Your consent request has been approved`,
          data: {
            consentId: consentRecord.id,
            type: 'consent_granted'
          }
        });

        this.emit('consentGranted', consentRecord);
        return consentRecord;
      } else {
        // Log rejection
        await this.addAuditEntry({
          action: AuditAction.REJECTED,
          performedBy: responderId,
          changes: { requestId, reason: response.message }
        });

        // Notify requester of rejection
        await this.notificationService.sendNotification(request.requesterId, {
          title: 'Consent Denied',
          body: response.message || 'Your consent request was denied',
          data: {
            requestId,
            type: 'consent_denied'
          }
        });

        this.emit('consentDenied', request, response);
        return null;
      }
    } catch (error) {
      this.logger.error('Failed to respond to consent request:', error);
      throw error;
    }
  }

  // ========================================================================
  // CONSENT RECORD MANAGEMENT
  // ========================================================================

  private async createConsentRecord(
    request: ConsentRequest, 
    response: ConsentResponse
  ): Promise<ConsentRecord> {
    const permissions = response.modifiedPermissions || request.requestedPermissions;
    
    const record: ConsentRecord = {
      id: this.generateConsentId(),
      grantorId: request.targetId,
      granteeId: request.requesterId,
      consentType: this.determineConsentType(permissions),
      permissions,
      status: ConsentStatus.ACTIVE,
      createdAt: new Date(),
      lastModified: new Date(),
      context: request.context,
      auditTrail: [],
      signature: await this.cryptoService.signData({
        grantorId: request.targetId,
        granteeId: request.requesterId,
        permissions,
        timestamp: new Date().toISOString()
      })
    };

    // Set expiration if specified
    if (request.context.duration.type === 'fixed') {
      record.expirationDate = new Date(Date.now() + (request.context.duration.duration! * 60 * 60 * 1000));
    }

    // Store record
    this.consentRecords.set(record.id, record);

    // Add audit entry
    await this.addAuditEntry({
      action: AuditAction.GRANTED,
      performedBy: record.grantorId,
      changes: { consentId: record.id, permissions }
    });

    // Handle reciprocity if required
    if (request.context.reciprocity?.required) {
      await this.handleReciprocityRequirement(record, request.context.reciprocity);
    }

    return record;
  }

  async revokeConsent(consentId: string, revokedBy: string, reason?: string): Promise<void> {
    const record = this.consentRecords.get(consentId);
    if (!record) {
      throw new Error(`Consent record ${consentId} not found`);
    }

    // Verify authorization
    if (record.grantorId !== revokedBy && record.granteeId !== revokedBy) {
      throw new Error('Unauthorized to revoke this consent');
    }

    // Update record
    record.status = ConsentStatus.REVOKED;
    record.revokedAt = new Date();
    record.lastModified = new Date();

    // Add audit entry
    await this.addAuditEntry({
      action: AuditAction.REVOKED,
      performedBy: revokedBy,
      changes: { consentId, reason }
    });

    // Notify other party
    const notifyId = record.grantorId === revokedBy ? record.granteeId : record.grantorId;
    await this.notificationService.sendNotification(notifyId, {
      title: 'Consent Revoked',
      body: `Consent for ${record.consentType} has been revoked`,
      data: {
        consentId,
        type: 'consent_revoked',
        reason
      }
    });

    this.emit('consentRevoked', record, revokedBy, reason);
    this.logger.info(`Consent revoked: ${consentId} by ${revokedBy}`);
  }

  async renewConsent(consentId: string, renewedBy: string): Promise<ConsentRecord> {
    const record = this.consentRecords.get(consentId);
    if (!record) {
      throw new Error(`Consent record ${consentId} not found`);
    }

    // Check if renewal is allowed
    if (record.context.duration.type !== 'renewable') {
      throw new Error('This consent type is not renewable');
    }

    // Verify authorization
    if (record.grantorId !== renewedBy) {
      throw new Error('Only the grantor can renew consent');
    }

    // Renew consent
    if (record.context.duration.duration) {
      record.expirationDate = new Date(Date.now() + (record.context.duration.duration * 60 * 60 * 1000));
    }
    record.status = ConsentStatus.ACTIVE;
    record.lastModified = new Date();

    // Add audit entry
    await this.addAuditEntry({
      action: AuditAction.RENEWED,
      performedBy: renewedBy,
      changes: { consentId, newExpirationDate: record.expirationDate }
    });

    this.emit('consentRenewed', record);
    return record;
  }

  // ========================================================================
  // PERMISSION CHECKING & ACCESS CONTROL
  // ========================================================================

  async checkPermission(
    granteeId: string, 
    grantorId: string, 
    permissionType: PermissionType, 
    scope: PermissionScope,
    context?: any
  ): Promise<PermissionCheckResult> {
    try {
      // Find relevant consent records
      const relevantConsents = Array.from(this.consentRecords.values())
        .filter(record => 
          record.granteeId === granteeId && 
          record.grantorId === grantorId &&
          record.status === ConsentStatus.ACTIVE &&
          this.isConsentValid(record)
        );

      if (relevantConsents.length === 0) {
        return { granted: false, reason: 'No valid consent found' };
      }

      // Check each consent for matching permissions
      for (const consent of relevantConsents) {
        const matchingPermission = consent.permissions.find(permission =>
          permission.type === permissionType && permission.scope === scope
        );

        if (matchingPermission) {
          // Check conditions
          const conditionsResult = await this.evaluateConditions(
            matchingPermission.conditions, 
            context
          );
          
          if (conditionsResult.allowed) {
            // Log access
            await this.addAuditEntry({
              action: AuditAction.ACCESSED,
              performedBy: granteeId,
              changes: { 
                consentId: consent.id, 
                permission: `${permissionType}:${scope}`,
                context 
              }
            });

            return { 
              granted: true, 
              consentId: consent.id,
              permission: matchingPermission 
            };
          } else {
            return { 
              granted: false, 
              reason: conditionsResult.reason 
            };
          }
        }
      }

      return { granted: false, reason: 'No matching permission found' };
    } catch (error) {
      this.logger.error('Permission check failed:', error);
      return { granted: false, reason: 'Permission check error' };
    }
  }

  async checkEmergencyOverride(
    granteeId: string, 
    grantorId: string, 
    emergencyContext: any
  ): Promise<PermissionCheckResult> {
    // Emergency overrides check for any consent with emergency permission
    const emergencyConsents = Array.from(this.consentRecords.values())
      .filter(record => 
        record.granteeId === granteeId && 
        record.grantorId === grantorId &&
        (record.status === ConsentStatus.ACTIVE || record.context.emergencyOverride)
      );

    for (const consent of emergencyConsents) {
      if (consent.context.emergencyOverride) {
        // Log emergency access
        await this.addAuditEntry({
          action: AuditAction.ACCESSED,
          performedBy: granteeId,
          changes: { 
            consentId: consent.id, 
            type: 'emergency_override',
            context: emergencyContext 
          }
        });

        return { 
          granted: true, 
          consentId: consent.id,
          emergencyOverride: true 
        };
      }
    }

    return { granted: false, reason: 'No emergency override permission found' };
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  private async evaluateConditions(
    conditions: PermissionCondition[], 
    context?: any
  ): Promise<{ allowed: boolean; reason?: string }> {
    for (const condition of conditions) {
      const result = await this.evaluateCondition(condition, context);
      if (!result.allowed) {
        return result;
      }
    }
    return { allowed: true };
  }

  private async evaluateCondition(
    condition: PermissionCondition, 
    context?: any
  ): Promise<{ allowed: boolean; reason?: string }> {
    const now = new Date();
    
    switch (condition.type) {
      case ConditionType.TIME_OF_DAY:
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [startHour, startMin] = condition.value.start.split(':').map(Number);
        const [endHour, endMin] = condition.value.end.split(':').map(Number);
        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;
        
        const timeAllowed = currentTime >= startTime && currentTime <= endTime;
        return {
          allowed: condition.operator === ConditionOperator.IN_RANGE ? timeAllowed : !timeAllowed,
          reason: timeAllowed ? undefined : 'Outside allowed time window'
        };

      case ConditionType.TRUST_SCORE:
        const trustScore = await this.trustService.getTrustScore(context?.requesterId);
        const trustAllowed = this.compareValues(trustScore, condition.value, condition.operator);
        return {
          allowed: trustAllowed,
          reason: trustAllowed ? undefined : 'Insufficient trust score'
        };

      case ConditionType.EMERGENCY_STATUS:
        const isEmergency = context?.emergencyStatus === true;
        return {
          allowed: condition.operator === ConditionOperator.EQUALS ? isEmergency === condition.value : isEmergency !== condition.value,
          reason: 'Emergency status condition not met'
        };

      default:
        return { allowed: true }; // Unknown conditions are ignored
    }
  }

  private compareValues(actual: any, expected: any, operator: ConditionOperator): boolean {
    switch (operator) {
      case ConditionOperator.EQUALS:
        return actual === expected;
      case ConditionOperator.NOT_EQUALS:
        return actual !== expected;
      case ConditionOperator.GREATER_THAN:
        return actual > expected;
      case ConditionOperator.LESS_THAN:
        return actual < expected;
      case ConditionOperator.IN_RANGE:
        return actual >= expected.min && actual <= expected.max;
      default:
        return false;
    }
  }

  private isConsentValid(record: ConsentRecord): boolean {
    // Check expiration
    if (record.expirationDate && record.expirationDate < new Date()) {
      return false;
    }

    // Check status
    return record.status === ConsentStatus.ACTIVE;
  }

  private determineConsentType(permissions: Permission[]): ConsentType {
    // Determine consent type based on permissions
    if (permissions.some(p => p.scope === PermissionScope.LOCATION)) {
      return ConsentType.LOCATION_TRACKING;
    }
    if (permissions.some(p => p.type === PermissionType.MONITOR)) {
      return ConsentType.MONITORING;
    }
    return ConsentType.DATA_SHARING;
  }

  private async handleReciprocityRequirement(
    record: ConsentRecord, 
    reciprocity: ReciprocityRequirement
  ): Promise<void> {
    // Create reciprocal consent request
    const reciprocalRequest: Omit<ConsentRequest, 'id' | 'createdAt' | 'expiresAt'> = {
      requesterId: record.grantorId,
      targetId: record.granteeId,
      requestedPermissions: reciprocity.reciprocalPermissions,
      purpose: `Reciprocal consent for ${record.consentType}`,
      urgency: RequestUrgency.NORMAL,
      context: {
        ...record.context,
        purpose: `Reciprocal agreement for ${record.context.purpose}`
      }
    };

    await this.requestConsent(reciprocalRequest);
  }

  private async addAuditEntry(entry: Omit<ConsentAuditEntry, 'id' | 'timestamp'>): Promise<void> {
    const auditEntry: ConsentAuditEntry = {
      ...entry,
      id: this.generateAuditId(),
      timestamp: new Date()
    };

    this.auditLog.push(auditEntry);
    
    // Keep audit log size manageable
    if (this.auditLog.length > this.config.maxAuditEntries) {
      this.auditLog = this.auditLog.slice(-this.config.maxAuditEntries);
    }

    this.emit('auditEntry', auditEntry);
  }

  private setupEventHandlers(): void {
    // Handle trust score updates
    this.trustService.on('trustScoreUpdated', async (userId: string, newScore: number) => {
      await this.evaluateConsentContinuation(userId, newScore);
    });
  }

  private async evaluateConsentContinuation(userId: string, trustScore: number): Promise<void> {
    // Check if any consents should be suspended due to trust score changes
    for (const [id, record] of this.consentRecords.entries()) {
      if ((record.granteeId === userId || record.grantorId === userId) &&
          record.status === ConsentStatus.ACTIVE &&
          trustScore < record.context.trustThreshold) {
        
        record.status = ConsentStatus.SUSPENDED;
        
        await this.addAuditEntry({
          action: AuditAction.SUSPENDED,
          performedBy: 'system',
          changes: { consentId: id, reason: 'Trust score below threshold', trustScore }
        });

        this.emit('consentSuspended', record, 'trust_score_low');
      }
    }
  }

  private startBackgroundMaintenance(): void {
    // Check for expired consents every hour
    setInterval(() => {
      this.processExpiredConsents();
    }, 60 * 60 * 1000);

    // Clean up old audit entries daily
    setInterval(() => {
      this.cleanupAuditLog();
    }, 24 * 60 * 60 * 1000);
  }

  private processExpiredConsents(): void {
    const now = new Date();
    
    for (const [id, record] of this.consentRecords.entries()) {
      if (record.expirationDate && record.expirationDate < now && record.status === ConsentStatus.ACTIVE) {
        record.status = ConsentStatus.EXPIRED;
        
        this.addAuditEntry({
          action: AuditAction.EXPIRED,
          performedBy: 'system',
          changes: { consentId: id, expiredAt: now }
        });

        this.emit('consentExpired', record);
      }
    }
  }

  private cleanupAuditLog(): void {
    const cutoffDate = new Date(Date.now() - (this.config.auditRetentionDays * 24 * 60 * 60 * 1000));
    this.auditLog = this.auditLog.filter(entry => entry.timestamp > cutoffDate);
  }

  private async loadConsentRecords(): Promise<void> {
    // Load from persistent storage
    // Implementation depends on storage mechanism
  }

  private generateConsentId(): string {
    return `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateAuditId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ========================================================================
  // PUBLIC API METHODS
  // ========================================================================

  getConsentRecord(consentId: string): ConsentRecord | undefined {
    return this.consentRecords.get(consentId);
  }

  getConsentsByGrantor(grantorId: string): ConsentRecord[] {
    return Array.from(this.consentRecords.values())
      .filter(record => record.grantorId === grantorId);
  }

  getConsentsByGrantee(granteeId: string): ConsentRecord[] {
    return Array.from(this.consentRecords.values())
      .filter(record => record.granteeId === granteeId);
  }

  getPendingRequests(targetId?: string): ConsentRequest[] {
    const requests = Array.from(this.pendingRequests.values());
    return targetId ? requests.filter(r => r.targetId === targetId) : requests;
  }

  getAuditLog(consentId?: string): ConsentAuditEntry[] {
    return consentId 
      ? this.auditLog.filter(entry => entry.changes?.consentId === consentId)
      : this.auditLog;
  }
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

export interface ConsentLedgerConfig {
  maxAuditEntries: number;
  auditRetentionDays: number;
  defaultConsentDuration: number; // hours
  emergencyOverrideEnabled: boolean;
  reciprocityRequired: boolean;
}

export interface PermissionCheckResult {
  granted: boolean;
  consentId?: string;
  permission?: Permission;
  emergencyOverride?: boolean;
  reason?: string;
}

export interface CryptoService {
  signData(data: any): Promise<string>;
  verifySignature(data: any, signature: string): Promise<boolean>;
}

export interface NotificationService {
  sendNotification(recipientId: string, notification: {
    title: string;
    body: string;
    data?: any;
  }): Promise<void>;
}

export interface TrustService {
  getTrustScore(userId: string): Promise<number>;
  on(event: string, listener: (...args: any[]) => void): void;
}

export interface Logger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, error?: any): void;
}

export default ConsentLedgerService;