import { UpdateUserRequest } from '@/lib/api';
import { Icon } from 'iconsax-react';

// Role interface for dropdowns and API responses
export interface Role {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  total_permissions?: number;
  uuid?: string;
}

// Role API response structure
export interface RoleApiResponse {
  data: {
    data: Role[];
    total?: number;
    page?: number;
    limit?: number;
  };
}

// Form error interface
export interface FormErrors {
  roleCategory?: string;
  fullName?: string;
  designation?: string;
  date?: string;
  email?: string;
  phone?: string;
  password?: string;
  communication?: string;
  address?: string;
  city?: string;
  pinCode?: string;
  general?: string;
}

// User form data interface (for create and update)
export interface UserFormData {
  role_id: number;
  name: string;
  email: string;
  password?: string; // Optional for updates
  phone_number: string;
  profile_picture_url?: string; // Make this optional
  date_of_joining: string;
  designation: string;
  preferred_communication_method: string;
  address: string;
  city: string;
  pincode: string;
}

// User update form data interface
export interface UserUpdateFormData
  extends Omit<UpdateUserRequest, 'profile_picture_url'> {
  profile_picture_url?: string;
}

// User initial data for form (for edit mode)
export interface UserInitialData {
  role_id?: number;
  name?: string;
  email?: string;
  phone_number?: string;
  date_of_joining?: string;
  designation?: string;
  preferred_communication_method?: string;
  address?: string;
  city?: string;
  pincode?: string;
  profile_picture_url?: string;
}

// Error types for API responses
export interface ApiErrorResponse {
  message: string;
  status?: number;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// Menu option interface for user cards (matching UserCard's interface)
export interface MenuOption {
  label: string;
  action: string;
  icon: Icon;
  variant?: 'default' | 'destructive';
}

// Props interfaces for components
export interface UserInfoFormProps {
  roles: Role[];
  loadingRoles?: boolean;
  imageUrl?: string;
  onSubmit: (data: UserFormData) => void;
  loading?: boolean;
  error?: string | undefined;
  initialData?: UserInitialData;
  isEditMode?: boolean;
}
