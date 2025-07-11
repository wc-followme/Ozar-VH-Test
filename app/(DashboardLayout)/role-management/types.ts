// Role management type definitions

export interface Role {
  id: number;
  uuid: string;
  name: string;
  description: string;
  icon: string;
  status: 'ACTIVE' | 'INACTIVE';
  total_permissions?: number;
  created_at: string;
  updated_at: string;
}

export interface RoleApiResponse {
  statusCode: number;
  message: string;
  data: {
    data: Role[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  icon: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateRoleRequest extends CreateRoleRequest {}

export interface ApiResponse<T = any> {
  statusCode: number;
  message?: string;
  data?: T;
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

export interface MenuOption {
  label: string;
  action: string;
  icon: React.ComponentType<any>;
}

export interface FetchRolesParams {
  page: number;
  limit: number;
  search?: string;
  name?: string;
} 