export interface DashboardSettings {
  layout: "grid" | "list"
  widgets: DashboardWidget[]
  defaultView: "day" | "week" | "month"
}

export interface DashboardWidget {
  id: string
  type: "calendar" | "tasks" | "projects" | "weather" | "notes" | "clock"
  position: WidgetPosition
  settings: WidgetSettings
}

export interface WidgetPosition {
  x: number
  y: number
  width: number
  height: number
}

export interface WidgetSettings {
  title?: string
  refreshInterval?: number
  collapsed?: boolean
  [key: string]: any
} 