'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { apiService, type ApiError, type CreateRoleRequest } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  createRoleSchema,
  type CreateRoleFormData,
} from '@/lib/validations/role';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  BarChart,
  Database,
  FileText,
  Loader2,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const CreateRole = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to get cookie value
  const getCookie = (name: string): string | null => {
    if (typeof window === 'undefined') return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  };

  // Check token availability in cookies for debugging
  const hasToken =
    typeof window !== 'undefined' ? !!getCookie('auth_token') : false;

  // Icon options for the selector
  const iconOptions = [
    {
      value: 'fas fa-cog',
      label: 'Settings',
      icon: Settings,
      color: '#00a8bf',
    },
    { value: 'fas fa-users', label: 'Users', icon: Users, color: '#34ad44' },
    {
      value: 'fas fa-user-shield',
      label: 'Shield',
      icon: Shield,
      color: '#ff6b6b',
    },
    {
      value: 'fas fa-database',
      label: 'Database',
      icon: Database,
      color: '#4c6ef5',
    },
    {
      value: 'fas fa-file-text',
      label: 'Documents',
      icon: FileText,
      color: '#fd7e14',
    },
    {
      value: 'fas fa-chart-bar',
      label: 'Analytics',
      icon: BarChart,
      color: '#9c88ff',
    },
  ];

  // Default icon option
  const defaultIconOption = {
    value: 'fas fa-cog',
    label: 'Settings',
    icon: Settings,
    color: '#00a8bf',
  };

  // Form setup with validation
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateRoleFormData>({
    resolver: yupResolver(createRoleSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: 'fas fa-cog',
      status: 'ACTIVE',
    },
  });

  const selectedIcon = watch('icon');

  // Handle form submission
  const onSubmit = async (data: CreateRoleFormData) => {
    setIsSubmitting(true);

    try {
      const roleData: CreateRoleRequest = {
        name: data.name,
        description: data.description,
        icon: data.icon,
        status: data.status as 'ACTIVE' | 'INACTIVE',
      };

      const response = await apiService.createRole(roleData);

      if (response.statusCode === 200 || response.statusCode === 201) {
        toast({
          title: 'Success!',
          description: 'Role created successfully.',
          variant: 'default',
        });

        // Redirect to role management page
        router.push('/role-management');
      } else {
        throw new Error(response.message || 'Failed to create role');
      }
    } catch (error) {
      const apiError = error as ApiError;

      let errorMessage = 'An unexpected error occurred';

      if (apiError.status === 400) {
        errorMessage = 'Invalid role data. Please check your input.';
      } else if (apiError.status === 401) {
        errorMessage = 'You are not authorized to create roles.';
      } else if (apiError.status === 409) {
        errorMessage = 'A role with this name already exists.';
      } else if (apiError.status === 422) {
        if (apiError.errors) {
          const errorMessages = Object.values(apiError.errors).flat();
          errorMessage = errorMessages.join(', ');
        } else {
          errorMessage =
            apiError.message || 'Validation error. Please check your input.';
        }
      } else if (apiError.status === 0) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedIconOption = () => {
    return (
      iconOptions.find(opt => opt.value === selectedIcon) ?? defaultIconOption
    );
  };

  // Debug function to test API connection
  const testApiConnection = async () => {
    try {
      console.log('🧪 Testing API connection...');
      const result = await apiService.testConnection();
      toast({
        title: 'API Test Successful!',
        description: 'Headers and authentication are working correctly.',
        variant: 'default',
      });
      console.log('✅ API test successful:', result);
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: 'API Test Failed',
        description: `Error: ${apiError.message} (Status: ${apiError.status})`,
        variant: 'destructive',
      });
      console.error('❌ API test failed:', error);
    }
  };

  // Debug function to manually set token in cookies (for testing)
  const setTokenManually = () => {
    if (typeof window === 'undefined') {
      toast({
        title: 'Error',
        description: 'This function can only be used in the browser.',
        variant: 'destructive',
      });
      return;
    }

    const tokenFromLocalStorage = localStorage.getItem('auth_token');

    if (tokenFromLocalStorage) {
      // Set cookie manually using the token from localStorage
      const expires = new Date();
      expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      document.cookie = `auth_token=${tokenFromLocalStorage};expires=${expires.toUTCString()};path=/;SameSite=Lax`;

      toast({
        title: 'Token Set!',
        description: 'Auth token copied from localStorage to cookies.',
        variant: 'default',
      });

      console.log('✅ Token manually set in cookies');

      // Refresh the page to update the debug indicators
      window.location.reload();
    } else {
      toast({
        title: 'No Token Found',
        description: 'No token found in localStorage. Please login again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='flex flex-col gap-8 p-6 flex-1 w-full'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-[var(--text-dark)] text-[14px] font-normal text-[var(--primary)]'>
            Role Management
          </span>
          <span className='text-[var(--text-dark)] text-[14px] font-normal'>
            /
          </span>
          <span className='text-[var(--text-dark)] text-[14px] font-normal text-[var(--primary)]'>
            Create Role
          </span>
        </div>

        {/* Debug button - remove in production */}
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={testApiConnection}
            className='h-[32px] px-4 text-xs'
          >
            🧪 Test API
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={setTokenManually}
            className='h-[32px] px-4 text-xs'
          >
            🔧 Fix Token
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className='flex flex-col gap-8 p-6 flex-1 w-full border-1 border-[#E8EAED] rounded-[20px] bg-white'>
        {/* Debug info - remove in production */}
        <div className='bg-gray-50 p-4 rounded-lg border text-sm'>
          <div className='flex items-center gap-4 flex-wrap'>
            <span
              className={`px-2 py-1 rounded text-xs ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {isAuthenticated
                ? '✅ Auth Context: Authenticated'
                : '❌ Auth Context: Not Authenticated'}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs ${hasToken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {hasToken
                ? '✅ Token: Available (Cookies)'
                : '❌ Token: Missing (Cookies)'}
            </span>
            {typeof window !== 'undefined' &&
              localStorage.getItem('auth_token') && (
                <span className='px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800'>
                  📱 Token: Available (localStorage)
                </span>
              )}
            {user && (
              <span className='px-2 py-1 rounded text-xs bg-blue-100 text-blue-800'>
                👤 User: {user.first_name} {user.last_name}
              </span>
            )}
            <span className='text-gray-600'>
              Check browser console for detailed header logs when testing API
            </span>
          </div>
          {typeof window !== 'undefined' && (
            <div className='mt-2 text-xs text-gray-500'>
              🍪 Available cookies:{' '}
              {document.cookie
                ? document.cookie
                    .split(';')
                    .map(c => c.split('=')[0].trim())
                    .join(', ')
                : 'None'}
            </div>
          )}
          {typeof window !== 'undefined' &&
            !hasToken &&
            localStorage.getItem('auth_token') && (
              <div className='mt-2 text-xs text-orange-600'>
                ⚠️ Token exists in localStorage but not in cookies. Click "🔧
                Fix Token" to copy it to cookies.
              </div>
            )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
          {/* Top row with input fields */}
          <div className='flex items-start gap-6 w-full'>
            {/* Icon selector */}
            <div className='flex flex-col items-start gap-2'>
              <Label className='font-semibold text-[#2d2d2d] text-sm leading-[18px]'>
                Icon
              </Label>
              <Controller
                name='icon'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className='w-[100px] h-12 px-2 py-[7px] rounded-[10px] border-2 border-[#e8eaed]'>
                      <SelectValue>
                        <div
                          className='flex w-8 h-8 items-center justify-center rounded-lg'
                          style={{
                            backgroundColor: `${getSelectedIconOption().color}26`,
                          }}
                        >
                          {(() => {
                            const IconComponent = getSelectedIconOption().icon;
                            return (
                              <IconComponent
                                className='w-4 h-4'
                                style={{ color: getSelectedIconOption().color }}
                              />
                            );
                          })()}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                      {iconOptions.map(option => {
                        const IconComponent = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className='flex items-center gap-2'>
                              <div
                                className='flex w-6 h-6 items-center justify-center rounded-md'
                                style={{ backgroundColor: `${option.color}26` }}
                              >
                                <IconComponent
                                  className='w-3 h-3'
                                  style={{ color: option.color }}
                                />
                              </div>
                              <span className='text-sm'>{option.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.icon && (
                <span className='text-red-500 text-xs'>
                  {errors.icon.message}
                </span>
              )}
            </div>

            {/* Role Name input */}
            <div className='flex flex-col w-[300px] items-start gap-2'>
              <Label className='font-semibold text-[#2d2d2d] text-sm leading-[18px]'>
                Role Name
              </Label>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className='h-12 px-4 py-[18px] rounded-[10px] border-2 border-[#e8eaed]'
                    placeholder='Enter role name'
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.name && (
                <span className='text-red-500 text-xs'>
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Description input */}
            <div className='flex flex-col items-start gap-2 flex-1'>
              <Label className='font-semibold text-[#2d2d2d] text-sm leading-[18px]'>
                Description
              </Label>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className='h-12 px-4 py-[18px] rounded-[10px] border-2 border-[#e8eaed]'
                    placeholder='Enter role description'
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.description && (
                <span className='text-red-500 text-xs'>
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* Status selector */}
            <div className='flex flex-col items-start gap-2'>
              <Label className='font-semibold text-[#2d2d2d] text-sm leading-[18px]'>
                Status
              </Label>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className='w-[120px] h-12 px-4 py-[7px] rounded-[10px] border-2 border-[#e8eaed]'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                      <SelectItem value='ACTIVE'>Active</SelectItem>
                      <SelectItem value='INACTIVE'>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <span className='text-red-500 text-xs'>
                  {errors.status.message}
                </span>
              )}
            </div>
          </div>

          {/* Footer with action buttons */}
          <div className='flex items-start justify-end gap-3'>
            <Button
              type='button'
              variant='outline'
              className='w-[120px] h-[42px] font-semibold text-text text-base rounded-[30px] border-2 border-[#e8eaed]'
              disabled={isSubmitting}
              asChild
            >
              <Link href='/role-management'>Cancel</Link>
            </Button>
            <Button
              type='submit'
              className='h-[42px] font-semibold text-white text-base bg-[#34ad44] hover:bg-[#2d9a3a] rounded-[30px] px-6'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating...
                </>
              ) : (
                'Create Role'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateRole;
