import { ACTIONS } from '@/constants/common';
import { Button } from '@/components/ui/button';
import { getUserPermissionsFromStorage } from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import React from 'react';
import { Avatar } from '../common/Avatar';
import Dropdown from '../common/Dropdown';

interface MenuOption {
  label: string;
  action: string;
  icon?: React.ElementType;
  variant?: 'default' | 'destructive';
}

interface InfoCardProps {
  initials?: string;
  initialsBg?: string;
  tradeName: string;
  category: string;
  image?: string;
  menuOptions?: MenuOption[];
  onMenuAction?: (action: string) => void;
  module?: 'categories' | 'roles' | 'users' | 'companies' | 'trades' | 'services' | 'materials' | 'tools' | 'jobs';
}

export const InfoCard: React.FC<InfoCardProps> = ({
  tradeName,
  category,
  menuOptions = [],
  onMenuAction,
  module,
}) => {
  // Get user permissions for the specified module
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = module ? userPermissions?.[module]?.edit : true;
  const canArchive = module ? userPermissions?.[module]?.archive : true;
  
  // Filter menu options based on permissions
  const filteredMenuOptions = menuOptions.filter(option => {
    if (option.action === ACTIONS.EDIT) {
      return canEdit;
    }
    if (option.action === ACTIONS.DELETE || option.action === ACTIONS.ARCHIVE) {
      return canArchive;
    }
    return true; // Show other actions by default
  });
  
  // Only show menu if there are any visible options
  const showMenu = filteredMenuOptions.length > 0;

  return (
    <div className='bg-[var(--card-background)] rounded-[12px] border border-[var(--border-dark)] w-full p-[10px] flex items-center gap-4 min-h-[64px] hover:shadow-md transition-shadow duration-200'>
      {/* Avatar */}
      <Avatar
        image=''
        height={48}
        width={48}
        className='rounded-[12px] flex-shrink-0'
      />

      {/* Info */}
      <div className='flex-1 min-w-0'>
        <h3 className='font-bold text-[var(--text)] truncate text-base'>
          {tradeName}
        </h3>
        <p className='text-sm text-[var(--text-secondary)] truncate'>
          {category}
        </p>
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
