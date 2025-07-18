'use client';

import { HelmetIcon } from '@/components/icons/HelmetIcon';
import { RoleCard } from '@/components/shared/cards/RoleCard';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import { useToast } from '@/components/ui/use-toast';
import { PAGINATION } from '@/constants/common';
import { roleIconOptions } from '@/constants/sidebar-items';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage, extractApiSuccessMessage } from '@/lib/utils';
import { Edit2, Trash } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import RoleCardSkeleton from '../../../components/shared/skeleton/RoleCardSkeleton';
import { ROLE_MESSAGES } from './role-messages';
import type { FetchRolesParams, Role, RoleApiResponse } from './types';

interface MenuOption {
  label: string;
  action: string;
  icon: React.ComponentType<{
    size?: string | number;
    color?: string;
    variant?: 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
  }>;
}

const menuOptions: MenuOption[] = [
  { label: ROLE_MESSAGES.EDIT_MENU, action: 'edit', icon: Edit2 },
  { label: ROLE_MESSAGES.DELETE_MENU, action: 'delete', icon: Trash },
];

// Adapter for icons that expect className instead of size/color
const IconAdapter = (IconComp: any) => {
  const WrappedIcon = ({ color = '#00a8bf' }) => (
    <IconComp className='w-[30px] h-[30px]' style={{ color }} />
  );
  WrappedIcon.displayName = `IconAdapter(${IconComp.displayName || IconComp.name || 'Component'})`;
  return WrappedIcon;
};

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(PAGINATION.DEFAULT_LIMIT); // Use common constant
  const [search] = useState('');
  const [loading, setLoading] = useState(true);
  const [name] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  const fetchRoles = useCallback(
    async (targetPage = 1, append = false) => {
      setLoading(true);
      try {
        const params: FetchRolesParams = {
          page: targetPage,
          limit,
          search,
          name,
          status: 'ACTIVE', // Only fetch active roles
        };
        const res = (await apiService.fetchRoles(params)) as RoleApiResponse;
        const data = res.data || { data: [], total: 0 };
        const newRoles = data.data;

        setRoles(prev => {
          if (append) {
            // Filter out duplicates when appending to prevent duplicate keys
            const existingUuids = new Set(prev.map(role => role.uuid));
            const uniqueNewRoles = newRoles.filter(
              role => !existingUuids.has(role.uuid)
            );
            return [...prev, ...uniqueNewRoles];
          } else {
            return newRoles;
          }
        });

        const total = data.total;
        setPage(targetPage);
        setHasMore(targetPage * limit < total);
      } catch {
        if (!append) setRoles([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [limit, search, name]
  );

  // Fetch first page of roles
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setRoles([]);
    fetchRoles(1, false);
  }, [fetchRoles]);

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
        fetchRoles(nextPage, true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, fetchRoles, page]);

  // Handler for deleting a role
  const handleDeleteRole = async (uuid: string) => {
    try {
      const response = await apiService.deleteRole(uuid);
      setRoles(prev => prev.filter(role => role.uuid !== uuid));
      showSuccessToast(
        extractApiSuccessMessage(response, ROLE_MESSAGES.DELETE_SUCCESS)
      );
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }
      const message = extractApiErrorMessage(err, ROLE_MESSAGES.DELETE_ERROR);
      showErrorToast(message);
    }
  };

  // Handler for editing a role with loading state
  const handleEditRole = useCallback(
    (uuid: string) => {
      setIsNavigating(true);
      router.push(`/role-management/edit-role/${uuid}`);
    },
    [router]
  );

  // Handler for create role navigation with loading state
  const handleCreateRole = useCallback(() => {
    setIsNavigating(true);
    router.push('/role-management/create-role');
  }, [router]);

  // Show navigation loading state
  if (isNavigating) {
    return <LoadingComponent variant='fullscreen' text='Loading form...' />;
  }

  // Ensure icon options is always an array and has label property
  const safeIconOptions = Array.isArray(roleIconOptions) ? roleIconOptions : [];

  return (
    <section className='flex flex-col w-full items-start gap-8 overflow-y-auto'>
      <header className='flex items-center justify-between w-full'>
        <h2 className='text-2xl font-medium text-[var(--text-dark)]'>
          {ROLE_MESSAGES.PAGE_TITLE}
        </h2>
        <button
          onClick={handleCreateRole}
          className='h-[42px] px-6 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white flex items-center gap-2'
        >
          {ROLE_MESSAGES.CREATE_ROLE_BUTTON}
        </button>
      </header>

      {/* Initial Loading State */}
      {roles.length === 0 && loading ? (
        <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full'>
          {[...Array(8)].map((_, i) => (
            <RoleCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Roles Grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full'>
            {roles.length === 0 && !loading ? (
              <div className='col-span-4'>
                <NoDataFound
                  buttonText={ROLE_MESSAGES.CREATE_ROLE_BUTTON}
                  onButtonClick={handleCreateRole}
                  description={ROLE_MESSAGES.NO_ROLES_FOUND_DESCRIPTION}
                />
              </div>
            ) : (
              roles.map(
                ({ uuid, icon, name, description, total_permissions }) => {
                  // Use the icon component directly if it matches the expected signature
                  const iconOptionRaw = safeIconOptions.find(
                    (opt: any) => opt.value === icon
                  );
                  const iconOption = iconOptionRaw
                    ? {
                        ...iconOptionRaw,
                        icon: IconAdapter(iconOptionRaw.icon),
                      }
                    : {
                        icon: IconAdapter(HelmetIcon),
                        color: '#00a8bf',
                      };
                  return (
                    <div key={uuid}>
                      <RoleCard
                        menuOptions={menuOptions}
                        iconSrc={iconOption.icon}
                        iconBgColor={iconOption.color + '26'}
                        title={name}
                        description={description}
                        permissionCount={total_permissions || 0}
                        iconColor={iconOption.color}
                        onEdit={() => handleEditRole(uuid)}
                        onDelete={() => handleDeleteRole(uuid)}
                      />
                    </div>
                  );
                }
              )
            )}
          </div>
        </>
      )}

      {/* Loading more roles */}
      {loading && roles.length > 0 && (
        <div className='w-full text-center py-4'>
          <LoadingComponent
            variant='inline'
            size='sm'
            text={ROLE_MESSAGES.LOADING_ROLES}
          />
        </div>
      )}
    </section>
  );
};

export default RoleManagement;
