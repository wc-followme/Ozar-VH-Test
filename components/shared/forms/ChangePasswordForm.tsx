import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import FormErrorMessage from '../common/FormErrorMessage';

interface ChangePasswordFormProps {
  onSubmit?: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
  loading?: boolean;
  onCancel?: () => void;
}

export default function ChangePasswordForm({
  onSubmit,
  loading,
  onCancel,
}: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!currentPassword)
      newErrors.currentPassword = 'Current password is required.';
    if (!newPassword) newErrors.newPassword = 'New password is required.';
    else if (newPassword.length < 8)
      newErrors.newPassword = 'Password must be at least 8 characters.';
    if (
      newPassword &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
        newPassword
      )
    ) {
      newErrors.newPassword =
        'Use at least 8 characters, with uppercase, lowercase, numbers, and symbols.';
    }
    if (!confirmPassword)
      newErrors.confirmPassword = 'Please confirm your new password.';
    else if (newPassword !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0 && onSubmit) {
      onSubmit({ currentPassword, newPassword, confirmPassword });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto p-0'>
      <p className='text-[16px] text-[var(--text-secondary)] mb-8'>
        Update your password to keep your account secure.
      </p>
      <div className='mb-4 space-y-2'>
        <Label
          htmlFor='currentPassword'
          className='text-[14px] font-semibold text-[var(--text-dark)] mb-1'
        >
          Current Password
        </Label>
        <Input
          id='currentPassword'
          type='password'
          placeholder='Enter Current Password'
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          className={cn(
            'h-12 border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
            errors.currentPassword
              ? 'border-[var(--warning)]'
              : 'border-[var(--border-dark)]'
          )}
        />
        <FormErrorMessage message={errors.currentPassword || ''} />
      </div>
      <div className='mb-4 space-y-2'>
        <Label
          htmlFor='newPassword'
          className='text-[14px] font-semibold text-[var(--text-dark)] mb-1'
        >
          New Password
        </Label>
        <Input
          id='newPassword'
          type='password'
          placeholder='Enter New Password'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className={cn(
            'h-12 border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
            errors.newPassword
              ? 'border-[var(--warning)]'
              : 'border-[var(--border-dark)]'
          )}
        />
        <p className='text-xs text-[var(--text-secondary)] mt-1'>
          Use at least 8 characters, with uppercase, lowercase, numbers, and
          symbols.
        </p>
        <FormErrorMessage message={errors.newPassword || ''} />
      </div>
      <div className='mb-8 space-y-2'>
        <Label
          htmlFor='confirmPassword'
          className='text-[14px] font-semibold text-[var(--text-dark)] mb-1'
        >
          Confirm New Password
        </Label>
        <Input
          id='confirmPassword'
          type='password'
          placeholder='Enter Confirm Password'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className={cn(
            'h-12 border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
            errors.confirmPassword
              ? 'border-[var(--warning)]'
              : 'border-[var(--border-dark)]'
          )}
        />
        <FormErrorMessage message={errors.confirmPassword || ''} />
      </div>
      <Button
        type='submit'
        className='w-full h-12 bg-[var(--secondary)] hover:bg-green-600 text-white font-semibold rounded-full text-base mb-6'
        disabled={loading}
      >
        Change Password
      </Button>
      <div className='text-center text-[14px] text-[var(--text-secondary)] mt-2'>
        Having trouble?{' '}
        <a
          href='#'
          className='font-semibold text-[var(--text-dark)] underline-none'
        >
          Contact support
        </a>
      </div>
    </form>
  );
}
