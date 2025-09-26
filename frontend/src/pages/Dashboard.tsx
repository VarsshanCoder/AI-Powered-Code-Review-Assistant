import React from 'react';
import { 
  ChartBarIcon, 
  CodeBracketIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { AnimatedProgress } from '../components/ui/AnimatedProgress';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

const stats = [
  {
    name: 'Total Reviews',
    value: '2,847',
    change: '+12%',
    changeType: 'positive',
    icon: CodeBracketIcon,
  },
  {
    name: 'Issues Found',
    value: '1,234',
    change: '-8%',
    changeType: 'positive',
    icon: ExclamationTriangleIcon,
  },
  {
    name: 'Auto-Fixed',
    value: '892',
    change: '+23%',
    changeType: 'positive',
    icon: CheckCircleIcon,
  },
  {
    name: 'Avg Review Time',
    value: '4.2min',
    change: '-15%',
    changeType: 'positive',
    icon: ClockIcon,
  },
];

const recentReviews = [
  {
    id: '1',
    title: 'Fix authentication middleware',
    repository: 'frontend-app',
    score: 85,
    status: 'completed',
    findings: 3,
    createdAt: '2 hours ago',
  },
  {
    id: '2',
    title: 'Add user validation',
    repository: 'backend-api',
    score: 92,
    status: 'completed',
    findings: 1,
    createdAt: '4 hours ago',
  },
  {
    id: '3',
    title: 'Optimize database queries',
    repository: 'data-service',
    score: 78,
    status: 'in_progress',
    findings: 5,
    createdAt: '6 hours ago',
  },
];

const chartData = [
  { name: 'Mon', quality: 85, security: 92, performance: 78 },
  { name: 'Tue', quality: 88, security: 89, performance: 82 },
  { name: 'Wed', quality: 92, security: 94, performance: 85 },
  { name: 'Thu', quality: 89, security: 91, performance: 88 },
  { name: 'Fri', quality: 94, security: 96, performance: 91 },
  { name: 'Sat', quality: 91, security: 93, performance: 89 },
  { name: 'Sun', quality: 96, security: 98, performance: 94 },
];

export function Dashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <AnimatedCard key={stat.name} delay={index * 0.1} className="p-6">
            <div className="flex items-center">
              <motion.div 
                className="flex-shrink-0"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <stat.icon className="w-8 h-8 text-primary" />
              </motion.div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <motion.div 
                      className="text-2xl font-semibold text-foreground"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    >
                      {stat.value}
                    </motion.div>
                    <motion.div 
                      className={`ml-2 flex items-center text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      {stat.changeType === 'positive' ? 
                        <ArrowUpIcon className="w-4 h-4 mr-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 mr-1" />
                      }
                      {stat.change}
                    </motion.div>
                  </dd>
                </dl>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Recent Reviews</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{review.title}</h4>
                  <p className="text-sm text-muted-foreground">{review.repository}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm">Score: {review.score}/100</span>
                    <span className="text-sm">{review.findings} findings</span>
                    <span className="text-sm text-muted-foreground">{review.createdAt}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <Badge variant={review.status === 'completed' ? 'success' : 'warning'}>
                    {review.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">AI Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start">
                <ChartBarIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="ml-3">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Code Quality Trend
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                    Your team's code quality has improved by 15% this month. Keep up the great work!
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="ml-3">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                    Security Alert
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-1">
                    3 repositories have potential security vulnerabilities that need attention.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="ml-3">
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    Auto-Fix Success
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-200 mt-1">
                    AI successfully auto-fixed 23 issues across 8 repositories today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}