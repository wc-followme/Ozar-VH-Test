import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import FormErrorMessage from './FormErrorMessage';

interface IconOption {
  value: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

interface IconFieldWrapperProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  iconOptions: IconOption[];
  error?: string;
}

const IconFieldWrapper: React.FC<IconFieldWrapperProps> = ({
  label,
  value,
  onChange,
  iconOptions,
  error,
}) => {
  const getSelectedIconOption = () =>
    iconOptions.find(opt => opt.value === value) || iconOptions[0];

  return (
    <div className='flex flex-col items-start gap-2'>
      <label className='text-[14px] font-semibold text-[var(--text-dark)]'>
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'>
          <SelectValue>
            <div
              className='flex w-8 h-8 items-center justify-center rounded-[10px]'
              style={{
                backgroundColor: `${getSelectedIconOption()?.color ?? ''}26`,
              }}
            >
              {(() => {
                const IconComponent = getSelectedIconOption()?.icon;
                return IconComponent ? (
                  <IconComponent
                    className='w-4 h-4'
                    style={{ color: getSelectedIconOption()?.color ?? '' }}
                  />
                ) : null;
              })()}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
          {iconOptions.map(({ icon: IconComponent, value, color, label }) => (
            <SelectItem key={value} value={value}>
              <div className='flex items-center gap-2'>
                <div
                  className='flex w-6 h-6 items-center justify-center rounded-md'
                  style={{ backgroundColor: `${color}26` }}
                >
                  <IconComponent className='w-3 h-3' style={{ color: color }} />
                </div>
                <span className='text-sm'>{label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormErrorMessage message={error || ''} />
    </div>
  );
};

export default IconFieldWrapper;
