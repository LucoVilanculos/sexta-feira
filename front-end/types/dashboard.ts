export interface DashboardConfig {
  layout: 'grid' | 'list'
  widgets: WidgetConfig[]
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
  }
}

export interface WidgetConfig {
  id: string
  type: 'calendar' | 'tasks' | 'notes' | 'weather' | 'clock'
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  settings: {
    title: string
    refreshInterval?: number
    expanded?: boolean
    [key: string]: any
  }
}

export interface UpdateDashboardConfig extends Partial<DashboardConfig> {
  userId: string
}

export interface UpdateWidgetConfig extends Partial<WidgetConfig> {
  dashboardId: string
  widgetId: string
} 