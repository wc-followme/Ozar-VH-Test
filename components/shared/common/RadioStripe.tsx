'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const options = [
  { label: 'Public Job', value: 'PUBLIC' },
  { label: 'Private Job', value: 'PRIVATE' },
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
      {options.map(({ value: optionValue, label: optionLabel }) => (
        <label
          key={optionValue}
          htmlFor={optionValue}
          className={cn(
            'flex items-center gap-2 px-[12px] py-[10px] w-full max-w-[250px] rounded-full border-2 text-base text-[var(--text-dark)] font-medium cursor-pointer transition-all',
            value === optionValue
              ? 'border-[var(--primary)]'
              : 'border-[var(--border-dark)] bg-transparent'
          )}
        >
          <RadioGroupItem
            value={optionValue}
            id={optionValue}
            className='peer sr-only'
          />
          <span
            className={cn(
              'w-6 h-6 rounded-full border-2 flex items-center justify-center',
              value === optionValue
                ? 'bg-[var(--primary)] border-[var(--primary)]'
                : 'border-[var(--border-dark)]'
            )}
          >
            {value === optionValue && <Check className='w-3 h-3 text-white' />}
          </span>
          {optionLabel}
        </label>
      ))}
    </RadioGroup>
  );
}
