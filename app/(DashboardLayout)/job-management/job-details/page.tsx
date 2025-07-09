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

const menuOptions = [
  { label: 'Edit', action: 'edit', variant: 'default', icon: IconDotsVertical },
  {
    label: 'Delete',
    action: 'delete',
    variant: 'destructive',
    icon: IconDotsVertical,
  },
];

export default function JobDetailsPage() {
  return (
    <div className=''>
      {/* Breadcrumb */}
      <div className='flex items-center text-sm text-[var(--text-secondary)] font-normal mb-1 mb- w-full'>
        <span>Home</span>
        <span className='mx-2'>&gt;</span>
        <a href='#' className='text-blue-600 font-medium hover:underline'>
          Job#789
        </a>
        {/* 3-dots menu */}
        <div className='ml-auto'>
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
              <DropdownMenuItem
                className={
                  'text-sm px-3 py-2 rounded-md var(--text-dark) cursor-pointer transition-colors flex items-center gap-2'
                }
              >
                <ClipboardClose
                  size='32'
                  color='var(--text-dark)'
                  className='!h-6 !w-6'
                />
                Close job
              </DropdownMenuItem>
              <DropdownMenuItem
                className={
                  'text-sm px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 hover:bg-gray-100'
                }
              >
                <UserAdd
                  size='32'
                  color='var(--text-dark)'
                  className='!h-6 !w-6'
                />
                Add Employee
              </DropdownMenuItem>
              <DropdownMenuItem
                className={
                  'text-sm px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 hover:bg-gray-100'
                }
              >
                <MoveBoxIcon className='text-[var(--text-dark)] !h-6 !w-6' />{' '}
                Move to Archive
              </DropdownMenuItem>
              <DropdownMenuItem
                className={
                  'text-sm px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 hover:bg-gray-100'
                }
              >
                <Setting2
                  size='32'
                  color='var(--text-dark)'
                  className='!h-6 !w-6'
                />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Card */}
      <div className='bg-[var(--card-background)] rounded-[20px] p-6 flex items-center justify-between border border-[var(--border-dark)] max-w-full'>
        {/* Project Image */}
        <div className='flex-shrink-0'>
          <Image
            src='/images/auth/login-slider-01.webp'
            alt='Project'
            width={120}
            height={120}
            className='rounded-[8px] object-cover w-[120px] h-[120px]'
          />
        </div>
        {/* Details */}
        <div className='flex-1 px-6'>
          <div className='grid grid-cols-5 gap-4 border-b border-[var(--border-dark)] pb-2 mb-3'>
            <div>
              <div className='text-sm text-[var(--text-secondary)] font-normal mb-1'>
                Project ID
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {job.id}
              </div>
            </div>
            <div>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Project Name
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {job.name}
              </div>
            </div>
            <div>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Job category
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {job.category}
              </div>
            </div>
            <div className='col-span-2 flex items-center gap-2'>
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
                      className='h-2 bg-green-500'
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
          <div className='grid grid-cols-5 gap-4 items-center'>
            <div>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Client Name
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {job.client.name}
              </div>
            </div>
            <div>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Email
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {job.client.email}
              </div>
            </div>
            <div>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                Phone Number
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {job.client.phone}
              </div>
            </div>
            <div className='col-span-2'>
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
        <div className='flex flex-col items-end gap-2'>
          <Image
            src='/images/map-placeholder.png'
            alt='Map'
            width={100}
            height={100}
            className='rounded-[8px] object-cover w-[120px] h-[120px]'
          />
        </div>
      </div>
    </div>
  );
}
