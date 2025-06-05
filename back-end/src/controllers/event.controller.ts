import { Request, Response, NextFunction } from 'express'
import prisma from '../config/database'
import { AppError } from '../utils/AppError'

export class EventController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, startDate, endDate, allDay, location, color, recurring, reminders } = req.body
      const userId = req.user!.id

      const event = await prisma.event.create({
        data: {
          title,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          allDay,
          location,
          color,
          recurring,
          reminders,
          userId
        }
      })

      res.status(201).json({
        event,
        message: 'Event created successfully!'
      })
    } catch (error) {
      next(error)
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id
      const { start, end } = req.query

      const where = {
        userId,
        ...(start && end && {
          OR: [
            {
              startDate: {
                gte: new Date(String(start)),
                lte: new Date(String(end))
              }
            },
            {
              endDate: {
                gte: new Date(String(start)),
                lte: new Date(String(end))
              }
            }
          ]
        })
      }

      const events = await prisma.event.findMany({
        where,
        orderBy: { startDate: 'asc' }
      })

      res.json({
        events,
        message: events.length ? `Found ${events.length} events` : 'No events found'
      })
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = req.user!.id

      const event = await prisma.event.findUnique({
        where: { id }
      })

      if (!event) {
        throw new AppError('Event not found', 404)
      }

      if (event.userId !== userId) {
        throw new AppError('Unauthorized', 403)
      }

      res.json({
        event,
        message: 'Event details retrieved successfully'
      })
    } catch (error) {
      next(error)
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = req.user!.id
      const updateData = req.body

      const event = await prisma.event.findUnique({
        where: { id }
      })

      if (!event) {
        throw new AppError('Event not found', 404)
      }

      if (event.userId !== userId) {
        throw new AppError('Unauthorized', 403)
      }

      if (updateData.startDate) {
        updateData.startDate = new Date(updateData.startDate)
      }
      if (updateData.endDate) {
        updateData.endDate = new Date(updateData.endDate)
      }

      const updatedEvent = await prisma.event.update({
        where: { id },
        data: updateData
      })

      res.json({
        event: updatedEvent,
        message: 'Event updated successfully!'
      })
    } catch (error) {
      next(error)
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = req.user!.id

      const event = await prisma.event.findUnique({
        where: { id }
      })

      if (!event) {
        throw new AppError('Event not found', 404)
      }

      if (event.userId !== userId) {
        throw new AppError('Unauthorized', 403)
      }

      await prisma.event.delete({
        where: { id }
      })

      res.status(200).json({
        message: 'Event deleted successfully!'
      })
    } catch (error) {
      next(error)
    }
  }
} 