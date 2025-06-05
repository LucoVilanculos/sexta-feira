import { AppError } from "@/utils/AppError"
import { UpdateProfileInput, UpdateSettingsInput } from "@/schemas/user.schema"
import { UserModel } from "@/models/UserModel"
import bcrypt from "bcryptjs"

export class UserService {
  async getProfile(userId: string) {
    const user = await UserModel.findById(userId)
    if (!user) {
      throw new AppError("User not found", 404)
    }
    return user
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await this.getProfile(userId)
    return UserModel.update(userId, data)
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
    const user = await this.getProfile(userId)
    return UserModel.update(userId, { settings: data })
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
} 