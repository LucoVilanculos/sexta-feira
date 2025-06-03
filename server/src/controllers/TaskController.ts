import type { Request, Response } from "express"
import { validationResult } from "express-validator"
import { TaskModel, type CreateTaskData, type UpdateTaskData, type TaskFilters } from "../models/Task"

export class TaskController {
  static async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const filters: TaskFilters = {
        status: req.query.status as string,
        priority: req.query.priority as string,
        search: req.query.search as string,
        projectId: req.query.projectId as string,
        tags: req.query.tags ? (req.query.tags as string).split(",") : undefined,
      }

      const tasks = await TaskModel.findByUserId(userId, filters)

      res.json({
        tasks,
        total: tasks.length,
      })
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async getTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params

      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const task = await TaskModel.findById(id, userId)
      if (!task) {
        res.status(404).json({ message: "Tarefa não encontrada" })
        return
      }

      res.json(task)
    } catch (error) {
      console.error("Erro ao buscar tarefa:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async createTask(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
      }

      const userId = (req as any).user?.userId
      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const taskData: CreateTaskData = req.body
      const task = await TaskModel.create(userId, taskData)

      res.status(201).json({
        message: "Tarefa criada com sucesso",
        task,
      })
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
      }

      const userId = (req as any).user?.userId
      const { id } = req.params

      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const updateData: UpdateTaskData = req.body
      const task = await TaskModel.update(id, userId, updateData)

      if (!task) {
        res.status(404).json({ message: "Tarefa não encontrada" })
        return
      }

      res.json({
        message: "Tarefa atualizada com sucesso",
        task,
      })
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params

      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const deleted = await TaskModel.delete(id, userId)
      if (!deleted) {
        res.status(404).json({ message: "Tarefa não encontrada" })
        return
      }

      res.json({ message: "Tarefa deletada com sucesso" })
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async completeTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params

      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const task = await TaskModel.update(id, userId, { status: "completed" })
      if (!task) {
        res.status(404).json({ message: "Tarefa não encontrada" })
        return
      }

      res.json({
        message: "Tarefa marcada como concluída",
        task,
      })
    } catch (error) {
      console.error("Erro ao completar tarefa:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async getTaskStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const stats = await TaskModel.getStats(userId)
      res.json(stats)
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }
}
