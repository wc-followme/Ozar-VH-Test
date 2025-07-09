'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const options = [
  { label: 'Public Job', value: 'public' },
  { label: 'Private Job', value: 'private' },
];

export function RadioGroupStripe({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className='flex items-center gap-4 w-full'
    >
      {options.map(option => (
        <label
          key={option.value}
          htmlFor={option.value}
          className={cn(
            'flex items-center gap-2 px-[12px] py-[10px] w-full max-w-[250px] rounded-full border-2 text-base text-[var(--text-dark)] font-medium cursor-pointer transition-all',
            value === option.value
              ? 'border-[var(--primary)]'
              : 'border-[var(--border-dark)] bg-transparent'
          )}
        >
          <RadioGroupItem
            value={option.value}
            id={option.value}
            className='peer sr-only'
          />
          <span
            className={cn(
              'w-6 h-6 rounded-full border-2 flex items-center justify-center',
              value === option.value
                ? 'bg-[var(--primary)] border-[var(--primary)]'
                : 'border-[var(--border-dark)]'
            )}
          >
            {value === option.value && <Check className='w-3 h-3 text-white' />}
          </span>
          {option.label}
        </label>
      ))}
    </RadioGroup>
  );
}
