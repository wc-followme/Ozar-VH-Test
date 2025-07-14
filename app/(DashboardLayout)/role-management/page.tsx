'use client';

import { RoleCard } from '@/components/shared/cards/RoleCard';
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
  const [limit] = useState(10); // Show 10 records by default
  const [search] = useState('');
  const [loading, setLoading] = useState(false);
  const [name] = useState('');
  const [hasMore, setHasMore] = useState(true);
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
    fetchRoles(page > 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, name]);

  // Infinite scroll logic
  const lastRoleRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver(entries => {
        if (entries[0] && entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
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
        <h2 className='text-2xl font-medium text-[var(--text-dark)]'>
          {ROLE_MESSAGES.PAGE_TITLE}
        </h2>
        <Link
          href={'/role-management/create-role'}
          className='h-[42px] px-6 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white flex items-center gap-2'
        >
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
            // Attach ref to last item for infinite scroll
            const isLast = index === roles.length - 1;
            return (
              <div
                key={role.id || index}
                ref={isLast ? lastRoleRef : undefined}
              >
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
      {loading && (
        <div className='w-full text-center py-4'>{ROLE_MESSAGES.LOADING}</div>
      )}
      {!hasMore && roles.length > 0 && (
        <div className='w-full text-center py-4 text-gray-400'>
          {ROLE_MESSAGES.NO_MORE_ROLES}
        </div>
      )}
    </section>
  );
};

export default RoleManagement;
