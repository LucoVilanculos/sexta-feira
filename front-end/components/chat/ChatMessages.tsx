"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "../context/chatContext"
import { MessageBubble } from "./MessageBubble"
import { staggerChildren, typingIndicator } from "@/constants/animations"

export function ChatMessages() {
  const { messages, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <motion.div
      className="flex-1 overflow-y-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 text-muted-foreground"
          >
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  variants={typingIndicator}
                  initial="initial"
                  animate="animate"
                  className="h-2 w-2 rounded-full bg-primary"
                />
              ))}
            </div>
            <span className="text-sm">Sexta-feira está pensando...</span>
          </motion.div>
        )}
      </motion.div>
      <div ref={messagesEndRef} />
    </motion.div>
  )
} 