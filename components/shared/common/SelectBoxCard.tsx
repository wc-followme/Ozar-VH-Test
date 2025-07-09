'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SelectBoxCardProps {
  id: string;
  title: string;
  description: string;
  status: boolean;
}

export function SelectBoxCard({
  id,
  title,
  description,
  status,
}: SelectBoxCardProps) {
  return (
    <div
      className={`relative p-4 rounded-[20px] bg-transparent border-2 border-[var(--border-dark)] transition-all duration-200 cursor-pointer hover:shadow-md [&:has(input:checked)]:border-[var(--primary)]`}
    >
      <div className='flex items-base flex-col'>
        <div className='flex items-base pt-0.5 gap-2 mb-3'>
          <Checkbox
            id={id}
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
            disabled={status}
          />
          <Label
            htmlFor={id}
            className={`text-[18px] font-bold cursor-pointer block text-[var(--text-dark)] `}
          >
            {title}
          </Label>
        </div>
        <div className=''>
          <p
            className={`text-sm font-normal leading-relaxed text-[var(--text-secondary)]`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
