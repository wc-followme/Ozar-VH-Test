'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface OptimizedLoginFormProps {
  onSubmit: (
    data: LoginFormData
  ) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

export function OptimizedLoginForm({
  onSubmit,
  isLoading,
}: OptimizedLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange', // Validate on change for real-time feedback
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (data: LoginFormData) => {
    // Clear any previous submit errors
    setSubmitError(null);
    clearErrors();

    try {
      const result = await onSubmit(data);

      if (!result.success && result.error) {
        // Check if it's a field-specific error
        if (result.error.toLowerCase().includes('email')) {
          setError('email', {
            type: 'server',
            message: result.error,
          });
        } else if (result.error.toLowerCase().includes('password')) {
          setError('password', {
            type: 'server',
            message: result.error,
          });
        } else {
          // General error
          setSubmitError(result.error);
        }
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  };

  const handleInputChange = () => {
    // Clear submit errors when user starts typing
    if (submitError) {
      setSubmitError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
      {/* General Error Alert */}
      {submitError && (
        <Alert variant='destructive' className='border-red-200 bg-red-50'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription className='text-red-800'>
            {submitError}
          </AlertDescription>
        </Alert>
      )}

      <div className='space-y-4'>
        {/* Email Field */}
        <div className='space-y-2'>
          <Label
            htmlFor='email'
            className='text-[14px] font-[600] text-[var(--text)]'
          >
            Email *
          </Label>
          <div className='relative'>
            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <Input
              id='email'
              type='email'
              placeholder='Enter your email'
              {...register('email', {
                onChange: handleInputChange,
              })}
              className={`pl-10 h-12 border-2 focus:ring-green-500 bg-white rounded-[10px] ${
                errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[var(--border-dark)] focus:border-green-500'
              }`}
              disabled={isLoading}
              autoComplete='email'
            />
          </div>
          {errors.email && (
            <p className='text-sm text-red-600 mt-1'>{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className='space-y-2'>
          <Label
            htmlFor='password'
            className='text-[14px] font-[600] text-[var(--text)]'
          >
            Password *
          </Label>
          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              {...register('password', {
                onChange: handleInputChange,
              })}
              className={`pl-10 pr-10 h-12 border-2 focus:ring-green-500 bg-white rounded-[10px] ${
                errors.password
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[var(--border-dark)] focus:border-green-500'
              }`}
              disabled={isLoading}
              autoComplete='current-password'
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              disabled={isLoading}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed'
            >
              {showPassword ? (
                <EyeOff className='h-5 w-5' />
              ) : (
                <Eye className='h-5 w-5' />
              )}
            </button>
          </div>
          {errors.password && (
            <p className='text-sm text-red-600 mt-1'>
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {/* Forgot Password Link */}
      <div className='text-right'>
        <a
          href='#'
          className='text-[16px] text-[var(--text)] hover:text-green-600 transition-colors'
          onClick={e => e.preventDefault()}
        >
          Forgot Password?
        </a>
      </div>

      {/* Login Button */}
      <Button
        type='submit'
        disabled={isLoading || !isValid || !isDirty}
        className='w-full h-12 bg-[var(--secondary)] hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading ? (
          <div className='flex items-center justify-center'>
            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
            Logging in...
          </div>
        ) : (
          'Login'
        )}
      </Button>

      {/* Additional Help Text */}
      <div className='text-center text-sm text-gray-600'>
        <p>Make sure your backend server is running on localhost:5000</p>
      </div>
    </form>
  );
}
