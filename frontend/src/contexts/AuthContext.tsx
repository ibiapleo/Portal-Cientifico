import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {AuthContextType, LoginCredentials, RegisterData, User} from '../types/auth';
import authService from '../services/authService';
import {getToken} from '@/utils/storage';

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          setUser(response);
          setIsAuthenticated(true);
        } catch (error) {
          logout();
        }
      }
      setIsLoading(false);
    };
  
    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao fazer login',
      };
    }
  };

  const register = async (formData: FormData) => {
    try {
      const response = await authService.register(formData);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, data: response };
    } catch (error: any) {
      console.log(error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao criar conta',
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
