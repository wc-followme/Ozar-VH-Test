import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
            {menuOptions.map(({ icon: Icon, label, action }) => (
              <DropdownMenuItem
                key={label}
                onClick={() => onMenuAction && onMenuAction(action)}
                className={cn(
                  'text-sm px-3 py-2 rounded-md cursor-pointer flex items-center gap-2'
                )}
              >
                {Icon && <Icon size={18} color='var(--text-dark)' />}
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
