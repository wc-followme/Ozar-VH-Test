'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { CompanyInfoForm } from '@/components/shared/forms/CompanyinfoForm';
import { ImageUpload } from '@/components/shared/ImageUpload';

const breadcrumbData: BreadcrumbItem[] = [
  { name: 'Company Management', href: '/company-management' },

  { name: 'Add Company' }, // current page
];

const CreateCompany = () => {
  const handleUploadClick = () => {
    console.log('Upload clicked');
  };
  return (
    <div className=''>
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbData} className='mb-5' />

      {/* Main Content */}
      <div className=''>
        <div className='flex items-start md:flex-col lg:flex-row gap-6'>
          {/* Left Column - Upload Photo */}
          <div className='w-[412px] flex-shrink-0 bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-[1rem]'>
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
          <div className='flex-1 w-full bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-[28px]'>
            <CompanyInfoForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCompany;
