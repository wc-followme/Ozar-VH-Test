'use client';

import ToolCard from '@/components/shared/cards/ToolCard';
import SideSheet from '@/components/shared/common/SideSheet';
import ToolForm from '@/components/shared/forms/ToolForm';
import { getUserPermissionsFromStorage } from '@/lib/utils';
import { Add } from 'iconsax-react';
import { useEffect, useState } from 'react';
import ToolCardSkeleton from '../../../components/shared/skeleton/ToolCardSkeleton';

const dummyTools = [
  {
    id: 1,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Hammer',
    brand: 'DeWalt',
    quantity: 5,
    videoCount: 2,
  },
  {
    id: 2,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Drill',
    brand: 'Makita',
    quantity: 3,
    videoCount: 1,
  },
  {
    id: 3,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Saw',
    brand: 'Bosch',
    quantity: 2,
    videoCount: 3,
  },
  {
    id: 4,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Wrench',
    brand: 'Snap-on',
    quantity: 8,
    videoCount: 0,
  },
  {
    id: 5,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Screwdriver',
    brand: 'Stanley',
    quantity: 12,
    videoCount: 1,
  },
  {
    id: 6,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Pliers',
    brand: 'Klein Tools',
    quantity: 6,
    videoCount: 2,
  },
];

export default function ToolsManagement() {
  const [tools, setTools] = useState(dummyTools);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [photo, setPhoto] = useState<File | null>(null);
  const [service, setService] = useState('');
  const [toolName, setToolName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get user permissions for tools
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.tools?.edit;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id: number) => {
    setTools(tools.filter(tool => tool.id !== id));
  };

  const handleDeletePhoto = () => {
    setPhoto(null);
  };

  const onClose = () => {
    setSideSheetOpen(false);
    setPhoto(null);
    setService('');
    setToolName('');
    setCompanyName('');
    setQuantity(1);
    setErrors({});
  };

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 xl:mb-8'>
        <div className='flex items-center justify-between w-full'>
          <h2 className='page-title'>Tools Management</h2>
          {canEdit && (
            <div className='flex justify-end'>
              <button
                className='btn-primary flex items-center shrink-0 justify-center !px-0 sm:!px-6 text-center !w-[42px] sm:!w-auto rounded-full'
                onClick={() => setSideSheetOpen(true)}
              >
                <Add size='20' color='#fff' className='sm:hidden' />
                <span className='hidden sm:inline'>Create Tool</span>
              </button>
            </div>
          )}
        </div>
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
          quantity={quantity.toString()}
          setQuantity={(qty: string) => setQuantity(parseInt(qty) || 1)}
          errors={errors}
          onClose={onClose}
          onSubmit={e => e.preventDefault()}
        />
      </SideSheet>
      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
        {isLoading
          ? Array.from({ length: 12 }).map((_, item) => (
              <ToolCardSkeleton key={`skeleton-${item}`} />
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
}
