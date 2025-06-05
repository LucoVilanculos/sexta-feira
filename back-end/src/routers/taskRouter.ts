import { Router } from "express"
import { body } from "express-validator"
import { TaskController } from "../controllers/TaskController"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Validações
const validateTask = [
  body("title").trim().isLength({ min: 1 }).withMessage("Título é obrigatório"),
  body("priority").isIn(["baixa", "média", "alta"]).withMessage("Prioridade inválida"),
]

const validateTaskUpdate = [
  body("title").optional().trim().isLength({ min: 1 }).withMessage("Título é obrigatório"),
  body("priority").optional().isIn(["baixa", "média", "alta"]).withMessage("Prioridade inválida"),
  body("status").optional().isIn(["pending", "in_progress", "completed", "cancelled"]).withMessage("Status inválido"),
]

// Todas as rotas requerem autenticação
router.use(authenticateToken)

// Rotas
router.get("/", TaskController.getTasks)
router.get("/stats", TaskController.getTaskStats)
router.get("/:id", TaskController.getTask)
router.post("/", validateTask, TaskController.createTask)
router.put("/:id", validateTaskUpdate, TaskController.updateTask)
router.delete("/:id", TaskController.deleteTask)
router.patch("/:id/complete", TaskController.completeTask)

export default router
