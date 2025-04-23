import {User} from "@/types/auth";

export const setToken = (token: string) => localStorage.setItem("token", token);
export const getToken = (): string | null => localStorage.getItem("token");
export const clearToken = () => localStorage.removeItem("token");

export const setUser = (user: User) => localStorage.setItem("user", JSON.stringify(user));
export const getUser = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
export const removeUser = () => localStorage.removeItem("user");
