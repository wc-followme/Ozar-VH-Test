'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import { useToast } from '@/components/ui/use-toast';
import { STATUS_CODES } from '@/constants/status-codes';
import { apiService } from '@/lib/api';
import { extractApiErrorMessage } from '@/lib/utils';
import { CreateRoleFormData } from '@/lib/validations/role';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ROLE_MESSAGES } from '../role-messages';
import type { ApiResponse, CreateRoleRequest } from '../types';

// Dynamic import for better performance
const RoleForm = dynamic(
  () =>
    import('@/components/shared/forms/RoleForm').then(mod => ({
      default: mod.RoleForm,
    })),
  {
    loading: () => <LoadingComponent variant='inline' />,
    ssr: false,
  }
);

const breadcrumbData: BreadcrumbItem[] = [
  { name: ROLE_MESSAGES.ROLE_MANAGEMENT_BREADCRUMB, href: '/role-management' },
  { name: ROLE_MESSAGES.CREATE_ROLE_BREADCRUMB }, // current page
];

const CreateRole = () => {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const onSubmit = async (data: CreateRoleFormData) => {
    setIsSubmitting(true);
    try {
      const roleData: CreateRoleRequest = {
        name: data.name,
        description: data.description,
        icon: data.icon,
        status: 'ACTIVE', // Default to ACTIVE when creating
      };
      const response: ApiResponse = await apiService.createRole(roleData);
      if (
        response.statusCode === STATUS_CODES.OK ||
        response.statusCode === STATUS_CODES.CREATED
      ) {
        showSuccessToast(ROLE_MESSAGES.CREATE_SUCCESS);
        router.push('/role-management');
      } else {
        throw new Error(response.message || ROLE_MESSAGES.CREATE_ERROR);
      }
    } catch (err: unknown) {
      const message = extractApiErrorMessage(err, ROLE_MESSAGES.CREATE_ERROR);
      setIsSubmitting(false);
      showErrorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col gap-7 flex-1 w-full'>
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbData} />

      {/* Main Content */}
      <RoleForm mode='create' isSubmitting={isSubmitting} onSubmit={onSubmit} />
    </div>
  );
};

export default CreateRole;
