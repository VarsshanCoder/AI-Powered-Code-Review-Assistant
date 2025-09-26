import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  FolderIcon, 
  DocumentCheckIcon, 
  CogIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
  UsersIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/Button';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Repositories', href: '/repositories', icon: FolderIcon },
  { name: 'Reviews', href: '/reviews', icon: DocumentCheckIcon },
  { name: 'Collaboration', href: '/collaboration', icon: UsersIcon },
  { name: 'Gamification', href: '/gamification', icon: TrophyIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-card border-r border-border">
        <div className="flex items-center h-16 px-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
            <span className="font-semibold text-lg">Code Review</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <motion.div
                key={item.name}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full"></div>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-card border-b border-border">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">
              {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <BellIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}