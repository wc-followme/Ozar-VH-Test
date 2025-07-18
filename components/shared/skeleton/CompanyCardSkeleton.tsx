import { Skeleton } from '@/components/ui/skeleton';
import { Gallery } from 'iconsax-react';
import React from 'react';

const CompanyCardSkeleton: React.FC = () => (
  <div className='bg-[var(--card-background)] rounded-[12px] border border-[var(--border-dark)] p-4 w-full mx-auto flex flex-col shadow-sm min-h-[320px] relative'>
    {/* Logo Skeleton */}
    <div className=''>
      <Skeleton className='rounded-[10px] bg-[var(--bg-skeleton)] flex justify-center w-full aspect-[1.87/1] h-[188px] items-center'>
        <Gallery
          size={100}
          color='var(--white-background)'
          className='opacity-40'
        />
      </Skeleton>
    </div>
    {/* Title and Menu */}
    <div className='flex items-center justify-between mb-4 px-1 pt-[18px]'>
      <Skeleton className='h-3 w-2/3 rounded bg-[var(--bg-skeleton)]' />
      <Skeleton className='h-7 w-7 rounded-full bg-[var(--bg-skeleton)]' />
    </div>
    {/* Dates Row */}
    <div className='flex items-center justify-between gap-2 mb-4 px-1'>
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-2 w-24 rounded bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-3 w-16 rounded bg-[var(--bg-skeleton)]' />
      </div>
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-2 w-24 rounded bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-3 w-20 rounded bg-[var(--bg-skeleton)]' />
      </div>
    </div>
    {/* Toggle Row */}
    <div className='flex items-center justify-between bg-[var(--border-light)] rounded-[30px] py-2.5 px-2.5 mt-auto'>
      <Skeleton className='h-2 w-16 rounded bg-slate-200' />
      <Skeleton className='h-4 w-10 rounded-full bg-slate-200' />
    </div>
  </div>
);

export default CompanyCardSkeleton;
