'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeSlash, Lock, Sms } from 'iconsax-react';
import type React from 'react';
import { useState } from 'react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-4'>
        {/* Email Field */}
        <div className='space-y-2'>
          <Label
            htmlFor='email'
            className='text-[14px] font-[600] text-[var(--text)]'
          >
            Email
          </Label>
          <div className='relative flex items-center'>
            <Sms
              size='32'
              color='#818181'
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'
            />
            <span className='bg-[#C0C6CD] w-[1px] h-5 left-10 absolute'></span>
            <Input
              id='email'
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='pl-12 h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-white rounded-[10px] !placeholder-[var(--text-placeholder)]'
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className='space-y-2'>
          <Label
            htmlFor='password'
            className='text-[14px] font-[600] text-[var(--text)]'
          >
            Password
          </Label>
          <div className='relative flex items-center'>
            <Lock
              size='32'
              color='#818181'
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'
            />
            <span className='bg-[#C0C6CD] w-[1px] h-5 left-10 absolute'></span>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='pl-12 pr-10 h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-white rounded-[10px] !placeholder-[var(--text-placeholder)]'
              required
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
            >
              {showPassword ? (
                <EyeSlash size='20' color='#818181' />
              ) : (
                <Eye size='20' color='#818181' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Link */}
      <div className='text-right'>
        <a
          href='#'
          className='text-[16px] text-[var(--text)] hover:text-green-600 transition-colors'
        >
          Forgot Password?
        </a>
      </div>

      {/* Login Button */}
      <Button
        type='submit'
        disabled={isLoading}
        className='w-full h-12 bg-[var(--secondary)] hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-200'
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
