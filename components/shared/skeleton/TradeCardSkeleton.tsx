import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const TradeCardSkeleton: React.FC = () => (
  <div className='bg-[var(--white-background)] rounded-xl p-2.5 flex flex-col border border-[var(--border-dark)] min-h-[5rem] relative'>
    <div className='flex gap-2'>
      <Skeleton className='w-[3.75rem] h-[3.75rem] rounded-[0.625rem] bg-slate-200' />
      <div className='flex flex-col flex-1 min-w-0 pt-1.5'>
        <Skeleton className='h-[18px] w-24 mb-2.5 rounded bg-slate-200' />
        <Skeleton className='h-[18px] w-24 rounded-2xl bg-slate-200 pt-1' />
        {/* <div className='flex gap-2 items-start justify-between mt-3.5'>
          <div className='leading-tight'>
            <Skeleton className='h-2 w-12 mb-1 rounded bg-slate-200' />
            <Skeleton className='h-2.5 w-12 rounded bg-slate-200' />
          </div>
          <div className='flex justify-between items-center pt-2'>
            <Skeleton className='h-5 w-16 rounded-full bg-slate-200' />
          </div>
        </div> */}
      </div>
      <div className='absolute top-3 right-3'>
        <Skeleton className='h-7 w-2 rounded-full bg-slate-200' />
      </div>
    </div>
  </div>
);

export default TradeCardSkeleton;
