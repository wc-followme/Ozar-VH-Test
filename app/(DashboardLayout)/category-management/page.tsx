'use client';

import { Category } from '@/components/icons/Category';
import { Company } from '@/components/icons/Company';
import { FlagHookIcon } from '@/components/icons/FalgHookIcon';
import { Interior } from '@/components/icons/Interior';
import { RoleIcon } from '@/components/icons/RoleIcon';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IconDotsVertical } from '@tabler/icons-react';
import { Edit2, Hammer, Home, Trash, Wrench } from 'lucide-react';
import { useState } from 'react';

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
    icon: Home,
    iconBg: '#F58B1E',
  },
  {
    title: 'Single/Multi Trade',
    description:
      'Get help with one or more specific trades like plumbing, electrical, flooring, or carpentry.',
    icon: Hammer,
    iconBg: '#EBB402',
  },
  {
    title: 'Repair',
    description:
      'Fix issues like leaks, cracks, broken fixtures, or any small-scale home damage.',
    icon: Wrench,
    iconBg: '#00A8BF',
  },
];

const iconOptions = [
  { value: 'home', label: 'Home', icon: Home, bgColor: '#90C91D' },
  { value: 'category', label: 'Category', icon: Category, bgColor: '#24338C' },
  { value: 'company', label: 'Company', icon: Company, bgColor: '#F58B1E' },
  { value: 'role', label: 'Role', icon: RoleIcon, bgColor: '#00A8BF' },
  // Add more icons as needed
];

const CategoryManagement = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className='flex flex-col w-full items-start gap-8 p-6 overflow-y-auto'>
      <header className='flex items-center justify-between w-full'>
        <h2 className='text-2xl font-medium text-[var(--text-dark)]'>
          Category Management
        </h2>
        <button
          className='h-[42px] px-6 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white flex items-center gap-2'
          onClick={() => setOpen(true)}
        >
          Create Category
        </button>
      </header>
      <SideSheet
        title='Create Category'
        open={open}
        onOpenChange={setOpen}
        size='600px'
      >
        <div className='bg-[var(--white-background)] p-[0px] w-full'>
          <form className='space-y-6' onSubmit={e => e.preventDefault()}>
            {/* Icon & Category Name Row */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
              {/* Icon Selector */}
              <div className='space-y-2'>
                <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
                  Icon
                </Label>
                <Select>
                  <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'>
                    <SelectValue placeholder='Select icon' />
                  </SelectTrigger>
                  <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                    {iconOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className='flex items-center gap-2'>
                          <span
                            className='flex items-center justify-center w-10 h-10 rounded-[8px]'
                            style={{
                              background: `${hexToRgba(opt.bgColor, 0.15)}`,
                            }}
                          >
                            <opt.icon
                              className='w-6 h-6'
                              style={{ color: opt.bgColor }}
                            />
                          </span>
                          {opt.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Error message placeholder */}
                {/* <FormErrorMessage message={errors.icon} /> */}
              </div>
              {/* Category Name */}
              <div className='space-y-2'>
                <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
                  Category Name
                </Label>
                <Input
                  placeholder='Enter Category Name'
                  className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
                />
                {/* Error message placeholder */}
                {/* <FormErrorMessage message={errors.categoryName} /> */}
              </div>
            </div>
            {/* Description */}
            <div className='space-y-2'>
              <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
                Description
              </Label>
              <Textarea
                placeholder='Enter Description'
                className='min-h-[80px] border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
              {/* Error message placeholder */}
              {/* <FormErrorMessage message={errors.description} /> */}
            </div>
            {/* Actions */}
            <div className='flex gap-4 pt-2'>
              <Button
                type='button'
                variant='outline'
                className='h-[48px] px-8 rounded-full font-semibold text-[var(--text-dark)] border-2 border-[var(--border-dark)] bg-transparent'
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='h-[48px] px-12 bg-[#38B24D] hover:bg-[#2e9c41] rounded-full font-semibold text-white'
              >
                Create
              </Button>
            </div>
          </form>
        </div>
      </SideSheet>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          const [showDelete, setShowDelete] = useState(false);
          const menuOptions = [
            { label: 'Edit', action: 'edit', icon: Edit2 },
            {
              label: 'Delete',
              action: 'delete',
              icon: Trash,
              variant: 'destructive',
            },
          ];

          const handleMenuAction = (action: string) => {
            if (action === 'edit') {
              // TODO: Implement edit logic
              alert(`Edit ${cat.title}`);
            }
            if (action === 'delete') {
              setShowDelete(true);
            }
          };

          return (
            <div
              key={cat.title}
              className='bg-[var(--white-background)] rounded-2xl p-6 flex flex-col shadow-sm min-h-[210px] relative'
            >
              <div
                className='w-[60px] h-[60px] flex items-center justify-center rounded-[10px] mb-3.5'
                style={{
                  background: hexToRgba(cat.iconBg, 0.15),
                  color: cat.iconBg,
                }}
              >
                <Icon className='w-7 h-7' color='CurrentColor' />
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
                    <button className='h-8 w-8 p-0 flex items-center justify-center rounded-full hover:bg-gray-100'>
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
                          onClick={() => handleMenuAction(option.action)}
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
                  open={showDelete}
                  title={`Are you sure you want to delete "${cat.title}"?`}
                  subtitle={`This action cannot be undone.`}
                  onCancel={() => setShowDelete(false)}
                  onDelete={() => {
                    setShowDelete(false);
                    // TODO: Implement delete logic
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

export default CategoryManagement;
