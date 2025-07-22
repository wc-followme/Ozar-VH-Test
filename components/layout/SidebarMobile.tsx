import { sidebarItems } from '@/constants/sidebar-items';
import { cn, getUserPermissionsFromStorage } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';

interface SidebarMobileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SidebarMobile({ open, onOpenChange }: SidebarMobileProps) {
  const pathname = usePathname();

  // Get user permissions
  const userPermissions = getUserPermissionsFromStorage();

  // Filter sidebar items based on permissions
  const filteredSidebarItems = sidebarItems.filter(item => {
    switch (item.title) {
      case 'Category Management':
        return userPermissions?.categories?.view;
      case 'Role Management':
        return userPermissions?.roles?.view;
      case 'User Management':
        return userPermissions?.users?.view;
      case 'Company Management':
        return userPermissions?.companies?.view;
      case 'Trade Management':
        return userPermissions?.trades?.view;
      case 'Service Management':
        return userPermissions?.services?.view;
      case 'Material Management':
        return userPermissions?.materials?.view;
      case 'Tools Management':
        return userPermissions?.tools?.view;
      case 'Jobs':
        return userPermissions?.jobs?.edit;
      case 'Home':
        return true; // Always show home
      default:
        return true; // Show other items by default
    }
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='left'
        className='p-0 w-[280px] max-w-full bg-[var(--card-background)] px-2 border-0'
      >
        <SheetTitle className='hidden'></SheetTitle>
        <nav className='py-3'>
          <ul className='py-2 [&>li+li]:mt-0.5'>
            {filteredSidebarItems.map(({ title, href, icon: Icon }, index) => (
              <li key={index}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center flex-nowrap w-full px-[8px] rounded-[8px] h-[48px] text-[var(--text-dark)] transition-colors hover:bg-[var(--primary)] group',
                    pathname === href && 'bg-[var(--primary)] text-white'
                  )}
                  onClick={() => onOpenChange(false)}
                >
                  <div className='stroke-[var(--text)] group-hover:text-white'>
                    <Icon size='24' color='currentcolor' />
                  </div>
                  <span
                    className={cn(
                      'overflow-hidden text-nowrap transition-all duration-300 group-hover:text-white ml-2 max-w-[180px] opacity-100'
                    )}
                  >
                    {title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
