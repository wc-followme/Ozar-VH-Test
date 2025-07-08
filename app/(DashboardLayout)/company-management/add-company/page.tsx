'use client';

import { ImageUpload } from '@/components/shared/ImageUpload';
import { ChevronRight } from 'lucide-react';
import { CompanyInfoForm } from '../../../../components/shared/forms/CompanyinfoForm';

const CreateCompany = () => {
  const handleUploadClick = () => {
    console.log('Upload clicked');
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
            <CompanyInfoForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCompany;
