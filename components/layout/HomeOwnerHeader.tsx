'use client';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Key, UserOctagon } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { cn } from '../../lib/utils';
import { SignoutIcon } from '../icons/SignoutIcon';
import { SupportIcon } from '../icons/SupportIcon';
import Dropdown from '../shared/common/Dropdown';

const menuOptions = [
  { label: 'View Profile', action: 'edit', icon: UserOctagon },
  { label: 'Change Password', action: 'changePassword', icon: Key },
  { label: 'Logout', action: 'delete', icon: SignoutIcon },
];
export function HomeOwnerHeader() {
  const { logout } = useAuth();

  // Add scroll direction state
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  // const [sideSheetOpen, setSideSheetOpen] = useState(false);
  // const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        // Scrolling down
        setShowHeader(false);
      } else {
        // Scrolling up
        setShowHeader(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuAction = (action: string) => {
    if (action === 'delete') {
      logout();
    } else if (action === 'changePassword') {
      // setChangePasswordOpen(true);
    }
    return action;
  };
  return (
    <header
      className={cn(
        'bg-[var(--white-background)] px-6 py-3 sticky top-0 z-50 transition-transform ease-in-out duration-200 w-full',
        showHeader ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className=' flex h-14 items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Link href='/' className='text-2xl font-bold'>
            Virtual Homes
          </Link>
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
