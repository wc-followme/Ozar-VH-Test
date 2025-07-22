import { ACTIONS } from '@/constants/common';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import SideSheet from '@/components/shared/common/SideSheet';
import { getUserPermissionsFromStorage } from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import { Edit2, Trash } from 'iconsax-react';
import Image from 'next/image';
import { useState } from 'react';
import { Badge } from '../../ui/badge';
import Dropdown from '../common/Dropdown';

interface ToolCardProps {
  image: string;
  name: string;
  brand: string;
  quantity: number;
  videoCount: number;
  onDelete: () => void;
}

export default function ToolCard({
  image,
  name,
  brand,
  quantity,
  videoCount,
  onDelete,
}: ToolCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Get user permissions for tools
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.tools?.edit;
  const canArchive = userPermissions?.tools?.archive;
  
  // Filter menu options based on permissions
  const menuOptions = [
    { label: 'Edit', action: ACTIONS.EDIT, icon: Edit2 },
    { label: 'Archive', action: ACTIONS.ARCHIVE, icon: Trash },
  ];
  
  const filteredMenuOptions = menuOptions.filter(option => {
    if (option.action === ACTIONS.EDIT) {
      return canEdit;
    }
    if (option.action === ACTIONS.DELETE || option.action === ACTIONS.ARCHIVE) {
      return canArchive;
    }
    return true; // Show other actions by default
  });
  
  // Only show menu if there are any visible options
  const showMenu = filteredMenuOptions.length > 0;

  return (
    <div className='bg-[var(--card-background)] hover:shadow-lg rounded-2xl p-2.5 flex flex-col border border-[var(--border-dark)] min-h-[6.25rem] relative transition-all'>
      <div className='flex gap-3'>
        {/* Image */}
        <div className='w-[60px] h-[60px] rounded-[12px] overflow-hidden bg-[var(--border-light)] flex items-center justify-center flex-shrink-0'>
          <Image
            src={
              imgError
                ? '/images/tools-management/tools-img-1.png'
                : image || '/images/tools-management/tools-img-1.png'
            }
            alt={name}
            width={60}
            height={60}
            className='w-full h-full object-cover'
            onError={() => setImgError(true)}
          />
        </div>

        {/* Tool Info */}
        <div className='flex-1 min-w-0'>
          <h3 className='font-bold text-[var(--text)] truncate text-base mb-1'>
            {name}
          </h3>
          <p className='text-sm text-[var(--text-secondary)] mb-2'>
            {brand}
          </p>
          <div className='flex items-center gap-2'>
            <Badge className='bg-[var(--border-light)] text-[var(--text)] text-xs px-2 py-1'>
              Qty: {quantity}
            </Badge>
            <Badge className='bg-[var(--border-light)] text-[var(--text)] text-xs px-2 py-1'>
              {videoCount} Video{videoCount !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        {/* Menu */}
        {showMenu && (
          <div className='absolute top-2.5 right-2'>
            <Dropdown
              menuOptions={filteredMenuOptions}
              onAction={action => {
                if (action === ACTIONS.EDIT) alert('Edit clicked');
                if (action === ACTIONS.ARCHIVE) setShowDelete(true);
              }}
              trigger={
                <button className='h-8 w-8 p-0 flex items-center justify-center rounded-full'>
                  <IconDotsVertical
                    className='!w-6 !h-6'
                    strokeWidth={2}
                    color='var(--text-dark)'
                  />
                </button>
              }
              align='end'
            />
            <ConfirmDeleteModal
              open={showDelete}
              title={`Are you sure you want to archive "${name}"?`}
              subtitle={`This action cannot be undone.`}
              onCancel={() => setShowDelete(false)}
              onDelete={() => {
                setShowDelete(false);
                onDelete();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
