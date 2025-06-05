import { Response } from "express"
import { UserSettingsModel } from "../models/UserSettings"
import { AuthenticatedRequest } from "../types"

export class UserSettingsController {
  static async getSettings(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            message: "Usuário não autenticado",
            code: "UNAUTHORIZED"
          }
        })
      }

      let settings = await UserSettingsModel.findByUserId(userId)

      // Se não existir configurações, cria com valores padrão
      if (!settings) {
        settings = await UserSettingsModel.create(userId)
      }

      res.json({
        success: true,
        data: settings
      })
    } catch (error) {
      console.error("[UserSettingsController] Erro ao buscar configurações:", error)
      res.status(500).json({
        success: false,
        error: {
          message: "Erro ao buscar configurações",
          code: "INTERNAL_SERVER_ERROR"
        }
      })
    }
  }

  static async updateSettings(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            message: "Usuário não autenticado",
            code: "UNAUTHORIZED"
          }
        })
      }

      const updateData = req.body
      const settings = await UserSettingsModel.update(userId, updateData)

      if (!settings) {
        return res.status(404).json({
          success: false,
          error: {
            message: "Configurações não encontradas",
            code: "NOT_FOUND"
          }
        })
      }

      res.json({
        success: true,
        data: settings
      })
    } catch (error) {
      console.error("[UserSettingsController] Erro ao atualizar configurações:", error)
      res.status(500).json({
        success: false,
        error: {
          message: "Erro ao atualizar configurações",
          code: "INTERNAL_SERVER_ERROR"
        }
      })
    }
  }

  static async updateDashboardWidget(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            message: "Usuário não autenticado",
            code: "UNAUTHORIZED"
          }
        })
      }

      const { widgetId } = req.params
      const updateData = req.body

      const settings = await UserSettingsModel.updateDashboardWidget(userId, widgetId, updateData)

      if (!settings) {
        return res.status(404).json({
          success: false,
          error: {
            message: "Widget não encontrado",
            code: "NOT_FOUND"
          }
        })
      }

      res.json({
        success: true,
        data: settings
      })
    } catch (error) {
      console.error("[UserSettingsController] Erro ao atualizar widget:", error)
      res.status(500).json({
        success: false,
        error: {
          message: "Erro ao atualizar widget",
          code: "INTERNAL_SERVER_ERROR"
        }
      })
    }
  }
} 