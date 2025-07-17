'use client';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { UserOctagon } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { SignoutIcon } from '../icons/SignoutIcon';
import { SupportIcon } from '../icons/SupportIcon';
import Dropdown from '../shared/common/Dropdown';

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
          <Dropdown
            menuOptions={menuOptions}
            onAction={handleMenuAction}
            trigger={
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
            }
            align='end'
            className='min-w-[185px] p-[10px]'
          />
        </div>
      </div>
    </header>
  );
}
