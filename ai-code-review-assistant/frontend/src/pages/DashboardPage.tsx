import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  GitBranch,
  BarChart3,
  Activity,
  Clock,
  Target,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface DashboardMetrics {
  totalReviews: number;
  completedReviews: number;
  averageScore: number;
  criticalIssues: number;
  resolvedIssues: number;
  activeRepositories: number;
  teamMembers: number;
  codeQuality: number;
}

interface ActivityItem {
  id: string;
  type: 'review' | 'issue' | 'fix' | 'merge';
  title: string;
  repository: string;
  time: string;
  user: string;
}

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalReviews: 156,
    completedReviews: 142,
    averageScore: 8.4,
    criticalIssues: 3,
    resolvedIssues: 89,
    activeRepositories: 12,
    teamMembers: 8,
    codeQuality: 92,
  });

  const [recentActivity] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'review',
      title: 'AI review completed for user authentication module',
      repository: 'frontend-app',
      time: '2 minutes ago',
      user: 'AI Assistant',
    },
    {
      id: '2',
      type: 'fix',
      title: 'Security vulnerability fixed in payment handler',
      repository: 'backend-api',
      time: '15 minutes ago',
      user: 'John Doe',
    },
    {
      id: '3',
      type: 'merge',
      title: 'Pull request merged: Feature/dark-mode',
      repository: 'frontend-app',
      time: '1 hour ago',
      user: 'Jane Smith',
    },
    {
      id: '4',
      type: 'issue',
      title: 'Performance issue detected in data processing',
      repository: 'data-pipeline',
      time: '2 hours ago',
      user: 'AI Assistant',
    },
  ]);

  const statCards = [
    {
      title: 'Total Reviews',
      value: metrics.totalReviews,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Code2,
      color: 'primary',
    },
    {
      title: 'Code Quality Score',
      value: `${metrics.codeQuality}%`,
      change: '+5%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'success',
    },
    {
      title: 'Critical Issues',
      value: metrics.criticalIssues,
      change: '-2',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'warning',
    },
    {
      title: 'Issues Resolved',
      value: metrics.resolvedIssues,
      change: '+23%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'success',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'review':
        return Code2;
      case 'issue':
        return AlertTriangle;
      case 'fix':
        return CheckCircle;
      case 'merge':
        return GitBranch;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'review':
        return 'text-primary-600 dark:text-primary-400';
      case 'issue':
        return 'text-warning-600 dark:text-warning-400';
      case 'fix':
        return 'text-success-600 dark:text-success-400';
      case 'merge':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your code reviews.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card card-hover p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive'
                    ? 'text-success-700 bg-success-100 dark:text-success-400 dark:bg-success-900/20'
                    : 'text-error-700 bg-error-100 dark:text-error-400 dark:bg-error-900/20'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="mb-1">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.title}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((item, index) => {
                const IconComponent = getActivityIcon(item.type);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${getActivityColor(item.type)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.repository}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.user}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.time}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* Team Overview */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Team Overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Team Members
                  </span>
                </div>
                <span className="text-sm font-medium">{metrics.teamMembers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GitBranch className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Active Repos
                  </span>
                </div>
                <span className="text-sm font-medium">{metrics.activeRepositories}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Completion Rate
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {Math.round((metrics.completedReviews / metrics.totalReviews) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button variant="primary" className="w-full" leftIcon={<Code2 className="w-4 h-4" />}>
                Start New Review
              </Button>
              <Button variant="outline" className="w-full" leftIcon={<BarChart3 className="w-4 h-4" />}>
                View Analytics
              </Button>
              <Button variant="outline" className="w-full" leftIcon={<GitBranch className="w-4 h-4" />}>
                Connect Repository
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Code Quality Trend Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Code Quality Trend
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">7D</Button>
            <Button variant="outline" size="sm">30D</Button>
            <Button variant="primary" size="sm">90D</Button>
          </div>
        </div>
        <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Chart will be implemented here</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};