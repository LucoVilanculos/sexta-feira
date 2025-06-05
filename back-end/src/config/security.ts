import { Express } from "express"
import rateLimit from "express-rate-limit"

export function setupSecurity(app: Express) {
  // Rate limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP
    message: "Muitas tentativas, tente novamente em 15 minutos",
  })

  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // máximo 5 tentativas por IP
    message: "Muitas tentativas de login, tente novamente em 1 hora",
  })

  // Aplicar rate limiting
  app.use("/api/", apiLimiter)
  app.use("/api/auth/login", authLimiter)
  app.use("/api/auth/register", authLimiter)
} 