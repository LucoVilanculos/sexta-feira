import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import rateLimit from "express-rate-limit"
import { errorHandler } from "../middleware/errorHandler"
import { notFoundHandler } from "../middleware/notFoundHandler"
import { authRouter } from "../routes/auth.routes"
import { taskRouter } from "../routes/task.routes"
import { eventRouter } from "../routes/event.routes"

export function createApp() {
  const app = express()

  // Security middleware
  app.use(helmet())
  app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
  }))
  
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  })
  app.use(limiter)

  // Body parsing middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(compression())

  // API Routes
  app.use("/api/auth", authRouter)
  app.use("/api/tasks", taskRouter)
  app.use("/api/events", eventRouter)

  // Error handling
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
} 