import { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { AppError } from "@/utils/AppError"

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  console.error(err)

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      errors: err.errors
    })
  }

  // Handle custom application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      code: err.code
    })
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Invalid token"
    })
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "error",
      message: "Token expired"
    })
  }

  // Handle unknown errors
  return res.status(500).json({
    status: "error",
    message: "Internal server error"
  })
} 