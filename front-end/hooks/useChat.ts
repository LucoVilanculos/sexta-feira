import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { ChatApi } from '@/server/chat'
import type { Message } from '@/types/chat'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingHistory, setIsFetchingHistory] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setIsFetchingHistory(true)
      const { conversations } = await ChatApi.getHistory(50)
      setMessages(conversations)
    } catch (error) {
      toast.error("Failed to load chat history")
      console.error(error)
    } finally {
      setIsFetchingHistory(false)
    }
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    setIsLoading(true)

    try {
      // Add user message immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: "user",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, userMessage])

      // Send to API
      const { response: aiMessage } = await ChatApi.sendMessage(content, {
        lastMessages: messages.slice(-5),
      })

      setMessages(prev => [...prev, aiMessage])

      // Handle actions
      if (aiMessage.action) {
        const actionResponse = await ChatApi.executeAction(aiMessage.action, aiMessage.data)
        if (actionResponse.redirect) {
          // You can pass a callback to handle redirects
          return actionResponse
        }
      }
    } catch (error) {
      toast.error("Failed to send message")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearHistory = async () => {
    try {
      await ChatApi.clearHistory()
      setMessages([])
      toast.success("Chat history cleared")
    } catch (error) {
      toast.error("Failed to clear history")
      console.error(error)
    }
  }

  return {
    messages,
    isLoading,
    isFetchingHistory,
    sendMessage,
    clearHistory
  }
} 