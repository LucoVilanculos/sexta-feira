import { CreateEventInput, UpdateEventInput } from "@/schemas/calendar.schema"
import { AppError } from "@/utils/AppError"
import prisma from "@/config/database"

export class CalendarService {
  async listEvents(userId: string, startDate?: string, endDate?: string) {
    const where: any = { userId }

    if (startDate || endDate) {
      where.startDate = {}
      if (startDate) where.startDate.gte = new Date(startDate)
      if (endDate) where.startDate.lte = new Date(endDate)
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: 'asc' }
    })

    return events
  }

  async getEvent(id: string, userId: string) {
    const event = await prisma.event.findFirst({
      where: { id, userId }
    })

    if (!event) {
      throw new AppError("Evento não encontrado", 404)
    }

    return event
  }

  async createEvent(userId: string, data: CreateEventInput) {
    const event = await prisma.event.create({
      data: {
        ...data,
        userId
      }
    })

    return event
  }

  async updateEvent(id: string, userId: string, data: UpdateEventInput) {
    const event = await this.getEvent(id, userId)

    const updatedEvent = await prisma.event.update({
      where: { id },
      data
    })

    return updatedEvent
  }

  async deleteEvent(id: string, userId: string) {
    const event = await this.getEvent(id, userId)

    await prisma.event.delete({
      where: { id }
    })
  }

  async getMonthView(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const events = await this.listEvents(
      userId,
      startDate.toISOString(),
      endDate.toISOString()
    )

    return events
  }

  async getWeekView(userId: string, year: number, week: number) {
    const startDate = new Date(year, 0, 1 + (week - 1) * 7)
    const endDate = new Date(year, 0, 7 + (week - 1) * 7)

    const events = await this.listEvents(
      userId,
      startDate.toISOString(),
      endDate.toISOString()
    )

    return events
  }

  async getDayView(userId: string, year: number, month: number, day: number) {
    const date = new Date(year, month - 1, day)
    const nextDay = new Date(year, month - 1, day + 1)

    const events = await this.listEvents(
      userId,
      date.toISOString(),
      nextDay.toISOString()
    )

    return events
  }
} 