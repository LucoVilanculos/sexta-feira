import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import { AppError } from '../utils/AppError'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        [key: string]: any
      }
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new AppError('Token não fornecido', 401)
    }

    const [, token] = authHeader.split(' ')

    if (!token) {
      throw new AppError('Token mal formatado', 401)
    }

    try {
      const decoded = await AuthService.verifyToken(token)
      req.user = { id: decoded.userId }
      return next()
    } catch (error) {
      throw new AppError('Token inválido', 401)
    }
  } catch (error) {
    next(error)
  }
} 