'use client';

import { RoleForm } from '@/components/shared/forms/RoleForm';
import { useToast } from '@/components/ui/use-toast';
import { STATUS_CODES } from '@/constants/status-codes';
import { apiService } from '@/lib/api';
import { extractApiErrorMessage } from '@/lib/utils';
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
      if (
        response.statusCode === STATUS_CODES.OK ||
        response.statusCode === STATUS_CODES.CREATED
      ) {
        toast({
          title: 'Success',
          description: 'Role created successfully',
          variant: 'default',
          duration: 4000,
        });
        router.push('/role-management');
      } else {
        throw new Error(response.message || 'Failed to create role');
      }
    } catch (err: any) {
      const message = extractApiErrorMessage(err, 'Failed to create role');
      setIsSubmitting(false);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col gap-8 flex-1 w-full'>
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
