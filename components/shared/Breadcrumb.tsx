'use client';

import { cn } from '@/lib/utils';
import { ArrowRight2 } from 'iconsax-react';
import Link from 'next/link';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label='breadcrumb'
      className={cn(
        'flex items-center text-sm text-muted-foreground',
        className
      )}
    >
      <ol className='inline-flex items-center space-x-1'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className='inline-flex items-center'>
              {index > 0 && (
                <ArrowRight2 size='16' color='var(--text-secondary)' />
              )}

              {isLast || !item.href ? (
                <span className='text-[var(--primary)]'>{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className='text-[var(--text-dark)] hover:underline hover:text-foreground transition-colors'
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// example of usage
{
  /* 
import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
const breadcrumbData: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Team' }, // current page
]
<Breadcrumb items={breadcrumbData} className='mb-5' />
*/
}
