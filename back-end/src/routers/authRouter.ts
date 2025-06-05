import { Router } from "express"
import { body } from "express-validator"
import { AuthController } from "../controllers/AuthController"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Validações
const validateRegister = [
  body("name").trim().isLength({ min: 2 }).withMessage("Nome deve ter pelo menos 2 caracteres"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password").isLength({ min: 6 }).withMessage("Senha deve ter pelo menos 6 caracteres"),
]

const validateLogin = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Senha é obrigatória"),
]

// Rotas públicas
router.post("/register", validateRegister, AuthController.register)
router.post("/login", validateLogin, AuthController.login)
router.post("/logout", AuthController.logout)

// Rotas protegidas
router.get("/verify", authenticateToken, AuthController.verify)
router.put("/profile", authenticateToken, AuthController.updateProfile)

export default router
