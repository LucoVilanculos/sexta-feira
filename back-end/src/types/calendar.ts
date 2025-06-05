export interface CalendarEvent {
  id: string
  userId: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  allDay: boolean
  location?: string
  color?: string
  participants?: string[]
  reminders?: CalendarReminder[]
  recurrence?: CalendarRecurrence
  createdAt: Date
  updatedAt: Date
}

export interface CalendarReminder {
  id: string
  eventId: string
  type: "email" | "notification"
  minutes: number
  sent: boolean
  createdAt: Date
}

export interface CalendarRecurrence {
  frequency: "daily" | "weekly" | "monthly" | "yearly"
  interval: number
  endDate?: Date
  daysOfWeek?: number[]
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