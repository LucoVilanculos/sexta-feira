import { Request, Response, NextFunction } from "express"
import { TokenService } from "@/services/TokenService"
import { AppError } from "@/utils/AppError"

const tokenService = new TokenService()

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    throw new AppError("No token provided", 401)
  }

  const payload = tokenService.verifyAccessToken(token)
  if (!payload) {
    throw new AppError("Invalid or expired token", 401)
  }

  // Adiciona informações do usuário à requisição
  ;(req as any).user = {
    userId: payload.userId,
    email: payload.email
  }

  next()
}