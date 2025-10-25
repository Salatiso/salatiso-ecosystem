// User and Authentication Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  familyMember?: FamilyMember;
  createdAt: Date;
  lastLogin: Date;
  preferences: UserPreferences;
  gamification: GamificationProfile;
  birthday?: string;
  anniversaries?: Anniversary[];
  // Enhanced authentication properties
  familyCode?: string;
  businessId?: string;
  emergencyCode?: string;
  accessLevel?: 'public' | 'family' | 'business' | 'private' | 'emergency';
  // MNI Framework properties
  mniProfile?: MNIMemberProfile;
}

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  relationship: FamilyRelationship;
  currentRole: string;
  careerPath?: CareerPath;
  achievements: Achievement[];
  lifeCVEntries: LifeCVEntry[];
  // MNI Framework properties
  mniRole?: MNIBusinessRole;
  ownershipStake?: number; // percentage ownership in MNI
  contributionHistory?: MNIContribution[];
}

export type UserRole = 
  | 'founder' 
  | 'administrator' 
  | 'parent_company_lead' 
  | 'general_family_member' 
  | 'youth_member' 
  | 'guest'
  | 'business_member'
  | 'emergency_access';

export type FamilyRelationship = 
  | 'founder' 
  | 'spouse' 
  | 'child' 
  | 'sibling' 
  | 'parent' 
  | 'grandchild' 
  | 'other';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationSettings;
  dashboardLayout: DashboardWidget[];
  gamificationEnabled: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  projectUpdates: boolean;
  careerMilestones: boolean;
  familyAnnouncements: boolean;
}

// Career and Development Types
export interface CareerPath {
  id: string;
  name: string;
  description: string;
  levels: CareerLevel[];
  currentLevel: number;
  progressPercentage: number;
  estimatedTimeToNextLevel: number;
  requiredSkills: Skill[];
  mentors: FamilyMember[];
}

export interface CareerLevel {
  level: number;
  title: string;
  description: string;
  requirements: LevelRequirement[];
  permissions: Permission[];
  responsibilities: string[];
  estimatedDuration: number; // in months
}

export interface LevelRequirement {
  id: string;
  type: 'skill' | 'experience' | 'project' | 'training' | 'external_work';
  description: string;
  completed: boolean;
  progress?: number;
  dueDate?: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: SkillLevel;
  verifiedBy?: string;
  lastUpdated: Date;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Project Management Types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: Date;
  endDate?: Date;
  estimatedCompletion: Date;
  progress: number;
  owner: FamilyMember;
  team: ProjectMember[];
  tasks: Task[];
  milestones: Milestone[];
  budget?: ProjectBudget;
  ecosystem: EcosystemApp[];
}

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: TaskStatus;
  assignee?: FamilyMember;
  dueDate?: Date;
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
  tags: string[];
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export interface ProjectMember {
  member: FamilyMember;
  role: string;
  permissions: Permission[];
  hoursAllocated: number;
  hoursWorked: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  completedDate?: Date;
}

export interface ProjectBudget {
  allocated: number;
  spent: number;
  currency: string;
  breakdown: BudgetItem[];
}

export interface BudgetItem {
  category: string;
  allocated: number;
  spent: number;
  description: string;
}

// Ecosystem Integration Types
export interface EcosystemApp {
  id: string;
  name: string;
  url: string;
  description: string;
  purpose: string;
  audience: string[];
  status: AppStatus;
  valuation: AppValuation;
  integrations: AppIntegration[];
  healthStatus: HealthStatus;
  owner?: FamilyMember;
  lastUpdated: Date;
}

export type AppStatus = 'concept' | 'development' | 'mvp' | 'active' | 'maintenance' | 'deprecated';

export interface AppValuation {
  functionalityScore: number;
  developmentProgress: number;
  marketPotentialScore: number;
  totalValue: number;
  currency: string;
  lastCalculated: Date;
  methodology: string[];
}

export interface AppIntegration {
  targetApp: string;
  type: 'api' | 'sso' | 'data_sync' | 'workflow';
  status: 'active' | 'planned' | 'deprecated';
  description: string;
}

export type HealthStatus = 'healthy' | 'warning' | 'critical' | 'offline';

// Gamification Types
export interface GamificationProfile {
  level: number;
  experiencePoints: number;
  pointsToNextLevel: number;
  badges: Badge[];
  achievements: Achievement[];
  streaks: Streak[];
  leaderboardRank: number;
  // Trust & Achievement System
  trustScore: TrustScore;
  achievementCategories: AchievementCategory[];
}

export interface TrustScore {
  overall: number;
  ecosystem: number;
  family: number;
  business: number;
  learning: number;
  lastUpdated: Date;
  factors: TrustFactor[];
}

export interface TrustFactor {
  category: 'ecosystem' | 'family' | 'business' | 'learning';
  name: string;
  value: number;
  weight: number;
  evidence: string;
  timestamp: Date;
}

export interface AchievementCategory {
  id: string;
  name: string;
  description: string;
  dimension: 'ecosystem' | 'family' | 'business' | 'learning';
  totalPoints: number;
  unlockedAchievements: Achievement[];
  availableAchievements: Achievement[];
  progress: number; // 0-100
}

export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: BadgeRarity;
  earnedDate: Date;
  criteria: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  points: number;
  unlockedDate: Date;
  evidence?: string;
}

export interface Streak {
  type: string;
  current: number;
  longest: number;
  lastActivity: Date;
}

// MNI Framework Types
export interface MNIOwnership {
  id: string;
  assetId: string;
  assetType: 'business' | 'project' | 'property' | 'intellectual_property' | 'investment';
  ownerId: string;
  ownershipPercentage: number;
  acquiredDate: Date;
  acquisitionMethod: 'inheritance' | 'purchase' | 'contribution' | 'gift' | 'merger';
  valuation?: number;
  documents: OwnershipDocument[];
  transferRestrictions?: string[];
  votingRights: boolean;
  profitShare: boolean;
}

export interface OwnershipDocument {
  id: string;
  type: 'deed' | 'contract' | 'agreement' | 'certificate' | 'valuation';
  title: string;
  fileUrl: string;
  uploadedDate: Date;
  verified: boolean;
}

export interface MNIBusinessRole {
  id: string;
  name: string;
  description: string;
  department: MNIDepartment;
  level: 'entry' | 'mid' | 'senior' | 'executive' | 'board';
  permissions: MNIPermission[];
  responsibilities: string[];
  requiredExperience: number; // years
  requiredEducation?: string[];
  compensation: CompensationStructure;
  reportingTo?: string; // role ID
  directReports?: string[]; // user IDs
}

export type MNIDepartment =
  | 'executive'
  | 'finance'
  | 'operations'
  | 'marketing'
  | 'technology'
  | 'human_resources'
  | 'legal'
  | 'family_office'
  | 'research_development';

export interface MNIPermission {
  id: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'manage';
  scope: 'own' | 'department' | 'company' | 'group';
}

export interface CompensationStructure {
  baseSalary?: number;
  bonusPercentage?: number;
  equityPercentage?: number;
  benefits: string[];
  performanceMetrics: string[];
}

export interface MNIContribution {
  id: string;
  userId: string;
  type: 'financial' | 'intellectual' | 'operational' | 'networking' | 'mentorship';
  description: string;
  value: number; // monetary or point value
  date: Date;
  category: MNIContributionCategory;
  impact: 'low' | 'medium' | 'high' | 'transformative';
  verified: boolean;
  verifiedBy?: string;
  documents?: string[]; // file URLs
}

export type MNIContributionCategory =
  | 'business_development'
  | 'innovation'
  | 'family_governance'
  | 'education_training'
  | 'community_service'
  | 'investment_opportunities'
  | 'strategic_planning'
  | 'operational_excellence';

export interface MNIEligibility {
  userId: string;
  eligibilityType: 'ownership' | 'leadership' | 'investment' | 'governance';
  status: 'eligible' | 'pending' | 'ineligible' | 'conditional';
  requirements: EligibilityRequirement[];
  metRequirements: string[]; // requirement IDs
  totalContributionValue: number;
  minimumContributionThreshold: number;
  assessmentDate: Date;
  nextReviewDate?: Date;
  notes?: string;
}

export interface EligibilityRequirement {
  id: string;
  type: 'contribution_value' | 'experience_years' | 'education_level' | 'performance_score' | 'trust_score' | 'family_relationship';
  description: string;
  threshold: number | string;
  currentValue?: number | string;
  met: boolean;
}

export interface MNIMemberProfile {
  userId: string;
  businessRole?: MNIBusinessRole;
  ownerships: MNIOwnership[];
  contributions: MNIContribution[];
  eligibility: MNIEligibility[];
  performanceMetrics: MNIPerformanceMetric[];
  developmentPlan: MNIDevelopmentPlan;
  lastAssessment: Date;
}

export interface MNIPerformanceMetric {
  id: string;
  category: 'financial' | 'operational' | 'leadership' | 'innovation' | 'collaboration';
  metric: string;
  target: number;
  actual: number;
  period: string; // e.g., 'Q1-2025', '2025'
  score: number; // 0-100
}

export interface MNIDevelopmentPlan {
  id: string;
  goals: MNIDevelopmentGoal[];
  timeline: string;
  mentor?: string; // user ID
  resources: string[];
  progress: number; // 0-100
  reviewDate: Date;
}

export interface MNIDevelopmentGoal {
  id: string;
  title: string;
  description: string;
  category: 'skill_development' | 'leadership' | 'business_acumen' | 'networking' | 'contribution';
  targetDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  progress: number; // 0-100
  milestones: string[];
}

// LifeCV Types
export interface LifeCVEntry {
  id: string;
  userId: string;
  type: LifeCVEntryType;
  title: string;
  description: string;
  date: Date;
  source: string; // which app generated this entry
  verified: boolean;
  verifiedBy?: string;
  metadata: Record<string, any>;
  visibility: EntryVisibility;
}

export type LifeCVEntryType = 
  | 'education' 
  | 'project' 
  | 'skill' 
  | 'achievement' 
  | 'family_value' 
  | 'training' 
  | 'certification';

export type EntryVisibility = 'private' | 'family' | 'public';

export interface Anniversary {
  id: string;
  name: string;
  date: string;
  createdAt: Date;
}

// Dashboard and UI Types
export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
  visible: boolean;
}

export type WidgetType = 
  | 'welcome' 
  | 'ecosystem_health' 
  | 'project_timeline' 
  | 'career_progress' 
  | 'resource_management' 
  | 'lifecv_feed' 
  | 'gamification' 
  | 'family_announcements';

// Permission and Access Control Types
export interface Permission {
  resource: string;
  action: PermissionAction;
  conditions?: Record<string, any>;
}

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'execute';

// Timeline Types
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: EventType;
  category: string;
  participants: FamilyMember[];
  attachments: Attachment[];
  milestone: boolean;
  visibility: EntryVisibility;
}

export type EventType = 
  | 'personal' 
  | 'family' 
  | 'company' 
  | 'project' 
  | 'achievement' 
  | 'milestone';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Form Types
export interface FormState<T> {
  data: T;
  errors: Record<keyof T, string>;
  loading: boolean;
  touched: Record<keyof T, boolean>;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  status?: string;
  assignee?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Beta Testing Types
export interface BetaTester {
  id: string;
  personId: string;
  assignedDate: Date | any; // Firestore Timestamp
  status: 'active' | 'inactive' | 'suspended';
  testingLevel: 'basic' | 'intermediate' | 'advanced';
  specializations: string[];
  weeklyReportRequired: boolean;
  lastReportDate?: Date | any;
  totalReportsSubmitted: number;
  averageReportQuality: number;
  performanceScore: number;
  achievements: BetaTestingAchievement[];
  createdAt: Date | any;
  updatedAt: Date | any;
}

export interface BetaTestingAchievement {
  id: string;
  title: string;
  description: string;
  earnedDate: Date | any;
  type: 'bug-finder' | 'feature-suggester' | 'consistent-tester' | 'quality-reporter';
}

export interface WeeklyReport {
  id: string;
  personId: string;
  weekStart: Date | any;
  weekEnd: Date | any;
  appsTested: TestedApp[];
  bugsFound: BugReport[];
  featureSuggestions: FeatureSuggestion[];
  usabilityIssues: UsabilityIssue[];
  performanceObservations: PerformanceObservation[];
  overallRating: number;
  recommendations: string;
  timeSpent: number;
  includedInLifeCV: boolean;
  includedInCareerDoc: boolean;
  submittedAt: Date | any;
  reviewedBy?: string;
  reviewNotes?: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
}

export interface TestedApp {
  appName: string;
  appUrl: string;
  featuresTested: string[];
  issuesFound: number;
  rating: number;
  notes: string;
}

export interface BugReport {
  id: string;
  appName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  stepsToReproduce: string[];
  expectedBehavior: string;
  actualBehavior: string;
  screenshots: string[];
  browserInfo: BrowserInfo;
  status: 'open' | 'investigating' | 'fixed' | 'wont-fix';
  reportedAt: Date;
}

export interface FeatureSuggestion {
  id: string;
  appName: string;
  title: string;
  description: string;
  useCase: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  screenshots: string[];
  status: 'submitted' | 'under-review' | 'planned' | 'implemented';
  submittedAt: Date;
}

export interface UsabilityIssue {
  id: string;
  appName: string;
  issueType: 'navigation' | 'accessibility' | 'performance' | 'design' | 'functionality';
  description: string;
  severity: 'minor' | 'moderate' | 'major';
  userImpact: string;
  suggestions: string[];
  status: 'open' | 'addressed' | 'resolved';
}

export interface PerformanceObservation {
  id: string;
  appName: string;
  metric: 'load-time' | 'responsiveness' | 'memory-usage' | 'battery-impact';
  value: number;
  unit: string;
  context: string;
  severity: 'good' | 'acceptable' | 'concerning' | 'critical';
  observations: string;
}

export interface TestingAnalytics {
  id: string;
  period: 'weekly' | 'monthly' | 'quarterly';
  startDate: Date;
  endDate: Date;
  totalTesters: number;
  activeTesters: number;
  reportsSubmitted: number;
  averageReportQuality: number;
  bugsFound: number;
  bugsBySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  featureSuggestions: number;
  appsCoverage: AppCoverage[];
  testerPerformance: TesterPerformance[];
  trends: TestingTrend[];
  recommendations: string[];
  generatedAt: Date;
}

export interface AppCoverage {
  appName: string;
  testersAssigned: number;
  reportsReceived: number;
  coveragePercentage: number;
  averageRating: number;
}

export interface TesterPerformance {
  personId: string;
  reportsSubmitted: number;
  averageQuality: number;
  bugsFound: number;
  suggestionsMade: number;
  consistencyScore: number;
  performanceScore: number;
}

export interface TestingTrend {
  metric: string;
  previousValue: number;
  currentValue: number;
  change: number;
  changePercentage: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface BrowserInfo {
  name: string;
  version: string;
  userAgent: string;
  platform: string;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  category: 'testing' | 'career' | 'personal';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

export interface Document {
  id: string;
  title: string;
  category: string;
  type: 'specification' | 'guide' | 'research' | 'blueprint' | 'curriculum' | 'report';
  description: string;
  author: string;
  date: string;
  tags: string[];
  fileSize?: string;
  status: 'published' | 'draft' | 'archived';
  featured: boolean;
  downloadUrl?: string;
  viewUrl?: string;
  accessLevel: 'public' | 'family' | 'business' | 'private';
  xpReward: number;
  estimatedReadTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prerequisites?: string[];
}