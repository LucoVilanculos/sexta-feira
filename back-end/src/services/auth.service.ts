import { compare, hash } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import prisma from '../config/database'
import { AppError } from '../utils/AppError'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'default_secret'
  private static JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
  private static RESET_TOKEN_EXPIRES = 3600000 // 1 hour in milliseconds

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
    const hashedResetToken = await hash(resetToken, 10)

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
    const isValidToken = await compare(resetToken, user.resetToken!)
    if (!isValidToken) {
      throw new AppError('Token inválido', 400)
    }

    // Hash new password and update user
    const hashedPassword = await hash(newPassword, 10)
    
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
    const isValidPassword = await compare(currentPassword, user.password)
    if (!isValidPassword) {
      throw new AppError('Senha atual incorreta', 401)
    }

    // Hash and update new password
    const hashedPassword = await hash(newPassword, 10)
    
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