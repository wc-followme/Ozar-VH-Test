'use client';
import { RoleForm } from '@/components/shared/forms/RoleForm';
import { useToast } from '@/components/ui/use-toast';
import { STATUS_CODES } from '@/constants/status-codes';
import { apiService } from '@/lib/api';
import type { CreateRoleFormData } from '@/lib/validations/role';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROLE_MESSAGES } from '../../role-messages';
import type { ApiError, ApiResponse, Role } from '../../types';

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
        const res: ApiResponse<Role> = await apiService.getRoleDetails(uuid);
        const data = res.data;
        if (data) {
          setInitialValues({
            name: data.name || '',
            description: data.description || '',
            icon: data.icon || '',
            status: data.status || 'ACTIVE',
          });
        }
      } catch (_err: unknown) {
        setError(ROLE_MESSAGES.LOAD_ERROR);
      } finally {
        setLoading(false);
      }
    };
    if (uuid) fetchRole();
  }, [uuid]);

  const onSubmit = async (data: CreateRoleFormData) => {
    setIsSubmitting(true);
    try {
      const response: ApiResponse = await apiService.updateRoleDetails(
        uuid,
        data
      );
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
      const apiError = err as ApiError;

      if (apiError.response) {
        const apiErrorData = apiError.response.data;
        if (apiErrorData.status === STATUS_CODES.BAD_REQUEST) {
          errorMessage = ROLE_MESSAGES.INVALID_DATA;
        } else if (apiErrorData.status === STATUS_CODES.UNAUTHORIZED) {
          errorMessage = ROLE_MESSAGES.UNAUTHORIZED;
        } else if (apiErrorData.status === STATUS_CODES.CONFLICT) {
          errorMessage = ROLE_MESSAGES.DUPLICATE_ROLE;
        } else if (apiErrorData.status === STATUS_CODES.UNPROCESSABLE_ENTITY) {
          if (apiErrorData.errors) {
            const errorMessages = Object.values(apiErrorData.errors).flat();
            errorMessage = errorMessages.join(', ');
          } else {
            errorMessage =
              apiErrorData.message || ROLE_MESSAGES.VALIDATION_ERROR;
          }
        } else if (apiErrorData.status === STATUS_CODES.NETWORK_ERROR) {
          errorMessage = ROLE_MESSAGES.NETWORK_ERROR;
        } else if (apiErrorData.message) {
          errorMessage = apiErrorData.message;
        }
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className='p-8'>{ROLE_MESSAGES.LOADING}</div>;
  if (error) return <div className='p-8 text-red-500'>{error}</div>;

  if (!initialValues) return null;

  return (
    <div className='flex flex-col gap-8 p-6 flex-1 w-full'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-[var(--text-dark)] text-[14px] font-normal text-[var(--primary)]'>
            {ROLE_MESSAGES.ROLE_MANAGEMENT_BREADCRUMB}
          </span>
          <span className='text-[var(--text-dark)] text-[14px] font-normal'>
            /
          </span>
          <span className='text-[var(--text-dark)] text-[14px] font-normal text-[var(--primary)]'>
            {ROLE_MESSAGES.EDIT_ROLE_BREADCRUMB}
          </span>
        </div>
      </div>
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
