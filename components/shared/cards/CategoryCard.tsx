'use client';

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

interface CategoryCardProps {
  name: string;
  description: string;
  iconSrc: React.ComponentType<{ size?: number; color?: string }>;
  iconColor?: string;
  iconBgColor: string;
  menuOptions: MenuOption[];
  categoryUuid: string;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function CategoryCard({
  name,
  description,
  iconSrc,
  iconColor,
  iconBgColor,
  menuOptions,
  categoryUuid: _categoryUuid,
  onDelete,
  onEdit,
}: CategoryCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'edit':
        if (onEdit) {
          onEdit();
        }
        break;
      case 'delete':
        setShowDeleteModal(true);
        break;
      default:
        break;
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <Card className='flex flex-col items-start gap-4 p-6 bg-[var(--card-background)] h-full rounded-[24px] border border-[var(--border-dark)] hover:shadow-lg transition-shadow duration-200'>
        <div className='flex items-start justify-between w-full'>
          <div
            className={`flex items-center justify-center w-[60px] h-[60px] rounded-[16px] mb-2`}
            style={{ background: iconBgColor }}
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
              className='bg-[var(--card-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
            >
              {menuOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleMenuAction(option.action)}
                    className={cn(
                      'text-sm px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 hover:!bg-[var(--select-option)]',
                      option.variant === 'destructive'
                        ? 'text-red-600 hover:bg-red-50'
                        : ''
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

        <CardContent className='flex flex-col items-start gap-4 p-0 w-full flex-1'>
          <div className='flex flex-col gap-2 w-full'>
            <h3 className='text-base font-bold text-[var(--text)]'>{name}</h3>
            <p className='text-base text-[var(--text-secondary)] leading-tight'>
              {description}
            </p>
          </div>
        </CardContent>
      </Card>

      <ConfirmDeleteModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        title='Are you sure you want to archive?'
        subtitle='This action cannot be undone.'
      />
    </>
  );
}
