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
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

interface MenuOption {
  label: string;
  action: string;
  variant?: 'default' | 'destructive';
  icon: React.ComponentType<{
    size?: string | number;
    color?: string;
    variant?: 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
  }>;
}

interface companyCardProps {
  name: string;
  createdOn: string;
  subsEnd: string;
  image: string;
  status: boolean;
  onToggle: () => void;
  menuOptions: MenuOption[];
  isDefault?: boolean;
  companyUuid: string;
  onDelete?: () => void;
}

export function CompanyCard({
  name,
  createdOn,
  subsEnd,
  image,
  status,
  onToggle,
  menuOptions,
  isDefault = false,
  companyUuid,
  onDelete,
}: companyCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setIsToggling(true);
    onToggle();
    setTimeout(() => setIsToggling(false), 300);
  };

  const handleCardClick = () => {
    router.push(`/company-management/company-details/${companyUuid}`);
  };

  const handleMenuAction = (action: string) => {
    if (action === 'edit') {
      router.push(`/company-management/edit-company/${companyUuid}`);
    } else if (action === 'delete') {
      setShowDelete(true);
    }
    // Other actions (like delete) can be handled by parent component
  };

  // Filter menu options based on isDefault
  const filteredMenuOptions = isDefault
    ? menuOptions.filter(option => option.action !== 'delete')
    : menuOptions;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div
      className='bg-[var(--card-background)] rounded-[12px] border border-[var(--border-dark)] p-[16px] hover:shadow-lg transition-shadow duration-200 cursor-pointer'
      onClick={handleCardClick}
    >
      {/* Header with Avatar, User Info and Menu */}
      <div className='mb-4'>
        <Avatar className='w-[6.25rem] h-[6.25rem] rounded-none mt-[0.875rem] mb-10 mx-auto'>
          <AvatarImage
            src={image}
            alt={name}
            className='rounded-none object-cover'
          />
          <AvatarFallback className='bg-gray-100 text-gray-600 font-medium rounded-[10px]'>
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className='flex-1 min-w-0'>
          {/* User Info */}
          <div className='flex items-center justify-between mb-3'>
            <h3 className='font-bold text-[var(--text)] truncate text-base'>
              {name}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className='-mr-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-7 w-6 p-0 flex-shrink-0 -mr-2 mt-0.5'
                  onClick={e => {
                    e.stopPropagation(); // Prevent card click when clicking menu
                  }}
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
                className='bg-[var(--card-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
              >
                {filteredMenuOptions.map((option, index) => {
                  const Icon: any = option.icon; // ensure Icon is a capitalized component
                  return (
                    <DropdownMenuItem
                      key={index}
                      onClick={e => {
                        e.stopPropagation(); // Prevent card click when clicking menu item
                        handleMenuAction(option.action);
                      }}
                      className={cn(
                        'text-sm px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 hover:!bg-[var(--select-option)]',
                        option.variant === 'destructive'
                          ? 'text-red-600 hover:bg-red-50'
                          : ''
                      )}
                    >
                      <Icon
                        size='18'
                        color='var(--text-dark)'
                        variant='Outline'
                      />
                      <span>{option.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact Info */}
          <div className='space-y-1'>
            <div className='flex items-center justify-between gap-2 text-[12px] font-medium text-[var(--text-secondary)]'>
              <p className='text-[14px] font-medium text-[var(--text-dark)] flex flex-col'>
                <span className='text-[var(--text-secondary)] '>
                  Created On
                </span>
                <span className='text-[var(--text)] '>{createdOn}</span>
              </p>
              <p className='text-[14px] font-medium text-[var(--text-dark)] flex flex-col'>
                <span className='text-[var(--text-secondary)]'>
                  Subscription Ends
                </span>
                <span className='text-[var(--text)]'>{subsEnd}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Toggle */}
      {!isDefault && (
        <div
          className='flex items-center justify-between bg-[var(--border-light)] rounded-[30px] py-2 px-3'
          onClick={e => {
            e.stopPropagation(); // Prevent card click when clicking toggle
          }}
        >
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
      )}
      <ConfirmDeleteModal
        open={showDelete}
        title='Are you sure you want to archive?'
        subtitle='This action cannot be undone.'
        onCancel={() => setShowDelete(false)}
        onDelete={async () => {
          setShowDelete(false);
          if (onDelete) await onDelete();
        }}
      />
    </div>
  );
}
