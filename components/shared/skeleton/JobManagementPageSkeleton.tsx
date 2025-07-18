import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Gallery } from 'iconsax-react';
import React from 'react';

const JobCardSkeleton: React.FC = () => (
  <div className='border-1 border-[#E8EAED] shadow-sm bg-[var(--card-background)] rounded-[16px] overflow-hidden w-full min-h-[390px] flex flex-col cursor-pointer'>
    {/* Image Skeleton */}
    <div className='relative w-full h-48'>
      <Skeleton className='w-full h-full object-cover rounded-t-lg bg-[var(--bg-skeleton)] flex items-center justify-center'>
        <Gallery
          size={60}
          color='var(--white-background)'
          className='opacity-40'
        />
      </Skeleton>
      {/* Progress Badge Skeleton */}
      <div className='absolute top-3 left-3 flex items-center gap-2'>
        <Skeleton className='h-[26px] w-[50px] rounded-[30px] bg-white' />
      </div>
      {/* Action Icons Skeleton */}
      <div className='absolute right-0 bottom-0 h-[2.5rem] w-[6rem] flex justify-center items-center bg-[var(--card-background)] rounded-none rounded-tl-[20px] gap-3'>
        <Skeleton className='h-7 w-7 rounded-2xl bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-7 w-7 rounded-2xl bg-[var(--bg-skeleton)]' />
      </div>
    </div>
    {/* Card Content Skeleton */}
    <div className='p-5 flex flex-col gap-3 flex-1'>
      {/* Title and JobId */}
      <div className='mb-1'>
        <Skeleton className='h-5 w-2/3 mb-2 bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-4 w-1/3 bg-[var(--bg-skeleton)]' />
      </div>
      {/* Email */}
      <div className='flex items-center gap-2'>
        <Skeleton className='h-5 w-5 rounded bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-3 w-1/2 bg-[var(--bg-skeleton)]' />
      </div>
      {/* Address */}
      <div className='flex items-center gap-2'>
        <Skeleton className='h-5 w-5 rounded bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-3 w-3/4 bg-[var(--bg-skeleton)]' />
      </div>
      {/* Start Date and Days Left */}
      <div className='flex items-center gap-2'>
        <Skeleton className='h-5 w-5 rounded bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
        <div className='ml-auto'>
          <Skeleton className='h-6 w-24 rounded-full bg-[var(--bg-skeleton)]' />
        </div>
      </div>
    </div>
  </div>
);

const JobManagementPageSkeleton: React.FC = () => (
  <div className=''>
    {/* Stats Cards Skeleton */}
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 xl:gap-6 mb-9'>
      {[...Array(4)].map((_, i) => (
        <Card
          key={i}
          className='border-[1px] border-[var(--border-dark)] bg-[var(--card-background)] shadow-0 rounded-[20px] h-[107px]'
        >
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <Skeleton className='h-4 w-16 mb-4 mt-2 rounded bg-[var(--bg-skeleton)]'>
                  &nbsp;
                </Skeleton>
                <Skeleton className='h-3 w-24 rounded bg-[var(--bg-skeleton)]' />
              </div>
              <div className='w-10 h-10 rounded-[16px] bg-[var(--bg-skeleton)] flex items-center justify-center'>
                <Skeleton className='w-5 h-5 rounded bg-[#E0E2E5]' />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    {/* Tabs and Create Job Button Skeleton */}
    <div className='flex items-center gap-2 w-full mb-8'>
      <Skeleton className='h-[54px] rounded-full bg-[var(--bg-skeleton)] w-1/2' />
      <Skeleton className='h-[48px] w-32 rounded-full bg-[var(--bg-skeleton)] ml-auto' />
    </div>
    {/* Jobs Grid Skeleton */}
    <div className='grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6 pt-2'>
      {[...Array(8)].map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default JobManagementPageSkeleton;
