'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CloseCircle } from 'iconsax-react';

interface SideSheetProps {
  title?: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SideSheet({
  title = 'Sidebar',
  children,
  open,
  onOpenChange, // ✅ Accept it
}: SideSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {' '}
      {/* ✅ Pass it here */}
      <SheetContent
        side='right'
        className='w-[846px] !max-w-[846px] bg-[var(--card-background)] border-0 overflow-auto'
      >
        <SheetHeader className='text-[var(--text-dark)] text-[24px] font-medium flex items-center flex-row pb-8'>
          <SheetTitle>{title}</SheetTitle>
          <Button
            variant='ghost'
            onClick={() => onOpenChange(false)} // ✅ This now works
            className='ml-auto mt-0 p-0'
          >
            <CloseCircle size='24' className='!h-6 !w-6' color='#818181' />
          </Button>
        </SheetHeader>
        <div>{children}</div>
      </SheetContent>
    </Sheet>
  );
}
