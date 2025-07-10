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
import { iconOptions } from '@/constants/sidebar-items';
import { CreateRoleFormData, createRoleSchema } from '@/lib/validations/role';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FormErrorMessage from '../common/FormErrorMessage';
import IconFieldWrapper from '../common/IconFieldWrapper';

interface RoleFormProps {
  initialValues?: Partial<CreateRoleFormData>;
  onSubmit: (data: CreateRoleFormData) => Promise<void>;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

export const RoleForm: React.FC<RoleFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting,
  mode,
}) => {
  const router = useRouter();
  const defaultIconOption = iconOptions[0];
  const {
    control,
    handleSubmit,
    formState: { errors },
    // watch,
    reset,
  } = useForm<CreateRoleFormData>({
    resolver: yupResolver(createRoleSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: defaultIconOption?.value ?? '',
      status: 'ACTIVE',
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
        status: initialValues.status || 'ACTIVE',
      });
    }
  }, [initialValues, reset]);

  // const selectedIcon = watch('icon');
  // const getSelectedIconOption = () => {
  //   return (
  //     iconOptions.find(opt => opt.value === selectedIcon) ?? defaultIconOption
  //   );
  // };

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
                label='Icon'
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
              Role Name
            </Label>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
                  placeholder='Enter role name'
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
              Description
            </Label>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
                  placeholder='Enter role description'
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.description && (
              <FormErrorMessage message={errors.description.message || ''} />
            )}
          </div>

          {/* Status selector */}
          <div className='flex flex-col items-start gap-1'>
            <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              Status
            </Label>
            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                    <SelectItem value='ACTIVE'>Active</SelectItem>
                    <SelectItem value='INACTIVE'>Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormErrorMessage message={errors.status?.message || ''} />
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className='flex items-start justify-end gap-3'>
          <button
            type='button'
            className='h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] flex items-center'
            onClick={() => router.push('/role-management')}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='h-[48px] font-semibold text-white text-base bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-[30px] px-6'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                {mode === 'edit' ? 'Updating...' : 'Creating...'}
              </>
            ) : mode === 'edit' ? (
              'Update Role'
            ) : (
              'Create Role'
            )}
          </button>
        </div>
      </form>
    </Card>
  );
};
