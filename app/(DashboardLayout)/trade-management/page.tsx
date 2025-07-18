'use client';
import { InfoCard } from '@/components/shared/cards/InfoCard';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import SideSheet from '@/components/shared/common/SideSheet';
import TradeForm from '@/components/shared/forms/TradeForm';
import TradeCardSkeleton from '@/components/shared/skeleton/TradeCardSkeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage } from '@/lib/utils';
import { Edit2, Trash } from 'iconsax-react';
import React, { useCallback, useEffect, useState } from 'react';
import { TRADE_MESSAGES } from './trade-messages';
import { Trade } from './trade-types';

const menuOptions: {
  label: string;
  action: string;
  icon: React.ElementType;
  variant?: 'default' | 'destructive';
}[] = [
  {
    label: TRADE_MESSAGES.EDIT_MENU,
    action: 'edit',
    icon: Edit2,
    variant: 'default',
  },
  {
    label: TRADE_MESSAGES.DELETE_MENU,
    action: 'delete',
    icon: Trash,
    variant: 'destructive',
  },
];

export default function TradeManagementPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(28);
  const [search] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [deleteTradeName, setDeleteTradeName] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [editingTradeUuid, setEditingTradeUuid] = useState<string | undefined>(
    undefined
  );
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  const fetchTrades = useCallback(
    async (targetPage = 1, append = false) => {
      setLoading(true);
      try {
        const response = await apiService.fetchTrades({
          page: targetPage,
          limit,
          name: search,
        });

        // Handle different possible response structures
        let newTrades: Trade[] = [];
        let total = 0;

        if (response && response.data) {
          // If data is directly an array
          if (Array.isArray(response.data)) {
            newTrades = response.data;
            total = response.data.length; // Fallback if no total provided
          }
          // If data is nested under data.data
          else if (response.data.data && Array.isArray(response.data.data)) {
            newTrades = response.data.data;
            total = response.data.total || response.data.data.length;
          }
          // If data is just the response itself (fallback)
          else if (Array.isArray(response)) {
            newTrades = response;
            total = response.length;
          }
        }

        setTrades(prev => {
          if (append) {
            // Filter out duplicates when appending to prevent duplicate keys
            const existingUuids = new Set(prev.map(trade => trade.uuid));
            const uniqueNewTrades = newTrades.filter(
              trade => !existingUuids.has(trade.uuid)
            );
            return [...prev, ...uniqueNewTrades];
          } else {
            return newTrades;
          }
        });

        setPage(targetPage);
        setHasMore(targetPage * limit < total);
      } catch (err: unknown) {
        // Handle auth errors first (will redirect to login if 401)
        if (handleAuthError(err)) {
          return; // Don't show toast if it's an auth error
        }

        const message = extractApiErrorMessage(err, TRADE_MESSAGES.FETCH_ERROR);
        showErrorToast(message);
        if (!append) setTrades([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [limit, search, handleAuthError, showErrorToast]
  );

  // Fetch first page of trades
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setTrades([]);
    fetchTrades(1, false);
  }, [fetchTrades]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTrades(nextPage, true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, fetchTrades, page]);

  const handleMenuAction = (action: string, idx: number) => {
    const trade = trades[idx];
    if (!trade) return;

    if (action === 'edit') {
      setEditingTradeUuid(trade.uuid);
      setSideSheetOpen(true);
    }
    if (action === 'delete') {
      setDeleteIdx(idx);
      setDeleteTradeName(trade.name || '');
      setModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (deleteIdx !== null) {
      const trade = trades[deleteIdx];
      if (trade) {
        try {
          const response = await apiService.deleteTrade(trade.uuid);
          showSuccessToast(response.message || TRADE_MESSAGES.DELETE_SUCCESS);
          // Remove the trade from local state instead of fetching again
          setTrades(prevTrades =>
            prevTrades.filter((_, index) => index !== deleteIdx)
          );
        } catch (error) {
          console.error('Failed to delete trade:', error);
          showErrorToast(TRADE_MESSAGES.DELETE_ERROR);
        }
      }
      setDeleteIdx(null);
      setModalOpen(false);
    }
  };

  const handleCreateTrade = async (data: {
    tradeName: string;
    category: string;
    tradeData?: Trade;
  }) => {
    // Use the actual trade data from API response if available
    if (data.tradeData) {
      // Add the new trade to the beginning of the trades list
      setTrades(prevTrades => [data.tradeData!, ...prevTrades]);
    } else {
      // Fallback: Create a new trade object to add to local state
      const newTrade: Trade = {
        id: Date.now(), // Temporary ID for local state
        uuid: `temp-${Date.now()}`, // Temporary UUID
        name: data.tradeName,
        description: '',
        is_default: false,
        is_active: true,
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        categories: data.category.split(', ').map(cat => ({
          id: Date.now(),
          name: cat.trim(),
          status: 'ACTIVE',
        })),
      };

      // Add the new trade to the beginning of the trades list
      setTrades(prevTrades => [newTrade, ...prevTrades]);
    }
  };

  const handleUpdateTrade = async (data: {
    tradeName: string;
    category: string;
    tradeData?: Trade;
  }) => {
    // Use the actual trade data from API response if available
    if (data.tradeData) {
      // Update the trade in local state with the actual API response data
      setTrades(prevTrades =>
        prevTrades.map(trade =>
          trade.uuid === editingTradeUuid ? data.tradeData! : trade
        )
      );
    } else {
      // Fallback: Update the trade in local state manually
      setTrades(prevTrades =>
        prevTrades.map(trade =>
          trade.uuid === editingTradeUuid
            ? {
                ...trade,
                name: data.tradeName,
                categories: data.category.split(', ').map(cat => ({
                  id: Date.now(),
                  name: cat.trim(),
                  status: 'ACTIVE',
                })),
                updated_at: new Date().toISOString(),
              }
            : trade
        )
      );
    }
  };

  return (
    <div className='w-full overflow-y-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <h2 className='page-title'>{TRADE_MESSAGES.TRADE_MANAGEMENT_TITLE}</h2>
        <Button className='btn-primary' onClick={() => setSideSheetOpen(true)}>
          {TRADE_MESSAGES.ADD_TRADE_BUTTON}
        </Button>
      </div>
      {/* Trade Grid */}
      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
        {trades.length === 0 && loading ? (
          // Initial loading state with skeleton cards
          Array.from({ length: 10 }).map((_, idx) => (
            <TradeCardSkeleton key={idx} />
          ))
        ) : trades.length === 0 && !loading ? (
          <div className='col-span-full text-center '>
            <NoDataFound
              buttonText={TRADE_MESSAGES.ADD_TRADE_BUTTON}
              onButtonClick={() => setSideSheetOpen(true)}
              description={TRADE_MESSAGES.NO_TRADES_FOUND_DESCRIPTION}
            />
          </div>
        ) : (
          trades.map((trade, idx) => (
            <InfoCard
              key={trade.uuid}
              tradeName={trade.name || ''}
              category={`${trade.categories?.length || 0} Category${(trade.categories?.length || 0) !== 1 ? 's' : ''}`}
              menuOptions={menuOptions}
              onMenuAction={action => handleMenuAction(action, idx)}
            />
          ))
        )}
      </div>

      {/* Loading more trades */}
      {loading && trades.length > 0 && (
        <div className='w-full text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}

      <ConfirmDeleteModal
        open={modalOpen}
        title={TRADE_MESSAGES.DELETE_CONFIRM_TITLE}
        subtitle={TRADE_MESSAGES.DELETE_CONFIRM_SUBTITLE.replace(
          '{name}',
          deleteTradeName || ''
        )}
        onCancel={() => setModalOpen(false)}
        onDelete={handleDelete}
      />
      <SideSheet
        title={
          editingTradeUuid
            ? TRADE_MESSAGES.EDIT_TRADE_TITLE
            : TRADE_MESSAGES.ADD_TRADE_TITLE
        }
        open={sideSheetOpen}
        onOpenChange={open => {
          setSideSheetOpen(open);
          if (!open) {
            setEditingTradeUuid(undefined);
          }
        }}
        size='600px'
      >
        <TradeForm
          onSubmit={editingTradeUuid ? handleUpdateTrade : handleCreateTrade}
          loading={loading}
          onCancel={() => {
            setSideSheetOpen(false);
            setEditingTradeUuid(undefined);
          }}
          initialTradeUuid={editingTradeUuid}
        />
      </SideSheet>
    </div>
  );
}
