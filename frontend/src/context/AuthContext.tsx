import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as authServiceLogin, register as authServiceRegister } from '@/services/authService';
import type { AuthRequest, AuthResponse } from '@/types/auth';

type Role = 'ADMIN' | 'USER' | string;

interface User {
  email: string;
  role: Role;
}

// Helper function to decode JWT and extract user info
const decodeJwt = (token: string): User | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }
    const payloadBase64 = parts[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    // Check token expiry
    if (decodedPayload.exp && decodedPayload.exp * 1000 < Date.now()) {
      console.warn('Token expired');
      return null;
    }

    // Assuming the payload contains email and role directly
    if (decodedPayload.email && decodedPayload.role) {
      return {
        email: decodedPayload.email,
        role: decodedPayload.role as Role, // Cast to Role type
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const saveAuthData = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const decodedUser = decodeJwt(newToken);
    if (decodedUser) {
      setUser(decodedUser);
      setIsAuthenticated(true);
    } else {
      clearAuthData();
    }
  }, [clearAuthData]);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      saveAuthData(storedToken);
    } else {
      clearAuthData();
    }
    setIsLoading(false);
  }, [saveAuthData, clearAuthData]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const request: AuthRequest = { email, password };
      const response: AuthResponse = await authServiceLogin(request);
      const loginToken = response.token ?? '';
      saveAuthData(loginToken);
      const decodedUser = decodeJwt(loginToken);
      if (decodedUser) {
        navigate(decodedUser.role === 'ADMIN' ? '/admin/dashboard' : '/');
      } else {
        navigate('/login');
      }
    } catch (error) {
      clearAuthData();
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [saveAuthData, clearAuthData, navigate]);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const request: AuthRequest = { email, password };
      const response: AuthResponse = await authServiceRegister(request);
      const registerToken = response.token ?? '';
      saveAuthData(registerToken);
      const decodedUser = decodeJwt(registerToken);
      if (decodedUser) {
        navigate(decodedUser.role === 'ADMIN' ? '/admin/dashboard' : '/');
      } else {
        navigate('/login');
      }
    } catch (error) {
      clearAuthData();
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [saveAuthData, clearAuthData, navigate]);

  const logout = useCallback(() => {
    clearAuthData();
    navigate('/login');
  }, [clearAuthData, navigate]);

  const contextValue = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};