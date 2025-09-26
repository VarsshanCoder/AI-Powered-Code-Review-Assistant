import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function AnimatedCard({ 
  children, 
  className, 
  delay = 0, 
  hover = true 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
      className="h-full"
    >
      <Card className={className}>
        {children}
      </Card>
    </motion.div>
  );
}