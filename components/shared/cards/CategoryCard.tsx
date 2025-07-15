'use client';

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

interface CategoryCardProps {
  name: string;
  description: string;
  icon: string;
  createdOn: string;
  status: boolean;
  onToggle: () => void;
  menuOptions: MenuOption[];
  isDefault?: boolean;
  categoryUuid: string;
  onDelete?: () => void;
}

export function CategoryCard({
  name,
  description,
  icon,
  createdOn,
  status,
  onToggle,
  menuOptions,
  isDefault = false,
  categoryUuid,
  onDelete,
}: CategoryCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'edit':
        router.push(`/category-management/edit-category/${categoryUuid}`);
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

  const switchStyle =
    'h-6 w-11 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300 [&>span]:h-5 [&>span]:w-5 [&>span]:bg-white data-[state=checked]:[&>span]:border-green-400 [&>span]:transition-all [&>span]:duration-200 disabled:opacity-50';

  return (
    <>
      <div className='bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-4 flex flex-col gap-4 transition-all hover:shadow-md'>
        {/* Header */}
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-3'>
            {/* Icon */}
            <div className='w-12 h-12 rounded-lg bg-[var(--secondary)] bg-opacity-10 flex items-center justify-center'>
              <i className={cn(icon, 'text-xl text-[var(--secondary)]')} />
            </div>

            {/* Category Info */}
            <div className='flex-1'>
              <h3 className='text-[var(--text-dark)] font-semibold text-lg leading-tight'>
                {name}
              </h3>
              <p className='text-[var(--text-secondary)] text-sm mt-1 line-clamp-2'>
                {description}
              </p>
            </div>
          </div>

          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 hover:bg-gray-100'
              >
                <IconDotsVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              {menuOptions.map(option => (
                <DropdownMenuItem
                  key={option.action}
                  onClick={() => handleMenuAction(option.action)}
                  className={cn(
                    'cursor-pointer',
                    option.variant === 'destructive' &&
                      'text-red-600 focus:text-red-600 focus:bg-red-50'
                  )}
                >
                  <option.icon
                    size={16}
                    color={
                      option.variant === 'destructive'
                        ? '#dc2626'
                        : 'currentColor'
                    }
                  />
                  <span className='ml-2'>{option.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between pt-2 border-t border-[var(--border-light)]'>
          <div className='text-sm text-[var(--text-secondary)]'>
            Created: {createdOn}
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-sm text-[var(--text-secondary)]'>
              {status ? 'Active' : 'Inactive'}
            </span>
            <Switch
              checked={status}
              onCheckedChange={onToggle}
              className={switchStyle}
              disabled={isDefault}
            />
          </div>
        </div>

        {isDefault && (
          <div className='text-xs text-[var(--text-secondary)] bg-[var(--background)] rounded-md px-2 py-1 text-center'>
            Default Category
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        title='Are you sure you want to delete?'
        subtitle='This action cannot be undone.'
      />
    </>
  );
}
