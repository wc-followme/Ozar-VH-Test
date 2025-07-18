import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'iconsax-react';
import React from 'react';

const UserCardSkeleton: React.FC = () => (
  <div className='bg-[var(--card-background)] rounded-[12px] border border-[var(--border-dark)] p-[10px] w-full hover:shadow-lg transition-shadow duration-200 min-h-[142px] flex flex-col'>
    {/* Header with Avatar, User Info and Menu */}
    <div className='flex items-center gap-4'>
      {/* Avatar */}
      <Skeleton className='w-20 h-20 rounded-[10px] flex items-center justify-center bg-[var(--bg-skeleton)]'>
        <User
          size={40}
          color='var(--white-background)'
          className='opacity-40'
        />
      </Skeleton>
      <div className='flex-1 min-w-0 flex flex-col justify-center gap-2'>
        {/* Name */}
        <Skeleton className='h-4 w-2/3 rounded bg-[var(--bg-skeleton)] mt-1' />
        {/* Role */}
        <Skeleton className='h-2 w-1/3 rounded bg-[var(--bg-skeleton)] mb-1' />
        {/* Phone */}
        <div className='flex items-center gap-2'>
          <Skeleton className='h-3 w-3 rounded bg-[var(--bg-skeleton)]' />
          <Skeleton className='h-2 w-20 rounded bg-[var(--bg-skeleton)]' />
        </div>
        {/* Email */}
        <div className='flex items-center gap-2'>
          <Skeleton className='h-3 w-3 rounded bg-[var(--bg-skeleton)]' />
          <Skeleton className='h-2 w-10/12 rounded bg-[var(--bg-skeleton)]' />
        </div>
      </div>
      {/* Menu */}
      <Skeleton className='h-8 w-8 rounded-full bg-[var(--bg-skeleton)] flex-shrink-0 self-start' />
    </div>
    {/* Status Toggle */}
    <div className='flex items-center justify-between bg-[var(--border-light)] rounded-[30px] py-2 px-3 mt-2'>
      <Skeleton className='h-2 w-12 rounded bg-[var(--bg-skeleton)]' />
      <Skeleton className='h-4 w-9 rounded-full bg-[var(--bg-skeleton)]' />
    </div>
  </div>
);

export default UserCardSkeleton;
