import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import SideSheet from '@/components/shared/common/SideSheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';
import { Edit2, Trash } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../ui/badge';

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

  const menuOptions = [
    { label: 'Edit', action: 'edit', icon: Edit2 },
    { label: 'Delete', action: 'delete', icon: Trash, variant: 'destructive' },
  ];

  return (
    <div className='bg-[var(--card-background)] hover:shadow-lg rounded-2xl p-3 flex flex-col border border-[var(--border-dark)] min-h-[6.25rem] relative transition-all'>
      <div className='flex gap-3'>
        <img
          src={image}
          alt={name}
          className='w-16 h-16 rounded-[0.625rem] object-cover'
        />
        <div className='flex flex-col flex-1 min-w-0'>
          <div className='font-bold text-base text-[var(--text-dark)] truncate pr-7'>
            {name}
          </div>
          <div className='text-sm text-[var(--text-secondary)] font-medium truncate leading-tight'>
            {brand}
          </div>
          <div className='flex gap-2 items-start justify-between mt-1.5'>
            <div className='leading-tight'>
              <span className='text-sm text-[var(--text-secondary)] font-normal'>
                Quantity
              </span>
              <div className='font-bold text-lg text-[var(--text-dark)] leading-tight'>
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
        <div className='absolute top-3 right-3'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='h-8 w-8 p-0 flex items-center justify-center rounded-full'>
                <IconDotsVertical
                  className='!w-6 !h-6'
                  strokeWidth={2}
                  color='var(--text-dark)'
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
            >
              {menuOptions.map((option, index) => {
                const MenuIcon = option.icon;
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={
                      option.action === 'edit'
                        ? () => alert('Edit clicked')
                        : option.action === 'delete'
                          ? () => setShowDelete(true)
                          : undefined
                    }
                    className={`text-sm px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 ${option.variant === 'destructive' ? ' hover:bg-red-50' : 'hover:bg-gray-100'}`}
                  >
                    <MenuIcon size={18} color='var(--text-dark)' />
                    <span>{option.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <ConfirmDeleteModal
            open={showDelete}
            title={`Are you sure you want to delete "${name}"?`}
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
