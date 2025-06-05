import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { AppError } from "@/utils/AppError"
import { LoginInput, RegisterInput } from "@/schemas/auth.schema"
import { UserModel } from "@/models/UserModel"
import { TokenService } from "./TokenService"

export class AuthService {
  private tokenService: TokenService

  constructor() {
    this.tokenService = new TokenService()
  }

  async register(data: RegisterInput) {
    const existingUser = await UserModel.findByEmail(data.email)
    if (existingUser) {
      throw new AppError("Email already registered", 400)
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)
    const user = await UserModel.create({
      ...data,
      password: hashedPassword
    })

    return user
  }

  async login(data: LoginInput) {
    const user = await UserModel.findByEmail(data.email)
    if (!user) {
      throw new AppError("Invalid credentials", 401)
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password)
    if (!isValidPassword) {
      throw new AppError("Invalid credentials", 401)
    }

    const { accessToken, refreshToken } = await this.tokenService.generateTokens(user)

    return {
      user,
      accessToken,
      refreshToken
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload
      const user = await UserModel.findById(decoded.userId)

      if (!user) {
        throw new AppError("User not found", 404)
      }

      const accessToken = this.tokenService.generateAccessToken(user)

      return {
        user,
        accessToken
      }
    } catch (error) {
      throw new AppError("Invalid refresh token", 401)
    }
  }
} 