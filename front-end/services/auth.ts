import { apiClient } from "@/lib/api"
import { RegisterData, AuthResponse, User } from "@/types/auth"

export const authApi = {
  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return apiClient.post("/api/auth/login", data)
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return apiClient.post("/api/auth/register", data)
  },

  async getUser(): Promise<{ user: User }> {
    return apiClient.get("/api/auth/me")
  },
}