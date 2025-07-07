'use client';
import { CustomerSection } from '@/components/layout/CustomerSection';
import { ImageSlider } from '@/components/layout/ImageSlider';
import { OptimizedLoginForm } from '@/components/shared/forms/OptimizedLoginForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/auth-context';
import { type LoginFormData } from '@/lib/validations/auth';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OptimizedLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setSuccessMessage(null);

    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        setSuccessMessage('Login successful! Redirecting to dashboard...');

        // Immediate redirect to dashboard
        router.push('/');
        return result;
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='min-h-screen'>
      <div className='flex flex-col min-h-screen lg:flex-row mx-auto py-[38px] px-[30px] gap-[24px]'>
        <div className='flex-1 max-w-[676px] flex flex-col items-center justify-center bg-white gap-[24px]'>
          <div className='w-full space-y-8 flex flex-column items-center justify-center flex-1 w-full bg-[var(--background)] rounded-[30px]'>
            <div className='max-w-[412px] w-full px-4'>
              {/* Logo */}
              <Image
                src='/images/logo.svg'
                height={120}
                width={120}
                alt='Company Logo'
                className='mx-auto mb-[34px]'
                priority
              />

              {/* Heading */}
              <div className='text-center space-y-2 mb-[34px]'>
                <h1 className='text-3xl lg:text-[30px] font-bold text-[var(--text)] leading-[1] mb-6 leading-tight'>
                  Join us to start turning your vision into reality!
                </h1>
                <p className='text-[var(--text-secondary)] text-[18px]'>
                  Login now to get started!
                </p>
              </div>

              {/* Success Message */}
              {successMessage && (
                <Alert className='mb-6 border-green-200 bg-green-50'>
                  <CheckCircle className='h-4 w-4 text-green-600' />
                  <AlertDescription className='text-green-800'>
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* Optimized Login Form */}
              <OptimizedLoginForm
                onSubmit={handleLogin}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Customer Section */}
          <CustomerSection />
        </div>

        {/* Right Section - Image Slider */}
        <ImageSlider />
      </div>
    </section>
  );
}
