import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
  }
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    res.status(401).json({ message: "Token de acesso requerido" })
    return
  }

  jwt.verify(token, process.env.JWT_SECRET || "sexta-feira-secret", (err: any, user: any) => {
    if (err) {
      res.status(403).json({ message: "Token inválido" })
      return
    }
    req.user = user
    next()
  })
}
