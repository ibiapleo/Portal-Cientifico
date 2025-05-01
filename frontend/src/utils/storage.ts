export const getToken = (): string | null => {
    return localStorage.getItem('token');
  };
  
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const setRefreshToken = (refreshToken: string): void => {
  localStorage.setItem('refreshToken', refreshToken);
};
  
export const removeToken = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};
