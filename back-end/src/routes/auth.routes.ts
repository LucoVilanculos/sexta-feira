import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/authMiddleware'
import { validateRequest } from '../middleware/validateRequest'
import { loginSchema, registerSchema } from '../schemas/auth.schema'
import { AuthService } from '../server/auth.service'

export const authRouter = Router()

authRouter.post('/register', validateRequest(registerSchema), AuthController.register)
authRouter.post('/login', validateRequest(loginSchema), AuthController.login)
authRouter.get('/me', authMiddleware, AuthController.me)
authRouter.post('/logout', authMiddleware, AuthController.logout)

// Forgot password route
authRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  const result = await AuthService.forgotPassword(email)
  return res.json(result)
})

// Reset password route
authRouter.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params
  const { newPassword } = req.body
  const result = await AuthService.resetPassword(token, newPassword)
  return res.json(result)
})

// Change password route (requires authentication)
authRouter.post('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const result = await AuthService.changePassword(req.user.id, currentPassword, newPassword)
  return res.json(result)
}) 