import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animated?: boolean;
  motionProps?: MotionProps;
}

const buttonVariants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  destructive: 'btn-destructive',
};

const buttonSizes = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

const buttonAnimations = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  initial: { scale: 1 },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      animated = true,
      motionProps,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const buttonClasses = clsx(
      'btn',
      buttonVariants[variant],
      buttonSizes[size],
      {
        'cursor-not-allowed opacity-50': isDisabled,
      },
      className
    );

    const content = (
      <>
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!loading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </>
    );

    if (animated && !isDisabled) {
      return (
        <motion.button
          ref={ref}
          className={buttonClasses}
          disabled={isDisabled}
          variants={buttonAnimations}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          transition={{ duration: 0.2 }}
          {...motionProps}
          {...props}
        >
          {content}
        </motion.button>
      );
    }

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';