import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrophyIcon, 
  StarIcon, 
  FireIcon,
  ShieldCheckIcon,
  CodeBracketIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { AnimatedProgress } from '../components/ui/AnimatedProgress';
import { Badge } from '../components/ui/Badge';

const badges = [
  { id: 1, name: 'Code Quality Master', icon: StarIcon, earned: true, color: 'text-yellow-500' },
  { id: 2, name: 'Security Guardian', icon: ShieldCheckIcon, earned: true, color: 'text-blue-500' },
  { id: 3, name: 'Performance Optimizer', icon: BoltIcon, earned: false, color: 'text-green-500' },
  { id: 4, name: 'Bug Hunter', icon: CodeBracketIcon, earned: true, color: 'text-red-500' },
];

const leaderboard = [
  { rank: 1, name: 'Alice Johnson', score: 2847, change: '+12' },
  { rank: 2, name: 'Bob Smith', score: 2634, change: '+8' },
  { rank: 3, name: 'Carol Davis', score: 2521, change: '-2' },
  { rank: 4, name: 'David Wilson', score: 2398, change: '+15' },
  { rank: 5, name: 'Eva Brown', score: 2287, change: '+5' },
];

const achievements = [
  { title: '100 Reviews Completed', progress: 85, total: 100 },
  { title: 'Zero Critical Issues', progress: 67, total: 100 },
  { title: 'Team Collaboration', progress: 92, total: 100 },
];

export function Gamification() {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleBadgeClick = (badge: any) => {
    if (!badge.earned) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <TrophyIcon className="w-8 h-8 mr-3 text-yellow-500" />
          Gamification Hub
        </h1>
        <div className="flex items-center space-x-3">
          <Badge variant="default" className="text-lg px-4 py-2">
            <FireIcon className="w-5 h-5 mr-2" />
            Level 12
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player Stats */}
        <AnimatedCard className="p-6">
          <h3 className="text-lg font-medium mb-4">Your Progress</h3>
          <div className="space-y-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mb-4"
              >
                <span className="text-2xl font-bold text-white">12</span>
              </motion.div>
              <h4 className="font-medium">Current Level</h4>
              <p className="text-sm text-muted-foreground">2,847 XP</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to Level 13</span>
                <span>847/1000 XP</span>
              </div>
              <AnimatedProgress value={847} max={1000} color="bg-gradient-to-r from-primary to-purple-600" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">156</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">98%</p>
                <p className="text-xs text-muted-foreground">Quality Score</p>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Badges Collection */}
        <AnimatedCard delay={0.2} className="p-6">
          <h3 className="text-lg font-medium mb-4">Badge Collection</h3>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBadgeClick(badge)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  badge.earned 
                    ? 'border-primary bg-primary/10' 
                    : 'border-dashed border-muted-foreground/30 opacity-50 hover:opacity-75'
                }`}
              >
                <motion.div
                  animate={badge.earned ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <badge.icon className={`w-8 h-8 mx-auto mb-2 ${badge.color}`} />
                  <p className="text-xs font-medium">{badge.name}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </AnimatedCard>

        {/* Achievements */}
        <AnimatedCard delay={0.4} className="p-6">
          <h3 className="text-lg font-medium mb-4">Achievements</h3>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{achievement.title}</span>
                  <span className="text-muted-foreground">
                    {achievement.progress}/{achievement.total}
                  </span>
                </div>
                <AnimatedProgress 
                  value={achievement.progress} 
                  max={achievement.total}
                  color={achievement.progress === achievement.total ? 'bg-green-500' : 'bg-primary'}
                />
              </motion.div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Leaderboard */}
      <AnimatedCard delay={0.6} className="p-6">
        <h3 className="text-lg font-medium mb-6 flex items-center">
          <TrophyIcon className="w-5 h-5 mr-2 text-yellow-500" />
          Team Leaderboard
        </h3>
        <div className="space-y-3">
          {leaderboard.map((player, index) => (
            <motion.div
              key={player.rank}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 8 }}
              className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800' : 'bg-muted/30'
              }`}
            >
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-muted text-muted-foreground'
                  }`}
                >
                  {player.rank}
                </motion.div>
                <div>
                  <p className="font-medium">{player.name}</p>
                  <p className="text-sm text-muted-foreground">{player.score} XP</p>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  player.change.startsWith('+') ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                  'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}
              >
                {player.change}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </AnimatedCard>

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -100, 
                  x: Math.random() * window.innerWidth,
                  rotate: 0 
                }}
                animate={{ 
                  y: window.innerHeight + 100,
                  rotate: 360 
                }}
                transition={{ 
                  duration: 3,
                  delay: Math.random() * 2,
                  ease: "easeOut"
                }}
                className="absolute w-3 h-3 bg-primary rounded-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}