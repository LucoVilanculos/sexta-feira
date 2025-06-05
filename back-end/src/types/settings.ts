import { DashboardSettings } from "./dashboard"
import { CalendarSettings } from "./calendar"
import { NotificationSettings } from "./notifications"
import { ThemeSettings } from "./theme"

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

export interface UpdateSettingsData extends Partial<UserSettings> {
  updatedAt?: never // Não permitir atualização manual do updatedAt
} 