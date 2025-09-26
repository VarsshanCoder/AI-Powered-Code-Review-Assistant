import React, { InputHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animated?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      animated = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputClasses = clsx(
      'input',
      {
        'pl-10': leftIcon,
        'pr-10': rightIcon,
        'border-error-500 focus:border-error-500 focus:ring-error-500': error,
        'cursor-not-allowed opacity-50': disabled,
      },
      className
    );

    const InputComponent = animated ? motion.input : 'input';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 dark:text-gray-500">{leftIcon}</span>
            </div>
          )}
          <InputComponent
            ref={ref}
            type={type}
            className={inputClasses}
            disabled={disabled}
            {...(animated && {
              initial: { scale: 1 },
              whileFocus: { scale: 1.02 },
              transition: { duration: 0.2 },
            })}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400 dark:text-gray-500">{rightIcon}</span>
            </div>
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-error-600 dark:text-error-400"
          >
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';