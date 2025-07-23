'use client';
import { InfoCard } from '@/components/shared/cards/InfoCard';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import SideSheet from '@/components/shared/common/SideSheet';
import MaterialForm from '@/components/shared/forms/MaterialForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS } from '@/constants/common';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { Add, Edit2, Trash } from 'iconsax-react';
import React, { useCallback, useEffect, useState } from 'react';
import NoDataFound from '../../../components/shared/common/NoDataFound';
import TradeCardSkeleton from '../../../components/shared/skeleton/TradeCardSkeleton';
import { MATERIAL_MESSAGES } from './material-messages';
import { Material } from './material-types';

const menuOptions: {
  label: string;
  action: string;
  icon: React.ElementType;
  variant?: 'default' | 'destructive';
}[] = [
  {
    label: MATERIAL_MESSAGES.EDIT_MENU,
    action: ACTIONS.EDIT,
    icon: Edit2,
    variant: 'default',
  },
  {
    label: MATERIAL_MESSAGES.DELETE_MENU,
    action: ACTIONS.DELETE,
    icon: Trash,
    variant: 'destructive',
  },
];

export default function MaterialManagementPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(28);
  const [search] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [deleteMaterialName, setDeleteMaterialName] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [editingMaterialUuid, setEditingMaterialUuid] = useState<
    string | undefined
  >(undefined);
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Get user permissions for materials
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.materials?.edit;

  const fetchMaterials = useCallback(
    async (targetPage = 1, append = false) => {
      setLoading(true);
      try {
        const response = await apiService.fetchMaterials({
          page: targetPage,
          limit,
          name: search,
        });

        // Handle different possible response structures
        let newMaterials: Material[] = [];
        let total = 0;
        const { data: materialsData } = response;
        if (materialsData) {
          // If data is directly an array
          if (Array.isArray(materialsData)) {
            newMaterials = materialsData;
            total = materialsData.length; // Fallback if no total provided
          }
          // If data is nested under data.data
          else if (materialsData.data && Array.isArray(materialsData.data)) {
            newMaterials = materialsData.data;
            total = materialsData.total || materialsData.data.length;
          }
          // If data is just the response itself (fallback)
          else if (Array.isArray(materialsData)) {
            newMaterials = materialsData;
            total = materialsData.length;
          }
        }

        setMaterials(prev => {
          if (append) {
            // Filter out duplicates when appending to prevent duplicate keys
            const existingUuids = new Set(prev.map(material => material.uuid));
            const uniqueNewMaterials = newMaterials.filter(
              material => !existingUuids.has(material.uuid)
            );
            return [...prev, ...uniqueNewMaterials];
          } else {
            return newMaterials;
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
          MATERIAL_MESSAGES.FETCH_ERROR
        );
        showErrorToast(message);
        if (!append) setMaterials([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [limit, search, handleAuthError, showErrorToast]
  );

  // Fetch first page of materials
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setMaterials([]);
    fetchMaterials(1, false);
  }, [fetchMaterials]);

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
        fetchMaterials(nextPage, true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, fetchMaterials, page]);

  const handleMenuAction = (action: string, idx: number) => {
    const material = materials[idx];
    if (!material) return;

    if (action === ACTIONS.EDIT) {
      setEditingMaterialUuid(material.uuid);
      setSideSheetOpen(true);
    }
    if (action === ACTIONS.DELETE) {
      setDeleteIdx(idx);
      setDeleteMaterialName(material.name || '');
      setModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (deleteIdx !== null) {
      const material = materials[deleteIdx];
      if (material) {
        try {
          const response = await apiService.deleteMaterial(material.uuid);
          showSuccessToast(
            response.message || MATERIAL_MESSAGES.DELETE_SUCCESS
          );
          // Remove the material from local state instead of fetching again
          setMaterials(prevMaterials =>
            prevMaterials.filter((_, index) => index !== deleteIdx)
          );
        } catch (error) {
          console.error('Failed to delete material:', error);
          showErrorToast(MATERIAL_MESSAGES.DELETE_ERROR);
        }
      }
      setDeleteIdx(null);
      setModalOpen(false);
    }
  };

  const handleCreateMaterial = async (data: {
    materialName: string;
    services: string;
    materialData?: Material;
  }) => {
    // Use the actual material data from API response if available
    if (data.materialData) {
      // Add the new material to the beginning of the materials list
      setMaterials(prevMaterials => [data.materialData!, ...prevMaterials]);
    } else {
      // Fallback: Create a new material object to add to local state
      const newMaterial: Material = {
        id: Date.now(), // Temporary ID for local state
        uuid: `temp-${Date.now()}`, // Temporary UUID
        name: data.materialName,
        description: '',
        is_default: false,
        is_active: true,
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        services: data.services.split(', ').map(service => ({
          id: Date.now(),
          name: service.trim(),
          status: 'ACTIVE',
        })),
      };

      // Add the new material to the beginning of the materials list
      setMaterials(prevMaterials => [newMaterial, ...prevMaterials]);
    }
  };

  const handleUpdateMaterial = async (data: {
    materialName: string;
    services: string;
    materialData?: Material;
  }) => {
    // Use the actual material data from API response if available
    if (data.materialData) {
      // Update the material in local state with the actual API response data
      setMaterials(prevMaterials =>
        prevMaterials.map(material =>
          material.uuid === editingMaterialUuid ? data.materialData! : material
        )
      );
    } else {
      // Fallback: Update the material in local state manually
      setMaterials(prevMaterials =>
        prevMaterials.map(material =>
          material.uuid === editingMaterialUuid
            ? {
                ...material,
                name: data.materialName,
                services: data.services.split(', ').map(service => ({
                  id: Date.now(),
                  name: service.trim(),
                  status: 'ACTIVE',
                })),
                updated_at: new Date().toISOString(),
              }
            : material
        )
      );
    }
  };

  return (
    <div className='w-full overflow-y-auto'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 xl:mb-8'>
        <div className='flex items-center justify-between w-full'>
          <h2 className='page-title'>
            {MATERIAL_MESSAGES.MATERIAL_MANAGEMENT_TITLE}
          </h2>
          {canEdit && (
            <div className='flex justify-end'>
              <Button
                className='btn-primary flex items-center shrink-0 justify-center !px-0 sm:!px-6 text-center !w-[42px] sm:!w-auto rounded-full'
                onClick={() => setSideSheetOpen(true)}
              >
                <Add size='20' color='#fff' className='sm:hidden' />
                <span className='hidden sm:inline'>
                  {MATERIAL_MESSAGES.ADD_MATERIAL_BUTTON}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Material Grid */}
      <div className='grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 xl:gap-6'>
        {materials.length === 0 && loading ? (
          // Initial loading state with skeleton cards
          Array.from({ length: 10 }).map((_, idx) => (
            <TradeCardSkeleton key={idx} />
          ))
        ) : materials.length === 0 && !loading ? (
          <div className='col-span-full text-center h-full md:h-[calc(100vh_-_220px)]'>
            <NoDataFound
              buttonText={MATERIAL_MESSAGES.ADD_MATERIAL_BUTTON}
              onButtonClick={() => setSideSheetOpen(true)}
              description={MATERIAL_MESSAGES.NO_MATERIALS_FOUND_DESCRIPTION}
              showButton={canEdit ?? false}
            />
          </div>
        ) : (
          materials.map((material, idx) => (
            <InfoCard
              key={material.uuid}
              tradeName={material.name || ''}
              category={`${material.services?.length || 0} Service${(material.services?.length || 0) !== 1 ? 's' : ''}`}
              menuOptions={menuOptions}
              onMenuAction={action => handleMenuAction(action, idx)}
              module='materials'
            />
          ))
        )}
      </div>

      {/* Loading more materials */}
      {loading && materials.length > 0 && (
        <div className='w-full text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}

      <ConfirmDeleteModal
        open={modalOpen}
        title={MATERIAL_MESSAGES.DELETE_CONFIRM_TITLE}
        subtitle={MATERIAL_MESSAGES.DELETE_CONFIRM_SUBTITLE.replace(
          '{name}',
          deleteMaterialName || ''
        )}
        onCancel={() => setModalOpen(false)}
        onDelete={handleDelete}
      />
      <SideSheet
        title={
          editingMaterialUuid
            ? MATERIAL_MESSAGES.EDIT_MATERIAL_TITLE
            : MATERIAL_MESSAGES.ADD_MATERIAL_TITLE
        }
        open={sideSheetOpen}
        onOpenChange={open => {
          setSideSheetOpen(open);
          if (!open) {
            setEditingMaterialUuid(undefined);
          }
        }}
        size='600px'
      >
        <MaterialForm
          onSubmit={
            editingMaterialUuid ? handleUpdateMaterial : handleCreateMaterial
          }
          loading={loading}
          onCancel={() => {
            setSideSheetOpen(false);
            setEditingMaterialUuid(undefined);
          }}
          initialMaterialUuid={editingMaterialUuid}
        />
      </SideSheet>
    </div>
  );
}
