import { Button } from '@/components/ui/button';
import { ACTIONS } from '@/constants/common';
import { getUserPermissionsFromStorage } from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import React from 'react';
import { Badge } from '../../ui/badge';
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
  module?:
    | 'categories'
    | 'roles'
    | 'users'
    | 'companies'
    | 'trades'
    | 'services'
    | 'materials'
    | 'tools'
    | 'jobs';
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

  // Handle different permission structures for different modules
  const getCanEdit = () => {
    if (!module || !userPermissions?.[module]) return true;

    switch (module) {
      case 'companies':
        return userPermissions.companies.assign_user;
      case 'users':
        return userPermissions.users.create;
      case 'jobs':
        return userPermissions.jobs.edit;
      default:
        return userPermissions[module]?.edit ?? true;
    }
  };

  const canEdit = getCanEdit();
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
        name={tradeName}
        image=''
        height={60}
        width={60}
        className='rounded-[12px] flex-shrink-0'
      />

      {/* Info */}
      <div className='flex-1 min-w-0 flex flex-col gap-2'>
        <h3 className='font-bold text-[var(--text)] truncate text-base'>
          {tradeName}
        </h3>
        <Badge className='bg-[var(--border-light)] text-[var(--text)] w-fit text-xs px-2 py-1'>
          {category}
        </Badge>
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
