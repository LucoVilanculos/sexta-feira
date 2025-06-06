import { Router } from "express"
import { ProjectController } from "../controllers/ProjectController"
import { authenticateToken } from "../middleware/auth"
import { projectSchema } from "../schemas/validation"
import { validateRequest } from "../schemas/validation"

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticateToken)

// Rotas
router.get("/", ProjectController.getProjects)
router.get("/:id", ProjectController.getProject)
router.post("/", validateRequest(projectSchema), ProjectController.createProject)
router.put("/:id", validateRequest(projectSchema.partial()), ProjectController.updateProject)
router.delete("/:id", ProjectController.deleteProject)

export default router
