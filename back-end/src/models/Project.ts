export interface Project {
  id: string
  name: string
  description?: string
  status: "Planejamento" | "Em Desenvolvimento" | "Concluído" | "Pausado"
  priority: "Baixa" | "Média" | "Alta"
  progress: number
  dueDate?: string
  team: string[]
  tasks: {
    completed: number
    total: number
  }
  tags?: string[]
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateProjectData {
  name: string
  description?: string
  priority: "Baixa" | "Média" | "Alta"
  dueDate?: string
  team?: string[]
  tags?: string[]
}

export interface UpdateProjectData {
  name?: string
  description?: string
  status?: "Planejamento" | "Em Desenvolvimento" | "Concluído" | "Pausado"
  priority?: "Baixa" | "Média" | "Alta"
  progress?: number
  dueDate?: string
  team?: string[]
  tags?: string[]
}

export interface ProjectFilters {
  status?: string
  priority?: string
  search?: string
  tags?: string[]
}

// Simulação de banco de dados
export const projects: Project[] = [
  {
    id: "1",
    name: "Sexta-feira AI",
    description: "Assistente pessoal inteligente com IA",
    status: "Em Desenvolvimento",
    priority: "Alta",
    progress: 75,
    dueDate: "2024-02-15",
    team: ["João", "Maria", "Pedro"],
    tasks: { completed: 12, total: 16 },
    tags: ["ia", "assistente", "produtividade"],
    userId: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-29"),
  },
  {
    id: "2",
    name: "Dashboard Analytics",
    description: "Sistema de análise de dados em tempo real",
    status: "Planejamento",
    priority: "Média",
    progress: 25,
    dueDate: "2024-03-01",
    team: ["Ana", "Carlos"],
    tasks: { completed: 3, total: 12 },
    tags: ["analytics", "dashboard", "dados"],
    userId: "1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-28"),
  },
]

export class ProjectModel {
  static async findByUserId(userId: string, filters?: ProjectFilters): Promise<Project[]> {
    let userProjects = projects.filter((project) => project.userId === userId)

    if (filters) {
      if (filters.status) {
        userProjects = userProjects.filter((project) => project.status === filters.status)
      }

      if (filters.priority) {
        userProjects = userProjects.filter((project) => project.priority === filters.priority)
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        userProjects = userProjects.filter(
          (project) =>
            project.name.toLowerCase().includes(searchLower) ||
            project.description?.toLowerCase().includes(searchLower),
        )
      }

      if (filters.tags && filters.tags.length > 0) {
        userProjects = userProjects.filter((project) => project.tags?.some((tag) => filters.tags!.includes(tag)))
      }
    }

    return userProjects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  static async findById(id: string, userId: string): Promise<Project | null> {
    return projects.find((project) => project.id === id && project.userId === userId) || null
  }

  static async create(userId: string, projectData: CreateProjectData): Promise<Project> {
    const project: Project = {
      id: Date.now().toString(),
      ...projectData,
      status: "Planejamento",
      progress: 0,
      team: projectData.team || [],
      tasks: { completed: 0, total: 0 },
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    projects.push(project)
    return project
  }

  static async update(id: string, userId: string, updateData: UpdateProjectData): Promise<Project | null> {
    const projectIndex = projects.findIndex((project) => project.id === id && project.userId === userId)
    if (projectIndex === -1) return null

    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updateData,
      updatedAt: new Date(),
    }

    return projects[projectIndex]
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    const projectIndex = projects.findIndex((project) => project.id === id && project.userId === userId)
    if (projectIndex === -1) return false

    projects.splice(projectIndex, 1)
    return true
  }

  static async updateProgress(id: string, userId: string, progress: number): Promise<Project | null> {
    const projectIndex = projects.findIndex((project) => project.id === id && project.userId === userId)
    if (projectIndex === -1) return null

    projects[projectIndex].progress = progress
    projects[projectIndex].updatedAt = new Date()

    // Atualizar status baseado no progresso
    if (progress === 100) {
      projects[projectIndex].status = "Concluído"
    } else if (progress > 0) {
      projects[projectIndex].status = "Em Desenvolvimento"
    }

    return projects[projectIndex]
  }

  static async getStats(userId: string): Promise<{
    total: number
    completed: number
    inProgress: number
    planning: number
  }> {
    const userProjects = projects.filter((project) => project.userId === userId)

    return {
      total: userProjects.length,
      completed: userProjects.filter((project) => project.status === "Concluído").length,
      inProgress: userProjects.filter((project) => project.status === "Em Desenvolvimento").length,
      planning: userProjects.filter((project) => project.status === "Planejamento").length,
    }
  }
}
