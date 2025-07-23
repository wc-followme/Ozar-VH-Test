// import { ROLE_MESSAGES } from '@/app/(DashboardLayout)/role-management/role-messages';
import { Skeleton } from '@/components/ui/skeleton';
import { IconNumber123 } from '@tabler/icons-react';
import { Gallery } from 'iconsax-react';
import React from 'react';

const RoleCardSkeleton: React.FC = () => (
  <div className='flex flex-col items-start gap-4 p-6 bg-[var(--card-background)] h-full rounded-[24px] border border-[var(--border-dark)] relative'>
    {/* Top Row: Icon and Menu */}
    <div className='flex items-start justify-between w-full'>
      <Skeleton className='w-[60px] h-[60px] rounded-[16px] flex items-center justify-center bg-[var(--bg-skeleton)] mb-2'>
        <Gallery
          size={30}
          color='var(--white-background)'
          className='opacity-40'
        />
      </Skeleton>
      <Skeleton className='h-8 w-8 rounded-full bg-[var(--bg-skeleton)]' />
    </div>
    {/* Title and Description */}
    <div className='flex flex-col gap-2 w-full'>
      <Skeleton className='h-4 w-1/3 rounded bg-[var(--bg-skeleton)] mb-1' />
      <Skeleton className='h-3 w-3/5 rounded bg-[var(--bg-skeleton)]' />
    </div>
    {/* Permissions Row */}
    <div className='flex w-full items-center justify-between px-4 h-8 py-2.5 bg-[var(--border-light)] mt-auto rounded-[30px]'>
      {/* <span className='text-xs font-medium text-[var(--text)]'>
        {ROLE_MESSAGES ? 'Permissions' : ''}
      </span> */}
      <Skeleton className='h-2 w-16 rounded bg-[var(--bg-skeleton)]' />
      <IconNumber123 color='var(--bg-skeleton)' />
    </div>
  </div>
);

export default RoleCardSkeleton;
