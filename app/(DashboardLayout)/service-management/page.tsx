'use client';
import { InfoCard } from '@/components/shared/cards/InfoCard';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import SideSheet from '@/components/shared/common/SideSheet';
import ServiceForm from '@/components/shared/forms/ServiceForm';
import ServiceCardSkeleton from '@/components/shared/skeleton/ServiceCardSkeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage } from '@/lib/utils';
import { Edit2, Trash } from 'iconsax-react';
import React, { useCallback, useEffect, useState } from 'react';
import { SERVICE_MESSAGES } from './service-messages';
import { Service } from './service-types';

const menuOptions: {
  label: string;
  action: string;
  icon: React.ElementType;
  variant?: 'default' | 'destructive';
}[] = [
  {
    label: SERVICE_MESSAGES.EDIT_MENU,
    action: 'edit',
    icon: Edit2,
    variant: 'default',
  },
  {
    label: SERVICE_MESSAGES.DELETE_MENU,
    action: 'delete',
    icon: Trash,
    variant: 'destructive',
  },
];

export default function ServiceManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(28);
  const [search] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [deleteServiceName, setDeleteServiceName] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [editingServiceUuid, setEditingServiceUuid] = useState<
    string | undefined
  >(undefined);
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  const fetchServices = useCallback(
    async (targetPage = 1, append = false) => {
      setLoading(true);
      try {
        const response = await apiService.fetchServices({
          page: targetPage,
          limit,
          name: search,
        });

        // Handle different possible response structures
        let newServices: Service[] = [];
        let total = 0;
        const { data: servicesData } = response;
        if (servicesData) {
          // If data is directly an array
          if (Array.isArray(servicesData)) {
            newServices = servicesData;
            total = servicesData.length; // Fallback if no total provided
          }
          // If data is nested under data.data
          else if (servicesData.data && Array.isArray(servicesData.data)) {
            newServices = servicesData.data;
            total = servicesData.total || servicesData.data.length;
          }
          // If data is just the response itself (fallback)
          else if (Array.isArray(servicesData)) {
            newServices = servicesData;
            total = servicesData.length;
          }
        }

        setServices(prev => {
          if (append) {
            // Filter out duplicates when appending to prevent duplicate keys
            const existingUuids = new Set(prev.map(service => service.uuid));
            const uniqueNewServices = newServices.filter(
              service => !existingUuids.has(service.uuid)
            );
            return [...prev, ...uniqueNewServices];
          } else {
            return newServices;
          }
        });

        setPage(targetPage);
        setHasMore(targetPage * limit < total);
      } catch (err: unknown) {
        // Handle auth errors first (will redirect to login if 401)
        if (handleAuthError(err)) {
          return; // Don't show toast if it's an auth error
        }

        const message = extractApiErrorMessage(
          err,
          SERVICE_MESSAGES.FETCH_ERROR
        );
        showErrorToast(message);
        if (!append) setServices([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [limit, search, handleAuthError, showErrorToast]
  );

  // Fetch first page of services
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setServices([]);
    fetchServices(1, false);
  }, [fetchServices]);

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
        fetchServices(nextPage, true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, fetchServices, page]);

  const handleMenuAction = (action: string, idx: number) => {
    const service = services[idx];
    if (!service) return;

    if (action === 'edit') {
      setEditingServiceUuid(service.uuid);
      setSideSheetOpen(true);
    }
    if (action === 'delete') {
      setDeleteIdx(idx);
      setDeleteServiceName(service.name || '');
      setModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (deleteIdx !== null) {
      const service = services[deleteIdx];
      if (service) {
        try {
          const { message } = await apiService.deleteService(service.uuid);
          showSuccessToast(message || SERVICE_MESSAGES.DELETE_SUCCESS);
          // Remove the service from local state instead of fetching again
          setServices(prevServices =>
            prevServices.filter((_, index) => index !== deleteIdx)
          );
        } catch (error) {
          console.error('Failed to delete service:', error);
          showErrorToast(SERVICE_MESSAGES.DELETE_ERROR);
        }
      }
      setDeleteIdx(null);
      setModalOpen(false);
    }
  };

  const handleCreateService = async (data: {
    serviceName: string;
    trades: string;
    serviceData?: Service;
  }) => {
    // Use the actual service data from API response if available
    if (data.serviceData) {
      // Add the new service to the beginning of the services list
      setServices(prevServices => [data.serviceData!, ...prevServices]);
    } else {
      // Fallback: Create a new service object to add to local state
      const newService: Service = {
        id: Date.now(), // Temporary ID for local state
        uuid: `temp-${Date.now()}`, // Temporary UUID
        name: data.serviceName,
        description: '',
        is_default: false,
        is_active: true,
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        trades: data.trades.split(', ').map(trade => ({
          id: Date.now(),
          name: trade.trim(),
          status: 'ACTIVE',
        })),
      };

      // Add the new service to the beginning of the services list
      setServices(prevServices => [newService, ...prevServices]);
    }
  };

  const handleUpdateService = async (data: {
    serviceName: string;
    trades: string;
    serviceData?: Service;
  }) => {
    // Use the actual service data from API response if available
    if (data.serviceData) {
      // Update the service in local state with the actual API response data
      setServices(prevServices =>
        prevServices.map(service =>
          service.uuid === editingServiceUuid ? data.serviceData! : service
        )
      );
    } else {
      // Fallback: Update the service in local state manually
      setServices(prevServices =>
        prevServices.map(service =>
          service.uuid === editingServiceUuid
            ? {
                ...service,
                name: data.serviceName,
                trades: data.trades.split(', ').map(trade => ({
                  id: Date.now(),
                  name: trade.trim(),
                  status: 'ACTIVE',
                })),
                updated_at: new Date().toISOString(),
              }
            : service
        )
      );
    }
  };

  return (
    <div className='w-full overflow-y-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <h2 className='page-title'>
          {SERVICE_MESSAGES.SERVICE_MANAGEMENT_TITLE}
        </h2>
        <Button className='btn-primary' onClick={() => setSideSheetOpen(true)}>
          {SERVICE_MESSAGES.ADD_SERVICE_BUTTON}
        </Button>
      </div>
      {/* Service Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 xl:gap-6'>
        {services.length === 0 && loading ? (
          // Initial loading state with skeleton cards
          Array.from({ length: 10 }).map((_, idx) => (
            <ServiceCardSkeleton key={idx} />
          ))
        ) : services.length === 0 && !loading ? (
          <div className='col-span-full text-center '>
            <NoDataFound
              buttonText={SERVICE_MESSAGES.ADD_SERVICE_BUTTON}
              onButtonClick={() => setSideSheetOpen(true)}
              description={SERVICE_MESSAGES.NO_SERVICES_FOUND_DESCRIPTION}
            />
          </div>
        ) : (
          services.map((service, idx) => (
            <InfoCard
              key={service.uuid}
              tradeName={service.name || ''}
              category={`${service.trades?.length || 0} Trade${(service.trades?.length || 0) !== 1 ? 's' : ''}`}
              menuOptions={menuOptions}
              onMenuAction={action => handleMenuAction(action, idx)}
              module='services'
            />
          ))
        )}
      </div>

      {/* Loading more services */}
      {loading && services.length > 0 && (
        <div className='w-full text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}

      <ConfirmDeleteModal
        open={modalOpen}
        title={SERVICE_MESSAGES.DELETE_CONFIRM_TITLE}
        subtitle={SERVICE_MESSAGES.DELETE_CONFIRM_SUBTITLE.replace(
          '{name}',
          deleteServiceName || ''
        )}
        onCancel={() => setModalOpen(false)}
        onDelete={handleDelete}
      />
      <SideSheet
        title={
          editingServiceUuid
            ? SERVICE_MESSAGES.EDIT_SERVICE_TITLE
            : SERVICE_MESSAGES.ADD_SERVICE_TITLE
        }
        open={sideSheetOpen}
        onOpenChange={open => {
          setSideSheetOpen(open);
          if (!open) {
            setEditingServiceUuid(undefined);
          }
        }}
        size='600px'
      >
        <ServiceForm
          onSubmit={
            editingServiceUuid ? handleUpdateService : handleCreateService
          }
          loading={loading}
          onCancel={() => {
            setSideSheetOpen(false);
            setEditingServiceUuid(undefined);
          }}
          initialServiceUuid={editingServiceUuid}
        />
      </SideSheet>
    </div>
  );
}
