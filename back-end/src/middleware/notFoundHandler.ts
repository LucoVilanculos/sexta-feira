import { Request, Response, NextFunction } from "express"

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    status: "error",
    message: `Não foi possível ${req.method} ${req.url}`
  })
} 