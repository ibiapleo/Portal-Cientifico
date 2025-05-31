export interface User {
    id: string;
    name: string
    email: string;
    avatar?: string;
    institution?: string;
    role: 'user' | 'admin';
    createdAt: string;
  }
  export interface LoginCredentials {
    email: string
    password: string
  }
  
  export interface RegisterData {
    name: string
    email: string
    password: string
  }
  
  export interface AuthResult {
    success: boolean
    error?: string
  }
  
  export interface User {
    id: string
    name: string
    email: string
    createdAt: string
    profilePictureUrl: string
  }
  
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: User | null;
    accessToken: string;
    refreshToken: string;
  }
  
  export interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; data?: any; error?: string }>;
    register: (FormData: FormData) => Promise<{ success: boolean; data?: any; error?: string }>;
    logout: () => void;
  }