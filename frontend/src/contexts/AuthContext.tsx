"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import authService from "../services/authService";
import { setToken, clearToken, setUser, getUser } from "../utils/storage";
import { AuthResponse, LoginCredentials, RegisterData, User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Verifica se o token existe ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = getUser();
    if (token && storedUser) {
      setUserState(storedUser); // Define o usuário caso o token e os dados existam
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        const userData = await authService.getCurrentUser();
        setUserState(userData); // Atualiza o estado do usuário
        setUser(userData); // Armazena o usuário no localStorage
        return { success: true, data: response };
      } else {
        return { success: false, error: response.error || "Erro ao realizar login." };
      }
    } catch (error) {
      return { success: false, error: "Erro ao realizar login." };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      if (response.success) {
        setUserState(response.user); // Atualiza o estado com o usuário retornado
        setUser(response.user); // Armazena o usuário no localStorage
        setToken(response.token); // Armazena o token no localStorage
        return { success: true, data: response };
      } else {
        return { success: false, error: response.error || "Erro ao criar conta." };
      }
    } catch (error) {
      return { success: false, error: "Erro ao criar conta." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUserState(null);
    localStorage.removeItem("user"); // Limpa o usuário do localStorage
    clearToken(); // Limpa o token do localStorage
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
