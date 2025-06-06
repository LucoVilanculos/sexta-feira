import { Request } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../config/database'
import { AppError } from '../utils/AppError'
import { LoginInput, RegisterInput } from '../schemas/auth.schema'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'default_secret'
  private static JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
  private static RESET_TOKEN_EXPIRES = 3600000 // 1 hour in milliseconds

  static async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      throw new AppError('Email já está em uso', 400)
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    const token = AuthService.generateToken(user.id)

    return { user, token }
  }

  static async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (!user) {
      throw new AppError('Email ou senha inválidos', 401)
    }

    const validPassword = await bcrypt.compare(data.password, user.password)

    if (!validPassword) {
      throw new AppError('Email ou senha inválidos', 401)
    }

    const token = AuthService.generateToken(user.id)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    }
  }

  static generateToken(userId: string): string {
    if (!AuthService.JWT_SECRET) {
      throw new AppError('JWT_SECRET não está configurado', 500)
    }

    return jwt.sign({ userId }, AuthService.JWT_SECRET as jwt.Secret, { expiresIn: AuthService.JWT_EXPIRES_IN }) as string
  }

  static async verifyToken(token: string) {
    try {
      if (!AuthService.JWT_SECRET) {
        throw new AppError('JWT_SECRET não está configurado', 500)
      }

      const decoded = jwt.verify(token, AuthService.JWT_SECRET as jwt.Secret) as { userId: string }
      return decoded
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Token inválido', 401)
      }
      throw new AppError('Erro ao validar token', 401)
    }
  }

  static async validateToken(token: string) {
    return this.verifyToken(token)
  }

  static async getUserFromRequest(req: Request) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new AppError('Token não fornecido', 401)
    }

    const [, token] = authHeader.split(' ')

    try {
      const decoded = await AuthService.validateToken(token)
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true
        }
      })

      if (!user) {
        throw new AppError('Usuário não encontrado', 404)
      }

      return user
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Erro ao validar token', 401)
    }
  }

  static async logout(userId: string) {
    // No futuro, podemos adicionar uma lista negra de tokens ou
    // implementar refresh tokens para maior segurança
    return {
      message: 'Logout com sucesso! te vejo em breve'
    }
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new AppError('Usuário não encontrado', 404)
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + this.RESET_TOKEN_EXPIRES)
    
    // Hash the reset token before storing
    const hashedResetToken = await bcrypt.hash(resetToken, 10)

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedResetToken,
        resetTokenExpiry
      }
    })

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    
    await transporter.sendMail({
      to: user.email,
      subject: 'Redefinição de Senha',
      html: `
        <p>Você solicitou a redefinição de sua senha.</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetUrl}">Redefinir Senha</a>
        <p>Este link é válido por 1 hora.</p>
        <p>Se você não solicitou esta redefinição, ignore este email.</p>
      `
    })

    return {
      message: 'Email de redefinição de senha enviado com sucesso'
    }
  }

  static async resetPassword(resetToken: string, newPassword: string) {
    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: { not: null },
        resetTokenExpiry: { gt: new Date() }
      }
    })

    if (!user) {
      throw new AppError('Token inválido ou expirado', 400)
    }

    // Verify reset token
    const isValidToken = await bcrypt.compare(resetToken, user.resetToken!)
    if (!isValidToken) {
      throw new AppError('Token inválido', 400)
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return {
      message: 'Senha alterada com sucesso'
    }
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new AppError('Usuário não encontrado', 404)
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      throw new AppError('Senha atual incorreta', 401)
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword
      }
    })

    return {
      message: 'Senha alterada com sucesso'
    }
  }
} 