import * as yup from 'yup';

export const createRoleSchema = yup.object({
  name: yup
    .string()
    .required('Role name is required')
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Role name can only contain letters and spaces'),

  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must not exceed 200 characters'),

  icon: yup.string().required('Icon is required'),

  permissions: yup.mixed().optional(), // Accept permissions object, validated in logic
});

export type CreateRoleFormData = yup.InferType<typeof createRoleSchema> & {
  permissions?: import('../lib/api').UserPermissions;
};
