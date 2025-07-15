'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { IconDotsVertical } from '@tabler/icons-react';
import { Call, Icon, Sms } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import Dropdown from '../common/Dropdown';

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
  onDelete?: () => void;
  disableActions?: boolean;
  userUuid: string;
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
  onDelete,
  disableActions,
  userUuid,
}: UserCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [imgError, setImgError] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    if (disableActions) return;
    setIsToggling(true);
    await onToggle();
    setTimeout(() => setIsToggling(false), 300);
  };

  const handleMenuAction = (action: string) => {
    if (action === 'delete') {
      setShowDelete(true);
    } else if (action === 'edit') {
      router.push(`/user-management/edit-user/${userUuid}`);
    }
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
    <div className='flex flex-col bg-[var(--card-background)] rounded-[12px] border border-[var(--border-dark)] p-[10px] hover:shadow-lg transition-shadow duration-200'>
      {/* Header with Avatar, User Info and Menu */}
      <div className='flex items-start gap-4 mb-2'>
        <Avatar className='w-20 h-20 rounded-[10px]'>
          {image && !imgError ? (
            <AvatarImage
              src={image}
              alt={name}
              className='rounded-[10px] object-cover'
              onError={() => setImgError(true)}
            />
          ) : (
            <AvatarImage
              src='/img-placeholder-sm.png'
              alt='placeholder'
              className='rounded-[10px] object-cover'
            />
          )}
          <AvatarFallback className='bg-gray-100 text-gray-600 font-medium rounded-[10px]'>
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className='flex-1 min-w-0'>
          {/* User Info */}
          <div className='flex items-start'>
            <div className='mb-1 flex-1'>
              <h3 className='font-bold text-[var(--text)] truncate text-base'>
                {name}
              </h3>
              <p className='text-[12px] font-medium text-[var(--text-dark)]'>
                {role}
              </p>
            </div>
            <Dropdown
              menuOptions={menuOptions}
              onAction={handleMenuAction}
              trigger={
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-8 w-8 p-0 flex-shrink-0'
                  disabled={disableActions}
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
      </div>

      {/* Status Toggle */}
      <div className='flex items-center mt-auto justify-between bg-[var(--border-light)] rounded-[30px] py-2 px-3'>
        <span className='text-[12px] font-medium text-[var(--text-dark)]'>
          Enable
        </span>
        <Switch
          checked={status}
          onCheckedChange={handleToggle}
          disabled={isToggling || disableActions}
          className='
              h-4 w-9 
              data-[state=checked]:bg-[var(--secondary)] 
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
      <ConfirmDeleteModal
        open={showDelete}
        title={`Are you sure you want to Archive?`}
        subtitle={`This action cannot be undone.`}
        onCancel={() => setShowDelete(false)}
        onDelete={async () => {
          setShowDelete(false);
          if (onDelete) await onDelete();
        }}
      />
    </div>
  );
}
