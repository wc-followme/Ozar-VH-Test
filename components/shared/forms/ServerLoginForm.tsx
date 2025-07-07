import { serverLoginAction } from '@/app/actions/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Lock, Mail } from 'lucide-react';

interface ServerLoginFormProps {
  className?: string;
  state?: any;
}

export function ServerLoginForm({ className, state }: ServerLoginFormProps) {
  return (
    <div className={className}>
      {/* Success Message */}
      {state?.success && (
        <Alert className='mb-6 border-green-200 bg-green-50'>
          <CheckCircle className='h-4 w-4 text-green-600' />
          <AlertDescription className='text-green-800'>
            Login successful! Redirecting to dashboard...
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {!state?.success && state?.message && (
        <Alert variant='destructive' className='mb-6 border-red-200 bg-red-50'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription className='text-red-800'>
            {state.message}
          </AlertDescription>
        </Alert>
      )}

      <form action={serverLoginAction} className='space-y-6'>
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
                name='email'
                type='email'
                placeholder='Enter your email'
                className={`pl-10 h-12 border-2 focus:ring-green-500 bg-white rounded-[10px] ${
                  state?.errors?.['email']
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-[var(--border-dark)] focus:border-green-500'
                }`}
                autoComplete='email'
                required
              />
            </div>
            {state?.errors?.['email'] && (
              <p className='text-sm text-red-600 mt-1'>
                {state.errors['email']}
              </p>
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
                name='password'
                type='password'
                placeholder='Enter your password'
                className={`pl-10 pr-10 h-12 border-2 focus:ring-green-500 bg-white rounded-[10px] ${
                  state?.errors?.['password']
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-[var(--border-dark)] focus:border-green-500'
                }`}
                autoComplete='current-password'
                required
                minLength={6}
              />
            </div>
            {state?.errors?.['password'] && (
              <p className='text-sm text-red-600 mt-1'>
                {state.errors['password']}
              </p>
            )}
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
          className='w-full h-12 bg-[var(--secondary)] hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-200'
        >
          Login
        </Button>

        {/* Additional Help Text */}
        <div className='text-center text-sm text-gray-600'>
          <p>Pure server-side authentication - No client-side JavaScript</p>
        </div>
      </form>
    </div>
  );
}
