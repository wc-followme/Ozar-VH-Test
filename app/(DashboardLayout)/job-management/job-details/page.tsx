'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';
import { ClipboardClose, Setting2, UserAdd } from 'iconsax-react';
import Image from 'next/image';
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
  const breadcrumbData: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    { name: job.id },
  ];
  return (
    <div className=''>
      {/* Breadcrumb */}
      <div className='flex flex-wrap items-start text-sm font-normal mb-1 w-full md:text-base md:mb-3'>
        <Breadcrumb items={breadcrumbData} className='flex-1' />
        {/* 3-dots menu */}
        <div className='ml-auto mt-2 md:mt-0'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
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
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
            >
              {dropdownMenuItems.map(item => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.label}
                    className={`hover:!bg-[var(--select-option)] ${item.className || ''}`}
                    onClick={item.action}
                  >
                    <Icon
                      size='32'
                      color='var(--text-dark)'
                      className='!h-6 !w-6'
                    />
                    {item.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Card */}
      <div className='bg-[var(--card-background)] rounded-[20px] p-4 md:p-6 flex flex-col md:flex-row md:justify-between border border-[var(--border-dark)] max-w-full gap-4 md:gap-0'>
        {/* Project Image */}
        <div className='flex-shrink-0 flex justify-center md:block mb-4 md:mb-0'>
          <Image
            src='/images/auth/login-slider-01.webp'
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
                {job.id}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Project Name
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {job.name}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Job category
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {job.category}
              </div>
            </div>
            <div className='md:col-span-2 flex flex-col md:flex-row md:items-center gap-2 min-w-0 break-words'>
              <div>
                <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                  Budget
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold text-base text-[var(--text-dark)]'>
                    ${job.spent.toLocaleString()}
                  </span>
                  <div className='w-32 h-2 bg-gray-200 rounded-full overflow-hidden'>
                    <div
                      className='h-2 bg-[var(--secondary)]'
                      style={{ width: `${(job.spent / job.budget) * 100}%` }}
                    />
                  </div>
                  <span className='text-[var(--text-secondary)] font-medium'>
                    ${job.budget.toLocaleString()}
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
                {job.client.name}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Email
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {job.client.email}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Phone Number
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {job.client.phone}
              </div>
            </div>
            <div className='md:col-span-2 min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Address
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {job.client.address}
              </div>
            </div>
          </div>
        </div>
        {/* Map Image */}
        <div className='flex flex-row md:flex-col items-center md:items-end gap-2 mt-4 md:mt-0'>
          <Image
            src='/images/map-placeholder.png'
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
