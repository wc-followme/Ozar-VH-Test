'use client';

import { MoveBoxIcon } from '@/components/icons/MoveBoxIcon';
import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import Dropdown from '@/components/shared/common/Dropdown';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/lib/api';
import { IconDotsVertical } from '@tabler/icons-react';
import { ClipboardClose, Setting2, UserAdd } from 'iconsax-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Job } from '../../types';
import JobDetailsSkeleton from '@/components/shared/skeleton/JobDetailsSkeleton';

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
  const params = useParams();
  const uuid = params['uuid'] as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const { showErrorToast } = useToast();

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        const response = await apiService.fetchJobById(uuid);
        if (response.data) {
          setJob(response.data);
        }
      } catch (error: any) {
        showErrorToast(error?.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };
    if (uuid) fetchJobData();
  }, [uuid, showErrorToast]);

  const breadcrumbData: BreadcrumbItem[] = [
    { name: 'Job Management', href: '/job-management' },
    { name: job?.project_id || job?.['uuid'] || 'Job Details' },
  ];

  if (loading) {
    return <JobDetailsSkeleton />;
  }
  if (!job) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-red-500'>Job not found</div>
      </div>
    );
  }

  // Fallbacks for client info
  const clientName = job.client_name || 'Client Name';
  const clientEmail = job.client_email || 'tanya.hill@example.com';
  const clientPhone = job.client_phone_number || '(239) 555-0108';
  const clientAddress =
    job.client_address || '3517 W. Gray St. Utica, Pennsylvania 57867';
  const projectImage = job.job_image || '/images/auth/login-slider-01.webp';
  const mapImage = '/images/map-placeholder.png';
  const projectId = job.project_id || 'Job#456';
  const projectName = job.project_name || 'Downtown Project';
  const category = job.category || 'Interior';
  const budget =
    job.budget !== null && job.budget !== undefined ? job.budget : 57000;
  const spent = 17200; // Static fallback

  return (
    <div className=''>
      {/* Breadcrumb */}
      <div className='flex flex-wrap items-start text-sm font-normal mb-1 w-full md:text-base md:mb-3'>
        <Breadcrumb items={breadcrumbData} className='flex-1' />
        {/* 3-dots menu */}
        <div className='ml-auto mt-2 md:mt-0'>
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
      <div className='bg-[var(--card-background)] rounded-[20px] p-4 md:p-6 flex flex-col md:flex-row md:justify-between border border-[var(--border-dark)] max-w-full gap-4 md:gap-0'>
        {/* Project Image */}
        <div className='flex-shrink-0 flex justify-center md:block mb-4 md:mb-0'>
          <Image
            src={projectImage}
            alt='Project'
            width={120}
            height={120}
            className='rounded-[8px] object-cover w-[100px] h-[100px] md:w-[120px] md:h-[120px]'
          />
        </div>
        {/* Details */}
        <div className='flex-1 px-0 md:px-6 w-full'>
          <div className='grid grid-cols-3 xl:grid-cols-5 gap-y-4 md:gap-4 border-b border-[var(--border-dark)] pb-2 mb-3'>
            <div className='min-w-0 break-words'>
              <div className='text-sm text-[var(--text-secondary)] font-normal mb-1'>
                Project ID
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {projectId}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Project Name
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {projectName}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Job category
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {category}
              </div>
            </div>
            <div className='md:col-span-2 flex flex-col md:flex-row md:items-center gap-2 min-w-0 break-words'>
              <div>
                <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                  Budget
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold text-base text-[var(--text-dark)]'>
                    ${spent.toLocaleString()}
                  </span>
                  <div className='w-32 h-2 bg-gray-200 rounded-full overflow-hidden'>
                    <div
                      className='h-2 bg-[var(--secondary)]'
                      style={{ width: `${(spent / budget) * 100}%` }}
                    />
                  </div>
                  <span className='text-[var(--text-secondary)] font-medium'>
                    ${budget.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-3 xl:grid-cols-5 gap-y-4 md:gap-4 items-start md:items-center mt-2'>
            <div className='min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Client Name
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {clientName}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Email
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {clientEmail}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Phone Number
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {clientPhone}
              </div>
            </div>
            <div className='md:col-span-2 min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Address
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {clientAddress}
              </div>
            </div>
          </div>
        </div>
        {/* Map Image */}
        <div className='flex flex-row md:flex-col items-center md:items-end gap-2 mt-4 md:mt-0'>
          <Image
            src={mapImage}
            alt='Map'
            width={100}
            height={100}
            className='rounded-[8px] object-cover w-[100px] h-[100px] md:w-[120px] md:h-[120px]'
          />
        </div>
      </div>
    </div>
  );
}
