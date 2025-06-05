import { Express } from "express"
import authRouter from "../routers/authRouter"
import taskRouter from "../routers/taskRouter"
import projectRouter from "../routers/projectRouter"
import chatRouter from "../routers/chatRouter"
import calendarRouter from "../routers/calendarRouter"
import settingsRouter from "../routers/settingsRouter"

export function setupRoutes(app: Express) {
  // API Routes
  app.use("/api/auth", authRouter)
  app.use("/api/tasks", taskRouter)
  app.use("/api/projects", projectRouter)
  app.use("/api/chat", chatRouter)
  app.use("/api/calendar", calendarRouter)
  app.use("/api/settings", settingsRouter)
} 