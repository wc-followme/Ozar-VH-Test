'use client';
import { sidebarItems } from '@/constants/sidebar-items';
import { cn, getUserPermissionsFromStorage } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Get user permissions
  const userPermissions = getUserPermissionsFromStorage();
  const canViewCategories = userPermissions?.categories?.view;

  // Filter sidebar items based on permissions
  const filteredSidebarItems = sidebarItems.filter(item => {
    if (item.title === 'Category Management') {
      return canViewCategories;
    }
    return true; // Show other items by default
  });

  return (
    <aside
      className={cn(
        'hidden lg:block pb-12 transition-all duration-300 ease h-screen bg-[var(--white-background)] sticky top-0'
      )}
    >
      <div className='space-y-4'>
        <div className='px-3 py-3 flex flex-col max-h-screen'>
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
          <ul className='py-2 [&>li+li]:mt-0.5 flex-1 overflow-auto '>
            {filteredSidebarItems.map(({ title, href, icon: Icon }, index) => (
              <li key={index}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center flex-nowrap w-full px-[18px] rounded-[16px] h-[60px] text-[var(--text-dark)] transition-colors hover:bg-[var(--primary)] group',
                    pathname === href && 'bg-[var(--primary)] text-white'
                  )}
                >
                  <div className='stroke-[var(--text)] group-hover:text-white'>
                    <Icon size='24' color='currentcolor' />
                  </div>
                  <span
                    className={cn(
                      'overflow-hidden text-nowrap transition-all duration-300 group-hover:text-white',
                      isOpen
                        ? 'opacity-100 ml-2 max-w-[180px]'
                        : 'opacity-0 max-w-0'
                    )}
                  >
                    {title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
