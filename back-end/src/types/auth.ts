import { Request } from "express"

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    email: string
  }
}

export interface UserData {
  id: string
  name: string
  email: string
  password: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
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
  token: string
  user: Omit<UserData, "password">
}

export interface TokenPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
} 