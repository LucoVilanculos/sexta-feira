import { Request, Response } from "express"
import { DashboardService } from "@/server/DashboardService"
import { UpdateWidgetInput } from "@/schemas/dashboard.schema"
import { AppError } from "@/utils/AppError"

export class DashboardController {
  private dashboardService: DashboardService

  constructor() {
    this.dashboardService = new DashboardService()
  }

  getOverview = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const overview = await this.dashboardService.getOverview(userId)

      res.json({
        status: "success",
        data: { overview }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to get overview", 500)
    }
  }

  getTasksAnalytics = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const analytics = await this.dashboardService.getTasksAnalytics(userId)

      res.json({
        status: "success",
        data: { analytics }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to get tasks analytics", 500)
    }
  }

  getCalendarAnalytics = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const analytics = await this.dashboardService.getCalendarAnalytics(userId)

      res.json({
        status: "success",
        data: { analytics }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to get calendar analytics", 500)
    }
  }

  getActivityAnalytics = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const analytics = await this.dashboardService.getActivityAnalytics(userId)

      res.json({
        status: "success",
        data: { analytics }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to get activity analytics", 500)
    }
  }

  listWidgets = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const widgets = await this.dashboardService.listWidgets(userId)

      res.json({
        status: "success",
        data: { widgets }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to list widgets", 500)
    }
  }

  getWidget = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const userId = (req as any).user.userId
      const widget = await this.dashboardService.getWidget(id, userId)

      res.json({
        status: "success",
        data: { widget }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to get widget", 500)
    }
  }

  updateWidget = async (req: Request<{ id: string }, {}, UpdateWidgetInput>, res: Response) => {
    try {
      const { id } = req.params
      const userId = (req as any).user.userId
      const widget = await this.dashboardService.updateWidget(id, userId, req.body)

      res.json({
        status: "success",
        data: { widget }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to update widget", 500)
    }
  }

  updateWidgetPosition = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const userId = (req as any).user.userId
      const { position } = req.body
      const widget = await this.dashboardService.updateWidgetPosition(id, userId, position)

      res.json({
        status: "success",
        data: { widget }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to update widget position", 500)
    }
  }

  getLayout = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const layout = await this.dashboardService.getLayout(userId)

      res.json({
        status: "success",
        data: { layout }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to get layout", 500)
    }
  }

  updateLayout = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const { layout } = req.body
      await this.dashboardService.updateLayout(userId, layout)

      res.json({
        status: "success",
        message: "Layout updated successfully"
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to update layout", 500)
    }
  }

  getQuickActions = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const actions = await this.dashboardService.getQuickActions(userId)

      res.json({
        status: "success",
        data: { actions }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to get quick actions", 500)
    }
  }

  executeQuickAction = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const { actionId, params } = req.body
      const result = await this.dashboardService.executeQuickAction(userId, actionId, params)

      res.json({
        status: "success",
        data: { result }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to execute quick action", 500)
    }
  }
} 