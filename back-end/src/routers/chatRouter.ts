import { Router } from "express"
import { ChatController } from "../controllers/ChatController"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticateToken)

// Rotas
router.post("/", ChatController.sendMessage)
router.get("/history", ChatController.getHistory)
router.delete("/history", ChatController.clearHistory)
router.post("/action", ChatController.executeAction)

export default router
