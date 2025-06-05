export type NotificationType = "calendar" | "tasks" | "projects" | "system"

export interface NotificationSettings {
  email: EmailNotificationSettings
  push: PushNotificationSettings
  desktop: DesktopNotificationSettings
}

export interface EmailNotificationSettings {
  enabled: boolean
  frequency: "instant" | "daily" | "weekly"
  types: NotificationType[]
}

export interface PushNotificationSettings {
  enabled: boolean
  types: NotificationType[]
}

export interface DesktopNotificationSettings {
  enabled: boolean
  sound: boolean
  types: NotificationType[]
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  data?: any
  createdAt: Date
} 