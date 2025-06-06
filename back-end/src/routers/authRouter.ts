import { Router } from "express"
import { AuthController } from "../controllers/AuthController"
import { authSchema } from "../schemas/validation"
import { validateRequest } from "../schemas/validation"

const router = Router()

// Rotas
router.post("/register", validateRequest(authSchema), AuthController.register)
router.post("/login", validateRequest(authSchema), AuthController.login)
router.post("/refresh-token", AuthController.refreshToken)
router.post("/logout", AuthController.logout)

export default router
