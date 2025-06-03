// Configuração base para chamadas da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    // Adicionar token de autenticação se disponível
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Métodos de autenticação
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(name: string, email: string, password: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    })
  }

  // Métodos para tarefas
  async getTasks() {
    return this.request("/tasks")
  }

  async createTask(task: any) {
    return this.request("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    })
  }

  async updateTask(id: string, task: any) {
    return this.request(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(task),
    })
  }

  async deleteTask(id: string) {
    return this.request(`/tasks/${id}`, {
      method: "DELETE",
    })
  }

  // Métodos para projetos
  async getProjects() {
    return this.request("/projects")
  }

  async createProject(project: any) {
    return this.request("/projects", {
      method: "POST",
      body: JSON.stringify(project),
    })
  }

  async updateProject(id: string, project: any) {
    return this.request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(project),
    })
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: "DELETE",
    })
  }

  // Métodos para chat/IA
  async sendMessage(message: string) {
    return this.request("/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    })
  }

  async getConversationHistory() {
    return this.request("/chat/history")
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
