export interface UserSettings {
  id: string
  userId: string
  dashboard: DashboardSettings
  calendar: CalendarSettings
  notifications: NotificationSettings
  theme: ThemeSettings
  createdAt: Date
  updatedAt: Date
}

export interface DashboardSettings {
  layout: "grid" | "list"
  widgets: DashboardWidget[]
  defaultView: "day" | "week" | "month"
}

export interface DashboardWidget {
  id: string
  type: "calendar" | "tasks" | "projects" | "weather" | "notes" | "clock"
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  settings: {
    title?: string
    refreshInterval?: number
    collapsed?: boolean
    [key: string]: any
  }
}

export interface CalendarSettings {
  defaultView: "day" | "week" | "month"
  weekStartsOn: 0 | 1 | 6 // 0 = domingo, 1 = segunda, 6 = sábado
  showWeekends: boolean
  workingHours: {
    start: string // formato "HH:mm"
    end: string // formato "HH:mm"
  }
  defaultEventDuration: number // minutos
  defaultReminders: number[] // minutos antes do evento
}

export interface NotificationSettings {
  email: {
    enabled: boolean
    frequency: "instant" | "daily" | "weekly"
    types: ("calendar" | "tasks" | "projects" | "system")[]
  }
  push: {
    enabled: boolean
    types: ("calendar" | "tasks" | "projects" | "system")[]
  }
  desktop: {
    enabled: boolean
    sound: boolean
    types: ("calendar" | "tasks" | "projects" | "system")[]
  }
}

export interface ThemeSettings {
  mode: "light" | "dark" | "system"
  primaryColor: string
  accentColor: string
  fontSize: "small" | "medium" | "large"
  fontFamily: string
  customCss?: string
}

// Simulação de banco de dados
export const userSettings: UserSettings[] = []

export class UserSettingsModel {
  static async findByUserId(userId: string): Promise<UserSettings | null> {
    return userSettings.find(settings => settings.userId === userId) || null
  }

  static async create(userId: string): Promise<UserSettings> {
    const defaultSettings: UserSettings = {
      id: Date.now().toString(),
      userId,
      dashboard: {
        layout: "grid",
        widgets: [
          {
            id: "calendar-widget",
            type: "calendar",
            position: { x: 0, y: 0, width: 6, height: 4 },
            settings: { title: "Calendário", refreshInterval: 300 }
          },
          {
            id: "tasks-widget",
            type: "tasks",
            position: { x: 6, y: 0, width: 6, height: 4 },
            settings: { title: "Tarefas", refreshInterval: 300 }
          }
        ],
        defaultView: "week"
      },
      calendar: {
        defaultView: "week",
        weekStartsOn: 1,
        showWeekends: true,
        workingHours: {
          start: "09:00",
          end: "18:00"
        },
        defaultEventDuration: 60,
        defaultReminders: [15, 60, 1440] // 15min, 1h, 24h
      },
      notifications: {
        email: {
          enabled: true,
          frequency: "instant",
          types: ["calendar", "tasks", "projects", "system"]
        },
        push: {
          enabled: true,
          types: ["calendar", "tasks", "projects", "system"]
        },
        desktop: {
          enabled: true,
          sound: true,
          types: ["calendar", "tasks", "projects", "system"]
        }
      },
      theme: {
        mode: "system",
        primaryColor: "#6366f1",
        accentColor: "#4f46e5",
        fontSize: "medium",
        fontFamily: "Inter"
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    userSettings.push(defaultSettings)
    return defaultSettings
  }

  static async update(userId: string, updateData: Partial<UserSettings>): Promise<UserSettings | null> {
    const settingsIndex = userSettings.findIndex(settings => settings.userId === userId)
    if (settingsIndex === -1) return null

    userSettings[settingsIndex] = {
      ...userSettings[settingsIndex],
      ...updateData,
      updatedAt: new Date()
    }

    return userSettings[settingsIndex]
  }

  static async updateDashboardWidget(
    userId: string,
    widgetId: string,
    updateData: Partial<DashboardWidget>
  ): Promise<UserSettings | null> {
    const settings = await this.findByUserId(userId)
    if (!settings) return null

    const widgetIndex = settings.dashboard.widgets.findIndex(w => w.id === widgetId)
    if (widgetIndex === -1) return null

    settings.dashboard.widgets[widgetIndex] = {
      ...settings.dashboard.widgets[widgetIndex],
      ...updateData
    }

    return this.update(userId, settings)
  }
} 