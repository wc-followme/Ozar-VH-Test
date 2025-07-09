'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SelectBoxCardProps {
  id: string;
  title: string;
  description: string;
}

export function SelectBoxCard({ id, title, description }: SelectBoxCardProps) {
  return (
    <div
      className={`relative p-4 rounded-[20px] bg-white border-2 border-[var(--border-dark)] transition-all duration-200 cursor-pointer hover:shadow-md [&:has(input:checked)]:border-[#24338C]`}
    >
      <div className='flex items-start flex-col'>
        <div className='flex items-center pt-0.5 gap-2 mb-3'>
          <Checkbox
            id={id}
            className='
          rounded-[6px] 
          border-2 
          border-[#BFBFBF]
          data-[state=checked]:bg-[#24338C]
          data-[state=checked]:border-[#24338C]
          data-[state=checked]:text-white
          text-white 
          w-6 h-6
          flex items-center justify-center
        '
          />
          <Label
            htmlFor={id}
            className={`text-[18px] font-bold cursor-pointer block text-[#2D2D2D] `}
          >
            {title}
          </Label>
        </div>
        <div className=''>
          <p className={`text-sm font-normal leading-relaxed text-[#818181]`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
