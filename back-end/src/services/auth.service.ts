import { compare, hash } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import prisma from '../config/database'
import { AppError } from '../utils/AppError'

export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'default_secret'
  private static JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

  static async createToken(userId: string): Promise<string> {
    // @ts-ignore
    return sign(
      { userId },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    )
  }

  static async verifyToken(token: string) {
    try {
      // @ts-ignore
      const decoded = verify(token, this.JWT_SECRET) as { userId: string }
      return decoded
    } catch (error) {
      throw new AppError('Invalid token', 401)
    }
  }

  static async register(data: { 
    email: string
    password: string
    name: string 
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      throw new AppError('Email already registered', 400)
    }

    const hashedPassword = await hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    })

    const token = await this.createToken(user.id)

    return {
      user,
      message: 'Registration successful! Please login to continue.'
    }
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new AppError('Invalid credentials', 401)
    }

    const isValidPassword = await compare(password, user.password)

    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401)
    }

    const token = await this.createToken(user.id)

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
      message: 'Login successful! Welcome back.'
    }
  }

  static async logout(userId: string) {
    // No futuro, podemos adicionar uma lista negra de tokens ou
    // implementar refresh tokens para maior segurança
    return {
      message: 'Logout successful. See you soon!'
    }
  }
} 