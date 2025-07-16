import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiService } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from '@/lib/validations/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { CHANGE_PASSWORD_MESSAGES } from '../../../app/(DashboardLayout)/user-management/user-messages';
import { showErrorToast, showSuccessToast } from '../../ui/use-toast';
import FormErrorMessage from '../common/FormErrorMessage';

interface ChangePasswordFormProps {
  onSubmit?: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
  loading?: boolean;
  onCancel?: () => void;
}

export default function ChangePasswordForm({
  onSubmit,
  loading,
}: ChangePasswordFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onFormSubmit = async (data: ChangePasswordFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
    try {
      await apiService.changePassword(data.currentPassword, data.newPassword);
      showSuccessToast(CHANGE_PASSWORD_MESSAGES.CHANGE_PASSWORD_SUCCESS);
      reset();
    } catch (error: any) {
      showErrorToast(
        error?.message || CHANGE_PASSWORD_MESSAGES.CHANGE_PASSWORD_ERROR
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='w-full mx-auto p-0'>
      <p className='text-[16px] text-[var(--text-secondary)] mb-8'>
        {CHANGE_PASSWORD_MESSAGES.SUBTITLE}
      </p>
      <div className='mb-4 space-y-2'>
        <Label
          htmlFor='currentPassword'
          className='text-[14px] font-semibold text-[var(--text-dark)] mb-1'
        >
          {CHANGE_PASSWORD_MESSAGES.CURRENT_PASSWORD_LABEL}
        </Label>
        <Controller
          name='currentPassword'
          control={control}
          render={({ field }) => (
            <Input
              id='currentPassword'
              type='password'
              placeholder={
                CHANGE_PASSWORD_MESSAGES.CURRENT_PASSWORD_PLACEHOLDER
              }
              {...field}
              className={cn(
                'h-12 border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                errors.currentPassword
                  ? 'border-[var(--warning)]'
                  : 'border-[var(--border-dark)]'
              )}
            />
          )}
        />
        <FormErrorMessage message={errors.currentPassword?.message || ''} />
      </div>
      <div className='mb-4 space-y-2'>
        <Label
          htmlFor='newPassword'
          className='text-[14px] font-semibold text-[var(--text-dark)] mb-1'
        >
          {CHANGE_PASSWORD_MESSAGES.NEW_PASSWORD_LABEL}
        </Label>
        <Controller
          name='newPassword'
          control={control}
          render={({ field }) => (
            <Input
              id='newPassword'
              type='password'
              placeholder={CHANGE_PASSWORD_MESSAGES.NEW_PASSWORD_PLACEHOLDER}
              {...field}
              className={cn(
                'h-12 border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                errors.newPassword
                  ? 'border-[var(--warning)]'
                  : 'border-[var(--border-dark)]'
              )}
            />
          )}
        />
        <p className='text-xs text-[var(--text-secondary)] mt-1'>
          {CHANGE_PASSWORD_MESSAGES.NEW_PASSWORD_HELP}
        </p>
        <FormErrorMessage message={errors.newPassword?.message || ''} />
      </div>
      <div className='mb-8 space-y-2'>
        <Label
          htmlFor='confirmPassword'
          className='text-[14px] font-semibold text-[var(--text-dark)] mb-1'
        >
          {CHANGE_PASSWORD_MESSAGES.CONFIRM_PASSWORD_LABEL}
        </Label>
        <Controller
          name='confirmPassword'
          control={control}
          render={({ field }) => (
            <Input
              id='confirmPassword'
              type='password'
              placeholder={
                CHANGE_PASSWORD_MESSAGES.CONFIRM_PASSWORD_PLACEHOLDER
              }
              {...field}
              className={cn(
                'h-12 border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                errors.confirmPassword
                  ? 'border-[var(--warning)]'
                  : 'border-[var(--border-dark)]'
              )}
            />
          )}
        />
        <FormErrorMessage message={errors.confirmPassword?.message || ''} />
      </div>
      <Button
        type='submit'
        className='w-full h-12 bg-[var(--secondary)] hover:bg-green-600 text-white font-semibold rounded-full text-base mb-6'
        disabled={loading}
      >
        {CHANGE_PASSWORD_MESSAGES.BUTTON}
      </Button>
      <div className='text-center text-[14px] text-[var(--text-secondary)] mt-2'>
        {CHANGE_PASSWORD_MESSAGES.SUPPORT_TEXT}{' '}
        <a
          href='#'
          className='font-semibold text-[var(--text-dark)] underline-none'
        >
          {CHANGE_PASSWORD_MESSAGES.SUPPORT_LINK}
        </a>
      </div>
    </form>
  );
}
