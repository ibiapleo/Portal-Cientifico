import {LoginCredentials, RegisterData} from "@/types/auth";
import api from "../services/api";
import {clearToken, setToken} from "../utils/storage";

const authService = {

  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post("/v1/auth/login", credentials);
      console.log(response.data);

      if (response.data.accessToken) {
        setToken(response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        return { success: true, accessToken: response.data.accessToken, refreshToken: response.data.refreshToken };
      } else {
        return { success: false, error: "Token não recebido do servidor" };
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return { success: false, error: "Erro ao fazer login" };
    }
  },

  async register(data: RegisterData) {
    try {
      const response = await api.post('/v1/auth/register', data);
      const { token, user } = response.data;
      setToken(token);
      return { success: true, user, token };
    } catch (error) {
      console.error("Erro no registro:", error);
      return { success: false, error: "Erro ao criar conta" };
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get("/v1/auth/me");
      return response.data;
    } catch (error) {
      console.error("Erro ao obter usuário:", error);
      throw error;
    }
  },

  logout() {
    clearToken();
  },
}

export default authService;
