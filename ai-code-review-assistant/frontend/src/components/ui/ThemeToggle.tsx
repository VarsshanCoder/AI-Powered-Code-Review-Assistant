import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="md"
      onClick={toggleTheme}
      className="relative overflow-hidden"
      animated={false}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        className="relative w-5 h-5"
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            scale: theme === 'light' ? 1 : 0,
            opacity: theme === 'light' ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <Sun className="w-5 h-5 text-yellow-500" />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            scale: theme === 'dark' ? 1 : 0,
            opacity: theme === 'dark' ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <Moon className="w-5 h-5 text-blue-400" />
        </motion.div>
      </motion.div>
    </Button>
  );
};