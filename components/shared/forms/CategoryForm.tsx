import IconFieldWrapper from '@/components/shared/common/IconFieldWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import React from 'react';

interface CategoryFormProps {
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  iconOptions: any[];
  errors: {
    icon?: string;
    categoryName?: string;
    description?: string;
  };
  categoryName: string;
  setCategoryName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  selectedIcon,
  setSelectedIcon,
  iconOptions,
  errors,
  categoryName,
  setCategoryName,
  description,
  setDescription,
  onClose,
  onSubmit,
}) => {
  return (
    <div className='p-[0px] w-full'>
      <form className='space-y-6' onSubmit={onSubmit}>
        {/* Icon & Category Name Row */}
        <div className='grid grid-cols-1 md:grid-cols-5 gap-4 w-full'>
          {/* Icon Selector */}
          <div className='space-y-2 pt-1 md:col-span-1'>
            <IconFieldWrapper
              label='Icon'
              value={selectedIcon}
              onChange={setSelectedIcon}
              iconOptions={iconOptions}
              error={errors.icon || ''}
            />
          </div>
          {/* Category Name */}
          <div className='space-y-2 md:col-span-4'>
            <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              Category Name
            </Label>
            <Input
              placeholder='Enter Category Name'
              value={categoryName}
              onChange={e => setCategoryName(e.target.value)}
              className={cn(
                'h-12 border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                errors.categoryName
                  ? 'border-[var(--warning)]'
                  : 'border-[var(--border-dark)]'
              )}
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
            value={description}
            onChange={e => setDescription(e.target.value)}
            className={cn(
              'min-h-[80px] border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
              errors.description
                ? 'border-[var(--warning)]'
                : 'border-[var(--border-dark)]'
            )}
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
            onClick={onClose}
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
  );
};

export default CategoryForm;
