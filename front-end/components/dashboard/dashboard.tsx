"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, CheckCircle, Clock, MessageSquare, Plus, TrendingUp, Zap, Brain } from "lucide-react"
import { ChatInterface } from "@/components/chat/chat-interface"

export function Dashboard() {
  const stats = [
    {
      title: "Tarefas Concluídas",
      value: "24",
      description: "Esta semana",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Reuniões Agendadas",
      value: "8",
      description: "Próximos 7 dias",
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      title: "Tempo Economizado",
      value: "4.2h",
      description: "Hoje",
      icon: Clock,
      color: "text-purple-500",
    },
    {
      title: "Produtividade",
      value: "94%",
      description: "+12% vs semana passada",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ]

  const recentTasks = [
    { id: 1, title: "Revisar código do projeto X", completed: true, priority: "alta" },
    { id: 2, title: "Reunião com equipe de design", completed: false, priority: "média" },
    { id: 3, title: "Atualizar documentação", completed: false, priority: "baixa" },
    { id: 4, title: "Deploy da versão 2.1", completed: true, priority: "alta" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Bem-vindo de volta!
          </h1>
          <p className="text-muted-foreground">Aqui está um resumo do que está acontecendo hoje.</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-purple-500/20 bg-black/40 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card className="border-purple-500/20 bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Tarefas Recentes
            </CardTitle>
            <CardDescription>Suas últimas atividades e pendências</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${task.completed ? "bg-green-500" : "bg-yellow-500"}`} />
                  <span className={task.completed ? "line-through text-muted-foreground" : ""}>{task.title}</span>
                </div>
                <Badge
                  variant={
                    task.priority === "alta" ? "destructive" : task.priority === "média" ? "default" : "secondary"
                  }
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Status */}
        <Card className="border-purple-500/20 bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              Status da IA
            </CardTitle>
            <CardDescription>Monitoramento da Sexta-feira</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processamento</span>
                <span>98%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Aprendizado</span>
                <span>87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Disponibilidade</span>
                <span>100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <Zap className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-400">Todos os sistemas operacionais</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <Card className="border-purple-500/20 bg-black/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Conversar com Sexta-feira
          </CardTitle>
          <CardDescription>Fale com sua assistente pessoal</CardDescription>
        </CardHeader>
        <CardContent>
          <ChatInterface />
        </CardContent>
      </Card>
    </div>
  )
}
