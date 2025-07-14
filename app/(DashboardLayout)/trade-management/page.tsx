'use client';
import { InfoCard } from '@/components/shared/cards/InfoCard';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import SideSheet from '@/components/shared/common/SideSheet';
import TradeForm from '@/components/shared/forms/TradeForm';
import { Button } from '@/components/ui/button';
import { Edit2, Trash } from 'iconsax-react';
import { useState } from 'react';

const dummyTrades = [
  {
    initials: 'PL',
    initialsBg: 'bg-blue-100 text-blue-700',
    tradeName: 'Plumbing',
    category: '05 Category',
  },
  {
    initials: 'CA',
    initialsBg: 'bg-green-100 text-green-700',
    tradeName: 'Carpenter',
    category: '05 Category',
  },
  {
    initials: 'EL',
    initialsBg: 'bg-cyan-100 text-cyan-700',
    tradeName: 'Electrician',
    category: '05 Category',
  },
  {
    initials: 'PA',
    initialsBg: 'bg-lime-100 text-lime-700',
    tradeName: 'Painting',
    category: '05 Category',
  },
  {
    initials: 'RO',
    initialsBg: 'bg-yellow-100 text-yellow-700',
    tradeName: 'Roofer',
    category: '05 Category',
  },
  {
    initials: 'CO',
    initialsBg: 'bg-red-100 text-red-700',
    tradeName: 'Contractor',
    category: '05 Category',
  },
  {
    initials: 'PL',
    initialsBg: 'bg-orange-100 text-orange-700',
    tradeName: 'Framer',
    category: '05 Category',
  },
  {
    initials: 'MA',
    initialsBg: 'bg-indigo-100 text-indigo-700',
    tradeName: 'Mason',
    category: '05 Category',
  },
  {
    initials: 'DR',
    initialsBg: 'bg-green-100 text-green-700',
    tradeName: 'Drywaller',
    category: '05 Category',
  },
  {
    initials: 'BU',
    initialsBg: 'bg-lime-200 text-lime-800',
    tradeName: 'Builder',
    category: '05 Category',
  },
];

const menuOptions: {
  label: string;
  action: string;
  icon: React.ElementType;
  variant?: 'default' | 'destructive';
}[] = [
  { label: 'Edit', action: 'edit', icon: Edit2, variant: 'default' },
  { label: 'Archive', action: 'delete', icon: Trash, variant: 'destructive' },
];

export default function TradeManagementPage() {
  const [trades, setTrades] = useState(dummyTrades);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [deleteTradeName, setDeleteTradeName] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMenuAction = (action: string, idx: number) => {
    if (action === 'edit') {
      alert('Edit Called');
    }
    if (action === 'delete') {
      setDeleteIdx(idx);
      setDeleteTradeName(trades[idx]?.tradeName || '');
      setModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (deleteIdx !== null) {
      setTrades(trades => trades.filter((_, i) => i !== deleteIdx));
      setDeleteIdx(null);
      setModalOpen(false);
    }
  };

  const handleCreateTrade = (data: { tradeName: string; category: string }) => {
    setLoading(true);
    setTimeout(() => {
      setTrades(prev => [
        ...prev,
        {
          initials: data.tradeName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase(),
          initialsBg: 'bg-blue-100 text-blue-700', // Default, could be improved
          tradeName: data.tradeName,
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
        <h1 className='text-2xl font-medium text-[var(--text-dark)]'>
          Trade Management
        </h1>
        <Button
          className='bg-[var(--secondary)] hover:bg-green-600 rounded-full px-6 h-10 font-semibold text-white'
          onClick={() => setSideSheetOpen(true)}
        >
          Create Trade
        </Button>
      </div>
      {/* Trade Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 xl:gap-6'>
        {trades.map((trade, idx) => (
          <InfoCard
            key={trade.initials + '-' + idx}
            initials={trade.initials}
            initialsBg={trade.initialsBg}
            tradeName={trade.tradeName}
            category={trade.category}
            menuOptions={menuOptions}
            onMenuAction={action => handleMenuAction(action, idx)}
          />
        ))}
      </div>
      <ConfirmDeleteModal
        open={modalOpen}
        title={'Archive Trade'}
        subtitle={`Are you sure you want to Archive "${deleteTradeName}"? This action cannot be undone.`}
        onCancel={() => setModalOpen(false)}
        onDelete={handleDelete}
      />
      <SideSheet
        title='Create Trade'
        open={sideSheetOpen}
        onOpenChange={setSideSheetOpen}
        size='600px'
      >
        <TradeForm
          onSubmit={handleCreateTrade}
          loading={loading}
          onCancel={() => setSideSheetOpen(false)}
        />
      </SideSheet>
    </div>
  );
}
