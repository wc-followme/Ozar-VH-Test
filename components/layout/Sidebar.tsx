'use client';
import { sidebarItems } from '@/constants/sidebar-items';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'pb-12 transition-all duration-300 ease h-screen bg-[var(--white-background)]'
      )}
    >
      <div className='space-y-4 py-3'>
        <div className='px-3'>
          {/* Burger Menu */}
          <div className='w-[60px] h-[60px] flex items-center px-[18px]'>
            <div
              className='w-[24px] h-[17px] cursor-pointer flex flex-col justify-between'
              onClick={() => setIsOpen(!isOpen)}
            >
              <span
                className={cn(
                  'block h-[2px] bg-black dark:bg-white rounded transition-transform duration-300',
                  isOpen && 'rotate-45 translate-y-[9px]'
                )}
              ></span>
              <span
                className={cn(
                  'block h-[2px] bg-black dark:bg-white rounded transition-opacity duration-300',
                  isOpen && 'opacity-0 hidden'
                )}
              ></span>
              <span
                className={cn(
                  'block h-[2px] bg-black dark:bg-white rounded transition-transform duration-300',
                  isOpen && '-rotate-45 -translate-y-[6px]'
                )}
              ></span>
            </div>
          </div>

          {/* Sidebar Links */}
          <ul className='py-2'>
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center flex-nowrap w-full px-[18px] rounded-[16px] h-[60px] text-[var(--text-dark)] transition-colors hover:bg-[var(--primary)] group',
                    pathname === item.href && 'bg-[var(--primary)] text-white'
                  )}
                >
                  <div className='stroke-[var(--text)] group-hover:text-white'>
                    <item.icon size='24' color='currentcolor' />
                  </div>
                  <span
                    className={cn(
                      'overflow-hidden text-nowrap transition-all duration-300 group-hover:text-white',
                      isOpen
                        ? 'opacity-100 ml-2 max-w-[180px]'
                        : 'opacity-0 max-w-0'
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
