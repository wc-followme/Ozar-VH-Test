import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import FormErrorMessage from './FormErrorMessage';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  name?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select',
  error,
  name,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const displayTags = value.slice(0, 3);
  const moreCount = value.length - displayTags.length;

  return (
    <div className='space-y-2 w-full'>
      {label && (
        <Label
          htmlFor={name}
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          {label}
        </Label>
      )}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            type='button'
            className={cn(
              'h-12 w-full flex items-center justify-between border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] px-3 py-2 min-h-[40px] shadow-none focus:border-green-500 focus:ring-green-500',
              error ? 'border-[var(--warning)]' : 'border-[var(--border-dark)]'
            )}
          >
            <div className='flex flex-wrap gap-2 text-left'>
              {value.length === 0 && (
                <span className='text-gray-400'>{placeholder}</span>
              )}
              {displayTags.map(tag => {
                const { label } = options.find(o => o.value === tag) || {};
                return (
                  <span
                    key={tag}
                    className='bg-[#00A8BF26] text-[var(--text-dark)] rounded-full px-3 py-1 text-sm font-medium'
                  >
                    {label || tag}
                  </span>
                );
              })}
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
          {options.map(({ value: optValue, label: optLabel }) => (
            <label
              key={optValue}
              className='flex items-center gap-3 py-2 px-2 cursor-pointer text-[var(--text-dark)] text-base border-b border-[var(--border-dark)] last-of-type:border-b-0'
            >
              <Checkbox
                checked={value.includes(optValue)}
                onCheckedChange={() => handleToggle(optValue)}
                className='rounded-[6px] border-2 border-[#BFBFBF] data-[state=checked]:bg-[--primary] data-[state=checked]:border-[--primary] data-[state=checked]:text-white text-white w-6 h-6 flex items-base justify-center mt-0.5'
              />
              <span>{optLabel}</span>
            </label>
          ))}
        </PopoverContent>
      </Popover>
      <FormErrorMessage message={error || ''} />
    </div>
  );
};

export default MultiSelect;
