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

    // Debug logging for headers (remove in production)
    console.log('🔍 API Request Debug:');
    console.log('URL:', url);
    console.log('Headers:', config.headers);
    console.log('Method:', options.method || 'GET');
    console.log('Body:', options.body);

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      console.log('📥 API Response:', response.status, data);

      if (!response.ok) {
        throw {
          message: data.message || 'An error occurred',
          status: response.status,
          errors: data.errors,
        } as ApiError;
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', error);

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

  // Remove getCookie entirely

  // Add authorization header for authenticated requests
  private getAuthHeaders(): Record<string, string> {
    if (typeof window === 'undefined') {
      console.log('🔑 Auth Debug: Server-side, no token available');
      return {};
    }

    // Get token from localStorage only
    const token = localStorage.getItem('auth_token');

    console.log('🔑 Auth Debug:');
    console.log('Reading from localStorage...');
    console.log('Token exists:', !!token);
    console.log('Token length:', token ? token.length : 0);
    console.log(
      'Token preview:',
      token ? `${token.substring(0, 20)}...` : 'No token'
    );

    if (!token) {
      console.error('❌ No auth token found in localStorage');
      return {};
    }

    const authHeader = `Bearer ${token}`;
    console.log(
      '🔑 Authorization header:',
      authHeader.substring(0, 30) + '...'
    );

    return {
      Authorization: authHeader,
    };
  }

  // Get complete headers for role operations
  private getRoleHeaders(): Record<string, string> {
    // Always get token from localStorage
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
      console.log(
        `🎭 Using token from localStorage:`,
        token.substring(0, 20) + '...'
      );
    } else {
      console.warn('❌ No auth token found in localStorage');
    }
    console.log('🎭 Complete Role Headers:', baseHeaders);
    console.log('🎭 Authorization included:', !!baseHeaders['Authorization']);
    console.log('🎭 Number of headers:', Object.keys(baseHeaders).length);
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
    console.log('🏗️ Creating role with data:', roleData);

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

  async updateRole(
    id: number,
    roleData: Partial<CreateRoleRequest>
  ): Promise<any> {
    return this.makeRequest(`/roles/${id}`, {
      method: 'PUT',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(roleData),
    });
  }

  async deleteRole(id: number): Promise<any> {
    return this.makeRequest(`/roles/${id}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }

  // Debug method to test API connection and headers
  async testConnection(): Promise<any> {
    console.log('🧪 Testing API connection...');

    // First, let's debug the cookie situation
    console.log('🍪 Debug Cookie Situation:');
    console.log(
      'Document.cookie:',
      typeof window !== 'undefined' ? document.cookie : 'Server-side'
    );

    if (typeof window !== 'undefined') {
      const allCookies = document.cookie.split(';').map(c => {
        const [name, value] = c.trim().split('=');
        return {
          name,
          value: value ? value.substring(0, 20) + '...' : 'empty',
        };
      });
      console.log('Parsed cookies:', allCookies);

      const authToken = localStorage.getItem('auth_token');
      console.log(
        'Auth token from localStorage:',
        authToken ? `${authToken.substring(0, 20)}...` : 'null'
      );
    }

    try {
      return this.makeRequest('/roles', {
        headers: this.getRoleHeaders(),
      });
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export type { ApiError, CreateRoleRequest, CreateRoleResponse, LoginResponse };
