import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import { AppError } from '../utils/AppError'
import prisma from '../config/database'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        name: string
      }
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new AppError('No token provided', 401)
    }

    const [, token] = authHeader.split(' ')

    if (!token) {
      throw new AppError('Invalid token format', 401)
    }

    const decoded = await AuthService.verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
      }
    })

    if (!user) {
      throw new AppError('User not found', 401)
    }

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
} 