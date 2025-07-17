import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import PhotoUploadField from '@/components/shared/common/PhotoUploadField';
import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React from 'react';

interface ToolFormProps {
  photo: File | null;
  setPhoto: (file: File | null) => void;
  handleDeletePhoto: () => void;
  service: string;
  setService: (service: string) => void;
  toolName: string;
  setToolName: (name: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  quantity: string;
  setQuantity: (qty: string) => void;
  errors: {
    toolName?: string;
    companyName?: string;
    quantity?: string;
    service?: string;
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ToolForm: React.FC<ToolFormProps> = ({
  photo,
  setPhoto,
  handleDeletePhoto,
  service,
  setService,
  toolName,
  setToolName,
  companyName,
  setCompanyName,
  quantity,
  setQuantity,
  errors,
  onClose,
  onSubmit,
}) => {
  return (
    <div className='p-0 w-full'>
      <form className='space-y-6' onSubmit={onSubmit}>
        {/* Photo Upload */}
        <PhotoUploadField
          photo={photo}
          onPhotoChange={setPhoto}
          onDeletePhoto={handleDeletePhoto}
          label='Upload Photo or Drag and Drop'
          text={
            <>
              1600 x 1200 (4:3) recommended. <br /> PNG and JPG files are
              allowed
            </>
          }
        />
        {/* Service Select */}
        <SelectField
          label='Service'
          value={service}
          onValueChange={setService}
          options={[
            { value: 'wrench', label: 'Wrench' },
            { value: 'drill', label: 'Drill' },
            { value: 'hammer', label: 'Hammer' },
          ]}
          placeholder='Select Service'
          error={errors.service || ''}
          className={cn(
            '!placeholder-[var(--text-placeholder)]',
            errors.service
              ? 'border-[var(--warning)]'
              : 'border-[var(--border-dark)]'
          )}
        />
        {/* Tool Name */}
        <div className='space-y-2'>
          <Label htmlFor='tool-name' className='field-label'>
            Tool Name
          </Label>
          <Input
            id='tool-name'
            placeholder='Enter Tool Name'
            value={toolName}
            onChange={e => setToolName(e.target.value)}
            className={cn(
              'input-field',
              errors.toolName
                ? 'border-[var(--warning)]'
                : 'border-[var(--border-dark)]'
            )}
          />
          <FormErrorMessage message={errors.toolName || ''} />
        </div>
        {/* Brand Name */}
        <div className='space-y-2'>
          <Label htmlFor='company-name' className='field-label'>
            Brand Name
          </Label>
          <Input
            id='company-name'
            placeholder='Enter Company Name'
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            className={cn(
              'input-field',
              errors.companyName
                ? 'border-[var(--warning)]'
                : 'border-[var(--border-dark)]'
            )}
          />
          <FormErrorMessage message={errors.companyName || ''} />
        </div>
        {/* Quantity */}
        <div className='space-y-2'>
          <Label htmlFor='quantity' className='field-label'>
            Quantity
          </Label>
          <Input
            id='quantity'
            placeholder='Eg: 12'
            type='text'
            min={1}
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className={cn(
              'input-field',
              errors.quantity
                ? 'border-[var(--warning)]'
                : 'border-[var(--border-dark)]'
            )}
          />
          <FormErrorMessage message={errors.quantity || ''} />
        </div>
        {/* Action Buttons */}
        <div className='flex items-center gap-4 mt-0'>
          <Button
            type='button'
            className='btn-secondary !h-12 !px-8'
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type='submit' className='btn-primary !h-12 !px-12'>
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ToolForm;
