export type MessageType = 'greeting' | 'action' | 'info' | 'response'

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}


export interface ChatContext {
  lastMessages?: Message[]
  currentTask?: string
  userPreferences?: any
}

export interface AIResponse {
  message: string
  response: Message
  conversation_id: string
}

export interface ChatHistoryResponse {
  conversations: Message[]
  total: number
}

export interface ActionResponse {
  message: string
  success: boolean
  data?: any
  redirect?: string
}

export interface ChatResponse {
  response: string
  error?: string
}

export interface SendMessageRequest {
  message: string
} 