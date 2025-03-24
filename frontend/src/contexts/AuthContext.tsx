import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, LoginCredentials, RegisterData } from '../types/auth';
import authService from '../services/authService';
import { setUser, removeUser, getUser } from '../utils/storage';

// Valor padrão do contexto
const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
};

// Criação do contexto
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verifica se o usuário está autenticado ao carregar a aplicação
  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUserState(currentUser);
    } else {
      checkAuth();
    }
  }, []);

  // Função para verificar o usuário no backend
  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUserState(currentUser);
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função de login
  const login = async (credentials: LoginCredentials) => {
    try {
      const data = await authService.login(credentials);
      console.log(data)
      setUserState(data.name);
      setUser(data.name);
      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao fazer login',
      };
    }
  };

  // Função de registro
  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUserState(response.user);
      setUser(response.user);
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao criar conta',
      };
    }
  };

  // Função de logout
  const logout = () => {
    authService.logout();
    setUserState(null);
    removeUser();
  };

  // Valores e funções disponíveis no contexto
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
