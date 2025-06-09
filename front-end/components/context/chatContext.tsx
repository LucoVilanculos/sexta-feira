"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { toast } from "sonner"

import { useVoice } from "./voiceContext"
import { Message } from "@/types/chat"
import { sendChatMessage } from "@/services/chat"
import { processNaturalLanguage } from "@/utils/commandProcessor"
import { any } from "zod"

interface ChatContextProps {
  messages: Message[]
  isLoading: boolean
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

const ChatContext = createContext<ChatContextProps | null>(null)

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { speak } = useVoice()

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Primeiro tenta processar como um comando
      try {
        const commandResult = await processNaturalLanguage(content)
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Comando executado com sucesso!",
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])
        speak("Comando executado com sucesso!")
        toast.success("Comando executado!")
        return
      } catch (commandError) {
        // Se não for um comando, trata como uma conversa normal
        const data = await sendChatMessage({})
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])
        speak(data.content)
      }
    } catch (error) {
      console.error("Error processing message:", error)
      toast.error("Desculpe, não consegui processar sua mensagem.")
    } finally {
      setIsLoading(false)
    }
  }, [speak])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
} 