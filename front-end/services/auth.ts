import { api } from "@/lib/api";
import { LoginData, RegisterData, User } from "@/types/auth";

export const authApi = {
  async login(data: LoginData): Promise<{ user: User; token: string }> {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/api/auth/logout");
  },

  async getUser(): Promise<User> {
    const response = await api.get("/api/auth/me");
    return response.data;
  }
}; 