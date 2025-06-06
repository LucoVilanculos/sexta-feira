import { Router } from "express"
import { TaskController } from "../controllers/TaskController"
import { authenticateToken } from "../middleware/auth"
import { taskSchema } from "../schemas/validation"
import { validateRequest } from "../schemas/validation"

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticateToken)

// Rotas
router.get("/", TaskController.getTasks)
router.get("/stats", TaskController.getTaskStats)
router.get("/:id", TaskController.getTask)
router.post("/", validateRequest(taskSchema), TaskController.createTask)
router.put("/:id", validateRequest(taskSchema.partial()), TaskController.updateTask)
router.delete("/:id", TaskController.deleteTask)
router.patch("/:id/complete", TaskController.completeTask)

export default router
