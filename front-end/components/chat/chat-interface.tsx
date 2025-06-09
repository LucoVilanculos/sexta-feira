"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Brain, Trash2, ArrowDown } from "lucide-react"
import { useChat } from "../../hooks/useChat"


import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { VoiceButton } from "../ui/voicebutton"


export function ChatInterface() {
  const { messages, isLoading, isFetchingHistory, sendMessage, clearHistory } = useChat()
  const [inputValue, setInputValue] = useState("")
  const [showScrollButton, setShowScrollButton] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Handle scroll to show/hide scroll button
  const handleScroll = () => {
    if (!scrollAreaRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShowScrollButton(!isNearBottom)
  }

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current && !showScrollButton) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, showScrollButton])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    setInputValue("")
    await sendMessage(inputValue)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
      setShowScrollButton(false)
    }
  }

  if (isFetchingHistory) {
    return (
      <div className="flex h-96 items-center justify-center border border-purple-500/20 rounded-lg bg-black/20">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
          <p className="text-sm text-muted-foreground">Loading chat history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-96 border border-purple-500/20 rounded-lg bg-black/20">
      {/* Header with clear button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-purple-500/20">
        <h3 className="text-sm font-medium">Chat History</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={clearHistory}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef} onScroll={handleScroll}>
        <div className="space-y-4">
          {messages.map((message: any) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
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
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {message.sender === "user" && (
                <Avatar className="h-8 w-8 bg-gradient-to-br from-green-500 to-teal-500">
                  <AvatarFallback className="text-white">U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToBottom}
          className="absolute bottom-20 right-6 h-8 w-8 rounded-full bg-primary/90 hover:bg-primary shadow-lg"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}

      {/* Input Area */}
      <div className="border-t border-purple-500/20 p-4">
        <div className="flex gap-2">
          <VoiceButton onResult={setInputValue} />

          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-purple-500/20 bg-black/40"
            disabled={isLoading}
          />

          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}