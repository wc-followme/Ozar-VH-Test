import { Skeleton } from '@/components/ui/skeleton';
import { Gallery } from 'iconsax-react';
import React from 'react';

const ToolCardSkeleton: React.FC = () => (
  <div className='bg-[var(--white-background)] rounded-2xl p-3 flex flex-col border border-[var(--border-dark)] min-h-[6.25rem] relative'>
    <div className='flex gap-3'>
      <Skeleton className='w-20 h-20 rounded-[0.625rem] bg-slate-200 flex items-center justify-center'>
        <Gallery
          size={30}
          color='var(--white-background)'
          className='opacity-40'
        />
      </Skeleton>
      <div className='flex flex-col flex-1 justify-center min-w-0'>
        <Skeleton className='h-2 w-1/3 mb-2 rounded bg-slate-200' />
        <Skeleton className='h-2 w-1/2 mb-2 rounded bg-slate-200' />
        <div className='flex gap-2 items-start justify-between mt-3.5'>
          <div className='leading-tight'>
            <Skeleton className='h-2 w-12 mb-2 rounded bg-slate-200' />
            <Skeleton className='h-2.5 w-12 rounded bg-slate-200' />
          </div>
          <div className='flex justify-between items-center pt-2'>
            <Skeleton className='h-5 w-16 rounded-full bg-slate-200' />
          </div>
        </div>
      </div>
      <div className='absolute top-[14px] right-6'>
        <Skeleton className='h-5 w-1 rounded-full bg-slate-200' />
      </div>
    </div>
  </div>
);

export default ToolCardSkeleton;
