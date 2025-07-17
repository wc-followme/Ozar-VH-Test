'use client';

import ToolCard from '@/components/shared/cards/ToolCard';
import SideSheet from '@/components/shared/common/SideSheet';
import ToolForm from '@/components/shared/forms/ToolForm';
import ToolCardSkeleton from '@/components/shared/skeleton/ToolCardSkeleton';
import { useEffect, useState } from 'react';

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
    image: '',
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
  const [loading, setLoading] = useState(true);

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

  const handleDeletePhoto = () => {
    setPhoto(null);
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

  // Show skeletons for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <h2 className='page-title'>Tools Management</h2>
        <button className='btn-primary' onClick={() => setSideSheetOpen(true)}>
          <span>Create Tool</span>
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
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {loading
          ? Array.from({ length: 12 }).map((_, idx) => (
              <ToolCardSkeleton key={idx} />
            ))
          : tools.map(({ id, image, name, brand, quantity, videoCount }) => (
              <ToolCard
                key={id}
                image={image}
                name={name}
                brand={brand}
                quantity={quantity}
                videoCount={videoCount}
                onDelete={() => handleDelete(id)}
              />
            ))}
      </div>
    </div>
  );
};

export default ToolsManagement;
