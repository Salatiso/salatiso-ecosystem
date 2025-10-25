/**
 * 📊 PHASE 2: POLLING & VOTING SYSTEM
 * 
 * Complete type definitions for poll creation, voting, and result tracking
 * Fully backward compatible with Phase 1 calendar events
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum PollType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  RANKING = 'ranking',
}

export enum PollStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

export enum VoteStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  CHANGED = 'changed',
  WITHDRAWN = 'withdrawn',
}

// ============================================================================
// POLL OPTION TYPES
// ============================================================================

export interface PollOption {
  id: string;
  text: string;
  order?: number; // For ranking polls
  description?: string;
  emoji?: string; // Visual indicator
  createdAt: Date;
}

export interface VoteChoice {
  optionId: string;
  rank?: number; // For ranking polls (1 = highest priority)
}

// ============================================================================
// VOTE TYPES
// ============================================================================

export interface Vote {
  id: string;
  pollId: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  choices: VoteChoice[] | VoteChoice; // Array for multiple choice, single for single choice
  status: VoteStatus;
  timestamp: Date;
  ipAddress?: string; // For vote integrity
  userAgent?: string; // For vote integrity
  withdrawn?: boolean;
  withdrawnAt?: Date;
  withdrawnBy?: string;
}

export interface VoteSubmission {
  userId: string;
  choices: VoteChoice[] | VoteChoice;
  timestamp: Date;
}

// ============================================================================
// POLL RESULTS TYPES
// ============================================================================

export interface OptionVoteCount {
  optionId: string;
  optionText: string;
  voteCount: number;
  percentage: number;
  voters?: string[]; // If not anonymous
  averageRank?: number; // For ranking polls
}

export interface PollResults {
  pollId: string;
  totalVotes: number;
  totalParticipants: number;
  optionResults: OptionVoteCount[];
  winningOption?: OptionVoteCount;
  status: PollStatus;
  calculatedAt: Date;
  isFinalized: boolean;
}

export interface RankingResults {
  pollId: string;
  optionId: string;
  optionText: string;
  averageRank: number;
  votes: number;
  standardDeviation: number;
  ranking: number;
}

// ============================================================================
// POLL CONFIGURATION TYPES
// ============================================================================

export interface PollConfig {
  anonymous: boolean;
  allowChangeVote: boolean; // Can user change their vote before deadline?
  allowWithdrawVote: boolean; // Can user withdraw their vote?
  showResultsBeforeClose: boolean; // Show real-time results before poll closes?
  showVoterNames: boolean; // If not anonymous, show who voted for what?
  multipleVotesPerUser: boolean; // Can user vote multiple times?
  requireComment?: boolean; // Optional comment on vote?
  notifyOnVote?: boolean; // Notify poll creator on each vote?
  notifyOnClose?: boolean; // Notify participants when poll closes?
}

// ============================================================================
// MAIN POLL TYPE
// ============================================================================

export interface Poll {
  // Metadata
  id: string;
  eventId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastModifiedBy?: string;

  // Basic Info
  title: string;
  question: string;
  description?: string;

  // Poll Type & Options
  type: PollType;
  options: PollOption[];

  // Timing
  createdTime: Date;
  startTime: Date;
  deadline: Date;
  closedAt?: Date;

  // Status
  status: PollStatus;

  // Configuration
  config: PollConfig;

  // Voting Data
  votes: Vote[];
  totalVotes: number;
  totalParticipants: number;
  participantIds: string[]; // Who can vote?

  // Results
  results?: PollResults;
  rankingResults?: RankingResults[]; // For ranking polls

  // Audit Trail
  auditTrail: PollAuditEntry[];

  // Context
  context: 'individual' | 'family' | 'community' | 'professional';
  tags?: string[];
  category?: string;

  // Notifications
  notificationsSent?: PollNotification[];
}

// ============================================================================
// AUDIT TRAIL
// ============================================================================

export interface PollAuditEntry {
  id: string;
  action: 'created' | 'opened' | 'voted' | 'updated' | 'closed' | 'archived';
  userId: string;
  timestamp: Date;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface PollNotification {
  id: string;
  pollId: string;
  userId: string;
  type: 'poll_created' | 'vote_reminder' | 'poll_closing_soon' | 'poll_closed' | 'results_ready';
  sentAt: Date;
  read?: boolean;
  readAt?: Date;
  channel: 'email' | 'push' | 'in_app';
}

// ============================================================================
// POLL FORM SUBMISSION (UI -> Service)
// ============================================================================

export interface CreatePollRequest {
  eventId: string;
  title: string;
  question: string;
  description?: string;
  type: PollType;
  options: string[]; // Text only on creation
  deadline: Date;
  config: Partial<PollConfig>;
  participantIds: string[];
  context: 'individual' | 'family' | 'community' | 'professional';
}

export interface UpdatePollRequest {
  title?: string;
  question?: string;
  description?: string;
  deadline?: Date;
  config?: Partial<PollConfig>;
  participantIds?: string[];
}

export interface SubmitVoteRequest {
  pollId: string;
  userId: string;
  choices: VoteChoice[] | VoteChoice;
  comment?: string;
  ipAddress?: string;
  userAgent?: string;
}

// ============================================================================
// RESPONSE TYPES (Service -> UI)
// ============================================================================

export interface CreatePollResponse {
  success: boolean;
  poll?: Poll;
  error?: string;
  message?: string;
}

export interface SubmitVoteResponse {
  success: boolean;
  vote?: Vote;
  error?: string;
  message?: string;
  results?: PollResults;
}

export interface GetPollResponse {
  success: boolean;
  poll?: Poll;
  results?: PollResults;
  userVote?: Vote;
  error?: string;
}

export interface GetPollsResponse {
  success: boolean;
  polls: Poll[];
  total: number;
  page: number;
  error?: string;
}

export interface ClosePollResponse {
  success: boolean;
  poll?: Poll;
  results?: PollResults;
  error?: string;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface PollCreationFormProps {
  eventId: string;
  onSuccess: (poll: Poll) => void;
  onError: (error: string) => void;
  onCancel: () => void;
  context?: 'individual' | 'family' | 'community' | 'professional';
  prefilledTitle?: string;
  prefilledQuestion?: string;
}

export interface PollVotingCardProps {
  poll: Poll;
  currentUserId: string;
  onVoteSubmitted?: (vote: Vote) => void;
  onError?: (error: string) => void;
  compact?: boolean; // Compact or expanded view
}

export interface PollResultsDisplayProps {
  poll: Poll;
  results: PollResults;
  currentUserId?: string;
  userVote?: Vote;
  onRefresh?: () => void;
  showVoterNames?: boolean;
  isLive?: boolean; // Auto-refresh results
}

export interface PollListProps {
  eventId?: string;
  context?: 'individual' | 'family' | 'community' | 'professional';
  status?: PollStatus;
  onSelectPoll?: (poll: Poll) => void;
  showResults?: boolean;
  currentUserId?: string;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface PollStatistics {
  totalPolls: number;
  openPolls: number;
  closedPolls: number;
  totalVotes: number;
  averageVotesPerPoll: number;
  participationRate: number; // 0-100%
  mostPopularOption?: OptionVoteCount;
  mostPopularPollType: PollType;
}

export interface PollFilters {
  status?: PollStatus;
  type?: PollType;
  context?: 'individual' | 'family' | 'community' | 'professional';
  createdBy?: string;
  eventId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchText?: string;
}

export interface PollSortOptions {
  field: 'createdAt' | 'deadline' | 'voteCount' | 'title';
  direction: 'asc' | 'desc';
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PollValidation {
  question: ValidationResult;
  options: ValidationResult;
  deadline: ValidationResult;
  participants: ValidationResult;
}
