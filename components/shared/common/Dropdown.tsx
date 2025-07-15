import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import React from 'react';

export interface DropdownOption {
  label: string;
  action: string;
  icon: React.ElementType;
}

interface DropdownProps {
  menuOptions: DropdownOption[];
  onAction: (action: string) => void;
  trigger: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  menuOptions,
  onAction,
  trigger,
  align = 'end',
  className,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild className='self-start'>
      {trigger}
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align={align}
      className={cn(
        'bg-[var(--card-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]',
        className
      )}
    >
      {menuOptions.map(({ icon: Icon, label, action }, index) => (
        <DropdownMenuItem
          key={index}
          onClick={() => onAction(action)}
          className={cn(
            'text-sm px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 hover:!bg-[var(--select-option)]'
          )}
        >
          <Icon size='18' color='var(--text-dark)' variant='Outline' />
          <span>{label}</span>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default Dropdown;
