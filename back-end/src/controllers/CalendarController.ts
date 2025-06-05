import { Request, Response } from "express"
import { CalendarService } from "@/services/CalendarService"
import { CreateEventInput, UpdateEventInput } from "@/schemas/calendar.schema"
import { AppError } from "@/utils/AppError"
import { validationResult } from "express-validator"

export class CalendarController {
  private calendarService: CalendarService

  constructor() {
    this.calendarService = new CalendarService()
  }

  static async getEvents(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Usuário não autenticado" })
      }

      const userId = req.user.id
      // TODO: Implementar busca de eventos
      const events: any[] = [] // Temporário até implementar a busca no banco de dados
      
      return res.json(events)
    } catch (error) {
      console.error("Erro ao buscar eventos:", error)
      return res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async createEvent(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Usuário não autenticado" })
      }

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const userId = req.user.id
      const eventData = req.body
      // TODO: Implementar criação do evento
      
      return res.status(201).json({ message: "Evento criado com sucesso" })
    } catch (error) {
      console.error("Erro ao criar evento:", error)
      return res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async updateEvent(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Usuário não autenticado" })
      }

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const userId = req.user.id
      const eventId = req.params.id
      const updateData = req.body
      // TODO: Implementar atualização do evento
      
      return res.json({ message: "Evento atualizado com sucesso" })
    } catch (error) {
      console.error("Erro ao atualizar evento:", error)
      return res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async deleteEvent(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Usuário não autenticado" })
      }

      const userId = req.user.id
      const eventId = req.params.id
      // TODO: Implementar exclusão do evento
      
      return res.json({ message: "Evento excluído com sucesso" })
    } catch (error) {
      console.error("Erro ao excluir evento:", error)
      return res.status(500).json({ message: "Erro interno do servidor" })
    }
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
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const userId = (req as any).user.userId
      const event = await this.calendarService.createEvent(userId, req.body)

      res.status(201).json({
        status: "success",
        data: { event }
      })
    } catch (error) {
      console.error("Erro ao criar evento:", error)
      return res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  updateEvent = async (req: Request<{ id: string }, {}, UpdateEventInput>, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { id } = req.params
      const userId = (req as any).user.userId
      const event = await this.calendarService.updateEvent(id, userId, req.body)

      res.json({
        status: "success",
        data: { event }
      })
    } catch (error) {
      console.error("Erro ao atualizar evento:", error)
      return res.status(500).json({ message: "Erro interno do servidor" })
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
      console.error("Erro ao excluir evento:", error)
      return res.status(500).json({ message: "Erro interno do servidor" })
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