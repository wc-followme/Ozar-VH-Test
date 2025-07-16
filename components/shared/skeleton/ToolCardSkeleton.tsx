import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const ToolCardSkeleton: React.FC = () => (
  <div className='bg-[var(--white-background)] rounded-2xl p-3 flex flex-col border border-[var(--border-dark)] min-h-[6.25rem] relative'>
    <div className='flex gap-3'>
      <Skeleton className='w-16 h-16 rounded-[0.625rem] bg-slate-200' />
      <div className='flex flex-col flex-1 min-w-0'>
        <Skeleton className='h-2 w-3/4 mb-2 rounded bg-slate-200' />
        <Skeleton className='h-2 w-1/2 mb-2 rounded bg-slate-200' />
        <div className='flex gap-2 items-start justify-between mt-3.5'>
          <div className='leading-tight'>
            <Skeleton className='h-2 w-12 mb-1 rounded bg-slate-200' />
            <Skeleton className='h-2.5 w-12 rounded bg-slate-200' />
          </div>
          <div className='flex justify-between items-center pt-2'>
            <Skeleton className='h-5 w-16 rounded-full bg-slate-200' />
          </div>
        </div>
      </div>
      <div className='absolute top-3 right-3'>
        <Skeleton className='h-7 w-2 rounded-full bg-slate-200' />
      </div>
    </div>
  </div>
);

export default ToolCardSkeleton;
