import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/authMiddleware'
import { validateRequest } from '../middleware/validateRequest'
import { loginSchema, registerSchema } from '../schemas/auth.schema'

export const authRouter = Router()

authRouter.post('/register', validateRequest(registerSchema), AuthController.register)
authRouter.post('/login', validateRequest(loginSchema), AuthController.login)
authRouter.get('/me', authMiddleware, AuthController.me)
authRouter.post('/logout', authMiddleware, AuthController.logout) 