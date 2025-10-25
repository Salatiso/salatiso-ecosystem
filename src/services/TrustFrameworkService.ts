// Trust Framework API - Ubuntu-based Reputation System
// Part of Phase 3: Sonny Core Platform Integration
// Mlandeli-Notemba Investments Ecosystem

import { EventEmitter } from 'events';

// ============================================================================
// TRUST FRAMEWORK INTERFACES & TYPES
// ============================================================================

export interface TrustProfile {
  userId: string;
  displayName: string;
  ubuntuScore: number;        // Overall Ubuntu philosophy alignment (0-100)
  trustTier: TrustTier;       // Derived trust classification
  contextScores: Map<TrustContext, number>; // Context-specific trust scores
  interactions: TrustInteraction[];
  badges: TrustBadge[];
  createdAt: Date;
  lastUpdated: Date;
  verificationStatus: VerificationStatus;
}

export enum TrustTier {
  UNKNOWN = 'unknown',        // 0-20: New user, no interaction history
  EMERGING = 'emerging',      // 21-40: Limited positive interactions
  DEVELOPING = 'developing',  // 41-60: Consistent positive behavior
  ESTABLISHED = 'established', // 61-80: High trust, good reputation
  EXEMPLARY = 'exemplary'     // 81-100: Ubuntu philosophy leader
}

export enum TrustContext {
  FAMILY_COORDINATION = 'family_coordination',     // Family activity coordination
  SAFETY_MONITORING = 'safety_monitoring',        // Safety check-ins and monitoring
  BUSINESS_COLLABORATION = 'business_collaboration', // Professional interactions
  COMMUNITY_PARTICIPATION = 'community_participation', // Community involvement
  EMERGENCY_RESPONSE = 'emergency_response',       // Emergency assistance
  RESOURCE_SHARING = 'resource_sharing',           // Sharing resources/help
  MENTORSHIP = 'mentorship',                       // Teaching/guiding others
  CULTURAL_PRESERVATION = 'cultural_preservation', // Ubuntu values preservation
  RECIPROCAL_EXCHANGE = 'reciprocal_exchange',     // Mutual benefit activities
  CONFLICT_RESOLUTION = 'conflict_resolution'      // Mediating disputes
}

export interface TrustInteraction {
  id: string;
  participantIds: string[];   // All parties involved
  interactionType: InteractionType;
  context: TrustContext;
  outcome: InteractionOutcome;
  ratings: ParticipantRating[];
  reciprocityBalance: number; // -100 to 100 (negative = took more than gave)
  ubuntuAlignment: number;    // How well this embodied Ubuntu principles
  timestamp: Date;
  location?: LocationInfo;
  verifiedBy?: string[];      // Other users who can verify this interaction
  proofElements: ProofElement[];
}

export enum InteractionType {
  FAMILY_ACTIVITY = 'family_activity',
  SAFETY_CHECKIN = 'safety_checkin',
  EMERGENCY_RESPONSE = 'emergency_response',
  BUSINESS_MEETING = 'business_meeting',
  RESOURCE_EXCHANGE = 'resource_exchange',
  MENTORSHIP_SESSION = 'mentorship_session',
  COMMUNITY_SERVICE = 'community_service',
  CULTURAL_EVENT = 'cultural_event',
  CONFLICT_MEDIATION = 'conflict_mediation',
  KNOWLEDGE_SHARING = 'knowledge_sharing'
}

export enum InteractionOutcome {
  MUTUALLY_BENEFICIAL = 'mutually_beneficial',
  PARTIALLY_SUCCESSFUL = 'partially_successful',
  NEUTRAL = 'neutral',
  DISAPPOINTING = 'disappointing',
  HARMFUL = 'harmful'
}

export interface ParticipantRating {
  raterId: string;
  subjectId: string;
  scores: ContextualScore[];
  ubuntuQualities: UbuntuQualityRating[];
  reciprocityScore: number;   // -5 to +5 scale
  comments?: string;
  timestamp: Date;
}

export interface ContextualScore {
  context: TrustContext;
  score: number;             // 1-5 scale
  weight: number;            // Importance weight for this context
}

export interface UbuntuQualityRating {
  quality: UbuntuQuality;
  demonstrated: boolean;
  strength: number;          // 1-5 scale if demonstrated
  examples?: string;
}

export enum UbuntuQuality {
  INTERCONNECTEDNESS = 'interconnectedness',  // "I am because we are"
  COMPASSION = 'compassion',                  // Caring for others
  RECIPROCITY = 'reciprocity',                // Mutual exchange
  RESPECT = 'respect',                        // Honoring others
  RESPONSIBILITY = 'responsibility',           // Accountability to community
  HUMILITY = 'humility',                      // Learning from others
  GENEROSITY = 'generosity',                  // Sharing resources
  WISDOM = 'wisdom',                          // Sound judgment
  HARMONY = 'harmony',                        // Building peace
  AUTHENTICITY = 'authenticity'               // Being genuine
}

export interface TrustBadge {
  id: string;
  name: string;
  description: string;
  criteria: BadgeCriteria;
  earnedAt: Date;
  verifiedBy?: string[];
  context: TrustContext;
  ubuntuQualities: UbuntuQuality[];
}

export interface BadgeCriteria {
  minInteractions: number;
  minScore: number;
  requiredContexts: TrustContext[];
  requiredQualities: UbuntuQuality[];
  timeframe?: number;        // Days within which criteria must be met
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  SELF_VERIFIED = 'self_verified',
  FAMILY_VERIFIED = 'family_verified',
  COMMUNITY_VERIFIED = 'community_verified',
  SYSTEM_VERIFIED = 'system_verified'
}

export interface ProofElement {
  type: ProofType;
  data: any;
  verificationHash: string;
  timestamp: Date;
}

export enum ProofType {
  LOCATION_PROOF = 'location_proof',
  TIME_PROOF = 'time_proof',
  PHOTO_EVIDENCE = 'photo_evidence',
  VOICE_RECORDING = 'voice_recording',
  DOCUMENT_SCAN = 'document_scan',
  WITNESS_TESTIMONY = 'witness_testimony',
  SYSTEM_LOG = 'system_log'
}

export interface LocationInfo {
  latitude: number;
  longitude: number;
  accuracy: number;
  what3words?: string;
  timestamp: Date;
}

// ============================================================================
// TRUST FRAMEWORK SERVICE
// ============================================================================

export class TrustFrameworkService extends EventEmitter {
  private trustProfiles: Map<string, TrustProfile> = new Map();
  private interactions: Map<string, TrustInteraction> = new Map();
  private badges: Map<string, TrustBadge[]> = new Map();
  private isInitialized: boolean = false;

  constructor(
    private config: TrustFrameworkConfig,
    private logger: Logger,
    private cryptoService: CryptoService,
    private notificationService: NotificationService
  ) {
    super();
  }

  // ========================================================================
  // INITIALIZATION & LIFECYCLE
  // ========================================================================

  async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing Trust Framework Service...');
      
      // Load existing trust profiles and interactions
      await this.loadTrustData();
      
      // Start background processing
      this.startBackgroundProcessing();
      
      this.isInitialized = true;
      this.emit('initialized');
      
      this.logger.info('Trust Framework Service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Trust Framework Service:', error);
      throw error;
    }
  }

  // ========================================================================
  // TRUST PROFILE MANAGEMENT
  // ========================================================================

  async createTrustProfile(userId: string, displayName: string): Promise<TrustProfile> {
    if (this.trustProfiles.has(userId)) {
      throw new Error(`Trust profile already exists for user ${userId}`);
    }

    const profile: TrustProfile = {
      userId,
      displayName,
      ubuntuScore: 50, // Start with neutral Ubuntu score
      trustTier: TrustTier.UNKNOWN,
      contextScores: new Map(),
      interactions: [],
      badges: [],
      createdAt: new Date(),
      lastUpdated: new Date(),
      verificationStatus: VerificationStatus.UNVERIFIED
    };

    // Initialize context scores
    for (const context of Object.values(TrustContext)) {
      profile.contextScores.set(context, 50); // Neutral starting scores
    }

    this.trustProfiles.set(userId, profile);

    this.emit('trustProfileCreated', profile);
    this.logger.info(`Trust profile created for user ${userId}`);

    return profile;
  }

  async getTrustProfile(userId: string): Promise<TrustProfile | undefined> {
    return this.trustProfiles.get(userId);
  }

  async updateVerificationStatus(
    userId: string, 
    status: VerificationStatus, 
    verifiedBy?: string
  ): Promise<void> {
    const profile = this.trustProfiles.get(userId);
    if (!profile) {
      throw new Error(`Trust profile not found for user ${userId}`);
    }

    profile.verificationStatus = status;
    profile.lastUpdated = new Date();

    this.emit('verificationStatusUpdated', userId, status, verifiedBy);
  }

  // ========================================================================
  // INTERACTION RECORDING & RATING
  // ========================================================================

  async recordInteraction(interactionData: Omit<TrustInteraction, 'id'>): Promise<TrustInteraction> {
    const interaction: TrustInteraction = {
      ...interactionData,
      id: this.generateInteractionId()
    };

    // Validate participants exist
    for (const participantId of interaction.participantIds) {
      if (!this.trustProfiles.has(participantId)) {
        await this.createTrustProfile(participantId, `User ${participantId}`);
      }
    }

    // Store interaction
    this.interactions.set(interaction.id, interaction);

    // Update participant profiles
    for (const participantId of interaction.participantIds) {
      const profile = this.trustProfiles.get(participantId)!;
      profile.interactions.push(interaction);
      profile.lastUpdated = new Date();
    }

    this.emit('interactionRecorded', interaction);
    this.logger.info(`Interaction recorded: ${interaction.id}`);

    return interaction;
  }

  async submitRating(
    interactionId: string, 
    rating: Omit<ParticipantRating, 'timestamp'>
  ): Promise<void> {
    const interaction = this.interactions.get(interactionId);
    if (!interaction) {
      throw new Error(`Interaction ${interactionId} not found`);
    }

    // Verify rater is participant
    if (!interaction.participantIds.includes(rating.raterId)) {
      throw new Error('Only interaction participants can submit ratings');
    }

    // Add timestamp
    const completeRating: ParticipantRating = {
      ...rating,
      timestamp: new Date()
    };

    // Add rating to interaction
    interaction.ratings.push(completeRating);

    // Recalculate trust scores for all participants
    await this.recalculateTrustScores(interaction.participantIds);

    this.emit('ratingSubmitted', interactionId, completeRating);
  }

  // ========================================================================
  // TRUST SCORE CALCULATION
  // ========================================================================

  private async recalculateTrustScores(userIds: string[]): Promise<void> {
    for (const userId of userIds) {
      const profile = this.trustProfiles.get(userId);
      if (!profile) continue;

      // Calculate new Ubuntu score
      profile.ubuntuScore = await this.calculateUbuntuScore(profile);

      // Calculate context-specific scores
      for (const context of Object.values(TrustContext)) {
        const contextScore = await this.calculateContextScore(profile, context);
        profile.contextScores.set(context, contextScore);
      }

      // Update trust tier
      profile.trustTier = this.determineTrustTier(profile.ubuntuScore);

      // Check for new badges
      await this.checkForNewBadges(profile);

      profile.lastUpdated = new Date();

      this.emit('trustScoreUpdated', userId, profile.ubuntuScore);
    }
  }

  private async calculateUbuntuScore(profile: TrustProfile): Promise<number> {
    const interactions = profile.interactions;
    if (interactions.length === 0) return 50; // Neutral starting score

    let totalScore = 0;
    let totalWeight = 0;

    for (const interaction of interactions) {
      // Get ratings for this user in this interaction
      const ratingsForUser = interaction.ratings.filter(r => r.subjectId === profile.userId);
      
      if (ratingsForUser.length === 0) continue;

      // Calculate Ubuntu qualities score for this interaction
      const ubuntuScore = this.calculateInteractionUbuntuScore(ratingsForUser);
      
      // Weight by interaction recency and type
      const ageWeight = this.calculateAgeWeight(interaction.timestamp);
      const typeWeight = this.getInteractionTypeWeight(interaction.interactionType);
      const weight = ageWeight * typeWeight;

      totalScore += ubuntuScore * weight;
      totalWeight += weight;
    }

    const rawScore = totalWeight > 0 ? totalScore / totalWeight : 50;
    
    // Apply verification bonus
    const verificationBonus = this.getVerificationBonus(profile.verificationStatus);
    
    // Apply reciprocity adjustment
    const reciprocityAdjustment = await this.calculateReciprocityAdjustment(profile);
    
    const finalScore = Math.max(0, Math.min(100, rawScore + verificationBonus + reciprocityAdjustment));
    
    return Math.round(finalScore);
  }

  private calculateInteractionUbuntuScore(ratings: ParticipantRating[]): number {
    let totalQualityScore = 0;
    let qualityCount = 0;

    for (const rating of ratings) {
      for (const qualityRating of rating.ubuntuQualities) {
        if (qualityRating.demonstrated) {
          totalQualityScore += qualityRating.strength;
          qualityCount++;
        }
      }
    }

    if (qualityCount === 0) return 50; // Neutral if no qualities rated

    // Convert 1-5 scale to 0-100 scale
    const averageQualityScore = totalQualityScore / qualityCount;
    return (averageQualityScore - 1) * 25; // Maps 1-5 to 0-100
  }

  private async calculateContextScore(profile: TrustProfile, context: TrustContext): Promise<number> {
    const contextInteractions = profile.interactions.filter(i => i.context === context);
    
    if (contextInteractions.length === 0) return 50;

    let totalScore = 0;
    let totalWeight = 0;

    for (const interaction of contextInteractions) {
      const ratingsForUser = interaction.ratings.filter(r => r.subjectId === profile.userId);
      
      for (const rating of ratingsForUser) {
        const contextScore = rating.scores.find(s => s.context === context);
        if (contextScore) {
          const weight = this.calculateAgeWeight(interaction.timestamp) * contextScore.weight;
          totalScore += (contextScore.score - 1) * 25 * weight; // Convert 1-5 to 0-100
          totalWeight += weight;
        }
      }
    }

    return totalWeight > 0 ? totalScore / totalWeight : 50;
  }

  private determineTrustTier(ubuntuScore: number): TrustTier {
    if (ubuntuScore >= 81) return TrustTier.EXEMPLARY;
    if (ubuntuScore >= 61) return TrustTier.ESTABLISHED;
    if (ubuntuScore >= 41) return TrustTier.DEVELOPING;
    if (ubuntuScore >= 21) return TrustTier.EMERGING;
    return TrustTier.UNKNOWN;
  }

  private calculateAgeWeight(timestamp: Date): number {
    const ageInDays = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60 * 24);
    
    // Exponential decay: recent interactions weight more
    return Math.exp(-ageInDays / this.config.scoreDecayDays);
  }

  private getInteractionTypeWeight(type: InteractionType): number {
    const weights = {
      [InteractionType.EMERGENCY_RESPONSE]: 2.0,
      [InteractionType.COMMUNITY_SERVICE]: 1.8,
      [InteractionType.MENTORSHIP_SESSION]: 1.6,
      [InteractionType.CONFLICT_MEDIATION]: 1.5,
      [InteractionType.CULTURAL_EVENT]: 1.3,
      [InteractionType.RESOURCE_EXCHANGE]: 1.2,
      [InteractionType.FAMILY_ACTIVITY]: 1.1,
      [InteractionType.BUSINESS_MEETING]: 1.0,
      [InteractionType.SAFETY_CHECKIN]: 0.8,
      [InteractionType.KNOWLEDGE_SHARING]: 1.4
    };

    return weights[type] || 1.0;
  }

  private getVerificationBonus(status: VerificationStatus): number {
    const bonuses = {
      [VerificationStatus.UNVERIFIED]: 0,
      [VerificationStatus.SELF_VERIFIED]: 2,
      [VerificationStatus.FAMILY_VERIFIED]: 5,
      [VerificationStatus.COMMUNITY_VERIFIED]: 8,
      [VerificationStatus.SYSTEM_VERIFIED]: 10
    };

    return bonuses[status] || 0;
  }

  private async calculateReciprocityAdjustment(profile: TrustProfile): Promise<number> {
    const interactions = profile.interactions;
    if (interactions.length === 0) return 0;

    let totalReciprocityBalance = 0;
    let interactionCount = 0;

    for (const interaction of interactions) {
      const ratingsForUser = interaction.ratings.filter(r => r.subjectId === profile.userId);
      
      for (const rating of ratingsForUser) {
        totalReciprocityBalance += rating.reciprocityScore;
        interactionCount++;
      }
    }

    if (interactionCount === 0) return 0;

    const averageReciprocity = totalReciprocityBalance / interactionCount;
    
    // Convert -5 to +5 scale to -10 to +10 adjustment
    return averageReciprocity * 2;
  }

  // ========================================================================
  // BADGE SYSTEM
  // ========================================================================

  private async checkForNewBadges(profile: TrustProfile): Promise<void> {
    const currentBadges = this.badges.get(profile.userId) || [];
    const currentBadgeNames = new Set(currentBadges.map(b => b.name));

    for (const badgeDefinition of this.config.availableBadges) {
      if (currentBadgeNames.has(badgeDefinition.name)) continue;

      if (await this.meetsBadgeCriteria(profile, badgeDefinition.criteria)) {
        const badge: TrustBadge = {
          id: this.generateBadgeId(),
          name: badgeDefinition.name,
          description: badgeDefinition.description,
          criteria: badgeDefinition.criteria,
          earnedAt: new Date(),
          context: badgeDefinition.context,
          ubuntuQualities: badgeDefinition.ubuntuQualities
        };

        currentBadges.push(badge);
        this.badges.set(profile.userId, currentBadges);
        profile.badges.push(badge);

        await this.notificationService.sendNotification(profile.userId, {
          title: 'New Badge Earned!',
          body: `You've earned the "${badge.name}" badge for demonstrating Ubuntu values`,
          data: {
            badgeId: badge.id,
            type: 'badge_earned'
          }
        });

        this.emit('badgeEarned', profile.userId, badge);
      }
    }
  }

  private async meetsBadgeCriteria(profile: TrustProfile, criteria: BadgeCriteria): Promise<boolean> {
    // Check minimum interactions
    if (profile.interactions.length < criteria.minInteractions) {
      return false;
    }

    // Check minimum score
    if (profile.ubuntuScore < criteria.minScore) {
      return false;
    }

    // Check required contexts
    for (const requiredContext of criteria.requiredContexts) {
      const contextScore = profile.contextScores.get(requiredContext) || 0;
      if (contextScore < criteria.minScore) {
        return false;
      }
    }

    // Check required Ubuntu qualities
    const demonstratedQualities = this.getHabituallDemonstratedQualities(profile);
    for (const requiredQuality of criteria.requiredQualities) {
      if (!demonstratedQualities.has(requiredQuality)) {
        return false;
      }
    }

    // Check timeframe if specified
    if (criteria.timeframe) {
      const cutoffDate = new Date(Date.now() - (criteria.timeframe * 24 * 60 * 60 * 1000));
      const recentInteractions = profile.interactions.filter(i => i.timestamp >= cutoffDate);
      
      if (recentInteractions.length < criteria.minInteractions) {
        return false;
      }
    }

    return true;
  }

  private getHabituallDemonstratedQualities(profile: TrustProfile): Set<UbuntuQuality> {
    const qualityDemonstrations = new Map<UbuntuQuality, number>();
    
    for (const interaction of profile.interactions) {
      const ratingsForUser = interaction.ratings.filter(r => r.subjectId === profile.userId);
      
      for (const rating of ratingsForUser) {
        for (const qualityRating of rating.ubuntuQualities) {
          if (qualityRating.demonstrated) {
            const current = qualityDemonstrations.get(qualityRating.quality) || 0;
            qualityDemonstrations.set(qualityRating.quality, current + 1);
          }
        }
      }
    }

    // Consider a quality "habitually demonstrated" if shown in >50% of interactions
    const threshold = Math.max(1, Math.floor(profile.interactions.length * 0.5));
    const habitualQualities = new Set<UbuntuQuality>();

    qualityDemonstrations.forEach((count, quality) => {
      if (count >= threshold) {
        habitualQualities.add(quality);
      }
    });

    return habitualQualities;
  }

  // ========================================================================
  // PUBLIC API METHODS
  // ========================================================================

  async getTrustScore(userId: string): Promise<number> {
    const profile = this.trustProfiles.get(userId);
    return profile ? profile.ubuntuScore : 0;
  }

  async getContextTrustScore(userId: string, context: TrustContext): Promise<number> {
    const profile = this.trustProfiles.get(userId);
    if (!profile) return 0;
    
    return profile.contextScores.get(context) || 0;
  }

  async getTrustTier(userId: string): Promise<TrustTier> {
    const profile = this.trustProfiles.get(userId);
    return profile ? profile.trustTier : TrustTier.UNKNOWN;
  }

  async getUserBadges(userId: string): Promise<TrustBadge[]> {
    return this.badges.get(userId) || [];
  }

  async getInteractionHistory(userId: string, limit?: number): Promise<TrustInteraction[]> {
    const profile = this.trustProfiles.get(userId);
    if (!profile) return [];

    const sortedInteractions = profile.interactions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return limit ? sortedInteractions.slice(0, limit) : sortedInteractions;
  }

  async searchTrustProfiles(criteria: {
    minScore?: number;
    trustTier?: TrustTier;
    context?: TrustContext;
    verificationStatus?: VerificationStatus;
    location?: { latitude: number; longitude: number; radius: number };
  }): Promise<TrustProfile[]> {
    const results: TrustProfile[] = [];

    this.trustProfiles.forEach((profile) => {
      if (criteria.minScore && profile.ubuntuScore < criteria.minScore) return;
      if (criteria.trustTier && profile.trustTier !== criteria.trustTier) return;
      if (criteria.verificationStatus && profile.verificationStatus !== criteria.verificationStatus) return;
      
      if (criteria.context) {
        const contextScore = profile.contextScores.get(criteria.context) || 0;
        if (contextScore < (criteria.minScore || 60)) return;
      }

      // Location filtering would require additional location data
      // Implementation depends on how location data is stored

      results.push(profile);
    });

    return results.sort((a, b) => b.ubuntuScore - a.ubuntuScore);
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  private startBackgroundProcessing(): void {
    // Periodic trust score recalculation
    setInterval(() => {
      this.performMaintenanceTasks();
    }, this.config.maintenanceInterval);
  }

  private async performMaintenanceTasks(): Promise<void> {
    // Recalculate scores for profiles that need updating
    const staleProfiles = Array.from(this.trustProfiles.values())
      .filter(profile => {
        const hoursSinceUpdate = (Date.now() - profile.lastUpdated.getTime()) / (1000 * 60 * 60);
        return hoursSinceUpdate > 24; // Update daily
      });

    for (const profile of staleProfiles) {
      await this.recalculateTrustScores([profile.userId]);
    }
  }

  private async loadTrustData(): Promise<void> {
    // Load from persistent storage
    // Implementation depends on storage mechanism
  }

  private generateInteractionId(): string {
    return `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateBadgeId(): string {
    return `badge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

export interface TrustFrameworkConfig {
  scoreDecayDays: number;
  maintenanceInterval: number; // milliseconds
  availableBadges: BadgeDefinition[];
}

export interface BadgeDefinition {
  name: string;
  description: string;
  criteria: BadgeCriteria;
  context: TrustContext;
  ubuntuQualities: UbuntuQuality[];
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

export interface Logger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, error?: any): void;
}

export default TrustFrameworkService;