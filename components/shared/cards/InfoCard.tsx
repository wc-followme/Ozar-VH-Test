import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import React, { useState } from 'react';

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
  menuOptions?: MenuOption[];
  onMenuAction?: (action: string) => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  initials,
  initialsBg,
  tradeName,
  category,
  menuOptions = [],
  onMenuAction,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className='bg-[var(--card-background)] rounded-[12px] border border-[var(--border-dark)] w-full p-[10px] flex items-center gap-4 min-h-[64px] hover:shadow-md transition-shadow duration-200'>
      {/* Initials */}
      <div
        className={cn(
          'w-[60px] h-[60px] flex items-center justify-center rounded-[10px] text-base font-bold',
          initialsBg
        )}
      >
        {initials}
      </div>
      {/* Info */}
      <div className='flex flex-col flex-1 min-w-0'>
        <span className='font-semibold text-[var(--text-dark)] text-base leading-tight truncate'>
          {tradeName}
        </span>
        <span className='text-xs text-[var(--text-dark)] bg-[var(--border-light)] rounded-full px-2 py-[2px] mt-2 w-fit font-medium'>
          {category}
        </span>
      </div>
      {/* Menu Button */}
      {menuOptions.length > 0 && (
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild className='self-start'>
            <Button variant='ghost' size='icon' className='h-8 w-8 p-0'>
              <IconDotsVertical
                className='!w-6 !h-6'
                strokeWidth={2}
                color='var(--text)'
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='bg-[var(--card-background)] border border-[var(--border-dark)] rounded-[8px]'
          >
            {menuOptions.map((option, idx) => {
              const Icon = option.icon;
              return (
                <DropdownMenuItem
                  key={idx}
                  onClick={() => onMenuAction && onMenuAction(option.action)}
                  className={cn(
                    'text-sm px-3 py-2 rounded-md cursor-pointer flex items-center gap-2 hover:!bg-[var(--select-option)]'
                  )}
                >
                  {Icon && <Icon size={18} color='var(--text-dark)' />}
                  <span>{option.label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
