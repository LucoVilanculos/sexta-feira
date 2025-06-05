import { CalendarEvent, CalendarReminder, CalendarRecurrence } from "../types/calendar"

// Simulação de banco de dados
export const events: CalendarEvent[] = []
export const reminders: CalendarReminder[] = []

export class CalendarModel {
  static async findEventsByUserId(userId: string): Promise<CalendarEvent[]> {
    return events.filter(event => event.userId === userId)
  }

  static async findEventById(id: string): Promise<CalendarEvent | null> {
    return events.find(event => event.id === id) || null
  }

  static async createEvent(eventData: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">): Promise<CalendarEvent> {
    const event: CalendarEvent = {
      id: Date.now().toString(),
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    events.push(event)
    return event
  }

  static async updateEvent(id: string, updateData: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    const eventIndex = events.findIndex(event => event.id === id)
    if (eventIndex === -1) return null

    events[eventIndex] = {
      ...events[eventIndex],
      ...updateData,
      updatedAt: new Date(),
    }

    return events[eventIndex]
  }

  static async deleteEvent(id: string): Promise<boolean> {
    const eventIndex = events.findIndex(event => event.id === id)
    if (eventIndex === -1) return false

    events.splice(eventIndex, 1)
    return true
  }

  static async createReminder(reminderData: Omit<CalendarReminder, "id" | "createdAt">): Promise<CalendarReminder> {
    const reminder: CalendarReminder = {
      id: Date.now().toString(),
      ...reminderData,
      createdAt: new Date(),
    }

    reminders.push(reminder)
    return reminder
  }

  static async findPendingReminders(): Promise<CalendarReminder[]> {
    return reminders.filter(reminder => !reminder.sent)
  }

  static async markReminderAsSent(id: string): Promise<boolean> {
    const reminder = reminders.find(r => r.id === id)
    if (!reminder) return false

    reminder.sent = true
    return true
  }
} 