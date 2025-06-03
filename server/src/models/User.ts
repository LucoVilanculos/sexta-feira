export interface User {
  id: string
  name: string
  email: string
  password: string
  avatar?: string
  preferences?: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  language: "pt" | "en" | "es"
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
  }
  ai: {
    voiceEnabled: boolean
    autoRespond: boolean
    learningMode: boolean
  }
}

export interface CreateUserData {
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: Omit<User, "password">
}

// Simulação de banco de dados
export const users: User[] = []

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    return users.find((user) => user.email === email) || null
  }

  static async findById(id: string): Promise<User | null> {
    return users.find((user) => user.id === id) || null
  }

  static async create(userData: CreateUserData): Promise<User> {
    const user: User = {
      id: Date.now().toString(),
      ...userData,
      preferences: {
        theme: "dark",
        language: "pt",
        notifications: {
          email: true,
          push: true,
          desktop: true,
        },
        ai: {
          voiceEnabled: true,
          autoRespond: false,
          learningMode: true,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    users.push(user)
    return user
  }

  static async update(id: string, updateData: Partial<User>): Promise<User | null> {
    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) return null

    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date(),
    }

    return users[userIndex]
  }

  static async delete(id: string): Promise<boolean> {
    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) return false

    users.splice(userIndex, 1)
    return true
  }
}
