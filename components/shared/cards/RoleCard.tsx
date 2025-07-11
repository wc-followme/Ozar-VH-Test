'use client';

import { ROLE_MESSAGES } from '@/app/(DashboardLayout)/role-management/role-messages';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
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

export interface RoleCardProps {
  iconSrc: React.ComponentType<{ size?: number; color?: string }>;
  iconBgColor: string;
  title: string;
  description?: string;
  permissionCount?: number;
  iconColor?: string;
  menuOptions: MenuOption[];
  onEdit?: () => void;
  onDelete?: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  iconSrc,
  iconBgColor,
  title,
  description = 'Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.',
  permissionCount = 0,
  iconColor,
  menuOptions,
  onEdit,
  onDelete,
}) => {
  const [showDelete, setShowDelete] = useState(false);

  const handleMenuAction = (action: string) => {
    if (action === 'edit' && onEdit) onEdit();
    if (action === 'delete') setShowDelete(true);
  };

  const handleConfirmDelete = () => {
    setShowDelete(false);
    if (onDelete) onDelete();
  };

  return (
    <Card className='flex flex-col items-start gap-4 p-6 bg-[var(--card-background)] rounded-[24px] border border-[var(--border-dark)] hover:shadow-lg transition-shadow duration-200'>
      <div className='flex items-start justify-between w-full'>
        <div
          className={`flex items-center justify-center w-[60px] h-[60px] rounded-[16px] mb-2`}
          style={{ color: iconColor, background: iconBgColor }}
        >
          {React.createElement(iconSrc, {
            size: 30,
            color: iconColor || '#000000',
          })}
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
              const IconComponent = option.icon; // ensure Icon is a capitalized component
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
                  <IconComponent
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

      <CardContent className='flex flex-col items-start gap-4 p-0 w-full'>
        <div className='flex flex-col gap-2 w-full'>
          <h3 className='text-base font-bold text-[var(--text)]'>{title}</h3>

          <p className='text-base text-[var(--text-secondary)] leading-tight'>
            {description}
          </p>
        </div>

        <div className='flex w-full items-center justify-between px-4 py-2 bg-[var(--border-light)] rounded-[30px]'>
          <span className='text-xs font-medium text-[var(--text)]'>
            Permissions
          </span>
          <span className='text-xs font-medium text-[var(--text)]'>
            {permissionCount}
          </span>
        </div>
      </CardContent>
      <ConfirmDeleteModal
        open={showDelete}
        title={ROLE_MESSAGES.DELETE_CONFIRM_TITLE}
        subtitle={ROLE_MESSAGES.DELETE_CONFIRM_SUBTITLE}
        onCancel={() => setShowDelete(false)}
        onDelete={handleConfirmDelete}
      />
    </Card>
  );
};
