'use client';

import { UserCard } from '@/components/shared/cards/UserCard';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { PAGINATION } from '@/constants/common';
import { apiService, FetchUsersResponse, User } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage } from '@/lib/utils';
import { Edit2, Trash } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { MenuOption, Role, RoleApiResponse } from './types';
import { USER_MESSAGES } from './user-messages';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [_page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();
  const router = useRouter();

  const isRoleApiResponse = (obj: unknown): obj is RoleApiResponse => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'data' in obj &&
      typeof (obj as RoleApiResponse).data === 'object' &&
      (obj as RoleApiResponse).data !== null &&
      'data' in (obj as RoleApiResponse).data &&
      Array.isArray((obj as RoleApiResponse).data.data)
    );
  };

  const fetchUsers = useCallback(
    async (targetPage = 1, append = false) => {
      setLoading(true);
      try {
        // Fetch roles only on first load
        if (targetPage === 1) {
          const rolesRes = await apiService.fetchRoles({
            page: 1,
            limit: PAGINATION.ROLES_DROPDOWN_LIMIT,
          });
          const roleList = isRoleApiResponse(rolesRes)
            ? rolesRes.data.data
            : [];
          setRoles(
            roleList.map(({ id, name, status }) => ({
              id,
              name,
              status: status || 'ACTIVE',
            }))
          );
        }
        const role_id = filter !== 'all' ? filter : '';
        const usersRes: FetchUsersResponse = await apiService.fetchUsers({
          page: targetPage,
          limit: PAGINATION.USERS_LIMIT,
          role_id,
        });
        const newUsers = usersRes.data;

        setUsers(prev => {
          if (append) {
            // Filter out duplicates when appending to prevent duplicate keys
            const existingUuids = new Set(prev.map(user => user.uuid));
            const uniqueNewUsers = newUsers.filter(
              user => !existingUuids.has(user.uuid)
            );
            return [...prev, ...uniqueNewUsers];
          } else {
            return newUsers;
          }
        });

        setPage(targetPage);
        setHasMore(usersRes.pagination.page < usersRes.pagination.totalPages);
      } catch (err: unknown) {
        if (handleAuthError(err)) {
          return;
        }
        const message = extractApiErrorMessage(err, USER_MESSAGES.FETCH_ERROR);
        showErrorToast(message);
        if (!append) setUsers([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [filter, handleAuthError, showErrorToast]
  );

  // Fetch roles and first page of users
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setUsers([]);
    fetchUsers(1, false);
  }, [fetchUsers]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          fetchUsers(nextPage, true);
          return nextPage;
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, fetchUsers]); // Added fetchUsers to dependencies

  // Status toggle handler
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const user = users.find(u => u.id === id);
      if (!user || !user.uuid)
        throw new Error(USER_MESSAGES.USER_NOT_FOUND_ERROR);
      const newStatus = currentStatus ? 'INACTIVE' : 'ACTIVE';
      await apiService.updateUserStatus(user.uuid, newStatus);
      setUsers(users =>
        users.map(u => (u.id === id ? { ...u, status: newStatus } : u))
      );
      showSuccessToast(`${USER_MESSAGES.STATUS_UPDATE_SUCCESS}`);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message =
        err instanceof Error ? err.message : USER_MESSAGES.STATUS_UPDATE_ERROR;
      showErrorToast(message);
    }
  };

  // Delete handler
  const handleDeleteUser = async (uuid: string) => {
    try {
      await apiService.deleteUser(uuid);
      setUsers(users => users.filter(user => user.uuid !== uuid));
      showSuccessToast(USER_MESSAGES.DELETE_SUCCESS);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message =
        err instanceof Error ? err.message : USER_MESSAGES.DELETE_ERROR;
      showErrorToast(message);
    }
  };

  // Handler for create user navigation with loading state
  const handleCreateUser = useCallback(() => {
    setIsNavigating(true);
    router.push('/user-management/create-user');
  }, [router]);

  const menuOptions: MenuOption[] = [
    { label: 'Edit', action: 'edit', icon: Edit2, variant: 'default' },
    {
      label: 'Archive',
      action: 'delete',
      icon: Trash,
      variant: 'destructive',
    },
  ];

  // Show navigation loading state
  if (isNavigating) {
    return <LoadingComponent variant='fullscreen' text='Loading form...' />;
  }

  return (
    <div className='w-full overflow-y-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <h2 className='page-title'>{USER_MESSAGES.USER_MANAGEMENT_TITLE}</h2>
        <div className='flex items-center gap-4'>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className='w-40 bg-[var(--white-background)] rounded-[30px] border-2 border-[var(--border-dark)] h-[42px]'>
              <SelectValue placeholder={USER_MESSAGES.ALL_USERS} />
            </SelectTrigger>
            <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
              <SelectItem
                value='all'
                className='text-[var(--text-dark)] hover:bg-[var(--select-option)] focus:bg-[var(--select-option)] cursor-pointer rounded-[5px]'
              >
                {USER_MESSAGES.ALL_USERS}
              </SelectItem>
              {roles.map(({ id, name }) => (
                <SelectItem
                  key={id}
                  value={String(id)}
                  className='text-[var(--text-dark)] hover:bg-[var(--select-option)] focus:bg-[var(--select-option)] cursor-pointer rounded-[5px]'
                >
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            onClick={handleCreateUser}
            className='btn-primary'
            disabled={loading}
          >
            {USER_MESSAGES.ADD_ADMIN_USER_BUTTON}
          </button>
        </div>
      </div>
      {/* Initial Loading State */}
      {users.length === 0 && loading ? (
        <LoadingComponent variant='fullscreen' />
      ) : (
        <>
          {/* User Grid */}
          {users.length === 0 && !loading ? (
            <div className='text-center py-10 text-gray-500'>
              {USER_MESSAGES.NO_USERS_FOUND}
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4'>
              {users.map(
                ({
                  uuid,
                  name,
                  role,
                  phone_number,
                  email,
                  profile_picture_url,
                  status,
                  id,
                }) => (
                  <UserCard
                    key={uuid} // Use uuid instead of id for unique keys
                    name={name}
                    role={role?.name || ''}
                    phone={phone_number}
                    email={email}
                    image={
                      profile_picture_url
                        ? (process.env['NEXT_PUBLIC_CDN_URL'] || '') +
                          profile_picture_url
                        : ''
                    }
                    status={status === 'ACTIVE'}
                    onToggle={() => handleToggleStatus(id, status === 'ACTIVE')}
                    menuOptions={menuOptions}
                    onDelete={() => handleDeleteUser(uuid)}
                    disableActions={loading}
                    userUuid={uuid}
                  />
                )
              )}
            </div>
          )}
        </>
      )}
      {loading && users.length > 0 && (
        <div className='text-center py-4'>
          <LoadingComponent
            variant='inline'
            size='sm'
            text={USER_MESSAGES.LOADING_MORE}
          />
        </div>
      )}
    </div>
  );
}
