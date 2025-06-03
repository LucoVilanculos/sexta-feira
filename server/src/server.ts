import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import compression from "compression"
import dotenv from "dotenv"

// Importar routers
import authRouter from "./routers/authRouter"
import taskRouter from "./routers/taskRouter"
import projectRouter from "./routers/projectRouter"
import chatRouter from "./routers/chatRouter"
import calendarRouter from "./routers/calendarRouter"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares de segurança
app.use(helmet())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: "Muitas tentativas, tente novamente em 15 minutos",
})
app.use("/api/", limiter)

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Body parser
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Rotas
app.use("/api/auth", authRouter)
app.use("/api/tasks", taskRouter)
app.use("/api/projects", projectRouter)
app.use("/api/chat", chatRouter)
app.use("/api/calendar", calendarRouter)

// Middleware de tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Algo deu errado!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  })
})

// Rota de health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Rota não encontrada" })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📱 Frontend: ${process.env.FRONTEND_URL || "http://localhost:3000"}`)
  console.log(`🔧 Ambiente: ${process.env.NODE_ENV || "development"}`)
})

export default app
