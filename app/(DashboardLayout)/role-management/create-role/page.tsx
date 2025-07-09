'use client';

import { RoleForm } from '@/components/shared/forms/RoleForm';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateRole = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const onSubmit = async data => {
    setIsSubmitting(true);
    try {
      const roleData = {
        name: data.name,
        description: data.description,
        icon: data.icon,
        status: data.status,
      };
      const response = await apiService.createRole(roleData);
      if (response.statusCode === 200 || response.statusCode === 201) {
        toast({
          title: 'Success!',
          description: 'Role created successfully.',
          variant: 'default',
        });
        router.push('/role-management');
      } else {
        throw new Error(response.message || 'Failed to create role');
      }
    } catch (error) {
      const apiError = error;
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
      <RoleForm mode='create' isSubmitting={isSubmitting} onSubmit={onSubmit} />
    </div>
  );
};

export default CreateRole;
