import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { AppError } from '../utils/AppError'

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError(error.errors[0].message, 400))
      } else {
        next(error)
      }
    }
  }
} 