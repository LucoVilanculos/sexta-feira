import { Request, Response } from "express"
import { UserSettingsModel } from "../models/UserSettings"

export class UserSettingsController {
  static async getSettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const settings = await UserSettingsModel.findByUserId(userId)
      res.json(settings)
    } catch (error) {
      console.error("Erro ao buscar configurações:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async getSetting(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      const { key } = req.params

      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const setting = await UserSettingsModel.findByKey(key, userId)
      if (!setting) {
        res.status(404).json({ message: "Configuração não encontrada" })
        return
      }

      res.json(setting)
    } catch (error) {
      console.error("Erro ao buscar configuração:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async createSetting(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const settingData = req.body
      const setting = await UserSettingsModel.create(userId, settingData)

      res.status(201).json({
        message: "Configuração criada com sucesso",
        setting,
      })
    } catch (error) {
      console.error("Erro ao criar configuração:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async updateSetting(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      const { key } = req.params

      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const updateData = req.body
      const setting = await UserSettingsModel.update(key, userId, updateData)

      if (!setting) {
        res.status(404).json({ message: "Configuração não encontrada" })
        return
      }

      res.json({
        message: "Configuração atualizada com sucesso",
        setting,
      })
    } catch (error) {
      console.error("Erro ao atualizar configuração:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async deleteSetting(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      const { key } = req.params

      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const deleted = await UserSettingsModel.delete(key, userId)
      if (!deleted) {
        res.status(404).json({ message: "Configuração não encontrada" })
        return
      }

      res.json({ message: "Configuração deletada com sucesso" })
    } catch (error) {
      console.error("Erro ao deletar configuração:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }
} 