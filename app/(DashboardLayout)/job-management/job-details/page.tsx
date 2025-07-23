'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import Dropdown from '@/components/shared/common/Dropdown';
import JobDetailsSkeleton from '@/components/shared/skeleton/JobDetailsSkeleton';
import { Button } from '@/components/ui/button';
import { IconDotsVertical } from '@tabler/icons-react';
import { ClipboardClose, Setting2, UserAdd } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MoveBoxIcon } from '../../../../components/icons/MoveBoxIcon';

const job = {
  id: 'Job#456',
  name: 'Downtown Project',
  category: 'Interior',
  budget: 57000,
  spent: 17200,
  client: {
    name: 'Client Name',
    email: 'tanya.hill@example.com',
    phone: '(239) 555-0108',
    address: '3517 W. Gray St. Utica, Pennsylvania 57867',
    image: '/public/profile.jpg',
  },
  projectImage: '/public/images/auth/login-slider-01.webp',
  mapImage: '/public/images/map-placeholder.png',
};

const dropdownMenuItems = [
  {
    label: 'Close job',
    icon: ClipboardClose,
    action: () => {},
    className:
      'text-sm px-3 py-2 rounded-md var(--text-dark) cursor-pointer transition-colors flex items-center gap-2',
  },
  {
    label: 'Add Employee',
    icon: UserAdd,
    action: () => {},
    className:
      'text-sm px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 hover:bg-gray-100',
  },
  {
    label: 'Move to Archive',
    icon: MoveBoxIcon,
    action: () => {},
    className:
      'text-sm px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 hover:bg-gray-100',
  },
  {
    label: 'Settings',
    icon: Setting2,
    action: () => {},
    className:
      'text-sm px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 hover:bg-gray-100',
  },
];

export default function JobDetailsPage() {
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState(job);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const breadcrumbData: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    { name: jobData.id },
  ];

  if (loading) {
    return <JobDetailsSkeleton />;
  }

  return (
    <div className='w-full h-full overflow-auto'>
      {/* Breadcrumb */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
        <Breadcrumb items={breadcrumbData} className='flex-1' />
        {/* 3-dots menu */}
        <div className='flex justify-end sm:ml-auto'>
          <Dropdown
            menuOptions={dropdownMenuItems.map(({ icon, label }) => ({
              icon,
              label,
              action: label,
            }))}
            onAction={action => {
              const item = dropdownMenuItems.find(i => i.label === action);
              if (item && item.action) item.action();
            }}
            trigger={
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 p-0 rotate-90'
              >
                <IconDotsVertical
                  className='!w-6 !h-6'
                  strokeWidth={2}
                  color='var(--text)'
                />
              </Button>
            }
            align='end'
          />
        </div>
      </div>
      {/* Card */}
      <div className='bg-[var(--card-background)] rounded-[20px] p-4 md:p-6 flex flex-col lg:flex-row lg:justify-between border border-[var(--border-dark)] max-w-full gap-6 job-details-card'>
        {/* Project Image */}
        <div className='flex-shrink-0 flex justify-center lg:justify-start'>
          <Image
            src='/images/auth/login-slider-01.webp'
            alt='Project'
            width={120}
            height={120}
            className='rounded-[8px] object-cover w-[100px] h-[100px] md:w-[120px] md:h-[120px] job-details-image'
          />
        </div>
        {/* Details */}
        <div className='flex-1 px-0 lg:px-6 w-full'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 border-b border-[var(--border-dark)] pb-4 mb-4 job-details-grid'>
            <div className='min-w-0 break-words'>
              <div className='text-xs sm:text-sm text-[var(--text-secondary)] font-normal mb-1 job-details-label'>
                Project ID
              </div>
              <div className='font-semibold text-sm sm:text-base text-[var(--text-dark)] job-details-text'>
                {jobData.id}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs sm:text-sm text-[var(--text-secondary)] font-normal mb-1 job-details-label'>
                Project Name
              </div>
              <div className='font-semibold text-sm sm:text-base text-[var(--text-dark)] job-details-text'>
                {jobData.name}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs sm:text-sm text-[var(--text-secondary)] font-normal mb-1 job-details-label'>
                Job category
              </div>
              <div className='font-semibold text-sm sm:text-base text-[var(--text-dark)] job-details-text'>
                {jobData.category}
              </div>
            </div>
            <div className='sm:col-span-2 lg:col-span-2 min-w-0 break-words'>
              <div className='text-xs sm:text-sm text-[var(--text-secondary)] font-normal mb-2 job-details-label'>
                Budget
              </div>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                <span className='font-semibold text-sm sm:text-base text-[var(--text-dark)] job-details-text'>
                  ${jobData.spent.toLocaleString()}
                </span>
                <div className='w-full sm:w-32 h-2 bg-gray-200 rounded-full overflow-hidden'>
                  <div
                    className='h-2 bg-[var(--secondary)]'
                    style={{
                      width: `${(jobData.spent / jobData.budget) * 100}%`,
                    }}
                  />
                </div>
                <span className='text-xs sm:text-sm text-[var(--text-secondary)] font-medium job-details-text'>
                  ${jobData.budget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start job-details-grid'>
            <div className='min-w-0 break-words'>
              <div className='text-xs sm:text-sm text-[var(--text-secondary)] font-normal mb-1 job-details-label'>
                Client Name
              </div>
              <div className='font-semibold text-sm sm:text-base text-[var(--text-dark)] job-details-text'>
                {jobData.client.name}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs sm:text-sm text-[var(--text-secondary)] font-normal mb-1 job-details-label'>
                Email
              </div>
              <div className='font-semibold text-sm sm:text-base text-[var(--text-dark)] break-all job-details-text'>
                {jobData.client.email}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs sm:text-sm text-[var(--text-secondary)] font-normal mb-1 job-details-label'>
                Phone Number
              </div>
              <div className='font-semibold text-sm sm:text-base text-[var(--text-dark)] job-details-text'>
                {jobData.client.phone}
              </div>
            </div>
            <div className='sm:col-span-2 lg:col-span-2 min-w-0 break-words'>
              <div className='text-xs sm:text-sm text-[var(--text-secondary)] font-normal mb-1 job-details-label'>
                Address
              </div>
              <div className='font-semibold text-sm sm:text-base text-[var(--text-dark)] job-details-text'>
                {jobData.client.address}
              </div>
            </div>
          </div>
        </div>
        {/* Map Image */}
        <div className='flex justify-center lg:justify-end lg:self-start lg:flex-col lg:items-end gap-2'>
          <Image
            src='/images/map-placeholder.png'
            alt='Map'
            width={100}
            height={100}
            className='rounded-[8px] object-cover w-[100px] h-[100px] md:w-[120px] md:h-[120px] job-details-image'
          />
        </div>
      </div>
    </div>
  );
}
