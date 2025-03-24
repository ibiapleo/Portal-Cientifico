export const getToken = (): string | null => {
    return localStorage.getItem('token');
  };
  
  export const setToken = (token: string): void => {
    localStorage.setItem('token', token);
  };
  
  export const removeToken = (): void => {
    localStorage.removeItem('token');
  };
  
  export const getUser = (): any | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Erro ao parsear usuário do localStorage:', error);
      return null;
    }
  };
  
  export const setUser = (user: any): void => {
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  export const removeUser = (): void => {
    localStorage.removeItem('user');
  };