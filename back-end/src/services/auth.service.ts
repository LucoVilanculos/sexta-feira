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
      throw new AppError('Token inválido', 401)
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
      throw new AppError('Email já existe', 400)
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
      message: 'Registado com sucesso! Por favor faça o login para continuar.'
    }
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new AppError('Credênciais inválidas', 401)
    }

    const isValidPassword = await compare(password, user.password)

    if (!isValidPassword) {
      throw new AppError('Credênciais inválidas', 401)
    }

    const token = await this.createToken(user.id)

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
      message: 'Login com sucesso! Bem vindo de volta.'
    }
  }

  static async logout(userId: string) {
    // No futuro, podemos adicionar uma lista negra de tokens ou
    // implementar refresh tokens para maior segurança
    return {
      message: 'Logout com sucesso! te vejo em breve'
    }
  }
} 