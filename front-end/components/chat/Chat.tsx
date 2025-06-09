"use client"

import { motion } from "framer-motion"

import { ChatMessages } from "./ChatMessages"
import { ChatInput } from "./ChatInput"
import { fadeIn } from "@/constants/animations"

export function Chat() {
  return (
    <motion.div
      className="flex flex-col h-[calc(100vh-4rem)] relative"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
        <motion.div
          className="absolute top-0 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="flex-1 relative"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/0 pointer-events-none h-12" />
        <ChatMessages />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-background/0 pointer-events-none h-12" />
      </motion.div>
      <ChatInput />
    </motion.div>
  )
} 