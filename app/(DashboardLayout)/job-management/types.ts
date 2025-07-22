// Job management type definitions

export interface Job {
  id: number;
  uuid: string;
  company_id: string;
  client_id: number;
  job_image: string | null;
  project_name: string | null;
  project_id: string;
  category_id: number | null;
  category: string | null;
  budget: number | null;
  client_name: string;
  client_email: string;
  client_phone_number: string;
  client_address: string | null;
  latitude: number | null;
  longitude: number | null;
  job_share_link: string;
  job_boxes_step: string;
  job_status: string;
  job_privacy: string;
  property_type: string | null;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  status: string;
  project_start_date: string | null;
  project_finish_date: string | null;
  preferred_contractor: string | null;
  notification_style: string | null;
  approx_sq_ft: number | null;
  age_of_property: string | null;
  daily_work_start_time: string | null;
  daily_work_end_time: string | null;
  owner_present_need: boolean | null;
  weekend_work: boolean | null;
  has_animals: boolean | null;
  pet_type: string | null;
}

export interface JobApiResponse {
  statusCode: number;
  message: string;
  data: {
    data: Job[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface JobStatistics {
  all: number;
  need_attention: number;
  new_leads: number;
  ongoing_jobs: number;
  waiting_on_client: number;
  archived: number;
}

export interface JobStatisticsResponse {
  success: boolean;
  message: string;
  data: JobStatistics;
}

export interface CreateJobRequest {
  client_id?: string | number;
  client_name: string;
  client_email: string;
  client_phone_number: string;
  job_boxes_step: string;
  job_privacy: string;
  project_name?: string;
  budget?: number;
  category_id?: number;
  client_address?: string;
  latitude?: number;
  longitude?: number;
  property_type?: string;
  project_start_date?: string;
  project_finish_date?: string;
  preferred_contractor?: string;
  notification_style?: string;
  approx_sq_ft?: number;
  age_of_property?: string;
  daily_work_start_time?: string;
  daily_work_end_time?: string;
  owner_present_need?: boolean;
  weekend_work?: boolean;
  has_animals?: boolean;
  pet_type?: string;
}

export interface UpdateJobRequest {
  client_id?: number;
  client_name?: string;
  client_email?: string;
  client_phone_number?: string;
  job_boxes_step?: string;
  job_privacy?: string;
  project_name?: string;
  budget?: number;
  category_id?: number;
  client_address?: string;
  latitude?: number;
  longitude?: number;
  property_type?: string;
  project_start_date?: string;
  project_finish_date?: string;
  preferred_contractor?: string;
  notification_style?: string;
  approx_sq_ft?: number;
  age_of_property?: string;
  daily_work_start_time?: string;
  daily_work_end_time?: string;
  owner_present_need?: boolean;
  weekend_work?: boolean;
  has_animals?: boolean;
  pet_type?: string;
}

export interface CreateJobFormData {
  client_id?: string;
  client_name: string;
  client_email: string;
  client_phone_number: string;
  job_boxes_step: string[];
  job_privacy: string;
  project_name?: string;
  budget?: number;
  category_id?: number;
  client_address?: string;
  latitude?: number;
  longitude?: number;
  property_type?: string;
  project_start_date?: string;
  project_finish_date?: string;
  preferred_contractor?: string;
  notification_style?: string;
  approx_sq_ft?: number;
  age_of_property?: string;
  daily_work_start_time?: string;
  daily_work_end_time?: string;
  owner_present_need?: boolean;
  weekend_work?: boolean;
  has_animals?: boolean;
  pet_type?: string;
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  message?: string;
  data?: T;
  success?: boolean;
}

export interface ApiError {
  response?: {
    data: {
      status: number;
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  message?: string;
  status?: number;
}

export interface FetchJobsParams {
  page: number;
  limit: number;
  status?: string;
  type?: string;
  search?: string;
  client_name?: string;
  job_status?: string;
  job_privacy?: string;
}

export interface JobFilterCounts {
  all: number;
  need_attention: number;
  new_leads: number;
  ongoing_jobs: number;
  waiting_on_client: number;
  archived: number;
}

export interface JobCardProps {
  job: {
    id: string;
    title: string;
    jobId: string;
    progress: number;
    image: string;
    email: string;
    address: string;
    startDate: string;
    daysLeft: number;
  };
}

export interface MenuOption {
  label: string;
  action: string;
  icon: React.ComponentType<{
    size?: string | number;
    color?: string;
    variant?: 'Outline' | 'Linear' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
  }>;
}
