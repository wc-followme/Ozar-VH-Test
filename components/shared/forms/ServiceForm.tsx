import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import MultiSelect from '../common/MultiSelect';

const TRADE_OPTIONS = [
  'Plumbing',
  'Carpenter',
  'Painting',
  'Roofer',
  'Framer',
  'Mason',
  'Drywaller',
  'Contractor',
  'Electrician',
  'Builder',
];

interface ServiceFormProps {
  onSubmit: (data: { serviceName: string; trades: string[] }) => void;
  loading?: boolean;
  onCancel?: () => void;
}

export default function ServiceForm({
  onSubmit,
  loading,
  onCancel,
}: ServiceFormProps) {
  const [serviceName, setServiceName] = useState('');
  const [trades, setTrades] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    serviceName?: string;
    trades?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { serviceName?: string; trades?: string } = {};
    if (trades.length === 0)
      newErrors.trades = 'At least one trade is required.';
    if (!serviceName) newErrors.serviceName = 'Service Name is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit({ serviceName, trades });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 w-full max-w-xl'>
      <div className='space-y-2'>
        <Label
          htmlFor='trades'
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          Trade
        </Label>
        <MultiSelect
          options={TRADE_OPTIONS.map(opt => ({ value: opt, label: opt }))}
          value={trades}
          onChange={setTrades}
          placeholder='Select Trade'
          error={errors.trades || ''}
          name='trades'
        />
      </div>
      <div className='space-y-2'>
        <Label
          htmlFor='serviceName'
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          Service Name
        </Label>
        <Input
          id='serviceName'
          value={serviceName}
          onChange={e => setServiceName(e.target.value)}
          placeholder='Enter Service Name'
          className={cn(
            'h-12 border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
            errors.serviceName
              ? 'border-[var(--warning)]'
              : 'border-[var(--border-dark)]'
          )}
        />
        <FormErrorMessage message={errors.serviceName || ''} />
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
