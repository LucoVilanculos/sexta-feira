import { AppError } from "@/utils/AppError"
import { UpdateProfileInput, UpdateSettingsInput } from "@/schemas/user.schema"
import { UserModel } from "@/models/UserModel"
import bcrypt from "bcryptjs"
import prisma from "@/config/database"

export class UserService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        timezone: true,
        settings: true,
        preferences: true,
        createdAt: true
      }
    })

    if (!user) {
      throw new AppError("Usuário não encontrado", 404)
    }

    return user
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new AppError("Usuário não encontrado", 404)
    }

    if (data.email && data.email !== user.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email }
      })

      if (emailExists) {
        throw new AppError("Email já está em uso", 400)
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        bio: data.bio,
        timezone: data.timezone
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        timezone: true
      }
    })

    return updatedUser
  }

  async deleteProfile(userId: string) {
    const user = await this.getProfile(userId)
    await UserModel.delete(userId)
  }

  async getSettings(userId: string) {
    const user = await this.getProfile(userId)
    return user.settings || {}
  }

  async updateSettings(userId: string, data: UpdateSettingsInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new AppError("Usuário não encontrado", 404)
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        settings: data.settings,
        preferences: data.preferences
      },
      select: {
        id: true,
        settings: true,
        preferences: true
      }
    })

    return updatedUser
  }

  async getPreferences(userId: string) {
    const user = await this.getProfile(userId)
    return user.preferences || {}
  }

  async updateTheme(userId: string, theme: string) {
    const user = await this.getProfile(userId)
    const preferences = user.preferences || {}
    
    return UserModel.update(userId, {
      preferences: {
        ...preferences,
        theme
      }
    })
  }

  async updateNotifications(userId: string, notifications: any) {
    const user = await this.getProfile(userId)
    const preferences = user.preferences || {}
    
    return UserModel.update(userId, {
      preferences: {
        ...preferences,
        notifications
      }
    })
  }

  async updateLanguage(userId: string, language: string) {
    const user = await this.getProfile(userId)
    const preferences = user.preferences || {}
    
    return UserModel.update(userId, {
      preferences: {
        ...preferences,
        language
      }
    })
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.getProfile(userId)
    
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      throw new AppError("Current password is incorrect", 400)
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await UserModel.update(userId, { password: hashedPassword })
  }

  async listSessions(userId: string) {
    const user = await this.getProfile(userId)
    // Implement session tracking logic here
    return []
  }

  async revokeSession(userId: string, sessionId: string) {
    const user = await this.getProfile(userId)
    // Implement session revocation logic here
  }

  async getActivityLog(userId: string) {
    const user = await this.getProfile(userId)
    // Implement activity logging logic here
    return []
  }

  async deleteAccount(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new AppError("Usuário não encontrado", 404)
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    return { message: "Conta excluída com sucesso" }
  }
} 