import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import FormErrorMessage from '../common/FormErrorMessage';
import MultiSelect from '../common/MultiSelect';

const CATEGORY_OPTIONS = [
  'Full Home Build/Addition',
  'Interior',
  'Exterior',
  'Single/Multi Trade',
  'Repair',
];

interface TradeFormProps {
  onSubmit: (data: { tradeName: string; category: string }) => void;
  loading?: boolean;
  onCancel?: () => void;
}

export default function TradeForm({
  onSubmit,
  loading,
  onCancel,
}: TradeFormProps) {
  const [tradeName, setTradeName] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    tradeName?: string;
    categories?: string;
  }>({});
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleToggle = (option: string) => {
    if (categories.includes(option)) {
      setCategories(categories.filter(v => v !== option));
    } else {
      setCategories([...categories, option]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { tradeName?: string; categories?: string } = {};
    if (categories.length === 0)
      newErrors.categories = 'At least one category is required.';
    if (!tradeName) newErrors.tradeName = 'Trade Name is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit({ tradeName, category: categories.join(', ') });
    }
  };

  const displayTags = categories.slice(0, 3);
  const moreCount = categories.length - displayTags.length;

  return (
    <form onSubmit={handleSubmit} className='space-y-6 w-full max-w-xl'>
      <div className='space-y-2'>
        <Label
          htmlFor='category'
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          Category
        </Label>
        <MultiSelect
          options={CATEGORY_OPTIONS.map(opt =>
            typeof opt === 'string' ? { value: opt, label: opt } : opt
          )}
          value={categories}
          onChange={setCategories}
          placeholder='Select Category'
          error={errors.categories || ''}
          name='category'
        />
      </div>
      <div className='space-y-2'>
        <Label
          htmlFor='tradeName'
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          Trade Name
        </Label>
        <Input
          id='tradeName'
          value={tradeName}
          onChange={e => setTradeName(e.target.value)}
          placeholder='Enter Trade Name'
          className={cn(
            'h-12 border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
            errors.tradeName
              ? 'border-[var(--warning)]'
              : 'border-[var(--border-dark)]'
          )}
        />
        <FormErrorMessage message={errors.tradeName || ''} />
      </div>
      <div className='pt-2 flex items-center gap-4'>
        <Button
          type='button'
          variant='outline'
          className='h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] flex items-center'
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          className='h-[48px] px-12 bg-[var(--secondary)] hover:bg-green-600 rounded-full font-semibold text-white'
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
