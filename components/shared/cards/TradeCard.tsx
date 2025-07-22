import { Button } from '@/components/ui/button';
import { cn, getUserPermissionsFromStorage } from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import React from 'react';
import Dropdown from '../common/Dropdown';

interface MenuOption {
  label: string;
  action: string;
  icon?: React.ElementType;
  variant?: 'default' | 'destructive';
}

interface TradeCardProps {
  initials: string;
  initialsBg: string;
  tradeName: string;
  category: string;
  menuOptions?: MenuOption[];
  onMenuAction?: (action: string) => void;
}

export const TradeCard: React.FC<TradeCardProps> = ({
  initials,
  initialsBg,
  tradeName,
  category,
  menuOptions = [],
  onMenuAction,
}) => {
  // Get user permissions for trades
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.trades?.edit;
  const canArchive = userPermissions?.trades?.archive;

  // Filter menu options based on permissions
  const filteredMenuOptions = menuOptions.filter(option => {
    if (option.action === 'edit') {
      return canEdit;
    }
    if (option.action === 'delete' || option.action === 'archive') {
      return canArchive;
    }
    return true; // Show other actions by default
  });

  // Only show menu if there are any visible options
  const showMenu = filteredMenuOptions.length > 0;

  return (
    <div className='bg-white rounded-[12px] border border-[var(--border-dark)] w-full p-[10px] flex items-center gap-4 min-h-[64px] hover:shadow-md transition-shadow duration-200'>
      {/* Initials */}
      <div
        className={cn(
          'w-[60px] h-[60px] flex items-center justify-center rounded-[10px] text-base font-bold',
          initialsBg
        )}
      >
        {initials}
      </div>
      {/* Trade Info */}
      <div className='flex flex-col flex-1 min-w-0'>
        <span className='font-semibold text-[var(--text-dark)] text-base leading-tight truncate'>
          {tradeName}
        </span>
        <span className='text-xs text-[var(--text-dark)] bg-[#F4F5F6] rounded-full px-3 py-[2px] mt-2 w-fit font-medium'>
          {category}
        </span>
      </div>
      {/* Menu Button */}
      {showMenu && (
        <Dropdown
          menuOptions={
            filteredMenuOptions.filter(
              (opt): opt is Required<MenuOption> => !!opt.icon
            ) as import('../common/Dropdown').DropdownOption[]
          }
          onAction={onMenuAction ?? (() => {})}
          trigger={
            <Button variant='ghost' size='icon' className='h-8 w-8 p-0'>
              <IconDotsVertical
                className='!w-6 !h-6'
                strokeWidth={2}
                color='var(--text)'
              />
            </Button>
          }
          align='end'
        />
      )}
    </div>
  );
};
