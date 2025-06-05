export interface Task {
  id: string
  title: string
  description?: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "baixa" | "média" | "alta"
  dueDate?: string
  tags?: string[]
  projectId?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateTaskData {
  title: string
  description?: string
  priority: "baixa" | "média" | "alta"
  dueDate?: string
  tags?: string[]
  projectId?: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: "pending" | "in_progress" | "completed" | "cancelled"
  priority?: "baixa" | "média" | "alta"
  dueDate?: string
  tags?: string[]
  projectId?: string
}

export interface TaskFilters {
  status?: string
  priority?: string
  search?: string
  projectId?: string
  tags?: string[]
}

// Simulação de banco de dados
export const tasks: Task[] = [
  {
    id: "1",
    title: "Revisar código do projeto X",
    description: "Fazer code review das últimas alterações",
    status: "completed",
    priority: "alta",
    dueDate: "2024-01-30",
    tags: ["desenvolvimento", "review"],
    userId: "1",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-29"),
  },
  {
    id: "2",
    title: "Reunião com equipe de design",
    description: "Discutir novos wireframes",
    status: "pending",
    priority: "média",
    dueDate: "2024-02-05",
    tags: ["reunião", "design"],
    userId: "1",
    createdAt: new Date("2024-01-28"),
    updatedAt: new Date("2024-01-28"),
  },
]

export class TaskModel {
  static async findByUserId(userId: string, filters?: TaskFilters): Promise<Task[]> {
    let userTasks = tasks.filter((task) => task.userId === userId)

    if (filters) {
      if (filters.status) {
        userTasks = userTasks.filter((task) => task.status === filters.status)
      }

      if (filters.priority) {
        userTasks = userTasks.filter((task) => task.priority === filters.priority)
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        userTasks = userTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(searchLower) || task.description?.toLowerCase().includes(searchLower),
        )
      }

      if (filters.projectId) {
        userTasks = userTasks.filter((task) => task.projectId === filters.projectId)
      }

      if (filters.tags && filters.tags.length > 0) {
        userTasks = userTasks.filter((task) => task.tags?.some((tag) => filters.tags!.includes(tag)))
      }
    }

    return userTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  static async findById(id: string, userId: string): Promise<Task | null> {
    return tasks.find((task) => task.id === id && task.userId === userId) || null
  }

  static async create(userId: string, taskData: CreateTaskData): Promise<Task> {
    const task: Task = {
      id: Date.now().toString(),
      ...taskData,
      status: "pending",
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    tasks.push(task)
    return task
  }

  static async update(id: string, userId: string, updateData: UpdateTaskData): Promise<Task | null> {
    const taskIndex = tasks.findIndex((task) => task.id === id && task.userId === userId)
    if (taskIndex === -1) return null

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updateData,
      updatedAt: new Date(),
    }

    return tasks[taskIndex]
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    const taskIndex = tasks.findIndex((task) => task.id === id && task.userId === userId)
    if (taskIndex === -1) return false

    tasks.splice(taskIndex, 1)
    return true
  }

  static async getStats(userId: string): Promise<{
    total: number
    completed: number
    pending: number
    inProgress: number
  }> {
    const userTasks = tasks.filter((task) => task.userId === userId)

    return {
      total: userTasks.length,
      completed: userTasks.filter((task) => task.status === "completed").length,
      pending: userTasks.filter((task) => task.status === "pending").length,
      inProgress: userTasks.filter((task) => task.status === "in_progress").length,
    }
  }
}
