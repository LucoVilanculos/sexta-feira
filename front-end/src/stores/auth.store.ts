import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  register: (data: { email: string; password: string; name: string }) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const api = axios.create({
  baseURL: 'http://localhost:3001'
})

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      register: async (data) => {
        try {
          set({ isLoading: true, error: null })
          const response = await api.post('/auth/register', data)
          set({ 
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false 
          })
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Erro ao registrar',
            isLoading: false 
          })
          throw error
        }
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null })
          const response = await api.post('/auth/login', { email, password })
          set({ 
            user: response,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false 
          })
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Erro ao fazer login',
            isLoading: false 
          })
          throw error
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true })
          await api.post('/auth/logout')
          set({ 
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false 
          })
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Erro ao fazer logout',
            isLoading: false 
          })
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
) 