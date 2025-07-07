'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { apiService, type ApiError, type LoginResponse } from './api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
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

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuthStatus = () => {
      const savedAuth = localStorage.getItem('isAuthenticated');
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('auth_token');

      if (savedAuth === 'true' && savedUser && token) {
        setIsAuthenticated(true);
        setUser(JSON.parse(savedUser));
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

      if (response.success && response.data) {
        const { user: userData, token, refresh_token } = response.data;

        // Store authentication data
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refresh_token);

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

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('device_id');
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
