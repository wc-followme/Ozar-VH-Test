'use client';

import { RoleForm } from '@/components/shared/forms/RoleForm';
import { useToast } from '@/components/ui/use-toast';
import { ROLE_MESSAGES } from '@/constants/role-messages';
import { apiService } from '@/lib/api';
import { showToast } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateRole = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const onSubmit = async (data: any) => {
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
        showToast({
          toast,
          type: 'success',
          title: 'Success!',
          description: ROLE_MESSAGES.CREATE_SUCCESS,
        });
        router.push('/role-management');
      } else {
        throw new Error(response.message || ROLE_MESSAGES.CREATE_ERROR);
      }
    } catch (error: any) {
      let errorMessage = ROLE_MESSAGES.UNEXPECTED_ERROR;
      if (error.status === 400) {
        errorMessage = ROLE_MESSAGES.INVALID_DATA;
      } else if (error.status === 401) {
        errorMessage = ROLE_MESSAGES.UNAUTHORIZED;
      } else if (error.status === 409) {
        errorMessage = ROLE_MESSAGES.DUPLICATE_ROLE;
      } else if (error.status === 422) {
        if (error.errors) {
          const errorMessages = Object.values(error.errors).flat();
          errorMessage = errorMessages.join(', ');
        } else {
          errorMessage = error.message || ROLE_MESSAGES.VALIDATION_ERROR;
        }
      } else if (error.status === 0) {
        errorMessage = ROLE_MESSAGES.NETWORK_ERROR;
      } else if (error.message) {
        errorMessage = error.message;
      }
      showToast({
        toast,
        type: 'error',
        title: 'Error',
        description: errorMessage,
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
