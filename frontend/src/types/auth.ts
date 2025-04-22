// Tipos para autenticação

// Credenciais de login
export interface LoginCredentials {
  email: string
  password: string
}

// Dados para registro
export interface RegisterData {
  name: string
  email: string
  password: string
}

// Resposta de autenticação
export interface AuthResponse {
  success: boolean
  data?: any
  error?: string
}

// Usuário autenticado
export interface User {
  id: string
  name: string
  email: string
  [key: string]: any // Para campos adicionais que possam existir
}

