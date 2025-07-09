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
import { iconOptions } from '@/constants/sidebar-items';
import { apiService, type ApiError, type CreateRoleRequest } from '@/lib/api';
import {
  createRoleSchema,
  type CreateRoleFormData,
} from '@/lib/validations/role';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const CreateRole = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      </div>

      {/* Main Content */}
      <Card className='flex flex-col gap-8 p-6 flex-1 w-full border-1 border-[#E8EAED] rounded-[20px] bg-white'>
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
