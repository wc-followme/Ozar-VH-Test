import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import MultiSelect from '../common/MultiSelect';

const CATEGORY_OPTIONS = [
  { value: 'Tub Install', label: 'Tub Install' },
  { value: 'Door Install', label: 'Door Install' },
  { value: 'Switch Board Install', label: 'Switch Board Install' },
  { value: 'Wall Texture', label: 'Wall Texture' },
  { value: 'Tile Work', label: 'Tile Work' },
  { value: 'Toilet Install', label: 'Toilet Install' },
  { value: 'Door Framing', label: 'Door Framing' },
  { value: 'Shower Install', label: 'Shower Install' },
];

interface MaterialFormProps {
  onSubmit: (data: { materialName: string; category: string }) => void;
  loading?: boolean;
  onCancel?: () => void;
}

export default function MaterialForm({
  onSubmit,
  loading,
  onCancel,
}: MaterialFormProps) {
  const [materialName, setMaterialName] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    materialName?: string;
    categories?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { materialName?: string; categories?: string } = {};
    if (categories.length === 0)
      newErrors.categories = 'At least one category is required.';
    if (!materialName) newErrors.materialName = 'Material Name is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit({ materialName, category: categories.join(', ') });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 w-full max-w-xl'>
      <div className='space-y-2'>
        <Label
          htmlFor='category'
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          Service
        </Label>
        <MultiSelect
          options={CATEGORY_OPTIONS.map(opt =>
            typeof opt === 'string' ? { value: opt, label: opt } : opt
          )}
          value={categories}
          onChange={setCategories}
          placeholder='Select Service'
          error={errors.categories || ''}
          name='category'
        />
      </div>
      <div className='space-y-2'>
        <Label
          htmlFor='materialName'
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          Material Name
        </Label>
        <Input
          id='materialName'
          value={materialName}
          onChange={e => setMaterialName(e.target.value)}
          placeholder='Enter Material Name'
          className={cn(
            'h-12 border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
            errors.materialName
              ? 'border-[var(--warning)]'
              : 'border-[var(--border-dark)]'
          )}
        />
        <FormErrorMessage message={errors.materialName || ''} />
      </div>
      <div className='pt-2 flex items-center gap-4'>
        <Button
          type='button'
          variant='outline'
          className='btn-secondary !h-12 !px-8'
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          className='btn-primary !h-12 !px-12'
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
