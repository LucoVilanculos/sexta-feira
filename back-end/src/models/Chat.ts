export interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  userId: string
  type?: "greeting" | "action" | "info" | "response"
  action?: string | null
  data?: any
}

export interface AIResponse {
  type: "greeting" | "action" | "info" | "response"
  message: string
  action: string | null
  data: any
}

export interface ChatContext {
  lastMessages?: Message[]
  currentTask?: string
  userPreferences?: any
}

// Simulação de banco de dados
export const conversations: Message[] = []

export class ChatModel {
  static async saveMessage(
    userId: string,
    content: string,
    sender: "user" | "ai",
    additionalData?: Partial<Message>,
  ): Promise<Message> {
    const message: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      userId,
      ...additionalData,
    }

    conversations.push(message)
    return message
  }

  static async getHistory(userId: string, limit = 50, offset = 0): Promise<Message[]> {
    return conversations
      .filter((conv) => conv.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(offset, offset + limit)
  }

  static async clearHistory(userId: string): Promise<boolean> {
    const initialLength = conversations.length
    const filteredConversations = conversations.filter((conv) => conv.userId !== userId)
    conversations.splice(0, conversations.length, ...filteredConversations)

    return conversations.length < initialLength
  }

  static async getLastMessages(userId: string, count = 5): Promise<Message[]> {
    return conversations
      .filter((conv) => conv.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, count)
  }

  static generateAIResponse(message: string, context?: ChatContext): AIResponse {
    const input = message.toLowerCase()

    // Comandos específicos
    if (input.includes("criar tarefa") || input.includes("nova tarefa")) {
      return {
        type: "action",
        message: "Claro! Vou ajudá-lo a criar uma nova tarefa. Qual é o título da tarefa?",
        action: "create_task",
        data: {},
      }
    }

    if (input.includes("listar tarefas") || input.includes("minhas tarefas")) {
      return {
        type: "action",
        message: "Aqui estão suas tarefas pendentes. Posso ajudar com alguma específica?",
        action: "list_tasks",
        data: {},
      }
    }

    if (input.includes("agendar reunião") || input.includes("marcar reunião")) {
      return {
        type: "action",
        message: "Perfeito! Vou agendar uma reunião para você. Qual é o assunto e quando gostaria de agendar?",
        action: "schedule_meeting",
        data: {},
      }
    }

    if (input.includes("projetos") || input.includes("projeto")) {
      return {
        type: "info",
        message: 'Você tem projetos ativos. O "Sexta-feira AI" está com bom progresso. Gostaria de ver mais detalhes?',
        action: "show_projects",
        data: {},
      }
    }

    if (input.includes("status") || input.includes("resumo")) {
      return {
        type: "info",
        message:
          "Aqui está seu resumo: tarefas concluídas esta semana, reuniões agendadas, e ótima produtividade. Excelente trabalho!",
        action: "show_dashboard",
        data: {},
      }
    }

    if (input.includes("ajuda") || input.includes("help")) {
      return {
        type: "info",
        message:
          "Posso ajudar você com: ✅ Gerenciar tarefas, 📅 Agendar reuniões, 📊 Acompanhar projetos, 📈 Ver estatísticas, 🔧 Configurações. O que você precisa?",
        action: null,
        data: {},
      }
    }

    // Saudações
    if (input.includes("olá") || input.includes("oi") || input.includes("hello")) {
      const greetings = [
        "Olá! Como posso ajudá-lo hoje?",
        "Oi! Pronto para ser mais produtivo?",
        "Olá! Sua assistente Sexta-feira está aqui. Em que posso ajudar?",
      ]
      return {
        type: "greeting",
        message: greetings[Math.floor(Math.random() * greetings.length)],
        action: null,
        data: {},
      }
    }

    // Resposta padrão inteligente
    const responses = [
      "Interessante! Posso ajudar você com isso. Pode me dar mais detalhes?",
      "Entendi. Como sua assistente pessoal, vou processar isso para você.",
      "Perfeito! Deixe-me ver como posso ajudar com essa solicitação.",
      "Ótima pergunta! Vou analisar e te dar a melhor resposta.",
      "Compreendi. Vou usar minha IA para resolver isso da melhor forma.",
    ]

    return {
      type: "response",
      message: responses[Math.floor(Math.random() * responses.length)],
      action: null,
      data: {},
    }
  }
}
