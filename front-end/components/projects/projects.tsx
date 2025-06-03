"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, FolderOpen, Calendar, Users, MoreHorizontal, GitBranch } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Projects() {
  const [searchTerm, setSearchTerm] = useState("")

  const projects = [
    {
      id: 1,
      name: "Sexta-feira AI",
      description: "Assistente pessoal inteligente com IA",
      status: "Em Desenvolvimento",
      priority: "Alta",
      progress: 75,
      dueDate: "2024-02-15",
      team: ["João", "Maria", "Pedro"],
      tasks: { completed: 12, total: 16 },
    },
    {
      id: 2,
      name: "Dashboard Analytics",
      description: "Sistema de análise de dados em tempo real",
      status: "Planejamento",
      priority: "Média",
      progress: 25,
      dueDate: "2024-03-01",
      team: ["Ana", "Carlos"],
      tasks: { completed: 3, total: 12 },
    },
    {
      id: 3,
      name: "Mobile App",
      description: "Aplicativo móvel para iOS e Android",
      status: "Concluído",
      priority: "Baixa",
      progress: 100,
      dueDate: "2024-01-30",
      team: ["Lucas", "Sofia", "Rafael", "Beatriz"],
      tasks: { completed: 24, total: 24 },
    },
    {
      id: 4,
      name: "API Gateway",
      description: "Microserviços e gateway de APIs",
      status: "Em Desenvolvimento",
      priority: "Alta",
      progress: 60,
      dueDate: "2024-02-28",
      team: ["Diego", "Fernanda"],
      tasks: { completed: 8, total: 14 },
    },
  ]

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Em Desenvolvimento":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Planejamento":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "Média":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "Baixa":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Projetos
          </h1>
          <p className="text-muted-foreground">Gerencie todos os seus projetos em um só lugar</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-purple-500/20 bg-black/40"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="border-purple-500/20 bg-black/40 backdrop-blur-xl hover:border-purple-500/40 transition-colors"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-purple-400" />
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Duplicar</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Status and Priority */}
              <div className="flex gap-2">
                <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                <Badge className={getPriorityColor(project.priority)}>{project.priority}</Badge>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Tasks */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GitBranch className="h-4 w-4" />
                <span>
                  {project.tasks.completed}/{project.tasks.total} tarefas
                </span>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Entrega: {new Date(project.dueDate).toLocaleDateString("pt-BR")}</span>
              </div>

              {/* Team */}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map((member, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-medium border-2 border-background"
                    >
                      {member[0]}
                    </div>
                  ))}
                  {project.team.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-medium border-2 border-background">
                      +{project.team.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Tente ajustar sua busca" : "Comece criando seu primeiro projeto"}
          </p>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>
      )}
    </div>
  )
}
