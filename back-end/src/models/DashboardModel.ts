import { Schema, model, Document } from "mongoose"

export interface Widget extends Document {
  userId: string
  title: string
  type: "calendar" | "tasks" | "weather" | "notes" | "analytics" | "quick_actions"
  settings: Record<string, any>
  refreshInterval?: number
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface Layout extends Document {
  userId: string
  widgets: Array<{
    widgetId: string
    position: {
      x: number
      y: number
      width: number
      height: number
    }
  }>
  createdAt: Date
  updatedAt: Date
}

export interface QuickAction extends Document {
  userId: string
  type: "calendar" | "task"
  title: string
  description?: string
  icon?: string
  params: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const widgetSchema = new Schema<Widget>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["calendar", "tasks", "weather", "notes", "analytics", "quick_actions"]
    },
    settings: { type: Schema.Types.Mixed, default: {} },
    refreshInterval: Number,
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true }
    }
  },
  { timestamps: true }
)

const layoutSchema = new Schema<Layout>(
  {
    userId: { type: String, required: true, unique: true },
    widgets: [{
      widgetId: { type: String, required: true },
      position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true }
      }
    }]
  },
  { timestamps: true }
)

const quickActionSchema = new Schema<QuickAction>(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, required: true, enum: ["calendar", "task"] },
    title: { type: String, required: true },
    description: String,
    icon: String,
    params: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
)

const WidgetModel = model<Widget>("Widget", widgetSchema)
const LayoutModel = model<Layout>("Layout", layoutSchema)
const QuickActionModel = model<QuickAction>("QuickAction", quickActionSchema)

export class DashboardModel {
  static async findWidgetsByUserId(userId: string) {
    return WidgetModel.find({ userId })
  }

  static async findWidgetById(id: string) {
    return WidgetModel.findById(id)
  }

  static async updateWidget(id: string, data: Partial<Widget>) {
    return WidgetModel.findByIdAndUpdate(id, data, { new: true })
  }

  static async getLayout(userId: string) {
    return LayoutModel.findOne({ userId })
  }

  static async updateLayout(userId: string, layout: any) {
    return LayoutModel.findOneAndUpdate(
      { userId },
      { widgets: layout },
      { new: true, upsert: true }
    )
  }

  static async getQuickActions(userId: string) {
    return QuickActionModel.find({ userId })
  }

  static async findQuickActionById(id: string) {
    return QuickActionModel.findById(id)
  }

  static async getTasksAnalytics(userId: string) {
    // Implement task analytics aggregation
    return {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0
    }
  }

  static async getCalendarAnalytics(userId: string) {
    // Implement calendar analytics aggregation
    return {
      upcomingEvents: 0,
      todayEvents: 0,
      weekEvents: 0,
      monthEvents: 0
    }
  }

  static async getActivityAnalytics(userId: string) {
    // Implement activity analytics aggregation
    return {
      lastLogin: new Date(),
      totalLogins: 0,
      activeTime: 0,
      lastActivity: new Date()
    }
  }
} 