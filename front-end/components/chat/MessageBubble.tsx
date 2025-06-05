"use client"

import { motion } from "framer-motion"
import { Bot, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Message } from "@/types/chat"
import { messageAnimation } from "@/constants/animations"

interface MessageBubbleProps {
  message: Message
  isLast: boolean
}

export function MessageBubble({ message, isLast }: MessageBubbleProps) {
  const isAssistant = message.role === "assistant"

  return (
    <motion.div
      layout
      initial="initial"
      animate="animate"
      exit="exit"
      variants={messageAnimation}
      className={cn(
        "flex items-start gap-3 text-sm",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.2 }}
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow ai-glow",
          isAssistant
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        {isAssistant ? (
          <Bot className="h-4 w-4" />
        ) : (
          <User className="h-4 w-4" />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "rounded-lg px-3 py-2 max-w-[80%] shadow-md relative glass-effect",
          isAssistant
            ? "bg-muted/50"
            : "bg-primary/20 border-primary/50"
        )}
      >
        {message.content}
        {isAssistant && isLast && (
          <motion.div
            className="absolute -bottom-6 left-0 flex items-center gap-2"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-xs text-primary/80 font-medium">
              Sexta-feira AI
            </span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
} 