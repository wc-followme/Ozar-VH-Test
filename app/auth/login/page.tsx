import { htmlLoginAction } from '@/app/actions/auth';
import { CustomerSection } from '@/components/layout/CustomerSection';
import { ImageSlider } from '@/components/layout/ImageSlider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';

interface LoginPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

// Server component - checks authentication on server
export default async function LoginPage({ searchParams }: LoginPageProps) {
  // Check if user is already authenticated
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('is_authenticated')?.value === 'true';

  // Redirect if already authenticated
  if (isAuthenticated) {
    // Check if there's a redirect URL to go back to
    const redirectTo = searchParams.redirect as string;
    if (
      redirectTo &&
      redirectTo.startsWith('/') &&
      !redirectTo.startsWith('/auth/')
    ) {
      redirect(redirectTo);
    }
    redirect('/');
  }

  // Get error message and redirect info from URL parameters
  const errorMessage = searchParams.error as string;
  const emailError = searchParams.error_email as string;
  const passwordError = searchParams.error_password as string;
  const redirectTo = searchParams.redirect as string;

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
              />

              {/* Heading */}
              <div className='text-center space-y-2 mb-[34px]'>
                <h1 className='text-3xl lg:text-[30px] font-bold text-[var(--text)] leading-[1] mb-6 leading-tight'>
                  Join us to start turning your vision into reality!
                </h1>
                <p className='text-[var(--text-secondary)] text-[18px]'>
                  Login now to get started! (Pure Server-Side)
                </p>
                {redirectTo && (
                  <p className='text-sm text-blue-600'>
                    You need to login to access {redirectTo}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <Alert
                  variant='destructive'
                  className='mb-6 border-red-200 bg-red-50'
                >
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription className='text-red-800'>
                    {decodeURIComponent(errorMessage)}
                  </AlertDescription>
                </Alert>
              )}

              {/* Pure Server-Side Login Form */}
              <div className='space-y-6'>
                <form action={htmlLoginAction} className='space-y-6'>
                  {/* Hidden field to preserve redirect URL */}
                  {redirectTo && (
                    <input type='hidden' name='redirect' value={redirectTo} />
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
                          name='email'
                          type='email'
                          placeholder='Enter your email'
                          className={`pl-10 h-12 border-2 focus:ring-green-500 bg-white rounded-[10px] ${
                            emailError
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-[var(--border-dark)] focus:border-green-500'
                          }`}
                          autoComplete='email'
                          required
                        />
                      </div>
                      {emailError && (
                        <p className='text-sm text-red-600 mt-1'>
                          {decodeURIComponent(emailError)}
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
                            passwordError
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-[var(--border-dark)] focus:border-green-500'
                          }`}
                          autoComplete='current-password'
                          required
                          minLength={6}
                        />
                      </div>
                      {passwordError && (
                        <p className='text-sm text-red-600 mt-1'>
                          {decodeURIComponent(passwordError)}
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
                    <p>
                      ✅ Pure server-side authentication - Zero client
                      JavaScript
                    </p>
                  </div>
                </form>
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
