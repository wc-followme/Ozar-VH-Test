import { Skeleton } from '@/components/ui/skeleton';
import { IconSortAZ } from '@tabler/icons-react';
import React from 'react';

const TradeCardSkeleton: React.FC = () => (
  <div className='bg-[var(--card-background)] rounded-xl p-2.5 flex flex-col border border-[var(--border-dark)] min-h-[5rem] relative'>
    <div className='flex gap-4'>
      <Skeleton className='w-[3.75rem] h-[3.75rem] rounded-[0.625rem] bg-[var(--bg-skeleton)] flex items-center justify-center'>
        <IconSortAZ
          size={30}
          color='var(--white-background)'
          className='opacity-40'
        />
      </Skeleton>
      <div className='flex flex-col justify-center flex-1 min-w-0 pt-1.5'>
        <Skeleton className='h-4 w-12 mb-4 rounded bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-[18px] w-24 rounded-2xl bg-[var(--bg-skeleton)] pt-1' />
        {/* <div className='flex gap-2 items-start justify-between mt-3.5'>
          <div className='leading-tight'>
            <Skeleton className='h-2 w-12 mb-1 rounded bg-[var(--bg-skeleton)]' />
            <Skeleton className='h-2.5 w-12 rounded bg-[var(--bg-skeleton)]' />
          </div>
          <div className='flex justify-between items-center pt-2'>
            <Skeleton className='h-5 w-16 rounded-full bg-[var(--bg-skeleton)]' />
          </div>
        </div> */}
      </div>
      <div className='absolute top-4 right-6'>
        <Skeleton className='h-6 w-1 rounded-full bg-[var(--bg-skeleton)]' />
      </div>
    </div>
  </div>
);

export default TradeCardSkeleton;
