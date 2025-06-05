import { Command, CommandType } from "@/types/commands"
import { generateResponse, getBestModelForTask } from "@/lib/ai-models"

const API_URL = "/api/commands"

// Função auxiliar para gerar respostas usando Hugging Face
async function generateAIResponse(prompt: string) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          options: {
            wait_for_model: true,
          },
        }),
      }
    )

    const result = await response.json()
    return result[0]?.generated_text || "Desculpe, não consegui processar sua solicitação."
  } catch (error) {
    console.error("Erro ao gerar resposta:", error)
    return "Desculpe, ocorreu um erro ao processar sua solicitação."
  }
}

export async function executeCommand(command: Command): Promise<any> {
  try {
    // Atualiza o status para executing
    command.status = "executing"

    // Prepara o prompt baseado no tipo de comando
    let prompt = `Você é a Sexta-Feira, uma assistente virtual. `
    let modelTask = command.type // Para selecionar o modelo

    switch (command.type) {
      case "analysis":
        prompt += `Por favor, faça uma análise detalhada de: ${command.target}`
        modelTask = "analysis" // Mantém o tipo original do comando
        break
      case "social":
        prompt += `Por favor, ajude com a seguinte interação social: ${command.action} no ${command.platform}`
        break
      case "reminder":
        prompt += `Por favor, ajude com o lembrete: ${command.title}`
        break
      case "weather":
        prompt += `Como está o tempo ${command.location ? `em ${command.location}` : "hoje"}?`
        break
      default:
        prompt += `Por favor, responda à seguinte solicitação: ${JSON.stringify(command)}`
    }

    // Seleciona o melhor modelo e gera a resposta
    const response = await generateResponse(prompt, getBestModelForTask(modelTask))

    command.status = "completed"
    return { success: true, response: response.text }
  } catch (error) {
    command.status = "failed"
    throw error
  }
}

// Funções auxiliares para criar comandos
export function createSystemCommand(action: string, target?: string) {
  return {
    type: "system" as CommandType,
    action,
    target,
    status: "pending",
    timestamp: new Date(),
  }
}

export function createSocialCommand(platform: string, action: string, content?: string) {
  return {
    type: "social" as CommandType,
    platform,
    action,
    content,
    status: "pending",
    timestamp: new Date(),
  }
}

export function createWeatherCommand(location?: string, forecast: 'current' | 'today' | 'week' = 'current') {
  return {
    type: "weather" as CommandType,
    location,
    forecast,
    status: "pending",
    timestamp: new Date(),
  }
}

export function createReminderCommand(
  action: string,
  title: string,
  description?: string,
  dueDate?: Date,
  priority: 'low' | 'medium' | 'high' = 'medium'
) {
  return {
    type: "reminder" as CommandType,
    action,
    title,
    description,
    dueDate,
    priority,
    status: "pending",
    timestamp: new Date(),
  }
}

export function createMediaCommand(platform: string, action: string, query?: string) {
  return {
    type: "media" as CommandType,
    platform,
    action,
    query,
    status: "pending",
    timestamp: new Date(),
  }
}

export function createProductivityCommand(app: string, action: string, context?: string) {
  return {
    type: "productivity" as CommandType,
    app,
    action,
    context,
    status: "pending",
    timestamp: new Date(),
  }
}

export function createAmbientCommand(
  mode: string,
  duration?: number,
  intensity: 'low' | 'medium' | 'high' = 'medium'
) {
  return {
    type: "ambient" as CommandType,
    mode,
    duration,
    intensity,
    status: "pending",
    timestamp: new Date(),
  }
}

export function createUpdateCommand(target: string, action: string) {
  return {
    type: "updates" as CommandType,
    target,
    action,
    status: "pending",
    timestamp: new Date(),
  }
}

export function createAnalysisCommand(
  target: string,
  platform?: string,
  depth: 'basic' | 'detailed' = 'basic',
  suggestions: boolean = true
) {
  return {
    type: "analysis" as CommandType,
    target,
    platform,
    depth,
    suggestions,
    status: "pending",
    timestamp: new Date(),
  }
} 