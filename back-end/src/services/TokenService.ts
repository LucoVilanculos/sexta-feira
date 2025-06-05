import jwt from "jsonwebtoken"
import { User } from "@/models/UserModel"

export class TokenService {
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