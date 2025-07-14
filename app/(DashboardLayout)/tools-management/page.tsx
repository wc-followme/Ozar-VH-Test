'use client';

import ToolCard from '@/components/shared/cards/ToolCard';
import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import PhotoUploadField from '@/components/shared/common/PhotoUploadField';
import SelectField from '@/components/shared/common/SelectField';
import SideSheet from '@/components/shared/common/SideSheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddCircle } from 'iconsax-react';
import { useState } from 'react';

const dummyTools = [
  {
    id: 1,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Tool Name',
    brand: 'Brand name',
    quantity: 100,
    videoCount: 2,
  },
  {
    id: 2,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Tool Name',
    brand: 'Brand name',
    quantity: 100,
    videoCount: 2,
  },
  {
    id: 3,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Tool Name',
    brand: 'Brand name',
    quantity: 100,
    videoCount: 2,
  },
  {
    id: 4,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Tool Name',
    brand: 'Brand name',
    quantity: 100,
    videoCount: 2,
  },
  {
    id: 5,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Tool Name',
    brand: 'Brand name',
    quantity: 100,
    videoCount: 2,
  },
  {
    id: 6,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Tool Name',
    brand: 'Brand name',
    quantity: 100,
    videoCount: 2,
  },
  {
    id: 7,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Tool Name',
    brand: 'Brand name',
    quantity: 100,
    videoCount: 2,
  },
  {
    id: 8,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Tool Name',
    brand: 'Brand name',
    quantity: 100,
    videoCount: 2,
  },
  {
    id: 9,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Tool Name',
    brand: 'Brand name',
    quantity: 100,
    videoCount: 2,
  },
  {
    id: 10,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Tool Name',
    brand: 'Brand name',
    quantity: 100,
    videoCount: 2,
  },
  {
    id: 11,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Tool Name',
    brand: 'Brand name',
    quantity: 100,
    videoCount: 2,
  },
  {
    id: 12,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Tool Name',
    brand: 'Brand name',
    quantity: 100,
    videoCount: 2,
  },
];

const ToolsManagement = () => {
  const [tools, setTools] = useState(dummyTools);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);

  // Form state
  const [toolName, setToolName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<{
    toolName?: string;
    companyName?: string;
    quantity?: string;
    service?: string;
  }>({});
  const [service, setService] = useState('');

  // Refs - commented out as currently unused
  // const _photoInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (id: number) => {
    setTools(currentTools => currentTools.filter(tool => tool.id !== id));
  };

  function onClose() {
    setSideSheetOpen(false);
    // Optionally reset form fields here
    setToolName('');
    setCompanyName('');
    setQuantity('');
    setPhoto(null);
    setErrors({});
  }

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-2xl font-medium text-[var(--text-dark)]'>
          Tools Management
        </h1>
        <button
          className='h-[42px] px-6 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white text-base inline-flex items-center gap-2'
          onClick={() => setSideSheetOpen(true)}
        >
          <AddCircle
            size='32'
            color='currentColor'
            className='!w-[1.375rem] !h-[1.375rem]'
          />
          <span>Add Tool</span>
        </button>
      </div>
      <SideSheet
        title='Add Tool'
        open={sideSheetOpen}
        onOpenChange={setSideSheetOpen}
        size='600px'
      >
        <div className='bg-[var(--white-background)] p-0 w-full'>
          <form className='space-y-6' onSubmit={e => e.preventDefault()}>
            {/* Photo Upload */}
            <PhotoUploadField
              photo={photo}
              onPhotoChange={file => setPhoto(file)}
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
            />
            {/* Tool Name */}
            <div className='space-y-2'>
              <Label
                htmlFor='tool-name'
                className='text-[14px] font-semibold text-[var(--text-dark)]'
              >
                Tool Name
              </Label>
              <Input
                id='tool-name'
                placeholder='Enter Tool Name'
                value={toolName}
                onChange={e => setToolName(e.target.value)}
                className='h-12 border-2 border-[var(--border-dark)] focus:border-[var(--hover-bg)] focus:ring-[var(--hover-bg)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
              <FormErrorMessage message={errors.toolName || ''} />
            </div>
            {/* Brand Name */}
            <div className='space-y-2'>
              <Label
                htmlFor='company-name'
                className='text-[14px] font-semibold text-[var(--text-dark)]'
              >
                Brand Name
              </Label>
              <Input
                id='company-name'
                placeholder='Enter Company Name'
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
              <FormErrorMessage message={errors.companyName || ''} />
            </div>
            {/* Quantity */}
            <div className='space-y-2'>
              <Label
                htmlFor='quantity'
                className='text-[14px] font-semibold text-[var(--text-dark)]'
              >
                Quantity
              </Label>
              <Input
                id='quantity'
                placeholder='Eg: 12'
                type='text'
                min={1}
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className='h-12 border-2 border-[var(--border-dark)] focus:border-[var(--hover-bg)] focus:ring-[var(--hover-bg)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
              <FormErrorMessage message={errors.quantity || ''} />
            </div>
            {/* Action Buttons */}
            <div className='flex items-center gap-4 mt-0'>
              <Button
                type='button'
                className='h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] flex items-center text-base'
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='h-[48px] px-12 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white text-base'
              >
                Create
              </Button>
            </div>
          </form>
        </div>
      </SideSheet>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {tools.map(tool => (
          <ToolCard
            key={tool.id}
            image={tool.image}
            name={tool.name}
            brand={tool.brand}
            quantity={tool.quantity}
            videoCount={tool.videoCount}
            onDelete={() => handleDelete(tool.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ToolsManagement;
