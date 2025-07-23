import { Skeleton } from '@/components/ui/skeleton';
import { Gallery, Map1 } from 'iconsax-react';
import React from 'react';

const JobDetailsSkeleton: React.FC = () => (
  <div className='w-full'>
    {/* Breadcrumb Skeleton */}
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
      <div className='flex items-center gap-2'>
        <Skeleton className='h-4 w-16 rounded-full bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-4 w-4 rounded-full bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-4 w-24 rounded-full bg-[var(--bg-skeleton)]' />
      </div>
      <Skeleton className='h-8 w-8 rounded-full bg-[var(--bg-skeleton)]' />
    </div>

    {/* Main Card Skeleton */}
    <div className='bg-[var(--card-background)] rounded-[20px] p-4 md:p-6 flex flex-col lg:flex-row lg:justify-between border border-[var(--border-dark)] max-w-full gap-6'>
      {/* Project Image Skeleton */}
      <div className='flex-shrink-0 flex justify-center lg:justify-start'>
        <Skeleton className='w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-2xl flex items-center justify-center bg-[var(--bg-skeleton)]'>
          <Gallery
            size={60}
            color='var(--white-background)'
            className='opacity-40'
          />
        </Skeleton>
      </div>

      {/* Details Skeleton */}
      <div className='flex-1 px-0 lg:px-6 w-full'>
        {/* First Grid Row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 border-b border-[var(--border-dark)] pb-6 mb-6'>
          <div className='min-w-0 break-words'>
            <Skeleton className='h-3 w-16 rounded-full bg-[var(--bg-skeleton)] mb-4' />
            <Skeleton className='h-4 w-20 rounded-full bg-[var(--bg-skeleton)]' />
          </div>
          <div className='min-w-0 break-words'>
            <Skeleton className='h-3 w-20 rounded-full bg-[var(--bg-skeleton)] mb-4' />
            <Skeleton className='h-4 w-24 rounded-full bg-[var(--bg-skeleton)]' />
          </div>
          <div className='min-w-0 break-words'>
            <Skeleton className='h-3 w-18 rounded-full bg-[var(--bg-skeleton)] mb-4' />
            <Skeleton className='h-4 w-16 rounded-full bg-[var(--bg-skeleton)]' />
          </div>
          <div className='sm:col-span-2 lg:col-span-2 min-w-0 break-words'>
            <Skeleton className='h-3 w-12 rounded-full bg-[var(--bg-skeleton)] mb-4' />
            <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
              <Skeleton className='h-4 w-16 rounded-full bg-[var(--bg-skeleton)]' />
              <Skeleton className='w-full sm:w-32 h-2 rounded-full bg-[var(--bg-skeleton)]' />
              <Skeleton className='h-4 w-20 rounded-full bg-[var(--bg-skeleton)]' />
            </div>
          </div>
        </div>

        {/* Second Grid Row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start'>
          <div className='min-w-0 break-words'>
            <Skeleton className='h-3 w-20 rounded-full bg-[var(--bg-skeleton)] mb-4' />
            <Skeleton className='h-4 w-24 rounded-full bg-[var(--bg-skeleton)]' />
          </div>
          <div className='min-w-0 break-words'>
            <Skeleton className='h-3 w-8 rounded-full bg-[var(--bg-skeleton)] mb-4' />
            <Skeleton className='h-4 w-32 rounded-full bg-[var(--bg-skeleton)]' />
          </div>
          <div className='min-w-0 break-words'>
            <Skeleton className='h-3 w-22 rounded-full bg-[var(--bg-skeleton)] mb-4' />
            <Skeleton className='h-4 w-28 rounded-full bg-[var(--bg-skeleton)]' />
          </div>
          <div className='sm:col-span-2 lg:col-span-2 min-w-0 break-words'>
            <Skeleton className='h-3 w-12 rounded bg-[var(--bg-skeleton)] mb-4' />
            <Skeleton className='h-4 w-full rounded bg-[var(--bg-skeleton)]' />
          </div>
        </div>
      </div>

      {/* Map Image Skeleton */}
      <div className='flex justify-center lg:justify-end lg:flex-col lg:items-end gap-2'>
        <Skeleton className='w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-xl bg-[var(--bg-skeleton)] flex items-center justify-center'>
          <Map1
            size={60}
            color='var(--white-background)'
            className='opacity-40'
          />
        </Skeleton>
      </div>
    </div>
  </div>
);

export default JobDetailsSkeleton;
