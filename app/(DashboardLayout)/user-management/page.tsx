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
import { useToast } from '@/components/ui/use-toast';
import { apiService, FetchUsersResponse, User } from '@/lib/api';
import { showToast } from '@/lib/utils';
import { Edit2, Trash } from 'iconsax-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch roles and first page of users
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setUsers([]);
    fetchUsers(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        fetchUsers(page + 1, true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore, page, filter]);

  const fetchUsers = async (targetPage = 1, append = false) => {
    setLoading(true);
    try {
      // Fetch roles only on first load
      if (targetPage === 1) {
        const rolesRes = await apiService.fetchRoles({ page: 1, limit: 50 });
        const roleList = rolesRes?.data?.data || [];
        setRoles(
          roleList.map((role: any) => ({ id: role.id, name: role.name }))
        );
      }
      const role_id = filter !== 'all' ? filter : '';
      const usersRes: FetchUsersResponse = await apiService.fetchUsers({
        page: targetPage,
        limit: 20,
        role_id,
      });
      const newUsers = usersRes.data;
      setUsers(prev => (append ? [...prev, ...newUsers] : newUsers));
      setPage(targetPage);
      setHasMore(usersRes.pagination.page < usersRes.pagination.totalPages);
    } catch (err: any) {
      showToast({
        toast,
        type: 'error',
        title: 'Error',
        description: err?.message || 'Failed to fetch users.',
      });
      if (!append) setUsers([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Status toggle handler
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const user = users.find(u => u.id === id);
      console.log('INNNNN', user);
      if (!user || !user.uuid) throw new Error('User UUID not found');
      const newStatus = currentStatus ? 'INACTIVE' : 'ACTIVE';
      console.log(user.uuid, newStatus);
      await apiService.updateUserStatus(user.uuid, newStatus);
      setUsers(users =>
        users.map(u => (u.id === id ? { ...u, status: newStatus } : u))
      );
      showToast({
        toast,
        type: 'success',
        title: 'Success',
        description: `User status updated to ${newStatus}.`,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to update user status.';
      showToast({
        toast,
        type: 'error',
        title: 'Error',
        description: message,
      });
    }
  };

  // Delete handler
  const handleDeleteUser = async (id: number) => {
    try {
      await apiService.deleteUser(id);
      setUsers(users => users.filter(user => user.id !== id));
      showToast({
        toast,
        type: 'success',
        title: 'Success',
        description: 'User deleted successfully.',
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete user.';
      showToast({
        toast,
        type: 'error',
        title: 'Error',
        description: message,
      });
    }
  };

  const menuOptions = [
    { label: 'Edit', action: 'edit', icon: Edit2 },
    { label: 'Delete', action: 'delete', icon: Trash, variant: 'destructive' },
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
              {roles.map(role => (
                <SelectItem key={role.id} value={String(role.id)}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            asChild
            className='h-[42px] px-6 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white'
            disabled={loading}
          >
            <Link href='/user-management/create-user'>Add Admin or User</Link>
          </Button>
        </div>
      </div>
      {/* User Grid */}
      {loading && users.length === 0 ? (
        <div className='text-center py-10'>Loading...</div>
      ) : users.length === 0 ? (
        <div className='text-center py-10 text-gray-500'>No users found.</div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {users.map(user => (
            <UserCard
              key={user.id}
              name={user.name}
              role={user.role?.name || ''}
              phone={user.phone_number}
              email={user.email}
              image={user.profile_picture_url}
              status={user.status === 'ACTIVE'}
              onToggle={() =>
                handleToggleStatus(user.id, user.status === 'ACTIVE')
              }
              menuOptions={menuOptions}
              onDelete={() => handleDeleteUser(user.id)}
              disableActions={loading}
            />
          ))}
        </div>
      )}
      {loading && users.length > 0 && (
        <div className='text-center py-4'>Loading more...</div>
      )}
    </div>
  );
}
