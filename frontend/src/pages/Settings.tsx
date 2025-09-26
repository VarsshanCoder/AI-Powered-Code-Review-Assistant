import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CogIcon, 
  BellIcon, 
  KeyIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { Switch } from '../components/ui/Switch';
import { Button } from '../components/ui/Button';
import { useTheme } from '../components/ThemeProvider';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    push: true,
    security: true
  });
  const [rules, setRules] = useState({
    complexity: true,
    security: true,
    performance: false,
    style: true
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold flex items-center">
        <CogIcon className="w-8 h-8 mr-3" />
        Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <AnimatedCard className="p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <PaintBrushIcon className="w-5 h-5 mr-2" />
            Appearance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'system'].map((themeOption) => (
                <motion.button
                  key={themeOption}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(themeOption as any)}
                  className={`p-3 rounded-lg border-2 transition-all capitalize ${
                    theme === themeOption 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {themeOption}
                </motion.button>
              ))}
            </div>
          </div>
        </AnimatedCard>

        {/* Notifications */}
        <AnimatedCard delay={0.1} className="p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <BellIcon className="w-5 h-5 mr-2" />
            Notifications
          </h3>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize">{key} Notifications</span>
                <Switch 
                  checked={value} 
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Custom Rules */}
        <AnimatedCard delay={0.2} className="p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <CodeBracketIcon className="w-5 h-5 mr-2" />
            Code Review Rules
          </h3>
          <div className="space-y-4">
            {Object.entries(rules).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize">{key} Checks</span>
                <Switch 
                  checked={value} 
                  onCheckedChange={(checked) => 
                    setRules(prev => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* API Keys */}
        <AnimatedCard delay={0.3} className="p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <KeyIcon className="w-5 h-5 mr-2" />
            API Integration
          </h3>
          <div className="space-y-4">
            {['GitHub', 'GitLab', 'Bitbucket', 'Slack'].map((service) => (
              <div key={service} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span>{service}</span>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <Button size="lg" className="px-8">
          Save Settings
        </Button>
      </motion.div>
    </motion.div>
  );
}