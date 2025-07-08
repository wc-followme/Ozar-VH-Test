'use client';

import { UserCard } from '@/components/shared/cards/UserCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit2, Trash } from 'iconsax-react';
import Link from 'next/link';
import { useState } from 'react';

// Dummy user data
const dummyUsers = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Admin',
    phone: '(555) 123-4567',
    email: 'alex.johnson@example.com',
    image:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 2,
    name: 'Maria Smith',
    role: 'Contractor',
    phone: '(555) 123-4567',
    email: 'maria.smith@example.com',
    image:
      'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 3,
    name: 'David Brown',
    role: 'Project Manager',
    phone: '(555) 123-4567',
    email: 'david.brown@example.com',
    image:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 4,
    name: 'Sophia Davis',
    role: 'Estimator',
    phone: '(555) 123-4567',
    email: 'sophia.davis@example.com',
    image:
      'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 5,
    name: 'James Wilson',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'james.wilson@example.com',
    image:
      'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 6,
    name: 'Olivia Garcia',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'olivia.garcia@example.com',
    image:
      'https://images.pexels.com/photos/2625122/pexels-photo-2625122.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 7,
    name: 'Liam Martinez',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'liam.martinez@example.com',
    image:
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 8,
    name: 'Emma Rodriguez',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'emma.rodriguez@example.com',
    image:
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 9,
    name: 'Noah Hernandez',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'noah.hernandez@example.com',
    image:
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 10,
    name: 'Ava Lopez',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'ava.lopez@example.com',
    image:
      'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 11,
    name: 'Ethan Gonzalez',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'ethan.gonzalez@example.com',
    image:
      'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 12,
    name: 'Isabella Perez',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'isabella.perez@example.com',
    image:
      'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState(dummyUsers);
  const [filter, setFilter] = useState('all');

  const handleToggleStatus = (id: number) => {
    setUsers(
      users.map(user =>
        user.id === id ? { ...user, status: !user.status } : user
      )
    );
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'admin') return user.role === 'Admin';
    if (filter === 'contractor') return user.role === 'Contractor';
    if (filter === 'manager') return user.role === 'Project Manager';
    if (filter === 'employee') return user.role === 'Employee';
    if (filter === 'estimator') return user.role === 'Estimator';
    return true;
  });

  const menuOptions = [
    { label: 'Edit', action: 'edit', icon: Edit2 },
    { label: 'Delete', action: 'delete', icon: Trash },
  ];

  return (
    <div className='w-full p-6 overflow-y-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-2xl font-medium text-[var(--text-dark)]'>
          Admin / User Management
        </h1>

        <div className='flex items-center gap-4'>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className='w-40 bg-[var(--white-background)] rounded-[30px] border-2 border-[var(--border-dark)] h-[42px]'>
              <SelectValue placeholder='All Users' />
            </SelectTrigger>
            <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
              <SelectItem value='all'>All Users</SelectItem>
              <SelectItem value='admin'>Admin</SelectItem>
              <SelectItem value='contractor'>Contractor</SelectItem>
              <SelectItem value='manager'>Project Manager</SelectItem>
              <SelectItem value='employee'>Employee</SelectItem>
              <SelectItem value='estimator'>Estimator</SelectItem>
            </SelectContent>
          </Select>

          <Button
            asChild
            className='h-[42px] px-6 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white'
          >
            <Link href='/user-management/create-user'>Add Admin or User</Link>
          </Button>
        </div>
      </div>

      {/* User Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {filteredUsers.map(user => (
          <UserCard
            key={user.id}
            name={user.name}
            role={user.role}
            phone={user.phone}
            email={user.email}
            image={user.image}
            status={user.status}
            onToggle={() => handleToggleStatus(user.id)}
            menuOptions={menuOptions}
          />
        ))}
      </div>
    </div>
  );
}
