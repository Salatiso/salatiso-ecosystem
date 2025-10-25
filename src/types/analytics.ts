/**
 * Analytics Data Types
 * 
 * Comprehensive analytics data structures for tracking:
 * - Family participation and engagement
 * - Collaboration quality metrics
 * - Ubuntu alignment scores
 * - Business impact measurements
 * - Template usage patterns
 * - Video conference effectiveness
 * 
 * @module AnalyticsTypes
 */

/**
 * Time period for analytics queries
 */
export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all';

/**
 * Metric trend direction
 */
export type TrendDirection = 'up' | 'down' | 'stable';

/**
 * Participation metrics - measure family engagement
 */
export interface ParticipationMetrics {
  /** Total active members in period */
  activeMemberCount: number;
  /** Participation rate (active / total members) */
  participationRate: number;
  /** Average sessions per member */
  avgSessionsPerMember: number;
  /** Total time spent (minutes) */
  totalTimeSpent: number;
  /** Average session duration (minutes) */
  avgSessionDuration: number;
  /** Most active member */
  mostActiveMember: {
    userId: string;
    name: string;
    sessionCount: number;
  };
  /** Trend compared to previous period */
  trend: TrendDirection;
  /** Percentage change from previous period */
  changePercentage: number;
}

/**
 * Collaboration quality metrics - measure effectiveness
 */
export interface CollaborationMetrics {
  /** Number of collaborative sessions */
  collaborativeSessionCount: number;
  /** Number of templates worked on together */
  templatesCollaborated: number;
  /** Average collaborators per session */
  avgCollaboratorsPerSession: number;
  /** Video calls conducted */
  videoCallCount: number;
  /** Co-editing sessions */
  coEditingSessionCount: number;
  /** Average edits per user in collaborative sessions */
  avgEditsPerUser: number;
  /** Consensus score (0-100) */
  consensusScore: number;
  /** Elder participation rate in decisions */
  elderParticipationRate: number;
  /** Trend */
  trend: TrendDirection;
  /** Change percentage */
  changePercentage: number;
}

/**
 * Ubuntu alignment metrics - measure cultural values
 */
export interface UbuntuMetrics {
  /** Overall Ubuntu alignment score (0-100) */
  overallScore: number;
  /** Respect score - honoring elders, consent practices */
  respectScore: number;
  /** Community score - collective decision-making */
  communityScore: number;
  /** Sharing score - knowledge and resource sharing */
  sharingScore: number;
  /** Harmony score - conflict resolution, consensus */
  harmonyScore: number;
  /** Leadership score - elder guidance, mentorship */
  leadershipScore: number;
  /** Specific Ubuntu practices observed */
  practices: {
    elderConsultationRate: number;
    consensusDecisionRate: number;
    knowledgeSharingInstances: number;
    mentorshipSessions: number;
  };
  /** Trend */
  trend: TrendDirection;
  /** Change percentage */
  changePercentage: number;
}

/**
 * Business impact metrics - measure economic outcomes
 */
export interface BusinessImpactMetrics {
  /** Templates completed */
  templatesCompleted: number;
  /** Business plans created */
  businessPlansCreated: number;
  /** Financial documents prepared */
  financialDocumentsCount: number;
  /** Estimated economic value generated ($) */
  estimatedEconomicValue: number;
  /** Time saved vs traditional methods (hours) */
  timeSaved: number;
  /** Businesses started */
  businessesStarted: number;
  /** Jobs created */
  jobsCreated: number;
  /** Revenue generated ($) */
  revenueGenerated: number;
  /** Success rate (businesses still operating) */
  successRate: number;
  /** Trend */
  trend: TrendDirection;
  /** Change percentage */
  changePercentage: number;
}

/**
 * Template usage analytics
 */
export interface TemplateUsageMetrics {
  /** Most used template */
  mostUsedTemplate: {
    templateId: string;
    name: string;
    usageCount: number;
    category: string;
  };
  /** Template completion rates by category */
  completionRatesByCategory: {
    category: string;
    completionRate: number;
    avgTimeToComplete: number; // minutes
  }[];
  /** Template effectiveness scores */
  templateEffectiveness: {
    templateId: string;
    name: string;
    effectivenessScore: number; // 0-100
    userRating: number; // 0-5
  }[];
  /** Usage by time of day */
  usageByHour: { hour: number; count: number }[];
}

/**
 * Video conference analytics
 */
export interface VideoConferenceMetrics {
  /** Total video calls */
  totalCalls: number;
  /** Total duration (minutes) */
  totalDuration: number;
  /** Average call duration (minutes) */
  avgCallDuration: number;
  /** Average participants per call */
  avgParticipants: number;
  /** Recording consent rate */
  recordingConsentRate: number;
  /** Screen sharing usage */
  screenSharingUsage: number;
  /** Call quality score (0-100) */
  callQualityScore: number;
  /** Most common call purpose */
  commonPurposes: { purpose: string; count: number }[];
}

/**
 * AI recommendation analytics
 */
export interface AIRecommendationMetrics {
  /** Total recommendations generated */
  totalRecommendations: number;
  /** Acceptance rate */
  acceptanceRate: number;
  /** Average relevance score */
  avgRelevanceScore: number;
  /** Most recommended templates */
  topRecommendations: {
    templateId: string;
    name: string;
    recommendationCount: number;
    acceptanceRate: number;
  }[];
  /** User satisfaction with recommendations */
  userSatisfaction: number; // 0-5
}

/**
 * Time series data point
 */
export interface TimeSeriesDataPoint {
  /** Timestamp */
  timestamp: Date;
  /** Metric value */
  value: number;
  /** Label for display */
  label: string;
}

/**
 * Comprehensive analytics dashboard data
 */
export interface AnalyticsDashboardData {
  /** Family ID */
  familyId: string;
  /** Time period */
  period: TimePeriod;
  /** Start date of period */
  startDate: Date;
  /** End date of period */
  endDate: Date;
  /** Participation metrics */
  participation: ParticipationMetrics;
  /** Collaboration metrics */
  collaboration: CollaborationMetrics;
  /** Ubuntu alignment metrics */
  ubuntu: UbuntuMetrics;
  /** Business impact metrics */
  businessImpact: BusinessImpactMetrics;
  /** Template usage metrics */
  templateUsage: TemplateUsageMetrics;
  /** Video conference metrics */
  videoConference: VideoConferenceMetrics;
  /** AI recommendation metrics */
  aiRecommendations: AIRecommendationMetrics;
  /** Time series data for trending */
  timeSeries: {
    participation: TimeSeriesDataPoint[];
    collaboration: TimeSeriesDataPoint[];
    ubuntu: TimeSeriesDataPoint[];
    businessImpact: TimeSeriesDataPoint[];
  };
  /** Generated at timestamp */
  generatedAt: Date;
}

/**
 * Family member activity record
 */
export interface MemberActivity {
  /** User ID */
  userId: string;
  /** User name */
  userName: string;
  /** User role */
  userRole: 'elder' | 'member' | 'guest';
  /** Total sessions */
  sessionCount: number;
  /** Total time spent (minutes) */
  totalTime: number;
  /** Templates viewed */
  templatesViewed: number;
  /** Templates completed */
  templatesCompleted: number;
  /** Video calls participated */
  videoCallsJoined: number;
  /** Co-editing sessions */
  coEditingSessions: number;
  /** AI recommendations accepted */
  recommendationsAccepted: number;
  /** Last active date */
  lastActive: Date;
  /** Activity score (0-100) */
  activityScore: number;
}

/**
 * Collaboration network - who works with whom
 */
export interface CollaborationNetwork {
  /** Network nodes (members) */
  nodes: {
    userId: string;
    userName: string;
    role: 'elder' | 'member' | 'guest';
    activityScore: number;
  }[];
  /** Network edges (collaborations) */
  edges: {
    source: string; // userId
    target: string; // userId
    weight: number; // collaboration frequency
    type: 'video' | 'coediting' | 'template';
  }[];
}

/**
 * Analytics export format
 */
export interface AnalyticsExport {
  /** Export format */
  format: 'pdf' | 'csv' | 'json' | 'excel';
  /** Data included */
  data: AnalyticsDashboardData;
  /** Export settings */
  settings: {
    includeCharts: boolean;
    includeRawData: boolean;
    includeRecommendations: boolean;
  };
}

/**
 * Real-time analytics event
 */
export interface AnalyticsEvent {
  /** Event type */
  type: 'session_start' | 'session_end' | 'template_view' | 'template_complete' | 
        'video_call' | 'coediting' | 'recommendation_accept' | 'recommendation_reject';
  /** User ID */
  userId: string;
  /** Timestamp */
  timestamp: Date;
  /** Additional metadata */
  metadata: Record<string, any>;
}
