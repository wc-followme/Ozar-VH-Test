'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import { RoleForm } from '@/components/shared/forms/RoleForm';
import { useToast } from '@/components/ui/use-toast';
import { STATUS_CODES } from '@/constants/status-codes';
import { apiService } from '@/lib/api';
import { extractApiErrorMessage } from '@/lib/utils';
import { CreateRoleFormData } from '@/lib/validations/role';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROLE_MESSAGES } from '../../role-messages';
import type { ApiResponse, Role, UpdateRoleRequest } from '../../types';

const breadcrumbData: BreadcrumbItem[] = [
  { name: ROLE_MESSAGES.ROLE_MANAGEMENT_BREADCRUMB, href: '/role-management' },
  { name: ROLE_MESSAGES.EDIT_ROLE_BREADCRUMB }, // current page
];

const EditRolePage = () => {
  const router = useRouter();
  const params = useParams();
  const { showSuccessToast, showErrorToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<CreateRoleFormData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const uuid = params['uuid'] as string;

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = (await apiService.getRoleDetails(
          uuid
        )) as ApiResponse<Role>;
        const data = res.data;
        if (data) {
          setInitialValues({
            name: data.name || '',
            description: data.description || '',
            icon: data.icon || '',
          });
        }
      } catch (err: unknown) {
        setError(extractApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    if (uuid) fetchRole();
  }, [uuid]);

  const onSubmit = async (data: CreateRoleFormData) => {
    setIsSubmitting(true);
    try {
      const response = (await apiService.updateRoleDetails(
        uuid,
        data as UpdateRoleRequest
      )) as ApiResponse;
      if (
        response.statusCode === STATUS_CODES.OK ||
        response.statusCode === STATUS_CODES.CREATED
      ) {
        showSuccessToast(ROLE_MESSAGES.UPDATE_SUCCESS);
        router.push('/role-management');
      } else {
        throw new Error(response.message || ROLE_MESSAGES.UPDATE_ERROR);
      }
    } catch (err: unknown) {
      let errorMessage = ROLE_MESSAGES.UPDATE_ERROR;
      const apiError = err as any; // Using any for flexibility with different error structures

      if (apiError.statusCode === STATUS_CODES.BAD_REQUEST) {
        errorMessage = ROLE_MESSAGES.INVALID_DATA;
      } else if (apiError.statusCode === STATUS_CODES.UNAUTHORIZED) {
        errorMessage = ROLE_MESSAGES.UNAUTHORIZED;
      } else if (apiError.statusCode === STATUS_CODES.CONFLICT) {
        errorMessage = ROLE_MESSAGES.DUPLICATE_ROLE;
      } else if (apiError.statusCode === STATUS_CODES.UNPROCESSABLE_ENTITY) {
        if (apiError.errors) {
          const errorMessages = Object.values(apiError.errors).flat();
          errorMessage = errorMessages.join(', ');
        } else {
          errorMessage = apiError.message || ROLE_MESSAGES.VALIDATION_ERROR;
        }
      } else if (apiError.statusCode === STATUS_CODES.NETWORK_ERROR) {
        errorMessage = ROLE_MESSAGES.NETWORK_ERROR;
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      showErrorToast(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingComponent variant='fullscreen' />;
  if (error) return <div className='p-8 text-red-500'>{error}</div>;

  if (!initialValues) return null;

  return (
    <div className='flex flex-col gap-8 p-6 flex-1 w-full'>
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbData} className='mb-2' />

      <RoleForm
        mode='edit'
        isSubmitting={isSubmitting}
        initialValues={initialValues}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default EditRolePage;
