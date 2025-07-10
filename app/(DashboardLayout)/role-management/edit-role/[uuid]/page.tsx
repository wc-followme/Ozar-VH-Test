'use client';
import { RoleForm } from '@/components/shared/forms/RoleForm';
import { useToast } from '@/components/ui/use-toast';
import { STATUS_CODES } from '@/constants/status-codes';
import { apiService } from '@/lib/api';
import type { CreateRoleFormData } from '@/lib/validations/role';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROLE_MESSAGES } from '../../role-messages';

const EditRolePage = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
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
        const res = (await apiService.getRoleDetails(uuid)) as { data: any };
        const data = res.data;
        setInitialValues({
          name: data.name || '',
          description: data.description || '',
          icon: data.icon || '',
          status: data.status || 'ACTIVE',
        });
      } catch (err: any) {
        setError('Failed to load role details.');
      } finally {
        setLoading(false);
      }
    };
    if (uuid) fetchRole();
  }, [uuid]);

  const onSubmit = async (data: CreateRoleFormData) => {
    setIsSubmitting(true);
    try {
      const response = (await apiService.updateRoleDetails(uuid, data)) as {
        statusCode: number;
        message?: string;
      };
      if (
        response.statusCode === STATUS_CODES.OK ||
        response.statusCode === STATUS_CODES.CREATED
      ) {
        toast({
          title: 'Success!',
          description: ROLE_MESSAGES.UPDATE_SUCCESS,
          variant: 'default',
        });
        router.push('/role-management');
      } else {
        throw new Error(response.message || ROLE_MESSAGES.UPDATE_ERROR);
      }
    } catch (err: any) {
      let errorMessage = ROLE_MESSAGES.UPDATE_ERROR;
      if (err.response) {
        const apiError = err.response.data;
        if (apiError.status === STATUS_CODES.BAD_REQUEST) {
          errorMessage = ROLE_MESSAGES.INVALID_DATA;
        } else if (apiError.status === STATUS_CODES.UNAUTHORIZED) {
          errorMessage = ROLE_MESSAGES.UNAUTHORIZED;
        } else if (apiError.status === STATUS_CODES.CONFLICT) {
          errorMessage = ROLE_MESSAGES.DUPLICATE_ROLE;
        } else if (apiError.status === STATUS_CODES.UNPROCESSABLE_ENTITY) {
          if (apiError.errors) {
            const errorMessages = Object.values(apiError.errors).flat();
            errorMessage = errorMessages.join(', ');
          } else {
            errorMessage = apiError.message || ROLE_MESSAGES.VALIDATION_ERROR;
          }
        } else if (apiError.status === STATUS_CODES.NETWORK_ERROR) {
          errorMessage = ROLE_MESSAGES.NETWORK_ERROR;
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
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

  if (loading) return <div className='p-8'>Loading...</div>;
  if (error) return <div className='p-8 text-red-500'>{error}</div>;

  if (!initialValues) return null;

  return (
    <div className='flex flex-col gap-8 p-6 flex-1 w-full'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-[var(--text-dark)] text-[14px] font-normal text-[var(--primary)]'>
            Role Management
          </span>
          <span className='text-[var(--text-dark)] text-[14px] font-normal'>
            /
          </span>
          <span className='text-[var(--text-dark)] text-[14px] font-normal text-[var(--primary)]'>
            Edit Role
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
