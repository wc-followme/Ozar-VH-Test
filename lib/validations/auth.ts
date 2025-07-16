import * as yup from 'yup';
import { CHANGE_PASSWORD_MESSAGES } from '../../app/(DashboardLayout)/user-management/user-messages';

// Login form validation schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password is too long'),
});

// Type inference from schema
export type LoginFormData = yup.InferType<typeof loginSchema>;

// Server-side validation function
export const validateLoginData = async (
  data: unknown
): Promise<{
  isValid: boolean;
  errors?: Record<string, string>;
  data?: LoginFormData;
}> => {
  try {
    const validatedData = await loginSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    return {
      isValid: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach(err => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });

      return {
        isValid: false,
        errors,
      };
    }

    return {
      isValid: false,
      errors: { general: 'Validation failed' },
    };
  }
};

export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required(CHANGE_PASSWORD_MESSAGES.CURRENT_PASSWORD_REQUIRED),
  newPassword: yup
    .string()
    .required(CHANGE_PASSWORD_MESSAGES.NEW_PASSWORD_REQUIRED)
    .min(8, CHANGE_PASSWORD_MESSAGES.NEW_PASSWORD_MIN)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
      CHANGE_PASSWORD_MESSAGES.NEW_PASSWORD_COMPLEXITY
    ),
  confirmPassword: yup
    .string()
    .required(CHANGE_PASSWORD_MESSAGES.CONFIRM_PASSWORD_REQUIRED)
    .oneOf(
      [yup.ref('newPassword')],
      CHANGE_PASSWORD_MESSAGES.PASSWORDS_DO_NOT_MATCH
    ),
});

export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;
