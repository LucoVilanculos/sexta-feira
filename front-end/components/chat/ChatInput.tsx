"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles, Wand2 } from "lucide-react"
import { VoiceButton } from "@/components/ui/voicebutton"
import { useChat } from "../context/chatContext"
import { slideIn, pulseAnimation } from "@/constants/animations"

export function ChatInput() {
  const [message, setMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { sendMessage, isLoading } = useChat()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    await sendMessage(message)
    setMessage("")
  }

  const handleVoiceResult = (text: string) => {
    setMessage(text)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form 
        onSubmit={handleSubmit} 
        className="relative flex items-center gap-2 p-4 glass-effect border-t"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <VoiceButton onResult={handleVoiceResult} className="flex-none" />
          <motion.div
            className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <div className="relative flex-1">
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/10 via-primary/5 to-transparent -z-10" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Digite sua mensagem ou use o botão de voz..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="pr-10 bg-background/50 border-primary/20 focus:border-primary/50 transition-colors"
            disabled={isLoading}
          />
          <AnimatePresence>
            {message.trim() && (
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={slideIn}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isLoading}
                  className="bg-primary/20 border border-primary/30 hover:bg-primary/30 text-primary-foreground"
                >
                  {isLoading ? (
                    <motion.div
                      animate={pulseAnimation}
                      className="opacity-70"
                    >
                      <Wand2 className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      </form>
    </motion.div>
  )
} 