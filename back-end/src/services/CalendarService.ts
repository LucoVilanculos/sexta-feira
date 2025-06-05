import { AppError } from "@/utils/AppError"
import { CreateEventInput, UpdateEventInput } from "@/schemas/calendar.schema"
import { CalendarModel, Event } from "@/models/CalendarModel"

export class CalendarService {
  async listEvents(userId: string, startDate?: string, endDate?: string): Promise<Event[]> {
    return CalendarModel.findEventsByDateRange(userId, startDate, endDate)
  }

  async getEvent(id: string, userId: string): Promise<Event> {
    const event = await CalendarModel.findEventById(id)
    
    if (!event) {
      throw new AppError("Event not found", 404)
    }

    if (event.userId !== userId) {
      throw new AppError("You don't have permission to access this event", 403)
    }

    return event
  }

  async createEvent(userId: string, data: CreateEventInput): Promise<Event> {
    return CalendarModel.createEvent({
      ...data,
      userId
    })
  }

  async updateEvent(id: string, userId: string, data: UpdateEventInput): Promise<Event> {
    const event = await this.getEvent(id, userId)
    return CalendarModel.updateEvent(id, data)
  }

  async deleteEvent(id: string, userId: string): Promise<void> {
    await this.getEvent(id, userId)
    await CalendarModel.deleteEvent(id)
  }

  async getMonthView(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    
    const events = await this.listEvents(
      userId,
      startDate.toISOString(),
      endDate.toISOString()
    )

    return {
      year,
      month,
      events,
      startDate,
      endDate,
      totalDays: endDate.getDate()
    }
  }

  async getWeekView(userId: string, year: number, week: number) {
    const startDate = this.getDateOfWeek(year, week)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)

    const events = await this.listEvents(
      userId,
      startDate.toISOString(),
      endDate.toISOString()
    )

    return {
      year,
      week,
      events,
      startDate,
      endDate
    }
  }

  async getDayView(userId: string, year: number, month: number, day: number) {
    const date = new Date(year, month - 1, day)
    const nextDay = new Date(date)
    nextDay.setDate(date.getDate() + 1)

    const events = await this.listEvents(
      userId,
      date.toISOString(),
      nextDay.toISOString()
    )

    return {
      year,
      month,
      day,
      events,
      date
    }
  }

  private getDateOfWeek(year: number, week: number): Date {
    const date = new Date(year, 0, 1)
    date.setDate(date.getDate() + (week - 1) * 7)
    return date
  }
} 