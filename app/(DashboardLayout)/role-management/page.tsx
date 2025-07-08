'use client';

import { RoleCard } from '@/components/shared/cards/RoleCard';
import { roles } from '@/constants/dummy-data';
import { Edit2, Trash } from 'iconsax-react';
import Link from 'next/link';
import React from 'react';
const menuOptions = [
  { label: 'Edit', action: 'edit', icon: Edit2 },
  { label: 'Delete', action: 'delete', icon: Trash },
];
const RoleManagement = () => {
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

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
        {roles.map((role, index) => (
          <React.Fragment key={index}>
            <RoleCard
              menuOptions={menuOptions}
              iconSrc={role.iconSrc}
              iconBgColor={role.iconBgColor}
              title={role.title}
              description={role.description}
              permissionCount={role.permissionCount}
              iconColor={role.color}
            />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default RoleManagement;
