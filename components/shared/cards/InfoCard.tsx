import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { IconDotsVertical } from '@tabler/icons-react';
import React, { useState } from 'react';
import Dropdown from '../common/Dropdown';

interface MenuOption {
  label: string;
  action: string;
  icon?: React.ElementType;
  variant?: 'default' | 'destructive';
}

interface InfoCardProps {
  initials: string;
  initialsBg: string;
  tradeName: string;
  category: string;
  image?: string;
  menuOptions?: MenuOption[];
  onMenuAction?: (action: string) => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  initials,
  initialsBg,
  tradeName,
  category,
  image,
  menuOptions = [],
  onMenuAction,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className='bg-[var(--card-background)] rounded-[12px] border border-[var(--border-dark)] w-full p-[10px] flex items-center gap-4 min-h-[64px] hover:shadow-md transition-shadow duration-200'>
      {/* Avatar with image, fallback to placeholder or initials */}
      <Avatar className='w-[60px] h-[60px] rounded-[10px]'>
        {image && !imgError ? (
          <AvatarImage
            src={image}
            alt={tradeName}
            className='object-cover rounded-[10px]'
            width={60}
            height={60}
            onError={() => setImgError(true)}
          />
        ) : imgError ? (
          <AvatarImage
            src='/img-placeholder-sm.png'
            alt='placeholder'
            className='object-cover rounded-[10px]'
            width={60}
            height={60}
          />
        ) : null}
        <AvatarFallback
          className={`w-full h-full flex items-center justify-center rounded-[10px] text-base font-bold ${initialsBg}`}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      {/* Info */}
      <div className='flex flex-col flex-1 min-w-0'>
        <div className='flex items-start'>
          <span className='font-semibold text-[var(--text-dark)] text-base leading-tight truncate flex-1'>
            {tradeName}
          </span>
          {/* Menu Button */}
          {menuOptions.length > 0 && (
            <Dropdown
              menuOptions={
                menuOptions.filter(
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

        <span className='text-xs text-[var(--text-dark)] bg-[var(--border-light)] rounded-full px-2 py-[2px] w-fit font-medium'>
          {category}
        </span>
      </div>
    </div>
  );
};
