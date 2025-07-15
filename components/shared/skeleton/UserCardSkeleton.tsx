import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const UserCardSkeleton: React.FC = () => (
  <div className='bg-[var(--card-background)] rounded-[12px] border border-[var(--border-dark)] p-[10px] w-full hover:shadow-lg transition-shadow duration-200 min-h-[150px] flex flex-col'>
    {/* Header with Avatar, User Info and Menu */}
    <div className='flex items-start gap-4 mb-2'>
      {/* Avatar */}
      <Skeleton className='w-20 h-20 rounded-[10px] bg-[var(--skeleton-color)]' />
      <div className='flex-1 min-w-0 flex flex-col gap-2'>
        {/* Name */}
        <Skeleton className='h-5 w-2/3 rounded bg-[var(--skeleton-color)]' />
        {/* Role */}
        <Skeleton className='h-3 w-1/3 rounded bg-[var(--skeleton-color)]' />
        {/* Phone */}
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-4 rounded bg-[var(--skeleton-color)]' />
          <Skeleton className='h-3 w-20 rounded bg-[var(--skeleton-color)]' />
        </div>
        {/* Email */}
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-4 rounded bg-[var(--skeleton-color)]' />
          <Skeleton className='h-3 w-28 rounded bg-[var(--skeleton-color)]' />
        </div>
      </div>
      {/* Menu */}
      <Skeleton className='h-8 w-8 rounded-full bg-[var(--skeleton-color)] flex-shrink-0' />
    </div>
    {/* Status Toggle */}
    <div className='flex items-center justify-between bg-[var(--border-light)] rounded-[30px] py-2 px-3 mt-auto'>
      <Skeleton className='h-3 w-12 rounded bg-[var(--skeleton-color)]' />
      <Skeleton className='h-4 w-9 rounded-full bg-[var(--skeleton-color)]' />
    </div>
  </div>
);

export default UserCardSkeleton;
