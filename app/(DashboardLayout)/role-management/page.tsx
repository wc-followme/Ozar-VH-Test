'use client';

import { RoleCard } from '@/components/shared/cards/RoleCard';
import { APP_CONFIG, PAGINATION } from '@/constants/common';
import { iconOptions } from '@/constants/sidebar-items';
import { apiService } from '@/lib/api';
import { Edit2, Trash } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
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

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(PAGINATION.DEFAULT_LIMIT); // Use common constant
  const [search] = useState('');
  const [loading, setLoading] = useState(false);
  const [name] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [showNoMoreMessage, setShowNoMoreMessage] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const router = useRouter();

  const fetchRoles = async (append = false) => {
    setLoading(true);
    try {
      const params: FetchRolesParams = {
        page,
        limit,
        search,
        name,
      };
      const res = (await apiService.fetchRoles(params)) as RoleApiResponse;
      const data = res.data || { data: [], total: 0 };
      const newRoles = data.data;
      setRoles(prev => (append ? [...prev, ...newRoles] : newRoles));
      const total = data.total;
      setHasMore(page * limit < total);
    } catch {
      if (!append) setRoles([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset no more message when parameters change
    setShowNoMoreMessage(false);
    fetchRoles(page > 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, name]);

  // Infinite scroll logic with sentinel element
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver(entries => {
        if (entries[0] && entries[0].isIntersecting) {
          if (hasMore && roles.length > 0) {
            setPage(prev => prev + 1);
          } else if (!hasMore && roles.length > 0) {
            // User tried to scroll but no more data - show message
            setShowNoMoreMessage(true);
            // Hide message after configured timeout
            setTimeout(() => {
              setShowNoMoreMessage(false);
            }, APP_CONFIG.TOAST_AUTO_HIDE_MS);
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, roles.length]
  );

  // Handler for deleting a role
  const handleDeleteRole = async (uuid: string) => {
    try {
      await apiService.deleteRole(uuid);
      setRoles(prev => prev.filter(role => role.uuid !== uuid));
    } catch {
      alert(ROLE_MESSAGES.DELETE_ERROR);
    }
  };

  // Handler for editing a role
  const handleEditRole = (uuid: string) => {
    router.push(`/role-management/edit-role/${uuid}`);
  };

  return (
    <section className='flex flex-col w-full items-start gap-8 overflow-y-auto'>
      <header className='flex items-center justify-between w-full'>
        <h2 className='page-title'>{ROLE_MESSAGES.PAGE_TITLE}</h2>
        <Link href={'/role-management/create-role'} className='btn-primary'>
          {ROLE_MESSAGES.CREATE_ROLE_BUTTON}
        </Link>
      </header>
      {/* Commented out for now as we are not using it */}
      {/* <div className='w-full flex items-center gap-4 mb-4'>
        <input
          type='text'
          placeholder='Search roles...'
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className='border border-gray-300 rounded-lg px-4 py-2 w-64'
        />
        <input
          type='text'
          placeholder='Filter by name...'
          value={name}
          onChange={e => {
            setName(e.target.value);
            setPage(1);
          }}
          className='border border-gray-300 rounded-lg px-4 py-2 w-64'
        />
      </div> */}
      {/* Roles Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full'>
        {roles.length === 0 && !loading ? (
          <div className='col-span-4 text-center py-8'>
            {ROLE_MESSAGES.NO_ROLES_FOUND}
          </div>
        ) : (
          roles.map((role, index) => {
            const iconOption = iconOptions.find(
              opt => opt.value === role.icon
            ) || {
              icon: () => null,
              color: '#00a8bf',
            };
            return (
              <div key={role.id || index}>
                <RoleCard
                  menuOptions={menuOptions}
                  iconSrc={iconOption.icon}
                  iconBgColor={iconOption.color + '26'}
                  title={role.name}
                  description={role.description}
                  permissionCount={role.total_permissions || 0}
                  iconColor={iconOption.color}
                  onEdit={() => handleEditRole(role.uuid)}
                  onDelete={() => handleDeleteRole(role.uuid)}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Sentinel element for infinite scroll */}
      {roles.length > 0 && <div ref={sentinelRef} className='w-full h-4'></div>}

      {loading && (
        <div className='w-full text-center py-4'>{ROLE_MESSAGES.LOADING}</div>
      )}
      {showNoMoreMessage && (
        <div className='w-full text-center py-4 text-gray-400'>
          {ROLE_MESSAGES.NO_MORE_ROLES}
        </div>
      )}
    </section>
  );
};

export default RoleManagement;
