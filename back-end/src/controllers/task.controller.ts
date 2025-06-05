import { Request, Response, NextFunction } from 'express'
import prisma from '../config/database'
import { AppError } from '../utils/AppError'

export class TaskController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, dueDate, priority, tags } = req.body
      const userId = req.user!.id

      const task = await prisma.task.create({
        data: {
          title,
          description,
          dueDate: dueDate ? new Date(dueDate) : null,
          priority,
          tags,
          userId
        }
      })

      res.status(201).json({
        task,
        message: 'Task created successfully!'
      })
    } catch (error) {
      next(error)
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id
      const { status, priority } = req.query

      const where = {
        userId,
        ...(status && { status: String(status) }),
        ...(priority && { priority: String(priority) })
      }

      const tasks = await prisma.task.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      })

      res.json({
        tasks,
        message: tasks.length ? `Found ${tasks.length} tasks` : 'No tasks found'
      })
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = req.user!.id

      const task = await prisma.task.findUnique({
        where: { id }
      })

      if (!task) {
        throw new AppError('Task not found', 404)
      }

      if (task.userId !== userId) {
        throw new AppError('Unauthorized', 403)
      }

      res.json({
        task,
        message: 'Task details retrieved successfully'
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

      const task = await prisma.task.findUnique({
        where: { id }
      })

      if (!task) {
        throw new AppError('Task not found', 404)
      }

      if (task.userId !== userId) {
        throw new AppError('Unauthorized', 403)
      }

      if (updateData.dueDate) {
        updateData.dueDate = new Date(updateData.dueDate)
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data: updateData
      })

      res.json({
        task: updatedTask,
        message: 'Task updated successfully!'
      })
    } catch (error) {
      next(error)
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = req.user!.id

      const task = await prisma.task.findUnique({
        where: { id }
      })

      if (!task) {
        throw new AppError('Task not found', 404)
      }

      if (task.userId !== userId) {
        throw new AppError('Unauthorized', 403)
      }

      await prisma.task.delete({
        where: { id }
      })

      res.status(200).json({
        message: 'Task deleted successfully!'
      })
    } catch (error) {
      next(error)
    }
  }
} 