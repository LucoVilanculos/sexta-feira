import type { Request, Response } from "express"
import { ChatModel, type ChatContext } from "../models/Chat"

export class ChatController {
  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      const { message, context }: { message: string; context?: ChatContext } = req.body

      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      if (!message || message.trim().length === 0) {
        res.status(400).json({ message: "Mensagem é obrigatória" })
        return
      }

      // Salvar mensagem do usuário
      const userMessage = await ChatModel.saveMessage(userId, message, "user")

      // Gerar resposta da IA
      const aiResponse = ChatModel.generateAIResponse(message, context)

      // Salvar resposta da IA
      const aiMessage = await ChatModel.saveMessage(userId, aiResponse.message, "ai", {
        type: aiResponse.type,
        action: aiResponse.action,
        data: aiResponse.data,
      })

      res.json({
        message: "Mensagem processada com sucesso",
        response: aiMessage,
        conversation_id: userMessage.id,
      })
    } catch (error) {
      console.error("Erro no chat:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const { limit = "50", offset = "0" } = req.query
      const conversations = await ChatModel.getHistory(
        userId,
        Number.parseInt(limit as string),
        Number.parseInt(offset as string),
      )

      res.json({
        conversations,
        total: conversations.length,
      })
    } catch (error) {
      console.error("Erro ao buscar histórico:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async clearHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const cleared = await ChatModel.clearHistory(userId)
      if (!cleared) {
        res.status(400).json({ message: "Erro ao limpar histórico" })
        return
      }

      res.json({ message: "Histórico limpo com sucesso" })
    } catch (error) {
      console.error("Erro ao limpar histórico:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async executeAction(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      const { action, data } = req.body

      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      let response: any = {}

      switch (action) {
        case "create_task":
          response = {
            message: "Tarefa criada com sucesso! Adicionei à sua lista.",
            success: true,
          }
          break

        case "list_tasks":
          response = {
            message: "Aqui estão suas tarefas pendentes.",
            success: true,
            data: {
              tasks: [
                { id: 1, title: "Revisar código", status: "pending" },
                { id: 2, title: "Reunião design", status: "pending" },
              ],
            },
          }
          break

        case "schedule_meeting":
          response = {
            message: "Reunião agendada com sucesso!",
            success: true,
          }
          break

        case "show_projects":
          response = {
            message: "Redirecionando para a página de projetos...",
            success: true,
            redirect: "/dashboard/projects",
          }
          break

        case "show_dashboard":
          response = {
            message: "Aqui está seu resumo no dashboard.",
            success: true,
            redirect: "/dashboard",
          }
          break

        default:
          response = {
            message: "Ação não reconhecida.",
            success: false,
          }
      }

      res.json(response)
    } catch (error) {
      console.error("Erro ao executar ação:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }
}
