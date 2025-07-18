import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const CompanyCardSkeleton: React.FC = () => (
  <div className='bg-[var(--card-background)] rounded-[12px] border border-[var(--border-dark)] p-4 w-full mx-auto flex flex-col shadow-sm min-h-[320px] relative'>
    {/* Logo Skeleton */}
    <div className='flex justify-center mt-4 mb-10'>
      <Skeleton className='w-24 h-24 rounded-[10px] bg-[var(--skeleton-color)]' />
    </div>
    {/* Title and Menu */}
    <div className='flex items-center justify-between mb-4 px-1'>
      <Skeleton className='h-5 w-2/3 rounded bg-[var(--skeleton-color)]' />
      <Skeleton className='h-7 w-7 rounded-full bg-[var(--skeleton-color)]' />
    </div>
    {/* Dates Row */}
    <div className='flex items-center justify-between gap-2 mb-4 px-1'>
      <div className='flex flex-col gap-1'>
        <Skeleton className='h-3.5 w-24 rounded bg-[var(--skeleton-color)]' />
        <Skeleton className='h-3.5 w-16 rounded bg-[var(--skeleton-color)]' />
      </div>
      <div className='flex flex-col gap-1'>
        <Skeleton className='h-3.5 w-24 rounded bg-[var(--skeleton-color)]' />
        <Skeleton className='h-3.5 w-20 rounded bg-[var(--skeleton-color)]' />
      </div>
    </div>
    {/* Toggle Row */}
    <div className='flex items-center justify-between bg-[var(--border-light)] rounded-[30px] py-2.5 px-2.5 mt-auto'>
      <Skeleton className='h-3 w-16 rounded bg-slate-200' />
      <Skeleton className='h-4 w-12 rounded-full bg-slate-200' />
    </div>
  </div>
);

export default CompanyCardSkeleton;
