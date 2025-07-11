'use client';

import ToolCard from '@/components/shared/cards/ToolCard';
import SideSheet from '@/components/shared/common/SideSheet';
import ToolForm from '@/components/shared/forms/ToolForm';
import { AddCircle } from 'iconsax-react';
import { useRef, useState } from 'react';

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

  // Refs
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (id: number) => {
    setTools(currentTools => currentTools.filter(tool => tool.id !== id));
  };

  // Handlers for photo upload
  const handleDeletePhoto = () => {
    setPhoto(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
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
        <ToolForm
          photo={photo}
          setPhoto={setPhoto}
          handleDeletePhoto={handleDeletePhoto}
          service={service}
          setService={setService}
          toolName={toolName}
          setToolName={setToolName}
          companyName={companyName}
          setCompanyName={setCompanyName}
          quantity={quantity}
          setQuantity={setQuantity}
          errors={errors}
          onClose={onClose}
          onSubmit={e => e.preventDefault()}
        />
      </SideSheet>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'>
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
