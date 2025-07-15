'use client';
import { InfoCard } from '@/components/shared/cards/InfoCard';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import SideSheet from '@/components/shared/common/SideSheet';
import { Button } from '@/components/ui/button';
import { Edit2, Trash } from 'iconsax-react';
import { useState } from 'react';
import MaterialForm from '../../../components/shared/forms/MaterialForm';

const dummyMaterials = [
  {
    initials: 'CE',
    initialsBg: 'bg-blue-100 text-blue-700',
    materialName: 'Cement',
    category: 'Building',
  },
  {
    initials: 'ST',
    initialsBg: 'bg-green-100 text-green-700',
    materialName: 'Steel',
    category: 'Building',
  },
  {
    initials: 'BR',
    initialsBg: 'bg-yellow-100 text-yellow-700',
    materialName: 'Bricks',
    category: 'Building',
  },
  {
    initials: 'PA',
    initialsBg: 'bg-lime-100 text-lime-700',
    materialName: 'Paint',
    category: 'Finishing',
  },
  {
    initials: 'TI',
    initialsBg: 'bg-red-100 text-red-700',
    materialName: 'Tiles',
    category: 'Finishing',
  },
];

const menuOptions: {
  label: string;
  action: string;
  icon: typeof Edit2;
  variant?: 'default' | 'destructive';
}[] = [
  { label: 'Edit', action: 'edit', icon: Edit2, variant: 'default' },
  { label: 'Archive', action: 'delete', icon: Trash, variant: 'destructive' },
];

export default function MaterialManagementPage() {
  const [materials, setMaterials] = useState(dummyMaterials);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [deleteMaterialName, setDeleteMaterialName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMenuAction = (action: string, idx: number) => {
    if (action === 'edit') {
      alert('Edit called');
    }
    if (action === 'delete') {
      setDeleteIdx(idx);
      setDeleteMaterialName(materials[idx]?.materialName || '');
      setModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (deleteIdx !== null) {
      setMaterials(materials => materials.filter((_, i) => i !== deleteIdx));
      setDeleteIdx(null);
      setModalOpen(false);
    }
  };

  const handleCreateMaterial = (data: {
    materialName: string;
    category: string;
  }) => {
    setLoading(true);
    setTimeout(() => {
      setMaterials(prev => [
        ...prev,
        {
          initials: data.materialName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase(),
          initialsBg: 'bg-blue-100 text-blue-700', // Default, could be improved
          materialName: data.materialName,
          category: data.category,
        },
      ]);
      setLoading(false);
      setSideSheetOpen(false);
    }, 800);
  };

  return (
    <div className='w-full overflow-y-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <h2 className='page-title'>Material Management</h2>
        <Button className='btn-primary' onClick={() => setSideSheetOpen(true)}>
          Create Material
        </Button>
      </div>
      {/* Material Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 xl:gap-6'>
        {materials.map((material, idx) => (
          <InfoCard
            key={material.initials + '-' + idx}
            initials={material.initials}
            initialsBg={material.initialsBg}
            tradeName={material.materialName}
            category={material.category}
            menuOptions={menuOptions}
            onMenuAction={action => handleMenuAction(action, idx)}
          />
        ))}
      </div>
      <ConfirmDeleteModal
        open={modalOpen}
        title={'Archive Material'}
        subtitle={`Are you sure you want to Archive "${deleteMaterialName}"? This action cannot be undone.`}
        onCancel={() => setModalOpen(false)}
        onDelete={handleDelete}
      />
      <SideSheet
        title='Create Material'
        open={sideSheetOpen}
        onOpenChange={setSideSheetOpen}
        size='600px'
      >
        <MaterialForm
          onSubmit={handleCreateMaterial}
          loading={loading}
          onCancel={() => setSideSheetOpen(false)}
        />
      </SideSheet>
    </div>
  );
}
