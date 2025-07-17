import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import SideSheet from '@/components/shared/common/SideSheet';
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

  return (
    <div className='bg-[var(--card-background)] hover:shadow-lg rounded-2xl p-2.5 flex flex-col border border-[var(--border-dark)] min-h-[6.25rem] relative transition-all'>
      <div className='flex gap-3'>
        <Image
          src={!image || imgError ? '/images/img-placeholder-sm.png' : image}
          alt={name}
          width={80}
          height={80}
          className='w-20 h-20 rounded-[0.625rem] object-cover'
          unoptimized
          priority
          onError={() => setImgError(true)}
        />
        <div className='flex flex-col flex-1 min-w-0 -mt-0.5'>
          <div className='font-bold text-base text-[var(--text-dark)] truncate pr-7'>
            {name}
          </div>
          <div className='text-sm text-[var(--text-secondary)] font-medium truncate leading-tight'>
            {brand}
          </div>
          <div className='flex gap-2 items-start justify-between mt-1'>
            <div className='leading-tight'>
              <span className='text-sm text-[var(--text-secondary)] font-normal'>
                Quantity
              </span>
              <div className='font-bold text-sm text-[var(--text-dark)] leading-tight'>
                {quantity}
              </div>
            </div>
            <div className='flex justify-between items-center pt-2'>
              {/* <div className='text-xs text-gray-500'>{videoCount} Video</div> */}
              <Badge className='bg-[var(--border-light)] hover:bg-[var(--border-light)] text-bg-[var(--text-dark)] px-3 py-1 font-normal rounded-full text-xs leading-tight'>
                {videoCount} Video
              </Badge>
            </div>
          </div>
        </div>
        <div className='absolute top-2.5 right-2'>
          <Dropdown
            menuOptions={[
              { label: 'Edit', action: 'edit', icon: Edit2 },
              { label: 'Archive', action: 'archive', icon: Trash },
            ]}
            onAction={action => {
              if (action === 'edit') alert('Edit clicked');
              if (action === 'archive') setShowDelete(true);
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
      </div>

      <SideSheet
        title='Edit Tool'
        open={editOpen}
        onOpenChange={setEditOpen}
        size='600px'
      >
        {/* TODO: Replace with actual edit form */}
        <div className='p-6'>Edit form goes here</div>
      </SideSheet>
    </div>
  );
}
