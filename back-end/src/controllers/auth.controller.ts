import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../server/auth.service'

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body
      const result = await AuthService.register({ email, password, name })
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const result = await AuthService.login({ email, password })
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static async me(req: Request, res: Response) {
    res.status(200).json({ user: req.user })
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.logout(req.user!.id)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
} 