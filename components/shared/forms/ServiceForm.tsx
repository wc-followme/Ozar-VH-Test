import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

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
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleToggle = (option: string) => {
    if (trades.includes(option)) {
      setTrades(trades.filter(v => v !== option));
    } else {
      setTrades([...trades, option]);
    }
  };

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

  const displayTags = trades.slice(0, 3);
  const moreCount = trades.length - displayTags.length;

  return (
    <form onSubmit={handleSubmit} className='space-y-6 w-full max-w-xl'>
      <div className='space-y-2'>
        <Label
          htmlFor='trades'
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          Trade
        </Label>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type='button'
              className='h-12 w-full flex items-center justify-between border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] px-3 py-2 min-h-[40px] shadow-none focus:border-green-500 focus:ring-green-500'
            >
              <div className='flex flex-wrap gap-2'>
                {trades.length === 0 && (
                  <span className='text-gray-400'>Select Trade</span>
                )}
                {displayTags.map(tag => (
                  <span
                    key={tag}
                    className='bg-[#00A8BF26] text-[var(--text-dark)] rounded-full px-3 py-1 text-sm font-medium'
                  >
                    {tag}
                  </span>
                ))}
                {moreCount > 0 && (
                  <span className='bg-[#00A8BF26] text-[var(--text-dark)] rounded-full px-3 py-1 text-sm font-medium'>
                    +{moreCount} more
                  </span>
                )}
              </div>
              <ChevronDown className='ml-2 w-5 h-5 text-gray-400' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-full bg-[var(--card-background)] min-w-[var(--radix-popover-trigger-width)] p-2 rounded-[12px] border border-[var(--border-dark)]'>
            {TRADE_OPTIONS.map(option => (
              <label
                key={option}
                className='flex items-center gap-3 py-2 px-2 cursor-pointer text-[var(--text-dark)] text-base border-b border-[var(--border-dark)] last-of-type:border-b-0'
              >
                <Checkbox
                  checked={trades.includes(option)}
                  onCheckedChange={() => handleToggle(option)}
                  className='
                    rounded-[6px] 
                    border-2 
                    border-[#BFBFBF]
                    data-[state=checked]:bg-[--primary]
                    data-[state=checked]:border-[--primary]
                    data-[state=checked]:text-white
                    text-white 
                    w-6 h-6
                    flex items-base justify-center
                    mt-0.5
                  '
                />
                <span>{option}</span>
              </label>
            ))}
          </PopoverContent>
        </Popover>
        <FormErrorMessage message={errors.trades || ''} />
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
          className='h-12 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
        />
        <FormErrorMessage message={errors.serviceName || ''} />
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
          className='h-[48px] px-12 bg-green-500 hover:bg-green-600 rounded-full font-semibold text-white'
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
