import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import { UserModel, type CreateUserData, type LoginData } from "../models/User"

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
      }

      const { name, email, password }: CreateUserData = req.body

      // Verificar se usuário já existe
      const existingUser = await UserModel.findByEmail(email)
      if (existingUser) {
        res.status(400).json({ message: "Usuário já existe" })
        return
      }

      // Hash da senha
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Criar usuário
      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
      })

      // Gerar token JWT
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "sexta-feira-secret", {
        expiresIn: "7d",
      })

      res.status(201).json({
        message: "Usuário criado com sucesso",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          preferences: user.preferences,
        },
      })
    } catch (error) {
      console.error("Erro no registro:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
      }

      const { email, password }: LoginData = req.body

      // Encontrar usuário
      const user = await UserModel.findByEmail(email)
      if (!user) {
        res.status(401).json({ message: "Credenciais inválidas" })
        return
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        res.status(401).json({ message: "Credenciais inválidas" })
        return
      }

      // Gerar token JWT
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "sexta-feira-secret", {
        expiresIn: "7d",
      })

      res.json({
        message: "Login realizado com sucesso",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          preferences: user.preferences,
        },
      })
    } catch (error) {
      console.error("Erro no login:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    res.json({ message: "Logout realizado com sucesso" })
  }

  static async verify(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const user = await UserModel.findById(userId)
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" })
        return
      }

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          preferences: user.preferences,
        },
      })
    } catch (error) {
      console.error("Erro na verificação:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId
      const { name, preferences } = req.body

      if (!userId) {
        res.status(401).json({ message: "Token inválido" })
        return
      }

      const updatedUser = await UserModel.update(userId, { name, preferences })
      if (!updatedUser) {
        res.status(404).json({ message: "Usuário não encontrado" })
        return
      }

      res.json({
        message: "Perfil atualizado com sucesso",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          preferences: updatedUser.preferences,
        },
      })
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }
}
