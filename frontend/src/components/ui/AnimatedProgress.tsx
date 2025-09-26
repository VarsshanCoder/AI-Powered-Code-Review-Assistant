import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  showValue?: boolean;
}

export function AnimatedProgress({ 
  value, 
  max = 100, 
  className = '', 
  color = 'bg-primary',
  showValue = true 
}: AnimatedProgressProps) {
  const percentage = (value / max) * 100;

  return (
    <div className={`relative ${className}`}>
      <div className="w-full bg-muted rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      {showValue && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute right-0 top-3 text-sm text-muted-foreground"
        >
          {value}/{max}
        </motion.span>
      )}
    </div>
  );
}