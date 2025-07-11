'use client';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { HambergerMenu, UserOctagon } from 'iconsax-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { Search } from '../icons/Search';
import { SignoutIcon } from '../icons/SignoutIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { SidebarMobile } from './SidebarMobile';
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
export function Header() {
  const { logout } = useAuth();

  // Add scroll direction state
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);

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
    }
    return action;
  };
  return (
    <header
      className={cn(
        'bg-[var(--white-background)] px-6 py-3 sticky top-0 z-50 transition-transform ease-in-out duration-200',
        showHeader ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className='flex h-14 items-center gap-3'>
        <div className='block lg:hidden'>
          <Button
            onClick={() => setSideSheetOpen(true)}
            variant='ghost'
            size='icon'
          >
            <HambergerMenu
              size='64'
              color='var(--text-dark)'
              className='!h-7 !w-7'
            />
          </Button>
          <SidebarMobile open={sideSheetOpen} onOpenChange={setSideSheetOpen} />
        </div>
        <div className='flex items-center space-x-4 mr-auto'>
          <h1 className='text-2xl font-bold'>Virtual Homes</h1>
        </div>
        <div className='flex items-center gap-6'>
          <div className='flex items-center border-2 border-[var(--border-dark)] rounded-[20px] overflow-hidden w-[280px] xl:w-[443px] focus-within:border-green-500'>
            {/* Search Input */}
            <Input
              id='Search'
              type='Search'
              placeholder='What are you looking for?'
              className='pl-4 h-12 text-[16px] border-0 focus:border-green-500 focus:ring-green-500 bg-transparent rounded-[10px] placeholder-[#C0C6CD] !placeholder-[var(--text-placeholder)]'
              required
            />
            {/* Type Selector */}
            {/* <div className="flex items-center px-3 cursor-pointer gap-1">
              <span className="text-gray-900 font-medium text-sm">{type}</span>
              <ChevronDown className=" text-gray-700" />
            </div> */}

            {/* Search Button */}
            <Button className='bg-[#263796] hover:bg-[#263796] text-white h-10 w-10 flex items-center justify-center rounded-[16px] m-1'>
              <Search />
            </Button>
          </div>
          <ModeToggle />
          {/* <Link href='/'>
            <Notification />
          </Link> */}
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
                      'text-base p-3 rounded-md cursor-pointer text-[var(--text-dark)] transition-colors flex items-center gap-2',
                      option.variant === 'destructive'
                        ? 'text-red-600 hover:bg-red-50'
                        : 'hover:bg-gray-100'
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
