// Company management type definitions

// Form error interface
export interface CompanyFormErrors {
  name?: string;
  tagline?: string;
  about?: string;
  email?: string;
  phone_number?: string;
  communication?: string;
  website?: string;
  expiry_date?: string;
  preferred_communication_method?: string;
  city?: string;
  pincode?: string;
  projects?: string;
  general?: string;
}

// Company form data interface for create operations
export interface CompanyCreateFormData {
  name: string;
  tagline: string;
  about: string;
  email: string;
  phone_number: string;
  communication: string;
  website: string;
  expiry_date: string;
  preferred_communication_method: string;
  city: string;
  pincode: string;
  projects: string;
  image?: string;
}

// Company initial data for form (for edit mode)
export interface CompanyInitialData {
  name?: string;
  tagline?: string;
  about?: string;
  email?: string;
  phone_number?: string;
  communication?: string;
  website?: string;
  expiry_date?: string;
  preferred_communication_method?: string;
  city?: string;
  pincode?: string;
  projects?: string;
  image?: string;
}

// Props interface for company form component
export interface CompanyInfoFormProps {
  imageUrl?: string;
  onSubmit: (data: CompanyCreateFormData) => void;
  loading?: boolean;
  error?: string | undefined;
  initialData?: CompanyInitialData;
  isEditMode?: boolean;
}
