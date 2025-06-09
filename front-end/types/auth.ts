export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}