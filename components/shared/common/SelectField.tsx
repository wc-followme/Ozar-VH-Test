import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useEffect, useState } from 'react';
import FormErrorMessage from './FormErrorMessage';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  className?: string;
  optionClassName?: string;
}

const selectContentStyle =
  'bg-[var(--white-background)] border border-[var(--border-light)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]';
const selectItemStyle =
  'text-[var(--text-dark)] hover:bg-[var(--select-option)] focus:bg-[var(--select-option)] cursor-pointer rounded-[5px]';

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  error,
  className = '',
  optionClassName = '',
}) => {
  const [internalValue, setInternalValue] = useState(value);

  // Sync internal value with external value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange(newValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
          {label}
        </Label>
      )}
      <Select value={internalValue} onValueChange={handleValueChange}>
        <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={selectContentStyle}>
          {options.map(({ value, label }) => (
            <SelectItem
              key={value}
              value={value}
              className={`${selectItemStyle} ${optionClassName}`}
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <FormErrorMessage message={error} />}
    </div>
  );
};

export default SelectField;
