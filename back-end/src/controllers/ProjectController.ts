import type { Request, Response } from "express"
import { validationResult } from "express-validator"
import { ProjectModel, type CreateProjectData, type UpdateProjectData, type ProjectFilters } from "../models/Project"

export class ProjectController {
  static async getProjects(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const filters: ProjectFilters = {
        status: req.query.status as string,
        priority: req.query.priority as string,
        search: req.query.search as string,
        tags: req.query.tags ? (req.query.tags as string).split(",") : undefined,
      }

      const projects = await ProjectModel.findByUserId(userId, filters)

      res.json({
        projects,
        total: projects.length,
      })
    } catch (error) {
      console.error("Erro ao buscar projetos:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async getProject(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params

      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const project = await ProjectModel.findById(id, userId)
      if (!project) {
        res.status(404).json({ message: "Projeto não encontrado" })
        return
      }

      res.json(project)
    } catch (error) {
      console.error("Erro ao buscar projeto:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async createProject(req: Request, res: Response): Promise<void> {
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

      const projectData: CreateProjectData = req.body
      const project = await ProjectModel.create(userId, projectData)

      res.status(201).json({
        message: "Projeto criado com sucesso",
        project,
      })
    } catch (error) {
      console.error("Erro ao criar projeto:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async updateProject(req: Request, res: Response): Promise<void> {
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

      const updateData: UpdateProjectData = req.body
      const project = await ProjectModel.update(id, userId, updateData)

      if (!project) {
        res.status(404).json({ message: "Projeto não encontrado" })
        return
      }

      res.json({
        message: "Projeto atualizado com sucesso",
        project,
      })
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params

      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const deleted = await ProjectModel.delete(id, userId)
      if (!deleted) {
        res.status(404).json({ message: "Projeto não encontrado" })
        return
      }

      res.json({ message: "Projeto deletado com sucesso" })
    } catch (error) {
      console.error("Erro ao deletar projeto:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async updateProgress(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      const { id } = req.params
      const { progress } = req.body

      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      if (progress < 0 || progress > 100) {
        res.status(400).json({ message: "Progresso deve estar entre 0 e 100" })
        return
      }

      const project = await ProjectModel.updateProgress(id, userId, progress)
      if (!project) {
        res.status(404).json({ message: "Projeto não encontrado" })
        return
      }

      res.json({
        message: "Progresso atualizado com sucesso",
        project,
      })
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async getProjectStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const stats = await ProjectModel.getStats(userId)
      res.json(stats)
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }
}
