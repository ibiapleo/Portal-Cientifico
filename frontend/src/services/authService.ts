import api from './api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth';
import { getToken, setToken, removeToken } from '../utils/storage';

const authService = {

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      if (response.data.accessToken) {
        setToken(response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      return response.data;
    } catch (err) {
      console.error("Erro no login do authService:", err);
      throw err;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.accessToken) {
      setToken(response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
  },

  logout(): void {
    removeToken();
    localStorage.removeItem('refreshToken');
  },

  async getCurrentUser(): Promise<User | null> {
    const token = getToken();
    if (!token) return null;

    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      this.logout();  // Se houver erro ao recuperar o usuário, fazemos logout
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!getToken();  // Verifica se há token armazenado
  }
};

export default authService;
