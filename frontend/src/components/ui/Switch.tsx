import React from 'react';
import { motion } from 'framer-motion';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Switch({ checked, onCheckedChange, disabled = false, size = 'md' }: SwitchProps) {
  const sizes = {
    sm: { width: 'w-8', height: 'h-4', thumb: 'w-3 h-3' },
    md: { width: 'w-11', height: 'h-6', thumb: 'w-5 h-5' },
    lg: { width: 'w-14', height: 'h-7', thumb: 'w-6 h-6' }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={`${sizes[size].width} ${sizes[size].height} rounded-full relative inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        checked ? 'bg-primary' : 'bg-muted'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className={`${sizes[size].thumb} bg-white rounded-full shadow-lg transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}