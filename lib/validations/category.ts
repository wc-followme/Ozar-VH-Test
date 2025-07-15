import * as yup from 'yup';

// Category form validation schema
export const createCategorySchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must not exceed 50 characters'),
  description: yup
    .string()
    .trim()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  icon: yup.string().trim().required('Icon is required'),
});

// TypeScript interface for form data
export interface CreateCategoryFormData {
  name: string;
  description: string;
  icon: string;
}
