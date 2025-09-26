import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UsersIcon, 
  MicrophoneIcon, 
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const activeUsers = [
  { id: 1, name: 'Alice Johnson', avatar: 'AJ', status: 'online', role: 'reviewer' },
  { id: 2, name: 'Bob Smith', avatar: 'BS', status: 'online', role: 'developer' },
  { id: 3, name: 'Carol Davis', avatar: 'CD', status: 'away', role: 'ai-assistant' },
];

const chatMessages = [
  { id: 1, user: 'Alice', message: 'Found a potential security issue in line 42', time: '2m ago', type: 'comment' },
  { id: 2, user: 'AI Assistant', message: 'Suggested fix: Use parameterized queries to prevent SQL injection', time: '1m ago', type: 'ai' },
  { id: 3, user: 'Bob', message: 'Thanks! Implementing the fix now', time: '30s ago', type: 'comment' },
];

export function Collaboration() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Live Collaboration</h1>
        <div className="flex items-center space-x-3">
          <Badge variant="success" className="animate-pulse">
            3 Active Users
          </Badge>
          <Button variant="outline" size="sm">
            <VideoCameraIcon className="w-4 h-4 mr-2" />
            Start Video Call
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Users */}
        <AnimatedCard className="p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <UsersIcon className="w-5 h-5 mr-2" />
            Active Participants
          </h3>
          <div className="space-y-3">
            {activeUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                    user.role === 'ai-assistant' ? 'bg-purple-500' : 'bg-primary'
                  }`}
                >
                  {user.avatar}
                </motion.div>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  user.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                }`} />
              </motion.div>
            ))}
          </div>
        </AnimatedCard>

        {/* Chat Panel */}
        <AnimatedCard delay={0.2} className="p-6 lg:col-span-2">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
            Live Discussion
          </h3>
          
          {/* Messages */}
          <div className="h-64 overflow-y-auto space-y-3 mb-4 p-3 bg-muted/30 rounded-lg">
            <AnimatePresence>
              {chatMessages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start space-x-3 ${
                    msg.type === 'ai' ? 'bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg' : ''
                  }`}
                >
                  {msg.type === 'ai' && (
                    <SparklesIcon className="w-5 h-5 text-purple-500 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{msg.user}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm mt-1">{msg.message}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Message Input */}
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={`p-2 rounded-lg transition-colors ${
                isVoiceActive 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-muted hover:bg-accent'
              }`}
            >
              <MicrophoneIcon className="w-5 h-5" />
            </motion.button>
            <Button size="sm">Send</Button>
          </div>
        </AnimatedCard>
      </div>

      {/* AI Pair Programmer */}
      <AnimatedCard delay={0.4} className="p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <SparklesIcon className="w-5 h-5 mr-2 text-purple-500" />
          AI Pair Programmer
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Live Suggestions</h4>
            <div className="space-y-3">
              {[
                'Consider using async/await instead of promises',
                'Add error handling for network requests',
                'Extract this logic into a separate function'
              ].map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 cursor-pointer"
                >
                  <p className="text-sm">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Voice Commands</h4>
            <div className="p-4 border-2 border-dashed border-border rounded-lg text-center">
              <motion.div
                animate={isVoiceActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <MicrophoneIcon className={`w-12 h-12 mx-auto mb-2 ${
                  isVoiceActive ? 'text-red-500' : 'text-muted-foreground'
                }`} />
              </motion.div>
              <p className="text-sm text-muted-foreground">
                {isVoiceActive ? 'Listening...' : 'Click to activate voice commands'}
              </p>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </motion.div>
  );
}