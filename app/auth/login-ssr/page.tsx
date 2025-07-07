import { CustomerSection } from '@/components/layout/CustomerSection';
import { ImageSlider } from '@/components/layout/ImageSlider';
import { ServerLoginForm } from '@/components/shared/forms/ServerLoginForm';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';

// Server component - checks authentication on server
export default async function SSRLoginPage() {
  // Check if user is already authenticated
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('is_authenticated')?.value === 'true';

  // Redirect if already authenticated
  if (isAuthenticated) {
    redirect('/');
  }

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
                  Login now to get started! (Server-Side Authentication)
                </p>
              </div>

              {/* Server-Side Login Form */}
              <ServerLoginForm />
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
