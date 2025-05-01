import api from './api';
import {AuthResponse, LoginCredentials, RegisterData, User} from '../types/auth';
import {getRefreshToken, getToken, removeToken, setRefreshToken, setToken} from '../utils/storage';

const authService = {

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      if (response.data.accessToken) {
        setToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
      }
      return response.data;
    } catch (err) {
      console.error("Erro no login do authService:", err);
      throw err;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    } finally {
      removeToken();
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const token = getToken();
    if (!token) return null;

    try {
      const response = await api.get<User>('/users/me');
      return response.data;
    } catch (error) {
      this.logout();
      return null;
    }
  },

  async toggleFollowAuthor(authorId: string): Promise<boolean> {
    const response = await api.post(`/users/${authorId}/follow`);
    return response.data;
  },

  async checkFollowStatus(targetUserId: string): Promise<boolean> {
    const response = await api.get<boolean>(`/users/${targetUserId}/follow/status`);
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!getToken();
  }
};

export default authService;
