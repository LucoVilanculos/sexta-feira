// Configuração dos modelos de IA disponíveis
export const AI_MODELS = {
  // Modelo principal para chat - Bom para conversação geral
  blenderbot: {
    url: "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
    description: "Modelo otimizado para conversação natural",
    examples: [
      "Como está o tempo hoje?",
      "Qual é a sua opinião sobre inteligência artificial?",
      
    ],
  },
  
  // Modelo para tarefas específicas - Bom para instruções e comandos
  flan: {
    url: "https://api-inference.huggingface.co/models/google/flan-t5-small",
    description: "Modelo para tarefas específicas e análise",
    examples: [
      "Resuma este texto: ...",
      "Traduza para português: Hello world",
    ],
  },
  
  // Modelo para análise de sentimento - Bom para análise de texto
  roberta: {
    url: "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment",
    description: "Modelo para análise de sentimento",
    examples: [
      "Analisar sentimento: Adorei este produto!",
      "Classificar emoção: Estou muito feliz hoje",
    ],
  },
  
  // Modelo multilíngue - Melhor para português
  bert: {
    url: "https://api-inference.huggingface.co/models/neuralmind/bert-base-portuguese-cased",
    description: "Modelo otimizado para português",
    examples: [
      "Qual é a capital do Brasil?",
      "Quem descobriu o Brasil?",
    ],
  }
} as const

export type ModelType = keyof typeof AI_MODELS

export async function generateResponse(
  prompt: string,
  modelType: ModelType = "blenderbot"
) {
  try {
    const model = AI_MODELS[modelType]
    console.log(`Usando modelo: ${modelType} - ${model.description}`)

    const response = await fetch(model.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        options: {
          wait_for_model: true,
          use_cache: true,
        },
      }),
    })

    const result = await response.json()

    // Tratamento específico para cada tipo de modelo
    switch (modelType) {
      case "roberta":
        // Roberta retorna scores de sentimento
        return {
          sentiment: result[0]?.[0]?.label,
          score: result[0]?.[0]?.score,
          text: `Sentimento detectado: ${result[0]?.[0]?.label}`
        }
      
      case "flan":
        // Flan retorna respostas diretas
        return {
          text: result[0] || "Não foi possível processar a solicitação",
          raw: result
        }
      
      case "bert":
      case "blenderbot":
      default:
        // Modelos de conversação retornam texto gerado
        return {
          text: result[0]?.generated_text || "Desculpe, não entendi sua solicitação",
          raw: result
        }
    }
  } catch (error) {
    console.error("Erro ao gerar resposta:", error)
    return {
      text: "Desculpe, ocorreu um erro ao processar sua solicitação",
      error: error instanceof Error ? error.message : "Erro desconhecido"
    }
  }
}

// Função para selecionar o melhor modelo para cada tipo de tarefa
export function getBestModelForTask(task: string): ModelType {
  const taskLower = task.toLowerCase()
  
  if (taskLower.includes("sentimento") || taskLower.includes("análise")) {
    return "roberta"
  }
  
  if (taskLower.includes("traduz") || taskLower.includes("resumo")) {
    return "flan"
  }
  
  if (taskLower.includes("português") || taskLower.includes("brasil")) {
    return "bert"
  }
  
  return "blenderbot"
} 