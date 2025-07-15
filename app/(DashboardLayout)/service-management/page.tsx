'use client';
import { InfoCard } from '@/components/shared/cards/InfoCard';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import SideSheet from '@/components/shared/common/SideSheet';
import ServiceForm from '@/components/shared/forms/ServiceForm';
import TradeCardSkeleton from '@/components/shared/skeleton/TradeCardSkeleton';
import { Button } from '@/components/ui/button';
import { Edit2, Trash } from 'iconsax-react';
import React, { useState } from 'react';

const dummyServices = [
  {
    initials: 'TU',
    initialsBg: 'bg-blue-100 text-blue-700',
    serviceName: 'Tub Install',
    trade: 'Plumbing',
  },
  {
    initials: 'DO',
    initialsBg: 'bg-green-100 text-green-700',
    serviceName: 'Door Install',
    trade: 'Carpenter',
  },
  {
    initials: 'SW',
    initialsBg: 'bg-cyan-100 text-cyan-700',
    serviceName: 'Switch Board Install',
    trade: 'Electrician',
  },
  {
    initials: 'WA',
    initialsBg: 'bg-lime-100 text-lime-700',
    serviceName: 'Wall Texture',
    trade: 'Painting',
  },
  {
    initials: 'TI',
    initialsBg: 'bg-yellow-100 text-yellow-700',
    serviceName: 'Tile Work',
    trade: 'Roofer',
  },
  {
    initials: 'TO',
    initialsBg: 'bg-red-100 text-red-700',
    serviceName: 'Toilet Install',
    trade: 'Plumbing',
  },
  {
    initials: 'DO',
    initialsBg: 'bg-orange-100 text-orange-700',
    serviceName: 'Door Framing',
    trade: 'Framer',
  },
  {
    initials: 'SH',
    initialsBg: 'bg-indigo-100 text-indigo-700',
    serviceName: 'Shower Install',
    trade: 'Plumbing',
  },
  {
    initials: 'WA',
    initialsBg: 'bg-green-100 text-green-700',
    serviceName: 'Waller',
    trade: 'Drywaller',
  },
  {
    initials: 'SI',
    initialsBg: 'bg-lime-200 text-lime-800',
    serviceName: 'Sink Install',
    trade: 'Plumber',
  },
  {
    initials: 'AI',
    initialsBg: 'bg-cyan-100 text-cyan-700',
    serviceName: 'Air Conditioner Install',
    trade: 'Electrician',
  },
  {
    initials: 'SO',
    initialsBg: 'bg-lime-100 text-lime-700',
    serviceName: 'Solar Panel Install',
    trade: 'Electrician',
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

export default function ServiceManagementPage() {
  const [services, setServices] = useState(dummyServices);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [deleteServiceName, setDeleteServiceName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);

  // Show skeletons for 2 seconds on mount
  React.useEffect(() => {
    const timer = setTimeout(() => setLoadingSkeleton(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleMenuAction = (action: string, idx: number) => {
    if (action === 'edit') {
      alert('edit service called');
    }
    if (action === 'delete') {
      setDeleteIdx(idx);
      setDeleteServiceName(services[idx]?.serviceName || '');
      setModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (deleteIdx !== null) {
      setServices(services => services.filter((_, i) => i !== deleteIdx));
      setDeleteIdx(null);
      setModalOpen(false);
    }
  };

  const handleCreateService = (data: {
    serviceName: string;
    trades: string[];
  }) => {
    setLoading(true);
    setTimeout(() => {
      setServices(prev => [
        ...prev,
        {
          initials: data.serviceName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase(),
          initialsBg: 'bg-blue-100 text-blue-700', // Default, could be improved
          serviceName: data.serviceName,
          trade: data.trades.join(', '),
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
        <h1 className='text-2xl font-medium text-[var(--text-dark)]'>
          Service Management
        </h1>
        <Button
          className='bg-[var(--secondary)] hover:bg-green-600 rounded-full px-6 h-10 font-semibold text-white'
          onClick={() => setSideSheetOpen(true)}
        >
          Create Service
        </Button>
      </div>
      {/* Service Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 xl:gap-6'>
        {loadingSkeleton
          ? Array.from({ length: 10 }).map((_, idx) => (
              <TradeCardSkeleton key={idx} />
            ))
          : services.map((service, idx) => (
              <InfoCard
                key={service.initials + '-' + idx}
                initials={service.initials}
                initialsBg={service.initialsBg}
                tradeName={service.serviceName}
                category={service.trade}
                menuOptions={menuOptions}
                onMenuAction={action => handleMenuAction(action, idx)}
              />
            ))}
      </div>
      <ConfirmDeleteModal
        open={modalOpen}
        title={'Archive Service'}
        subtitle={`Are you sure you want to Archive "${deleteServiceName}"? This action cannot be undone.`}
        onCancel={() => setModalOpen(false)}
        onDelete={handleDelete}
      />
      <SideSheet
        title='Create Service'
        open={sideSheetOpen}
        onOpenChange={setSideSheetOpen}
        size='600px'
      >
        <ServiceForm
          onSubmit={handleCreateService}
          loading={loading}
          onCancel={() => setSideSheetOpen(false)}
        />
      </SideSheet>
    </div>
  );
}
