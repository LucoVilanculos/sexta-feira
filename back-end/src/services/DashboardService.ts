import { AppError } from "@/utils/AppError"
import { UpdateWidgetInput } from "@/schemas/dashboard.schema"
import { DashboardModel } from "@/models/DashboardModel"
import { CalendarService } from "./CalendarService"
import { UserService } from "./UserService"

export class DashboardService {
  private calendarService: CalendarService
  private userService: UserService

  constructor() {
    this.calendarService = new CalendarService()
    this.userService = new UserService()
  }

  async getOverview(userId: string) {
    const [
      upcomingEvents,
      tasksSummary,
      userPreferences
    ] = await Promise.all([
      this.calendarService.listEvents(userId),
      this.getTasksAnalytics(userId),
      this.userService.getPreferences(userId)
    ])

    return {
      upcomingEvents: upcomingEvents.slice(0, 5),
      tasksSummary,
      preferences: userPreferences
    }
  }

  async getTasksAnalytics(userId: string) {
    return DashboardModel.getTasksAnalytics(userId)
  }

  async getCalendarAnalytics(userId: string) {
    return DashboardModel.getCalendarAnalytics(userId)
  }

  async getActivityAnalytics(userId: string) {
    return DashboardModel.getActivityAnalytics(userId)
  }

  async listWidgets(userId: string) {
    return DashboardModel.findWidgetsByUserId(userId)
  }

  async getWidget(id: string, userId: string) {
    const widget = await DashboardModel.findWidgetById(id)
    
    if (!widget) {
      throw new AppError("Widget not found", 404)
    }

    if (widget.userId !== userId) {
      throw new AppError("You don't have permission to access this widget", 403)
    }

    return widget
  }

  async updateWidget(id: string, userId: string, data: UpdateWidgetInput) {
    const widget = await this.getWidget(id, userId)
    return DashboardModel.updateWidget(id, data)
  }

  async updateWidgetPosition(id: string, userId: string, position: { x: number; y: number }) {
    const widget = await this.getWidget(id, userId)
    return DashboardModel.updateWidget(id, { position })
  }

  async getLayout(userId: string) {
    return DashboardModel.getLayout(userId)
  }

  async updateLayout(userId: string, layout: any) {
    return DashboardModel.updateLayout(userId, layout)
  }

  async getQuickActions(userId: string) {
    return DashboardModel.getQuickActions(userId)
  }

  async executeQuickAction(userId: string, actionId: string, params: any) {
    const action = await DashboardModel.findQuickActionById(actionId)
    
    if (!action) {
      throw new AppError("Quick action not found", 404)
    }

    if (action.userId !== userId) {
      throw new AppError("You don't have permission to execute this action", 403)
    }

    // Execute the action based on its type
    switch (action.type) {
      case "calendar":
        return this.executeCalendarAction(action, params)
      case "task":
        return this.executeTaskAction(action, params)
      default:
        throw new AppError("Invalid action type", 400)
    }
  }

  private async executeCalendarAction(action: any, params: any) {
    // Implement calendar-specific quick actions
    return null
  }

  private async executeTaskAction(action: any, params: any) {
    // Implement task-specific quick actions
    return null
  }
} 