'use client';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { UserOctagon } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '../../lib/utils';
import { SignoutIcon } from '../icons/SignoutIcon';
import { SupportIcon } from '../icons/SupportIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
type MenuOption = {
  label: string;
  action: string;
  icon: React.ElementType;
  variant?: 'default' | 'destructive';
};
const menuOptions = [
  { label: 'View Profile', action: 'edit', icon: UserOctagon },
  { label: 'Logout', action: 'delete', icon: SignoutIcon },
];
export function HomeOwnerHeader() {
  const handleMenuAction = (action: string) => {
    return action;
  };
  return (
    <header className='bg-[var(--white-background)] px-6 py-3 w-full'>
      <div className=' flex h-14 items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <h1 className='text-2xl font-bold'>Virtual Homes</h1>
        </div>
        <div className='flex items-center gap-6'>
          <Link href='/'>
            <SupportIcon className='text-[var(--text-dark)]' />
          </Link>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 flex-shrink-0'
              >
                <Image
                  src={'/images/profile.jpg'}
                  alt='profile'
                  width={40}
                  height={40}
                  className='h-full w-full rounded-full'
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align='end'
              className='bg-[var(--card-background)] border border-[var(--border-dark)] min-w-[185px] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px] p-[10px]'
            >
              {menuOptions.map((option: MenuOption, index: number) => {
                const Icon = option.icon; // ensure Icon is a capitalized component
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleMenuAction(option.action)}
                    className={cn(
                      'text-base p-3 rounded-md cursor-pointer text-[var(--text-dark)] transition-colors flex items-center gap-2 hover:!bg-[var(--select-option)]',
                      option.variant === 'destructive'
                        ? 'text-red-600 hover:bg-red-50'
                        : ''
                    )}
                  >
                    <Icon
                      size='40'
                      color='currentcolor'
                      variant='Outline'
                      className='!h-6 !w-6'
                    />
                    <span>{option.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
