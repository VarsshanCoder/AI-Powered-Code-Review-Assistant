import { Request } from 'express';
import { User } from '@prisma/client';

// Extended Express Request interface
export interface AuthenticatedRequest extends Request {
  user?: User;
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

// Auth types
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

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

// Repository types
export interface RepositoryConnection {
  provider: 'github' | 'gitlab' | 'bitbucket';
  accessToken: string;
  refreshToken?: string;
  repositoryUrl: string;
}

export interface FileAnalysis {
  path: string;
  language: string;
  issues: CodeIssue[];
  metrics: CodeMetrics;
  suggestions: CodeSuggestion[];
}

export interface CodeIssue {
  id: string;
  type: 'bug' | 'security' | 'performance' | 'style' | 'maintainability';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
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

export interface CodeMetrics {
  complexity: number;
  maintainabilityIndex: number;
  linesOfCode: number;
  duplicatedLines: number;
  testCoverage?: number;
}

export interface CodeSuggestion {
  id: string;
  type: 'improvement' | 'refactor' | 'optimization' | 'security';
  title: string;
  description: string;
  line: number;
  originalCode: string;
  suggestedCode: string;
  reasoning: string;
  impact: 'low' | 'medium' | 'high';
}

// AI Service types
export interface AIAnalysisRequest {
  code: string;
  language: string;
  filename: string;
  context?: {
    repository: string;
    branch: string;
    pullRequest?: number;
  };
}

export interface AIAnalysisResponse {
  issues: CodeIssue[];
  suggestions: CodeSuggestion[];
  metrics: CodeMetrics;
  summary: string;
  processingTime: number;
}

// Git provider types
export interface GitRepository {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  private: boolean;
  language?: string;
  defaultBranch: string;
  cloneUrl: string;
  htmlUrl: string;
}

export interface GitPullRequest {
  id: string;
  number: number;
  title: string;
  description?: string;
  state: 'open' | 'closed' | 'merged';
  headBranch: string;
  baseBranch: string;
  author: {
    username: string;
    avatar?: string;
  };
  htmlUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GitCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: Date;
  };
  htmlUrl: string;
}

// Webhook types
export interface WebhookEvent {
  id: string;
  type: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  repository: {
    id: string;
    name: string;
    fullName: string;
  };
  data: any;
  timestamp: Date;
}

// Real-time types
export interface SocketUser {
  userId: string;
  username: string;
  avatar?: string;
}

export interface ReviewSessionData {
  id: string;
  name: string;
  repository: string;
  participants: SocketUser[];
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  username: string;
  message: string;
  type: 'text' | 'code' | 'suggestion' | 'ai_response';
  timestamp: Date;
}

// Custom rules types
export interface CustomRuleData {
  name: string;
  description?: string;
  pattern: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  message: string;
  autoFix?: string;
  language?: string;
}

// Integration types
export interface SlackIntegration {
  webhookUrl: string;
  channel: string;
  notifications: {
    reviewCompleted: boolean;
    criticalIssues: boolean;
    pullRequestReady: boolean;
  };
}

export interface EmailIntegration {
  recipients: string[];
  notifications: {
    dailyDigest: boolean;
    criticalIssues: boolean;
    reviewSummary: boolean;
  };
}

// Analytics types
export interface CodeQualityTrend {
  date: Date;
  score: number;
  issues: number;
  fixed: number;
}

export interface DeveloperMetrics {
  userId: string;
  username: string;
  reviewsCompleted: number;
  issuesFixed: number;
  codeQualityScore: number;
  contributionScore: number;
}

export interface RepositoryHealth {
  repositoryId: string;
  name: string;
  qualityScore: number;
  securityScore: number;
  maintainabilityScore: number;
  testCoverage: number;
  lastAnalyzed: Date;
}