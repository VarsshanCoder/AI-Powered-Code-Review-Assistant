import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Code2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data.email, data.password);
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        {/* Logo and title */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Code2 className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-3xl font-bold text-gray-900 dark:text-white"
          >
            Welcome back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-sm text-gray-600 dark:text-gray-400"
          >
            Sign in to your AI Code Review account
          </motion.p>
        </div>

        {/* Login form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8"
        >
          <div className="card shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4"
                  >
                    <p className="text-sm text-error-600 dark:text-error-400">
                      {error}
                    </p>
                  </motion.div>
                )}

                {/* Email field */}
                <Input
                  {...register('email')}
                  type="email"
                  label="Email address"
                  placeholder="Enter your email"
                  leftIcon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                  autoComplete="email"
                />

                {/* Password field */}
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Enter your password"
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                  error={errors.password?.message}
                  autoComplete="current-password"
                />

                {/* Forgot password link */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  size="lg"
                  loading={isLoading}
                  className="w-full gradient-primary"
                  motionProps={{
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                  }}
                >
                  Sign in
                </Button>
              </form>

              {/* Sign up link */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                      Don't have an account?
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link to="/register">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      motionProps={{
                        whileHover: { scale: 1.02 },
                        whileTap: { scale: 0.98 },
                      }}
                    >
                      Create new account
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="font-medium">AI-Powered</div>
              <div>Smart code analysis</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="font-medium">Real-time</div>
              <div>Instant feedback</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="font-medium">Collaborative</div>
              <div>Team reviews</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};