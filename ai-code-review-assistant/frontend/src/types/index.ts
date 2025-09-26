// User types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
  REVIEWER = 'REVIEWER',
  VIEWER = 'VIEWER',
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Repository types
export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  language?: string;
  isPrivate: boolean;
  defaultBranch: string;
  cloneUrl: string;
  htmlUrl: string;
  provider: GitProvider;
  providerId: string;
  ownerId: string;
  organizationId?: string;
  settings?: any;
  isActive: boolean;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum GitProvider {
  GITHUB = 'GITHUB',
  GITLAB = 'GITLAB',
  BITBUCKET = 'BITBUCKET',
}

// Code review types
export interface Review {
  id: string;
  repositoryId: string;
  fileId?: string;
  pullRequestId?: string;
  commitId?: string;
  reviewerId: string;
  type: ReviewType;
  status: ReviewStatus;
  score?: number;
  summary?: string;
  findings?: any;
  suggestions?: any;
  aiModel?: string;
  processingTime?: number;
  createdAt: string;
  updatedAt: string;
  repository?: Repository;
  reviewer?: User;
  comments?: Comment[];
}

export enum ReviewType {
  AUTOMATED = 'AUTOMATED',
  MANUAL = 'MANUAL',
  HYBRID = 'HYBRID',
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// Code issue types
export interface CodeIssue {
  id: string;
  type: IssueType;
  severity: Severity;
  title: string;
  description: string;
  line: number;
  column?: number;
  endLine?: number;
  endColumn?: number;
  rule?: string;
  fixable: boolean;
  suggestion?: string;
  confidence: number;
}

export enum IssueType {
  BUG = 'bug',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  STYLE = 'style',
  MAINTAINABILITY = 'maintainability',
}

export enum Severity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

// Code suggestion types
export interface CodeSuggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  line: number;
  originalCode: string;
  suggestedCode: string;
  reasoning: string;
  impact: Impact;
}

export enum SuggestionType {
  IMPROVEMENT = 'improvement',
  REFACTOR = 'refactor',
  OPTIMIZATION = 'optimization',
  SECURITY = 'security',
}

export enum Impact {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// Comment types
export interface Comment {
  id: string;
  reviewId: string;
  fileId?: string;
  authorId: string;
  content: string;
  lineStart?: number;
  lineEnd?: number;
  type: CommentType;
  severity: Severity;
  isResolved: boolean;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  author?: User;
  replies?: Comment[];
}

export enum CommentType {
  BUG = 'BUG',
  IMPROVEMENT = 'IMPROVEMENT',
  SUGGESTION = 'SUGGESTION',
  QUESTION = 'QUESTION',
  PRAISE = 'PRAISE',
  SECURITY = 'SECURITY',
  PERFORMANCE = 'PERFORMANCE',
}

// Organization types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  isActive: boolean;
  settings?: any;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: OrgMemberRole;
  joinedAt: string;
  user?: User;
  organization?: Organization;
}

export enum OrgMemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

// File types
export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  extension?: string;
  language?: string;
  size?: number;
  children?: FileTreeNode[];
  isExpanded?: boolean;
  level: number;
}

export interface FileContent {
  id: string;
  repositoryId: string;
  path: string;
  filename: string;
  extension?: string;
  language?: string;
  size?: number;
  content?: string;
  sha?: string;
  createdAt: string;
  updatedAt: string;
}

// Pull request types
export interface PullRequest {
  id: string;
  repositoryId: string;
  number: number;
  title: string;
  description?: string;
  state: PRState;
  authorId?: string;
  headBranch: string;
  baseBranch: string;
  providerId: string;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
  mergedAt?: string;
  closedAt?: string;
  repository?: Repository;
  reviews?: Review[];
}

export enum PRState {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  MERGED = 'MERGED',
  DRAFT = 'DRAFT',
}

// Analytics types
export interface DashboardMetrics {
  totalReviews: number;
  completedReviews: number;
  averageScore: number;
  criticalIssues: number;
  resolvedIssues: number;
  codeQualityTrend: CodeQualityPoint[];
  topLanguages: LanguageStats[];
  recentActivity: ActivityItem[];
}

export interface CodeQualityPoint {
  date: string;
  score: number;
  issues: number;
  fixed: number;
}

export interface LanguageStats {
  language: string;
  percentage: number;
  linesOfCode: number;
  files: number;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  user?: User;
  repository?: Repository;
}

export enum ActivityType {
  REVIEW_COMPLETED = 'REVIEW_COMPLETED',
  ISSUE_FIXED = 'ISSUE_FIXED',
  REPOSITORY_CONNECTED = 'REPOSITORY_CONNECTED',
  COMMENT_ADDED = 'COMMENT_ADDED',
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

export enum NotificationType {
  REVIEW_COMPLETED = 'REVIEW_COMPLETED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  PR_READY = 'PR_READY',
  ACHIEVEMENT_UNLOCKED = 'ACHIEVEMENT_UNLOCKED',
  INTEGRATION_FAILED = 'INTEGRATION_FAILED',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
}

// Theme types
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Socket types
export interface SocketUser {
  userId: string;
  username: string;
  avatar?: string;
}

export interface ReviewSession {
  id: string;
  name: string;
  description?: string;
  repositoryId: string;
  createdById: string;
  isActive: boolean;
  startedAt: string;
  endedAt?: string;
  participants: ReviewSessionParticipant[];
}

export interface ReviewSessionParticipant {
  id: string;
  sessionId: string;
  userId: string;
  role: SessionRole;
  joinedAt: string;
  leftAt?: string;
  user?: User;
}

export enum SessionRole {
  HOST = 'HOST',
  PARTICIPANT = 'PARTICIPANT',
  OBSERVER = 'OBSERVER',
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  username: string;
  message: string;
  type: 'text' | 'code' | 'suggestion' | 'ai_response';
  timestamp: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface RepositoryConnectionFormData {
  provider: GitProvider;
  accessToken: string;
  repositoryUrl: string;
}

// Loading and error states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface AsyncState<T> extends LoadingState {
  data?: T;
}

// Custom rule types
export interface CustomRule {
  id: string;
  name: string;
  description?: string;
  pattern: string;
  severity: Severity;
  message: string;
  autoFix?: string;
  isEnabled: boolean;
  language?: string;
  createdById: string;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

// Integration types
export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  settings: any;
  isEnabled: boolean;
  repositoryId?: string;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export enum IntegrationType {
  SLACK = 'SLACK',
  TEAMS = 'TEAMS',
  EMAIL = 'EMAIL',
  WEBHOOK = 'WEBHOOK',
  GITHUB_APP = 'GITHUB_APP',
  GITLAB_APP = 'GITLAB_APP',
  BITBUCKET_APP = 'BITBUCKET_APP',
}

// Achievement types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  criteria: any;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  progress?: any;
  achievement?: Achievement;
}