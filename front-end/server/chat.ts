import type { ChatContext, AIResponse, ChatHistoryResponse, ActionResponse } from '@/types/chat'
import { ChatResponse, SendMessageRequest } from "@/types/chat"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

class ChatApi {
  private static getToken() {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  private static async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return response.json()
  }

  static async sendMessage(message: string, context?: ChatContext): Promise<AIResponse> {
    return this.fetchWithAuth('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    })
  }

  static async getHistory(limit = 50, offset = 0): Promise<ChatHistoryResponse> {
    return this.fetchWithAuth(`/api/chat/history?limit=${limit}&offset=${offset}`)
  }

  static async clearHistory(): Promise<{ message: string }> {
    return this.fetchWithAuth('/api/chat/history', {
      method: 'DELETE',
    })
  }

  static async executeAction(action: string, data: any): Promise<ActionResponse> {
    return this.fetchWithAuth('/api/chat/action', {
      method: 'POST',
      body: JSON.stringify({ action, data }),
    })
  }
}

export async function sendChatMessage(request: SendMessageRequest): Promise<ChatResponse> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error("Failed to get AI response")
    }

    const data = await response.json()
    return data as ChatResponse
  } catch (error) {
    console.error("Error in chat service:", error)
    throw error
  }
}

export { ChatApi } 