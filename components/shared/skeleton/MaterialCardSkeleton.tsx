import { Skeleton } from '@/components/ui/skeleton';

export default function MaterialCardSkeleton() {
  return (
    <div className='bg-[var(--white-background)] rounded-xl p-2.5 flex flex-col border border-[var(--border-dark)] min-h-[5rem] relative'>
      <div className='flex gap-2'>
        <Skeleton className='w-[3.75rem] h-[3.75rem] rounded-[0.625rem] bg-slate-200' />
        <div className='flex flex-col flex-1 min-w-0 pt-1.5'>
          <Skeleton className='h-[18px] w-24 mb-2.5 rounded bg-slate-200' />
          <Skeleton className='h-[18px] w-24 rounded-2xl bg-slate-200 pt-1' />
        </div>
        <div className='absolute top-3 right-3'>
          <Skeleton className='h-7 w-2 rounded-full bg-slate-200' />
        </div>
      </div>
    </div>
  );
}
