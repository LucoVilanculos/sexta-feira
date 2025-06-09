import { LoginInput, RegisterInput } from './../schemas/auth.schema';
import { AuthService } from './../server/AuthService';
import { AppError } from './../utils/AppError';
import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  register = async (req: Request<{}, {}, RegisterInput>, res: Response) => {
    try {
      const user = await this.authService.register(req.body)
      res.status(201).json({
        status: "success",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        }
      })
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Failed to register user", 500)
    }
  }

  login = async (req: Request<{}, {}, LoginInput>, res: Response) => {
    try {
      const { accessToken, refreshToken, user } = await this.authService.login(req.body)
      
      // Set refresh token in HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      res.json({
        status: "success",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          },
          accessToken
        }
      })
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Failed to login", 500)
    }
  }

  refreshToken = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken

      if (!refreshToken) {
        throw new AppError("Refresh token not found", 401)
      }

      const { accessToken, user } = await this.authService.refreshToken(refreshToken)

      res.json({
        status: "success",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          },
          accessToken
        }
      })
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Failed to refresh token", 500)
    }
  }

  logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshToken")
      res.json({
        status: "success",
        message: "Successfully logged out"
      })
    } catch (error) {
      throw new AppError("Failed to logout", 500)
    }
  }
}