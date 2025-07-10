'use client';

import { CustomerSection } from '@/components/layout/CustomerSection';
import { ImageSlider } from '@/components/layout/ImageSlider';
import { LoginForm } from '@/components/shared/forms/LoginForm';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LoginPageContent() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  // Get redirect param if present
  const redirectTo = searchParams.get('redirect');

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    const result = await login(email, password);
    if (result.success) {
      // Redirect after login
      if (
        redirectTo &&
        redirectTo.startsWith('/') &&
        !redirectTo.startsWith('/auth/')
      ) {
        router.push(redirectTo);
      } else {
        router.push('/');
      }
    } else {
      setError(result.error || 'Login failed');
    }
    return result;
  };

  return (
    <section className='min-h-screen bg-[#FFFFFF]'>
      <div className='flex flex-col min-h-screen lg:flex-row mx-auto py-[38px] px-[30px] gap-[24px]'>
        <div className='flex-1 max-w-[676px] flex flex-col items-center justify-center bg-white gap-[24px]'>
          <div className='w-full space-y-8 flex flex-column items-center justify-center flex-1 bg-[#F5F7FA] rounded-[30px]'>
            <div className='max-w-[412px] w-full px-4'>
              {/* Logo */}
              <Image
                src='/images/logo.svg'
                height={120}
                width={120}
                alt='Company Logo'
                className='mx-auto mb-[34px]'
              />

              {/* Heading */}
              <div className='text-center space-y-2 mb-[34px]'>
                <h1 className='text-3xl lg:text-[30px] font-bold text-[#2D2D2D] mb-6 leading-tight'>
                  Join us to start turning your vision into reality!
                </h1>
                <p className='text-[var(--text-secondary)] text-[18px]'>
                  Login now to get started!
                </p>
                {redirectTo && (
                  <p className='text-sm text-blue-600'>
                    You need to login to access {redirectTo}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className='mb-6 border-red-200 bg-red-50 text-red-800 rounded p-2'>
                  {error}
                </div>
              )}

              {/* Client-side Login Form */}
              <div className='space-y-6'>
                <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
              </div>
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
