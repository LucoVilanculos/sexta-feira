import jwt from "jsonwebtoken"
import { User } from "@/models/UserModel"
import { AppError } from '@/utils/AppError'

export class TokenService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'default_secret'
  private static JWT_EXPIRES_IN = '7d'

  static generateToken(payload: object): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    })
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET)
    } catch (error) {
      throw new AppError('Token inválido ou expirado', 401)
    }
  }

  static extractTokenFromHeader(header: string | undefined): string {
    if (!header) {
      throw new AppError('Token não fornecido', 401)
    }

    const [type, token] = header.split(' ')

    if (type !== 'Bearer') {
      throw new AppError('Formato de token inválido', 401)
    }

    if (!token) {
      throw new AppError('Token não fornecido', 401)
    }

    return token
  }

  generateAccessToken(user: User) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "15m" }
    )
  }

  generateRefreshToken(user: User) {
    return jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    )
  }

  async generateTokens(user: User) {
    const accessToken = this.generateAccessToken(user)
    const refreshToken = this.generateRefreshToken(user)

    return {
      accessToken,
      refreshToken
    }
  }

  verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as jwt.JwtPayload
    } catch (error) {
      return null
    }
  }

  verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload
    } catch (error) {
      return null
    }
  }
} 