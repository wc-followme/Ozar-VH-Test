'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import { Call, Icon, Sms } from 'iconsax-react';
import { useState } from 'react';

interface MenuOption {
  label: string;
  action: string;
  variant?: 'default' | 'destructive';
  icon: Icon;
}

interface UserCardProps {
  name: string;
  role: string;
  phone: string;
  email: string;
  image: string;
  status: boolean;
  onToggle: () => void;
  menuOptions: MenuOption[];
}

export function UserCard({
  name,
  role,
  phone,
  email,
  image,
  status,
  onToggle,
  menuOptions,
}: UserCardProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    onToggle();
    setTimeout(() => setIsToggling(false), 300);
  };

  const handleMenuAction = (action: string) => {
    return action;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className='bg-[var(--white-background)] rounded-[12px] border border-[var(--border-dark)] p-[10px] hover:shadow-lg transition-shadow duration-200'>
      {/* Header with Avatar, User Info and Menu */}
      <div className='flex items-start gap-4 mb-2'>
        <Avatar className='w-20 h-20 rounded-[10px]'>
          <AvatarImage
            src={image}
            alt={name}
            className='rounded-[10px] object-cover'
          />
          <AvatarFallback className='bg-gray-100 text-gray-600 font-medium rounded-[10px]'>
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className='flex-1 min-w-0'>
          {/* User Info */}
          <div className='mb-1'>
            <h3 className='font-bold text-[var(--text)] truncate text-base'>
              {name}
            </h3>
            <p className='text-[12px] font-medium text-[var(--text-dark)]'>
              {role}
            </p>
          </div>

          {/* Contact Info */}
          <div className='space-y-1'>
            <div className='flex items-center gap-2 text-[12px] font-medium text-[var(--text-secondary)]'>
              <Call size='18' color='var(--text-dark)' />
              <span className='truncate'>{phone}</span>
            </div>
            <div className='flex items-center gap-2 text-[12px] font-medium text-[#818181]'>
              <Sms size='18' color='var(--text-dark)' variant='Outline' />
              <span className='truncate'>{email}</span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0 flex-shrink-0'
            >
              <IconDotsVertical
                className='!w-6 !h-6'
                strokeWidth={2}
                color='var(--text)'
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
          >
            {menuOptions.map((option, index) => {
              const Icon = option.icon; // ensure Icon is a capitalized component
              return (
                <DropdownMenuItem
                  key={index}
                  onClick={() => handleMenuAction(option.action)}
                  className={cn(
                    'text-sm px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2',
                    option.variant === 'destructive'
                      ? 'text-red-600 hover:bg-red-50'
                      : 'hover:bg-gray-100'
                  )}
                >
                  <Icon size='18' color='var(--text-dark)' variant='Outline' />
                  <span>{option.label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status Toggle */}
      <div className='flex items-center justify-between bg-[var(--border-light)] rounded-[30px] py-2 px-3'>
        <span className='text-[12px] font-medium text-[var(--text-dark)]'>
          Enable
        </span>
        <Switch
          checked={status}
          onCheckedChange={handleToggle}
          disabled={isToggling}
          className='
              h-4 w-9 
              data-[state=checked]:bg-green-500 
              data-[state=unchecked]:bg-gray-300
              [&>span]:h-3 
              [&>span]:w-3 
              [&>span]:bg-white 
              data-[state=checked]:[&>span]:border-green-400
              [&>span]:transition-all
              [&>span]:duration-200
            '
        />
      </div>
    </div>
  );
}
