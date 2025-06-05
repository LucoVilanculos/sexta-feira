import { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { AppError } from "@/utils/AppError"
import { Prisma } from '@prisma/client'

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  console.error(error)

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      errors: error.errors
    })
  }

  // Handle custom application errors
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
      code: error.code
    })
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Invalid token"
    })
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "error",
      message: "Token expired"
    })
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        status: 'error',
        message: 'Registro já existe'
      })
    }
  }

  // Handle unknown errors
  return res.status(500).json({
    status: "error",
    message: "Internal server error"
  })
} 