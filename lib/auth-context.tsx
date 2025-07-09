'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService, type ApiError, type LoginResponse } from './api';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_image: string;
  status: string;
  role_id: number;
  device_token: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Helper function to set cookie
  const setCookie = (name: string, value: string, days = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  };

  // Helper function to get cookie
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  };

  // Helper function to delete cookie
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  };

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuthStatus = () => {
      // Check both localStorage and cookies for backward compatibility
      const savedAuth =
        localStorage.getItem('isAuthenticated') ||
        getCookie('is_authenticated');
      const savedUser = localStorage.getItem('user') || getCookie('user_data');
      const token =
        localStorage.getItem('auth_token') || getCookie('auth_token');

      if (savedAuth === 'true' && savedUser && token) {
        setIsAuthenticated(true);
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // If parsing fails, clear everything
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response: LoginResponse = await apiService.login(email, password);

      // Check for successful response using statusCode
      if (response.statusCode === 200 && response.data) {
        const { user: userData, access_token } = response.data;

        // Store authentication data in both localStorage and cookies
        setIsAuthenticated(true);
        setUser(userData);

        // Store in localStorage (for backward compatibility)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('auth_token', access_token);

        // Store in cookies (for API access)
        setCookie('is_authenticated', 'true');
        setCookie('user_data', JSON.stringify(userData));
        setCookie('auth_token', access_token);

        console.log(
          '✅ Authentication data stored in both localStorage and cookies'
        );

        return { success: true };
      } else {
        return {
          success: false,
          error: response.message || 'Login failed',
        };
      }
    } catch (error) {
      const apiError = error as ApiError;

      // Handle specific error cases
      if (apiError.status === 401) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      } else if (apiError.status === 422) {
        // Validation errors
        if (apiError.errors) {
          const errorMessages = Object.values(apiError.errors).flat();
          return {
            success: false,
            error: errorMessages.join(', '),
          };
        }
        return {
          success: false,
          error: apiError.message || 'Please check your input',
        };
      } else if (apiError.status === 0) {
        return {
          success: false,
          error: 'Network error. Please check your connection.',
        };
      } else {
        return {
          success: false,
          error: apiError.message || 'An unexpected error occurred',
        };
      }
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (e) {
      // Ignore API errors, always clear local state
    }
    setIsAuthenticated(false);
    setUser(null);
    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('device_id');
    // Clear cookies
    deleteCookie('is_authenticated');
    deleteCookie('user_data');
    deleteCookie('auth_token');
    // Redirect to login
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
