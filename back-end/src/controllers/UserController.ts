import { Request, Response } from "express"
import { UserService } from "@/server/UserService"
import { UpdateProfileInput, UpdateSettingsInput } from "@/schemas/user.schema"
import { AppError } from "@/utils/AppError"

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  getProfile = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const profile = await this.userService.getProfile(userId)

      res.json({
        status: "success",
        data: { profile }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to get profile", 500)
    }
  }

  updateProfile = async (req: Request<{}, {}, UpdateProfileInput>, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const profile = await this.userService.updateProfile(userId, req.body)

      res.json({
        status: "success",
        data: { profile }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to update profile", 500)
    }
  }

  deleteProfile = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      await this.userService.deleteProfile(userId)

      res.json({
        status: "success",
        message: "Profile deleted successfully"
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to delete profile", 500)
    }
  }

  getSettings = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const settings = await this.userService.getSettings(userId)

      res.json({
        status: "success",
        data: { settings }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to get settings", 500)
    }
  }

  updateSettings = async (req: Request<{}, {}, UpdateSettingsInput>, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const settings = await this.userService.updateSettings(userId, req.body)

      res.json({
        status: "success",
        data: { settings }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to update settings", 500)
    }
  }

  getPreferences = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const preferences = await this.userService.getPreferences(userId)

      res.json({
        status: "success",
        data: { preferences }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to get preferences", 500)
    }
  }

  updateTheme = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const { theme } = req.body
      const preferences = await this.userService.updateTheme(userId, theme)

      res.json({
        status: "success",
        data: { preferences }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to update theme", 500)
    }
  }

  updateNotifications = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const { notifications } = req.body
      const preferences = await this.userService.updateNotifications(userId, notifications)

      res.json({
        status: "success",
        data: { preferences }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to update notifications", 500)
    }
  }

  updateLanguage = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const { language } = req.body
      const preferences = await this.userService.updateLanguage(userId, language)

      res.json({
        status: "success",
        data: { preferences }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to update language", 500)
    }
  }

  changePassword = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const { currentPassword, newPassword } = req.body
      await this.userService.changePassword(userId, currentPassword, newPassword)

      res.json({
        status: "success",
        message: "Password changed successfully"
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to change password", 500)
    }
  }

  listSessions = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const sessions = await this.userService.listSessions(userId)

      res.json({
        status: "success",
        data: { sessions }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to list sessions", 500)
    }
  }

  revokeSession = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const { id } = req.params
      await this.userService.revokeSession(userId, id)

      res.json({
        status: "success",
        message: "Session revoked successfully"
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to revoke session", 500)
    }
  }

  getActivityLog = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const activities = await this.userService.getActivityLog(userId)

      res.json({
        status: "success",
        data: { activities }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to get activity log", 500)
    }
  }
} 