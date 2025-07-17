import { ROLE_MESSAGES } from '@/app/(DashboardLayout)/role-management/role-messages';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { iconOptions } from '@/constants/sidebar-items';
import { cn } from '@/lib/utils';
import { CreateRoleFormData, createRoleSchema } from '@/lib/validations/role';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FormErrorMessage from '../common/FormErrorMessage';
import IconFieldWrapper from '../common/IconFieldWrapper';

interface RoleFormProps {
  initialValues?: Partial<CreateRoleFormData>;
  onSubmit: (data: CreateRoleFormData) => Promise<void>;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

export const RoleForm: React.FC<RoleFormProps> = React.memo(({
  initialValues,
  onSubmit,
  isSubmitting,
  mode,
}) => {
  const router = useRouter();
  
  // Memoize default icon option to prevent unnecessary re-computations
  const defaultIconOption = useMemo(() => iconOptions[0], []);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateRoleFormData>({
    resolver: yupResolver(createRoleSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: defaultIconOption?.value ?? '',
      ...initialValues,
    },
  });

  // Reset form when initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name || '',
        description: initialValues.description || '',
        icon: (initialValues.icon || defaultIconOption?.value) ?? '',
      });
    }
  }, [initialValues, reset, defaultIconOption?.value]);

  // Memoize the cancel handler to prevent unnecessary re-renders
  const handleCancel = useCallback(() => {
    router.push('/role-management');
  }, [router]);

  // Memoize submit button content
  const submitButtonContent = useMemo(() => {
    if (isSubmitting) {
      return (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          {mode === 'edit'
            ? ROLE_MESSAGES.UPDATING_BUTTON
            : ROLE_MESSAGES.CREATING_BUTTON}
        </>
      );
    }
    return mode === 'edit' ? ROLE_MESSAGES.UPDATE_BUTTON : ROLE_MESSAGES.CREATE_BUTTON;
  }, [isSubmitting, mode]);

  return (
    <Card className='flex flex-col gap-8 p-6 flex-1 w-full border-1 border-[#E8EAED] rounded-[20px] bg-[var(--card-background)]'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
        {/* Top row with input fields */}
        <div className='flex items-start gap-6 w-full'>
          {/* Icon selector */}
          <Controller
            name='icon'
            control={control}
            render={({ field }) => (
              <IconFieldWrapper
                label={ROLE_MESSAGES.ICON_LABEL}
                value={field.value}
                onChange={field.onChange}
                iconOptions={iconOptions}
                error={errors.icon?.message || ''}
              />
            )}
          />

          {/* Role Name input */}
          <div className='flex flex-col w-[300px] items-start gap-2'>
            <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              {ROLE_MESSAGES.ROLE_NAME_LABEL}
            </Label>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className={cn(
                    'h-12 border-2',
                    errors.name
                      ? 'border-[var(--warning)]'
                      : 'border-[var(--border-dark)]',
                    'focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
                  )}
                  placeholder={ROLE_MESSAGES.ROLE_NAME_PLACEHOLDER}
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.name && (
              <FormErrorMessage message={errors.name.message || ''} />
            )}
          </div>

          {/* Description input */}
          <div className='flex flex-col items-start gap-2 flex-1'>
            <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              {ROLE_MESSAGES.DESCRIPTION_LABEL}
            </Label>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className={cn(
                    'h-12 border-2',
                    errors.description
                      ? 'border-[var(--warning)]'
                      : 'border-[var(--border-dark)]',
                    'focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
                  )}
                  placeholder={ROLE_MESSAGES.DESCRIPTION_PLACEHOLDER}
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.description && (
              <FormErrorMessage message={errors.description.message || ''} />
            )}
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className='flex items-start justify-end gap-3'>
          <button
            type='button'
            className='h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] flex items-center'
            onClick={handleCancel}
          >
            {ROLE_MESSAGES.CANCEL_BUTTON}
          </button>
          <button
            type='submit'
            className='h-[48px] font-semibold text-white text-base bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-[30px] px-6'
            disabled={isSubmitting}
          >
            {submitButtonContent}
          </button>
        </div>
      </form>
    </Card>
  );
});

RoleForm.displayName = 'RoleForm';
