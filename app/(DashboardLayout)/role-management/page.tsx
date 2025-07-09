'use client';

import { Material } from '@/components/icons/Material';
import { RoleIcon } from '@/components/icons/RoleIcon';
import { RoleCard } from '@/components/shared/cards/RoleCard';
import { apiService } from '@/lib/api';
import { Edit2, Trash } from 'iconsax-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const iconMap: Record<string, any> = {
  'fas fa-cog': Material,
  'fas fa-user-shield': RoleIcon,
  // Add more mappings as needed
};
const iconBgMap: Record<string, string> = {
  'fas fa-cog': '#E0F7FA',
  'fas fa-user-shield': '#E3F2FD',
  // Add more mappings as needed
};
const iconColorMap: Record<string, string> = {
  'fas fa-cog': '#00a8bf',
  'fas fa-user-shield': '#4c6ef5',
  // Add more mappings as needed
};

const menuOptions = [
  { label: 'Edit', action: 'edit', icon: Edit2 },
  { label: 'Delete', action: 'delete', icon: Trash },
];

const RoleManagement = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await apiService.fetchRoles({ page, limit, search, name });
      setRoles(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      setRoles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, name]);

  const totalPages = Math.ceil(total / limit);

  return (
    <section className='flex flex-col w-full items-start gap-8 p-6 overflow-y-auto'>
      <header className='flex items-center justify-between w-full'>
        <h2 className='text-2xl font-medium text-[var(--text-dark)]'>
          Role and Permissions Management
        </h2>
        <Link
          href={'/role-management/create-role'}
          className='h-[42px] px-6 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white flex items-center gap-2'
        >
          Create Role
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
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
        {loading ? (
          <div className='col-span-4 text-center py-8'>Loading...</div>
        ) : roles.length === 0 ? (
          <div className='col-span-4 text-center py-8'>No roles found.</div>
        ) : (
          roles.map((role, index) => {
            const iconKey = role.icon || 'fas fa-cog';
            const IconComponent = iconMap[iconKey] || Material;
            const iconBgColor = iconBgMap[iconKey] || '#E0F7FA';
            const iconColor = iconColorMap[iconKey] || '#00a8bf';
            return (
              <React.Fragment key={role.id || index}>
                <RoleCard
                  menuOptions={menuOptions}
                  iconSrc={IconComponent}
                  iconBgColor={iconBgColor}
                  title={role.name}
                  description={role.description}
                  permissionCount={role.total_permissions}
                  iconColor={iconColor}
                />
              </React.Fragment>
            );
          })
        )}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex gap-2 mt-6'>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className='px-3 py-1 rounded border bg-gray-100 disabled:opacity-50'
          >
            Prev
          </button>
          <span className='px-2 py-1'>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className='px-3 py-1 rounded border bg-gray-100 disabled:opacity-50'
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default RoleManagement;
