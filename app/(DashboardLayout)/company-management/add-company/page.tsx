'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { UserInfoForm } from '@/components/shared/forms/UsrinfoForm';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const CreateCompany = () => {
  const router = useRouter();
  const handleUploadClick = () => {
    console.log('Upload clicked');
  };
  const handleCreateClick = () => {
    router.push('/company-management/company-details');
  };
  return (
    <div className=''>
      {/* Breadcrumb */}
      <div className='flex items-center text-sm text-gray-500 mb-6 mt-2'>
        <span className='text-[var(--text-dark)] text-[14px] font-normal'>
          Company Management
        </span>
        <ChevronRight className='h-4 w-4 mx-2' />
        <span className='text-[var(--primary)] text-[14px] font-normal'>
          Add Company
        </span>
      </div>

      {/* Main Content */}
      <div className=''>
        <div className='flex items-start gap-6'>
          {/* Left Column - Upload Photo */}
          <div className='w-[412px] flex-shrink-0 bg-[var(--white-background)] rounded-[20px] border border-[var(--border-dark)] p-[1rem]'>
            <ImageUpload
              onClick={handleUploadClick}
              label='Upload your company logo'
              text={
                <>
                  1600 x 1200 (4:3) recommended. <br /> PNG and JPG files are
                  allowed
                </>
              }
              // icon={<ChevronRight className='h-4 w-4 mx-2' />}
              className='h-[280px]'
            />
          </div>

          {/* Right Column - Form Fields */}
          <div className='flex-1 bg-[var(--white-background)] rounded-[20px] border border-[var(--border-dark)] p-[28px]'>
            <UserInfoForm />
            {/* Action Buttons */}
            <div className='flex justify-end gap-6 mt-8'>
              <Link
                href={'/company-management'}
                className='inline-flex items-center h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)]'
              >
                Cancel
              </Link>
              <Button
                className='h-[48px] px-12 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white'
                onClick={handleCreateClick}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCompany;
