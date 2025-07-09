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

  // Removed testConnection and all debug code
}

export const apiService = new ApiService();
export type { ApiError, CreateRoleRequest, CreateRoleResponse, LoginResponse };
