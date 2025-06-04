"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Brain } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { VoiceButton } from "../ui/voicebutton"
import { fetcAiResponse } from "@/lib/usechatai"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export function ChatInterface() {
  // 1. Inicialize vazio para evitar hydration error
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // 2. Adicione a mensagem inicial só no client
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "1",
          content: "Olá! Eu sou a Sexta-feira, sua assistente pessoal. Como posso ajudá-lo hoje?",
          sender: "ai",
          timestamp: new Date(),
        },
      ])
    }
  }, [])

  // Scroll automático ao adicionar mensagens
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    const userText = inputValue
    setInputValue("")
    setIsTyping(true)

    const aiText = await fetcAiResponse(userText)

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: userText,
        sender: "user",
        timestamp: new Date(),
      },
      {
        id: (Date.now() + 1).toString(),
        content: aiText,
        sender: "ai",
        timestamp: new Date(),
      },
    ])

    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-96 border border-purple-500/20 rounded-lg bg-black/20">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef} suppressHydrationWarning>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              suppressHydrationWarning
            >
              {message.sender === "ai" && (
                <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500">
                  <AvatarFallback>
                    <Brain className="h-4 w-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
                suppressHydrationWarning
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {message.sender === "user" && (
                <Avatar className="h-8 w-8 bg-gradient-to-br from-green-500 to-teal-500">
                  <AvatarFallback className="text-white">U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start" suppressHydrationWarning>
              <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500">
                <AvatarFallback>
                  <Brain className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-purple-500/20 p-4">
        <div className="flex gap-2">
          {/* 3. VoiceButton envia texto para o input */}
          <VoiceButton onResult={setInputValue} />

          <Input
            placeholder="Digite sua mensagem..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-purple-500/20 bg-black/40"
            suppressHydrationWarning
          />

          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            suppressHydrationWarning
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}