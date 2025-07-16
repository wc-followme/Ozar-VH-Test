'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { IconDotsVertical } from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import Dropdown from '../common/Dropdown';

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
  const [isPlaceholder, setIsPlaceholder] = useState(!image);

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
      className='bg-[var(--card-background)] rounded-[12px] border border-[var(--border-dark)] hover:shadow-lg px-4 py-[18px] transition-shadow duration-200 cursor-pointer'
      onClick={handleCardClick}
    >
      {/* Header with Avatar, User Info and Menu */}
      <div className=''>
        <Image
          src={image || '/images/img-placeholder-md.png'}
          alt={name}
          className={`rounded-none object-contain w-auto max-w-full h-auto max-h-full ${isPlaceholder ? ' rounded-xl' : ''}`}
          width={100}
          height={188}
          onError={e => {
            const target = e.target as HTMLImageElement;
            if (target.src !== '/images/img-placeholder-md.png') {
              target.src = '/images/img-placeholder-md.png';
              setIsPlaceholder(true);
            }
          }}
          onLoad={e => {
            const target = e.target as HTMLImageElement;
            if (target.src.includes('img-placeholder-md.png')) {
              setIsPlaceholder(true);
            } else {
              setIsPlaceholder(false);
            }
          }}
        />
        <div className='flex-1 min-w-0 pt-[18px]'>
          {/* User Info */}
          <div className='flex items-center justify-between mb-3'>
            <h3 className='font-bold text-[var(--text)] truncate text-base'>
              {name}
            </h3>
            <Dropdown
              menuOptions={filteredMenuOptions}
              onAction={handleMenuAction}
              trigger={
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
              }
              align='end'
            />
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
        {/* Status Toggle */}
        {!isDefault && (
          <div
            className='flex items-center justify-between bg-[var(--border-light)] rounded-[30px] py-2 px-3 mt-4'
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
      </div>

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
