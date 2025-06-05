import { Request, Response } from "express"
import { CalendarService } from "@/services/CalendarService"
import { CreateEventInput, UpdateEventInput } from "@/schemas/calendar.schema"
import { AppError } from "@/utils/AppError"

export class CalendarController {
  private calendarService: CalendarService

  constructor() {
    this.calendarService = new CalendarService()
  }

  listEvents = async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query
      const userId = (req as any).user.userId

      const events = await this.calendarService.listEvents(
        userId,
        startDate as string,
        endDate as string
      )

      res.json({
        status: "success",
        data: { events }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to list events", 500)
    }
  }

  getEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const userId = (req as any).user.userId

      const event = await this.calendarService.getEvent(id, userId)

      res.json({
        status: "success",
        data: { event }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to get event", 500)
    }
  }

  createEvent = async (req: Request<{}, {}, CreateEventInput>, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const event = await this.calendarService.createEvent(userId, req.body)

      res.status(201).json({
        status: "success",
        data: { event }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to create event", 500)
    }
  }

  updateEvent = async (req: Request<{ id: string }, {}, UpdateEventInput>, res: Response) => {
    try {
      const { id } = req.params
      const userId = (req as any).user.userId
      const event = await this.calendarService.updateEvent(id, userId, req.body)

      res.json({
        status: "success",
        data: { event }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to update event", 500)
    }
  }

  deleteEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const userId = (req as any).user.userId
      await this.calendarService.deleteEvent(id, userId)

      res.json({
        status: "success",
        message: "Event deleted successfully"
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to delete event", 500)
    }
  }

  getMonthView = async (req: Request, res: Response) => {
    try {
      const { year, month } = req.params
      const userId = (req as any).user.userId

      const view = await this.calendarService.getMonthView(
        userId,
        parseInt(year),
        parseInt(month)
      )

      res.json({
        status: "success",
        data: { view }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to get month view", 500)
    }
  }

  getWeekView = async (req: Request, res: Response) => {
    try {
      const { year, week } = req.params
      const userId = (req as any).user.userId

      const view = await this.calendarService.getWeekView(
        userId,
        parseInt(year),
        parseInt(week)
      )

      res.json({
        status: "success",
        data: { view }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to get week view", 500)
    }
  }

  getDayView = async (req: Request, res: Response) => {
    try {
      const { year, month, day } = req.params
      const userId = (req as any).user.userId

      const view = await this.calendarService.getDayView(
        userId,
        parseInt(year),
        parseInt(month),
        parseInt(day)
      )

      res.json({
        status: "success",
        data: { view }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError("Failed to get day view", 500)
    }
  }
} 