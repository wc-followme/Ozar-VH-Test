'use client';

import { FlagHookIcon } from '@/components/icons/FalgHookIcon';
import { Home } from '@/components/icons/Home';
import { HomeIcon2 } from '@/components/icons/HomeIcon2';
import { Interior } from '@/components/icons/Interior';
import { ToolsIcon } from '@/components/icons/ToolsIcon';
import { WrenchIcon } from '@/components/icons/WrenchIcon';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import SideSheet from '@/components/shared/common/SideSheet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconDotsVertical } from '@tabler/icons-react';
import { AddCircle, GalleryAdd } from 'iconsax-react';
import { Edit2, Hammer, Trash, Wrench } from 'lucide-react';
import { useRef, useState } from 'react';

function hexToRgba(hex: string, alpha: number = 0.15): string {
  let c = hex.replace('#', '');
  if (c.length === 3)
    c = c
      .split('')
      .map(x => x + x)
      .join('');
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

const categories = [
  {
    title: 'Full Home Build/Addition',
    description:
      'Start a new home from scratch or add a room, floor, or extension to your existing space.',
    icon: FlagHookIcon,
    iconBg: '#90C91D',
  },
  {
    title: 'Interior',
    description:
      'Renovate or upgrade interiors like kitchen, bathroom, living room, or complete home redesign.',
    icon: Interior,
    iconBg: '#24338C',
  },
  {
    title: 'Exterior',
    description:
      'Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.',
    icon: HomeIcon2,
    iconBg: '#F58B1E',
  },
  {
    title: 'Single/Multi Trade',
    description:
      'Get help with one or more specific trades like plumbing, electrical, flooring, or carpentry.',
    icon: ToolsIcon,
    iconBg: '#EBB402',
  },
  {
    title: 'Repair',
    description:
      'Fix issues like leaks, cracks, broken fixtures, or any small-scale home damage.',
    icon: WrenchIcon,
    iconBg: '#00A8BF',
  },
];

const iconOptions = [
  {
    value: 'star',
    label: 'Star',
    icon: Edit2,
    color: '#FFD700', // Gold color
  },
  {
    value: 'heart',
    label: 'Heart',
    icon: Hammer,
    color: '#FF0000', // Red color
  },
  {
    value: 'bolt',
    label: 'Bolt',
    icon: Home,
    color: '#1E90FF', // Blue color
  },
  {
    value: 'service',
    label: 'service',
    icon: Wrench,
    color: '#00A8BF', // Blue color
  },
];

function bytesToSize(bytes: number | undefined) {
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes <= 0) return '0 Byte';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes!) / Math.log(1024));
  return Math.round(bytes! / Math.pow(1024, i)) + ' ' + sizes[i];
}

const AddToolForm = ({ onCancel }: { onCancel: () => void }) => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [toolName, setToolName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [videos, setVideos] = useState<File[]>([]);
  const [errors, setErrors] = useState<any>({});
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: any = {};
    if (!toolName) newErrors.toolName = 'Tool name is required.';
    if (!companyName) newErrors.companyName = 'Company name is required.';
    if (!quantity) newErrors.quantity = 'Quantity is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoClick = () => {
    photoInputRef.current?.click();
  };
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) setPhoto(file);
  };
  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) setVideos(prev => [...prev, ...files]);
  };
  const handleDeleteVideo = (idx: number) => {
    setVideos(videos => videos.filter((_, i) => i !== idx));
  };
  const handleDeletePhoto = () => {
    setPhoto(null);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Submit logic here
      alert('Tool created!');
      onCancel();
    }
  };

  return (
    <form className='space-y-6' onSubmit={handleSubmit} noValidate>
      {/* Photo Upload */}
      <div>
        <input
          type='file'
          accept='image/*'
          ref={photoInputRef}
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
        <div className='mb-2'>
          <div
            className='w-full h-[120px] rounded-xl border-2 border-dashed border-cyanwave-main bg-cyanwave-light flex flex-col items-center justify-center cursor-pointer relative transition hover:bg-[#d4f1f7]'
            onClick={handlePhotoClick}
          >
            <GalleryAdd size='32' color='#00A8BF' variant='Outline' />
            <div className='mt-2 text-base font-medium text-center text-[var(--text-dark)]'>
              {photo ? photo.name : 'Upload Photo or Drag and Drop'}
            </div>
            {!photo && (
              <div className='text-sm text-gray-500 font-normal mt-1'>
                &nbsp;
              </div>
            )}
            {photo && (
              <button
                type='button'
                className='absolute top-2 right-2 rounded-full bg-white border border-gray-200 p-1 hover:bg-gray-100 shadow'
                onClick={e => {
                  e.stopPropagation();
                  handleDeletePhoto();
                }}
                aria-label='Remove photo'
              >
                <svg width='18' height='18' viewBox='0 0 20 20' fill='none'>
                  <path
                    d='M6 6L14 14M6 14L14 6'
                    stroke='#888'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Tool Name */}
      <div className='space-y-2'>
        <Label
          htmlFor='tool-name'
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          Tool Name
        </Label>
        <Input
          id='tool-name'
          placeholder='Enter Tool Name'
          value={toolName}
          onChange={e => setToolName(e.target.value)}
          className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
        />
        <FormErrorMessage message={errors.toolName} />
      </div>
      {/* Tool Company Name */}
      <div className='space-y-2'>
        <Label
          htmlFor='company-name'
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          Tool Company Name
        </Label>
        <Input
          id='company-name'
          placeholder='Enter Company Name'
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
        />
        <FormErrorMessage message={errors.companyName} />
      </div>
      {/* Quantity */}
      <div className='space-y-2'>
        <Label
          htmlFor='quantity'
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          Quantity
        </Label>
        <Input
          id='quantity'
          placeholder='Eg: 12'
          type='number'
          min={1}
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          className='h-12 border-2 border-[var(--border-dark)] focus:border-[var(--hover-bg)] focus:ring-[var(--hover-bg)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
        />
        <FormErrorMessage message={errors.quantity} />
      </div>
      {/* Video Section Label */}
      <div className='font-semibold text-[14px] text-[var(--text-dark)] mt-2 mb-1'>
        Video
      </div>
      {/* Video Upload */}
      <div>
        <input
          type='file'
          accept='video/*'
          multiple
          ref={videoInputRef}
          style={{ display: 'none' }}
          onChange={handleVideoChange}
        />
        <div className='mb-2'>
          <div
            className='w-full h-[120px] rounded-xl border-2 border-dashed border-cyanwave-main bg-cyanwave-light flex flex-col items-center justify-center cursor-pointer relative transition'
            onClick={handleVideoClick}
          >
            <svg width='32' height='32' fill='none' viewBox='0 0 24 24'>
              <rect width='24' height='24' rx='12' fill='#00A8BF26' />
              <path
                d='M8 8.5C8 7.11929 9.11929 6 10.5 6H13.5C14.8807 6 16 7.11929 16 8.5V15.5C16 16.8807 14.8807 18 13.5 18H10.5C9.11929 18 8 16.8807 8 15.5V8.5Z'
                stroke='#00A8BF'
                strokeWidth='1.5'
              />
              <path
                d='M16 10L19 8.5V15.5L16 14'
                stroke='#00A8BF'
                strokeWidth='1.5'
              />
            </svg>
            <div className='mt-2 text-base font-semibold text-bondiblue-light text-[var(--text-dark)]'>
              Upload Video or Drag and Drop
            </div>
          </div>
        </div>
        {/* Uploaded videos list */}
        <div className='flex gap-4 flex-wrap mt-4'>
          {videos.map((file, idx) => (
            <div
              key={idx}
              className='flex items-center bg-white rounded-xl border border-[#E6E6E6] shadow-sm px-3 py-2 min-w-[220px] max-w-[260px] w-full gap-3 relative'
            >
              <div className='relative w-14 h-14 flex-shrink-0'>
                <video
                  width='56'
                  height='56'
                  className='rounded-lg object-cover w-14 h-14 bg-black'
                  src={URL.createObjectURL(file)}
                />
                <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                  <svg width='32' height='32' fill='none' viewBox='0 0 24 24'>
                    <circle
                      cx='12'
                      cy='12'
                      r='12'
                      fill='white'
                      fillOpacity='0.7'
                    />
                    <polygon points='10,8 16,12 10,16' fill='#00A8BF' />
                  </svg>
                </div>
              </div>
              <div className='flex flex-col flex-1 min-w-0'>
                <span className='truncate font-semibold text-base text-[var(--text-dark)]'>
                  {file.name}
                </span>
                <span className='text-xs text-[#A0A0A0] font-medium'>
                  {bytesToSize(file.size)}
                </span>
              </div>
              <button
                type='button'
                className='ml-2 p-1 rounded-full hover:bg-gray-100 transition'
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteVideo(idx);
                }}
                aria-label='Remove video'
              >
                <Trash size={20} color='#A0A0A0' />
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className='flex items-center gap-4 mt-0'>
        <Button
          type='button'
          className='h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] flex items-center text-base'
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          className='h-[48px] px-12 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white text-base'
        >
          Create
        </Button>
      </div>
    </form>
  );
};

const ToolsManagement = () => {
  const [open, setOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('star');
  const [showDeleteIdx, setShowDeleteIdx] = useState<number | null>(null);
  return (
    <section className='flex flex-col w-full items-start gap-8 p-6 overflow-y-auto'>
      <header className='flex items-center justify-between w-full'>
        <h2 className='text-2xl font-medium text-[var(--text-dark)]'>
          Tools Management
        </h2>
        <button
          className='h-[42px] px-6 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white flex items-center gap-2'
          onClick={() => setOpen(true)}
        >
          <AddCircle
            size='32'
            color='currentColor'
            className='!w-[1.375rem] !h-[1.375rem]'
          />
          <span>Add Tools</span>
        </button>
      </header>
      <SideSheet
        title='Add Tool'
        open={open}
        onOpenChange={setOpen}
        // size='600px'
      >
        <div className='bg-[var(--white-background)] p-6 w-full'>
          <AddToolForm onCancel={() => setOpen(false)} />
        </div>
      </SideSheet>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          const menuOptions = [
            { label: 'Edit', action: 'edit', icon: Edit2 },
            {
              label: 'Delete',
              action: 'delete',
              icon: Trash,
              variant: 'destructive',
            },
          ];
          return (
            <div
              key={cat.title}
              className='bg-[var(--white-background)] rounded-2xl p-6 flex flex-col shadow-sm min-h-[210px] relative'
            >
              <div
                className='w-[60px] h-[60px] flex items-center justify-center rounded-[16px] mb-3.5'
                style={{
                  background: hexToRgba(cat.iconBg, 0.15),
                  color: cat.iconBg,
                }}
              >
                <Icon className='w-8 h-8' color='CurrentColor' />
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)] mb-1.5'>
                {cat.title}
              </div>
              <div className='text-gray-500 text-base leading-snug'>
                {cat.description}
              </div>
              {/* DropdownMenu for actions */}
              <div className='absolute top-4 right-4 cursor-pointer'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className='h-8 w-8 p-0 flex items-center justify-center rounded-full '>
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
                          onClick={() => {
                            if (option.action === 'edit') {
                              alert(`Edit ${cat.title}`);
                            } else if (option.action === 'delete') {
                              setShowDeleteIdx(idx);
                            }
                          }}
                          className={`text-sm px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 ${option.variant === 'destructive' ? ' hover:bg-red-50' : 'hover:bg-gray-100'}`}
                        >
                          <MenuIcon size='18' color='var(--text-dark)' />
                          <span>{option.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
                <ConfirmDeleteModal
                  open={showDeleteIdx === idx}
                  title={`Are you sure you want to delete "${cat.title}"?`}
                  subtitle={`This action cannot be undone.`}
                  onCancel={() => setShowDeleteIdx(null)}
                  onDelete={() => {
                    setShowDeleteIdx(null);
                    alert(`Deleted ${cat.title}`);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ToolsManagement;
