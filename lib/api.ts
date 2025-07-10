interface DeviceInfo {
  fcm_token?: string;
  device_id: string;
  device_name: string;
  platform_type: 'Web' | 'Android' | 'iOS';
  api_version: string;
  os_version: string;
  latitude?: number;
  longitude?: number;
  app_version: string;
}

interface LoginRequest {
  email: string;
  password: string;
  device_info: DeviceInfo;
}

interface LoginResponse {
  statusCode: number;
  message: string;
  data?: {
    access_token: string;
    refresh_token: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      profile_image: string;
      status: string;
      created_at: string;
      updated_at: string;
      created_by: number | null;
      updated_by: number | null;
      role_id: number;
      device_token: string;
    };
  };
}

// Refresh token interfaces
interface RefreshTokenRequest {
  refresh_token: string;
}

interface RefreshTokenResponse {
  statusCode: number;
  message: string;
  data?: {
    access_token: string;
    refresh_token: string;
  };
}

interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Role management interfaces
interface CreateRoleRequest {
  name: string;
  description: string;
  icon: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface CreateRoleResponse {
  statusCode: number;
  message: string;
  data?: {
    id: number;
    name: string;
    description: string;
    icon: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

// User management interfaces
export interface User {
  id: number;
  uuid: string;
  role_id: number;
  company_id: string;
  name: string;
  email: string;
  phone_number: string;
  profile_picture_url: string;
  status: string;
  created_at: string;
  updated_at: string;
  role: {
    id: number;
    name: string;
  };
  company: {
    id: string;
    name: string;
  };
}

export interface FetchUsersResponse {
  statusCode: number;
  message: string;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User status update response
export interface UpdateUserStatusResponse {
  statusCode: number;
  message: string;
  data?: User;
}

// User delete response
export interface DeleteUserResponse {
  statusCode: number;
  message: string;
}

// User creation types
export interface CreateUserRequest {
  role_id: number;
  name: string;
  email: string;
  password: string;
  phone_number: string;
  profile_picture_url?: string;
  date_of_joining: string;
  designation: string;
  preferred_communication_method: string;
  address: string;
  city: string;
  pincode: string;
}

export interface CreateUserResponse {
  statusCode: number;
  message: string;
  data: any;
}

// User update types
export interface UpdateUserRequest {
  role_id?: number;
  name?: string;
  email?: string;
  password?: string;
  phone_number?: string;
  profile_picture_url?: string;
  date_of_joining?: string;
  designation?: string;
  preferred_communication_method?: string;
  address?: string;
  city?: string;
  pincode?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  is_profile_completed?: boolean;
}

export interface UpdateUserResponse {
  statusCode: number;
  message: string;
  data: any;
}

// User details response
export interface GetUserResponse {
  statusCode: number;
  message: string;
  data: User;
}

// Get device information for login
const getDeviceInfo = (): DeviceInfo => {
  const navigator = typeof window !== 'undefined' ? window.navigator : null;

  return {
    device_id:
      typeof window !== 'undefined'
        ? localStorage.getItem('device_id') || generateDeviceId()
        : 'web-device',
    device_name: navigator?.userAgent || 'Unknown Device',
    platform_type: 'Web',
    api_version: '1.0',
    os_version: navigator?.platform || 'Unknown',
    app_version: process.env['NEXT_PUBLIC_APP_VERSION'] || '1.0.0',
  };
};

// Generate a unique device ID
const generateDeviceId = (): string => {
  const deviceId = 'web-' + Math.random().toString(36).substring(2, 15);
  if (typeof window !== 'undefined') {
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

// API service class
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:5000';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'app-type': 'mobile', // Changed from 'web' to 'mobile' to match your curl command
        'Accept-Language': 'en',
        ...options.headers, // This will include Authorization when passed from getRoleHeaders()
      },
      ...options,
    };

    const makeApiCall = async (): Promise<T> => {
      try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
          throw {
            message: data.message || 'An error occurred',
            status: response.status,
            errors: data.errors,
          } as ApiError;
        }

        return data;
      } catch (error) {
        if (error instanceof TypeError) {
          // Network error
          throw {
            message: 'Network error. Please check your connection.',
            status: 0,
          } as ApiError;
        }
        throw error;
      }
    };

    try {
      return await makeApiCall();
    } catch (error: any) {
      // If 401 error and not a refresh endpoint, try to refresh token and retry
      if (
        error.status === 401 &&
        !endpoint.includes('/auth/refresh') &&
        !endpoint.includes('/auth/login')
      ) {
        try {
          const refreshToken =
            typeof window !== 'undefined'
              ? localStorage.getItem('refresh_token')
              : null;

          if (refreshToken) {
            const refreshResponse = await this.refreshToken(refreshToken);
            if (refreshResponse.statusCode === 200 && refreshResponse.data) {
              const { access_token, refresh_token: newRefreshToken } =
                refreshResponse.data;

              // Update stored tokens
              if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', access_token);
                localStorage.setItem('refresh_token', newRefreshToken);
              }

              // Update config with new token and retry
              config.headers = {
                ...config.headers,
                Authorization: `Bearer ${access_token}`,
              };

              return await makeApiCall();
            }
          }
        } catch (refreshError) {
          // If refresh fails, redirect to login
          if (typeof window !== 'undefined') {
            localStorage.clear();
            window.location.href = '/auth/login';
          }
        }
      }
      throw error;
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const loginData: LoginRequest = {
      email,
      password,
      device_info: getDeviceInfo(),
    };

    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  // Add authorization header for authenticated requests
  private getAuthHeaders(): Record<string, string> {
    if (typeof window === 'undefined') {
      return {};
    }
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // Get complete headers for role operations
  private getRoleHeaders(): Record<string, string> {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'app-type': 'mobile',
      'Accept-Language': 'en',
    };
    if (token) {
      baseHeaders['Authorization'] = `Bearer ${token}`;
    }
    return baseHeaders;
  }

  // Example of authenticated request
  async getProfile(): Promise<any> {
    return this.makeRequest('/auth/profile', {
      headers: this.getAuthHeaders(),
    });
  }

  // Role management APIs
  async createRole(roleData: CreateRoleRequest): Promise<CreateRoleResponse> {
    return this.makeRequest<CreateRoleResponse>('/roles', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(roleData),
    });
  }

  async getRoles(): Promise<any> {
    return this.makeRequest('/roles', {
      headers: this.getRoleHeaders(),
    });
  }

  // Fetch roles with pagination, search, and name filter
  async fetchRoles({
    page = 1,
    limit = 10,
    search = '',
    name = '',
  }: {
    page?: number;
    limit?: number;
    search?: string;
    name?: string;
  }) {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (search) params.append('search', search);
    if (name) params.append('name', name);
    return this.makeRequest(`/roles?${params.toString()}`, {
      headers: this.getRoleHeaders(),
    });
  }

  // Get role details by UUID
  async getRoleDetails(uuid: string) {
    return this.makeRequest(`/roles/${uuid}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Update role details by UUID
  async updateRoleDetails(uuid: string, data: Partial<CreateRoleRequest>) {
    return this.makeRequest(`/roles/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(data),
    });
  }

  // Delete role by UUID
  async deleteRole(uuid: string) {
    return this.makeRequest(`/roles/${uuid}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }

  // Logout API
  async logout() {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const refreshData: RefreshTokenRequest = {
      refresh_token: refreshToken,
    };

    return this.makeRequest<RefreshTokenResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(refreshData),
    });
  }

  // User management API
  async fetchUsers({
    page = 1,
    limit = 10,
    role_id = '',
    company_id = '',
  }: {
    page?: number;
    limit?: number;
    role_id?: string | number;
    company_id?: string | number;
  }): Promise<FetchUsersResponse> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (role_id) params.append('role_id', String(role_id));
    if (company_id) params.append('company_id', String(company_id));
    return this.makeRequest(`/users?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Create user
  async createUser(payload: CreateUserRequest): Promise<CreateUserResponse> {
    return this.makeRequest('/users', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Get user details
  async getUserDetails(uuid: string): Promise<GetUserResponse> {
    return this.makeRequest(`/users/${uuid}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Update user
  async updateUser(
    uuid: string,
    payload: UpdateUserRequest
  ): Promise<UpdateUserResponse> {
    return this.makeRequest(`/users/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Update user status
  async updateUserStatus(
    uuid: string,
    status: 'ACTIVE' | 'INACTIVE'
  ): Promise<UpdateUserStatusResponse> {
    return this.makeRequest(`/users/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify({ status }),
    });
  }

  // Delete user
  async deleteUser(id: number): Promise<DeleteUserResponse> {
    return this.makeRequest(`/users/${id}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }

  // Removed testConnection and all debug code
}

export const apiService = new ApiService();
export type { ApiError, CreateRoleRequest, CreateRoleResponse, LoginResponse };
